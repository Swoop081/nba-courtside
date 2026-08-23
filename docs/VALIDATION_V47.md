# NBA Courtside v0.47 — Validation

Validated release target: **League History + Long-Term World Persistence**.

## Passed checks

- 30/30 focused v0.47 structural/integration checks.
- Runtime season archive: champion, Finals MVP, 30-team standings snapshot, team snapshots and player totals persisted before season reset.
- Runtime retirement and draft persistence.
- Runtime career-total aggregation and History rendering.
- Runtime league-history state remained byte-for-byte unchanged when the user-controlled team changed.
- v0.46 dismissal → vacancy → interview → offer → new-team runtime still passes on the v0.47 runtime.
- Full v0.45 postseason → employment review → Options → Lottery → Scout/Combine → 60-pick Draft → Rights/QO → Free Agency → Summer League → Training Camp → Opening Night runtime still passes.
- Retained v0.44 deadline/transaction suite passes against the v0.47 runtime after updating only release-branding expectations.
- JavaScript syntax checks pass for app, Game Day and Exhibition v0.47 runtimes.
- Formal save schema remains 25 / `nbaCourtsideSaveV25`.
- ZIP integrity checked before release.

## Boundary

Older seasons whose granular per-player/per-game data had already been cleared before upgrading can only be imported at the detail level still present in `state.history`; v0.47 intentionally does not invent missing history.

A physical iPhone Safari touch/layout pass remains recommended for final visual feel, especially the horizontally scrollable History filters and dense archived standings.
