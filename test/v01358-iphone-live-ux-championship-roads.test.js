import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile } from '../js/data/profile.js?v=0.13.72';
import {
  CHAMPIONSHIP_ROAD_OPPONENTS,
  championshipRoadForSuperstar,
  championshipRoadState,
  selectChampionshipRoadSuperstar,
  startChampionshipRoad,
  currentChampionshipOpponent,
  recordChampionshipMatch
} from '../js/data/championship-road.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function slice(start, end) {
  const a = app.indexOf(start), b = app.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `missing slice ${start} -> ${end}`);
  return app.slice(a,b);
}

test('v0.13.58 Live Events use a distinct rotating palette and a neutral multicolour header', () => {
  const hub = slice('const LIVE_EVENT_ACCENT_ROTATION', 'function renderLiveEventTowerDetail');
  assert.match(hub, /\["cyan", "magenta", "orange", "purple", "teal", "red", "blue"\]/);
  assert.match(hub, /liveEventAccentForTower/);
  assert.match(css, /live-events-hub-heading::after[\s\S]*#48d7ff[\s\S]*#f0c34f[\s\S]*#ef3549/);
  for (const name of ['cyan','magenta','orange','purple','teal','red','blue']) assert.match(css, new RegExp(`live-tower-hub-card\\.${name}`));
});

test('v0.13.58 active Live Event detail is viewport-contained and the opponent route scrolls horizontally', () => {
  assert.match(app, /document\.body\.dataset\.liveView = "detail"/);
  assert.match(app, /is-active-tower/);
  assert.match(css, /body\[data-screen="live-events"\]\[data-live-view="detail"\] main\{[\s\S]*height:100svh!important[\s\S]*overflow:hidden!important/);
  assert.match(css, /\.live-tower-route-strip\{[\s\S]*grid-auto-flow:column!important[\s\S]*overflow-x:auto!important[\s\S]*overflow-y:hidden!important/);
});

test('v0.13.58 Entrance reveal is truly centered and the show logo is hero scale', () => {
  assert.match(css, /body\[data-screen="entrance-intro"\] \.entrance-intro-screen \.prematch-show-logo\{[\s\S]*height:138px!important/);
  assert.match(css, /body\[data-screen="entrance-intro"\] \.entrance-card-transition\{[\s\S]*left:50%!important[\s\S]*top:50%!important/);
  assert.match(css, /translate\(-50%,-50%\) scale\(1\) rotateY\(0deg\)/);
});

test('v0.13.58 Pack Complete keeps a compact five-card summary and one NEXT action', () => {
  const boosters = slice('function renderBoosters()', 'function formatCountdown');
  const summary = boosters.slice(boosters.indexOf('packStage === "summary"'), boosters.indexOf('packStage === "upgrades"'));
  assert.match(summary, /pack-summary-compact-grid/);
  assert.match(summary, /compactSummaryThumbs/);
  assert.match(summary, /id="pack-summary-next"[^>]*>NEXT<\/button>/);
  assert.match(css, /pack-summary-compact-grid/);
});

test('v0.13.58 post-pack Deck Assistance comparisons use the full width rather than the legacy narrow side column', () => {
  assert.match(css, /\.focused-pack-upgrades \.pack-upgrade-swap\{[\s\S]*grid-template-columns:minmax\(0,1fr\)!important/);
  assert.match(css, /\.focused-pack-upgrades \.upgrade-card-pair\{[\s\S]*grid-template-columns:minmax\(0,1fr\) 30px minmax\(0,1fr\)!important/);
  assert.match(css, /\.focused-pack-upgrades \.pack-upgrade-swap>p\{[\s\S]*width:100%!important/);
  assert.match(css, /\.focused-pack-upgrades \.upgrade-choice-actions\{[\s\S]*grid-template-columns:1fr 1fr!important/);
});

test('v0.13.58 Championship Road progress is independent per unlocked Superstar', () => {
  const profile = createProfile('roman-reigns');
  profile.unlockedSuperstars = [...new Set([...(profile.unlockedSuperstars ?? []), 'roman-reigns', 'cody-rhodes'])];

  selectChampionshipRoadSuperstar(profile, 'roman-reigns');
  startChampionshipRoad(profile, 'roman-reigns', [], Math.random, 'easy');
  for (let i = 0; i < 5; i += 1) recordChampionshipMatch(profile, 'win');
  assert.equal(championshipRoadForSuperstar(profile, 'roman-reigns').activeRun.stage, 5);

  selectChampionshipRoadSuperstar(profile, 'cody-rhodes');
  startChampionshipRoad(profile, 'cody-rhodes', [], Math.random, 'easy');
  for (let i = 0; i < 17; i += 1) recordChampionshipMatch(profile, 'win');
  assert.equal(championshipRoadForSuperstar(profile, 'cody-rhodes').activeRun.stage, 17);
  assert.equal(championshipRoadForSuperstar(profile, 'roman-reigns').activeRun.stage, 5);

  selectChampionshipRoadSuperstar(profile, 'roman-reigns');
  assert.equal(championshipRoadState(profile).selectedSuperstarId, 'roman-reigns');
  assert.equal(currentChampionshipOpponent(profile), CHAMPIONSHIP_ROAD_OPPONENTS[5]);
});

test('v0.13.58 Championship UI exposes per-Superstar roads and valid Save Deck returns to the roster', () => {
  const championship = slice('function beginChampionshipRoad()', 'function legacyLogoMarkup');
  assert.match(championship, /YOUR CHAMPIONSHIP ROADS/);
  assert.match(championship, /data-champ-superstar/);
  assert.match(championship, /\$\{progress\}\/\$\{CHAMPIONSHIP_ROAD_LENGTH\}/);
  assert.match(championship, /modeLogoMarkup\('championship',true\)/);
  const deck = slice('function renderDeckBuilder()', 'function cardMeta');
  assert.match(deck, /message = `\$\{star\.name\}'s deck and Entrance saved\.`/);
  assert.match(deck, /deckLabStage = "roster"/);
  assert.match(deck, /deckDraft = null/);
});
