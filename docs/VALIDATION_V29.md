# NBA Courtside v0.29 — Validation

## Ratings/data gate

- 442 unique player/right records.
- 393 exact-source 2025–26 NBA evidence rows.
- 49 source-backed projection-only records with `stats_2025_26 = null`.
- All 393 evidence players join back to the frozen Basketball-Reference final per-game source, including the v0.24 Yanic Konan Niederhäuser alias repair.
- Exact equality audit covers GP, GS, MPG, PTS, REB, AST, STL, BLK, TOV, FGA, 3PA, FTA, OREB, DREB, PF and shooting percentages.
- Unique internal IDs and NBA IDs.
- Rating range and distribution gates.
- Explicit regressions for Paul Reed, Kel'el Ware, Sandro Mamukelashvili, Giannis Antetokounmpo, Jayson Tatum, Lu Dort and Herb Jones.
- `players-2026-08-19.json`, `players-summary.csv` and browser `data.js` are synchronized.
- A v0.29 projection-runtime regression verifies all 49 stat-null source-backed projections still carry their original projection inputs/minute priors while using the rebased display scale.

## Retained release gate

v0.29 also runs the v0.28 postgame/season-started boot regression, v0.27 Main Menu audit, v0.26 device/modal audits, v0.25 save migration and selected Game Day / NBA Cup / postseason / offseason / CBA regressions plus JavaScript syntax checks.

The retained full NBA Cup integration specifically certifies that the initial `ensureNBAProgress()` invocation is outside its own function body. This closes a misplaced-brace recursion path found while validating v0.29.

## Deliberate non-change

Game Day simulation profiles are not regenerated in v0.29. This pass repairs the evaluation/display layer while retaining the calibrated 2025–26 per-36 simulation evidence.
