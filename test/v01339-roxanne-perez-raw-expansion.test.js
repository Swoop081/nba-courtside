import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { canPlaySpecial, moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.39 Roxanne Perez RAW package and collector identities are locked',()=>{
  const rox=star('roxanne-perez');
  assert.ok(rox);
  assert.equal(rox.setId,'raw-series-1');
  assert.equal(rox.hp,57);
  assert.deepEqual(rox.methodLimits,{agility:null,technical:4,strike:3,strength:0});
  assert.deepEqual(rox.starterMomentum,{agility:6,technical:4,strike:2});
  assert.deepEqual(rox.leadOffIds,['momentum-agility','momentum-technical','dropkick','arm-drag','russian-leg-sweep']);
  assert.equal(rox.ability.name,'Prodigy Instinct');
  assert.deepEqual(rox.ability.trigger,{type:'agilityAfterTechnical',maxUses:2,draw:1,adrenaline:1});
  assert.equal(rox.entrance.name,'All Fall Down');
  assert.deepEqual(rox.entrance.preMatchMomentum,{agility:1,technical:1});
  assert.equal(rox.entrance.preMatchAdrenaline,1);
  assert.deepEqual(rox.special,{type:'roxanneProdigy',maxCost:4,methods:['agility','technical'],discount:1});

  const sweep=byId('roxanne-perez-russian-leg-sweep');
  assert.ok(sweep.trademark); assert.equal(sweep.rarity,3); assert.equal(sweep.cost,5); assert.equal(sweep.damage,7);
  assert.equal(sweep.method,'technical'); assert.deepEqual(sweep.requirements,{technical:2}); assert.equal(sweep.counterState,'front-control'); assert.equal(sweep.groundOpponent,true);
  assert.deepEqual(sweep.effects.find(e=>e.type==='search'),{type:'search',name:'Rok-Lock',discount:1});

  const meteora=byId('roxanne-perez-meteora');
  assert.ok(meteora.trademark); assert.equal(meteora.rarity,3); assert.equal(meteora.cost,5); assert.equal(meteora.damage,8);
  assert.equal(meteora.method,'agility'); assert.deepEqual(meteora.requirements,{agility:2}); assert.equal(meteora.moveType,'aerial'); assert.equal(meteora.counterState,'running-aerial'); assert.equal(meteora.groundOpponent,true);
  assert.deepEqual(meteora.effects.find(e=>e.type==='search'),{type:'search',name:'Pop Rox',discount:1});

  const lock=byId('roxanne-perez-rok-lock');
  assert.ok(lock.trademark); assert.equal(lock.rarity,3); assert.equal(lock.cost,6); assert.equal(lock.damage,0);
  assert.equal(lock.method,'technical'); assert.equal(lock.groundedOnly,true); assert.equal(lock.counterState,'front-control'); assert.deepEqual(lock.submission,{bodyPart:'head',pressure:5});

  const pop=byId('roxanne-perez-pop-rox');
  assert.ok(pop.finisher); assert.equal(pop.rarity,4); assert.equal(pop.cost,9); assert.equal(pop.damage,15); assert.deepEqual(pop.requirements,{}); assert.equal(pop.method,null); assert.equal(pop.counterState,'body-elevated'); assert.equal(pop.groundOpponent,true);

  const entrance=byId('entrance-roxanne-perez'),special=byId('special-roxanne-perez');
  assert.equal(entrance.name,'All Fall Down'); assert.equal(entrance.rarity,4);
  assert.equal(special.name,'The Prodigy'); assert.equal(special.rarity,4);

  const expectedCodes={
    'roxanne-perez-russian-leg-sweep':'RAW1-049',
    'roxanne-perez-meteora':'RAW1-050',
    'roxanne-perez-rok-lock':'RAW1-051',
    'roxanne-perez-pop-rox':'RAW1-052',
    'entrance-roxanne-perez':'RAW1-053',
    'special-roxanne-perez':'RAW1-054',
    'superstar-roxanne-perez':'RAW1-055'
  };
  for(const [id,code] of Object.entries(expectedCodes)) assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
  assert.equal(CARD_IDS_BY_SET['raw-series-1'].length,71);
});

test('v0.13.39 Roxanne authored deck is 60 pages and uses only existing shared cards plus her exclusive package',()=>{
  const deck=decks['roxanne-perez'];
  assert.ok(deck); assert.equal(deck.length,60); assert.equal(deck.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(deck.slice(0,5).map(c=>c.id),['momentum-agility','momentum-technical','dropkick','arm-drag','russian-leg-sweep']);
  const count=id=>deck.filter(c=>c.id===id).length;
  assert.equal(count('roxanne-perez-russian-leg-sweep'),3);
  assert.equal(count('roxanne-perez-meteora'),3);
  assert.equal(count('roxanne-perez-rok-lock'),2);
  assert.equal(count('roxanne-perez-pop-rox'),2);
  assert.equal(count('special-roxanne-perez'),1);
  assert.equal(count('once-too-often'),1);
  const exclusiveIds=new Set(['roxanne-perez-russian-leg-sweep','roxanne-perez-meteora','roxanne-perez-rok-lock','roxanne-perez-pop-rox','special-roxanne-perez']);
  for(const c of deck) if(c.superstarId) assert.ok(exclusiveIds.has(c.id),`unexpected exclusive card ${c.id}`);
});

test('v0.13.39 Prodigy Instinct fires on Technical into Agility only twice per match',()=>{
  const g=new MatchEngine({p1:star('roxanne-perez'),p2:star('cm-punk'),decks,rng}),s=g.state(),p=s.players.p1,d=s.players.p2;
  const tech=byId('arm-drag'),agility=byId('dropkick');
  s.playerInControl='p1'; s.phase='ACTION'; p.hand=[tech,agility,tech,agility,tech,agility]; d.hand=[];
  p.momentum.technical=5;p.momentum.agility=5;p.adrenaline=10;
  const startHand=p.hand.length;
  for(let i=0;i<3;i++){
    d.posture='standing'; s.phase='ACTION'; s.playerInControl='p1'; assert.equal(g.declareMove('p1',tech),true); assert.equal(g.passCounter('p2'),true);
    d.posture='standing'; s.phase='ACTION'; s.playerInControl='p1'; assert.equal(g.declareMove('p1',agility),true); assert.equal(g.passCounter('p2'),true);
  }
  assert.equal(p.abilityUses,2);
  assert.ok(p.adrenaline>=12);
  assert.ok(p.hand.length>=startHand-6+2,'ability drew twice');
});

test('v0.13.39 The Prodigy searches an eligible shared Agility/Technical Move and discounts it',()=>{
  const g=new MatchEngine({p1:star('roxanne-perez'),p2:star('cm-punk'),decks,rng}),s=g.state(),p=s.players.p1;
  const special=byId('special-roxanne-perez'),eligible=byId('tilt-a-whirl-headscissors'),tooExpensive=byId('missile-dropkick'),exclusive=byId('roxanne-perez-meteora');
  s.playerInControl='p1'; s.phase='ACTION'; s.players.p2.posture='standing'; p.hand=[special]; p.deck=[tooExpensive,exclusive,eligible];
  assert.equal(canPlaySpecial(s,'p1',special),true);
  assert.equal(g.playSpecial('p1',special),true);
  assert.ok(p.hand.some(c=>c.id===eligible.id));
  assert.equal(p.namedDiscount[eligible.name],1);
  assert.equal(moveEligibility(s,'p1',eligible).effectiveCost,3);
  assert.ok(p.outOfPlay.some(c=>c.id===special.id));
});
