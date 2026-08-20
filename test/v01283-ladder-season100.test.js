import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SEASON_TIER_COUNT, MAX_SEASON_XP, tierReward, FINAL_BOSS_TIER_REWARDS } from '../js/data/seasons.js?v=0.13.72';
import { LAUNCH_LIVE_SET_IDS } from '../js/data/release.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.84 Season 1 expands to 100 tiers with Foil Rock at Tier 100',()=>{
  assert.equal(SEASON_TIER_COUNT,100);
  assert.equal(MAX_SEASON_XP,10000);
  assert.equal(tierReward(100).cardId,'superstar-the-rock');
  assert.equal(tierReward(100).foil,true);
  assert.match(app,/100-TIER REWARD ROAD/);
  assert.match(app,/SEASON ONE/);
  assert.match(app,/THE ROAD TO THE FINAL BOSS/);
});

test('v0.12.84 repeatable Rock rewards are five single-copy milestones each',()=>{
  for (const id of ['the-rock-lay-the-smack-down','the-rock-belt-whip','the-rock-rock-bottom','the-rock-people-s-elbow']) {
    const rewards=Object.values(FINAL_BOSS_TIER_REWARDS).filter(r=>r.cardId===id);
    assert.equal(rewards.length,5,id);
    assert.ok(rewards.every(r=>r.amount===1),`${id} stays one copy per tier`);
  }
  assert.equal(tierReward(40).cardId,'the-rock-rock-bottom');
  assert.equal(tierReward(50).cardId,'the-rock-rock-bottom');
});

test('v0.12.84 Season 1 interleaves UP and only currently released booster rewards',()=>{
  const rewards=Array.from({length:99},(_,i)=>tierReward(i+1));
  const sets=new Set(rewards.filter(r=>r.kind==='booster').map(r=>r.setId));
  assert.ok(rewards.some(r=>r.kind==='universe-points'));
  assert.deepEqual([...sets].sort(), [...LAUNCH_LIVE_SET_IDS].sort());
});

test('v0.13.53 Money in the Bank supersedes the old featured-fight / 2x4 ladder presentation',()=>{
  const ladder=app.slice(app.indexOf('function renderLadder()'),app.indexOf('function beginKingOfTheRing()'));
  assert.match(ladder,/mitb-v2-command/);
  assert.match(ladder,/mitb-v2-road/);
  assert.match(ladder,/mitb-v2-opponent/);
  assert.doesNotMatch(ladder,/redesigned-ladder-command|ladder-bottom-shell|redesigned-ladder-node/);
  assert.match(css,/body\[data-screen="ladder"\] \.mitb-v2-road\{/);
});
