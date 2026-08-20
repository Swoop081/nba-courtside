import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");

test("v0.12.79 keeps Deck Lab inspection at the same roughly 60% viewport scale as in-match card zoom", () => {
  assert.match(css, /\.deck-lab-card-modal-inner\{[^}]*height:min\(64svh,620px\)!important/);
  assert.match(css, /\.deck-lab-inspect-card\{[^}]*height:min\(60svh,580px\)!important/);
  assert.match(css, /@media\(max-width:430px\)\{\.deck-lab-card-modal-inner\{height:min\(62svh,570px\)!important\}\.deck-lab-inspect-card\{height:min\(58svh,540px\)!important/);
  assert.match(css, /\.play-pile-modal-card\{height:min\(60svh,580px\)/);
});

test("v0.12.79 preserves Deck Lab tap-to-flip and dismiss controls while reducing only inspect scale", () => {
  assert.match(app, /data-flip-deck-lab-modal="1"/);
  assert.match(app, /data-close-deck-lab-modal="1"/);
  assert.match(app, /data-deck-lab-modal-backdrop="1"/);
  assert.match(app, /deckLabInspectFlipped = !deckLabInspectFlipped/);
});
