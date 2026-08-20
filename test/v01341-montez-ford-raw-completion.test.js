import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards, linkedGameplayCards } from '../js/data/content.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { canPlaySpecial, moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const linked=id=>linkedGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.41 Montez Ford completes the eight-Superstar RAW Series 1 collector package',()=>{
  const montez=star('montez-ford');
  assert.ok(montez);
  assert.equal(montez.setId,'raw-series-1');
  assert.equal(montez.hp,60);
  assert.deepEqual(montez.methodLimits,{agility:null,strike:4,strength:3,technical:2});
  assert.deepEqual(montez.starterMomentum,{agility:6,strike:3,strength:2,technical:1});
  assert.deepEqual(montez.leadOffIds,['momentum-agility','momentum-strike','dropkick','running-forearm','hurricanrana']);
  assert.equal(montez.ability.name,'Take Flight');
  assert.deepEqual(montez.ability.trigger,{type:'montezTakeFlight',discount:1});
  assert.equal(montez.entrance.name,'We Want The Smoke');
  assert.deepEqual(montez.entrance.preMatchMomentum,{agility:1,strike:1});
  assert.equal(montez.entrance.preMatchAdrenaline,1);
  assert.deepEqual(montez.special,{type:'angeloDawkinsRunIn',linkedCardId:'linked-street-profits-revelation'});

  const spine=byId('montez-ford-spinebuster');
  assert.ok(spine.trademark); assert.equal(spine.rarity,3); assert.equal(spine.cost,5); assert.equal(spine.damage,8);
  assert.equal(spine.method,'strength'); assert.deepEqual(spine.requirements,{strength:2}); assert.equal(spine.counterState,'torso-trapped'); assert.equal(spine.groundOpponent,true);
  assert.deepEqual(spine.effects.find(e=>e.type==='gainAdrenaline'),{type:'gainAdrenaline',amount:1});

  const block=byId('montez-ford-blockbuster');
  assert.ok(block.trademark); assert.equal(block.rarity,3); assert.equal(block.cost,5); assert.equal(block.damage,9);
  assert.equal(block.method,'agility'); assert.deepEqual(block.requirements,{agility:2}); assert.equal(block.moveType,'aerial'); assert.equal(block.counterState,'diving-aerial'); assert.equal(block.groundOpponent,true);
  assert.deepEqual(block.effects.find(e=>e.type==='drawThenDiscardSelf'),{type:'drawThenDiscardSelf',draw:1,discard:1});

  const splash=byId('montez-ford-450-splash');
  assert.ok(splash.trademark); assert.equal(splash.rarity,3); assert.equal(splash.cost,7); assert.equal(splash.damage,12);
  assert.equal(splash.method,'agility'); assert.deepEqual(splash.requirements,{agility:3}); assert.equal(splash.moveType,'aerial'); assert.equal(splash.counterState,'diving-aerial'); assert.equal(splash.groundedOnly,true);

  const heavens=byId('montez-ford-from-the-heavens');
  assert.ok(heavens.finisher); assert.equal(heavens.rarity,4); assert.equal(heavens.cost,9); assert.equal(heavens.damage,16);
  assert.equal(heavens.method,null); assert.deepEqual(heavens.requirements,{}); assert.equal(heavens.moveType,'aerial'); assert.equal(heavens.counterState,'diving-aerial'); assert.equal(heavens.groundedOnly,true);

  const angelo=byId('special-angelo-dawkins');
  assert.equal(angelo.name,'Angelo Dawkins'); assert.equal(angelo.kind,'action'); assert.equal(angelo.rarity,4); assert.equal(angelo.cost,10); assert.equal(angelo.superstarId,'montez-ford');
  assert.equal(angelo.special.type,'angeloDawkinsRunIn');
  assert.equal(byId('entrance-montez-ford').name,'We Want The Smoke');

  const expectedCodes={
    'montez-ford-spinebuster':'RAW1-064',
    'montez-ford-blockbuster':'RAW1-065',
    'montez-ford-450-splash':'RAW1-066',
    'montez-ford-from-the-heavens':'RAW1-067',
    'special-angelo-dawkins':'RAW1-068',
    'entrance-montez-ford':'RAW1-069',
    'superstar-montez-ford':'RAW1-070'
  };
  for(const [id,code] of Object.entries(expectedCodes)) assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
  assert.equal(CARD_IDS_BY_SET['raw-series-1'].length,71);
  assert.equal(Object.values(superstars).filter(s=>s.setId==='raw-series-1').length,8);
});

