import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../css/game.css", import.meta.url), "utf8");

test("v0.13.14 entrance presentation removes hidden chrome spacing and centers the card stage", () => {
  assert.match(css, /body\[data-screen="entrance-intro"\] main\{[\s\S]*padding:0!important/);
  assert.match(css, /body\[data-screen="entrance-intro"\] #game\{[\s\S]*min-height:100svh!important/);
  assert.match(css, /grid-template-rows:auto auto auto minmax\(0,1fr\) auto auto!important/);
  assert.match(css, /body\[data-screen="entrance-intro"\] \.entrance-stage\{[\s\S]*height:100%!important[\s\S]*align-self:stretch!important/);
  assert.match(css, /body\[data-screen="entrance-intro"\] \.entrance-card-transition\{[\s\S]*width:min\(56vw,292px\)!important/);
});
