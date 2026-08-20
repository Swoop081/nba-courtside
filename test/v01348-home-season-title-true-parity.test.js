import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");

test("v0.13.48 Season One and Deck Lab use the exact same shared strong title component", () => {
  assert.match(app, /homeHubSplitTitle\("SEASON", "ONE"\)/);
  assert.match(app, /homeHubSplitTitle\("DECK", "LAB"\)/);
  assert.match(app, /return `<strong class="legacy-command-title"><span>\$\{firstWord\}<\/span> <b>\$\{accentWord\}<\/b><\/strong>`/);
});

test("v0.13.48 removes the obsolete Season-only monospace cascade and pins one Home title contract", () => {
  assert.doesNotMatch(css, /\.legacy-season-copy>strong\{font:1000[^}]*ui-monospace/);
  assert.match(css, /\/\* v0\.13\.48 — Home Season Title True Parity Hotfix\.[\s\S]*?\.legacy-command-title\{[\s\S]*?font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;[\s\S]*?font-size:1\.48rem!important;[\s\S]*?line-height:\.9!important;[\s\S]*?letter-spacing:-\.045em!important;[\s\S]*?font-style:italic!important;[\s\S]*?font-weight:1000!important;[\s\S]*?text-shadow:none!important;/);
  assert.match(css, /\.legacy-season-event\{--command-accent:#55e4ff!important\}/);
  assert.match(css, /@media\(max-width:390px\)\{\.legacy-command-title\{font-size:1\.35rem!important\}\}/);
});
