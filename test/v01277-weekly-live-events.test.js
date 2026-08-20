import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { WEEKLY_LIVE_EVENTS, LIVE_EVENT_LENGTH, LIVE_EVENT_WIN_UP, LIVE_EVENT_CLEAR_BOOSTERS, liveEventRotation, liveEventStage, weeklyLiveEventState, startWeeklyLiveEvent, currentWeeklyLiveEventOpponent, recordWeeklyLiveEventMatch } from "../js/data/live-events.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { isLaunchLiveSetId } from "../js/data/release.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";

const roster = Object.values(superstars).filter(star => !star.developmentOnly && isLaunchLiveSetId(star.setId));
const rosterIds = roster.map(star => star.id);
const byId = Object.fromEntries(Object.values(superstars).map(star => [star.id, star]));

test("v0.12.81 Daily Live Events rotate by day with RAW Monday, NXT Wednesday and SmackDown Saturday", () => {
  const monday = liveEventRotation(new Date("2026-08-17T12:00:00"));
  const tuesday = liveEventRotation(new Date("2026-08-18T12:00:00"));
  const wednesday = liveEventRotation(new Date("2026-08-19T12:00:00"));
  const saturday = liveEventRotation(new Date("2026-08-22T12:00:00"));
  assert.equal(monday.weekKey, "2026-08-17");
  assert.equal(monday.event.id, "raw-live");
  assert.equal(tuesday.event.id, "powerhouse-collision");
  assert.equal(wednesday.event.id, "nxt-rising");
  assert.equal(saturday.event.id, "smackdown-showcase");
  assert.ok(monday.msRemaining > 0);
});

test("v0.12.81 all Daily Live Event opponent pools stay inside the authored roster", () => {
  for (const event of WEEKLY_LIVE_EVENTS) {
    assert.ok(event.opponentPool.length >= LIVE_EVENT_LENGTH, `${event.id} has enough opponents`);
    assert.equal(new Set(event.opponentPool).size, event.opponentPool.length, `${event.id} has no duplicate pool ids`);
    for (const id of event.opponentPool) assert.ok(byId[id], `${event.id} exposes authored Superstar ${id}`);
  }
});

test("v0.12.81 Live Event tower persists five stages, retries losses and clears once per day", () => {
  const now = new Date("2026-08-18T12:00:00");
  const profile = {};
  const run = startWeeklyLiveEvent(profile, "cm-punk", rosterIds, () => 0.37, now);
  assert.equal(run.opponents.length, LIVE_EVENT_LENGTH);
  assert.equal(new Set(run.opponents).size, LIVE_EVENT_LENGTH);
  assert.ok(!run.opponents.includes("cm-punk"));
  const firstOpponent = currentWeeklyLiveEventOpponent(profile, now);
  const loss = recordWeeklyLiveEventMatch(profile, "loss", now);
  assert.equal(loss.status, "retry");
  assert.equal(run.stage, 0);
  assert.equal(currentWeeklyLiveEventOpponent(profile, now), firstOpponent);
  for (let i = 0; i < LIVE_EVENT_LENGTH - 1; i += 1) assert.equal(recordWeeklyLiveEventMatch(profile, "win", now).status, "advance");
  const clear = recordWeeklyLiveEventMatch(profile, "win", now);
  assert.equal(clear.status, "cleared");
  assert.equal(profile.weeklyLiveEvents.clearedThisWeek, true);
  assert.equal(profile.weeklyLiveEvents.totalClears, 1);
  const reset = weeklyLiveEventState(profile, new Date("2026-08-19T12:00:00"));
  assert.equal(reset.clearedThisWeek, false);
  assert.equal(reset.activeRun, null);
  assert.equal(reset.totalClears, 1);
});

test("v0.12.81 tower stages still escalate from standard rules to a final Momentum plus Adrenaline advantage", () => {
  const event = WEEKLY_LIVE_EVENTS.find(event => event.id === "powerhouse-collision");
  assert.equal(liveEventStage(event, 0).modifier, null);
  assert.equal(liveEventStage(event, 1).modifier.startingMomentum.p2.strength, 1);
  assert.equal(liveEventStage(event, 2).modifier.startingAdrenaline.p2, 1);
  assert.equal(liveEventStage(event, 3).modifier.startingHpLoss.p1, 4);
  assert.equal(liveEventStage(event, 4).modifier.startingMomentum.p2.strength, 1);
  assert.equal(liveEventStage(event, 4).modifier.startingAdrenaline.p2, 1);
  assert.equal(LIVE_EVENT_WIN_UP * LIVE_EVENT_LENGTH, 0);
  assert.equal(LIVE_EVENT_CLEAR_BOOSTERS, 1);
});

test("v0.12.81 MatchEngine applies Live Event start modifiers without changing printed Superstar HP", () => {
  const p1 = byId["cm-punk"], p2 = byId["brock-lesnar"];
  const engine = new MatchEngine({ p1, p2, decks: { [p1.id]: decks[p1.id], [p2.id]: decks[p2.id] }, rng: () => 0.42 });
  const before = engine.state();
  const p1Hp = before.players.p1.hp;
  const p2Strength = before.players.p2.momentum.strength;
  const p2Adrenaline = before.players.p2.adrenaline;
  assert.equal(engine.applyMatchModifier({ name: "Tower Final", ruleText: "Test modifier", startingMomentum: { p2: { strength: 1 } }, startingAdrenaline: { p2: 1 }, startingHpLoss: { p1: 4 } }), true);
  const after = engine.state();
  assert.equal(after.players.p1.hp, p1Hp - 4);
  assert.equal(after.players.p1.maxHp, p1.hp);
  assert.equal(after.players.p2.momentum.strength, p2Strength + 1);
  assert.equal(after.players.p2.adrenaline, p2Adrenaline + 1);
  assert.equal(after.players.p2.momentum.attitude, after.players.p2.adrenaline);
  assert.equal(after.log.at(-1).type, "MATCH_MODIFIER_APPLIED");
});

test("v0.12.81 Play menu still exposes Live Events and pack reveals can continue after duplicate conversion", () => {
  const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const play = app.slice(app.indexOf("function renderPlayMenu"), app.indexOf("function renderProfile"));
  assert.match(play, /legacy-mode-banner/);
  assert.match(play, /play-live-event/);
  assert.match(app, /data-booster-next=/);
  assert.match(app, /grantVictoryBooster\(profile, result, victorySetId\)/);
  assert.match(app, /boosted-odds .*Super Pack has been awarded/);
});
