# NBA Courtside — Career Development Model

NBA Courtside uses **one evolving player entity per real player**. There are no collectible historical versions. Current ability changes as the save advances.

## Career stages

The v0.2 data layer assigns a broad current stage and trend:

- **Development** — young players with substantial growth runway
- **Approaching Prime** — established players still improving toward their best years
- **Prime** — expected peak-performance window
- **Late Prime** — still high-level but beginning to lose some physical upside
- **Decline** — post-prime abilities trend downward
- **Late Career** — accelerated age-related decline and increasing retirement probability

Default broad prime windows in the scaffold are:

- Guards / wings: **25–29**
- Bigs: **26–30**

These are defaults rather than hard-coded destiny. Individual player archetypes, hidden ceilings and development rates can shift the actual curve.

## Development acts on attributes, not Overall

The save engine should never directly apply `Overall +1` or `Overall -2` as the primary mechanism. It changes underlying basketball attributes, then recalculates the summary ratings.

Expected aging behavior:

- Speed, acceleration, lateral movement and vertical athleticism generally peak earlier and decline faster.
- Strength can hold or improve later into a player's twenties.
- Shooting can improve through a player's prime and often declines more slowly than athletic traits.
- Passing, decision-making and basketball IQ can peak later and remain valuable well into a veteran career.
- Stamina and durability generally erode with age, with significant player-to-player variance.
- Rebounding and interior play combine physical size, strength, positioning and athletic decline rather than following one generic age curve.

## Controlled variance

Real career shape provides a plausible starting expectation, but the user's save should be alternate history rather than a replay script.

Development can be influenced by:

- age
- hidden potential / ceiling
- minutes and role
- injuries and durability
- team environment and fit
- development opportunity
- controlled random variance

A highly rated prospect should usually become good, but not hit the exact same peak in every save. A veteran should generally decline after his prime, but the rate can vary.

## Stats emerge from context

Ratings are not the player's box score. Simulated production should emerge from:

- underlying ability
- minutes
- role and usage
- teammates
- lineup fit
- opponent quality
- pace / team system
- fatigue and injuries
- league environment

This allows a player's PPG to rise even while an underlying attribute declines if his role expands, and prevents development from becoming a deterministic list of yearly box-score targets.

## Rookie handoff

Rookies without NBA minutes begin from a translated pre-NBA projection. As NBA evidence accumulates, the current-skill estimate moves from projection toward NBA-derived performance.

Planned handoff:

`nba_weight = min(1, career_nba_minutes / 1500)`

At roughly 1,500 career NBA minutes, current ability should be driven primarily by NBA evidence rather than the original college/international projection, while hidden potential and career development remain active.
