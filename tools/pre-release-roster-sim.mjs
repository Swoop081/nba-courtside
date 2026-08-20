import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { isInternalTestSetId } from "../js/data/release.js";
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { decisionOwner, cpuDecision, executeCpuDecision } from "../js/ai/WrestlingAI.js";

const stars = Object.values(superstars).filter(star => isInternalTestSetId(star.setId));
if (stars.length !== 45) throw new Error(`Expected 45 released + authored pre-release test Superstars, found ${stars.length}`);
function seededRng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stats=Object.fromEntries(stars.map(s=>[s.id,{id:s.id,name:s.name,setId:s.setId,wins:0,losses:0,turns:0}]));
const finishes={};let matches=0,stalls=0,totalTurns=0;
for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++)for(let g=0;g<20;g++){
  const flip=g%2===1,p1=flip?stars[j]:stars[i],p2=flip?stars[i]:stars[j];
  const engine=new MatchEngine({p1,p2,decks,rng:seededRng(1330000+i*100003+j*1009+g*37)});let steps=0;
  while(engine.state().phase!=="MATCH_OVER"&&steps++<2000){const pid=decisionOwner(engine.state()),d=cpuDecision(engine,pid);if(!d||!executeCpuDecision(engine,d,pid))break;}
  const s=engine.state();matches++;totalTurns+=s.turnNumber;stats[p1.id].turns+=s.turnNumber;stats[p2.id].turns+=s.turnNumber;
  if(s.phase!=="MATCH_OVER"){stalls++;continue;}const finish=s.finish?.type??"unknown";finishes[finish]=(finishes[finish]??0)+1;
  if(s.winner){const w=s.players[s.winner].superstar.id,l=s.players[s.winner==="p1"?"p2":"p1"].superstar.id;stats[w].wins++;stats[l].losses++;}
}
const rows=Object.values(stats).map(r=>{const played=r.wins+r.losses;return{...r,played,winRate:Number((100*r.wins/Math.max(1,played)).toFixed(1)),avgTurns:Number((r.turns/Math.max(1,played)).toFixed(1))};}).sort((a,b)=>b.winRate-a.winRate||a.name.localeCompare(b.name));
console.log(JSON.stringify({testSuperstars:stars.length,matches,stalls,averageTurns:Number((totalTurns/Math.max(1,matches)).toFixed(2)),finishes,rows},null,2));if(stalls)process.exit(1);
