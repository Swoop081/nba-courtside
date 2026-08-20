import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.44 Hijo del Vikingo WC1 package is locked',()=>{
  const v=star('hijo-del-vikingo');
  assert.ok(v); assert.equal(v.hp,57); assert.equal(v.setId,'worlds-collide-series-1');
  assert.deepEqual(v.methodLimits,{agility:null,technical:3,strike:2,strength:1});
  assert.deepEqual(v.starterMomentum,{agility:8,technical:2,strike:2});
  assert.deepEqual(v.leadOffIds,['momentum-agility','momentum-technical','springboard-crossbody','hurricanrana','dropkick']);
  assert.equal(v.ability.name,'Jinete del Aire'); assert.deepEqual(v.ability.trigger,{type:'vikingoJineteDelAire',discount:2});
  assert.equal(v.entrance.name,'Alas de Oro'); assert.deepEqual(v.entrance.preMatchMomentum,{agility:1,technical:1}); assert.equal(v.entrance.preMatchAdrenaline,1);
  assert.deepEqual(v.special,{type:'vikingoElOjoProtection',adrenaline:1,draw:1});

  const md=byId('vikingo-mexican-destroyer'); assert.ok(md.trademark); assert.equal(md.cost,6); assert.equal(md.damage,10); assert.equal(md.method,'technical'); assert.deepEqual(md.requirements,{technical:2}); assert.equal(md.counterState,'body-elevated'); assert.deepEqual(md.effects.find(e=>e.type==='gainAdrenaline'),{type:'gainAdrenaline',amount:1});
  const splash=byId('vikingo-twisting-450-splash'); assert.ok(splash.trademark); assert.equal(splash.cost,7); assert.equal(splash.damage,12); assert.equal(splash.method,'agility'); assert.deepEqual(splash.requirements,{agility:3}); assert.equal(splash.counterState,'diving-aerial'); assert.equal(splash.groundedOnly,true); assert.deepEqual(splash.effects.find(e=>e.type==='search'),{type:'search',name:'El Cuerno del Vikingo',discount:2});
  const rana=byId('vikingo-top-rope-poison-rana'); assert.ok(rana.trademark); assert.equal(rana.cost,6); assert.equal(rana.damage,10); assert.equal(rana.method,'technical'); assert.deepEqual(rana.effects.find(e=>e.type==='discardOpponent'),{type:'discardOpponent',amount:1});
  const fin=byId('vikingo-el-cuerno-del-vikingo'); assert.ok(fin.finisher); assert.equal(fin.cost,10); assert.equal(fin.damage,17); assert.equal(fin.method,null); assert.deepEqual(fin.requirements,{}); assert.equal(fin.moveType,'aerial'); assert.equal(fin.counterState,'diving-aerial'); assert.equal(fin.groundedOnly,true);
  const sp=byId('special-hijo-del-vikingo'); assert.equal(sp.name,'El Ojo’s Protection'); assert.equal(sp.rarity,4);

  const expected={
    'vikingo-mexican-destroyer':'WC1-051','vikingo-twisting-450-splash':'WC1-052','vikingo-top-rope-poison-rana':'WC1-053','vikingo-el-cuerno-del-vikingo':'WC1-054','entrance-hijo-del-vikingo':'WC1-055','special-hijo-del-vikingo':'WC1-056','superstar-hijo-del-vikingo':'WC1-057'
  };
  for(const [id,code] of Object.entries(expected)) assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
  assert.equal(CARD_IDS_BY_SET['worlds-collide-series-1'].length,64);
  assert.equal(collectionCards.filter(c=>c.setId==='worlds-collide-series-1'&&c.kind==='superstar').length,8);
});

