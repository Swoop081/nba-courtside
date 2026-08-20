import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { COUNTER_STATES, SUBMISSION_TARGETS } from '../js/data/counter-states.js?v=0.13.72';
import { canCounter } from '../js/engine/rules.js?v=0.13.72';
import { createProfile, migrateProfile, PROFILE_VERSION } from '../js/data/profile.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);

test('v0.12.17 every Move has exactly one universal counter state and every Submission has a body-area target',()=>{
  const moves=allGameplayCards.filter(c=>c.kind==='move');
  assert.ok(moves.length>=305);
  for(const card of moves){
    assert.ok(COUNTER_STATES.includes(card.counterState),`${card.id}: ${card.counterState}`);
    assert.equal(typeof card.counterState,'string',card.id);
    if(card.moveType==='submission')assert.ok(SUBMISSION_TARGETS.includes(card.submissionTarget),`${card.id}: ${card.submissionTarget}`);
  }
});

test('v0.12.17 eight-state anchor reversals work by physical state',()=>{
  const incoming={
    arm:{id:'incoming-arm',kind:'move',counterState:'arm-extended',moveType:'strike',damage:4},
    leg:{id:'incoming-leg',kind:'move',counterState:'leg-extended',moveType:'strike',damage:4},
    run:{id:'incoming-run',kind:'move',counterState:'running-aerial',moveType:'aerial',damage:4},
    dive:{id:'incoming-dive',kind:'move',counterState:'diving-aerial',moveType:'aerial',damage:4},
    elevated:{id:'incoming-elevated',kind:'move',counterState:'body-elevated',moveType:'grapple',damage:4},
    torso:{id:'incoming-torso',kind:'move',counterState:'torso-trapped',moveType:'grapple',damage:4},
    front:{id:'incoming-front',kind:'move',counterState:'front-control',moveType:'grapple',damage:4},
    rear:{id:'incoming-rear',kind:'move',counterState:'rear-control',moveType:'grapple',damage:4},
  };
  assert.equal(canCounter(incoming.arm,byId('punch')),true);
  assert.equal(canCounter(incoming.leg,byId('drop-toe-hold')),true);
  assert.equal(canCounter(incoming.run,byId('dropkick')),true);
  assert.equal(canCounter(incoming.dive,byId('knees-up')),true);
  assert.equal(canCounter(incoming.elevated,byId('hurricanrana')),true);
  assert.equal(canCounter(incoming.torso,byId('headbutt')),true);
  assert.equal(canCounter(incoming.front,byId('arm-drag')),true);
  assert.equal(canCounter(incoming.rear,byId('back-elbow')),true);
  assert.equal(canCounter(incoming.dive,byId('punch')),false);
});

test('v0.12.17 submission counters use both initial state and body-area response layers',()=>{
  const arm=byId('becky-lynch-dis-arm-her');
  const leg=byId('figure-four-leglock');
  const head=byId('sleeper-hold');
  assert.equal(arm.submissionTarget,'arms');
  assert.equal(leg.submissionTarget,'legs');
  assert.equal(head.submissionTarget,'neck-head');
  assert.equal(canCounter(arm,byId('arm-drag')),true);
  assert.equal(canCounter(leg,byId('dragon-screw')),true);
  assert.equal(canCounter(head,byId('back-elbow')),true);
  assert.equal(canCounter(leg,byId('chain-wrestling')),true);
});

test('v0.12.17 all recommended decks are 60 pages with 12 Momentum and at least seven counter-capable pages',()=>{
  assert.equal(Object.keys(decks).length,62);
  for(const [sid,deck] of Object.entries(decks)){
    assert.equal(deck.length,60,sid);
    assert.equal(deck.filter(c=>c.kind==='momentum').length,12,sid);
    const counters=deck.filter(c=>c.kind==='move'&&(c.counters?.length||c.counterStates?.length||c.counterSubmissionTargets?.length||c.countersCardIds?.length));
    assert.ok(counters.length>=7,`${sid}: ${counters.length}`);
  }
});

test('v0.12.17 match hand ordering and pin-escape spectacle are wired in the runtime UI',()=>{
  const src=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  assert.match(src,/Actions · playable Moves by highest damage/);
  assert.match(src,/damageRank = -\(Number\(card\.damage\) \|\| 0\)/);
  assert.match(src,/PIN_ESCAPED_SPECIAL/);
  assert.match(src,/SHOULDER UP!/);
  assert.match(src,/pin-escape-card-showcase/);
});


test('v0.12.17 migration extends untouched 55-page recommended saves without overwriting custom 55-page decks',()=>{
  const fresh=createProfile('cm-punk');
  const recommended60=fresh.savedDecks['cm-punk'].map(e=>e.id);
  const old={...fresh,version:21,savedDecks:{...fresh.savedDecks,'cm-punk':fresh.savedDecks['cm-punk'].slice(0,55)}};
  const migrated=migrateProfile(old);
  assert.equal(migrated.version,PROFILE_VERSION);
  assert.equal(migrated.savedDecks['cm-punk'].length,60);
  assert.deepEqual(migrated.savedDecks['cm-punk'].map(e=>e.id),recommended60);

  const custom={...fresh,version:21,savedDecks:{...fresh.savedDecks,'cm-punk':fresh.savedDecks['cm-punk'].slice(0,55).map(e=>({...e}))}};
  [custom.savedDecks['cm-punk'][5],custom.savedDecks['cm-punk'][6]]=[custom.savedDecks['cm-punk'][6],custom.savedDecks['cm-punk'][5]];
  const migratedCustom=migrateProfile(custom);
  assert.equal(migratedCustom.savedDecks['cm-punk'].length,55);
});
