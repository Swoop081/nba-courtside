export const CAREER_RECORD_VERSION = 1;
export const CAREER_TRACKING_BUILD = "0.12.78";

export const CAREER_MODES = Object.freeze([
  { id: "exhibition", label: "Exhibition" },
  { id: "live-event", label: "Live Event" },
  { id: "ladder", label: "Money in the Bank" },
  { id: "king-of-the-ring", label: "King of the Ring" },
  { id: "championship", label: "Championship Road" },
]);

const blankRecord = () => ({ wins: 0, losses: 0 });
const cleanCount = value => Math.max(0, Math.floor(Number(value) || 0));
const normalizeRecord = value => ({ wins: cleanCount(value?.wins), losses: cleanCount(value?.losses) });

export function ensureCareerState(profile, now = new Date()) {
  if (!profile) return null;
  profile.career ??= {};
  const c = profile.career;
  c.version = CAREER_RECORD_VERSION;
  c.trackingSinceBuild ??= CAREER_TRACKING_BUILD;
  c.trackingStartedAt ??= now.toISOString();
  c.total = normalizeRecord(c.total);
  c.bySuperstar ??= {};
  for (const [id, record] of Object.entries(c.bySuperstar)) c.bySuperstar[id] = normalizeRecord(record);
  c.byMode ??= {};
  for (const mode of CAREER_MODES) c.byMode[mode.id] = normalizeRecord(c.byMode[mode.id]);
  for (const [id, record] of Object.entries(c.byMode)) c.byMode[id] = normalizeRecord(record);
  c.byFinish ??= {};
  for (const [id, record] of Object.entries(c.byFinish)) c.byFinish[id] = normalizeRecord(record);
  c.achievements ??= {};
  return c;
}

export const CAREER_ACHIEVEMENTS = Object.freeze([
  { id: "first-bell", name: "First Bell", description: "Complete your first tracked match.", test: ({ total }) => total.wins + total.losses >= 1 },
  { id: "winners-circle", name: "Winner's Circle", description: "Win your first tracked match.", test: ({ total }) => total.wins >= 1 },
  { id: "ten-victories", name: "Ten Victories", description: "Win 10 tracked matches.", test: ({ total }) => total.wins >= 10 },
  { id: "main-eventer", name: "Main Eventer", description: "Win 25 tracked matches.", test: ({ total }) => total.wins >= 25 },
  { id: "living-legend", name: "Living Legend", description: "Win 50 tracked matches.", test: ({ total }) => total.wins >= 50 },
  { id: "century-club", name: "Century Club", description: "Win 100 tracked matches.", test: ({ total }) => total.wins >= 100 },
  { id: "all-terrain", name: "All-Terrain Superstar", description: "Record a win in every game mode.", test: ({ byMode }) => CAREER_MODES.every(mode => (byMode[mode.id]?.wins ?? 0) >= 1) },
  { id: "locker-room-leader", name: "Locker Room Leader", description: "Record a win with 5 different Superstars.", test: ({ bySuperstar }) => Object.values(bySuperstar).filter(r => (r?.wins ?? 0) > 0).length >= 5 },
  { id: "roster-general", name: "Roster General", description: "Record a win with 10 different Superstars.", test: ({ bySuperstar }) => Object.values(bySuperstar).filter(r => (r?.wins ?? 0) > 0).length >= 10 },
  { id: "pinfall-specialist", name: "Pinfall Specialist", description: "Win 10 matches by pinfall.", test: ({ byFinish }) => (byFinish.pin?.wins ?? 0) >= 10 },
  { id: "submission-specialist", name: "Submission Specialist", description: "Win 5 matches by submission.", test: ({ byFinish }) => (byFinish.submission?.wins ?? 0) >= 5 },
  { id: "ladder-conqueror", name: "Money in the Bank Winner", description: "Clear the Daily Money in the Bank.", test: ({ profile }) => (profile?.ladder?.clears ?? 0) >= 1 },
  { id: "king-of-the-ring", name: "King of the Ring", description: "Win an 8-Superstar King of the Ring tournament.", test: ({ profile }) => (profile?.kingOfTheRing?.clears ?? 0) >= 1 },
  { id: "championship-gold", name: "Championship Gold", description: "Clear Championship Road.", test: ({ profile }) => (profile?.championshipRoad?.clears ?? 0) >= 1 },
  { id: "live-event-headliner", name: "Live Event Headliner", description: "Clear a Daily Live Event.", test: ({ profile }) => (profile?.weeklyLiveEvents?.totalClears ?? 0) >= 1 },
]);

export function refreshCareerAchievements(profile, now = new Date()) {
  const c = ensureCareerState(profile, now);
  if (!c) return [];
  const newlyEarned = [];
  const context = { profile, total: c.total, bySuperstar: c.bySuperstar, byMode: c.byMode, byFinish: c.byFinish };
  for (const achievement of CAREER_ACHIEVEMENTS) {
    if (c.achievements[achievement.id]) continue;
    if (!achievement.test(context)) continue;
    c.achievements[achievement.id] = { earnedAt: now.toISOString() };
    newlyEarned.push(achievement.id);
  }
  return newlyEarned;
}

export function recordCareerMatch(profile, { result, superstarId, mode = "exhibition", finishType = "match", now = new Date() } = {}) {
  if (!profile || !["win", "loss"].includes(result) || !superstarId) return { recorded: false, newlyEarned: [] };
  const c = ensureCareerState(profile, now);
  const field = result === "win" ? "wins" : "losses";
  c.total[field] += 1;
  c.bySuperstar[superstarId] = normalizeRecord(c.bySuperstar[superstarId] ?? blankRecord());
  c.bySuperstar[superstarId][field] += 1;
  c.byMode[mode] = normalizeRecord(c.byMode[mode] ?? blankRecord());
  c.byMode[mode][field] += 1;
  const finish = String(finishType || "match").toLowerCase();
  c.byFinish[finish] = normalizeRecord(c.byFinish[finish] ?? blankRecord());
  c.byFinish[finish][field] += 1;
  const newlyEarned = refreshCareerAchievements(profile, now);
  return { recorded: true, newlyEarned, total: { ...c.total } };
}

export function careerRecord(profile) {
  return ensureCareerState(profile);
}

export function achievementProgress(profile) {
  const c = ensureCareerState(profile);
  return CAREER_ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    earned: !!c?.achievements?.[achievement.id],
    earnedAt: c?.achievements?.[achievement.id]?.earnedAt ?? null,
  }));
}
