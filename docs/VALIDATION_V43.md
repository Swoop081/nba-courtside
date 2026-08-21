# NBA Courtside v0.43 Validation

## Scope
Franchise Direction + GM Evaluation only. No roster, ratings, schedule, CBA, transaction-engine or Game Day retune.

## Structural gates
- Formal save key/schema retained: `nbaCourtsideSaveV25`, schema 25.
- v0.43 runtime filenames exist for Franchise, Game Day, Exhibition and all version-pinned data dependencies.
- Franchise app JavaScript passes `node --check`.
- Game Day, Exhibition and CBA v0.43 runtime copies pass `node --check`.
- Main menu branding and HTML runtime references resolve to v0.43.

## Feature gates
- Additive `state.franchiseDirection.version = 43` initializes only after a franchise team exists.
- Five core objectives plus one optional stretch objective are generated.
- Major 28+ day injuries to 82+ OVR players can reduce the competitive win expectation, capped at 10 wins of relief.
- GM evaluation contains Results, Roster Building, Player Management, Financial and Organizational Direction pillars.
- Status bands: Excellent / Strong / Stable / Under Pressure / Critical.
- Ownership confidence is updated on milestone review creation, not every screen render.
- Reviews: Opening Night, 20 Games, New Year, Trade Deadline, Regular-Season End, End of Season.
- Midseason v0.42 migration creates a current ownership review and does not falsely backfill passed checkpoints.
- Completed season GM report is archived before offseason year rollover.
- Home briefing exposes season goal, GM standing, objective count and biggest concern.
- Dedicated Franchise Direction screen is reachable from Home and More.
- Real owner/governor identities are separated from explicitly simulated management styles/priorities by visible copy.

## Compatibility
Existing schema-25 saves migrate lazily with no reset. v0.42 navigation and blocking-action logic remain authoritative.
