import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { canCounter, counterEligibility } from '../js/engine/rules.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

const between = (text, start, end) => {
  const a = text.indexOf(start);
  const b = text.indexOf(end, a + start.length);
  return a >= 0 && b > a ? text.slice(a, b) : '';
};

test('v0.13.71 Entrance hero reserves logo, callout and heading bands in that order', () => {
  const section = between(app, '<div class="entrance-hero-band">', '<div class="entrance-stage');
  assert.ok(section.indexOf('prematch-brand') < section.indexOf('entrance-crowd-chants'));
  assert.ok(section.indexOf('entrance-crowd-chants') < section.indexOf('entrance-intro-heading'));
  assert.match(css, /body\[data-screen="entrance-intro"\] \.entrance-crowd-chants\{[\s\S]*position:relative!important;inset:auto!important/);
  assert.match(css, /grid-template-rows:minmax\(30svh,32svh\) minmax\(0,1fr\) auto 50px!important/);
});

test('v0.13.71 Live Event hub restores readable PLAY copy without changing accent system', () => {
  assert.match(app, /status === "AVAILABLE" \? "PLAY"/);
  assert.match(css, /\.live-events-hub \.live-tower-hub-card:not\(\.mitb\) \.live-tower-enter\{[\s\S]*background:var\(--tower-accent\)!important;[\s\S]*color:#071017!important/);
});

test('v0.13.71 Live Event preview and shared route keep birthday boss last and opponent tiles fully contained', () => {
  assert.match(app, /const previewBossId = event\.bossId/);
  assert.match(app, /previewPool\.filter\(id => id !== previewBossId\)\.slice\(0, LIVE_EVENT_LENGTH - 1\), previewBossId/);
  assert.match(css, /\.live-tower-route\{[\s\S]*min-height:158px!important/);
  assert.match(css, /\.live-tower-route-superstar \.ccg-card\{[\s\S]*width:72px!important;[\s\S]*max-height:none!important/);
  assert.match(css, /\.live-tower-route-copy strong,[\s\S]*\.live-tower-route-copy small\{[\s\S]*overflow:visible!important/);
});

test('v0.13.71 normal Move Counters cannot answer Actions/supports even if a physical state happens to match', () => {
  const incomingUtility = { id:'crowd-support', name:'Crowd Support', kind:'support', counterState:'diving-aerial' };
  const senton = { id:'senton', name:'Senton', kind:'move', counterStates:['diving-aerial'], cost:3, requirements:{} };
  assert.equal(canCounter(incomingUtility, senton), false);
  const state = {
    phase:'COUNTER',
    proposedMove:{ attackerId:'p1', defenderId:'p2', card:incomingUtility },
    players:{ p1:{ hp:30 }, p2:{ superstar:{id:'kevin-owens'}, momentum:{strength:10,strike:10,technical:10,agility:10}, adrenaline:10, hand:[senton] } }
  };
  const result = counterEligibility(state,'p2',incomingUtility,senton);
  assert.equal(result.legal,false);
  assert.match(result.reason,/Only incoming Moves can be Countered/);
});

test('v0.13.71 pin count obscures the underlying match consistently before result reveal', () => {
  assert.match(css, /\.match-spectacle\.pin\{[\s\S]*background:rgba\(0,0,0,\.92\)!important;[\s\S]*backdrop-filter:blur\(9px\)/);
});

test('v0.13.71 Pack Complete is a hard-centered two-column 2-1-2 stack', () => {
  assert.match(css, /\.pack-summary-compact-grid\{[\s\S]*grid-template-columns:repeat\(2,var\(--summary-card-w\)\)!important;[\s\S]*justify-content:center!important/);
  assert.match(css, /\.pack-summary-compact-grid>\.summary-center\{grid-column:1\/-1!important;grid-row:2!important;justify-self:center!important\}/);
  assert.match(app, /const featuredSummaryIndex = pulls\.reduce/);
});

test('v0.13.71 overflowing layered card names use measured marquee motion only when needed', () => {
  assert.match(app, /data-card-name-marquee="1"><span class="ccg-live-name-text">\$\{card\.name\}<\/span>/);
  assert.match(app, /const overflow = Math\.ceil\(text\.scrollWidth - host\.clientWidth\)/);
  assert.match(app, /if \(overflow > 2\)/);
  assert.match(css, /@keyframes ccgNameMarquee/);
  assert.match(css, /translateX\(var\(--card-name-scroll,0px\)\)/);
});

test('v0.13.71 post-pack comparison reserves caption rows so cards cannot cover supporting copy', () => {
  assert.match(css, /\.focused-pack-upgrades \.upgrade-card-choice\{[\s\S]*grid-template-rows:auto auto minmax\(2\.45em,auto\)!important/);
  assert.match(css, /\.focused-pack-upgrades \.upgrade-card-choice>strong\{[\s\S]*grid-row:3!important/);
  assert.match(css, /\.focused-pack-upgrades \.pack-upgrade-swap>p\{[\s\S]*position:relative!important;[\s\S]*z-index:2!important/);
});

test('v0.13.71 Championship Road removes redundant persistence prose and cleans selected Superstar copy', () => {
  const section = between(app, 'function renderChampionship(){', 'function modeLogoMarkup');
  assert.doesNotMatch(section, /Begin or resume a separate 24-match road/);
  assert.doesNotMatch(section, /24 matches · four difficulties · a separate persistent road/);
  assert.doesNotMatch(section, /This Superstar keeps their own 24-match progress/);
  assert.match(section, /<span>YOUR SUPERSTAR<\/span><strong>\$\{chosenStar\?\.name/);
});
