import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile } from '../js/data/profile.js?v=0.13.72';
import {
  CHAMPIONSHIP_ROAD_LENGTH,
  CHAMPIONSHIP_ROAD_OPPONENTS,
  CHAMPIONSHIP_ROAD_SECTIONS,
  CHAMPIONSHIP_DIFFICULTY_ORDER,
  championshipDifficultyUnlocked,
  championshipRoadDifficultyModifier,
  championshipRoadState,
  startChampionshipRoad,
  recordChampionshipMatch
} from '../js/data/championship-road.js?v=0.13.72';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

const EXPECTED_ROAD = [
  'hulk-hogan','andre-the-giant','randy-savage','ultimate-warrior',
  'cm-punk','seth-rollins','roman-reigns','kevin-owens',
  'iyo-sky','bayley','paige','stephanie-vaquer',
  'mankind','kane','the-undertaker','stone-cold-steve-austin',
  'cody-rhodes','oba-femi','brock-lesnar','gunther',
  'charlotte-flair','rhea-ripley','liv-morgan','becky-lynch'
];

function clearRoad(profile, difficultyId, superstarId = 'cm-punk') {
  const run = startChampionshipRoad(profile, superstarId, [], () => 0.42, difficultyId);
  assert.equal(run.opponents.length, 24);
  let outcome = null;
  const sectionEnds = [];
  for (let i = 1; i <= 24; i += 1) {
    outcome = recordChampionshipMatch(profile, 'win');
    if (outcome.sectionCleared) sectionEnds.push(outcome.sectionCleared.end);
  }
  assert.deepEqual(sectionEnds, [4,8,12,16,20,24]);
  assert.equal(outcome.status, 'cleared');
  return outcome;
}

test('v0.13.24 Championship Road is the approved 24-match six-theme Season 1 campaign', () => {
  assert.equal(CHAMPIONSHIP_ROAD_LENGTH, 24);
  assert.deepEqual(CHAMPIONSHIP_ROAD_OPPONENTS, EXPECTED_ROAD);
  assert.deepEqual(CHAMPIONSHIP_ROAD_SECTIONS.map(section => [section.start, section.end, section.label]), [
    [1,4,'Golden Era'],
    [5,8,'SummerSlam · Part I'],
    [9,12,'Evolution · Part I'],
    [13,16,'Attitude Era'],
    [17,20,'SummerSlam · Part II'],
    [21,24,'Evolution · Part II']
  ]);
});

test('v0.13.24 Championship Road difficulty gates Easy → Normal → Hard → Hardcore across 96 matches', () => {
  const p = createProfile('cm-punk');
  assert.deepEqual(CHAMPIONSHIP_DIFFICULTY_ORDER, ['easy','normal','hard','hardcore']);
  assert.equal(championshipDifficultyUnlocked(p, 'easy'), true);
  assert.equal(championshipDifficultyUnlocked(p, 'normal'), false);
  assert.throws(() => startChampionshipRoad(p, 'cm-punk', [], Math.random, 'normal'), /previous difficulty|Easy/i);

  let result = clearRoad(p, 'easy');
  assert.equal(result.unlockedDifficulty, 'normal');
  assert.equal(championshipDifficultyUnlocked(p, 'normal'), true);
  result = clearRoad(p, 'normal');
  assert.equal(result.unlockedDifficulty, 'hard');
  result = clearRoad(p, 'hard');
  assert.equal(result.unlockedDifficulty, 'hardcore');
  result = clearRoad(p, 'hardcore');
  assert.equal(result.unlockedDifficulty, null);

  const state = championshipRoadState(p);
  assert.equal(Object.values(state.clearsByDifficulty).reduce((sum, value) => sum + value, 0), 4);
  assert.deepEqual(state.unlockedDifficulties, ['easy','normal','hard','hardcore']);
  assert.equal(Object.values(state.bestStageByDifficulty).reduce((sum, value) => sum + value, 0), 96);
});

