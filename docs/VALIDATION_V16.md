# NBA Courtside v0.16 — Validation

Validation was run after the Data Certification + Simulation Calibration integration.

## Static / data audits

- `python scripts/certify_data_v16.py` — **PASS**: 15 automated certification checks / 0 errors.
- `python scripts/audit.py` — **PASS**: 30 teams / 442 records / 392 rated / 44 projection-pending / 3 unsigned RFAs / 0 duplicate identities.
- `python scripts/audit_v05.py` — **PASS**: 30 teams / 442 base players / 1,230 games / 82 per team / 41 home + 41 away; postseason, awards, aging/retirement, lottery, draft and next-season loop markers present.

## Simulation calibration

- `node scripts/calibrate_sim_v16.js` — **PASS**: 10 seasons / 24,600 team-games / 115.78 team PPG / 0 point reconciliation errors / 0 rotation-minute errors.
- `node scripts/calibrate_gameday_v16.js` — **PASS**: 96 detailed games / 115.25 team PPG / 0 point reconciliation errors / 0 raw rotation-minute errors.

## Critical regression tests

- `node scripts/test_gameday_v16.js` — **PASS**: Game Day completed, injury exit persisted, v0.16 engine marker written and regulation minutes reconciled.
- `node scripts/test_draft_trades_v16.js` — **PASS**: draft-night trade down + trade up changed current-pick ownership and persisted trade history.
- `node scripts/test_postseason_v16.js` — **PASS**: full postseason completed to a champion / Finals MVP / finished best-of-seven series.
- `node scripts/test_draft_offseason_v16.js` — **PASS**: complete regular season → postseason → lottery → scouting → 60-pick draft → free agency → training camp → next season; opening roster 15 and rotation 240 minutes.

## v0.16-specific invariants

- Quick-sim player PTS sum exactly equals the displayed team score.
- Game Day player PTS sum exactly equals the displayed team score.
- Regulation target rotations sum to 240 minutes.
- Low-sample rate inputs are shrinkage-controlled before simulation.
- Player profile shows a confidence tier rather than hiding uncertainty.
- v0.15 saves migrate into `nbaCourtsideSaveV16`.
- Public GM mode remains the only player-facing mode; the Exhibition harness remains unlinked QA material.

## Known source-pending items

- The bundled 2025–26 statistical seed is a near-final bootstrap, not yet the exact season-complete NBA.com bulk export.
- Current roster/contract structure is internally audited, but every specialist contract/CBA edge and every external contract term has not been independently re-certified in this pass.
- The 2026–27 game calendar remains NBA Courtside’s deterministic 1,230-game scaffold rather than an exact official schedule import.
- Complex future second-round conveyances and some linked future pick obligations remain explicitly audit-pending.
