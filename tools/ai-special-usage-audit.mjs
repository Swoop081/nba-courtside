import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { moveEligibility } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars); const stats={}; function row(id,name,type){return stats[id]??=(stats[id]={name,type,played:0,playedNoLegalBefore:0,followedByMoveSameControl:0,followedByPassSameControl:0});}
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(77117+i*409+j*23)});let z=0,pending={p1:null,p2:null};while(g.state().phase!=='MATCH_OVER'&&z++<1800){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const p=s.players[pid],d=cpuDecision(g,pid);if(!d)break;if(s.phase==='ACTION'&&d.type==='special'){const r=row(d.card.id,d.card.name,d.card.special?.type);r.played++;const legal=p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly&&moveEligibility(s,pid,c).legal);if(!legal.length)r.playedNoLegalBefore++;pending[pid]={id:d.card.id,seq:s.controlSequence};}
 if(s.phase==='ACTION'&&pending[pid]&&pending[pid].seq===s.controlSequence){if(d.type==='move'&&d.type!=='special'){row(pending[pid].id).followedByMoveSameControl++;pending[pid]=null;}if(d.type==='pass'){row(pending[pid].id).followedByPassSameControl++;pending[pid]=null;}}
 const oldSeq=s.controlSequence;if(!executeCpuDecision(g,d,pid))break;const ns=g.state();for(const q of ['p1','p2'])if(pending[q]&&pending[q].seq!==ns.controlSequence)pending[q]=null;}}
console.log(JSON.stringify(Object.values(stats).sort((a,b)=>b.played-a.played),null,2));
