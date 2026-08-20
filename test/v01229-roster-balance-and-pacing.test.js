import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { healthOnlyPinChance } from '../js/engine/health.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const player=(hp,maxHp=100)=>({hp,maxHp});

test('v0.12.36 health-only pin curve is keyed to actual HP left',()=>{
  assert.equal(healthOnlyPinChance(player(65)),5);
  assert.equal(healthOnlyPinChance(player(25)),5);
  assert.equal(healthOnlyPinChance(player(16)),5);
  assert.equal(healthOnlyPinChance(player(15)),20);
  assert.equal(healthOnlyPinChance(player(8)),50);
  assert.equal(healthOnlyPinChance(player(4)),75);
  assert.equal(healthOnlyPinChance(player(0)),75);
});

test('v0.12.29 elite and submission finishers retain their balance locks',()=>{
  const gojira=byId('gunther-gojira-clutch');
  assert.equal(gojira.finisher,true); assert.equal(gojira.cost,9); assert.equal(gojira.damage,0);
  assert.deepEqual(gojira.requirements,{}); assert.equal(gojira.submission.pressure,6);
  for(const [id,pressure] of [['mankind-mandible-claw',5],['chad-gable-ankle-lock',6],['jacob-fatu-tongan-death-grip',5]]){
    const card=byId(id); assert.equal(card.finisher,true,id); assert.equal(card.submission.pressure,pressure,id);
  }
  assert.equal(byId('andre-the-giant-sitdown-splash').cost,11);
  assert.equal(byId('andre-the-giant-sitdown-splash').damage,18);
  assert.equal(byId('the-rock-people-s-elbow').cost,11);
  assert.equal(byId('the-rock-people-s-elbow').damage,18);
  assert.equal(byId('goldberg-jackhammer').cost,12);
  assert.equal(byId('goldberg-jackhammer').damage,19);
});

test('v0.12.29 signature setup chains search and discount their intended payoff',()=>{
  const checks=[
    ['liv-morgan-jersey-codebreaker','Oblivion',3],
    ['rhea-ripley-prism-trap','Riptide',2],
    ['stephanie-vaquer-devils-kiss','Vaquer Inferno',3],
    ['cody-rhodes-cody-cutter','Cross Rhodes',3],
    ['pop-up-powerbomb','Stunner',4],
    ['randy-savage-machos-double-axe-handle','Flying Elbow Drop',3],
    ['shotgun-dropkick','Coup de Grâce',3],
    ['sami-zayn-exploder-turnbuckle','Helluva Kick',4],
    ['seth-rollins-buckle-bomb','Curb Stomp',4],
  ];
  for(const [id,name,discount] of checks){
    const card=byId(id); assert.ok(card,id);
    const effect=(card.effects??[]).find(e=>e.type==='search'&&e.name===name);
    assert.ok(effect,`${id} searches ${name}`); assert.equal(effect.discount,discount,id);
  }
  assert.equal(byId('stephanie-vaquer-devils-kiss').groundOpponent,true);
});

test('v0.12.29 Logan pace correction reduces his burst package without removing identity',()=>{
  const logan=superstars.loganPaul;
  assert.equal(logan.hp,62);
  assert.equal(logan.ability.trigger.drawUses,1);
  assert.equal(logan.ability.maxUses,2);
  assert.equal(byId('logan-paul-knockout-punch').cost,6);
  assert.equal(byId('logan-paul-knockout-punch').damage,9);
  assert.equal(byId('logan-paul-paulverizer').cost,11);
  assert.equal(byId('logan-paul-paulverizer').damage,13);
});

test('v0.12.29 exhaustion decision is superseded by the Playbook recycle rule',()=>{
  const g=new MatchEngine({p1:superstars.cmPunk,p2:superstars.codyRhodes,decks,rng:()=>0.75});
  const s=g.state();
  s.players.p1.deck=[]; s.players.p2.deck=[]; s.players.p1.hand=[]; s.players.p2.hand=[];
  s.players.p1.discard=[]; s.players.p2.discard=[];
  s.phase='ACTION'; s.playerInControl='p1'; s.consecutivePasses=0;
  for(let i=0;i<8;i++) assert.equal(g.passTurn(s.playerInControl),true);
  assert.notEqual(s.phase,'MATCH_OVER');
  assert.equal(s.winner,null);
  assert.ok(!s.log.some(e=>e.type==='EXHAUSTION_DECISION'));
});

test('v0.12.29 Bayley remembers her previous connected Method across Control sequences',()=>{
  const bayley=superstars.bayley, opp=superstars.beckyLynch;
  const g=new MatchEngine({p1:bayley,p2:opp,decks,rng:()=>0.42});
  const s=g.state(),p=s.players.p1;
  p.events.differentMethodPrevious='strike';
  g._resetControlSequenceState('p1');
  assert.equal(p.events.differentMethodPrevious,'strike','Control reset must not erase Bayley previous-Method memory');
  const beforeUses=p.abilityUses,beforeAd=p.adrenaline;
  g._ability('p1','connect',{card:byId('belly-to-belly-suplex'),damage:6});
  assert.equal(p.abilityUses,beforeUses+1);
  assert.equal(p.adrenaline,beforeAd+2);
});
