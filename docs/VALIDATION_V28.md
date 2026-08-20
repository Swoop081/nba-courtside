# NBA Courtside v0.28 — Validation

Release gate:
- exact postgame/season-started boot regression
- v0.27 Main Menu static audit
- v0.26 device layout and modal accessibility audits
- v0.25 save migration/corrupt fallback
- retained Game Day regular/Cup regressions
- retained postseason/offseason/pick-right regressions
- JavaScript syntax

The key v0.28 regression creates a real completed regular-season Game Day save, reloads `app.js` from that serialized state, and verifies that Continue is visible and both Continue/New Franchise handlers are bound.
