import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { counterEligibility } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars); let windows=0,multi=0,defChosenWithOff=0,offChosenWithDef=0,defWhileBehind=0,offAvailWhileBehind=0;
const rows=[]; const by={}; for(const st of stars)by[st.id]={multi:0,defWithOff:0,behind:0};
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){
 const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(45191+i*997+j*31)});let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<1800){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const p=s.players[pid],d=cpuDecision(g,pid);if(!d)break;
  if(s.phase==='COUNTER'){windows++;const legal=p.hand.filter(c=>counterEligibility(s,pid,s.proposedMove.card,c).legal);if(legal.length>1&&d.type==='counter'){multi++;by[p.superstar.id].multi++;const chosen=d.card,hasOff=legal.some(c=>!c.defensiveOnly),hasDef=legal.some(c=>c.defensiveOnly);const opp=s.players[pid==='p1'?'p2':'p1'];const behind=(p.hp/p.maxHp)<(opp.hp/opp.maxHp-.10);if(chosen.defensiveOnly&&hasOff){defChosenWithOff++;by[p.superstar.id].defWithOff++;if(behind){defWhileBehind++;by[p.superstar.id].behind++;}}if(!chosen.defensiveOnly&&hasDef){offChosenWithDef++;if(behind)offAvailWhileBehind++;}}
  }
  if(!executeCpuDecision(g,d,pid))break;
 }
}
console.log(JSON.stringify({windows,multi,defChosenWithOff,offChosenWithDef,defWhileBehind,offAvailWhileBehind,top:Object.entries(by).map(([id,x])=>({id,...x,pct:+(100*x.defWithOff/Math.max(1,x.multi)).toFixed(1)})).sort((a,b)=>b.defWithOff-a.defWithOff).slice(0,15)},null,2));
