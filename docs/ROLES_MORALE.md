# Roles + Morale — v0.10

## Design goal
Make minutes, team success and roster decisions create human consequences without turning NBA Courtside into a dialogue simulator.

## Expected roles
Role is contextual to the player's current roster, not a permanent card label. The engine classifies players as Franchise Star, Star, Starter, Sixth Man, Rotation, Prospect, Veteran or Reserve based on team rank, current ability, age and career stage. Each role carries an expected-minute baseline.

## Morale inputs
Morale is a weighted 0–99 score built from:
- role / playing time satisfaction
- winning
- contract value / security
- team direction
- stability

Each player receives deterministic personality weights. Younger players lean more toward development and role; older established players generally care more about winning and stability; stars place more pressure on role and winning. These are controlled tendencies, not hard-coded biographies.

## Status bands
- 86–99: THRIVING
- 70–85: CONTENT
- 55–69: UNEASY
- 42–54: FRUSTRATED
- 0–41: WANTS OUT

## Meetings
After a meaningful regular-season sample, unhappy players on the user's team may request a meeting. The user can:
- Increase Role: automatically raises the player's target rotation minutes and creates a 14-day role promise.
- Stay the Course: resolves the meeting without promising change, at a small morale cost.
- Explore Trade: flags the player as requesting / welcoming a trade.

Role promises are evaluated after their deadline. Keeping one creates a morale boost; breaking one creates a significant penalty.

## CPU teams
The same morale state is maintained for CPU rosters. Discontent does not erase talent value, but trade requests reduce the normal star-retention premium and CPU-to-CPU trade logic preferentially shops unhappy players.

## Presentation
Morale is deliberately visual: large status words, portrait clusters, score, reason bars and priority chips. The underlying system is deeper than the UI surface.
