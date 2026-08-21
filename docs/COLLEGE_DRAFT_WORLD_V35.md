# NBA Courtside v0.35 — College + Draft World

Frozen: 21 August 2026  
Save schema: 25 (`nbaCourtsideSaveV25`)  
College/draft branch: additive `state.collegeDraft.version = 35`

## Purpose

v0.35 gives the Living League a visible future. Draft prospects now exist throughout the season instead of appearing for the first time on Draft Night. College performances, scouting, stock movement, the Big Board and mock drafts evolve on the same calendar as the NBA and G League.

This is an NBA-franchise scouting layer, not yet a playable college coaching mode. The state/data architecture is intentionally structured so a later college mode can build on the same program and prospect identities.

## Source-backed 2027 watch class

The first 2027 watch class is seeded from the CBS Sports 29 June 2026 early 2027 mock/watch list. CBS explicitly described that exercise as closer to a watch list than a settled draft ranking, so NBA Courtside treats the published order as an **initial scouting prior**, not future truth.

The frozen seed contains **30 source-backed prospects**: 29 attached to college programs and Stefan Joksimović attached to Baskonia as an international prospect. Supporting July 2026 CBS reporting is used as a cross-check for prominent returning college prospects.

The seed begins with Tyran Stokes (Kansas), Jordan Smith Jr. (Arkansas), Caleb Holt (Arizona), Bruce Branch III (BYU) and Stefan Joksimović (Baskonia). The live game can move prospects away from their initial order as simulated performances and scouting evidence accumulate.

## Source/simulation boundary

NBA Courtside does **not** present unpublished future results as factual college history.

- Prospect identity/program/watch-position seed: source-backed snapshot frozen 21 August 2026.
- Tracked-program schedule: simulated/provisional NBA Courtside world model.
- College scores and records: simulated.
- Prospect game lines and season production: simulated.
- Stock movement, scouting grades, strengths/concerns and NBA fit: gameplay simulation.
- International prospects remain on the draft board but do not appear in simulated NCAA fixtures.

All relevant screens carry a source/simulation truth bar so a generated result cannot be mistaken for real-world reporting.

## College world

v0.35 tracks **44 draft-relevant programs** across the ACC, Big 12, Big East, Big Ten, SEC, WCC and Pac-12. The initial simulated calendar uses Tuesday/Wednesday/Saturday slates and balances the tracked programs to a 30-game season target by mid-March.

This 44-program layer is the draft-world foundation rather than a claim that all Division I basketball is already modeled. Full Division I expansion belongs with the later playable college mode.

Each tracked program has:

- persistent win/loss record;
- recent results;
- conference identity;
- simulation-strength seed;
- linked draft prospects.

The college simulation uses its own deterministic hash namespace and does not consume the calibrated NBA Game Day RNG.

## Prospect development and stock

Every seeded prospect receives a persistent season file containing simulated games, cumulative production, recent performances and draft-stock history. Strong or poor games can move the live Big Board, but movement is bounded so one random result cannot completely rewrite the class.

The Daily Hub can surface a **Draft Watch** story generated from actual prospect events in the save. The same event can then feed the prospect page, stock log and draft board.

## Scouting / fog of war

The user receives a weekly scouting-credit budget. Scouting can be assigned to:

- an individual prospect;
- guards;
- wings;
- bigs.

Individual work provides the largest confidence gain; group scouting provides smaller gains across a cohort. Scout confidence narrows the visible NBA-readiness and potential ranges. A lightly scouted prospect therefore appears as a range rather than an exact hidden truth.

Prospects can be added to a persistent watchlist. Their detail sheet shows current projection, program/context, simulated production, stock history, strengths/concerns and scout confidence.

## Live Big Board and mock draft

The **Big Board** is recalculated from the source prior plus the save's simulated performance/stock evidence. It is not hard-coded to the June mock once the season begins.

The **30-pick Mock Draft** is generated from the live NBA universe. It considers current/recent team performance, the existing first-round pick-right ledger, roster needs and the live prospect board. This keeps the draft ecosystem connected to the same team-building world as trades and future-pick ownership.

## Draft-night persistence

For the 2027 draft, the 30 sourced watch prospects persist into the generated 60-player draft class under stable `source-2027-*` identities. Their college identity, stock and scouting context carry into Draft Night.

The current source snapshot does not supply an honest complete 60-player class. Therefore picks/prospects 31–60 remain explicitly marked `fictional_2027_second_round_depth` rather than being disguised as real future players. Later sourced data can replace that boundary without changing the save architecture.

## UI integration

- Daily Hub: Draft Watch module.
- League: College + Draft World portal.
- Dedicated College + Draft screen with **Big Board**, **Mock Draft**, **College**, and **Scouting** tabs.
- Prospect detail sheet with fog-of-war scouting and stock history.
- Existing Draft/Offseason flow consumes the persistent 2027 class.

## Retained systems

v0.35 does not change the v0.29 player-rating foundation, certified NBA source rows, NBA schedule, Game Day simulation, CBA, future-pick ledger, active-front-office logic or v0.34 G League foundation. Existing v0.34 franchises migrate additively without a reset.
