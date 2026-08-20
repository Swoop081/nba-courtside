# NBA Courtside v0.11 — Validation

## Structural audit

`python3 scripts/audit.py`

PASS:
- 30 NBA teams
- 442 player/rights records
- 392 statistically rated players
- 44 projection-pending players
- 3 unsigned RFA rights records
- 0 duplicate player identities

## Front-office / pick-capital test

`node scripts/test_front_offices_v11.js`

PASS:
- v0.11 state initializes with 420 rolling draft assets (30 teams × 2 rounds × 7 drafts)
- team-direction and GM-archetype profiles resolve
- Toronto exposes 14 future pick assets in the starting seven-year window
- Stepien guard blocks a test that would leave consecutive future drafts without a first
- seeded 2027 simple conveyances resolve, including ATL→SAS, NYK→BKN and PHX→HOU
- top-pick protections remain active in the 2027 resolution layer

## Draft-pick trade persistence

`node scripts/test_draft_pick_trades_v11.js`

PASS:
- a TOR/BOS 2029 first-round-pick swap persists in the asset ledger
- the later draft order follows the new owners, not the original teams
- a subsequently traded 2027 ATL conveyed right follows the new owner at draft resolution

## Existing systems regression

`node scripts/test_roles_morale_v10.js`

PASS: role meeting, minute promise and morale response still function.

`node scripts/test_gameday_v10.js`

PASS: Game Day completed with in-game injury substitution and a full result.

`node scripts/test_full_season_v10.js`

PASS:
- 1,230/1,230 regular-season games completed
- 433 morale profiles active
- 39 players below 55 morale in the deterministic test universe
- 2 organic trade requests
- 69 medical events
- minimum tested active rotation size: 10
- 3 CPU-to-CPU trades executed under the new buyer/seller logic

The CPU trade count is a seeded smoke-test result, not a target frequency. Trade activity varies by standings, team direction, available salary matches, morale and deadline urgency.

## JavaScript syntax

`node --check app.js` — PASS  
`node --check gameday.js` — PASS

## Known v0.11 boundaries

This is the smart-front-office/draft-capital pass, not the full CBA certification pass. The engine intentionally uses a basic Stepien implementation and the existing simplified salary-matching layer. Complex 2027 first-round linked rights are resolved but locked from re-trading. The complete current 2027 second-round conveyance tree and full inherited 2028–2033 real-world pick ledger remain explicitly audit-pending; those slots use functional future-own-pick scaffolding until the dedicated data/CBA passes.
