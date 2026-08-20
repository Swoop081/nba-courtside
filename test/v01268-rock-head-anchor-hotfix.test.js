import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const css = fs.readFileSync(path.join(root, "css/game.css"), "utf8");

test("v0.12.68 Final Boss head-anchor hotfix remains documented in history", () => {
  assert.ok(Number(pkg.version.split(".")[1]) > 12 || Number(pkg.version.split(".").at(-1)) >= 68);
  assert.match(css, /v0\.12\.68 — Final Boss Head Anchor Hotfix/);
});

test("launch Rock keeps v0.12.67 scale and shifts down on iPhone", () => {
  const prior = css.slice(css.lastIndexOf("/* v0.12.67 — Hero Anchor & Containment Repair."), css.lastIndexOf("/* v0.12.68 — Final Boss Head Anchor Hotfix."));
  const hotfixStart = css.lastIndexOf("/* v0.12.68 — Final Boss Head Anchor Hotfix.");
  const nextBlock = css.indexOf("/*", hotfixStart + 4);
  const hotfix = css.slice(hotfixStart, nextBlock > hotfixStart ? nextBlock : undefined);
  assert.match(prior, /@media\(max-width:430px\)[\s\S]*width:196%!important;[\s\S]*height:164%!important/);
  assert.match(hotfix, /@media\(max-width:430px\)[\s\S]*bottom:-50%!important/);
  assert.doesNotMatch(hotfix, /\n\s*width\s*:/);
  assert.doesNotMatch(hotfix, /\n\s*height\s*:/);
  assert.doesNotMatch(hotfix, /\n\s*transform\s*:/);
});
