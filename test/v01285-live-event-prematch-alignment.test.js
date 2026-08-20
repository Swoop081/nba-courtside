import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.96 Live Event prematch keeps the neutral branded eyebrow and below-button rules panel',()=>{
  assert.match(app, /const prematchEyebrow = eventMeta \? \(\(eventMeta\.logoMode && eventMeta\.logoMode !== "legacy"\) \? "LIVE EVENT" : eventMeta\.eventName\.toUpperCase\(\)\) : "TONIGHT’S";/);
  assert.match(app, /logoMode: tower\.event\.logoMode/);
  assert.match(css, /\.prematch-screen \.prematch-heading\.has-live-event-meta\{top:auto!important;display:grid!important;justify-items:center!important;gap:6px!important;margin:8px 0 2px!important\}/);
  assert.match(css, /\.prematch-screen \.prematch-live-event-rule\{margin:0 auto 2px!important\}/);
});
