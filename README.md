# NBA Courtside — Franchise Loop v0.5

Current prototype baseline built on the 19 Aug 2026 current-day data foundation.

## What v0.5 adds

- Full regular-season → Play-In → playoffs → champion flow.
- Current NBA Play-In structure: 7 hosts 8; 9 hosts 10; loser of 7/8 hosts winner of 9/10 for the eighth seed.
- Best-of-seven first round, conference semifinals, conference finals and NBA Finals.
- Season awards generated from simulated player production, ratings and team success: MVP, DPOY, Rookie of the Year, Sixth Man and Most Improved.
- Persistent league history with champions and major awards.
- Player aging, development, decline and retirement at the offseason boundary.
- Contract rollover with prototype player-option/team-option decisions and expiring deals entering free agency.
- The new 2027 NBA “3-2-1 Lottery” structure: 16 lottery teams, weighted 3/2/1 balls, draft relegation for the three worst records, pick floors, and multi-year No. 1/top-five restrictions.
- A generated 60-player fictional 2027 draft class, because the project’s design switches to fictional prospects after the present-day real-player pipeline.
- Two-round draft with 60 selections. CPU teams draft automatically; the user chooses at their own picks or can auto-pick best available.
- Scouting ranges expose estimated potential while keeping the prospect’s exact internal ceiling hidden.
- Rookie-scale prototype contracts are assigned after the draft.
- Free agency/cuts/trades reopen after the draft.
- A new 2027-28 season can be started and simulated with evolved players and drafted rookies.
- Future salary thresholds use an 8% prototype escalator until exact future cap figures exist.

## Important prototype limits

- The bundled 2026-27 schedule remains the deterministic NBA-style 1,230-game calendar from v0.4 rather than an exact official schedule import.
- Exact CBA trade exceptions, apron aggregation restrictions, Bird rights, guarantee accounting and multi-year free-agent negotiation are not yet complete.
- Player game statistics are simulation-derived approximations from the v0.2 rating/rate foundation, not a full possession engine.
- The first future draft class (2027) is intentionally fictional. Historical-start modes will eventually feed real historical draft classes until the selected timeline reaches the present.
- Draft-pick trades are not yet implemented, so every franchise currently owns its own first- and second-round selections.

## Validation

Core smoke test successfully runs:

1. all 1,230 regular-season games;
2. awards;
3. both Play-In tournaments;
4. all four playoff rounds;
5. championship;
6. aging/development/retirement;
7. the 16-team 3-2-1 lottery;
8. all 60 draft selections;
9. free agency/roster cuts;
10. a complete second 1,230-game season.

See `docs/FRANCHISE_LOOP_STATUS.md` for implementation detail.
