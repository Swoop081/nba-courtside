import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { canCounter } from '../js/engine/rules.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const stars=Object.values(superstars);
const anchors={
  punch:'arm-extended',
  'drop-toe-hold':'leg-extended',
  dropkick:'running-aerial',
  'knees-up':'diving-aerial',
  hurricanrana:'body-elevated',
  headbutt:'torso-trapped',
  'arm-drag':'front-control',
  'back-elbow':'rear-control',
};
const methodLegalFor=(card,star)=>Object.entries(card.requirements??{}).every(([m,n])=>star.methodLimits?.[m]==null||star.methodLimits[m]>=n);

test('v0.12.19 restores the original eight as exact one-to-one state anchors',()=>{
  for(const [id,state] of Object.entries(anchors)) assert.deepEqual(byId(id).counterStates,[state],id);
  for(const id of ['punch','drop-toe-hold','knees-up','headbutt','arm-drag','back-elbow']) assert.deepEqual(byId(id).requirements,{},id);
  assert.deepEqual(byId('dropkick').requirements,{agility:1});
  assert.deepEqual(byId('hurricanrana').requirements,{agility:1});
});

test('v0.12.19 migrated counters obey physical states rather than bypassing them with legacy broad types',()=>{
  const spear=byId('spear');
  assert.equal(spear.counterState,'torso-trapped');
  assert.equal(canCounter(spear,byId('duck')),false,'Duck must not counter every old Grapple/Strike family by broad type');
  assert.equal(canCounter(spear,byId('standing-switch')),true);
  const running=allGameplayCards.find(c=>c.counterState==='running-aerial'&&!c.defensiveOnly);
  assert.ok(running);
  assert.equal(canCounter(running,byId('up-and-over')),true);
});

test('v0.12.19 Agility-0 Superstars have Method-accessible Running Aerial, Diving Aerial and Body Elevated answers',()=>{
  const zeroAgility=stars.filter(s=>s.methodLimits?.agility===0);
  assert.ok(zeroAgility.length>0);
  for(const star of zeroAgility){
    const counters=decks[star.id].filter(c=>c.counterStates?.length&&methodLegalFor(c,star));
    const states=new Set(counters.flatMap(c=>c.counterStates));
    for(const state of ['running-aerial','diving-aerial','body-elevated']) assert.ok(states.has(state),`${star.id}: ${state}`);
  }
  assert.deepEqual(byId('up-and-over').requirements,{});
  assert.deepEqual(byId('knees-up').requirements,{});
  assert.deepEqual(byId('rollover-counter').requirements,{});
});

test('v0.12.19 submission body areas use natural existing move counters',()=>{
  const target=(id,t)=>assert.ok(byId(id).counterSubmissionTargets?.includes(t),`${id} -> ${t}`);
  target('jawbreaker','neck-head');
  target('back-elbow','neck-head');
  target('arm-drag','arms');
  target('arm-drag-counter','arms');
  target('drop-toe-hold','legs');
  target('dragon-screw','legs');
  target('enzuigiri','legs');
  target('standing-switch','back');
  target('hip-toss','back');
});

test('v0.12.19 exact named-card reversals remain supported alongside state counters',()=>{
  assert.equal(canCounter(byId('short-arm-clothesline'),byId('enzuigiri')),true);
  assert.equal(canCounter(byId('big-boot'),byId('short-arm-clothesline')),true);
});
