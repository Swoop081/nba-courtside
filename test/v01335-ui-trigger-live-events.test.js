import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { cpuDecision } from '../js/ai/WrestlingAI.js?v=0.13.72';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { collectionCards } from '../js/data/collection.js?v=0.13.72';
import { reconstructCurrentPlayPile } from '../js/ui/play-pile.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { activeLiveEventTowers, LIVE_EVENT_WIN_UP } from '../js/data/live-events.js?v=0.13.72';
import { isPlayerVisibleSuperstar } from '../js/data/release.js?v=0.13.72';
import { layeredCardArtFor, finishedCardArtFor } from '../js/data/artwork.js?v=0.13.72';

const card=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);

test('v0.13.35 Hangman Armbar is the approved shared Survivor Series Common',()=>{
  const c=card('hangman-armbar');
  assert.ok(c);
  assert.equal(CARD_NUMBER_BY_ID[c.id]?.cardCode,'SVS1-054');
  assert.equal(c.rarity,1);
  assert.equal(c.cost,3);
  assert.equal(c.damage,0);
  assert.equal(c.requirements.technical,1);
  assert.equal(c.moveType,'submission');
  assert.equal(c.counterState,'arm-extended');
  assert.equal(c.standingOnly,true);
  assert.deepEqual(c.submission,{bodyPart:'arms',pressure:3});
});

test('v0.13.35 rotating Live Events never expose unreleased Superstar opponents',()=>{
  const now=new Date('2026-08-19T12:00:00');
  const towers=activeLiveEventTowers(now);
  const nxt=towers.find(t=>t.event.id==='nxt-rising');
  assert.ok(nxt);
  assert.ok(!nxt.event.opponentPool.includes('chelsea-green'));
  assert.ok(!nxt.event.opponentPool.includes('damian-priest'));
  assert.ok(!nxt.event.opponentPool.includes('bron-breakker'));
  for(const id of nxt.event.opponentPool) assert.equal(isPlayerVisibleSuperstar(star(id),null,now),true,id);
  assert.equal(LIVE_EVENT_WIN_UP,0,'victories no longer pay direct UP');
});

test('v0.13.35 layered fronts are attempted for Superstars before the standard front fallback',()=>{
  const romanCard=collectionCards.find(c=>c.kind==='superstar'&&c.superstarId==='roman-reigns');
  assert.ok(romanCard);
  assert.match(layeredCardArtFor(romanCard),/assets\/cards\/art\/layered\/superstars\/.*\.webp(?:\?v=.*)?$/);
  assert.ok(finishedCardArtFor(romanCard),'standard Superstar front remains available as fallback');
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  assert.match(app,/data-flat-finished-art=/);
  assert.match(app,/data-legacy-finished-art=/);
  assert.match(app,/this\.src=this\.dataset\.flatFinishedArt/);
});

test('v0.13.35 Tribal Chief is offered, decline preserves it, and it can be used on a later trigger',()=>{
  const g=new MatchEngine({p1:star('roman-reigns'),p2:star('liv-morgan'),decks,rng:()=>0.42});
  const s=g.state(),p=s.players.p1,special=card('special-roman-reigns');
  p.hand=[special];p.deck=[];p.discard=[];p.specialUsed=false;s.phase='ACTION';s.playerInControl='p1';
  assert.equal(g.passTurn('p1'),true);
  assert.equal(s.phase,'TRIGGER_RESPONSE');
  assert.equal(s.pendingTriggeredSpecial?.cardId,special.id);
  assert.equal(p.specialUsed,false);
  assert.equal(g.resolveTriggeredSpecial('p1',false),true);
  assert.equal(s.playerInControl,'p2');
  assert.equal(p.specialUsed,false);
  assert.ok(p.hand.some(c=>c.id===special.id));
  s.phase='ACTION';g._setControl('p1');
  assert.equal(g.passTurn('p1'),true);
  assert.equal(s.phase,'TRIGGER_RESPONSE');
  assert.equal(g.resolveTriggeredSpecial('p1',true),true);
  assert.equal(s.playerInControl,'p1');
  assert.equal(p.specialUsed,true);
  assert.ok(p.outOfPlay.some(c=>c.id===special.id));
});

test('v0.13.35 CPU declines Tribal Chief when regaining Control would provide no continuation',()=>{
  const g=new MatchEngine({p1:star('liv-morgan'),p2:star('roman-reigns'),decks,rng:()=>0.42});
  const s=g.state(),p=s.players.p2,special=card('special-roman-reigns');
  p.hand=[special];p.deck=[];p.discard=[];p.specialUsed=false;s.phase='ACTION';g._setControl('p2');
  assert.equal(g.passTurn('p2'),true);
  assert.equal(s.phase,'TRIGGER_RESPONSE');
  assert.deepEqual(cpuDecision(g,'p2'),{type:'triggerSpecial',use:false});
});

test('v0.13.35 UI locks the screenshot polish and Play Pile dedupe behavior',()=>{
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.match(app,/compact-live-choice/);
  assert.match(app,/compact-live-detail-hero/);
  assert.doesNotMatch(app,/earnedUp\/\$\{totalUp\}/);
  assert.match(app,/boosterInspectOverlayMarkup/);
  assert.match(app,/pack-summary-actions pack-summary-next-row/);
  assert.match(app,/id="pack-summary-next"/);
  assert.doesNotMatch(app,/pack-summary-actions two-button-row/);
  assert.match(app,/TRIGGER_RESPONSE/);
  const pileSource=fs.readFileSync(new URL('../js/ui/play-pile.js',import.meta.url),'utf8');
  assert.match(pileSource,/COUNTER_ATTACK_DECLARED is intentionally ignored/);
  assert.match(css,/booster-vault-stats>.set-stat:nth-child\(odd\)/);
  assert.match(css,/entrance-hero-band/);
  assert.match(css,/two-button-row/);
});

test('v0.13.35 Play Pile keeps one physical card per declaration through a Punch exchange',()=>{
  const punch=card('punch');
  assert.ok(punch);
  const byId=new Map([[punch.id,punch]]);
  const state={log:[
    {type:'MOVE_DECLARED',playerId:'p1',cardId:punch.id},
    {type:'MOVE_COUNTERED',defenderId:'p2',incomingCardId:punch.id,counterCardId:punch.id,counterAttack:true},
    {type:'COUNTER_ATTACK_DECLARED',attackerId:'p2',defenderId:'p1',cardId:punch.id},
    {type:'MOVE_CONNECTED',playerId:'p2',cardId:punch.id,damage:3}
  ],proposedMove:null};
  const pile=reconstructCurrentPlayPile(state,{cardById:byId});
  assert.equal(pile.length,2);
  assert.equal(pile.filter(item=>item.card.id===punch.id).length,2);
});
