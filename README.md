# NBA Courtside — Game Day + Rotations v0.7

Mobile-first static GM/franchise prototype for GitHub Pages.

## Player-facing entry point
- `index.html` — NBA Courtside GM mode. Choose any of the 30 franchises, manage the roster/rotation, advance the league calendar, and launch scheduled Game Day matchups.
- `gameday.html` — opened from the GM schedule for the user franchise's scheduled game. Watch or instant-sim uses the same seeded possession engine and commits the result, box score, minutes, and player game logs back into the franchise save.

The old standalone Exhibition launcher is intentionally **not part of the player-facing game**. `exhibition.html` remains only as a private development/QA harness for quickly testing the match engine with arbitrary teams.

## v0.7 headline
GM mode now owns the match loop: set PG/SG/SF/PF/C starters and a 240-minute rotation, advance to Game Day, then watch or sim the scheduled matchup. Results feed directly into standings, season stats, player profiles, game logs, awards, and the existing franchise loop.

See `docs/GAME_DAY.md` for engine and validation notes.
