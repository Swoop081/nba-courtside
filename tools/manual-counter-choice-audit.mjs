import {superstars} from '../js/data/superstars.js';import {decks} from '../js/data/decks.js';import {MatchEngine} from '../js/engine/MatchEngine.js';import {decisionOwner,cpuDecision,executeCpuDecision} from '../js/ai/WrestlingAI.js';import {counterEligibility} from '../js/engine/rules.js';
const stars=Object.values(superstars),N=Number(process.env.MATCHES_PER_PAIR||2);const rng=seed=>{let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};};
let windows=0,multi=0,chosenPremiumWithNonPremium=0,chosenDefensiveWithOffensive=0,chosenOffensive=0,offensiveAvailable=0,chosenFinisher=0,chosenTrademark=0;const examples=[];
for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++)for(let k=0;k<N;k++){
 const a=k%2===0?stars[i]:stars[j],b=k%2===0?stars[j]:stars[i],g=new MatchEngine({p1:a,p2:b,decks,rng:rng(0x6a09e667^(i*1000003+j*10007+k*97))});let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<2500){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const d=cpuDecision(g,pid);if(!d)break;if(s.phase==='COUNTER'){
   windows++;const p=s.players[pid],inc=s.proposedMove.card,legal=p.hand.filter(c=>counterEligibility(s,pid,inc,c).legal);if(legal.length>1){multi++;const chosen=d.type==='counter'?d.card:null;if(chosen){const nonPremium=legal.filter(c=>!c.finisher&&!c.trademark);if((chosen.finisher||chosen.trademark)&&nonPremium.length){chosenPremiumWithNonPremium++;if(examples.length<12)examples.push({star:p.superstar.name,incoming:inc.name,chosen:chosen.name,alternatives:legal.map(c=>({name:c.name,finisher:!!c.finisher,trademark:!!c.trademark,defensiveOnly:!!c.defensiveOnly,damage:c.damage||0}))});}const off=legal.filter(c=>!c.defensiveOnly);if(off.length){offensiveAvailable++;if(chosen.defensiveOnly)chosenDefensiveWithOffensive++;}if(!chosen.defensiveOnly)chosenOffensive++;if(chosen.finisher)chosenFinisher++;if(chosen.trademark)chosenTrademark++;}}
 }
 if(!executeCpuDecision(g,d,pid))break;
 }
}
console.log(JSON.stringify({windows,multiLegalWindows:multi,multiPct:100*multi/windows,chosenPremiumWithNonPremium,chosenDefensiveWhenOffensiveAvailable:chosenDefensiveWithOffensive,offensiveAvailable,chosenOffensive,chosenFinisher,chosenTrademark,examples},null,2));
