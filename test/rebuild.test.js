import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { collectionCards } from "../js/data/collection.js?v=0.13.72";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js?v=0.13.72";
import { createProfile, migrateProfile, unlockSuperstar, addOwnedCard, addUniversePoints, totalOwnedCopies, cardOwnershipCap, hasSuperstar } from "../js/data/profile.js?v=0.13.72";
import { grantBooster, openBooster, finalizePackUniversePoints, boosterEligible } from "../js/data/boosters.js?v=0.13.72";
import { STORE_BOOSTER_PRICE, STORE_SUPERSTAR_PRICE, storeRotation, storeLeadOffCards, purchaseStoreBooster, purchaseStoreSuperstar } from "../js/data/store.js?v=0.13.72";
import { exhibitionOpponentIds, randomExhibitionOpponent } from "../js/data/matchmaking.js?v=0.13.72";
import { buildOwnedRecommendedDraft, autoFillOwnedDraft, recommendedDeckDraft, cardEligibilityForSuperstar, replaceLeadOffSlot, validateDeckDraft, selectedEntranceId, setSelectedEntrance, recommendedCategoryCounts, currentCategoryCounts } from "../js/data/deck-builder.js?v=0.13.72";
import { tierReward, claimSeasonTier, SEASON_1, SEASON_2_COMPLETION_SUPERSTAR } from "../js/data/seasons.js?v=0.13.72";
import { seasonExclusiveSuperstars } from "../js/data/season-exclusive.js?v=0.13.72";
import { season2GoldbergCards } from "../js/data/season2-goldberg-cards.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";
import { moveEligibility, canPlayMomentum, canAttemptPin, canPlayAction } from "../js/engine/rules.js?v=0.13.72";
import { decisionOwner, cpuDecision, executeCpuDecision } from "../js/ai/WrestlingAI.js?v=0.13.72";
import { healthZone } from "../js/engine/health.js?v=0.13.72";
import { LAUNCH_LIVE_SET_IDS, isLaunchLiveSetId, isUnreleasedSetId } from "../js/data/release.js?v=0.13.72";

const stars=Object.values(superstars);
const starById=new Map(stars.map(s=>[s.id,s]));
const byName=n=>allGameplayCards.find(c=>c.name===n);
function rng(seed=1){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}

test("reviewed decks are 60 pages with 12 Momentum and no orphan gameplay cards",()=>{
  assert.equal(Object.keys(decks).length,stars.length);
  const used=new Set();
  for(const [sid,d] of Object.entries(decks)){
    assert.equal(d.length,60,sid);
    assert.equal(d.filter(c=>c.kind==='momentum').length,12,sid);
    for(const c of d) used.add(c.id);
    const counts={}; for(const c of d) if(c.kind!=='momentum') counts[c.id]=(counts[c.id]||0)+1;
    assert.ok(Object.values(counts).every(n=>n<=5),sid);
    assert.equal(starById.get(sid)?.leadOffIds.length,5,sid);
    const lead=d.slice(0,5); assert.equal(lead.filter(c=>c.kind==='momentum').length,2,`${sid} Lead Off Momentum`); assert.equal(lead.filter(c=>c.kind==='move').length,3,`${sid} Lead Off Moves`);
  }
  assert.equal(allGameplayCards.filter(c=>c.kind!=='entrance'&&!c.boosterOnly&&!used.has(c.id)).length,0);
  assert.equal(allGameplayCards.some(c=>'pinBonus' in c||'pinBonusAfterNamed' in c||'pinBonusIfOpponentStunned' in c||/Pin Bonus|Pin \+\d+/i.test(c.rulesText??'')),false,'active card pool contains no Pin Bonus mechanic');
});

test("all Finishers are globally free of Method Momentum requirements",()=>{
  const finishers=allGameplayCards.filter(c=>c.finisher);
  assert.ok(finishers.length>=50);
  assert.deepEqual(finishers.filter(c=>Object.keys(c.requirements??{}).length).map(c=>c.id),[]);

  // Engine-level guard: even stale/custom Finisher data cannot reintroduce a Method gate.
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(1211)}),s=g.state(),p=s.players.p1;
  p.momentum={...p.momentum,strength:10,strike:0,agility:0,technical:0,attitude:10};
  const staleFinisher={id:"test-stale-finisher",name:"Test Stale Finisher",kind:"move",cost:5,damage:15,finisher:true,method:"strike",requirements:{strike:99}};
  const result=moveEligibility(s,"p1",staleFinisher);
  assert.equal(result.legal,true);
  assert.equal(result.effectiveCost,5);
});

test("profile, Foil replacement, Entrance ownership and boosters use rebuilt rules",()=>{
  const starter=stars.find(s=>['cm-punk','roman-reigns'].includes(s.id))?.id; assert.ok(starter);
  const p=createProfile(starter);
  for(const s of stars) unlockSuperstar(p,s.id);
  assert.equal(p.unlockedSuperstars.length,stars.length);
  assert.equal(totalOwnedCopies(p,'entrance-amazing'),1);
  for(const s of stars) assert.equal(totalOwnedCopies(p,s.entranceId),0,`${s.id} Entrance must remain a booster chase`);
  for(const id of ['momentum-strength','momentum-strike','momentum-technical','momentum-agility']) assert.equal(totalOwnedCopies(p,id),15,id);
  const c=collectionCards.find(x=>x.kind==='move'&&!x.superstarId); assert.ok(c);
  p.ownedCards[c.id]={normal:5,foil:0}; addOwnedCard(p,c.id,{foil:true});
  assert.deepEqual(p.ownedCards[c.id],{normal:5,foil:1});
  assert.equal(boosterEligible(collectionCards.find(x=>x.id===stars.find(s=>s.setId==='summerslam-series-1').entranceId)),true);
});

test("later locked native sequences are present whenever their set is active",()=>{
  const roman=starById.get('roman-reigns'); if(roman) assert.ok(roman.entrance.rulesText.includes('Turn 6'));
  if(starById.has('stone-cold-steve-austin')){
    assert.ok(byName('Kick to the Gut').rulesText.includes('immediately following'));
    assert.equal(byName('Stone Cold Stunner').damage,17);
    assert.deepEqual(byName('Stone Cold Stunner').requirements,{});
    const boot=byName('Hogan’s Big Boot'); assert.equal(boot.superstarId,'hulk-hogan'); assert.equal(boot.groundOpponent,true); assert.equal(boot.effects[0].name,'Atomic Leg Drop');
    const leg=byName('Atomic Leg Drop'); assert.equal(leg.groundedOnly,true); assert.equal('pinBonus' in leg,false);
    const press=allGameplayCards.find(c=>c.superstarId==='ultimate-warrior'&&c.name==="Warrior's Gorilla Press Slam"); assert.equal(press.effects[0].name,'Warrior Splash'); assert.equal(press.groundOpponent,true);
    const splash=byName('Warrior Splash'); assert.equal(splash.groundedOnly,true); assert.equal('pinBonus' in splash,false);
  }
  if(starById.has('the-rock')){
    assert.equal(byName('Rock Bottom').effects.find(e=>e.type==='search').discount,2);
    assert.equal('pinBonus' in byName("People's Elbow"),false);
    assert.equal(byName("People's Elbow").damage,18);
    assert.equal(byName("People's Elbow").cost,11);
  }
});

test("engine completes a deterministic cycle of roster matchups without stalling",()=>{
  for(let i=0;i<stars.length;i++){
    const a=stars[i],b=stars[(i+1)%stars.length]; const g=new MatchEngine({p1:a,p2:b,decks,rng:rng(100+i)});
    let steps=0; while(g.state().phase!=='MATCH_OVER'&&steps++<1200){const pid=decisionOwner(g.state());const d=cpuDecision(g,pid);assert.ok(executeCpuDecision(g,d,pid),`${a.id} vs ${b.id} ${g.state().phase}`);}
    assert.equal(g.state().phase,'MATCH_OVER',`${a.id} vs ${b.id}`);
  }
});


test("0 HP does not cause an automatic knockout and Critical Exhaustion passes Control",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(991)});
  const s=g.state();
  s.playerInControl='p1'; s.phase='POST_MOVE'; s.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  s.players.p1.hp=0;
  assert.equal(g.endPostMove('p1'),true);
  assert.notEqual(s.phase,'MATCH_OVER');
  assert.equal(s.playerInControl,'p2');
  assert.equal(s.finish,null);
  assert.ok(s.log.some(e=>e.type==='CRITICAL_EXHAUSTION'&&e.playerId==='p1'));
});



test("Momentum refreshes after a connected Move, not after triggered Actions or utility within the same turn",()=>{
  const p1=starById.get('roman-reigns') ?? stars[0], p2=starById.get('andre-the-giant') ?? stars[1];
  const g=new MatchEngine({p1,p2,decks,rng:rng(1162)}), s=g.state(), p=s.players.p1;
  const momentumA=allGameplayCards.find(c=>c.kind==='momentum'&&c.method==='strike');
  const momentumB={...momentumA,id:`${momentumA.id}-test-copy`};
  const move=byName('Shoulder Tackle') ?? allGameplayCards.find(c=>c.kind==='move'&&!c.defensiveOnly&&!c.groundedOnly);
  assert.ok(momentumA&&move);
  s.playerInControl='p1'; s.phase='ACTION';
  p.hand=[momentumA,momentumB,move];
  p.momentum.strength=10; p.momentum.strike=10; p.momentum.technical=10; p.momentum.agility=10;
  const startTurn=s.turnNumber;
  assert.equal(canPlayMomentum(s,'p1',momentumA),true);
  assert.equal(g.playMomentum('p1',momentumA),true);
  assert.equal(canPlayMomentum(s,'p1',momentumB),false,'second Momentum cannot be played before a Move');

  // Triggered Actions/utility do not create a fresh Momentum window.
  const testSpecial={id:'test-special',name:'Test Triggered Action',kind:'action',special:{type:'test-special'}};
  p.hand.push(testSpecial);
  assert.ok(g._consumeSpecial('p1','test-special'));
  assert.equal(canPlayMomentum(s,'p1',momentumB),false,'Triggered Action must not refresh Momentum');
  p.specialUsed=false;

  assert.equal(g.declareMove('p1',move),true);
  if(s.phase==='COUNTER') assert.equal(g.passCounter('p2'),true);
  assert.equal(s.phase,'ACTION');
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.turnNumber,startTurn+1,'connected Move advances the turn while Control is retained');
  assert.equal(canPlayMomentum(s,'p1',momentumB),true,'new Move cycle immediately refreshes Momentum');
  assert.equal(g.playMomentum('p1',momentumB),true);
});
test("offensive Counter attacks normally resolve immediately instead of recursively chaining",()=>{
  const boot=byName('Big Boot'), shortArm=byName('Short-Arm Clothesline'), enzuigiri=byName('Enzuigiri');
  if(!(boot&&shortArm&&enzuigiri)) return;
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(992)}); const s=g.state();
  s.playerInControl='p1'; s.phase='ACTION';
  s.players.p1.hand=[boot,enzuigiri]; s.players.p2.hand=[shortArm];
  s.players.p1.momentum.strike=10; s.players.p2.momentum.strike=10;
  const hp=s.players.p1.hp;
  assert.equal(g.declareMove('p1',boot),true);
  assert.equal(s.phase,'COUNTER'); assert.equal(s.proposedMove.defenderId,'p2');
  assert.equal(g.counter('p2',shortArm),true);
  assert.notEqual(s.phase,'COUNTER','non-exchange reversal should not open another Counter window');
  assert.equal(s.players.p1.hp,Math.max(0,hp-(shortArm.damage??0)));
  assert.equal(s.log.filter(e=>e.type==='COUNTER_ATTACK_DECLARED').length,1);
});


test("Exhibition CPU matchmaking uses every complete roster deck except the selected player and never needs a second owned Superstar",()=>{
  const starter=stars.find(s=>s.id==='cm-punk')?.id ?? stars[0].id;
  const p=createProfile(starter);
  // Public launch matchmaking works even when the player owns only one Superstar.
  p.unlockedSuperstars=[starter];
  assert.equal(p.unlockedSuperstars.length,1);
  const pool=exhibitionOpponentIds(starter);
  const liveStars=stars.filter(s=>isLaunchLiveSetId(s.setId));
  assert.equal(pool.length,liveStars.length-1);
  assert.equal(pool.includes(starter),false);
  assert.ok(pool.every(id=>(decks[id]?.length??0)===60));
  assert.notEqual(randomExhibitionOpponent(starter,()=>0),starter);
  assert.notEqual(randomExhibitionOpponent(starter,()=>0.999999),starter);
});

test("Daily Store rotates SS to HOF to EVO, charges UP, blocks repurchase and grants only the lean secondary identity package",()=>{
  const epoch=new Date('2026-08-13T00:00:00.000Z');
  assert.equal(storeRotation(epoch).setId,'summerslam-series-1');
  assert.equal(storeRotation(new Date(epoch.getTime()+86400000)).setId,'hall-of-fame-series-1');
  assert.equal(storeRotation(new Date(epoch.getTime()+2*86400000)).setId,'evolution-series-1');
  assert.equal(storeRotation(new Date(epoch.getTime()+3*86400000)).setId,'summerslam-series-1');

  const p=createProfile('cm-punk');
  const target=stars.find(s=>s.setId==='summerslam-series-1'&&!hasSuperstar(p,s.id)); assert.ok(target);
  addUniversePoints(p,STORE_SUPERSTAR_PRICE+STORE_BOOSTER_PRICE);
  const before=p.universePoints;
  const buy=purchaseStoreSuperstar(p,target.id,epoch);
  assert.equal(before-buy.balance,STORE_SUPERSTAR_PRICE);
  assert.equal(hasSuperstar(p,target.id),true);
  assert.equal(p.savedDecks[target.id],undefined,'Store unlock does not manufacture a 60-page deck');
  assert.equal(totalOwnedCopies(p,`superstar-${target.id}`),1);
  if(target.entranceId) assert.equal(totalOwnedCopies(p,target.entranceId),0,'Store unlock must not grant the Superstar Entrance');
  const ownedDraft=buildOwnedRecommendedDraft(p,target.id);
  assert.ok(ownedDraft.length>=0&&ownedDraft.length<60,'full recommended build still requires Collection progression');
  const auto=autoFillOwnedDraft(p,target.id,ownedDraft);
  assert.ok(auto.length<=recommendedDeckDraft(target.id).length);
  const exclusive=[...new Map((decks[target.id]??[]).filter(c=>c.superstarId===target.id).map(c=>[c.id,c])).values()];
  const granted=new Set([exclusive.find(c=>c.finisher)?.id,exclusive.find(c=>c.trademark)?.id,exclusive.find(c=>c.kind==='action')?.id].filter(Boolean));
  for(const card of exclusive) assert.equal(totalOwnedCopies(p,card.id),granted.has(card.id)?1:0,`${card.name} follows the one-per-category identity grant`);
  assert.throws(()=>purchaseStoreSuperstar(p,target.id,epoch),/already owned/i);
  const creditsBefore=p.boosterCreditsBySet['summerslam-series-1']??0;
  const packBuy=purchaseStoreBooster(p,'summerslam-series-1',epoch);
  assert.equal(packBuy.price,STORE_BOOSTER_PRICE);
  assert.equal(packBuy.balance,0);
  assert.equal(p.boosterCreditsBySet['summerslam-series-1'],creditsBefore+1);
});

test("Boosters guarantee one under-cap card when possible and convert only excess copies to Universe Points at review",()=>{
  const p=createProfile('cm-punk');
  const setId='summerslam-series-1';
  const eligible=collectionCards.filter(c=>c.setId===setId&&boosterEligible(c));
  for(const c of eligible){ const cap=cardOwnershipCap(c); p.ownedCards[c.id]=cap===5?{normal:cap,foil:cap}:{normal:0,foil:cap}; }
  const target=eligible.find(c=>c.kind==='move'); assert.ok(target);
  p.ownedCards[target.id]={normal:cardOwnershipCap(target),foil:cardOwnershipCap(target)-1};
  p.universePoints=0;
  grantBooster(p,1,setId);
  const pack=openBooster(p,()=>0.314159,setId);
  assert.equal(pack.length,5);
  assert.equal(pack[0].card.id,target.id,'only under-cap card must occupy guaranteed progress slot');
  assert.equal(pack[0].universePointsValue,0);
  const pending=pack.reduce((sum,pull)=>sum+pull.universePointsValue,0);
  for (const pull of pack.slice(1)) assert.equal(pull.universePointsValue,pull.card.rarity);
  assert.equal(p.universePoints,0,'UP is not silently credited during reveal');
  assert.equal(finalizePackUniversePoints(p,pack),pending);
  assert.equal(p.universePoints,pending);
  assert.equal(finalizePackUniversePoints(p,pack),0,'pack review conversion is idempotent');
  assert.equal(p.universePoints,pending);
});

test("Season milestone road now builds The Final Boss across 100 tiers",()=>{
  assert.equal(tierReward(1).kind,'booster');
  assert.equal(tierReward(5).cardId,'the-rock-lay-the-smack-down');
  assert.equal(tierReward(20).cardId,'the-rock-rock-bottom');
  assert.equal(tierReward(35).cardId,'special-the-rock');
  assert.equal(tierReward(40).cardId,'the-rock-rock-bottom');
  assert.equal(tierReward(50).cardId,'the-rock-rock-bottom');
  assert.equal(tierReward(85).cardId,'entrance-the-rock');
  assert.equal(tierReward(100).cardId,'superstar-the-rock');
  assert.equal(tierReward(100).foil,true);
  assert.equal(tierReward(4).kind,'universe-points');
  assert.equal(tierReward(4).amount,100);
  const p=createProfile('cm-punk');
  p.seasons['season-1'].xp=500;
  const reward=claimSeasonTier(p,5);
  assert.equal(reward.cardId,'the-rock-lay-the-smack-down');
  assert.equal(p.ownedCards['the-rock-lay-the-smack-down']?.normal,1);
});

test("A completely maxed five-card booster converts every overflow duplicate at its rarity value, Foil included",()=>{
  const p=createProfile('cm-punk');
  const setId='summerslam-series-1';
  const eligible=collectionCards.filter(c=>c.setId===setId&&boosterEligible(c));
  for(const c of eligible){ const cap=cardOwnershipCap(c); p.ownedCards[c.id]=cap===5?{normal:cap,foil:cap}:{normal:0,foil:cap}; }
  p.universePoints=0;
  grantBooster(p,1,setId);
  const pack=openBooster(p,()=>0.42,setId);
  assert.equal(pack.length,5);
  assert.equal(pack[0].foil,true);
  for (const pull of pack) assert.equal(pull.universePointsValue,pull.card.rarity);
  const expected=pack.reduce((n,pull)=>n+pull.card.rarity,0);
  assert.equal(finalizePackUniversePoints(p,pack),expected);
  assert.equal(p.universePoints,expected);
});

