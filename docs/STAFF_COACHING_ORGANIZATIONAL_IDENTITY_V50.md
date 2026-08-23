# NBA Courtside v0.50 — Staff, Coaching + Organizational Identity

## Purpose
v0.50 turns the retained v0.38 staff-career foundation into an active basketball system. It does not replace player ratings, CBA logic, the simulation engine, GM Career, Draft Intelligence or the action-first presentation hierarchy. It adds bounded coaching/staff influence and clearer organizational decision context.

## Coaching model
Every active head coach now exposes a readable tendency profile: pace, offensive/defensive scheme, rotation depth, youth trust, adaptability, usage concentration and development emphasis. Coach ↔ roster fit identifies personnel strengths and scheme conflicts. Small bounded simulation effects remain subordinate to player quality and health.

## Staff structure
Existing assistants are mapped into five functional roles: Lead Assistant, Offensive Assistant, Defensive Assistant, Player Development and Shooting + Skills. Role assignment is persistent and refreshes when staff changes. Health + Performance remains the separate medical/performance department already present in Team Workspace.

## Staff evaluation
Staff comparison uses six dimensions: Tactics, Development, Player Management, Adaptability, Scouting and Reputation. Staff chemistry combines front-office/head-coach alignment, complementary assistant quality and player-management ability. The resulting status is Elite, Strong, Functional, Fragile or Clashing.

## Player development
The user can set an individual skill focus and projected role target. Focus categories are Shooting, Playmaking, Defense, Strength, Conditioning and Finishing. Development remains probabilistic. Stronger development environments improve the chance and specificity of a focused skill gain but never guarantee one and do not replace the retained age/trajectory development engine.

## Hiring and staff careers
The existing staff market, contracts, renewals, firings, CPU coaching changes and assistant promotion/poaching pool remain in place. Interviews now reveal simulated philosophy fit and candidate demands. These are gameplay constructs, not factual claims about real coaches.

## Organizational identity
Each franchise receives emergent identity tags from its current coach, roster age/timeline and franchise direction. Identity changes when the organization changes; it is not a permanent perk selected at franchise creation.

## Game Day delegation
The prior Full Auto option is relabeled **Delegate**. In Delegate mode, the head coach's own rotation depth, scheme defaults, game-management timeout threshold and adaptability influence automated decisions. Assisted and Manual modes remain unchanged choices. Tactical effects stay bounded and do not override player ratings.

## Persistence
`state.staffCoachingV50` is additive under schema 25. Completed v0.50 seasons append coaching/identity snapshots to the v0.47 league-history archive so old franchise eras remain historically accurate after future coach changes or GM team switches.
