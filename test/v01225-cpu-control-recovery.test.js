import test from 'node:test';
import assert from 'node:assert/strict';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { cpuDecision } from '../js/ai/WrestlingAI.js?v=0.13.72';
import { PROFILE_VERSION } from '../js/data/profile.js?v=0.13.72';

const byId=new Map(allGameplayCards.map(c=>[c.id,c]));
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.999;

function freshActionState(cpuId='roman-reigns'){
  const opponent=star('cm-punk'),cpu=star(cpuId);
  const game=new MatchEngine({p1:opponent,p2:cpu,decks,rng});
  const s=game.state();
  s.phase='ACTION'; s.playerInControl='p2'; s.proposedMove=null; s.postMove=null;
  const p=s.players.p2;
  p.turn={momentumPlayed:0,momentumPlayLimit:1,actionPlayed:0,supportPlayed:0,specialPlayed:0};
  p.momentum={strength:0,strike:0,technical:0,agility:0,attitude:2};
  p.adrenaline=2; p.momentumPlayedThisTurn=false;
  return {game,s,p};
}

test('v0.12.25 CPU chooses the Momentum that opens offense rather than the first Momentum in hand',()=>{
  const {game,p}=freshActionState();
  p.hand=[byId.get('momentum-strike'),byId.get('momentum-strength'),byId.get('body-slam')];
  const d=cpuDecision(game,'p2');
  assert.equal(d?.type,'momentum');
  assert.equal(d?.card?.id,'momentum-strength');
});

test('v0.12.25 recommended decks keep a fast recovery curve without deleting defensive identity',()=>{
  for(const [sid,d] of Object.entries(decks)){
    const defensive=d.filter(c=>c.kind==='move'&&c.defensiveOnly).length;
    const quick=d.filter(c=>c.kind==='move'&&!c.defensiveOnly&&!c.finisher&&!c.trademark&&(c.cost??99)<=3&&Object.values(c.requirements??{}).reduce((n,v)=>n+(v??0),0)<=1).length;
    assert.ok(defensive<=9,`${sid} has ${defensive} defensive-only pages`);
    assert.ok(quick>=8,`${sid} has only ${quick} quick offensive pages`);
  }
});

test('v0.12.25 CPU never deliberately passes while a legal offensive Move is already available',()=>{
  const {game,p}=freshActionState('seth-rollins');
  p.momentum={strength:2,strike:2,technical:2,agility:2,attitude:6};
  p.adrenaline=6;
  p.hand=[byId.get('punch'),byId.get('momentum-strike')];
  const d=cpuDecision(game,'p2');
  assert.notEqual(d?.type,'pass');
});

test('v0.12.25 profile schema advances for untouched v0.12.24 recommended-deck migration',()=>{
  assert.equal(PROFILE_VERSION,31);
});