test("canonical collector manifest is gap-free and matches Collection plus Card Art Studio for every active card", async()=>{
  const fs = await import("node:fs");
  const { CARD_NUMBER_MANIFEST, CARD_NUMBER_BY_ID } = await import("../js/data/card-number-manifest.js?v=0.13.72");
  assert.equal(CARD_NUMBER_MANIFEST.length, collectionCards.length);
  assert.equal(new Set(CARD_NUMBER_MANIFEST.map(entry=>entry.id)).size, CARD_NUMBER_MANIFEST.length);
  assert.equal(new Set(CARD_NUMBER_MANIFEST.map(entry=>entry.cardCode)).size, CARD_NUMBER_MANIFEST.length);
  for (const card of collectionCards) {
    const entry = CARD_NUMBER_BY_ID[card.id];
    assert.ok(entry, card.id);
    assert.equal(card.cardNumber, entry.cardNumber, card.id);
    assert.equal(card.cardCode, entry.cardCode, card.id);
    assert.equal(card.setId, entry.setId, card.id);
  }
  const bySet = new Map();
  for (const entry of CARD_NUMBER_MANIFEST) {
    if (!bySet.has(entry.setId)) bySet.set(entry.setId, []);
    bySet.get(entry.setId).push(entry);
  }
  for (const entries of bySet.values()) {
    entries.sort((a,b)=>a.cardNumber-b.cardNumber);
    assert.deepEqual(entries.map(e=>e.cardNumber), Array.from({length:entries.length},(_,i)=>i+1));
  }
  const studioSource = fs.readFileSync(new URL("../js/tools/card-art-studio-data.js", import.meta.url), "utf8");
  const match = studioSource.match(/const STUDIO_CARDS = (\[.*\]);\nconst STUDIO_SUPERSTARS/s);
  assert.ok(match, "generated Studio card dataset is readable");
  const studioCards = JSON.parse(match[1]);
  assert.equal(studioCards.length, collectionCards.length);
  const studioById = new Map(studioCards.map(card=>[card.id,card]));
  for (const card of collectionCards) {
    const studio = studioById.get(card.id);
    assert.ok(studio, `Studio missing ${card.id}`);
    assert.equal(studio.cardCode, card.cardCode, `${card.id} Studio code`);
    assert.equal(studio.cardNumber, card.cardNumber, `${card.id} Studio number`);
    assert.equal(studio.name, card.name, `${card.id} Studio name`);
    assert.equal(studio.setId, card.setId, `${card.id} Studio set`);
  }
  const studioHtml = fs.readFileSync(new URL("../tools/card-art-studio.html", import.meta.url), "utf8");
  assert.ok(studioHtml.indexOf("card-art-studio-data.js") < studioHtml.indexOf("card-art-studio.js"));
  assert.match(studioHtml,/value="survivor-series-series-1"/);
  assert.match(studioHtml,/key survivor">SURVIVOR SERIES/);
  const studioRenderer = fs.readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
  assert.match(studioRenderer,/function drawSurvivorSeries/);
  assert.match(studioRenderer,/survivor-series-wargames-houston-2026\.png/);
  assert.doesNotMatch(studioRenderer,/survivor-series-logo\.svg/);
  assert.match(studioRenderer,/data:image\/png;base64/);
  assert.ok(fs.existsSync(new URL("../assets/branding/survivor-series-series-1/survivor-series-wargames-houston-2026.png", import.meta.url)));
});

test("Liv Morgan uses Jersey Codebreaker as her exclusive Trademark and the superseded generic variant is absent",()=>{
  const jersey=allGameplayCards.find(c=>c.id==='liv-morgan-jersey-codebreaker');
  assert.ok(jersey);
  assert.equal(jersey.name,'Jersey Codebreaker');
  assert.equal(jersey.superstarId,'liv-morgan');
  assert.equal(jersey.trademark,true);
  assert.equal(jersey.cost,5);
  assert.equal(jersey.damage,8);
  assert.deepEqual(jersey.requirements,{strike:2});
  assert.equal(jersey.groundOpponent,true);
  assert.equal(jersey.stun,1);
  const retiredGenericId=['code','breaker'].join(''); const retiredGenericName=['Code','breaker'].join('');
  assert.equal(allGameplayCards.some(c=>c.id===retiredGenericId||c.name===retiredGenericName),false);
  assert.equal(decks['liv-morgan'].filter(c=>c.id===jersey.id).length,4);
  assert.ok(starById.get('liv-morgan').signatures.includes(jersey.id));
  assert.equal(byName('Revenge Tour').special.name,'Jersey Codebreaker');
});


test("Logan Paul RAW Series 1 package is locked, playable and wired to its bespoke mechanics",()=>{
  const logan=starById.get('logan-paul'); assert.ok(logan);
  assert.deepEqual(logan.starterMomentum,{agility:8,strike:4});
  assert.deepEqual(logan.entrance.preMatchMomentum,{agility:1,strength:1});
  assert.equal(logan.entrance.preMatchAdrenaline,1);
  assert.equal(decks['logan-paul'].length,60);
  assert.equal(decks['logan-paul'].filter(c=>c.kind==='momentum'&&c.method==='strength').length,0);
  assert.equal(decks['logan-paul'].filter(c=>c.kind==='momentum'&&c.method==='agility').length,8);
  assert.equal(decks['logan-paul'].filter(c=>c.kind==='momentum'&&c.method==='strike').length,4);
  const fin=byName('Paulverizer'); assert.equal(fin.finisher,true); assert.deepEqual(fin.requirements,{}); assert.equal(fin.damage,13); assert.equal('pinBonus' in fin,false);
  const tm=byName('One Lucky Punch'); assert.equal(tm.trademark,true); assert.equal(tm.superstarId,'logan-paul'); assert.deepEqual(tm.requirements,{strike:2}); assert.equal(tm.cost,6); assert.equal(tm.damage,9);
  const standing=byName('Standing Moonsault'); assert.equal(standing.kickoutRetainControlDraw,1);
  const spring=byName('Springboard Crossbody'); assert.equal(spring.effects[0].type,'drawThenDiscardSelf'); assert.equal(spring.effects[0].ifAfterMethod,'strike');
  const asai=byName('Asai Moonsault'); assert.equal(asai.selfStunIfCountered,1); assert.equal(asai.groundedOnly,false);
  const splash=byName('450 Splash'); assert.equal(splash.selfStunIfCountered,1); assert.equal(splash.damage,11); assert.equal('pinBonus' in splash,false);

  const opponent=stars.find(s=>s.id!=='logan-paul');
  const g=new MatchEngine({p1:logan,p2:opponent,decks,rng:rng(1201)}),st=g.state();
  assert.equal(st.players.p1.momentum.agility,1); assert.equal(st.players.p1.momentum.strength,1); assert.equal(st.players.p1.adrenaline,1);
  const punch=byName('Punch'); st.players.p1.hand=[punch, allGameplayCards.find(c=>c.id==='special-logan-paul')]; st.players.p1.momentum.strike=5; st.players.p1.momentum.agility=5;
  st.phase='ACTION'; st.playerInControl='p1';
  assert.equal(g.declareMove('p1',punch),true); if(st.phase==='COUNTER') g.passCounter('p2');
  assert.equal(st.players.p1.momentum.strength,2,'first connected Strike adds Viral Athlete Strength to the Entrance Strength');
  const special=st.players.p1.hand.find(c=>c.id==='special-logan-paul'); assert.ok(special); const hp=st.players.p2.hp;
  assert.equal(g.playSpecial('p1',special),true); assert.equal(st.players.p2.hp,Math.max(0,hp-2)); assert.equal(st.playerInControl,'p2');
});

test("RAW aerial mechanics honor Standing Moonsault’s printed kickout exception and Springboard Crossbody rewards a prior Strike",()=>{
  const standing=byName('Standing Moonsault'), spring=byName('Springboard Crossbody'), punch=byName('Punch');
  const logan=starById.get('logan-paul'), opp=stars.find(s=>s.id!=='logan-paul');
  const g=new MatchEngine({p1:logan,p2:opp,decks,rng:()=>0.999}), s=g.state();
  s.playerInControl='p1'; s.phase='PIN_RESPONSE'; s.postMove={attackerId:'p1',defenderId:'p2',cardId:standing.id};
  s.proposedPin={attackerId:'p1',defenderId:'p2'}; s.players.p1.discard.push(standing);
  const handBefore=s.players.p1.hand.length;
  assert.equal(g.passPinResponse('p2'),true);
  assert.equal(s.playerInControl,'p1'); assert.equal(s.phase,'ACTION'); assert.equal(s.players.p1.hand.length,handBefore+2,'turn advance plus Standing Moonsault’s printed extra draw'); assert.ok(s.players.p2.hand.length>=1);

  const neutral=starById.get('alexa-bliss');
  const g2=new MatchEngine({p1:neutral,p2:opp,decks,rng:rng(1302)}), q=g2.state();
  q.playerInControl='p1'; q.phase='ACTION'; q.players.p1.hand=[punch,spring]; q.players.p2.hand=[];
  q.players.p1.momentum.strike=5; q.players.p1.momentum.agility=5;
  assert.equal(g2.declareMove('p1',punch),true); assert.equal(g2.passCounter('p2'),true); assert.equal(q.phase,'ACTION');
  assert.equal(g2.declareMove('p1',spring),true); assert.equal(g2.passCounter('p2'),true);
  assert.equal(q.players.p1.hand.length,1,'Springboard reward resolves, but retained-Control no longer gives the attacker an automatic replacement draw');
});


test("Sol Ruca RAW Series 1 package is locked, playable and wired to counter/high-risk mechanics",()=>{
  const sol=starById.get('sol-ruca'); assert.ok(sol);
  assert.equal(sol.hp,58);
  assert.deepEqual(sol.starterMomentum,{agility:8,technical:2,strength:2});
  assert.deepEqual(sol.methodLimits,{agility:null,strength:2,strike:1,technical:2});
  assert.deepEqual(sol.entrance.preMatchMomentum,{agility:1,technical:1}); assert.equal(sol.entrance.preMatchAdrenaline,1);
  assert.equal(decks['sol-ruca'].length,60);
  assert.equal(decks['sol-ruca'].filter(c=>c.kind==='momentum'&&c.method==='agility').length,8);
  assert.equal(decks['sol-ruca'].filter(c=>c.kind==='momentum'&&c.method==='technical').length,2);
  assert.equal(decks['sol-ruca'].filter(c=>c.kind==='momentum'&&c.method==='strength').length,2);
  assert.equal(decks['sol-ruca'].filter(c=>c.id==='special-sol-ruca').length,1);
  const stf=byName('STF'); assert.deepEqual(stf.requirements,{technical:2}); assert.equal(stf.submission.pressure,4);
  const tm=byName('Avalanche X-Factor'); assert.equal(tm.trademark,true); assert.equal(tm.superstarId,'sol-ruca'); assert.deepEqual(tm.priorConnectedMethodBonus,{method:'agility',damage:2});
  const fin=byName('Sol Snatcher'); assert.equal(fin.finisher,true); assert.deepEqual(fin.requirements,{}); assert.equal('pinBonus' in fin,false); assert.equal(fin.discountAfterCounter,2);
  const rawCodes=['RAW1-012','RAW1-013','RAW1-014','RAW1-015','RAW1-016','RAW1-017'];
  for(const code of rawCodes) assert.ok(collectionCards.some(c=>c.cardCode===code),code);

  const opp=stars.find(s=>s.id!=='sol-ruca');
  const g=new MatchEngine({p1:sol,p2:opp,decks,rng:rng(1401)}),s=g.state();
  assert.equal(s.players.p1.momentum.agility,1); assert.equal(s.players.p1.adrenaline,1);
  // Successful defensive Counter triggers Daredevil Instincts draw and enables the Sol Snatcher sequence discount.
  const incoming=byName('Springboard Crossbody'), sidestep=byName('Sidestep'), finisher=byName('Sol Snatcher');
  s.phase='COUNTER'; s.playerInControl='p2'; s.proposedMove={attackerId:'p2',defenderId:'p1',card:incoming};
  s.players.p1.hand=[sidestep,finisher]; s.players.p1.momentum.agility=10; s.players.p1.momentum.strength=10; s.players.p1.momentum.technical=10; s.players.p1.momentum.strike=10;
  const before=s.players.p1.hand.length; assert.equal(g.counter('p1',sidestep),true);
  assert.equal(s.players.p1.abilityUses,1); assert.ok(s.players.p1.hand.length>=before,'counter ability draws 1 before Counter is discarded');
  assert.equal(s.players.p1.events.counteredThisControl,true);
  const eligible=moveEligibility(s,'p1',finisher); assert.equal(eligible.legal,true); assert.equal(eligible.effectiveCost,7,'Sol Snatcher costs 2 less after a successful Counter in this Control sequence');
});

test("No Wipeout prevents self-Stun when Sol's high-risk Agility Move is Countered",()=>{
  const sol=starById.get('sol-ruca'), opp=stars.find(s=>s.id!=='sol-ruca');
  const g=new MatchEngine({p1:sol,p2:opp,decks,rng:rng(1402)}),s=g.state();
  const splash=byName('450 Splash'), sidestep=byName('Sidestep'), special=allGameplayCards.find(c=>c.id==='special-sol-ruca');
  s.playerInControl='p1'; s.phase='COUNTER'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:splash};
  s.players.p1.hand=[special]; s.players.p1.deck=[byName('Dropkick')]; s.players.p2.hand=[sidestep]; s.players.p2.momentum.agility=5;
  assert.equal(g.counter('p2',sidestep),true);
  assert.equal(s.players.p1.stun,0); assert.equal(s.players.p1.specialUsed,true);
  assert.ok(s.players.p1.hand.some(c=>c.name==='Dropkick'),'No Wipeout draws 1 page');
});


test("Chad Gable RAW Series 1 package is locked, playable and wired to Olympic Pedigree / Shoosh",()=>{
  const chad=starById.get('chad-gable'); assert.ok(chad);
  assert.equal(chad.hp,64); assert.equal(chad.methodLimits.technical,null); assert.equal(chad.methodLimits.strength,4); assert.equal(chad.methodLimits.agility,2); assert.equal(chad.methodLimits.strike,0);
  assert.equal(decks['chad-gable'].length,60);
  assert.equal(decks['chad-gable'].filter(c=>c.kind==='momentum'&&c.method==='technical').length,7);
  assert.equal(decks['chad-gable'].filter(c=>c.kind==='momentum'&&c.method==='strength').length,5);
  assert.equal(decks['chad-gable'].filter(c=>c.kind==='momentum'&&c.method==='agility').length,0);
  const tm=byName('Chaos Theory'); assert.equal(tm.trademark,true); assert.equal(tm.superstarId,'chad-gable'); assert.equal('pinBonus' in tm,false); assert.equal(tm.kickoutRetainControl,true);
  const fin=byName('Ankle Lock'); assert.equal(fin.finisher,true); assert.deepEqual(fin.requirements,{}); assert.equal(fin.submission.pressure,6); assert.equal(fin.groundedOnly,true);
  assert.equal(CARD_NUMBER_BY_ID['chad-gable-chaos-theory']?.cardCode,'RAW1-018'); assert.equal(CARD_NUMBER_BY_ID['superstar-chad-gable']?.cardCode,'RAW1-022');
  const opp=stars.find(s=>s.id!=='chad-gable');
  const e=new MatchEngine({p1:chad,p2:opp,decks,rng:()=>0.99}); const st=e.state();
  assert.equal(st.players.p1.momentum.technical,1); assert.equal(st.players.p1.momentum.agility,1); assert.equal(st.players.p1.adrenaline,1);
  const tech=byName('Double Leg Takedown'); st.players.p1.hand=[tech]; st.players.p1.momentum.technical=5; st.players.p1.momentum.strength=5; assert.equal(e.declareMove('p1',tech),true); e.passCounter('p2'); assert.equal(st.players.p1.momentum.agility,2);
  e.endPostMove('p1');
});




test("starting HP roster uses the locked durability spread",()=>{
  const expected = {"iyo-sky":57,"mankind":67,"the-rock":67,"hulk-hogan":69,"bayley":63,"cm-punk":64,"paige":64,"seth-rollins":64,"andre-the-giant":72,"stephanie-vaquer":63,"randy-savage":64,"roman-reigns":67,"charlotte-flair":65,"kevin-owens":66,"kane":69,"the-undertaker":68,"ultimate-warrior":68,"rhea-ripley":66,"cody-rhodes":64,"oba-femi":68,"stone-cold-steve-austin":66,"liv-morgan":64,"brock-lesnar":70,"gunther":68,"becky-lynch":64,"logan-paul":62,"sol-ruca":58,"chad-gable":64,"raquel-rodriguez":65,"rey-mysterio":57,"dominik-mysterio":61,"penta":65,"el-grande-americano":64,"jey-uso":64,"la-knight":64,"alexa-bliss":62,"finn-balor":64,"danhausen":61,"tiffany-stratton":62,"chelsea-green":61,"damian-priest":66,"bron-breakker":68,"drew-mcintyre":68,"randy-orton":65,"sami-zayn":64,"jacob-fatu":68,"solo-sikoa":66,"jade-cargill":67,"nia-jax":69,"goldberg":69};
  for (const [id,hp] of Object.entries(expected)) assert.equal(starById.get(id)?.hp,hp,`${id} starting HP`);
  const values=[...new Set(stars.map(s=>s.hp))].sort((a,b)=>a-b);
  assert.deepEqual(values,[57,58,59,60,61,62,63,64,65,66,67,68,69,70,72]);
  assert.equal(starById.get('andre-the-giant').hp,Math.max(...stars.map(s=>s.hp)),'André is the unique HP ceiling');
});

test("Raquel Rodriguez RAW Series 1 package is locked, playable, and all four RAW decks are exactly 60 pages",()=>{
  const raquel=starById.get('raquel-rodriguez'); assert.ok(raquel);
  assert.equal(raquel.hp,65); assert.equal(raquel.methodLimits.strength,null); assert.equal(raquel.methodLimits.strike,3); assert.equal(raquel.methodLimits.agility,1); assert.equal(raquel.methodLimits.technical,0);
  for(const sid of ['logan-paul','sol-ruca','chad-gable','raquel-rodriguez']){
    assert.equal(decks[sid].length,60,`${sid} must have exactly 60 pages`);
    assert.equal(decks[sid].filter(c=>c.kind==='momentum').length,12,`${sid} must have exactly 12 Momentum`);
  }
  assert.equal(decks['raquel-rodriguez'].filter(c=>c.kind==='momentum'&&c.method==='strength').length,8);
  assert.equal(decks['raquel-rodriguez'].filter(c=>c.kind==='momentum'&&c.method==='strike').length,4);
  assert.equal(decks['raquel-rodriguez'].filter(c=>c.kind==='momentum'&&c.method==='agility').length,0);
  const tm=byName('Corkscrew Splash'); assert.equal(tm.trademark,true); assert.equal(tm.superstarId,'raquel-rodriguez'); assert.deepEqual(tm.requirements,{strength:2,agility:1}); assert.equal(tm.damage,11); assert.equal('pinBonus' in tm,false); assert.equal(tm.selfStunIfCountered,1);
  const fin=byName('Tejana Bomb'); assert.equal(fin.finisher,true); assert.deepEqual(fin.requirements,{}); assert.equal('pinBonus' in fin,false); assert.equal(fin.damage,13);
  assert.equal(CARD_NUMBER_BY_ID['raquel-rodriguez-corkscrew-splash']?.cardCode,'RAW1-023'); assert.equal(CARD_NUMBER_BY_ID['superstar-raquel-rodriguez']?.cardCode,'RAW1-027');
  const opp=stars.find(s=>s.id!=='raquel-rodriguez');
  const e=new MatchEngine({p1:raquel,p2:opp,decks,rng:()=>0.99}); const st=e.state();
  assert.equal(st.players.p1.momentum.strength,1); assert.equal(st.players.p1.momentum.agility,1); assert.equal(st.players.p1.adrenaline,0);
  const run=byName('Running Powerslam'); st.players.p1.hand=[run]; st.players.p1.momentum.strength=5; st.players.p2.hand=[]; const hp=st.players.p2.hp; assert.equal(e.declareMove('p1',run),true); e.passCounter('p2'); assert.equal(hp-st.players.p2.hp,9,'Unmatched Power adds +1 to the first qualifying Strength move');
  const e2=new MatchEngine({p1:opp,p2:raquel,decks,rng:()=>0.99}); const s2=e2.state();
  const big=byName('Running Powerslam'), backup=allGameplayCards.find(c=>c.id==='special-raquel-rodriguez');
  s2.playerInControl='p1'; s2.phase='ACTION'; s2.players.p1.hand=[big]; s2.players.p1.momentum.strength=5; s2.players.p1.adrenaline=3; s2.players.p1.momentum.attitude=3; s2.players.p2.hand=[backup]; const rhp=s2.players.p2.hp;
  assert.equal(e2.declareMove('p1',big),true); e2.passCounter('p2'); assert.equal(rhp-s2.players.p2.hp,7,'Judgment Day Backup reduces 8 damage to 7'); assert.equal(s2.players.p2.specialUsed,true); assert.equal(s2.players.p1.adrenaline,4,'Judgment Day Backup no longer drains attacker Adrenaline; only the normal connect gain applies');
});


