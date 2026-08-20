import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { canPlaySupport, moveEligibility } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars);const stats={};const row=n=>stats[n]??=(stats[n]={playable:0,ignoredWithMove:0,played:0,playedWithMoveAvailable:0,playedThenPass:0});
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(52117+i*431+j*29)});let z=0,pending={p1:null,p2:null};while(g.state().phase!=='MATCH_OVER'&&z++<1800){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const p=s.players[pid],d=cpuDecision(g,pid);if(!d)break;if(s.phase==='ACTION'){
 const moves=p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly&&moveEligibility(s,pid,c).legal);
 for(const c of p.hand.filter(c=>canPlaySupport(s,pid,c))){const r=row(c.name);r.playable++;if(moves.length&&!(d.type==='support'&&d.card===c))r.ignoredWithMove++;}
 if(d.type==='support'){const r=row(d.card.name);r.played++;if(moves.length)r.playedWithMoveAvailable++;pending[pid]={name:d.card.name,seq:s.controlSequence};}
 if(d.type==='pass'&&pending[pid]&&pending[pid].seq===s.controlSequence){row(pending[pid].name).playedThenPass++;pending[pid]=null;}
 if(d.type==='move'&&pending[pid]&&pending[pid].seq===s.controlSequence)pending[pid]=null;
 }
 if(!executeCpuDecision(g,d,pid))break;}}
console.log(JSON.stringify(stats,null,2));
