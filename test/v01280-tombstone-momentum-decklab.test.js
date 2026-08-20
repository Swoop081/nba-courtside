import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { moveEligibility } from "../js/engine/rules.js?v=0.13.72";
import { cardEligibilityForSuperstar, recommendedDeckDraft, removeCardFromDraft, addCardToDraft } from "../js/data/deck-builder.js?v=0.13.72";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");

test("v0.12.80 locks Tombstone Piledriver to The Undertaker and Kane only", () => {
  const tombstone = allGameplayCards.find(card => card.id === "tombstone-piledriver");
  assert.ok(tombstone);
  assert.deepEqual(tombstone.allowedSuperstarIds, ["the-undertaker", "kane"]);
  assert.equal(tombstone.rarity, 4);
  assert.equal(tombstone.finisher, true);

  const undertaker = Object.values(superstars).find(star => star.id === "the-undertaker");
  const kane = Object.values(superstars).find(star => star.id === "kane");
  const punk = Object.values(superstars).find(star => star.id === "cm-punk");
  assert.equal(cardEligibilityForSuperstar(undertaker, tombstone).legal, true);
  assert.equal(cardEligibilityForSuperstar(kane, tombstone).legal, true);
  assert.equal(cardEligibilityForSuperstar(punk, tombstone).legal, false);

  const matchStateFor = superstar => ({
    phase: "ACTION",
    playerInControl: "p1",
    players: {
      p1: { superstar, momentum: { agility: 20, strength: 20, strike: 20, technical: 20 }, adrenaline: 20 },
      p2: { hp: 60, posture: "standing", momentum: {} },
    },
  });
  assert.equal(moveEligibility(matchStateFor(undertaker), "p1", tombstone).legal, true);
  assert.equal(moveEligibility(matchStateFor(kane), "p1", tombstone).legal, true);
  assert.equal(moveEligibility(matchStateFor(punk), "p1", tombstone).legal, false);
});

test("v0.12.80 Deck Lab lets Momentum be reduced to zero even when the last copy is in Lead Off 5", () => {
  assert.match(app, /card\.kind === "momentum" && tailIndex >= 0/);
  assert.match(app, /idx >= 5 \|\| \(idx >= 0 && removing\?\.kind === "momentum"\)/);
  assert.match(app, /Momentum removed from Lead Off\. The next deck page moved into the opening five\./);
});


test("v0.12.80 supports CM Punk at 0 Agility / 6 Strike / 6 Technical Momentum", () => {
  let draft = recommendedDeckDraft("cm-punk");
  const agilityIndexes = draft.map((entry, index) => ((entry.id ?? entry) === "momentum-agility" ? index : -1)).filter(index => index >= 0);
  assert.equal(agilityIndexes.length, 2);

  // Recreate the problematic case: both remaining Agility pages live in Lead Off 5.
  for (let n = 0; n < 2; n++) {
    const from = draft.findIndex((entry, index) => index >= 5 && (entry.id ?? entry) === "momentum-agility");
    [draft[n], draft[from]] = [draft[from], draft[n]];
  }
  const profile = { ownedCards: {
    "momentum-technical": { normal: 15, foil: 0 },
    "momentum-strike": { normal: 15, foil: 0 },
    "momentum-agility": { normal: 15, foil: 0 },
  }};

  draft = removeCardFromDraft(profile, "cm-punk", draft, 1);
  draft = removeCardFromDraft(profile, "cm-punk", draft, 0);
  draft = addCardToDraft(profile, "cm-punk", draft, "momentum-technical");
  draft = addCardToDraft(profile, "cm-punk", draft, "momentum-technical");

  const counts = { agility: 0, strike: 0, technical: 0 };
  for (const entry of draft) {
    const id = entry.id ?? entry;
    if (id === "momentum-agility") counts.agility++;
    if (id === "momentum-strike") counts.strike++;
    if (id === "momentum-technical") counts.technical++;
  }
  assert.deepEqual(counts, { agility: 0, strike: 6, technical: 6 });
  assert.equal(draft.length, 60);
});
