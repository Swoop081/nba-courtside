import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.9 daily booster CTA is one full-width single-line control',()=>{
  assert.match(app, /CLAIM FREE BOOSTER/);
  assert.match(app, /NEXT FREE BOOSTER IN \$\{formatDailyHoursMinutes\(free\.msRemaining\)\}/);
  assert.match(css, /\.season-free-pack-cta\.season-free-pack-strip\{[\s\S]*width:100%!important;[\s\S]*grid-template-columns:none!important;/);
  assert.match(css, /\.season-free-pack-cta\.season-free-pack-strip \.season-free-pack-button\{[\s\S]*width:100%!important;[\s\S]*min-width:0!important;/);
  assert.match(css, /\.season-free-pack-cta\.season-free-pack-strip \.season-free-pack-button>\[data-free-pack-action\]\{[\s\S]*white-space:nowrap!important;/);
});

test('v0.13.9 live-event selected Superstar and CTA cannot exceed the detail viewport',()=>{
  assert.match(css, /\.live-tower-player-copy \.start-match,[\s\S]*\.live-tower-command \.start-match\{[\s\S]*width:100%!important;[\s\S]*max-width:100%!important;[\s\S]*min-width:0!important;/);
  assert.match(css, /\.live-tower-detail-art\{right:0!important;max-width:42%;overflow:hidden\}/);
  assert.match(css, /@media\(max-width:600px\)\{[\s\S]*\.live-tower-player\{grid-template-columns:minmax\(112px,34%\) minmax\(0,1fr\)!important;/);
  assert.match(css, /\.live-tower-selected-card\{width:100%!important;max-width:140px!important\}/);
});
