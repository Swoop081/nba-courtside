import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';

const byId = id => allGameplayCards.find(card => card.id === id);

test('v0.12.61 Roman Guillotine is a persistent submission hold', () => {
  const card = byId('roman-reigns-guillotine');
  assert.ok(card, 'Roman Guillotine exists');
  assert.equal(card.moveType, 'grapple');
  assert.equal(card.submission?.bodyPart, 'head');
  assert.equal(card.submission?.pressure, 3);
  assert.equal(card.submissionTarget, 'neck-head');
});

test('v0.12.61 Stone Cold exclusives live in Hall of Fame Series 1', () => {
  const austinCards = allGameplayCards.filter(card => card.superstarId === 'stone-cold-steve-austin');
  assert.ok(austinCards.length > 0, 'Austin cards found');
  assert.deepEqual(
    [...new Set(austinCards.map(card => card.setId))],
    ['hall-of-fame-series-1']
  );
  assert.equal(byId('open-can')?.setId, 'hall-of-fame-series-1');
  assert.equal(byId('what')?.setId, 'hall-of-fame-series-1');
});
