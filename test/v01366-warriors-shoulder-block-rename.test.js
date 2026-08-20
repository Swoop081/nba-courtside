import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const byId = id => allGameplayCards.find(card => card.id === id);
const collectorById = id => collectionCards.find(card => card.id === id);

test("v0.13.66 renames only Ultimate Warrior's exclusive Diving Shoulder Block", () => {
  const warrior = byId('ultimate-warrior-diving-shoulder-block');
  const generic = byId('diving-shoulder-block');
  assert.ok(warrior);
  assert.equal(warrior.name, "Warrior's Shoulder Block");
  assert.equal(warrior.superstarId, 'ultimate-warrior');
  assert.equal(warrior.rarity, 3);
  assert.equal(warrior.cost, 5);
  assert.equal(warrior.damage, 8);
  assert.equal(warrior.moveType, 'aerial');
  assert.equal(warrior.counterState, 'diving-aerial');

  assert.ok(generic);
  assert.equal(generic.name, 'Diving Shoulder Block');
  assert.equal(generic.superstarId ?? null, null);
  assert.equal(generic.rarity, 1);
  assert.equal(generic.cost, 4);
  assert.equal(generic.damage, 6);
});

test('v0.13.66 preserves Warrior collector identity and authored deck references', () => {
  const collector = collectorById('ultimate-warrior-diving-shoulder-block');
  assert.ok(collector);
  assert.equal(collector.name, "Warrior's Shoulder Block");
  assert.equal(collector.cardCode, 'HOF1-036');
  assert.ok((decks['ultimate-warrior'] ?? []).filter(card => card?.id === 'ultimate-warrior-diving-shoulder-block').length >= 1);
});
