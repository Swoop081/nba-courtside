# NBA Courtside v0.42 — Validation

## Release certification

The v0.42 Navigation + Presentation Consolidation release is certified against the following gates:

- **Primary navigation:** Home / Team / League / Deals / More.
- **Universal GM Action Center:** formal incoming trades, blocking Player Relations conversations, user head-coach/lead-executive vacancies, RFA match decisions and preseason roster overages are consolidated into one blocking decision system. Medical return-to-play recommendations remain visible review items without becoming artificial blockers.
- **Canonical workspaces:** Team groups Roster + Rotation, Player Relations, Health + Performance, Staff + Organization and Contracts + Cap. Deals groups Trade Center, Free Agency Live, Cap + Rights and the G League pipeline. League exposes NBA, League Events, College + Draft and G League through one consistent sub-navigation.
- **Global search:** runtime search resolves NBA players, NBA teams, College/Draft prospects and organization staff, and opens the relevant detail sheet without resetting the user to Home.
- **Persistent context:** the compact franchise header keeps team, record, league date/today state and required-action count available across the app.
- **Advance Day:** uses the unified blocking-decision count rather than independent subsystem blockers.
- **Mobile:** iPhone safe-area behavior, compact breakpoints, tap-target/layout gates and modal accessibility remain green.
- **Cache coherence:** Franchise, Game Day and Exhibition all use release-specific v0.42 runtime/data URLs; canonical runtime files match their v0.42 release copies.
- **Save compatibility:** formal schema remains **25** (`nbaCourtsideSaveV25`). v0.42 adds only additive UI state.
- **JavaScript syntax:** canonical and release-specific v0.42 app/Game Day/Exhibition files pass syntax checks.

## Retained runtime gates rerun on v0.42

- Ratings/source integrity: **442 players**, **393 NBA-evidence rows**, **49 projection-only**, median OVR **72**, **75 players 80+**, **29 players 86+**, **8 players 90+**.
- Game Day coaching: Assisted foul-trouble/halftime decisions, timeout usage, live substitution, primary matchup effect, shortened rotation and result persistence remain functional.
- Health/Game Day: a **24-minute medical restriction finishes at exactly 24.0 minutes**, rest excludes the player, fatigue affects starting energy and body-area injury metadata persists.
- Postgame resume: real Game Day completion can serialize and return directly to the existing franchise with Continue/New Franchise handlers intact.
- Full regular-season/NBA Cup integration: **1,230 regular-season results**, **67 Cup competition games**, and no player above **82 GP**.
- Retained runtime suites for CBA/transactions, Contracts + Agents, Staff Careers, Player Relations, League Events, G League, College + Draft, Active Front Offices/Find Me Trades, save migration, postseason/offseason and mobile/modal behavior remain green on the unchanged underlying foundations.

## Scope note

v0.42 intentionally does **not** rewrite ratings, rosters, contracts, CBA rules, schedules, future-pick rights, health calibration or the v0.41 possession/coaching engine. It consolidates how those systems are reached, prioritized and presented. The earlier whole-franchise long-horizon durability foundation remains inherited; this release does not claim a freshly completed full 10-season durability run.

Machine-readable summary: `data/navigation-presentation-certification-v0.42.json`.
