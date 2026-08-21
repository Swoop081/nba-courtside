# NBA Courtside — v0.43 Franchise Direction + GM Evaluation

**v0.43 supersedes v0.42 as the working baseline.** It retains the Navigation + Presentation consolidation and the complete Living League / Game Day stack, then gives the player a persistent strategic mandate and front-office accountability loop.

## v0.43 headline changes

- **Opening ownership brief:** every franchise gets a simulated organizational mandate built from competitive window, roster power, payroll, age curve and draft position. Real owner/governor identity is presentation data; management preferences are explicitly gameplay simulation, not factual claims.
- **Five core season objectives + optional stretch goal:** results, development, financial discipline, roster building and player management are measured throughout the year.
- **Dynamic expectations:** major long-duration injuries to high-value players can reduce the modeled win target without erasing accountability in other areas.
- **GM Performance:** Results / Roster Building / Player Management / Financial / Organizational Direction roll into Excellent / Strong / Stable / Under Pressure / Critical status.
- **Ownership confidence:** persistent within the season and updated at formal review checkpoints.
- **Milestone reviews:** Opening Night, 20 Games, New Year, Trade Deadline, Regular-Season End and End of Season.
- **Home Front Office Briefing:** season goal, GM standing, objective progress and biggest concern are visible without opening another workspace.
- **Dedicated Franchise Direction screen:** full objectives, pillar scores, ownership brief, dynamic adjustment explanation and review history.
- **GM career foundation:** completed season evaluations are archived for future firing, extension, reputation and multi-team career systems.
- **Save compatibility:** formal save schema remains 25 (`nbaCourtsideSaveV25`); v0.43 stores the new layer additively.
- **No simulation rewrite:** Game Day, ratings, CBA, contracts, health, staff, relationships, draft, G League and transaction engines retain v0.42 behavior.
- **Release-specific v0.43 runtime URLs** preserve GitHub Pages / iPhone Safari cache coherence.

See `docs/FRANCHISE_DIRECTION_GM_EVALUATION_V43.md`, `docs/VALIDATION_V43.md` and `data/franchise-direction-certification-v0.43.json`.

---

# NBA Courtside — v0.42 Navigation + Presentation Consolidation

**v0.42 supersedes v0.41 as the working baseline.** It keeps the full Living League and Game Day feature stack intact, but reorganizes the product around five coherent destinations and one universal GM decision queue.

## v0.42 headline changes

- **Five-world navigation:** Home / Team / League / Deals / More replaces the old Home / Roster / League / Market / Trade bar.
- **Persistent league context:** the sticky header carries team, record, date, today state and required-action count across the franchise app.
- **Universal GM Inbox:** formal trades, blocking player conversations, staff vacancies and RFA match decisions are consolidated into one Action Center; medical return recommendations surface as review items.
- **Team Workspace:** roster/rotation, Player Relations, Health + Performance, Staff + Organization and Contracts + Cap are grouped under one canonical Team destination.
- **Deals Workspace:** Trade Center, Free Agency Live, Cap + Rights and the G League talent pipeline are grouped under one front-office destination.
- **League World:** the existing NBA Pulse is paired with League Events, College + Draft and G League portals.
- **Global search:** lazy search finds NBA players, NBA teams, draft prospects and staff without forcing a navigation reset.
- **Mobile consolidation:** workspace cards collapse cleanly on compact phones, search results are scroll-contained, persistent context is compact, and existing safe-area behavior is retained.
- **No simulation rewrite:** v0.41 coaching, v0.40 health, v0.39 contracts/agents, v0.38 staff careers, v0.37 events, v0.36 relationships, v0.35 College/Draft, v0.34 G League, v0.33 front offices, v0.32 broadcast presentation and v0.29 ratings remain intact.
- **Save compatibility:** formal save schema remains 25 (`nbaCourtsideSaveV25`); v0.42 adds only additive UI preferences.
- **Release-specific v0.42 runtime URLs** continue the iPhone Safari/GitHub Pages cache-coherence protection.

See `docs/NAVIGATION_PRESENTATION_V42.md` and `docs/VALIDATION_V42.md`.

---

# NBA Courtside — v0.41 Deeper Game Day Coaching + Tactical Control

**v0.41 supersedes v0.40 as the working baseline.** It preserves the certified Living League, ratings, CBA, active front offices, G League, College/Draft, Player Relations, League Events, Staff Careers, Contracts/Agents and Health + Performance foundations, then turns live Game Day into a real coaching layer without replacing the calibrated possession engine.

## v0.41 headline changes

