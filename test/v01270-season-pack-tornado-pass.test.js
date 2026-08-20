import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const overrides = fs.readFileSync(new URL('../js/data/card-art-overrides.js', import.meta.url), 'utf8');
const manifestText = fs.readFileSync(new URL('../js/data/card-number-manifest.js', import.meta.url), 'utf8');

function between(source, start, end) {
  const a = source.indexOf(start);
  assert.notEqual(a, -1, `Missing start marker: ${start}`);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(b, -1, `Missing end marker: ${end}`);
  return source.slice(a, b);
}

test('v0.12.70 Daily Login Booster is one contained purple reward row', () => {
  const season = between(app, 'function renderSeasons()', 'function renderChallenges()');
  assert.match(season, /<button id="claim-free-pack" class="season-free-pack-button"/);
  assert.doesNotMatch(season, /season-free-pack-copy|data-free-pack-copy/);
  assert.match(season, /data-free-pack-action/);
  assert.match(season, /CLAIM FREE BOOSTER/);
  assert.match(season, /NEXT FREE BOOSTER IN \$\{formatDailyHoursMinutes\(free\.msRemaining\)\}/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*width:100%!important;[\s\S]*justify-content:center!important/);
  assert.match(season, /100-TIER REWARD ROAD/);
  assert.match(season, /data-season-end-countdown/);
});

test('v0.12.70 live pack reveal has no five-card thumbnail strip', () => {
  const boosters = between(app, 'function renderBoosters()', 'function formatCountdown');
  assert.doesNotMatch(boosters, /booster-faceup-strip|faceup-pack-thumb|data-faceup-pack-index/);
  assert.match(boosters, /booster-card-progress/);
  assert.match(boosters, /single-card-slot/);
  assert.match(boosters, /pack-summary-grid pack-summary-pyramid/);
  assert.doesNotMatch(css, /\.booster-faceup-strip\{|\.faceup-pack-thumb\{/);
});

test('v0.12.70 adds Tornado DDT as SS1-141 with supplied art and head damage', async () => {
  const { allGameplayCards } = await import('../js/data/content.js?v=0.13.72');
  const { CARD_NUMBER_BY_ID } = await import('../js/data/card-number-manifest.js?v=0.13.72');
  const { deckIds } = await import('../js/data/decks.js?v=0.13.72');
  const card = allGameplayCards.find(c => c.id === 'tornado-ddt');
  assert.ok(card);
  assert.equal(card.name, 'Tornado DDT');
  assert.equal(card.setId, 'summerslam-series-1');
  assert.equal(card.cost, 5);
  assert.equal(card.damage, 8);
  assert.deepEqual(card.requirements, { agility: 2 });
  assert.equal(card.method, 'agility');
  assert.equal(card.moveType, 'grapple');
  assert.equal(card.counterState, 'front-control');
  assert.equal(card.groundOpponent, true);
  assert.deepEqual(card.bodyDamage, { bodyPart: 'head', pressure: 1 });
  assert.equal(card.rarity, 2);
  assert.deepEqual(CARD_NUMBER_BY_ID['tornado-ddt'], {
    id: 'tornado-ddt', setId: 'summerslam-series-1', cardNumber: 141, cardCode: 'SS1-141'
  });
  for (const star of ['cody-rhodes','seth-rollins','cm-punk']) {
    assert.ok(deckIds[star].includes('tornado-ddt'), `${star} should use Tornado DDT`);
    assert.equal(deckIds[star].length, 60, `${star} deck remains 60 pages`);
  }
  assert.match(overrides, /"tornado-ddt": "assets\/art\/summerslam-series-1\/moves\/tornado-ddt\.jpeg"/);
  assert.match(app, /const authoredRawArt = Boolean\(artworkFor\(card\)\)/);
  assert.ok(fs.existsSync(new URL('../assets/art/summerslam-series-1/moves/tornado-ddt.jpeg', import.meta.url)));
  assert.match(manifestText, /"cardCode": "SS1-141"/);
});
