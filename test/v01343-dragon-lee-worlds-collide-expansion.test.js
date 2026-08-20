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

test('v0.13.43 Dragon Lee WC1 package is locked with no new shared move',()=>{
  const dragon=star('dragon-lee');
  assert.ok(dragon);
  assert.equal(dragon.setId,'worlds-collide-series-1');
  assert.equal(dragon.hp,58);
  assert.deepEqual(dragon.methodLimits,{agility:null,technical:4,strike:3,strength:2});
  assert.deepEqual(dragon.starterMomentum,{agility:6,technical:3,strike:2,strength:1});
  assert.deepEqual(dragon.leadOffIds,['momentum-agility','momentum-technical','hurricanrana','tilt-a-whirl-headscissors','arm-drag']);
  assert.equal(dragon.ability.name,'Hybrid Athlete');
  assert.deepEqual(dragon.ability.trigger,{type:'dragonHybridAthlete',discount:1});
  assert.equal(dragon.entrance.name,'Control the Empire');
  assert.deepEqual(dragon.entrance.preMatchMomentum,{agility:1,technical:1});
  assert.equal(dragon.entrance.preMatchAdrenaline,1);
  assert.deepEqual(dragon.special,{type:'dragonLuchaLegacy',maxCost:5,methods:['agility','technical'],discount:1});

  const op=byId('dragon-lee-operation-dragon');
  assert.ok(op.trademark); assert.equal(op.rarity,3); assert.equal(op.cost,6); assert.equal(op.damage,10);
  assert.equal(op.method,'agility'); assert.deepEqual(op.requirements,{agility:2}); assert.equal(op.moveType,'aerial'); assert.equal(op.counterState,'running-aerial'); assert.equal(op.groundOpponent,true);
  assert.deepEqual(op.effects.find(e=>e.type==='search'),{type:'search',name:'Dragon Driver',discount:1});

  const inc=byId('dragon-lee-incinerator');
  assert.ok(inc.trademark); assert.equal(inc.cost,5); assert.equal(inc.damage,9); assert.equal(inc.method,'strike'); assert.deepEqual(inc.requirements,{strike:2}); assert.equal(inc.counterState,'leg-extended'); assert.equal(inc.groundOpponent,true);
  assert.deepEqual(inc.effects.find(e=>e.type==='loseOpponentAdrenaline'),{type:'loseOpponentAdrenaline',amount:1});

  const stomp=byId('dragon-lee-double-foot-stomp');
  assert.equal(stomp.name,'Dragon’s Double Foot Stomp'); assert.ok(stomp.trademark); assert.equal(stomp.cost,6); assert.equal(stomp.damage,10);
  assert.equal(stomp.method,'agility'); assert.deepEqual(stomp.requirements,{agility:2}); assert.equal(stomp.moveType,'aerial'); assert.equal(stomp.counterState,'diving-aerial'); assert.equal(stomp.groundedOnly,true);
  assert.deepEqual(stomp.effects.find(e=>e.type==='drawThenDiscardSelf'),{type:'drawThenDiscardSelf',draw:1,discard:1});

  const fin=byId('dragon-lee-dragon-driver');
  assert.ok(fin.finisher); assert.equal(fin.rarity,4); assert.equal(fin.cost,9); assert.equal(fin.damage,16); assert.equal(fin.method,null); assert.deepEqual(fin.requirements,{}); assert.equal(fin.moveType,'grapple'); assert.equal(fin.counterState,'body-elevated'); assert.equal(fin.groundOpponent,true);

  const expectedCodes={
    'dragon-lee-operation-dragon':'WC1-044',
    'dragon-lee-incinerator':'WC1-045',
    'dragon-lee-double-foot-stomp':'WC1-046',
    'dragon-lee-dragon-driver':'WC1-047',
    'entrance-dragon-lee':'WC1-048',
    'special-dragon-lee':'WC1-049',
    'superstar-dragon-lee':'WC1-050'
  };
  for(const [id,code] of Object.entries(expectedCodes)) assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
  assert.equal(CARD_IDS_BY_SET['worlds-collide-series-1'].length,64);
  assert.equal(collectionCards.filter(c=>c.setId==='worlds-collide-series-1'&&c.kind==='superstar').length,8);
  assert.deepEqual(PRE_RELEASE_TEST_SET_IDS,['raw-series-1','worlds-collide-series-1','new-generation-series-1']);
});

