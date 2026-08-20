import test from 'node:test';
import assert from 'node:assert/strict';
import { createProfile, addOwnedCard } from '../js/data/profile.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { findPackUpgrades, applyUpgrade } from '../js/data/deck-assistant.js?v=0.13.72';
import { grantBooster, openBooster, boosterEligible } from '../js/data/boosters.js?v=0.13.72';
import { cardOwnershipCap } from '../js/data/profile.js?v=0.13.72';
import { DUPLICATE_UP_BY_RARITY, duplicateUniversePointsFor } from '../js/data/store.js?v=0.13.72';

const byId = new Map(collectionCards.map(card=>[card.id,card]));

test('v0.12.93 Deck Assistance prefers an owned Foil finish without changing gameplay composition',()=>{
  const profile=createProfile('cm-punk');
  const sid='cm-punk';
  const card=decks[sid].find(c=>c.kind==='move' && profile.savedDecks[sid].some(e=>e.id===c.id&&!e.foil));
  assert.ok(card);
  addOwnedCard(profile,card.id,{foil:true});
  const beforeCount=profile.savedDecks[sid].filter(e=>e.id===card.id).length;
  const pull={card,foil:false,ownershipBefore:beforeCount,universePointsValue:0};
  const suggestion=findPackUpgrades(profile,[pull]).find(u=>u.type==='foil-preference'&&u.superstarId===sid&&u.cardId===card.id);
  assert.ok(suggestion);
  assert.match(suggestion.addName,/^Foil /);
  assert.equal(applyUpgrade(profile,suggestion),true);
  assert.equal(profile.savedDecks[sid].filter(e=>e.id===card.id).length,beforeCount);
  assert.ok(profile.savedDecks[sid].some(e=>e.id===card.id&&e.foil));
});

test('v0.12.93 blueprint restoration uses an already-owned Foil even when the new pull is Normal',()=>{
  const profile=createProfile('cm-punk');
  const sid='cm-punk';
  const rec=decks[sid];
  const counts=new Map(); for(const c of rec) counts.set(c.id,(counts.get(c.id)??0)+1);
  const target=[...counts.entries()].map(([id,count])=>({card:byId.get(id),count})).find(x=>x.count>=2&&x.card?.kind==='move');
  const filler=[...counts.entries()].map(([id,count])=>({card:byId.get(id),count})).find(x=>x.card?.id!==target.card.id&&x.card?.kind==='move'&&x.count<5);
  assert.ok(target&&filler);
  const draft=profile.savedDecks[sid].map(e=>({...e}));
  const replaceIndex=draft.map((e,i)=>e.id===target.card.id?i:-1).filter(i=>i>=5).at(-1);
  assert.ok(replaceIndex>=5);
  addOwnedCard(profile,filler.card.id,{amount:1});
  draft[replaceIndex]={id:filler.card.id,foil:false};
  profile.savedDecks[sid]=draft;
  const desired=target.count;
  profile.ownedCards[target.card.id]={normal:Math.max(0,desired-2),foil:1};
  addOwnedCard(profile,target.card.id,{amount:1});
  const pull={card:target.card,foil:false,ownershipBefore:desired-1,universePointsValue:0};
  const upgrade=findPackUpgrades(profile,[pull]).find(u=>u.type==='blueprint'&&u.cardId===target.card.id);
  assert.ok(upgrade);
  assert.match(upgrade.addName,/^Foil /);
  assert.equal(applyUpgrade(profile,upgrade),true);
  assert.ok(profile.savedDecks[sid].some(e=>e.id===target.card.id&&e.foil));
});

test('v0.13.34 maxed duplicates convert for 1/2/3/4 UP by rarity and Foil uses the same value',()=>{
  assert.deepEqual(DUPLICATE_UP_BY_RARITY,{1:1,2:2,3:3,4:4});
  for (const rarity of [1,2,3,4]) assert.equal(duplicateUniversePointsFor(rarity),rarity);
  const p=createProfile('cm-punk');
  const setId='summerslam-series-1';
  const eligible=collectionCards.filter(c=>c.setId===setId&&boosterEligible(c));
  for(const c of eligible){ const cap=cardOwnershipCap(c); p.ownedCards[c.id]=cap===5?{normal:cap,foil:cap}:{normal:0,foil:cap}; }
  grantBooster(p,1,setId);
  const pack=openBooster(p,()=>0.42,setId);
  assert.equal(pack[0].foil,true);
  assert.ok(pack.every(pull=>pull.universePointsValue===duplicateUniversePointsFor(pull.card)));
});