- **Three coaching modes:** Full Auto preserves the hands-off experience; Assisted pauses for major coaching decisions; Manual gives direct timeout, substitution, matchup and tactical control.
- **Persistent coaching preferences:** additive `save.gameDayCoaching.version = 41` stores coaching mode, rotation plan and recent tactical choices. Formal franchise save schema remains 25 (`nbaCourtsideSaveV25`), so existing v0.40 franchises migrate without reset.
- **Pregame rotation plans:** Normal, Shortened, Protect Vets and Development reshape the planned 240 minutes while preserving starters, health restrictions, foul-outs and roster legality.
- **Timeout management:** both teams begin with seven timeouts. Manual and CPU timeout logic responds to scoring runs and late-game context; timeouts provide only a small bounded energy reset and do not create artificial rating boosts.
- **Live substitutions:** manual lineup changes are available in Manual/Assisted play, with Resume Auto Subs returning control to the rotation engine. Medical minute caps, rest designations, injuries and six-foul disqualifications remain authoritative.
- **Foul-trouble coaching:** individual fouls are visible in the live cards; Full Auto protects players contextually, Assisted can stop for a decision, and a sixth foul automatically removes the player from the active lineup.
- **Offensive tactics:** Balanced, Play Through Star, Attack Paint, More Threes, Push Tempo, Slow Pace, Feed Post and Pick + Roll.
- **Defensive tactics:** Balanced, Drop, Switch, Blitz, Zone, Protect Paint and Stay Home on Shooters.
- **Primary matchup assignments:** the user can assign an on-court defender to an opponent scorer. The effect is bounded, depends on the defender actually being on the floor and is scaled by the existing coach/staff model rather than overriding player ratings.
- **Halftime Coach's Room:** Assisted and Manual modes stop at halftime with first-half shooting/turnover/foul context, an assistant-coach recommendation and selectable second-half adjustments. Full Auto makes its own bounded halftime response.
- **Late-game strategy:** Auto, Foul, Protect Lead and No Foul settings add intentional-foul and clock-context behavior during the final possessions.
- **Coach + assistant integration:** v0.38 Staff Careers head-coach game-management/rotation ratings and current assistant identities feed recommendations and tactical effectiveness. Generated coaching advice remains explicitly gameplay simulation, not a real quote or factual opinion about represented staff.
- **TV-style live presentation:** Game Day adds a Coach Desk, timeout banners, foul-trouble alerts, matchup/substitution controls and halftime presentation while retaining the existing possession feed and box-score flow.
- **Health integration retained:** v0.40 fatigue, rest decisions, return-to-play restrictions and injury metadata remain authoritative. Dedicated runtime certification confirms a 24-minute medical cap finishes at exactly 24.0 minutes and a rest-designated player is excluded.
- **Result persistence:** completed games store `coaching_v41` context including final mode, tactics, timeouts used, matchup assignments and coaching log. Engine IDs are `courtside_v41_coaching_possession`, `courtside_v41_postseason_coaching_possession` and `courtside_v41_cup_coaching_possession`.
- **Calibration:** a 100-game Full Auto live Game Day sample produced 114.89 team PPG, 14.92 average margin, two overtime games, minimum team score 79 and maximum 151, inside the retained broad calibration gates.
- **Release-specific v0.41 runtime URLs** preserve iPhone Safari/GitHub Pages cache coherence across Franchise, Game Day and Exhibition entry points.
- No roster, rating, contract, CBA, schedule, future-pick, College/Draft, G League or underlying player simulation-profile rewrite is part of this release.

See `docs/GAME_DAY_COACHING_V41.md`, `docs/VALIDATION_V41.md` and `data/gameday-coaching-certification-v0.41.json`.

---

# NBA Courtside — v0.40 Injuries, Fatigue + Medical Staff

**v0.40 supersedes v0.39 as the working baseline.** It preserves the certified Living League, ratings, CBA, active front offices, G League, College/Draft, Player Relations, League Events, Staff Careers and Contracts/Agents foundations, then makes availability, workload and return-to-play persistent franchise decisions.

## v0.40 headline changes

- **Persistent Health + Performance:** additive `state.healthPerformance.version = 40`; formal save schema remains 25 (`nbaCourtsideSaveV25`) and existing v0.39 franchises migrate without reset.
- **Fatigue + workload:** actual minutes, back-to-backs, stamina, off days, training choices and staff quality now produce persistent fatigue. Heavy load can affect injury exposure and applies only a bounded team-performance penalty.
- **Availability states:** Available / Probable / Questionable / Doubtful / Out / Out · Rest are derived from the actual injury, return-to-play and workload state.
- **Return-to-play:** injury clearance now creates a short medical restriction with a recommended minute cap and modeled recurrence risk instead of snapping directly from Out to unrestricted.
- **GM load management:** Rest / 24 Min / 28 Min / Full Go plans are available for the next game. Limits and rest are enforced in both quick simulation and the live Game Day engine. A medical Full Go override is recorded in the history.
- **Training consequences:** Team Practice, Shooting Work, Defensive Install, Recovery Day, Film Session and Young Player Focus now have explicit physical workload/recovery effects in addition to their prior Living League effects.
- **Body-area history:** new injuries retain body area/group, base and adjusted recovery estimates, recurrence context and long-term medical history.
- **30 medical/performance departments:** every NBA club receives three deterministic fictional simulation staff (Head Athletic Trainer, Director of Performance, Rehab Specialist) with prevention/recovery/rehab/conditioning/return-to-play ratings. These are not factual ratings or identities of real medical personnel.
- **Medical policy:** Conservative / Balanced / Aggressive return-to-play policy changes the recovery/risk balance within bounded limits.
- **Health + Performance presentation:** dedicated Medical Center, roster-health dashboard, medical-staff view, history, player-profile health panel, Daily Hub/Roster portals and enhanced Game Day availability presentation.
- **Game Day health integration:** persistent fatigue affects starting energy; medical minute limits are hard-capped in the final box score; injuries created in Game Day retain v0.40 body-area/recurrence metadata and postgame workload returns to the shared franchise state.
- **Season calibration:** frozen full-season probe completes all 1,230 regular-season games with 83 reportable injury events, 4 major injuries, peak 11 simultaneous active injuries and no player above 82 regular-season games. These are simulation calibration results, not real-world predictions.
- **Release-specific v0.40 runtime URLs** preserve iPhone Safari/GitHub Pages cache coherence.
- v0.39 Contracts/Agents, v0.38 Staff Careers, v0.37 League Events, v0.36 Player Relations, v0.35 College + Draft, v0.34 G League, v0.33 Active Front Offices, v0.32 Daily Broadcast, v0.29 ratings/source foundation, CBA, official NBA schedule/Cup, future picks, postseason/offseason and granular Game Day simulation remain intact.

