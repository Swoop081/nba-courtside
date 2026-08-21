# NBA Courtside — v0.37 League Events, Awards + Season Moments

## Goal
Turn the NBA calendar into a sequence of major occasions rather than 82 interchangeable dates. v0.37 adds a persistent league-event layer that uses the same Living League state, media surfaces, transaction history, College/Draft world and social feed established in v0.32–v0.36.

## Save model
No formal save-schema bump. `nbaCourtsideSaveV25` remains the save key/schema. v0.37 adds an additive `state.leagueEvents.version = 37` branch with per-season event state, moment history, All-Star state, deadline state, playoff-race snapshots, Combine state, Summer League state and awards-show state.

Existing v0.36 franchises migrate in place. `catchUpLeagueEventsV37()` backfills eligible season events when an older save is first loaded after an event date has already passed.

## League Events hub
A new League Events destination provides four persistent views:
- Season — playoff race and archived season moments
- Awards — live award ladders
- All-Star — selections, contests and All-Star Game results
- Deadline — trade-deadline desk, rumors and completed CPU deals

The Daily Hub and League Pulse both link into the event hub. Major events also feed the existing Daily Broadcast and Courtside Social systems.

## Awards races and awards show
Live ladders are available for:
- Most Valuable Player
- Defensive Player of the Year
- Rookie of the Year
- Sixth Man of the Year
- Most Improved Player
- Coach of the Year

The model uses persistent in-save performance, availability, team results and role context. Coach of the Year uses team results relative to roster-strength expectations. These are NBA Courtside simulation outcomes, not predictions or factual real-world votes.

At season end, v0.37 permanently stores:
- six major award winners
- simulated top-five ballot shares
- All-NBA First / Second / Third Teams
- All-Defensive First / Second Teams
- All-Rookie First / Second Teams

The Awards Show presents winners, simulated voting shares and all league teams. Awards are also written into the existing season-history path when the offseason begins.

## All-Star Weekend
The v0.37 All-Star layer is an explicitly simulated NBA Courtside event format because future real-world All-Star format details can change.

It includes:
- 12-player East selection
- 12-player West selection
- five starters and seven reserves per conference
- performance/reputation plus deterministic fan/media/player-style starter signal
- 8-player Three-Point Contest
- 4-player Dunk Contest
- 20-player Rising Stars pool
- All-Star Game
- All-Star MVP
- simulated social reaction and snub discussion

All-Star events do not alter regular-season player statistics or NBA Game Day RNG.

## Trade Deadline Day
The existing v0.33 active-front-office market remains authoritative. v0.37 adds a dedicated deadline-event treatment:
- days-to-deadline / Deadline Day state
- simulated Shams Charania deadline-desk presentation
- active rumor list
- completed CPU-deal list
- transaction count
- persistent deadline-close season moment

Formal user trade proposals still use the existing Accept / Decline / Modify workflow and can still block calendar advancement.

## Playoff race
From March onward, v0.37 creates persistent playoff-race snapshots and detects meaningful status changes:
- Clinched Playoffs
- Clinched Postseason
- Eliminated
- In Race

Status changes become permanent season moments and can surface through social/media presentation. The standings remain the existing NBA Courtside standings; this is a presentation/event layer, not a second standings engine.

## 2027 NBA Draft Lottery presentation
The underlying NBA Courtside draft engine already implements the official 2027 **3-2-1 Lottery** structure approved by the NBA Board of Governors on 28 May 2026. v0.37 turns that structure into a full commissioner-led event rather than replacing it with the former 14-team lottery.

Source: NBA.com, “NBA Board of Governors approves new Draft Lottery system to address tanking” — https://www.nba.com/news/nba-board-governors-approve-new-draft-lottery-system

Implemented rules retained by v0.37:
- 16 lottery teams beginning with the 2027 Draft
- three / two / one lottery-ball allocation
- teams outside the Playoffs and Play-In normally receive three balls
- the three worst records are draft-relegated from three balls to two
- No. 9 and No. 10 Play-In seeds receive two balls
- losers of the No. 7 vs. No. 8 Play-In games receive one ball
- all 16 lottery positions are drawn
- draft-relegated clubs have a No. 12 pick floor
- a club’s own pick cannot be No. 1 in consecutive Drafts
- a club’s own pick cannot be top five in three consecutive Drafts

The event screen shows every participant’s ball allocation and first-draw share. Traded pick rights continue to resolve through the certified future-pick ledger; lottery treatment follows the pick’s originating team.

Adam Silver is used as a **simulated commissioner presentation**. No real quote, voice or likeness asset is embedded.

## NBA Draft Combine
The Pre-Draft Scouting phase now includes a Combine layer:
- measurements
- wingspan
- vertical
- sprint
- agility
- scouting-confidence increase

Future Combine data is generated as in-universe simulated scouting evidence and explicitly labeled as such. It is not presented as future real-world measurements.

## Draft Night
The existing two-round draft and draft-night trade engine remain intact. v0.37 adds event presentation:
- Adam Silver simulated commissioner stage for Round One
- Mark Tatum simulated deputy-commissioner stage for Round Two
- live recent-pick tracker
- draft-night trades through the existing legal pick/transaction engine
- simulated team draft grades relative to the current scouting board
- undrafted players continue into the existing free-agent / G League pathway

Represented executives are presentation roles only; generated copy is simulated rather than a real quote.

## Summer League bridge
After the Draft, the Free Agency phase can run a five-game Summer League development bridge for rookies and young players. It produces:
- five-game evaluation sample
- PPG / RPG / APG presentation
- showcase MVP
- development / Two-Way / rotation stock notes
- persistent season moment

Summer League results do not alter regular-season NBA statistics. This is a development bridge for future deeper Summer League/G League integration, not yet a complete official Summer League schedule simulator.

## Shared event stream
v0.37 keeps one event truth. A generated season event can surface as:
- League Events history
- Daily Hub lead story
- Courtside Social reaction
- League Wire / deadline presentation
- offseason event presentation

This avoids creating contradictory “news” that is disconnected from the actual franchise simulation.

## Simulation / likeness boundary
Sports-media personalities, players, coaches and league officials can appear as clearly labeled simulated presentation identities. Generated dialogue, opinions, award votes, reactions, measurements and future outcomes are gameplay simulation, not factual claims or real quotes. No voices or likeness artwork are bundled in v0.37.

## Unchanged foundations
v0.37 does not retune the v0.29 ratings/source foundation, NBA Game Day rates, contracts, CBA, 2026–27 NBA schedule/Cup, future-pick rights, G League data, College/Draft source seed, Active Front Offices or Player Relations logic except where those systems feed the new event presentation.
