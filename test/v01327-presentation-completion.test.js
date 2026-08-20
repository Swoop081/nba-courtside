import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.27 uses Championship Road visual weight as the global primary CTA language', () => {
  assert.match(css, /v0\.13\.27 — iPhone presentation completion \+ global primary CTA language/);
  assert.match(css, /\.start-match,\.primary\{[\s\S]*min-height:52px/);
  assert.match(css, /border-radius:16px!important/);
  assert.match(css, /font-weight:1000!important/);
  assert.match(css, /text-transform:uppercase!important/);
  assert.match(css, /box-shadow:0 10px 24px/);
});

test('v0.13.27 Season 1 presentation is brighter and reward CTAs are materially larger', () => {
  assert.match(css, /body\[data-screen="seasons"\]\{[\s\S]*--mode-accent:#a94cff/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*min-height:54px!important/);
  assert.match(css, /\.season-claim-all\{[\s\S]*min-height:48px!important/);
  assert.match(css, /\.season-road-reward button\{[\s\S]*min-height:44px!important/);
  assert.match(css, /\.season-reward-road\{[\s\S]*rgba\(22,10,49,.38\)/);
});

test('v0.13.27 Final Boss milestones carry reward-type classes for distinct colour treatment', () => {
  assert.match(app, /finalBossRewardClass = isFinalBossCard/);
  assert.match(app, /data-final-boss-reward=/);
  for (const type of ['exclusive-move','support','signature','finisher','action','entrance','superstar']) {
    assert.match(css, new RegExp(`final-boss-${type}`));
  }
});

test('v0.13.27 keeps the full approved iPhone table integrated', () => {
  // Money in the Bank belongs to Live Events, not Challenges.
  const challenges = app.slice(app.indexOf('function renderChallenges()'), app.indexOf('function beginLiveEventTower()'));
  const liveEvents = app.slice(app.indexOf('function renderLiveEventHub()'), app.indexOf('function renderLiveEvents()'));
  assert.doesNotMatch(challenges, /Money in the Bank|Climb the Ladder/i);
  assert.match(liveEvents, /Money in the Bank/i);

  // Contracting KOTR bracket and 24-match Championship Road remain present.
  assert.match(app, /quarterfinal-view/);
  assert.match(app, /semifinal-view/);
  assert.match(app, /final-view/);
  assert.match(app, /FIGHT MATCH \$\{run\.stage\+1\}/);

  // Compact content-first destinations remain wired.
  for (const marker of [
    'booster-compact-screen', 'store-superstar-product-list', 'collection-quickbar',
    'catalogue-quickbar', 'profile-command-band-top', 'exhibition-selector-panel',
    'challenge-overview-strip'
  ]) assert.match(app, new RegExp(marker));
});
