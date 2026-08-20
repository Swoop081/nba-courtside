import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { DECK_LAB_CATEGORIES, categoryForCard } from '../js/data/deck-builder.js?v=0.13.72';
import { createProfile, grantSuperstarUnlockPackage } from '../js/data/profile.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { canPlayAction, canPlayPinEscape } from '../js/engine/rules.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const byId = new Map(allGameplayCards.map(card => [card.id, card]));

test('v0.13.20 retains the merged Action taxonomy as new Superstar Specials are added', () => {
  assert.equal(allGameplayCards.filter(card => card.kind === 'special').length, 0);
  assert.equal(allGameplayCards.filter(card => card.kind === 'action').length, 81);
  const legacyNamed = allGameplayCards.filter(card => card.id.startsWith('special-'));
  assert.equal(legacyNamed.length, 63);
  assert.ok(legacyNamed.every(card => card.kind === 'action' && card.special?.type));
  assert.equal(byId.get('shoulder-up')?.kind, 'action');
});

test('v0.13.20 Deck Lab exposes one Actions category and buckets triggered/reaction Actions into it', () => {
  assert.deepEqual(DECK_LAB_CATEGORIES.map(row => row.label), [
    'Finishers & Trademarks', 'High-Level Moves', 'Mid-Level Moves', 'Low-Level Moves', 'Actions', 'Momentum'
  ]);
  for (const id of ['special-cm-punk', 'special-brock-lesnar', 'special-bayley', 'shoulder-up']) {
    assert.equal(categoryForCard(byId.get(id)), 'utility', id);
  }
  const studio = fs.readFileSync(new URL('../tools/card-art-studio.html', import.meta.url), 'utf8');
  assert.doesNotMatch(studio, /value="special"|Superstar Special/);
});

test('v0.13.20 converted reaction Actions preserve their original timing instead of becoming normal Action-window cards', () => {
  const game = new MatchEngine({ p1: superstars.romanReigns, p2: superstars.cmPunk, decks });
  const state = game.state();
  state.playerInControl = 'p1';
  state.phase = 'ACTION';
  const shoulderUp = byId.get('shoulder-up');
  const bestInWorld = byId.get('special-cm-punk');
  assert.equal(canPlayAction(state, 'p1', shoulderUp), false, 'Shoulder Up remains pin-response only');
  assert.equal(canPlayAction(state, 'p1', bestInWorld), false, 'triggered Action cannot be spent as a normal Action');
  state.phase = 'PIN_RESPONSE';
  state.proposedPin = { attackerId: 'p2', defenderId: 'p1' };
  assert.equal(canPlayPinEscape(state, 'p1', shoulderUp), true);
});

test('v0.13.20 secondary unlock still grants at most one Action after the taxonomy merge', () => {
  const profile = createProfile('roman-reigns');
  const unlock = grantSuperstarUnlockPackage(profile, 'brock-lesnar', { celebrate: false });
  const grantedActions = unlock.rewardCards.map(id => byId.get(id)).filter(card => card?.kind === 'action');
  assert.equal(grantedActions.length, 1);
  assert.equal(grantedActions[0].id, 'special-brock-lesnar');
  assert.equal(profile.ownedCards['special-brock-lesnar-paul-heyman'], undefined, 'Brock’s second authored Action remains collectible');
});
