import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const rng=()=>0.42;

test('v0.12.33 Andre powerhouse package is re-anchored for defender-only retained-Control draw',()=>{
  const andre=superstars.andreTheGiant;
  const dus=byId('andre-the-giant-double-underhook-suplex');
  const splash=byId('andre-the-giant-sitdown-splash');
  const entrance=byId('entrance-andre-the-giant');
  assert.equal(andre.hp,72);
  assert.equal(andre.ability.trigger.maxUses,2);
  assert.equal(andre.ability.trigger.discount,2);
  assert.equal(andre.ability.trigger.damage,3);
  assert.equal(andre.entrance.preMatchAdrenaline,1);
  assert.equal(entrance.preMatchAdrenaline,1);
  assert.equal(dus.cost,5); assert.equal(dus.damage,14);
  assert.ok(dus.effects.some(e=>e.type==='discountNextByName'&&e.name==='Sitdown Splash'&&e.amount===3));
  assert.ok(dus.effects.some(e=>e.type==='search'&&e.name==='Sitdown Splash'));
  assert.equal(splash.cost,11); assert.equal(splash.damage,18); assert.equal(splash.finisher,true);
});

test("v0.12.29 Giant's Reach reserves its damage bonus for the next Strength Move",()=>{
  const andre=superstars.andreTheGiant;
  const punk=superstars.cmPunk;
  const g=new MatchEngine({p1:andre,p2:punk,decks,rng});
  const s=g.state(),a=s.players.p1,d=s.players.p2;
  const punch=byId('punch'), slam=byId('body-slam');
  a.abilityUses=andre.ability.trigger.maxUses; // stop new triggers; isolate the pending buff
  a.events.strengthDamageBuff=3;
  const hp0=d.hp;
  s.phase='RESOLVE_MOVE'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:punch}; g._connect();
  assert.equal(hp0-d.hp,punch.damage,'a Strike must not consume the Strength-only damage bonus');
  assert.equal(a.events.strengthDamageBuff,3);
  const hp1=d.hp;
  s.phase='RESOLVE_MOVE'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:slam}; g._connect();
  assert.equal(hp1-d.hp,slam.damage+3,'the next Strength Move receives the approved Giant Reach damage bonus');
  assert.equal(a.events.strengthDamageBuff,undefined);
});
