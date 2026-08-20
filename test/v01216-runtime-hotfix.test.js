import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { moveEligibility, counterEligibility, canPlayAction, effectiveTotalMomentum } from '../js/engine/rules.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

const stars = Object.values(superstars);
const rng = () => 0.42;

test('v0.12.16 numeric Cost counts permanent Method Momentum plus current Attitude without consuming either', () => {
  const g = new MatchEngine({ p1: stars[0], p2: stars[1], decks, rng });
  const s = g.state();
  const p = s.players.p1;
  s.phase = 'ACTION';
  s.playerInControl = 'p1';
  p.momentum.strength = 2;
  p.momentum.strike = 2;
  p.momentum.technical = 0;
  p.momentum.agility = 0;
  p.adrenaline = 5;
  p.momentum.attitude = 5;

  assert.equal(effectiveTotalMomentum(s, 'p1'), 9);

  const tilt = { id:'test-tilt', name:'Tilt-a-Whirl Slam', kind:'move', cost:5, damage:8, method:'strength', requirements:{} };
  const powerbomb = { id:'test-powerbomb', name:'Powerbomb', kind:'move', cost:6, damage:10, method:'strength', requirements:{ strength:2 } };
  const driveBy = { id:'test-drive-by', name:'Drive-By', kind:'move', cost:5, damage:8, method:'strike', requirements:{ strike:2 } };
  assert.equal(moveEligibility(s, 'p1', tilt).legal, true);
  assert.equal(moveEligibility(s, 'p1', powerbomb).legal, true);
  assert.equal(moveEligibility(s, 'p1', driveBy).legal, true);

  const action = { id:'test-action', name:'Test Action', kind:'action', cost:8 };
  assert.equal(canPlayAction(s, 'p1', action), true);

  s.phase = 'COUNTER';
  s.proposedMove = { attackerId:'p2', defenderId:'p1', card:{ id:'incoming', kind:'move', moveType:'grapple', tacticalType:'grapple' } };
  const counter = { id:'test-counter', name:'Test Counter', kind:'move', cost:7, method:'strike', requirements:{ strike:2 }, counters:['grapple'] };
  assert.equal(counterEligibility(s, 'p1', s.proposedMove.card, counter).legal, true);

  assert.equal(p.adrenaline, 5, 'legality checks never spend Attitude');
  assert.equal(p.momentum.attitude, 5, 'Attitude mirror remains unchanged by legality checks');
  assert.equal(p.momentum.strength, 2);
  assert.equal(p.momentum.strike, 2);
});

test('v0.12.33 retained-Control successful Moves replenish only the defender', () => {
  const g = new MatchEngine({ p1: stars[0], p2: stars[1], decks, rng });
  const s = g.state();
  const beforeP1Hand = s.players.p1.hand.length;
  const beforeP2Hand = s.players.p2.hand.length;
  const beforeP1Deck = s.players.p1.deck.length;
  const beforeP2Deck = s.players.p2.deck.length;
  s.playerInControl = 'p2';

  assert.equal(g._advanceTurn('p2', 'successful-move'), true);
  assert.equal(s.turnNumber, 2);
  assert.equal(s.playerInControl, 'p2');
  assert.equal(s.players.p1.hand.length, beforeP1Hand + 1, 'defender draws during opponent retained-Control turn');
  assert.equal(s.players.p2.hand.length, beforeP2Hand, 'controller does not get an automatic replacement draw after a successful Move');
  assert.equal(s.players.p1.deck.length, beforeP1Deck - 1);
  assert.equal(s.players.p2.deck.length, beforeP2Deck);

  g._advanceTurn('p2', 'successful-move');
  assert.equal(s.players.p1.hand.length, beforeP1Hand + 2, 'repeated retained-Control turns keep drawing for defender');
  assert.equal(s.players.p2.hand.length, beforeP2Hand);
});

test('v0.12.16 Match Complete is deferred until successful pin spectacle finishes', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const spectacleBranch = app.indexOf('game.state().phase === "MATCH_OVER" && matchSpectacle');
  const completedMatch = app.indexOf('handleCompletedMatch();', spectacleBranch);
  const resultsBranch = app.indexOf('root.innerHTML = renderMatchResults();', spectacleBranch);
  assert.ok(spectacleBranch >= 0, 'MATCH_OVER spectacle branch exists');
  assert.ok(completedMatch > spectacleBranch, 'rewards/completion handling waits until after spectacle branch');
  assert.ok(resultsBranch > spectacleBranch, 'Match Complete render comes after spectacle branch');
  assert.match(app, /\{text:"1!",kind:"pin",duration:620\}.*\{text:"2!!",kind:"pin",duration:760\}.*\{text:"3!!!",kind:"pin final",duration:1100\}/s);
  assert.match(app, /match-finish-presentation/);
});
