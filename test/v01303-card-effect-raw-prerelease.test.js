import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { PRE_RELEASE_TEST_SET_IDS, isInternalTestSetId, isPlayerReleasedSetId, isPlayerVisibleSuperstar, isUnreleasedSetId } from '../js/data/release.js?v=0.13.72';
import { boosterEligible } from '../js/data/boosters.js?v=0.13.72';
import { filterAndSortCatalogue, defaultCatalogueFilters } from '../js/data/catalogue.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { moveEligibility } from '../js/engine/rules.js?v=0.13.72';

const stars = Object.values(superstars);
const star = id => stars.find(s => s.id === id);
const card = id => allGameplayCards.find(c => c.id === id);
const byName = name => allGameplayCards.find(c => c.name === name);

test('v0.13.3 RAW Series 1 is in internal certification scope but remains completely unreleased player-facing', () => {
  assert.deepEqual([...PRE_RELEASE_TEST_SET_IDS], ['raw-series-1','worlds-collide-series-1','new-generation-series-1']);
  assert.equal(isInternalTestSetId('raw-series-1'), true);
  assert.equal(isInternalTestSetId('worlds-collide-series-1'), true);
  assert.equal(isPlayerReleasedSetId('raw-series-1'), false);
  assert.equal(isUnreleasedSetId('raw-series-1'), true);
  const rawStars = stars.filter(s => s.setId === 'raw-series-1');
  assert.deepEqual(rawStars.map(s => s.id).sort(), ['austin-theory','chad-gable','joe-hendry','logan-paul','montez-ford','raquel-rodriguez','roxanne-perez','sol-ruca']);
  assert.equal(rawStars.length, 8);
  for (const s of rawStars) assert.equal(isPlayerVisibleSuperstar(s, { unlockedSuperstars: [s.id] }), false, `${s.id} must remain hidden even if stale profile data says unlocked`);
  const rawCards = allGameplayCards.filter(c => c.setId === 'raw-series-1');
  assert.equal(rawCards.length, 63);
  assert.equal(boosterEligible(rawCards.find(c => c.kind === 'move')), false);
  const visibleCatalogue = filterAndSortCatalogue(allGameplayCards, defaultCatalogueFilters());
  assert.equal(visibleCatalogue.some(c => c.setId === 'raw-series-1'), false);
});

test('v0.13.3 card-effect audit corrections make printed submission and Gunther chain data authoritative', () => {
  assert.equal(card('figure-four-leglock').submission.pressure, 5, 'Figure-Four now executes its printed +5 pressure');
  const chop = card('gunther-gunther-s-chop'), symphony = card('last-symphony');
  assert.deepEqual(chop.effects, [{ type: 'bodyPressure', bodyPart: 'chest', amount: 2 }], 'duplicate Last Symphony discount is removed from Chop');
  assert.deepEqual(symphony.discountIfNamedConnectedThisControl, { name: "Gunther's Chop", amount: 1 });

  const gunther = star('gunther'), opponent = star('cm-punk');
  const game = new MatchEngine({ p1: gunther, p2: opponent, decks, rng: () => 0.99 });
  const s = game.state();
  s.playerInControl = 'p1'; s.phase = 'ACTION';
  s.players.p1.hand = [chop]; s.players.p2.hand = [];
  s.players.p1.momentum.strike = 10; s.players.p1.momentum.strength = 10; s.players.p1.adrenaline = 0;
  assert.equal(game.declareMove('p1', chop), true);
  assert.equal(game.passCounter('p2'), true);
  assert.equal(s.players.p2.submissionDamage.chest, 2, 'Gunther Chop now executes its authored persistent Chest pressure');
  const eligibility = moveEligibility(s, 'p1', symphony);
  assert.equal(eligibility.legal, true);
  assert.equal(eligibility.effectiveCost, 6, 'Chop discounts Last Symphony exactly once, from 7 to 6');
});

test('v0.13.3 printed kickout-retain effects now execute for Standing Moonsault and Chaos Theory', () => {
  const attacker = star('logan-paul'), defender = star('cm-punk');
  for (const [moveName, extraDraw] of [['Standing Moonsault', 1], ['Chaos Theory', 0]]) {
    const move = byName(moveName);
    const game = new MatchEngine({ p1: attacker, p2: defender, decks, rng: () => 0.999 });
    const s = game.state();
    s.playerInControl = 'p1'; s.phase = 'PIN_RESPONSE';
    s.postMove = { attackerId: 'p1', defenderId: 'p2', cardId: move.id };
    s.proposedPin = { attackerId: 'p1', defenderId: 'p2' };
    s.players.p1.discard.push(move);
    const beforeP1 = s.players.p1.hand.length, beforeP2 = s.players.p2.hand.length;
    assert.equal(game.passPinResponse('p2'), true);
    assert.equal(s.playerInControl, 'p1', `${moveName} should retain Control after a normal kickout`);
    assert.equal(s.phase, 'ACTION');
    assert.equal(s.players.p1.hand.length, beforeP1 + 1 + extraDraw, `${moveName} gets normal turn draw${extraDraw ? ' plus its printed extra draw' : ''}`);
    assert.equal(s.players.p2.hand.length, beforeP2 + 1, 'defender still receives the normal kickout turn-advance draw');
  }
});

test('v0.13.3 ordinary failed pins still transfer Control and explicit pin-escape Actions override attacker retention', () => {
  const attacker = star('logan-paul'), defender = star('cm-punk');
  const ordinary = byName('Powerbomb');
  const g1 = new MatchEngine({ p1: attacker, p2: defender, decks, rng: () => 0.999 });
  const a = g1.state(); a.playerInControl='p1'; a.phase='PIN_RESPONSE'; a.postMove={attackerId:'p1',defenderId:'p2',cardId:ordinary.id}; a.proposedPin={attackerId:'p1',defenderId:'p2'}; a.players.p1.discard.push(ordinary);
  assert.equal(g1.passPinResponse('p2'), true); assert.equal(a.playerInControl, 'p2');

  const standing = byName('Standing Moonsault'), escape = card('special-cm-punk');
  const g2 = new MatchEngine({ p1: attacker, p2: defender, decks, rng: () => 0.999 });
  const b = g2.state(); b.playerInControl='p1'; b.phase='PIN_RESPONSE'; b.postMove={attackerId:'p1',defenderId:'p2',cardId:standing.id}; b.proposedPin={attackerId:'p1',defenderId:'p2'}; b.players.p1.discard.push(standing); b.players.p2.hand=[escape];
  assert.equal(g2.playPinEscape('p2', escape), true); assert.equal(b.playerInControl, 'p2', 'Best in the World explicitly takes Control and overrides Standing Moonsault retention');
});
