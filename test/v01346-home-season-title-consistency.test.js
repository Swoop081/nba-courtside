import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.46 Home Season title reuses the exact Deck Lab split-title component and keeps Season colours', () => {
  const home = app.slice(app.indexOf('function renderMainMenu()'), app.indexOf('function renderPlayMenu()'));
  assert.match(home, /homeHubSplitTitle\("SEASON", "ONE"\)/);
  assert.match(home, /homeHubSplitTitle\("DECK", "LAB"\)/);
  assert.doesNotMatch(home, /class="season-home-title"/);

  assert.match(css, /v0\.13\.46 — Home Season Title Consistency Hotfix/);
  assert.match(css, /\.legacy-season-event\{--command-accent:#55e4ff!important\}/);
  assert.match(css, /\.legacy-home-destinations \.legacy-command-copy>\.legacy-command-title,\s*\.legacy-season-event \.legacy-season-copy>\.legacy-command-title\{\s*font-size:1\.48rem!important;\s*line-height:\.9!important;\s*margin:5px 0!important;/);
  assert.match(css, /@media\(max-width:390px\)\{\s*\.legacy-home-destinations \.legacy-command-copy>\.legacy-command-title,\s*\.legacy-season-event \.legacy-season-copy>\.legacy-command-title\{font-size:1\.35rem!important\}/);
});