See `docs/HEALTH_PERFORMANCE_V40.md`, `docs/VALIDATION_V40.md` and `data/health-performance-certification-v0.40.json`.

---

# NBA Courtside — v0.39 Contracts, Agents + Free Agency Overhaul

**v0.39 supersedes v0.38 as the working baseline.** It preserves the certified Living League, ratings, CBA, active front offices, G League, College/Draft, Player Relations, League Events and Staff Careers foundations, then turns free agency and extensions into a persistent negotiation market rather than a one-click signing screen.

## v0.39 headline changes

- **Persistent contract market:** additive `state.contractMarket.version = 39`; formal save schema remains 25 (`nbaCourtsideSaveV25`) and existing v0.38 franchises migrate without reset.
- **Simulated player representation:** every player is deterministically linked to one of 12 fictional NBA Courtside agents across six fictional agencies. Agent identities, priorities and behavior are explicitly gameplay simulation and are not claims about a real player's actual representation.
- **Six negotiation archetypes:** Money First, Security First, Winning First, Role First, Flexible and Market Maker alter how offer value is interpreted without overriding the certified CBA legality engine.
- **Player priorities:** money, projected role, winning, loyalty, market appeal, basketball fit and stability remain the underlying free-agent preference factors; the simulated agent layer changes emphasis rather than replacing player/team context.
- **Persistent negotiations + counters:** low-value user offers can generate a stored agent counter. Accepting a counter creates a real pending offer; declining affects the relationship and the negotiation remains open.
- **Competing offers:** the negotiation sheet shows the current market leaders and evaluates the user's offer against live CPU bids instead of presenting free agents as an exclusive shop.
- **Dynamic asking prices:** unsigned players can soften their asking price as free-agency days pass and cap/roster opportunities disappear. High-end stars and players with strong active markets are protected from artificial discounting.
- **Contract expectations + market heat:** Max / Near Max / High-End Starter / Starter Money / Mid-Level / Rotation-Prove-It / Minimum / Two-Way-Minimum expectations plus Hot / Active / Open / Cooling / Value Window market states.
- **Offer frameworks:** Prove It, Balanced, Market, Long Term, Player Flex, Team Control and Bird Security (when legal) provide quick contract structures; every submission is rechecked through the existing CBA route engine.
- **Extension talks:** legal extension windows now use a full agent-negotiation sheet with player willingness, max first-year salary, max years, counters and option structure. The existing source-safety boundary remains: starting-veteran extension anniversaries are not fabricated when the original signing date is not certified; prospective in-save contracts and other certified windows work normally.
- **RFA continuity:** qualifying offers, offer sheets and match decisions remain controlled by the existing CBA engine; v0.39 adds negotiation/market presentation and persistent offer-sheet history around those outcomes.
- **Bird-rights visibility:** negotiation screens expose the user's current rights level, cap hold and legal signing routes rather than hiding the mechanism behind a generic Sign button.
- **Sign-and-trade bridge:** when the user holds a legal rights framework, the negotiation sheet can send the player directly into the existing certified Trade Center sign-and-trade workflow.
- **Free Agency Live:** the offseason Home becomes a dedicated live market desk with available-player count, active talks, pending offers, cap room, simulated Shams-style Free Agency Wire, top available players, RFA match actions and roster-status gating.
- **Player profiles:** simulated agent, agency, relationship, priorities and current contract target are visible from the player's profile.
- **Permanent agreement history:** completed negotiated signings record player, club, years, first-year salary, option, route and simulated agent in the contract-market history while the existing contract/transaction history remains authoritative.
- **Release-specific v0.39 runtime URLs** preserve the iPhone Safari/GitHub Pages cache-coherence protection.
- v0.38 Staff Careers, v0.37 League Events, v0.36 Player Relations, v0.35 College + Draft, v0.34 G League, v0.33 Active Front Offices, v0.32 Daily Broadcast, v0.29 ratings/source foundation, CBA, NBA schedule/Cup, future picks, postseason/offseason and granular Game Day simulation remain intact.

See `docs/CONTRACTS_AGENTS_FREE_AGENCY_V39.md`, `docs/VALIDATION_V39.md` and `data/contract-market-certification-v0.39.json`.

---

# NBA Courtside — v0.38 Staff Careers + Coaching Market

**v0.38 supersedes v0.37 as the working baseline.** It preserves the certified Living League, ratings, CBA, active front offices, G League, College/Draft, Player Relations and League Events foundations, then turns coaching and basketball-operations staff into persistent careers that can change the league over time.

## v0.38 headline changes

