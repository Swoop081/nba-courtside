import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars), exchange=new Set(['punch','elbow']);
let matches=0,stalls=0,totalCounterAttacks=0,depth2plus=0,nonExchangeDepth2plus=0,maxDepth=0,matchesDepth2=0;
const byCard=new Map(), depthHist=new Map();
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){
 const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(12345+i*101+j)}); let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<1500){const pid=decisionOwner(g.state()),d=cpuDecision(g,pid);if(!d||!executeCpuDecision(g,d,pid))break;}
 matches++; if(g.state().phase!=='MATCH_OVER')stalls++;
 const events=g.state().log.filter(e=>e.type==='COUNTER_ATTACK_DECLARED'); let had2=false;
 for(const e of events){
   totalCounterAttacks++; const d=e.depth??1; maxDepth=Math.max(maxDepth,d); depthHist.set(d,(depthHist.get(d)||0)+1);
   if(d>=2){had2=true;depth2plus++;if(!exchange.has(e.cardId))nonExchangeDepth2plus++;byCard.set(e.cardId,(byCard.get(e.cardId)||0)+1);}
 }
 if(had2)matchesDepth2++;
}
console.log(JSON.stringify({matches,stalls,totalCounterAttacks,depth2plus,matchesDepth2,maxDepth,nonExchangeDepth2plus,depthHistogram:Object.fromEntries([...depthHist].sort((a,b)=>a[0]-b[0])),topDepth2Cards:[...byCard].sort((a,b)=>b[1]-a[1]).slice(0,20).map(([cardId,count])=>({cardId,count}))},null,2));
if(stalls||nonExchangeDepth2plus)process.exitCode=1;
