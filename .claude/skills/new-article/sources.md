# Authorized sources

Closed list. The machine-readable version (what `npm run validate:draft` enforces) is
`scripts/lib/sources.ts`; keep both in sync. A domain enters this list only after checking that it
loads over HTTPS and is run by the organization it claims to be.

Checked on 2026-10-10 (additions of 2026-10-13 are marked). A `403` means the site blocks automated
requests (normal for several federal sites; `acl.gov` and `ssa.gov` pages often do this); the domain
is still the official one.

**Vetting rule for a new domain** (applied on 2026-10-13): it must load over HTTPS, say who runs it,
show how it is funded, have no commercial interest in the answer (no referral fees, no attorney or
facility leads), and be at least as good as the sources already in its tier. If it passes, it joins
the tier that fits. If it is useful but weaker than the official sources, it goes to Tier 4 as a
**second resource**: it can help you find or understand something, but a fact still has to be
confirmed in a Tier 1-2 source before it appears in an article.

## Tier 1 — Official U.S. government (key figures allowed)

Any `*.gov` host. `.gov` registration is limited to U.S. government bodies (CISA manages it), so a
`.gov` site cannot be a private imitation. That covers every state Medicaid agency.

| Domain                                           | Publisher                                                             | Use for                                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| medicare.gov                                     | CMS                                                                   | Medicare coverage, SNF rules, Care Compare                                                           |
| medicaid.gov                                     | CMS                                                                   | Medicaid eligibility, HCBS waivers, spousal impoverishment bulletins                                 |
| cms.gov                                          | Centers for Medicare & Medicaid Services                              | Premiums, deductibles, copays, fact sheets                                                           |
| ssa.gov                                          | Social Security Administration                                        | SSI rates, benefits                                                                                  |
| va.gov, benefits.va.gov, caregiver.va.gov        | Department of Veterans Affairs                                        | Pension, Aid & Attendance, caregiver programs                                                        |
| nia.nih.gov                                      | National Institute on Aging (NIH)                                     | Aging, dementia, caregiving guidance                                                                 |
| ncbi.nlm.nih.gov                                 | National Library of Medicine                                          | Peer-reviewed studies (PubMed/PMC)                                                                   |
| medlineplus.gov                                  | National Library of Medicine                                          | Medical definitions                                                                                  |
| cdc.gov                                          | Centers for Disease Control and Prevention                            | Health statistics, caregiving data                                                                   |
| acl.gov, eldercare.acl.gov                       | Administration for Community Living                                   | Long-term care planning (former LongTermCare.gov, now acl.gov/ltc), Eldercare Locator 1-800-677-1116 |
| hhs.gov, aspe.hhs.gov                            | Department of Health and Human Services                               | Research reports on long-term care                                                                   |
| hud.gov                                          | Housing and Urban Development                                         | Senior housing programs, reverse mortgages (HECM)                                                    |
| irs.gov                                          | Internal Revenue Service                                              | Tax deductions for care, LTC insurance                                                               |
| congress.gov, federalregister.gov, ecfr.gov      | Congress / Federal Register / eCFR                                    | Laws and regulations                                                                                 |
| State agencies (`*.<state>.gov`, `*.gov`)        | State governments                                                     | State Medicaid rules                                                                                 |
| macpac.gov _(added 2026-10-13)_                  | MACPAC (independent agency advising Congress)                         | Medicaid policy research, estate recovery and long-term care analysis                                |
| aspe.hhs.gov                                     | HHS Office of the Assistant Secretary for Planning and Evaluation     | Policy briefs. Check the publication date: several are from the 2000s                                |
| pfs2.acl.gov, ncler.acl.gov _(added 2026-10-13)_ | ACL (hosts training material by contractors such as Justice in Aging) | Legal explanations with statute citations. The host is official; the opinions are the author's       |

## Tier 2 — Cost of care survey (key figures allowed)

| Domain                               | Publisher                       | Use for                                                                                                                                    |
| ------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| carescout.com                        | CareScout (Genworth subsidiary) | Cost of Care Survey. **Use the latest edition the site uses (2025, published March 2026)**; same figures as `src/data/costs-by-state.json` |
| investor.genworth.com / genworth.com | Genworth Financial              | Press release announcing the survey results                                                                                                |

## Tier 3 — Reference organizations (supporting facts; not for costs, limits or coverage)

