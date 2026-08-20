import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { canPlaySpecial, moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.38 Joe Hendry RAW Series 1 package and collector identities are locked',()=>{
  const joe=star('joe-hendry');
  assert.ok(joe);
  assert.equal(joe.setId,'raw-series-1');
  assert.equal(joe.hp,63);
  assert.deepEqual(joe.methodLimits,{strength:null,technical:4,strike:2,agility:1});
  assert.deepEqual(joe.starterMomentum,{strength:7,technical:4,strike:1});
  assert.deepEqual(joe.leadOffIds,['momentum-strength','momentum-technical','test-of-strength','double-leg-takedown','body-slam']);
  assert.equal(joe.ability.name,'The Crowd Believes');
  assert.equal(joe.ability.trigger.type,'joeCrowdBelieves');
  assert.equal(joe.ability.trigger.discount,1);
  assert.equal(joe.entrance.name,'Say His Name');
  assert.deepEqual(joe.entrance.preMatchMomentum,{strength:1,technical:1});
  assert.equal(joe.entrance.preMatchAdrenaline,1);
  assert.equal(joe.special.type,'joeBelieve');
  assert.equal(joe.special.discount,1);

  const uppercut=byId('european-uppercut');
  assert.equal(uppercut.name,'European Uppercut');
  assert.equal(uppercut.rarity,1); assert.equal(uppercut.cost,2); assert.equal(uppercut.damage,3);
  assert.equal(uppercut.method,'strike'); assert.deepEqual(uppercut.requirements,{strike:1}); assert.equal(uppercut.counterState,'front-control');

  const freak=byId('joe-hendry-freak-of-nature');
  assert.ok(freak.trademark); assert.equal(freak.rarity,3); assert.equal(freak.cost,6); assert.equal(freak.damage,10);
  assert.equal(freak.method,'strength'); assert.deepEqual(freak.requirements,{strength:2}); assert.equal(freak.counterState,'torso-trapped'); assert.equal(freak.groundOpponent,true);
  assert.deepEqual(freak.effects.find(e=>e.type==='search'),{type:'search',name:'Standing Ovation',discount:1});

  const slam=byId('joe-hendry-hendry-slam');
  assert.ok(slam.trademark); assert.equal(slam.rarity,3); assert.equal(slam.cost,5); assert.equal(slam.damage,8);
  assert.equal(slam.method,'technical'); assert.deepEqual(slam.requirements,{technical:2}); assert.equal(slam.counterState,'body-elevated'); assert.equal(slam.groundOpponent,true);
  assert.deepEqual(slam.effects.find(e=>e.type==='drawThenDiscardSelf'),{type:'drawThenDiscardSelf',draw:1,discard:1});

  const lock=byId('joe-hendry-hendry-lock');
  assert.ok(lock.trademark); assert.equal(lock.rarity,3); assert.equal(lock.cost,6); assert.equal(lock.damage,0);
  assert.equal(lock.method,'technical'); assert.deepEqual(lock.requirements,{technical:2}); assert.equal(lock.groundedOnly,true); assert.equal(lock.counterState,'leg-extended');
  assert.deepEqual(lock.submission,{bodyPart:'legs',pressure:5});

  const ovation=byId('joe-hendry-standing-ovation');
  assert.ok(ovation.finisher); assert.equal(ovation.rarity,4); assert.equal(ovation.cost,10); assert.equal(ovation.damage,16);
  assert.deepEqual(ovation.requirements,{}); assert.equal(ovation.method,null); assert.equal(ovation.counterState,'body-elevated'); assert.equal(ovation.groundOpponent,true);

  const entrance=byId('entrance-joe-hendry'), special=byId('special-joe-hendry');
  assert.equal(entrance.name,'Say His Name'); assert.equal(entrance.rarity,4); assert.deepEqual(entrance.preMatchMomentum,{strength:1,technical:1}); assert.equal(entrance.preMatchAdrenaline,1);
  assert.equal(special.name,'I Believe in Joe Hendry'); assert.equal(special.rarity,4); assert.deepEqual(special.special,{type:'joeBelieve',discount:1});

  const expectedCodes={
    'european-uppercut':'RAW1-041',
    'joe-hendry-freak-of-nature':'RAW1-042',
    'joe-hendry-hendry-slam':'RAW1-043',
    'joe-hendry-hendry-lock':'RAW1-044',
    'joe-hendry-standing-ovation':'RAW1-045',
    'entrance-joe-hendry':'RAW1-046',
    'special-joe-hendry':'RAW1-047',
    'superstar-joe-hendry':'RAW1-048'
  };
  for(const [id,code] of Object.entries(expectedCodes)) assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
});

