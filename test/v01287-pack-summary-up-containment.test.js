import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');

test('v0.12.87 converted UP pulls stay bounded to the same pack-summary card slot on mobile',()=>{
  assert.match(app,/is-up-converted/);
  assert.match(css,/\.pack-summary-card\.actual-card-summary\.is-up-converted \.pack-summary-actual-card\{[\s\S]*?width:100%!important;[\s\S]*?aspect-ratio:\.68!important;[\s\S]*?overflow:hidden!important/);
  assert.match(css,/\.summary-up-reward\{[\s\S]*?width:100%!important;[\s\S]*?min-width:0!important;[\s\S]*?height:auto!important;[\s\S]*?aspect-ratio:\.68!important/);
  assert.match(css,/@media\(max-width:430px\)\{[\s\S]*?\.pack-summary-grid\.pack-summary-pyramid\{[\s\S]*?width:calc\(100vw - 28px\)!important;[\s\S]*?grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)!important/);
});
