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

test('v0.12.45 Home hero matches the player starter and no longer duplicates Pack count in the hero stats', () => {
  const home = functionSlice('renderMainMenu', 'renderPlayMenu');
  assert.match(home, /legacy-stage-superstar/);
  assert.match(home, /portraitMarkup\(starter\.id,starter\.name\)/);
  assert.doesNotMatch(home, /const heroCard = superstarPreviewCardMarkup/);
  assert.match(home, /<small>SEASON<\/small><b>TIER \$\{seasonProgress\.tier\}<\/b>/);
  assert.doesNotMatch(home, /<small>PACKS<\/small><b>\$\{allBoosterCredits\}<\/b>/);
  assert.match(css, /\.legacy-stage-superstar img\.official-menu-superstar-photo/);
});

test('v0.12.57 Season keeps the hero before a compact one-line daily booster command strip', () => {
  const seasons = functionSlice('renderSeasons', 'renderChallenges');
  assert.ok(seasons.indexOf('season-final-boss-hero') < seasons.indexOf('season-free-pack-strip'));
  assert.match(seasons, /season-free-pack-strip/);
  assert.match(seasons, /CLAIM FREE BOOSTER/);
  assert.match(seasons, /NEXT FREE BOOSTER IN/);
  assert.doesNotMatch(seasons, /One Featured Season 1 booster every rolling 24 hours|FREE PACK READY/);
  assert.match(css, /\.free-pack-panel\{order:0!important\}/);
  assert.match(css, /\.season-free-pack-strip\{[\s\S]*min-height:62px!important/);
});

test('v0.12.45 Challenges removes redundant Main Menu control and fits all three set progress plates across mobile', () => {
  const challenges = functionSlice('renderChallenges', 'beginLadderRun');
  assert.doesNotMatch(challenges, /challenge-main-menu/);
  assert.match(css, /\.challenge-set-stats\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);
  assert.match(css, /\.challenge-set-stat\{[\s\S]*border-radius:5px!important/);
});

test('v0.12.45 Booster Vault uses a horizontal physical-pack shelf and four compact stats', () => {
  assert.match(css, /\.booster-vault-shelf\{[\s\S]*display:flex!important[\s\S]*overflow-x:auto!important/);
  assert.match(css, /\.vault-pack-product\{flex:0 0 172px!important/);
  assert.match(css, /\.booster-vault-stats\{grid-template-columns:repeat\(4,minmax\(0,1fr\)\)!important/);
});

test('v0.12.45 Store relies on global Universe Points chrome and compacts the featured offer', () => {
  const store = functionSlice('renderStore', 'renderSeasons');
  assert.doesNotMatch(store, /store-balance-card/);
  assert.match(css, /\.store-feature\{min-height:230px!important;border-radius:6px!important/);
  assert.match(css, /\.store-booster-offer\{grid-template-columns:120px minmax\(0,1fr\)!important/);
});
