# NBA Courtside v0.20 — Bird Rights Certification

## Purpose

v0.19 still labeled Bird rights as `engine_inferred` and seeded them from `teamTenure`. That was structurally unsafe: Bird continuity and loyalty tenure are not the same thing, and an ordinary trade does not by itself mean a player begins again as a newly signed free agent.

v0.20 creates a separate `state.birdClock` and makes it the only runtime continuity input used when an expiring contract or declined option generates free-agent rights.

## Starting-universe certification

The 442 current player/right rows split into two evidence classes:

- **392 exact post-2026–27 seeds.** These are source/transaction-continuity certified or deterministically established from rookie-contract continuity.
- **50 future-safe floors.** Their first executable option/expiry is 2029 or later. v0.20 stores a conservative floor of one completed qualifying season after 2026–27 rather than inventing an exact historical label. With uninterrupted continuity they are necessarily Bird by their first executable decision. A waiver/renunciation in the player's alternate-history universe resets that clock, so the certification does not override future gameplay events.

Thus **442/442 first actionable exits are certified** while the data continues to distinguish exact evidence from action-safe inference.

## Runtime rules implemented

- `birdClock = 1` → Non-Bird.
- `birdClock = 2` → Early Bird.
- `birdClock >= 3` → Bird.
- Ordinary trades do not alter `birdClock`.
- An external free-agent signing restarts continuity.
- A draft signing starts with zero completed seasons and gains its first year when the season begins.
- Waiving a player into free agency or renouncing his rights resets the modeled continuity clock.
- Re-signing a player's own rights preserves the existing clock.
- Contract expiry, player-option decline and team-option decline all use the same continuity calculation; Early Bird is no longer skipped by option-decline branches.

## Contract-route rules corrected

- Bird: 1–5 years, 8% raises.
- Early Bird: 2–4 years, 8% raises, with at least two non-option seasons.
- Non-Bird: 1–4 years, 5% raises.
- A one-year qualifying offer remains a separate legal RFA route rather than being rejected by the Early Bird minimum-term rule.

## Scope boundary

This is not a claim that every possible future CBA edge is modeled. v0.20 intentionally leaves specialist cases—such as waiver assignments/claims and special player-consent trade consequences—for the dedicated transaction-edge pass. The starting universe and every normal executable Bird-rights decision are now safe from the old team-tenure inference.
