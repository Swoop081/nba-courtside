import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { canPlaySpecial, moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.45 Spanish Fly is Agility-only and returns to Vikingo authored deck',()=>{
  const spanish=byId('spanish-fly');
  assert.ok(spanish); assert.equal(spanish.cost,6); assert.equal(spanish.damage,10); assert.equal(spanish.rarity,3);
  assert.equal(spanish.method,'agility'); assert.deepEqual(spanish.requirements,{agility:2}); assert.equal(spanish.counterState,'running-aerial'); assert.equal(spanish.groundOpponent,true);
  const vikingo=decks['hijo-del-vikingo']; const count=id=>vikingo.filter(c=>c.id===id).length;
  assert.equal(count('spanish-fly'),2); assert.equal(count('asai-moonsault'),0); assert.equal(vikingo.length,60);
});

test('v0.13.45 Mr. Iguana completes Worlds Collide at 8 Superstars / 64 cards',()=>{
  const iguana=star('mr-iguana');
  assert.ok(iguana); assert.equal(iguana.hp,58); assert.equal(iguana.setId,'worlds-collide-series-1');
  assert.deepEqual(iguana.methodLimits,{agility:null,technical:4,strike:2,strength:1});
  assert.deepEqual(iguana.starterMomentum,{agility:7,technical:3,strike:2});
  assert.deepEqual(iguana.leadOffIds,['momentum-agility','momentum-technical','hurricanrana','arm-drag','dropkick']);
  assert.equal(iguana.ability.name,'Play Dead'); assert.deepEqual(iguana.ability.trigger,{type:'iguanaPlayDead',maxUses:1,draw:1,adrenaline:1});
  assert.equal(iguana.entrance.name,'Verde Desde 1988'); assert.deepEqual(iguana.entrance.preMatchMomentum,{agility:1,technical:1}); assert.equal(iguana.entrance.preMatchAdrenaline,1);
  assert.deepEqual(iguana.special,{type:'iguanaLaYesca',discount:1,opponentAdrenaline:-1});

  const rana=byId('mr-iguana-iguanarana'); assert.ok(rana.trademark); assert.equal(rana.cost,5); assert.equal(rana.damage,8); assert.equal(rana.method,'agility'); assert.deepEqual(rana.requirements,{agility:2}); assert.deepEqual(rana.counterStates,['body-elevated']); assert.equal(rana.counterAdrenalineOnConnect,1);
  const verde=byId('mr-iguana-pongase-verde'); assert.ok(verde.trademark); assert.equal(verde.cost,6); assert.equal(verde.damage,10); assert.equal(verde.method,'technical'); assert.equal(verde.counterState,'rear-control'); assert.deepEqual(verde.effects.find(e=>e.type==='search'),{type:'search',name:'Chalino Driver',discount:1});
  const muta=byId('mr-iguana-muta-lock'); assert.ok(muta.trademark); assert.equal(muta.cost,6); assert.equal(muta.damage,0); assert.deepEqual(muta.submission,{bodyPart:'back',pressure:5}); assert.equal(muta.groundedOnly,true); assert.equal(muta.counterState,'rear-control');
  const fin=byId('mr-iguana-chalino-driver'); assert.ok(fin.finisher); assert.equal(fin.cost,10); assert.equal(fin.damage,16); assert.equal(fin.method,null); assert.deepEqual(fin.requirements,{}); assert.equal(fin.counterState,'body-elevated');
  const sp=byId('special-mr-iguana'); assert.equal(sp.name,'La Yesca'); assert.equal(sp.rarity,4);

  const expected={
    'mr-iguana-iguanarana':'WC1-058','mr-iguana-pongase-verde':'WC1-059','mr-iguana-muta-lock':'WC1-060','mr-iguana-chalino-driver':'WC1-061','entrance-mr-iguana':'WC1-062','special-mr-iguana':'WC1-063','superstar-mr-iguana':'WC1-064'
  };
  for(const [id,code] of Object.entries(expected)) assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code,id);
  assert.equal(CARD_IDS_BY_SET['worlds-collide-series-1'].length,64);
  assert.equal(collectionCards.filter(c=>c.setId==='worlds-collide-series-1'&&c.kind==='superstar').length,8);
});

