import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function functionSlice(name, nextName) {
  const start = ui.indexOf(`function ${name}`);
  const end = ui.indexOf(`function ${nextName}`, start + 1);
  return ui.slice(start, end);
}

test('v0.12.54 top gamebar uses app icon and much larger Season/Packs/UP readouts', () => {
  assert.match(html, /class="gamebar-app-icon" src="\.\/assets\/icons\/icon-192\.png\?v=0\.\d+\.\d+"/);
  assert.doesNotMatch(html, /class="gamebar-wwe"/);
  assert.match(css, /\.gamebar-season small\{[\s\S]*font-size:1\.70rem!important/);
  assert.match(css, /\.gamebar-resources b\{[\s\S]*font-size:2\.05rem!important/);
});

test('v0.12.54 Home removes PLAY from Enter the Ring and makes starter art dominant', () => {
  const home = functionSlice('renderMainMenu', 'renderPlayMenu');
  assert.match(home, /class="legacy-stage-cta"><b>ENTER THE RING<\/b><i>›<\/i><\/button>/);
  assert.doesNotMatch(home, /legacy-stage-cta"><span>PLAY<\/span>/);
  assert.match(css, /\.legacy-stage-superstar\{[\s\S]*width:116%!important;[\s\S]*height:158%!important/);
  assert.match(css, /@media\(max-width:600px\)\{[\s\S]*\.legacy-stage-superstar\{[^}]*width:128%!important/);
});

test('v0.12.54 Home uses Final Boss Rock and full-width destinations in requested order', () => {
  const home = functionSlice('renderMainMenu', 'renderPlayMenu');
  assert.match(home, /legacy-season-rock.*finalBossRockMarkup\(\)/s);
  const ids = ['menu-decks','menu-challenges','menu-boosters','menu-store','menu-owned-collection','menu-profile'];
  let last = -1;
  for (const id of ids) {
    const pos = home.indexOf(`id="${id}"`);
    assert.ok(pos > last, `${id} should follow the requested Home order`);
    last = pos;
  }
  assert.ok(home.includes('homeHubSplitTitle(\"OPEN\", \"PACKS\")'));
  assert.ok(home.includes('homeHubSplitTitle(\"MY\", \"STORE\")'));
  assert.doesNotMatch(home, /CARD SHOP|BOOSTER VAULT/);
  assert.match(css, /\.legacy-command-rack\.legacy-home-destinations\{[\s\S]*grid-template-columns:minmax\(0,1fr\)!important/);
});

test('v0.12.54 Challenge attention badge no longer covers Earn Rewards', () => {
  assert.match(css, /\.legacy-command-tile \.attention-badge\{[\s\S]*left:auto!important;[\s\S]*right:10px!important/);
});

test('v0.12.54 removes Options from Home, bottom navigation, route and screen implementation', () => {
  assert.doesNotMatch(html, /data-mobile-nav="options"/);
  assert.doesNotMatch(ui, /id="menu-options"/);
  assert.doesNotMatch(ui, /function showOptions\(/);
  assert.doesNotMatch(ui, /function renderOptions\(/);
});
