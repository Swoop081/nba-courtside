import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';

const stars=Object.values(superstars);
const star=id=>stars.find(s=>s.id===id);
const card=id=>allGameplayCards.find(c=>c.id===id);

test('v0.12.43 roster durability locks preserve prestige hierarchy and balanced normal range tuning',()=>{
  const hp={
    'andre-the-giant':72,'brock-lesnar':70,'oba-femi':68,'hulk-hogan':69,'goldberg':69,'kane':69,'nia-jax':69,
    'gunther':68,'bron-breakker':68,'drew-mcintyre':68,'jacob-fatu':68,'the-undertaker':68,'ultimate-warrior':68,
    'roman-reigns':67,'the-rock':67,'raquel-rodriguez':65,'jade-cargill':67,'mankind':67,
    'stone-cold-steve-austin':66,'kevin-owens':66,'rhea-ripley':66,'damian-priest':66,'solo-sikoa':66,
    'randy-orton':65,'charlotte-flair':65,'penta':65,'cody-rhodes':64,'seth-rollins':64,'cm-punk':64,
    'sami-zayn':64,'finn-balor':64,'la-knight':64,'jey-uso':64,'becky-lynch':64,'chad-gable':64,
    'el-grande-americano':64,'randy-savage':64,'bayley':63,'paige':64,'stephanie-vaquer':63,
    'tiffany-stratton':62,'liv-morgan':64,'alexa-bliss':62,'logan-paul':62,'dominik-mysterio':61,
    'chelsea-green':61,'danhausen':61,'sol-ruca':58,'iyo-sky':57,'rey-mysterio':57
  };
  for(const [id,value] of Object.entries(hp))assert.equal(star(id)?.hp,value,id);
  assert.ok(star('andre-the-giant').hp>star('brock-lesnar').hp);
  assert.ok(star('brock-lesnar').hp>star('cm-punk').hp);
  assert.ok(star('cm-punk').hp>star('iyo-sky').hp);
});

test('v0.12.43 submission-specialist identity tuning matches persistent-body-part system',()=>{
  const pressure={
    'paige-pto':5,'charlotte-flair-figure-eight-leglock':6,'chad-gable-ankle-lock':6,
    'gunther-gojira-clutch':6,'brock-lesnar-kimura-lock':6,'bron-breakker-steiner-recliner':6,
    'rhea-ripley-prism-trap':5
  };
  for(const [id,value] of Object.entries(pressure)){
    const c=card(id); assert.equal(c.damage,0,id); assert.equal(c.submission.pressure,value,id);
    assert.ok(c.rulesText.includes(`+${value} persistent`),`${id} rules text must match pressure`);
  }
  const punk=star('cm-punk');
  assert.equal(punk.ability.trigger.maxUses,3);
  assert.equal(punk.ability.trigger.draw,1);
  assert.equal(punk.ability.trigger.adrenaline,1);
  assert.deepEqual(card('cm-punk-anaconda-vise').effects,[{type:'drawSelf',amount:1}]);
});

test('v0.12.43 identity engines keep refined card-flow and signature setup tuning',()=>{
  const mankind=star('mankind');
  assert.deepEqual(mankind.ability.trigger,{type:'reduceIncoming',minDamage:7,maxUses:3,reduce:3});
  const warrior=star('ultimate-warrior');
  assert.equal(warrior.ability.trigger.maxUses,2); assert.equal(warrior.ability.trigger.draw,1); assert.equal(warrior.ability.trigger.adrenaline,1);
  const logan=star('logan-paul');
  assert.equal(logan.ability.trigger.drawAfterStrikeAgility,1); assert.equal(logan.ability.trigger.drawUses,1); assert.equal(logan.ability.maxUses,2);
  assert.deepEqual([card('logan-paul-knockout-punch').cost,card('logan-paul-knockout-punch').damage],[6,9]);
  assert.deepEqual([card('logan-paul-paulverizer').cost,card('logan-paul-paulverizer').damage],[11,13]);
  assert.equal(star('danhausen').ability.trigger.maxUses,3);
  const knee=card('danhausen-very-nice-knee-vil');
  const search=knee.effects.find(e=>e.type==='search'); assert.deepEqual(search,{type:'search',name:'Triple D',discount:3});
  assert.equal(star('chad-gable').ability.trigger.drawUses,2);
});

test('v0.12.43 Mr. Socko applies +2 real Mandible Claw submission damage, not a cost discount',()=>{
  const m=star('mankind'),opp=star('cm-punk');
  const g=new MatchEngine({p1:m,p2:opp,decks,rng:()=>0.42});
  const s=g.state(),a=s.players.p1,d=s.players.p2,c=card('mankind-mandible-claw');
  a.events.sockoMandiblePressure=2;
  s.phase='COUNTER'; s.playerInControl='p1';
  s.proposedMove={attackerId:'p1',defenderId:'p2',card:c};
  const before=d.submissionDamage.head;
  g._connect();
  assert.equal(d.submissionDamage.head,before+7);
  assert.equal(s.submission.damage,7);
  assert.equal(a.namedDiscount?.['Mandible Claw'],undefined);
});
