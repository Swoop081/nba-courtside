# NBA Courtside v0.35 — Validation

## New v0.35 gates

### `scripts/test_college_draft_v35.py`

- 44 unique tracked college programs.
- 30 unique source-backed 2027 watch prospects.
- 29 college prospects + 1 international prospect.
- source/simulation boundary present in the data bundle.
- key source anchors and conservative NBA-readiness seeds.
- Big Board, Mock Draft, College and Scouting UI/runtime integration markers.
- source-backed Draft Night persistence and explicit fictional second-round boundary.
- exact v0.35 browser-runtime asset order and no v0.34 runtime URL leakage.

### `scripts/test_college_draft_runtime_v35.js`

Runtime VM certification verifies:

- additive `state.collegeDraft.version = 35` migration;
- real calendar simulation produces college results;
- 30-player live Big Board;
- 30-pick live mock draft with unique selections;
- scouting materially increases confidence (representative probe: 28 → 46);
- 60-player 2027 Draft Night class;
- first 30 draft players retain source-backed identities;
- second-round depth remains explicitly fictional;
- top seed/program identity remains coherent at initialization.

Representative runtime certification:

- 228 simulated college results by the probe date;
- Big Board: 30;
- mock draft: 30;
- source-backed first-round players: 30;
- explicitly fictional second-round depth: 30.

### College schedule-balance probe

The deterministic tracked-program scheduler reaches the intended **30 games for each of 44 programs** by the mid-March target in an isolated balance probe.

## Retained release gates executed

- v0.29 ratings/source exact-field certification: 442 players / 393 NBA evidence / 49 projection-only; median 72; 75 players 80+; 29 players 86+; 8 players 90+.
- v0.34 G League runtime: affiliate simulation, current Two-Way status, legal NBA call-up and no fabricated NBA stat row.
- v0.33 Active Front Offices runtime: five CPU-acceptable/CBA-legal results for all five Find Me Trades goals, multi-asset search, incoming proposal, rumors and seeded CPU↔CPU transaction.
- v0.28 postgame-resume boot integration.
- full NBA Cup integration: 1,230 regular-season results, 30 materialized Cup replacement games, 67 Cup competition games and max player GP 82.
- CBA long-tail/source test.
- save-schema 25 migration and corruption fallback.
- transaction-edge regression.
- postseason regression.
- offseason bridge / 60-pick draft / free-agency completion.
- Main Menu boot audit.
- iPhone device-layout audit.
- modal accessibility/focus audit.
- JavaScript syntax checks for Franchise, Game Day and Exhibition v0.35 runtime files.
- 10-season durability through 2036: 600 generated players, 1,020 future-pick cells, 1,042 final players and a 2,915,783-byte final serialized save.

## Data-safety conclusion

v0.35 adds a season-long draft world without mutating certified NBA evidence or fabricating future college results as real facts. The 2027 top-30 watch seed is source-backed and explicitly uncertain; the schedule, results, prospect production and scouting layer are clearly simulated gameplay. The incomplete second-round source boundary remains labeled fictional until a larger defensible source pool is frozen.
