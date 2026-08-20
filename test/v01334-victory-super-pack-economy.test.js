import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile } from '../js/data/profile.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { cardOwnershipCap } from '../js/data/profile.js?v=0.13.72';
import { boosterEligible, boosterCreditsFor, superPackCreditsFor, grantVictoryBooster, grantSuperPack, openBooster, openSuperPack, SUPER_PACK_RARITY_WEIGHTS, SUPER_PACK_GUARANTEED_MIN_RARITY, SUPER_PACK_MAX_VERY_RARE_PULLS } from '../js/data/boosters.js?v=0.13.72';
import { duplicateUniversePointsFor } from '../js/data/store.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { startLadderRun, recordLadderMatch, LADDER_LENGTH } from '../js/data/ladder.js?v=0.13.72';
import { startChampionshipRoad, recordChampionshipMatch, CHAMPIONSHIP_ROAD_LENGTH } from '../js/data/championship-road.js?v=0.13.72';
import { activeLiveEventTowers, startLiveEventTower, recordLiveEventTowerMatch, LIVE_EVENT_LENGTH } from '../js/data/live-events.js?v=0.13.72';
import { startKingOfTheRing, recordKingOfTheRingMatch, prepareKingOfTheRingReward, claimKingOfTheRingReward } from '../js/data/king-of-the-ring.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const ids = Object.values(superstars).filter(s=>!s.developmentOnly).map(s=>s.id);

function fixedRng() { return 0.314159; }

test('v0.13.34 universal match reward grants one booster for a win and nothing for a loss',()=>{
  const p=createProfile('cm-punk'), setId='summerslam-series-1';
  assert.equal(grantVictoryBooster(p,'loss',setId),0);
  assert.equal(boosterCreditsFor(p,setId),0);
  assert.equal(grantVictoryBooster(p,'win',setId),1);
  assert.equal(boosterCreditsFor(p,setId),1);
});

test('v0.13.34 Super Pack is five cards with boosted odds, guaranteed Foil and guaranteed Rare+',()=>{
  assert.deepEqual(SUPER_PACK_RARITY_WEIGHTS,{1:.25,2:.40,3:.27,4:.08});
  assert.equal(SUPER_PACK_GUARANTEED_MIN_RARITY,3);
  assert.equal(SUPER_PACK_MAX_VERY_RARE_PULLS,2);
  const p=createProfile('cm-punk'), setId='summerslam-series-1';
  for(let i=0;i<250;i++){
    grantSuperPack(p,1,setId);
    const pack=openSuperPack(p,setId);
    assert.equal(pack.length,5);
    assert.equal(pack[0].foil,true);
    assert.ok(Number(pack[0].card.rarity)>=3,`pack ${i+1} first slot was ${pack[0].card.rarity}★`);
    assert.ok(pack.filter(pull=>pull.card.rarity===4).length<=2);
  }
});

test('v0.13.34 duplicate overflow pays rarity only, including the guaranteed Foil slot',()=>{
  const p=createProfile('cm-punk'), setId='summerslam-series-1';
  const eligible=collectionCards.filter(c=>c.setId===setId&&boosterEligible(c));
  for(const c of eligible){ const cap=cardOwnershipCap(c); p.ownedCards[c.id]=cap===5?{normal:cap,foil:cap}:{normal:0,foil:cap}; }
  grantVictoryBooster(p,'win',setId);
  const pack=openBooster(p,()=>0.42,setId);
  assert.equal(pack[0].foil,true);
  assert.ok(pack.every(pull=>pull.universePointsValue===duplicateUniversePointsFor(pull.card)));
});

test('v0.13.34 full mode clears each deposit one Super Pack',()=>{
  const ladderProfile=createProfile('cm-punk');
  startLadderRun(ladderProfile,'cm-punk',ids,fixedRng,'daily',new Date(2026,7,19,12));
  for(let i=0;i<LADDER_LENGTH;i++) recordLadderMatch(ladderProfile,'win',new Date(2026,7,19,12));
  assert.equal(superPackCreditsFor(ladderProfile,'summerslam-series-1'),1);

  const championshipProfile=createProfile('cm-punk');
  startChampionshipRoad(championshipProfile,'cm-punk',[],fixedRng,'easy');
  let finalOutcome;
  for(let i=0;i<CHAMPIONSHIP_ROAD_LENGTH;i++) finalOutcome=recordChampionshipMatch(championshipProfile,'win');
  assert.equal(finalOutcome.superPackSetId,'evolution-series-1');
  assert.equal(superPackCreditsFor(championshipProfile,'evolution-series-1'),1);

  const liveProfile=createProfile('cm-punk'), now=new Date('2026-08-18T07:45:00');
  const tower=activeLiveEventTowers(now)[0];
  startLiveEventTower(liveProfile,tower.key,'cm-punk',ids,fixedRng,now);
  let liveOutcome;
  for(let i=0;i<LIVE_EVENT_LENGTH;i++) liveOutcome=recordLiveEventTowerMatch(liveProfile,tower.key,'win',now);
  assert.equal(liveOutcome.superPackAwarded,true);
  assert.equal(superPackCreditsFor(liveProfile,liveOutcome.superPackSetId),1);

  const kotrProfile=createProfile('cm-punk');
  startKingOfTheRing(kotrProfile,'cm-punk',ids,fixedRng);
  recordKingOfTheRingMatch(kotrProfile,'win');
  recordKingOfTheRingMatch(kotrProfile,'win');
  recordKingOfTheRingMatch(kotrProfile,'win');
  prepareKingOfTheRingReward(kotrProfile,['summerslam-series-1','hall-of-fame-series-1','evolution-series-1'],fixedRng);
  claimKingOfTheRingReward(kotrProfile,'hall-of-fame-series-1');
  assert.equal(superPackCreditsFor(kotrProfile,'hall-of-fame-series-1'),1);
});

test('v0.13.34 universal victory booster path remains available while later completion rules may suppress it',()=>{
  assert.match(app,/grantVictoryBooster\(profile, result, victorySetId\)/);
  assert.match(app,/NO REWARD/);
  assert.match(app,/SUPER PACK/);
  assert.match(app,/BOOSTED ODDS · 1 RARE\+/);
});
