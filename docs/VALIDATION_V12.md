# NBA Courtside v0.12 — Validation

## JavaScript syntax

PASS:
- `node --check app.js`
- `node --check cba.js`
- `node --check gameday.js`
- `node --check exhibition.js`

## Structural data audit

`python scripts/audit.py`

PASS:
- 30 teams
- 442 player/rights records
- 392 statistically rated players
- 44 projection-pending players
- 3 unsigned RFAs
- 0 duplicate player identities

## League schedule audit

`python scripts/audit_live.py`

PASS:
- 1,230 regular-season games
- every team plays 82
- every team has 41 home / 41 away
- 0 duplicate game IDs

## CBA math test

`node scripts/test_cba_v12.js`

PASS:
- Non-Taxpayer MLE = $15,044,000
- Taxpayer MLE = $6,064,000
- Room MLE = $9,366,000
- Bi-annual Exception = 3.32% of 2026-27 cap = $5,476,705
- Bird contract maximum = 5 years in the current contract builder
- Expanded TPE formula returns the expected route maximum
- Standard TPE route is recognized
- second-apron salary increase is rejected
- second-apron salary aggregation is rejected
- existing hard cap is respected

## App / CBA integration

`node scripts/test_app_cba_integration_v12.js`

PASS:
- save initializes/migrates to version 12
- 2026-27 official cap levels load
- Jalen Duren is recognized as DET RFA rights case
- DET cap hold = $19,449,432 from the frozen source data
- renouncing rights removes that hold
- qualifying offer = $9,615,600 from the frozen source data
- Bird signing route resolves
- qualifying-offer contract installs correctly
- waiving a guaranteed contract creates year-specific dead cap
- forced second-apron year freezes the appropriate far-future first

## Full-season regression

`node scripts/test_full_season_v12.js`

PASS:
- all 1,230 regular-season games completed
- 433 morale profiles populated
- 40 players below 55 morale in the deterministic test universe
- 5 organic trade requests
- 1 pending meeting
- 1 organic CPU trade
- 63 medical events
- minimum tested active rotation size: 10

These counts are seeded smoke-test outputs, not target league frequencies.

## Existing front-office / pick systems
`node scripts/test_front_offices_v12.js` and `node scripts/test_draft_pick_trades_v12.js`

The v0.11 front-office/pick systems were re-run against the v0.12 app with the new CBA module loaded.

PASS:
- seven-year rolling pick ledger remains intact
- Stepien guard remains active
- future pick ownership persists through a trade
- future draft selection follows the traded owner
- seeded 2027 conveyed rights continue to resolve

## Game Day regression
`node scripts/test_gameday_v12.js`

The Game Day harness was re-run against v0.12.

PASS:
- full game completed
- in-game injury substitution completed
- result persisted to the current save structure
- regulation player-minute reconciliation remains intact

## Current known limitations
The tested model is intentionally operational rather than exhaustive. See `CONTRACTS_CBA.md` for CBA edge cases that remain outside v0.12, especially service-year minimum tables, full non-simultaneous TPE ledgers, BYC, sign-and-trade edge cases, partial guarantees/set-off/stretch, bonus structures, two-way/Exhibit 10 and other specialist exceptions.
