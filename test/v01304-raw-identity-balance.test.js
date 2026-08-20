import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const byName=name=>allGameplayCards.find(c=>c.name===name);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.4 RAW identity cards and balance values are locked',()=>{
  const logan=star('logan-paul'), sol=star('sol-ruca'), gable=star('chad-gable'), raquel=star('raquel-rodriguez');
  assert.deepEqual(logan.entrance.preMatchMomentum,{agility:1,strength:1});
  const punch=byId('logan-paul-knockout-punch');
  assert.equal(punch.name,'One Lucky Punch'); assert.equal(punch.cost,6); assert.equal(punch.damage,9); assert.deepEqual(punch.requirements,{strike:2});
  assert.deepEqual(punch.effects.find(e=>e.type==='search'),{type:'search',name:'Paulverizer',discount:2});

  const solSplash=byId('sol-ruca-springboard-splash');
  assert.ok(solSplash.trademark); assert.equal(solSplash.rarity,3); assert.equal(solSplash.cost,5); assert.equal(solSplash.damage,8); assert.deepEqual(solSplash.requirements,{agility:2});
  assert.equal(decks['sol-ruca'].filter(c=>c.id===solSplash.id).length,2); assert.equal(decks['sol-ruca'].filter(c=>c.id==='spear').length,0);
  assert.deepEqual(sol.entrance.preMatchMomentum,{agility:1,technical:1});

  const moonsault=byId('chad-gable-moonsault');
  assert.ok(moonsault.trademark); assert.equal(moonsault.cost,6); assert.equal(moonsault.damage,10); assert.deepEqual(moonsault.requirements,{agility:2});
  assert.equal(moonsault.effects[0].name,'Chaos Theory'); assert.equal(moonsault.effects[0].discount,1);
  assert.equal(decks['chad-gable'].filter(c=>c.id===moonsault.id).length,2); assert.equal(decks['chad-gable'].filter(c=>c.id==='moonsault').length,0);
  assert.equal(gable.special.draw,2); assert.equal(gable.special.opponentAdrenaline,-1);
  const shoosh=byId('special-chad-gable'); assert.equal(shoosh.special.draw,2); assert.equal(shoosh.special.opponentAdrenaline,-1);

  assert.equal(raquel.hp,65);
  const boot=byId('raquel-rodriguez-big-boot'); assert.ok(boot.trademark); assert.equal(boot.cost,5); assert.equal(boot.damage,7); assert.deepEqual(boot.requirements,{strike:2});
  assert.equal(decks['raquel-rodriguez'].filter(c=>c.id===boot.id).length,2); assert.equal(decks['raquel-rodriguez'].filter(c=>c.id==='big-boot').length,1);
  const cork=byId('raquel-rodriguez-corkscrew-splash'); assert.equal(cork.effects[0].discount,1);
  assert.equal(raquel.entrance.preMatchAdrenaline,0); assert.equal(byId('entrance-raquel-rodriguez').preMatchAdrenaline,0);

  assert.equal(CARD_NUMBER_BY_ID['sol-ruca-springboard-splash'].cardCode,'RAW1-036');
  assert.equal(CARD_NUMBER_BY_ID['chad-gable-moonsault'].cardCode,'RAW1-037');
  assert.equal(CARD_NUMBER_BY_ID['raquel-rodriguez-big-boot'].cardCode,'RAW1-038');
  for(const sid of ['logan-paul','sol-ruca','chad-gable','raquel-rodriguez']) assert.equal(decks[sid].length,60,sid);
});

test('v0.13.4 new RAW signature chains execute their printed effects',()=>{
  const opp=star('cm-punk');
  // One Lucky Punch searches Paulverizer with -2 Cost.
  let g=new MatchEngine({p1:star('logan-paul'),p2:opp,decks,rng}), s=g.state();
  const lucky=byId('logan-paul-knockout-punch'), paul=byId('logan-paul-paulverizer');
  s.playerInControl='p1'; s.phase='ACTION'; s.players.p1.hand=[lucky]; s.players.p1.deck=[paul]; s.players.p2.hand=[]; s.players.p1.momentum.strike=5; s.players.p1.adrenaline=5;
  assert.equal(g.declareMove('p1',lucky),true); assert.equal(g.passCounter('p2'),true);
  assert.ok(s.players.p1.hand.some(c=>c.id===paul.id)); assert.equal(s.players.p1.namedDiscount['Paulverizer'],2);

  // Sol's Splash only draws after Sol has successfully Countered in this Control sequence.
  g=new MatchEngine({p1:star('sol-ruca'),p2:opp,decks,rng}); s=g.state();
  const splash=byId('sol-ruca-springboard-splash'), filler=byName('Dropkick');
  s.playerInControl='p1'; s.phase='ACTION'; s.players.p1.hand=[splash]; s.players.p1.deck=[filler]; s.players.p2.hand=[]; s.players.p1.momentum.agility=5; s.players.p1.adrenaline=5; s.players.p1.events.counteredThisControl=true;
  assert.equal(g.declareMove('p1',splash),true); assert.equal(g.passCounter('p2'),true);
  assert.ok(s.players.p1.hand.some(c=>c.id===filler.id),'counter-qualified Springboard Splash draws 1');

  // Gable's Moonsault searches Chaos Theory and grants -1.
  g=new MatchEngine({p1:star('chad-gable'),p2:opp,decks,rng}); s=g.state();
  const gm=byId('chad-gable-moonsault'), chaos=byId('chad-gable-chaos-theory');
  s.playerInControl='p1'; s.phase='ACTION'; s.players.p1.hand=[gm]; s.players.p1.deck=[chaos]; s.players.p2.hand=[]; s.players.p1.momentum.agility=5; s.players.p1.adrenaline=5; s.players.p2.posture='on-mat';
  assert.equal(g.declareMove('p1',gm),true); assert.equal(g.passCounter('p2'),true);
  assert.ok(s.players.p1.hand.some(c=>c.id===chaos.id)); assert.equal(s.players.p1.namedDiscount['Chaos Theory'],1);

  // Raquel's Big Boot drains one extra Adrenaline in addition to normal receive -1.
  g=new MatchEngine({p1:star('raquel-rodriguez'),p2:opp,decks,rng}); s=g.state();
  const rb=byId('raquel-rodriguez-big-boot');
  s.playerInControl='p1'; s.phase='ACTION'; s.players.p1.hand=[rb]; s.players.p2.hand=[]; s.players.p1.momentum.strike=5; s.players.p1.adrenaline=5; s.players.p2.adrenaline=5;
  assert.equal(g.declareMove('p1',rb),true); assert.equal(g.passCounter('p2'),true);
  assert.equal(s.players.p2.adrenaline,3,'normal receive -1 plus Raquel Big Boot -1');
});
