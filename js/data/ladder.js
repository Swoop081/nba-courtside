import { unlockSuperstar } from "./profile.js?v=0.13.72";

export const LADDER_LIVES = 3;
export const LADDER_LENGTH = 8;
export const LADDER_SET_ID = "summerslam-series-1";
// Retained for old-save/source compatibility only. The player-facing Ladder is now one daily challenge tower.
export const LADDER_BRANCHES = Object.freeze({ daily: { id: "daily", label: "Daily Challenge", setId: LADDER_SET_ID, length: LADDER_LENGTH } });

function localDayKey(now = new Date()) {
  const d = now instanceof Date ? now : new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function ensure(profile, now = new Date()) {
  profile.ladder ??= { activeRun: null, clears: 0, bestRung: 0, completionPackCredits: 0, firstClearSuperstarPending: false };
  const ladder = profile.ladder;
  ladder.completionPackCreditsBySet ??= {};
  ladder.completionPackQueue ??= [];
  ladder.firstClearSuperstarPendingBySet ??= {};
  const today = localDayKey(now);
  if (!ladder.dailyKey) {
    ladder.dailyKey = today;
    ladder.dailyOpponents = [];
    ladder.dailyCleared = false;
    if (ladder.activeRun && !ladder.activeRun.dailyKey) ladder.activeRun = null;
  }
  ladder.dailyOpponents ??= [];
  ladder.dailyCleared ??= false;
  if (ladder.dailyKey !== today) {
    ladder.dailyKey = today;
    ladder.dailyOpponents = [];
    ladder.dailyCleared = false;
    ladder.activeRun = null;
  }
  return ladder;
}
function shuffle(values, rng = Math.random) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
export function ladderState(profile, now = new Date()) { return ensure(profile, now); }
export function startLadderRun(profile, superstarId, opponentIds, rng = Math.random, _branchId = "daily", now = new Date()) {
  const ladder = ensure(profile, now);
  if (ladder.dailyCleared) throw new Error("Today's Money in the Bank is already complete");
  if (!Array.isArray(ladder.dailyOpponents) || ladder.dailyOpponents.length !== LADDER_LENGTH) {
    const eligible = [...new Set(opponentIds)].filter(id => id && id !== superstarId);
    if (eligible.length < LADDER_LENGTH) throw new Error("Not enough eligible Superstars for today's Ladder");
    ladder.dailyOpponents = shuffle(eligible, rng).slice(0, LADDER_LENGTH);
  }
  ladder.activeRun = { superstarId, branchId: "daily", setId: LADDER_SET_ID, opponents: [...ladder.dailyOpponents], rung: 0, lives: LADDER_LIVES, status: "active", dailyKey: ladder.dailyKey, startedAt: new Date().toISOString() };
  return ladder.activeRun;
}
export function currentLadderOpponent(profile, now = new Date()) { const run = ensure(profile, now).activeRun; return !run || run.status !== "active" ? null : run.opponents[run.rung] ?? null; }
export function recordLadderMatch(profile, result, now = new Date()) {
  const ladder = ensure(profile, now), run = ladder.activeRun;
  if (!run || run.status !== "active") throw new Error("No active Money in the Bank");
  if (result === "loss") { run.lives -= 1; if (run.lives <= 0) { run.status = "failed"; return { status: "failed", run }; } return { status: "retry", run }; }
  if (result !== "win") throw new Error("Invalid ladder result");
  run.rung += 1;
  ladder.bestRung = Math.max(ladder.bestRung ?? 0, run.rung);
  if (run.rung >= run.opponents.length) {
    run.status = "cleared";
    ladder.dailyCleared = true;
    ladder.clears = (ladder.clears ?? 0) + 1;
    profile.superPackCreditsBySet ??= {};
    profile.superPackCreditsBySet[run.setId] = (profile.superPackCreditsBySet[run.setId] ?? 0) + 1;
    if (ladder.clears === 1) {
      ladder.firstClearSuperstarPending = true;
      ladder.firstClearSuperstarPendingBySet[run.setId] = true;
    }
    return { status: "cleared", run, completionPackAwarded: false, superPackAwarded: true };
  }
  return { status: "advance", run };
}
export function abandonLadderRun(profile, now = new Date()) { ensure(profile, now).activeRun = null; return ensure(profile, now); }
export function consumeFirstClearSuperstarGuarantee(profile, setId = LADDER_SET_ID) { const ladder = ensure(profile); ladder.firstClearSuperstarPendingBySet[setId] = false; if (setId === LADDER_SET_ID) ladder.firstClearSuperstarPending = false; }
export function grantGuaranteedSuperstar(profile, superstarId, setId = LADDER_SET_ID) { unlockSuperstar(profile, superstarId); consumeFirstClearSuperstarGuarantee(profile,setId); return superstarId; }
