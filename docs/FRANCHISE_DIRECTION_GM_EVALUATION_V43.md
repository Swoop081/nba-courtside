# NBA Courtside v0.43 — Franchise Direction + GM Evaluation

v0.43 adds a persistent strategic layer above the existing Living League systems without changing formal save schema 25 or retuning the game simulation.

## Franchise Direction
- Every franchise receives an opening ownership brief derived from its current competitive window, roster power, payroll, age curve and draft position.
- Real owner/governor names come from the existing organization identity layer. **Management style, patience, priorities and evaluation weights are explicitly simulated gameplay constructs, not factual claims or real-world quotes.**
- The opening brief can be acknowledged, but it is not an artificial calendar blocker.

## Season Objectives
Five core objectives are tracked plus one optional stretch objective:
1. Competitive results / postseason expectation.
2. Young-core development or development-value progress.
3. Financial discipline against the club's modeled ownership directive.
4. Roster-building / future-asset or contender-core preservation.
5. Player management through chemistry, trade requests and urgent conversations.
6. Optional stretch target for outperforming the win/postseason expectation.

Competitive expectations are dynamic. Major long-duration injuries to high-value players can reduce the modeled win target while leaving roster, player-management and financial accountability intact.

## GM Evaluation
GM performance is scored across:
- Results
- Roster Building
- Player Management
- Financial Management
- Organizational Direction

The overall grade uses the franchise's simulated ownership-style weighting and maps to Excellent / Strong / Stable / Under Pressure / Critical.

Ownership confidence is persistent within the season and changes at formal reviews rather than oscillating every render.

Existing in-progress v0.42 franchises initialize with a current ownership review at their v0.43 activation date rather than fabricating historical reviews for checkpoints that already passed.

## Review checkpoints
- Opening Night
- 20-Game Review
- New Year Review
- Trade Deadline Review
- Regular-Season Review
- End-of-Season Review after the NBA Finals

Each review stores the score, standing, ownership confidence, pillar breakdown and a short strongest-area / biggest-concern explanation.

## Career foundation
Before the offseason advances to the next league year, the completed season's GM evaluation is archived in `state.gmCareerHistory`. This creates the data foundation for later firing, extension, reputation and team-hopping systems without implementing those consequences prematurely in v0.43.

## Presentation
- Home adds a compact Franchise Direction briefing beneath the universal GM Action Center.
- More adds a Franchise Direction destination.
- The dedicated Direction screen presents the ownership brief, GM score, five evaluation pillars, dynamic expectation adjustments, objective cards, ownership review timeline and prior GM career reviews.