test("Rey Mysterio Worlds Collide Series 1 package is locked, family-gated and playable",()=>{
  const rey=starById.get('rey-mysterio'); assert.ok(rey);
  assert.equal(rey.hp,57);
  assert.deepEqual(rey.methodLimits,{agility:null,strength:0,strike:2,technical:3});
  assert.deepEqual(rey.starterMomentum,{agility:8,technical:2,strike:2});
  assert.equal(decks['rey-mysterio'].length,60);
  assert.equal(decks['rey-mysterio'].filter(c=>c.kind==='momentum').length,12);
  assert.equal(decks['rey-mysterio'].filter(c=>c.id==='619').length,3);
  assert.equal(decks['rey-mysterio'].filter(c=>c.id==='shoulder-up').length,2,'60-page correction preserves the locked deck by adding a second Shoulder Up');
  const six=allGameplayCards.find(c=>c.id==='619'); assert.ok(six);
  assert.deepEqual(six.allowedSuperstarIds,['rey-mysterio','dominik-mysterio']);
  assert.equal(six.superstarId,null); assert.equal(six.stun,1); assert.equal(six.groundedOnly,true);
  const pop=allGameplayCards.find(c=>c.id==='rey-mysterio-west-coast-pop'); assert.equal(pop.finisher,true); assert.deepEqual(pop.requirements,{}); assert.equal('pinBonus' in pop,false); assert.equal(pop.damage,15); assert.deepEqual(pop.bonusDamageAfterNamed,{name:'619',damage:1});
  const mex=allGameplayCards.find(c=>c.id==='rey-mysterio-mysterio-express'); assert.equal(mex.trademark,true); assert.equal(mex.kickoutRetainControl,true); assert.equal('pinBonus' in mex,false);
  const tilt=allGameplayCards.find(c=>c.id==='tilt-a-whirl-headscissors'); assert.ok(tilt.counters.includes('grapple')); assert.equal(tilt.drawOnCounter,1);
  assert.equal(CARD_NUMBER_BY_ID['tilt-a-whirl-headscissors']?.cardCode,'WC1-001');
  assert.equal(CARD_NUMBER_BY_ID['619']?.cardCode,'WC1-002');
  assert.equal(CARD_NUMBER_BY_ID['superstar-rey-mysterio']?.cardCode,'WC1-007');
  assert.equal(CARD_NUMBER_BY_ID['drop-toe-hold']?.cardCode,'WC1-008');
  const nonFamily=stars.find(s=>!['rey-mysterio','dominik-mysterio'].includes(s.id));
  const bad=new MatchEngine({p1:nonFamily,p2:rey,decks,rng:rng(1601)}),bs=bad.state(); bs.playerInControl='p1';bs.phase='ACTION';bs.players.p1.hand=[six];bs.players.p1.momentum.agility=10;bs.players.p1.momentum.strike=10;bs.players.p1.momentum.technical=10;bs.players.p1.momentum.strength=10;bs.players.p2.posture='on-mat';assert.equal(moveEligibility(bs,'p1',six).legal,false);
  const opp=stars.find(s=>s.id!=='rey-mysterio');
  const g=new MatchEngine({p1:rey,p2:opp,decks,rng:rng(1602)}),st=g.state();
  assert.equal(st.players.p1.momentum.agility,1); assert.equal(st.players.p1.adrenaline,1);
  st.playerInControl='p1';st.phase='ACTION';st.players.p2.posture='on-mat';st.players.p1.hand=[six];st.players.p1.deck.unshift(pop);st.players.p1.momentum.agility=10;st.players.p1.momentum.strike=10;
  assert.equal(g.declareMove('p1',six),true); if(st.phase==='COUNTER')g.passCounter('p2');
  assert.ok(st.players.p1.hand.some(c=>c.id===pop.id),'Rey 619 searches West Coast Pop');
  const searched=st.players.p1.hand.find(c=>c.id===pop.id); g.endPostMove('p1');
  assert.equal(moveEligibility(st,'p1',searched).effectiveCost,8,'searched West Coast Pop costs 1 less');
  st.players.p2.posture='on-mat'; const hpBeforePop=st.players.p2.hp; assert.equal(g.declareMove('p1',searched),true); if(st.phase==='COUNTER')g.passCounter('p2'); assert.equal(st.players.p2.hp,Math.max(0,hpBeforePop-16),'West Coast Pop gets +1 Damage immediately after 619');
});

test("Rey Ultimate Underdog and Lucha Libre Legend mechanics execute",()=>{
  const rey=starById.get('rey-mysterio'),opp=stars.find(s=>s.id!=='rey-mysterio');
  const g=new MatchEngine({p1:rey,p2:opp,decks,rng:()=>0.999}),s=g.state();
  s.phase='PIN_RESPONSE';s.playerInControl='p2';s.postMove={attackerId:'p2',defenderId:'p1',cardId:null};s.proposedPin={attackerId:'p2',defenderId:'p1'};s.players.p1.deck=[byName('Dropkick'),byName('Arm Drag')];const before=s.players.p1.hand.length;assert.equal(g.passPinResponse('p1'),true);assert.equal(s.players.p1.abilityUses,1);assert.equal(s.players.p1.adrenaline,2,'Entrance + first kickout = 2 Adrenaline');assert.ok(s.players.p1.hand.length>=before+2,'kickout ability draw plus normal control draw');
  const g2=new MatchEngine({p1:opp,p2:rey,decks,rng:rng(1603)}),q=g2.state();const incoming=byName('Powerbomb'),tilt=allGameplayCards.find(c=>c.id==='tilt-a-whirl-headscissors'),special=allGameplayCards.find(c=>c.id==='special-rey-mysterio');q.phase='COUNTER';q.playerInControl='p1';q.proposedMove={attackerId:'p1',defenderId:'p2',card:incoming};q.players.p2.hand=[tilt,special];q.players.p2.deck=[byName('Dropkick')];q.players.p2.momentum.agility=10;q.players.p2.momentum.technical=10;const hp2=q.players.p1.hp;assert.equal(g2.counter('p2',tilt),true);assert.equal(q.players.p2.specialUsed,true);assert.equal(q.players.p1.hp,Math.max(0,hp2-(tilt.damage??0)-2),'Lucha Libre Legend bonus is applied when the terminal counter-attack connects');assert.ok(q.players.p2.hand.some(c=>c.name==='Dropkick'),'Tilt-a-Whirl counter draws 1 page');
});


test("Dominik Mysterio Worlds Collide package is locked and playable",()=>{
  const dom=starById.get('dominik-mysterio'); assert.ok(dom);
  assert.equal(dom.hp,61); assert.deepEqual(dom.starterMomentum,{agility:7,strike:3,technical:2});
  assert.equal(decks['dominik-mysterio'].length,60);
  assert.equal(decks['dominik-mysterio'].filter(c=>c.kind==='momentum').length,12);
  assert.equal(decks['dominik-mysterio'].filter(c=>c.id==='momentum-strength').length,0);
  assert.equal(decks['dominik-mysterio'].filter(c=>c.id==='619').length,3);
  assert.equal(decks['dominik-mysterio'].filter(c=>c.id==='dominik-mysterio-frog-splash').length,3);
  const six=allGameplayCards.find(c=>c.id==='619');
  assert.deepEqual(six.allowedSuperstarIds,['rey-mysterio','dominik-mysterio']);
  assert.ok(six.effects.some(e=>e.name==='Dominik’s Frog Splash'&&e.discount===1&&e.ifSuperstarIds?.includes('dominik-mysterio')));
  const fin=allGameplayCards.find(c=>c.id==='dominik-mysterio-frog-splash');
  assert.equal(fin.finisher,true); assert.equal(fin.cost,9); assert.equal(fin.damage,15); assert.deepEqual(fin.requirements,{}); assert.equal('pinBonus' in fin,false); assert.deepEqual(fin.bonusDamageAfterNamed,{name:'619',damage:1});
  assert.equal(CARD_NUMBER_BY_ID['low-blow']?.cardCode,'WC1-009');
  assert.equal(CARD_NUMBER_BY_ID['three-amigos']?.cardCode,'WC1-010');
  assert.equal(CARD_NUMBER_BY_ID['dominik-mysterio-frog-splash']?.cardCode,'WC1-011');
  assert.equal(CARD_NUMBER_BY_ID['superstar-dominik-mysterio']?.cardCode,'WC1-014');
  const opp=stars.find(s=>!['rey-mysterio','dominik-mysterio'].includes(s.id));
  const g=new MatchEngine({p1:dom,p2:opp,decks,rng:rng(1801)}),q=g.state();
  assert.equal(q.players.p1.momentum.agility,1); assert.equal(q.players.p1.momentum.strength,1); assert.equal(q.players.p1.momentum.technical,1); assert.equal(q.players.p1.adrenaline,1);
  const sixCard=allGameplayCards.find(c=>c.id==='619'),finCard=fin; q.players.p1.hand=[sixCard]; q.players.p1.deck=[finCard]; q.players.p1.momentum.agility=10;q.players.p1.momentum.strike=10;q.players.p1.adrenaline=20;q.players.p2.posture='on-mat';
  assert.equal(g.declareMove('p1',sixCard),true); g.passCounter('p2');
  assert.ok(q.players.p1.hand.some(c=>c.id==='dominik-mysterio-frog-splash')); assert.equal(q.players.p1.namedDiscount['Dominik’s Frog Splash'],1);
});

test("Penta Worlds Collide package is locked and playable",()=>{
  const penta=starById.get('penta'); assert.ok(penta);
  assert.equal(penta.hp,65); assert.deepEqual(penta.starterMomentum,{agility:6,strike:4,technical:2});
  assert.equal(decks.penta.length,60); assert.equal(decks.penta.filter(c=>c.kind==='momentum').length,12); assert.equal(decks.penta.filter(c=>c.id==='momentum-strength').length,0);
  assert.equal(decks.penta.filter(c=>c.id==='penta-mexican-destroyer').length,3); assert.equal(decks.penta.filter(c=>c.id==='special-penta').length,1);
  const back=allGameplayCards.find(c=>c.id==='backstabber'),tope=allGameplayCards.find(c=>c.id==='tope-con-hilo'),sac=allGameplayCards.find(c=>c.id==='penta-the-sacrifice'),driver=allGameplayCards.find(c=>c.id==='penta-driver'),fin=allGameplayCards.find(c=>c.id==='penta-mexican-destroyer'),sp=allGameplayCards.find(c=>c.id==='special-penta');
  assert.ok(back.counters.includes('aerial')); assert.equal(back.counterBonusDamage,2); assert.equal(tope.selfStunIfCountered,1);
  assert.equal(driver.trademark,true); assert.equal(fin.finisher,true); assert.equal(fin.damage,16); assert.deepEqual(fin.requirements,{}); assert.equal('pinBonus' in fin,false); assert.equal(sp.name,'Fearless Assault');
  assert.equal(CARD_NUMBER_BY_ID.backstabber.cardCode,'WC1-015'); assert.equal(CARD_NUMBER_BY_ID['superstar-penta'].cardCode,'WC1-022');
  const opp=stars.find(s=>s.id!=='penta'); const g=new MatchEngine({p1:penta,p2:opp,decks,rng:rng(1901)}),q=g.state();
  assert.equal(q.players.p1.momentum.agility,1); assert.equal(q.players.p1.momentum.strength,1); assert.equal(q.players.p1.adrenaline,1);
  q.playerInControl='p1';q.phase='ACTION';q.players.p1.hand=[sac];q.players.p1.deck=[driver];q.players.p1.momentum.technical=10;q.players.p1.momentum.strength=10;q.players.p1.adrenaline=20;
  assert.equal(g.declareMove('p1',sac),true); if(q.phase==='COUNTER')g.passCounter('p2'); assert.ok(q.players.p1.hand.some(c=>c.id==='penta-driver')); assert.equal(q.players.p1.namedDiscount['Penta Driver'],1);
  g.endPostMove('p1');
  const agility=allGameplayCards.find(c=>c.id==='dropkick'),strike=allGameplayCards.find(c=>c.id==='superkick'); q.players.p1.hand=[agility,sp,strike];q.players.p1.momentum.agility=10;q.players.p1.momentum.strike=10;q.players.p1.adrenaline=20;q.players.p2.posture='standing';
  assert.equal(g.declareMove('p1',agility),true); if(q.phase==='COUNTER')g.passCounter('p2'); assert.equal(q.players.p1.specialUsed,true); g.endPostMove('p1'); assert.equal(moveEligibility(q,'p1',strike).effectiveCost,Math.max(0,strike.cost-2));
});



test("El Grande Americano completes Worlds Collide Series 1 and is fully playable",()=>{
  const ega=starById.get('el-grande-americano'); assert.ok(ega);
  assert.equal(ega.hp,64);
  assert.deepEqual(ega.methodLimits,{agility:3,strength:4,strike:3,technical:null});
  assert.deepEqual(ega.starterMomentum,{technical:4,strength:3,agility:3,strike:2});
  assert.deepEqual(ega.leadOffIds,['momentum-technical','momentum-strike','headbutt','german-suplex','dropkick']);
  assert.equal(decks['el-grande-americano'].length,60);
  assert.equal(decks['el-grande-americano'].filter(c=>c.kind==='momentum').length,12);
  assert.equal(decks['el-grande-americano'].filter(c=>c.id==='el-grande-americano-loaded-mask-headbutt').length,3);
  assert.equal(decks['el-grande-americano'].filter(c=>c.id==='special-el-grande-americano').length,1);
  const jump=allGameplayCards.find(c=>c.id==='el-grande-americano-jumping-headbutt');
  const fin=allGameplayCards.find(c=>c.id==='el-grande-americano-loaded-mask-headbutt');
  const sp=allGameplayCards.find(c=>c.id==='special-el-grande-americano');
  assert.equal(jump.trademark,true); assert.equal(jump.damage,11); assert.equal(jump.stun,1); assert.equal('pinBonus' in jump,false); assert.deepEqual(jump.requirements,{strike:2,agility:1});
  assert.equal(fin.finisher,true); assert.equal(fin.cost,9); assert.equal(fin.damage,16); assert.deepEqual(fin.requirements,{}); assert.equal(fin.stun,1); assert.equal('pinBonus' in fin,false);
  assert.equal(sp.name,'Steel Plate');
  assert.equal(CARD_NUMBER_BY_ID['el-grande-americano-jumping-headbutt']?.cardCode,'WC1-023');
  assert.equal(CARD_NUMBER_BY_ID['el-grande-americano-loaded-mask-headbutt']?.cardCode,'WC1-024');
  assert.equal(CARD_NUMBER_BY_ID['entrance-el-grande-americano']?.cardCode,'WC1-025');
  assert.equal(CARD_NUMBER_BY_ID['special-el-grande-americano']?.cardCode,'WC1-026');
  assert.equal(CARD_NUMBER_BY_ID['superstar-el-grande-americano']?.cardCode,'WC1-027');

  const opp=stars.find(s=>s.id!=='el-grande-americano');
  const g=new MatchEngine({p1:ega,p2:opp,decks,rng:rng(2001)}),q=g.state();
  assert.equal(q.players.p1.momentum.technical,1); assert.equal(q.players.p1.adrenaline,1);
  const head=byName('Headbutt'), drop=byName('Dropkick');
  q.playerInControl='p1';q.phase='ACTION';q.players.p1.hand=[head,sp,drop];q.players.p1.deck=[fin,byName('Arm Drag'),byName('Duck')];
  q.players.p1.momentum.strike=10;q.players.p1.momentum.agility=10;q.players.p1.momentum.technical=10;q.players.p1.momentum.strength=10;q.players.p1.adrenaline=20;q.players.p2.hand=[];
  assert.equal(g.declareMove('p1',head),true); if(q.phase==='COUNTER')g.passCounter('p2');
  assert.equal(q.players.p1.specialUsed,true); assert.ok(q.players.p1.hand.some(c=>c.id===fin.id),'Steel Plate tutors Loaded Mask Headbutt'); assert.equal(q.players.p1.namedDiscount['Loaded Mask Headbutt'],2);
  assert.equal(q.players.p1.abilityUses,0,'first move in a Control sequence cannot trigger Masked Opportunist');
  g.endPostMove('p1');
  assert.equal(g.declareMove('p1',drop),true); if(q.phase==='COUNTER')g.passCounter('p2');
  assert.equal(q.players.p1.abilityUses,1,'different Method on second connected move triggers Masked Opportunist');
  assert.ok(q.players.p1.adrenaline>=21,'Masked Opportunist gains 1 Adrenaline');
});


test("Momentum is once per turn and refreshes on normal new-turn Control progression",()=>{
  const a=stars[0], b=stars[1];
  const g=new MatchEngine({p1:a,p2:b,decks,rng:rng(1162)});
  const s=g.state();
  const p1Momentum=(decks[a.id]??[]).filter(c=>c.kind==='momentum').slice(0,2);
  assert.equal(p1Momentum.length,2);
  s.players.p1.hand=[...p1Momentum];
  const firstTurn=s.turnNumber;
  assert.equal(g.playMomentum('p1',s.players.p1.hand[0]),true);
  assert.equal(g.playMomentum('p1',s.players.p1.hand[0]),false,'second Momentum in same turn must be blocked');
  assert.equal(g.passTurn('p1'),true);
  assert.equal(s.playerInControl,'p2');
  assert.equal(s.turnNumber,firstTurn+1);
  assert.equal(g.passTurn('p2'),true);
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.turnNumber,firstTurn+2);
  assert.equal(g.playMomentum('p1',s.players.p1.hand[0]),true,'Momentum refreshes when a genuinely new turn begins for p1');
});

test("v0.11.63 Exhibition and match UI source contains the locked cinematic flow and removes the old opponent preview", async()=>{
  const fs=await import('node:fs');
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.ok(ui.includes('TONIGHT’S'));
  assert.ok(ui.includes('MAIN EVENT'));
  assert.ok(ui.includes('YOUR ENTRANCE'));
  assert.ok(ui.includes('OPPONENT ENTRANCE'));
  assert.equal(ui.includes('CPU OPPONENT · RANDOM'),false);
  assert.equal(ui.includes('CPU ownership is not restricted by your collection.'),false);
  assert.ok(ui.includes('data-open-superstar'));
  assert.ok(ui.includes('premium-headshot-hud'));
  assert.ok(css.includes('.ccg-card.type-momentum .ccg-card-art img.momentum-set-logo'));
  assert.ok(css.includes('.hud-hp-number.healthy'));
  assert.ok(css.includes('.hud-resource.adrenaline'));
});

