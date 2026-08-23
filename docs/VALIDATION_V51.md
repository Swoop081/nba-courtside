# NBA Courtside v0.51 Validation

## Release gates
- 69/69 focused v0.51 Player Development + Aging checks passed.
- Development runtime passed: team-aware training loads, prime windows, volatility, NBA/playoff opportunity, injury burden, skill-specific progression, persistent development history and profile UI all executed successfully.
- Development preview was verified not to consume simulation RNG.
- Aggressive training was verified to raise injury exposure relative to the retained medical/injury model.
- Runtime sample verified a young high-opportunity player could produce a breakout outcome while a veteran with a severe injury produced heavier physical decline; these are probabilistic paths, not scripted outcomes.
- 59/59 retained v0.50 Staff + Coaching checks passed against the v0.51 runtime; the staff runtime and coach-led Game Day delegate runtime also passed.
- 51/51 retained v0.49 Draft Intelligence checks passed.
- 64/64 retained v0.48 Playability + Mobile Presentation checks passed.
- 30/30 retained v0.47 League History checks passed; runtime archive/team-switch persistence passed.
- 48/48 retained v0.46 GM Career checks passed; runtime dismissal/job-market/team-switch continuity passed.
- 74/74 retained v0.45 Offseason Command Center checks passed; full offseason runtime reached Opening Night with a 15-player roster and 240 rotation minutes.
- 66/66 retained v0.44 Trade Deadline checks passed.
- Schema-25 save migration/corrupt-save fallback passed.
- `node --check` passed for `app-v0.51.js`, `gameday-v0.51.js` and `exhibition-v0.51.js`.
- All direct local runtime script references in `index.html`, `gameday.html` and `exhibition.html` resolve.

## Compatibility
Formal save key remains `nbaCourtsideSaveV25` with schema 25. v0.51 adds `state.playerDevelopmentV51` and does not require a franchise reset.

## Device note
A physical iPhone Safari touch/layout smoke test remains recommended. Automated/runtime checks verify hierarchy and wiring but do not substitute for final device feel.
