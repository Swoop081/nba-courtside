import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { canPlayAction, moveEligibility } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars);const stats={};
function row(name){return stats[name]??=(stats[name]={inHandPlayable:0,played:0,playedWithLegalMove:0,playedThenPass:0,ignoredWhileLegalMove:0,ignoredCouldBuff:0});}
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(44117+i*401+j*37)});let z=0;let pendingAction=null;while(g.state().phase!=='MATCH_OVER'&&z++<1800){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const p=s.players[pid],d=cpuDecision(g,pid);if(!d)break;if(s.phase==='ACTION'){
 const legalMoves=p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly&&moveEligibility(s,pid,c).legal);
 for(const a of p.hand.filter(c=>canPlayAction(s,pid,c))){const r=row(a.name);r.inHandPlayable++; if(legalMoves.length){if(d.type==='action'&&d.card===a)r.playedWithLegalMove++; else {r.ignoredWhileLegalMove++; const ef=a.effect?.type;if(ef==='buffNext'||(ef==='buffNextMethod'&&legalMoves.some(m=>m.method===a.effect.method))||ef==='discountNext'||ef==='gainAdrenaline'||ef==='romanOohAhh')r.ignoredCouldBuff++;}}}
 if(d.type==='action'){row(d.card.name).played++;pendingAction={pid,name:d.card.name,seq:s.controlSequence};} else if(d.type==='pass'&&pendingAction&&pendingAction.pid===pid&&pendingAction.seq===s.controlSequence){row(pendingAction.name).playedThenPass++;pendingAction=null;} else if(d.type==='move'&&pendingAction&&pendingAction.pid===pid){pendingAction=null;}
 }
 if(!executeCpuDecision(g,d,pid))break;}}
console.log(JSON.stringify(stats,null,2));