test("turn advancement preserves Control-sequence combo memory until Control actually changes",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(1163)}),s=g.state();
  const p=s.players.p1;
  p.lastConnectedMethod='strike'; p.lastConnectedCardName='Punch'; p.controlMoveCount=2;
  p.events.strikeConnectedThisControl=true; p.events.counteredThisControl=true;
  p.methodDiscount.agility=2; p.namedDiscount['Test Move']=2; p.namedDamageBuff['Test Move']=3;
  p.turn.momentumPlayed=1;
  s.playerInControl='p1'; s.phase='POST_MOVE'; s.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  const beforeTurn=s.turnNumber, beforeSeq=s.controlSequence;
  assert.equal(g.endPostMove('p1'),true);
  assert.equal(s.turnNumber,beforeTurn+1);
  assert.equal(s.controlSequence,beforeSeq,'same wrestler retaining Control stays in the same Control sequence');
  assert.equal(p.turn.momentumPlayed,0,'new Move cycle refreshes Momentum');
  assert.equal(p.lastConnectedMethod,'strike');
  assert.equal(p.controlMoveCount,2);
  assert.equal(p.methodDiscount.agility,2);
  assert.equal(p.namedDiscount['Test Move'],2);
  assert.equal(p.namedDamageBuff['Test Move'],3);
  assert.equal(g.passTurn('p1'),true);
  assert.equal(p.lastConnectedMethod,null,'Control loss clears previous Method memory');
  assert.equal(p.lastConnectedCardName,null);
  assert.equal(p.controlMoveCount,0);
  assert.equal(p.events.strikeConnectedThisControl,false);
  assert.equal(p.events.counteredThisControl,false);
  assert.deepEqual(p.methodDiscount,{});
  assert.deepEqual(p.namedDiscount,{});
  assert.deepEqual(p.namedDamageBuff,{});
});

test("failed pins normally transfer Control unless the connected Move prints a kickout exception",()=>{
  const sol=starById.get('sol-ruca'), opp=stars.find(x=>x.id!=='sol-ruca');
  const g=new MatchEngine({p1:sol,p2:opp,decks,rng:()=>0.99}),s=g.state();
  const ordinary=byName('Powerbomb');
  s.playerInControl='p1'; s.phase='PIN_RESPONSE';
  s.players.p1.discard=[ordinary]; s.players.p1.turn.momentumPlayed=1;
  s.postMove={attackerId:'p1',defenderId:'p2',cardId:ordinary.id};
  s.proposedPin={attackerId:'p1',defenderId:'p2'};
  const beforeTurn=s.turnNumber,beforeSeq=s.controlSequence,beforeHand=s.players.p2.hand.length;
  assert.equal(g.passPinResponse('p2'),true);
  assert.equal(s.playerInControl,'p2');
  assert.equal(s.turnNumber,beforeTurn+1);
  assert.equal(s.controlSequence,beforeSeq+1);
  assert.equal(s.players.p2.turn.momentumPlayed,0);
  assert.equal(s.players.p2.hand.length,beforeHand+1);
});

test("queued Method/name discounts and named damage buffs survive unrelated Moves and are consumed by their matching Move",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(2163)}),s=g.state(),p=s.players.p1;
  const unrelated=byName('Headbutt')??byName('Punch'), target=byName('Dropkick');
  p.methodDiscount.agility=2; p.namedDiscount[target.name]=2; p.namedDamageBuff[target.name]=3;
  s.playerInControl='p1'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:unrelated}; s.phase='RESOLVE_MOVE';
  g._connect();
  assert.equal(p.methodDiscount.agility,2);
  assert.equal(p.namedDiscount[target.name],2);
  assert.equal(p.namedDamageBuff[target.name],3);
  g.endPostMove('p1');
  s.proposedMove={attackerId:'p1',defenderId:'p2',card:target}; s.phase='RESOLVE_MOVE';
  g._connect();
  assert.equal(p.methodDiscount.agility,undefined);
  assert.equal(p.namedDiscount[target.name],undefined);
  assert.equal(p.namedDamageBuff[target.name],undefined);
});

test("The Mat Is Sacred Action lock survives Control changes and clears only when the affected wrestler commits a Move",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(3163)}),s=g.state();
  s.playerInControl='p2'; s.phase='ACTION'; s.players.p1.actionLocked=true;
  assert.equal(g.passTurn('p2'),true);
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.players.p1.actionLocked,true,'lock must survive gaining a new turn');
  const move=byName('Punch')??allGameplayCards.find(c=>c.kind==='move'&&!c.defensiveOnly);
  s.players.p1.hand=[move]; s.players.p1.adrenaline=99;
  for(const m of ['agility','strength','strike','technical'])s.players.p1.momentum[m]=99;
  assert.equal(g.declareMove('p1',move),true);
  assert.equal(s.players.p1.actionLocked,false,'committing the Move clears the Action lock');
});

test("counterattack return paths advance the turn and start a fresh Control sequence for the wrestler who regains Control",()=>{
  const dom=starById.get('dominik-mysterio'), opp=stars.find(x=>x.id!=='dominik-mysterio');
  const g=new MatchEngine({p1:dom,p2:opp,decks,rng:rng(4163)}),s=g.state();
  const move=byName('Dropkick');
  s.playerInControl='p2'; s.phase='RESOLVE_MOVE'; s.players.p1.turn.momentumPlayed=1;
  s.players.p1.lastConnectedMethod='strike'; s.players.p1.controlMoveCount=2;
  const beforeTurn=s.turnNumber,beforeSeq=s.controlSequence;
  s.proposedMove={attackerId:'p2',defenderId:'p1',card:move,isCounterAttack:true,returnControlAfterResolve:'p1'};
  g._connect();
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.phase,'ACTION');
  assert.equal(s.turnNumber,beforeTurn+1);
  assert.ok(s.controlSequence>beforeSeq);
  assert.equal(s.players.p1.turn.momentumPlayed,0);
  assert.equal(s.players.p1.lastConnectedMethod,null);
  assert.equal(s.players.p1.controlMoveCount,0);
});

test("Turn 5 and Turn 6 delayed Entrances fire exactly on corrected Move-cycle turn advancement",()=>{
  const cody=starById.get('cody-rhodes'),seth=starById.get('seth-rollins');
  const g5=new MatchEngine({p1:cody,p2:seth,decks,rng:rng(5163)}),s5=g5.state();
  const codyTech=s5.players.p1.momentum.technical,sethHand=s5.players.p2.hand.length,sethAd=s5.players.p2.adrenaline;
  s5.turnNumber=4;s5.playerInControl='p1';s5.phase='POST_MOVE';s5.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  g5.endPostMove('p1');
  assert.equal(s5.turnNumber,5);
  assert.equal(s5.players.p1.momentum.technical,codyTech+1);
  assert.equal(s5.players.p2.adrenaline,sethAd+1);
  assert.ok(s5.players.p2.hand.length>=sethHand+1);
  g5.passTurn('p1');
  assert.equal(s5.players.p1.events.turn5EntranceDone,true); assert.equal(s5.players.p2.events.turn5EntranceDone,true);

  const roman=starById.get('roman-reigns'),otherStar=stars.find(x=>x.id!=='roman-reigns');
  const g6=new MatchEngine({p1:roman,p2:otherStar,decks,rng:rng(6163)}),s6=g6.state(),before=s6.players.p1.adrenaline;
  s6.turnNumber=5;s6.playerInControl='p1';s6.phase='POST_MOVE';s6.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  g6.endPostMove('p1');
  assert.equal(s6.turnNumber,6); assert.equal(s6.players.p1.adrenaline,before+1); assert.equal(s6.players.p1.events.romanTurn6EntranceDone,true);
});

test("v0.11.63 wording audit uses turn and Control sequence consistently",()=>{
  const seth=starById.get('seth-rollins'),roman=starById.get('roman-reigns');
  assert.ok(seth.ability.text.includes('next Move this turn'));
  assert.equal(seth.ability.text.includes('Control turn'),false);
  assert.equal((roman.entrance.rulesText.match(/At the start of Turn 6/g)??[]).length,1);
});

test("Seth's The Visionary opens Control after a defensive Counter without advancing the turn",()=>{
  const seth=starById.get('seth-rollins'),opp=stars.find(x=>x.id!=='seth-rollins');
  const g=new MatchEngine({p1:opp,p2:seth,decks,rng:rng(7163)}),s=g.state();
  const incoming=allGameplayCards.find(c=>c.kind==='move'&&!c.defensiveOnly&&(c.moveType||c.tacticalType));
  const counter=allGameplayCards.find(c=>c.kind==='move'&&c.defensiveOnly&&(c.counters??[]).some(t=>[incoming.moveType,incoming.tacticalType].includes(t)));
  assert.ok(incoming&&counter,'need a defensive Counter pair');
  s.playerInControl='p1';s.phase='COUNTER';s.proposedMove={attackerId:'p1',defenderId:'p2',card:incoming};
  s.players.p1.hand=[incoming];s.players.p2.hand=[counter,allGameplayCards.find(c=>c.id==='special-seth-rollins')].filter(Boolean);
  for(const m of ['agility','strength','strike','technical'])s.players.p2.momentum[m]=99;
  s.players.p2.turn.momentumPlayed=1;
  const beforeTurn=s.turnNumber,beforeSeq=s.controlSequence;
  assert.equal(g.counter('p2',counter),true);
  assert.equal(s.playerInControl,'p2');
  assert.equal(s.phase,'ACTION');
  assert.equal(s.turnNumber,beforeTurn,'The Visionary must not advance the turn');
  assert.ok(s.controlSequence>beforeSeq,'Seth still begins a new Control sequence');
  assert.equal(s.players.p2.turn.momentumPlayed,1,'no turn advance means Momentum allowance is not refreshed');
  assert.equal(s.players.p2.specialUsed,true);
});


test("Money in the Bank Series 1 Jey Uso package is locked and playable",()=>{
  const jey=starById.get('jey-uso'); assert.ok(jey); assert.equal(jey.hp,64);
  assert.deepEqual(jey.starterMomentum,{strike:6,strength:4,agility:2});
  assert.equal(decks['jey-uso'].length,60); assert.equal(decks['jey-uso'].filter(c=>c.kind==='momentum').length,12);
  const splash=byName('Uso Splash'); assert.ok(splash); assert.equal(splash.finisher,true); assert.equal(splash.damage,16); assert.deepEqual(splash.requirements,{}); assert.deepEqual(splash.allowedSuperstarIds,['jey-uso']); assert.deepEqual(splash.bonusDamageAfterNamed,{name:'Spear',damage:1});
  assert.equal(CARD_NUMBER_BY_ID['running-hip-attack'].cardCode,'MITB1-001'); assert.equal(CARD_NUMBER_BY_ID['uso-splash'].cardCode,'MITB1-002'); assert.equal(CARD_NUMBER_BY_ID['superstar-jey-uso'].cardCode,'MITB1-005');
  const opp=stars.find(x=>x.id!=='jey-uso'); const g=new MatchEngine({p1:jey,p2:opp,decks,rng:rng(1164)}),st=g.state(),p1=st.players.p1;
  // Entrance applies.
  assert.equal(p1.momentum.strike,1); assert.equal(p1.adrenaline,1);
  // Strike ability queues Strength discount/adrenaline in same Control sequence.
  const strike=byName('Punch'), strength=byName('Spear'); p1.hand=[strike,strength,allGameplayCards.find(c=>c.id==='special-jey-uso'),splash].filter(Boolean); p1.adrenaline=99; for(const m of ['agility','strength','strike','technical'])p1.momentum[m]=99;
  st.playerInControl='p1'; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:strike}; g._connect();
  assert.equal(p1.methodDiscount.strength,1); assert.equal(p1.events.jeyStrengthAdrenaline,1);
  const ad=p1.adrenaline; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:strength}; g._connect(); assert.equal(p1.adrenaline,ad+2);
});


test("Money in the Bank Series 1 LA Knight package is locked and playable",()=>{
  const knight=starById.get('la-knight'); assert.ok(knight); assert.equal(knight.hp,64);
  assert.deepEqual(knight.starterMomentum,{strike:5,strength:3,technical:2,agility:2});
  assert.equal(decks['la-knight'].length,60); assert.equal(decks['la-knight'].filter(c=>c.kind==='momentum').length,12);
  const bft=byName('BFT'), jump=byName('Jumping Neckbreaker'), hammer=byName('Burning Hammer');
  assert.ok(bft&&jump&&hammer); assert.equal(bft.finisher,true); assert.equal(bft.damage,16); assert.deepEqual(bft.requirements,{}); assert.equal(bft.superstarId,'la-knight'); assert.deepEqual(bft.bonusDamageAfterNamed,{name:'Diving Elbow Drop',damage:1});
  assert.equal(CARD_NUMBER_BY_ID['jumping-neckbreaker'].cardCode,'MITB1-006'); assert.equal(CARD_NUMBER_BY_ID['la-knight-bft'].cardCode,'MITB1-008'); assert.equal(CARD_NUMBER_BY_ID['superstar-la-knight'].cardCode,'MITB1-011');
  const opp=stars.find(x=>x.id!=='la-knight'); const g=new MatchEngine({p1:knight,p2:opp,decks,rng:rng(1165)}),st=g.state(),p=st.players.p1;
  assert.equal(p.momentum.strike,1); assert.equal(p.adrenaline,1);
  // Megastar: qualifying 8+ printed Damage gives Adrenaline, and at 4+ pre-connect also draws.
  p.adrenaline=4; const beforeHand=p.hand.length; const heavy=hammer; st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:heavy};g._connect(); assert.equal(p.adrenaline,6); assert.ok(p.hand.length>=beforeHand+1);
  // Jumping Neckbreaker only draws when the immediately previous connected Method was Strike.
  p.lastConnectedMethod='strike'; const before=p.hand.length; st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:jump};g._connect(); assert.ok(p.hand.length>=before+1);
});

test("Money in the Bank Series 1 Alexa Bliss package is locked and playable",()=>{
  const alexa=starById.get('alexa-bliss'); assert.ok(alexa); assert.equal(alexa.hp,62);
  assert.deepEqual(alexa.starterMomentum,{agility:6,strike:3,technical:3});
  assert.equal(decks['alexa-bliss'].length,60); assert.equal(decks['alexa-bliss'].filter(c=>c.kind==='momentum').length,12);
  const knees=byName('Double Knees'), code=byName('Code Red'), sister=byName('Sister Abigail'), twisted=byName('Twisted Bliss');
  assert.ok(knees&&code&&sister&&twisted); assert.equal(sister.trademark,true); assert.equal(twisted.finisher,true); assert.equal(twisted.damage,15); assert.deepEqual(twisted.requirements,{}); assert.equal(twisted.superstarId,'alexa-bliss'); assert.deepEqual(twisted.bonusDamageAfterNamed,{name:'Sister Abigail',damage:2});
  assert.equal(CARD_NUMBER_BY_ID['double-knees'].cardCode,'MITB1-012'); assert.equal(CARD_NUMBER_BY_ID['alexa-bliss-twisted-bliss'].cardCode,'MITB1-015'); assert.equal(CARD_NUMBER_BY_ID['superstar-alexa-bliss'].cardCode,'MITB1-018');
  const opp=stars.find(x=>x.id!=='alexa-bliss'); const g=new MatchEngine({p1:alexa,p2:opp,decks,rng:rng(1166)}),st=g.state(),p=st.players.p1,d=st.players.p2;
  assert.equal(p.momentum.agility,1); assert.equal(p.adrenaline,1);
  // Five Feet of Fury only rewards a Move that begins while the opponent is already Stunned.
  p.adrenaline=5; d.status.stunnedTurns=1; d.stun=1; const beforeHand=p.hand.length; st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:code};g._connect(); assert.equal(p.adrenaline,7); assert.ok(p.hand.length>=beforeHand+1);
  // Sister Abigail tutors/discounts Twisted Bliss; the follow-up gets +2 Damage.
  d.status.stunnedTurns=0; d.stun=0; p.deck=[twisted]; st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:sister};g._connect(); assert.ok(p.hand.some(c=>c.id==='alexa-bliss-twisted-bliss')); assert.equal(p.namedDiscount['Twisted Bliss'],3);
});

test("Alexa Bliss Mind Games rewards a natural kickout without modifying pin odds",()=>{
  const alexa=starById.get('alexa-bliss'),opp=stars.find(x=>x.id!=='alexa-bliss'); const g=new MatchEngine({p1:opp,p2:alexa,decks,rng:()=>0.99}),st=g.state(),a=st.players.p1,d=st.players.p2;
  const special=allGameplayCards.find(c=>c.id==='special-alexa-bliss'); d.hand=[special]; d.adrenaline=2; const beforeHand=d.hand.length;
  st.playerInControl='p1'; st.phase='ACTION'; d.hp=Math.floor(d.maxHp*.5); st.postMove={attackerId:'p1',defenderId:'p2',cardId:'test'};
  assert.equal(g.attemptPin('p1'),true); assert.equal(d.specialUsed,false);
  assert.equal(g.passPinResponse('p2'),true); assert.equal(d.specialUsed,true); assert.equal(d.adrenaline,4); // +1 Entrance on first Control, +1 Mind Games assert.ok(d.hand.length>=beforeHand); assert.equal('pinBonusModifier' in (st.proposedPin??{}),false);
});



test("Money in the Bank Series 1 Finn Bálor package is locked and playable",()=>{
  const finn=starById.get('finn-balor'); assert.ok(finn); assert.equal(finn.hp,64);
  assert.deepEqual(finn.starterMomentum,{agility:6,strike:4,technical:2});
  assert.equal(decks['finn-balor'].length,60); assert.equal(decks['finn-balor'].filter(c=>c.kind==='momentum').length,12);
  const shotgun=byName('Shotgun Dropkick'), move1916=byName('1916'), coup=byName('Coup de Grâce');
  assert.ok(shotgun&&move1916&&coup); assert.equal(move1916.trademark,true); assert.equal(coup.finisher,true); assert.equal(coup.damage,16); assert.deepEqual(coup.requirements,{}); assert.equal(coup.superstarId,'finn-balor'); assert.deepEqual(coup.bonusDamageAfterNamed,{name:'Shotgun Dropkick',damage:1});
  assert.equal(CARD_NUMBER_BY_ID['shotgun-dropkick'].cardCode,'MITB1-019'); assert.equal(CARD_NUMBER_BY_ID['finn-balor-coup-de-grace'].cardCode,'MITB1-021'); assert.equal(CARD_NUMBER_BY_ID['superstar-finn-balor'].cardCode,'MITB1-024');
  const opp=stars.find(x=>x.id!=='finn-balor'); const g=new MatchEngine({p1:finn,p2:opp,decks,rng:rng(1167)}),st=g.state(),p=st.players.p1;
  assert.equal(p.momentum.strength,1); assert.equal(p.adrenaline,1);
  // Relentless Pace triggers on the second and later connected Move in a Control sequence.
  p.adrenaline=5; const first=byName('Dropkick'),second=byName('Enzuigiri'); for(const m of ['agility','strength','strike','technical'])p.momentum[m]=99;
  st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:first};g._connect(); const afterFirstAd=p.adrenaline; const afterFirstHand=p.hand.length;
  st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:second};g._connect(); assert.equal(p.adrenaline,afterFirstAd+2); assert.ok(p.hand.length>=afterFirstHand+1);
});

