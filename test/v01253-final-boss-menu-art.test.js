import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const artwork=fs.readFileSync(new URL("../js/data/artwork.js", import.meta.url),"utf8");
const app=fs.readFileSync(new URL("../js/ui/app.js", import.meta.url),"utf8");
const css=fs.readFileSync(new URL("../css/game.css", import.meta.url),"utf8");

test("v0.12.53 uses the dedicated uploaded Final Boss Rock render on all Final Boss menu surfaces",()=>{
  assert.match(artwork,/the-rock-final-boss-menu\.png/);
  assert.match(artwork,/export const finalBossRockMenuArtwork/);
  assert.equal((app.match(/finalBossRockMarkup\(\)/g)||[]).length,3);
  assert.match(app,/season-ad-rock.*finalBossRockMarkup/s);
  assert.match(app,/legacy-season-rock.*finalBossRockMarkup/s);
  assert.match(app,/season-road-rock.*finalBossRockMarkup/s);
  assert.match(css,/\.final-boss-rock-menu-art/);
});

test("v0.12.53 does not add The Rock back into the dedicated 12-person general menu-render pool",()=>{
  const pool=artwork.match(/const rawMenuSuperstarArtwork = \{([\s\S]*?)\n\};/)[1];
  assert.doesNotMatch(pool,/"the-rock"/);
});
