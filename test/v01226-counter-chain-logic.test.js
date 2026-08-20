import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { counterEligibility, autoCounterEligibility } from '../js/engine/rules.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const player=(star='test')=>({
  superstar:{id:star}, momentum:{strength:5,strike:5,technical:5,agility:5,attitude:10},
  adrenaline:10, hand:[], specialUsed:false, controlMoveCount:0, events:{}, posture:'standing'
});
const chainState=(incoming,{counterAttack=true}={})=>({
  phase:'COUNTER', playerInControl:'p1', turnNumber:5,
  proposedMove:{attackerId:'p1',defenderId:'p2',card:incoming,isCounterAttack:counterAttack,counterDepth:counterAttack?1:0},
  players:{p1:player('attacker'),p2:player('defender')}
});

test('v0.12.26 Jawbreaker counter-attacks are terminal and cannot recurse',()=>{
  const jaw=byId('jawbreaker');
  assert.ok(jaw);
  const state=chainState(jaw);
  assert.equal(counterEligibility(state,'p2',jaw,jaw).legal,false);
  assert.match(counterEligibility(state,'p2',jaw,jaw).reason,/ends the exchange/i);
  assert.equal(autoCounterEligibility(state,'p2',jaw).legal,false);
});

test('v0.12.27 Punch and Elbow share one deliberate strike counter exchange',()=>{
  const punch=byId('punch'), elbow=byId('elbow');
  assert.equal(punch.counterExchangeKey,'punch-elbow');
  assert.equal(elbow.counterExchangeKey,'punch-elbow');
  const punchState=chainState(punch);
  assert.equal(counterEligibility(punchState,'p2',punch,punch).legal,true);
  assert.equal(counterEligibility(punchState,'p2',punch,elbow).legal,true);
  const elbowState=chainState(elbow);
  assert.equal(counterEligibility(elbowState,'p2',elbow,elbow).legal,true);
  assert.equal(counterEligibility(elbowState,'p2',elbow,punch).legal,true);
  assert.equal(autoCounterEligibility(punchState,'p2',punch).legal,false);
});

test('v0.12.26 normal first-level counter windows are unchanged',()=>{
  const jaw=byId('jawbreaker');
  const incoming={id:'front-test',kind:'move',counterState:'front-control',moveType:'grapple',damage:5,cost:3};
  const state=chainState(incoming,{counterAttack:false});
  assert.equal(counterEligibility(state,'p2',incoming,jaw).legal,true);
  assert.equal(autoCounterEligibility(state,'p2',incoming).legal,false,'test hand is intentionally empty');
});

test('v0.12.34 Jawbreaker cannot counter another Jawbreaker even at the first counter window',()=>{
  const jaw=byId('jawbreaker');
  const state=chainState(jaw,{counterAttack:false});
  assert.equal(counterEligibility(state,'p2',jaw,jaw).legal,false);
  assert.match(counterEligibility(state,'p2',jaw,jaw).reason,/does not Counter/i);
});

import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const stars=Object.values(superstars);
const maxResources=p=>{for(const m of ['strength','strike','technical','agility'])p.momentum[m]=20;p.adrenaline=20;p.momentum.attitude=20;};

test('v0.12.27 engine keeps Punch-Elbow exchanges open but resolves Jawbreaker counters immediately',()=>{
  const punch=byId('punch');
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:()=>0.5}),s=g.state();
  maxResources(s.players.p1); maxResources(s.players.p2);
  s.playerInControl='p1'; s.phase='ACTION';
  const elbow=byId('elbow');
  s.players.p1.hand=[{...punch},{...punch}];
  s.players.p2.hand=[{...elbow},{...elbow}];
  assert.equal(g.declareMove('p1',s.players.p1.hand[0]),true);
  assert.equal(g.counter('p2',s.players.p2.hand[0]),true);
  assert.equal(s.phase,'COUNTER'); assert.equal(s.proposedMove.isCounterAttack,true); assert.equal(s.proposedMove.counterDepth,1);
  assert.equal(g.counter('p1',s.players.p1.hand[0]),true);
  assert.equal(s.phase,'COUNTER'); assert.equal(s.proposedMove.counterDepth,2);
  assert.equal(g.counter('p2',s.players.p2.hand[0]),true);
  assert.equal(s.phase,'COUNTER'); assert.equal(s.proposedMove.counterDepth,3);
  assert.equal(g.passCounter('p1'),true);
  assert.notEqual(s.phase,'COUNTER');

  const jaw=byId('jawbreaker'), ddt=allGameplayCards.find(c=>c.name==='DDT'&&!c.defensiveOnly);
  assert.ok(ddt);
  const g2=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:()=>0.5}),q=g2.state();
  maxResources(q.players.p1); maxResources(q.players.p2);
  q.playerInControl='p1'; q.phase='ACTION'; q.players.p1.hand=[{...ddt},{...jaw}]; q.players.p2.hand=[{...jaw}];
  const hp=q.players.p1.hp;
  assert.equal(g2.declareMove('p1',q.players.p1.hand[0]),true);
  assert.equal(g2.counter('p2',q.players.p2.hand[0]),true);
  assert.notEqual(q.phase,'COUNTER');
  assert.equal(q.players.p1.hp,Math.max(0,hp-(jaw.damage??0)));
  assert.equal(q.players.p1.hand.some(c=>c.id==='jawbreaker'),true,'the second Jawbreaker remains unused because no reply window opens');
});
