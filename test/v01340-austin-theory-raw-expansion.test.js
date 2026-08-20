import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { autoCounterEligibility, canPlaySpecial, counterEligibility, moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { legalForSuperstar } from '../js/data/deck-builder.js?v=0.13.72';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.40 Austin Theory RAW package and collector identities are locked',()=>{
  const theory=star('austin-theory');
  assert.ok(theory);
  assert.equal(theory.setId,'raw-series-1');
  assert.equal(theory.hp,61);
  assert.deepEqual(theory.methodLimits,{strike:null,strength:4,agility:3,technical:2});
  assert.deepEqual(theory.starterMomentum,{strike:6,strength:2,agility:2,technical:2});
  assert.deepEqual(theory.leadOffIds,['momentum-strike','momentum-strength','dropkick','firemans-carry','superkick']);
  assert.equal(theory.ability.name,'The Future Is Now');
  assert.deepEqual(theory.ability.trigger,{type:'theoryFutureIsNow',discount:1});
  assert.deepEqual(theory.factionTags,['vision']);
  assert.equal(theory.entrance.name,'This Is Me');
  assert.deepEqual(theory.entrance.preMatchMomentum,{strike:1,strength:1});
  assert.equal(theory.entrance.preMatchAdrenaline,1);
  assert.deepEqual(theory.special,{type:'austinTheoryAllDay',drawOnConnect:1});

  const ataxia=byId('austin-theory-ataxia');
  assert.ok(ataxia.trademark); assert.equal(ataxia.rarity,3); assert.equal(ataxia.cost,6); assert.equal(ataxia.damage,10);
  assert.equal(ataxia.method,'strength'); assert.deepEqual(ataxia.requirements,{strength:2}); assert.equal(ataxia.moveType,'grapple'); assert.equal(ataxia.counterState,'body-elevated'); assert.equal(ataxia.groundOpponent,true);
  assert.deepEqual(ataxia.effects.find(e=>e.type==='search'),{type:'search',name:'A-Town Down',discount:1});

  const rolling=byId('austin-theory-rolling-thunder-blockbuster');
  assert.ok(rolling.trademark); assert.equal(rolling.rarity,3); assert.equal(rolling.cost,5); assert.equal(rolling.damage,8);
  assert.equal(rolling.method,'agility'); assert.deepEqual(rolling.requirements,{agility:2}); assert.equal(rolling.moveType,'aerial'); assert.equal(rolling.counterState,'running-aerial');
  assert.deepEqual(rolling.effects.find(e=>e.type==='gainAdrenaline'),{type:'gainAdrenaline',amount:1});

  const brainbuster=byId('austin-theory-patella-brainbuster');
  assert.ok(brainbuster.trademark); assert.equal(brainbuster.rarity,3); assert.equal(brainbuster.cost,6); assert.equal(brainbuster.damage,9);
  assert.equal(brainbuster.method,'technical'); assert.deepEqual(brainbuster.requirements,{technical:2}); assert.equal(brainbuster.counterState,'body-elevated');
  assert.deepEqual(brainbuster.effects.find(e=>e.type==='loseOpponentAdrenaline'),{type:'loseOpponentAdrenaline',amount:1});

  const fin=byId('austin-theory-a-town-down');
  assert.ok(fin.finisher); assert.equal(fin.rarity,4); assert.equal(fin.cost,9); assert.equal(fin.damage,15); assert.equal(fin.method,null); assert.deepEqual(fin.requirements,{}); assert.equal(fin.counterState,'body-elevated');

  const entrance=byId('entrance-austin-theory'),special=byId('special-austin-theory'),maxxine=byId('manager-maxxine-dupri');
  assert.equal(entrance.name,'This Is Me'); assert.equal(entrance.rarity,4);
  assert.equal(special.name,'All Day'); assert.equal(special.rarity,4); assert.equal(special.special.type,'austinTheoryAllDay');
  assert.equal(maxxine.name,'Maxxine Dupri'); assert.equal(maxxine.kind,'manager'); assert.equal(maxxine.rarity,3); assert.deepEqual(maxxine.allowedFactionTags,['vision']);

  const expectedCodes={
    'austin-theory-ataxia':'RAW1-056',
    'austin-theory-rolling-thunder-blockbuster':'RAW1-057',
    'austin-theory-patella-brainbuster':'RAW1-058',
    'austin-theory-a-town-down':'RAW1-059',
    'entrance-austin-theory':'RAW1-060',
    'special-austin-theory':'RAW1-061',
    'manager-maxxine-dupri':'RAW1-062',
    'superstar-austin-theory':'RAW1-063'
  };
  for(const [id,code] of Object.entries(expectedCodes)) assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
  assert.equal(CARD_IDS_BY_SET['raw-series-1'].length,71);
});

