import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { COLLECTION_MILESTONES, FOIL_MILESTONES } from '../js/data/set-progression.js?v=0.13.72';
import { activeLiveEventTowers } from '../js/data/live-events.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function slice(start, end) {
  const a = app.indexOf(start), b = app.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `missing slice ${start} -> ${end}`);
  return app.slice(a,b);
}

test('v0.13.54 pack summary is streamlined to five smaller pulls plus one themed NEXT action', () => {
  const boosters = slice('function renderBoosters()', 'function formatCountdown');
  const summary = boosters.slice(boosters.indexOf('packStage === "summary"'), boosters.indexOf('packStage === "upgrades"'));
  assert.match(summary, /pack-summary-next/);
  assert.match(summary, />NEXT<\/button>/);
  assert.doesNotMatch(summary, /Review Upgrades|Return to Open Packs|Excess Copies|Review Roster/);
  assert.match(css, /streamlined-pack-summary \.pack-summary-card\.actual-card-summary\{[\s\S]*36vw/);
  assert.match(css, /\.pack-theme-next/);
});

test('v0.13.54 post-pack assistance skips empty reviews and shows exact incoming/outgoing card swaps', () => {
  const review = slice('function beginPackUpgradeReview()', 'function nextBoosterCard()');
  assert.match(review, /if \(!pendingUpgrades\.length\) \{[\s\S]*finishPackFlow\(\)/);
  const boosters = slice('function renderBoosters()', 'function formatCountdown');
  assert.match(boosters, /<small>NEW CARD<\/small>/);
  assert.match(boosters, /<small>REPLACES<\/small>/);
  assert.match(boosters, /upgrade-card-pair/);
  assert.doesNotMatch(boosters.slice(boosters.indexOf('packStage === "upgrades"')), /pack-summary-pyramid/);
});

test('v0.13.54 pack-pulled Superstar celebration is tied to the focused reveal and does not chain later pulls early', () => {
  assert.match(app, /function maybeCelebrateFocusedSuperstarPull/);
  assert.match(app, /pull\?\.superstarUnlocked/);
  assert.match(app, /beginUnlockCelebration\("boosters"\)/);
  assert.match(app, /!\(unlockCelebrationReturnScreen === "boosters" && packStage === "reveal"\)/);
  assert.doesNotMatch(app, /function revealPackCard\(/);
});

test('v0.13.54 Deck Lab exposes one AUTO BUILD authored-blueprint action above Save Deck', () => {
  const deck = slice('function renderDeckBuilder()', 'function cardMeta');
  assert.match(deck, /id="auto-build-deck"[^>]*>AUTO BUILD<\/button>/);
  assert.match(deck, /buildBestOwnedRecommendedDraft/);
  assert.match(deck, /recommendedEntranceId/);
  assert.doesNotMatch(deck, />Optimize Owned<|>Build Toward Recommended</);
  assert.match(css, /deck-builder-actions\.deck-builder-actions-simplified/);
});

test('v0.13.54 all standard Live Event towers are 24-hour daily rotations with a one-day name cooldown', () => {
  const now = new Date('2026-08-18T10:00:00');
  const today = activeLiveEventTowers(now).filter(t=>t.cadence !== 'birthday');
  const tomorrow = activeLiveEventTowers(new Date('2026-08-19T10:00:00')).filter(t=>t.cadence !== 'birthday');
  assert.equal(today.length,3);
  assert.ok(today.every(t=>t.cadence === 'daily'));
  assert.equal(new Set(today.map(t=>t.nextAt.getTime())).size,1);
  const tomorrowNames = new Set(tomorrow.map(t=>t.event.name));
  for (const tower of today) assert.equal(tomorrowNames.has(tower.event.name), false);
  const hub = slice('function renderLiveEventHub()', 'function renderLiveEventTowerDetail');
  assert.match(hub, /Live Events reset daily at local midnight/);
  assert.doesNotMatch(hub, /data-live-tower-expiry|live-tower-timer/);
});

test('v0.13.54 Season free booster is rounded and displays hours/minutes only', () => {
  const season = slice('function renderSeasons()', 'function renderChallenges()');
  assert.match(season, /formatDailyHoursMinutes\(free\.msRemaining\)/);
  assert.match(app, /return `\$\{String\(hours\).*h \$\{String\(minutes\).*m`/s);
  assert.match(css, /season-free-pack-cta\.season-free-pack-strip\{[\s\S]*border-radius:14px!important;[\s\S]*clip-path:none!important/);
  assert.match(css, /season-free-pack-button::before,[\s\S]*display:none!important/);
});

test('v0.13.54 Season iPhone text grows inside the existing stat and reward-row geometry', () => {
  assert.match(css, /body\[data-screen="seasons"\] \.season-road-command small\{[\s\S]*font-size:\.40rem!important/);
  assert.match(css, /body\[data-screen="seasons"\] \.season-road-reward strong\{[\s\S]*font-size:\.68rem!important/);
  assert.match(css, /body\[data-screen="seasons"\] \.season-road-reward em\{[\s\S]*font-size:\.42rem!important/);
});

test('v0.13.54 Set Milestones use matching 25/50/75/100 Collection and Foil tracks with all eight rows visible', () => {
  assert.deepEqual(COLLECTION_MILESTONES.map(m=>m.percent), [25,50,75,100]);
  assert.deepEqual(FOIL_MILESTONES.map(m=>m.percent), [25,50,75,100]);
  const challenges = slice('function renderChallenges()', 'function beginLiveEventTower()');
  assert.match(challenges, /COLLECTION_MILESTONES\.map/);
  assert.match(challenges, /FOIL_MILESTONES\.map/);
  assert.match(challenges, /milestone-progress-track/);
  assert.match(challenges, /CLAIMED/);
  assert.match(challenges, /LOCKED/);
});

test('v0.13.54 Challenges bottom-nav attention includes claimable Set Milestones', () => {
  const attention = slice('function attentionState()', 'function attentionBadge');
  assert.match(attention, /availableMilestoneRewards/);
  assert.match(attention, /rewards\.collection\.length \+ rewards\.foil\.length/);
  assert.match(app, /function syncMobileAttentionBadges/);
  assert.match(app, /syncMobileAttentionBadges\(\);/);
});

test('v0.13.54 Store removes redundant Featured Set banner and presents Superstars as full-width booster-style offers', () => {
  const store = slice('function renderStore()', 'function renderSeasons()');
  assert.doesNotMatch(store, /store-set-banner|Rotates daily/);
  assert.match(store, /store-superstar-product-list/);
  assert.match(store, /store-booster-offer store-superstar-offer/);
  assert.match(store, /UNLOCK SUPERSTAR/);
  assert.match(css, /store-superstar-product-list\{[\s\S]*grid-template-columns:1fr!important/);
});

test('v0.13.54 Collection and Catalogue stand alone without reciprocal in-page view tabs', () => {
  const collection = slice('function renderCollection()', 'function renderCardCatalogue');
  const catalogue = slice('function renderCardCatalogue', 'function deckRole');
  assert.doesNotMatch(collection, /collection-owned-view|collection-catalogue-view|Card Catalogue<\/button>/);
  assert.doesNotMatch(catalogue, /catalogue-my-collection|MY COLLECTION<\/button>/);
  assert.match(collection, /collection-quickbar-standalone/);
  assert.match(catalogue, /catalogue-quickbar-standalone/);
});

test('v0.13.54 My Collection secondary copy receives an iPhone readability pass without changing the two-column card grid', () => {
  assert.match(css, /collection-quick-stats small,[\s\S]*font-size:\.43rem!important/);
  assert.match(css, /collection-toolbar-head \.collection-count\{font-size:\.70rem!important/);
  assert.match(css, /collection-filter-drawer summary>small\{font-size:\.52rem!important/);
  assert.match(css, /collection-set-rail \.nav-button\{font-size:\.62rem!important/);
  assert.match(css, /collectible-catalogue/);
});
