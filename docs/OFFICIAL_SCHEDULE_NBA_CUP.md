# NBA Courtside v0.17 — Official 2026–27 Schedule + NBA Cup

## Purpose
## v0.18 superseding note
The schedule/Cup architecture documented below remains active in v0.18. The v0.17 deep-tiebreak limitation has been superseded: v0.18 loads exact final 2025–26 team records and uses those records before the deterministic final draw. The current save key is `nbaCourtsideSaveV18`.

v0.17 replaces the fabricated 2026–27 1,230-game calendar used by the prototype with the NBA's released 2026–27 schedule wherever the league has actually assigned opponents and dates.

The NBA released 80 of each team's 82 regular-season games on Aug. 13, 2026. The other two games per team are intentionally unassigned because their opponents depend on Emirates NBA Cup Group Play results. NBA Courtside now mirrors that structure instead of inventing those 30 games in August.

## Imported official calendar
`data/schedule-2026-27.json` contains **1,200 assigned regular-season games** imported from the NBA's official schedule release.

Validated properties:
- 30 teams.
- 80 assigned games per team.
- 40 assigned home / 40 assigned away games per team before the Cup-dependent games are known.
- Opening night: Oct. 20, 2026 — BOS at DET, PHI at NYK, OKC at SAS.
- Final day: Apr. 11, 2027 — all 30 teams in action.
- 60 official NBA Cup Group Play games.
- Four Group Play games per team, two home and two away.
- Imported ET/local tip information when present in the official source.
- Imported national broadcast labels when present in the source.
- Special-site metadata for Austin, Mexico City, Paris and Manchester.

The raw extracted source text used by the importer is preserved in `raw/official_schedule_2026_27.txt`. The reproducible parser is `scripts/import_official_schedule_v17.py`.

## NBA Cup structure implemented
Each save gets its own Cup outcome because NBA Courtside's 2026–27 results branch away from real history as soon as the user starts playing.

### Group Play
The six official 2026 groups are imported exactly:

- East A — Detroit, Toronto, Orlando, Milwaukee, Brooklyn
- East B — New York, Cleveland, Philadelphia, Miami, Indiana
- East C — Boston, Atlanta, Charlotte, Chicago, Washington
- West A — Denver, Houston, Phoenix, Dallas, Utah
- West B — Oklahoma City, Minnesota, LA Clippers, New Orleans, Memphis
- West C — San Antonio, LA Lakers, Portland, Golden State, Sacramento

Each club plays its four official Group Play games. The standings are derived from the actual save's results.

Tie order implemented:
1. Group Play wins.
2. Head-to-head within a tied group.
3. Group Play point differential.
4. Group Play points scored.
5. Prior-season standing proxy / deterministic final fallback.

The NBA's rule excludes overtime scoring from Cup point-differential and total-points tiebreakers. v0.17 therefore stores regulation score for overtime games and gives each team a point differential of zero for an overtime Cup Group Play game.

**v0.18 update:** the prior-season-order proxy described in the original v0.17 release has been removed. The current build uses the exact final 2025–26 team record at this tiebreak layer, followed by a deterministic draw if all preceding criteria remain tied.

### Knockout qualification
Eight teams advance:
- six group winners;
- one second-place wild card from each conference.

The four teams in each conference are seeded from Group Play performance. Quarterfinals are No. 1 vs. wild card and No. 2 vs. No. 3. Quarterfinals and Semifinals are hosted by the higher seed.

### The 30 unassigned regular-season games
After Group Play, v0.17 materializes exactly **30 additional regular-season games**:

- 4 Quarterfinals;
- 2 Semifinals;
- 22 games for the 22 non-qualifiers, two each;
- 2 games pairing the four Quarterfinal losers.

For the 22 non-qualifier games, the engine follows the published formulaic structure:
- exactly two are cross-conference;
- no non-qualifier gets more than one cross-conference game;
- the remaining 20 are intraconference;
- the pairing optimizer prefers opponents that were otherwise scheduled to meet three times;
- bottom Group Play teams are used for the cross-conference pairings.

The precise league-office travel optimization is not published as a complete deterministic algorithm, so NBA Courtside uses a deterministic travel-neutral pairing rule after applying the published constraints.

Every club ends with **82 regular-season games**.

### Championship
The Cup Championship is played Dec. 11 at Hinkle Fieldhouse.

It is a real Game Day if the user's franchise reaches it, but it is stored separately from the 1,230 regular-season results:
- it does not change regular-season W-L;
- it does not add regular-season player statistics;
- injuries suffered in the game still persist in the franchise universe;
- the champion is recorded in `cupHistory`.

This matches the NBA rule that the Championship is the only one of the 67 Cup games that does not count toward the regular season.

## Player-facing presentation
v0.17 adds:
- **League → CUP** as a dedicated event surface.
- Live six-group standings with W-L, differential and points.
- Knockout bracket/results strip.
- NBA Cup labels on Game Day and schedule cards.
- Special Championship Game Day treatment.
- Official schedule source panel.
- National TV and special-venue labels where available.
- A clear pre-Group-Play notice that the Dec. 4–10 opponents are still TBD inside the save.

## Save migration
Primary key: `nbaCourtsideSaveV17`.

A fresh 2026–27 franchise uses the official schedule immediately.

An already-in-progress v0.16 2026–27 save that contains results but predates the schedule-mode field stays on the legacy schedule scaffold. This is intentional: old game IDs represented different opponents, so silently remapping completed results onto the official schedule would corrupt the save. New franchises get the official calendar.

Future simulated seasons continue to use the deterministic 82-game NBA Courtside template until an official schedule for that season exists.

## Official source basis
- NBA, “NBA announces schedule for 2026-27 season,” Aug. 13, 2026.
- NBA, “Emirates NBA Cup 101: Rules, format and how it works,” updated Aug. 12, 2026.
- NBA, “Emirates NBA Cup 2026 groups announced,” June 30 / July 1, 2026.
