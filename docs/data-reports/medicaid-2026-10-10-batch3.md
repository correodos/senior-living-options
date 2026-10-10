# Medicaid data report, batch 3 (2026-10-10)

Remaining states after batch 2. Totals after this batch: 43 verified facts, 32 `review` items, 22
states showing at least one verified fact (28 show none).

## Added (verified, read from the official document)

| State | Fields                                                                                                                  |
| ----- | ----------------------------------------------------------------------------------------------------------------------- |
| AL    | income cap $2,982 (Medicaid Income Limits 2026); asset limit $2,000 (nursing home page)                                 |
| ID    | asset limit $2,000 (income-limits page, effective 2026-01)                                                              |
| IN    | asset limit $2,000; community spouse minimum $32,532 and home equity $752,000 (both 2026-01-01), Policy Manual ch. 3000 |
| IA    | asset limit $2,000; community spouse minimum $32,532 (nursing facilities page)                                          |
| MD    | community spouse minimum $32,532 (Schedule MA-8, 2026-01-01)                                                            |
| MN    | asset limit $3,000 (Eligibility Policy Manual 2.1.3.1)                                                                  |
| MO    | asset limit $6,220.50 (MO HealthNet non-MAGI chart 07/2026, vendor care in a nursing facility)                          |
| ND    | community spouse minimum $32,532 (2026-01-01); asset limit $3,000 (manual 510-05-65-15)                                 |
| NV    | asset limit $2,000 (E-400 Types of Resources)                                                                           |
| OK    | income cap $2,982, asset limit $2,000, home equity $752,000 (Appendix C-1)                                              |
| SD    | income cap $2,982 (2026) and asset limit $2,000 (DSS Medicaid coverage groups)                                          |
| TN    | income cap $2,982 (2026-01-01); asset limit $2,000 (Institutional Medicaid manual)                                      |
| WI    | asset limit $2,000 (brochure P-10063, 07/2026)                                                                          |

## Kept as `review` (not shown), with the manual step

- Seen only in search excerpts because the site blocks automated access: AR, AZ, CO, LA, MS (income
  and assets), NE, NH, NM, SC, UT, RI, CT, OR, WV. Save the official PDF or page and tell me, and I
  will verify them.
- ID income cap: the page lists $3,002, $20 above the federal cap of $2,982 (probably a $20
  disregard). Confirm with the agency.
- MD asset limit: $2,500 (medically needy) or $2,000 (categorically needy); the document does not
  say which applies.
- OH, WA, PA, MA asset limits: see batch 2 report.

## No data found for these 28 states

AK, AR, AZ, CA, CO, CT, DE, FL, HI, IL, KS, KY, LA, MA, ME, MI, MS, MT, NE, NH, NM, OR, RI, SC, UT,
VA, VT, WV.

Notes: DE reports 250% of SSI ($2,485) and a pending change to 300%; HI and AK published no nursing
home table in the results; KS, KY, ME, MT and VT only showed outdated or undated documents.

## Not covered

Home equity, community spouse minimum and income cap for states where the official document was
unreadable. The average private-pay rate stays unverified in TX and WY.

## Update after the user saved the pages (docs/medicaid-sources/)

Verified from the saved files: AR (income $2,982, assets $2,000), CO (income $2,982 and home equity
$1,130,000, 2026-01-01), CT (assets $1,600, home equity $1,130,000), MA (assets $2,000, home equity
$1,130,000, spouse minimum $32,532), NH (income cap $2,982, spouse minimum $32,532, home equity
$752,000, 2026-01-01), RI (assets $4,000, regulation 210-RICR-50-00-6), WV (assets $2,000).

Reader notes ("Keep in mind" box on the state page, new `readerNotes` field in the schema) for the
three figures that could not be confirmed: ID income $3,002, MD asset limit $2,500 vs $2,000, PA two
asset limits depending on income.

Still pending: AZ, LA, MS, NE, NM, SC, UT, OR (files not saved yet), and the other states with no
data.

## Closing round: archived copies of blocked official documents

The agency sites that answer 403 were read through web.archive.org copies of the same official files
(the stored `source` is the official URL; each entry has a note). Verified this way: AK (income
$2,982), AZ (assets $2,000), LA (income $2,982, assets $2,000), MS (income $2,982, assets $4,000,
home equity $752,000), NE (assets $4,000), NM (income $2,982, assets $2,000), SC (income $2,982,
assets $2,000, chart effective 2026-03-01), UT (assets $2,000).

Totals: 70 verified facts. Still without any verified fact: CA, DE, FL, HI, IL, KS, KY, ME, MI, MT,
OR, VA, VT. Pending for the full review of all states.

## Final round on the review items

Verified: CA asset limit $130,000 (ACWDL 25-18, from an archived copy), OH asset limit $2,000 (OAC
5160:1-3-05.1), OR community spouse minimum $32,532 (transmittal OEP-PT-25-045), WA asset limit
$2,000 (WAC 182-513-1350).

Left for the annual review (8 items): NE spouse minimum (only the 2025 document is reachable), UT
home equity and spouse minimum (agency table blocked, not archived), TX and WY average private-pay
rate (no date or unit stated), and ID, MD, PA (figures that conflict; shown to readers as notes).
