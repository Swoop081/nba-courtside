import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.49 uses one reusable physical foil-wrapper pack component', () => {
  assert.match(ui, /function physicalBoosterPackMarkup/);
  assert.match(ui, /pack-crimp pack-crimp-top/);
  assert.match(ui, /pack-crimp pack-crimp-bottom/);
  assert.match(ui, /pack-side-seam pack-side-seam-left/);
  assert.match(ui, /pack-tear-notch/);
  assert.match(ui, /pack-foil-sheen/);
});

test('v0.12.49 Vault, Store, Season rewards and pack opening share the physical wrapper', () => {
  assert.match(ui, /physicalBoosterPackMarkup\(\{setId:bucket\.setId/);
  assert.match(ui, /physicalBoosterPackMarkup\(\{setId:rotation\.setId/);
  assert.match(ui, /physicalBoosterPackMarkup\(\{setId:reward\.setId/);
  assert.match(ui, /physicalBoosterPackMarkup\(\{setId:activeBoosterSetId/);
});

test('v0.12.49 wrapper styling has crimped seals, foil material, side seams and a tear notch', () => {
  assert.match(css, /\.physical-booster-pack\{[\s\S]*border-radius:7px!important[\s\S]*clip-path:polygon/);
  assert.match(css, /\.physical-booster-pack \.pack-crimp\{[\s\S]*repeating-linear-gradient/);
  assert.match(css, /\.physical-booster-pack \.pack-side-seam\{/);
  assert.match(css, /\.physical-booster-pack \.pack-tear-notch\{/);
  assert.match(css, /@keyframes physicalPackSheen/);
  assert.match(css, /@keyframes physicalTearTop/);
});

test('v0.12.49 pack sizes remain context-specific without reverting to card proportions', () => {
  assert.match(css, /\.vault-product-pack\{width:126px!important;aspect-ratio:\.59!important\}/);
  assert.match(css, /\.shop-pack\{width:112px!important;aspect-ratio:\.59!important\}/);
  assert.match(css, /\.sealed-pack-button \.sealed-pack\{width:min\(310px,66vw\)!important;aspect-ratio:\.59!important\}/);
});
