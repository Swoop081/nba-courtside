# NBA Courtside v0.6 — Exhibition Match Pass

## Purpose
v0.6 adds the first fully playable/watchable exhibition game on top of the v0.5 franchise loop while preserving the large, image-heavy, iPhone-first GM presentation.

## Match setup
- Any of the 30 NBA teams can be selected as home or away.
- Exhibition reads the frozen 19 Aug 2026 player database by default.
- When a v0.5/v0.6 franchise save exists on the same browser/origin, exhibition reads that current universe's assignments, player overrides, salaries, generated players, trades and signings.
- Team selection uses NBA logos, team colours and the top player portraits rather than a dense text list.

## Depth charts and minutes
- A positional starting five is selected at PG / SG / SF / PF / C using listed positions plus flexible adjacent-position fit.
- The user can choose a Tight (8), Balanced (10) or Deep (up to 11) rotation for the home team.
- The CPU away team uses a balanced rotation.
- Every rotation is allocated exactly 240 target regulation minutes.
- A 48-segment minute schedule is generated from those targets.
- Five unique players are kept on court at all times.
- Substitution events are surfaced in the live feed.
- Player energy falls while on court and recovers on the bench. Stamina ratings affect the rate of fatigue.
- Late-game lineup selection biases toward higher-rated closers while remaining close to target minutes.
- In the smoke-test sample, actual regulation player minutes averaged about 0.43 minutes away from their assigned targets.

## Possession engine
Each possession uses the current five players on each side and draws from the same player foundation used by the GM sim:
- shot volume / usage proxy
- three-point tendency
- free-throw rate
- finishing and 3PT ability
- playmaking
- ball security
- perimeter and interior defence
- offensive and defensive rebounding
- stamina / fatigue
- 2025–26 shooting percentages when available

Tracked live box-score statistics:
- MIN
- PTS
- REB
- AST
- STL
- BLK
- TOV
- FGM/FGA
- 3PM/3PA
- FTM/FTA
- PF

## Watch controls
- Watch Live
- Pause
- 1× / 2× / 4× watch speeds
- Sim 1 minute
- Sim to end of quarter
- Sim final

The game supports overtime automatically if regulation ends tied.

## Validation
Node smoke tests cover all 30 teams and confirm:
- all 30 teams can generate a five-player starting lineup
- every team can generate an 8+ player exhibition rotation
- each balanced rotation assigns exactly 240 target regulation minutes
- each of the 48 regulation segments contains five unique players
- completed games never finish tied
- team player-minute totals equal 240 in regulation and add 25 minutes per overtime

A 30-game engine sample produced:
- average team score: 113.0
- average combined possession events: 215.0 (~107.5 per team)

These are development calibration results, not claims about real 2026–27 NBA outcomes.
