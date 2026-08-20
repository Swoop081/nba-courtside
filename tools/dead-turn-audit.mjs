import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars); const by={}; for(const s of stars)by[s.id]={matches:0,passes:0,maxStreak:0,streak4:0,totalTurns:0};
let matches=0,totalPass=0,matches4=0,max=0;
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){
 const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(12345+i*101+j)}); let steps=0, currentStreak=0, matchMax=0; const passBy={p1:0,p2:0};
 while(g.state().phase!=='MATCH_OVER'&&steps++<1500){const pid=decisionOwner(g.state()),d=cpuDecision(g,pid); if(!d)break; if(d.type==='pass'){totalPass++; passBy[pid]++; currentStreak++; matchMax=Math.max(matchMax,currentStreak);} else if(['move','action','support','manager','special','momentum','pin','maintain'].includes(d.type)){currentStreak=0;} if(!executeCpuDecision(g,d,pid))break;}
 matches++; max=Math.max(max,matchMax); if(matchMax>=4)matches4++;
 for(const [pid,star] of [['p1',stars[i]],['p2',stars[j]]]){const x=by[star.id];x.matches++;x.passes+=passBy[pid];x.maxStreak=Math.max(x.maxStreak,matchMax); if(matchMax>=4)x.streak4++;x.totalTurns+=g.state().turnNumber;}
}
const rows=Object.entries(by).map(([id,x])=>({id,passesPerMatch:+(x.passes/x.matches).toFixed(2),streak4Pct:+(100*x.streak4/x.matches).toFixed(1),max:x.maxStreak})).sort((a,b)=>b.passesPerMatch-a.passesPerMatch);
console.log(JSON.stringify({matches,totalPass,passesPerMatch:+(totalPass/matches).toFixed(2),matches4,pct4:+(matches4*100/matches).toFixed(1),max,top:rows.slice(0,20),cmPunk:rows.find(r=>r.id==='cm-punk')},null,2));
