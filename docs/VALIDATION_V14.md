# NBA Courtside v0.14 — Validation

Validation was run against `/mnt/data/NBA-Courtside-Postseason-v0.14/` after the Postseason Experience integration.

## Postseason engine
`node scripts/test_postseason_v14.js`

Passed:
- v14 state created.
- complete Play-In + four-round postseason resolved.
- 8 First Round, 4 Conference Semifinal, 2 Conference Final and 1 NBA Finals series created.
- every playoff series ended with exactly four wins for the winner.
- 93 postseason games in the deterministic test run.
- 206 players accumulated playoff stats.
- Miami won the deterministic test universe.
- Finals MVP was produced.

## User postseason flow
`node scripts/test_postseason_user_flow_v14.js`

Passed:
- user franchise postseason games were exposed as user Game Day gates.
- CPU playoff nights advanced around those gates.
- Toronto entered the deterministic test as the East No. 5 seed.
- 15 user postseason games were routed through the user-game path in this test.
- 30 CPU playoff-night advances occurred.
- postseason completed with a champion and Finals MVP.

## Postseason Game Day
`node scripts/test_gameday_postseason_v14.js`

Passed:
- postseason Game Day recognized a First Round Game 1.
- stakes presentation generated correctly.
- detailed possession engine completed a 128–107 test game over 214 possessions.
- 20 players accumulated playoff data.
- zero regular-season player-stat records were modified by the postseason game.
- result engine marker: `courtside_v14_postseason_possession`.

## Complete franchise loop
`node scripts/test_franchise_loop_v14.js`

Passed the full bridge:

1. 1,230-game 2026–27 regular season.
2. Awards.
3. Game-by-game postseason.
4. Champion + Finals MVP.
5. Offseason transition.
6. 60-pick draft.
7. Competitive free agency.
8. Opening-night roster trim.
9. Next-season start.
10. 1,230-game 2027–28 regular season.

Deterministic output included:
- version 14
- 93 first-season postseason games
- Miami champion
- Giannis Antetokounmpo Finals MVP
- 60 draft picks completed
- free-agency wave completed
- next season identified as 2027–28
- postseason state reset correctly for the new year
- playoff stats reset correctly for the new year

These names/results are outputs of the fixed test universe, not hard-coded intended outcomes.

## Carried-system regressions
The following existing suites were re-run against the v0.14 codebase and passed:
- Contracts/CBA regression
- CBA app-integration regression
- Proper Free Agency regression
- Smart Front Offices regression
- Draft-pick trade/ownership regression
- full regular-season injuries/morale/CPU-transaction regression

The full-season regression completed all 1,230 regular-season games with the existing morale, trade-request, CPU-trade and medical-event systems active.

## Structural data audits
`python scripts/audit_v05.py`
- 30 teams
- 1,230 regular-season games
- 82 games per team
- 41 home / 41 away
- postseason, awards, offseason, lottery and next-season markers present

`python scripts/audit.py`
- 30 teams
- 442 player/rights records
- 392 statistically rated
- 44 projection-pending
- 3 initial unsigned RFAs
- 0 duplicate identities

## Known prototype boundary
The v0.14 postseason calendar uses deterministic simulation dates rather than a certified import of exact future official NBA playoff dates. Background CPU playoff games use the fast league simulator while user Watch/Sim games use the detailed possession engine; both use the same persistent roster/ratings/rotation universe but are not identical computational paths.
