import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { counterEligibility } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
function val(c){ if(!c)return 0; let v=0; if(c.special)v+=140; if(c.pinEscape||c.special?.type==='pinEscape')v+=120; if(c.finisher)v+=110; if(c.trademark)v+=55; if(c.kind==='move')v+=(c.damage??0)*3+(c.cost??0); if(c.kind==='momentum')v+=8; if(c.kind==='action')v+=25; if(c.kind==='support')v+=22; if(c.kind==='manager')v+=30; if(c.defensiveOnly)v-=25; const cov=(c.counterStates?.length??0)+(c.counterSubmissionTargets?.length??0)+(c.counters?.length??0)+(c.countersCardIds?.length??0); v+=cov*3; return v; }
const stars=Object.values(superstars);
let counterWindows=0, multiLegal=0, chosenOffensiveWhenDefensive=0, chosenFinisherAvoidable=0, chosenTrademarkAvoidable=0, chosenValueGap=0;
let subMaintains=0, subBadDitches=0, subFinisherDitches=0, subTrademarkDitches=0, subSpecialDitches=0;
let offensiveCounterCardsPlayed=0, offensiveMovesPlayed=0;
const byStar={};
for(const st of stars)byStar[st.id]={counterMulti:0,badCounter:0,subBad:0,offCounterSpent:0};
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){
 const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(99173+i*503+j*17)}); let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<1800){
  const s=g.state(),pid=decisionOwner(s); if(!pid)break; const p=s.players[pid]; const d=cpuDecision(g,pid); if(!d)break;
  if(s.phase==='COUNTER'){
    counterWindows++;
    const legal=p.hand.filter(c=>counterEligibility(s,pid,s.proposedMove.card,c).legal);
    if(legal.length>1 && d.type==='counter'){
      multiLegal++; byStar[p.superstar.id].counterMulti++;
      const chosen=d.card; const others=legal.filter(c=>c!==chosen);
      let bad=false;
      if(!chosen.defensiveOnly && others.some(c=>c.defensiveOnly)){chosenOffensiveWhenDefensive++; bad=true;}
      if(chosen.finisher && others.some(c=>!c.finisher)){chosenFinisherAvoidable++; bad=true;}
      if(chosen.trademark && others.some(c=>!c.trademark&&!c.finisher)){chosenTrademarkAvoidable++; bad=true;}
      const low=Math.min(...legal.map(val)); if(val(chosen)>=low+35){chosenValueGap++; bad=true;}
      if(bad)byStar[p.superstar.id].badCounter++;
    }
  }
  if(s.phase==='SUBMISSION_MAINTAIN' && d.type==='maintain'){
    subMaintains++;
    const chosen=p.hand[d.index??0]; const lowest=[...p.hand].sort((a,b)=>val(a)-val(b))[0];
    if(chosen && lowest && val(chosen)>=val(lowest)+30){subBadDitches++;byStar[p.superstar.id].subBad++}
    if(chosen?.finisher)subFinisherDitches++;
    if(chosen?.trademark)subTrademarkDitches++;
    if(chosen?.special)subSpecialDitches++;
  }
  if(s.phase==='ACTION' && d.type==='move'){
    offensiveMovesPlayed++;
    const c=d.card; const cov=(c.counterStates?.length??0)+(c.counterSubmissionTargets?.length??0)+(c.counters?.length??0)+(c.countersCardIds?.length??0);
    if(cov>0){offensiveCounterCardsPlayed++;byStar[p.superstar.id].offCounterSpent++}
  }
  if(!executeCpuDecision(g,d,pid))break;
 }
}
const topBad=Object.entries(byStar).map(([id,x])=>({id,...x,badCounterPct:+(100*x.badCounter/Math.max(1,x.counterMulti)).toFixed(1)})).sort((a,b)=>b.badCounter-a.badCounter).slice(0,15);
console.log(JSON.stringify({counterWindows,multiLegal,chosenOffensiveWhenDefensive,chosenFinisherAvoidable,chosenTrademarkAvoidable,chosenValueGap,subMaintains,subBadDitches,subFinisherDitches,subTrademarkDitches,subSpecialDitches,offensiveMovesPlayed,offensiveCounterCardsPlayed,offensiveCounterPct:+(100*offensiveCounterCardsPlayed/offensiveMovesPlayed).toFixed(1),topBad},null,2));
