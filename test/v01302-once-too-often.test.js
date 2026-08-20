import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { deckIds, decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { counterEligibility } from '../js/engine/rules.js?v=0.13.72';
import { createProfile, migrateProfile, totalOwnedCopies, PROFILE_VERSION } from '../js/data/profile.js?v=0.13.72';

const star=id=>Object.values(superstars).find(s=>s.id===id);
const once=allGameplayCards.find(c=>c.id==='once-too-often');
const repeated={id:'repeat-test-move',name:'Repeat Test Move',kind:'move',setId:'summerslam-series-1',cost:0,damage:4,requirements:{},moveType:'strike',method:'strike',counterState:'arm-extended'};

test('v0.13.2 Once Too Often is a collectible 2-star reactive Action with the normal five-copy cap',()=>{
  assert.ok(once);
  assert.equal(once.kind,'action');
  assert.equal(once.rarity,2);
  assert.equal(once.effect?.type,'onceTooOften');
  assert.equal(once.universalBooster,true);
  assert.equal(once.maxCopies,undefined,'normal five-copy cap applies rather than a one-copy override');
});

test('v0.13.2 every authored 60-page deck starts with exactly one Once Too Often outside Lead Off 5',()=>{
  assert.equal(Object.keys(deckIds).length,62);
  for(const [sid,ids] of Object.entries(deckIds)){
    assert.equal(ids.length,60,`${sid} remains 60 pages`);
    assert.equal(ids.filter(id=>id==='once-too-often').length,1,`${sid} starts with one copy`);
    assert.equal(ids.slice(0,5).includes('once-too-often'),false,`${sid} Lead Off 5 is untouched`);
    assert.equal(decks[sid].length,60);
  }
});

test('v0.13.2 Once Too Often only answers a Move after that exact card has connected earlier and then guarantees Control',()=>{
  const game=new MatchEngine({p1:star('cm-punk'),p2:star('seth-rollins'),decks,rng:()=>0.5});
  const s=game.state();
  // First copy connects normally and establishes exact-card match history.
  s.playerInControl='p2'; s.phase='RESOLVE_MOVE'; s.proposedMove={attackerId:'p2',defenderId:'p1',card:{...repeated}};
  const hpBefore=s.players.p1.hp;
  game._connect();
  assert.equal(s.players.p1.hp,hpBefore-4);
  assert.equal(s.players.p2.events.connectedCardIdsMatch[repeated.id],1);

  // The repeat opens a Counter window; Once Too Often is legal and prevents the second damage instance.
  s.playerInControl='p2'; s.phase='COUNTER'; s.proposedMove={attackerId:'p2',defenderId:'p1',card:{...repeated}};
  s.players.p1.hand=[{...once}];
  assert.equal(counterEligibility(s,'p1',s.proposedMove.card,s.players.p1.hand[0]).legal,true);
  const afterFirst=s.players.p1.hp;
  assert.equal(game.counter('p1',s.players.p1.hand[0]),true);
  assert.equal(s.players.p1.hp,afterFirst,'repeated Move never connects');
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.phase,'ACTION');
  assert.ok(s.players.p1.outOfPlay.some(c=>c.id==='once-too-often'));
  assert.ok(!s.players.p1.discard.some(c=>c.id==='once-too-often'));
  assert.ok(s.players.p2.discard.filter(c=>c.id===repeated.id).length>=2);
  assert.ok(s.log.some(e=>e.type==='ONCE_TOO_OFTEN'&&e.incomingCardId===repeated.id));
});

test('v0.13.2 Once Too Often can stop a repeated Finisher but never a counter-attack',()=>{
  const game=new MatchEngine({p1:star('cm-punk'),p2:star('seth-rollins'),decks,rng:()=>0.5});
  const s=game.state(),fin={...repeated,id:'repeat-finisher',name:'Repeat Finisher',finisher:true,damage:16,method:null};
  s.players.p2.events.connectedCardIdsMatch[fin.id]=1;
  s.phase='COUNTER'; s.playerInControl='p2'; s.proposedMove={attackerId:'p2',defenderId:'p1',card:fin};
  assert.equal(counterEligibility(s,'p1',fin,once).legal,true);
  s.proposedMove.isCounterAttack=true;
  assert.equal(counterEligibility(s,'p1',fin,once).legal,false);
});

test('v0.13.2 old complete saved decks receive one safe copy while incomplete drafts are not rewritten',()=>{
  const old=createProfile('cm-punk');
  old.version=28;
  old.ownedCards['once-too-often']={normal:0,foil:0};
  const saved=old.savedDecks['cm-punk'];
  const idx=saved.findIndex((e,i)=>i>=5&&e.id==='once-too-often');
  assert.ok(idx>=5);
  saved[idx]={id:'crowd-support',foil:false};
  const incomplete=saved.slice(0,40).map(e=>({...e}));
  old.savedDecks['roman-reigns']=incomplete;
  old.unlockedSuperstars.push('roman-reigns');
  const migrated=migrateProfile(old);
  assert.equal(migrated.version,PROFILE_VERSION);
  assert.equal(totalOwnedCopies(migrated,'once-too-often'),1);
  assert.equal(migrated.savedDecks['cm-punk'].length,60);
  assert.equal(migrated.savedDecks['cm-punk'].filter(e=>e.id==='once-too-often').length,1);
  assert.equal(migrated.savedDecks['cm-punk'].slice(0,5).some(e=>e.id==='once-too-often'),false);
  assert.equal(migrated.savedDecks['roman-reigns'].length,40,'incomplete custom draft remains untouched');
  assert.equal(migrated.savedDecks['roman-reigns'].some(e=>e.id==='once-too-often'),false);
});

test('v0.13.2 universal booster pooling and Rulebook explain extra copies',()=>{
  const boosters=fs.readFileSync(new URL('../js/data/boosters.js',import.meta.url),'utf8');
  const rules=fs.readFileSync(new URL('../js/data/game-rules.js',import.meta.url),'utf8');
  assert.match(boosters,/card\.universalBooster === true/);
  assert.match(rules,/Every authored deck starts with 1 Once Too Often/);
  assert.match(rules,/normal 5-copy cap/);
  assert.match(rules,/repeated Finisher/);
});
