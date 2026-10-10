# Where to find the data, and known blockers

Registry built during the pilot on 2026-10-10. Update it whenever you learn where a state publishes
its figures or how a source fails.

## Federal anchors (all states)

| What                                                                                                                       | Where                                                                                                                                                                                                                           | Update schedule                                                         |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| SSI federal benefit rate, 300% income cap, community spouse resource min/max, max maintenance allowance, home equity range | CMS CMCS Informational Bulletin "SSI and Spousal Impoverishment Standards": https://www.medicaid.gov/federal-policy-guidance/downloads/cib04272026.pdf (the file name changes by release date; find the latest on medicaid.gov) | Jan 1; minimum maintenance allowance and housing allowance update Jul 1 |
| Transfer-of-assets rules (60-month look-back, penalty formula, exceptions)                                                 | 42 U.S.C. 1396p, https://www.law.cornell.edu/uscode/text/42/1396p                                                                                                                                                               | Statute                                                                 |
| 2026 values                                                                                                                | SSI FBR $994; income cap $2,982; CSRA $32,532 to $162,660; max MMMNA $4,066.50; min MMMNA $2,705 from 2026-07-01 (Alaska $3,381.25, Hawaii $3,111.25); home equity $752,000 to $1,130,000                                       |                                                                         |

The federal values are ranges or ceilings. The state decides its own figure inside them.

## Pilot states

| State | What was found                                                                                                                                                                                                                                                                                                                                                                           | Reliability                                                                                                        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| TX    | HHSC Qualified Income Trust page https://fhb.hhs.texas.gov/node/23451: special income limit $2,982 (effective 2026-01-01), $2,000 countable resources, average private-pay nursing home $262.37/day (estimate, no date). Handbook bulletins (for example MEPD and TW Bulletin 26-04) cover other topics and are posted at hhs.texas.gov/laws-regulations/handbooks/mepd/policy-bulletins | Readable HTML and PDF. Data is spread over pages                                                                   |
| NY    | DOH GIS message (one per year, January): https://healthweb-back.health.ny.gov/health_care/medicaid/publications/docs/gis/26ma03.pdf gives state CSRA minimum $74,820, MMMNA $4,066.50 and home equity $1,130,000. The nursing home resource level ($33,038 per law-firm summaries) was NOT in the GIS text, so it stays unverified                                                       | PDF text is extractable. Predictable yearly document                                                               |
| WY    | Eligibility Online Manual Table 1A https://ecom.wyo.gov/tables/table1a (income standard $2,982, spousal maintenance $4,066.50, average private pay rate $10,114, unit not stated)                                                                                                                                                                                                        | Readable. Table 7 (resource standards, https://ecom.wyo.gov/tables/table7) loads dynamically and could not be read |
| FL    | DCF ESS manual Appendix A-9 PDF https://ffic.myflfamilies.com/manual/essfiles/30451.pdf ("MSSI 7-2026 Income and Asset Standards") exists but its text layer is garbled; needs OCR or a human                                                                                                                                                                                            | Official, unreadable by tools. Domain myflfamilies.com is on the allowlist in `medicaid-schema.ts`                 |
| CA    | DHCS publishes an asset limit of $130,000 (one person, +$65,000 per extra household member) through 2027-06-30, reinstated 2026-01-01, with a 30-month look-back phasing in from 2026-07-01 (ACWDL 25-18). DHCS answers HTTP 403 to automated requests, so this was seen only in search excerpts                                                                                         | Blocked. Kept as `review` until a human confirms                                                                   |

## Known blockers

- HTTP 403 to automated requests: dhcs.ca.gov, azahcccs.gov, health.alaska.gov, chfs.ky.gov,
  ldh.la.gov, michigan.gov, kancare.ks.gov, eohhs.ri.gov, hca.nm.gov, scdhhs.gov, dhhs.nh.gov, also
  acl.gov, ssa.gov and medicaid.gov itself. Use search restricted to the domain to confirm a URL
  exists, and ask the user to save PDFs if values are needed.
- Timeouts or resets from this network: medicaid.alabama.gov, medicaid.ms.gov, dhhs.ne.gov. Delaware
  answers 999.
- Some official PDFs have a broken text layer (Florida). Report them instead of guessing digits.
- A state can restructure its site: the validator does not check links, so re-test agency URLs each
  refresh.

## Agency links

Stored in the data file for all 50 states. 34 were confirmed with an HTTP 200 response and 16 by
appearing in a search restricted to their official domain (2026-10-10).
