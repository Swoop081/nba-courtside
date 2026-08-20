# NBA Courtside v0.17 — Validation
> **Historical validation note:** This file records the v0.17 release. v0.18 supersedes the prior-record Cup tiebreak limitation described below; see `VALIDATION_V18.md`.


## 1. Official schedule import audit
Command:

`python scripts/test_official_schedule_v17.py`

Result: **PASS**

- 1,200 assigned official games.
- 30 teams × 80 assigned games.
- 40 assigned home + 40 assigned away per team.
- 60 NBA Cup Group Play games.
- 4 Group Play games/team: 2 home + 2 away.
- Opening night matches official release: BOS@DET, PHI@NYK, OKC@SAS.
- Apr. 11 final day contains 15 games and all 30 teams.
- Source date span: Oct. 20, 2026 → Apr. 11, 2027.

## 2. Full NBA Cup / 82-game integration
Command:

`node scripts/test_cup_integration_v17.js`

Result: **PASS**

Seeded output:

- Official assigned games: **1,200**.
- Dynamic Cup-dependent regular-season games: **30**.
- Final regular-season schedule: **1,230**.
- Completed regular-season results: **1,230**.
- Dynamic breakdown:
  - Quarterfinals: **4**
  - Non-qualifier games: **22**
  - Semifinals: **2**
  - Quarterfinal-loser games: **2**
- Every franchise finishes with **82** regular-season games.
- Total NBA Cup competition games: **67** (60 Group Play + 4 QF + 2 SF + Championship).
- Seeded Cup champion: **Miami**.
- Championship stored outside regular-season results.
- Maximum regular-season player GP: **82**.

The seeded champion is a simulation result, not a scripted outcome.

## 3. Regular Game Day regression on official schedule
Command:

`node scripts/test_gameday_regular_v17.js`

Result: **PASS**

The test loads official game **G0088 — Chicago at Toronto, Oct. 21, 2026**, runs the possession engine, forces an injury, and verifies:

- final result persistence;
- `courtside_v17_possession` engine;
- injury persistence/history;
- injured player exits early;
- regulation team minutes reconcile correctly;
- availability UI sees the persisted injury.

Seeded test score: **CHI 97 – TOR 118**.

## 4. NBA Cup Championship Game Day
Command:

`node scripts/test_gameday_cup_v17.js`

Result: **PASS**

The controlled test creates a Toronto–Los Angeles Cup Championship at Hinkle Fieldhouse and verifies:

- Cup Final is detected as a special Game Day.
- possession engine completes normally;
- champion and Cup history persist;
- championship result uses `courtside_v17_cup_final_possession`;
- no `CUP26-FINAL` entry appears in regular-season results;
- regular-season player totals remain byte-for-byte unchanged;
- final presentation explicitly says the game does not count in the regular season.

Seeded test score: **TOR 123 – LAL 119**.

## 5. JavaScript syntax
- `node --check app.js` — **PASS**
- `node --check gameday.js` — **PASS**

## Known validation boundary
The NBA's deepest Group Play tiebreak uses exact 2025–26 regular-season record and then a random drawing. v0.17 currently uses the official Cup draw pot tier followed by a deterministic fallback at that final layer. Head-to-head, point differential, total points, and the overtime exclusion rule are implemented.
