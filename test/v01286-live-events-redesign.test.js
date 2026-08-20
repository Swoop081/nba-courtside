import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");

test("v0.12.96 Live Events uses a tower hub, Superstar-card routes and simplified detail hero",()=>{
  assert.match(app, /class=\"live-events-hub premium-screen/);
  assert.match(app, /class=\"live-tower-detail cadence-/);
  assert.match(app, /live-tower-opponent-card/);
  assert.match(app, /data-open-live-tower=/);
  assert.match(app, /detailTitle = event\.logoMode !== "legacy" \? "Today's Daily Tower" : event\.name/);
  assert.match(css, /\.live-tower-detail-stats\{[^}]*grid-template-columns:1fr 1fr/s);
  assert.match(css, /\.live-tower-detail\.event-powerhouse-collision \.live-tower-detail-art \.official-menu-superstar-photo\{height:205%/);
  assert.match(css, /\.live-tower-route-strip\{grid-auto-columns:minmax\(170px,210px\)/);
});
