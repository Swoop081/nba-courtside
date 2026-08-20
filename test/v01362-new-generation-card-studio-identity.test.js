import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const studio=fs.readFileSync(new URL("../js/tools/card-art-studio.js",import.meta.url),"utf8");
const html=fs.readFileSync(new URL("../tools/card-art-studio.html",import.meta.url),"utf8");
const css=fs.readFileSync(new URL("../css/card-art-studio.css",import.meta.url),"utf8");
const logo=fs.readFileSync(new URL("../assets/branding/new-generation-series-1/new-generation-logo.svg",import.meta.url),"utf8");
const source=fs.readFileSync(new URL("../assets/branding/new-generation-series-1/SOURCE.md",import.meta.url),"utf8");

test("v0.13.62 Card Studio exposes New Generation as a development set with its own palette",()=>{
  assert.match(html,/new-generation-series-1">New Generation — Series 1 · Development/);
  assert.match(studio,/"new-generation-series-1":\{"label":"New Generation — Series 1","border":"#ffdc00"/);
  assert.match(studio,/"nameBottom":"#31e0d4"/);
  assert.match(studio,/"glow":"rgba\(238,59,159,.58\)"/);
  assert.match(css,/\.key\.new-generation\{background:linear-gradient\(110deg,#2b3990/);
});

test("v0.13.62 New Generation uses the supplied WWF New Generation logo without recolouring it",()=>{
  assert.match(studio,/"new-generation-series-1":"assets\/branding\/new-generation-series-1\/new-generation-logo\.svg"/);
  assert.match(studio,/EXPORT_SAFE_SET_LOGOS\["new-generation-series-1"\]/);
  assert.match(logo,/#fd0/);
  assert.match(logo,/#2b3990/);
  assert.match(source,/Wikimedia Commons/);
  assert.match(source,/does not recolour the logo itself/);
});

test("v0.13.62 New Generation no longer falls through to the SummerSlam renderer",()=>{
  assert.match(studio,/function drawNewGeneration\(c,w,h\)/);
  assert.match(studio,/else if\(set==="new-generation-series-1"\)drawNewGeneration\(ctx,w,h\)/);
  assert.match(studio,/#ee3b9f/);
  assert.match(studio,/#31e0d4/);
  assert.match(studio,/#ffdc00/);
  assert.match(studio,/isNewGen=id==="new-generation-series-1"/);
});
