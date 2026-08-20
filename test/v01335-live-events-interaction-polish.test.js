import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { layeredCardArtFor } from '../js/data/artwork.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { isPlayerVisibleSuperstar } from '../js/data/release.js?v=0.13.72';
import { LIVE_EVENT_WIN_UP, activeLiveEventTowers } from '../js/data/live-events.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { reconstructCurrentPlayPile } from '../js/ui/play-pile.js?v=0.13.72';

const byId = id => allGameplayCards.find(card => card.id === id);
const collectionById = new Map(collectionCards.map(card => [card.id, card]));

test('v0.13.35 Hangman Armbar is the approved Survivor Series shared Common submission', () => {
  const card = byId('hangman-armbar');
  assert.ok(card);
  assert.equal(CARD_NUMBER_BY_ID[card.id]?.cardCode, 'SVS1-054');
  assert.equal(card.rarity, 1);
  assert.equal(card.cost, 3);
  assert.equal(card.damage, 0);
  assert.deepEqual(card.requirements, { technical: 1 });
  assert.equal(card.moveType, 'submission');
  assert.equal(card.submission?.bodyPart, 'arms');
  assert.equal(card.submission?.pressure, 3);
  assert.equal(card.standingOnly, true);
  assert.equal(card.counterState, 'arm-extended');
  assert.ok(fs.existsSync(new URL('../assets/art/survivor-series-series-1/hangman-armbar.jpg', import.meta.url)));
});

test('v0.13.35 rotating Live Events only expose player-released opponents and pay no direct win UP', () => {
  const now = new Date('2026-08-19T12:00:00');
  assert.equal(LIVE_EVENT_WIN_UP, 0);
  const towers = activeLiveEventTowers(now);
  assert.ok(towers.length >= 3);
  for (const tower of towers) {
    assert.equal(tower.winUp, 0, tower.key);
    for (const id of tower.event.opponentPool) {
      const star = Object.values(superstars).find(item => item.id === id);
      assert.equal(isPlayerVisibleSuperstar(star, null, now), true, `${tower.key}: ${id}`);
    }
  }
});

test('v0.13.35 layered artwork lookup includes Superstars while Method Momentum keeps its authored exception', () => {
  const roman = collectionCards.find(card => card.kind === 'superstar' && card.superstarId === 'roman-reigns');
  const action = collectionCards.find(card => card.id === 'special-roman-reigns');
  const momentum = collectionCards.find(card => card.kind === 'momentum');
  assert.match(layeredCardArtFor(roman), /assets\/cards\/art\/layered\/superstars\//);
  assert.match(layeredCardArtFor(action), /assets\/cards\/art\/layered\/actions\//);
  assert.equal(layeredCardArtFor(momentum), null);
});

test('v0.13.35 Tribal Chief offers a choice, declining preserves it, and accepting consumes it', () => {
  const roman = Object.values(superstars).find(item=>item.id==='roman-reigns'), punk = Object.values(superstars).find(item=>item.id==='cm-punk');
  const tribal = byId('special-roman-reigns');
  const make = () => {
    const game = new MatchEngine({ p1: roman, p2: punk, decks, rng: () => 0.42 });
    const state = game.state();
    state.players.p1.hand = [tribal];
    state.players.p1.specialUsed = false;
    state.players.p2.hand = state.players.p2.hand.filter(card => !card.special);
    state.phase = 'ACTION';
    state.playerInControl = 'p1';
    return game;
  };
  const decline = make();
  assert.equal(decline.passTurn('p1'), true);
  assert.equal(decline.state().phase, 'TRIGGER_RESPONSE');
  assert.equal(decline.state().pendingTriggeredSpecial?.cardId, tribal.id);
  assert.equal(decline.resolveTriggeredSpecial('p1', false), true);
  assert.equal(decline.state().players.p1.specialUsed, false);
  assert.ok(decline.state().players.p1.hand.some(card => card.id === tribal.id));
  assert.equal(decline.state().playerInControl, 'p2');

  const use = make();
  assert.equal(use.passTurn('p1'), true);
  assert.equal(use.resolveTriggeredSpecial('p1', true), true);
  assert.equal(use.state().players.p1.specialUsed, true);
  assert.equal(use.state().playerInControl, 'p1');
  assert.ok(!use.state().players.p1.hand.some(card => card.id === tribal.id));
});

test('v0.13.35 Play Pile treats a counter-attack state transition as one physical card', () => {
  const incoming = byId('punch');
  const counter = byId('jawbreaker');
  assert.ok(incoming && counter);
  const state = {
    log: [
      { type: 'MOVE_DECLARED', playerId: 'p1', cardId: incoming.id },
      { type: 'MOVE_COUNTERED', defenderId: 'p2', incomingCardId: incoming.id, counterCardId: counter.id, counterAttack: true },
      { type: 'COUNTER_ATTACK_DECLARED', attackerId: 'p2', defenderId: 'p1', cardId: counter.id },
      { type: 'MOVE_CONNECTED', playerId: 'p2', attackerId: 'p2', cardId: counter.id, damage: counter.damage }
    ],
    proposedMove: null
  };
  const pile = reconstructCurrentPlayPile(state, { cardById: collectionById });
  assert.equal(pile.filter(item => item.card.id === counter.id).length, 1);
  assert.equal(pile.filter(item => item.card.id === incoming.id).length, 1);
});

test('v0.13.35 Punch exchange shows one card per actual Punch played', () => {
  const punch = byId('punch');
  const state = {
    log: [
      { type: 'MOVE_DECLARED', playerId: 'p1', cardId: punch.id },
      { type: 'MOVE_COUNTERED', defenderId: 'p2', incomingCardId: punch.id, counterCardId: punch.id, counterAttack: true },
      { type: 'COUNTER_ATTACK_DECLARED', attackerId: 'p2', defenderId: 'p1', cardId: punch.id }
    ],
    proposedMove: { attackerId: 'p2', defenderId: 'p1', card: punch, isCounterAttack: true }
  };
  const pile = reconstructCurrentPlayPile(state, { cardById: collectionById });
  assert.equal(pile.filter(item => item.card.id === punch.id).length, 2);
});

test('v0.13.35 Pack results use the standard inspector and global paired-action treatment', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
  assert.match(app, /boosterInspectOverlayMarkup/);
  assert.match(app, /Tap any card to inspect it/);
  assert.match(app, /applyTwoButtonRows/);
  assert.match(css, /\.two-button-row\{display:grid!important;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/);
  assert.match(css, /\.booster-card-inspect-modal \.deck-lab-inspect-card\{height:min\(60svh,580px\)!important/);
});

test('v0.13.35 Live Event detail removes decorative hero art and compresses the top stats', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
  const heroStart = app.indexOf('compact-live-detail-hero');
  const heroEnd = app.indexOf('</section>', heroStart);
  assert.ok(heroStart >= 0 && heroEnd > heroStart);
  const hero = app.slice(heroStart, heroEnd);
  assert.doesNotMatch(hero, /live-tower-detail-art/);
  assert.doesNotMatch(hero, /UP EARNED/);
  assert.match(hero, /VICTORY PACKS/);
  assert.match(css, /\.compact-live-detail-hero/);
  assert.match(css, /grid-template-columns:1\.15fr 1fr 1fr/);
});
