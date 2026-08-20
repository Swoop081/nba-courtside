import {superstars} from '../js/data/superstars.js';
import {decks} from '../js/data/decks.js';
import {MatchEngine} from '../js/engine/MatchEngine.js';
import {decisionOwner,cpuDecision,executeCpuDecision} from '../js/ai/WrestlingAI.js';
import {moveEligibility} from '../js/engine/rules.js';
const stars=Object.values(superstars); const rng=seed=>{let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};};
let out=[];
for(let i=0;i<stars.length&&out.length<30;i++)for(let j=i+1;j<stars.length&&out.length<30;j++){
 const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(0x12345678^i*99991^j*733)});let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<1000&&out.length<30){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const d=cpuDecision(g,pid);if(!d)break;if(s.phase==='ACTION'&&d.type==='pass'){const p=s.players[pid];const offense=p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly);const rows=offense.map(c=>({name:c.name,cost:c.cost,method:c.method,req:c.requirements,reason:moveEligibility(s,pid,c).reason}));if(rows.some(x=>/^Need \d+ (strength|strike|technical|agility) Momentum$/i.test(x.reason||''))){out.push({star:p.superstar.name,turn:s.turnNumber,controlMoveCount:p.controlMoveCount,adrenaline:p.adrenaline,momentum:{...p.momentum},hand:p.hand.map(c=>({name:c.name,kind:c.kind,method:c.method})),moves:rows});}}
 if(!executeCpuDecision(g,d,pid))break;}
}
console.log(JSON.stringify(out,null,2));
