import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { superstars } from "../js/data/superstars.js?v=0.13.72";
import { decks } from "../js/data/decks.js?v=0.13.72";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { MatchEngine } from "../js/engine/MatchEngine.js?v=0.13.72";
import { decisionOwner, cpuDecision, executeCpuDecision } from "../js/ai/WrestlingAI.js?v=0.13.72";

const star=id=>Object.values(superstars).find(s=>s.id===id);
const prism=allGameplayCards.find(c=>c.id==="rhea-ripley-prism-trap");
const filler=i=>({id:`response-filler-${i}`,name:`Filler ${i}`,kind:"momentum",method:"strength",amount:1});

test("v0.12.95 fresh CPU Prism Trap at 33 HP stops for a human response before maintenance pressure",()=>{
  const game=new MatchEngine({p1:star("roman-reigns"),p2:star("rhea-ripley"),decks,rng:()=>0.5});
  const s=game.state(),human=s.players.p1,cpu=s.players.p2;
  human.hp=33; human.submissionDamage.legs=0; cpu.hand=Array.from({length:8},(_,i)=>filler(i));
  s.playerInControl="p2"; s.phase="RESOLVE_MOVE"; s.proposedMove={attackerId:"p2",defenderId:"p1",card:prism};
  game._connect();
  assert.equal(human.submissionDamage.legs,5);
  assert.equal(s.phase,"SUBMISSION_RESPONSE");
  assert.equal(decisionOwner(s),"p1");
  assert.equal(s.finish,null);
  assert.equal(game.passSubmissionResponse("p1"),true);
  assert.equal(s.phase,"SUBMISSION_MAINTAIN");
  const d=cpuDecision(game,"p2"); assert.equal(d?.type,"maintain"); assert.equal(executeCpuDecision(game,d,"p2"),true);
  assert.equal(human.submissionDamage.legs,10);
  assert.equal(s.phase,"SUBMISSION_RESPONSE");
  assert.equal(decisionOwner(s),"p1");
  assert.equal(s.finish,null);
});

test("v0.12.95 submission response UI exposes the In the Hold panel and Pass Continue Hold action",()=>{
  const app=fs.readFileSync(new URL("../js/ui/app.js",import.meta.url),"utf8");
  assert.match(app,/YOU ARE IN THE HOLD/);
  assert.match(app,/PASS · CONTINUE HOLD/);
  assert.match(app,/game\.passSubmissionResponse\(HUMAN\)/);
});
