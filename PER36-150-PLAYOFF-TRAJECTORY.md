# NBA Starting5 — 150-player playoff trajectory audit

Playoff data matched **74** of the 150 current-team population players.

## Locked trajectory rule

- Base remains the reliability-adjusted 2025–26 regular-season Per36 model.
- Playoff sample reaches full confidence at 150 minutes.
- Young player = age 23 or younger, or drafted in 2024/2025.
- Young players: up to 30% playoff weight; up to 35% when playoff MPG rose at least 15%.
- Established players: up to 12%; up to 15% with an expanded playoff role.
- The resulting Per36 values are reranked through the same gameplay curve with median 22.

## Expected four-quarter scoring

Mean **100.29**, median **101.0**, middle 50% **97–104**, 10th–90th **94–106**, ceiling **120**.

## Population rating profile

| Category | Mean | Median |
|---|---:|---:|
| Scoring | 21.73 | 22.00 |
| Rebounding | 21.73 | 22.00 |
| Passing | 21.75 | 22.00 |
| 3PT | 21.76 | 22.00 |
| Steals | 21.73 | 22.00 |
| Blocks | 21.74 | 22.00 |

## Biggest rating movers

| Player | Team | PO wt | MPG reg→PO | Rating changes |
|---|---|---:|---:|---|
| Cason Wallace | OKC | 0.282 | 26.57→24.95 | Scoring +1, Rebounding +2, 3PT +2, Steals +1 |
| Tim Hardaway Jr. | MIA | 0.098 | 26.59→23.31 | Rebounding +1, 3PT -1, Steals +2, Blocks +2 |
| Donovan Clingan | POR | 0.168 | 27.19→21.38 | Steals -5 |
| Jaylen Brown | PHI | 0.120 | 34.41→35.55 | Passing -1, 3PT +1, Steals -1, Blocks +2 |
| Paolo Banchero | ORL | 0.300 | 34.75→39.02 | Steals +4, Blocks +1 |
| Wendell Carter Jr. | ORL | 0.138 | 29.34→33.81 | Scoring -1, 3PT -1, Steals -1, Blocks +2 |
| Franz Wagner | ORL | 0.099 | 29.97→30.43 | Steals +4, Blocks -1 |
| Ausar Thompson | DET | 0.350 | 25.97→30.51 | Scoring -1, Rebounding +1, Steals -1, Blocks +1 |
| James Harden | CLE | 0.120 | 34.84→37.33 | Scoring -1, Passing -1, Steals +1, Blocks +1 |
| Toumani Camara | POR | 0.119 | 33.31→33.02 | Scoring -2, Passing -1, 3PT -1 |
| Deni Avdija | POR | 0.120 | 33.32→34.88 | Scoring -1, Passing -1, Steals -2 |
| Dillon Brooks | PHX | 0.147 | 30.39→37.31 | Scoring +1, Rebounding +1, 3PT +1, Steals -1 |
| OG Anunoby | NYK | 0.120 | 33.19→34.46 | Scoring +1, Passing -1, Steals +1, Blocks +1 |
| Duncan Robinson | DET | 0.120 | 27.44→29.48 | Rebounding -1, 3PT +1, Steals +2 |
| Aaron Nesmith | IND | 0.000 | — | Passing +1, 3PT +1, Steals +2 |
| Jalen Duren | DET | 0.300 | 28.23→30.17 | Scoring -2, Rebounding -1 |
| Victor Wembanyama | SAS | 0.350 | 29.15→34.11 | Rebounding -1, Passing -1, Steals -1 |
| Alperen Sengun | HOU | 0.348 | 33.3→38.66 | 3PT -1, Steals +2 |
| Amen Thompson | HOU | 0.350 | 37.38→44.08 | Rebounding -1, Steals +1, Blocks +1 |
| Devin Booker | PHX | 0.120 | 33.54→38.28 | Steals -3 |

## User-noted trajectory probes

### Collin Murray-Boyles
Playoff minutes 191; MPG 21.85→27.26; playoff weight 0.350.

| Category | Regular /36 | Playoff /36 | Trajectory /36 | Rating vs 150 |
|---|---:|---:|---:|---:|
| Scoring | 14.00 | 19.10 | 15.79 | 19 |
| Rebounding | 8.20 | 8.50 | 8.30 | 25 |
| Passing | 3.10 | 3.20 | 3.13 | 20 |
| 3PT | 0.50 | 0.00 | 0.33 | 17 |
| Steals | 1.50 | 1.70 | 1.57 | 27 |
| Blocks | 1.50 | 1.50 | 1.50 | 27 |

### Dylan Harper
Playoff minutes 615; MPG 22.58→26.75; playoff weight 0.350.

| Category | Regular /36 | Playoff /36 | Trajectory /36 | Rating vs 150 |
|---|---:|---:|---:|---:|
| Scoring | 18.80 | 19.00 | 18.87 | 21 |
| Rebounding | 5.40 | 7.50 | 6.13 | 22 |
| Passing | 6.10 | 3.60 | 5.22 | 24 |
| 3PT | 1.40 | 1.30 | 1.36 | 19 |
| Steals | 1.20 | 1.30 | 1.24 | 23 |
| Blocks | 0.60 | 0.30 | 0.49 | 22 |

## Top five after trajectory layer

### Scoring
1. Giannis Antetokounmpo (MIA) — 34.40/36 → 30
2. Luka Doncic (LAL) — 33.71/36 → 29
3. Shai Gilgeous-Alexander (OKC) — 32.98/36 → 29
4. Kawhi Leonard (TOR) — 31.31/36 → 29
5. Stephen Curry (GSW) — 30.94/36 → 29

### Rebounding
1. Mitchell Robinson (BOS) — 15.92/36 → 30
2. Donovan Clingan (POR) — 14.96/36 → 29
3. Zach Edey (MEM) — 14.34/36 → 29
4. Walker Kessler (LAL) — 14.33/36 → 29
5. Jusuf Nurkic (UTA) — 14.13/36 → 29

### Passing
1. Trae Young (WAS) — 11.47/36 → 30
2. Nikola Jokic (DEN) — 10.79/36 → 29
3. Josh Giddey (CHI) — 10.27/36 → 29
4. Cade Cunningham (DET) — 9.95/36 → 29
5. Tyrese Haliburton (IND) — 9.86/36 → 29

### 3PT
1. Stephen Curry (GSW) — 5.15/36 → 30
2. LaMelo Ball (MIN) — 4.85/36 → 29
3. Luka Doncic (LAL) — 4.00/36 → 29
4. Kon Knueppel (CHA) — 3.85/36 → 29
5. Duncan Robinson (DET) — 3.77/36 → 29

### Steals
1. Cason Wallace (OKC) — 2.77/36 → 30
2. Ausar Thompson (DET) — 2.64/36 → 29
3. Jalen Suggs (ORL) — 2.33/36 → 29
4. Dyson Daniels (ATL) — 2.20/36 → 29
5. Dejounte Murray (NOP) — 2.18/36 → 29

### Blocks
1. Victor Wembanyama (SAS) — 3.77/36 → 30
2. Walker Kessler (LAL) — 2.76/36 → 29
3. Alex Sarr (WAS) — 2.62/36 → 29
4. Dereck Lively II (DAL) — 2.60/36 → 29
5. Zach Edey (MEM) — 2.31/36 → 29

