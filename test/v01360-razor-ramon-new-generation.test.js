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

const razor=Object.values(superstars).find(s=>s.id==="razor-ramon");
const byId=Object.fromEntries(allGameplayCards.map(c=>[c.id,c]));

test("v0.13.60 Razor Ramon is an undated hidden 1993-1995 New Generation Superstar",()=>{
  assert.equal(sets["new-generation-series-1"].eraWindow,"1993-1995"); assert.ok(razor); assert.equal(razor.nickname,"The Bad Guy"); assert.equal(razor.era,"1993–1995 New Generation"); assert.equal(razor.developmentOnly,true);
  assert.equal(isPlayerReleasedSetId("new-generation-series-1",new Date(2035,0,1)),false); assert.equal(isPlayerVisibleSuperstar(razor,{unlockedSuperstars:["razor-ramon"]},new Date(2035,0,1)),false);
});

test("v0.13.60 Razor has a legal 60-page Strength/Strike/Technical authored baseline",()=>{
  assert.equal(razor.hp,64); assert.deepEqual(razor.starterMomentum,{strength:6,strike:4,technical:2}); assert.equal(razor.ability.name,"Oozing Machismo"); assert.equal(razor.ability.trigger.type,"connectMethodCost"); assert.equal(razor.ability.trigger.maxUses,1);
  assert.equal(decks["razor-ramon"].length,60); assert.equal(decks["razor-ramon"].filter(c=>c.kind==="momentum").length,12); assert.ok(decks["razor-ramon"].some(c=>c.id==="once-too-often"));
});

test("v0.13.60 Razor signature block is Rare/Very Rare and The Razor's Edge respects finisher rules",()=>{
  for(const id of ["razor-ramon-fallaway-slam","razor-ramon-running-powerslam","razor-ramon-chokeslam"]){assert.equal(byId[id].rarity,3); assert.equal(byId[id].trademark,true);}
  const edge=byId["razor-ramon-razors-edge"]; assert.equal(edge.rarity,4); assert.equal(edge.finisher,true); assert.equal(edge.damage,17); assert.equal(edge.cost,10); assert.deepEqual(edge.requirements,{}); assert.equal(edge.method,null); assert.equal(edge.groundOpponent,true);
  assert.equal(byId["special-razor-ramon"].special.type,"exclusiveTrademarkTutor");
});

test("v0.13.60 Razor owns stable NG1-015 through NG1-021 collector identities",()=>{
  const ids=["razor-ramon-fallaway-slam","razor-ramon-running-powerslam","razor-ramon-chokeslam","razor-ramon-razors-edge","entrance-razor-ramon","special-razor-ramon","superstar-razor-ramon"];
  assert.deepEqual(ids.map(id=>CARD_NUMBER_BY_ID[id].cardCode),["NG1-015","NG1-016","NG1-017","NG1-018","NG1-019","NG1-020","NG1-021"]);
});

test("v0.13.60 Oozing Machismo and Say Hello to the Bad Guy execute in the live engine",()=>{
  const opponent=Object.values(superstars).find(s=>!s.developmentOnly&&s.id!=="razor-ramon"); const g=new MatchEngine({p1:razor,p2:opponent,decks,rng:()=>0.42}); const st=g.state(),p1=st.players.p1;
  p1.hand=[]; p1.deck=Array.from({length:10},(_,i)=>({...byId["punch"],instanceId:`draw-${i}`})); const beforeHand=p1.hand.length,beforeAd=p1.adrenaline;
  assert.equal(g._ability("p1","connect",{card:byId["razor-ramon-running-powerslam"],damage:9}),true); assert.equal(p1.hand.length,beforeHand); assert.equal(p1.adrenaline,beforeAd+1);
  const special={...byId["special-razor-ramon"],instanceId:"razor-special"}, trademark={...byId["razor-ramon-fallaway-slam"],instanceId:"razor-fallaway"};
  p1.hand=[special]; p1.deck=[trademark]; p1.discard=[]; p1.specialUsed=false; p1.usedSpecialIds=[]; p1.namedDiscount={}; st.phase="ACTION"; st.playerInControl="p1";
  assert.equal(canPlaySpecial(st,"p1",special),true); assert.equal(g.playSpecial("p1",special),true); assert.ok(p1.hand.some(c=>c.id==="razor-ramon-fallaway-slam")); assert.equal(p1.namedDiscount["Razor’s Fallaway Slam"],1);
});
