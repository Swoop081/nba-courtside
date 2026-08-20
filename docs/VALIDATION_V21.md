# NBA Courtside v0.21 Validation

## Future-pick source certification

`python scripts/certify_future_pick_trees_v21.py`

- 420/420 2027–2033 origin cells present: PASS
- status counts: 175 conditional / 139 own / 91 outgoing / 4 protected / 4 frozen / 7 source-locked: PASS
- 230 atomic tradeable cells / 190 deliberate nontradeables: PASS
- source-locked set limited to CHA/CLE/MIN/UTA 2029 R1, CLE 2031 R1, SAC 2032 R2 and DET 2033 R2: PASS
- PHX 2029 own origin remains executable: PASS
- linked/protected/frozen/unresolved cells cannot leak into the atomic trade picker: PASS
- Draft Night stores origin order for future serial conditions: PASS
- temporary current-draft rights preview is not persisted to franchise state: PASS

## Runtime pick-tree regression

`node scripts/test_future_pick_trees_v21.js`

- explicit 2027–2033 first-round branches: PASS
- linked 2027–2033 second-round branches: PASS
- Denver/Miami/Dallas serial rollover history: PASS
- corrected Sacramento 2027 second fallback: PASS
- corrected Detroit 2028 56–60 second branch: PASS
- Houston/Dallas/Phoenix 2029 distribution: PASS
- Charlotte/Minnesota/San Antonio/Dallas 2030 exact conditional swap: PASS
- Cleveland 2031 pending-transfer lock: PASS
- Sacramento 2032 finalized-CLE / pending-DEN lock: PASS
- 3,500 randomized year/round ownership scenarios: PASS

## Trade-asset safety

`node scripts/test_draft_asset_safety_v21.js`

- 420 source cells: PASS
- 190 nontradeable linked/protected/frozen/unresolved cells: PASS
- 230 atomic tradeable cells: PASS
- linked cell excluded from tradeable-only picker: PASS
- untouched legacy origin owner refreshes to certified source owner: PASS
- user-transferred third-team owner survives migration: PASS
- Stepien smoke test: PASS

## Inherited data/CBA certification

- `python scripts/certify_player_data_v19.py`: PASS — 392 final-stat evidence players, 50 projection/no-baseline, zero bootstrap-hybrid.
- `python scripts/certify_bird_rights_v20.py`: PASS — 442 first actionable Bird-rights outcomes certified.
- `python scripts/test_official_schedule_v17.py`: PASS — 1,200 assigned games / 80 per team plus Cup completion architecture.

## Full gameplay regression

The following self-contained wrappers run against the v0.21 package root and pass:

- `node scripts/test_bird_rights_v21.js`
- `node scripts/test_cup_integration_v21.js`
- `node scripts/test_draft_offseason_v21.js`
- `node scripts/test_draft_trades_v21.js`
- `node scripts/test_gameday_regular_v21.js`
- `node scripts/test_gameday_cup_v21.js`
- `node scripts/test_postseason_v21.js`

## Simulation

No player ratings, season-final profiles or Game Day calibration coefficients changed in v0.21. The v0.19 rating/simulation calibration remains active.
