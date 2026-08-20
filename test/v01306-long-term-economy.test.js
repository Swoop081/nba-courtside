import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { STORE_SUPERSTAR_PRICE, DUPLICATE_UP_BY_RARITY, duplicateUniversePointsFor } from '../js/data/store.js?v=0.13.72';

test('v0.13.6 long-term economy certification keeps economy values locked while the simulator can follow the release calendar',()=>{
  assert.equal(STORE_SUPERSTAR_PRICE,2500);
  assert.deepEqual(DUPLICATE_UP_BY_RARITY,{1:1,2:2,3:3,4:4});
  assert.equal(duplicateUniversePointsFor(1),1);
  assert.equal(duplicateUniversePointsFor(2),2);
  assert.equal(duplicateUniversePointsFor(3),3);
  assert.equal(duplicateUniversePointsFor(4),4);
  const sim=fs.readFileSync(new URL('../tools/long-term-economy-sim.mjs',import.meta.url),'utf8');
  assert.match(sim,/casual:/);
  assert.match(sim,/regular:/);
  assert.match(sim,/heavy:/);
  assert.match(sim,/\[7,30,60,90\]/);
  assert.match(sim,/victory-pack economy model/);
  assert.match(sim,/grantVictoryBooster/);
  assert.match(sim,/openSuperPack/);
});
