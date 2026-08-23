# NBA Courtside v0.52 — League AI Roster-Building Audit

## Goal
Make CPU franchises behave like multi-year basketball organizations rather than isolated transaction generators. Every team derives a live competitive state from standings, roster power, age curve, stars, young core, payroll and draft capital.

## Franchise states
Contender, Cap-Constrained Contender, Aging Contender, Emerging Young Core, Fringe Playoff, Re-tool, Rebuild and Early Rebuild. These are recalculated from the current save rather than permanently assigned.

## Persistent plan
`state.leagueAiV52.plans` stores season/team plans with competitive horizon, pick posture, preferred age window, spending ceiling, roster-balance holes, protected core and expendable contracts. Plans are refreshed after material roster transitions.

## Decision integration
- **Draft:** CPU boards use a deterministic team-specific scouting error plus talent, upside, need, volatility and timeline. CPU teams do not get a universal exact-value shortcut.
- **Free agency:** pursuit checks role pathway, roster need/logjam, competitive age window, cap plan and coach/roster environment.
- **Extensions:** stars, young value and core pieces can be retained before expiration; rebuilding teams avoid reflexively extending aging non-core veterans.
- **Waivers/cuts:** core and development assets are protected before low-priority redundant contracts.
- **Trades:** buyers target actual roster holes; sellers avoid moving protected young/core pieces; first-round-pick posture and existing CBA/Stepien legality remain authoritative.
- **RFA:** CPU matching uses core status, age, fit, cap route and franchise timeline.

## Roster-balance model
The audit tracks ball handling, shooting, wing depth, rim protection, secondary creation and center depth, while also flagging positional logjams. CPU acquisition scoring asks where a player would actually play.

## Long-save audit
`leagueAuditV52()` records season audit snapshots and flags three especially damaging long-save patterns: positional logjams, multiple young rotation-caliber players without a pathway, and deep second-apron payroll on non-contenders.

## Compatibility
Formal save schema remains 25. v0.52 is additive under `state.leagueAiV52`; no franchise restart is required. v0.51 development history remains attached to players across teams and is consumed by the CPU valuation model rather than replaced.
