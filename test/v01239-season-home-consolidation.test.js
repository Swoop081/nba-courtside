import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.39 Home uses one Season destination instead of duplicate countdown and Final Boss buttons', () => {
  assert.match(app, /id="menu-season-overview"/);
  assert.doesNotMatch(app, /id="menu-season-countdown"/);
  assert.doesNotMatch(app, /id="menu-season-campaign"/);
  assert.match(app, /\$\("#menu-season-overview"\)\?\.addEventListener\("click", showSeasons\)/);
});

test('v0.12.39 consolidated Season hero shows premium title, next-tier XP and Final Boss destination', () => {
  assert.match(app, /homeHubSplitTitle\("SEASON", "ONE"\)/);
  assert.doesNotMatch(app, /data-season-countdown/);
  assert.match(app, /XP TO NEXT TIER/);
  assert.match(app, /season-home-progress/);
  assert.match(app, /TIER 100 · THE FINAL BOSS/);
  assert.match(app, /seasonProgress\.intoTier} \/ \$\{seasonProgress\.needed} XP/);
});

test('v0.12.39 next-tier progress bar is bright green and compact on iPhone', () => {
  assert.match(css, /\.season-home-progress i\{[\s\S]*background:linear-gradient\(90deg,#20e874 0%,#51ff9d 52%,#b8ffcf 100%\)/);
  assert.match(css, /@media\(max-width:760px\)[\s\S]*\.season-home-overview\{min-height:154px/);
  assert.match(css, /\.season-home-rock\{/);
});
