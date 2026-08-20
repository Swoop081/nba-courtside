# NBA Courtside v0.24 Validation

Freeze date: 20 August 2026.

## Certified data state

- 442/442 player/right rows present.
- 442/442 Years of Service inputs certified; age proxy removed.
- 393 final 2025–26 NBA evidence rows.
- 49 source-backed projections with null 2025–26 NBA history.
- Original 392-player v0.19 evidence/rating/simulation core passes frozen SHA-256 checks.
- Yanic Niederhauser is the sole v0.24 evidence reclassification: 41 games, final NBA row.
- Dillon Mitchell is source-certified as a Boston Two-Way player.

## v0.24 runtime tests

`node scripts/test_cba_source_long_tail_v24.js`

Covers:

- exact service-year use / no age fallback;
- Team Salary vs Apron Team Salary treatment;
- unlikely incentive apron accounting;
- one-year veteran minimum reimbursement;
- Exhibit 10 service-year minimum and Two-Way salary;
- 48-hour waiver claims and competing-claim preference;
- DPE grant/amount/use;
- Two-Way and Exhibit 10 signing paths;
- annual cash paid/received limits;
- stretch, set-off and veteran extension timing helpers.

`python scripts/certify_cba_source_long_tail_v24.py`

Covers JSON/browser parity, 442-player certification, 393/49 evidence split, Yanic/Dillon corrections, frozen v0.19 core hashes, save-key retention and required runtime hooks.

## Retained regression checks run against v0.24

- v0.22 CBA helper suite: PASS.
- v0.22 transaction-edge compatibility suite: PASS after updating the waiver test for the new 48-hour lifecycle.
- v0.20/v0.21 Bird-right compatibility: PASS with continuity preserved while a claim is pending and reset only on waiver clearance into free agency.
- v0.21 future-pick tree resolver: PASS, 420 cells / 3,500 randomized scenarios.
- v0.21 draft-asset safety: PASS.
- v0.21 Draft Night trade regression: PASS.
- v0.24 compressed draft → free agency → training camp → next-season bridge: PASS, 60 selections and 15-player Opening Night roster.
- v0.21 NBA Cup completion integration: PASS, 1,230 regular-season results / max player GP 82.
- v0.21 regular Game Day: PASS.
- v0.21 Cup Final Game Day: PASS.
- official 2026–27 schedule audit: PASS, 1,200 assigned games / 80 per team.
- JavaScript syntax checks: PASS.

The very long legacy full-season/postseason harnesses remain archival stress tests; v0.24 validation uses the faster retained functional regressions plus the targeted offseason bridge because this pass does not modify postseason bracket logic or the v0.19 simulation engine.

## Deliberate source/feature boundaries after v0.24

- Historical starting-player incentive values/classification when not source-certified.
- Historical signing/trade bonuses and guarantee trigger schedules when not source-certified.
- Original signing dates for starting veteran contracts where extension-anniversary eligibility cannot be proven.
- Full designated-veteran/supermax award-history eligibility.
- Remaining Apron Team Salary adjustments not safely derivable from the frozen starting contract source.
- Cash is accounted for by the engine but is not selectable in the primary trade-builder UI.
- Two-Way G League assignment-day logistics beyond the NBA 50-game counter.
- Exhibit 10 affiliate-bonus vesting after a player is waived.
- Direct same-season trade reacquisition edge cases beyond the implemented traded-then-waived/free-agent restriction.
