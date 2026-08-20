import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");

function between(source, start, end) {
  const a = source.indexOf(start);
  assert.notEqual(a, -1, `Missing start marker: ${start}`);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(b, -1, `Missing end marker: ${end}`);
  return source.slice(a, b);
}

test("v0.12.57 tightens Final Boss launch art bleed and copy spacing", () => {
  assert.match(css, /v0\.12\.57 — Mobile Presentation \+ Flow Pass/);
  assert.match(css, /\.season-one-ad \.season-ad-copy\{left:39%!important;width:59%!important/);
  assert.match(css, /mask-image:linear-gradient\(90deg,#000 0%,#000 86%,rgba\(0,0,0,\.72\) 92%,transparent 100%\)/);
});

test("v0.12.57 keeps PACKS readable and lowers Home wrestler renders", () => {
  assert.match(css, /\.gamebar-resources small\{[\s\S]*font-size:1\.02rem!important[\s\S]*transform:scaleX\(\.88\)!important/);
  assert.match(css, /official-menu-superstar-photo\{[\s\S]*transform:translateY\(3\.5%\)!important/);
});

test("v0.12.57 Daily Login Booster uses one-line status and opens immediately", () => {
  const season = between(app, "function renderSeasons()", "function renderChallenges()");
  assert.match(season, /data-free-pack-action/);
  assert.match(season, /CLAIM FREE BOOSTER/);
  assert.match(season, /NEXT FREE BOOSTER IN/);
  assert.doesNotMatch(season, /FREE PACK READY/);
  assert.doesNotMatch(season, /waiting in Boosters/i);
  assert.match(season, /boosterReturnScreen\s*=\s*"seasons";/);
  assert.match(season, /processPack\("standard"\)/);
  assert.match(app, /returnScreen === "seasons"[\s\S]*renderSeasons\(\)/);
});

test("v0.13.24 Season command summary remains readable above the reward road", () => {
  const season = between(app, "function renderSeasons()", "function renderChallenges()");
  assert.match(season, /season-road-command/);
  assert.match(season, /CURRENT TIER/);
  assert.match(season, /REWARDS READY/);
  assert.match(season, /UNIVERSE POINTS/);
  assert.match(css, /\.season-road-command\{/);
});

test("v0.12.57 Store separates pack, copy, CTA, and Superstar card areas on mobile", () => {
  assert.match(css, /\.store-booster-offer\{[\s\S]*grid-template-columns:104px minmax\(0,1fr\)!important/);
  assert.match(css, /\.store-superstar-card\.shop-star-card\{[\s\S]*grid-template-rows:142px auto auto!important/);
  assert.match(css, /\.store-superstar-card \.store-superstar-card-art\{[\s\S]*grid-row:1!important/);
  assert.match(css, /\.store-superstar-card \.store-superstar-copy\{[\s\S]*grid-row:2!important/);
  assert.match(css, /\.store-superstar-card>button:last-child\{[\s\S]*grid-row:3!important/);
});

test("v0.12.57 finished card fronts do not duplicate printed Cost and Damage", () => {
  const cards = between(app, "function collectibleCardMarkup", "function collectionText");
  assert.match(cards, /: finishedFront\s*\n\s*\? `<span class="ccg-card-art \${moveFront \? "ccg-move-full-art" : ""}">\${cardArtFace\(card,\{eager:eagerArt\}\)}<\/span>`/);
  assert.doesNotMatch(cards, /finishedFront\s*\n\s*\? `<span[^`]*ccg-card-stats/);
  assert.match(css, /\.ccg-card\.is-full-art-finished \.ccg-card-stats[\s\S]*display:none!important/);
});

test("v0.12.57 Play Superstar selector presents the collectible card", () => {
  const selector = between(app, "function selectionCarouselMarkup", "function renderSetup");
  assert.match(selector, /selection-owned-card/);
  assert.match(selector, /superstarPreviewCardMarkup\(star\.id,"selection-owned-superstar-card"\)/);
  assert.doesNotMatch(selector, /select-card-front[^`]*portraitMarkup/);
});

test("v0.12.57 matchup splash is a minimal television-style Main Event graphic", () => {
  const splash = between(app, "function renderMatchupSplash", "function renderEntranceIntro");
  assert.match(splash, /TONIGHT’S/);
  assert.match(splash, /MAIN EVENT/);
  assert.match(splash, /prematch-vs">VS/);
  assert.match(splash, />Start Match</);
  assert.doesNotMatch(splash, /\bHP\b|record|deck size|win rate/i);
  assert.match(css, /\.matchup-splash \.prematch-show-logo\{height:160px!important/);
});

test("v0.12.57 Superstar reveal holds before Entrance transition", () => {
  const intro = between(app, "function renderEntranceIntro", "function restartMatch");
  assert.match(intro, /setTimeout\(\(\) => \{/);
  assert.match(intro, /\}, 1750\);/);
  assert.match(css, /\.entrance-card-transition\{transition:opacity \.42s ease,transform \.52s/);
});

test("v0.12.57 Momentum cards use essential arena presentation with no fire motif", () => {
  const momentum = between(app, "function momentumMockupMarkup", "function cardArtFace");
  assert.match(momentum, /momentum-arena-lines/);
  assert.match(momentum, /momentum-method-mark/);
  assert.match(momentum, /WWE LEGACY/);
  assert.match(momentum, /MOMENTUM/);
  assert.match(momentum, /momentum-value/);
  assert.doesNotMatch(momentum, /flame|fire/i);
  assert.match(css, /\.momentum-flames,\.momentum-set-logo\{display:none!important\}/);
  assert.match(css, /\.momentum-method b\{[\s\S]*font-size:10\.8cqw!important/);
  const studio = fs.readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
  assert.match(studio, /function drawMomentumArenaBeam\(/);
  assert.doesNotMatch(studio, /function drawMomentumFlame\(/);
});
