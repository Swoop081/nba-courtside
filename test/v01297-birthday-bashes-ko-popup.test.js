import test from 'node:test';
import assert from 'node:assert/strict';
import { BIRTHDAY_TOWERS, RELEASED_BIRTHDAY_ROSTER_IDS, activeLiveEventTowers, startLiveEventTower } from '../js/data/live-events.js?v=0.13.72';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { isLaunchLiveSetId } from '../js/data/release.js?v=0.13.72';
import { createProfile } from '../js/data/profile.js?v=0.13.72';

const released = Object.values(superstars).filter(s=>!s.developmentOnly && isLaunchLiveSetId(s.setId)).map(s=>s.id).sort();
const byId = id => allGameplayCards.find(c=>c.id===id);

test('v0.12.97 Birthday Bash calendar contains exactly the currently released 24-Superstar launch roster',()=>{
  assert.equal(BIRTHDAY_TOWERS.length,24);
  assert.deepEqual([...RELEASED_BIRTHDAY_ROSTER_IDS].sort(),released);
  assert.deepEqual(BIRTHDAY_TOWERS.map(t=>t.bossId).sort(),released);
  assert.ok(BIRTHDAY_TOWERS.every(t=>t.name.endsWith('Birthday Bash')));
});

test('v0.12.97 each Birthday Bash places the birthday Superstar in Challenger 5',()=>{
  for (const event of BIRTHDAY_TOWERS) {
    const now = new Date(2027,event.month-1,event.day,10,0,0);
    const tower = activeLiveEventTowers(now).find(t=>t.event.id===event.id);
    assert.ok(tower,event.id);
    const p=createProfile('cm-punk');
    const playerId = event.bossId==='cm-punk' ? 'roman-reigns' : 'cm-punk';
    const run=startLiveEventTower(p,tower.key,playerId,released,()=>0.31,now);
    assert.equal(run.opponents.length,5,event.id);
    assert.equal(run.opponents[4],event.bossId,`${event.id} boss is Challenger 5`);
  }
});

test('v0.12.97 Pop-Up Powerbomb is Kevin Owens-exclusive Rare Trademark with rewritten KO rules',()=>{
  const card=byId('pop-up-powerbomb');
  assert.equal(card.superstarId,'kevin-owens');
  assert.equal(card.rarity,3);
  assert.equal(card.trademark,true);
  assert.match(card.rulesText,/Kevin Owens-exclusive Trademark/);
  assert.match(card.rulesText,/search\/draw Stunner/);
  assert.equal(card.effects.find(e=>e.type==='search'&&e.name==='Stunner')?.discount,4);
  assert.equal(card.effects.find(e=>e.type==='search')?.ifSuperstarIds,undefined);
  assert.equal(decks['kevin-owens'].filter(card=>card.id==='pop-up-powerbomb').length,3);
  assert.equal(decks['oba-femi'].some(card=>card.id==='pop-up-powerbomb'),false);
});