test("Finn Bálor Bálor Club and Shotgun Dropkick chain into Coup de Grâce",()=>{
  const finn=starById.get('finn-balor'),opp=stars.find(x=>x.id!=='finn-balor'); const g=new MatchEngine({p1:finn,p2:opp,decks,rng:rng(2167)}),st=g.state(),p=st.players.p1;
  const sling=byName('Sling Blade'),shotgun=byName('Shotgun Dropkick'),coup=byName('Coup de Grâce'),special=allGameplayCards.find(c=>c.id==='special-finn-balor');
  p.hand=[sling,special]; p.deck=[shotgun,byName('Punch'),byName('Headbutt')??byName('Punch'),coup]; p.adrenaline=99; for(const m of ['agility','strength','strike','technical'])p.momentum[m]=99;
  st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:sling};g._connect(); assert.ok(p.hand.some(c=>c.id==='shotgun-dropkick')); assert.equal(p.namedDiscount['Shotgun Dropkick'],3); assert.equal(p.specialUsed,true);
  const sg=p.hand.find(c=>c.id==='shotgun-dropkick'); st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:sg};g._connect(); assert.ok(p.hand.some(c=>c.id==='finn-balor-coup-de-grace')); assert.equal(p.namedDiscount['Coup de Grâce'],3);
});

test("SmackDown Series 1 Danhausen package is locked and playable",()=>{
  const dan=starById.get('danhausen'); assert.ok(dan); assert.equal(dan.hp,61);
  assert.deepEqual(dan.starterMomentum,{technical:6,strike:4,strength:2});
  assert.equal(decks.danhausen.length,60); assert.equal(decks.danhausen.filter(c=>c.kind==='momentum').length,12);
  const pump=byName('Pump Kick'), inv=byName('Inverted DDT'), oct=byName('Octopus Hold'), knee=byName('Very Nice, Very Knee-vil'), triple=byName('Triple D'), cutter=byName('Cutter');
  assert.ok(pump&&inv&&oct&&knee&&triple&&cutter); assert.equal(knee.trademark,true); assert.equal(triple.finisher,true); assert.equal(triple.damage,15); assert.deepEqual(triple.requirements,{}); assert.equal(triple.superstarId,'danhausen'); assert.equal(triple.bonusDamageIfOpponentStunned,1);
  assert.equal(CARD_NUMBER_BY_ID['pump-kick'].cardCode,'SD1-001'); assert.equal(CARD_NUMBER_BY_ID['superstar-danhausen'].cardCode,'SD1-008'); assert.equal(CARD_NUMBER_BY_ID['cutter'].cardCode,'SD1-009');
  const opp=stars.find(x=>x.id!=='danhausen'),g=new MatchEngine({p1:dan,p2:opp,decks,rng:rng(1168)}),st=g.state(),p=st.players.p1;
  assert.equal(p.momentum.technical,1); assert.equal(p.adrenaline,1);
});

test("Danhausen curse, Jar of Teeth and stunned finish interactions resolve",()=>{
  const dan=starById.get('danhausen'),opp=stars.find(x=>x.id!=='danhausen'),g=new MatchEngine({p1:dan,p2:opp,decks,rng:()=>0.5}),st=g.state(),a=st.players.p1,d=st.players.p2;
  // Give opponent sufficient resources and Adrenaline, then pass from Danhausen to trigger curse.
  d.momentum.strength=10;d.momentum.strike=10;d.momentum.technical=10;d.momentum.agility=10;d.adrenaline=3; d.momentum.attitude=3;
  st.playerInControl='p1';st.phase='ACTION'; assert.equal(g.passTurn('p1'),true); assert.equal(st.playerInControl,'p2'); assert.equal(d.events.danhausenCurseAdrenalineCost,1); assert.equal(a.abilityUses,1);
  const move=allGameplayCards.find(c=>c.id==='punch'); d.hand.unshift(move); const before=d.adrenaline; assert.equal(g.declareMove('p2',move),true); assert.equal(d.adrenaline,before-1); assert.equal(d.events.danhausenCurseAdrenalineCost,undefined);
  // Countering the cursed first Move drains another Adrenaline.
  const counter=allGameplayCards.find(c=>!c.defensiveOnly&&(c.counters??[]).some(Boolean)); if(counter){a.hand.unshift(counter); const cb=d.adrenaline; if(g.counter('p1',counter)) assert.equal(d.adrenaline,Math.max(0,cb-1));}
  // Directly verify Jar post-grounding window and effect.
  const jar=allGameplayCards.find(c=>c.id==='special-danhausen'),ground=allGameplayCards.find(c=>c.id==='inverted-ddt'); a.hand=[jar]; a.specialUsed=false; a.momentum.technical=10;a.momentum.strike=10; d.hand=[allGameplayCards.find(c=>c.id==='momentum-strike')]; d.adrenaline=2; st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:ground}; g._connect(); assert.equal(a.events.jarOfTeethWindow,true); const handBefore=a.hand.length, defenderHandBeforeJar=d.hand.length; assert.equal(g.playSpecial('p1',jar),true); assert.equal(d.hand.length,Math.max(0,defenderHandBeforeJar-1)); assert.equal(d.adrenaline,0); assert.ok(a.hand.length>=handBefore);
  // Triple D gains +1 Damage against a previously Stunned opponent.
  const triple=allGameplayCards.find(c=>c.id==='danhausen-triple-d'); a.specialUsed=true; d.status.stunnedTurns=1;d.stun=1; const hpBeforeTriple=d.hp; st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:triple}; g._connect(); assert.equal(d.hp,Math.max(0,hpBeforeTriple-16));
});


test("SmackDown Series 1 Tiffany Stratton package is locked and playable",()=>{
  const tiffany=starById.get('tiffany-stratton'); assert.ok(tiffany); assert.equal(tiffany.hp,62);
  assert.deepEqual(tiffany.starterMomentum,{agility:7,strength:4,technical:1});
  assert.deepEqual(tiffany.methodLimits,{agility:null,strength:4,technical:1,strike:1});
  assert.equal(decks['tiffany-stratton'].length,60); assert.equal(decks['tiffany-stratton'].filter(c=>c.kind==='momentum').length,12);
  const elbow=allGameplayCards.find(c=>c.id==='tiffany-stratton-handspring-back-elbow'),pme=allGameplayCards.find(c=>c.id==='tiffany-stratton-prettiest-moonsault-ever');
  assert.ok(elbow&&pme); assert.equal(elbow.trademark,true); assert.equal(elbow.damage,7); assert.equal(pme.finisher,true); assert.equal(pme.damage,16); assert.deepEqual(pme.requirements,{}); assert.equal('pinBonus' in pme,false);
  assert.equal(CARD_NUMBER_BY_ID['front-kick'].cardCode,'SD1-010'); assert.equal(CARD_NUMBER_BY_ID['superstar-tiffany-stratton'].cardCode,'SD1-017');
  const opp=stars.find(x=>x.id!=='tiffany-stratton'),g=new MatchEngine({p1:tiffany,p2:opp,decks,rng:rng(1177)}),st=g.state(),p=st.players.p1,d=st.players.p2;
  assert.equal(p.momentum.agility,1); assert.equal(p.adrenaline,1);
  // Strength grounding Move opens Tiffany's once-per-Control Agility discount.
  const spine=byName('Spinebuster'); p.momentum.strength=99;p.momentum.agility=99;p.momentum.technical=99;
  st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:spine};g._connect(); assert.equal(p.methodDiscount.agility,1);
  // Handspring Back Elbow tutors PME and grounds the opponent.
  p.deck=[pme]; st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:elbow};g._connect(); assert.ok(p.hand.some(c=>c.id===pme.id)); assert.equal(d.posture,'on-mat');
});

test("SmackDown Series 1 Chelsea Green package is locked and counter-control mechanics execute",()=>{
  const chelsea=starById.get('chelsea-green'); assert.ok(chelsea); assert.equal(chelsea.hp,61);
  assert.deepEqual(chelsea.starterMomentum,{technical:7,agility:3,strike:2});
  assert.deepEqual(chelsea.methodLimits,{agility:3,strength:1,strike:2,technical:null});
  assert.equal(decks['chelsea-green'].length,60); assert.equal(decks['chelsea-green'].filter(c=>c.kind==='momentum').length,12);
  const prettier=allGameplayCards.find(c=>c.id==='chelsea-green-im-prettier'),envy=allGameplayCards.find(c=>c.id==='chelsea-green-green-with-envy'),special=allGameplayCards.find(c=>c.id==='special-chelsea-green'),runningKnees=allGameplayCards.find(c=>c.id==='running-knees-to-the-back');
  assert.ok(prettier&&envy&&special&&runningKnees); assert.equal(prettier.trademark,true); assert.equal(prettier.damage,11); assert.equal(envy.finisher,true); assert.equal(envy.damage,15); assert.deepEqual(envy.requirements,{}); assert.equal('pinBonus' in envy,false);
  assert.equal(runningKnees.cost,4); assert.equal(runningKnees.damage,6); assert.equal(runningKnees.method,'agility'); assert.deepEqual(runningKnees.requirements,{agility:1,strike:1}); assert.equal(runningKnees.standingOnly,true); assert.equal(runningKnees.groundOpponent,true);
  assert.equal(decks['chelsea-green'].filter(c=>c.id==='running-knees-to-the-back').length,1); assert.deepEqual(Object.entries(decks).filter(([sid,deck])=>sid!=='chelsea-green'&&deck.some(c=>c.id==='running-knees-to-the-back')).map(([sid])=>sid),[]);
  assert.equal(CARD_NUMBER_BY_ID['chelsea-green-im-prettier'].cardCode,'SD1-018'); assert.equal(CARD_NUMBER_BY_ID['superstar-chelsea-green'].cardCode,'SD1-022'); assert.equal(CARD_NUMBER_BY_ID['running-knees-to-the-back'].cardCode,'SD1-031');
  const opp=stars.find(x=>x.id!=='chelsea-green'),g=new MatchEngine({p1:opp,p2:chelsea,decks,rng:rng(2177)}),st=g.state(),c=st.players.p2,a=st.players.p1;
  assert.equal(c.adrenaline,0); assert.equal(c.events.nextCounterDiscount,1);
  // Entrance Adrenaline waits until Chelsea actually gains Control.
  g._setControl('p2'); assert.equal(c.adrenaline,2);
  // File a Complaint finds a Counter and queues another counter discount.
  c.hand=[special]; c.deck=[byName('Chain Wrestling'),byName('DDT')].filter(Boolean); st.phase='ACTION'; assert.equal(g.playSpecial('p2',special),true); assert.ok(c.hand.some(x=>x.id==='chain-wrestling')); assert.equal(c.events.nextCounterDiscount,2);
  // A successful Chelsea Counter drains opponent Adrenaline through The Complaints Department.
  const incoming=byName('DDT'),counter=byName('Chain Wrestling'); a.adrenaline=3; a.momentum.technical=99;c.momentum.technical=99;c.hand=[counter];st.playerInControl='p1';st.phase='COUNTER';st.proposedMove={attackerId:'p1',defenderId:'p2',card:incoming};
  assert.equal(g.counter('p2',counter),true); assert.equal(a.adrenaline,2);
});

test("SmackDown Series 1 Damian Priest package is locked and punishment mechanics execute",()=>{
  const priest=starById.get('damian-priest'); assert.ok(priest); assert.equal(priest.hp,66);
  assert.deepEqual(priest.methodLimits,{strength:null,strike:4,agility:2,technical:1});
  assert.deepEqual(priest.starterMomentum,{strength:7,strike:4,agility:1});
  assert.equal(decks['damian-priest'].length,60); assert.equal(decks['damian-priest'].filter(c=>c.kind==='momentum').length,12);
  const south=allGameplayCards.find(c=>c.id==='damian-priest-south-of-heaven'), razor=allGameplayCards.find(c=>c.id==='damian-priest-razors-edge'), hit=allGameplayCards.find(c=>c.id==='damian-priest-hit-the-lights'), last=allGameplayCards.find(c=>c.id==='special-damian-priest');
  assert.ok(south&&razor&&hit&&last); assert.equal(south.damage,12); assert.equal(razor.damage,13); assert.equal(hit.damage,16); assert.equal(hit.finisher,true); assert.deepEqual(hit.requirements,{});
  assert.equal(CARD_NUMBER_BY_ID['damian-priest-south-of-heaven'].cardCode,'SD1-023'); assert.equal(CARD_NUMBER_BY_ID['superstar-damian-priest'].cardCode,'SD1-028');
  const opp=stars.find(x=>x.id!=='damian-priest'),g=new MatchEngine({p1:priest,p2:opp,decks,rng:()=>0.5}),st=g.state(),a=st.players.p1,d=st.players.p2;
  a.momentum.strength=10;a.momentum.strike=10;a.momentum.agility=10; d.momentum.strength=10;d.momentum.strike=10;d.momentum.agility=10;
  g._ability('p1','counter',{incoming:allGameplayCards.find(c=>c.id==='punch'),counter:allGameplayCards.find(c=>c.id==='sidestep')}); assert.equal(a.events.priestPunishmentBonus,3);
  const hp=d.hp; st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:south};g._connect();assert.equal(d.hp,hp-15);assert.equal(a.events.priestPunishmentBonus,undefined);assert.equal(a.events.nextFinisherDiscount,2);
  d.adrenaline=3;st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:razor};g._connect();assert.ok(d.adrenaline<=1);
});

test("canonical health bands are Green 65%+, Amber 25-64%, Red 0-24% and pins follow them",()=>{
  const g=new MatchEngine({p1:superstars.romanReigns,p2:superstars.codyRhodes,decks,rng:()=>0.5});
  const s=g.state(),d=s.players.p2; s.playerInControl='p1'; s.phase='ACTION'; s.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  s.players.p1.turn={momentumPlayed:0,momentumPlayLimit:1,actionPlayed:0,supportPlayed:0,specialPlayed:0};
  d.maxHp=100;
  d.hp=65; assert.equal(healthZone(d),'green'); assert.equal(canAttemptPin(s,'p1').legal,false,'Green health cannot be pinned'); assert.equal(g._pinChance('p1'),5,'the actual-HP table still exists but is not consulted until a legal pin window');
  d.hp=64; assert.equal(healthZone(d),'amber'); assert.equal(canAttemptPin(s,'p1').legal,true,'Amber health opens the pin window'); assert.equal(g._pinChance('p1'),5,'16+ actual HP remains a 5% pin once pinning is legal');
  d.hp=24; assert.equal(g._pinChance('p1'),5,'16+ actual HP remains a 5% pin');
  d.hp=15; assert.equal(g._pinChance('p1'),20);
  d.hp=10; assert.equal(g._pinChance('p1'),45);
  d.hp=8; assert.equal(g._pinChance('p1'),50);
  d.hp=5; assert.equal(g._pinChance('p1'),70);
  d.hp=4; assert.equal(g._pinChance('p1'),75);
  d.hp=0; assert.equal(healthZone(d),'red'); assert.equal(g._pinChance('p1'),75,'0-4 actual HP carries the locked 75% natural pin chance');
});


test("Fight Forever is a booster-only 4-star RAW Action and is absent from all recommended decks",()=>{
  const card=allGameplayCards.find(c=>c.id==='fight-forever');
  assert.ok(card);
  assert.equal(card.kind,'action');
  assert.equal(card.rarity,4);
  assert.equal(card.setId,'raw-series-1');
  assert.equal(card.boosterOnly,true);
  assert.equal(card.boosterEligible!==false,true);
  assert.equal(boosterEligible(card),false,'future RAW card is authored booster-ready but hidden until release');
  assert.equal(Object.values(decks).some(deck=>deck.some(c=>c.id===card.id)),false);
  assert.equal(CARD_NUMBER_BY_ID[card.id]?.cardCode,'RAW1-030');
});

test("v0.12.33 keeps every Superstar on the no-cap tuned durability model",()=>{
  assert.equal(stars.length,62);
  assert.ok(stars.every(star=>Number.isInteger(star.hp)&&star.hp>=55),"all 62 Superstars use valid tuned starting HP values");
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(1194)});
  assert.equal(g.state().players.p1.hp,stars[0].hp);
  assert.equal(g.state().players.p1.maxHp,stars[0].hp);
});

test("Fight Forever is locked through Turn 10, then restores 10 HP to both Superstars without changing the clock",()=>{
  const fight=allGameplayCards.find(c=>c.id==='fight-forever');
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(1195)});
  const s=g.state();
  s.players.p1.hand=[fight]; s.players.p1.hp=Math.max(0,s.players.p1.maxHp-15); s.players.p2.hp=Math.max(0,s.players.p2.maxHp-6);
  s.turnNumber=10;
  assert.equal(canPlayAction(s,'p1',fight),false,'Fight Forever cannot be played on Turn 10');
  assert.equal(g.playAction('p1',fight),false);
  s.turnNumber=11;
  assert.equal(canPlayAction(s,'p1',fight),true,'Fight Forever unlocks after Turn 10');
  assert.equal(g.playAction('p1',fight),true);
  assert.equal(s.players.p1.hp,s.players.p1.maxHp-5);
  assert.equal(s.players.p2.hp,s.players.p2.maxHp);
  assert.ok(!('turnLimit' in s),'matches no longer carry a turn limit');
  assert.ok(s.log.some(e=>e.type==='FIGHT_FOREVER'&&e.playerHeal===10&&e.opponentHeal===6));
});

test("matches continue beyond Turn 50 with no turn-limit draw",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(501)}); const s=g.state();
  s.turnNumber=50; s.phase='ACTION'; s.playerInControl='p1';
  assert.equal(g.passTurn('p1'),true);
  assert.equal(s.phase,'ACTION');
  assert.equal(s.winner,null);
  assert.equal(s.finish,null);
  assert.equal(s.turnNumber,51);
  s.turnNumber=99; s.phase='ACTION'; s.playerInControl='p2';
  assert.equal(g.passTurn('p2'),true);
  assert.equal(s.phase,'ACTION');
  assert.equal(s.turnNumber,100);
  assert.equal(s.log.some(e=>e.type==='MATCH_ENDED'&&e.finishType==='turn-limit'),false);
});


test("v0.11.96 staged move/action expansion remains fully registered after later pool growth",()=>{
  const expected={
    'flapjack':['MITB1-030',4,6], 'side-headlock':['MITB1-031',3,0], 'wristlock':['MITB1-032',2,0], 'catch-your-breath':['MITB1-033',null,null],
    'knee-to-the-gut':['RAW1-031',3,4], 'throw-into-steel-steps':['RAW1-032',5,8], 'sleeper-hold':['RAW1-033',4,0],
    'scissors-kick':['WC1-031',5,8], 'senton-splash':['WC1-032',5,8], 'spinning-back-kick':['WC1-033',3,5],
    'throw-into-ringpost':['SD1-032',5,8], 'corner-barrage':['SD1-033',4,6]
  };
  for(const [id,[code,cost,damage]] of Object.entries(expected)){
    const card=allGameplayCards.find(c=>c.id===id);assert.ok(card,id);assert.equal(card.boosterOnly,true,id);assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
    if(cost!==null)assert.equal(card.cost,cost,id);if(damage!==null)assert.equal(card.damage,damage,id);
    assert.equal(card.boosterEligible!==false,true,id);
    assert.equal(boosterEligible(card),isLaunchLiveSetId(card.setId),`${id} live booster gate`);
  }
  const expectedPools={
    'raw-series-1':[30,26],
    'money-in-the-bank-series-1':[29,25],
    'worlds-collide-series-1':[30,26],
    'smackdown-series-1':[30,26]
  };
  for(const [setId,[gameplayCount,boosterCount]] of Object.entries(expectedPools)){
    const pool=allGameplayCards.filter(c=>c.setId===setId);assert.ok(pool.length>=gameplayCount,`${setId} gameplay pool retains at least the v0.11.96 floor`);
    const authoredPool=pool.filter(card=>card.boosterEligible!==false&&(card.kind!=='entrance'||!card.superstarId));
    assert.ok(authoredPool.length>=boosterCount,`${setId} authored booster pool retains at least the v0.11.96 floor`);
    assert.equal(pool.filter(boosterEligible).length,0,`${setId} remains hidden from public boosters until release`);
  }
});

