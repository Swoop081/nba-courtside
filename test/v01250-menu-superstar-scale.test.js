import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.50 makes menu Superstar photography materially larger', () => {
  assert.match(css, /v0\.12\.50 — Menu Superstar Scale Pass/);
  assert.match(css, /\.legacy-stage-superstar\{[\s\S]*width:76%!important;[\s\S]*height:132%!important/);
  assert.match(css, /\.legacy-command-photo\{[\s\S]*width:62%!important;[\s\S]*height:148%!important/);
  assert.match(css, /\.legacy-mode-superstar\{[\s\S]*width:66%!important;[\s\S]*height:148%!important/);
  assert.match(css, /\.feature-art \.mode-portrait img\.official-menu-superstar-photo\{[\s\S]*width:90%!important;[\s\S]*height:126%!important/);
});

test('v0.12.50 scales mobile menu Superstar layers further', () => {
  assert.match(css, /@media\(max-width:600px\)\{[\s\S]*\.legacy-stage-superstar\{[^}]*width:86%!important/);
  assert.match(css, /@media\(max-width:600px\)\{[\s\S]*\.legacy-mode-superstar\{[^}]*width:74%!important/);
  assert.match(css, /@media\(max-width:390px\)\{[\s\S]*\.legacy-stage-superstar\{[^}]*width:90%!important/);
});

test('selection and run portraits also fill their presentation frames', () => {
  assert.match(css, /\.select-card-front img\.official-menu-superstar-photo\{[\s\S]*width:112%!important/);
  assert.match(css, /\.mode-run-node-portrait img\.official-menu-superstar-photo\{[\s\S]*width:118%!important/);
});
