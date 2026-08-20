import test from 'node:test';
import assert from 'node:assert/strict';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { cardsForSet } from '../js/data/collection.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { claimSeasonTier } from '../js/data/seasons.js?v=0.13.72';
import { createProfile, migrateProfile, grantStoreSuperstarUnlockPackage, totalOwnedCopies, cardOwnershipCap, PROFILE_VERSION } from '../js/data/profile.js?v=0.13.72';
import { selectedEntranceId, setSelectedEntrance, validateDeckDraft, recommendedDeckDraft } from '../js/data/deck-builder.js?v=0.13.72';
import { boosterEligible, underOwnershipCap, grantBooster, openBooster, RARITY_WEIGHTS } from '../js/data/boosters.js?v=0.13.72';

const momentumIds=['momentum-strength','momentum-strike','momentum-technical','momentum-agility'];
const byId=new Map(collectionCards.map(card=>[card.id,card]));

function rngForCard(pool,id){
  const total=pool.reduce((sum,card)=>sum+(RARITY_WEIGHTS[card.rarity]??.01),0);
  let before=0;
  for(const card of pool){
    const weight=RARITY_WEIGHTS[card.rarity]??.01;
    if(card.id===id) return (before+weight/2)/total;
    before+=weight;
  }
  throw new Error(`Card ${id} not in weighted pool`);
}

test('v0.12.55 new Legacy starts with Amazing Entrance and 15 of every Momentum colour',()=>{
  const p=createProfile('roman-reigns');
  assert.equal(PROFILE_VERSION,31);
  assert.equal(selectedEntranceId(p,'roman-reigns'),'entrance-amazing');
  assert.equal(totalOwnedCopies(p,'entrance-amazing'),1);
  assert.equal(p.ownedCards['entrance-amazing']?.normal,0);
  assert.equal(p.ownedCards['entrance-amazing']?.foil,1,'Amazing Entrance follows the all-Entrances-are-Foil rule');
  const amazing=byId.get('entrance-amazing');
  assert.ok(amazing);
  assert.equal(amazing.rarity,4);
  assert.equal(amazing.superstarId,null);
  assert.equal(amazing.preMatchAdrenaline,1);
  assert.deepEqual(amazing.preMatchMomentum,{});
  assert.equal(cardOwnershipCap(amazing),1);
  for(const id of momentumIds) assert.equal(totalOwnedCopies(p,id),15,id);
});

test('v0.12.55 Superstar unlocks no longer grant their Entrance and Amazing Entrance remains equipped',()=>{
  const p=createProfile('cm-punk');
  const target=superstars.romanReigns;
  grantStoreSuperstarUnlockPackage(p,target.id);
  assert.equal(totalOwnedCopies(p,target.entranceId),0);
  assert.equal(selectedEntranceId(p,target.id),'entrance-amazing');
  assert.equal(validateDeckDraft(p,target.id,recommendedDeckDraft(target.id),'entrance-amazing').violations.some(v=>/Entrance/.test(v)),false);
});

test('v0.12.55 Superstar Entrances are Very Rare pulls in their live set and cannot be pulled twice',()=>{
  const p=createProfile('cm-punk');
  const target=byId.get('entrance-roman-reigns');
  assert.ok(target);
  assert.equal(target.rarity,4);
  assert.equal(boosterEligible(target),true);
  assert.equal(totalOwnedCopies(p,target.id),0);

  const base=cardsForSet(target.setId).filter(boosterEligible);
  const firstSlotPool=base.filter(card=>card.kind!=="superstar"&&underOwnershipCap(p,card));
  const vrPool=firstSlotPool.filter(card=>card.rarity===4);
  const targetIndex=vrPool.findIndex(card=>card.id===target.id);
  assert.ok(targetIndex>=0);
  const pick=(targetIndex+.5)/vrPool.length;
  const sequence=[.99,.99,pick,.10,.40,.20,.50,.30,.60,.40,.70]; // no Superstar chase; first ordinary slot is Very Rare target
  let calls=0;
  const firstRng=()=>sequence[calls++]??.42;
  grantBooster(p,1,target.setId);
  const first=openBooster(p,firstRng,target.setId);
  assert.equal(first[0].card.id,target.id);
  assert.equal(first[0].foil,true,'native Entrances remain Foil when pulled from boosters');
  assert.equal(totalOwnedCopies(p,target.id),1);
  assert.equal(first.filter(pull=>pull.card.id===target.id).length,1,'Entrance cannot repeat later in the same pack');

  grantBooster(p,1,target.setId);
  const second=openBooster(p,()=>.99,target.setId);
  assert.equal(second.some(pull=>pull.card.id===target.id),false,'owned Entrance must be removed from every later pack pool');
});