test("new impact Moves deal one-shot body-part damage without opening a maintainable submission",()=>{
  const ringpost=allGameplayCards.find(c=>c.id==='throw-into-ringpost'),steps=allGameplayCards.find(c=>c.id==='throw-into-steel-steps');
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(1196)}),s=g.state(),a=s.players.p1,d=s.players.p2;
  a.momentum.strength=99;
  s.playerInControl='p1';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:ringpost};g._connect();
  assert.equal(d.submissionDamage.head,1);assert.notEqual(s.phase,'SUBMISSION_MAINTAIN');assert.equal(s.submission,null);
  s.playerInControl='p1';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:steps};g._connect();
  assert.equal(d.submissionDamage.back,1);assert.notEqual(s.phase,'SUBMISSION_MAINTAIN');
  assert.equal(s.log.filter(e=>e.type==='BODY_PART_DAMAGE').length,2);
});

test("Corner Barrage chains from an earlier Strike and Knee to the Gut is an offensive Grapple Counter",()=>{
  const barrage=allGameplayCards.find(c=>c.id==='corner-barrage'),knee=allGameplayCards.find(c=>c.id==='knee-to-the-gut'),punch=allGameplayCards.find(c=>c.id==='punch'),grapple=byName('Body Slam');
  assert.ok(barrage&&knee&&punch&&grapple);assert.deepEqual(knee.counterStates,['torso-trapped']);
  const plain1={...stars[0],ability:{name:'Test',trigger:{}}},plain2={...stars[1],ability:{name:'Test',trigger:{}}};
  const g=new MatchEngine({p1:plain1,p2:plain2,decks,rng:rng(2196)}),s=g.state(),a=s.players.p1,d=s.players.p2;a.momentum.strike=99;
  a.events.strikeConnectedThisControl=true;const hp=d.hp;s.playerInControl='p1';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:barrage};g._connect();assert.equal(d.hp,hp-8);
  s.phase='COUNTER';s.proposedMove={attackerId:'p2',defenderId:'p1',card:grapple};a.hand=[knee];const hpKnee=d.hp;assert.equal(g.counter('p1',knee),true);assert.notEqual(s.phase,'COUNTER');assert.equal(d.hp,Math.max(0,hpKnee-(knee.damage??0)));
});

test("Catch Your Breath is a 3-star booster-only Action that restores 5 HP up to max",()=>{
  const card=allGameplayCards.find(c=>c.id==='catch-your-breath');assert.ok(card);assert.equal(card.kind,'action');assert.equal(card.rarity,3);assert.equal(card.setId,'money-in-the-bank-series-1');
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(3196)}),s=g.state(),p=s.players.p1;p.hand=[card];p.hp=p.maxHp-3;
  assert.equal(g.playAction('p1',card),true);assert.equal(p.hp,p.maxHp);assert.ok(s.log.some(e=>e.type==='HEALTH_RESTORED'&&e.amount===3));
});

test("Survivor Series Series 1 Drew, Randy, Sami and Jacob packages are locked, numbered and 60 pages",()=>{
  const expected={
    'drew-mcintyre':{hp:68,momentum:{strength:7,strike:4,technical:1},codes:['SVS1-007','SVS1-012']},
    'randy-orton':{hp:65,momentum:{technical:5,strength:3,strike:3,agility:1},codes:['SVS1-013','SVS1-018']},
    'sami-zayn':{hp:64,momentum:{technical:5,agility:4,strike:2,strength:1},codes:['SVS1-019','SVS1-024']},
    'jacob-fatu':{hp:68,momentum:{strength:6,strike:3,agility:3},codes:['SVS1-025','SVS1-030']}
  };
  for(const [id,x] of Object.entries(expected)){
    const star=starById.get(id); assert.ok(star,id); assert.equal(star.hp,x.hp,id); assert.deepEqual(star.starterMomentum,x.momentum,id);
    assert.equal(decks[id].length,60,id); assert.equal(decks[id].filter(c=>c.kind==='momentum').length,12,id);
    assert.equal(CARD_NUMBER_BY_ID[star.signatures[0]]?.cardCode,x.codes[0],id); assert.equal(CARD_NUMBER_BY_ID[star.cardId]?.cardCode,x.codes[1],id);
  }
  assert.ok(allGameplayCards.filter(c=>c.setId==='survivor-series-series-1').length>=28);
});

test("Drew Pick Your Shot, Claymore Countdown and head-damage Claymore discount execute",()=>{
  const drew=starById.get('drew-mcintyre'),opp=starById.get('bron-breakker'),g=new MatchEngine({p1:drew,p2:opp,decks,rng:rng(1197)}),s=g.state(),a=s.players.p1,d=s.players.p2;
  for(const m of ['strength','strike','technical','agility'])a.momentum[m]=99;
  const power=byName('Powerbomb'),clay=allGameplayCards.find(c=>c.id==='drew-mcintyre-claymore'),special=allGameplayCards.find(c=>c.id==='special-drew-mcintyre');
  s.playerInControl='p1';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:power};g._connect(); assert.equal(a.methodDiscount.strike,1);
  a.hand=[special];a.deck=[clay];s.phase='ACTION';s.playerInControl='p1';assert.equal(g.playSpecial('p1',special),true);assert.ok(a.hand.some(c=>c.id===clay.id));assert.ok((a.namedDiscount['Claymore']??0)>=2);
  d.submissionDamage.head=1;const legal=moveEligibility(s,'p1',a.hand.find(c=>c.id===clay.id));assert.equal(legal.legal,true);assert.ok(legal.effectiveCost<=7,'ability/special/body damage discounts should make Claymore cheaper than printed C10');
});

test("Randy Apex Predator and Outta Nowhere make RKO a once-per-match Counter",()=>{
  const randy=starById.get('randy-orton'),opp=starById.get('drew-mcintyre'),g=new MatchEngine({p1:opp,p2:randy,decks,rng:rng(2197)}),s=g.state(),r=s.players.p2;
  for(const m of ['strength','strike','technical','agility'])r.momentum[m]=99;
  const tech=byName('DDT'),rko=allGameplayCards.find(c=>c.id==='randy-orton-rko'),special=allGameplayCards.find(c=>c.id==='special-randy-orton'),incoming=byName('Punch');
  s.playerInControl='p2';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p2',defenderId:'p1',card:tech};g._connect();assert.equal(r.nextMoveDiscount,2);
  r.hand=[rko,special];r.specialUsed=false;s.playerInControl='p1';s.phase='COUNTER';s.proposedMove={attackerId:'p1',defenderId:'p2',card:incoming};const hpRko=s.players.p1.hp;assert.equal(g.counter('p2',rko),true);assert.equal(r.specialUsed,true);assert.notEqual(s.phase,'COUNTER');assert.equal(s.players.p1.hp,Math.max(0,hpRko-(rko.damage??0)));assert.ok(s.log.some(e=>e.type==='SPECIAL_EFFECT'&&e.effect==='outta-nowhere-rko'));
});

test("Sami comeback package discounts the opener, chains Exploder to Helluva and fires Never Say Die",()=>{
  const sami=starById.get('sami-zayn'),opp=starById.get('jacob-fatu'),g=new MatchEngine({p1:sami,p2:opp,decks,rng:rng(3197)}),s=g.state(),a=s.players.p1,d=s.players.p2;
  for(const m of ['strength','strike','technical','agility'])a.momentum[m]=99;
  a.hp=d.hp-1;const punch=byName('Punch');const first=moveEligibility(s,'p1',punch);assert.equal(first.effectiveCost,Math.max(0,punch.cost-1));
  const exp=allGameplayCards.find(c=>c.id==='sami-zayn-exploder-turnbuckle'),hell=allGameplayCards.find(c=>c.id==='sami-zayn-helluva-kick');s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:exp};g._connect();assert.equal(a.namedDiscount['Helluva Kick'],4);assert.ok(moveEligibility(s,'p1',hell).effectiveCost<=7);
  const special=allGameplayCards.find(c=>c.id==='special-sami-zayn');a.hand=[special];a.specialUsed=false;a.hp=Math.ceil(a.maxHp*.45);const beforeAd=a.adrenaline,beforeHand=a.hand.length;const hit={...byName('Powerbomb'),damage:8};s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p2',defenderId:'p1',card:hit};g._connect();assert.equal(a.specialUsed,true);assert.equal(a.adrenaline,beforeAd+1,'incoming Move shifts -1 Adrenaline then Never Say Die adds +2');assert.ok(a.hand.length>=beforeHand,'Never Say Die draws after consuming itself');
});

test("Jacob strength-to-agility sequencing, Built Different and both finishers execute",()=>{
  const jacob=starById.get('jacob-fatu'),opp=starById.get('randy-orton'),g=new MatchEngine({p1:jacob,p2:opp,decks,rng:rng(4197)}),s=g.state(),a=s.players.p1,d=s.players.p2;
  for(const m of ['strength','strike','technical','agility'])a.momentum[m]=99;
  const samoan=byName('Samoan Drop'),pop=allGameplayCards.find(c=>c.id==='jacob-fatu-pop-up-samoan-drop'),moon=allGameplayCards.find(c=>c.id==='jacob-fatu-moonsault'),grip=allGameplayCards.find(c=>c.id==='jacob-fatu-tongan-death-grip');
  s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:samoan};g._connect();assert.equal(a.methodDiscount.agility,1);
  a.deck=[moon];s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:pop};g._connect();assert.ok(a.hand.some(c=>c.id===moon.id));assert.equal(a.namedDiscount['Moonsault'],2);
  assert.equal(grip.finisher,true);assert.deepEqual(grip.submission,{bodyPart:'head',pressure:5});
  const special=allGameplayCards.find(c=>c.id==='special-jacob-fatu');a.hand=[special];a.specialUsed=false;const before=a.adrenaline;const hit={...byName('Powerbomb'),damage:8};s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p2',defenderId:'p1',card:hit};g._connect();assert.equal(a.specialUsed,true);assert.equal(a.adrenaline,before,'incoming shift -1 plus Built Different +1 nets to no change');
});


test("Survivor Series Series 1 is complete with Solo Sikoa, Jade Cargill and Nia Jax",()=>{
  const setStars=stars.filter(s=>s.setId==='survivor-series-series-1');
  assert.deepEqual(setStars.map(s=>s.id).sort(),['bron-breakker','drew-mcintyre','jacob-fatu','jade-cargill','nia-jax','randy-orton','sami-zayn','solo-sikoa'].sort());
  const expected={
    'solo-sikoa':{hp:66,momentum:{strike:6,strength:5,agility:1},card:'SVS1-040'},
    'jade-cargill':{hp:67,momentum:{strength:6,strike:4,agility:2},card:'SVS1-044'},
    'nia-jax':{hp:69,momentum:{strength:7,strike:4,agility:1},card:'SVS1-049'}
  };
  for(const [id,x] of Object.entries(expected)){
    const star=starById.get(id);assert.ok(star,id);assert.equal(star.hp,x.hp,id);assert.deepEqual(star.starterMomentum,x.momentum,id);
    assert.equal(decks[id].length,60,id);assert.equal(decks[id].filter(c=>c.kind==='momentum').length,12,id);assert.equal(CARD_NUMBER_BY_ID[star.cardId]?.cardCode,x.card,id);
  }
  assert.equal(CARD_NUMBER_BY_ID['solo-sikoa-spinning-solo']?.cardCode,'SVS1-036');
  assert.equal(CARD_NUMBER_BY_ID['solo-sikoa-samoan-spike']?.cardCode,'SVS1-037');
  assert.equal(CARD_NUMBER_BY_ID['jade-cargill-jaded']?.cardCode,'SVS1-041');
  assert.equal(CARD_NUMBER_BY_ID['nia-jax-avalanche-samoan-drop']?.cardCode,'SVS1-045');
  assert.equal(CARD_NUMBER_BY_ID['nia-jax-annihilator']?.cardCode,'SVS1-046');
});

test("Solo Sikoa Street Champion, Sole Survivor and Spinning Solo chain execute",()=>{
  const solo=starById.get('solo-sikoa'),opp=starById.get('sami-zayn'),g=new MatchEngine({p1:solo,p2:opp,decks,rng:rng(1209)}),st=g.state(),a=st.players.p1,d=st.players.p2;
  for(const m of ['strength','strike','technical','agility'])a.momentum[m]=99;
  d.adrenaline=5;d.momentum.attitude=5;const kick=byName('Superkick'),before=d.adrenaline;st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:kick};g._connect();assert.equal(d.adrenaline,before-2,'normal connect drains 1 and Street Champion drains an additional 1');
  const afterFirst=d.adrenaline;st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:byName('Running Clothesline')};g._connect();assert.equal(d.adrenaline,Math.max(0,afterFirst-1),'Street Champion fires only once per Control sequence');
  const spin=allGameplayCards.find(c=>c.id==='solo-sikoa-spinning-solo'),spike=allGameplayCards.find(c=>c.id==='solo-sikoa-samoan-spike');a.deck=[spike];st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:spin};g._connect();assert.ok(a.hand.some(c=>c.id===spike.id));assert.equal(a.namedDiscount['Samoan Spike'],2);
  const special=allGameplayCards.find(c=>c.id==='special-solo-sikoa');a.hand=[special];a.deck=[byName('Punch'),byName('Headbutt')];a.specialUsed=false;st.phase='ACTION';st.playerInControl='p1';assert.equal(g.passTurn('p1'),true);assert.equal(st.phase,'TRIGGER_RESPONSE');assert.equal(st.pendingTriggeredSpecial?.specialType,'soleSurvivor');assert.equal(a.specialUsed,false,'trigger is not consumed before the player chooses');assert.equal(g.resolveTriggeredSpecial('p1',true),true);assert.equal(a.specialUsed,true);assert.equal(a.hand.length,3,'the third draw comes from the recycled used-page pile after the two-card Playbook is exhausted');assert.ok(st.log.some(e=>e.type==='PLAYBOOK_RECYCLED'&&e.playerId==='p1'));assert.ok(st.log.some(e=>e.type==='SPECIAL_EFFECT'&&e.effect==='sole-survivor'));
});

test("Jade Cargill uses the shared Pump Kick as her Trademark setup and Superhuman fires",()=>{
  const jade=starById.get('jade-cargill'),opp=starById.get('solo-sikoa'),g=new MatchEngine({p1:jade,p2:opp,decks,rng:rng(2209)}),st=g.state(),a=st.players.p1,d=st.players.p2;
  for(const m of ['strength','strike','technical','agility'])a.momentum[m]=99;
  const pump=allGameplayCards.find(c=>c.id==='pump-kick'),jaded=allGameplayCards.find(c=>c.id==='jade-cargill-jaded');assert.equal(pump.cost,6);assert.equal(pump.damage,9);assert.equal(pump.trademark,true);assert.equal(pump.superstarId,null);
  a.deck=[jaded];const ad=a.adrenaline;st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:pump};g._connect();assert.ok(a.hand.some(c=>c.id===jaded.id));assert.equal(a.namedDiscount['Jaded'],2);assert.equal(a.adrenaline,ad+2,'move connect + Believe the Hype each add 1 Adrenaline');
  const special=allGameplayCards.find(c=>c.id==='special-jade-cargill'),power=byName('Spinebuster');a.hand=[special];a.deck=[byName('Punch')];a.specialUsed=false;st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:power};g._connect();assert.equal(a.specialUsed,true);assert.equal(a.nextDamageBuff,2);assert.ok(st.log.some(e=>e.type==='SPECIAL_EFFECT'&&e.effect==='superhuman'));
});

test("Nia Jax Crushing Weight and Not Like Most execute with the Annihilator chain",()=>{
  const nia=starById.get('nia-jax'),opp=starById.get('jade-cargill'),g=new MatchEngine({p1:nia,p2:opp,decks,rng:rng(3209)}),st=g.state(),a=st.players.p1,d=st.players.p2;
  assert.equal(a.momentum.strength,2);assert.equal(a.adrenaline,1);for(const m of ['strength','strike','technical','agility'])a.momentum[m]=99;
  const body=byName('Body Slam');st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:body};g._connect();assert.equal(d.posture,'on-mat');assert.equal(a.nextMoveDiscount,1);
  const avalanche=allGameplayCards.find(c=>c.id==='nia-jax-avalanche-samoan-drop'),ann=allGameplayCards.find(c=>c.id==='nia-jax-annihilator');a.deck=[ann];d.posture='standing';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:avalanche};g._connect();assert.ok(a.hand.some(c=>c.id===ann.id));assert.equal(a.namedDiscount['Annihilator'],2);
  const special=allGameplayCards.find(c=>c.id==='special-nia-jax');a.hand=[special];a.specialUsed=false;const hp=a.hp,ad=a.adrenaline,hit={...byName('Powerbomb'),damage:10};st.playerInControl='p2';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p2',defenderId:'p1',card:hit};g._connect();assert.equal(a.hp,hp-6);assert.equal(a.specialUsed,true);assert.equal(a.adrenaline,ad,'incoming move drains 1 Adrenaline and Not Like Most restores 1');assert.ok(st.log.some(e=>e.type==='SPECIAL_EFFECT'&&e.effect==='reduce-incoming-big'));
});

test("v0.11.98 shared move batch is registered, numbered and booster-ready",()=>{
  const expected={
    'shoulder-block':['SVS1-031',3,4,1],
    'shining-wizard':['SVS1-032',5,8,2],
    'double-underhook-facebuster':['SVS1-033',5,8,2],
    'steel-chair-to-the-back':['RAW1-034',4,7,2],
    'spanish-fly':['WC1-034',6,10,3],
    'second-rope-leg-drop':['SD1-034',5,8,2],
    'flair-chop':['EVO1-061',3,6,3]
  };
  for(const [id,[code,cost,damage,rarity]] of Object.entries(expected)){
    const card=allGameplayCards.find(c=>c.id===id); assert.ok(card,id); assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
    assert.equal(card.cost,cost,id); assert.equal(card.damage,damage,id); assert.equal(card.rarity,rarity,id); assert.equal(card.boosterEligible!==false,true,id); assert.equal(boosterEligible(card),isLaunchLiveSetId(card.setId),`${id} live booster gate`);
  }
  assert.equal(allGameplayCards.find(c=>c.id==='shoulder-block').groundOpponent,true);
  assert.deepEqual(allGameplayCards.find(c=>c.id==='shining-wizard').bodyDamage,{bodyPart:'head',pressure:1});
  assert.deepEqual(allGameplayCards.find(c=>c.id==='steel-chair-to-the-back').bodyDamage,{bodyPart:'back',pressure:1});
  assert.equal(allGameplayCards.find(c=>c.id==='spanish-fly').groundOpponent,true);
  assert.equal(allGameplayCards.find(c=>c.id==='second-rope-leg-drop').groundedOnly,true);
});

