import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile, addOwnedCard, cardOwnershipCap } from '../js/data/profile.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { applyFoilGameplay, foilDamageBonusFor } from '../js/data/foil.js?v=0.13.72';
import { addCardToDraft, canAddCard } from '../js/data/deck-builder.js?v=0.13.72';
import { buildPlayableDeck, findPackUpgrades } from '../js/data/deck-assistant.js?v=0.13.72';

const byId = new Map(collectionCards.map(card => [card.id, card]));

test('v0.13.55 positive-Damage Foil Moves gain exactly +1 Damage and zero-Damage cards do not', () => {
  const positive = collectionCards.find(card => card.kind === 'move' && (card.damage ?? 0) > 0);
  const zero = collectionCards.find(card => card.kind === 'move' && (card.damage ?? 0) === 0);
  assert.ok(positive && zero);
  const boosted = applyFoilGameplay(positive, true);
  assert.equal(boosted.damage, positive.damage + 1);
  assert.equal(boosted.normalDamage, positive.damage);
  assert.equal(boosted.foilDamageBonus, 1);
  assert.equal(applyFoilGameplay(boosted, true).damage, positive.damage + 1, 'Foil application is idempotent');
  assert.equal(foilDamageBonusFor(zero), 0);
  assert.equal(applyFoilGameplay(zero, true).damage, zero.damage);
});

test('v0.13.55 standard cards may own 5 Normal plus 5 Foil without one finish replacing the other', () => {
  const p = createProfile('cm-punk');
  const card = collectionCards.find(c => c.kind === 'move' && !c.superstarId && cardOwnershipCap(c) === 5);
  assert.ok(card);
  p.ownedCards[card.id] = { normal: 5, foil: 0 };
  let result = addOwnedCard(p, card.id, { foil: true, amount: 5 });
  assert.equal(result.added, 5);
  assert.equal(result.replacedNormal, 0);
  assert.deepEqual(p.ownedCards[card.id], { normal: 5, foil: 5 });
  result = addOwnedCard(p, card.id, { foil: true });
  assert.equal(result.overflowed, 1);
  result = addOwnedCard(p, card.id, { foil: false });
  assert.equal(result.overflowed, 1);
});

test('v0.13.55 deck copy cap remains 5 total while manual additions prefer Foil copies', () => {
  const p = createProfile('cm-punk');
  const card = decks['cm-punk'].find(c => c.kind === 'move' && !c.superstarId && (!Number.isFinite(c.maxCopies) || c.maxCopies >= 5));
  assert.ok(card);
  p.ownedCards[card.id] = { normal: 5, foil: 5 };
  let draft = [];
  for (let i = 0; i < 5; i += 1) draft = addCardToDraft(p, 'cm-punk', draft, card.id);
  assert.equal(draft.length, 5);
  assert.ok(draft.every(entry => entry.foil), 'Foil copies are used first');
  assert.equal(canAddCard(p, 'cm-punk', draft, card.id), false);
  assert.equal(addCardToDraft(p, 'cm-punk', draft, card.id).length, 5);
});

test('v0.13.55 saved Foil deck copies materialize with the live +1 Damage stat', () => {
  const p = createProfile('cm-punk');
  const base = decks['cm-punk'].find(card => card.kind === 'move' && (card.damage ?? 0) > 0);
  assert.ok(base);
  addOwnedCard(p, base.id, { foil: true });
  const index = p.savedDecks['cm-punk'].findIndex(entry => entry.id === base.id);
  assert.ok(index >= 0);
  p.savedDecks['cm-punk'][index] = { id: base.id, foil: true };
  const live = buildPlayableDeck(p, 'cm-punk').find(card => card.id === base.id && card.foil);
  assert.ok(live);
  assert.equal(live.damage, base.damage + 1);
});

test('v0.13.55 pack recommendations identify Foil positive-Damage cards as real +1 Damage upgrades', () => {
  const p = createProfile('cm-punk');
  const base = decks['cm-punk'].find(card => card.kind === 'move' && (card.damage ?? 0) > 0 && p.savedDecks['cm-punk'].some(entry => entry.id === card.id && !entry.foil));
  assert.ok(base);
  addOwnedCard(p, base.id, { foil: true });
  const before = p.savedDecks['cm-punk'].filter(entry => entry.id === base.id).length;
  const upgrade = findPackUpgrades(p, [{ card: base, foil: true, ownershipBefore: before, universePointsValue: 0 }]).find(u => u.type === 'foil-preference' && u.cardId === base.id);
  assert.ok(upgrade);
  assert.match(upgrade.reason, /\+1 Damage/);
});

test('v0.13.55 card UI uses live Foil gameplay materialization instead of baked art stats', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  assert.match(app, /card = applyFoilGameplay\(card, visualFoil\)/);
  assert.match(app, /FOIL \+1/);
  assert.match(app, /FOIL UPGRADE/);
});
