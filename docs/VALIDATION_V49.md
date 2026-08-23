# NBA Courtside v0.49 Validation

## Release

**v0.49 — Advanced Scouting + Draft Intelligence**

## Focused v0.49 checks

- 51/51 structural/runtime-reference checks passed.
- JavaScript syntax passed for `app-v0.49.js`, `gameday-v0.49.js` and `exhibition-v0.49.js`.
- HTML runtime pins resolve to the v0.49 app/Game Day/Exhibition files.
- Formal save schema remains 25 (`nbaCourtsideSaveV25`).
- `state.draftIntelligenceV49` is additive.
- Full-report Draft Night presentation remains ranged rather than exposing exact OVR/potential.
- 2027 season-long college scouting carries into the pre-draft report.
- Simulated interview consumes one scouting point and increases confidence.
- Scouting-plan allocation is bounded to at most six points per invocation.
- Front-office recommendations return three evidence-based candidates.
- User selection snapshots persist the evaluation known at pick time.
- College + Draft Intel tab and simulation-boundary copy are present.

## Runtime draft-intelligence probe

The dedicated v0.49 runtime probe passed with the source-backed 2027 class. It verified:

- 60-player draft class generation;
- source-backed first-round class carryover;
- level-3 season scouting imported into June;
- ranged full scouting report;
- interview confidence gain;
- bounded automated scouting allocation;
- three-prospect recommendation list;
- action-first Draft Night intelligence panel;
- absence of the legacy exact-OVR Draft Night card;
- archived user-selection decision snapshot.

## Retained suites on v0.49 runtime

- GM Career + Employment: **48/48**.
- League History + World Persistence: **30/30**.
- Trade Deadline + Transaction Presentation: **66/66**.
- Offseason Command Center: **74/74**.
- v0.48 playability/mobile presentation suite: passed on the v0.49 runtime.

## Retained runtime probes

Passed:

- dismissal → vacancy → interview → offer → team switch, preserving former-team state;
- league-history archive persistence across GM team changes;
- complete offseason progression through Draft, QO, Free Agency, Summer League, Training Camp and Opening Night;
- Opening Night 15-player roster and 240-minute rotation;
- save-schema migration/corrupt-save fallback;
- Game Day coaching runtime and 240-minute rotation.

## Device note

A physical iPhone Safari touch/layout smoke test is still recommended for final feel. The build environment certification covers code/runtime integration and layout rules, not physical-device rendering behavior.
