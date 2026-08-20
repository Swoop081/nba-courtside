import test from 'node:test';
import assert from 'node:assert/strict';
import { healthOnlyPinChance } from '../js/engine/health.js?v=0.13.72';
import { canAttemptPin } from '../js/engine/rules.js?v=0.13.72';
import { cpuDecision } from '../js/ai/WrestlingAI.js?v=0.13.72';

const P=(hp)=>({hp,maxHp:76,hand:[],turn:{momentumPlayed:0,specialPlayed:0},momentum:{strength:0,strike:0,technical:0,agility:0},adrenaline:0,events:{},superstar:{id:'x'}});

test('v0.12.36 natural pin chance uses actual HP left',()=>{
  const expected=new Map([[0,75],[1,75],[2,75],[3,75],[4,75],[5,70],[6,60],[7,55],[8,50],[9,48],[10,45],[11,40],[12,35],[13,30],[14,25],[15,20],[16,5],[63,5],[100,5]]);
  for(const [hp,chance] of expected) assert.equal(healthOnlyPinChance(P(hp)),chance,`${hp} HP`);
});

test('v0.12.88 pins are gated to Amber/Red health before the actual-HP table is used',()=>{
  const green={phase:'ACTION',playerInControl:'p1',postMove:{attackerId:'p1'},players:{p1:P(63),p2:P(65)}};
  assert.equal(canAttemptPin(green,'p1').legal,false);
  assert.equal(healthOnlyPinChance(green.players.p2),5,'Green still maps to 5% internally but cannot open a pin attempt');
  const amber={phase:'ACTION',playerInControl:'p1',postMove:{attackerId:'p1'},players:{p1:P(63),p2:P(40)}};
  assert.equal(canAttemptPin(amber,'p1').legal,true);
  assert.equal(healthOnlyPinChance(amber.players.p2),5);
});

test('v0.12.36 CPU normal covers begin at the 20% actual-HP tier, not the 5% flash tier',()=>{
  const base=(hp)=>({phase:'ACTION',playerInControl:'p2',postMove:{attackerId:'p2'},players:{p1:P(hp),p2:P(60)}});
  const game16={state:()=>base(16)};
  const game15={state:()=>base(15)};
  assert.notEqual(cpuDecision(game16,'p2')?.type,'pin');
  assert.equal(cpuDecision(game15,'p2')?.type,'pin');
});
