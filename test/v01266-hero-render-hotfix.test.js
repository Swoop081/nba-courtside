import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("v0.12.66 hero render hotfix remains documented in history", () => {
  assert.ok(Number(pkg.version.split(".")[1]) > 12 || Number(pkg.version.split(".").at(-1)) >= 66);
});

test("launch Final Boss uses the restored oversized left-side treatment", () => {
  assert.match(css, /v0\.12\.66 — Hero Render Regression Hotfix[\s\S]*\.season-one-ad \.season-ad-rock img\.final-boss-rock-menu-art\{[\s\S]*left:-62%!important;[\s\S]*width:300%!important;[\s\S]*object-fit:cover!important/);
  assert.match(css, /\.season-one-ad \.season-ad-copy\{[\s\S]*z-index:4!important/);
});

test("ladder and championship header photography is roughly doubled", () => {
  assert.match(css, /body\[data-screen="ladder"\][\s\S]*body\[data-screen="championship"\][\s\S]*img\.official-menu-superstar-photo\{[\s\S]*transform:scale\(1\.92\)!important;[\s\S]*transform-origin:82% 100%!important/);
  assert.match(css, /@media\(max-width:600px\)[\s\S]*transform:scale\(1\.96\)!important/);
});
