import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function passSlice() {
  const start = css.indexOf('/* v0.13.52 — iPhone Booster Vault vertical-fill pass.');
  assert.ok(start >= 0);
  return css.slice(start);
}

test('v0.13.52 Open Packs fills the visible iPhone content viewport', () => {
  const slice = passSlice();
  assert.match(slice, /\.booster-compact-screen\{[\s\S]*height:calc\(100svh - var\(--legacy-chrome-h\) - env\(safe-area-inset-top\) - env\(safe-area-inset-bottom\) - 98px\)!important;[\s\S]*grid-template-rows:auto minmax\(0,1fr\) auto!important;[\s\S]*overflow:hidden!important;/);
  assert.match(slice, /\.booster-vault-shelf\{[\s\S]*grid-row:2!important;[\s\S]*height:100%!important;[\s\S]*overflow-y:hidden!important;/);
});

test('v0.13.52 iPhone Booster Vault enlarges the physical pack with height-aware scaling', () => {
  const slice = passSlice();
  assert.match(slice, /\.vault-product-pack\{[\s\S]*width:clamp\(132px,20svh,188px\)!important;/);
  assert.match(slice, /\.booster-vault-shelf\.single-pack \.vault-pack-product\{[\s\S]*flex-basis:min\(76vw,280px\)!important;[\s\S]*width:min\(76vw,280px\)!important;/);
  assert.match(slice, /@media\(max-width:390px\) and \(orientation:portrait\)[\s\S]*width:clamp\(124px,19svh,172px\)!important;/);
});

test('v0.13.52 orange and white pack counters are the bottom-most Open Packs content row', () => {
  const slice = passSlice();
  assert.match(slice, /\.booster-vault-lower\{[\s\S]*grid-row:3!important;[\s\S]*align-self:end!important;[\s\S]*flex-direction:column!important;/);
  assert.match(slice, /\.booster-assistance\{[\s\S]*order:1!important;/);
  assert.match(slice, /\.booster-vault-stats\{[\s\S]*order:2!important;[\s\S]*margin:0!important;/);
});
