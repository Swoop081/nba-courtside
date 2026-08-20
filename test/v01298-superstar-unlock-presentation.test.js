import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const profile = fs.readFileSync(new URL('../js/data/profile.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.19 superstar unlock celebration routes secondary unlocks to Collection-based Deck Lab building', () => {
  assert.match(profile, /deckReady:\s*Array\.isArray\(saved\) && saved\.length === 60/);
  assert.match(app, /const savedUnlockDeck = profile\?\.savedDecks\?\.\[event\.superstarId\]/);
  assert.match(app, /No filler cards granted/);
  assert.match(app, /OPEN IN DECK LAB/);
  assert.match(app, /READY TO PLAY/);
  assert.match(app, /BUILD FROM COLLECTION/);
  assert.match(css, /\.superstar-unlock-status\{/);
});
