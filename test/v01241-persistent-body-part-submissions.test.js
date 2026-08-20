import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { submissionThreshold } from '../js/engine/rules.js?v=0.13.72';
import { cpuDecision } from '../js/ai/WrestlingAI.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const rng=()=>0.42;
const stars=Object.values(superstars);
const filler=i=>({id:`fill-${i}`,name:`Filler ${i}`,kind:'momentum',method:'strength',amount:1});
const hold=(over={})=>({id:'test-head-hold',name:'Test Head Hold',kind:'move',cost:0,damage:0,method:'technical',requirements:{},moveType:'submission',counterState:'front-control',submissionTarget:'neck-head',submission:{bodyPart:'head',pressure:5},...over});

test('v0.12.41 submission threshold is exactly current HP, including 0 HP',()=>{
  const game=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const d=game.state().players.p2;
  d.maxHp=69; d.hp=50; assert.equal(submissionThreshold(d),50);
  d.hp=20; assert.equal(submissionThreshold(d),20);
  d.hp=5; assert.equal(submissionThreshold(d),5);
  d.hp=0; assert.equal(submissionThreshold(d),0);
});

test('v0.12.41 body-part damage persists after release and a later hold taps when accumulated damage meets current HP',()=>{
  const game=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=game.state(),a=s.players.p1,d=s.players.p2,sub=hold({trademark:true});
  d.hp=50; a.hand=[filler(1),filler(2),filler(3),filler(4)];
  s.playerInControl='p1';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:sub};game._connect();
  assert.equal(d.submissionDamage.head,5);assert.equal(s.phase,'SUBMISSION_RESPONSE');
  assert.equal(game.passSubmissionResponse('p2'),true);game.maintainSubmission('p1',0);
  assert.equal(s.phase,'SUBMISSION_RESPONSE');assert.equal(game.passSubmissionResponse('p2'),true);game.maintainSubmission('p1',0);
  assert.equal(d.submissionDamage.head,15);
  assert.equal(s.phase,'SUBMISSION_RESPONSE');assert.equal(game.passSubmissionResponse('p2'),true);
  game.releaseSubmission('p1');assert.equal(d.submissionDamage.head,15,'release never heals worked body-part damage');
  d.hp=20;a.hand=[filler(5)];s.playerInControl='p1';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:sub};game._connect();
  assert.equal(d.submissionDamage.head,20);assert.equal(s.phase,'MATCH_OVER');assert.equal(s.finish.type,'submission');
});

test('v0.12.41 a fresh hold can tap immediately at very low HP when its first pressure application reaches current HP',()=>{
  const game=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=game.state(),d=s.players.p2;d.hp=5;
  s.playerInControl='p1';s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:hold()};game._connect();
  assert.equal(d.submissionDamage.head,5);assert.equal(s.phase,'MATCH_OVER');assert.equal(s.finish.type,'submission');
});

test('v0.12.41 CPU treats a submission within two successful applications of a tap as an emergency Auto Counter threat',()=>{
  const game=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=game.state(),d=s.players.p2;
  s.phase='COUNTER';s.playerInControl='p1';s.proposedMove={attackerId:'p1',defenderId:'p2',card:hold({cost:2})};
  d.hp=20;d.submissionDamage.head=10;d.hand=Array.from({length:9},(_,i)=>filler(i));
  assert.equal(cpuDecision(game,'p2')?.type,'autoCounter');
  d.submissionDamage.head=0;
  assert.equal(cpuDecision(game,'p2')?.type,'passCounter','CPU need not burn five pages when the body part is not yet close to tapping');
});

test('v0.12.41 CPU can maintain a trademark hold for setup pressure even when it cannot finish this application',()=>{
  const game=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=game.state(),a=s.players.p2,d=s.players.p1;
  d.hp=50;d.submissionDamage.head=5;a.hand=[filler(1),filler(2),filler(3),filler(4),filler(5)];
  s.phase='SUBMISSION_MAINTAIN';s.submission={attackerId:'p2',defenderId:'p1',cardId:'test-head-hold',bodyPart:'head',damage:5,holdTurn:1,trademark:true};
  assert.equal(cpuDecision(game,'p2')?.type,'maintain','CPU banks persistent body damage instead of instantly releasing an unfinishable signature hold');
  s.submission.holdTurn=3;a.hand=[filler(1),filler(2),filler(3)];
  assert.equal(cpuDecision(game,'p2')?.type,'release','CPU stops setup squeezing before needlessly emptying its hand');
});


test('v0.12.41 CPU prefers an immediately tapping submission over a low-probability pin',()=>{
  const game=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=game.state(),a=s.players.p2,d=s.players.p1,sub=hold({trademark:true});
  s.playerInControl='p2';s.phase='ACTION';s.postMove={attackerId:'p2',defenderId:'p1',cardId:'setup'};
  d.hp=15;d.submissionDamage.head=10;a.hand=[sub,{id:'def-1',name:'Defensive 1',kind:'move',cost:1,damage:0,method:'technical',requirements:{},defensiveOnly:true},{id:'def-2',name:'Defensive 2',kind:'move',cost:1,damage:0,method:'technical',requirements:{},defensiveOnly:true}];for(const m of ['technical','strength','strike','agility'])a.momentum[m]=99;a.adrenaline=99;
  const decision=cpuDecision(game,'p2');
  assert.equal(decision?.type,'move');assert.equal(decision?.card?.id,sub.id);
});

test('v0.12.41 submission UI explains persistent damage and current-HP tap target',()=>{
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  assert.match(ui,/DAMAGE · PERSISTS/);
  assert.match(ui,/HP TO TAP/);
  assert.match(ui,/Body-part damage stays after release/);
  assert.match(ui,/meets or exceeds their <b>current HP<\/b>/);
});
