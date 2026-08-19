# NBA Courtside v0.10 — Validation

## Structural audit
- 30 NBA teams
- 442 base player records
- 392 statistically rated players
- 44 projection-pending / rookie-path records
- 3 unsigned RFAs represented through rights rather than fake contracts
- 0 duplicate player identities
- 1,230 regular-season games
- 82 games per team
- 41 home / 41 away per team
- Existing postseason, awards, aging/retirement, lottery, fictional draft and next-season loop markers preserved

## Roles + morale test
A controlled low-minute test was run against Toronto's highest-rated player in the test save.

- Expected role: Star
- Expected minutes: 33
- Actual controlled sample: 8.0 MPG
- Role dissatisfaction was detected
- A player meeting was generated with ROLE as the primary concern
- Choosing INCREASE ROLE moved the target from 8 to 33 minutes
- A 14-day role promise was created at 33 minutes

## Full-season stress test
A deterministic 1,230-game regular season was simulated with injuries, morale updates and CPU logic active.

Result:
- 1,230 / 1,230 games completed
- 433 active morale profiles maintained
- 40 players finished below 55 morale in the seeded test universe
- 2 trade requests emerged naturally
- 83 medical events occurred
- Minimum tested active rotation size remained 10 players
- Award generation remained functional

The exact counts above are seed outcomes, not hard-coded season targets.

## Game Day regression
The v0.10 Game Day possession engine still completed correctly with a forced in-game injury:
- final score: 115–111
- 216 possessions
- injured player left early and remained in the postgame medical state
- target-minute / box-score integration remained intact
- result engine stamped `courtside_v10_possession`

## Save migration
v0.10 reads the v0.10 save key first and migrates v0.9 / v0.8 / v0.7 / v0.5 / v0.4 saves forward. Game Day uses the same v0.10 save key.
