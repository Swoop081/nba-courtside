# v0.44.1 — Primary Action Hierarchy

## Locked interaction rule

NBA Courtside must present the user's immediate, consequential action before informational modules. On franchise screens, the first actionable region under the persistent franchise header is the **Primary Action Zone**.

Priority order:
1. Blocking GM decisions.
2. Game Day controls (Watch / Sim).
3. Calendar progression (Advance Day / Sim To Next Game / Sim 7 Days).
4. Current phase progression (Start Season, postseason advancement, draft/free-agency advancement, offseason progression).
5. Screen-specific commit actions such as Propose Trade when they are available.

Secondary information — media presentation, ownership evaluation, roster summaries, news, league wire, scouting detail and explanatory modules — follows the action zone. Contextual row-level actions remain attached to their relevant rows/cards rather than being detached from context.

## Game Day

Pregame Watch Game / Sim Game controls appear directly after the matchup hero. Live Watch / Sim controls appear directly below the scoreboard before coaching detail, lineups, feed and box score.

## Implementation

The franchise app promotes the existing action DOM nodes into the top zone after render rather than cloning them. This retains original IDs, handlers, disable states and blocking logic, and avoids duplicate actions. No simulation or save-schema behavior changes.
