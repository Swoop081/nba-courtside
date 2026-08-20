import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile, grantSuperstarUnlockPackage } from '../js/data/profile.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { buildBestOwnedRecommendedDraft, enforceOwnedDraft, recommendedDeckDraft, validateDeckDraft, ownedTotal, cardEligibilityForSuperstar } from '../js/data/deck-builder.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../js/data/game-rules.js', import.meta.url), 'utf8');

function countDraft(draft = []) {
  const counts = new Map();
  for (const raw of draft) {
    const id = raw?.id ?? raw;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

test('v0.13.36 completing a structured mode suppresses the normal victory booster and shows only the Super Pack', () => {
  assert.match(app, /awardNormalVictoryPack\(outcome\.status === "cleared"\)/);
  assert.match(app, /rewardLine = `1 × Super Pack`/);
  assert.match(app, /rewardLine = `Super Pack choice after coronation`/);
  assert.doesNotMatch(app, /on top of the final victory booster/);
  assert.doesNotMatch(app, /Victory Booster · 1 × Super Pack/);
  assert.match(rules, /final victory that clears a full structured mode or tournament awards only its Super Pack/i);
});

test('v0.13.36 Super Pack final-card reveal uses the explicit next/summary action path', () => {
  assert.match(app, /flipAttr:`data-booster-next="\$\{boosterFocusIndex\}"`/);
  assert.match(app, /boosterFocusIndex===pulls\.length-1\?'TAP CARD · PACK SUMMARY'/);
  assert.match(app, /else \{\s*preparePackSummary\(\);\s*\}/);
});

test('v0.13.36 automatic Deck Lab builders cannot emit more copies than the player owns', () => {
  const profile = createProfile('cm-punk');
  grantSuperstarUnlockPackage(profile, 'roman-reigns', { celebrate: false });
  const roman = Object.values(superstars).find(star => star.id === 'roman-reigns');
  assert.ok(roman);

  const guardedBlueprint = enforceOwnedDraft(profile, 'roman-reigns', recommendedDeckDraft('roman-reigns'));
  const bestOwned = buildBestOwnedRecommendedDraft(profile, 'roman-reigns');
  for (const draft of [guardedBlueprint, bestOwned]) {
    for (const [id, count] of countDraft(draft)) {
      assert.ok(count <= ownedTotal(profile, id), `${id}: ${count} used > ${ownedTotal(profile, id)} owned`);
    }
  }

  const unowned = collectionCards.find(card =>
    !['superstar','entrance'].includes(card.kind) &&
    ownedTotal(profile, card.id) === 0 &&
    cardEligibilityForSuperstar(roman, card).legal
  );
  assert.ok(unowned, 'expected at least one legal unowned Roman card');
  const invalid = [...bestOwned];
  if (invalid.length) invalid[0] = { id: unowned.id, foil: false };
  else invalid.push({ id: unowned.id, foil: false });
  const check = validateDeckDraft(profile, 'roman-reigns', invalid);
  assert.ok(check.violations.some(text => text.includes(unowned.name) && text.includes('Collection owns 0')), check.violations.join('\n'));
});
