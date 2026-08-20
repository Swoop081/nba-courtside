import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner, cpuDecision, executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { totalMomentum } from '../js/engine/utils.js';
import { moveEligibility } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars);
let n=0,hand=0,att=0,method=0,total=0,off=0,def=0,mom=0; const deficits={};
for(let i=0;i<stars.length;i++){
  for(let j=0;j<stars.length;j++){
    if(i===j)continue;
    const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(8100+i*101+j)});
    let z=0;
    while(g.state().phase!=='MATCH_OVER'&&z++<1500){
      const s=g.state(), pid=decisionOwner(s), d=cpuDecision(g,pid); if(!d)break;
      if(s.phase==='ACTION'&&d.type==='pass'){
        const p=s.players[pid]; n++; hand+=p.hand.length; att+=p.adrenaline;
        method+=(p.momentum.strength+p.momentum.strike+p.momentum.technical+p.momentum.agility); total+=totalMomentum(p);
        off+=p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly).length;
        def+=p.hand.filter(c=>c.kind==='move'&&c.defensiveOnly).length;
        mom+=p.hand.filter(c=>c.kind==='momentum').length;
        for(const c of p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly)){
          const r=moveEligibility(s,pid,c).reason; deficits[r]=(deficits[r]||0)+1;
        }
      }
      if(!executeCpuDecision(g,d,pid))break;
    }
  }
}
console.log(JSON.stringify({passes:n,avgHand:hand/n,avgAttitude:att/n,avgMethodMomentum:method/n,avgTotalCapacity:total/n,avgOffensiveMovesInHand:off/n,avgDefensiveMovesInHand:def/n,avgMomentumInHand:mom/n,reasons:Object.entries(deficits).sort((a,b)=>b[1]-a[1]).slice(0,20)},null,2));
