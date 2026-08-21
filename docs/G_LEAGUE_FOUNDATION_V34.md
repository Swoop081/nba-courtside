# NBA Courtside v0.34 — G League Foundation

Frozen: 21 August 2026  
Save schema: 25 (`nbaCourtsideSaveV25`)  
Living G League branch: additive `state.gLeague.version = 34`

## Purpose

v0.34 establishes the NBA G League as a persistent second professional layer beneath the NBA. The design goal is to make development-league talent, Two-Way contracts, affiliate movement and cheap call-ups part of normal franchise management now, while keeping the architecture compatible with a future fully playable G League mode.

## Source-backed league structure

The runtime data bundle contains 31 G League teams: all 30 NBA affiliates plus Mexico City Capitanes as the lone unaffiliated club. 2026–27 relocations/rebrands are represented as Coachella Valley Lakers (LAL) and Laketown Squadron (NOP).

The official 2026–27 Two-Way Tracker snapshot frozen 21 August 2026 is represented as a status layer across all 30 NBA teams. It contains 75 filled slots and leaves open slots visibly open rather than inventing players.

## Roster boundary

Complete 2026–27 G League camp/opening rosters were not treated as published/frozen on the source date. v0.34 therefore does **not** claim a fictional depth chart is a real G League roster. It separates:

1. sourced team/affiliation data;
2. sourced current Two-Way contract status;
3. sourced current G League United call-up scouts;
4. an explicitly simulated league schedule/standings layer.

This keeps the game useful without contaminating the real-world data foundation.

## Call-up scouting

The first live call-up market is the 12-player 2026 G League United roster:

James Bouknight, Jaelen House, Jack Clark, Kylor Kelley, Yuri Collins, Lester Quiñones, Eric Dixon, Jake Stephens, Sean East II, John Ukomadu, Caleb Grill and Phillip Wheeler.

Their visible G League evidence is stored separately from NBA statistics. NBA Courtside applies a confidence-shrunk NBA translation (65–73 OVR in this release), and any materialized NBA player keeps `stats_2025_26 = null` until actual NBA evidence exists.

A user signing is a one-year NBA minimum contract through the existing CBA route. CPU teams can use the same pool on a limited deterministic cadence when they have a standard-roster opening.

## G League simulation

The world model begins in November and balances every G League club to exactly 50 games. It models a 14-game Tip-Off segment followed by a 36-game regular-season segment. This is intentionally labeled a **simulated/provisional schedule** until the exact official 2026–27 schedule is available.

G League simulation uses `hash01` with a G-League-specific key namespace rather than consuming the main NBA RNG. Adding the second league therefore does not change NBA Game Day results merely because another league is being simulated.

## UI integration

- Daily Hub: user affiliate status card.
- League: G League portal.
- Free Agency: G League Call-Ups panel.
- Dedicated G League screen: affiliate/Two-Way status, scouting board, standings, 31-team directory and recent results.
- Player scouting sheet: G League evidence, conservative NBA projection and explicit source boundary.

## Future expansion hooks

The data/state model is ready for sourced 2026–27 full rosters, G League player transactions/rights, complete individual season simulation, full assignment-day tracking, Showcase, playoffs, G League Draft and an eventual playable G League franchise mode.
