import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const content = fs.readFileSync(new URL('../js/data/content.js', import.meta.url), 'utf8');
const challenges = fs.readFileSync(new URL('../js/data/challenges.js', import.meta.url), 'utf8');

function between(source, start, end) {
  const a = source.indexOf(start);
  assert.notEqual(a, -1, `Missing start marker: ${start}`);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(b, -1, `Missing end marker: ${end}`);
  return source.slice(a, b);
}

test('v0.12.72 renames Electric Chair Facebuster to Electric Chair Drop without changing identity', async () => {
  const { allGameplayCards } = await import('../js/data/content.js?v=0.13.72');
  const card = allGameplayCards.find(c => c.id === 'rhea-ripley-electric-chair-facebuster');
  assert.ok(card);
  assert.equal(card.name, 'Electric Chair Drop');
  assert.doesNotMatch(content, /Electric Chair Facebuster/);
});

test('v0.12.72 Daily Login Booster is one full-width purple state control', () => {
  const season = between(app, 'function renderSeasons()', 'function renderChallenges()');
  assert.match(season, /CLAIM FREE BOOSTER/);
  assert.match(season, /NEXT FREE BOOSTER IN \$\{formatDailyHoursMinutes\(free\.msRemaining\)\}/);
  assert.doesNotMatch(season, /season-free-pack-copy|data-free-pack-copy/);
  assert.match(css, /\.season-free-pack-cta\{[\s\S]*width:100%!important/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*display:flex!important/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*width:100%!important/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*justify-content:center!important/);
});

test('v0.13.24 Money in the Bank uses Level wording everywhere player-facing', () => {
  const ladder = between(app, 'function renderLadder()', 'function renderChampionship()');
  assert.match(ladder, /LEVEL \${run\.rung \+ 1} OF \${LADDER_LENGTH}/);
  assert.match(ladder, /NEXT LEVEL/);
  assert.match(ladder, /FIGHT LEVEL/);
  assert.doesNotMatch(ladder, />NEXT RUNG|Fight Rung|`Rung /);
  assert.match(challenges, /Clear a Money in the Bank level/);
  assert.doesNotMatch(challenges, /Clear a Money in the Bank rung/);
  assert.match(challenges, /Clear 4 Money in the Bank levels/);
  assert.doesNotMatch(challenges, /Money in the Bank rungs/);
  assert.match(app, /Level cleared! \${run\.lives} lives remain/);
  assert.doesNotMatch(app, /Level cleared! \+1 booster/);
  assert.match(app, /retry this level/);
  assert.match(app, /start again from level 1/);
});

test('v0.13.34 Super Pack wrapper is explicitly identified while standard packs remain Series 1', () => {
  const boosters = between(app, 'function renderBoosters()', 'function formatCountdown');
  assert.match(boosters, /const packWrapperTitle=currentPackType===\"standard\"\?\"SERIES 1\":\"SUPER PACK\"/);
  assert.match(boosters, /series:bucket\.type==='standard'\?'SERIES 1':'SUPER PACK'/);
  assert.match(boosters, /label:"SUPER PACK"/); // generic mode-clear reward is now explicit in the Vault
});
