# NBA Courtside v0.16 — Simulation Calibration

v0.16 calibrates both paths that create basketball results: the fast league simulator used for background games and the detailed possession engine used on Game Day. The goal is not to reproduce a predetermined NBA season; it is to keep the alternate-history universe statistically credible while allowing ratings, rotations, injuries and roster construction to matter.

## Calibration target

The bundled near-final 2025–26 bootstrap contains 30 `Team Totals` rows. Their mean is the internal target for this pass. The bootstrap remains explicitly source-pending for exact season-complete certification.

| Metric | Bootstrap target | Game Day v0.16 | Delta |
|---|---:|---:|---:|
| PTS | 115.56 | 115.25 | -0.27% |
| REB | 43.76 | 44.80 | +2.36% |
| AST | 26.72 | 26.23 | -1.82% |
| STL | 8.41 | 8.49 | +1.01% |
| BLK | 4.85 | 4.91 | +1.27% |
| TOV | 14.54 | 14.66 | +0.86% |
| FGM | 41.91 | 41.88 | -0.06% |
| FGA | 89.05 | 89.48 | +0.49% |
| 3PM | 13.28 | 13.28 | -0.05% |
| 3PA | 36.95 | 36.77 | -0.51% |
| FTM | 18.44 | 18.20 | -1.33% |
| FTA | 23.56 | 23.65 | +0.38% |
| PF | 19.92 | 19.93 | +0.05% |

**Detailed sample:** 96 games / 192 team-games.  
**Game Day possessions/events:** 233.2 per game.  
**Box-score point errors:** 0.  
**Raw rotation-minute errors:** 0.

## What changed in Game Day

- Two-point shooting now derives an approximate 2P% from FGA, 3PA, FG% and 3P% when those inputs exist, then blends it toward a finishing prior based on evidence confidence.
- Turnover frequency, steal credit, block frequency, assist probability, shooting-foul frequency and non-shooting personal fouls were calibrated together rather than as isolated knobs.
- Shot mix is adjusted toward the bundled 3PA profile.
- Rebound credit allows a small share of misses to resolve as team/dead-ball rebounds instead of forcing every miss onto an individual player.
- Regulation rotations still total exactly 240 raw player-minutes; overtime adds 25 team-minutes per overtime period.

## Quick-sim batch

Quick sim uses the same persistent rosters, ratings and target-minute profiles but creates a complete result without stepping through possession-by-possession DOM presentation.

| Metric | v0.16 result |
|---|---:|
| Seasons | 10 |
| Team-games | 24,600 |
| Team PPG | 115.78 |
| Home win rate | 55.3% |
| Average margin | 11.18 |
| Average best record | 57.1 wins |
| Average worst record | 21.1 wins |
| Average lowest team PPG | 110.55 |
| Average highest team PPG | 119.92 |
| Box-score point errors | 0 |
| Rotation-minute errors | 0 |

### Example leader output from the first calibration seed

- Shai Gilgeous-Alexander: 29.7 PPG
- Luka Doncic: 28.7 PPG
- Kawhi Leonard: 27.1 PPG
- Anthony Edwards: 26.5 PPG
- Nikola Jokic: 26.1 PPG
- Assist leader: Nikola Jokic — 10.6 APG
- Rebound leader: Nikola Jokic — 12.5 RPG
- Block leader: Victor Wembanyama — 3.2 BPG

These names/numbers are deterministic calibration-seed outputs, not scripted award outcomes.

## Player evidence and low-sample control

For stat-backed players, v0.16 computes model confidence as `min(1, GP × MPG / 1200)`. Per-36 evidence is then blended toward a role/position prior with a confidence-powered weight. This prevents very small samples from producing unrealistic usage or counting-stat explosions while still allowing a healthy full-season sample to drive the player.

Rotation targets also blend actual 2025–26 MPG with role/OVR expectations, with the evidence contribution capped. This stopped the old generic allocator from automatically pushing nearly every top player toward 38 minutes.

## What this pass does not do

- It does not force real 2026–27 standings, award winners or box scores.
- It does not claim the bundled bootstrap is the exact official final NBA.com file.
- It does not replace every current contract/pick edge with externally certified data.
- It does not make one Overall rating determine every possession; rate evidence and individual skill ratings remain separate inputs.

Calibration should be rerun whenever the rating model, roster data, rotation model or possession engine changes materially.
