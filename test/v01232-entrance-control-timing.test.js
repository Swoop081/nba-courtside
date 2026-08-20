import test from 'node:test';
import assert from 'node:assert/strict';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';

test('v0.12.32 Entrance Momentum is preloaded but Entrance Adrenaline waits for first Control',()=>{
  const g=new MatchEngine({p1:superstars.andreTheGiant,p2:superstars.theRock,decks,rng:()=>0.5});
  const s=g.state();
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.players.p1.momentum.strength,1,'P1 Entrance Momentum is live at the bell');
  assert.equal(s.players.p2.momentum.strength,1,'P2 Entrance Momentum is live before P2 gains Control');
  assert.equal(s.players.p2.momentum.strike,1,'all P2 Entrance Momentum is preloaded');
  assert.equal(s.players.p1.adrenaline,1,'P1 receives the tuned Eighth Wonder Adrenaline with opening Control');
  assert.equal(s.players.p2.adrenaline,0,'P2 Final Boss Adrenaline is not exposed before P2 has Control');

  assert.equal(g.passTurn('p1'),true);
  assert.equal(s.playerInControl,'p2');
  assert.equal(s.players.p2.adrenaline,1,'P2 receives tuned Final Boss Entrance Adrenaline exactly when P2 first gains Control');

  assert.equal(g.passTurn('p2'),true);
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.players.p1.adrenaline,1,'P1 Entrance Adrenaline does not retrigger');
  assert.equal(g.passTurn('p1'),true);
  assert.equal(s.players.p2.adrenaline,1,'P2 Entrance Adrenaline does not retrigger');
  const triggers=s.log.filter(e=>e.type==='ENTRANCE_TRIGGERED'&&e.reason==='first-control');
  assert.equal(triggers.filter(e=>e.playerId==='p1').length,1);
  assert.equal(triggers.filter(e=>e.playerId==='p2').length,1);
});
