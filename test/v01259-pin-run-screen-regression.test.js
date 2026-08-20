import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('green-health kickouts present a one-count before kick out', () => {
  assert.match(app, /greenHealthKickout/);
  assert.match(app, /healthZone\(game\?\.state\(\)\?\.players\?\.\[kickoutDefenderId\]\) === "green"/);
  assert.match(app, /greenHealthKickout[\s\S]*?\[\{text:"1!"[\s\S]*?\{text:"KICK OUT!"/);
});

test('green-health pin-escape presentation also breaks after one', () => {
  assert.match(app, /if \(pinEscape\) return greenHealthKickout[\s\S]*?\{text:"1!"[\s\S]*?\{text:"SHOULDER UP!"/);
});

test('Money in the Bank has no branch selector and Championship Road uses sequential difficulty tabs', () => {
  const ladder = app.slice(app.indexOf('function renderLadder()'), app.indexOf('function beginKingOfTheRing()'));
  assert.match(ladder, /8 LEVELS · 3 LIVES · SUPER PACK ON CLEAR/);
  assert.doesNotMatch(ladder, /data-ladder-branch|horizontal-branch-selector/);
  assert.match(app, /champ-difficulty-rail/);
  assert.match(app, /data-champ-difficulty/);
  assert.match(app, /24 MATCHES · FOUR DIFFICULTIES/);
});

test('run-screen primary buttons cannot inherit the global oversized min-width', () => {
  assert.match(css, /v0\.12\.59 — Pin count pacing \+ premium run-screen regression repair/);
  assert.match(css, /\.premium-run-screen \.mode-run-primary\{[\s\S]*?min-width:0!important;[\s\S]*?max-width:100%!important;/);
  assert.match(css, /\.premium-run-screen \.mode-run-command\{[\s\S]*?overflow:hidden!important;/);
});
