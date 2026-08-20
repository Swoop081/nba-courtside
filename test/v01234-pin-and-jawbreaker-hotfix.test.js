import test from 'node:test';
import assert from 'node:assert/strict';
import { healthOnlyPinChance } from '../js/engine/health.js?v=0.13.72';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { counterEligibility } from '../js/engine/rules.js?v=0.13.72';

const hp=(current,maxHp=100)=>({hp:current,maxHp});
const player=id=>({superstar:{id},momentum:{strength:5,strike:5,technical:5,agility:5,attitude:10},adrenaline:10,hand:[],specialUsed:false,controlMoveCount:0,events:{},posture:'standing'});

test('v0.12.36 actual-HP pin table supersedes the old percentage-of-Max-HP curve',()=>{
  assert.equal(healthOnlyPinChance(hp(24)),5);
  assert.equal(healthOnlyPinChance(hp(16)),5);
  assert.equal(healthOnlyPinChance(hp(15)),20);
  assert.equal(healthOnlyPinChance(hp(10)),45);
  assert.equal(healthOnlyPinChance(hp(5)),70);
  assert.equal(healthOnlyPinChance(hp(4)),75);
  assert.equal(healthOnlyPinChance(hp(0)),75);
});

test('v0.12.34 Jawbreaker cannot mirror-counter Jawbreaker',()=>{
  const jaw=allGameplayCards.find(c=>c.id==='jawbreaker');
  assert.ok(jaw);
  const state={phase:'COUNTER',playerInControl:'p1',turnNumber:1,proposedMove:{attackerId:'p1',defenderId:'p2',card:jaw,isCounterAttack:false,counterDepth:0},players:{p1:player('a'),p2:player('b')}};
  const result=counterEligibility(state,'p2',jaw,jaw);
  assert.equal(result.legal,false);
});

import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

test('v0.12.34 engine rejects Jawbreaker as the response to an incoming Jawbreaker',()=>{
  const jaw=allGameplayCards.find(c=>c.id==='jawbreaker');
  const stars=Object.values(superstars);
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:()=>0.5});
  const s=g.state();
  for(const pid of ['p1','p2']){
    for(const m of ['strength','strike','technical','agility'])s.players[pid].momentum[m]=10;
    s.players[pid].adrenaline=10;
  }
  s.playerInControl='p1'; s.phase='ACTION';
  s.players.p1.hand=[{...jaw}]; s.players.p2.hand=[{...jaw}];
  assert.equal(g.declareMove('p1',s.players.p1.hand[0]),true);
  assert.equal(s.phase,'COUNTER');
  assert.equal(g.counter('p2',s.players.p2.hand[0]),false);
  assert.equal(s.phase,'COUNTER');
  assert.equal(s.players.p2.hand.some(c=>c.id==='jawbreaker'),true);
});
