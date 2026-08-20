# v0.14 — Postseason Experience

## Goal
The postseason should feel like the payoff for every roster, cap, rotation, injury, morale, trade and free-agency decision made during the season. v0.14 therefore removes the old "simulate an entire round" presentation and gives the postseason the same persistent Game Day loop as the regular season.

## Play-In Tournament
Each conference starts with its regular-season seeds 7–10.

1. Seed 7 hosts Seed 8. The winner becomes the No. 7 playoff seed.
2. Seed 9 hosts Seed 10. The loser is eliminated.
3. The loser of 7/8 hosts the winner of 9/10. The winner becomes the No. 8 playoff seed.

A user-controlled Play-In game stops progression and becomes a scheduled Game Day. CPU games on the same playoff night can be simulated separately.

## Best-of-seven playoffs
The playoff bracket contains:
- First Round — 8 series
- Conference Semifinals — 4 series
- Conference Finals — 2 series
- NBA Finals — 1 series

Every series is first to four wins and uses a 2-2-1-1-1 home pattern. The semifinal bracket preserves the standard 1/8-versus-4/5 and 2/7-versus-3/6 paths within each conference. Finals home court is determined from the finalists' regular-season performance.

## User Game Day
The next unresolved postseason game involving the user's franchise is never silently quick-simmed by calendar advancement.

The user can choose **Watch Game** or **Sim Game**. Both open the same `gameday.html` simulation; Sim simply fast-forwards it.

Pregame/postgame presentation can identify:
- Play-In
- First Round
- Conference Semifinals
- Conference Finals
- NBA Finals
- series tied / series lead
- closeout chance
- elimination game
- win-or-go-home game

Injuries and rotation availability continue to apply in postseason Game Day.

## CPU playoff nights
CPU postseason games can advance in date-grouped waves rather than resolving a whole round at once. This lets the bracket, series scores and League view evolve incrementally while preserving the user's next game as the main gate.

## Separate playoff statistics
Postseason games write to:
- `postseasonResults`
- `playoffStats`
- `playoffGameLogs`

They do not write into regular-season `seasonStats` or regular-season results. The UI exposes live playoff scoring, rebounding and assist leaders separately from regular-season leaderboards.

## Bracket and series presentation
The postseason home and League screens now include:
- live bracket rail across all rounds
- seed and team identity
- series score
- last result
- next game state
- user-series spotlight
- most recent playoff-night moment
- playoff leaders

If the user's team is eliminated, the league postseason remains viewable and can still be advanced through the Finals.

## NBA Finals and championship
The Finals receive a dedicated visual treatment. When the Finals end:
- the champion is persisted
- a Finals MVP is selected from the champion's Finals box-score production
- the championship screen shows the champion, key roster portraits, Finals result, Finals MVP and the full four-round championship path
- Finals MVP and Finals result are written into the league-history entry when the offseason begins

## Legacy save migration
The primary schema is now version 14 using `nbaCourtsideSaveV14`.

Older saves migrate forward. A legacy save already inside the old v0.13 postseason flow is converted into v0.14 postseason game/series state where possible so an in-progress franchise is not stranded by the upgrade.

## Simulation boundary
NBA Courtside currently has two computational paths:
- user Watch/Sim games use the detailed possession-level Game Day engine
- background CPU-vs-CPU playoff games use the faster league simulation

Both draw from the persistent universe's rosters, ratings, availability and rotations, but they are not identical computational implementations.

Postseason dates also remain part of the deterministic NBA Courtside schedule scaffold. v0.14 does not claim to import exact future official NBA playoff dates.
