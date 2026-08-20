# NBA Courtside v0.28 — Postgame Resume + Season-Started Boot Hotfix

v0.28 fixes the release-blocking return-from-Game-Day failure discovered on physical iPhone Safari.

## Root cause
`app.js` invoked `ensureNBAProgress()` during top-level startup before `V17_CUP_GROUP_GAMES` and the related NBA Cup constants were initialized. On a fresh franchise, the function returned before touching those constants because `seasonStarted` was false. Once a season had started, returning from Game Day executed the Cup branch and raised a temporal-dead-zone `ReferenceError`, stopping JavaScript before Continue/New Franchise handlers could bind. Exhibition remained usable because it is a normal anchor.

## Fix
- Defer the initial `ensureNBAProgress()` call until after the NBA Cup constants and progress helpers are initialized.
- Add a permanent postgame boot regression that first completes a real Game Day result and then boots Franchise from that serialized save.
- Game Day GM Office links now use `index.html?continue=1`; Franchise recognizes that route and enters the existing save directly.
- Fresh launches still land on the Main Menu. `?new=1` is also supported for direct team selection.

No basketball, CBA, roster, ratings, schedule, pick-right, or save-schema behavior changes in v0.28.
