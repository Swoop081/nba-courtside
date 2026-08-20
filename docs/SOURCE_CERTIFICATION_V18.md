# NBA Courtside v0.18 — Source Certification

Freeze date: **20 August 2026**

v0.18 is a provenance and safety pass. It does not pretend every current NBA data field has been independently certified. Instead, it separates what is source-checked, what remains a calibrated bootstrap, and what is still simulation-inferred.

## What is certified in this build

### 2025–26 final team records — 30/30
The prior-season record table now contains an exact 82-game final record for every NBA team. The league reconciles to **1,230 wins and 1,230 losses**.

This replaces the v0.17 NBA Cup deep-tiebreak approximation. After head-to-head, point differential and points scored, the Cup sorter now uses the actual 2025–26 team record, then a deterministic draw if a tie still remains.

### Contract structure — 442/442 records
Every frozen current player/right row has been audited against `raw/rosters_contracts_2026-08-19.tsv` for:
- player/team identity;
- age;
- position;
- contract expiry;
- each listed salary year;
- salary amount;
- player-option marker;
- team-option marker.

The three frozen `PENDING` cases are preserved as unsigned restricted-free-agent rights rather than invented signed contracts:
- Jalen Duren — Detroit;
- Bennedict Mathurin — LA Clippers;
- Peyton Watson — Denver.

The generated machine-readable manifest is `data/contract-certification-2026-08-20.json`.

### Future draft-asset coverage — 420/420 origin cells
v0.18 contains one origin-right cell for every team, both rounds, from 2027 through 2033:

**30 teams × 7 drafts × 2 rounds = 420 cells.**

Simple direct ownership and explicitly encoded protections are executable. Complex swaps, frozen picks, and source-sensitive chains that are not safely reducible to one owner are locked from trade rather than guessed. See `docs/FUTURE_PICK_LEDGER_V18.md`.

## Player-stat provenance

The current 442-record player pool is explicitly divided into three source states:

| Status | Records | Meaning |
|---|---:|---|
| `season_complete_verified` | **34** | Selected current-player rows were checked against a season-complete 2025–26 regular-season table and exact source fields were overlaid. |
| `bootstrap_hybrid` | **358** | NBA-derived statistical bootstrap remains in use; it is model-ready and calibrated, but not yet individually replaced by a season-complete canonical row in v0.18. |
| `projection` | **50** | No current NBA-derived 2025–26 baseline is used; rookie/newcomer or other projection logic applies. |

The 34 verified overlays update the exact source fields available to the build, including games, minutes, scoring, shooting volume/percentages, rebounding, assists, turnovers, steals and blocks where exposed. Fields not exposed by that verification table — such as starts, offensive/defensive rebound split and personal fouls — remain explicitly marked as bootstrap-derived.

### Why ratings were not globally regenerated
v0.16 calibrated the possession engine and quick simulation against the complete bootstrap population. Rebuilding only a subset of player ratings while the other 358 stat-backed records remain on the bootstrap would create a mixed rating methodology and could undo that calibration.

Therefore v0.18 updates source provenance and verified statistical fields while leaving the calibrated rating population intact. A future complete final-stat import can regenerate the entire rating population in one controlled pass and then re-run league calibration.

## Bird rights: important boundary

**Initial individual Bird clocks are not source-certified in v0.18.**

The contract/CBA engine still infers initial team tenure from the current contract structure when a save is created. Once the universe starts, its own trades, re-signings and tenure changes persist normally.

Player profiles and certification data therefore label Bird-right status as:

**ENGINE-INFERRED**

rather than claiming the real player's exact historical Bird-right clock has been audited.

This distinction is intentional. Contract salary/options can be structurally certified without claiming an unverified service/tenure history.

## Player-facing provenance

v0.18 surfaces source status inside the game:
- Home includes a **SOURCE CERTIFICATION** panel.
- Player profiles show **STAT SOURCE**, **CONTRACT STRUCTURE**, and **BIRD RIGHTS** status.
- Current-universe statistical labels distinguish season-complete verification from bootstrap-hybrid evidence.

This makes uncertainty visible instead of burying it in internal documentation.

## Source-policy rule introduced in v0.18

When a current-NBA asset or data field cannot be safely resolved, NBA Courtside must prefer one of these states:

**SOURCE LOCKED · ENGINE-INFERRED · BOOTSTRAP-HYBRID · PROJECTION**

It must not manufacture a precise real-world fact just to keep a UI element actionable.

That policy is especially important for complex draft rights and Bird clocks.

## Remaining source work before the current-day database can be called fully certified

1. Replace the remaining **358 bootstrap-hybrid** stat rows with one complete season-final source import, then regenerate and recalibrate ratings as a single population.
2. Audit exact initial-team Bird / Early Bird / Non-Bird tenure for every relevant player.
3. Expand complex multi-team pick swaps and conditional second-round conveyances from safety-locked cells into fully executable settlement trees.
4. Continue specialist CBA certification: bonuses/incentives, partial guarantees, set-off/stretch, two-way/Exhibit 10 mechanics, exact exception edge cases and other rare transaction rules.
5. Future official schedules remain unavailable until the NBA releases them; generated future seasons continue using the simulation template.

## Machine-readable outputs

- `data/source-certification-v0.18.json`
- `data/source-certification.js`
- `data/contract-certification-2026-08-20.json`
- `data/future-pick-ledger-2026-08-20.json`
- `data/future-pick-ledger.js`

The validation script is `scripts/certify_sources_v18.py`.
