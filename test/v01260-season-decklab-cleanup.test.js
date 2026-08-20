import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.60 enlarges the launch Final Boss Rock render', () => {
  assert.match(css, /v0\.12\.60 — Season \+ Deck Lab Cleanup Pass/);
  assert.match(css, /\.season-one-ad \.season-ad-rock img\.final-boss-rock-menu-art\{[\s\S]*?width:178%!important;[\s\S]*?height:156%!important/);
});

test('v0.12.60 Deck Lab roster keeps card art and copy in separate columns', () => {
  assert.match(css, /\.deck-lab-star-card\{[\s\S]*?grid-template-columns:minmax\(136px,44%\) minmax\(0,1fr\)!important/);
  assert.match(css, /\.deck-lab-star-copy\{[\s\S]*?position:relative!important;[\s\S]*?inset:auto!important/);
});

test('v0.12.60 pulls Season Final Boss Rock left from the edge', () => {
  assert.match(css, /\.season-final-boss-hero \.final-boss-feature-art\{[\s\S]*?right:-2%!important;[\s\S]*?width:42%!important/);
});

test('v0.12.60 daily booster is a single purple stateful button', () => {
  assert.match(app, /<section class="season-free-pack-cta/);
  assert.doesNotMatch(app, /<div class="free-pack-icon"><span>24H<\/span><b>FREE<\/b><\/div>/);
  assert.match(app, /NEXT FREE BOOSTER IN \$\{formatDailyHoursMinutes\(free\.msRemaining\)\}/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*?background:linear-gradient\(135deg,#7636c8,#a647df\)!important/);
});

test('v0.12.60 compacts Season Command Center rows', () => {
  assert.match(css, /\.season-command-row\{[\s\S]*?min-height:54px!important/);
  assert.match(css, /\.season-command-row>div>b\{[\s\S]*?white-space:nowrap!important/);
});

test('v0.12.60 removes set-name text over Challenges logos', () => {
  assert.doesNotMatch(app, /challenge-set-copy"><strong>\$\{set\.name\}<\/strong>/);
  assert.match(app, /challenge-set-copy"><b>\$\{Math\.round/);
  assert.match(app, /challenge-mini-set-logo/);
});
