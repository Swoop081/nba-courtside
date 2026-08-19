# NBA Courtside — Matchup Lab v0.3

Mobile-first GitHub Pages exhibition prototype focused on a clearer five-on-five possession interface.

## What changed in v0.3

- Removed the tall duplicate player-card row from the game screen.
- Boston and Los Angeles now share one compact 5-on-5 matchup board.
- The small square player portraits are now the main interaction surface.
- All five Lakers portraits are tappable.
- Lakers stamina is displayed directly beneath each portrait.
- The current ball handler is outlined in orange.
- On defense, each Laker is positioned directly underneath the Celtic he is assigned to guard.
- The on-ball defender is highlighted in red.
- Defensive **SWITCH** is now functional: choose SWITCH, then tap a second Laker to swap assignments. The defenders physically swap columns under their new matchups.
- Court-location/context text remains under the prominent 24-second shot clock.
- Context-sensitive offense, off-ball actions, defense, simulation controls and Autopilot remain intact.

## Existing test systems

- 8-player Lakers and Celtics rosters (5 on court + 3 bench)
- Ball-handler and off-ball offensive actions
- Defensive actions and CPU reactions
- Shot-clock/game-clock time consumption
- Passing, drives, screens, post-ups, cuts, spacing, shots, rebounds and turnovers
- Play Both / Offense Only / Defense Only
- Sim Possession / Sim 1 Minute / Sim to Quarter
- Continuous Autopilot / Take Control
- Automatic bench rotation and stamina
- Live feed and box score

## Run locally

Open `index.html` in a browser. Player headshots are loaded from the NBA CDN, so an internet connection is needed for imagery.

## GitHub Pages

Upload the contents of this folder to the repository root (or your Pages folder). There is no build step or dependency installation.

## Important

The player ratings and statistical inputs remain temporary prototype values. This build is specifically for testing whether the compact matchup board makes offense, defense and switching easy to follow on iPhone.
