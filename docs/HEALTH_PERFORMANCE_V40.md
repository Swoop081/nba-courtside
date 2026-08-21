# NBA Courtside v0.40 — Injuries, Fatigue + Medical Staff

v0.40 turns player availability into a persistent franchise system while preserving the v0.39 CBA/contract market, v0.38 staff careers, v0.37 league events, v0.36 player relationships and the calibrated NBA player/simulation foundation.

## Persistent health state

`state.healthPerformance.version = 40` is additive inside the existing `nbaCourtsideSaveV25` franchise save. No save reset or formal schema bump is required.

Each active/two-way player can now carry:

- fatigue (0–100),
- last game/minutes workload,
- seven-day workload context,
- return-to-play restriction,
- next-game load-management plan,
- career injury count,
- body-area injury history,
- recurrence-risk context.

The legacy injury ledger remains authoritative for whether a player is currently injured; v0.40 enriches those records rather than replacing them with an incompatible save branch.

## Availability + return to play

Player presentation now distinguishes Available, Probable, Questionable, Doubtful, Out and Out · Rest states. A player reaching the end of an injury is no longer automatically treated as unrestricted. The medical model creates a short return-to-play stage with a recommended minute cap and modeled recurrence risk.

The GM can set the next-game plan to Rest, 24 Minutes, 28 Minutes or Full Go. A Full Go decision can override a medical minute recommendation and is recorded in medical history as a gameplay decision. Rest and minute limits are enforced in both quick simulation and Game Day.

## Fatigue + workload

Persistent fatigue responds to:

- actual game minutes,
- back-to-backs,
- stamina,
- recovery between calendar days,
- Training Center activities,
- staff conditioning/recovery quality,
- explicit rest decisions.

Fatigue can increase injury exposure and creates a bounded team-performance penalty at heavier levels. CPU teams can automatically limit or rest highly fatigued players; the user's rotation is never silently rewritten as a permanent preference.

Game Day starts players below 100 energy when they carry meaningful persistent fatigue, and medical minute caps are enforced in the live possession engine as well as in quick simulation.

## Training Center consequences

The existing off-day actions now have physical trade-offs:

- **Team Practice:** moderate fatigue load.
- **Shooting Work:** low fatigue load.
- **Defensive Install:** moderate fatigue load.
- **Recovery Day:** materially reduces fatigue and retains the existing short-term injury-risk credit.
- **Film Session:** almost no physical load.
- **Young Player Focus:** additional workload concentrated on U24 players.

These effects are deliberately bounded so training decisions matter without becoming a hidden ratings exploit.

## Simulated medical + performance departments

All 30 teams receive three deterministic fictional NBA Courtside staff identities:

1. Head Athletic Trainer
2. Director of Performance
3. Rehab Specialist

That produces 90 fictional medical/performance staff in the starting world. Ratings cover prevention, recovery, rehabilitation, conditioning and return-to-play judgment.

These identities and ratings are **gameplay simulation**. They are not intended to identify, grade or quote real NBA medical personnel, and they are not medical advice.

Each organization can use Conservative, Balanced or Aggressive return-to-play policy. Policy affects recovery timing and modeled recurrence exposure within bounded limits.

## Injury model

Existing injury types are retained, while new injuries now record body area, body group, base recovery time, medically adjusted recovery estimate and modeled recurrence risk. Repeat injuries to a body area increase future recurrence context.

The season calibration intentionally remains conservative. In the frozen 2026–27 full-season probe, the 1,230 regular-season games generated 83 reportable injury events, four major events and a peak of 11 simultaneously active injuries. This is a gameplay calibration target, not a claim about future real-world NBA injury counts.

## Presentation

v0.40 adds:

- a dedicated **Health + Performance / Medical Center** destination,
- Roster Health, Medical Staff and History views,
- medical-policy controls,
- Daily Hub and Roster health portals,
- enhanced League injury reporting,
- Health + Performance information on player profiles,
- Game Day condition/return-to-play presentation,
- permanent medical/training history.

## Simulation boundaries

No real-world medical diagnosis, confidential health information, actual team medical-staff rating or future medical outcome is asserted. Injury outcomes, medical staff, recommendations, recurrence percentages and return-to-play decisions are NBA Courtside simulation systems.
