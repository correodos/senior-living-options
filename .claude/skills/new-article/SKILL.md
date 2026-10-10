---
name: new-article
description:
  Draft a new article from a title the owner gives, in drafts/, and publish it to
  src/content/entries/ only after the owner's explicit approval. Closed system - run ONLY when the
  owner orders a new article and gives its title.
disable-model-invocation: true
argument-hint: '<article title> [notes: type, keywords, angle]'
---

# New article

Two phases: **draft** (when the owner gives a title) and **publish** (when the owner approves the
draft). Nothing happens in between unless the owner asks.

## Non-negotiable rules

1. **Closed system.** Write an article only when the owner orders it and gives the title. Never
   propose topics, never start the next article on your own, never write two at once.
2. **Never publish without an explicit approval** ("visto bueno", "publícalo", "apruebo"). Feedback
   on a draft means: change the draft and show it again.
3. **Only sources from `sources.md`.** Open every URL before citing it. Never invent a figure; use
   `[VERIFICAR: …]`.
4. **Figures must match the rest of the site** (other articles, `src/data/*.json`) or be flagged.
5. **No inline citations or external links in the published body.** Sources go only in `## Sources`.
   Internal links stay.
6. **Never commit or push.** The owner decides what goes to GitHub (AGENTS.md).
7. Talk to the owner in Spanish. The article is US English.

## Files

| File                          | What                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `prompt.md` (this folder)     | Editorial prompt: structure, tone, length, frontmatter. **Read it every time**    |
| `sources.md` (this folder)    | Authorized source domains, by tier                                                |
| `image-log.md` (this folder)  | Every site image, to avoid repeats                                                |
| `drafts/<category>/<slug>.md` | Draft (not part of the site; git-ignored)                                         |
| `drafts/images/`              | Image inbox: the owner drops `<slug>.png/.jpg/.webp`; image prompts live here too |
| `scripts/validate-draft.ts`   | `npm run validate:draft -- <slug> [--publish]`                                    |
| `scripts/optimize-image.ts`   | `npm run image:optimize -- <slug>` → 3 WebP files in `public/images/`             |
| `docs/NUEVO_ARTICULO.md`      | Full format reference for articles                                                |

## Phase 1 — Draft

Trigger: the owner gives a title ("el próximo artículo es: …", `/new-article <title>`).

1. **Plan.** From the title (and any notes) decide: category, type (informational / comparison /
   costs), English slug (lowercase, hyphens, main keyword), main keyword, 3-5 secondary keywords. If
   one of them is genuinely ambiguous, ask ONE question; otherwise go on and state your choices in
   the summary.
