import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.12 Home destination titles use the same white/accent split language', () => {
  for (const expected of [
    'homeHubSplitTitle("DECK", "LAB")',
    'homeHubSplitTitle("MY", "CHALLENGES")',
    'homeHubSplitTitle("OPEN", "PACKS")',
    'homeHubSplitTitle("MY", "STORE")',
    'homeHubSplitTitle("MY", "COLLECTION")',
    'homeHubSplitTitle("MY", "LEGACY")'
  ]) assert.ok(app.includes(expected), expected);
  assert.match(css, /\.legacy-home-destinations \.legacy-command-title span\{color:#f7f8fb\}/);
  assert.match(css, /\.legacy-home-destinations \.legacy-command-title b\{[\s\S]*color:var\(--command-accent/);
});
