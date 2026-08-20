import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.90 live event screen is viewport-contained on iPhone widths',()=>{
  assert.match(css, /\.live-event-screen-premium,\.live-event-screen-premium \*\{box-sizing:border-box;min-width:0\}/);
  assert.match(css, /\.live-event-screen-premium\{width:100%;max-width:100%;overflow-x:clip;padding-inline:2px\}/);
  assert.match(css, /\.live-event-route-strip-cards,\.live-event-picker-strip\{width:100%;max-width:100%;overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain\}/);
  assert.match(css, /\.live-event-route-strip-cards\{grid-auto-columns:min\(72vw,240px\)\}/);
});