test('v0.12.55 pulled Superstar Entrance is assigned manually in Deck Lab, not automatically',()=>{
  const p=createProfile('roman-reigns');
  const id=superstars.romanReigns.entranceId;
  p.ownedCards[id]={normal:1,foil:0};
  assert.equal(selectedEntranceId(p,'roman-reigns'),'entrance-amazing');
  assert.equal(setSelectedEntrance(p,'roman-reigns',id),true);
  assert.equal(selectedEntranceId(p,'roman-reigns'),id);
});

test('v0.12.55 migration removes old auto-granted Superstar Entrances and seeds the new baseline',()=>{
  const p=createProfile('roman-reigns');
  p.version=25;
  p.ownedCards[superstars.romanReigns.entranceId]={normal:0,foil:1};
  p.selectedEntrances['roman-reigns']=superstars.romanReigns.entranceId;
  for(const id of momentumIds) p.ownedCards[id]={normal:1,foil:0};
  delete p.ownedCards['entrance-amazing'];
  const migrated=migrateProfile(p);
  assert.equal(totalOwnedCopies(migrated,superstars.romanReigns.entranceId),0);
  assert.equal(totalOwnedCopies(migrated,'entrance-amazing'),1);
  assert.equal(selectedEntranceId(migrated,'roman-reigns'),'entrance-amazing');
  for(const id of momentumIds) assert.equal(totalOwnedCopies(migrated,id),15,id);
});

test('v0.12.55 CPU Superstar data retains native linked Entrances',()=>{
  for(const star of Object.values(superstars)){
    assert.ok(star.entranceId,star.id);
    assert.equal(star.entrance?.id,star.entranceId,star.id);
  }
});


test('v0.12.55 Amazing Entrance does not leak Roman native Entrance triggers',()=>{
  const amazing=byId.get('entrance-amazing');
  const roman={...superstars.romanReigns,entrance:amazing,entranceId:amazing.id};
  const game=new MatchEngine({p1:roman,p2:superstars.cmPunk,decks,rng:()=>0.5});
  const state=game.state(),p1=state.players.p1;
  assert.equal(p1.adrenaline,1,'Amazing Entrance grants only +1 Adrenaline on first Control');
  assert.equal(p1.momentum.strength,0);
  assert.equal(p1.momentum.strike,0);
  const punch=p1.hand.find(card=>card.id==='punch');
  assert.ok(punch);
  p1.momentum.strike=1;
  p1.adrenaline=10;
  assert.equal(game.declareMove('p1',punch),true);
  if(state.phase==='COUNTER') assert.equal(game.passCounter('p2'),true);
  assert.equal(p1.momentum.strike,1,'Amazing Entrance must not grant Acknowledge Me first-Strike Momentum');
  while(state.turnNumber<6 && state.phase==='ACTION') game.passTurn(state.playerInControl);
  assert.equal(state.log.some(event=>event.type==='ENTRANCE_DELAYED'&&event.playerId==='p1'),false,'Amazing Entrance must not trigger Roman Turn 6 Adrenaline');
});

test('v0.12.83 Final Boss Entrance is the Tier 85 prestige reward and remains manually equipped',()=>{
  const p=createProfile('roman-reigns');
  p.seasons['season-1'].xp=8500;
  claimSeasonTier(p,85);
  assert.equal(totalOwnedCopies(p,'entrance-the-rock'),1);
  assert.equal(p.ownedCards['entrance-the-rock']?.foil,1);
  assert.equal(p.unlockedSuperstars.includes('the-rock'),false,'Tier 85 does not unlock the Superstar early');
  p.seasons['season-1'].xp=10000;
  claimSeasonTier(p,100);
  assert.ok(p.unlockedSuperstars.includes('the-rock'));
  assert.equal(selectedEntranceId(p,'the-rock'),'entrance-amazing','native reward Entrance is owned but not auto-equipped');
});
