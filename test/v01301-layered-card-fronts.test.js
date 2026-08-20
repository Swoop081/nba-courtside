import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { layeredCardArtFor } from "../js/data/artwork.js?v=0.13.72";

const fronts = fs.readFileSync(new URL("../js/data/card-fronts.js", import.meta.url), "utf8");
const artwork = fs.readFileSync(new URL("../js/data/artwork.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
const studio = fs.readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
const studioHtml = fs.readFileSync(new URL("../tools/card-art-studio.html", import.meta.url), "utf8");

test("layered fronts are automatic candidates with flat-front fallback and no manual registry", () => {
  assert.doesNotMatch(fronts, /LAYERED_FRONT_IDS/);
  assert.doesNotMatch(artwork, /usesLayeredFront/);
  const stunner = layeredCardArtFor({ id: "kevin-owens-stunner", kind: "move" });
  assert.match(stunner, /assets\/cards\/art\/layered\/moves\/kevin-owens-stunner\.webp/);
  assert.match(app, /data-layered-candidate="1"/);
  assert.match(app, /data-flat-finished-art/);
  assert.match(app, /data-legacy-finished-art/);
  assert.match(app, /classList\.add\('has-layered-asset'\)/);
  assert.match(app, /classList\.remove\('is-layered-front','has-layered-asset'\)/);
  assert.match(css, /is-layered-front:not\(\.has-layered-asset\).*visibility:hidden/);
});

test("Card Art Studio exports Layered v1 clean plates and documents automatic fallback", () => {
  assert.match(studioHtml, /Layered v1 · Recommended/);
  assert.match(studioHtml, /Final Card · Live data visible/);
  assert.match(studioHtml, /Art Plate · Saved image only/);
  assert.match(studioHtml, /AUTOMATIC FALLBACK:/);
  assert.match(studioHtml, /use it automatically/);
  assert.match(studio, /state\.renderPlateOnly/);
  assert.match(studio, /if\(state\.renderPlateOnly\)\{ctx\.restore\(\);return;\}/);
  assert.match(studio, /if\(!state\.renderPlateOnly\)drawRarityStars\(\)/);
  assert.match(studio, /state\.exportingPlate=isLayeredFormat\(\)/);
  assert.match(studio, /assets\/cards\/art\/layered/);
  assert.doesNotMatch(studio, /registered in js\/data\/card-fronts\.js/);
});

test("live layered overlay is driven from canonical card data", () => {
  assert.match(app, /\$\{card\.cost \?\? 0\}/);
  assert.match(app, /\$\{card\.damage \?\? 0\}/);
  assert.match(app, /layeredFrontRequirementText\(card\)/);
  assert.match(app, /rarityStars\(card\.rarity \?\? 1\)/);
  assert.match(app, /\$\{card\.name\}/);
});
