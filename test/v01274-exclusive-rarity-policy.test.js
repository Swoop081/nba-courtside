import test from "node:test";
import assert from "node:assert/strict";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";

const isSingleWrestlerExclusive = card =>
  !!card?.superstarId || (!card?.superstarId && Array.isArray(card?.allowedSuperstarIds) && card.allowedSuperstarIds.length === 1);

const exclusiveCards = allGameplayCards.filter(isSingleWrestlerExclusive);

test("v0.12.74 wrestler-exclusive cards cannot be Common or Uncommon", () => {
  const offenders = exclusiveCards.filter(card => ![3, 4].includes(card.rarity));
  assert.deepEqual(offenders.map(card => [card.id, card.rarity]), []);
});

test("v0.12.74 exclusive Trademarks are Rare and Finishers are Very Rare", () => {
  const trademarkOffenders = exclusiveCards.filter(card => card.trademark && card.rarity !== 3);
  const finisherOffenders = exclusiveCards.filter(card => card.finisher && card.rarity !== 4);
  assert.deepEqual(trademarkOffenders.map(card => [card.id, card.rarity]), []);
  assert.deepEqual(finisherOffenders.map(card => [card.id, card.rarity]), []);
});

test("v0.13.20 wrestler-specific triggered Actions remain Very Rare", () => {
  const offenders = exclusiveCards.filter(card => card.kind === "action" && card.special?.type && card.rarity !== 4);
  assert.deepEqual(offenders.map(card => [card.id, card.rarity]), []);
});

test("v0.12.74 rarity pass promotes signature examples without forcing generic utility upward", () => {
  const byId = new Map(allGameplayCards.map(card => [card.id, card]));
  assert.equal(byId.get("cody-rhodes-dropdown-uppercut")?.rarity, 3);
  assert.equal(byId.get("roman-reigns-ooh-ahh")?.rarity, 3);
  assert.equal(byId.get("hogans-big-boot")?.rarity, 3);
  assert.equal(byId.get("special-cody-rhodes")?.rarity, 4);
  assert.equal(byId.get("shoulder-up")?.rarity, 1, "generic Shoulder Up Action remains outside the wrestler-exclusive rarity rule");
});
