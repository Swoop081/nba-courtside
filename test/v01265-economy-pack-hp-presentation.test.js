import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MATCH_XP, DAILY_CHALLENGE_XP, WEEKLY_CHALLENGE_XP, XP_PER_TIER } from '../js/data/seasons.js?v=0.13.72';
import { RARITY_WEIGHTS, SUPERSTAR_PITY_PACKS, SUPERSTAR_CHASE_CHANCE, boosterEligible, underOwnershipCap, grantBooster, openBooster } from '../js/data/boosters.js?v=0.13.72';
import { createProfile, addOwnedCard } from '../js/data/profile.js?v=0.13.72';
import { cardsForSet } from '../js/data/collection.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';

const setId='summerslam-series-1';
const sequenceRng=(values,fallback=.42)=>{let i=0;return()=>values[i++]??fallback;};

test('v0.12.65 Season XP progression is slowed while tiers remain 100 XP',()=>{
  assert.equal(XP_PER_TIER,100);
  assert.deepEqual(MATCH_XP,{win:15,loss:0});
  assert.equal(DAILY_CHALLENGE_XP,25);
  assert.equal(WEEKLY_CHALLENGE_XP,100);
});

test('v0.12.65 ordinary booster slots roll rarity first at 50/30/15/5',()=>{
  assert.deepEqual(RARITY_WEIGHTS,{1:.5,2:.3,3:.15,4:.05});
  const p=createProfile('roman-reigns');
  grantBooster(p,1,setId);
  // Miss Superstar chase, then deliberately land one slot in each rarity band.
  const rng=sequenceRng([.99, .10,.10, .65,.10, .90,.10, .98,.10, .10,.10]);
  const pack=openBooster(p,rng,setId);
  assert.deepEqual(pack.map(pull=>pull.card.rarity),[1,2,3,4,1]);
  assert.equal(pack.some(pull=>pull.card.kind==='superstar'),false,'ordinary rarity slots exclude Superstar cards');
});

test('v0.13.21 Superstar chase is 2 percent with one global 100-miss pity track',()=>{
  assert.equal(SUPERSTAR_CHASE_CHANCE,.02);
  assert.equal(SUPERSTAR_PITY_PACKS,100);

  const natural=createProfile('roman-reigns');
  natural.packsSinceSuperstarUnlock=47;
  grantBooster(natural,2,'evolution-series-1');
  const naturalPack=openBooster(natural,sequenceRng([.019,.20]),'evolution-series-1');
  assert.equal(naturalPack[0].card.kind,'superstar');
  assert.equal(naturalPack[0].foil,true);
  assert.equal(natural.packsSinceSuperstarUnlock,0,'a natural Superstar clears all prior global pity progress');
  const nextPack=openBooster(natural,sequenceRng([.99]),'evolution-series-1');
  assert.equal(nextPack.some(pull=>pull.card.kind==='superstar'),false);
  assert.equal(natural.packsSinceSuperstarUnlock,1,'the first miss after a Superstar begins the new cycle at Pack 1');

  const pity=createProfile('roman-reigns');
  for (const card of cardsForSet(setId).filter(card=>card.kind==='superstar')) addOwnedCard(pity,card.id,{amount:1});
  pity.packsSinceSuperstarUnlock=100;
  grantBooster(pity,1,setId);
  const completedSetPack=openBooster(pity,()=>.99,setId);
  assert.equal(completedSetPack.some(pull=>pull.card.kind==='superstar'),false,'a complete set cannot award a Superstar from another set');
  assert.equal(pity.packsSinceSuperstarUnlock,101,'armed global pity remains armed across a complete-set pack');

  grantBooster(pity,1,'evolution-series-1');
  const pityPack=openBooster(pity,()=>.99,'evolution-series-1');
  assert.equal(pityPack[0].card.kind,'superstar','the next pack from a set with an unowned Superstar consumes the armed global pity');
  assert.equal(pityPack[0].card.setId,'evolution-series-1');
  assert.equal(pityPack[0].foil,true);
  assert.equal(pity.packsSinceSuperstarUnlock,0);
});

test('v0.12.65 Roman profile can pull non-Roman Very Rare SummerSlam cards',()=>{
  const p=createProfile('roman-reigns');
  const normal=cardsForSet(setId).filter(card=>boosterEligible(card)&&card.kind!=='superstar'&&(card.kind!=='entrance'||underOwnershipCap(p,card)));
  const firstPool=normal.filter(card=>underOwnershipCap(p,card));
  const bucket=firstPool.filter(card=>card.rarity===4);
  const target=bucket.find(card=>card.superstarId&&card.superstarId!=='roman-reigns'&&card.kind!=='entrance');
  assert.ok(target,'a non-Roman Very Rare chase card must exist');
  const index=bucket.findIndex(card=>card.id===target.id);
  grantBooster(p,1,setId);
  const pack=openBooster(p,sequenceRng([.99,.99,(index+.5)/bucket.length]),setId);
  assert.equal(pack[0].card.id,target.id);
  assert.notEqual(pack[0].card.superstarId,'roman-reigns');
});

test('v0.12.65 HP follows physical strength and size with Andre as unique ceiling',()=>{
  const hp=Object.fromEntries(Object.values(superstars).map(star=>[star.id,star.hp]));
  assert.equal(Object.keys(hp).length,62);
  assert.equal(hp['andre-the-giant'],72);
  assert.equal(hp['brock-lesnar'],70);
  assert.equal(hp['oba-femi'],68);
  assert.equal(hp['hulk-hogan'],69);
  assert.equal(hp['cm-punk'],64);
  assert.equal(hp['cody-rhodes'],64);
  assert.equal(hp['seth-rollins'],64);
  assert.equal(hp['rey-mysterio'],57);
  assert.equal(hp['iyo-sky'],57);
  assert.equal(Math.max(...Object.values(hp)),72);
  assert.equal(Object.values(hp).filter(value=>value===72).length,1);
});

test('v0.12.65 pack presentation stays face up, converts duplicates, shows true foil, and hand cards zoom',()=>{
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.match(app,/revealedPackCards = new Set\(lastPack\.map\(\(_, index\) => index\)\)/,'all five pack cards become face up when wrapper opens');
  assert.match(app,/up-card-replacement/);
  assert.match(app,/duplicate-disintegrating/);
  assert.match(app,/finalizePackUniversePoints\(profile, \[pull\]\)/,'UP is credited at the conversion moment');
  assert.match(css,/@keyframes duplicateCardPixels/);
  assert.match(css,/\.ccg-card\.is-foil \.ccg-foil-overlay/,'Foil overlay must sit on the actual card surface');
  assert.match(app,/const visualFoil = Boolean\(foil \|\| card\.foil \|\| card\.kind === "entrance"\)/,'finished fronts, saved-deck Foils and Superstar pulls may render foil');
  assert.match(app,/data-open-hand-card/);
  assert.match(app,/renderHandOverlay\(\)/);
  assert.match(css,/@keyframes handInspectZoom/);
});

test('v0.12.65 preserves missing-front rules fallback and live Momentum front exception',()=>{
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  assert.match(app,/classList\.add\('uses-rules-fallback','is-flipped'\)/,'failed custom art reveals canonical rules face');
  assert.match(app,/card\.kind === "momentum"[\s\S]*return momentumMockupMarkup\(card\)/,'Momentum keeps authored live UI fronts');
});
