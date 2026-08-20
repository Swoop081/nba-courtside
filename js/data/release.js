import { sets } from "./sets.js?v=0.13.72";

// v0.13.7 — one canonical player release calendar. Launch sets are live from
// install; authored future sets become player-live at local midnight on their
// configured set.releaseDate. Every player-facing system should ask these
// helpers rather than maintaining its own hard-coded gate.
export const LAUNCH_LIVE_SET_IDS = Object.freeze([
  "summerslam-series-1",
  "hall-of-fame-series-1",
  "evolution-series-1"
]);

export const LIVE_SEASON_REWARD_SET_IDS = Object.freeze([
  "season-1-final-boss"
]);

export const SCHEDULED_PLAYER_SET_IDS = Object.freeze([
  "raw-series-1",
  "worlds-collide-series-1",
  "money-in-the-bank-series-1",
  "smackdown-series-1",
  "survivor-series-series-1"
]);

export const PLAYER_COLLECTIBLE_SET_IDS = Object.freeze([
  ...LAUNCH_LIVE_SET_IDS,
  ...SCHEDULED_PLAYER_SET_IDS
]);

function asDate(now = new Date()) {
  if (now instanceof Date) return Number.isNaN(now.getTime()) ? new Date() : now;
  const parsed = new Date(now);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

// Release dates are interpreted at midnight in the player's local timezone.
// This makes a dated subset unlock on the advertised calendar day rather than
// at an arbitrary UTC hour on iPhone.
export function setReleaseAt(setId) {
  const raw = sets[setId]?.releaseDate;
  if (!raw) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(raw));
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 0, 0, 0, 0);
}

export function isLaunchLiveSetId(setId) {
  return LAUNCH_LIVE_SET_IDS.includes(setId);
}

export function isScheduledSetReleased(setId, now = new Date()) {
  if (!SCHEDULED_PLAYER_SET_IDS.includes(setId)) return false;
  const releaseAt = setReleaseAt(setId);
  return !!releaseAt && asDate(now).getTime() >= releaseAt.getTime();
}

export function isPlayerReleasedSetId(setId, now = new Date()) {
  return isLaunchLiveSetId(setId)
    || LIVE_SEASON_REWARD_SET_IDS.includes(setId)
    || isScheduledSetReleased(setId, now);
}

export function playerReleasedCollectibleSetIds(now = new Date()) {
  return PLAYER_COLLECTIBLE_SET_IDS.filter(setId => isPlayerReleasedSetId(setId, now));
}

export function playerReleaseCalendar() {
  return PLAYER_COLLECTIBLE_SET_IDS.map(setId => ({
    setId,
    releaseDate: sets[setId]?.releaseDate ?? null,
    launch: isLaunchLiveSetId(setId)
  }));
}

// Internal certification scope. RAW stays in the pre-release harness before
// September 5; after that date it is naturally both internally testable and
// player-released without changing this list.
export const PRE_RELEASE_TEST_SET_IDS = Object.freeze([
  "raw-series-1",
  "worlds-collide-series-1",
  "new-generation-series-1"
]);

export function isInternalTestSetId(setId, now = new Date()) {
  return isPlayerReleasedSetId(setId, now) || PRE_RELEASE_TEST_SET_IDS.includes(setId);
}

export function isUnreleasedSetId(setId, now = new Date()) {
  const set = sets[setId];
  return !!set && !isPlayerReleasedSetId(setId, now);
}

export function isLaunchRosterSuperstar(star) {
  return !!star && !star.developmentOnly && isLaunchLiveSetId(star.setId);
}

export function isPlayerVisibleSuperstar(star, profile = null, now = new Date()) {
  if (!star || star.developmentOnly || isUnreleasedSetId(star.setId, now)) return false;
  if (PLAYER_COLLECTIBLE_SET_IDS.includes(star.setId)) return true;
  // Season reward Superstars remain hidden from ordinary roster surfaces until
  // actually earned, while their chase presentation can still appear in Season.
  return !!profile?.unlockedSuperstars?.includes(star.id);
}
