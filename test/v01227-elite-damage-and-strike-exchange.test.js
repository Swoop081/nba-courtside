import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { counterEligibility } from '../js/engine/rules.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const player=()=>({superstar:{id:'test'},momentum:{strength:10,strike:10,technical:10,agility:10,attitude:10},adrenaline:10,hand:[],specialUsed:false,controlMoveCount:0,events:{},posture:'standing'});
const counterState=incoming=>({phase:'COUNTER',playerInControl:'p1',turnNumber:5,proposedMove:{attackerId:'p1',defenderId:'p2',card:incoming,isCounterAttack:true,counterDepth:1},players:{p1:player(),p2:player()}});

test('v0.12.28 elite 18-19 Damage Finishers carry a printed Cost premium',()=>{
  const elite=allGameplayCards.filter(c=>c.kind==='move'&&(c.damage??0)>17);
  assert.deepEqual(elite.map(c=>[c.id,c.cost,c.damage]),[
    ['andre-the-giant-sitdown-splash',11,18],
    ['the-rock-people-s-elbow',11,18],
    ['goldberg-jackhammer',12,19],
    ['diesel-jackknife-powerbomb',11,18],
  ]);
  for(const card of elite) assert.ok(card.cost>=card.damage-7,`${card.name} must pay the elite damage premium`);
});

test('v0.12.27 Punch and Elbow can reverse each other during a counter-attack exchange',()=>{
  const punch=byId('punch'), elbow=byId('elbow');
  assert.equal(punch.counterExchangeKey,'punch-elbow');
  assert.equal(elbow.counterExchangeKey,'punch-elbow');
  assert.equal(counterEligibility(counterState(punch),'p2',punch,elbow).legal,true);
  assert.equal(counterEligibility(counterState(elbow),'p2',elbow,punch).legal,true);
});
