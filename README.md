# NBA Courtside — 2026 Data Foundation v0.2

**Frozen:** 19 August 2026  
**Starting season:** 2026–27  
**Performance basis:** 2025–26 regular season

This is the current-day data foundation for the NBA Courtside GM simulator. It is a roster/ratings/contract dataset and mobile inspection lab, not yet the full season engine.

## What changed in v0.2

- 30-team current-day league snapshot retained.
- 442 player/rights records carried into the current GM pool.
- 392 players now have a joined 2025–26 statistical profile and generated ratings.
- Two missed 2025–26 name joins (Egor Demin and Yang Hansen) are repaired.
- Display Overall now blends the position-weighted skill model with a separate season-relative impact summary, while the underlying simulation profile remains rate-based.
- Every rated player now retains a simulation profile: PTS/FGA/3PA/FTA/REB/AST/STL/BLK/TOV per 36, true-shooting proxy, 3-point rate and free-throw rate.
- Every player now has a career-trajectory scaffold: career stage, broad prime window and current trend.
- Jalen Duren, Bennedict Mathurin and Peyton Watson are no longer represented as if they had signed 2026–27 contracts. They are explicit unsigned restricted free agents with team rights, cap holds and qualifying-offer values.
- Position-group logic is repaired so hybrid wings such as LeBron James are not treated as guards simply because PG is one of several eligible positions.

## Rating philosophy

The simulator stores **basketball evidence first** and display ratings second.

Core historical input schema:

`GP, GS, MIN, FGM, FGA, 3PM, 3PA, FTM, FTA, OREB, DREB, AST, TOV, STL, BLK, PF, PTS, age, position`

The same schema can later be fed a 1992, 1996, 2003 or other historical season without rewriting the game.

### Era normalization

Volume is converted to per-36 and each component is percentile-ranked inside that season. Shooting percentages use Bayesian shrinkage so tiny samples do not create absurd ratings.

### Display ratings

- Finishing
- 3PT Shooting
- Free Throw
- Shot Creation
- Playmaking
- Ball Security
- Offensive Rebounding
- Defensive Rebounding
- Perimeter Defense
- Interior Defense
- Stamina
- Impact
- Offense / Defense / Overall

`Overall` in v0.2 is 72% position-weighted skill summary + 28% season-relative impact summary. This keeps a one-dimensional rating useful for quick roster screens without making it the simulation itself.

## Career development

The current data layer now gives each player a broad trajectory state:

- Development
- Approaching Prime
- Prime
- Late Prime
- Decline
- Late Career

Guards/wings default to a 25–29 broad prime and bigs 26–30. The actual save engine will not simply add/subtract one Overall point. It will modify underlying attributes independently, with athletic traits generally aging faster and shooting/playmaking/IQ aging more slowly.

Examples of intended behavior:

- A 41-year-old LeBron James starts as a high-level current player but trends downward season by season until retirement.
- A 22-year-old Victor Wembanyama remains on an upward/prime-approach trajectory.
- 2026 rookies such as AJ Dybantsa remain projection-pending until the pre-NBA translation model is populated; no fake NBA box score is invented for them.

## Contract status

Signed players retain year-by-year salary and option data from the working offseason contract snapshot.

Unsigned RFAs are represented separately. Their team retains matching rights and the applicable cap hold remains on the books until the player signs, accepts a qualifying offer, or rights are renounced.

## Important data-quality limitation

The bundled 2025–26 bulk stat file is the near-final bootstrap used to prove the model. It is **not yet the exact completed NBA.com season export**. The schema and importer are deliberately built so the final official NBA.com file can replace this seed without changing the player model or formulas.

For that reason v0.2 is suitable for rating-model and GM-data development, but should not yet be called the final canonical statistical release.

## Files

- `index.html` — iPhone-first roster/player data lab
- `app.js` — viewer logic
- `data/players-2026-08-19.json` — enriched player database
- `data/league-2026-08-19.json` — league/cap/team snapshot
- `data/players-summary.csv` — flat audit export
- `data/data-quality.json` — completeness report
- `model/rating-model.json` — formula specification
- `scripts/build_data.py` — original reproducible v0.1 builder
- `scripts/audit.py` — structural v0.2 validator
- `raw/rosters_contracts_2026-08-19.tsv` — roster/contract seed
- `raw/nba_stats_2025_2026_bootstrap.csv` — statistical seed
- `sources.json` — provenance and current limitations
