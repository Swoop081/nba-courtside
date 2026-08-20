import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.29 Home Season title inherits the preferred full Season hero weight', () => {
  assert.match(css, /v0\.13\.29 — iPhone visual follow-up pass/);
  assert.match(css, /\.legacy-season-event \.season-home-title\{[\s\S]*line-height:\.78!important[\s\S]*letter-spacing:-\.065em!important/);
  assert.match(css, /transform:scaleX\(1\.035\)/);
});

test('v0.13.29 Money in the Bank uses major-mode typography and a horizontal Superstar-card road', () => {
  assert.match(css, /\.money-in-bank-live-card \.live-event-split-title\.title-mitb span\{[\s\S]*font-size:clamp\(1\.85rem,7\.6vw,3rem\)!important/);
  assert.match(css, /\.money-in-bank-live-card \.live-event-split-title\.title-mitb b\{[\s\S]*font-size:clamp\(2\.65rem,10\.5vw,4\.4rem\)!important/);
  assert.match(app, /superstarPreviewCardMarkup\(id,"mitb-v2-superstar-card"\)/);
  assert.match(app, /mitb-v2-opponent-rail/);
  assert.match(app, /data-mitb-v2-opponent-index/);
  assert.match(app, /rail\.scrollTo\(\{ left, behavior: 'instant' \}\)/);
  assert.doesNotMatch(app.slice(app.indexOf('function renderLadder()'), app.indexOf('function beginKingOfTheRing()')), /modePortraits\(\[chosenId\],"feature-art"\)/);
});

test('v0.13.29 King of the Ring headers are portrait-free and post-crown buttons cannot collapse vertically', () => {
  const kotr = app.slice(app.indexOf('function renderKingOfTheRing()'), app.indexOf('function beginChampionshipRoad()'));
  assert.match(kotr, /kotr-no-portrait-hero/);
  assert.doesNotMatch(kotr, /modePortraits\(\[run\.superstarId\],"feature-art"\)/);
  assert.doesNotMatch(kotr, /modePortraits\(\[chosenId\],"feature-art"\)/);
  assert.match(kotr, /class="start-match kotr-open-packs">OPEN PACKS/);
  assert.match(css, /\.kotr-post-crown-actions\{[\s\S]*grid-template-columns:1fr!important/);
  assert.match(css, /writing-mode:horizontal-tb!important/);
  assert.match(css, /mode-logo\.compact strong\{font-size:3rem!important/);
});

test('v0.13.29 pre-match Entrance screen does not reserve legacy chrome and is one-viewport compact', () => {
  assert.match(css, /:not\(\[data-screen="entrance-intro"\]\) main\{padding-top:calc\(var\(--legacy-chrome-h\)/);
  assert.match(css, /body\[data-screen="entrance-intro"\] \.entrance-intro-screen\{[\s\S]*height:100svh!important[\s\S]*grid-template-rows:50px auto 34px minmax\(0,1fr\) auto 50px!important/);
  assert.match(css, /\.entrance-card-transition\{width:min\(50vw,246px\)!important;max-height:min\(45svh,390px\)!important/);
});

test('v0.13.29 Store Superstar cards open the standard preview independently from purchase', () => {
  const store = app.slice(app.indexOf('function renderStore()'), app.indexOf('function renderSeasons()'));
  assert.match(store, /data-store-inspect-star/);
  assert.match(store, /renderSuperstarOverlay\(\)/);
  assert.match(store, /superstarOverlayId=btn\.dataset\.storeInspectStar/);
  assert.match(store, /data-buy-store-star/);
  assert.match(css, /body\[data-screen="store"\] \.superstar-card-modal-inner\{width:min\(60vw,320px\)!important/);
});

test('v0.13.29 Catalogue My Collection utility no longer uses the overlapping absolute mobile position', () => {
  assert.match(css, /\.catalogue-compact-redesign \.catalogue-owned-link\{position:static!important/);
  assert.match(css, /\.catalogue-compact-redesign \.catalogue-quickbar\{grid-template-columns:1fr!important/);
});

test('v0.13.29 Championship Road uses actual Superstar cards and larger progression stars', () => {
  const champ = app.slice(app.indexOf('function renderChampionship()'), app.indexOf('function legacyLogoMarkup'));
  assert.match(champ, /superstarPreviewCardMarkup\(id,"champ-road-superstar-card"\)/);
  assert.match(champ, /class="champ-road-result-star"/);
  assert.doesNotMatch(champ, /portraitMarkup\(id,star\?\.name\?\?id\)/);
  assert.match(css, /\.champ-road-superstar-card\{width:58px!important/);
  assert.match(css, /\.champ-road-result-star\{[\s\S]*font-size:2rem!important/);
});
