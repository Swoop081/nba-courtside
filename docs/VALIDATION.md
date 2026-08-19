# v0.7 Validation

Validated 19 Aug 2026 development build.

- 30 NBA franchises available for GM selection.
- 442 base player records.
- 1,230-game regular-season calendar scaffold.
- 82 games per team / 41 home / 41 away.
- Every team generates a legal 5-starter rotation with 8–11 active rotation players.
- Every regulation rotation totals exactly 240 target minutes.
- User minute adjustments remain zero-sum at 240.
- Calendar advancement stops on the user's next unsimulated scheduled game instead of silently simulating it.
- Scheduled Game Day exposes Watch Game and Sim Game from GM mode.
- Watch and Sim routes use the same `gameday.js` possession engine; Sim is a fast-forward path.
- Game Day smoke test completed 218 possessions, 10-player rotations per side, full box scores, season stat accumulation and per-player game logs.
- Regulation team minutes reconcile to 240; overtime adds 25 player-minutes per OT.
- GM home UI contains no player-facing Exhibition mode or launcher.
- Existing postseason, awards, aging/retirement, lottery, fictional draft and next-season loop structural audit still passes.
