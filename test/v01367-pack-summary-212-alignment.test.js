import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");

test("v0.13.67 pack summary is a centered 2 / 1 / 2 formation", () => {
  assert.match(app, /const summarySlots = \["summary-top-left","summary-top-right","summary-center","summary-bottom-left","summary-bottom-right"\]/);
  assert.match(app, /const summaryLayout = \[/);
  assert.match(app, /slot:summarySlots\[2\]/);
  assert.match(app, /summaryLayout\.map\(\(\{p,index,slot\}\)=>summaryCard\(p,index,slot\)\)/);

  assert.match(css, /\.summary-top-left\{grid-column:2\/span 2!important;grid-row:1!important\}/);
  assert.match(css, /\.summary-top-right\{grid-column:4\/span 2!important;grid-row:1!important\}/);
  assert.match(css, /\.summary-center\{grid-column:3\/span 2!important;grid-row:2!important\}/);
  assert.match(css, /\.summary-bottom-left\{grid-column:2\/span 2!important;grid-row:3!important\}/);
  assert.match(css, /\.summary-bottom-right\{grid-column:4\/span 2!important;grid-row:3!important\}/);
  assert.doesNotMatch(css, /pack-summary-compact-grid>\.pack-summary-card:nth-child\(-n\+3\)/);
  assert.match(css, /\.pack-summary-card\.actual-card-summary,\s*\.pack-summary-card\.actual-card-summary\.summary-center\{[\s\S]*?width:min\(40vw,166px\)!important/);
});
