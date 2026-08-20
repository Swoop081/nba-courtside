import test from 'node:test';
import assert from 'node:assert/strict';
import { claimSeasonTier, tierReward, FINAL_BOSS_TIER_REWARDS, SEASON_TIER_COUNT } from '../js/data/seasons.js?v=0.13.72';
import { createProfile, migrateProfile, totalOwnedCopies, PROFILE_VERSION } from '../js/data/profile.js?v=0.13.72';
import { selectedEntranceId } from '../js/data/deck-builder.js?v=0.13.72';

const milestones = Object.keys(FINAL_BOSS_TIER_REWARDS).map(Number).sort((a,b)=>a-b);

test('v0.12.83 Final Boss prestige chase spans the 100-tier road one card at a time',()=>{
  assert.equal(PROFILE_VERSION,31);
  assert.equal(SEASON_TIER_COUNT,100);
  assert.equal(tierReward(40).cardId,'the-rock-rock-bottom');
  assert.equal(tierReward(50).cardId,'the-rock-rock-bottom');
  assert.equal(tierReward(100).rewardType,'superstar');
  assert.equal(tierReward(100).foil,true);
  assert.equal(tierReward(100).label,'FOIL SUPERSTAR');
  for (const tier of milestones.filter(t=>t!==100)) assert.equal(tierReward(tier).amount,1,`tier ${tier} awards one Rock card`);
});

test('v0.12.83 full Season Road awards five copies of every repeatable Rock move and one of each one-off card',()=>{
  const p=createProfile('cm-punk');
  p.seasons['season-1'].xp=10000;
  for(const tier of milestones) claimSeasonTier(p,tier);

  for(const id of ['the-rock-lay-the-smack-down','the-rock-belt-whip','the-rock-rock-bottom','the-rock-people-s-elbow']) {
    assert.equal(totalOwnedCopies(p,id),5,id);
  }
  assert.equal(totalOwnedCopies(p,'people-championship'),1);
  assert.equal(totalOwnedCopies(p,'special-the-rock'),1);
  assert.equal(p.ownedCards['entrance-the-rock']?.foil,1);
  assert.equal(p.ownedCards['superstar-the-rock']?.foil,1);
  assert.ok(p.unlockedSuperstars.includes('the-rock'));
  assert.equal(selectedEntranceId(p,'the-rock'),'entrance-amazing');
  assert.equal(p.savedDecks['the-rock'],undefined,'Tier 100 must not auto-install the complete Final Boss deck');
});

test('v0.12.55 legacy profile migration still preserves old already-claimed Final Boss rewards',()=>{
  const p=createProfile('roman-reigns');
  p.version=26;
  p.seasons['season-1'].claimedTiers=[5,10,20,30,40];
  for(const reward of Object.values(FINAL_BOSS_TIER_REWARDS)) delete p.ownedCards[reward.cardId];
  const migrated=migrateProfile(p);
  assert.equal(totalOwnedCopies(migrated,'the-rock-lay-the-smack-down'),1);
  assert.equal(totalOwnedCopies(migrated,'the-rock-rock-bottom'),3);
  assert.equal(totalOwnedCopies(migrated,'special-the-rock'),1);
  assert.equal(totalOwnedCopies(migrated,'the-rock-people-s-elbow'),2);
  assert.equal(totalOwnedCopies(migrated,'entrance-the-rock'),1);
  assert.equal(migrated.unlockedSuperstars.includes('the-rock'),false);
});
