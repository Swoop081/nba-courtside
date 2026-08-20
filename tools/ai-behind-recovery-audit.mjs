import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { moveEligibility } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars);let starts=0,noMove=0,passBeforeMove=0,moveLaunched=0,actionFirst=0,supportFirst=0,momentumFirst=0;const active={p1:null,p2:null};
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(66117+i*457+j*43)});let z=0,lastSeq=0;while(g.state().phase!=='MATCH_OVER'&&z++<1800){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const p=s.players[pid],opp=s.players[pid==='p1'?'p2':'p1'];if(s.phase==='ACTION'&&s.controlSequence!==lastSeq){lastSeq=s.controlSequence;const gap=opp.hp/opp.maxHp-p.hp/p.maxHp;if(gap>=.20){starts++;const legal=p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly&&moveEligibility(s,pid,c).legal);if(!legal.length)noMove++;active[pid]={seq:s.controlSequence,done:false};}}
 const d=cpuDecision(g,pid);if(!d)break;if(s.phase==='ACTION'&&active[pid]&&!active[pid].done&&active[pid].seq===s.controlSequence){if(d.type==='move'){moveLaunched++;active[pid].done=true;}else if(d.type==='pass'){passBeforeMove++;active[pid].done=true;}else if(d.type==='action')actionFirst++;else if(d.type==='support')supportFirst++;else if(d.type==='momentum')momentumFirst++;}
 if(!executeCpuDecision(g,d,pid))break;}}
console.log(JSON.stringify({starts,noMove,noMovePct:+(100*noMove/Math.max(1,starts)).toFixed(1),moveLaunched,passBeforeMove,passBeforeMovePct:+(100*passBeforeMove/Math.max(1,starts)).toFixed(1),actionFirst,supportFirst,momentumFirst},null,2));