- **Persistent Staff Careers:** additive `state.staffCareers.version = 38`; formal save schema remains 25 (`nbaCourtsideSaveV25`) and existing v0.37 franchises migrate without reset.
- **30 live organizations:** current real-world personnel identities continue to seed every NBA organization from the frozen 21 August 2026 organization snapshot: primary owner/governor, lead basketball executive, separate GM where applicable, head coach and key assistants.
- **Simulation boundary:** staff ratings, schemes, contract bands, job-security scores, generated candidates, career decisions and generated comments are explicitly **NBA Courtside gameplay simulation**, not factual assessments, contracts, opinions or quotes about represented people.
- **Coach ratings:** offense, defense, development, rotations, young-player trust, game management and leadership.
- **Executive ratings:** trading, drafting, cap management, scouting, contracts, roster building and leadership.
- **Coaching identity:** Pace + Space, Rim Pressure, Half-Court Control, Defense First, Motion Offense and Balanced scheme families, with roster-fit scoring and bounded on-court influence.
- **Contracts + job security:** simulated staff agreements, years remaining, extension/expiry logic and Secure / Stable / Watch / Hot Seat / Critical security states driven by expectations, results and organizational context.
- **Relationships:** ownership/front-office/locker-room alignment plus GM–coach working relationships can create tension without turning the system into deterministic drama.
- **Hot seats + firings:** CPU clubs periodically evaluate coaches/executives; regular-season and offseason dismissals feed the Living League event/news stream.
- **Hiring market:** vacancies generate candidate boards, interviews and hires. Internal assistants can earn head-coach promotions; separate GMs can become lead-executive candidates; other-team assistants and a replenishing fictional career pool support long saves.
- **User accountability:** the user's head-coach or lead-executive vacancy becomes an Action Required item and blocks calendar advancement until the job is filled.
- **Staff careers over time:** extensions, departures, promotions, firings, hires and eventual retirements persist to a permanent staff history ledger.
- **Staff presentation:** dedicated Staff Careers destination plus Daily Hub, League Pulse, organization sheets, League Wire, NBA Today/Shams-style simulated coverage and Courtside Social integration.
- **Bounded basketball effect:** coaching quality/fit nudges team offense/defense by roughly no more than ±1.15 rating points; granular player Game Day profiles remain unchanged. A two-season calibration produced 116.83 team PPG, .547 home win rate and 11.41 average margin with zero box-score/rotation-minute integrity errors.
- **Long-horizon staff certification:** a staff-specific offseason harness reaches 2042 with all 30 teams retaining a head coach, lead executive and at least four key assistants; 26 retirements occurred and the generated candidate market replenished successfully.
- Release-specific **v0.38** Franchise/Game Day/Exhibition runtime URLs preserve iPhone Safari/GitHub Pages cache coherence.
- v0.37 League Events, v0.36 Player Relations, v0.35 College + Draft, v0.34 G League, v0.33 Active Front Offices, v0.32 Daily Broadcast, v0.29 ratings/source foundation, CBA, NBA schedule/Cup, future picks and Game Day simulation remain intact.

See `docs/STAFF_CAREERS_V38.md`, `docs/VALIDATION_V38.md` and `data/staff-careers-certification-v0.38.json`.

---

# NBA Courtside — v0.37 League Events, Awards + Season Moments

**v0.37 supersedes v0.36 as the working baseline.** It preserves the certified Living League, ratings, CBA, active front offices, G League, College/Draft and Player Relations foundations, then turns the season calendar into persistent marquee NBA events with awards, All-Star Weekend, deadline pressure, playoff-race moments, Lottery/Combine/Draft presentation and a Summer League bridge.

## v0.37 headline changes

- **Persistent League Events:** additive `state.leagueEvents.version = 37`; formal save schema remains 25 (`nbaCourtsideSaveV25`) and existing v0.36 franchises migrate without reset. Passed eligible event dates can be catch-up initialized when an older save first loads.
- **League Events hub:** Season, Awards, All-Star and Deadline views provide one home for major moments, live races and permanent event history. Daily Hub and League Pulse both feed into it.
- **Awards ecosystem:** live MVP, DPOY, ROY, Sixth Man, Most Improved and Coach of the Year ladders; final simulated voting shares; All-NBA First/Second/Third, All-Defensive First/Second and All-Rookie First/Second teams; permanent season-history storage.
- **All-Star Weekend:** simulated 12-player East and West selections, starters/reserves, Three-Point Contest, Dunk Contest, Rising Stars, All-Star Game and MVP. Selection/snubs/results can feed simulated social presentation. The format is labeled NBA Courtside simulation rather than asserted as a future real-world format.
- **Trade Deadline event:** the existing v0.33 market now drives a Shams Charania-style simulated deadline desk with countdown state, active rumors, completed CPU deals and a permanent deadline-close moment.
- **Playoff Race:** March-onward standings snapshots can identify Clinched Playoffs, Clinched Postseason and Eliminated changes and write them into the season-moment stream.
- **2027 3-2-1 Draft Lottery presentation:** the game retains the official 16-team 3-2-1 foundation approved by the NBA Board of Governors for the 2027–29 Drafts, including draft relegation, No. 12 floor and own-pick repeat restrictions, and now presents all participant ball allocations/first-draw shares through a simulated Adam Silver commissioner stage.
- **Draft Combine:** future measurements/testing are generated as clearly labeled simulated franchise-world scouting evidence and narrow scouting uncertainty rather than pretending to be real future Combine data.
- **Draft Night presentation:** simulated Adam Silver Round One and Mark Tatum Round Two stages, existing legal draft-night trades, live tracker and simulated team draft grades.
- **Summer League bridge:** five-game rookie/development evaluation with PPG/RPG/APG, showcase MVP and Two-Way/rotation stock notes; it does not alter NBA regular-season stats.
- **One event truth:** season moments can surface in the Event Hub, Daily Broadcast and Courtside Social rather than being separately invented on each screen.
- **Simulation boundary:** generated media copy, represented-person comments, votes, future measurements and reactions are explicitly gameplay simulation, not real quotes or factual future outcomes; no likeness art or voices are bundled.
- Release-specific **v0.37** Franchise/Game Day/Exhibition runtime URLs preserve iPhone Safari/GitHub Pages cache coherence.
- v0.36 Player Relations, v0.35 College + Draft, v0.34 G League, v0.33 Active Front Offices, v0.32 Daily Broadcast, v0.29 ratings/source foundation, CBA, NBA schedule/Cup, future picks and Game Day simulation remain intact.

