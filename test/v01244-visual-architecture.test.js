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

test('v0.12.44 global shell has a real top resource bar for Season, Packs and Universe Points', () => {
  assert.match(html, /id="app-topbar" class="legacy-gamebar"/);
  assert.match(html, /data-chrome-tier/);
  assert.match(html, /data-chrome-packs/);
  assert.match(html, /data-chrome-up/);
  assert.match(ui, /profile\.universePoints/);
  assert.match(ui, /seasonLevelProgress\(profile\)/);
  assert.match(ui, /#chrome-season/);
  assert.match(ui, /#chrome-packs/);
});

test('v0.12.44 global shell hides game chrome during splash, starter, match and unlock celebration', () => {
  const chrome = functionSlice('setChrome', 'showSplash');
  for (const screen of ['splash','starter','match','unlock-celebration']) assert.ok(chrome.includes(`"${screen}"`));
  assert.match(css, /--legacy-chrome-h:64px/);
  assert.match(css, /padding-top:calc\(var\(--legacy-chrome-h\)/);
});

test('v0.12.44 Home is a layered game stage rather than the old dashboard stack', () => {
  const home = functionSlice('renderMainMenu', 'renderPlayMenu');
  assert.match(home, /legacy-home-stage/);
  assert.match(home, /legacy-stage-superstar/);
  assert.doesNotMatch(home, /legacy-stage-card/);
  assert.match(home, /portraitMarkup\(starter\.id,starter\.name\)/);
  assert.match(home, /legacy-stage-cta/);
  assert.match(home, /legacy-command-rack/);
  assert.match(home, /legacy-home-destinations/);
  assert.doesNotMatch(home, /premium-menu-grid compact-hub-grid/);
});

test('v0.12.44 Home live Season event keeps premium Season title, exact next-tier progress and bright green bar', () => {
  const home = functionSlice('renderMainMenu', 'renderPlayMenu');
  assert.match(home, /legacy-season-event/);
  assert.match(home, /homeHubSplitTitle\("SEASON", "ONE"\)/);
  assert.doesNotMatch(home, /data-season-countdown/);
  assert.match(home, /XP TO NEXT TIER/);
  assert.match(home, /TIER 100 · THE FINAL BOSS/);
  assert.match(css, /\.legacy-season-progress i\{[^}]*linear-gradient\(90deg,#23e678,#4dff9c,#c5ffd7\)/);
});

test('v0.12.44 Play keeps three cinematic banners; v0.12.47 replaces decorative cards with wrestler photography', () => {
  const play = functionSlice('renderPlayMenu', 'renderProfile');
  assert.match(play, /legacy-mode-stack/);
  assert.ok((play.match(/class="legacy-mode-banner/g) ?? []).length >= 3);
  assert.match(play, /portraitMarkup\("cody-rhodes","Cody Rhodes"\)/);
  assert.match(play, /portraitMarkup\("gunther","Gunther"\)/);
  assert.match(play, /portraitMarkup\("roman-reigns","Roman Reigns"\)/);
  assert.doesNotMatch(play, /modeCard\(/);
  assert.match(play, /legacy-mode-superstar/);
  assert.doesNotMatch(play, /premium-screen-title/);
});

test('v0.12.44 iPhone composition keeps all three Play modes compact above the game-control navigation', () => {
  assert.match(css, /@media\(max-width:600px\)[\s\S]*\.legacy-mode-banner\{min-height:160px\}/);
  assert.match(css, /\.mobile-game-nav\.compact-eight-nav\{[\s\S]*height:calc\(86px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /clip-path:polygon/);
  assert.match(css, /legacy-mode-banner:before/);
});