test('v0.13.38 Joe Hendry authored deck is 60 pages, legal, and uses the locked package',()=>{
  const deck=decks['joe-hendry'];
  assert.ok(deck); assert.equal(deck.length,60); assert.equal(deck.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(deck.slice(0,5).map(c=>c.id),['momentum-strength','momentum-technical','test-of-strength','double-leg-takedown','body-slam']);
  const count=id=>deck.filter(c=>c.id===id).length;
  assert.equal(count('european-uppercut'),1);
  assert.equal(count('joe-hendry-freak-of-nature'),3);
  assert.equal(count('joe-hendry-hendry-slam'),2);
  assert.equal(count('joe-hendry-hendry-lock'),2);
  assert.equal(count('joe-hendry-standing-ovation'),3);
  assert.equal(count('special-joe-hendry'),1);
  assert.equal(count('once-too-often'),1);

  const counterCapable=c=>c?.kind==='move'&&((c.counters?.length??0)||(c.counterStates?.length??0)||(c.counterSubmissionTargets?.length??0)||(c.countersCardIds?.length??0));
  const counters=deck.filter(counterCapable);
  assert.ok(counters.length>=9);
  assert.equal(new Set(counters.flatMap(c=>c.counterStates??[])).size,8);
  assert.equal(new Set(counters.flatMap(c=>c.counterSubmissionTargets??[])).size,4);
});

test('v0.13.38 The Crowd Believes discounts the next Joe-exclusive Move once per Control sequence',()=>{
  const g=new MatchEngine({p1:star('joe-hendry'),p2:star('cm-punk'),decks,rng}), s=g.state(), p=s.players.p1, d=s.players.p2;
  const shared=byId('test-of-strength'), freak=byId('joe-hendry-freak-of-nature'), secondShared=byId('body-slam');
  s.playerInControl='p1'; s.phase='ACTION'; p.hand=[shared,secondShared]; d.hand=[]; p.momentum.strength=10; p.momentum.technical=5; p.momentum.strike=2; p.adrenaline=10;
  assert.equal(g.declareMove('p1',shared),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(p.events.joeCrowdBelievesUsedThisControl,true);
  assert.equal(p.events.joeExclusiveMoveDiscount,1);
  assert.equal(moveEligibility(s,'p1',freak).effectiveCost,5);

  // A second shared connect in the same Control sequence does not stack another discount.
  s.phase='ACTION'; s.playerInControl='p1'; d.posture='standing';
  assert.equal(g.declareMove('p1',secondShared),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(p.events.joeExclusiveMoveDiscount,1);

  // Declaring the Joe-exclusive Move consumes the ability discount.
  s.phase='ACTION'; s.playerInControl='p1'; d.posture='standing'; p.hand.push(freak);
  assert.equal(g.declareMove('p1',freak),true);
  assert.equal(p.events.joeExclusiveMoveDiscount,undefined);
  assert.equal(g.passCounter('p2'),true);
  assert.ok(p.hand.some(c=>c.id==='joe-hendry-standing-ovation'),'Freak of Nature searches Standing Ovation from the authored deck');
  assert.equal(p.namedDiscount['Standing Ovation'],1);
});

test('v0.13.38 I Believe in Joe Hendry searches a Trademark and grants its one-Cost discount',()=>{
  const g=new MatchEngine({p1:star('joe-hendry'),p2:star('cm-punk'),decks,rng}), s=g.state(), p=s.players.p1;
  const special=byId('special-joe-hendry'), freak=byId('joe-hendry-freak-of-nature');
  s.playerInControl='p1'; s.phase='ACTION'; p.hand=[special]; p.deck=[freak]; s.players.p2.posture='standing';
  assert.equal(canPlaySpecial(s,'p1',special),true);
  assert.equal(g.playSpecial('p1',special),true);
  assert.ok(p.hand.some(c=>c.id===freak.id));
  assert.equal(p.namedDiscount['Freak of Nature'],1);
  assert.ok(p.outOfPlay.some(c=>c.id===special.id));
  assert.ok(p.usedSpecialIds.includes(special.id));
});
