import test from 'node:test';
import assert from 'node:assert/strict';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import {
  playerReleasedCollectibleSetIds,
  isPlayerReleasedSetId,
  isPlayerVisibleSuperstar,
  setReleaseAt
} from '../js/data/release.js?v=0.13.72';
import { boosterEligible } from '../js/data/boosters.js?v=0.13.72';
import { releasedStoreSetIds, storeRotation, storeSuperstars } from '../js/data/store.js?v=0.13.72';
import { filterAndSortCatalogue, defaultCatalogueFilters } from '../js/data/catalogue.js?v=0.13.72';
import { exhibitionOpponentIds } from '../js/data/matchmaking.js?v=0.13.72';
import { tierReward } from '../js/data/seasons.js?v=0.13.72';
import { liveEventRotation } from '../js/data/live-events.js?v=0.13.72';

const at = (y,m,d,h=12) => new Date(y,m-1,d,h,0,0,0);
const star = id => Object.values(superstars).find(s => s.id === id);
const cardIn = setId => collectionCards.find(c => c.setId === setId && c.kind === 'move');

const expected = [
  ['raw-series-1', at(2026,9,5)],
  ['worlds-collide-series-1', at(2026,9,26)],
  ['money-in-the-bank-series-1', at(2026,10,10)],
  ['smackdown-series-1', at(2026,10,31)],
  ['survivor-series-series-1', at(2026,11,28)]
];

test('v0.13.7 canonical release calendar promotes each authored set at local midnight on its configured date', () => {
  for (const [setId, releaseDay] of expected) {
    const releaseAt = setReleaseAt(setId);
    assert.ok(releaseAt instanceof Date && !Number.isNaN(releaseAt.getTime()), `${setId} has a valid release date`);
    const before = new Date(releaseAt.getTime() - 1);
    assert.equal(isPlayerReleasedSetId(setId, before), false, `${setId} stays hidden before release`);
    assert.equal(isPlayerReleasedSetId(setId, releaseAt), true, `${setId} unlocks at local midnight`);
  }
});

test('v0.13.7 player set pool grows in the planned Season 1 order without leaking later subsets', () => {
  assert.deepEqual(playerReleasedCollectibleSetIds(at(2026,8,18)), [
    'summerslam-series-1','hall-of-fame-series-1','evolution-series-1'
  ]);
  assert.deepEqual(playerReleasedCollectibleSetIds(at(2026,9,5)), [
    'summerslam-series-1','hall-of-fame-series-1','evolution-series-1','raw-series-1'
  ]);
  assert.deepEqual(playerReleasedCollectibleSetIds(at(2026,9,26)), [
    'summerslam-series-1','hall-of-fame-series-1','evolution-series-1','raw-series-1','worlds-collide-series-1'
  ]);
  assert.equal(playerReleasedCollectibleSetIds(at(2026,10,30)).includes('smackdown-series-1'), false);
  assert.equal(playerReleasedCollectibleSetIds(at(2026,10,31)).includes('smackdown-series-1'), true);
});

test('v0.13.7 RAW visibility, boosters, Catalogue, Store and Exhibition all obey the same release gate', () => {
  const before = at(2026,9,4), after = at(2026,9,5);
  const logan = star('logan-paul'), rawMove = cardIn('raw-series-1');
  assert.ok(logan && rawMove);
  assert.equal(isPlayerVisibleSuperstar(logan, { unlockedSuperstars: ['logan-paul'] }, before), false);
  assert.equal(isPlayerVisibleSuperstar(logan, { unlockedSuperstars: [] }, after), true);
  assert.equal(boosterEligible(rawMove, before), false);
  assert.equal(boosterEligible(rawMove, after), true);
  assert.equal(filterAndSortCatalogue(collectionCards, defaultCatalogueFilters(), undefined, before).some(c => c.setId === 'raw-series-1'), false);
  assert.equal(filterAndSortCatalogue(collectionCards, defaultCatalogueFilters(), undefined, after).some(c => c.setId === 'raw-series-1'), true);
  assert.equal(storeSuperstars('raw-series-1', before).length, 0);
  assert.equal(storeSuperstars('raw-series-1', after).length, 8);
  assert.equal(exhibitionOpponentIds('cm-punk', before).includes('logan-paul'), false);
  assert.equal(exhibitionOpponentIds('cm-punk', after).includes('logan-paul'), true);
});

test('v0.13.7 Store rotation never points at a set that is unreleased on that simulated day', () => {
  for (let i = 0; i < 120; i += 1) {
    const now = new Date(at(2026,8,18).getTime() + i * 86400000);
    const rotation = storeRotation(now);
    assert.ok(releasedStoreSetIds(now).includes(rotation.setId), `${rotation.setId} must be released on ${now.toISOString()}`);
    assert.equal(isPlayerReleasedSetId(rotation.setId, now), true);
  }
});

test('v0.13.7 Season and branded Live Event rewards can use a subset only after its release date', () => {
  for (const now of [at(2026,8,18), at(2026,9,5), at(2026,9,26), at(2026,10,10), at(2026,10,31)]) {
    const rewards = Array.from({length:99},(_,i)=>tierReward(i+1,now)).filter(r=>r.kind==='booster');
    assert.ok(rewards.every(r=>isPlayerReleasedSetId(r.setId,now)), `Season rewards must be released on ${now.toISOString()}`);
  }
  const rawMondayBefore = liveEventRotation(at(2026,8,31));
  const rawMondayAfter = liveEventRotation(at(2026,9,7));
  assert.notEqual(rawMondayBefore.event.rewardSetId, 'raw-series-1', 'Monday RAW falls back before RAW Series 1 release');
  assert.equal(rawMondayAfter.event.rewardSetId, 'raw-series-1', 'Monday RAW rewards RAW Series 1 once released');
});
