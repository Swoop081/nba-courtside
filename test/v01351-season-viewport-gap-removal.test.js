import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.51 Season fixed viewport outranks legacy global important chrome padding', () => {
  const start = css.indexOf('/* v0.13.51 — Season viewport gap-removal hotfix.');
  assert.ok(start >= 0);
  const slice = css.slice(start);
  assert.match(slice, /:is\(#season-fixed-viewport-geometry, body\[data-screen="seasons"\]\) main\{[\s\S]*padding-top:0!important;[\s\S]*padding-bottom:0!important;/);
});

test('v0.13.51 Season game root adds no second top or bottom spacing', () => {
  const start = css.indexOf('/* v0.13.51 — Season viewport gap-removal hotfix.');
  const slice = css.slice(start);
  assert.match(slice, /:is\(#season-fixed-viewport-geometry, body\[data-screen="seasons"\]\) #game\{[\s\S]*margin:0!important;[\s\S]*padding:0!important;[\s\S]*gap:0!important;/);
  assert.match(slice, /\.seasons-screen\.season-road-redesign\{[\s\S]*margin:0!important;[\s\S]*padding:0!important;[\s\S]*gap:0!important;/);
});

test('v0.13.51 internal road keeps zero top spacer while retaining independent scroll geometry', () => {
  const start = css.indexOf('/* v0.13.51 — Season viewport gap-removal hotfix.');
  const slice = css.slice(start);
  assert.match(slice, /\.season-road-viewport,[\s\S]*\.season-road-scroll\{[\s\S]*min-height:0!important;[\s\S]*margin:0!important;[\s\S]*padding-top:0!important;/);
  assert.match(css, /body\[data-screen="seasons"\] \.season-road-scroll\{[\s\S]*overflow-y:auto!important/);
});
