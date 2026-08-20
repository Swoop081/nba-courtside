import test from 'node:test';
import assert from 'node:assert/strict';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const rng=()=>0.42;
const stars=Object.values(superstars);
const genuineIds=[
  'figure-four-leglock','koji-clutch','cm-punk-anaconda-vise','boston-crab','gunther-gojira-clutch','brock-lesnar-kimura-lock','mankind-mandible-claw','bearhug','rhea-ripley-prism-trap','becky-lynch-dis-arm-her','crossface','charlotte-flair-figure-eight-leglock','paige-pto','stf','chad-gable-ankle-lock','octopus-hold','mexican-surfboard','abdominal-stretch','bron-breakker-steiner-recliner','side-headlock','wristlock','sleeper-hold','jacob-fatu-tongan-death-grip','choke-on-the-ropes','reverse-chin-lock','andre-the-giant-bear-hug','hangman-armbar','joe-hendry-hendry-lock','roxanne-perez-rok-lock','triangle-choke','lola-vice-triangle-choke','mr-iguana-muta-lock','bret-hart-sharpshooter','vertical-boston-crab'
];

test('v0.12.42 genuine submission holds deal zero printed HP damage and only persistent body-part damage',()=>{
  const subs=allGameplayCards.filter(c=>c.moveType==='submission');
  assert.equal(subs.length,34);
  assert.deepEqual(new Set(subs.map(c=>c.id)),new Set(genuineIds));
  for(const c of subs){
    assert.equal(c.damage,0,c.id);
    assert.ok(['head','arms','legs','back','chest'].includes(c.submission?.bodyPart),c.id);
    assert.ok((c.submission?.pressure??0)>=2,c.id);
  }
  assert.equal(byId('bearhug').submission.bodyPart,'chest');
  assert.equal(byId('abdominal-stretch').submission.bodyPart,'chest');
  assert.equal(byId('octopus-hold').submission.pressure,4);
});

test("v0.12.42 Blockbuster and Warrior's Shoulder Block are impact aerial Moves, not submissions",()=>{
  for(const id of ['blockbuster','ultimate-warrior-diving-shoulder-block']){
    const c=byId(id);assert.equal(c.moveType,'aerial',id);assert.equal(c.submission,undefined,id);assert.equal(c.submissionTarget,undefined,id);
  }
});

test('v0.12.42 submission position legality distinguishes grounded and standing holds',()=>{
  const punk=superstars['cm-punk']??stars.find(x=>x.id==='cm-punk');
  const opp=stars.find(x=>x.id!==punk.id);
  const game=new MatchEngine({p1:punk,p2:opp,decks,rng});
  const s=game.state(),a=s.players.p1,d=s.players.p2;
  s.phase='ACTION';s.playerInControl='p1';a.momentum.technical=99;a.momentum.strength=99;a.adrenaline=99;
  d.posture='standing';
  assert.equal(moveEligibility(s,'p1',byId('cm-punk-anaconda-vise')).legal,false,'Anaconda Vise needs grounded opponent');
  assert.equal(moveEligibility(s,'p1',byId('bearhug')).legal,true,'Bearhug is standing');
  d.posture='on-mat';
  assert.equal(moveEligibility(s,'p1',byId('cm-punk-anaconda-vise')).legal,true);
  assert.equal(moveEligibility(s,'p1',byId('bearhug')).legal,false,'standing submission cannot be applied to grounded opponent');
});

test('v0.12.42 current weapon and environment attacks carry persistent body-part injury',()=>{
  const expected={
    'throw-into-ringpost':['head',1],
    'throw-into-steel-steps':['back',1],
    'steel-chair-to-the-back':['back',1],
    'the-rock-belt-whip':['back',1],
    'el-grande-americano-loaded-mask-headbutt':['head',1],
  };
  for(const [id,[part,amount]] of Object.entries(expected)){
    const c=byId(id);assert.equal(c.weapon,true,id);assert.deepEqual(c.bodyDamage,{bodyPart:part,pressure:amount},id);
  }
  for(const [id,part] of [['special-logan-paul','head'],['special-dominik-mysterio','head'],['special-danhausen','head']]){
    const c=byId(id);assert.equal(c.weapon,true,id);assert.deepEqual(c.special.bodyDamage,{bodyPart:part,pressure:1},id);
  }
});

test('v0.12.42 weapon Action body damage is applied persistently at runtime',()=>{
  const logan=superstars['logan-paul']??stars.find(x=>x.id==='logan-paul');
  const opp=stars.find(x=>x.id!==logan.id);
  const game=new MatchEngine({p1:logan,p2:opp,decks,rng});const s=game.state(),p=s.players.p1,d=s.players.p2;
  const brass={...byId('special-logan-paul'),special:{...byId('special-logan-paul').special}};
  p.hand=[brass];p.specialUsed=false;p.events.brassKnucklesWindow=true;s.phase='ACTION';s.playerInControl='p1';s.postMove={attackerId:'p1',defenderId:'p2',cardId:'punch'};
  const before=d.submissionDamage.head;assert.equal(game.playSpecial('p1',brass),true);assert.equal(d.submissionDamage.head,before+1);
});

test('v0.12.42 Hammer in the Boot and Jar of Teeth also apply persistent weapon injury',()=>{
  const dom=superstars['dominik-mysterio']??stars.find(x=>x.id==='dominik-mysterio');
  const opp=stars.find(x=>x.id!==dom.id);
  const g1=new MatchEngine({p1:dom,p2:opp,decks,rng});const s1=g1.state(),a1=s1.players.p1,d1=s1.players.p2;
  const hammer={...byId('special-dominik-mysterio'),special:{...byId('special-dominik-mysterio').special}};
  const punch={...byId('punch')},dodge={...byId('dodge')};
  a1.hand=[hammer];a1.specialUsed=false;d1.hand=[dodge];d1.adrenaline=99;d1.momentum.attitude=99;
  s1.playerInControl='p1';s1.phase='COUNTER';s1.proposedMove={attackerId:'p1',defenderId:'p2',card:punch};
  assert.equal(g1.counter('p2',dodge),true);assert.equal(d1.submissionDamage.head,1);

  const dan=superstars['danhausen']??stars.find(x=>x.id==='danhausen');
  const opp2=stars.find(x=>x.id!==dan.id);
  const g2=new MatchEngine({p1:dan,p2:opp2,decks,rng});const s2=g2.state(),a2=s2.players.p1,d2=s2.players.p2;
  const jar={...byId('special-danhausen'),special:{...byId('special-danhausen').special}};
  a2.hand=[jar];a2.specialUsed=false;a2.events.jarOfTeethWindow=true;s2.phase='ACTION';s2.playerInControl='p1';s2.postMove={attackerId:'p1',defenderId:'p2',cardId:'setup'};
  assert.equal(g2.playSpecial('p1',jar),true);assert.equal(d2.submissionDamage.head,1);
});
