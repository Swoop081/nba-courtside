# Validation — v0.36 Player Morale, Roles + Relationships

## New v0.36 gates
- additive `state.playerRelations.version = 36`
- seven role expectation classes supported
- persistent coach-trust score bounded 20–98
- team chemistry bounded and classified
- Front Office Conversation creation / resolution
- blocking urgent conversation path
- More Minutes promise created and tracked
- No-Trade commitment produces a real trade restriction
- promise expiry resolves through the kept/broken evaluation path; the representative kept promise returns the intended +9 morale delta
- extension outlook generated from live player/team relationship state
- dedicated Player Relations view contains chemistry, conversation and roster relationship surfaces
- all Franchise/Game Day/Exhibition entry points use v0.36 release-unique runtime URLs
- JavaScript syntax checks for v0.36 Franchise/Game Day/Exhibition runtimes

## Representative runtime probe
Boston midseason test universe:
- Jayson Tatum initializes as Franchise Player
- coach trust is in valid range
- team chemistry is in valid range
- a playing-time conversation can be marked Action Required
- resolving with More Minutes creates a persistent minutes promise
- a No-Trade Commitment is enforced by `currentTradeRestriction()`
- Player Relations view renders the required modules

## Retained gates
The v0.36 release was re-run against the current v0.36 runtime with:
- `test_college_draft_runtime_on_v36.js`
- `test_g_league_runtime_on_v36.js`
- `test_front_office_runtime_on_v36.js`
- `test_ratings_v36.py`
- `test_postgame_resume_on_v36.js`
- `test_cba_source_long_tail_on_v36.js`
- `test_cup_integration_on_v36.js`
- `test_save_migration_v25.js`
- `test_transaction_edges_v22.js`
- `test_offseason_bridge_v24.js`
- `test_postseason_v21.js`
- `test_main_menu_v28.py`
- `test_device_layout_v26.py`
- `test_modal_accessibility_v26.py`
- `test_cache_coherence_v36.py`

No ratings, source-data, CBA, schedule or granular Game Day simulation-rate changes are intended in v0.36. The historical 10-season durability gate remains certified in the inherited v0.35 foundation; the isolated v0.36 re-run exceeded the local packaging command timeout rather than returning a product assertion failure, so it is not claimed as a newly completed v0.36 gate.
