import test from 'node:test';
import assert from 'node:assert/strict';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { cpuDecision } from '../js/ai/WrestlingAI.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const stars=Object.values(superstars);
const rng=()=>0.42;
const incoming={id:'incoming-mid',name:'Incoming Mid Move',kind:'move',cost:4,damage:6,method:'strength',moveType:'grapple',counterState:'torso-trapped',requirements:{}};
const playableMove={id:'keep-move',name:'Keep Move',kind:'move',cost:0,damage:3,method:'strength',requirements:{}};
const playableMomentum={id:'keep-momentum',name:'Keep Momentum',kind:'momentum',method:'strength',amount:1};
const dead=(i)=>({id:`dead-${i}`,name:`Dead ${i}`,kind:'action',cost:99});

function cpuCounterWindow(hand){
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=g.state();
  s.phase='COUNTER';
  s.playerInControl='p1';
  s.proposedMove={attackerId:'p1',defenderId:'p2',card:incoming};
  s.players.p2.hand=hand;
  return {g,s};
}

test('v0.12.22 CPU Auto Counter ditches around two playable retained cards',()=>{
  const hand=[playableMove,playableMomentum,...Array.from({length:5},(_,i)=>dead(i))];
  const {g}=cpuCounterWindow(hand);
  const d=cpuDecision(g,'p2');
  assert.equal(d.type,'autoCounter');
  assert.equal(d.indices.length,5);
  assert.equal(d.indices.includes(0),false,'CPU must preserve the playable Move');
  assert.equal(d.indices.includes(1),false,'CPU must preserve the playable Momentum');
  assert.deepEqual(new Set(d.indices),new Set([2,3,4,5,6]));
});

test('v0.12.22 CPU refuses Auto Counter when it cannot leave two playable cards',()=>{
  const hand=[playableMomentum,...Array.from({length:6},(_,i)=>dead(i))];
  const {g}=cpuCounterWindow(hand);
  const d=cpuDecision(g,'p2');
  assert.equal(d.type,'passCounter');
});
