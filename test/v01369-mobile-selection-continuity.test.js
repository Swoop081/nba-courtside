import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");

test("v0.13.69 Superstar carousels preserve horizontal browse position when selection rerenders", () => {
  assert.match(app, /const preservedScrollLeft = carousel\?\.scrollLeft \?\? 0/);
  assert.match(app, /const restoreScroll = \(\) => requestAnimationFrame/);
  assert.match(app, /\.superstar-select-carousel\[data-carousel="\$\{context\}"\]/);
  assert.match(app, /replacement\.scrollLeft = preservedScrollLeft/);
  assert.match(app, /wireSelectionCarousel\('ladder-select', id => \{ selection\.p1 = id; renderLadder\(\); \}\)/);
  assert.match(app, /wireSelectionCarousel\('live-event-select', id => \{ selection\.p1 = id; renderLiveEvents\(\); \}\)/);
});

test("v0.13.69 Pack Complete puts the highest-rarity pull in the true center slot", () => {
  assert.match(app, /const featuredSummaryIndex = pulls\.reduce/);
  assert.match(app, /Number\(p\?\.card\?\.rarity \?\? 0\) - Number\(best\?\.card\?\.rarity \?\? 0\)/);
  assert.match(app, /Number\(Boolean\(p\?\.isNewCard\)\) - Number\(Boolean\(best\?\.isNewCard\)\)/);
  assert.match(app, /Number\(Boolean\(p\?\.foil\)\) - Number\(Boolean\(best\?\.foil\)\)/);
  assert.match(app, /featuredSummaryEntry \? \{\.\.\.featuredSummaryEntry,slot:summarySlots\[2\]\}/);
  assert.match(app, /summaryLayout\.map\(\(\{p,index,slot\}\)=>summaryCard\(p,index,slot\)\)/);
});

test("v0.13.69 Live Event setup keeps its selector CTA above the fold on iPhone", () => {
  assert.match(css, /\.live-tower-detail\.is-setup-tower\{[\s\S]*?height:100%!important;[\s\S]*?display:flex!important;[\s\S]*?overflow:hidden!important/);
  assert.match(css, /\.live-tower-detail\.is-setup-tower \.live-tower-detail-body\{[\s\S]*?grid-template-rows:minmax\(218px,1\.45fr\) minmax\(104px,\.72fr\)!important/);
  assert.match(css, /\.live-tower-detail\.is-setup-tower \.select-superstar-card\{[\s\S]*?width:min\(29vw,108px\)!important;[\s\S]*?height:min\(20svh,174px\)!important/);
  assert.match(css, /\.live-tower-detail\.is-setup-tower #start-live-event\{[\s\S]*?z-index:6!important;[\s\S]*?height:44px!important/);
});
