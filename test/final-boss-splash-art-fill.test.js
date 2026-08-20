import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('Final Boss launch promo lets the supplied Rock render fill the full left side', () => {
  assert.match(css, /\.season-one-ad \.season-ad-rock\{[\s\S]*padding:0!important;[\s\S]*align-self:stretch!important/);
  assert.match(css, /\.season-one-ad \.season-ad-rock img\.final-boss-rock-menu-art\{[\s\S]*top:-5%!important;[\s\S]*height:112%!important;[\s\S]*object-fit:cover!important;[\s\S]*object-position:50% 0%!important/);
});
