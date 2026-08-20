import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { canPlaySpecial, moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.72';
import { PRE_RELEASE_TEST_SET_IDS } from '../js/data/release.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.42 Lola Vice WC1 package and shared Evolution variants are locked',()=>{
  const lola=star('lola-vice');
  assert.ok(lola);
  assert.equal(lola.setId,'worlds-collide-series-1');
  assert.equal(lola.hp,59);
  assert.deepEqual(lola.methodLimits,{strike:null,technical:4,agility:2,strength:1});
  assert.deepEqual(lola.starterMomentum,{strike:7,technical:4,agility:1});
  assert.deepEqual(lola.leadOffIds,['momentum-strike','momentum-technical','punch','leg-kick','spinning-back-kick']);
  assert.equal(lola.ability.name,'Counter Striker');
  assert.deepEqual(lola.ability.trigger,{type:'lolaCounterStriker',discount:1,damage:1});
  assert.equal(lola.entrance.name,'Te Lo Rompo');
  assert.deepEqual(lola.entrance.preMatchMomentum,{strike:1,technical:1});
  assert.equal(lola.entrance.preMatchAdrenaline,1);
  assert.deepEqual(lola.special,{type:'lolaFistsDontLie',opponentAdrenaline:-2,drawIfZero:1});

  const hip=byId('lola-vice-running-hip-attack');
  assert.ok(hip.trademark); assert.equal(hip.rarity,3); assert.equal(hip.cost,5); assert.equal(hip.damage,8);
  assert.equal(hip.method,'strike'); assert.deepEqual(hip.requirements,{strike:2}); assert.equal(hip.counterState,'torso-trapped'); assert.equal(hip.groundOpponent,true);
  assert.deepEqual(hip.effects.find(e=>e.type==='loseOpponentAdrenaline'),{type:'loseOpponentAdrenaline',amount:1});

  const heel=byId('lola-vice-spinning-heel-kick');
  assert.equal(heel.name,'Lola’s Spinning Heel Kick'); assert.ok(heel.trademark); assert.equal(heel.cost,5); assert.equal(heel.damage,9);
  assert.equal(heel.method,'strike'); assert.deepEqual(heel.requirements,{strike:2}); assert.equal(heel.counterState,'leg-extended'); assert.equal(heel.groundOpponent,true);
  assert.deepEqual(heel.effects.find(e=>e.type==='search'),{type:'search',name:'305',discount:1});

  const choke=byId('lola-vice-triangle-choke');
  assert.equal(choke.name,'Lola’s Triangle Choke'); assert.ok(choke.trademark); assert.equal(choke.cost,6); assert.equal(choke.damage,0);
  assert.equal(choke.method,'technical'); assert.deepEqual(choke.requirements,{technical:2}); assert.equal(choke.groundedOnly,true); assert.equal(choke.counterState,'torso-trapped');
  assert.deepEqual(choke.submission,{bodyPart:'head',pressure:5});

  const finisher=byId('lola-vice-305');
  assert.ok(finisher.finisher); assert.equal(finisher.rarity,4); assert.equal(finisher.cost,9); assert.equal(finisher.damage,15);
  assert.equal(finisher.method,null); assert.deepEqual(finisher.requirements,{}); assert.equal(finisher.moveType,'strike'); assert.equal(finisher.counterState,'arm-extended'); assert.equal(finisher.groundOpponent,true);

  const sharedHeel=byId('spinning-heel-kick');
  assert.equal(sharedHeel.setId,'evolution-series-1'); assert.equal(sharedHeel.rarity,2); assert.equal(sharedHeel.cost,4); assert.equal(sharedHeel.damage,6);
  assert.equal(sharedHeel.method,'strike'); assert.deepEqual(sharedHeel.requirements,{strike:1}); assert.equal(sharedHeel.counterState,'leg-extended'); assert.equal(sharedHeel.groundOpponent,false);
  assert.deepEqual(sharedHeel.effects.find(e=>e.type==='gainAdrenaline'),{type:'gainAdrenaline',amount:1});

  const sharedChoke=byId('triangle-choke');
  assert.equal(sharedChoke.setId,'evolution-series-1'); assert.equal(sharedChoke.rarity,2); assert.equal(sharedChoke.cost,5); assert.equal(sharedChoke.damage,0);
  assert.equal(sharedChoke.method,'technical'); assert.deepEqual(sharedChoke.requirements,{technical:1}); assert.equal(sharedChoke.groundedOnly,true); assert.equal(sharedChoke.counterState,'torso-trapped');
  assert.deepEqual(sharedChoke.submission,{bodyPart:'head',pressure:3}); assert.equal(sharedChoke.opponentAdrenalineOnConnect,-1);

  const expectedCodes={
    'lola-vice-running-hip-attack':'WC1-037',
    'lola-vice-spinning-heel-kick':'WC1-038',
    'lola-vice-triangle-choke':'WC1-039',
    'lola-vice-305':'WC1-040',
    'entrance-lola-vice':'WC1-041',
    'special-lola-vice':'WC1-042',
    'superstar-lola-vice':'WC1-043',
    'spinning-heel-kick':'EVO1-073',
    'triangle-choke':'EVO1-074'
  };
  for(const [id,code] of Object.entries(expectedCodes)) assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
  assert.equal(CARD_IDS_BY_SET['worlds-collide-series-1'].length,64);
  assert.equal(CARD_IDS_BY_SET['evolution-series-1'].length,75);
  assert.equal(collectionCards.some(c=>c.id==='spinning-heel-kick'),true);
  assert.equal(collectionCards.some(c=>c.id==='triangle-choke'),true);
  assert.deepEqual(PRE_RELEASE_TEST_SET_IDS,['raw-series-1','worlds-collide-series-1','new-generation-series-1']);
});

