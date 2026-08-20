import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.89 live-event prematch places the rule panel below Start Match at full button width',()=>{
  assert.match(app, /<button id="begin-entrances" class="start-match prematch-start">Start Match<\/button>\n\s*\$\{eventMeta \? `<div class="prematch-live-event-rule prematch-live-event-rule-below">/);
  assert.match(css, /\.prematch-live-event-rule\{position:relative;z-index:7;display:grid;justify-items:center;gap:2px;margin:5px auto 1px;width:min\(520px,92vw\);/);
  assert.match(css, /\.prematch-live-event-rule-below\{margin:0 auto 2px!important\}/);
});
