import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const currentReleaseNotes = `RELEASE-NOTES-v${packageJson.version}.md`;

const deadAssets = [
  "assets/cards/art/superstars",
  "assets/cards/art/temp/bobby-heenan.webp",
  "assets/cards/art/temp/generic-wrestling-action.webp",
  "assets/cards/art/temp/miss-elizabeth.webp",
  "assets/cards/art/temp/paul-bearer.webp",
  "assets/art/evolution-series-1/superstars",
  "assets/art/summerslam-series-1/summerslam-2026-logo.webp",
  "assets/branding/worlds-collide-series-1/worlds-collide-official.jpeg",
  "assets/branding/money-in-the-bank-series-1/money-in-the-bank-logo-official.png",
  "assets/branding/smackdown-series-1/smackdown-logo.svg",
];

test("v0.12.69 clean root ships no historical audit debris", () => {
  const names = fs.readdirSync(root);
  const debris = names.filter((name) =>
    /^(TEST|FLOW|CARD-ID|ART|VALIDATION|BALANCE|COUNTER|DEAD-TURN|FINAL-BALANCE|ECONOMY|AI|HP|STUDIO|DEEP-MATCH|MOMENTUM|POSSESSION|CPU)-/i.test(name)
  );
  assert.deepEqual(debris, []);
  const oldNotes = names.filter((name) => /^RELEASE-NOTES-v/i.test(name) && name !== currentReleaseNotes);
  assert.deepEqual(oldNotes, []);
});

test("v0.12.69 confirmed-dead legacy image assets are removed", () => {
  for (const rel of deadAssets) assert.equal(fs.existsSync(path.join(root, rel)), false, rel);
});

test("v0.12.69 live presentation assets remain installed", () => {
  for (const rel of [
    "assets/art/season-1-final-boss/the-rock-final-boss-menu.png",
    "assets/art/wwe-menu-superstars/roman-reigns.webp",
    "assets/art/summerslam-series-1/summerslam-2026-logo.png",
    "assets/art/evolution-series-1/evolution-logo.png",
    "assets/branding/worlds-collide-series-1/worlds-collide-logo.webp",
    "assets/branding/money-in-the-bank-series-1/money-in-the-bank-logo.webp",
    "assets/branding/smackdown-series-1/smackdown-logo-official.png",
    "assets/cards/art/temp/superstar-placeholder.svg",
  ]) assert.equal(fs.existsSync(path.join(root, rel)), true, rel);
});

test("v0.12.69 clean packager is wired into package.json", () => {
  assert.match(packageJson.version, /^0\.\d+\.\d+$/);
  assert.equal(packageJson.scripts["package-clean"], "node tools/package-clean.mjs");
  assert.equal(fs.existsSync(path.join(root, "tools/package-clean.mjs")), true);
});

test("v0.12.69 explicit live asset references resolve after cleanup", () => {
  const textFiles = [];
  for (const rel of ["index.html", "manifest.webmanifest", "css", "js"]) {
    const start = path.join(root, rel);
    if (!fs.existsSync(start)) continue;
    const stat = fs.statSync(start);
    if (stat.isFile()) textFiles.push(start);
    else {
      const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (/\.(?:js|mjs|css|html|json|webmanifest)$/i.test(entry.name)) textFiles.push(full);
        }
      };
      walk(start);
    }
  }
  const refs = new Set();
  const re = /assets\/[A-Za-z0-9_./-]+\.(?:png|webp|jpe?g|svg)/g;
  for (const file of textFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(re)) refs.add(match[0]);
  }
  const missing = [...refs].filter((rel) => !rel.includes("assets/cards/art/custom/") && !fs.existsSync(path.join(root, rel)));
  assert.deepEqual(missing, []);
});
