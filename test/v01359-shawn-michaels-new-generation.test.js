import test from "node:test";
import assert from "node:assert/strict";
import { sets } from "../js/data/sets.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js?v=0.13.72";
import { isPlayerVisibleSuperstar, isPlayerReleasedSetId } from "../js/data/release.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";
import { canPlaySpecial } from "../js/engine/rules.js?v=0.13.72";

const shawn = Object.values(superstars).find(s => s.id === "shawn-michaels");
const byId = Object.fromEntries(allGameplayCards.map(c => [c.id,c]));

test("v0.13.59 Shawn Michaels is an undated hidden 1993-1995 New Generation Superstar", () => {
  assert.equal(sets["new-generation-series-1"].eraWindow, "1993-1995");
  assert.ok(shawn);
  assert.equal(shawn.era, "1993–1995 New Generation");
  assert.equal(shawn.developmentOnly, true);
  assert.equal(isPlayerReleasedSetId("new-generation-series-1", new Date(2035,0,1)), false);
  assert.equal(isPlayerVisibleSuperstar(shawn, {unlockedSuperstars:["shawn-michaels"]}, new Date(2035,0,1)), false);
});

test("v0.13.59 HBK has a legal 60-page agility/strike/technical authored baseline", () => {
  assert.equal(shawn.hp,61);
  assert.deepEqual(shawn.starterMomentum,{agility:6,strike:4,technical:2});
  assert.equal(shawn.ability.name,"Heartbreak Kid");
  assert.equal(shawn.ability.trigger.type,"agilityAfterStrike");
  assert.equal(shawn.ability.trigger.maxUses,3);
  assert.equal(decks["shawn-michaels"].length,60);
  assert.equal(decks["shawn-michaels"].filter(c=>c.kind==="momentum").length,12);
  assert.ok(decks["shawn-michaels"].some(c=>c.id==="once-too-often"));
});

test("v0.13.59 HBK signature block is Rare/Very Rare and Sweet Chin Music respects finisher rules", () => {
  for(const id of ["shawn-michaels-flying-forearm","shawn-michaels-teardrop-suplex","shawn-michaels-top-rope-elbow-drop"]){
    assert.equal(byId[id].rarity,3);
    assert.equal(byId[id].trademark,true);
  }
  const scm=byId["shawn-michaels-sweet-chin-music"];
  assert.equal(scm.rarity,4);
  assert.equal(scm.finisher,true);
  assert.equal(scm.damage,17);
  assert.equal(scm.cost,10);
  assert.deepEqual(scm.requirements,{});
  assert.equal(scm.method,null);
  assert.equal(scm.groundOpponent,true);
  assert.equal(byId["special-shawn-michaels"].special.type,"hbkShowstopper");
});

test("v0.13.59 Shawn owns stable NG1-008 through NG1-014 collector identities",()=>{
  const ids=["shawn-michaels-flying-forearm","shawn-michaels-teardrop-suplex","shawn-michaels-top-rope-elbow-drop","shawn-michaels-sweet-chin-music","entrance-shawn-michaels","special-shawn-michaels","superstar-shawn-michaels"];
  assert.deepEqual(ids.map(id=>CARD_NUMBER_BY_ID[id].cardCode),["NG1-008","NG1-009","NG1-010","NG1-011","NG1-012","NG1-013","NG1-014"]);
});

test("v0.13.59 Heartbreak Kid and The Showstopper execute in the live engine",()=>{
  const opponent=Object.values(superstars).find(s=>!s.developmentOnly&&s.id!=="shawn-michaels");
  const g=new MatchEngine({p1:shawn,p2:opponent,decks,rng:()=>0.42});
  const st=g.state(),p1=st.players.p1;
  p1.hand=[]; p1.deck=Array.from({length:10},(_,i)=>({...byId["punch"],instanceId:`draw-${i}`}));
  p1.events.strikeConnectedThisControl=true;
  const beforeHand=p1.hand.length,beforeAd=p1.adrenaline;
  assert.equal(g._ability("p1","connect",{card:byId["shawn-michaels-top-rope-elbow-drop"],damage:10,hadStrikeThisControl:true}),true);
  assert.equal(p1.hand.length,beforeHand+1);
  assert.equal(p1.adrenaline,beforeAd+1);

  const special={...byId["special-shawn-michaels"],instanceId:"hbk-special"};
  const trademark={...byId["shawn-michaels-flying-forearm"],instanceId:"hbk-forearm"};
  p1.hand=[special]; p1.deck=[trademark]; p1.discard=[]; p1.specialUsed=false; p1.usedSpecialIds=[]; p1.namedDiscount={};
  st.phase="ACTION"; st.playerInControl="p1";
  assert.equal(canPlaySpecial(st,"p1",special),true);
  assert.equal(g.playSpecial("p1",special),true);
  assert.ok(p1.hand.some(c=>c.id==="shawn-michaels-flying-forearm"));
  assert.equal(p1.namedDiscount["Flying Forearm"],1);
  assert.equal(p1.specialUsed,true);
});
