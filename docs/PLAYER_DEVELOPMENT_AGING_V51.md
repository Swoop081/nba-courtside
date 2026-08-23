# NBA Courtside v0.51 — Player Development + Aging Deepening

## Purpose
v0.51 turns annual player progression into a multi-factor career-arc model. It preserves the v0.50 coaching/development-plan system but stops treating development as a nearly uniform age-based Overall adjustment. Outcomes now depend on the player's career stage, opportunity, coaching environment, training load, G League reps, playoff experience, injury history and development volatility.

## Career arcs
Players move through position-aware prime windows and readable stages: Early Development, Development, Approaching Prime, Prime, Late Prime, Early Decline, Decline and Late Career. A small deterministic career-profile layer also allows late bloomers and early peaks. Young players can break out, stagnate or miss; veterans can preserve learned skills while losing more physical tools.

## Opportunity
NBA games/minutes matter, but do not guarantee growth. Young players benefit from meaningful rotation or starter minutes; being buried can slow development. Playoff experience adds a small positive signal. G League assignments now accumulate development days, providing useful reps for young/two-way players who are not receiving major NBA minutes.

## Training load
Each user-controlled player can be set to Light, Standard or Aggressive training. Light work favors health and veteran preservation. Standard is balanced. Aggressive work increases development stimulus, especially for younger players, but raises in-season injury exposure. Training load belongs to the team context and does not automatically follow a player after a move.

## Skill-specific progression
Annual development no longer moves every skill identically. Shooting, Playmaking, Defense, Strength, Conditioning and Finishing plans target relevant skill groups. Athletic/conditioning/finishing-type tools decline more sharply with age and major injuries; shooting, free throws, ball security and playmaking can hold longer into a veteran's career. Overall remains a summary output, not the sole development mechanic.

## Health effects
Season injury burden affects development. Longer absences and severe injuries reduce annual growth and can accelerate physical decline, especially for older players. Medical/staff systems remain authoritative for recovery and injury prevention; v0.51 consumes their resulting injury history rather than replacing them.

## Role evolution
Player profiles now surface projected role evolution. Older creators may transition toward secondary or bench-organizer roles; wings may age into 3-and-D veteran roles; bigs may shift toward stretch, rim-protection or backup identities based on retained skills. This is descriptive career planning, not a fixed archetype lock.

## Development reporting
Staff + Organization → Development now shows current career stage, volatility, opportunity, G League time, health context and training load alongside the retained skill focus and role target. Home can surface Development Watch alerts for strong growth environments or meaningful regression risk. Player profiles retain a season-by-season development ledger with Overall movement and the largest skill changes.

## Historical persistence
Every completed v0.51 development season is stored under `state.playerDevelopmentV51.history` and attached to the v0.47 season archive when available. The record follows the player across teams and GM job changes. v0.49 Draft Intelligence snapshots are never rewritten; drafted players can later be compared against the information the GM actually had on Draft Night.

## Save compatibility
Formal franchise schema remains 25 with `nbaCourtsideSaveV25`. v0.51 is additive under `state.playerDevelopmentV51`; no franchise restart is required.
