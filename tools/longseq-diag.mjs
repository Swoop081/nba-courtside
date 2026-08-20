import {MatchEngine} from '../js/engine/MatchEngine.js';import {superstars} from '../js/data/superstars.js';import {decks} from '../js/data/decks.js';import {cpuDecision,executeCpuDecision,decisionOwner} from '../js/ai/WrestlingAI.js';
const stars=Object.values(superstars);function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
let cases=0,move=0,pass=0,momPass=0,actions={},by={};
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(12345+i*101+j)});let steps=0,watch=null;
 while(g.state().phase!=='MATCH_OVER'&&steps++<1500){const s=g.state(),pid=decisionOwner(s),d=cpuDecision(g,pid);if(!d)break;
   // Recovery watch only when controller voluntarily passes after connecting 5+ Moves in its sequence.
   if(s.phase==='ACTION'&&d.type==='pass'&&(s.players[pid]?.controlMoveCount??0)>=5){watch={pid:pid==='p1'?'p2':'p1',sawMom:false,sawUtil:false,star:s.players[pid==='p1'?'p2':'p1'].superstar.id};cases++;}
   if(watch&&pid===watch.pid&&s.phase==='ACTION'){
     if(d.type==='momentum')watch.sawMom=true;
     else if(['action','support','special','manager'].includes(d.type))watch.sawUtil=true;
     else if(d.type==='move'){move++;by[watch.star]??={cases:0,move:0,pass:0,momPass:0};by[watch.star].move++;watch=null;}
     else if(d.type==='pass'){pass++;if(watch.sawMom)momPass++;by[watch.star]??={cases:0,move:0,pass:0,momPass:0};by[watch.star].pass++;if(watch.sawMom)by[watch.star].momPass++;watch=null;}
   }
   if(!executeCpuDecision(g,d,pid))break;
 }
}
for(const x of Object.values(by))x.cases=x.move+x.pass;
console.log(JSON.stringify({cases,observed:move+pass,move,pass,momPass,passPct:+(100*pass/(move+pass||1)).toFixed(2),momPassPct:+(100*momPass/(move+pass||1)).toFixed(2),top:Object.entries(by).map(([id,x])=>({id,...x,passPct:+(100*x.pass/(x.cases||1)).toFixed(1)})).sort((a,b)=>b.passPct-a.passPct).slice(0,20)},null,2));
