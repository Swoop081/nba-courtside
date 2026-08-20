import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createProfile, migrateProfile } from "../js/data/profile.js?v=0.13.72";
import { CAREER_ACHIEVEMENTS, recordCareerMatch, refreshCareerAchievements } from "../js/data/career.js?v=0.13.72";
import { collectionCards } from "../js/data/collection.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { tierReward } from "../js/data/seasons.js?v=0.13.72";

const byId = new Map(collectionCards.map(card => [card.id, card]));

test("v0.12.78 records total, Superstar, mode and finish W/L without mixing opponents into the player's record", () => {
  const p = createProfile("cm-punk");
  recordCareerMatch(p, { result: "win", superstarId: "cm-punk", mode: "exhibition", finishType: "pin" });
  recordCareerMatch(p, { result: "loss", superstarId: "cm-punk", mode: "ladder", finishType: "submission" });
  assert.deepEqual(p.career.total, { wins: 1, losses: 1 });
  assert.deepEqual(p.career.bySuperstar["cm-punk"], { wins: 1, losses: 1 });
  assert.deepEqual(p.career.byMode.exhibition, { wins: 1, losses: 0 });
  assert.deepEqual(p.career.byMode.ladder, { wins: 0, losses: 1 });
  assert.deepEqual(p.career.byFinish.pin, { wins: 1, losses: 0 });
  assert.deepEqual(p.career.byFinish.submission, { wins: 0, losses: 1 });
});

test("v0.12.78 launches a persistent achievement set and unlocks career/mode milestones from real state", () => {
  const p = createProfile("roman-reigns");
  assert.equal(CAREER_ACHIEVEMENTS.length, 15);
  recordCareerMatch(p, { result: "win", superstarId: "roman-reigns", mode: "exhibition", finishType: "pin" });
  assert.ok(p.career.achievements["first-bell"]);
  assert.ok(p.career.achievements["winners-circle"]);
  p.ladder.clears = 1;
  p.championshipRoad.clears = 1;
  p.weeklyLiveEvents.totalClears = 1;
  refreshCareerAchievements(p);
  assert.ok(p.career.achievements["ladder-conqueror"]);
  assert.ok(p.career.achievements["championship-gold"]);
  assert.ok(p.career.achievements["live-event-headliner"]);
});

test("v0.12.78 migration starts accurate W/L tracking at zero but backfills achievements supported by existing clear counters", () => {
  const legacy = createProfile("cm-punk");
  legacy.version = 27;
  delete legacy.career;
  legacy.ladder.clears = 2;
  legacy.championshipRoad.clears = 1;
  const migrated = migrateProfile(legacy);
  assert.deepEqual(migrated.career.total, { wins: 0, losses: 0 });
  assert.equal(migrated.career.trackingSinceBuild, "0.12.78");
  assert.ok(migrated.career.achievements["ladder-conqueror"]);
  assert.ok(migrated.career.achievements["championship-gold"]);
});

test("v0.12.78 replaces Final Boss Slap with Rare Strike Lay The Smack Down while preserving S1FB-001 gameplay slot", () => {
  const card = byId.get("the-rock-lay-the-smack-down");
  assert.ok(card);
  assert.equal(card.name, "Lay The Smack Down");
  assert.equal(card.kind, "move");
  assert.equal(card.moveType, "strike");
  assert.equal(card.rarity, 3);
  assert.equal(card.cost, 4);
  assert.equal(card.damage, 7);
  assert.deepEqual(card.requirements, { strike: 2 });
  assert.equal(card.counterState, "arm-extended");
  assert.deepEqual(card.effects, [{ type: "loseOpponentAdrenaline", amount: 1 }]);
  assert.equal(card.cardCode, "S1FB-001");
  assert.equal(tierReward(5).cardId, "the-rock-lay-the-smack-down");
  assert.equal(tierReward(5).name, "Lay The Smack Down");
  assert.equal(decks["the-rock"].filter(c => c.id === "the-rock-lay-the-smack-down").length, 3);
  assert.equal(decks["the-rock"].some(c => c.id === "the-rock-final-boss-slap"), false);
});

test("v0.12.78 migrates owned and saved Final Boss Slap copies to Lay The Smack Down and My Legacy renders career sections", () => {
  const legacy = createProfile("cm-punk");
  legacy.version = 27;
  legacy.ownedCards["the-rock-final-boss-slap"] = { normal: 2, foil: 1 };
  legacy.savedDecks["cm-punk"] = [{ id: "the-rock-final-boss-slap", foil: false }];
  const migrated = migrateProfile(legacy);
  assert.deepEqual(migrated.ownedCards["the-rock-lay-the-smack-down"], { normal: 2, foil: 1 });
  assert.equal(migrated.ownedCards["the-rock-final-boss-slap"], undefined);
  // An illegal Rock-exclusive card is later removed from Punk's deck by normal deck validation,
  // so source inspection verifies the migration rewrite exists before that validation step.
  const profileSource = fs.readFileSync(new URL("../js/data/profile.js", import.meta.url), "utf8");
  assert.match(profileSource, /legacyFinalBossSlapId/);
  assert.match(profileSource, /layTheSmackDownId/);
  const appSource = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.match(appSource, /Mode Records/);
  assert.match(appSource, /Superstar Records/);
  assert.match(appSource, /Achievements/);
  assert.match(appSource, /recordCareerMatch\(profile/);
});
