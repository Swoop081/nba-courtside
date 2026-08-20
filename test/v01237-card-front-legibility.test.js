import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const studio = fs.readFileSync(new URL('../js/tools/card-art-studio.js', import.meta.url), 'utf8');

test('v0.12.37 move fronts use unboxed heavyweight Cost/Damage figures', () => {
  assert.match(studio, /function drawMoveStatFigure\(cx,label,value\)/);
  assert.match(studio, /cardFont\(NUMBER_STACK,78,1000\)/);
  assert.match(studio, /ctx\.strokeText\(String\(value\),cx,h\*\.902\)/);
  assert.match(studio, /drawMoveStatFigure\(w\*\.155,"COST"/);
  assert.match(studio, /drawMoveStatFigure\(w\*\.845,"DAMAGE"/);
  assert.doesNotMatch(studio, /function drawStatTile\(/);
});

test('v0.12.37 move requirement and type line are enlarged for thumbnail legibility', () => {
  assert.match(studio, /fittedMetaFont\(req,w\*\.49,26,18\)/);
  assert.match(studio, /cardFont\(META_STACK,req\?18:21,950\)/);
  assert.match(studio, /MOVE • \$\{moveType\}/);
});
