import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const version = pkg.version;
const requested = process.argv[2];
const out = requested
  ? path.resolve(process.cwd(), requested)
  : path.resolve(root, `../wwe-legacy-ccg-v${version}-clean`);

const rootFiles = [
  ".nojekyll",
  "index.html",
  "build.json",
  "manifest.webmanifest",
  "package.json",
  "README.md",
  `RELEASE-NOTES-v${version}.md`,
  "BUILD-CERTIFICATION.md",
];
const rootDirs = ["assets", "css", "js", "test", "tools"];

const obsoleteAssetPaths = [
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

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of rootFiles) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) continue;
  fs.cpSync(src, path.join(out, file), { recursive: false });
}
for (const dir of rootDirs) {
  const src = path.join(root, dir);
  if (!fs.existsSync(src)) continue;
  fs.cpSync(src, path.join(out, dir), {
    recursive: true,
    filter: (srcPath) => {
      const name = path.basename(srcPath);
      return name !== ".DS_Store" && name !== "Thumbs.db";
    },
  });
}
for (const rel of obsoleteAssetPaths) {
  fs.rmSync(path.join(out, rel), { recursive: true, force: true });
}

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(full);
  }
}
walk(out);

const historicalRootDebris = files.filter((file) => {
  if (path.dirname(file) !== out) return false;
  const name = path.basename(file);
  if (/^(TEST|FLOW|CARD-ID|ART|VALIDATION|BALANCE|COUNTER|DEAD-TURN|FINAL-BALANCE|ECONOMY|AI|HP|STUDIO|DEEP-MATCH|MOMENTUM|POSSESSION|CPU)-/i.test(name)) return true;
  if (/^RELEASE-NOTES-v/i.test(name) && name !== `RELEASE-NOTES-v${version}.md`) return true;
  return false;
});
if (historicalRootDebris.length) {
  throw new Error(`Package hygiene failure: ${historicalRootDebris.map((f) => path.basename(f)).join(", ")}`);
}

const bytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
console.log(JSON.stringify({ version, output: out, files: files.length, bytes }, null, 2));
