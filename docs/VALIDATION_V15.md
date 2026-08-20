# NBA Courtside v0.15 — Validation

Validation was run against `/mnt/data/NBA-Courtside-Draft-Offseason-v0.15/` after the Draft + Offseason Experience integration.

## Draft + offseason bridge
`node scripts/test_draft_offseason_v15.js`

Passed a complete real game-to-offseason bridge:
1. 1,230-game regular season.
2. Awards.
3. Full Play-In/playoffs and champion.
4. Lottery Night phase.
5. 16-slot lottery reveal.
6. 60-prospect generated future class.
7. Scouting-point spend.
8. Private workout.
9. User draft-board reorder.
10. 60 completed draft selections.
11. Four-year rookie contract creation for user selections.
12. Competitive free agency completion.
13. Training Camp transition.
14. Final 15-player roster.
15. Next-season start.
16. 240-minute user rotation.

Deterministic output included:
- state version 15;
- Miami as the prior-season test champion;
- 60 draft selections;
- 2 Philadelphia user selections in that fixed test universe;
- 2027–28 as the next season;
- exact 15-player Opening Night roster;
- 240 target rotation minutes.

The champion and draft positions are test-universe results, not hard-coded intended outcomes.

## Draft-night trade regression
`node scripts/test_draft_trades_v15.js`

Passed:
- user trade-down offer generated from a controlled No. 10 slot;
- later current pick ownership moved to the user;
- future draft asset transferred;
- CPU immediately made the acquired current selection;
- controlled trade-up moved the user from No. 25 to No. 20;
- live draft-slot owners changed correctly;
- both deals persisted to `draftExperience.tradeHistory`.

## Game Day regression
`node scripts/test_gameday_v15.js`

Passed:
- 240-minute rotation targets for both teams;
- detailed Game Day completed 216 possessions in the deterministic test;
- forced mid-game injury removed the player early;
- injury persisted to the medical ledger and result object;
- Game Day availability report surfaced the injury;
- result engine marker updated to `courtside_v15_possession`.

## Structural data audits
`python scripts/audit_v05.py`
- 30 teams.
- 1,230 regular-season games.
- 82 games per team.
- 41 home / 41 away.
- postseason, awards, development, draft and next-season markers present.

`python scripts/audit.py`
- 30 teams.
- 442 player/rights records.
- 392 statistically rated.
- 44 projection-pending.
- 3 initial unsigned RFAs.
- 0 duplicate identities.

## Syntax checks
- `node --check app.js` — pass.
- `node --check gameday.js` — pass.

## Known prototype boundaries
- Future class prospects are fictional by design from the present-day save start.
- Scouting narrows uncertainty but is not a complete amateur-stat database/scouting model yet.
- Lottery dates and Draft Night dates remain deterministic simulation dates.
- Draft-night trading covers current-pick swaps plus future draft assets. Every specialized NBA draft-rights/CBA edge case is not yet certified.
- The modeled rookie salary curve remains a prototype pending exact year-specific scale certification.
