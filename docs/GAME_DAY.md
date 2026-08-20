# Game Day — Current through v0.14

## Product direction
NBA Courtside is a GM/franchise game. The former Exhibition page was a fast development harness used to validate the match presentation and simulation engine; it is not a separate player-facing mode.

## GM rotation control
- Persistent PG / SG / SF / PF / C starters for the user franchise.
- Rotation presets: 8-man, 9-man, 10-man, Deep.
- User target minutes always rebalance to exactly 240 regulation minutes.
- CPU teams create and maintain their own legal rotations.
- Trades, signings, waivers, retirements and drafted players invalidate/rebuild affected rotations automatically.

## Scheduled Game Day
- Season advancement stops when the user's next unsimulated scheduled game is reached.
- The Home screen exposes WATCH GAME and SIM GAME for that matchup.
- Both paths open `gameday.html`; `mode=sim` merely fast-forwards the same possession engine used by Watch Game.
- The pregame screen shows both teams' depth charts and target minutes.
- Games maintain five players on court, automatic substitutions, fatigue/energy, current-five presentation, play-by-play and overtime.

## Persistent results
A completed Game Day writes back to the GM save:
- final score and winner
- full home/away box scores
- player minutes
- PTS / REB / AST / STL / BLK / TOV / FG / 3PT / FT / PF
- per-player season totals
- per-player game log
- Player of the Game summary
- standings / team records through the shared results table

Player profiles switch to the live universe's 2026–27 statistics once games have been played, while the imported 2025–26 line remains the starting-data reference.

## Background league simulation
CPU-vs-CPU games use the same persistent rosters, ratings and 240-minute rotation profiles and generate complete box-score/stat lines through the fast league simulator. The user's scheduled games are never silently quick-simmed when the calendar reaches them; Game Day is the gate.

## Internal QA harness
`exhibition.html` is retained only to rapidly test arbitrary 30-team matchups. It is deliberately unlinked from the product UI.

## v0.14 postseason integration
- Game Day accepts both regular-season schedule IDs and persistent v0.14 postseason game IDs.
- Play-In, First Round, Conference Semifinal, Conference Final and NBA Finals games use the same Watch/Sim possession engine.
- Postseason results write to separate playoff result/stat/game-log stores and do not contaminate regular-season statistics.
- Series state is reconciled after the final buzzer so the bracket, next game and elimination/closeout stakes update immediately.
