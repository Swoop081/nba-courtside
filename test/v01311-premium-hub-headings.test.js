import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.11 primary hubs share the canonical split-heading system', () => {
  for (const expected of [
    'premiumHubHeading("DECK", "LAB"',
    'premiumHubHeading("MY", "CHALLENGES"',
    'premiumHubHeading("OPEN", "PACKS"',
    'premiumHubHeading("MY", "STORE"',
    'premiumHubHeading("MY", "COLLECTION"',
    'premiumHubHeading("CARD", "CATALOGUE"',
    'premiumHubHeading("MY", "LEGACY"',
    'premiumHubHeading("GAME", "RULES"'
  ]) assert.match(app, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(css, /\.premium-hub-heading h1 span\{color:#f7f8fb\}/);
  assert.match(css, /\.premium-hub-heading h1 b\{color:var\(--hub-accent\)/);
});

test('v0.13.11 single-word Home destinations adopt MY naming', () => {
  assert.ok(app.includes('homeHubSplitTitle(\"MY\", \"CHALLENGES\")'));
  assert.ok(app.includes('homeHubSplitTitle(\"MY\", \"STORE\")'));
});
