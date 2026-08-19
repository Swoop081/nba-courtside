# NBA Courtside — v0.10 Roles + Morale Pass

Current prototype baseline: **v0.10**.

This build layers player expectations, personalities and locker-room consequences onto the v0.9 living GM universe.

## New in v0.10
- Contextual expected roles: Franchise Star, Star, Starter, Sixth Man, Rotation, Prospect, Veteran, Reserve.
- Expected minutes tied to role, with actual minutes coming from the persistent Game Day rotation / season sample.
- Deterministic player personality priorities across role, winning, contract, stability and development.
- 0–99 morale with THRIVING / CONTENT / UNEASY / FRUSTRATED / WANTS OUT states.
- User player meetings with Increase Role, Stay the Course and Explore Trade responses.
- Role promises are tracked for 14 days and can be kept or broken.
- Low morale can escalate into trade requests.
- CPU teams use the same morale system; unhappy CPU players become easier to pry loose and are more likely to move in CPU trades.
- Home and Roster now include large Locker Room presentation surfaces.
- Player profiles expose role, morale, priorities and factor breakdowns without turning into text-heavy management tables.
- League Pulse includes Locker Room Watch for discontent around the NBA.
- Existing v0.9 saves migrate forward automatically.

See `docs/ROLES_MORALE.md` and `docs/VALIDATION_V10.md`.
