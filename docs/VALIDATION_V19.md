# NBA Courtside v0.19 Validation

## Data certification

`python scripts/certify_player_data_v19.py`

Expected result: PASS.

Certified invariants:

- 442 current player/right rows.
- 392 season-final evidence players.
- 50 projection/no-baseline players.
- 0 bootstrap-hybrid rows.
- 392/392 source joins.
- All 18 stored stat fields source-backed.
- Browser payload matches the canonical player/model JSON.
- Independent game-log validator reconstructs 1,230 regular-season games / 2,460 team-games.

## Final 2025–26 league targets

Independent player-game validation produces these per-team-game targets:

- 115.6077 points
- 89.089 FGA
- 36.9797 3PA
- 23.4829 FTA
- 43.7695 rebounds
- 26.7407 assists
- 8.4199 steals
- 4.8407 blocks
- 13.7951 player turnovers
- 19.8659 personal fouls

## Simulation calibration

Quick simulation, 10 repetitions of the 1,200 assigned official games:

- 116.09 PPG
- 54.4% home wins
- 11.02 average margin
- 0 box-score point errors
- 0 rotation-minute errors

Detailed Game Day, 96-game calibration sample:

- 115.578 PPG vs 115.608 target (-0.03%)
- all tracked box-score categories within 2.34% of the final target
- 0 box-score point errors
- 0 rotation-minute errors

## Regression scope

v0.18 contract/pick safety, v0.17 official schedule/NBA Cup, Game Day, postseason and draft/offseason flow remain regression targets for this data-only schema-compatible pass.

## Self-contained current regression suite

The v0.19 package includes self-contained current-baseline wrappers and they pass against the v0.19 files:

- `test_cup_integration_v19.js`
- `test_draft_asset_safety_v19.js`
- `test_draft_offseason_v19.js`
- `test_draft_trades_v19.js`
- `test_gameday_cup_v19.js`
- `test_gameday_regular_v19.js`
- `test_postseason_v19.js`
- `test_official_schedule_v17.py`

The draft-trade wrapper supplies a controlled tradeable second-round asset to exercise the trade-up mechanism; the inherited v0.18 fixture assumed such an asset existed but the certified pick-safety ledger can correctly leave Toronto without one in that synthetic state.

Older historical test files are retained as archive material and many intentionally reference their original `/mnt/data/NBA-Courtside-...` package paths. They are not the self-contained v0.19 regression suite.
