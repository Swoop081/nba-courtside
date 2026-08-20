import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProfile, grantSuperstarUnlockPackage, addOwnedCard, totalOwnedCopies, migrateProfile
} from '../js/data/profile.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import {
  buildBestOwnedRecommendedDraft, recommendedDeckComparison, recommendedDeckDraft, selectedEntranceId
} from '../js/data/deck-builder.js?v=0.13.72';
import { findPackUpgrades, applyUpgrade } from '../js/data/deck-assistant.js?v=0.13.72';
import { SUPERSTAR_CHASE_CHANCE, SUPERSTAR_PITY_PACKS } from '../js/data/boosters.js?v=0.13.72';

const sid = 'kevin-owens';
const idCount = (draft,id) => draft.filter(entry => (entry.id ?? entry) === id).length;
const uniqueExclusive = starId => {
  const seen = new Set();
  return (decks[starId] ?? []).filter(card => {
    const exclusive = card.superstarId === starId || (Array.isArray(card.allowedSuperstarIds) && card.allowedSuperstarIds.length === 1 && card.allowedSuperstarIds[0] === starId);
    if (!exclusive || seen.has(card.id)) return false;
    seen.add(card.id);
    return true;
  });
};
const expectedIdentityGrantIds = starId => {
  const cards = uniqueExclusive(starId);
  return [...new Set([
    cards.find(card => card.finisher === true)?.id,
    cards.find(card => card.trademark === true)?.id,
    cards.find(card => card.kind === 'action')?.id
  ].filter(Boolean))];
};

test('v0.13.19 secondary Superstar unlock grants only one Finisher, one Trademark and one Action where authored', () => {
  const profile = createProfile('roman-reigns');
  const beforeShared = new Map(collectionCards
    .filter(card => !card.superstarId && !['superstar','entrance'].includes(card.kind))
    .map(card => [card.id,totalOwnedCopies(profile,card.id)]));
  const unlock = grantSuperstarUnlockPackage(profile, sid, { celebrate:false });

  assert.equal(totalOwnedCopies(profile,`superstar-${sid}`),1);
  assert.deepEqual(unlock.rewardCards.slice(1), expectedIdentityGrantIds(sid));
  assert.equal(totalOwnedCopies(profile,'kevin-owens-stunner'),1,'one KO Finisher is granted');
  assert.equal(totalOwnedCopies(profile,'pop-up-powerbomb'),1,'one KO Trademark is granted');
  assert.equal(totalOwnedCopies(profile,'kevin-owens-package-piledriver'),0,'other exclusive signature remains collectible');
  assert.equal(totalOwnedCopies(profile,'special-kevin-owens'),1,'Welcome to the KO Show is now Kevin Owens’ single granted Action');
  assert.equal(totalOwnedCopies(profile,'entrance-kevin-owens'),0,'Superstar Entrance remains collectible');
  assert.equal(profile.savedDecks[sid],undefined,'secondary unlock does not manufacture a 60-page deck');
  assert.equal(selectedEntranceId(profile,sid),'entrance-amazing');

  for (const [id,before] of beforeShared) {
    assert.equal(totalOwnedCopies(profile,id),before,`${id} shared ownership must not be inflated by the unlock`);
  }
});

test('v0.13.19 every normal released + RAW pre-release secondary unlock obeys the per-category identity cap', () => {
  const scope = new Set(['summerslam-series-1','hall-of-fame-series-1','evolution-series-1','raw-series-1']);
  for (const star of Object.values(superstars).filter(item => scope.has(item.setId) && item.id !== 'the-rock')) {
    const first = star.id === 'roman-reigns' ? 'cm-punk' : 'roman-reigns';
    const profile = createProfile(first);
    const before = Object.fromEntries(uniqueExclusive(star.id).map(card => [card.id,totalOwnedCopies(profile,card.id)]));
    const unlock = grantSuperstarUnlockPackage(profile,star.id,{celebrate:false});
    const expected = expectedIdentityGrantIds(star.id);

    assert.deepEqual(unlock.rewardCards.slice(1),expected,star.id);
    assert.equal(profile.savedDecks[star.id],undefined,`${star.id} does not receive a manufactured deck`);
    if (star.entranceId) assert.equal(totalOwnedCopies(profile,star.entranceId),0,`${star.id} Entrance remains collectible`);

    for (const card of uniqueExclusive(star.id)) {
      const delta = totalOwnedCopies(profile,card.id) - (before[card.id] ?? 0);
      assert.equal(delta,expected.includes(card.id) ? 1 : 0,`${star.id} / ${card.id}`);
    }
  }
});

