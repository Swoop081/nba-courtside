import test from "node:test";
import assert from "node:assert/strict";
import { sets } from "../js/data/sets.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js?v=0.13.72";
import { isPlayerVisibleSuperstar, isPlayerReleasedSetId, setReleaseAt } from "../js/data/release.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";

const bret = Object.values(superstars).find(s => s.id === "bret-hart");
const byId = Object.fromEntries(allGameplayCards.map(c => [c.id,c]));

test("v0.13.56 New Generation Series 1 exists as an undated hidden future container", () => {
  assert.equal(sets["new-generation-series-1"].displayName, "New Generation — Series 1");
  assert.equal(sets["new-generation-series-1"].eraWindow, "1993-1995");
  assert.equal(setReleaseAt("new-generation-series-1"), null);
  assert.equal(isPlayerReleasedSetId("new-generation-series-1", new Date(2035,0,1)), false);
  assert.equal(isPlayerVisibleSuperstar(bret, {unlockedSuperstars:["bret-hart"]}, new Date(2035,0,1)), false);
});

test("v0.13.56 Bret is a complete 1993-1995 New Generation Superstar with a legal authored deck", () => {
  assert.ok(bret);
  assert.equal(bret.era, "1993–1995 New Generation");
  assert.equal(bret.developmentOnly, true);
  assert.equal(bret.hp, 64);
  assert.deepEqual(bret.starterMomentum, {technical:6,strength:3,strike:3});
  assert.equal(bret.ability.name, "Excellence of Execution");
  assert.equal(bret.ability.trigger.type, "differentMethod");
  assert.equal(bret.ability.trigger.maxUses, 3);
  assert.equal(bret.ability.trigger.draw, 2);
  assert.equal(decks["bret-hart"].length, 60);
  assert.equal(decks["bret-hart"].filter(c => c.kind === "momentum").length, 12);
  assert.ok(decks["bret-hart"].some(c => c.id === "once-too-often"));
});

test("v0.13.56 Bret signature block is Rare/Very Rare and Sharpshooter follows global finisher rules", () => {
  for (const id of ["bret-hart-inverted-atomic-drop","bret-hart-pendulum-backbreaker","bret-hart-second-rope-elbow-drop"]) {
    assert.equal(byId[id].rarity, 3);
    assert.equal(byId[id].trademark, true);
  }
  const sharp=byId["bret-hart-sharpshooter"];
  assert.equal(sharp.rarity, 4);
  assert.equal(sharp.finisher, true);
  assert.deepEqual(sharp.requirements, {});
  assert.equal(sharp.method, null);
  assert.equal(sharp.submission.bodyPart, "legs");
  assert.equal(sharp.submission.pressure, 6);
  assert.equal(byId["special-bret-hart"].special.type, "counterTutorNamed");
});

test("v0.13.56 Bret owns stable NG1-001 through NG1-007 collector identities", () => {
  const ids=["bret-hart-inverted-atomic-drop","bret-hart-pendulum-backbreaker","bret-hart-second-rope-elbow-drop","bret-hart-sharpshooter","entrance-bret-hart","special-bret-hart","superstar-bret-hart"];
  assert.deepEqual(ids.map(id=>CARD_NUMBER_BY_ID[id].cardCode), ["NG1-001","NG1-002","NG1-003","NG1-004","NG1-005","NG1-006","NG1-007"]);
});


test("v0.13.56 Excellence of Execution and The Best There Is execute in the live engine", () => {
  const opponent = Object.values(superstars).find(s => !s.developmentOnly && s.id !== "bret-hart");
  const g = new MatchEngine({p1:bret,p2:opponent,decks,rng:()=>0.42});
  const s = g.state(), p = s.players.p1;
  p.hand=[];
  p.deck=Array.from({length:12},(_,i)=>({...byId["punch"], instanceId:`draw-${i}`}));
  p.events.differentMethodPrevious="technical";
  const before=p.hand.length;
  assert.equal(g._ability("p1","connect",{card:byId["bret-hart-inverted-atomic-drop"],damage:6}),true);
  assert.equal(p.hand.length,before+2);
  assert.equal(p.abilityUses,1);

  const special={...byId["special-bret-hart"],instanceId:"bret-special"};
  const sharpshooter={...byId["bret-hart-sharpshooter"],instanceId:"bret-sharp"};
  p.hand=[special]; p.deck=[sharpshooter]; p.discard=[]; p.specialUsed=false; p.usedSpecialIds=[]; p.namedDiscount={};
  assert.equal(g._triggerCounterSpecial("p1",false,byId["powerbomb"]),false);
  assert.ok(p.hand.some(c=>c.id==="bret-hart-sharpshooter"));
  assert.equal(p.namedDiscount["Sharpshooter"],2);
  assert.equal(p.specialUsed,true);
});