See `docs/LEAGUE_EVENTS_V37.md`, `docs/VALIDATION_V37.md` and `data/league-events-certification-v0.37.json`.

---

# NBA Courtside — v0.36 Player Morale, Roles + Relationships

**v0.36 supersedes v0.35 as the working baseline.** It preserves the certified NBA/G League/College Living League, ratings, CBA, schedule, active-front-office and Daily Broadcast foundations, then makes roster management materially human through persistent player expectations, relationships and consequences.

## v0.36 headline changes

- **Persistent Player Relations:** additive `state.playerRelations.version = 36`; the formal save schema remains 25 (`nbaCourtsideSaveV25`) and existing v0.35 franchises migrate without a reset.
- **Seven contextual player roles:** Franchise Player, Starter, Sixth Man, Rotation, Development, Two-Way and Depth. Expectations derive from the current roster/team context rather than becoming permanent labels on the player record.
- **Expanded morale model:** role/playing time, winning, contract security, team direction, stability, coach trust, locker-room chemistry and recent individual form now feed persistent morale.
- **Coach relationships:** every player carries a persistent relationship with the current head coach. Role delivery, minutes and promises can move trust; a coaching change resets toward a new coach-specific baseline rather than carrying the old relationship forward.
- **Locker-room chemistry:** teams receive Connected / Stable / Fragile / Fractured chemistry bands plus Leaders, Young Core, Veterans, New Arrivals and Disgruntled context groups.
- **Front Office Conversations:** playing-time, coach-trust, contract, team-direction, stability and trade-request concerns feed one actionable queue. Severe issues can become **Action Required** and block advancing the day until the GM responds.
- **Promises with consequences:** Bigger Role, Starting Opportunity, Development Focus, No-Trade Commitment and Playoff Push promises persist with deadlines and are evaluated from actual subsequent behavior. Kept promises improve relationships; broken promises materially damage morale/trust and can become league-media events.
- **No-trade commitment is enforced:** while active, the promised player receives a real trade restriction in the existing transaction engine rather than a cosmetic status badge.
- **Trade requests:** sustained severe morale can create a formal request. Existing CPU market logic consumes the request state, so unhappy players can become more available around the league.
- **Extension outlook:** Eager / Open / Uncertain / Reluctant / Not Interested is calculated from morale, role, winning, coach trust and stability. The certified CBA extension engine remains authoritative; player willingness can now stop an otherwise legal negotiation.
- **Player Relations presentation:** dedicated destination, Daily Hub conversation module, roster portal, enhanced player-profile relationship panel, active promises and simulated player reactions in Courtside Social.
- **Simulation disclaimer:** generated personalities, relationships, comments and reactions are gameplay systems, not factual claims or real quotes about real players/coaches.
- Release-specific **v0.36** Franchise/Game Day/Exhibition runtime URLs preserve iPhone Safari/GitHub Pages cache coherence.
- v0.35 College + Draft, v0.34 G League, v0.33 Active Front Offices, v0.32 Daily Broadcast, v0.29 ratings/source foundation, CBA, NBA schedule/Cup, postseason/offseason and granular Game Day simulation remain intact.

See `docs/PLAYER_RELATIONSHIPS_V36.md` and `docs/VALIDATION_V36.md`.

---

# NBA Courtside — v0.35 College + Draft World

**v0.35 supersedes v0.34 as the working baseline.** It keeps the certified NBA/G League Living League, ratings, CBA, schedule and active-front-office systems and adds a persistent season-long college scouting and 2027 Draft world.

## v0.35 headline changes

- **Persistent College + Draft World:** additive `state.collegeDraft.version = 35` with no formal save-schema bump; existing `nbaCourtsideSaveV25` franchises migrate without a reset.
- **Source-backed 2027 watch class:** 30 early prospects are seeded from the CBS Sports 29 June 2026 top-30 mock/watch list (29 college + Stefan Joksimović/Baskonia). The published order is treated as an initial prior, not guaranteed future truth.
- **44 tracked draft-relevant college programs** across the major conferences feed the NBA scouting universe. This is a draft-world subset, not a false claim that the complete Division I ecosystem is already playable.
- **Clearly simulated college calendar:** tracked programs receive deterministic Tuesday/Wednesday/Saturday slates, persistent records and recent results. The balance model reaches 30 games per tracked program by mid-March; generated fixtures/results are labeled simulation rather than official future schedules.
- **Prospect season simulation:** linked prospects accumulate simulated game lines, season production, recent performances and bounded draft-stock movement.
- **Fog-of-war scouting:** weekly credits can be assigned to an individual or position group. Scouting raises confidence and narrows visible NBA-readiness/potential ranges instead of instantly revealing a magic exact rating.
- **Live Big Board:** the source seed evolves with simulated performances and stock; the board is not frozen to the June ranking.
- **Live 30-pick Mock Draft:** uses the current NBA universe, roster needs and the existing first-round pick-right ledger rather than a hard-coded draft order.
- **Draft Watch on the Daily Hub:** prospect performances and stock stories enter the same Living League media flow as NBA/G League events.
- **Draft-night persistence:** the first 30 2027 draft players retain the sourced prospect identities and scouting/stock context. Because the current frozen source pool is only 30 deep, players 31–60 remain explicitly `fictional_2027_second_round_depth` instead of being passed off as real future prospects.
- **Dedicated College + Draft destination:** Big Board, Mock Draft, College and Scouting tabs plus prospect detail sheets and watchlists.
- NBA ratings/source rows, contracts, CBA, official NBA schedule, NBA Cup, future-pick ledger, Game Day simulation, active front offices and the v0.34 G League layer remain intact.
- Franchise, Game Day and Exhibition use release-unique **v0.35** runtime URLs to preserve iPhone Safari/GitHub Pages cache coherence.

