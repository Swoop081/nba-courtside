# NBA Courtside v0.38 — Validation

**Release:** Staff Careers + Coaching Market  
**Frozen:** 21 August 2026

## New v0.38 certification

### Static staff model

PASS — `scripts/test_staff_careers_v38.py`

- 30 NBA organization seeds
- staff state version 38
- seven coach rating dimensions
- seven executive rating dimensions
- real identity seed remains the organization snapshot; evaluative staff data is simulated gameplay

### Runtime staff market

PASS — `scripts/test_staff_careers_runtime_v38.js`

The runtime probe verifies:

- existing organization identities seed into persistent careers
- staff contracts, security and coach fit initialize
- a user head-coach dismissal creates a blocking vacancy
- internal assistant promotion works
- CPU coaching and executive vacancies are filled
- same-season rehire of a just-dismissed staff member is prevented
- staff history persists
- coach performance influence remains bounded

Representative probe output promoted D.J. MacLeay internally in Boston and filled seeded CPU vacancies through the active market. Candidate outcomes are deterministic simulation, not predictions.

### Coaching calibration

PASS — `scripts/test_staff_coaching_calibration_v38.js`

Two simulated seasons / 4,800 team-games with bounded staff influence:

- team PPG: 116.83125
- home win percentage: 0.54708
- average margin: 11.41167
- average best-team wins: 61.5
- average worst-team wins: 17.5
- box-score point errors: 0
- rotation-minute errors: 0

The purpose of this gate is to ensure staff effects remain a nudge rather than replacing player/roster quality.

### Staff-specific long horizon

PASS — `scripts/test_staff_long_horizon_v38.js`

Advanced staff offseasons through 2042:

- 258 persistent staff objects
- 240 career-history events
- 26 retirements
- all 30 teams retained a head coach and lead executive
- all teams retained at least four assistants after every offseason
- generated candidate supply replenished successfully

A late certification bug was found and fixed here: a later CPU club could poach an assistant from a team already processed earlier in the offseason loop, leaving that earlier team below the four-assistant target. v0.38 now performs a final league-wide assistant-depth refill after all head-coach/executive hiring is complete.

### Cache coherence / syntax

PASS — `scripts/test_cache_coherence_v38.py`

- release-specific v0.38 Franchise/Game Day/Exhibition runtime URLs
- canonical/runtime JS parity
- certified ratings bundle retained

PASS — JavaScript syntax checks for `app-v0.38.js`, `gameday-v0.38.js`, `exhibition-v0.38.js`, `cba-v0.38.js` and `data/staff-careers-v0.38.js`.

## Retained foundation gates

PASS after the final staff-depth fix:

- `test_front_office_runtime_on_v38.js`: five CPU-acceptable/legal Find Me Trades results for all five goals, multi-asset search, incoming proposal, rumors and seeded CPU trade
- `test_player_relations_runtime_on_v38.js`: roles, coach trust, chemistry, extension outlook, promises and enforced no-trade commitment
- `test_league_events_runtime_on_v38.js`: 24 All-Stars, contests, six awards, All-NBA, playoff race, Combine and Summer League
- `test_postgame_resume_on_v38.js`: postgame save/Continue/direct return
- `test_cup_integration_on_v38.js`: 1,230 regular-season results, Cup progression, maximum player GP 82
- `test_cba_source_long_tail_on_v38.js`: 442-player source/CBA long-tail integrity
- `test_ratings_v38.py`: 442 players; 393 NBA evidence; 49 projection-only; median OVR 72; 75 players 80+; 29 players 86+; 8 players 90+

Previously completed retained v0.38-adapted regression gates also remain green for College + Draft, G League call-ups, save migration, transaction edges, offseason bridge, postseason, Main Menu, mobile device layout, modal accessibility and general accessibility.

## Durability boundary

v0.38 adds and passes a dedicated **staff-career long-horizon test through 2042**. This is distinct from the older whole-franchise ten-season durability gate inherited from v0.35; this release does not claim a newly rerun full ten-season whole-franchise durability certification.