test('v0.13.42 Lola authored deck is 60 pages and uses named versions rather than generic equivalents',()=>{
  const deck=decks['lola-vice'];
  assert.ok(deck); assert.equal(deck.length,60); assert.equal(deck.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(deck.slice(0,5).map(c=>c.id),['momentum-strike','momentum-technical','punch','leg-kick','spinning-back-kick']);
  const count=id=>deck.filter(c=>c.id===id).length;
  assert.equal(count('lola-vice-running-hip-attack'),3);
  assert.equal(count('lola-vice-spinning-heel-kick'),3);
  assert.equal(count('lola-vice-triangle-choke'),2);
  assert.equal(count('lola-vice-305'),2);
  assert.equal(count('special-lola-vice'),1);
  assert.equal(count('once-too-often'),1);
  assert.equal(count('running-hip-attack'),0);
  assert.equal(count('spinning-heel-kick'),0);
  assert.equal(count('triangle-choke'),0);
});

test('v0.13.42 Counter Striker turns a successful defensive Counter into one discounted +1 Damage Strike',()=>{
  const g=new MatchEngine({p1:star('lola-vice'),p2:star('cm-punk'),decks,rng}),s=g.state(),lola=s.players.p1,opp=s.players.p2;
  const incoming=byId('punch'),duck=byId('duck'),strike=byId('spinning-back-kick');
  s.playerInControl='p2'; s.phase='ACTION'; opp.hand=[incoming]; lola.hand=[duck,strike];
  opp.momentum.strike=3; opp.adrenaline=3; lola.momentum.strike=4; lola.adrenaline=3;
  assert.equal(g.declareMove('p2',incoming),true);
  assert.equal(g.counter('p1',duck),true);
  assert.equal(s.playerInControl,'p1');
  assert.equal(lola.methodDiscount.strike,1);
  assert.equal(lola.events.lolaCounterStrikeDamage,1);
  assert.equal(moveEligibility(s,'p1',strike).effectiveCost,2);
  const hpBefore=opp.hp;
  s.phase='ACTION'; s.playerInControl='p1'; opp.hand=[]; opp.posture='standing';
  assert.equal(g.declareMove('p1',strike),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(hpBefore-opp.hp,6,'Counter Striker adds exactly +1 Damage to the next Strike');
  assert.equal(lola.events.lolaCounterStrikeDamage,undefined);
});

test('v0.13.42 My Fists Don’t Lie arms the next connected Strike for -2 extra opponent Adrenaline and conditional draw',()=>{
  const g=new MatchEngine({p1:star('lola-vice'),p2:star('cm-punk'),decks,rng}),s=g.state(),lola=s.players.p1,opp=s.players.p2;
  const special=byId('special-lola-vice'),strike=byId('punch');
  s.playerInControl='p1'; s.phase='ACTION'; lola.hand=[special,strike]; opp.hand=[];
  lola.momentum.strike=4; lola.adrenaline=3; opp.adrenaline=2; opp.posture='standing';
  assert.equal(canPlaySpecial(s,'p1',special),true);
  assert.equal(g.playSpecial('p1',special),true);
  assert.equal(lola.events.lolaFistsDontLieArmed,true);
  const beforeHand=lola.hand.length;
  assert.equal(g.declareMove('p1',strike),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(opp.adrenaline,0,'normal -1 shift plus special -2 clamps opponent at zero');
  assert.equal(lola.hand.length,beforeHand,'strike left hand and the zero-Adrenaline rider drew exactly one replacement page');
  assert.ok(lola.outOfPlay.some(c=>c.id===special.id));
});
