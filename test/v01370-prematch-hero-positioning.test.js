import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.70 matchup is full-bleed and keeps the show logo separated in the upper third', () => {
  assert.match(css, /body:not\(\[data-screen="match"\]\):not\(\[data-screen="splash"\]\):not\(\[data-screen="starter"\]\):not\(\[data-screen="matchup"\]\)/);
  assert.match(css, /body\[data-screen="matchup"\] main\{[\s\S]*padding:0!important;[\s\S]*margin:0!important/);
  assert.match(css, /\.matchup-splash\{[\s\S]*padding:max\(calc\(env\(safe-area-inset-top\) \+ 26px\),7svh\) 12px/);
  assert.match(css, /\.matchup-splash \.prematch-brand\{min-height:112px!important;height:112px!important;margin:0 0 10px!important\}/);
  assert.match(css, /\.matchup-splash \.prematch-show-logo\{height:112px!important\}/);
  assert.match(css, /\.matchup-splash \.prematch-heading\{display:grid!important;justify-items:center!important;gap:4px!important;margin:0 0 4px!important\}/);
  assert.match(css, /\.matchup-splash \.prematch-heading span\{margin:0!important;line-height:1\.1!important\}/);
  assert.match(css, /@media\(max-width:600px\)\{[\s\S]*\.matchup-splash \.prematch-show-logo\{height:100px!important\}/);
});
