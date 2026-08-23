# NBA Courtside v0.50 Validation

## Release gates
- 59/59 focused v0.50 staff/coaching/static/runtime-reference checks passed.
- Staff runtime passed: six staff traits, five specialized assistant roles, staff chemistry, coach/roster fit, organizational identity, custom development plans, an actual forced probabilistic focused-development path, interview demands and bounded simulation integration.
- Game Day coaching runtime passed: Delegate mode used an 8-man coach-driven rotation totaling 240 minutes, pace-and-space defaults, an elite coach's 8–0 timeout threshold, and persisted `coaching_v50` result context.
- 51/51 retained v0.49 Advanced Scouting + Draft Intelligence checks passed against the v0.50 runtime; its scouting/Draft Night runtime also passed.
- 64/64 retained v0.48 Playability + Mobile Presentation checks passed against the v0.50 runtime.
- 30/30 retained v0.47 League History checks passed; runtime archive/team-switch persistence passed.
- 48/48 retained v0.46 GM Career checks passed; dismissal → vacancy → interview → offer → team-switch runtime passed.
- 74/74 retained v0.45 Offseason Command Center checks passed; full postseason/offseason flow reached Opening Night with a 15-player roster and 240 rotation minutes.
- 66/66 retained v0.44 Trade Deadline + Transaction Presentation checks passed.
- Schema-25 save migration/corrupt-save fallback passed.
- `node --check` passed for `app-v0.50.js`, `gameday-v0.50.js` and `exhibition-v0.50.js`.
- All direct local runtime script references in `index.html`, `gameday.html` and `exhibition.html` resolve.

## Compatibility
Formal save key remains `nbaCourtsideSaveV25` with schema 25. v0.50 adds `state.staffCoachingV50` and does not require a franchise reset.

## Device note
A physical iPhone Safari touch/layout smoke test is still recommended. Automated/static checks verify hierarchy, touch-size rules and runtime wiring, but do not substitute for final device feel.
