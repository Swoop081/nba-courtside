import test from 'node:test';
import assert from 'node:assert/strict';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { counterEligibility } from '../js/engine/rules.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const byName=name=>allGameplayCards.find(c=>c.name===name&&!c.defensiveOnly);
const stars=Object.values(superstars);
const maxResources=p=>{for(const m of ['strength','strike','technical','agility'])p.momentum[m]=20;p.adrenaline=20;p.momentum.attitude=20;};

test('v0.12.35 Arm Drag Counter counter-attacks are terminal',()=>{
  const arm=byId('arm-drag-counter'), ddt=byName('DDT');
  assert.ok(arm&&ddt);
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:()=>0.5}),s=g.state();
  maxResources(s.players.p1);maxResources(s.players.p2);
  s.playerInControl='p1';s.phase='ACTION';
  s.players.p1.hand=[{...ddt},{...arm}];s.players.p2.hand=[{...arm}];
  assert.equal(g.declareMove('p1',s.players.p1.hand[0]),true);
  assert.equal(g.counter('p2',s.players.p2.hand[0]),true);
  assert.notEqual(s.phase,'COUNTER','offensive Arm Drag Counter must resolve immediately');
  assert.equal(s.proposedMove?.isCounterAttack??false,false,'terminal counter-attack must fully resolve rather than leave a reply window');
});

test('v0.12.35 rules reject every non Punch-Elbow reply to an offensive counter-attack',()=>{
  const arm=byId('arm-drag-counter'), jaw=byId('jawbreaker'), punch=byId('punch'), elbow=byId('elbow');
  const player=id=>({superstar:{id},momentum:{strength:20,strike:20,technical:20,agility:20,attitude:20},adrenaline:20,hand:[],events:{},specialUsed:false,controlMoveCount:0});
  const stateFor=incoming=>({phase:'COUNTER',proposedMove:{attackerId:'p1',defenderId:'p2',card:incoming,isCounterAttack:true,counterDepth:1},players:{p1:player('a'),p2:player('b')}});
  assert.equal(counterEligibility(stateFor(arm),'p2',arm,arm).legal,false);
  assert.equal(counterEligibility(stateFor(jaw),'p2',jaw,jaw).legal,false);
  assert.equal(counterEligibility(stateFor(punch),'p2',punch,elbow).legal,true);
});
