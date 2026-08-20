import { superstars } from "./superstars.js?v=0.13.72";
import { decks } from "./decks.js?v=0.13.72";
import { isPlayerReleasedSetId, PLAYER_COLLECTIBLE_SET_IDS } from "./release.js?v=0.13.72";

export function exhibitionOpponentIds(playerSuperstarId, now = new Date()) {
  return Object.values(superstars)
    .filter(star => !star.developmentOnly && PLAYER_COLLECTIBLE_SET_IDS.includes(star.setId) && isPlayerReleasedSetId(star.setId, now) && star.id !== playerSuperstarId && (decks[star.id]?.length ?? 0) === 60)
    .map(star => star.id);
}

export function randomExhibitionOpponent(playerSuperstarId, rng = Math.random, now = new Date()) {
  const pool = exhibitionOpponentIds(playerSuperstarId, now);
  if (!pool.length) return null;
  const roll = Math.max(0, Math.min(0.999999999, Number(rng()) || 0));
  return pool[Math.floor(roll * pool.length)];
}
