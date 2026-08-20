# NBA Courtside v0.29 — Ratings Foundation

**Frozen:** 21 August 2026  
**Supersedes:** v0.28 Postgame Resume + Season-Started Boot Hotfix

## Why this pass exists

The v0.28 source layer was substantially better than its displayed Overalls suggested. The core failure was the rating model: per-36 production was converted to league percentiles and then stretched onto a 50–99 scale. That made efficient bench players look like stars, compressed the league around the high 70s/80s, and left elite non-box-score perimeter defenders underrated.

v0.29 separates **source truth**, **simulation rates**, **season impact** and **display/current ability**.

## Locked rating philosophy

- **Overall = expected current 2026–27 NBA ability**, not a raw 2025–26 percentile.
- **Impact = 2025–26 season value**, and is availability-sensitive.
- Per-game production/efficiency and actual role/minutes lead the current-ability estimate.
- Established players below 1,200 minutes may use a bounded low-sample prior so injury-shortened seasons do not erase known ability.
- Recent official honors are validation anchors with hard caps/floors; they do not replace the statistical model.
- Projection-only players remain projection-only. No fake NBA stat lines are created.
- Granular Game Day rate profiles remain unchanged in this pass.

## Current-ability scale

| OVR | Intended level |
|---:|---|
| 94–99 | MVP / generational |
| 90–93 | All-NBA superstar |
| 86–89 | All-Star |
| 82–85 | high-end starter |
| 78–81 | solid starter |
| 74–77 | rotation player |
| 70–73 | bench player |
| 65–69 | fringe / developmental |
| <65 | deep reserve / raw prospect |

## Evidence model

For the 393 players with certified 2025–26 NBA rows, v0.29 uses a per-game Game Score-style production base:

`PTS + .4*FGM - .7*FGA - .4*(FTA-FTM) + .7*OREB + .3*DREB + STL + .7*AST + .7*BLK - .4*PF - TOV`

That base is mapped to the NBA Courtside current-ability scale. This intentionally makes a 14-MPG reserve's excellent per-36 line different from a 34-MPG star season.

For established players below 1,200 total minutes, confidence is `minutes / 1200`. The missing confidence portion blends toward a restrained current-contract/recent-All-NBA prior. Young/low-service players do not receive that veteran protection automatically.

## Defensive summary

Portable box scores cannot fully measure matchup difficulty, switch value, screen navigation, deterrence or assignment quality. v0.29 therefore uses:

- position-adjusted STL/36;
- position-adjusted BLK/36;
- position-adjusted DREB/36;
- bounded recent All-Defensive recognition.

Official anchors used:
- 2025–26 All-Defensive First/Second Team;
- 2024–25 All-Defensive First/Second Team;
- 2023–24 All-Defensive First/Second Team as a weaker legacy floor.

The granular perimeter/interior defensive rate attributes used by Game Day are **not** globally inflated from awards; this avoids turning a lockdown wing into an unrealistic steals generator.

## Official validation anchors

The model uses current/recent official NBA recognition as bounded sanity checks:

- 2025–26 All-NBA: https://www.nba.com/news/2025-26-all-nba-teams-announced
- 2025–26 All-Defensive: https://www.nba.com/news/2025-26-all-defensive-teams-announced
- 2026 All-Star roster: https://www.nba.com/allstar/2026/roster
- All-NBA history / 2024–25: https://www.nba.com/news/history-all-nba-teams
- All-Defensive history / 2024–25 and 2023–24: https://www.nba.com/news/history-all-defensive-team

## Distribution change

v0.28: 143 of 442 players were 80+.

v0.29:
- median OVR: 72;
- 75 players at 80+;
- 29 players at 86+;
- 8 players at 90+;
- maximum OVR: 96.

## Spot checks

| Player | v0.28 | v0.29 | v0.29 notes |
|---|---:|---:|---|
| Nikola Jokic | 93 | 96 | elite full-season creation/efficiency |
| Shai Gilgeous-Alexander | 92 | 96 | MVP/current elite floor |
| Luka Doncic | 91 | 94 | elite scoring/creation |
| Giannis Antetokounmpo | 85 | 91 | elite recent-prior protection + current production |
| Jayson Tatum | 80 | 89 | 16-game return sample protected by recent All-NBA prior |
| Trae Young | 80 | 82 | short 2025–26 sample blended with a restrained established-player prior |
| Ja Morant | 78 | 81 | short-sample production with restrained established-player protection |
| Jalen Duren | 87 | 86 | still All-NBA/All-Star tier, no longer top-10 by scale compression |
| Paul Reed | 84 | 71 | 13.9 MPG reserve production no longer star-equivalent |
| Herb Jones | 69 | 77 | defense recognition restored without fake box stats |
| Lu Dort | 67 | 80 | recent All-Defensive First Team recognition restored |
| Kel'el Ware | 85 | 76 | productive young rotation big, not star-level |
| Sandro Mamukelashvili | 85 | 74 | rotation production, not All-Star-level |

## What did not change

No roster, contract, Bird-right, future-pick, schedule, CBA, save-schema, injury, postseason, offseason or Game Day simulation-profile data was changed by this pass.
