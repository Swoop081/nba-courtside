import test from "node:test";
import assert from "node:assert/strict";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";
import { canPlayAction } from "../js/engine/rules.js?v=0.13.72";

const stars=Object.values(superstars);
const fight=allGameplayCards.find(c=>c.id==='fight-forever');
const rng=()=>0.42;

test('v0.12.29 roster keeps the no-cap durability model after targeted rebalance',()=>{
  assert.equal(stars.length,62);
  const expected={
    'iyo-sky':57,'mankind':67,'the-rock':67,'hulk-hogan':69,'roman-reigns':67,'cm-punk':64,
    'cody-rhodes':64,'seth-rollins':64,'brock-lesnar':70,'kevin-owens':66,'gunther':68,'oba-femi':68
  };
  for(const [id,hp] of Object.entries(expected)) assert.equal(stars.find(s=>s.id===id)?.hp,hp,id);
  assert.ok(stars.every(s=>s.hp>=57&&s.hp<=72));
});

test('v0.12.23 match clock is informational and never ends the match at Turn 50',()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=g.state();
  assert.equal('turnLimit' in s,false);
  s.turnNumber=50;s.phase='ACTION';s.playerInControl='p1';
  assert.equal(g.passTurn('p1'),true);
  assert.equal(s.turnNumber,51);
  assert.equal(s.phase,'ACTION');
  assert.equal(s.finish,null);
  assert.equal(s.log.some(e=>e.finishType==='turn-limit'),false);
});

test('v0.12.23 Fight Forever unlocks on Turn 11 and heals both Superstars by 10',()=>{
  assert.ok(fight);
  assert.equal(fight.playableAfterTurn,10);
  assert.equal(fight.effect?.healEach,10);
  assert.equal('turns' in (fight.effect??{}),false);
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng});
  const s=g.state(),a=s.players.p1,d=s.players.p2;
  a.hand=[fight];a.hp=a.maxHp-20;d.hp=d.maxHp-8;
  s.turnNumber=10;
  assert.equal(canPlayAction(s,'p1',fight),false);
  s.turnNumber=11;
  assert.equal(canPlayAction(s,'p1',fight),true);
  assert.equal(g.playAction('p1',fight),true);
  assert.equal(a.hp,a.maxHp-10);
  assert.equal(d.hp,d.maxHp);
});
