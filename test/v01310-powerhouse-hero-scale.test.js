import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.10 Powerhouse Collision gives Brock the full right-hand mobile hero stage',()=>{
  assert.match(css, /event-powerhouse-collision \.live-tower-detail-art\{[\s\S]*?top:14px!important;[\s\S]*?width:58%!important;[\s\S]*?max-width:58%!important;[\s\S]*?height:auto!important;/);
  assert.match(css, /event-powerhouse-collision \.live-tower-detail-art \.official-menu-superstar-photo\{[\s\S]*?width:160%!important;[\s\S]*?max-width:none!important;[\s\S]*?height:auto!important;[\s\S]*?transform:translateX\(14%\)!important;/);
});
