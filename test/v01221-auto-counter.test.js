import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { autoCounterCost, autoCounterEligibility, counterEligibility } from '../js/engine/rules.js?v=0.13.72';
import { cpuDecision } from '../js/ai/WrestlingAI.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const stars=Object.values(superstars);
const rng=()=>0.42;
const filler=(i,kind='momentum')=>kind==='momentum'?{id:`f-${i}`,name:`Filler ${i}`,kind:'momentum',method:'strength',amount:1}:{id:`f-${i}`,name:`Filler ${i}`,kind:'action',cost:0};
const incoming=(overrides={})=>({id:'incoming',name:'Incoming Move',kind:'move',cost:4,damage:6,method:'strength',moveType:'grapple',counterState:'torso-trapped',requirements:{},...overrides});

function counterWindow({hand=7,card=incoming(),defender='p1'}={}){
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=g.state(),attacker=defender==='p1'?'p2':'p1';
  s.phase='COUNTER'; s.playerInControl=attacker;
  s.proposedMove={attackerId:attacker,defenderId:defender,card};
  s.players[defender].hand=Array.from({length:hand},(_,i)=>filler(i));
  return {g,s,attacker,defender};
}

test('v0.12.21 Auto Counter starts at 5, escalates by use, requires two pages left, and never applies to Finishers',()=>{
  const {s}=counterWindow({hand:7});
  assert.equal(autoCounterCost(s,'p1'),5);
  assert.equal(autoCounterEligibility(s,'p1').legal,true);
  s.players.p1.hand=s.players.p1.hand.slice(0,6);
  assert.equal(autoCounterEligibility(s,'p1').legal,false,'5-card Auto Counter requires at least 7 cards in hand');
  s.players.p1.hand=Array.from({length:8},(_,i)=>filler(i));
  s.players.p1.autoCounterUses=1;
  assert.equal(autoCounterCost(s,'p1'),6);
  assert.equal(autoCounterEligibility(s,'p1').legal,true,'second use costs 6 and requires 8 cards');
  s.proposedMove.card=incoming({finisher:true,cost:10,damage:16});
  assert.equal(autoCounterEligibility(s,'p1').legal,false);
  assert.match(autoCounterEligibility(s,'p1').reason,/Finishers cannot be Auto Countered/);
});

test('v0.12.21 player-chosen Auto Counter ditches exactly the selected pages, logs the dynamic cost, leaves two before draw, and transfers Control',()=>{
  const {g,s}=counterWindow({hand:7});
  const original=s.players.p1.hand.map(c=>c.id);
  assert.equal(g.autoCounter('p1',[0,1,2,3]),false,'must choose exactly the current cost');
  assert.equal(g.autoCounter('p1',[0,1,2,3,4]),true);
  const event=[...s.log].reverse().find(e=>e.type==='AUTO_COUNTER');
  assert.ok(event);
  assert.equal(event.cost,5);
  assert.equal(event.useNumber,1);
  assert.equal(event.remaining,2,'two cards remain immediately after payment');
  assert.deepEqual(new Set(event.discardedCardIds),new Set(original.slice(0,5)));
  assert.equal(s.players.p1.autoCounterUses,1);
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.phase,'ACTION');
  assert.equal(s.players.p1.hand.length,3,'normal global turn draw occurs after the two-card remainder is established');
});

test('v0.12.41 CPU spends Auto Counter on mid/high/Trademark, lethal, or critically threatening Submissions, while Finishers require a matching Move counter',()=>{
  const low=counterWindow({hand:9,card:incoming({cost:3,damage:3}),defender:'p2'});
  assert.equal(cpuDecision(low.g,'p2').type,'passCounter','nonlethal low-level Move is not worth CPU Auto Counter');

  const mid=counterWindow({hand:9,card:incoming({cost:4,damage:5}),defender:'p2'});
  assert.equal(cpuDecision(mid.g,'p2').type,'autoCounter');

  const tm=counterWindow({hand:9,card:incoming({cost:3,damage:3,trademark:true}),defender:'p2'});
  assert.equal(cpuDecision(tm.g,'p2').type,'autoCounter');

  const lethal=counterWindow({hand:9,card:incoming({cost:2,damage:6}),defender:'p2'});
  lethal.s.players.p2.hp=5;
  assert.equal(cpuDecision(lethal.g,'p2').type,'autoCounter');

  const subCard=incoming({cost:2,damage:0,moveType:'submission',submissionTarget:'neck-head',submission:{bodyPart:'head',pressure:5}});
  const sub=counterWindow({hand:9,card:subCard,defender:'p2'});
  sub.s.players.p2.hp=25;
  sub.s.players.p2.submissionHistory.head=1;
  sub.s.players.p2.submissionDamage.head=20;
  assert.equal(cpuDecision(sub.g,'p2').type,'autoCounter');

  const fin=counterWindow({hand:9,card:incoming({finisher:true,cost:10,damage:16}),defender:'p2'});
  assert.equal(cpuDecision(fin.g,'p2').type,'passCounter','Finisher cannot use Auto Counter without a matching Move');
  const matching={id:'matching',name:'Matching Counter',kind:'move',cost:0,damage:0,method:'strength',requirements:{},defensiveOnly:true,counterStates:['torso-trapped']};
  fin.s.players.p2.hand[0]=matching;
  assert.equal(counterEligibility(fin.s,'p2',fin.s.proposedMove.card,matching).legal,true);
  assert.equal(cpuDecision(fin.g,'p2').type,'counter','matching Move reversal remains legal against a Finisher');
});

test('v0.12.21 match UI lets the player enter Auto Counter mode, tap exact cards to ditch, cancel, and confirm',()=>{
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  assert.match(app,/AUTO COUNTER · DITCH \$\{autoEligibility\.cost\}/);
  assert.match(app,/data-auto-ditch-index/);
  assert.match(app,/toggleAutoCounterCard/);
  assert.match(app,/confirmAutoCounter/);
  assert.match(app,/Select exactly \$\{eligibility\.cost\} pages to ditch/);
});
