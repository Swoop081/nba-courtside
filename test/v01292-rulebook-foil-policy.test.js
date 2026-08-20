import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GAME_RULE_SECTIONS, PIN_CHANCE_TABLE, LIVE_EVENT_WEEK } from '../js/data/game-rules.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const assistant = fs.readFileSync(new URL('../js/data/deck-assistant.js', import.meta.url), 'utf8');

test('v0.12.92 My Legacy exposes a dedicated Rules & How to Play route',()=>{
  assert.match(app, /id="open-rulebook"/);
  assert.match(app, /function showRules\(\)/);
  assert.match(app, /function renderRules\(\)/);
  assert.match(app, /screen === "rules" \? "profile"/);
  assert.match(css, /\.rules-screen\{max-width:980px/);
  assert.ok(GAME_RULE_SECTIONS.length >= 14);
});

test('v0.12.92 Rulebook covers the core live systems and exact pin table',()=>{
  const ids = new Set(GAME_RULE_SECTIONS.map(section => section.id));
  for (const id of ['match-basics','turns-control','resources','card-types','move-legality','counters','damage-state','pins','submissions','deck-building','collection-rarity','boosters','modes','season-challenges','legacy-records','glossary']) assert.ok(ids.has(id), id);
  assert.deepEqual(PIN_CHANCE_TABLE.at(0), ['0–4 HP','75%']);
  assert.deepEqual(PIN_CHANCE_TABLE.at(-1), ['16+ HP','5%']);
  assert.deepEqual(LIVE_EVENT_WEEK.filter(([day]) => ['Monday','Wednesday','Saturday'].includes(day)), [['Monday','RAW'],['Wednesday','NXT'],['Saturday','SmackDown']]);
});

test('v0.13.55 Rulebook exposes the restored Foil +1 Damage chase rule',()=>{
  assert.match(assistant, /applyFoilGameplay/);
  const collection = GAME_RULE_SECTIONS.find(section => section.id === 'collection-rarity');
  const text = collection.items.flat().join(' ');
  assert.match(text, /Foil Move with positive Damage gets \+1 Damage/);
  assert.match(text, /up to 5 Normal plus 5 Foil/);
  assert.match(text, /not a hidden modifier/);
});
