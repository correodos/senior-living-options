---
name: update-medicaid-data
description:
  Refresh or extend src/data/medicaid-by-state.json (per-state Medicaid long-term care facts shown
  on /costs/[state]/) using ONLY official sources, then validate, build and report. Use when the
  user asks to update, extend or re-verify the Medicaid data, or when the validator warns that data
  is stale.
---

# Update Medicaid data by state

You maintain `src/data/medicaid-by-state.json`. Its facts appear on every state cost page, in a
health and money context, so accuracy matters more than coverage. **An empty field is always better
than a guessed one.**

## Non-negotiable rules

1. **Official sources only**: state agency sites, state manuals and bulletins, CMS/medicaid.gov, the
   U.S. Code. Never use law-firm blogs, advocacy sites, calculators or aggregators as the source of
   a value. They are fine as hints for _where to look_, never as the citation.
2. **Read it, don't infer it.** A value is `status: "verified"` with `method: "read"` only if you
   read it in the official document or page. Anything from a search-result excerpt, an unreadable
   PDF, a blocked page or an assumed unit is `status: "review"` (it is never shown on the site) with
   a `note` explaining what is missing.
3. **Each value carries its provenance**: exact `source` URL, `effective` date from the document
   (`null` if the document gives none), `checkedOn` = today (YYYY-MM-DD).
4. **Never overwrite** a verified value with something less certain. If a re-check finds a different
   value, update it only from an official source and list the change in the report.
5. **Do not write article text** and do not edit articles. This task only touches data files and the
   report.
6. **Never commit or push.** The user decides what goes to GitHub (see AGENTS.md).
7. Communicate with the user in Spanish; the data and the site are US English.

## Files

- Data: `src/data/medicaid-by-state.json` (all 50 states; `_meta` at the top)
- Schema: `src/utils/medicaid-schema.ts` (ranges, provenance, official-domain rule)
- Validator: `npm run validate:medicaid` (also runs inside `npm run validate:content` and CI)
- Display: `src/utils/medicaid.ts` and the section in `src/pages/costs/[state].astro`
- Where to look per state, and known blockers: `sources.md` in this folder

## Fields

| Key                          | Meaning                                                           | Notes                                                                                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agency`                     | State Medicaid agency name and URL                                | Required for all 50 states. `verifiedBy`: `http` (page returned 200) or `search-index` (automated access is blocked, page appears in a search restricted to the official domain) |
| `incomeCapMonthly`           | Monthly gross income limit for nursing home Medicaid              | Only for states that use a cap. 2026 maximum is $2,982 (300% of the $994 SSI federal benefit rate). If a state has no cap, leave the field out and say so in the report          |
| `assetLimitSingle`           | Countable assets, single applicant                                | Do NOT assume $2,000. California ($130,000 through 2027-06-30) and New York differ                                                                                               |
| `homeEquityLimit`            | State home equity limit                                           | Federal 2026 range $752,000 to $1,130,000 (CMS)                                                                                                                                  |
| `communitySpouseResourceMin` | State minimum the at-home spouse may keep                         | Federal 2026 range $32,532 to $162,660; the state chooses the minimum                                                                                                            |
| `avgPrivatePayRate`          | Average private-pay nursing home rate used for transfer penalties | Needs a clear unit (`daily` or `monthly`)                                                                                                                                        |

Add new fields only after asking the user: update the schema, the validator and `medicaid.ts`
together.

## Procedure

1. Read the current data file and run `npm run validate:medicaid` to see what is stale or in review.
2. Ask the user which states and fields to cover if they did not say. Work in **batches of about 10
   states**.
3. Per state:
   - Federal anchors first (they change on a fixed schedule): the CMS informational bulletin "SSI
     and Spousal Impoverishment Standards" on medicaid.gov (January 1; the maintenance allowance
     minimum updates July 1).
   - Find the state's own document: use `WebSearch` restricted with `allowed_domains` to the
     agency's domain, then `WebFetch`. Look for the eligibility manual or handbook tables, annual
     standards charts, policy bulletins, and long-term care Medicaid pages.
   - If `WebFetch` returns a binary PDF it saves it to `tool-results/`; extract it with
     `pdftotext -layout <file> out.txt` and, if the columns are scrambled, `pdftotext -raw`. If the
     text is garbled (font encoding) or the table is rendered dynamically, or the site answers
     403/timeouts, do not guess: set `status: "review"` and note it.
4. Write or update the entries (provenance on every value). Keep keys and structure exactly as in
   the schema.
5. Run `npm run validate:medicaid`, `npx prettier --check .`, `npx astro check`, `npm run build`.
   Fix any problem.
6. Look at the result in the browser for at least one updated state (`/costs/<code>/`): the "Paying
   with Medicaid" section must show only verified facts, each with source and dates.
7. Write the report `docs/data-reports/medicaid-YYYY-MM-DD.md` (create the folder if needed) and
   give the user a short summary in Spanish:
   - Added, changed (old value, new value, source) and unchanged facts
   - Items set to `review` and exactly what a human must do (for example, "save the PDF from X into
     a folder and tell me")
   - Agency links that stopped working
   - States and fields still empty
8. Stop. Tell the user the changes are local and uncommitted.

## Done when

- Validator passes, build passes, no verified value lacks an official source URL and date.
- The report lists every `review` item with the manual step needed.