test('v0.13.41 Montez authored deck is 60 pages and uses his named versions instead of generic counterparts',()=>{
  const deck=decks['montez-ford'];
  assert.ok(deck); assert.equal(deck.length,60); assert.equal(deck.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(deck.slice(0,5).map(c=>c.id),['momentum-agility','momentum-strike','dropkick','running-forearm','hurricanrana']);
  const momentum=method=>deck.filter(c=>c.kind==='momentum'&&c.method===method).length;
  assert.deepEqual({agility:momentum('agility'),strike:momentum('strike'),strength:momentum('strength'),technical:momentum('technical')},{agility:6,strike:3,strength:2,technical:1});
  const count=id=>deck.filter(c=>c.id===id).length;
  assert.equal(count('montez-ford-spinebuster'),2);
  assert.equal(count('montez-ford-blockbuster'),3);
  assert.equal(count('montez-ford-450-splash'),2);
  assert.equal(count('montez-ford-from-the-heavens'),2);
  assert.equal(count('special-angelo-dawkins'),1);
  assert.equal(count('once-too-often'),1);
  assert.equal(count('spinebuster'),0);
  assert.equal(count('blockbuster'),0);
  assert.equal(count('450-splash'),0);
});

test('v0.13.41 Take Flight discounts the next Aerial after a non-Aerial once per Control sequence',()=>{
  const g=new MatchEngine({p1:star('montez-ford'),p2:star('cm-punk'),decks,rng}),s=g.state(),p=s.players.p1,d=s.players.p2;
  const setup=byId('dropkick'),aerial=byId('montez-ford-blockbuster'),secondSetup=byId('running-forearm');
  s.playerInControl='p1'; s.phase='ACTION'; p.hand=[setup,aerial,secondSetup]; d.hand=[];
  p.momentum.agility=5;p.momentum.strike=5;p.adrenaline=10;
  assert.equal(g.declareMove('p1',setup),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(p.events.montezTakeFlightUsedThisControl,true);
  assert.equal(p.moveTypeDiscount.aerial,1);
  assert.equal(moveEligibility(s,'p1',aerial).effectiveCost,4);
  d.posture='standing'; s.phase='ACTION'; s.playerInControl='p1';
  assert.equal(g.declareMove('p1',secondSetup),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(p.moveTypeDiscount.aerial,1,'second non-Aerial must not stack Take Flight in the same Control sequence');
});

test('v0.13.41 Angelo Dawkins costs 10 and creates only the linked C10/D16 Revelation Finisher',()=>{
  const revelation=linked('linked-street-profits-revelation');
  assert.ok(revelation);
  assert.equal(revelation.name,'Revelation'); assert.equal(revelation.cost,10); assert.equal(revelation.damage,16);
  assert.equal(revelation.finisher,true); assert.equal(revelation.method,null); assert.deepEqual(revelation.requirements,{});
  assert.equal(revelation.counterState,'body-elevated'); assert.equal(revelation.groundOpponent,true); assert.equal(revelation.linkedOnly,true); assert.equal(revelation.oneUse,true);
  assert.equal(allGameplayCards.some(c=>c.id===revelation.id),false,'linked Revelation is outside the collectible gameplay array');
  assert.equal(collectionCards.some(c=>c.id===revelation.id),false,'linked Revelation is absent from Catalogue/booster collection cards');
  assert.equal(CARD_NUMBER_BY_ID[revelation.id],undefined,'linked Revelation has no collector number');
  assert.equal(decks['montez-ford'].some(c=>c.id===revelation.id),false,'linked Revelation cannot be authored into the deck');

  const g=new MatchEngine({p1:star('montez-ford'),p2:star('cm-punk'),decks,rng}),s=g.state(),p=s.players.p1;
  const angelo=byId('special-angelo-dawkins');
  s.playerInControl='p1'; s.phase='ACTION'; p.hand=[angelo]; p.momentum.agility=5;p.momentum.strike=4;p.momentum.strength=0;p.momentum.technical=0;p.momentum.attitude=0;p.adrenaline=0;
  assert.equal(canPlaySpecial(s,'p1',angelo),false,'Angelo is not legal below C10');
  p.momentum.agility=6;
  assert.equal(canPlaySpecial(s,'p1',angelo),true,'Angelo becomes legal at total Momentum 10');
  assert.equal(g.playSpecial('p1',angelo),true);
  const created=p.hand.find(c=>c.id===revelation.id);
  assert.ok(created,'Angelo creates Revelation directly into hand');
  assert.ok(p.outOfPlay.some(c=>c.id===angelo.id),'Angelo is consumed once per match');
  assert.equal(moveEligibility(s,'p1',created).legal,true,'C10 Revelation is immediately affordable after legal C10 Angelo');
});
