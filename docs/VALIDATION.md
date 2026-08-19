# NBA Courtside v0.9 — Validation

## Structural baseline
- 30 teams
- 442 player records
- 1,230 regular-season games
- 82 games per team
- 41 home / 41 away per team

## Injury-system deterministic tests
`node scripts/test_injuries_v09.js`

Verified:
- v0.8 saves migrate to v0.9
- forced injuries persist with start / return dates
- injured players leave the effective rotation
- replacement rotation remains exactly 240 target regulation minutes
- league and team medical reports render
- the saved preferred rotation restores after recovery when still legal
- organic injury generation runs alongside ordinary quick-sim games
- League Pulse can surface a major-player injury story
- Home and Roster views render with medical state

Deterministic 260-game sample:
- 20 medical-history events including the forced test case
- 5 active injuries at the sample endpoint
- Toronto rotation: 240 minutes after recovery
- MVP race and League Pulse remained functional

## Full-season stress test
`node scripts/test_full_season_v09.js`

Verified across all 1,230 games:
- no simulation crash
- 77 medical events in the seeded test universe
- minimum effective rotation size stayed at 10 players
- all 1,230 results completed
- season awards still generated

Those counts are deterministic test-universe outcomes, not hard-coded targets.

## Game Day injury integration
`node scripts/test_gameday_v09.js`

Verified:
- 240-minute pregame rotations
- an in-game injury removes the player from the remaining rotation
- five-player lineups continue automatically
- final team minutes reconcile to 240 in regulation
- injury persists into the franchise save
- result stores its medical event
- season stats and box score still persist

Seeded smoke result: 115–111 Toronto, 216 possessions. Immanuel Quickley left after 1.1 minutes in the forced-injury test and the engine completed the game normally.
