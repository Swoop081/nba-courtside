import test from "node:test";
import assert from "node:assert/strict";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js?v=0.13.72";

test("Biel Toss is a shared SummerSlam Common with the approved power-grapple profile", () => {
  const card = allGameplayCards.find(c => c.id === "biel-toss");
  assert.ok(card);
  assert.equal(card.name, "Biel Toss");
  assert.equal(card.setId, "summerslam-series-1");
  assert.equal(card.rarity, 1);
  assert.equal(card.superstarId, null);
  assert.equal(card.cost, 3);
  assert.equal(card.damage, 5);
  assert.deepEqual(card.requirements, { strength: 1 });
  assert.equal(card.method, "strength");
  assert.equal(card.moveType, "grapple");
  assert.equal(card.counterState, "front-control");
  assert.equal(card.groundOpponent, true);
  assert.equal(CARD_NUMBER_BY_ID[card.id].cardCode, "SS1-148");
});

test("Oba Femi uses two Biel Toss copies including Lead Off while retaining one Body Slam", () => {
  const deck = decks["oba-femi"];
  assert.equal(deck.length, 60);
  assert.equal(deck.filter(card => card.id === "biel-toss").length, 2);
  assert.equal(deck.filter(card => card.id === "body-slam").length, 1);
  const oba = Object.values(superstars).find(s => s.id === "oba-femi");
  assert.ok(oba);
  assert.deepEqual(oba.leadOffIds, ["momentum-strength", "momentum-strike", "punch", "shoulder-tackle", "biel-toss"]);
});
