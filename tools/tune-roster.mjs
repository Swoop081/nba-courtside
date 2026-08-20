import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner, cpuDecision, executeCpuDecision } from '../js/ai/WrestlingAI.js';

const overrides = JSON.parse(process.env.HP_OVERRIDES || '{}');
for (const s of Object.values(superstars)) if (overrides[s.id] != null) s.hp = Number(overrides[s.id]);
const stars=Object.values(superstars); const N=Number(process.env.MATCHES_PER_PAIR||4); const KSTART=Number(process.env.K_START||0);
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stat=Object.fromEntries(stars.map(s=>[s.id,{name:s.name,hp:s.hp,m:0,w:0,p1m:0,p1w:0,p2m:0,p2w:0,turns:0}]));
let stalls=0,matches=0,totalTurns=0;
for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++)for(let kk=0;kk<N;kk++){
 const k=KSTART+kk; const a=k%2===0?stars[i]:stars[j], b=k%2===0?stars[j]:stars[i];
 const seed=0x9e3779b9 ^ (i*1000003+j*10007+k*97); const g=new MatchEngine({p1:a,p2:b,decks,rng:rng(seed)}); let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<3500){const pid=decisionOwner(g.state()),d=cpuDecision(g,pid); if(!d||!executeCpuDecision(g,d,pid))break;}
 matches++; totalTurns+=g.state().turnNumber; if(g.state().phase!=='MATCH_OVER'){stalls++;continue;}
 const w=g.state().players[g.state().winner].superstar.id;
 for(const s of [a,b]){stat[s.id].m++;stat[s.id].turns+=g.state().turnNumber;}
 stat[a.id].p1m++;stat[b.id].p2m++; if(w===a.id)stat[a.id].p1w++; if(w===b.id)stat[b.id].p2w++; stat[w].w++;
}
const rows=Object.entries(stat).map(([id,x])=>({id,...x,wr:+(100*x.w/x.m).toFixed(1),p1:+(100*x.p1w/x.p1m).toFixed(1),p2:+(100*x.p2w/x.p2m).toFixed(1),avgT:+(x.turns/x.m).toFixed(2)})).sort((a,b)=>b.wr-a.wr);
console.log(JSON.stringify({N,matches,stalls,avgTurns:+(totalTurns/matches).toFixed(2),rows},null,2));
