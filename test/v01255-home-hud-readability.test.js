import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.55 enlarges Home PACKS/UP and hero stat labels by roughly four times', () => {
  assert.match(css, /v0\.12\.55 — Home HUD readability pass/);
  assert.match(css, /\.gamebar-resources small\{[\s\S]*font-size:1\.28rem!important/);
  assert.match(css, /\.legacy-stage-stats small\{[\s\S]*font-size:1\.24rem!important/);
  assert.match(css, /\.legacy-stage-stats\{[\s\S]*height:62px!important/);
  assert.match(css, /\.legacy-stage-stats span\{[\s\S]*grid-template-columns:1fr!important/);
});
