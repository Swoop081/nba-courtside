import test from 'node:test';
import assert from 'node:assert/strict';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { canAttemptPin } from '../js/engine/rules.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

function openCoverWindow(engine, attackerId='p1') {
  const state = engine.state();
  const defenderId = attackerId === 'p1' ? 'p2' : 'p1';
  state.phase = 'ACTION';
  state.playerInControl = attackerId;
  state.postMove = { attackerId, defenderId, cardId: null };
  state.players[attackerId].turn = { momentumPlayed:0, momentumPlayLimit:1, actionPlayed:0, supportPlayed:0, specialPlayed:0 };
  return { state, defenderId };
}

test('v0.12.88 rules and engine both reject a Green-health pin attempt',()=>{
  const engine = new MatchEngine({ p1: superstars.romanReigns, p2: superstars.ultimateWarrior, decks, rng:()=>0 });
  const { state, defenderId } = openCoverWindow(engine);
  state.players[defenderId].hp = state.players[defenderId].maxHp;
  assert.equal(canAttemptPin(state,'p1').legal,false);
  assert.match(canAttemptPin(state,'p1').reason,/Amber or Red/);
  assert.equal(engine.attemptPin('p1'),false);
  assert.equal(state.phase,'ACTION');
  assert.equal(state.proposedPin,null);
});

test('v0.12.88 Amber health opens the pin window while retaining the actual-HP chance table',()=>{
  const engine = new MatchEngine({ p1: superstars.romanReigns, p2: superstars.ultimateWarrior, decks, rng:()=>0 });
  const { state, defenderId } = openCoverWindow(engine);
  const defender = state.players[defenderId];
  defender.hp = Math.floor(defender.maxHp * 0.5);
  assert.equal(canAttemptPin(state,'p1').legal,true);
  assert.equal(engine._pinChance('p1'),5);
  assert.equal(engine.attemptPin('p1'),true);
  assert.equal(state.phase,'PIN_RESPONSE');
});
