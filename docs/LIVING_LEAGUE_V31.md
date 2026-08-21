# v0.31 Living League Foundation

## Design contract

NBA Courtside now treats the calendar date as the primary franchise unit. A date can be meaningful without a user game. The Home surface is a Daily Hub driven by save events rather than a static menu.

### Daily hierarchy
1. Lead Story / simulated studio desk
2. Required Front Office Inbox
3. Your Team Today — Game Day or non-game activity
4. Advance Day
5. Top Headlines
6. Around the League performances/results
7. Inside-the-NBA-style simulated roundtable
8. Simulated social feed
9. User franchise leadership
10. 30-team organization directory + league commissioner

### Event coherence
The presentation reads existing simulation state (`results`, box scores, transactions, injuries, standings, morale and team direction). The same transaction that changes the roster is the transaction surfaced by the insider/news/social layers. This is the foundation for a later normalized league-event archive.

### Non-game activities
- Team Practice: rotation morale +1.
- Recovery Day: rotation morale +2, recovery credit, 18% lower same-day quick-sim injury risk.
- Shooting Work: persistent shooting-development credit.
- Defensive Install: persistent defensive-development credit.
- Film Session: persistent film/scouting credit.
- Young Player Focus: one development credit to each of the three highest-rated players age 23 or younger.

Credits are intentionally conservative in v0.31 so the new presentation layer does not silently invalidate the v0.29 ratings/simulation calibration. Future development progression can consume these credits.

### Formal CPU trade inbox
Formal proposals are generated only when the existing transaction engine finds a player-for-player framework that passes the current CBA checks. The CPU value model must also prefer/accept its side. Optional second-round sweeteners can be included. Pending formal offers block daily advancement until the user accepts, declines or modifies.

### Find Me Trades
The first implementation is intentionally constrained to one selected outgoing player. It searches all CPU rosters for current CBA-legal one-player salary frameworks, filters out protected/locked assets, applies CPU trade-value acceptance, and returns the five best available frameworks when at least five exist. Optional second-round value can be attached where the CPU has surplus value.

## Real-person presentation boundary
The prototype stores public-role identity data for current NBA personnel and studio personalities requested for the intended experience. All generated show/news/social copy is visibly labeled `SIMULATED`, and v0.31 does not include likeness art, voices, copied broadcast graphics, or real quotations. Production/commercial use requires an appropriate licensing/brand review.

## Next data layers
- Full G League teams, affiliations, rosters, rights, two-way status, current production, contract/transaction availability.
- College team/prospect season universe with scouting evidence, draft projections and projection movement.
- Normalized persistent league-event archive feeding all media surfaces.
- Staff contracts/ratings, owner pressure, hiring/firing and organizational change events.
