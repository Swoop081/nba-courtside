# v0.59 Validation

Scope: Home hierarchy and daily training retirement only.

## Result

**PASS**

Validated on 23 August 2026:

- Current-universe Toronto off day advances without selecting training.
- Historical 2018-19 Toronto opening off day advances from 2018-10-16 to 2018-10-17 without training.
- Off-day Home HTML contains no Training Center or `data-daily-action` controls.
- Off-day persistent status no longer says training is available.
- A legacy current-day v0.58 daily action is cleared/ignored by the v0.59 compatibility layer.
- Next Game remains visible on off days.
- Games-first priority order is explicitly: league digest -> SportsCenter performance/stat coverage -> League Wire -> NBA Today headlines immediately after current/next game context.
- Save schema remains 25.
- v0.58 incoming trade proposal review/counter routing passes on the v0.59 app.
- v0.56 continuous real draft classes 2019-2026 remain certified at 60-player pools with alternate-history routing intact.
- v0.42 navigation regression remains PASS.

## Tests

- `scripts/test_games_stats_news_first_v59.js`
- `scripts/test_historical_offday_on_v59.js`
- `scripts/test_trade_proposal_review_on_v59.js`
- `scripts/test_real_draft_pipeline_runtime_v56.js`
- `scripts/test_navigation_runtime_v42.js`

Daily Training Camp remains a separate offseason phase and is not affected by this change.
