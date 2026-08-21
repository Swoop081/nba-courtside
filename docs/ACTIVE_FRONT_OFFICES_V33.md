# NBA Courtside v0.33 — Active Front Offices + Trade Ecosystem

v0.33 turns the Living League's organization directory into an active decision layer. The 29 CPU-controlled NBA clubs now evaluate their own direction, roster needs, transaction appetite and coaching approach as the calendar moves.

## Live team direction

Every club receives a dynamic state derived from record, roster power, age curve, young talent, star talent and impactful injuries:

- CONTENDER
- PLAYOFF PUSH
- COMPETITIVE
- RETOOLING
- REBUILDING
- DEVELOPMENT

Direction can change during the season. It is not a permanent label.

## Simulated front-office model

Each real lead executive is paired with a stable, explicitly **simulated** CPU decision archetype. These are gameplay models, not claims about the real person's views or behavior:

- AGGRESSIVE TRADER
- STAR HUNTER
- PICK HOARDER
- CAP CONSCIOUS
- DEVELOPMENT FIRST
- VETERAN BUILDER

The model contributes to trade-market activity, willingness to move picks, target selection and rumor cadence. Team pages label these models as simulated.

## Owner and coach layer

Each club also receives a live ownership directive based on competitive state and payroll, plus a simulated coaching model for rotation depth, young-player willingness and emphasis. CPU coaching plans may re-evaluate approximately every 14 league days. The user's rotation is never rewritten by this system.

## CPU-to-CPU trade market

Before the deadline, CPU teams can now complete trades without user initiation. Buyers/sellers are selected from live team direction, and targets are filtered by roster need, player availability, trade restrictions, salary matching and pick legality. The market uses team-level cooldowns and ramps up after New Year and again in the final two weeks before the deadline.

Completed trades use the existing transaction engine and become permanent transaction/news history. Hot trade activity can generate a rumor before the completed transaction appears in the league presentation.

## Incoming trade negotiations

Formal offers sent to the user's team are generated from the same CBA and CPU-acceptance logic as the Trade Center rather than canned examples. Pending formal offers still block calendar advancement until the user chooses:

- ACCEPT
- DECLINE
- MODIFY / COUNTER

Modify loads the exact framework into Trade Center. The negotiation layer can then return a CPU counter when the other club is interested but not ready to accept the user's terms.

## Find Me Trades 2.0

The user can shop a multi-asset package of players and/or picks and choose one of five search goals:

- BEST VALUE
- WIN NOW
- DRAFT CAPITAL
- YOUNG TALENT
- CAP RELIEF

The search evaluates actual CPU rosters, pick inventories, trade restrictions, CBA legality and CPU acceptance. It returns up to five frameworks from different counterparties where possible. A displayed result is already legal and acceptable at the moment it is generated; loading it reopens the normal transaction flow for final review.

## Negotiation tools

Trade Center adds first-pass negotiation controls:

- Ask for a legal draft pick
- Remove the lowest-value return player
- Apply/cycle Top-4, Top-8 or lottery protection to a selected outgoing first-round pick
- Load CPU counter offers

Negotiated protections are committed to the in-save draft asset when the transaction completes.

## Trade Deadline Desk

The final 21 days before the trade deadline expose a dedicated market desk with:

- days remaining
- hot/warm rumors
- recent completed CPU trades
- 30-team live direction board
- recent transaction history

Rumors also flow into League Wire, NBA Today headlines and the simulated social feed so the same underlying event appears across the existing v0.32 broadcast ecosystem.

## Data / representation boundary

Real names in the organization seed remain the v0.32 personnel snapshot frozen 21 August 2026. GM archetypes, owner directives, coach behavior models, trade rumors and generated comments are explicitly simulated gameplay content. They are not represented as real-world quotes, opinions or factual personality assessments.

## Compatibility

- Save key/schema remains `nbaCourtsideSaveV25` / schema 25.
- Existing v0.32 saves migrate the optional Living League branch to version 33.
- v0.29 player ratings/source data are retained.
- Existing CBA, schedule, NBA Cup, postseason/offseason and future-pick engines remain in place.
- Franchise, Game Day and Exhibition retain release-unique v0.33 asset URLs for iPhone Safari/GitHub Pages cache coherence.