See `docs/COLLEGE_DRAFT_WORLD_V35.md` and `docs/VALIDATION_V35.md`.

---

# NBA Courtside — v0.34 G League Foundation

**v0.34 supersedes v0.33 as the working baseline.** It keeps the certified NBA Living League, ratings, CBA, schedule and active-front-office systems and adds a source-bounded NBA G League world underneath the 30 NBA organizations.

## v0.34 headline changes

- **31-team G League world:** all 30 NBA affiliates plus the unaffiliated Mexico City Capitanes are represented for 2026–27. The Coachella Valley Lakers and Laketown Squadron use their 2026–27 identities.
- **Affiliate integration:** every NBA franchise now has a direct G League entry from the Daily Hub and League screen, with affiliate record, latest simulated result and Two-Way slot status.
- **Official Two-Way status layer:** the 21 August 2026 NBA G League tracker snapshot is represented across all 30 NBA clubs (75 filled Two-Way slots in the frozen source snapshot). This layer does not fabricate missing NBA player records.
- **Two-Way assignment / recall hook:** when a tracker player is already present in the certified NBA player database (for example Dillon Mitchell), the user can assign or recall him from the affiliate screen. Other tracker names remain honest status records until their NBA player layer is sourced.
- **Scout G League:** the current verified 12-player 2026 G League United roster forms the first source-backed NBA call-up board. Players can be sorted by Best Available, Shooting, Playmaking, Defense or Size.
- **Conservative NBA call-up projections:** G League performance is translated to a deliberately modest 65–73 OVR NBA projection band. A G League stat line is never written into `stats_2025_26`; signed players remain explicitly marked as having no 2025–26 NBA sample.
- **Real NBA minimum signings:** call-ups run through the existing CBA minimum-salary route and `installContract()` transaction engine, including roster and hard-cap legality checks. CPU clubs can also make limited G League call-ups.
- **Simulated G League standings/results:** until the official 2026–27 schedule is published, NBA Courtside runs a clearly labeled provisional 50-game world model (14-game Tip-Off segment + 36-game regular season) using a deterministic hash path separate from the NBA simulation RNG.
- **No invented 2026–27 rosters:** current affiliations, current Two-Way contracts and the verified G League United scouting pool are sourced. Unpublished camp/opening rosters and exact future game dates are not presented as factual.
- **Market integration:** Free Agency now surfaces a G League Call-Ups module so inexpensive roster help is discoverable without leaving the transaction workflow.
- Existing save schema remains **25** (`nbaCourtsideSaveV25`). `state.gLeague` is additive and migrates without forcing a new franchise.
- All Franchise, Game Day and Exhibition entry points use release-unique **v0.34** runtime URLs, preserving iPhone Safari/GitHub Pages cache coherence.
- NBA player ratings, certified source rows, contracts, CBA, draft assets, official NBA schedule, NBA Cup, postseason/offseason and granular Game Day simulation remain unchanged from v0.33/v0.29.

See `docs/G_LEAGUE_FOUNDATION_V34.md` and `docs/VALIDATION_V34.md`.

---

# NBA Courtside — v0.33 Active Front Offices + Trade Ecosystem

**v0.33 supersedes v0.32 as the working baseline.** It keeps the v0.32 Daily Broadcast presentation and makes the other 29 NBA front offices active participants in the league world.

## v0.33 headline changes

- **Live team direction:** every CPU club moves among CONTENDER, PLAYOFF PUSH, COMPETITIVE, RETOOLING, REBUILDING and DEVELOPMENT according to record, roster strength, age curve, young talent, stars and major injuries.
- **Simulated GM decision models:** six stable gameplay archetypes — Aggressive Trader, Star Hunter, Pick Hoarder, Cap Conscious, Development First and Veteran Builder — influence transaction behavior. These are explicitly simulated and are not claims about the real executives.
- **Owner directives and coaching models:** payroll/competitive-state owner pressure plus CPU rotation depth, young-player willingness and coaching emphasis. CPU rotation plans may re-evaluate approximately every 14 days; the user's rotation is not overwritten.
- **Active CPU↔CPU trade market:** buyer/seller logic, roster needs, player availability, salary matching, CBA legality, draft assets and team-level cooldowns now drive completed league trades. Market activity increases after New Year and near the deadline.
- **Trade rumors become world events:** rumors surface through the League Wire, NBA Today presentation and simulated social feed before/around transaction activity.
- **Incoming trade proposals are generated from the real transaction evaluator**, remain mandatory GM actions, and can be Accepted, Declined or Modified/Countered.
- **Find Me Trades 2.0:** shop a multi-asset package and search by Best Value, Win Now, Draft Capital, Young Talent or Cap Relief. The game returns up to five CBA-legal frameworks the CPU already accepts.
- **Negotiation tools:** ask for a pick, remove a return player, cycle Top-4 / Top-8 / lottery protection on an outgoing first, and load CPU counter offers.
- **Trade Deadline Desk:** appears in the final 21 days with rumors, recent CPU trades and a 30-team live front-office board.
- **Permanent transaction context:** recent trades are visible from Trade Center and remain part of the shared league history feeding daily presentation.
- Living League migrates additively to **version 33** while save schema remains **25** (`nbaCourtsideSaveV25`). Existing v0.32 franchises require no reset.
- Release-specific **v0.33** Franchise/Game Day/Exhibition runtime URLs preserve the iPhone Safari/GitHub Pages cache-coherence rule.
- The v0.29 ratings/source foundation, schedule, NBA Cup, postseason/offseason and CBA engines remain intact.

