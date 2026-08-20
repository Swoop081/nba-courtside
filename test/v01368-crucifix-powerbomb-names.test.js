import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';

const byId = id => allGameplayCards.find(card => card.id === id);
const collectorById = id => collectionCards.find(card => card.id === id);

test("v0.13.68 leaves Razor Ramon as the only Razor's Edge card name", () => {
  const rhea = byId('razor-s-edge');
  const priest = byId('damian-priest-razors-edge');
  const razor = byId('razor-ramon-razors-edge');
  assert.ok(rhea && priest && razor);
  assert.equal(rhea.name, 'Rhea’s Crucifix Powerbomb');
  assert.equal(priest.name, 'Priest’s Crucifix Powerbomb');
  assert.equal(razor.name, 'The Razor’s Edge');

  const razorEdgeNames = allGameplayCards.filter(card => /razor[’']?s edge/i.test(card.name));
  assert.deepEqual(razorEdgeNames.map(card => card.id), ['razor-ramon-razors-edge']);
});

test('v0.13.68 preserves collector IDs, authored deck references and gameplay values', () => {
  const rhea = byId('razor-s-edge');
  const priest = byId('damian-priest-razors-edge');
  assert.deepEqual(
    { cost:rhea.cost, damage:rhea.damage, rarity:rhea.rarity, method:rhea.method, requirements:rhea.requirements, state:rhea.counterState },
    { cost:7, damage:11, rarity:2, method:'strength', requirements:{strength:3}, state:'body-elevated' }
  );
  assert.deepEqual(
    { cost:priest.cost, damage:priest.damage, rarity:priest.rarity, method:priest.method, requirements:priest.requirements, state:priest.counterState },
    { cost:8, damage:13, rarity:3, method:'strength', requirements:{strength:3}, state:'body-elevated' }
  );
  assert.equal(CARD_NUMBER_BY_ID['razor-s-edge'].cardCode, 'EVO1-004');
  assert.equal(CARD_NUMBER_BY_ID['damian-priest-razors-edge'].cardCode, 'SD1-024');
  assert.equal(CARD_NUMBER_BY_ID['razor-ramon-razors-edge'].cardCode, 'NG1-018');
  assert.equal((decks['rhea-ripley'] ?? []).filter(card => card?.id === 'razor-s-edge').length, 1);
  assert.equal((decks['damian-priest'] ?? []).filter(card => card?.id === 'damian-priest-razors-edge').length, 3);
  assert.equal(collectorById('razor-s-edge')?.name, 'Rhea’s Crucifix Powerbomb');
  assert.equal(collectorById('damian-priest-razors-edge')?.name, 'Priest’s Crucifix Powerbomb');
});

test('v0.13.68 Card Studio uses the renamed player-facing titles', () => {
  const studio = fs.readFileSync(new URL('../js/tools/card-art-studio-data.js', import.meta.url), 'utf8');
  assert.match(studio, /"id":"razor-s-edge","name":"Rhea’s Crucifix Powerbomb"/);
  assert.match(studio, /"id":"damian-priest-razors-edge","name":"Priest’s Crucifix Powerbomb"/);
  assert.match(studio, /"id":"razor-ramon-razors-edge","name":"The Razor’s Edge"/);
});
