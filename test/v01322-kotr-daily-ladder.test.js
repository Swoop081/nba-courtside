import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile } from '../js/data/profile.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { LADDER_LENGTH, LADDER_LIVES, ladderState, startLadderRun, recordLadderMatch } from '../js/data/ladder.js?v=0.13.72';
import { KING_OF_THE_RING_ROUNDS, kingOfTheRingState, startKingOfTheRing, recordKingOfTheRingMatch } from '../js/data/king-of-the-ring.js?v=0.13.72';
import { CAREER_MODES } from '../js/data/career.js?v=0.13.72';

const ids = Object.values(superstars).filter(s => !s.developmentOnly).map(s => s.id);
const fixedRng = () => 0.314159;
const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');

function winDailyLadder(profile, now) {
  for (let i = 0; i < LADDER_LENGTH; i += 1) recordLadderMatch(profile, 'win', now);
}

test('v0.13.24 Money in the Bank uses one fixed 8-opponent tower, three lives and a local-day reset', () => {
  const p = createProfile('cm-punk');
  const day1 = new Date(2026, 7, 18, 12, 0, 0);
  const day2 = new Date(2026, 7, 19, 0, 1, 0);
  const run = startLadderRun(p, 'cm-punk', ids, fixedRng, 'daily', day1);
  assert.equal(run.opponents.length, LADDER_LENGTH);
  assert.equal(run.lives, LADDER_LIVES);
  const opponents = [...run.opponents];
  recordLadderMatch(p, 'loss', day1);
  recordLadderMatch(p, 'loss', day1);
  const failed = recordLadderMatch(p, 'loss', day1);
  assert.equal(failed.status, 'failed');
  p.ladder.activeRun = null;
  const retry = startLadderRun(p, 'cm-punk', ids, () => 0.99, 'daily', day1);
  assert.deepEqual(retry.opponents, opponents, 'restarts use the same daily field');
  winDailyLadder(p, day1);
  assert.equal(p.ladder.dailyCleared, true);
  assert.equal(p.ladder.completionPackCreditsBySet['summerslam-series-1'], 0);
  assert.equal(p.superPackCreditsBySet['summerslam-series-1'], 1);
  assert.throws(() => startLadderRun(p, 'cm-punk', ids, fixedRng, 'daily', day1), /already complete/);
  const fresh = ladderState(p, day2);
  assert.equal(fresh.dailyCleared, false);
  assert.equal(fresh.dailyOpponents.length, 0);
  assert.equal(fresh.activeRun, null);
});

test('v0.13.22 old standalone Ladder runs are retired without deleting earned history/reward packs', () => {
  const p = createProfile('cm-punk');
  p.ladder = { activeRun: { branchId: 'modern', status: 'active', rung: 4 }, clears: 3, bestRung: 8, completionPackCredits: 2, completionPackCreditsBySet: { 'summerslam-series-1': 2 } };
  const migrated = ladderState(p, new Date(2026, 7, 18, 12, 0, 0));
  assert.equal(migrated.activeRun, null);
  assert.equal(migrated.clears, 3);
  assert.equal(migrated.completionPackCreditsBySet['summerslam-series-1'], 2);
});

test('v0.13.22 King of the Ring is an 8-person, three-round single-elimination tournament', () => {
  const p = createProfile('roman-reigns');
  let run = startKingOfTheRing(p, 'roman-reigns', ids, fixedRng);
  assert.equal(run.field.length, 8);
  assert.equal(new Set(run.field).size, 8);
  assert.equal(run.opponents.length, KING_OF_THE_RING_ROUNDS.length);
  const loss = recordKingOfTheRingMatch(p, 'loss');
  assert.equal(loss.status, 'eliminated');
  run = startKingOfTheRing(p, 'roman-reigns', ids, fixedRng);
  assert.equal(recordKingOfTheRingMatch(p, 'win').status, 'advance');
  assert.equal(recordKingOfTheRingMatch(p, 'win').status, 'advance');
  assert.equal(recordKingOfTheRingMatch(p, 'win').status, 'cleared');
  assert.equal(kingOfTheRingState(p).clears, 1);
});

test('v0.13.24 Play keeps KOTR while Money in the Bank lives only in Live Events', () => {
  assert.match(app, /id="play-kotr"/);
  assert.match(app, /modeLogoMarkup\("king-of-the-ring",true\)/);
  assert.doesNotMatch(app, /id="play-ladder"/);
  assert.match(app, /id="open-money-in-bank"/);
  const challenges = app.slice(app.indexOf('function renderChallenges()'), app.indexOf('function beginLiveEventTower()'));
  assert.doesNotMatch(challenges, /open-money-in-bank|Climb the Ladder/);
  assert.ok(CAREER_MODES.some(mode => mode.id === 'king-of-the-ring'));
  assert.ok(CAREER_MODES.some(mode => mode.id === 'ladder' && /Money in the Bank/.test(mode.label)));
});
