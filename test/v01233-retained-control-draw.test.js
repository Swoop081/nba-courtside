import test from 'node:test';
import assert from 'node:assert/strict';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';

const rng=()=>0.42;

test('v0.12.33 successful-Move retained Control replenishes only the defender',()=>{
  const g=new MatchEngine({p1:superstars.cmPunk,p2:superstars.codyRhodes,decks,rng});
  const s=g.state(),a=s.players.p1,d=s.players.p2;
  const ah=a.hand.length,dh=d.hand.length,ad=a.deck.length,dd=d.deck.length;
  s.playerInControl='p1';
  assert.equal(g._advanceTurn('p1','successful-move'),true);
  assert.equal(a.hand.length,ah,'controller receives no automatic replacement page');
  assert.equal(a.deck.length,ad,'controller deck is not drawn on retained Control');
  assert.equal(d.hand.length,dh+1,'defender draws one page while absorbing the sequence');
  assert.equal(d.deck.length,dd-1);
  assert.equal(a.turn.momentumPlayLimit,1,'controller still gets exactly one Momentum placement on the new turn');
  assert.equal(a.turn.momentumPlayed,0);
});

test('v0.12.33 normal Control transfers still replenish both players and connected Moves keep +1/-1 Adrenaline',()=>{
  const g=new MatchEngine({p1:superstars.cmPunk,p2:superstars.codyRhodes,decks,rng});
  const s=g.state(),a=s.players.p1,d=s.players.p2;
  const ah=a.hand.length,dh=d.hand.length;
  assert.equal(g.passTurn('p1'),true);
  assert.equal(a.hand.length,ah+1,'passing Control uses the normal global turn draw');
  assert.equal(d.hand.length,dh+1);

  const punch=allGameplayCards.find(c=>c.id==='punch');
  d.hand=[punch]; d.momentum.strike=99; d.adrenaline=3; a.adrenaline=3;
  s.phase='RESOLVE_MOVE'; s.playerInControl='p2'; s.proposedMove={attackerId:'p2',defenderId:'p1',card:punch};
  g._connect();
  assert.equal(d.adrenaline,4,'connected Move gives attacker +1 Adrenaline');
  assert.equal(a.adrenaline,2,'connected Move removes 1 Adrenaline from defender');
});
