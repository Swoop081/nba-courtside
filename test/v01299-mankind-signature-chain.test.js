import test from "node:test";
import assert from "node:assert/strict";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";

const card = id => allGameplayCards.find(c => c.id === id);
const star = id => Object.values(superstars).find(s => s.id === id);

test("v0.12.99 renames HOF1-026 to Mankind’s Elbow Drop without changing collector id or core stats", () => {
  const elbow = card("mankind-cactus-elbow");
  assert.ok(elbow);
  assert.equal(elbow.name, "Mankind’s Elbow Drop");
  assert.equal(elbow.cost, 5);
  assert.equal(elbow.damage, 8);
  assert.equal(elbow.rarity, 3);
  assert.equal(elbow.counterState, "diving-aerial");
});

test("v0.12.99 Mankind’s Clothesline is a Rare exclusive Trademark above shared Clothesline damage", () => {
  const shared = card("clothesline");
  const move = card("mankind-clothesline");
  assert.ok(move);
  assert.equal(move.name, "Mankind’s Clothesline");
  assert.equal(move.superstarId, "mankind");
  assert.equal(move.rarity, 3);
  assert.equal(move.trademark, true);
  assert.equal(move.cost, 5);
  assert.equal(move.damage, 8);
  assert.ok(move.damage > shared.damage);
  assert.deepEqual(move.requirements, { strike: 2 });
  assert.equal(move.groundOpponent, true);
  assert.deepEqual(move.effects, [{ type: "search", name: "Mankind’s Elbow Drop", discount: 1 }]);
});

test("v0.12.99 Mankind authored deck uses two Mankind’s Clotheslines and three Elbow Drops", () => {
  const ids = decks.mankind.map(c => c.id);
  assert.equal(ids.length, 60);
  assert.equal(ids.filter(id => id === "mankind-clothesline").length, 2);
  assert.equal(ids.filter(id => id === "clothesline").length, 0);
  assert.equal(ids.filter(id => id === "mankind-cactus-elbow").length, 3);
  assert.ok(star("mankind").signatures.includes("mankind-clothesline"));
  assert.ok(star("mankind").signatures.includes("mankind-cactus-elbow"));
});

test("v0.12.99 Mankind’s Clothesline searches the Elbow Drop and applies its one-cost chain discount", () => {
  const m = star("mankind");
  const opponent = star("cm-punk");
  const clothesline = card("mankind-clothesline");
  const elbow = card("mankind-cactus-elbow");
  const filler = card("punch");
  const engine = new MatchEngine({ p1: m, p2: opponent, decks: { mankind: decks.mankind, "cm-punk": decks["cm-punk"] }, rng: () => 0.5 });
  const state = engine._state;
  const p = state.players.p1;
  p.hand = [clothesline];
  p.deck = [elbow];
  p.momentum.strike = 2;
  p.adrenaline = 3;
  p.momentum.attitude = 3;
  state.playerInControl = "p1";
  state.phase = "ACTION";
  assert.equal(engine.declareMove("p1", clothesline), true);
  assert.equal(engine.passCounter("p2"), true);
  assert.ok(p.hand.some(c => c.id === "mankind-cactus-elbow"));
  assert.equal(p.namedDiscount["Mankind’s Elbow Drop"], 1);
});