test("Charlotte uses Flair Chop while shared Chop remains intact and Wooo! triggers from Flair Chop",()=>{
  const shared=allGameplayCards.find(c=>c.id==='chop'),flair=allGameplayCards.find(c=>c.id==='flair-chop'),wooo=allGameplayCards.find(c=>c.id==='special-charlotte-flair');
  assert.ok(shared&&flair&&wooo); assert.equal(shared.superstarId,null); assert.equal(shared.cost,2); assert.equal(shared.damage,4);
  assert.deepEqual(flair.allowedSuperstarIds,['charlotte-flair']); assert.equal(flair.trademark,true); assert.deepEqual(flair.bodyDamage,{bodyPart:'chest',pressure:1});
  assert.equal(decks['charlotte-flair'].filter(c=>c.id==='chop').length,0); assert.equal(decks['charlotte-flair'].filter(c=>c.id==='flair-chop').length,4);
  const charlotte=starById.get('charlotte-flair'),opp=stars.find(s=>s.id!=='charlotte-flair'); const g=new MatchEngine({p1:charlotte,p2:opp,decks,rng:rng(1198)}),st=g.state(),p=st.players.p1,d=st.players.p2;
  p.hand=[flair,wooo]; p.momentum.strike=99; const hp=d.hp,adrenalineBefore=p.adrenaline; st.playerInControl='p1'; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:flair}; g._connect();
  assert.equal(d.hp,hp-6); assert.equal(d.submissionDamage.chest,1); assert.equal(p.specialUsed,true); assert.equal(p.adrenaline,adrenalineBefore+3,'move connect gives +1 Adrenaline and Wooo! adds +2');
  assert.ok(st.log.some(e=>e.type==='SPECIAL_EFFECT'&&e.effect==='flair-chop-wooo'));
});


test("v0.12.01 shared fundamentals batch is registered, numbered and executes its counter/body-part rules",()=>{
  const expected={
    'elbow-to-back-of-head':['SVS1-034',3,4,1],
    'hip-toss':['SVS1-035',2,2,1],
    'leg-drop':['MITB1-034',3,5,1],
    'choke-on-the-ropes':['RAW1-035',3,0,1],
    'chops-in-the-corner':['SD1-035',4,5,2]
  };
  for(const [id,[code,cost,damage,rarity]] of Object.entries(expected)){
    const card=allGameplayCards.find(c=>c.id===id);assert.ok(card,id);assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
    assert.equal(card.cost,cost,id);assert.equal(card.damage,damage,id);assert.equal(card.rarity,rarity,id);assert.equal(card.boosterOnly,true,id);assert.equal(card.boosterEligible!==false,true,id);assert.equal(boosterEligible(card),isLaunchLiveSetId(card.setId),`${id} live booster gate`);
  }
  const elbow=allGameplayCards.find(c=>c.id==='elbow-to-back-of-head'),hip=allGameplayCards.find(c=>c.id==='hip-toss'),leg=allGameplayCards.find(c=>c.id==='leg-drop'),choke=allGameplayCards.find(c=>c.id==='choke-on-the-ropes'),chops=allGameplayCards.find(c=>c.id==='chops-in-the-corner');
  assert.deepEqual(elbow.bodyDamage,{bodyPart:'head',pressure:1});assert.deepEqual(chops.bodyDamage,{bodyPart:'chest',pressure:1});
  assert.deepEqual(hip.counters,['grapple']);assert.equal(hip.groundOpponent,true);assert.equal(leg.groundedOnly,true);assert.deepEqual(choke.submission,{bodyPart:'head',pressure:3});
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(1201)}),st=g.state(),a=st.players.p1,d=st.players.p2;a.momentum.technical=99;a.momentum.strike=99;
  const grapple=allGameplayCards.find(c=>c.kind==='move'&&c.moveType==='grapple'&&!c.defensiveOnly&&c.id!==hip.id);st.phase='COUNTER';st.proposedMove={attackerId:'p2',defenderId:'p1',card:grapple};a.hand=[hip];const hpHip=d.hp;assert.equal(g.counter('p1',hip),true);assert.notEqual(st.phase,'COUNTER');assert.equal(d.hp,Math.max(0,hpHip-(hip.damage??0)));
  const g2=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(2201)}),st2=g2.state(),d2=st2.players.p2;st2.phase='RESOLVE_MOVE';st2.proposedMove={attackerId:'p1',defenderId:'p2',card:elbow};g2._connect();assert.equal(d2.submissionDamage.head,1);assert.notEqual(st2.phase,'SUBMISSION_MAINTAIN');
});

test("v0.12.01 Survivor Series uses the official 2026 Houston asset and official-derived navy-orange presentation",async()=>{
  const fs=await import('node:fs');
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  const source=fs.readFileSync(new URL('../assets/branding/survivor-series-series-1/SOURCE.md',import.meta.url),'utf8');
  assert.match(ui,/survivor-series-wargames-houston-2026\.png/);assert.match(studio,/survivor-series-wargames-houston-2026\.png/);
  assert.doesNotMatch(ui,/survivor-series-logo\.svg/);assert.equal(fs.existsSync(new URL('../assets/branding/survivor-series-series-1/survivor-series-logo.svg',import.meta.url)),false);
  assert.match(css,/presentation-survivor-series-series-1\{--presentation-accent:#ff6b1b/);assert.match(source,/wwe\.com\/shows\/survivor-series-wargames\/2026/);
});

test("v0.11.99 Play Pile inspector uses a mobile-safe non-nested hit target and HUD headshots fill their viewport", async()=>{
  const fs=await import('node:fs');
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.ok(ui.includes('class="play-pile-card-trigger" data-open-play-pile="${card.id}" role="button" tabindex="0"'));
  assert.equal(ui.includes('<button type="button" class="play-pile-card-trigger"'),false,'Play Pile must not nest a collectible button inside another button');
  assert.ok(ui.includes('superstar-card-modal play-pile-card-modal'),'Play Pile reuses the front-of-screen Superstar inspector presentation');
  assert.ok(css.includes('.play-pile-card-trigger .ccg-card'));
  assert.ok(css.includes('pointer-events:none!important'));
  assert.ok(css.includes('object-fit:cover!important'));
  assert.ok(css.includes('min-height:96px!important'));
});

test("Card Art Studio keeps every set renderer and card-selection wiring intact", async()=>{
  const fs=await import('node:fs');
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  const data=fs.readFileSync(new URL('../js/tools/card-art-studio-data.js',import.meta.url),'utf8');
  const html=fs.readFileSync(new URL('../tools/card-art-studio.html',import.meta.url),'utf8');
  const renderers=['drawSummerSlam','drawHall','drawEvolution','drawRewards','drawRaw','drawWorldsCollide','drawMoneyInTheBank','drawSmackDown','drawSurvivorSeries'];
  for(const fn of renderers) assert.match(studio,new RegExp(`function ${fn}\\(`),`${fn} renderer must remain defined`);
  assert.match(studio,/function isDanhausenHalloweenCard\(/,'SmackDown Danhausen variant helper must remain defined');
  for(const setId of ['summerslam-series-1','hall-of-fame-series-1','evolution-series-1','season-1-final-boss','season-2-whos-next','raw-series-1','worlds-collide-series-1','money-in-the-bank-series-1','smackdown-series-1','survivor-series-series-1']){
    assert.ok(studio.includes(`set===\"${setId}\"`)||setId==='summerslam-series-1',`${setId} must be routed to a renderer`);
    assert.ok(data.includes(`\"setId\":\"${setId}\"`),`${setId} must have Studio cards`);
  }
  assert.match(studio,/\$\("#card-select"\)\.addEventListener\("change",prepareSelectedCard\)/,'changing Card must prepare the newly selected card');
  assert.match(studio,/sel\.value=cards\.some\(c=>c\.id===previous\)\?previous:cards\[0\]\.id;prepareSelectedCard\(\)/,'filter changes must select and prepare a valid card');
  assert.match(studio,/\$\("#card-summary-name"\)\.textContent=card\.name/,'selected card name must update from current card');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.match(html,new RegExp(`card-art-studio\\.js\\?v=${pkg.version.replaceAll('.', '\\.')}`),'Studio script cache key must match the current release');
});


test("v0.12.03 Card Art Studio premium frame renders set border, rarity stars and structured footer", async()=>{
  const fs=await import('node:fs');
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  const data=fs.readFileSync(new URL('../js/tools/card-art-studio-data.js',import.meta.url),'utf8');
  assert.match(studio,/function drawRarityStars\(/);
  assert.match(studio,/for\(let i=0;i<rarity;i\+\+\)/,'rarity should determine vertical star count');
  assert.ok(studio.includes('fillText("★",x,y)'),'rarity stars should be rendered as gold stars');
  assert.match(studio,/function drawMoveStatFigure\(/,'move cost and damage should use the current legible stat figure treatment');
  assert.ok(studio.includes('Bahnschrift Condensed'),'card-name typography should use the premium condensed display stack');
  assert.ok(studio.includes('Bahnschrift SemiCondensed'),'card metadata should use the premium semi-condensed stack');
  assert.equal(studio.includes('italic 1000'),false,'premium card names should no longer use the old heavy italic treatment');
  assert.ok(studio.includes('set.border||set.accent'),'outer border must use the set main colour');
  assert.ok(data.includes('"rarity":4'),'Studio dataset must carry rarity for four-star cards');
  assert.ok(data.includes('"moveType":"strike"'),'Studio dataset should carry move type for the footer');
});

test("v0.12.04 Card Art Studio uses premium trading-card typography", async()=>{
  const fs=await import('node:fs');
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  const html=fs.readFileSync(new URL('../tools/card-art-studio.html',import.meta.url),'utf8');
  assert.ok(studio.includes('Bahnschrift Condensed'),'move/card names should use the condensed display stack');
  assert.ok(studio.includes('Bahnschrift SemiCondensed'),'metadata should use the semi-condensed information stack');
  assert.ok(studio.includes('DIN Alternate'),'COST/DAMAGE values should use the condensed number stack');
  assert.equal(studio.includes('italic 1000'),false,'old exaggerated heavy italic name typography must remain retired');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.match(html,new RegExp(`CARD ART STUDIO · v${pkg.version.replaceAll('.', '\\.')}`),'Studio visible build label should match the current release');
});


test("v0.12.06 Card Art Studio keeps the v0.12.05 spacing/stat presentation", async()=>{
  const fs=await import('node:fs');
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  const html=fs.readFileSync(new URL('../tools/card-art-studio.html',import.meta.url),'utf8');
  assert.ok(studio.includes('const x=51*s,y=62*s+i*31*s;'),'rarity stars should sit one outer-border width farther inside the card');
  assert.ok(studio.includes('cardFont(META_STACK,17.5,950)'),'COST/DAMAGE labels should use the enlarged mobile-readable treatment');
  assert.ok(studio.includes('cardFont(NUMBER_STACK,78,1000)'),'COST/DAMAGE values should use the current dominant mobile-readable sizing');
  assert.equal(studio.includes('ctx.fillText(card.cardCode||"WWE LEGACY",w*.085,h*.958)'),false,'bottom-left white collector microtext should be removed from the card face');
  assert.equal(studio.includes('ctx.fillText("WWE LEGACY • COLLECTIBLE CARD GAME",w*.915,h*.958)'),false,'bottom-right white footer microtext should be removed from the card face');
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.match(html,new RegExp(`CARD ART STUDIO · v${pkg.version.replaceAll('.', '\\.')}`),'Studio visible build label should match the current release');
});

test("v0.12.06 Deck Lab supports owned-category browsing, legality reasons and editable Lead Off slots",()=>{
  const p=createProfile("roman-reigns");
  const star=starById.get("roman-reigns");
  const draft=recommendedDeckDraft(star.id);
  const illegal=collectionCards.find(c=>c.kind==='move'&&c.superstarId&&c.superstarId!==star.id);
  assert.ok(illegal);
  const eligibility=cardEligibilityForSuperstar(star,illegal);
  assert.equal(eligibility.legal,false);
  assert.ok(eligibility.reason.length>0);
  const replacement=collectionCards.find(c=>c.kind==='momentum'&&totalOwnedCopies(p,c.id)>0&&c.id!==draft[0].id);
  assert.ok(replacement);
  const changed=replaceLeadOffSlot(p,star.id,draft,0,replacement.id);
  assert.equal(changed.length,60);
  assert.equal(changed[0].id,replacement.id);
  assert.equal(validateDeckDraft(p,star.id,changed,selectedEntranceId(p,star.id)).healthy,true);
});

test("v0.12.06 Deck Lab recommendations are guidance rather than hard composition locks",()=>{
  const p=createProfile("roman-reigns");
  const star=starById.get("roman-reigns");
  const draft=recommendedDeckDraft(star.id);
  const recommended=recommendedCategoryCounts(star.id);
  const current=currentCategoryCounts(draft);
  assert.deepEqual(current,recommended);
  // Deck validity is based on legal 60-page construction, not an exact 12-Momentum quota.
  const firstMove=draft.findIndex((e,i)=>i>=5&&collectionCards.find(c=>c.id===e.id)?.kind==='move');
  const momentum=collectionCards.find(c=>c.kind==='momentum'&&totalOwnedCopies(p,c.id)>0);
  addOwnedCard(p,momentum.id,{amount:1});
  const custom=draft.map(e=>({...e}));
  custom[firstMove]={id:momentum.id,foil:false};
  assert.equal(custom.filter(e=>collectionCards.find(c=>c.id===e.id)?.kind==='momentum').length,13);
  assert.equal(validateDeckDraft(p,star.id,custom,selectedEntranceId(p,star.id)).healthy,true);
});

test("v0.12.55 selected Entrances persist separately from the 60-page deck and Superstar Entrances are booster chase cards",()=>{
  const p=createProfile("roman-reigns");
  const defaultEntrance=selectedEntranceId(p,"roman-reigns");
  assert.equal(defaultEntrance,'entrance-amazing');
  assert.equal(setSelectedEntrance(p,"roman-reigns",defaultEntrance),true);
  assert.equal(p.selectedEntrances["roman-reigns"],defaultEntrance);
  assert.equal(boosterEligible({id:"shared-entrance-test",kind:"entrance",setId:"summerslam-series-1",superstarId:null}),true);
  assert.equal(boosterEligible({id:"roman-entrance-test",kind:"entrance",setId:"summerslam-series-1",superstarId:"roman-reigns"}),true);
  assert.equal(boosterEligible({id:"future-shared-entrance-test",kind:"entrance",setId:"raw-series-1",superstarId:null}),false);
});

test("v0.12.54 scrollable navigation keeps Challenges and Deck Lab while Options is retired",async()=>{
  const fs=await import('node:fs');
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  for(const target of ['challenges','deck-builder']) assert.ok(html.includes(`data-mobile-nav="${target}"`),`${target} must be in the bottom nav`);
  assert.equal(html.includes('data-mobile-nav="options"'),false,'Options must be removed from bottom navigation');
  assert.ok(app.includes('showDeckBuilder()'));
  assert.ok(app.includes('id="menu-decks"'));
  assert.ok(app.includes('id="menu-challenges"'));
  assert.equal(app.includes('id="menu-options"'),false,'Options must be removed from Home');
  assert.ok(css.includes('overflow-x:auto!important'),'bottom nav must remain horizontally scrollable');
});

test("v0.12.06 held mobile presentation pass compacts select, enlarges show logos and moves Entrance callouts off-card",async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.ok(css.includes('height:236px!important'),'mobile Superstar select cards should be compact enough for one viewport');
  assert.ok(css.includes('width:min(560px,84vw)!important'),'Main Event show logo should be substantially larger');
  assert.ok(css.includes('width:min(440px,72vw)!important'),'Entrance show logo should be substantially larger');
  assert.ok(app.includes('entrance-crowd-chants'),'Entrance effect callouts should live outside the card stage');
  assert.equal(/entrance-stage[^`]*entrance-callouts/.test(app),false,'callouts must not overlay the Entrance card');
});

test("v0.12.06 match buttons and Momentum presentation use live show/method colours",async()=>{
  const fs=await import('node:fs');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  assert.ok(css.includes('.hand-card-action button.primary:not(:disabled)'),'hand Play buttons should inherit presentation colours');
  assert.ok(css.includes('--presentation-accent2:#e5cf58!important'),'Money in the Bank should use the arena green/gold family');
  assert.ok(css.includes('color-mix(in srgb,var(--mom) 64%'),'Momentum faces should use stronger method colour saturation');
  assert.ok(app.includes('return momentumMockupMarkup(card);'),'live Momentum cards should render from the colour-responsive UI template');
});


test("v0.12.07 Deck Lab category pickers use a premium three-wide full-card grid", async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.match(app,/deck-lab-card-picker deck-lab-card-grid/,'Deck Lab picker should render the visual card grid');
  assert.match(app,/extraClass:"deck-lab-picker-ccg"/,'Deck Lab picker should show complete collectible card fronts');
  assert.match(app,/deck-card-invalid-reason/,'invalid owned cards should remain visible with a reason');
  assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/,'mobile Deck Lab picker should remain three cards wide');
  assert.match(css,/deck-lab-card-tile\.is-invalid[\s\S]*filter:grayscale/,'invalid cards should be visually shaded rather than hidden');
  assert.match(css,/deck-card-stepper/,'category cards should use compact card-count controls');
});

test("v0.12.08 Deck Lab roster uses full collectible-style Superstar cards", async()=>{
  const fs=await import('node:fs');
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.ok(ui.includes("selectionCarouselMarkup(unlocked,deckBuilderStarId,'deck-lab-select')"));
  assert.ok(ui.includes('generated-superstar-preview'));
  assert.ok(ui.includes('superstarPreviewCardMarkup(star.id,"selection-owned-superstar-card")'));
  assert.ok(css.includes('.deck-lab-roster-selector .superstar-select-carousel'));
  assert.ok(css.includes('aspect-ratio:.68'));
});

test("v0.12.47 Play mode tiles use non-interactive Superstar photography without nested buttons or card crops", async()=>{
  const fs=await import('node:fs');
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.equal(ui.includes('class="mode-full-card-art"'),false);
  assert.equal(ui.includes('superstarPreviewCardMarkup(starId,"mode-feature-card")'),false);
  assert.ok(ui.includes('class="legacy-mode-superstar"'));
  assert.ok(ui.includes('const portraitMarkup = menuSuperstarPhotoMarkup;'));
  assert.ok(ui.includes('<article id="play-exhibition" role="button" tabindex="0"'));
  assert.equal(ui.includes('<button id="play-exhibition" class="play-mode-card'),false);
  assert.ok(css.includes('.legacy-mode-superstar img.official-menu-superstar-photo'));
});

test("v0.12.08 zero-value navigation alerts are removed instead of rendering red zero badges", async()=>{
  const fs=await import('node:fs');
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  assert.ok(ui.includes('if (badge && count < 1) badge.remove();'));
  assert.ok(ui.includes("return count > 0 ? `<i class=\"attention-badge\">"));
});

test("v0.12.08 Season and Challenges use icon-led premium dashboard components", async()=>{
  const fs=await import('node:fs');
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.ok(ui.includes('season-road-command'));
  assert.ok(ui.includes('season-road-icon'));
  assert.ok(ui.includes('challenge-overview-strip'));
  assert.ok(ui.includes('challenge-type-icon'));
  assert.ok(ui.includes("uiIcon('bolt')"));
  assert.ok(css.includes('.season-road-command'));
  assert.ok(css.includes('.challenge-set-stats'));
  assert.ok(css.includes('.premium-challenge-card'));
});

test("Season 2 Goldberg reward package is locked, future-scoped and collector-numbered",()=>{
  const goldberg=starById.get('goldberg');
  assert.ok(goldberg);
  assert.equal(goldberg.nickname,'Who’s Next?');
  assert.equal(goldberg.setId,'season-2-whos-next');
  assert.equal(goldberg.seasonExclusive,true);
  assert.equal(goldberg.developmentOnly,true);
  assert.equal(goldberg.hp,69);
  assert.deepEqual(goldberg.methodLimits,{strength:null,strike:null,agility:2,technical:1});
  assert.deepEqual(goldberg.starterMomentum,{strength:6,strike:6});
  assert.equal(SEASON_2_COMPLETION_SUPERSTAR,'goldberg');
  assert.equal(seasonExclusiveSuperstars.goldberg?.seasonId,'season-2');
  assert.equal(seasonExclusiveSuperstars.goldberg?.boosterEligible,false);
  assert.equal(seasonExclusiveSuperstars.goldberg?.fullDeckReward,true);
  assert.equal(boosterEligible(season2GoldbergCards['goldberg-spear']),false);
  assert.equal(boosterEligible(allGameplayCards.find(c=>c.id==='rock-bottom')),false);
  assert.equal(Object.keys(season2GoldbergCards).length,5);
  assert.equal(CARD_NUMBER_BY_ID['goldberg-military-press-powerslam']?.cardCode,'S2WN-001');
  assert.equal(CARD_NUMBER_BY_ID['goldberg-spear']?.cardCode,'S2WN-002');
  assert.equal(CARD_NUMBER_BY_ID['goldberg-jackhammer']?.cardCode,'S2WN-003');
  assert.equal(CARD_NUMBER_BY_ID['entrance-goldberg']?.cardCode,'S2WN-004');
  assert.equal(CARD_NUMBER_BY_ID['special-goldberg']?.cardCode,'S2WN-005');
  assert.equal(CARD_NUMBER_BY_ID['superstar-goldberg']?.cardCode,'S2WN-006');
});

test("Goldberg has a complete 60-page reward deck and Who’s Next? Entrance fires exactly",()=>{
  const goldberg=starById.get('goldberg'),rock=starById.get('the-rock');
  assert.equal(decks.goldberg.length,60);
  assert.equal(decks.goldberg.filter(c=>c.kind==='momentum').length,12);
  assert.equal(decks.goldberg.filter(c=>c.id==='momentum-strength').length,6);
  assert.equal(decks.goldberg.filter(c=>c.id==='momentum-strike').length,6);
  const g=new MatchEngine({p1:goldberg,p2:rock,decks,rng:rng(1210)}),p=g.state().players.p1;
  assert.equal(p.momentum.strength,2);
  assert.equal(p.momentum.strike,2);
  assert.equal(p.adrenaline,2);
  assert.equal(p.momentum.attitude,2);
});

test("Goldberg The Streak builds, discounts prestige Moves, gets an extra Military Press counter and breaks on lost Control",()=>{
  const goldberg=starById.get('goldberg'),rock=starById.get('the-rock');
  const military=allGameplayCards.find(c=>c.id==='goldberg-military-press-powerslam');
  const spear=allGameplayCards.find(c=>c.id==='goldberg-spear');
  const jackhammer=allGameplayCards.find(c=>c.id==='goldberg-jackhammer');
  assert.equal(jackhammer.cost,12);
  assert.equal(jackhammer.damage,19);
  const g=new MatchEngine({p1:goldberg,p2:rock,decks,rng:rng(1211)}),s=g.state(),p=s.players.p1;
  p.hand=[military]; p.momentum.strength=10; p.momentum.strike=10;
  assert.equal(g.declareMove('p1',military),true);
  assert.equal(g.passCounter('p2'),true);
  assert.equal(p.streakCounters,2,'Military Press earns normal Streak plus its additional Streak counter');
  assert.equal(moveEligibility(s,'p1',spear).effectiveCost,4,'Military Press search discount stacks with 2 Streak counters');
  assert.equal(moveEligibility(s,'p1',jackhammer).effectiveCost,10);
  assert.equal(g.passTurn('p1'),true);
  assert.equal(p.streakCounters,0,'losing Control breaks The Streak');
  assert.ok(s.log.some(e=>e.effect==='streak-broken'&&e.lost===2));
});

test("Goldberg Spear chains into Jackhammer and 173–0 preserves Control and Streak through a Counter",()=>{
  const goldberg=starById.get('goldberg'),rock=starById.get('the-rock');
  const spear=allGameplayCards.find(c=>c.id==='goldberg-spear');
  const jackhammer=allGameplayCards.find(c=>c.id==='goldberg-jackhammer');
  const special=allGameplayCards.find(c=>c.id==='special-goldberg');
  const standingSwitch=allGameplayCards.find(c=>c.id==='standing-switch');

  const chain=new MatchEngine({p1:goldberg,p2:rock,decks,rng:rng(1212)}),cs=chain.state(),cp=cs.players.p1,co=cs.players.p2;
  cp.streakCounters=2; cp.momentum.strength=10; cp.momentum.strike=10; co.adrenaline=3; co.momentum.attitude=3;
  cp.hand=[spear]; cp.deck=[jackhammer,...cp.deck.filter(c=>c.id!=='goldberg-jackhammer')];
  assert.equal(chain.declareMove('p1',spear),true);
  assert.equal(chain.passCounter('p2'),true);
  assert.equal(co.adrenaline,1,'Spear connection and 2+ pre-declare Streak each drain 1 Adrenaline');
  assert.equal(cp.streakCounters,3);
  assert.ok(cp.hand.some(c=>c.id==='goldberg-jackhammer'));
  assert.equal(cp.namedDiscount.Jackhammer,3);
  assert.equal(moveEligibility(cs,'p1',cp.hand.find(c=>c.id==='goldberg-jackhammer')).effectiveCost,6,'Spear discount and max Streak stack into Jackhammer');

  const retain=new MatchEngine({p1:goldberg,p2:rock,decks,rng:rng(1213)}),rs=retain.state(),rp=rs.players.p1,ro=rs.players.p2;
  rp.streakCounters=2; rp.adrenaline=0; rp.momentum.attitude=0; rp.momentum.strength=10; rp.momentum.strike=10;
  ro.momentum.strike=10;
  rp.hand=[spear,special]; ro.hand=[standingSwitch];
  assert.equal(retain.declareMove('p1',spear),true);
  assert.equal(retain.counter('p2',standingSwitch),true);
  assert.equal(rs.playerInControl,'p1');
  assert.equal(rs.phase,'ACTION');
  assert.equal(rp.streakCounters,2);
  assert.equal(rp.adrenaline,1);
  assert.equal(rp.specialUsed,true);
  assert.ok(rs.log.some(e=>e.type==='SPECIAL_EFFECT'&&e.effect==='173-0'));
  assert.ok(rs.log.some(e=>e.type==='CONTROL_RETAINED'&&e.reason==='173-0'));
});


test("v0.12.12 Roman replaces Sitout Crucifix Powerbomb with Ooh Ahh!! at SS1-034",()=>{
  const deck=decks['roman-reigns'],ooh=allGameplayCards.find(c=>c.id==='roman-reigns-ooh-ahh');
  assert.ok(ooh);assert.equal(allGameplayCards.some(c=>c.id==='roman-reigns-sitout-crucifix-powerbomb'),false);
  assert.equal(deck.filter(c=>c.id==='roman-reigns-ooh-ahh').length,1);assert.equal(deck.filter(c=>c.id==='headbutt').length,2);assert.equal(deck.length,60);
  assert.equal(ooh.kind,'action');assert.equal(ooh.cost,2);assert.equal(ooh.rarity,3);assert.equal(ooh.superstarId,'roman-reigns');assert.equal(ooh.maxCopies,1);
  assert.equal(CARD_NUMBER_BY_ID['roman-reigns-ooh-ahh']?.cardCode,'SS1-034');assert.equal(CARD_NUMBER_BY_ID['roman-reigns-sitout-crucifix-powerbomb'],undefined);
});

test("Ooh Ahh!! costs 2, tutors Roman's Spear, discounts it, and converts an already-held Spear to Adrenaline",()=>{
  const roman=starById.get('roman-reigns'),punk=starById.get('cm-punk'),ooh=allGameplayCards.find(c=>c.id==='roman-reigns-ooh-ahh'),spear=allGameplayCards.find(c=>c.id==='roman-reigns-spear');
  const g=new MatchEngine({p1:roman,p2:punk,decks,rng:rng(1212)}),s=g.state(),p=s.players.p1;p.hand=[ooh];p.deck=[spear,...p.deck.filter(c=>c.id!==spear.id)];p.momentum.strength=1;p.momentum.strike=0;
  assert.equal(canPlayAction(s,'p1',ooh),false);p.momentum.strength=2;assert.equal(canPlayAction(s,'p1',ooh),true);assert.equal(g.playAction('p1',ooh),true);
  assert.ok(p.hand.some(c=>c.id===spear.id));assert.equal(p.namedDiscount["Roman's Spear"],1);p.momentum.strength=10;assert.equal(moveEligibility(s,'p1',p.hand.find(c=>c.id===spear.id)).effectiveCost,9);
  const g2=new MatchEngine({p1:roman,p2:punk,decks,rng:rng(1213)}),s2=g2.state(),p2=s2.players.p1,ooh2=allGameplayCards.find(c=>c.id==='roman-reigns-ooh-ahh'),spear2=allGameplayCards.find(c=>c.id==='roman-reigns-spear');
  p2.hand=[ooh2,spear2];p2.momentum.strength=2;p2.momentum.strike=0;const before=p2.adrenaline;assert.equal(g2.playAction('p1',ooh2),true);assert.equal(p2.adrenaline,before+1);assert.equal(p2.namedDiscount["Roman's Spear"],1);
});


test("v0.12.12 public game exposes only the three launch series",()=>{
  assert.deepEqual([...LAUNCH_LIVE_SET_IDS],["summerslam-series-1","hall-of-fame-series-1","evolution-series-1"]);
  const launchStars=stars.filter(star=>isLaunchLiveSetId(star.setId));
  const launchCards=collectionCards.filter(card=>isLaunchLiveSetId(card.setId));
  assert.equal(launchStars.length,24);
  assert.equal(launchCards.length,317);
  assert.equal(exhibitionOpponentIds("roman-reigns").length,23);
  assert.ok(exhibitionOpponentIds("roman-reigns").every(id=>isLaunchLiveSetId(starById.get(id)?.setId)));
  for(const setId of ["raw-series-1","worlds-collide-series-1","money-in-the-bank-series-1","smackdown-series-1","survivor-series-series-1","season-2-whos-next"]){
    assert.equal(isUnreleasedSetId(setId),true,setId);
    assert.equal(collectionCards.filter(card=>card.setId===setId).some(boosterEligible),false,setId);
  }
});

test("v0.12.12 migration strips unreleased Superstar, card and pack state without deleting authored data",()=>{
  const p=createProfile("roman-reigns");
  const bron=starById.get("bron-breakker"),goldberg=starById.get("goldberg");
  assert.ok(bron&&goldberg);
  p.unlockedSuperstars.push(bron.id,goldberg.id);
  const futureCard=collectionCards.find(card=>card.setId==="survivor-series-series-1"&&card.kind==="move");
  assert.ok(futureCard);
  p.ownedCards[futureCard.id]={normal:1,foil:0};
  p.savedDecks[bron.id]=[{id:futureCard.id,foil:false}];
  p.selectedEntrances[bron.id]=bron.entranceId;
  p.boosterCreditsBySet["survivor-series-series-1"]=3;
  p.championshipRoad.championshipPackCreditsBySet["survivor-series-series-1"]=2;
  const migrated=migrateProfile(p);
  assert.equal(migrated.unlockedSuperstars.includes(bron.id),false);
  assert.equal(migrated.unlockedSuperstars.includes(goldberg.id),false);
  assert.equal(migrated.ownedCards[futureCard.id],undefined);
  assert.equal(migrated.savedDecks[bron.id],undefined);
  assert.equal(migrated.selectedEntrances[bron.id],undefined);
  assert.equal(migrated.boosterCreditsBySet["survivor-series-series-1"],0);
  assert.equal(migrated.championshipRoad.championshipPackCreditsBySet["survivor-series-series-1"],0);
  assert.ok(allGameplayCards.some(card=>card.setId==="survivor-series-series-1"),"future authored data stays in development build");
});

test("v0.12.12 roadmap does not reveal unreleased Superstar names",()=>{
  const futureCopy=SEASON_1.roadmap.filter(node=>node.id!=="launch").map(node=>node.description).join(" ");
  const hiddenNames=["Logan Paul","Chad Gable","Raquel Rodriguez","Sol Ruca","Rey Mysterio","Dominik Mysterio","Penta","El Grande Americano","Jey Uso","LA Knight","Alexa Bliss","Finn Bálor","Tiffany Stratton","Chelsea Green","Damian Priest","Danhausen","Bron Breakker","Drew McIntyre","Randy Orton","Sami Zayn","Jacob Fatu","Solo Sikoa","Jade Cargill","Nia Jax","Goldberg"];
  for(const name of hiddenNames) assert.equal(futureCopy.includes(name),false,name);
});


test("v0.12.33 retained-Control successful Moves draw only for the defender",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(1214)}),s=g.state();
  const p=s.players.p1,d=s.players.p2; const before=p.hand.length,defenderBefore=d.hand.length;
  s.playerInControl='p1'; s.phase='POST_MOVE'; s.postMove={attackerId:'p1',defenderId:'p2',cardId:'punch'};
  assert.equal(g.endPostMove('p1'),true);
  assert.equal(s.turnNumber,2); assert.equal(s.playerInControl,'p1');
  assert.equal(p.hand.length,before,'retained controller does not draw');
  assert.equal(d.hand.length,defenderBefore+1,'defender replenishes during retained Control');
});

test("v0.12.41 submission tap-out is governed by persistent body-part damage versus current HP, with no artificial turn-3 gate",()=>{
  const attacker=stars[0],defender=stars[1],sub=allGameplayCards.find(c=>c.kind==='move'&&c.submission); assert.ok(sub);
  const g=new MatchEngine({p1:attacker,p2:defender,decks,rng:rng(1215)}),s=g.state(),a=s.players.p1,d=s.players.p2;
  a.hand=[sub,byName('Punch'),byName('Headbutt'),byName('Dropkick')].filter(Boolean); for(const m of ['agility','strength','strike','technical'])a.momentum[m]=99; a.adrenaline=99; d.hp=5; d.submissionDamage[sub.submission.bodyPart]=0;
  s.playerInControl='p1';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:{...sub,damage:0,submission:{...sub.submission,pressure:5}}};g._connect();
  assert.equal(s.phase,'MATCH_OVER'); assert.equal(s.finish.type,'submission');
});

