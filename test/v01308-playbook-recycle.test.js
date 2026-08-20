import test from 'node:test';
import assert from 'node:assert/strict';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const card=id=>allGameplayCards.find(c=>c.id===id);

test('v0.13.8 empty Playbook recycles reusable played pages before a draw',()=>{
  const g=new MatchEngine({p1:superstars.cmPunk,p2:superstars.codyRhodes,decks,rng:()=>0});
  const s=g.state(), p=s.players.p1;
  const reusable={...card('punch')};
  p.deck=[]; p.hand=[]; p.discard=[reusable]; p.outOfPlay=[];
  const ids=g._draw('p1',1);
  assert.deepEqual(ids,[reusable.id]);
  assert.equal(p.hand[0].id,reusable.id);
  assert.equal(p.discard.length,0);
  assert.ok(s.log.some(e=>e.type==='PLAYBOOK_RECYCLED'&&e.playerId==='p1'&&e.count===1));
});

test('v0.13.8 explicitly ditched pages stay out of the recycle pile',()=>{
  const g=new MatchEngine({p1:superstars.cmPunk,p2:superstars.codyRhodes,decks,rng:()=>0});
  const s=g.state(), p=s.players.p1;
  const ditched={...card('punch')};
  p.deck=[]; p.hand=[ditched]; p.discard=[]; p.outOfPlay=[];
  g._ditch('p1',p.hand.pop(),'test-ditch');
  assert.equal(p.discard.length,0);
  assert.equal(p.outOfPlay.length,1);
  assert.deepEqual(g._draw('p1',1),[]);
  assert.equal(p.hand.length,0);
});

test('v0.13.8 committed Momentum and one-use Actions do not recycle',()=>{
  const g=new MatchEngine({p1:superstars.cmPunk,p2:superstars.codyRhodes,decks,rng:()=>0});
  const s=g.state(), p=s.players.p1;
  const momentum={id:'test-momentum',name:'Strength Momentum',kind:'momentum',method:'strength',amount:1};
  p.hand=[momentum]; p.deck=[]; p.discard=[]; p.outOfPlay=[]; s.phase='ACTION'; s.playerInControl='p1';
  assert.equal(g.playMomentum('p1',momentum),true);
  assert.equal(p.outOfPlay.some(c=>c.id==='test-momentum'),true);
  assert.equal(p.discard.length,0);
  const oto={...card('once-too-often')};
  assert.equal(oto.oneUse,true);
  g._discard('p1',oto);
  assert.equal(p.outOfPlay.some(c=>c.id==='once-too-often'),true);
  assert.equal(p.discard.some(c=>c.id==='once-too-often'),false);
});

test('v0.13.8 eight empty passes never create a referee-decision finish',()=>{
  const g=new MatchEngine({p1:superstars.cmPunk,p2:superstars.codyRhodes,decks,rng:()=>0});
  const s=g.state();
  for(const pid of ['p1','p2']){s.players[pid].deck=[];s.players[pid].discard=[];s.players[pid].hand=[];s.players[pid].outOfPlay=[];}
  s.phase='ACTION';s.playerInControl='p1';s.consecutivePasses=0;
  for(let i=0;i<8;i++)assert.equal(g.passTurn(s.playerInControl),true);
  assert.equal(s.phase,'ACTION');
  assert.equal(s.winner,null);
  assert.ok(!s.log.some(e=>e.type==='EXHAUSTION_DECISION'));
});
