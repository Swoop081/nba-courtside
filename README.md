# NBA Courtside — v0.9 Injuries + Availability Pass

Current working prototype baseline.

## v0.9 headline
Roster depth now matters across the season. Injuries are persistent player events with estimated return dates, Game Day availability, automatic rotation replacement, postgame medical updates, league injury reporting and League Pulse headlines.

## Core loop
Build roster → set 240-minute rotation → play/sim Game Day → react to availability → accumulate real box scores → League Pulse reacts → make GM decisions → chase the postseason.

## New in v0.9
- persistent league-wide injuries
- age / minutes / stamina / prior-availability risk model
- day-to-day, minor, moderate and rare major injuries
- Game Day injury events that remove a player from the remainder of the match
- healthy replacements automatically inherit open minutes
- preferred rotations are backed up and restored after recovery where still legal
- Home and Roster medical reports
- player-profile availability + durability card
- League > Injuries report
- injury-driven League Pulse stories
- injury history stored in the franchise save

See `docs/INJURIES_AVAILABILITY.md` and `docs/VALIDATION.md`.
