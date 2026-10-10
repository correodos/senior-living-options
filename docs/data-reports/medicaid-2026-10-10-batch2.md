# Medicaid data report, batch 2 (2026-10-10)

States covered: PA, OH, IL, GA, NC, MI, NJ, VA, WA, MA.

## Added (verified, read from the official document)

| State | Field                    | Value                   | Source                                                 |
| ----- | ------------------------ | ----------------------- | ------------------------------------------------------ |
| PA    | Income cap               | $2,982                  | DHS "MA and payment of Long-Term Care" page            |
| PA    | Home equity limit        | $752,000                | same page                                              |
| OH    | Income cap (SIL)         | $2,982 (2026-01-01)     | MEPL 191                                               |
| OH    | Home equity limit        | $752,000 (2026-01-01)   | MEPL 191                                               |
| OH    | Community spouse minimum | $32,532 (2026-01-01)    | MEPL 191                                               |
| GA    | Income cap               | $2,982                  | Georgia Medicaid "2026 Income and Resource Limits" PDF |
| GA    | Asset limit, single      | $2,000                  | same PDF                                               |
| NJ    | Income cap               | $2,982 (2026-01-01)     | DMAHS 26-03 income standards                           |
| NJ    | Home equity limit        | $1,130,000 (2026-01-01) | DMAHS 26-03                                            |
| NJ    | Community spouse minimum | $32,532 (2026-01-01)    | DMAHS 26-03                                            |
| NJ    | Asset limit, single      | $2,000                  | MLTSS brochure 2026                                    |
| WA    | Income cap (SIL)         | $2,982 (2026-01-01)     | HCA income standards 2026-01-01                        |
| WA    | Home equity limit        | $1,130,000 (2026-01-01) | same chart                                             |
| WA    | Community spouse minimum | $72,529 (2025-07-01)    | same chart                                             |
| NC    | Asset limit, single      | $2,000                  | Manual MA-2231 (revised 2025-12-08)                    |
| NC    | Community spouse minimum | $32,532                 | MA-2231                                                |

## Kept as `review` (not shown on the site)

- PA asset limit: the state gives $2,000 plus a $6,000 disregard, or $2,400 depending on income. Two
  values, does not fit one field.
- OH asset limit $2,000: seen only in a search excerpt (codes.ohio.gov refused the connection). A
  human can confirm OAC 5160:1-3-05.1.
- WA asset limit $2,000: the chart lists it only as the SSI resource standard.
- MA asset limit $2,000: mass.gov answers 403 to automated requests. Save the page "Program
  financial guidelines for certain MassHealth applicants and members" as PDF and tell me.

## No data found (fields left empty)

- IL: HFS notice gives CSRA standard $143,172 and spouse allowance $4,066.50 (2026-01-01), but those
  are not the fields we show. Income cap and asset limit not located in an official document.
- MI: only a 2017 form ($2,000) and a proposal to raise the limit; current BEM 402/546 not read.
- VA: DMAS manual M14 is dated 2024-07-01 (asset limit $2,000); 2026 income cap and a possible
  change from HB838 not confirmed.
- NC: income cap and home equity limit not read (the 2026 non-MAGI limits page returned a mismatched
  file).

## Agency links

No change.