test('v0.13.44 Vikingo authored deck is 60 pages and keeps the shared 450 Splash',()=>{
  const deck=decks['hijo-del-vikingo']; assert.ok(deck); assert.equal(deck.length,60); assert.equal(deck.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(deck.slice(0,5).map(c=>c.id),['momentum-agility','momentum-technical','springboard-crossbody','hurricanrana','dropkick']);
  const count=id=>deck.filter(c=>c.id===id).length;
  assert.equal(count('vikingo-mexican-destroyer'),2); assert.equal(count('vikingo-twisting-450-splash'),3); assert.equal(count('vikingo-top-rope-poison-rana'),2); assert.equal(count('vikingo-el-cuerno-del-vikingo'),2); assert.equal(count('special-hijo-del-vikingo'),1); assert.equal(count('450-splash'),3); assert.equal(count('once-too-often'),1);
});

test('v0.13.44 Jinete del Aire discounts only the next Diving Aerial after a Running Aerial',()=>{
  const g=new MatchEngine({p1:star('hijo-del-vikingo'),p2:star('cm-punk'),decks,rng}),s=g.state(),v=s.players.p1,opp=s.players.p2;
  const running=byId('springboard-crossbody'),diving=byId('450-splash'),other=byId('hurricanrana');
  s.playerInControl='p1'; s.phase='ACTION'; v.hand=[running,diving,other]; opp.hand=[]; opp.posture='standing'; v.momentum.agility=8; v.momentum.technical=3; v.adrenaline=10;
  assert.equal(g.declareMove('p1',running),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(v.events.vikingoJineteUsedThisControl,true); assert.equal(v.events.vikingoDivingAerialDiscount,2);
  opp.posture='on-mat'; s.phase='ACTION'; s.playerInControl='p1';
  assert.equal(moveEligibility(s,'p1',diving).effectiveCost,5);
  assert.equal(moveEligibility(s,'p1',other).effectiveCost,other.cost,'non-Diving card is not discounted');
  assert.equal(g.declareMove('p1',diving),true); assert.equal(v.events.vikingoDivingAerialDiscount??0,0,'discount is consumed when the Diving Aerial is committed');
});

test('v0.13.44 El Ojo’s Protection is offered after a countered Aerial and decline preserves the card',()=>{
  const g=new MatchEngine({p1:star('hijo-del-vikingo'),p2:star('cm-punk'),decks,rng}),s=g.state(),v=s.players.p1,opp=s.players.p2;
  const risky=byId('450-splash'),special=byId('special-hijo-del-vikingo'),counter=byId('sidestep');
  s.playerInControl='p1'; s.phase='ACTION'; v.hand=[risky,special]; opp.hand=[counter]; opp.posture='on-mat'; v.momentum.agility=8; v.adrenaline=10; opp.momentum.technical=10; opp.momentum.agility=10; opp.momentum.strike=10; opp.momentum.strength=10;
  assert.equal(g.declareMove('p1',risky),true); assert.equal(g.counter('p2',counter),true);
  assert.equal(s.phase,'TRIGGER_RESPONSE'); assert.equal(s.pendingTriggeredSpecial?.specialType,'vikingoElOjoProtection'); assert.equal(v.stun,0);
  assert.equal(g.resolveTriggeredSpecial('p1',false),true); assert.equal(v.stun,1); assert.ok(v.hand.some(c=>c.id===special.id)); assert.equal(v.usedSpecialIds.includes(special.id),false);
});

test('v0.13.44 El Ojo’s Protection can prevent self-Stun, gain Adrenaline and draw',()=>{
  const g=new MatchEngine({p1:star('hijo-del-vikingo'),p2:star('cm-punk'),decks,rng}),s=g.state(),v=s.players.p1,opp=s.players.p2;
  const risky=byId('450-splash'),special=byId('special-hijo-del-vikingo'),counter=byId('sidestep'),drawCard=byId('dropkick');
  s.playerInControl='p1'; s.phase='ACTION'; v.hand=[risky,special]; v.deck=[drawCard]; opp.hand=[counter]; opp.posture='on-mat'; v.momentum.agility=8; v.adrenaline=0; opp.momentum.technical=10; opp.momentum.agility=10; opp.momentum.strike=10; opp.momentum.strength=10;
  assert.equal(g.declareMove('p1',risky),true); assert.equal(g.counter('p2',counter),true); assert.equal(s.phase,'TRIGGER_RESPONSE');
  assert.equal(g.resolveTriggeredSpecial('p1',true),true); assert.equal(v.stun,0); assert.equal(v.adrenaline,1); assert.ok(v.hand.some(c=>c.id===drawCard.id)); assert.ok(v.outOfPlay.some(c=>c.id===special.id));
});
