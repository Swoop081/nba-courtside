# NBA Courtside v0.18 — Validation

Validation date: **20 August 2026**

## Source certification audit

`python scripts/certify_sources_v18.py`

**PASS**

The audit verifies:
- 442 frozen contract rows and 442 JSON player/right records;
- identity, age, position and expiry parity;
- year-by-year salary / player-option / team-option parity;
- the three pending RFA rights cases;
- 30 final prior-season records, each totaling 82 games;
- league record reconciliation at 1,230 wins / 1,230 losses;
- 420 unique future-pick origin cells with 30 × 7 × 2 coverage;
- all 223 complex/frozen/source-locked pick cells are nontradeable;
- selected direct future-first obligations;
- player source statuses sum to 442: 34 verified / 358 bootstrap-hybrid / 50 projection;
- verified stat overlays carry field provenance;
- v0.18 save and migration keys;
- removal of the v0.17 Cup pot proxy;
- exact prior-record Cup tiebreak wiring;
- source-certification scripts load in the player-facing app.

## Draft-asset safety

`node scripts/test_draft_asset_safety_v18.js`

**PASS**

Controlled assertions:
- 420 certified source-ledger assets initialize;
- 223 source-locked/complex/frozen cells stay nontradeable;
- locked cells do not leak into `tradeableOnly` asset selection;
- key direct owners resolve as expected;
- DAL/LAL/MIA 2027 protection labels persist;
- untouched legacy ownership is repaired to the certified starting owner;
- a third-team owner created by the user's alternate-history trade is preserved during migration;
- Stepien smoke test blocks removal of consecutive future firsts.

## Official schedule regression

`python scripts/test_official_schedule_v17.py`

**PASS**

- 1,200 official assigned regular-season games
- 80 assigned games per team
- 40 assigned home / 40 assigned away
- 60 NBA Cup Group Play games
- opening/final schedule anchors preserved

## NBA Cup integration

`node scripts/test_cup_integration_v18.js`

**PASS**

- 1,200 assigned + 30 dynamically created = **1,230** counted regular-season games
- dynamic stages: 4 QF / 22 non-qualifier / 2 SF / 2 QF-loser games
- **67** total Cup competition games including the Championship
- every club reaches 82 regular-season games
- Cup Final remains excluded from regular-season standings/stat totals
- Cup champion persists in history

## Game Day regression

`node scripts/test_gameday_regular_v18.js`

**PASS** — regular-season Game Day, regulation minute reconciliation and injury persistence.

`node scripts/test_gameday_cup_v18.js`

**PASS** — Cup Championship Game Day, champion/history persistence and regular-season-stat exclusion.

## Postseason regression

`node scripts/test_postseason_v18.js`

**PASS**

- full postseason progression
- champion generated
- Finals MVP generated
- expected best-of-seven round progression retained

## Draft / offseason / next-season bridge

`node scripts/test_draft_offseason_v18.js`

**PASS**

- 16 lottery slots
- 60 prospects
- 60 draft selections
- user selections preserved
- free-agency bridge completes
- training camp completes
- next season starts
- 15-player opening roster
- 240-minute rotation

## JavaScript syntax

`node --check app.js`

**PASS**

`node --check gameday.js`

**PASS**

## Known test-suite boundary

The old pre-v0.17 static-schedule audit is no longer an appropriate invariant because the current 2026–27 schedule intentionally consists of **1,200 assigned games plus 30 Cup-dependent dynamic games**, not 1,230 static rows.

An older deterministic draft-trade test also assumes a larger pool of freely tradeable future picks. v0.18 intentionally source-locks unresolved asset chains, so that exact scripted package is no longer a valid required outcome. `test_draft_asset_safety_v18.js` replaces it as the relevant asset-safety invariant.

## Accuracy boundary validated, not hidden

Passing v0.18 validation does **not** mean every current data field is source-final.

The build still contains:
- 358 bootstrap-hybrid player-stat rows;
- engine-inferred initial Bird clocks;
- complex draft chains that are safety-locked rather than fully executable.

Those states are explicit in both data and UI. The purpose of v0.18 is to make the simulator safer and more auditable while preserving the calibrated franchise loop.
