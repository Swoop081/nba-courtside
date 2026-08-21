# NBA Courtside v0.30 Validation

Status: **PASS**

## Cache coherence
- `scripts/test_cache_coherence_v30.py` — PASS.
- Franchise, Game Day and Exhibition all execute release-unique v0.30 runtime JavaScript URLs.
- Boston smoke values in the shipped browser data bundle: Payton Pritchard 79, Paul George 79, Jayson Tatum 89, Neemias Queta 76.

## Retained ratings foundation
- `scripts/test_ratings_v29.py` — PASS.
- 442 players; 393 evidence-backed; 49 projection-only; median 72; 75 players 80+; 29 players 86+; 8 players 90+.

## Retained release behavior
- v0.27 Main Menu / boot audit — PASS.
- v0.28 Main Menu / postgame-return audit — PASS.
- v0.26 device-layout audit — PASS.
- v0.26 modal focus/inert accessibility audit — PASS.
- v0.28 postgame resume integration — PASS.

## Syntax
Canonical and browser-versioned `app`, `gameday`, `exhibition`, `cba`, player-data and schedule JavaScript files pass `node --check`.
