import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';
import { canPlayManager } from '../js/engine/rules.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';

const byId=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.99;

test('v0.13.16 Paul Heyman collector identities and Brock card rename are locked',()=>{
  const manager=byId('manager-paul-heyman');
  assert.equal(manager.kind,'manager');
  assert.equal(manager.setId,'raw-series-1');
  assert.equal(manager.rarity,4);
  assert.deepEqual(manager.allowedSuperstarIds,['brock-lesnar','roman-reigns']);
  assert.equal(CARD_NUMBER_BY_ID[manager.id].cardCode,'RAW1-039');

  const promo=byId('my-name-is-paul-heyman');
  assert.equal(promo.kind,'action');
  assert.equal(promo.setId,'survivor-series-series-1');
  assert.equal(promo.rarity,3);
  assert.equal(promo.cost,2);
  assert.equal(promo.oneUse,true);
  assert.equal(CARD_NUMBER_BY_ID[promo.id].cardCode,'SVS1-050');

  const brockSpecial=byId('special-brock-lesnar-paul-heyman');
  assert.equal(brockSpecial.name,'The Advocate’s Plan');
  assert.equal(brockSpecial.special.type,'paulHeyman');
  assert.equal(brockSpecial.special.searchName,'F-5');
  assert.equal(brockSpecial.special.discount,2);
});

test('Paul Heyman Manager is legal only for Brock Lesnar and Roman Reigns',()=>{
  const manager=byId('manager-paul-heyman');
  for(const sid of ['brock-lesnar','roman-reigns']){
    const g=new MatchEngine({p1:star(sid),p2:star('cm-punk'),decks,rng});
    const s=g.state(); s.phase='ACTION'; s.playerInControl='p1'; s.players.p1.hand=[manager];
    assert.equal(canPlayManager(s,'p1',manager),true,sid);
  }
  const g=new MatchEngine({p1:star('cody-rhodes'),p2:star('cm-punk'),decks,rng});
  const s=g.state(); s.phase='ACTION'; s.playerInControl='p1'; s.players.p1.hand=[manager];
  assert.equal(canPlayManager(s,'p1',manager),false);
  assert.equal(g.playManager('p1',manager),false);
});

test('Paul Heyman Manager tutors a non-Finisher exclusive Move and draws once when one is Countered',()=>{
  const manager=byId('manager-paul-heyman'), german=byId('brock-lesnar-brocks-german'), filler=byId('dropkick');
  const g=new MatchEngine({p1:star('brock-lesnar'),p2:star('cm-punk'),decks,rng});
  const s=g.state(),p=s.players.p1;
  s.phase='ACTION'; s.playerInControl='p1'; p.hand=[manager]; p.deck=[german,filler];
  assert.equal(g.playManager('p1',manager),true);
  assert.equal(p.activeManager.id,manager.id);
  assert.ok(p.hand.some(c=>c.id===german.id));
  const before=p.hand.length;
  assert.equal(g._managerMoveCounteredHooks('p1',german),true);
  assert.equal(p.hand.length,before+1);
  assert.equal(g._managerMoveCounteredHooks('p1',german),false,'manager counter draw is once per match');
});

test('My Name Is Paul Heyman is a universal one-use Action that rewards an exclusive hit in the top five',()=>{
  const promo=byId('my-name-is-paul-heyman'), exclusive=byId('cody-rhodes-dropdown-uppercut'), filler=byId('dropkick');
  const g=new MatchEngine({p1:star('cody-rhodes'),p2:star('cm-punk'),decks,rng});
  const s=g.state(),p=s.players.p1;
  s.phase='ACTION'; s.playerInControl='p1'; p.hand=[promo]; p.deck=[filler,exclusive,byId('punch')].filter(Boolean); p.momentum.strength=2; p.adrenaline=0;
  assert.equal(g.playAction('p1',promo),true);
  assert.ok(p.hand.some(c=>c.id===exclusive.id),'prefers a Superstar-exclusive Move/Action among the top five');
  assert.equal(p.adrenaline,1);
  assert.ok(p.outOfPlay.some(c=>c.id===promo.id),'one-use promo stays out of the recycle pile');
});