test('v0.13.24 Championship Road HP modifiers affect only the CPU side at the approved values', () => {
  assert.deepEqual(championshipRoadDifficultyModifier('easy').startingHpLoss, { p2: 5 });
  assert.equal(championshipRoadDifficultyModifier('easy').startingHpBonus, undefined);
  assert.equal(championshipRoadDifficultyModifier('normal').startingHpLoss, undefined);
  assert.equal(championshipRoadDifficultyModifier('normal').startingHpBonus, undefined);
  assert.deepEqual(championshipRoadDifficultyModifier('hard').startingHpBonus, { p2: 5 });
  assert.deepEqual(championshipRoadDifficultyModifier('hardcore').startingHpBonus, { p2: 10 });
});

test('v0.13.24 Money in the Bank is a dedicated Live Event and absent from My Challenges', () => {
  const challenges = app.slice(app.indexOf('function renderChallenges()'), app.indexOf('function beginLiveEventTower()'));
  const liveEvents = app.slice(app.indexOf('function renderLiveEventHub()'), app.indexOf('function renderLiveEvents()'));
  assert.doesNotMatch(challenges, /Climb the Ladder|Money in the Bank/i);
  assert.match(liveEvents, /open-money-in-bank/);
  assert.match(liveEvents, /Money in the Bank/i);
  assert.doesNotMatch(app, /CLIMB THE LADDER/);
});

test('v0.13.24 KOTR bracket scrolls at eight and contracts for semifinal and final rounds', () => {
  assert.match(app, /kotr-visual-bracket/);
  assert.match(app, /quarterfinal-view/);
  assert.match(app, /semifinal-view/);
  assert.match(app, /final-view/);
  assert.match(css, /\.quarterfinal-view/);
  assert.match(css, /overflow-x:auto/);
  assert.match(css, /\.semifinal-view/);
  assert.match(css, /\.final-view/);
});

test('v0.13.24 Season Road is a visual 100-tier track, countdown and current-tier auto-focus', () => {
  assert.match(app, /season-reward-road/);
  assert.match(app, /data-season-end-countdown/);
  assert.match(app, /100-TIER REWARD ROAD/);
  assert.match(app, /const currentTier=Math\.max\(1,Math\.min\(SEASON_TIER_COUNT,progress\.tier\)\)/);
  assert.match(app, /scroller\.scrollTo\(\{top:Math\.max\(0,targetTop-focusOffset\),left:0,behavior:'auto'\}\)/);
  assert.match(css, /\.season-road-spine/);
  assert.match(css, /\.season-road-node\.major/);
});

test('v0.13.54 Store and core library screens use the consolidated iPhone presentation contracts', () => {
  assert.match(app, /store-superstar-product-list/);
  assert.match(app, /store-superstar-offer/);
  assert.match(app, /FEATURED BOOSTER/);
  assert.match(app, /FEATURED SUPERSTARS/);
  assert.doesNotMatch(app, /store-set-banner/);
  assert.match(css, /\.store-superstar-product-list\{[\s\S]*grid-template-columns:1fr!important/);
  assert.match(css, /\.store-superstar-product-list \.store-booster-offer\.store-superstar-offer/);
  assert.match(css, /\.store-offer-price>b/);
  assert.match(css, /#ffd968|#f4c84b|#e5b944/i);
  assert.match(app, /booster-compact-screen/);
  assert.match(app, /collection-quickbar/);
  assert.match(app, /catalogue-quickbar/);
  assert.match(app, /profile-command-band-top/);
});

test('v0.13.24 Exhibition and Challenges use compact content-first layouts', () => {
  assert.match(app, /exhibition-select-hero/);
  assert.match(app, /exhibition-selector-panel/);
  assert.match(css, /\.exhibition-selector-panel/);
  assert.match(app, /challenge-overview-strip/);
  assert.match(app, /premium-challenge-card/);
  assert.match(app, /set-milestone-section/);
});
