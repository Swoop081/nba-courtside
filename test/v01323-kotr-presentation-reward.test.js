import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile } from '../js/data/profile.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { kingOfTheRingState, startKingOfTheRing, recordKingOfTheRingMatch, prepareKingOfTheRingReward, markKingOfTheRingCoronationSeen, claimKingOfTheRingReward } from '../js/data/king-of-the-ring.js?v=0.13.72';

const ids = Object.values(superstars).filter(s => !s.developmentOnly).map(s => s.id);
const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function winTournament(profile) {
  startKingOfTheRing(profile, 'cm-punk', ids, () => 0.314159);
  recordKingOfTheRingMatch(profile, 'win');
  recordKingOfTheRingMatch(profile, 'win');
  recordKingOfTheRingMatch(profile, 'win');
  return kingOfTheRingState(profile).activeRun;
}

test('v0.13.23 KOTR winner is crowned and persists as reigning King', () => {
  const p = createProfile('cm-punk');
  const run = winTournament(p);
  const state = kingOfTheRingState(p);
  assert.equal(run.status, 'cleared');
  assert.equal(state.reigningKingId, 'cm-punk');
  assert.ok(state.reigningKingAt);
  assert.equal(state.clears, 1);
});

test('v0.13.23 KOTR offers all three packs when exactly three released sets are supplied', () => {
  const p = createProfile('cm-punk');
  const run = winTournament(p);
  const choices = prepareKingOfTheRingReward(p, ['summerslam-series-1','hall-of-fame-series-1','evolution-series-1'], () => 0.7);
  assert.deepEqual(choices, ['summerslam-series-1','hall-of-fame-series-1','evolution-series-1']);
  assert.equal(run.coronationSeen, false);
  markKingOfTheRingCoronationSeen(p);
  assert.equal(run.coronationSeen, true);
  assert.equal(claimKingOfTheRingReward(p, 'hall-of-fame-series-1'), 'hall-of-fame-series-1');
  assert.equal(run.rewardClaimedSetId, 'hall-of-fame-series-1');
  assert.equal(p.superPackCreditsBySet['hall-of-fame-series-1'], 1);
  assert.throws(() => claimKingOfTheRingReward(p, 'evolution-series-1'), /already claimed/);
});

test('v0.13.23 KOTR locks three unique random pack choices once four or more sets are live', () => {
  const p = createProfile('cm-punk');
  const run = winTournament(p);
  const live = ['summerslam-series-1','hall-of-fame-series-1','evolution-series-1','raw-series-1','worlds-collide-series-1'];
  const choices = prepareKingOfTheRingReward(p, live, () => 0.314159);
  assert.equal(choices.length, 3);
  assert.equal(new Set(choices).size, 3);
  assert.ok(choices.every(id => live.includes(id)));
  const same = prepareKingOfTheRingReward(p, [...live].reverse(), () => 0.99);
  assert.deepEqual(same, choices, 'reward choices are persistent and cannot be rerolled by reopening the screen');
  assert.throws(() => claimKingOfTheRingReward(p, 'smackdown-series-1'), /offered/);
  assert.equal(run.rewardClaimedSetId, null);
});

test('v0.13.23 legacy cleared KOTR run cannot receive a duplicate choose-one reward after upgrade', () => {
  const p = createProfile('cm-punk');
  p.kingOfTheRing = { activeRun: { superstarId:'cm-punk', status:'cleared', stage:3, field:ids.slice(0,8) }, clears:1, bestRound:3 };
  const state = kingOfTheRingState(p);
  assert.equal(state.activeRun.rewardClaimedSetId, 'legacy-auto-reward');
  assert.equal(state.activeRun.coronationSeen, true);
  assert.deepEqual(state.activeRun.rewardChoices, []);
});

test('v0.13.23 KOTR UI includes live bracket, coronation, reigning King and choose-one reward presentation', () => {
  assert.match(app, /kotr-visual-bracket/);
  assert.match(app, /quarterfinal-view/);
  assert.match(app, /semifinal-view/);
  assert.match(app, /final-view/);
  assert.match(app, /CLAIM THE CROWN/);
  assert.match(app, /CHOOSE YOUR/);
  assert.match(app, /data-kotr-reward-set/);
  assert.match(app, /REIGNING KING/);
  assert.match(app, /Choose one boosted-odds Super Pack/);
  assert.match(css, /kotr-coronation-screen/);
  assert.match(css, /kotr-reward-grid/);
  assert.match(css, /kotr-career-king/);
});
