import { superstars } from '../js/data/superstars.js';import { decks } from '../js/data/decks.js';import { MatchEngine } from '../js/engine/MatchEngine.js';import {decisionOwner,cpuDecision,executeCpuDecision} from '../js/ai/WrestlingAI.js';
const id=process.env.STAR_ID||'andre-the-giant', N=Number(process.env.MATCHES_PER_OPP||40); const stars=Object.values(superstars), target=stars.find(s=>s.id===id);if(!target)throw Error('missing '+id);
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
let w=0,m=0,p1w=0,p1m=0,p2w=0,p2m=0,stalls=0,turns=0;const by=[];
for(let j=0;j<stars.length;j++){const opp=stars[j];if(opp.id===id)continue;let ow=0;
 for(let k=0;k<N;k++){const targetP1=k%2===0;const a=targetP1?target:opp,b=targetP1?opp:target;const g=new MatchEngine({p1:a,p2:b,decks,rng:rng(0x51f15e ^ j*10007 ^ k*97)});let steps=0;while(g.state().phase!=='MATCH_OVER'&&steps++<3500){const pid=decisionOwner(g.state()),d=cpuDecision(g,pid);if(!d||!executeCpuDecision(g,d,pid))break;}m++;turns+=g.state().turnNumber;if(g.state().phase!=='MATCH_OVER'){stalls++;continue;}const won=g.state().players[g.state().winner].superstar.id===id;if(won){w++;ow++;}if(targetP1){p1m++;if(won)p1w++;}else{p2m++;if(won)p2w++;}}
 by.push({opp:opp.name,wr:+(100*ow/N).toFixed(1)});
}
console.log(JSON.stringify({id,hp:target.hp,m,w,wr:+(100*w/m).toFixed(2),p1:+(100*p1w/p1m).toFixed(2),p2:+(100*p2w/p2m).toFixed(2),avgTurns:+(turns/m).toFixed(2),stalls,by:by.sort((a,b)=>b.wr-a.wr)},null,2));
