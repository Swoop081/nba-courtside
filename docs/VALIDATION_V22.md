# NBA Courtside v0.22 — Validation

Freeze date: 20 August 2026

## Release status

**PASS** — Specialist CBA + Transaction Edge Cases.

## v0.22 transaction certification

- Official 2026–27 cap / apron / exception constants loaded.
- Persistent trade exceptions: creation, partial use, residual value and expiry PASS.
- Sign-and-trade legal envelope and BYC outgoing-salary handling PASS.
- Non-Taxpayer MLE, Room MLE, Bi-Annual and generated Minimum Salary Exception acquisition-by-trade routes PASS.
- Taxpayer MLE is not exposed as a trade-acquisition exception PASS.
- First-Apron / Taxpayer-MLE mutual-exclusion gates PASS.
- First-Apron removal of the ordinary $250,000 trade-matching allowance PASS.
- Prior-year and sign-and-trade-created TPE apron treatment PASS.
- Veteran extension-and-trade safe envelope (120% / 5% / total contract <= 4 years) PASS.
- Contract raises are linear from first-year salary rather than compounded PASS.
- 105% prior-salary maximum-salary alternative PASS.
- New-signing trade waiting periods PASS.
- Recently acquired two-month aggregation restriction and deadline carve-out PASS.
- One-year Bird player-consent restriction PASS.
- Waiver/free-agent reacquisition lock PASS.
- Regular-season high-salary waived-player First-Apron gate PASS.
- First-round rookie scale contracts PASS.
- Second Round Pick Exception four-year structure and pre-July-31 Team Salary deferral PASS.
- Minimum contracts use the applicable minimum-salary table PASS.
- CPU-to-CPU trades use the same v0.22 CBA legality gates PASS.

## Dedicated v0.22 runtime results

`test_cba_v22.js`: **PASS**

- 2026–27 NTMLE: $15,044,000
- Taxpayer MLE: $6,064,000
- Room MLE: $9,366,000
- Bi-Annual Exception: $5,477,267
- 0-YOS minimum: $1,358,000
- BYC test outgoing salary: $15,000,000
- Bird raise test: $10.0m → $10.8m → $11.6m → $12.4m
- 105% prior salary test: $60.0m → $63.0m maximum basis

`test_transaction_edges_v22.js`: **PASS**

- Partial TPE test residual: $7,000,000
- Two-year minimum test: $3,877,000 / $4,070,000
- Sign-and-trade test: Jalen Duren
- Reacquisition lock test: through 1 July 2027
- Second-round rookie route: Second Round Pick Exception
- Rookie trade wait test: through 31 July 2027
- Recently acquired aggregation wait test: through 1 January 2027

## Retained regression suite

All retained baselines pass against the v0.22 files:

- v0.21 Bird-rights runtime test — PASS
- v0.21 executable future-pick resolver — PASS (420 cells; 3,500 randomized scenarios)
- v0.21 draft-asset safety — PASS (230 atomic tradeable / 190 deliberately nontradeable)
- v0.21 complete draft/offseason bridge — PASS
- v0.21 Draft Night trade regression — PASS
- v0.21 NBA Cup integration — PASS (1,230 regular-season games)
- v0.21 regular Game Day — PASS
- v0.21 NBA Cup Final Game Day — PASS
- v0.21 postseason — PASS
- v0.17 official schedule audit — PASS
- v0.19 final-player-data certification — PASS (392 final-evidence / 50 projection-no-baseline)
- v0.20 Bird-rights certification — PASS (442 first actionable outcomes)
- v0.21 future-pick certification — PASS (420 origin cells)
- v0.22 CBA certification — PASS
- `node --check app.js` — PASS
- `node --check cba.js` — PASS

## Explicit certification boundaries

v0.22 does **not** invent starting-universe information that has not been safely certified. In particular:

- Exact historical 2026 offseason signing/trade dates are not fabricated. Waiting-period and aggregation locks are exact for transactions created inside the save; the frozen August 2026 starting roster is not retrospectively assigned guessed transaction dates.
- Exact NBA Years of Service for every current player remains a future source pass. Generated players track exact service; current starting players use the existing conservative fallback where a YOS-sensitive rule requires a value.
- Courtside still uses its modeled Team Salary as the working apron basis. Exact Apron Team Salary adjustments for every incentive, cap hold, first-round hold and specialist item remain long-tail CBA work.
- Incentives, trade/signing bonuses, detailed guarantees and triggers, set-off/stretch, cash consideration accounting, full waiver-claim/assignment treatment, Two-Way/Exhibit 10 contracts, Disabled Player Exception and designated-veteran/rookie-extension eligibility are not certified as complete.
- Direct same-season trade reacquisition beyond the implemented waiver/free-agent reacquisition path is not claimed as complete.
- v0.21 linked draft-right claims remain executable at Draft Night but non-severable in ordinary trade menus until claim-level trading is built.

## Save compatibility

The primary save key remains `nbaCourtsideSaveV18`. v0.22 adds transaction-state fields lazily and does not require save-key churn.
