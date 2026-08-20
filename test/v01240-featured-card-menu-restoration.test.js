import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.40 collectible-menu restoration is intentionally superseded by v0.12.47 menu photography', () => {
  assert.match(ui, /const menuSuperstarPhotoMarkup =/);
  assert.match(ui, /const portraitMarkup = menuSuperstarPhotoMarkup/);
  assert.match(ui, /legacy-command-photo/);
  assert.doesNotMatch(ui, /superstarPreviewCardMarkup\("stone-cold-steve-austin","home-tile-card"\)/);
  assert.doesNotMatch(ui, /superstarPreviewCardMarkup\(starter\.id,"home-tile-card"\)/);
  assert.match(css, /\.official-menu-superstar-photo/);
  assert.match(css, /\.legacy-stage-card,.legacy-season-card,.legacy-mode-banner>\.mode-full-card-art,.profile-starter-card\{display:none!important\}/);
});

test('v0.12.40 mode-card restoration is intentionally superseded by full Superstar photography on Play banners', () => {
  assert.doesNotMatch(ui, /const modeCard = starId/);
  assert.doesNotMatch(ui, /mode-full-card-art/);
  assert.match(ui, /portraitMarkup\("cody-rhodes","Cody Rhodes"\)/);
  assert.match(ui, /portraitMarkup\("gunther","Gunther"\)/);
  assert.match(ui, /portraitMarkup\("roman-reigns","Roman Reigns"\)/);
  assert.match(css, /\.legacy-mode-superstar img\.official-menu-superstar-photo/);
});