| Domain                                  | Publisher                                                              | Note                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aarp.org                                | AARP (nonprofit)                                                       | Caregiving and Medicaid explainers                                                                                                                                                                                                                                                        |
| alz.org                                 | Alzheimer's Association (nonprofit)                                    | **The only real domain.** `alzheimers.org` is a parked domain                                                                                                                                                                                                                             |
| parkinson.org                           | Parkinson's Foundation (nonprofit)                                     |                                                                                                                                                                                                                                                                                           |
| ahcancal.org                            | American Health Care Association / National Center for Assisted Living | Industry association; `ncal.org` no longer answers, NCAL lives inside this site                                                                                                                                                                                                           |
| theconsumervoice.org                    | National Consumer Voice for Quality Long-Term Care (nonprofit)         | Residents' rights                                                                                                                                                                                                                                                                         |
| kff.org                                 | KFF (nonprofit health policy research)                                 | Medicaid and Medicare analysis                                                                                                                                                                                                                                                            |
| nic.org                                 | National Investment Center for Seniors Housing & Care (nonprofit)      | Occupancy and market data                                                                                                                                                                                                                                                                 |
| healthinaging.org                       | Health in Aging Foundation (American Geriatrics Society)               | Clinical guidance for families                                                                                                                                                                                                                                                            |
| caregiver.org                           | Family Caregiver Alliance (nonprofit)                                  | Caregiver support                                                                                                                                                                                                                                                                         |
| ncoa.org                                | National Council on Aging (nonprofit)                                  | Benefits programs                                                                                                                                                                                                                                                                         |
| usaging.org                             | USAging (former n4a, Area Agencies on Aging)                           | Local aging services                                                                                                                                                                                                                                                                      |
| milliman.com                            | Milliman (actuarial firm)                                              | Research reports only                                                                                                                                                                                                                                                                     |
| justiceinaging.org _(added 2026-10-13)_ | Justice in Aging (national legal nonprofit, since 1972)                | Legal explanations (Medicaid, estate recovery) that cite the statute. Funded by ACL contracts, foundations, and some health-sector donors (AARP, a Medicaid health plan's foundation); advocacy stance for low-income older adults. It runs ACL's National Center on Law and Elder Rights |

## Tier 4 — Context only and second resources (never the source of a figure)

| Domain                                   | Why limited                                                                                                                                                                                                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aaltci.org                               | American Association for Long-Term Care Insurance: trade group that sells to insurance agents                                                                                                                                                              |
| hcaoa.org                                | Home Care Association of America: trade association of home care companies                                                                                                                                                                                 |
| health.usnews.com                        | Journalism; may cite figures, but cite the original source instead                                                                                                                                                                                         |
| seniorhousingnews.com                    | Trade press                                                                                                                                                                                                                                                |
| politifact.com                           | Fact-checks                                                                                                                                                                                                                                                |
| law.cornell.edu _(added 2026-10-13)_     | Legal Information Institute, Cornell Law School. Respected, donation-funded, but not official: it republishes the U.S. Code and CFR. Use it to read a statute quickly, then cite the official text (uscode.house.gov, govinfo.gov, ecfr.gov) when it opens |
| elderlawanswers.com _(added 2026-10-13)_ | Owned by WealthCounsel, LLC, a company that sells tools to elder law attorneys; the site promotes an attorney network. Useful explanations, but commercial and the authors are not named. Context only                                                     |

## Blocked

| Domain                                                            | Reason                                                                         |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| alzheimers.org                                                    | Parked domain (redirects to a `/lander` page). Not the Alzheimer's Association |
| aplaceformom.com                                                  | Referral service paid by facilities                                            |
| seniorliving.org                                                  | Lead-generation site                                                           |
| payingforseniorcare.com                                           | Referral commissions                                                           |
| caring.com                                                        | Referral service paid by providers                                             |
| seniorly.com                                                      | Referral service paid by facilities                                            |
| Any directory or blog without a named author and official sources | Not verifiable                                                                 |

`AGENTS.md` still lists aplaceformom.com and seniorliving.org as occasional sources (and two
published articles cite them). New articles do not use them.

## How each URL is checked

1. Domain is in Tier 1-4 (the validator rejects anything else).
2. Open the exact URL with WebFetch. It must load and contain the fact the article attributes to it.
   If the page is blocked (403), use `WebSearch` with `allowed_domains` set to that domain to
   confirm the page exists and its snippet supports the fact; otherwise mark `[VERIFICAR]`.
3. Prefer the deepest official page that states the fact, not a home page.
4. Never cite a URL taken from memory without opening it.
