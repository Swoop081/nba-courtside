import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareBuildVersions, isNewerBuild, updateNavigationUrl, fetchLatestBuild } from '../js/config/update.js?v=0.13.72';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const pkg = JSON.parse(read('package.json'));
const currentVersion = pkg.version;

test('current build publishes a no-store live build manifest and boot-shell updater', () => {
  const manifest = JSON.parse(read('build.json'));
  const html = read('index.html');
  assert.equal(manifest.version, currentVersion);
  assert.match(html, /new URL\("\.\/build\.json", location\.href\)/);
  assert.match(html, /fetch\(manifest\.toString\(\), \{ cache: "no-store" \}\)/);
  assert.match(html, /location\.replace\(target\.toString\(\)\)/);
  assert.match(html, /wwe-legacy-update-attempts:/);
  assert.match(html, /Cache-Control" content="no-cache, no-store, must-revalidate/);
});

test('update version comparison only advances to a newer semantic build', () => {
  assert.equal(compareBuildVersions('0.13.28', '0.13.27'), 1);
  assert.equal(compareBuildVersions('0.13.27', '0.13.28'), -1);
  assert.equal(compareBuildVersions('0.13.28', '0.13.28'), 0);
  assert.equal(isNewerBuild('0.14.0', '0.13.99'), true);
  assert.equal(isNewerBuild('0.13.27', '0.13.28'), false);
});

test('cache-busted update navigation stays on the same origin/path so localStorage save scope is preserved', () => {
  const url = new URL(updateNavigationUrl('https://swoop081.github.io/WWE-Legacy/?foo=bar', currentVersion, 12345));
  assert.equal(url.origin, 'https://swoop081.github.io');
  assert.equal(url.pathname, '/WWE-Legacy/');
  assert.equal(url.searchParams.get('foo'), 'bar');
  assert.equal(url.searchParams.get('build'), currentVersion);
  assert.equal(url.searchParams.get('_update'), '12345');
});

test('live manifest request carries a unique timestamp and no-store cache mode', async () => {
  let calledUrl = '', calledOptions = null;
  const latest = await fetchLatestBuild(async (url, options) => {
    calledUrl = url; calledOptions = options;
    return { ok: true, status: 200, json: async () => ({ version: '0.13.29' }) };
  }, { baseUrl: `https://swoop081.github.io/WWE-Legacy/?build=${currentVersion}`, now: 777 });
  assert.equal(latest, '0.13.29');
  assert.equal(calledOptions.cache, 'no-store');
  assert.equal(new URL(calledUrl).pathname, '/WWE-Legacy/build.json');
  assert.equal(new URL(calledUrl).searchParams.get('_'), '777');
});

test('app checks on foreground, defers during an active match, and exposes a manual My Legacy check', () => {
  const app = read('js/ui/app.js');
  assert.match(app, /activeMatchBlocksUpdate\(\)/);
  assert.match(app, /screen === "match"/);
  assert.match(app, /visibilitychange/);
  assert.match(app, /pageshow/);
  assert.match(app, /CHECK FOR UPDATE/);
  assert.match(app, /UPDATE NOW/);
  assert.match(app, /UPDATE READY · v/);
  assert.doesNotMatch(app, /localStorage\.clear\(\)/);
});

test('clean packaging includes build.json so the deployed version endpoint cannot be omitted', () => {
  const packager = read('tools/package-clean.mjs');
  assert.match(packager, /"build\.json"/);
  const stamper = read('tools/stamp-cache-version.mjs');
  assert.match(stamper, /entry\.name==="build\.json"/);
  assert.match(stamper, /currentBuild/);
});
