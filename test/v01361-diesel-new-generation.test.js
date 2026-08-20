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

const diesel=Object.values(superstars).find(s=>s.id==="diesel");
const byId=Object.fromEntries(allGameplayCards.map(c=>[c.id,c]));

test("v0.13.61 Diesel completes the hidden undated 1993-1995 New Generation core four",()=>{
  assert.equal(sets["new-generation-series-1"].eraWindow,"1993-1995");
  assert.deepEqual(sets["new-generation-series-1"].plannedSuperstarIds,["bret-hart","shawn-michaels","diesel","razor-ramon"]);
  assert.ok(diesel); assert.equal(diesel.nickname,"Big Daddy Cool"); assert.equal(diesel.era,"1993–1995 New Generation"); assert.equal(diesel.developmentOnly,true);
  assert.equal(isPlayerReleasedSetId("new-generation-series-1",new Date(2035,0,1)),false);
  assert.equal(isPlayerVisibleSuperstar(diesel,{unlockedSuperstars:["diesel"]},new Date(2035,0,1)),false);
});

test("v0.13.61 Diesel has a legal 60-page heavyweight Strength/Strike authored baseline",()=>{
  assert.equal(diesel.hp,69);
  assert.deepEqual(diesel.starterMomentum,{strength:7,strike:4,technical:1});
  assert.equal(diesel.ability.name,"Big Daddy Cool");
  assert.equal(diesel.ability.trigger.type,"takeDamage");
  assert.equal(diesel.ability.trigger.minDamage,8);
  assert.equal(diesel.ability.trigger.maxUses,1);
  assert.equal(decks.diesel.length,60);
  assert.equal(decks.diesel.filter(c=>c.kind==="momentum").length,12);
  assert.deepEqual(decks.diesel.slice(0,5).map(c=>c.id),["momentum-strength","momentum-strike","big-boot","sidewalk-slam","punch"]);
  assert.ok(decks.diesel.some(c=>c.id==="once-too-often"));
});

test("v0.13.61 Diesel signature block is era-authentic Rare/Very Rare with elite Jackknife premium",()=>{
  for(const id of ["diesel-snake-eyes","diesel-big-boot","diesel-sidewalk-slam"]){
    assert.equal(byId[id].rarity,3); assert.equal(byId[id].trademark,true); assert.equal(byId[id].superstarId,"diesel");
  }
  const jackknife=byId["diesel-jackknife-powerbomb"];
  assert.equal(jackknife.name,"Jackknife Powerbomb"); assert.equal(jackknife.rarity,4); assert.equal(jackknife.finisher,true);
  assert.equal(jackknife.damage,18); assert.equal(jackknife.cost,11); assert.deepEqual(jackknife.requirements,{}); assert.equal(jackknife.method,null); assert.equal(jackknife.groundOpponent,true);
  assert.equal(byId["special-diesel"].name,"Two Dudes with Attitudes");
  assert.equal(byId["special-diesel"].special.type,"exclusiveTrademarkTutor");
  assert.equal(byId["entrance-diesel"].name,"Diesel Power");
});

test("v0.13.61 Diesel owns stable NG1-022 through NG1-028 collector identities",()=>{
  const ids=["diesel-snake-eyes","diesel-big-boot","diesel-sidewalk-slam","diesel-jackknife-powerbomb","entrance-diesel","special-diesel","superstar-diesel"];
  assert.deepEqual(ids.map(id=>CARD_NUMBER_BY_ID[id].cardCode),["NG1-022","NG1-023","NG1-024","NG1-025","NG1-026","NG1-027","NG1-028"]);
});

test("v0.13.61 Big Daddy Cool and Two Dudes with Attitudes execute in the live engine",()=>{
  const opponent=Object.values(superstars).find(s=>!s.developmentOnly&&s.id!=="diesel");
  const g=new MatchEngine({p1:diesel,p2:opponent,decks,rng:()=>0.42});
  const st=g.state(),p1=st.players.p1;
  const beforeAd=p1.adrenaline;
  assert.equal(g._ability("p1","takeDamage",{damage:7}),false);
  assert.equal(g._ability("p1","takeDamage",{damage:9}),true);
  assert.equal(p1.adrenaline,beforeAd+1);
  assert.equal(g._ability("p1","takeDamage",{damage:12}),false);
  assert.equal(p1.adrenaline,beforeAd+1);

  const special={...byId["special-diesel"],instanceId:"diesel-special"};
  const trademark={...byId["diesel-snake-eyes"],instanceId:"diesel-snake"};
  p1.hand=[special]; p1.deck=[trademark]; p1.discard=[]; p1.specialUsed=false; p1.usedSpecialIds=[]; p1.namedDiscount={}; st.phase="ACTION"; st.playerInControl="p1";
  assert.equal(canPlaySpecial(st,"p1",special),true);
  assert.equal(g.playSpecial("p1",special),true);
  assert.ok(p1.hand.some(c=>c.id==="diesel-snake-eyes"));
  assert.equal(p1.namedDiscount["Diesel’s Snake Eyes"],1);
});
