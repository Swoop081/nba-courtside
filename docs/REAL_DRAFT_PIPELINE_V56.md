# v0.56 — Continuous Real Draft Pipeline 2019–2026

## Product rule

**History diverges from the selected historical start. Real people still enter the league in their real entry year, but future real-world destinations and careers are not scripted.**

For the 2018–19 Opening Night universe, the full real-entry pipeline is now available for every draft from 2019 through 2026.

## Class coverage

| Draft | Alternate pool | Official drafted | Real undrafted fill |
|---|---:|---:|---:|
| 2019 | 60 | 60 | 0 |
| 2020 | 60 | 60 | 0 |
| 2021 | 60 | 60 | 0 |
| 2022 | 60 | 58 | 2 |
| 2023 | 60 | 58 | 2 |
| 2024 | 60 | 58 | 2 |
| 2025 | 60 | 59 | 1 |
| 2026 | 60 | 60 | 0 |

The official NBA Draft boards/results are the identity/order backbone. 2027 remains the existing source-backed prospect-watch class; generated classes resume in 2028 until later source-backed packs extend coverage.

## Divergence-safe forfeiture handling

The real-world 2022–25 draft pools contain fewer than 60 official selections because certain second-round picks were forfeited. Those future sanctions did not exist at the October 2018 divergence point.

NBA Courtside therefore does not force them into alternate history. It keeps 60 draft slots and adds real undrafted entrants from the same entry year. Those entries keep a null official pick/team, preventing the UI or history layer from falsely presenting them as real drafted players.

## Authentic uncertainty

Historical identity/order is evidence, not a hindsight rating system. v0.56 intentionally does not import a player's eventual NBA peak back into their draft profile. Draft slot shapes a broad readiness prior, positions shape skill translation, and the existing v0.49 scouting/development systems determine uncertainty and career outcomes.

## Persistence

Each generated real entrant stores:

- `realDraftYear`
- `alternateTimelineSlot`
- `officialHistoricalPick`
- `officialHistoricalTeam`
- `entryType`
- source/career mode metadata

This allows League History to distinguish what happened in the real draft from what happened in the user's alternate universe.
