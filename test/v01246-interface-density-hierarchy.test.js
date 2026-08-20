import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function functionSlice(name, nextName) {
  const start = ui.indexOf(`function ${name}`);
  const end = ui.indexOf(`function ${nextName}`, start + 1);
  return ui.slice(start, end);
}

test('v0.12.46 Play fills the available viewport; v0.12.47 uses contained Superstar photography instead of clipped card overlays', () => {
  assert.match(css, /\.legacy-play-v3\{[\s\S]*min-height:calc\(100dvh/);
  assert.match(css, /\.legacy-mode-superstar\{[\s\S]*overflow:visible!important/);
  assert.match(css, /\.legacy-mode-superstar img\.official-menu-superstar-photo\{[\s\S]*object-fit:contain!important/);
  assert.doesNotMatch(ui.slice(ui.indexOf('function renderPlayMenu'), ui.indexOf('function renderProfile')), /mode-full-card-art/);
});

test('v0.12.46 Deck Lab skips the redundant chooser when only one Superstar is unlocked', () => {
  const show = functionSlice('showDeckBuilder', 'cardById');
  assert.match(show, /else if \(unlocked\.length === 1\)/);
  assert.match(show, /deckLabStage = "editor"/);
});

test('v0.13.24 Season hero feeds directly into the graphic 100-tier reward road', () => {
  const seasons = functionSlice('renderSeasons', 'renderChallenges');
  assert.match(seasons, /season-road-hero/);
  assert.match(seasons, /season-road-command/);
  assert.match(seasons, /NEXT · TIER/);
  assert.match(seasons, /season-reward-road/);
  assert.match(seasons, /data-season-end-countdown/);
  assert.match(css, /\.season-road-hero\{/);
  assert.match(css, /\.season-reward-road\{/);
});

test('v0.12.46 Challenge goals are compact horizontal command rows', () => {
  assert.match(css, /\.premium-challenge-card\{display:grid!important;grid-template-columns:minmax\(0,1fr\) 108px!important/);
  assert.match(css, /\.premium-challenge-card>button\{grid-column:2;grid-row:1\/4/);
});

test('v0.12.46 Booster Vault centers a single pack and scales pack typography to the physical product', () => {
  const boosters = functionSlice('renderBoosters', 'formatCountdown');
  assert.match(boosters, /vaultBuckets\.length === 1 \? "single-pack"/);
  assert.match(css, /\.booster-vault-shelf\.single-pack\{justify-content:center!important/);
  assert.match(css, /\.vault-product-pack span\{font-size:\.34rem!important/);
});

test('v0.12.46 Store uses collectible Superstar products and a horizontal shelf', () => {
  const store = functionSlice('renderStore', 'renderSeasons');
  assert.match(store, /superstarPreviewCardMarkup\(star\.id,"store-shelf-collectible"\)/);
  assert.match(css, /\.store-superstar-shelf\{display:flex!important/);
  assert.match(css, /\.shop-pack span\{font-size:\.32rem!important/);
});

test('v0.12.46 Collection separates set navigation and collapses filter and sort controls', () => {
  const collection = functionSlice('renderCollection', 'catalogueOwned');
  assert.match(collection, /collection-set-rail/);
  assert.match(collection, /collection-filter-drawer/);
  assert.match(collection, /FILTER & SORT/);
  assert.match(css, /\.collection-set-rail\{display:flex/);
});

test('v0.12.46 Catalogue exposes search and cards before a collapsed advanced filter system', () => {
  const catalogue = functionSlice('renderCardCatalogue', 'deckRole');
  assert.match(catalogue, /catalogue-command-bar/);
  assert.match(catalogue, /catalogue-advanced-filters/);
  assert.match(catalogue, /catalogueFiltersOpen \? "open" : ""/);
  assert.doesNotMatch(catalogue, /<details class="catalogue-super-sort" open>/);
});

test('v0.12.46 My Legacy replaces large stat boxes with one compact career command band', () => {
  const profile = functionSlice('renderProfile', 'chooseStarter');
  assert.match(profile, /profile-command-band/);
  assert.match(profile, /profile-compact-stats/);
  assert.doesNotMatch(profile, /profile-stat-grid premium-stats/);
  assert.match(css, /\.profile-compact-stats\{display:grid;grid-template-columns:repeat\(5/);
});
