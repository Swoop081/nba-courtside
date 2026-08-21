# NBA Courtside v0.38 — Staff Careers + Coaching Market

**Frozen:** 21 August 2026  
**Formal save schema:** 25 (`nbaCourtsideSaveV25`)  
**Additive subsystem:** `state.staffCareers.version = 38`

## Purpose

v0.38 turns the organization directory introduced by the Living League into a persistent career simulation. Coaches, assistants and basketball-operations executives can now be evaluated, dismissed, interviewed, hired, promoted, extended, depart and eventually retire. The goal is to make a multi-season NBA universe develop its own staff history without allowing staff ratings to overwhelm roster quality or calibrated Game Day behavior.

## Source and simulation boundary

The represented 2026 personnel identities continue to come from the frozen `organizations-v0.38.js` snapshot inherited from the sourced organization layer. Primary ownership/governor data remains outside the staffing market.

Everything evaluative introduced in v0.38 is gameplay simulation: staff ratings, schemes, contract bands, job security, candidate interest, relationships, generated comments, generated fictional candidates and career decisions. They are not factual claims about real coaches/executives, not reported contract terms and not real quotes.

## Staff model

### Coaches

Each coach receives seven deterministic simulated dimensions:

- Offense
- Defense
- Development
- Rotations
- Young-player trust
- Game management
- Leadership

Each head coach also receives one of six gameplay scheme families: Pace + Space, Rim Pressure, Half-Court Control, Defense First, Motion Offense or Balanced.

Roster fit is calculated separately from staff quality. A strong coach can therefore be a mediocre fit for a particular roster, and a good fit cannot transform a weak roster into a contender by itself.

### Executives

Lead executives and GMs receive seven deterministic simulated dimensions:

- Trading
- Drafting
- Cap management
- Scouting
- Contracts
- Roster building
- Leadership

Where a franchise has a separate GM below the lead executive, both identities remain represented. Separate GMs can later surface as lead-executive candidates.

## Contracts and job security

Staff agreements use simulated start/end seasons and salary bands. These are franchise-game mechanics rather than reported salary figures.

Job security is evaluated in five bands:

- SECURE
- STABLE
- WATCH
- HOT SEAT
- CRITICAL

The score considers results against expectation, team direction, staff quality, contract state and — for coaches — player/locker-room context. CPU teams periodically re-evaluate staff during the season and again in the offseason.

## Hiring, firing and promotions

A vacancy creates a real staffing problem rather than a cosmetic empty field.

The candidate market can include:

- Internal assistant coaches
- Assistants employed by other NBA teams
- Unemployed coaches/executives
- Separate GMs seeking lead-executive roles
- A replenishing pool of explicitly fictional career candidates for long saves

Internal assistants receive a legitimate promotion path to head coach. Fired staff cannot be instantly rehired by the same franchise in the same season.

For the user franchise, an empty head-coach or lead-executive position is **Action Required** and prevents Advance Day until the vacancy is resolved. CPU clubs fill vacancies through the same persistent career market.

## Relationships and organizational fit

v0.38 adds simulated working-relationship indicators covering coach–ownership, coach–front office, coach–locker room, executive–ownership and GM–coach alignment. These feed staff context and presentation without being factual claims about represented people.

## On-court influence

Coach quality and roster fit produce only a bounded team-level effect on offense/defense. The adjustment is capped around ±1.15 rating points and does not alter the granular player simulation profiles established by the ratings/Game Day foundations.

A two-season calibration across 4,800 team-games returned:

- Team scoring: 116.83 PPG
- Home win percentage: .547
- Average margin: 11.41
- Average best-team wins: 61.5
- Average worst-team wins: 17.5
- Box-score point integrity errors: 0
- Rotation-minute integrity errors: 0

Representative leaders remained plausible: Shai Gilgeous-Alexander 29.3 PPG, Luka Doncic 28.3 PPG, Nikola Jokic 10.9 APG / 13.1 RPG and Victor Wembanyama 3.1 BPG.

## Staff careers and long saves

Staff career history persists extensions, departures, dismissals, interviews/hirings, promotions and retirements. Long-tenure employed staff become eligible for a low-probability retirement path after sufficient simulated seasons.

A v0.38-specific long-horizon staff harness advanced the staffing ecosystem through 2042. At the endpoint:

- 258 staff objects existed
- 240 staff-history events had been written
- 26 staff had retired
- all 30 teams retained a head coach
- all 30 teams retained a lead executive
- every team retained at least four key assistants
- the fictional candidate market still contained available coaching and executive candidates

## Presentation integration

Staff careers are exposed through:

- Dedicated Staff Careers screen
- Daily Hub staff portal/action state
- League Pulse
- Organization sheets
- League Wire
- simulated Shams-style breaking staff news
- simulated NBA Today staff discussion
- Courtside Social
- permanent staff history

The media copy remains labeled simulation where represented real people are used in the presentation framework.

## Compatibility

No new franchise is required. v0.37 saves migrate additively into the v0.38 staff-career branch while continuing to use `nbaCourtsideSaveV25`.
