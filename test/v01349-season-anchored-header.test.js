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

test('v0.13.49 Season keeps the complete hero, command tiles and free booster in one permanent anchor shell', () => {
  const season = seasonSlice();
  assert.match(season, /<section class="season-anchor-shell">[\s\S]*season-road-hero[\s\S]*season-road-command[\s\S]*season-free-pack-cta/);
  assert.doesNotMatch(season, /season-sticky-shell/);
  assert.doesNotMatch(season, /season-compact-meta/);
  assert.doesNotMatch(season, /classList\.toggle\('is-compact'/);
});

test('v0.13.49 Season locks document scrolling and gives vertical scrolling only to the reward-road viewport', () => {
  assert.match(css, /body\[data-screen="seasons"\]\{[\s\S]*overflow:hidden!important;[\s\S]*overscroll-behavior:none!important/);
  assert.match(css, /body\[data-screen="seasons"\] main\{[\s\S]*height:100dvh!important;[\s\S]*overflow:hidden!important/);
  assert.match(css, /body\[data-screen="seasons"\] \.seasons-screen\.season-road-redesign\{[\s\S]*grid-template-rows:auto minmax\(0,1fr\)!important;[\s\S]*overflow:hidden!important/);
  assert.match(css, /body\[data-screen="seasons"\] \.season-road-scroll\{[\s\S]*overflow-y:auto!important;[\s\S]*overflow-x:hidden!important/);
});

test('v0.13.49 current tier auto-focus scrolls the internal road instead of moving the page/header', () => {
  const season = seasonSlice();
  assert.match(season, /root\.querySelector\('\[data-season-road-scroll\]'\)/);
  assert.match(season, /scroller\.scrollTo\(\{top:Math\.max\(0,targetTop-focusOffset\),left:0,behavior:'auto'\}\)/);
  assert.doesNotMatch(season, /window\.scrollTo/);
});