test('v0.13.45 Mr. Iguana authored deck is 60/12 with approved exclusive counts',()=>{
  const deck=decks['mr-iguana']; assert.ok(deck); assert.equal(deck.length,60); assert.equal(deck.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(deck.slice(0,5).map(c=>c.id),['momentum-agility','momentum-technical','hurricanrana','arm-drag','dropkick']);
  const count=id=>deck.filter(c=>c.id===id).length;
  assert.equal(count('mr-iguana-iguanarana'),3); assert.equal(count('mr-iguana-pongase-verde'),3); assert.equal(count('mr-iguana-muta-lock'),2); assert.equal(count('mr-iguana-chalino-driver'),2); assert.equal(count('special-mr-iguana'),1); assert.equal(count('once-too-often'),1);
});

test('v0.13.45 La Yesca tutors an Iguana Trademark at -1 and drains 1 Adrenaline',()=>{
  const g=new MatchEngine({p1:star('mr-iguana'),p2:star('cm-punk'),decks,rng}),s=g.state(),ig=s.players.p1,opp=s.players.p2;
  const special=byId('special-mr-iguana'),target=byId('mr-iguana-pongase-verde');
  s.playerInControl='p1'; s.phase='ACTION'; ig.hand=[special]; ig.deck=[target]; ig.adrenaline=10; ig.momentum.technical=3; opp.adrenaline=3; opp.posture='standing';
  assert.equal(canPlaySpecial(s,'p1',special),true); assert.equal(g.playSpecial('p1',special),true);
  const found=ig.hand.find(c=>c.id===target.id); assert.ok(found); assert.equal(moveEligibility(s,'p1',found).effectiveCost,5); assert.equal(opp.adrenaline,2); assert.ok(ig.outOfPlay.some(c=>c.id===special.id));
});

test('v0.13.45 Play Dead is optional, decline preserves it, and use draws + gains Adrenaline',()=>{
  const make=()=>{const g=new MatchEngine({p1:star('cm-punk'),p2:star('mr-iguana'),decks,rng}),s=g.state(),a=s.players.p1,ig=s.players.p2; const slam=byId('body-slam'); s.playerInControl='p1'; s.phase='ACTION'; a.hand=[slam]; a.momentum.strength=5; a.adrenaline=10; ig.hand=[]; ig.deck=[byId('dropkick'),byId('arm-drag'),byId('hurricanrana')]; return {g,s,a,ig,slam};};
  {
    const {g,s,ig,slam}=make(); assert.equal(g.declareMove('p1',slam),true); assert.equal(g.passCounter('p2'),true);
    assert.equal(s.phase,'TRIGGER_RESPONSE'); assert.equal(s.pendingTriggeredSpecial?.specialType,'iguanaPlayDead'); assert.equal(s.pendingTriggeredSpecial?.abilityName,'Play Dead'); const before=ig.hand.length; assert.equal(g.resolveTriggeredSpecial('p2',false),true); assert.equal(ig.abilityUses,0); assert.equal(ig.adrenaline,0); assert.equal(ig.hand.length,before);
  }
  {
    const {g,s,ig,slam}=make(); assert.equal(g.declareMove('p1',slam),true); assert.equal(g.passCounter('p2'),true); const before=ig.hand.length; assert.equal(g.resolveTriggeredSpecial('p2',true),true); assert.equal(ig.abilityUses,1); assert.equal(ig.adrenaline,1); assert.equal(ig.hand.length,before+1); assert.ok(s.log.some(e=>e.type==='SUPERSTAR_ABILITY'&&e.abilityName==='Play Dead'));
  }
});

test('v0.13.45 Iguanarana gains an extra Adrenaline only when it Connects as a Counter',()=>{
  const g=new MatchEngine({p1:star('cm-punk'),p2:star('mr-iguana'),decks,rng}),s=g.state(),a=s.players.p1,ig=s.players.p2;
  const incoming=byId('powerbomb'),rana=byId('mr-iguana-iguanarana');
  s.playerInControl='p1'; s.phase='ACTION'; a.hand=[incoming]; a.momentum.strength=10; a.adrenaline=10; ig.hand=[rana]; ig.momentum.agility=4; ig.adrenaline=0; ig.events.entranceAdrenalineGranted=true;
  assert.equal(g.declareMove('p1',incoming),true); assert.equal(g.counter('p2',rana),true);
  assert.equal(ig.adrenaline,2,'normal +1 connect plus +1 Iguanarana counter bonus');
  assert.ok(s.log.some(e=>e.type==='CARD_EFFECT'&&e.cardId===rana.id&&e.effect==='counter-connect-adrenaline'));
});