See `docs/ACTIVE_FRONT_OFFICES_V33.md` and `docs/VALIDATION_V33.md`.

---

# NBA Courtside — v0.32 Daily Broadcast Overhaul

**v0.32 supersedes v0.31 as the working baseline.** It keeps the certified Living League, ratings, CBA, schedule and Game Day foundations, then rebuilds Franchise Home into a true daily NBA broadcast experience.

## v0.32 headline changes

- **NBA Courtside Live masthead replaces the legacy franchise hero** on the Living League Home, with the date, team record, today status, NBA slate, front-office inbox and league-wire counts immediately visible.
- **Advance Day now produces a visible day-change digest** showing finals, transactions, injury updates, GM actions and the leading performance generated by the new day.
- **League Wire** provides a compact scrolling ticker for breaking front-office items, transactions, finals and the user franchise’s next game.
- **Broadcast modules are structurally distinct:** NBA Today headlines, SportsCenter Performance of the Night, Inside the NBA roundtable, Shams-style breaking alerts and a Courtside Social X/Twitter-style simulated feed.
- **Calendar advances one day at a time from the Daily Hub.** A no-game day is now a playable management day instead of being skipped.
- **Non-game-day activities:** Team Practice, Shooting Work, Defensive Install, Recovery Day, Film Session and Young Player Focus. The first pass records persistent activity/development credits; Practice/Recovery also affect locker-room morale, and Recovery reduces same-day quick-sim injury risk.
- **Media presentation layer:** SportsCenter / Scott Van Pelt, NBA Today / Malika Andrews, Inside the NBA / Ernie Johnson with Kenny Smith, Shaquille O'Neal and Charles Barkley, and Shams Charania-style breaking-news presentation are seeded as clearly labeled **simulated studio/news** surfaces. No voice, image or impersonated quote assets are included.
- **League office:** Adam Silver is represented as NBA Commissioner in the organization layer.
- **30 real NBA organizations:** every team has a primary owner/governor, lead basketball executive/GM, head coach and key coaching staff seed, frozen 21 August 2026. Team sheets expose those people together with the existing CPU team direction.
- **CPU formal trade proposals:** other clubs can initiate a CBA-legal player trade. Pending formal offers appear in the Front Office Inbox and **block Advance Day** until Accept / Decline / Modify is chosen. The first regular-season offer is forced no later than 10 league days after Opening Night if none has arrived organically, then later offers use cadence/chance controls.
- **Find Me Trades:** select one player in Trade Center and request up to five legal, CPU-acceptable frameworks. A result loads directly into the existing CBA trade builder for final inspection/proposal.
- **Simulated social feed:** fictional fan/analyst accounts, simulated player posts, team-staff reaction and insider transaction headlines respond to actual save events rather than a fixed text carousel.
- Existing save schema remains **25** (`nbaCourtsideSaveV25`); v0.32 adds optional `livingLeague` state without invalidating v0.31 saves.
- Franchise/Game Day/Exhibition runtime URLs are all release-unique **v0.32** assets, retaining the v0.30 cache-coherence rule.

## Validation

See `docs/VALIDATION_V32.md`. New v0.32 Living League, cache-coherence, postgame-resume, NBA Cup and CBA long-tail gates pass alongside retained ratings, save, postseason, offseason, pick-tree, transaction, device-layout and accessibility regressions.

## Scope boundary for this presentation pass

v0.32 retains the v0.31 event, media, organization, action-queue and trade framework while overhauling the Daily Hub presentation. The full G League and college/draft ecosystems will plug into that same world model. Full current G League rosters/free-agent sourcing and the season-long college-team/prospect universe are intentionally not fabricated in this release; they require their own sourced data pass next.

---

# NBA Courtside — v0.30 Ratings Cache-Coherence Hotfix

**v0.30 supersedes v0.29 as the working baseline.** It preserves the v0.29 Ratings Foundation and fixes a physical iPhone Safari / GitHub Pages cache-coherence failure that could show the v0.30/v0.29 shell while still executing v0.28 player data.

## v0.30 cache-coherence hotfix

- Runtime JavaScript assets now ship under release-unique v0.30 URLs on Franchise, Game Day and Exhibition.
- Navigation into Game Day / Exhibition and back to Franchise carries a v0.30 page cache key.
- Existing franchise saves remain compatible; no reset or new franchise is required.
- The ratings/data themselves are unchanged from certified v0.29.
- Boston smoke check: Payton Pritchard 79, Paul George 79, Jayson Tatum 89, Neemias Queta 76.
- Adds a regression that rejects unversioned runtime script references and verifies the shipped data bundle contains the v0.29 ratings values.

## Retained v0.29 foundation notes
**Frozen:** 21 August 2026  
**Baseline:** v0.28 Postgame Resume + Season-Started Boot Hotfix  
**Save schema:** 25 (`nbaCourtsideSaveV25`)


## v0.29 ratings foundation