test('v0.13.43 Dragon Lee authored deck is 60 pages with approved exclusive counts and no generic Double Foot Stomp',()=>{
  const deck=decks['dragon-lee'];
  assert.ok(deck); assert.equal(deck.length,60); assert.equal(deck.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(deck.slice(0,5).map(c=>c.id),['momentum-agility','momentum-technical','hurricanrana','tilt-a-whirl-headscissors','arm-drag']);
  const count=id=>deck.filter(c=>c.id===id).length;
  assert.equal(count('dragon-lee-operation-dragon'),3);
  assert.equal(count('dragon-lee-incinerator'),2);
  assert.equal(count('dragon-lee-double-foot-stomp'),2);
  assert.equal(count('dragon-lee-dragon-driver'),2);
  assert.equal(count('special-dragon-lee'),1);
  assert.equal(count('double-stomp'),0);
  assert.equal(count('once-too-often'),1);
});

test('v0.13.43 Hybrid Athlete discounts the next Technical after an Aerial and fires only once per Control sequence',()=>{
  const g=new MatchEngine({p1:star('dragon-lee'),p2:star('cm-punk'),decks,rng}),s=g.state(),dragon=s.players.p1,opp=s.players.p2;
  const aerial=byId('tilt-a-whirl-headscissors'),tech=byId('arm-drag'),secondAerial=byId('suicide-dive');
  s.playerInControl='p1'; s.phase='ACTION'; dragon.hand=[aerial,tech,secondAerial]; opp.hand=[]; opp.posture='standing';
  dragon.momentum.agility=4; dragon.momentum.technical=4; dragon.adrenaline=4;
  assert.equal(g.declareMove('p1',aerial),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(dragon.events.dragonHybridUsedThisControl,true);
  assert.equal(moveEligibility(s,'p1',tech).effectiveCost,2);
  s.phase='ACTION'; s.playerInControl='p1'; opp.posture='standing';
  assert.equal(g.declareMove('p1',tech),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(dragon.moveTypeDiscount.aerial??0,0,'ability cannot arm a second discount in the same Control sequence');
});

test('v0.13.43 Hybrid Athlete can also discount the next Aerial after a Technical Move',()=>{
  const g=new MatchEngine({p1:star('dragon-lee'),p2:star('cm-punk'),decks,rng}),s=g.state(),dragon=s.players.p1,opp=s.players.p2;
  const tech=byId('arm-drag'),aerial=byId('suicide-dive');
  s.playerInControl='p1'; s.phase='ACTION'; dragon.hand=[tech,aerial]; opp.hand=[]; opp.posture='standing'; dragon.momentum.agility=4; dragon.momentum.technical=4; dragon.adrenaline=4;
  assert.equal(g.declareMove('p1',tech),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(moveEligibility(s,'p1',aerial).effectiveCost,4);
});

test('v0.13.43 Lucha Legacy searches a shared Agility/Technical Move at Cost 5 or less and discounts it',()=>{
  const g=new MatchEngine({p1:star('dragon-lee'),p2:star('cm-punk'),decks,rng}),s=g.state(),dragon=s.players.p1;
  const special=byId('special-dragon-lee'),target=byId('senton-splash');
  s.playerInControl='p1'; s.phase='ACTION'; s.players.p2.posture='on-mat'; dragon.hand=[special]; dragon.deck=[target]; dragon.adrenaline=10; dragon.momentum.agility=5; dragon.momentum.technical=5;
  assert.equal(canPlaySpecial(s,'p1',special),true);
  assert.equal(g.playSpecial('p1',special),true);
  assert.ok(dragon.hand.some(c=>c.id===target.id));
  assert.equal(moveEligibility(s,'p1',dragon.hand.find(c=>c.id===target.id)).effectiveCost,4);
  assert.ok(dragon.outOfPlay.some(c=>c.id===special.id));
});
