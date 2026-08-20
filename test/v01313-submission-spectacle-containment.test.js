import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../css/game.css", import.meta.url), "utf8");

test("v0.13.13 submission locked presentation uses its own contained spectacle class", () => {
  assert.ok(app.includes('text:"SUBMISSION LOCKED IN",kind:"submission-lock"'));
  assert.ok(app.includes('"SUBMISSION<br>LOCKED IN"'));
  assert.match(css, /\.match-spectacle\.submission-lock\{[\s\S]*safe-area-inset-left/);
  assert.match(css, /\.match-spectacle\.submission-lock \.match-spectacle-copy\{[\s\S]*max-width:calc\(100vw - 32px\)/);
  assert.match(css, /font-size:clamp\(2\.8rem,13vw,7\.2rem\)/);
});
