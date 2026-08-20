# v0.23 — Source-Backed Projection Inputs

## Goal

Close the 50-player no-current-NBA-baseline gap without weakening Courtside's source-safety rule. Projection evidence is useful for current ability and simulation, but it is not historical NBA evidence and must never populate `stats_2025_26`.

## Population

The starting universe remains 442 records:

- 392 season-complete 2025–26 NBA evidence players — unchanged from v0.19.
- 50 source-backed projection players.

The 50 projection inputs use four source classes:

- 36 NCAA 2025–26 samples.
- 3 NCAA bridge 2024–25 samples where a 2025–26 college sample is not the relevant available basis.
- 6 2025–26 international samples.
- 5 2024–25 NBA samples for established veterans who did not play in the 2025–26 NBA season.

The existing career-status population resolves to 37 true 2026 rookies, 7 other newcomers, 5 prior-NBA veterans and 1 veteran-external case.

## Data separation

Every projection player keeps:

- `stats_2025_26: null`
- `stat_source_status: "projection"`
- `data_confidence: 0.0` for current NBA evidence

v0.23 adds:

- `projection_confidence`
- `projection_2026_27`
- `ratings`
- `tendencies`
- `simulation_profile`
- `rating_source: "projection_translation_model_v0.23"`

This makes it impossible for UI or downstream logic to confuse a translated projection with an actual 2025–26 NBA stat row.

## Translation model

1. Preserve the v0.19 final NBA population as the reference distribution.
2. Convert source counting stats to per-36 where source MPG is safely available.
3. Apply source/competition translation factors.
4. Shrink translated rates toward NBA position priors according to source/sample confidence.
5. Shrink shooting percentages toward the v0.19 Bayesian league priors (3P .3596, 2P .5508, FT .7831).
6. If a source field is unavailable, use the relevant NBA position prior inside the projection transform rather than inventing a historical source value.
7. Generate ratings using the same season-relative percentile framework as v0.19, then uncertainty-shrink attributes toward position medians.
8. For true 2026 rookies, current rookie-scale/contract investment provides only a modest current-ability prior; it does not overwrite source evidence or development upside.
9. Store projected minutes separately from historical MPG and use them as a capped rotation prior.

## Confidence

Projection confidence ranges from 0.58 to 0.86. It represents source quality, sample relevance and translation uncertainty. It is deliberately distinct from `data_confidence`, which remains an NBA-evidence measure.

## Simulation integration

Game Day and quick sim can consume the synthetic NBA-like profile, but `statBase()` still blends projection evidence with position/role priors. Projected MPG also receives a lower rotation weight than certified NBA MPG.

Future real NBA evidence should progressively replace projection influence rather than coexisting indefinitely as an equally weighted source.

## Certification

`data/v019-evidence-core-hashes.json` freezes canonical SHA-256 hashes of the 392 v0.19 players' `stats_2025_26`, `ratings` and `simulation_profile` core. `scripts/certify_projection_inputs_v23.py` verifies those hashes, the 50-source manifest, null historical stat policy, runtime outputs and source-certification parity.
