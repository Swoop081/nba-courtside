import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");

test("candidate card images stay visually hidden until a real asset loads", () => {
  assert.match(app, /ccg-layered-card-plate ccg-load-guard/);
  assert.match(app, /ccg-finished-card-art-image ccg-load-guard/);
  assert.match(app, /ccg-authored-card-art-image ccg-load-guard/);
  assert.match(app, /onload="this\.classList\.add\('is-art-ready'\)/);
  assert.match(css, /\.ccg-card-art img\.ccg-load-guard\{opacity:0!important\}/);
  assert.match(css, /\.ccg-card-art img\.ccg-load-guard\.is-art-ready\{opacity:1!important/);
});

test("match hand and play pile request card art eagerly", () => {
  assert.match(app, /extraClass:"play-pile-ccg",eagerArt:true/);
  assert.match(app, /extraClass:`hand-ccg \${legal \? "playable" : "locked"}`,eagerArt:true/);
  assert.match(app, /const loading = eager \? "eager" : "lazy"/);
});

test("layered fallback does not retry the same legacy custom URL twice", () => {
  assert.match(app, /legacyFinished && legacyFinished !== finished \? legacyFinished : ""/);
});