- Replaces the old 50–99 league-percentile Overall model with an NBA-calibrated **current-ability scale**.
- Overall is now driven by per-game production/efficiency, real role/minutes and bounded low-sample protection for established players rather than unrestricted per-36 bench production.
- Impact is now availability-sensitive season value; a 10–20 game sample can no longer post an unshrunk elite Impact score.
- Defense summary uses position-adjusted box evidence plus bounded official recent All-Defensive recognition so elite perimeter defense is not reduced to steals/blocks alone.
- Recent All-NBA/All-Star recognition is used as a validation floor, not as a substitute for statistical evaluation.
- 393 certified 2025–26 NBA rows are exact-source audited; 49 no-NBA-sample players remain projection-only with no fabricated 2025–26 stats.
- Granular simulation profiles/rates are intentionally unchanged from v0.28 to preserve Game Day calibration.
- New distribution: **75 players 80+**, **29 players 86+**, **8 players 90+**, median **72**. v0.28 had 143 players at 80+.
- Regression examples: Paul Reed 84→71, Kel'el Ware 85→76, Sandro Mamukelashvili 85→74; Giannis 85→91, Jayson Tatum 80→89, Lu Dort 67→80, Herb Jones 69→77.
- Retained Cup regression also caught and fixes a misplaced v0.28 `ensureNBAProgress()` boot invocation that could recurse on season-started/Cup state; the initial call is now structurally outside the helper.

## v0.28 hotfix

- Boots to a real **Main Menu** instead of dropping directly into team selection.
- Main Menu routes: **Continue Franchise**, **New Franchise**, and **Exhibition**.
- Team selection is now a separate screen with a Back action.
- The in-franchise top-right button now returns to Main Menu without deleting the save.
- Starting a new franchise only replaces the current save after a team is chosen and confirmed.
- Repairs the literal escaped `\n` markup that was visible above the app on iPhone Safari and could prematurely terminate the document head.
- Storage reads/writes are guarded; unavailable local storage no longer aborts franchise boot, with session storage used where available.
- Game Day now reads/writes schema-25 saves first; Exhibition also reads the current v25 franchise universe first.
- No basketball data, ratings, simulation calibration, schedule, CBA, Bird-right, future-pick, or schema changes.

## Retained v0.26 release notes


NBA Courtside is an iPhone-first NBA franchise/GM simulator. **v0.25 supersedes v0.24 as the current working baseline.** This pass freezes the certified basketball/CBA model and hardens the app for a current-day 1.0 release candidate: accessibility, rendering performance, save migration and multi-season durability.

## v0.25 headline changes

- **Formal save schema 25** under `nbaCourtsideSaveV25`, with migration from supported legacy saves and per-key corruption fallback so a damaged newest save does not block recovery from a healthy older save.
- **Accessibility hardening:** skip links, visible keyboard focus, dialog semantics, Escape-to-close, `aria-current` navigation, polite live-region toasts, larger primary touch targets, reduced-motion support and increased-contrast support.
- **Mobile/rendering performance:** lazy player images, async image decoding, franchise-script preload hints, CSS containment on large repeated rows and scroll-snap containment for horizontal rails.
- **Free-agency scaling:** each CPU market round caches team roster/direction/need/cap context and pending-offer counts instead of rebuilding those structures inside every player/team evaluation.
- **Long-horizon durability:** an ten-season durability gate reaches 2036 with ten full 60-pick drafts, 600 generated prospects, future-pick horizon expansion to 1,020 cells, legal standard/Two-Way roster limits, unique player IDs and a JSON save round-trip after every season. Final serialized stress save: 2,915,788 bytes.
- The retained full offseason regression continues to certify the complete seven-day free-agency / training-camp bridge; the long-horizon gate adds repeated state-growth and migration pressure rather than replacing that behavioral test.

## Certified basketball/source foundation retained

- 442 player/right records.
- 393 season-final 2025–26 NBA evidence rows + 49 separate source-backed projections.
- 442/442 certified NBA Years of Service and first actionable Bird-right outcomes.
- 420/420 2027–2033 draft-origin cells, with executable claims and unresolved/pending rights safely locked.
- v0.22/v0.24 transaction engine: TPEs, sign-and-trade/BYC, waiting periods, apron restrictions, waiver claims, DPE, Two-Way/Exhibit 10, Team Salary / Apron Team Salary and related CBA long-tail mechanics.

## Source-safety boundary

v0.25 does not reinterpret or fabricate unresolved real-world inputs. The seven source-locked/pending future-pick cells and unsourced historical incentive/bonus/guarantee/signing-date details retain their existing safe boundaries.

## Validation

See `docs/VALIDATION_V25.md`, `docs/RELEASE_READINESS_V25.md` and `data/source-certification-v0.25.json`. The release gate includes save migration, accessibility/static interaction checks, ten-season durability, CBA/Bird/pick-tree regressions, Draft Night/offseason, NBA Cup, Game Day, postseason, official schedule and JavaScript syntax.

## Save compatibility

v0.25 writes **`nbaCourtsideSaveV25` / schema 25**. Supported legacy saves are migrated into a fully initialized v0.25 state. The loader attempts keys independently, so unreadable newer JSON can fall back to the next healthy supported save instead of destroying the franchise.


## v0.26 presentation release pass

- Retains the v0.25 schema-25, basketball, source, CBA and simulation foundation.
- Adds all-edge safe-area handling and dynamic viewport units for modern mobile browser chrome.
- Adds compact-phone reflow at 430/390/350 px and short-landscape handling.
- Improves dense text legibility without expanding the general mobile hierarchy.
- Modal sheets are inert/hidden to assistive tech when closed, trap keyboard focus while open, and restore focus to the invoking control when dismissed.
- Game Day and Exhibition receive compact scoreboard, controls, rotation, box-score and matchup scaling.
- New static device-layout and modal-focus audits are included in `scripts/`.


## v0.28 hotfix
- Fixes a release-blocking season-started boot crash caused by `ensureNBAProgress()` running before the NBA Cup constants were initialized.
- After Game Day, RETURN TO GM OFFICE now routes to `index.html?continue=1` and re-enters the active franchise directly.
- Main Menu Continue and New Franchise bindings remain functional after any completed game.
- Fresh launch still opens the Main Menu; `?new=1` may open team selection directly.
