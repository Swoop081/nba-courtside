# NBA Courtside v0.45 — Offseason Command Center

v0.45 turns the offseason into one guided front-office sequence while preserving the existing draft, CBA, contract-market, Summer League, training-camp, transaction and GM-evaluation engines.

## Guided offseason flow

1. **Options** — user team-option decisions are required before progression; player options/ETOs resolve through the simulated market logic.
2. **Lottery** — existing lottery presentation and reveal logic.
3. **Scout + Combine** — existing scouting points, workouts and draft board.
4. **Draft** — full 60-pick draft and existing trade/draft mechanics.
5. **Rights + QO** — qualifying offers must be extended or renounced before Free Agency; retained UFA rights/cap holds remain visible.
6. **Free Agency** — existing agent, negotiation, competing-offer, RFA and CBA systems.
7. **Summer League** — rookies/development players run through the retained five-game showcase before camp.
8. **Training Camp** — roster construction, cuts and final Opening Night preparation.

## Offseason Command Center

Every active offseason phase presents a compact command center before secondary information. It shows:

- current phase and next checkpoint;
- required front-office action count;
- roster count;
- cap status;
- tradeable first-round inventory;
- current roster needs;
- an eight-step visual offseason timeline.

This follows the v0.44.1 action hierarchy: required/primary next-step actions remain above contextual information.

## Decision gates

### Team options
Team options belonging to the user are no longer silently resolved. Exercise/decline is a blocking front-office decision. Existing player-option/ETO behavior remains simulated and is summarized on the same screen.

### Rights + qualifying offers
The draft now hands off to a dedicated rights checkpoint before Free Agency. User RFA qualifying-offer choices are blocking actions. UFA Bird/Early Bird/Non-Bird rights and cap holds remain part of the existing rights system.

### Summer League
Completed Free Agency now routes to Summer League before Training Camp when the franchise has draft selections. The existing Summer League simulation remains authoritative; v0.45 makes it an explicit phase in the guided flow.

## Recap and persistence

Training Camp includes an offseason recap covering players drafted, added and lost plus payroll movement. When the next regular season starts, the completed v0.45 offseason snapshot is archived in `state.offseasonHistoryV45`.

## Compatibility

- Formal franchise save schema remains **25**.
- Save key remains `nbaCourtsideSaveV25`.
- v0.45 stores additive state under `state.offseasonV45` / `state.offseasonHistoryV45`.
- v0.44 Trade Deadline, v0.43 Franchise Direction + GM Evaluation and v0.44.1 Primary Action Hierarchy remain intact.