test('v0.13.40 Austin Theory authored deck is 60 pages, legal, and includes Maxxine while Logan does not',()=>{
  const deck=decks['austin-theory'];
  assert.ok(deck); assert.equal(deck.length,60); assert.equal(deck.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(deck.slice(0,5).map(c=>c.id),['momentum-strike','momentum-strength','dropkick','firemans-carry','superkick']);
  const momentum=method=>deck.filter(c=>c.kind==='momentum'&&c.method===method).length;
  assert.deepEqual({strike:momentum('strike'),strength:momentum('strength'),agility:momentum('agility'),technical:momentum('technical')},{strike:6,strength:2,agility:2,technical:2});
  const count=id=>deck.filter(c=>c.id===id).length;
  assert.equal(count('austin-theory-ataxia'),3);
  assert.equal(count('austin-theory-rolling-thunder-blockbuster'),3);
  assert.equal(count('austin-theory-patella-brainbuster'),2);
  assert.equal(count('austin-theory-a-town-down'),2);
  assert.equal(count('special-austin-theory'),1);
  assert.equal(count('manager-maxxine-dupri'),1);
  assert.equal(count('once-too-often'),1);
  assert.equal((decks['logan-paul']??[]).some(c=>c.id==='manager-maxxine-dupri'),false);
});

test('v0.13.40 The Future Is Now discounts only the next Grapple after a Strike and only once per Control sequence',()=>{
  const g=new MatchEngine({p1:star('austin-theory'),p2:star('cm-punk'),decks,rng}),s=g.state(),p=s.players.p1,d=s.players.p2;
  const strike=byId('clothesline'),secondStrike=byId('superkick'),ataxia=byId('austin-theory-ataxia');
  s.playerInControl='p1'; s.phase='ACTION'; p.hand=[strike,secondStrike,ataxia]; d.hand=[];
  p.momentum.strike=5;p.momentum.strength=5;p.adrenaline=10;
  assert.equal(g.declareMove('p1',strike),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(p.events.theoryFutureIsNowUsedThisControl,true);
  assert.equal(p.moveTypeDiscount.grapple,1);
  assert.equal(moveEligibility(s,'p1',ataxia).effectiveCost,5);
  d.posture='standing'; s.phase='ACTION'; s.playerInControl='p1';
  assert.equal(g.declareMove('p1',secondStrike),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(p.moveTypeDiscount.grapple,1,'second Strike must not stack the once-per-Control discount');
});

test('v0.13.40 All Day blocks Auto Counter only, keeps normal counters legal, and draws on a connected Strike',()=>{
  const g=new MatchEngine({p1:star('austin-theory'),p2:star('cm-punk'),decks,rng}),s=g.state(),p=s.players.p1,d=s.players.p2;
  const special=byId('special-austin-theory'),strike=byId('clothesline'),normalCounter=byId('punch'),drawCard=byId('body-slam');
  s.playerInControl='p1'; s.phase='ACTION'; p.hand=[special,strike]; p.deck=[drawCard]; d.hand=Array(8).fill(null).map((_,i)=>({...byId('fire-up'),id:`dummy-${i}`}));
  p.momentum.strike=5;p.adrenaline=10;
  assert.equal(canPlaySpecial(s,'p1',special),true);
  assert.equal(g.playSpecial('p1',special),true);
  assert.equal(p.events.austinTheoryAllDayArmed,true);
  assert.equal(g.declareMove('p1',strike),true);
  assert.equal(s.proposedMove.noAutoCounter,true);
  assert.equal(autoCounterEligibility(s,'p2',strike).legal,false);
  assert.equal(counterEligibility(s,'p2',strike,normalCounter).legal,true,'normal card counter remains legal');
  d.hand=[];
  assert.equal(g.passCounter('p2'),true);
  assert.ok(p.hand.some(c=>c.id==='body-slam'),'All Day draws 1 when the protected Strike connects');
  assert.ok(p.outOfPlay.some(c=>c.id==='special-austin-theory'));
});

test('v0.13.40 Maxxine Dupri uses the Vision faction tag and her manager effects work once per match',()=>{
  const maxxine=byId('manager-maxxine-dupri');
  for(const id of ['austin-theory','logan-paul','bron-breakker']) assert.equal(legalForSuperstar(star(id),maxxine),true,id);
  assert.equal(legalForSuperstar(star('roxanne-perez'),maxxine),false);
  assert.ok(star('bron-breakker').factionTags.includes('vision'));

  const g=new MatchEngine({p1:star('austin-theory'),p2:star('cm-punk'),decks,rng}),s=g.state(),p=s.players.p1,d=s.players.p2;
  const searched=byId('superkick'),incoming=byId('clothesline'),counter=byId('duck');
  s.playerInControl='p1'; s.phase='ACTION'; p.hand=[maxxine,incoming]; p.deck=[searched]; d.hand=[counter];
  p.momentum.strike=5; d.adrenaline=3; d.momentum.attitude=3; d.events.entranceAdrenalineGranted=true;
  assert.equal(g.playManager('p1',maxxine),true);
  assert.ok(p.hand.some(c=>c.id==='superkick'),'Maxxine searches a shared Strike with Cost 4 or less');
  assert.equal(g._managerMoveCounteredHooks('p1',incoming),true);
  assert.equal(d.adrenaline,2,'first countered Move drains opponent Adrenaline by 1');
  assert.equal(p.events.maxxineCounteredMoveUsed,true);
  assert.equal(g._managerMoveCounteredHooks('p1',incoming),false,'Maxxine manager trigger is once per match');
  assert.equal(d.adrenaline,2);
});
