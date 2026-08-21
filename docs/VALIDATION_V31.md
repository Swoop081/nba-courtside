# NBA Courtside v0.31 — Validation

**Release:** Living League Foundation  
**Frozen:** 21 August 2026  
**Save schema:** 25 (`nbaCourtsideSaveV25`)

## New v0.31 gates

- `scripts/test_living_league_v31.py` — PASS
  - 30 organization records
  - current commissioner/media seed
  - current personnel regression anchors for recent front-office/coaching changes
  - six Daily Hub activities
  - one-calendar-day advancement
  - required formal trade action queue
  - Find Me Trades path
  - v0.31 cache-specific runtime URLs
  - v0.29 ratings smoke values
- `scripts/test_cache_coherence_v31.py` — PASS
- `scripts/test_postgame_resume_v31.js` — PASS
  - real Game Day result persisted
  - season-started direct return
  - Continue/New Franchise bindings retained
- `scripts/test_cup_integration_v31.js` — PASS
  - 1,230 regular-season results
  - NBA Cup progression complete
  - max player GP 82
- `scripts/test_cba_source_long_tail_v31.js` — PASS
  - exact YOS source behavior retained
  - waiver priority/claims
  - DPE
  - Two-Way/Exhibit 10
  - Team Salary / Apron Team Salary behavior
  - cash and extension helpers

## Retained foundation gates

- v0.29 ratings/source audit — PASS: 442 players; 393 final NBA evidence; 49 projection-only; median OVR 72; 75 at 80+; 29 at 86+; 8 at 90+.
- v0.29 projection runtime — PASS.
- v0.25 save migration/corrupt-save fallback — PASS.
- v0.21 postseason — PASS.
- v0.24 offseason bridge — PASS.
- v0.21 future-pick trees — PASS.
- v0.22 CBA — PASS.
- v0.22 transaction edges — PASS.
- v0.26 device-layout audit — PASS.
- v0.26 modal accessibility audit — PASS.
- JavaScript syntax — PASS for all v0.31 runtime/data modules.

## Personnel-data boundary

The v0.31 organization seed is a public-role snapshot frozen 21 August 2026. It is designed to become mutable in-save later (hirings, firings, promotions, ownership changes). Recent 2026 staff/front-office changes were specifically audited before freeze rather than copied from older 2025 staff lists.

## Scope boundary

v0.31 establishes the Living League event/presentation shell and organizational/trade framework. Full G League roster sourcing and the college/prospect universe are not fabricated into this package; they remain the next dedicated sourced-data layers.
