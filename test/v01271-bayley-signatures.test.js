import test from "node:test";
import assert from "node:assert/strict";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";

const byId = id => allGameplayCards.find(c => c.id === id);

test("v0.12.71 Bayley has two Rare named signature moves", () => {
  const elbow = byId("bayley-diving-elbow");
  const belly = byId("bayley-to-belly");
  assert.ok(elbow); assert.ok(belly);
  assert.equal(elbow.name, "Bayley’s Diving Elbow");
  assert.equal(elbow.superstarId, "bayley");
  assert.equal(elbow.rarity, 3);
  assert.equal(elbow.cost, 7);
  assert.equal(elbow.damage, 12);
  assert.deepEqual(elbow.requirements, { agility: 2 });
  assert.equal(elbow.groundedOnly, true);
  assert.ok(elbow.effects.some(e => e.type === "drawSelf" && e.amount === 1));

  assert.equal(belly.name, "Bayley-to-Belly");
  assert.equal(belly.superstarId, "bayley");
  assert.equal(belly.rarity, 3);
  assert.equal(belly.cost, 5);
  assert.equal(belly.damage, 8);
  assert.deepEqual(belly.requirements, { strength: 2 });
  assert.equal(belly.groundOpponent, true);
  assert.ok(belly.effects.some(e => e.type === "search" && e.name === "Rose Plant" && e.discount === 4));
});

test("v0.12.71 Bayley deck replaces both generic moves without changing deck size", () => {
  const ids = decks.bayley.map(c => c.id);
  assert.equal(ids.length, 60);
  assert.equal(ids.filter(id => id === "bayley-diving-elbow").length, 3);
  assert.equal(ids.filter(id => id === "bayley-to-belly").length, 3);
  assert.equal(ids.filter(id => id === "diving-elbow-drop").length, 0);
  assert.equal(ids.filter(id => id === "belly-to-belly-suplex").length, 0);
  assert.deepEqual(superstars.bayley.signatures, ["bayley-to-belly", "bayley-diving-elbow", "bayley-rose-plant", "bayley-ding-dong-hello"]);
});

test("v0.12.71 shared versions remain generic for other Superstars", () => {
  const elbow = byId("diving-elbow-drop");
  const belly = byId("belly-to-belly-suplex");
  assert.equal(elbow.superstarId, null);
  assert.equal(belly.superstarId, null);
  assert.equal(belly.rulesText, "Shared canonical.");
  assert.deepEqual(belly.effects, []);
});

test("v0.12.71 Bayley signatures append stable Evolution collector IDs", () => {
  assert.deepEqual(CARD_NUMBER_BY_ID["bayley-diving-elbow"], { id:"bayley-diving-elbow", setId:"evolution-series-1", cardNumber:65, cardCode:"EVO1-065" });
  assert.deepEqual(CARD_NUMBER_BY_ID["bayley-to-belly"], { id:"bayley-to-belly", setId:"evolution-series-1", cardNumber:66, cardCode:"EVO1-066" });
});


test("v0.12.71 Bayley signature effects execute", () => {
  const g = new MatchEngine({ p1: superstars.bayley, p2: superstars.beckyLynch, decks, rng: () => 0.42 });
  const p = g.state().players.p1;
  const elbow = byId("bayley-diving-elbow");
  const belly = byId("bayley-to-belly");
  const rose = byId("bayley-rose-plant");

  p.hand = [];
  p.deck = [byId("punch")];
  g._effects("p1", elbow, {});
  assert.equal(p.hand.length, 1);

  p.hand = [];
  p.deck = [rose];
  p.namedDiscount = {};
  g._effects("p1", belly, {});
  assert.equal(p.hand[0]?.id, "bayley-rose-plant");
  assert.equal(p.namedDiscount["Rose Plant"], 4);
});
