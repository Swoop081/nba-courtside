# NBA Courtside v0.16 — Data Certification

**Freeze date:** 19 Aug 2026  
**Automated result:** PASS

## What “certified” means here

**Structure-certified** means the bundled game data passes internal identity, schema, roster, contract-year, stat-range and model-confidence checks. It does **not** mean every row has been independently re-downloaded from an official source in this pass.

- 30 unique teams
- 442 player/right records; 0 duplicate player IDs
- 392 currently rated players
- 392 players with a 2025–26 NBA statistical baseline
- 50 projection/no-baseline records
- 393 headshot URLs
- 3 unsigned RFA rights cases

## Model confidence tiers

- High: 279
- Medium: 70
- Low: 43
- Projection/no 2025–26 baseline: 50

Low-sample players are now shrunk toward role/position priors in the simulation instead of allowing a tiny per-36 sample to dominate their output.

## Bundled 2025–26 calibration target

The raw bootstrap CSV contains 30 `Team Totals` rows. v0.16 uses their league mean as an internal calibration target while preserving the existing warning that the file is near-final rather than the exact official season-complete NBA.com export.

| Metric | Per team |
|---|---:|
| PTS | 115.56 |
| REB | 43.76 |
| AST | 26.72 |
| STL | 8.41 |
| BLK | 4.85 |
| TOV | 14.54 |
| FGM | 41.91 |
| FGA | 89.05 |
| 3PM | 13.28 |
| 3PA | 36.95 |
| FTM | 18.44 |
| FTA | 23.56 |
| PF | 19.92 |
| POSSESSIONS_PROXY | 102.58 |

## Automated checks

- **PASS — 30 unique NBA teams:** 30 rows / 30 unique abbreviations
- **PASS — 442 player/right records:** 442 records
- **PASS — unique player ids:** 0 duplicate IDs
- **PASS — roster snapshot row parity:** 442 TSV rows vs 442 JSON rows
- **PASS — roster snapshot identity parity:** 0 JSON-only / 0 TSV-only
- **PASS — valid player team abbreviations:** all player snapshot teams resolve to a league team
- **PASS — valid ages:** expected 18–50 range
- **PASS — valid positions:** all position arrays nonempty and NBA-standard
- **PASS — NBA IDs unique where present:** 393 mapped NBA IDs
- **PASS — contract-year structure:** 0 structural issues
- **PASS — unsigned RFA rights cases:** 3 cases: Jalen Duren, Bennedict Mathurin, Peyton Watson
- **PASS — 2025–26 stat field ranges:** 392 player baselines / 0 range issues
- **PASS — confidence formula parity:** 0 mismatches against min(1, total_minutes/1200)
- **PASS — rating coverage:** 392 rated / quality manifest says 392
- **PASS — bootstrap team calibration rows:** 30 Team Totals rows

## Explicit source-pending boundaries

- The bundled 2025–26 statistical seed is a near-final bootstrap, not yet the exact season-complete NBA.com bulk export.
- Current roster/contract structure is internally audited, but every specialist contract/CBA edge and every external contract term has not been independently re-certified in this pass.
- The 2026–27 game calendar remains NBA Courtside’s deterministic 1,230-game scaffold rather than an exact official schedule import.
- Complex future second-round conveyances and some linked future pick obligations remain explicitly audit-pending.

These boundaries are intentional. v0.16 improves model reliability without relabelling bootstrap or modeled data as official facts.
