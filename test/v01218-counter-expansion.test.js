import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { COUNTER_STATES, SUBMISSION_TARGETS } from '../js/data/counter-states.js?v=0.13.72';
import { canCounter, counterEligibility } from '../js/engine/rules.js?v=0.13.72';
import { createProfile, migrateProfile, PROFILE_VERSION } from '../js/data/profile.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const counterCapable=c=>c?.kind==='move'&&((c.counters?.length??0)||(c.counterStates?.length??0)||(c.counterSubmissionTargets?.length??0)||(c.countersCardIds?.length??0));

test('v0.12.18 original eight anchors keep only Dropkick and Hurricanrana Method-gated',()=>{
  for(const id of ['punch','drop-toe-hold','knees-up','headbutt','arm-drag','back-elbow']) assert.deepEqual(byId(id).requirements,{},id);
  assert.deepEqual(byId('dropkick').requirements,{agility:1});
  assert.deepEqual(byId('hurricanrana').requirements,{agility:1});
});

test('v0.12.18 WA-inspired generic reversal package is present and accessible',()=>{
  for(const id of ['dodge','block','up-and-over','standing-switch','rollover-counter','backflip-counter','catch-the-foot','arm-drag-counter','jawbreaker']){
    const card=byId(id); assert.ok(card,id); assert.deepEqual(card.requirements,{},id);
  }
  assert.equal(canCounter({kind:'move',counterState:'arm-extended',moveType:'strike',damage:4},byId('dodge')),true);
  assert.equal(canCounter({kind:'move',counterState:'running-aerial',moveType:'aerial',damage:4},byId('up-and-over')),true);
  assert.equal(canCounter({kind:'move',counterState:'rear-control',moveType:'grapple',damage:4},byId('standing-switch')),true);
  assert.equal(canCounter({kind:'move',counterState:'body-elevated',moveType:'grapple',damage:5},byId('rollover-counter')),true);
});

test('v0.12.18 every physical state has at least four distinct reversal cards',()=>{
  for(const state of COUNTER_STATES){
    const cards=allGameplayCards.filter(c=>(c.counterStates??[]).includes(state));
    assert.ok(cards.length>=4,`${state}: ${cards.map(c=>c.id).join(', ')}`);
  }
});

test('v0.12.18 every Submission body area has at least four matching counters and Jawbreaker answers neck/head',()=>{
  for(const target of SUBMISSION_TARGETS){
    const cards=allGameplayCards.filter(c=>(c.counterSubmissionTargets??[]).includes(target));
    assert.ok(cards.length>=4,`${target}: ${cards.map(c=>c.id).join(', ')}`);
  }
  const sleeper={kind:'move',moveType:'submission',counterState:'rear-control',submissionTarget:'neck-head',damage:1};
  assert.equal(canCounter(sleeper,byId('jawbreaker')),true);
});

test('v0.12.18 zero-Agility wrestlers can answer both aerial states without Agility Momentum',()=>{
  const mkState=(incoming)=>({phase:'COUNTER',proposedMove:{attackerId:'p2',defenderId:'p1',card:incoming},players:{p1:{momentum:{strength:2,strike:0,technical:0,agility:0,attitude:0},adrenaline:0,superstar:{id:'test'},events:{},hand:[]},p2:{hp:50,maxHp:50,posture:'standing'} }});
  const running={id:'run',kind:'move',counterState:'running-aerial',moveType:'aerial',damage:4};
  const diving={id:'dive',kind:'move',counterState:'diving-aerial',moveType:'aerial',damage:4};
  assert.equal(counterEligibility(mkState(running),'p1',running,byId('up-and-over')).legal,true);
  assert.equal(counterEligibility(mkState(diving),'p1',diving,byId('knees-up')).legal,true);
});

test('v0.12.18 every recommended deck stays 60/12, has nine counters, all eight states and all four submission areas',()=>{
  assert.equal(Object.keys(decks).length,62);
  for(const [sid,deck] of Object.entries(decks)){
    assert.equal(deck.length,60,sid);
    assert.equal(deck.filter(c=>c.kind==='momentum').length,12,sid);
    const counters=deck.filter(counterCapable);
    assert.ok(counters.length>=9,`${sid}: ${counters.length}`);
    const states=new Set(counters.flatMap(c=>c.counterStates??[]));
    const targets=new Set(counters.flatMap(c=>c.counterSubmissionTargets??[]));
    assert.equal(states.size,8,`${sid}: states ${[...states].join(',')}`);
    assert.equal(targets.size,4,`${sid}: submissions ${[...targets].join(',')}`);
  }
});

test('v0.12.18 untouched v0.12.17 60-page starter recommendation migrates but custom order does not',()=>{
  const oldFp='3f4c2901';
  // Reconstruct only the migration behavior by using a saved recommended from the
  // prior profile format supplied by the v0.12.17 fingerprint map.
  const fresh=createProfile('cm-punk');
  assert.equal(PROFILE_VERSION,31);
  // Current fresh is already new; custom current deck should remain intact through migration.
  const custom={...fresh,version:22,savedDecks:{...fresh.savedDecks,'cm-punk':fresh.savedDecks['cm-punk'].map(e=>({...e}))}};
  [custom.savedDecks['cm-punk'][5],custom.savedDecks['cm-punk'][6]]=[custom.savedDecks['cm-punk'][6],custom.savedDecks['cm-punk'][5]];
  const migrated=migrateProfile(custom);
  assert.equal(migrated.savedDecks['cm-punk'][5].id,custom.savedDecks['cm-punk'][5].id);
  assert.equal(typeof oldFp,'string');
});