2. **Check duplicates.** Look at `src/content/entries/**` and `drafts/**` for an article on the same
   topic or slug. If one exists, tell the owner and stop. (Cancelled slugs in memory are only a
   heads-up: the owner's order wins.)
3. **Research.** Read `prompt.md` and `sources.md`. Use WebSearch (with `allowed_domains` from
   `sources.md`) and WebFetch. Key figures only from Tier 1-2. Write down, per fact: value, year,
   exact URL, and whether you read it on the page.
4. **Cross-check with the site.** For every key figure or factual claim (costs, limits, coverage
   rules, survey year, phone numbers, definitions), search the same fact in
   `src/content/entries/**`, `src/data/costs-by-state.json` and `src/data/medicaid-by-state.json`.
   - Same → OK.
   - Different → do not pick silently. Mark `[VERIFICAR: difiere de <file>]` and put it in the
     consistency table. If the site value is the outdated one, propose fixing that article (only
     with the owner's permission, never as part of this task).
5. **Write** `drafts/<category>/<slug>.md` following `prompt.md` exactly. In the draft, every figure
   carries `(Source: Org)` and, where useful, a link to the exact page, for review.
   `publishDate`/`lastReviewed` = today. Internal links only to pages that exist.
6. **Image prompt.** Look at `image-log.md` (and open any image in `public/images/` you are unsure
   about). Write `drafts/images/<slug>.prompt.md` with:
   - A prompt in English for an AI image generator, chosen for this article's topic and reader:
     realistic warm photo (unless an illustration fits better), 16:9, 1200×675 or larger, no text,
     no logos, no recognizable brands, left third calm and uncluttered, dignified and natural older
     adults. Faces and the main action must sit in the upper-middle band: the article header shows
     the image at about 3:1 (max 400 px high, anchored 25% from the top), so anything near the top
     or bottom edge is cut off.
   - A negative prompt (text, watermark, distorted hands, extra fingers, clinical coldness…).
   - Why it is different from the existing images: it must change at least three of setting, people,
     action, framing, light/palette, style, and avoid the overused motifs in the log.
   - The suggested `imageAlt`.
7. **Validate:** `npm run validate:draft -- <slug>`. Fix every error. Warnings about the missing
   image and pending markers are expected at this point.
8. **Independent review (mandatory, before telling the owner the draft exists).** Re-read the whole
   draft from the top as if you were a different person seeing it for the first time: a skeptical
   editor and fact-checker, not its author. Do not skim what you remember writing. Go through:
   - **Errors.** Every sentence that states a fact must match what its source actually says. Look
     for: claims that go beyond the source, your own inferences presented as facts ("the typical
     resident is…"), details no source gives, data whose scope is wider or narrower than the text
     implies (e.g. a survey that covers "assisted living and similar communities"), wrong years,
     numbers that do not add up, figures that differ from the rest of the site.
   - **More recent data.** For every dated figure or source (a survey year, a report edition, a
     regulation), search for a newer edition or a more recent official source in `sources.md`. If
     one exists and you can read it, update the figure, the year and the source. If the dated one is
     still the latest, keep it and say so in the text when it is old (e.g. "the most recent figures
     published").
   - **Improvements.** Overlap with the pillar guide or other articles (especially identical FAQ
     questions), keyword placement, a clearer intro, sections that read as filler, sentences that
     are hard for an older reader, missing internal links, tables that would help, `prompt.md` rules
     (banned words, length, paragraph length, year next to each figure).
   - **Image prompt.** Still matches the final article and the framing rule above.

   Fix everything you find in the draft, re-open any source you relied on for a changed fact, and
   run `npm run validate:draft -- <slug>` again. Repeat the review once more if you changed facts.
   Only things you cannot resolve on your own stay as `[VERIFICAR: …]` markers.

9. **Summary to the owner (Spanish)**, then stop and wait:
   - Path of the draft, category, type, slug, keywords, word count.
   - Sources used (tier of each).
   - **Consistency table**: dato · este borrador · otro artículo/dato del sitio · coincide.
   - **Revisión independiente**: what you corrected, what you updated with more recent data (old →
     new, source) and what you improved; also dated figures you kept because nothing newer exists.
   - Pending markers, one per line, with what is needed.
   - The image prompt and: "deja la imagen en `drafts/images/<slug>.png` (o .jpg/.webp)".
   - **Final status**, one line: "Listo para tu revisión" if nothing is pending, or "Queda
     pendiente: …" listing exactly what is missing and who has to do it.

## Phase 1b — Changes

When the owner asks for changes, edit the draft, re-run the validator, do the independent review
(Phase 1, step 8) on the parts you changed, and summarize what changed with the same final status
line.

## Phase 2 — Publish

Trigger: explicit approval of a specific draft.

1. **Markers:** none may remain. If any do, list them and stop.
2. **Re-check sources:** open every URL in `sources` again. If one fails or no longer supports the
   fact, stop and report.
3. **Clean the body** (everything before `## Sources`): remove every `(Source: …)` and turn every
   external link `[text](https://…)` into plain `text`. Fix the sentence if the removal leaves it
   awkward. Keep internal links. `## Sources` and frontmatter `sources` must list the same URLs.
4. **Image:**
   - If no file `drafts/images/<slug>.(png|jpg|jpeg|webp)` exists, ask for it and stop.
   - Open it and compare with the images in `image-log.md`. If it is equal or very close to one,
     tell the owner and wait.
   - Run `npm run image:optimize -- <slug>`. Check the three files exist and the large one is about
     100 KB or less.
5. **Dates:** `publishDate` and `lastReviewed` = today. Recompute `readingTime` (validator info
   line).
6. **Publish gate:** `npm run validate:draft -- <slug> --publish` must pass.
7. **Move** `drafts/<category>/<slug>.md` → `src/content/entries/<category>/<slug>.md`. A running
   `astro dev` may not notice a moved file: check the page in a preview of the build
   (`preview-build` in `.claude/launch.json`, port 4322) or restart the dev server.
8. **Pillar link:** add one natural link to the new article from its pillar guide (`pillarSlug` in
   `src/utils/category.ts`), in the most relevant section. Tell the owner the exact sentence added.
9. **Log the image:** add a row to `image-log.md` ("Published by the new-article system"), then
   delete `drafts/images/<slug>.*` (original and prompt).
10. **Check:** `npm run validate:content`, `npm run build`, then `npx prettier --check .`. Open
    `/article/<category>/<slug>/` in the preview: mobile and desktop, light and dark; table of
    contents, tables on mobile, FAQ, Sources, card in `/category/<category>/`.
11. **Report (Spanish):** URL, files created/changed, the pillar link, image sizes. Remind the owner
    that everything is local and uncommitted. Stop.

## Done when

- Draft phase: draft + image prompt exist, independent review done and its fixes applied, validator
  has no errors, summary given with the final status line.
- Publish phase: article in `src/content/entries/`, images in `public/images/`, build passes, page
  checked in the preview, owner informed. No commit.
