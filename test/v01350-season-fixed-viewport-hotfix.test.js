import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function seasonSlice() {
  const start = app.indexOf('function renderSeasons()');
  const end = app.indexOf('function renderChallenges', start);
  assert.ok(start >= 0 && end > start);
  return app.slice(start, end);
}

test('v0.13.50 Season main surface is fixed to the viewport between top chrome and bottom nav', () => {
  assert.match(css, /\/\* v0\.13\.50[\s\S]*body\[data-screen="seasons"\] main\{[\s\S]*position:fixed!important;[\s\S]*top:calc\(var\(--legacy-chrome-h\) \+ env\(safe-area-inset-top\)\)!important;[\s\S]*bottom:calc\(86px \+ env\(safe-area-inset-bottom\)\)!important;[\s\S]*padding:0!important;[\s\S]*overflow:hidden!important/);
  assert.match(css, /@media\(max-width:600px\)\{[\s\S]*body\[data-screen="seasons"\] main\{[\s\S]*bottom:calc\(82px \+ env\(safe-area-inset-bottom\)\)!important/);
});

test('v0.13.50 frozen Season chrome is outside the only vertical scroller', () => {
  const season = seasonSlice();
  const anchor = season.indexOf('<section class="season-anchor-shell">');
  const scroller = season.indexOf('<div class="season-road-scroll" data-season-road-scroll>');
  assert.ok(anchor >= 0 && scroller > anchor);
  const frozen = season.slice(anchor, scroller);
  assert.match(frozen, /season-road-hero/);
  assert.match(frozen, /season-road-command/);
  assert.match(frozen, /season-free-pack-cta season-free-pack-strip/);
  assert.doesNotMatch(frozen, /100-TIER REWARD ROAD/);
  assert.match(season.slice(scroller), /100-TIER REWARD ROAD[\s\S]*season-reward-road/);
});

test('v0.13.50 entering/rerendering Season clears stale Safari document scroll offsets', () => {
  const season = seasonSlice();
  assert.match(season, /document\.documentElement\.scrollTop = 0;/);
  assert.match(season, /document\.body\.scrollTop = 0;/);
  assert.match(season, /document\.scrollingElement\) document\.scrollingElement\.scrollTop = 0;/);
});

test('v0.13.50 current-tier focus remains confined to the internal road scroller', () => {
  const season = seasonSlice();
  assert.match(season, /const scroller=root\.querySelector\('\[data-season-road-scroll\]'\)/);
  assert.match(season, /scroller\.scrollTo\(\{top:Math\.max\(0,targetTop-focusOffset\),left:0,behavior:'auto'\}\)/);
  assert.doesNotMatch(season, /scrollIntoView/);
});
