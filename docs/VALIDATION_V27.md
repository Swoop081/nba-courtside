# NBA Courtside v0.27 — Validation

Frozen 20 August 2026.

## Release-blocking boot checks

PASS:
- Main Menu is present in static HTML before franchise JavaScript initializes.
- Continue Franchise is only exposed when a valid user team is loaded.
- New Franchise opens a separate team-selection screen.
- Team-selection screen renders all 30 teams and conference filters.
- Back returns from team selection to Main Menu.
- In-franchise menu button returns to Main Menu without clearing the save.
- Continue returns from Main Menu to the current franchise.
- Literal escaped `\\n` style-boundary artifacts are removed from the document.
- Storage access failure does not abort startup.
- Game Day prefers/writes `nbaCourtsideSaveV25` schema 25.
- Exhibition reads `nbaCourtsideSaveV25` before legacy keys.

A 393 x 852 touch/mobile browser harness completed Main Menu -> New Franchise -> Boston -> Main Menu -> Continue with zero page errors. A second harness with localStorage denied still rendered the Main Menu and all 30 team cards.

## Retained regression gates

PASS:
- v0.26 compact-device layout audit.
- v0.26 modal focus/inert accessibility audit.
- v0.25 save migration / corrupt-newest fallback.
- 420-cell / 3,500-scenario future-pick resolver.
- Full draft / free agency / Training Camp / next-season bridge.
- Regular Game Day.
- NBA Cup Final Game Day.
- Postseason.
- JavaScript syntax for Franchise, Game Day, Exhibition.

No basketball, data, CBA, ratings, simulation, schedule, or save-schema model changes were introduced by v0.27.
