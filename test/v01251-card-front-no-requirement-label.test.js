import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const studio=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');

test('v0.12.51 Move fronts do not print a no-requirement placeholder',()=>{
  assert.doesNotMatch(studio,/req\|\|["']NO METHOD REQUIREMENT["']/);
  assert.doesNotMatch(studio,/NO MOMENTUM REQUIRED/);
  assert.match(studio,/if\(req\)\{ctx\.fillStyle=/);
});

test('v0.12.51 no-requirement Moves promote the Move type into the empty centre space',()=>{
  assert.match(studio,/cardFont\(META_STACK,req\?18:21,950\)/);
  assert.match(studio,/req\?h\*\.922:h\*\.895/);
});
