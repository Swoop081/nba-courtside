# v0.13 — Proper Free Agency

## Design goal
Free agency is now a competitive GM phase rather than an instant shop. The player submits an offer, the rest of the league competes, and the free agent chooses a destination.

## Offer evaluation
Each free agent has deterministic simulation-only preference weights across:
- Money
- Role opportunity
- Winning
- Loyalty / incumbent rights
- Market appeal
- Basketball / timeline fit
- Contract security

The weights are derived from age, career role, the existing NBA Courtside personality model and deterministic player-specific variance. They are not claims about real-world preferences.

The contract itself is scored alongside the destination. Because money is only one component, a player can legitimately choose a slightly smaller offer from a stronger overall fit.

## Seven-day main wave
After the draft, the league enters a seven-day main negotiation wave. CPU teams seed offers on Day 1 and can add/upgrade bids as the week advances. Stars tend to wait longer; strong offers can close earlier. On Day 7 unresolved players with viable offers make a decision. Players without acceptable/available offers remain on the open market.

## User feedback
The UI intentionally does not show a raw hidden destination score. It reports the user's position as `LEADING`, `IN THE MIX`, `WORK TO DO`, or `LONG SHOT`, plus the player's three highest priority categories and the leading formal offers.

## Restricted free agency
If a user's RFA accepts an outside offer sheet, the user receives a match/decline decision with a simulated two-day main-wave deadline. CPU rights teams make their own match decision from player value, timeline and legal CBA route.

## CBA integration
Every formal offer must have a legal v0.12 CBA signing route. The route is checked again at signing because another signing may have changed cap room or exception availability. Pending offers do not reserve cap room; if a route disappears before a decision, that offer can no longer close.

## Offseason roster size
NBA Courtside allows an 21-player temporary offseason roster in this prototype so a GM can win a signing before making final cuts. Opening night remains capped at 15.

## Current-day 2026 late market
The frozen 19 August 2026 starting universe can still contain unresolved free agents/RFAs. Opening the Market activates a one-step late-market version of the same competitive system. Offers remain pending until the user resolves the market (or attempts to start the season). Any user-controlled RFA match decision must be settled before opening night.

## Remaining boundaries
- The seven-day main wave is a game abstraction for pacing, not a claim that every NBA free-agency transaction follows a seven-day decision clock.
- Pending offers do not reserve cap room; legality is checked again when the player actually chooses.
- Two-way contracts, Exhibit 10s, sign-and-trades, agent renegotiation/counteroffers and every specialist CBA edge case remain later passes.
- Team market appeal and player preference weights are simulation inputs, not assertions about real-world player intent.
