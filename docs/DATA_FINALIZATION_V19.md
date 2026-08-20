# NBA Courtside v0.19 — Final 2025–26 Player Data + Rating Recalibration

Freeze date: **20 August 2026**

v0.19 supersedes the v0.18 bootstrap-hybrid player-stat layer while preserving the certified contract structure, future-pick safety ledger, official 2026–27 schedule, NBA Cup and franchise-state schema.

## Player-stat completion

- 442 current player/right records remain in the starting universe.
- 392 players have 2025–26 NBA evidence and now use season-final regular-season aggregate rows.
- 0 evidence-backed rows remain bootstrap-hybrid.
- 50 records remain projection/no-current-baseline because they have no 2025–26 NBA evidence in the imported final table.
- Multi-team players use the season-total `2TM` / `3TM` / `4TM` aggregate row rather than one team stint.
- All 18 stored current-season fields are source-backed: GP, GS, MPG, PTS, REB, AST, STL, BLK, TOV, FG%, 3P%, FT%, FGA, 3PA, FTA, OREB, DREB and PF.

### Notable correction

Kevin Huerter is now represented by his complete 69-game 2025–26 season (Chicago + Detroit), replacing the v0.18 manual overlay that captured only his 44-game Chicago stint.

## Rating regeneration

The historical-portable box-score model is regenerated over the complete 582-player 2025–26 NBA population. Multi-team stints are collapsed to their season-total row before percentile normalization.

The existing rating architecture remains intact:

- Bayesian shrinkage for 3P%, 2P% and FT%.
- Per-36 volume and season-relative percentile normalization.
- Low-minute evidence shrinkage toward 75.
- Position-aware perimeter/interior defense proxies.
- Position-weighted skill Overall.
- Display Overall = **72% skill Overall + 28% season-relative impact**.
- Impact = 36% PTS/36 + 19% AST/36 + 13% REB/36 + 8% STL/36 + 8% BLK/36 + 16% true-shooting proxy, each as a season-relative percentile.

The final league shooting priors are 35.96% from three, 55.08% on twos and 78.31% at the line.

## Simulation recalibration

The quick simulator remains close to the final 2025–26 scoring environment without a structural rewrite. Game Day received a small global calibration to its three-point frequency/accuracy, turnover frequency, live-clock possession duration, steal assignment, block rate and assist rate. No individual player was hand-tuned to force calibration.

See `data/simulation-calibration-v0.19.json` and `data/gameday-calibration-v0.19.json`.

## Save compatibility

v0.19 intentionally retains the `nbaCourtsideSaveV18` save schema/key. The pass updates static starting data and simulation calibration, not franchise-state structure, so an unnecessary save-schema migration was avoided.
