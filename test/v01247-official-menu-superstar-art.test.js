import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui/app.js'), 'utf8');
const artwork = fs.readFileSync(path.join(root, 'js/data/artwork.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/game.css'), 'utf8');
const sources = fs.readFileSync(path.join(root, 'assets/art/wwe-menu-superstars/SOURCES.md'), 'utf8');

const officialIds = [
  'cm-punk','roman-reigns','cody-rhodes','seth-rollins',
  'stone-cold-steve-austin','the-undertaker','hulk-hogan','ultimate-warrior',
  'liv-morgan','rhea-ripley','paige','becky-lynch'
];

const retiredDedicatedIds = ['gunther','kevin-owens','brock-lesnar','oba-femi','iyo-sky','the-rock'];

function functionSlice(name, nextName) {
  const start = ui.indexOf(`function ${name}`);
  const end = ui.indexOf(`function ${nextName}`, start + 1);
  return ui.slice(start, end);
}

test('v0.12.48 keeps the exact 12-render WWE menu cast separate from collectible-card artwork', () => {
  assert.match(artwork, /const WWE_MENU_SUPERSTAR_ROOT = "assets\/art\/wwe-menu-superstars"/);
  assert.match(artwork, /const rawMenuSuperstarArtwork = \{/);
  assert.match(artwork, /export function menuSuperstarPhotoFor\(superstarId\)/);
  for (const id of officialIds) {
    assert.ok(artwork.includes(`"${id}"`) && artwork.includes(`/${id}.webp`), `${id} should be mapped to the dedicated menu-art root`);
    assert.ok(fs.existsSync(path.join(root, `assets/art/wwe-menu-superstars/${id}.webp`)), `${id} menu WebP should exist`);
  }
  assert.match(sources, /https:\/\/www\.wwe\.com\/superstars\//);
});

test('v0.12.48 menu renderer prefers the dedicated photo layer with local fallback', () => {
  assert.match(ui, /menuSuperstarPhotoFor/);
  assert.match(ui, /const menuSuperstarPhotoMarkup =/);
  assert.match(ui, /class="\$\{cls\} superstar-render-visual official-menu-superstar-photo"/);
  assert.match(ui, /data-menu-superstar-photo="\$\{id\}"/);
  assert.match(css, /\.official-menu-superstar-photo\{[\s\S]*object-fit:contain!important/);
});

test('v0.12.48 Home and Play use wrestler photography without decorative collectible-card overlays', () => {
  const home = functionSlice('renderMainMenu', 'renderPlayMenu');
  const play = functionSlice('renderPlayMenu', 'renderProfile');
  assert.match(home, /legacy-stage-superstar/);
  assert.match(home, /legacy-command-photo/);
  assert.doesNotMatch(home, /legacy-stage-card/);
  assert.doesNotMatch(home, /home-tile-card/);
  assert.ok((play.match(/class="legacy-mode-banner/g) ?? []).length >= 3);
  assert.match(play, /legacy-mode-superstar/);
  assert.doesNotMatch(play, /mode-full-card-art/);
  assert.doesNotMatch(play, /mode-feature-card/);
});

test('v0.12.48 preserves collectible cards where the UI is representing an actual card or product', () => {
  const store = functionSlice('renderStore', 'renderSeasons');
  assert.match(store, /superstarPreviewCardMarkup\(star\.id,"store-shelf-collectible"\)/);
  assert.match(ui, /collectibleCardMarkup/);
  assert.match(ui, /selectionCarouselMarkup\(unlocked,deckBuilderStarId,'deck-lab-select'\)/);
  assert.match(ui, /selection-owned-superstar-card/);
});


test('v0.12.48 dedicated menu-art folder contains only the requested 12 Superstar renders', () => {
  const menuBlock = artwork.slice(artwork.indexOf('const rawMenuSuperstarArtwork = {'), artwork.indexOf('};', artwork.indexOf('const rawMenuSuperstarArtwork = {')) + 2);
  const files = fs.readdirSync(path.join(root, 'assets/art/wwe-menu-superstars')).filter(name => name.endsWith('.webp')).map(name => name.replace(/\.webp$/, '')).sort();
  assert.deepEqual(files, [...officialIds].sort());
  for (const id of retiredDedicatedIds) {
    assert.equal(menuBlock.includes(`/${id}.webp`), false, `${id} should not be in rawMenuSuperstarArtwork`);
    assert.equal(fs.existsSync(path.join(root, `assets/art/wwe-menu-superstars/${id}.webp`)), false, `${id} should no longer be a dedicated menu render`);
  }
});
