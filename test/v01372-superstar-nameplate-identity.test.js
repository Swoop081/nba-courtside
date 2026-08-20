import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { SUPERSTAR_NAMEPLATE_STYLES, superstarNameplateStyleFor, superstarNameplateStyleVars } from '../js/data/superstar-nameplate-styles.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const studio = fs.readFileSync(new URL('../js/tools/card-art-studio.js', import.meta.url), 'utf8');
const studioData = fs.readFileSync(new URL('../js/tools/card-art-studio-data.js', import.meta.url), 'utf8');
const studioHtml = fs.readFileSync(new URL('../tools/card-art-studio.html', import.meta.url), 'utf8');

const roster = Object.values(superstars);

test('v0.13.72 every current Superstar has an authored unique nameplate identity', () => {
  const ids = roster.map(star => star.id);
  assert.equal(ids.length, 62);
  assert.equal(Object.keys(SUPERSTAR_NAMEPLATE_STYLES).length, ids.length);
  assert.deepEqual(ids.filter(id => !SUPERSTAR_NAMEPLATE_STYLES[id]), []);
  assert.equal(new Set(ids.map(id => SUPERSTAR_NAMEPLATE_STYLES[id].label)).size, ids.length);
  for (const star of roster) {
    const style = superstarNameplateStyleFor(star.id, star.setId);
    assert.ok(style.font, `${star.name} needs a font stack`);
    assert.match(style.top, /^#/);
    assert.match(style.mid, /^#/);
    assert.match(style.bottom, /^#/);
    assert.ok(style.size >= .9, `${star.name} should keep the authored name large`);
  }
});

test('v0.13.72 runtime nameplate variables are HTML-safe and preserve bold colourful identity', () => {
  const vars = superstarNameplateStyleVars('diesel', 'new-generation-series-1');
  assert.doesNotMatch(vars, /"/);
  assert.match(vars, /--ss-top:#fff45f/);
  assert.match(vars, /--ss-mid:#31e0d4/);
  assert.match(vars, /--ss-accent:#ffdc00/);
  assert.match(css, /font-size:calc\(8\.6cqw \* var\(--ss-size\)\)/);
  assert.match(css, /font-weight:1000/);
  assert.match(css, /background:linear-gradient\(180deg,var\(--ss-top\) 0%,var\(--ss-mid\) 48%,var\(--ss-bottom\) 100%\)/);
});

test('v0.13.72 Superstar cards and generated previews share the same live signature nameplate overlay', () => {
  assert.match(app, /function superstarNameplateMarkup\(/);
  assert.match(app, /data-superstar-nameplate="\$\{starId\}"/);
  assert.match(app, /generated-superstar-nameplate/);
  assert.match(app, /ccg-superstar-live-nameplate/);
  assert.match(app, /frontMarkup = superstarFront[\s\S]*layeredFrontOverlayMarkup\(card\)/);
  assert.match(css, /\.ccg-superstar-live-overlay/);
  assert.match(css, /\.generated-superstar-preview>\.generated-superstar-nameplate/);
});

test('v0.13.72 Card Studio serializes all nameplate identities and previews the selected Superstar identity', () => {
  assert.match(studioData, /const STUDIO_SUPERSTAR_NAMEPLATES = /);
  for (const star of roster) assert.match(studioData, new RegExp(`"${star.id}"`));
  assert.match(studio, /currentSuperstarNameplateStyle/);
  assert.match(studio, /drawSuperstarNameText/);
  assert.match(studio, /fittedSuperstarNameFont/);
  assert.match(studio, /starStyle\?\.accent/);
  assert.match(studioHtml, /id="nameplate-identity"/);
  assert.match(studioHtml, /id="nameplate-style-name"/);
});
