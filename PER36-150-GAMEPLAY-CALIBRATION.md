# NBA Starting5 — 150-player gameplay-weighted Per36 calibration

Population: 30 current team fives = 150 intended players.

Reliability: 2025–26 reaches full confidence at 1000 minutes. Below that, current Per36 is blended with 2024–25 when available; players with no NBA sample use a provisional position-index baseline for this calibration pass.

Gameplay curve: adjusted Per36 determines percentile/rank; percentile is mapped to a 5–30 gameplay score with population median targeted at 22.

Curve knots: 0%=5, 1%=10, 5%=15, 15%=18, 30%=20, 50%=22, 70%=24, 85%=26, 95%=28, 99%=29, 100%=30.

## Population rating profile

| Category | Mean | Median |
|---|---:|---:|
| Scoring | 21.73 | 22.00 |
| Rebounding | 21.73 | 22.00 |
| Passing | 21.73 | 22.00 |
| 3PT | 21.76 | 22.00 |
| Steals | 21.73 | 22.00 |
| Blocks | 21.73 | 22.00 |

## Expected four-quarter scoring

Greedy best-unused-player simulation over the six Per36 categories: **mean 100.2**, median 100.0, middle 50% 97–104, 10th–90th percentile 93–107. Maximum remains **120**.

Dunking is excluded from this simulation because it remains a separately calibrated seventh category.

## Top five by category

### Scoring
1. Giannis Antetokounmpo (MIA) — adjusted 34.40/36 → 30
2. Shai Gilgeous-Alexander (OKC) — adjusted 33.74/36 → 29
3. Luka Doncic (LAL) — adjusted 33.71/36 → 29
4. Kawhi Leonard (TOR) — adjusted 31.31/36 → 29
5. Stephen Curry (GSW) — adjusted 30.94/36 → 29

### Rebounding
1. Mitchell Robinson (BOS) — adjusted 16.09/36 → 30
2. Donovan Clingan (POR) — adjusted 15.34/36 → 29
3. Zach Edey (MEM) — adjusted 14.34/36 → 29
4. Walker Kessler (LAL) — adjusted 14.33/36 → 29
5. Victor Wembanyama (SAS) — adjusted 14.20/36 → 29

### Passing
1. Trae Young (WAS) — adjusted 11.47/36 → 30
2. Nikola Jokic (DEN) — adjusted 11.08/36 → 29
3. Cade Cunningham (DET) — adjusted 10.51/36 → 29
4. Josh Giddey (CHI) — adjusted 10.27/36 → 29
5. Tyrese Haliburton (IND) — adjusted 9.86/36 → 29

### 3PT
1. Stephen Curry (GSW) — adjusted 5.15/36 → 30
2. LaMelo Ball (MIN) — adjusted 4.85/36 → 29
3. Luka Doncic (LAL) — adjusted 4.00/36 → 29
4. Kon Knueppel (CHA) — adjusted 3.85/36 → 29
5. Tim Hardaway Jr. (MIA) — adjusted 3.79/36 → 29

### Steals
1. Ausar Thompson (DET) — adjusted 2.77/36 → 30
2. Cason Wallace (OKC) — adjusted 2.64/36 → 29
3. Jalen Suggs (ORL) — adjusted 2.40/36 → 29
4. Dejounte Murray (NOP) — adjusted 2.18/36 → 29
5. Dyson Daniels (ATL) — adjusted 2.13/36 → 29

### Blocks
1. Victor Wembanyama (SAS) — adjusted 3.80/36 → 30
2. Walker Kessler (LAL) — adjusted 2.76/36 → 29
3. Alex Sarr (WAS) — adjusted 2.62/36 → 29
4. Dereck Lively II (DAL) — adjusted 2.60/36 → 29
5. Chet Holmgren (OKC) — adjusted 2.36/36 → 29

## Rating distribution

| Rating | SCO | REB | PAS | 3PT | STL | BLK |
|---:|---:|---:|---:|---:|---:|---:|
| 5 | 1 | 1 | 1 | 0 | 1 | 1 |
| 6 | 0 | 0 | 0 | 0 | 0 | 0 |
| 7 | 0 | 0 | 0 | 0 | 0 | 0 |
| 8 | 1 | 1 | 1 | 0 | 1 | 1 |
| 9 | 0 | 0 | 0 | 0 | 0 | 0 |
| 10 | 1 | 1 | 1 | 0 | 1 | 1 |
| 11 | 1 | 1 | 1 | 7 | 1 | 0 |
| 12 | 1 | 1 | 1 | 0 | 1 | 2 |
| 13 | 1 | 1 | 1 | 0 | 1 | 1 |
| 14 | 1 | 1 | 1 | 0 | 1 | 1 |
| 15 | 3 | 3 | 3 | 3 | 3 | 3 |
| 16 | 5 | 5 | 5 | 5 | 5 | 5 |
| 17 | 5 | 5 | 5 | 5 | 5 | 5 |
| 18 | 8 | 8 | 8 | 8 | 8 | 8 |
| 19 | 12 | 12 | 12 | 12 | 12 | 12 |
| 20 | 13 | 13 | 13 | 13 | 13 | 13 |
| 21 | 15 | 15 | 15 | 15 | 15 | 15 |
| 22 | 14 | 14 | 14 | 14 | 14 | 14 |
| 23 | 15 | 15 | 15 | 15 | 15 | 16 |
| 24 | 13 | 13 | 13 | 13 | 13 | 12 |
| 25 | 12 | 12 | 12 | 12 | 12 | 12 |
| 26 | 9 | 9 | 9 | 9 | 9 | 9 |
| 27 | 7 | 7 | 7 | 7 | 7 | 7 |
| 28 | 7 | 7 | 7 | 7 | 7 | 7 |
| 29 | 4 | 4 | 4 | 4 | 4 | 4 |
| 30 | 1 | 1 | 1 | 1 | 1 | 1 |

## Ty Jerome sample check

2025–26 minutes: 338.7; confidence weight: 0.339; source: blend with 2024-25 prior.
Scoring raw 31.36/36 → adjusted 25.57/36 → gameplay rating 26.
