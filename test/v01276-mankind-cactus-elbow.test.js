import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { migrateProfile } from "../js/data/profile.js?v=0.13.72";

const byId = id => allGameplayCards.find(card => card.id === id);

test("v0.12.76 replaces Mankind's Running Knee to the Corner with the HOF1-026 Mankind elbow card", () => {
  const elbow = byId("mankind-cactus-elbow");
  assert.ok(elbow);
  assert.equal(elbow.name, "Mankind’s Elbow Drop");
  assert.equal(elbow.superstarId, "mankind");
  assert.equal(elbow.rarity, 3);
  assert.equal(elbow.cost, 5);
  assert.equal(elbow.damage, 8);
  assert.deepEqual(elbow.requirements, { strike: 2 });
  assert.equal(elbow.counterState, "diving-aerial");
  assert.equal(byId("mankind-running-knee-to-the-corner"), undefined);
});

test("v0.12.76 Mankind authored deck carries three Mankind’s Elbow Drops and no retired knees", () => {
  const ids = decks.mankind.map(card => card.id);
  assert.equal(ids.filter(id => id === "mankind-cactus-elbow").length, 3);
  assert.equal(ids.includes("mankind-running-knee-to-the-corner"), false);
});

test("v0.12.76 profile migration preserves owned copies and saved deck slots for the replacement", () => {
  const old = {
    version: 27,
    starterId: "cm-punk",
    unlockedSuperstars: ["cm-punk", "mankind"],
    favouriteSuperstars: [],
    ownedCards: {
      "mankind-running-knee-to-the-corner": { normal: 2, foil: 1 }
    },
    savedDecks: {
      mankind: [
        { id: "mankind-running-knee-to-the-corner", foil: false },
        { id: "mankind-running-knee-to-the-corner", foil: false },
        { id: "mankind-running-knee-to-the-corner", foil: true }
      ]
    }
  };
  const p = migrateProfile(old);
  assert.equal(p.ownedCards["mankind-running-knee-to-the-corner"], undefined);
  assert.deepEqual(p.ownedCards["mankind-cactus-elbow"], { normal: 2, foil: 1 });
  assert.deepEqual(p.savedDecks.mankind.map(entry => entry.id), ["mankind-cactus-elbow", "mankind-cactus-elbow", "mankind-cactus-elbow"]);
});

test("v0.12.76 retired Mankind knee name/id are absent from authored card data", () => {
  const content = fs.readFileSync(new URL("../js/data/content.js", import.meta.url), "utf8");
  const manifest = fs.readFileSync(new URL("../js/data/card-number-manifest.js", import.meta.url), "utf8");
  assert.doesNotMatch(content, /Running Knee to the Corner/);
  assert.doesNotMatch(content, /mankind-running-knee-to-the-corner/);
  assert.doesNotMatch(manifest, /mankind-running-knee-to-the-corner/);
});
