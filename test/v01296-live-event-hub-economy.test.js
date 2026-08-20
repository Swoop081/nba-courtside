import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { activeLiveEventTowers, liveEventTowerState, startLiveEventTower, currentLiveEventTowerOpponent, recordLiveEventTowerMatch, LIVE_EVENT_LENGTH } from '../js/data/live-events.js?v=0.13.72';
import { createProfile } from '../js/data/profile.js?v=0.13.72';
import { STORE_SUPERSTAR_PRICE } from '../js/data/store.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { isLaunchLiveSetId } from '../js/data/release.js?v=0.13.72';

const eligible = Object.values(superstars).filter(s=>!s.developmentOnly && isLaunchLiveSetId(s.setId)).map(s=>s.id);

test('v0.13.54 exposes three simultaneous 24-hour towers with no consecutive-name repeats',()=>{
  const now = new Date('2026-08-18T07:45:00');
  const towers = activeLiveEventTowers(now);
  const tomorrow = activeLiveEventTowers(new Date('2026-08-19T07:45:00'));
  assert.equal(towers.length,3);
  assert.deepEqual(towers.map(t=>t.cadence),['daily','daily','daily']);
  assert.equal(towers[0].event.id,'powerhouse-collision');
  assert.ok(towers.every(t=>t.msRemaining>0 && t.msRemaining<=24*60*60*1000));
  assert.equal(new Set(towers.map(t=>t.nextAt.getTime())).size,1);
  const tomorrowNames = new Set(tomorrow.map(t=>t.event.name));
  for (const tower of towers) assert.equal(tomorrowNames.has(tower.event.name),false,`${tower.event.name} repeated on the next day`);
});

test('v0.12.97 Brock Lesnar Birthday Bash appears on July 12 for 24 hours only',()=>{
  const birthday = activeLiveEventTowers(new Date('2027-07-12T10:00:00')).find(t=>t.cadence==='birthday');
  assert.ok(birthday);
  assert.equal(birthday.event.id,'brock-lesnar-birthday-bash');
  assert.equal(birthday.event.name,'Brock Lesnar Birthday Bash');
  assert.equal(birthday.event.bossId,'brock-lesnar');
  assert.equal(birthday.cadenceLabel,'24 HOURS ONLY');
  assert.equal(activeLiveEventTowers(new Date('2027-07-13T10:00:00')).some(t=>t.cadence==='birthday'),false);
});

test('v0.12.96 concurrent tower state is isolated by tower key',()=>{
  const now = new Date('2026-08-18T07:45:00');
  const p = createProfile('roman-reigns');
  const [daily,threeDay] = activeLiveEventTowers(now);
  startLiveEventTower(p,daily.key,'roman-reigns',eligible,()=>0.23,now);
  startLiveEventTower(p,threeDay.key,'roman-reigns',eligible,()=>0.37,now);
  assert.ok(currentLiveEventTowerOpponent(p,daily.key,now));
  assert.ok(currentLiveEventTowerOpponent(p,threeDay.key,now));
  recordLiveEventTowerMatch(p,daily.key,'win',now);
  assert.equal(liveEventTowerState(p,daily.key,now).state.activeRun.stage,1);
  assert.equal(liveEventTowerState(p,threeDay.key,now).state.activeRun.stage,0);
});

test('v0.12.96 Play menu places Daily Tower Live Events first and labels the reset daily',()=>{
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url),'utf8');
  const play = app.slice(app.indexOf('function renderPlayMenu'),app.indexOf('function renderRules'));
  assert.ok(play.indexOf('id="play-live-event"') < play.indexOf('id="play-exhibition"'));
  assert.match(play,/DAILY TOWER · \$\{liveLabel\}/);
  assert.match(play,/SUPER PACK ON CLEAR/);
  assert.doesNotMatch(play,/RESETS DAILY/);
});

test('v0.12.96 Superstar store price is 2500 UP',()=>{
  assert.equal(STORE_SUPERSTAR_PRICE,2500);
});
