import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { canPlayAction, canPlaySpecial, moveEligibility } from '../js/engine/rules.js?v=0.13.72';

const card=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.42;
function ready(){
  const brock=star('brock-lesnar'), roman=star('roman-reigns');
  const g=new MatchEngine({p1:brock,p2:roman,decks:{[brock.id]:decks[brock.id],[roman.id]:decks[roman.id]},rng});
  const s=g.state(),p=s.players.p1,d=s.players.p2;
  p.momentum.strength=10;p.momentum.technical=10;d.hand=[];
  s.phase='ACTION';s.playerInControl='p1';
  return {g,s,p,d};
}

test('v0.13.25 Advocate Plan unlocks from the canonical connected-card history and applies F-5 search/discount',()=>{
  const {g,s,p,d}=ready();
  const german=card('brock-lesnar-brocks-german'),advocate=card('special-brock-lesnar-paul-heyman'),f5=card('brock-lesnar-f-5');
  p.hand=[german,advocate];p.deck=[f5];d.hand=[];
  assert.equal(canPlaySpecial(s,'p1',advocate),false);
  assert.equal(g.declareMove('p1',german),true);if(s.phase==='COUNTER')assert.equal(g.passCounter('p2'),true);
  assert.equal(s.players.p1.events.connectedCardNamesThisControl['Brock’s German'],true);
  assert.equal(canPlaySpecial(s,'p1',advocate),true);
  assert.equal(g.playSpecial('p1',advocate),true);
  assert.equal(p.hand.some(c=>c.id===f5.id),true);
  assert.equal(p.namedDiscount['F-5'],2);
  assert.equal(moveEligibility(s,'p1',p.hand.find(c=>c.id===f5.id)).effectiveCost,8);
});

test('v0.13.25 Beast Incarnate auto-triggers, visibly consumes only itself, reduces 10+ incoming damage by 5 and gains Strength',()=>{
  const {g,s,p}=ready();
  const beast=card('special-brock-lesnar'),incoming={...card('powerbomb'),damage:10};
  p.hand=[beast];const hp=p.hp,strength=p.momentum.strength;
  s.phase='RESOLVE_MOVE';s.playerInControl='p2';s.proposedMove={attackerId:'p2',defenderId:'p1',card:incoming};
  g._connect();
  assert.equal(hp-p.hp,5);
  assert.equal(p.momentum.strength,strength+1);
  assert.ok(p.usedSpecialIds.includes(beast.id));
  assert.ok(s.log.some(e=>e.type==='SPECIAL_EFFECT'&&e.cardId===beast.id&&e.effect==='reduce-incoming-big'&&e.reducedBy===5));
});

test('v0.13.25 Eat Sleep Conquer Repeat draws first then requires the player to choose the ditch',()=>{
  const {g,s,p}=ready();
  const action=card('brock-lesnar-eat-sleep-conquer-repeat'),keep=card('brock-lesnar-f-5'),drawn=card('dropkick');
  p.events.connectedCardNamesThisControl['Brock’s German']=true;
  p.hand=[action,keep];p.deck=[drawn];
  assert.equal(canPlayAction(s,'p1',action),true);
  assert.equal(g.playAction('p1',action),true);
  assert.deepEqual(p.hand.map(c=>c.id),[keep.id,drawn.id]);
  assert.deepEqual(s.pendingActionDiscard,{playerId:'p1',cardId:action.id,count:1});
  assert.equal(g.passTurn('p1'),false,'Control cannot be passed before the required ditch');
  assert.equal(moveEligibility(s,'p1',keep).legal,false,'No Move can be declared before the required ditch');
  assert.equal(g.resolveActionDiscard('p1',0),true,'player may choose which hand page to ditch');
  assert.equal(s.pendingActionDiscard,null);
  assert.deepEqual(p.hand.map(c=>c.id),[drawn.id],'the newly drawn page can be kept by ditching a different page');
  assert.ok(p.outOfPlay.some(c=>c.id===keep.id));
});

test('v0.13.25 Brock Action iPhone feedback explains reactive and conditional timing',()=>{
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  assert.match(app,/REACTIVE · AUTO-TRIGGERS VS/);
  assert.match(app,/Connect with \$\{card\.special\.afterName/);
  assert.match(app,/data-action-ditch-index/);
  assert.match(app,/THE BEAST INCARNATE/);
});
