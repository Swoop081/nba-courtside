# NBA Courtside — 1.0 Readiness After v0.18

v0.18 moves the current-day database from broad “source pending” labels toward field-level provenance. It closes several previously documented gaps while refusing to fabricate exact ownership/rights where the source path is still unresolved.

## Closed / materially improved

### Current schedule and NBA Cup
- Official 2026–27 assigned schedule imported in v0.17: 1,200 games / 80 per team.
- Save-dependent 30-game Cup completion algorithm retained.
- Cup Quarterfinals/Semifinals count as regular season; Championship remains separate.
- Game Day supports the Cup Championship without polluting regular-season statistics.

### Prior-season record certification
- **30/30 exact 2025–26 final team records** now loaded.
- Every club is 82 games.
- League records reconcile to **1,230 wins / 1,230 losses**.
- NBA Cup's deep prior-season-record tiebreak no longer uses the v0.17 pot-tier proxy.

### Contract structure
- **442/442** frozen player/right rows audited for current snapshot identity, age, position, expiry, salary-year amounts and option markers.
- Three `PENDING` RFA cases preserved as rights/cap-hold cases.
- Machine-readable certification manifest added.

### Future-pick asset safety
- **420/420 origin cells** now exist for 2027–2033, both rounds.
- Direct/protected rights that are safe to execute are represented in the asset system.
- **223 complex/frozen/source-locked cells are nontradeable**, preventing unresolved rights from being used as fake trade currency.
- Save migration repairs untouched starting ownership without overwriting user-created alternate-history trades.

### Player-stat provenance
- Every player record now has an explicit source state.
- **34** current-player rows have season-complete verified overlays.
- **358** remain calibrated bootstrap-hybrid.
- **50** remain projection/no-current-baseline.
- Ratings remain on the v0.16 calibrated full-population model pending a complete final-stat replacement pass.

## Still source-pending before calling the current-day data layer fully certified

1. **Complete final 2025–26 player-stat import** — replace the remaining 358 bootstrap-hybrid rows from one season-final source, regenerate ratings for the entire evidence population, and rerun simulation calibration.
2. **Exact initial Bird-right history** — current contract structure is audited, but initial Bird/Early-Bird/Non-Bird tenure is still engine-inferred.
3. **Fully executable nested future-pick trees** — the safety ledger is complete at the origin-cell level, but complex swaps and many conditional seconds are intentionally locked rather than fully settled in advance.
4. **Specialist CBA certification** — bonuses/incentives, partial guarantees, set-off/stretch, two-way/Exhibit 10 contracts, detailed TPE history and other rare transaction edges.
5. **Future official schedules** — impossible to import before release; generated future seasons continue with the deterministic 82-game template.
6. **Historical universe** — historical season starts, historical rosters/contracts and chronological real draft classes remain a separate major database expansion.

## Product status

The complete franchise lifecycle is playable:

`FRANCHISE → OFFICIAL REGULAR SEASON → NBA CUP → GAME DAY → LEAGUE PULSE → TRADE DEADLINE → PLAY-IN → PLAYOFFS → FINALS → LOTTERY → SCOUTING → DRAFT → FREE AGENCY → CAMP → NEXT SEASON`

The product is now beyond “missing core loop” work. The main 1.0 tasks are **complete source replacement where bootstrap data remains, exact rights/transaction certification, historical expansion, and final presentation/QA polish**.

The v0.18 rule is simple: when a precise real-world fact is not safely certified, show its status or lock the action rather than silently inventing certainty.
