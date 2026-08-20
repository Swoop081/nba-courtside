import test from 'node:test';
import assert from 'node:assert/strict';
import { createProfile } from '../js/data/profile.js?v=0.13.72';
import { grantBooster, openBooster, MAX_VERY_RARE_PULLS } from '../js/data/boosters.js?v=0.13.72';

function seqRng(values, fallback = 0.999) {
  let i = 0;
  return () => (i < values.length ? values[i++] : fallback);
}

test('v0.12.75 standard five-card boosters cap total Very Rare pulls at one', () => {
  const p = createProfile('cm-punk');
  grantBooster(p, 1, 'summerslam-series-1');
  // Miss the Superstar chase, then repeatedly request the top rarity band.
  const pack = openBooster(p, seqRng([0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99]), 'summerslam-series-1');
  const veryRares = pack.filter(pull => pull.card?.rarity === 4);
  assert.equal(MAX_VERY_RARE_PULLS, 1);
  assert.ok(veryRares.length <= 1, `expected at most one Very Rare, got ${veryRares.length}`);
});

test('v0.12.75 Very Rare ceiling holds across repeated booster openings', () => {
  const p = createProfile('roman-reigns');
  for (let i = 0; i < 500; i += 1) {
    grantBooster(p, 1, 'summerslam-series-1');
    const pack = openBooster(p, 'summerslam-series-1');
    const count = pack.filter(pull => pull.card?.rarity === 4).length;
    assert.ok(count <= MAX_VERY_RARE_PULLS, `pack ${i + 1} produced ${count} Very Rares`);
  }
});
