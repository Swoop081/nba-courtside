import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function slice(start, end) {
  const a = app.indexOf(start), b = app.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `missing function slice ${start} -> ${end}`);
  return app.slice(a, b);
}

test('v0.13.54 Live Events hub removes Superstar art and per-card reset timers', () => {
  const hub = slice('function renderLiveEventHub()', 'function renderLiveEventTowerDetail');
  assert.doesNotMatch(hub, /live-tower-hub-art/);
  assert.doesNotMatch(hub, /superstarRenderMarkup\(tower\.event\.heroId/);
  assert.match(hub, /live-tower-hub-footer/);
  assert.doesNotMatch(hub, /live-tower-timer|data-live-tower-expiry/);
  assert.match(hub, /Live Events reset daily at local midnight/);
  assert.match(css, /\.live-events-hub \.live-tower-timer\{display:none!important\}/);
  assert.match(css, /\.live-events-hub \.compact-live-choice \.live-event-split-title\{[\s\S]*font-size:clamp\(1\.95rem,7\.2vw,3\.05rem\)!important/);
});

test('v0.13.37 Superstar selection uses one horizontal carousel and first tap selects before flip', () => {
  assert.match(app, /selectionCarouselMarkup\(unlocked,selection\.p1,'exhibition-p1'\)/);
  assert.match(app, /selectionCarouselMarkup\(unlocked,\s*chosenId,\s*'ladder-select'\)/);
  assert.match(app, /selectionCarouselMarkup\(unlocked,chosenId,'kotr-select'\)/);
  assert.match(app, /selectionCarouselMarkup\(unlocked,chosenId,'champ-select'\)/);
  assert.match(app, /selectionCarouselMarkup\(unlocked,chosenId,'live-event-select'\)/);
  assert.match(app, /selectionCarouselMarkup\(unlocked,deckBuilderStarId,'deck-lab-select'\)/);
  const wire = slice('function wireSelectionCarousel', 'function setVisualClass');
  assert.match(wire, /if \(!wasSelected\) \{[\s\S]*onPick\(starId\);[\s\S]*return;/);
  assert.match(wire, /if \(selectDetailKeys\.has\(key\)\) selectDetailKeys\.delete\(key\); else selectDetailKeys\.add\(key\);/);
});

test('v0.13.37 Home Season typography matches the destination-title rhythm', () => {
  assert.match(css, /\.legacy-season-event \.season-home-title\{[\s\S]*font-size:1\.48rem!important;[\s\S]*line-height:\.9!important;[\s\S]*letter-spacing:-\.045em!important/);
  assert.match(css, /\.legacy-season-copy>em\{font-size:\.46rem!important;letter-spacing:\.14em!important\}/);
  assert.match(css, /\.legacy-home-destinations \.legacy-command-title\{[\s\S]*letter-spacing:-\.045em!important/);
});

test('v0.13.37 Season current-tier focus remains supported after the v0.13.49 anchored-header supersession', () => {
  const season = slice('function renderSeasons()', 'function renderChallenges');
  assert.match(season, /season-anchor-shell/);
  assert.match(season, /season-free-pack-cta/);
  assert.match(season, /data-season-road-scroll/);
  assert.match(season, /scroller\.scrollTo\(\{top:Math\.max\(0,targetTop-focusOffset\),left:0,behavior:'auto'\}\)/);
  assert.doesNotMatch(season, /classList\.toggle\('is-compact'/);
  assert.doesNotMatch(season, /window\.scrollTo/);
});

test('v0.13.37 themed stat tiles use full fills rather than black accent-only panels', () => {
  assert.match(css, /body\[data-screen="boosters"\] \.booster-vault-stats>\.set-stat:nth-child\(odd\)\{background:#ff7a35!important/);
  assert.match(css, /body\[data-screen="boosters"\] \.booster-vault-stats>\.set-stat:nth-child\(even\)\{background:#f4f6f8!important/);
  assert.match(css, /body\[data-screen="king-of-the-ring"\] \.mode-run-summary>div:nth-child\(odd\)\{background:#e3b94f!important/);
  assert.match(css, /body\[data-screen="championship"\] \.mode-run-summary>div:nth-child\(odd\)\{background:#e43c49!important/);
  assert.match(css, /body\[data-screen="live-events"\] \.live-tower-detail-stats>article:nth-child\(odd\)\{background:#54df92!important/);
});

test('v0.13.37 KOTR header no longer reserves empty portrait space', () => {
  assert.match(css, /body\[data-screen="king-of-the-ring"\] \.kotr-screen \.kotr-no-portrait-hero\{[\s\S]*min-height:0!important;[\s\S]*height:auto!important/);
  assert.match(css, /\.kotr-no-portrait-hero \.mode-run-summary\{[\s\S]*position:static!important/);
});
