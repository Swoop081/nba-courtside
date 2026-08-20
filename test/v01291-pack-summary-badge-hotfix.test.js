import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boosterCreditsFor } from '../js/data/boosters.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.91 legacy SummerSlam booster mirror cannot leak into other set buckets',()=>{
  const profile = { boosterCredits: 1, boosterCreditsBySet: { 'summerslam-series-1': 0, 'raw-series-1': 1 } };
  assert.equal(boosterCreditsFor(profile, 'summerslam-series-1'), 0);
  assert.equal(boosterCreditsFor(profile, 'hall-of-fame-series-1'), 0);
  assert.equal(boosterCreditsFor(profile, 'raw-series-1'), 1);
});

test('v0.12.91 Packs attention and chrome counts use only currently openable live-set credits',()=>{
  assert.match(app, /function openablePackCount\(p\)/);
  assert.match(app, /return CURRENT_PLAYER_SET_IDS\.reduce/);
  assert.match(app, /const boosters = openablePackCount\(profile\);/);
  assert.match(app, /const packCount = openablePackCount\(profile\);/);
  assert.match(app, /const allBoosterCredits = openablePackCount\(profile\);/);
});

test('v0.12.91 every pack-summary pull uses the same card width and aspect ratio including center and UP conversion',()=>{
  assert.match(css, /\.pack-summary-card\.actual-card-summary,\n\.pack-summary-card\.actual-card-summary\.summary-center\{\n  width:min\(40vw,166px\)!important;/);
  assert.match(css, /\.pack-summary-actual-card\{[\s\S]*aspect-ratio:\.68!important;/);
  assert.match(css, /\.pack-summary-actual-card>\.summary-up-reward\{[\s\S]*aspect-ratio:\.68!important;/);
});
