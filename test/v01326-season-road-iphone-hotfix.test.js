import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');

test('v0.13.26 Season focus stays vertical-only after the v0.13.49 internal-scroll supersession',()=>{
  assert.doesNotMatch(app,/season-tier-\$\{currentTier\}`\)\?\.scrollIntoView/);
  assert.match(app,/data-season-road-scroll/);
  assert.match(app,/scroller\.scrollTo\(\{top:Math\.max\(0,targetTop-focusOffset\),left:0,behavior:'auto'\}\)/);
  const start=app.indexOf('function renderSeasons()'),end=app.indexOf('function renderChallenges',start);
  const season=app.slice(start,end);
  assert.doesNotMatch(season,/window\.scrollTo/);
});

test('v0.13.26 Season Road is horizontally contained on iPhone',()=>{
  assert.match(css,/v0\.13\.26 — Season Road iPhone geometry hotfix/);
  assert.match(css,/body\[data-screen="seasons"\][\s\S]*overflow-x:hidden!important/);
  assert.match(css,/body\[data-screen="seasons"\] \.season-road-redesign\{[\s\S]*width:100%!important/);
});

test('v0.13.26 iPhone reward road becomes a compact full-width timeline',()=>{
  assert.match(css,/body\[data-screen="seasons"\] \.season-road-spine\{left:25px!important/);
  assert.match(css,/\.season-road-node\.road-right\{[\s\S]*width:100%!important/);
  assert.match(css,/\.season-road-connector\{display:none!important\}/);
  assert.match(css,/min-height:54px!important/);
});

test('v0.13.26 iPhone Season hero and command band are compact enough to keep progression visible',()=>{
  assert.match(css,/\.season-road-hero\{min-height:148px!important/);
  assert.match(css,/\.season-road-command\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);
  assert.match(css,/\.season-free-pack-button\{min-height:42px!important/);
});
