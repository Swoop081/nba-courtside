export const KING_OF_THE_RING_FIELD_SIZE = 8;
export const KING_OF_THE_RING_ROUNDS = Object.freeze(["Quarterfinal", "Semifinal", "Final"]);
export const KING_OF_THE_RING_REWARD_CHOICES = 3;

function ensure(profile) {
  profile.kingOfTheRing ??= { activeRun: null, clears: 0, bestRound: 0, reigningKingId: null, reigningKingAt: null };
  profile.kingOfTheRing.clears = Math.max(0, Number(profile.kingOfTheRing.clears) || 0);
  profile.kingOfTheRing.bestRound = Math.max(0, Number(profile.kingOfTheRing.bestRound) || 0);
  profile.kingOfTheRing.reigningKingId ??= null;
  profile.kingOfTheRing.reigningKingAt ??= null;
  const run = profile.kingOfTheRing.activeRun;
  // v0.13.23 compatibility: a cleared v0.13.22 run already paid its old automatic
  // booster reward. Mark that historical reward resolved so upgrading cannot
  // create a second reward choice for the same tournament.
  if (run?.status === "cleared" && !("rewardChoices" in run) && run.rewardClaimedSetId == null) {
    run.rewardChoices = [];
    run.rewardClaimedSetId = "legacy-auto-reward";
    run.coronationSeen = true;
  }
  return profile.kingOfTheRing;
}
function shuffle(values, rng = Math.random) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function choose(values, rng = Math.random) { return values[Math.floor(rng() * values.length)] ?? values[0] ?? null; }

export function kingOfTheRingState(profile) { return ensure(profile); }

export function startKingOfTheRing(profile, superstarId, opponentIds, rng = Math.random) {
  const state = ensure(profile);
  const pool = [...new Set(opponentIds)].filter(id => id && id !== superstarId);
  if (pool.length < KING_OF_THE_RING_FIELD_SIZE - 1) throw new Error("Not enough eligible Superstars for King of the Ring");
  const field = [superstarId, ...shuffle(pool, rng).slice(0, KING_OF_THE_RING_FIELD_SIZE - 1)];
  const qf2Winner = choose([field[2], field[3]], rng);
  const qf3Winner = choose([field[4], field[5]], rng);
  const qf4Winner = choose([field[6], field[7]], rng);
  const otherSemiWinner = choose([qf3Winner, qf4Winner], rng);
  state.activeRun = {
    superstarId,
    field,
    opponents: [field[1], qf2Winner, otherSemiWinner],
    cpuQuarterWinners: [qf2Winner, qf3Winner, qf4Winner],
    cpuFinalist: otherSemiWinner,
    stage: 0,
    status: "active",
    startedAt: new Date().toISOString(),
    coronationSeen: false,
    rewardChoices: null,
    rewardClaimedSetId: null,
  };
  return state.activeRun;
}

export function currentKingOfTheRingOpponent(profile) {
  const run = ensure(profile).activeRun;
  return !run || run.status !== "active" ? null : run.opponents[run.stage] ?? null;
}

export function recordKingOfTheRingMatch(profile, result) {
  const state = ensure(profile), run = state.activeRun;
  if (!run || run.status !== "active") throw new Error("No active King of the Ring tournament");
  if (result === "loss") { run.status = "eliminated"; return { status: "eliminated", run }; }
  if (result !== "win") throw new Error("Invalid King of the Ring result");
  run.stage += 1;
  state.bestRound = Math.max(state.bestRound, run.stage);
  if (run.stage >= KING_OF_THE_RING_ROUNDS.length) {
    run.status = "cleared";
    state.clears += 1;
    state.reigningKingId = run.superstarId;
    state.reigningKingAt = new Date().toISOString();
    return { status: "cleared", run };
  }
  return { status: "advance", run };
}

export function prepareKingOfTheRingReward(profile, releasedSetIds, rng = Math.random) {
  const run = ensure(profile).activeRun;
  if (!run || run.status !== "cleared") throw new Error("King of the Ring has not been won");
  if (Array.isArray(run.rewardChoices)) return run.rewardChoices;
  const pool = [...new Set(releasedSetIds)].filter(Boolean);
  if (!pool.length) throw new Error("No released booster sets are available");
  run.rewardChoices = pool.length <= KING_OF_THE_RING_REWARD_CHOICES
    ? [...pool]
    : shuffle(pool, rng).slice(0, KING_OF_THE_RING_REWARD_CHOICES);
  run.rewardClaimedSetId = null;
  run.coronationSeen = false;
  return run.rewardChoices;
}

export function markKingOfTheRingCoronationSeen(profile) {
  const run = ensure(profile).activeRun;
  if (!run || run.status !== "cleared") throw new Error("No King of the Ring coronation is available");
  run.coronationSeen = true;
  return run;
}

export function claimKingOfTheRingReward(profile, setId) {
  const run = ensure(profile).activeRun;
  if (!run || run.status !== "cleared") throw new Error("King of the Ring has not been won");
  if (run.rewardClaimedSetId) throw new Error("King of the Ring reward already claimed");
  if (!Array.isArray(run.rewardChoices) || !run.rewardChoices.includes(setId)) throw new Error("Choose one of the offered King of the Ring boosters");
  run.rewardClaimedSetId = setId;
  profile.superPackCreditsBySet ??= {};
  profile.superPackCreditsBySet[setId] = (profile.superPackCreditsBySet[setId] ?? 0) + 1;
  return setId;
}

export function resetKingOfTheRing(profile) { ensure(profile).activeRun = null; return ensure(profile); }
