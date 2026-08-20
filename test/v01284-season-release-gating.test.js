import test from 'node:test';
import assert from 'node:assert/strict';
import { tierReward } from '../js/data/seasons.js?v=0.13.72';
import { isUnreleasedSetId, LAUNCH_LIVE_SET_IDS } from '../js/data/release.js?v=0.13.72';

test('v0.12.84 Season Road booster tiers do not surface unreleased sets before they are promoted live',()=>{
  const boosterRewards = Array.from({length:99},(_,i)=>tierReward(i+1)).filter(r=>r.kind==='booster');
  assert.ok(boosterRewards.length > 0);
  for (const reward of boosterRewards) {
    assert.equal(isUnreleasedSetId(reward.setId), false, `tier ${reward.tier} should not award unreleased set ${reward.setId}`);
    assert.ok(LAUNCH_LIVE_SET_IDS.includes(reward.setId), `tier ${reward.tier} currently stays inside the live launch pool`);
  }
});

