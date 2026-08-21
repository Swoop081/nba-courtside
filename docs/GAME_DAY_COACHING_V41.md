# NBA Courtside v0.41 — Game Day Coaching

v0.41 adds a bounded coaching-control layer to the existing possession engine. It is designed to increase user agency without turning tactics into hidden rating multipliers that overpower roster quality.

## Coaching modes

- **Full Auto:** the head coach and simulation handle timeouts, substitutions, foul trouble and tactical adjustments.
- **Assisted:** the game pauses for major decisions such as foul trouble, stop-run timeouts and halftime adjustments.
- **Manual:** the user directly manages timeouts, substitutions, matchups and tactical emphasis. Mandatory medical/injury/foul-out constraints still override manual choices.

The selected mode, rotation plan and last tactical preferences persist in `save.gameDayCoaching.version = 41`.

## Pregame rotation plans

- **Normal:** use the current certified rotation and health constraints.
- **Shortened:** preserve the starters and concentrate minutes into an eight-player rotation where the roster allows.
- **Protect Vets:** reduce heavy planned loads for players age 31+ and redistribute available minutes.
- **Development:** create extra opportunity for U24 players while maintaining a legal 240-minute team plan.

Return-to-play caps, rest plans and unavailable players always take precedence.

## Live controls

### Timeouts

Each side begins with seven. Timeouts may be called manually or by CPU logic in response to scoring runs and game context. Their physical effect is deliberately small: a bounded energy reset rather than a momentum/rating cheat.

### Substitutions

Manual substitutions exchange an on-court player with an eligible bench player and can remain active until **Resume Auto Subs** is selected. Foul-outs, injuries and medical restrictions remain hard constraints.

### Matchups

A primary defender can be assigned to an opponent. The matchup modifier exists only while the assigned defender is actually on the court and is bounded by defender quality plus the simulated coach-management layer.

### Offensive emphasis

Balanced; Play Through Star; Attack Paint; More Threes; Push Tempo; Slow Pace; Feed Post; Pick + Roll.

### Defensive emphasis

Balanced; Drop; Switch; Blitz; Zone; Protect Paint; Stay Home on Shooters.

### Late-game strategy

Auto; Foul; Protect Lead; No Foul. Intentional-foul behavior is constrained to late-game score/time situations.

## Foul trouble

Personal fouls are visible in the live Game Day cards. Full Auto can protect players using period/foul thresholds, Assisted can surface a decision, and six fouls immediately disqualifies the player and forces removal from the active lineup.

## Halftime Coach's Room

Assisted and Manual modes stop at halftime. The screen shows first-half three-point shooting, turnovers and fouls, then surfaces a simulated assistant-coach recommendation. The user can take the recommendation, push pace, emphasize threes, protect the paint or keep the existing plan. Full Auto makes a bounded automatic adjustment.

## Staff integration

The current v0.38 Staff Careers head coach is used where available. Game Management and Rotations scale how strongly automated tactical decisions are applied; an existing assistant is used for the Coach's Room recommendation. These ratings and comments are explicitly NBA Courtside simulation.

## Health integration

The v0.40 Health + Performance system remains authoritative. Persistent fatigue affects starting energy, rest removes a player from the game, return-to-play caps remain hard final-minute limits, and injuries continue to write body-area/recurrence metadata to the shared franchise save.

## Result record

Completed games retain the normal authoritative box score plus `coaching_v41` metadata: final coaching mode, tactical settings, timeouts used, matchup assignments and coaching-event log.
