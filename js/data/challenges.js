import { awardSeasonXp, DAILY_CHALLENGE_XP, WEEKLY_CHALLENGE_XP } from "./seasons.js?v=0.13.72";
const DAY_MS = 86400000;
const DAILY_POOL = [
  { key: 'win-match', label: 'Win a match', metric: 'wins', target: 1, reward: 1, xpReward: DAILY_CHALLENGE_XP },
  { key: 'connect-finisher', label: 'Connect with a Finisher', metric: 'finishers', target: 1, reward: 1, xpReward: DAILY_CHALLENGE_XP },
  { key: 'counter-moves', label: 'Counter 2 Moves', metric: 'counters', target: 2, reward: 1, xpReward: DAILY_CHALLENGE_XP },
  { key: 'open-pack', label: 'Open a booster pack', metric: 'packs', target: 1, reward: 1, xpReward: DAILY_CHALLENGE_XP },
  { key: 'ladder-rung', label: 'Clear a Money in the Bank level', metric: 'ladderRungs', target: 1, reward: 1, xpReward: DAILY_CHALLENGE_XP },
  { key: 'championship-win', label: 'Win a Championship Road match', metric: 'championshipWins', target: 1, reward: 1, xpReward: DAILY_CHALLENGE_XP },
  { key: 'play-matches', label: 'Complete 2 matches', metric: 'matches', target: 2, reward: 1, xpReward: DAILY_CHALLENGE_XP }
];
const WEEKLY_POOL = [
  { key: 'weekly-wins', label: 'Win 5 matches', metric: 'wins', target: 5, reward: 2, xpReward: WEEKLY_CHALLENGE_XP },
  { key: 'weekly-ladder', label: 'Clear 4 Money in the Bank levels', metric: 'ladderRungs', target: 4, reward: 2, xpReward: WEEKLY_CHALLENGE_XP },
  { key: 'weekly-championship', label: 'Win 3 Championship Road matches', metric: 'championshipWins', target: 3, reward: 2, xpReward: WEEKLY_CHALLENGE_XP },
  { key: 'weekly-packs', label: 'Open 5 booster packs', metric: 'packs', target: 5, reward: 2, xpReward: WEEKLY_CHALLENGE_XP },
  { key: 'weekly-finishers', label: 'Connect with 5 Finishers', metric: 'finishers', target: 5, reward: 2, xpReward: WEEKLY_CHALLENGE_XP },
  { key: 'weekly-counters', label: 'Counter 10 Moves', metric: 'counters', target: 10, reward: 2, xpReward: WEEKLY_CHALLENGE_XP },
  { key: 'weekly-matches', label: 'Complete 10 matches', metric: 'matches', target: 10, reward: 2, xpReward: WEEKLY_CHALLENGE_XP }
];

const localDayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const weekStart = (date = new Date()) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return localDayKey(d);
};
function hash(value) { let h = 2166136261; for (const ch of value) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function pick(pool, count, seed) {
  const source = [...pool], out = []; let x = hash(seed);
  while (source.length && out.length < count) { x = (1664525 * x + 1013904223) >>> 0; out.push(source.splice(x % source.length, 1)[0]); }
  return out;
}
function makeChallenges(pool, count, periodKey, prefix) {
  return pick(pool, count, periodKey).map((c, index) => ({ ...c, id: `${prefix}-${periodKey}-${c.key}-${index}`, progress: 0, claimed: false }));
}
function ensure(profile, now = new Date()) {
  profile.challenges ??= {};
  const day = localDayKey(now), week = weekStart(now);
  if (profile.challenges.dailyKey !== day) {
    profile.challenges.dailyKey = day;
    profile.challenges.daily = makeChallenges(DAILY_POOL, 3, day, 'daily');
  }
  if (profile.challenges.weeklyKey !== week) {
    profile.challenges.weeklyKey = week;
    profile.challenges.weekly = makeChallenges(WEEKLY_POOL, 3, week, 'weekly');
  }
  return profile.challenges;
}
export function challengeState(profile, now = new Date()) { return ensure(profile, now); }
export function recordChallengeMetric(profile, metric, amount = 1, now = new Date()) {
  const state = ensure(profile, now);
  for (const group of [state.daily, state.weekly]) for (const challenge of group) {
    if (challenge.metric === metric && !challenge.claimed) challenge.progress = Math.min(challenge.target, (challenge.progress ?? 0) + amount);
  }
  return state;
}
export function recordCompletedMatchChallenges(profile, state, humanId = 'p1', mode = 'exhibition', now = new Date()) {
  recordChallengeMetric(profile, 'matches', 1, now);
  if (state.winner === humanId) recordChallengeMetric(profile, 'wins', 1, now);
  if (mode === 'ladder' && state.winner === humanId) recordChallengeMetric(profile, 'ladderRungs', 1, now);
  if (mode === 'championship' && state.winner === humanId) recordChallengeMetric(profile, 'championshipWins', 1, now);
  const humanFinishers = state.log.filter(e => e.type === 'MOVE_CONNECTED' && e.attackerId === humanId && e.finisher).length;
  const humanCounters = state.log.filter(e => (e.type === 'MOVE_COUNTERED' || e.type === 'AUTO_COUNTER') && e.defenderId === humanId).length;
  if (humanFinishers) recordChallengeMetric(profile, 'finishers', humanFinishers, now);
  if (humanCounters) recordChallengeMetric(profile, 'counters', humanCounters, now);
}
export function claimChallenge(profile, id, now = new Date()) {
  const state = ensure(profile, now);
  const challenge = [...state.daily, ...state.weekly].find(c => c.id === id);
  if (!challenge) throw new Error('Challenge not found');
  if (challenge.claimed) throw new Error('Challenge already claimed');
  if ((challenge.progress ?? 0) < challenge.target) throw new Error('Challenge is not complete');
  challenge.claimed = true;
  profile.boosterCredits = (profile.boosterCredits ?? 0) + challenge.reward;
  profile.boosterCreditsBySet ??= {};
  profile.boosterCreditsBySet["summerslam-series-1"] = profile.boosterCredits;
  awardSeasonXp(profile, challenge.xpReward ?? (id.startsWith('weekly-') ? WEEKLY_CHALLENGE_XP : DAILY_CHALLENGE_XP), 'challenge');
  return challenge.reward;
}
export function nextDailyReset(now = new Date()) { const n = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); return n; }
export function nextWeeklyReset(now = new Date()) { const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day+7); return d; }
