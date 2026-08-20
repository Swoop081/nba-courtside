# NBA Courtside v0.13 — Validation

## Structural/data audit
- 30 teams
- 442 player/rights records
- 392 statistically rated players
- 44 projection-pending players
- 3 unresolved starting RFAs
- 0 duplicate player identities

## Free-agency unit/integration test
`test_free_agency_v13.js` passes. It verifies:
- v0.13 save state/migration scaffolding
- seven-day free-agency initialization and completion
- deterministic player preference profiles
- offer evaluation across money/role/winning/loyalty/market/fit/security
- outside RFA offer sheets constrained to cap room
- user-controlled RFA match window
- successful RFA match back to the rights team
- persistence of free-agency decisions

Representative test output:
- Preference top three in the seeded RFA case: Role / Money / Fit
- RFA retained by DET through match rights
- Main wave completed on Day 7

## Full franchise-loop test
`test_franchise_loop_v13.js` runs a complete universe cycle:
1. 1,230-game 2026–27 regular season
2. Awards
3. Play-In and playoffs
4. Champion
5. Aging/development/retirement/contracts
6. 60-pick draft
7. Competitive free agency
8. Opening-night roster cleanup
9. Complete 1,230-game 2027–28 season

Seeded result:
- 139 free agents entering the post-draft market
- 80 formal offers seeded at the start of free agency
- 89 player decisions during the seven-day main wave
- 50 players remained on the open market after the main wave
- 2027–28 then completed all 1,230 games successfully

## Regression suite
The following v0.12/v0.11 systems were re-run against v0.13 and pass:
- CBA helper model
- App-level CBA integration
- Draft-pick trades and conveyance
- Smart front-office behavior
- Full regular-season simulation
- Game Day possession/rotation/injury integration

Game Day seeded regression:
- 111–115 final
- 216 possessions
- forced in-game injury persisted to the GM medical system

## Known boundaries
The free-agency system is operational and competitive, but it does not yet model every specialist NBA transaction edge case. In particular, pending offers do not reserve cap room, sign-and-trades are not part of the bidding flow, and player preference/market-appeal values are NBA Courtside simulation traits rather than real-world claims.
