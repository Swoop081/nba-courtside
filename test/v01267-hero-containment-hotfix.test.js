import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const css = fs.readFileSync(path.join(root, "css/game.css"), "utf8");

test("v0.12.67 stamps the hero containment repair", () => {
  assert.match(css, /v0\.12\.67 — Hero Anchor & Containment Repair/);
});

test("launch Rock uses contained artwork rather than v0.12.66 cover crop", () => {
  const block = css.slice(css.lastIndexOf("/* v0.12.67 — Hero Anchor & Containment Repair."));
  assert.match(block, /\.season-one-ad\{[\s\S]*overflow:hidden!important/);
  assert.match(block, /img\.final-boss-rock-menu-art\{[\s\S]*left:-7%!important;[\s\S]*width:188%!important;[\s\S]*object-fit:contain!important/);
  assert.doesNotMatch(block, /object-fit:cover!important/);
});

test("premium run portraits are enlarged but no longer use the broken near-2x transform", () => {
  const block = css.slice(css.lastIndexOf("/* v0.12.67 — Hero Anchor & Containment Repair."));
  assert.match(block, /inset:0 -1% 0 46%!important/);
  assert.match(block, /transform:scale\(1\.30\)!important/);
  assert.match(block, /@media\(max-width:600px\)[\s\S]*transform:scale\(1\.32\)!important/);
  assert.doesNotMatch(block, /scale\(1\.9[0-9]\)/);
});