test('v0.13.19 Deck Lab builds only from owned cards and tracks the authored recommended gaps', () => {
  const profile = createProfile('roman-reigns');
  grantSuperstarUnlockPackage(profile, sid, { celebrate:false });
  const draft = buildBestOwnedRecommendedDraft(profile,sid);
  profile.savedDecks[sid] = draft;

  for (const entry of draft) assert.ok(totalOwnedCopies(profile,entry.id) >= idCount(draft,entry.id),`${entry.id} cannot exceed owned copies`);
  const comparison = recommendedDeckComparison(profile,sid,draft);
  assert.ok(comparison.matched < 60);
  assert.equal(comparison.missing,60-comparison.matched);
  assert.ok(comparison.missingRows.some(row => row.id === 'kevin-owens-stunner' && row.toCollect >= 1));
});

test('v0.13.19 a newly pulled recommended card is offered as an upgrade after an owned-card deck exists', () => {
  const profile = createProfile('roman-reigns');
  grantSuperstarUnlockPackage(profile, sid, { celebrate:false });
  profile.savedDecks[sid] = buildBestOwnedRecommendedDraft(profile,sid);
  const beforeMissing = recommendedDeckComparison(profile,sid,profile.savedDecks[sid]).missing;

  const card = decks[sid].find(card => card.id === 'pop-up-powerbomb');
  const ownershipBefore = totalOwnedCopies(profile,card.id);
  addOwnedCard(profile,card.id,{amount:1});
  const pull = { card, foil:false, ownershipBefore, universePointsValue:0 };
  const upgrade = findPackUpgrades(profile,[pull]).find(row => row.type === 'blueprint' && row.superstarId === sid && row.cardId === card.id);
  assert.ok(upgrade,'Deck Assistance should recommend the newly owned authored copy');
  assert.equal(applyUpgrade(profile,upgrade),true);
  assert.equal(idCount(profile.savedDecks[sid],card.id),Math.min(2,totalOwnedCopies(profile,card.id)));
  assert.equal(recommendedDeckComparison(profile,sid,profile.savedDecks[sid]).missing,beforeMissing-1);
});

test('v0.13.19 Superstar-specific Entrance is still recommended over Amazing Entrance', () => {
  const profile = createProfile('roman-reigns');
  grantSuperstarUnlockPackage(profile, sid, { celebrate:false });
  profile.savedDecks[sid] = buildBestOwnedRecommendedDraft(profile,sid);
  const entrance = collectionCards.find(card=>card.id==='entrance-kevin-owens');
  const ownershipBefore = totalOwnedCopies(profile,entrance.id);
  addOwnedCard(profile,entrance.id,{foil:true,amount:1});
  const pull = { card:entrance, foil:true, ownershipBefore, universePointsValue:0 };
  const upgrade = findPackUpgrades(profile,[pull]).find(row=>row.type==='entrance' && row.superstarId===sid);
  assert.ok(upgrade);
  assert.equal(selectedEntranceId(profile,sid),'entrance-amazing');
  assert.equal(applyUpgrade(profile,upgrade),true);
  assert.equal(selectedEntranceId(profile,sid),entrance.id);
});

test('v0.13.19 migration never claws back v0.13.18 cards or a complete saved deck', () => {
  const profile = createProfile('roman-reigns');
  profile.version = 30;
  profile.unlockedSuperstars.push(sid);
  profile.savedDecks[sid] = recommendedDeckDraft(sid);
  const needed = new Map();
  for (const card of decks[sid]) needed.set(card.id,(needed.get(card.id)??0)+1);
  for (const [id,count] of needed) {
    const missing = Math.max(0,count-totalOwnedCopies(profile,id));
    if (missing) addOwnedCard(profile,id,{amount:missing});
  }
  addOwnedCard(profile,`superstar-${sid}`,{foil:true});
  profile.deckNeedsCards[sid] = 0;
  const popBefore = totalOwnedCopies(profile,'pop-up-powerbomb');
  const migrated = migrateProfile(profile);
  assert.equal(totalOwnedCopies(migrated,'pop-up-powerbomb'),popBefore);
  assert.equal(migrated.savedDecks[sid].length,60);
});

test('v0.13.21 Superstar chase remains 2 percent with a 100-pack global hard pity', () => {
  assert.equal(SUPERSTAR_CHASE_CHANCE,.02);
  assert.equal(SUPERSTAR_PITY_PACKS,100);
});
