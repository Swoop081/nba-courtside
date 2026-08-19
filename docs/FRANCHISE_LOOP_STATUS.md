# Franchise Loop Status — v0.5

## Competition

The 2026-27 regular season can advance through all 1,230 games. At Game 82 the save generates awards and opens the postseason.

Play-In is simulated separately for East and West. Seeds 1-6 are directly in the playoffs. Seeds 7-10 contest the two final playoff places. The playoff bracket is fixed (no reseeding) and every playoff series is best-of-seven.

## Awards

The prototype accumulates per-player simulated GP, minutes, points, rebounds, assists, steals, blocks and turnovers during regular-season simulation. Awards combine that production with current ratings and team record. Award logic is intentionally transparent and tunable rather than hard-coded to real-world winners.

## Aging + retirement

Every offseason adds one year to age and applies an age/trajectory-aware rating delta. Young players generally improve, prime players stabilize, and older players decline. Retirement probability rises rapidly from the late 30s and becomes near-certain in the early 40s.

This is intentionally probabilistic so alternate-history careers can differ between saves.

## Contracts

At rollover, guaranteed future years remain. Player options can be declined when market value substantially exceeds the option; team options are kept when the player is useful or good value. Players without a next-season contract become free agents. User/CPU one-year prototype signings expire after the season.

## 2027 Draft Lottery

v0.5 implements the NBA-approved 3-2-1 Lottery beginning with the 2027 Draft:

- 16 teams participate.
- Teams missing both playoffs and Play-In receive three balls, except the three worst records are draft-relegated to two balls.
- No. 9 and No. 10 Play-In seeds receive two balls.
- Losers of the 7-vs-8 Play-In games receive one ball.
- All first 16 picks are drawn.
- Draft-relegated clubs are protected from falling below No. 12.
- A team cannot own the No. 1 slot in consecutive drafts or a top-five slot in three consecutive drafts (own-pick history model; pick trading is not yet implemented).

## Fictional future class

The 2027 class is generated because this project switches to fictional prospects once the timeline moves beyond the current real-world player/draft pipeline. Each prospect has:

- age 18-22;
- position eligibility;
- current rating;
- hidden true potential;
- visible scouting range;
- development curve;
- rookie contract generated from draft slot.

The user sees the scouting range, not the hidden exact potential.

## Next-season loop

After the draft, free agency opens. Once the user is at or below 15 players, the next season can begin. CPU teams trim to 15 and fill major roster shortages automatically. The same 82-game schedule structure is shifted forward one year for future prototype seasons.
