# NBA Courtside — Exhibition Prototype v0.1

A deliberately small, mobile-first GitHub Pages prototype built to answer one question first: **is the simulated basketball game fun and believable enough to build the franchise systems around it?**

## Included

- 8 players per side
- Five-player on-court lineups + three-player bench
- Possession-by-possession simulation
- Temporary player-specific shooting, usage, passing, rebounding, defense and turnover inputs
- Fatigue and automatic rotations
- User coaching controls:
  - Offense: Balanced / Attack Rim / Shoot 3 / Feed Star / Pick & Roll
  - Defense: Balanced / Protect Paint / Pressure 3 / Switch
  - Pace: Slow / Normal / Fast
  - Rotation: Star Heavy / Balanced / Fresh Legs
- CPU strategy changes late in games
- Live game feed and full box score
- Run alerts and clutch-mode pauses
- 50-game simulation lab for quick tuning
- iPhone-first visual layout

## Important prototype note

The player inputs in `app.js` are **temporary test values**. They are close enough to recognizable player profiles to test the simulation, but they are not yet the final NBA.com-derived data model. The next data pass should replace these inputs with an authored/statistical pipeline using selected NBA seasons.

## Run locally

Open `index.html` in a browser, or serve the folder with any basic local web server.

## GitHub Pages

Upload the contents of this folder to a repository and enable GitHub Pages from the repository root. `index.html` is already the entry point.

## What to judge

Do not judge the franchise layer yet. Play/replay the exhibition and focus on:

- Do final scores look plausible?
- Does Boston feel stronger without being unbeatable?
- Do stars naturally lead scoring and usage?
- Do different tactics visibly change shot profile and game flow?
- Does fatigue make the bench matter?
- Does the final two minutes feel more involving?
- Is the amount of user control enough without manually playing basketball?

Those answers should drive v0.2.
