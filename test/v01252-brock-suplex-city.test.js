import test from "node:test";
import assert from "node:assert/strict";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { evaluateDeckHealth } from "../js/data/deck-health.js?v=0.13.72";
import { canPlaySpecial, moveEligibility } from "../js/engine/rules.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";

const byId=id=>allGameplayCards.find(c=>c.id===id);
const byName=name=>allGameplayCards.find(c=>c.name===name);
const brock=superstars.brockLesnar;
const opponent=superstars.romanReigns;
const rng=()=>0.42;

test("v0.12.52 Brock's German is the stronger five-copy German-Suplex family chain",()=>{
  const german=byId('german-suplex'), brocks=byId('brock-lesnar-brocks-german');
  assert.ok(german&&brocks);
  assert.equal(german.cost,5); assert.equal(german.damage,7);
  assert.equal(brocks.cost,5); assert.equal(brocks.damage,8);
  assert.deepEqual(brocks.requirements,{strength:2});
  assert.equal(brocks.superstarId,'brock-lesnar');
  assert.ok(brocks.countsAs.includes('German Suplex'));
  assert.equal(german.copyFamily,'german-suplex');
  assert.equal(brocks.copyFamily,'german-suplex');
  assert.equal(brocks.searchOnConnectName,'Brock’s German');
  const list=decks['brock-lesnar'];
  assert.equal(list.length,60);
  assert.equal(list.filter(c=>c.id==='brock-lesnar-brocks-german').length,5);
  assert.equal(list.filter(c=>c.id==='german-suplex').length,0);
  const six=[german,german,german,brocks,brocks,brocks];
  assert.ok(evaluateDeckHealth(six).violations.some(v=>v.includes('German Suplex family')&&v.includes('(6/5)')));
});

test("v0.12.52 every connected Brock's German draws the next copy and Suplex City recognizes the alias",()=>{
  const g=new MatchEngine({p1:brock,p2:opponent,decks:{[brock.id]:decks[brock.id],[opponent.id]:decks[opponent.id]},rng});
  const s=g.state(), p=s.players.p1, d=s.players.p2, german=byId('brock-lesnar-brocks-german');
  p.hand=[german]; p.deck=[german,german]; d.hand=[]; p.momentum.strength=10; p.adrenaline=0; p.momentum.attitude=0;
  s.phase='ACTION'; s.playerInControl='p1';
  for(let i=0;i<3;i++){
    const card=p.hand.find(c=>c.id===german.id); assert.ok(card,`chain copy ${i+1}`);
    assert.equal(g.declareMove('p1',card),true);
    if(s.phase==='COUNTER') assert.equal(g.passCounter('p2'),true);
  }
  assert.equal(p.deck.filter(c=>c.id===german.id).length,1,'used Germans recycle once the Playbook empties');
  assert.equal(p.hand.filter(c=>c.id===german.id).length,1,'the third connect can tutor a recycled German');
  assert.ok(s.log.some(e=>e.type==='PLAYBOOK_RECYCLED'&&e.playerId==='p1'));
  assert.equal(p.abilityUses,2,'Suplex City fires on the first two alias connects');
  assert.equal(p.adrenaline,7,'three normal connect gains plus two +2 Suplex City gains');
  assert.equal(d.hp,Math.max(0,d.maxHp-24));
});

test("v0.12.52 My Name Is Paul Heyman tutors/discounts F-5 and does not consume The Beast Incarnate",()=>{
  const g=new MatchEngine({p1:brock,p2:opponent,decks:{[brock.id]:decks[brock.id],[opponent.id]:decks[opponent.id]},rng});
  const s=g.state(), p=s.players.p1, d=s.players.p2;
  const german=byId('brock-lesnar-brocks-german'), heyman=byId('special-brock-lesnar-paul-heyman'), beast=byId('special-brock-lesnar'), f5=byId('brock-lesnar-f-5');
  p.hand=[german,heyman,beast]; p.deck=[f5]; d.hand=[]; p.momentum.strength=10; p.momentum.technical=10;
  s.phase='ACTION'; s.playerInControl='p1';
  assert.equal(canPlaySpecial(s,'p1',heyman),false);
  assert.equal(g.declareMove('p1',german),true); if(s.phase==='COUNTER')assert.equal(g.passCounter('p2'),true);
  assert.equal(canPlaySpecial(s,'p1',heyman),true);
  assert.equal(g.playSpecial('p1',heyman),true);
  assert.ok(p.hand.some(c=>c.id===f5.id));
  assert.equal(p.namedDiscount['F-5'],2);
  assert.equal(moveEligibility(s,'p1',p.hand.find(c=>c.id===f5.id)).effectiveCost,8);
  assert.ok(p.usedSpecialIds.includes(heyman.id));
  assert.equal(p.specialUsed,true,'legacy coarse flag still records that a triggered Action was used');

  const hp=p.hp, incoming={...byName('Powerbomb'),damage:10};
  s.phase='RESOLVE_MOVE'; s.playerInControl='p2'; s.proposedMove={attackerId:'p2',defenderId:'p1',card:incoming};
  g._connect();
  assert.equal(p.hp,hp-5,'The Beast Incarnate still reduces a 10-damage Move by 5 after Heyman was used');
  assert.ok(p.usedSpecialIds.includes(beast.id));
  assert.equal(p.usedSpecialIds.length,2);
});
