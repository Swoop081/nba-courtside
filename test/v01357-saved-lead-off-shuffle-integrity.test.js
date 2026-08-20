import test from "node:test";
import assert from "node:assert/strict";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";
import { shuffle } from "../js/engine/utils.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const stars = Object.values(superstars);

test("v0.13.57 live matches honor the deck's actual first five pages as Lead Off 5", () => {
  const p1 = stars.find(s => s.id === "roman-reigns") ?? stars[0];
  const p2 = stars.find(s => s.id !== p1.id && decks[s.id]?.length === 60);
  assert.ok(p1 && p2);

  const customized = [...decks[p1.id]];
  const swapIndex = customized.findIndex((card, index) => index >= 5 && card.id !== customized[0]?.id);
  assert.ok(swapIndex >= 5);
  [customized[0], customized[swapIndex]] = [customized[swapIndex], customized[0]];

  const expectedLead = customized.slice(0, 5).map(card => card.id);
  assert.notDeepEqual(expectedLead, p1.leadOffIds, "fixture must differ from the Superstar's authored Lead Off ids");

  const game = new MatchEngine({
    p1,
    p2,
    decks: { [p1.id]: customized, [p2.id]: decks[p2.id] },
    rng: mulberry32(0x1357)
  });
  const player = game.state().players.p1;

  assert.deepEqual(player.hand.map(card => card.id), expectedLead);
  assert.equal(player.hand.length, 5);
  assert.equal(player.deck.length, 55);
});

test("v0.13.57 authored CPU decks also use the authored deck's actual first five", () => {
  for (let i = 0; i < stars.length; i += 1) {
    const star = stars[i], deck = decks[star.id];
    if (!Array.isArray(deck) || deck.length !== 60) continue;
    const opponent = stars.find(candidate => candidate.id !== star.id && decks[candidate.id]?.length === 60);
    assert.ok(opponent, star.id);
    const game = new MatchEngine({
      p1: star,
      p2: opponent,
      decks: { [star.id]: deck, [opponent.id]: decks[opponent.id] },
      rng: mulberry32(0x13570000 + i)
    });
    assert.deepEqual(game.state().players.p1.hand.map(card => card.id), deck.slice(0, 5).map(card => card.id), star.id);
  }
});

test("v0.13.57 Fisher-Yates shuffle distributes Momentum evenly across all 55 tail positions", () => {
  // Model a standard 60-page deck after a 5-page Lead Off containing 2 Momentum:
  // 10 Momentum remain among 55 shuffled pages. A deterministic PRNG keeps the
  // regression stable while still exercising 25,000 independent shuffles.
  const tail = [
    ...Array.from({ length: 10 }, (_, i) => ({ id: `momentum-${i}`, kind: "momentum" })),
    ...Array.from({ length: 45 }, (_, i) => ({ id: `page-${i}`, kind: "move" }))
  ];
  const samples = 25000;
  const rng = mulberry32(0xC0FFEE57);
  const momentumAt = Array(55).fill(0);

  for (let sample = 0; sample < samples; sample += 1) {
    const result = shuffle(tail, rng);
    for (let pos = 0; pos < result.length; pos += 1) {
      if (result[pos].kind === "momentum") momentumAt[pos] += 1;
    }
  }

  const expectedRate = 10 / 55;
  for (let pos = 0; pos < momentumAt.length; pos += 1) {
    const rate = momentumAt[pos] / samples;
    assert.ok(
      Math.abs(rate - expectedRate) < 0.012,
      `tail position ${pos + 1} Momentum rate ${rate.toFixed(4)} should stay near ${expectedRate.toFixed(4)}`
    );
  }

  const firstHalf = momentumAt.slice(0, 27).reduce((a, b) => a + b, 0) / (samples * 27);
  const secondHalf = momentumAt.slice(28).reduce((a, b) => a + b, 0) / (samples * 27);
  assert.ok(Math.abs(firstHalf - secondHalf) < 0.004, `front/back rates diverged: ${firstHalf} vs ${secondHalf}`);
});
