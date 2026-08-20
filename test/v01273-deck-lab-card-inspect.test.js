import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function between(source, start, end) {
  const a = source.indexOf(start);
  assert.notEqual(a, -1, `Missing start marker: ${start}`);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(b, -1, `Missing end marker: ${end}`);
  return source.slice(a, b);
}

test('v0.12.73 Deck Lab card picker cards open the large inspector', () => {
  const deckLab = between(app, 'function renderDeckBuilder()', 'function cardMeta(card)');
  assert.match(deckLab, /deck-lab-picker-ccg",flipAttr:`data-deck-lab-inspect="\$\{card\.id\}"`/);
  assert.match(deckLab, /bindDeckLabInspect\(root\)/);
});

test('v0.12.73 current deck surfaces are inspectable without changing deck actions', () => {
  const deckLab = between(app, 'function renderDeckBuilder()', 'function cardMeta(card)');
  assert.match(deckLab, /deck-lab-identity-card",flipAttr:`data-deck-lab-inspect="\$\{superstarCard\.id\}"`/);
  assert.match(deckLab, /deck-lead-card",flipAttr:`data-deck-lab-inspect="\$\{card\.id\}"`/);
  assert.match(deckLab, /deck-category-ccg",flipAttr:`data-deck-lab-inspect="\$\{card\.id\}"`/);
  assert.match(deckLab, /data-change-lead="\$\{index\}"/);
  assert.match(deckLab, /data-deck-category="\$\{category\.id\}"/);
});

test('v0.12.73 Deck Lab inspector supports front/rules flipping and explicit close', () => {
  const overlay = between(app, 'function renderDeckLabInspectOverlay()', 'function bindDeckLabInspect(root)');
  const binding = between(app, 'function bindDeckLabInspect(root)', 'function renderDeckBuilder()');
  assert.match(overlay, /data-flip-deck-lab-modal/);
  assert.match(overlay, /data-close-deck-lab-modal/);
  assert.match(overlay, /Tap outside to close/);
  assert.match(binding, /deckLabInspectFlipped = !deckLabInspectFlipped/);
  assert.match(binding, /event\.target !== backdrop/);
});

test('v0.12.73 Deck Lab inspector is mobile-sized above the persistent navigation', () => {
  assert.match(css, /v0\.12\.73 — Deck Lab Card Inspect Pass/);
  assert.match(css, /\.deck-lab-card-modal\{[\s\S]*z-index:1900!important/);
  assert.match(css, /\.deck-lab-inspect-card\{/);
  assert.match(css, /\[data-deck-lab-inspect\]\{[\s\S]*pointer-events:auto!important/);
});