test("current public module graph is cache-coherent and boots for fresh + migrated profiles",()=>{
  const here=path.dirname(fileURLToPath(import.meta.url));
  const root=path.resolve(here,"..");
  const pkg=JSON.parse(readFileSync(path.join(root,"package.json"),"utf8"));
  const version=pkg.version;
  const index=readFileSync(path.join(root,"index.html"),"utf8");
  assert.match(version,/^0\.\d+\.\d+$/);
  for(const asset of ["css/game.css","js/ui/app.js","manifest.webmanifest"]){
    assert.ok(index.includes(`${asset}?v=${version}`),`${asset} entrypoint stamp must match ${version}`);
  }
  const browserFiles=["js/ui/app.js","js/data/profile.js","js/data/boosters.js","js/data/catalogue.js","js/data/deck-builder.js","js/data/matchmaking.js","js/data/release.js"];
  for(const rel of browserFiles){
    const text=readFileSync(path.join(root,rel),"utf8");
    const mismatches=[...text.matchAll(/[?&]v=(0\.\d+\.\d+)/g)].map(m=>m[1]).filter(v=>v!==version);
    assert.deepEqual(mismatches,[],`${rel} contains stale cache stamps`);
  }
  const walkJs=(dir)=>{
    const out=[];
    for(const ent of readdirSync(dir,{withFileTypes:true})){
      const full=path.join(dir,ent.name);
      if(ent.isDirectory())out.push(...walkJs(full));
      else if(ent.isFile()&&ent.name.endsWith('.js'))out.push(full);
    }
    return out;
  };
  for(const file of walkJs(path.join(root,'js'))){
    const text=readFileSync(file,'utf8');
    for(const m of text.matchAll(/(?:from\s+|import\s*\(\s*)["'](\.\.?\/[^"'?]+\.js)(?:\?v=([^"']+))?["']/g)){
      assert.equal(m[2],version,`${path.relative(root,file)} nested import ${m[1]} must be stamped ${version}`);
    }
  }

  const appUrl=pathToFileURL(path.join(root,"js/ui/app.js")).href;
  const runBoot=(rawProfile)=>{
    const probe=`
class FakeEl { constructor(id=''){this.id=id;this.hidden=false;this.style={};this.dataset={};this.classList={toggle(){},add(){},remove(){},contains(){return false}};this.innerHTML='';this.textContent='';} setAttribute(){} remove(){} appendChild(){} addEventListener(){} querySelector(){return null} querySelectorAll(){return []} }
const gameEl=new FakeEl('game'), navEl=new FakeEl('mobile-game-nav'), body=new FakeEl('body');
globalThis.document={body,documentElement:{scrollTop:0},querySelector(sel){if(sel==='#game')return gameEl;if(sel==='#mobile-game-nav')return navEl;return null},querySelectorAll(){return []},createElement(){return new FakeEl()}};
globalThis.window={scrollTo(){}}; globalThis.history={scrollRestoration:'auto'}; globalThis.requestAnimationFrame=(fn)=>{fn();return 1};
const RAW=${JSON.stringify(rawProfile)}; globalThis.localStorage={getItem(key){return key==='wa-modern-profile-v2'?RAW:null},setItem(){},removeItem(){}}; globalThis.setInterval=()=>0;
await import(${JSON.stringify(appUrl)}+'?boot-smoke='+Math.random());
if(!gameEl.innerHTML.includes('splash-screen')) throw new Error('Splash did not render');
console.log('BOOT_OK');`;
    return execFileSync(process.execPath,["--input-type=module","-e",probe],{cwd:root,encoding:"utf8"});
  };
  assert.match(runBoot(null),/BOOT_OK/);
  assert.match(runBoot(JSON.stringify({starterId:"roman-reigns",version:20})),/BOOT_OK/);
});


test("v0.12.24 targeted roster balance pass preserves 60-page legality while fixing weak-package access",()=>{
  for(const sid of ['seth-rollins','gunther','cody-rhodes','paige','sami-zayn','randy-savage','andre-the-giant','kane','randy-orton','rey-mysterio']){
    assert.equal(decks[sid].length,60,`${sid} remains a 60-page recommended deck`);
    assert.equal(decks[sid].filter(c=>c.kind==='momentum').length,12,`${sid} keeps 12 Momentum`);
  }
  const buckle=allGameplayCards.find(c=>c.id==='seth-rollins-buckle-bomb');
  assert.equal(buckle.cost,5); assert.equal(buckle.requirements.technical,1);
  const folding=allGameplayCards.find(c=>c.id==='gunther-folding-powerbomb'),gojira=allGameplayCards.find(c=>c.id==='gunther-gojira-clutch');
  assert.equal(folding.cost,6); assert.equal(folding.requirements.strength,2); assert.equal(gojira.cost,9); assert.equal(gojira.finisher,true); assert.equal(gojira.submission.pressure,6);
  const sami=starById.get('sami-zayn'); assert.equal(sami.ability.trigger.discount,2); assert.equal(sami.ability.trigger.damage,4);
  assert.ok(decks['randy-savage'].filter(c=>c.kind==='move'&&c.method==='agility').length>=6,'Savage has enough aerial pages to realize Macho Madness');
  assert.equal(allGameplayCards.find(c=>c.id==='andre-the-giant-double-underhook-suplex').damage,14,'Andre Trademark is deliberately above the normal trademark band as a giant-powerhouse exception');
  assert.equal(decks['rey-mysterio'].filter(c=>c.id==='rey-mysterio-west-coast-pop').length,2,'Rey recommended deck trims one Finisher page without changing the card identity');
  assert.ok(starById.get('randy-orton').leadOffIds.every(id=>decks['randy-orton'].some(c=>c.id===id)),'Orton Lead Off references only pages still in the tuned deck');
});
