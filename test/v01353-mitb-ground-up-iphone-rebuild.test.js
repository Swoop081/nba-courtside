import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

function ladderRenderer(){
  const start=app.indexOf('function renderLadder() {');
  const end=app.indexOf('\nfunction beginKingOfTheRing()', start);
  assert.ok(start>=0 && end>start);
  return app.slice(start,end);
}

test('v0.13.53 MITB detail is rebuilt on a fresh component tree',()=>{
  const render=ladderRenderer();
  for(const token of ['mitb-v2-screen','mitb-v2-hero','mitb-v2-command','mitb-v2-road','mitb-v2-opponent-rail','mitb-v2-opponent']) assert.ok(render.includes(token),token);
  for(const legacy of ['ladder-rung mode-run-node','redesigned-ladder-node mitb-opponent-node','mitb-run-hero','mode-run-status','ladder-bottom-shell']) assert.equal(render.includes(legacy),false,legacy);
});

test('v0.13.53 MITB opponent road uses real Superstar cards without legacy elongated rung geometry',()=>{
  const render=ladderRenderer();
  assert.ok(render.includes('superstarPreviewCardMarkup(id,"mitb-v2-superstar-card")'));
  assert.ok(render.includes('data-mitb-v2-opponent-index'));
  assert.ok(css.includes('.mitb-v2-opponent-rail'));
  assert.ok(css.includes('grid-auto-columns:126px'));
  assert.ok(css.includes('.mitb-v2-opponent-card'));
});

test('v0.13.53 MITB active command has one consistent opponent source and compact gold fight CTA',()=>{
  const render=ladderRenderer();
  assert.ok(render.includes("const currentOpponent = active ? superstarById[currentLadderOpponent(profile, new Date())]"));
  assert.ok(render.includes('${currentOpponent?.name'));
  assert.ok(render.includes('FIGHT LEVEL ${run.rung + 1}'));
  assert.ok(css.includes('background:linear-gradient(90deg,var(--mitb-gold),var(--mitb-gold-2))'));
});

test('v0.13.53 MITB hub CTA is normalized to compact Live Event geometry',()=>{
  assert.ok(css.includes('.live-events-hub .money-in-bank-live-card .live-tower-enter'));
  assert.ok(css.includes('min-height:0!important'));
  assert.ok(css.includes('padding:8px 9px!important'));
});
