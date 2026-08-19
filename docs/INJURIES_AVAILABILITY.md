# NBA Courtside v0.9 — Injuries + Availability

## Purpose
Make roster depth and rotation management matter across the franchise season. Injuries are persistent league events, not hidden team-rating penalties.

## Model
- Injury chance is evaluated from actual game workload.
- Risk uses a controlled blend of player age, minutes, stamina and a durability proxy derived from 2025–26 games played.
- Durability is intentionally a proxy in v0.9, not a medical-history claim.
- Severity ranges from day-to-day soreness/illness through strains and sprains to rare major injuries.
- Every injury has a start date, estimated return date and persistent league history entry.

## Rotation behavior
- Injured players remain on the 15-man roster and salary cap.
- They are removed from Game Day availability.
- The rotation automatically rebuilds around healthy players and still targets exactly 240 regulation minutes.
- The pre-injury preferred rotation is backed up and restored when the team returns to full availability, unless roster transactions make that old rotation invalid.

## Game Day
- Pregame shows each team's unavailable players.
- A player can be injured during the possession engine and is removed from the remainder of that game.
- The substitution scheduler fills the open lineup slot immediately.
- The final screen includes a Postgame Medical report.
- Quick-sim games use the same persistent injury model after box-score generation.

## GM / League presentation
- Home surfaces a Medical Report when the user's team has injuries.
- Roster separates unavailable players and keeps healthy depth charts readable.
- Player profiles display injury status, expected return and a 0–99 durability proxy.
- League Pulse gains an INJURIES tab.
- Injuries to major players can surface as Around the League stories.

## v0.9 limitations
- No real historical injury database is asserted.
- No explicit body-part recurrence model yet.
- No surgery/reinjury/medical-staff system yet.
- Day-to-day players are treated as unavailable until their estimated return date rather than questionable/game-time decisions.
