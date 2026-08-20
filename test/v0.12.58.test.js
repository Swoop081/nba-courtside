import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const app = await readFile(new URL('js/ui/app.js', root), 'utf8');
const css = await readFile(new URL('css/game.css', root), 'utf8');

test('v0.12.58 replaces the rejected Final Boss splash layout with a balanced grid', () => {
  assert.match(css, /v0\.12\.58 — Mobile Readability \+ Card Presentation Pass/);
  assert.match(css, /\.season-one-ad\{\s*grid-template-columns:39% 61%/);
  assert.match(css, /\.season-one-ad \.season-ad-copy\{[\s\S]*left:auto!important;[\s\S]*width:auto!important/);
  assert.match(app, /THE FINAL<br>BOSS<br>AWAITS\./);
});

test('v0.12.58 lowers and rights the Season Final Boss render away from the timer', () => {
  assert.match(css, /\.season-final-boss-hero \.final-boss-feature-art\{[\s\S]*right:-10%!important;[\s\S]*top:18%!important/);
});

test('v0.12.58 reserves Collection hero space so tabs and stats do not overlap copy', () => {
  assert.match(css, /\.collection-compact-hero \.feature-copy\{[\s\S]*padding-bottom:72px!important/);
  assert.match(css, /\.collection-hero-stats\{[\s\S]*bottom:9px!important/);
});

test('v0.12.58 Exhibition selector contains the full Superstar card instead of cropping it', () => {
  assert.match(css, /body\[data-screen="setup"\][\s\S]*object-fit:contain!important/);
  assert.match(app, /selection-owned-card/);
});

test('v0.12.58 Main Event matchup fills the viewport and starts at the top', () => {
  assert.match(css, /body\[data-screen="matchup"\] main\{[\s\S]*padding:0!important/);
  assert.match(css, /\.matchup-splash\{[\s\S]*justify-content:flex-start!important/);
});

test('v0.12.58 Match Rewards uses a readable Series 1 pack wrapper', () => {
  assert.match(app, /series:"SERIES 1",subtitle:"VICTORY BOOSTER",extraClass:"results-booster"/);
  assert.match(css, /\.results-booster\{[\s\S]*width:102px!important/);
});

test('v0.12.58 unfinished cards default to their rules face', () => {
  assert.match(app, /const missingCustomFront = !superstarFront && card\.kind !== "momentum" && !finishedFront/);
  assert.match(app, /const displayFlipped = missingCustomFront \? true : Boolean\(flipped\)/);
  assert.match(app, /uses-rules-fallback/);
});

test('v0.12.58 Deck Lab categories are horizontal card carousels', () => {
  assert.match(app, /deck-category-card-row/);
  assert.match(app, /categoryForCard\(card\) === category\.id/);
  assert.match(css, /\.deck-category-card-row\{[\s\S]*overflow-x:auto!important/);
});

test('v0.12.58 enlarges match mode copy across Choose Your Path', () => {
  assert.match(css, /\.legacy-mode-copy>em\{font-size:\.54rem!important/);
  assert.match(css, /\.legacy-mode-copy \.mode-logo strong\{font-size:2\.32rem!important/);
  assert.match(css, /\.legacy-mode-copy>b\{font-size:\.57rem!important/);
});

test('v0.12.58 removes visible ownership percentages from Challenges set tiles', () => {
  assert.doesNotMatch(app, /challenge-progress-ring"><b>\$\{pct\}%<\/b>/);
  assert.match(css, /\.challenge-progress-ring\{display:none!important\}/);
});

test('v0.12.58 physical pack fronts do not repeat the set name when a logo exists', () => {
  assert.match(app, /const hasSetLogo = Boolean\(SET_LOGO_ASSETS\[setId\]\)/);
  assert.match(app, /\$\{hasSetLogo \? "" : `<span class="pack-set-name">/);
});
