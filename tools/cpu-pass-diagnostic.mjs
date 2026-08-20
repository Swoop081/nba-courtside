import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { moveEligibility, canPlayMomentum } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
function simAfterMom(s,pid,card){const b=s.players[pid],p={...b,momentum:{...b.momentum,[card.method]:(b.momentum?.[card.method]??0)+(card.amount??1)},turn:{...b.turn,momentumPlayed:(b.turn?.momentumPlayed??0)+1},momentumPlayedThisTurn:true};return {...s,players:{...s.players,[pid]:p}};}
function legalMoves(s,pid){return s.players[pid].hand.filter(c=>c.kind==='move'&&!c.defensiveOnly&&moveEligibility(s,pid,c).legal);}
const stars=Object.values(superstars);
let matches=0, passes=0, momentumThenPass=0, controlStarts=0, startsNoMove=0, startsUnlockableBySomeMom=0, badMomChoice=0, unavoidableAfterMom=0, passWithLegalMove=0;
const by={};
for(const st of stars)by[st.id]={control:0,momPass:0,badChoice:0,passes:0};
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){
 const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(4040+i*101+j)}); let steps=0; const last={p1:null,p2:null}; let lastControlSeq=g.state().controlSequence;
 while(g.state().phase!=='MATCH_OVER'&&steps++<1500){
   const s=g.state(),pid=decisionOwner(s); if(!pid)break;
   if(s.phase==='ACTION'){
     // first decision in a control sequence/turn where no action yet
     if(last[pid]===null || last[pid]==='control-start'){}
   }
   const d=cpuDecision(g,pid); if(!d)break;
   if(s.phase==='ACTION' && d.type==='pass'){
     passes++;by[s.players[pid].superstar.id].passes++;
     if(legalMoves(s,pid).length)passWithLegalMove++;
     if(last[pid]==='momentum'){momentumThenPass++;by[s.players[pid].superstar.id].momPass++;
       // reconstruct impossible pre-state unavailable, but inspect current state other momentum impossible due play limit
     }
   }
   if(s.phase==='ACTION' && (s.players[pid].turn?.momentumPlayed??0)===0 && (s.players[pid].turn?.actionPlayed??0)===0 && (s.players[pid].turn?.specialPlayed??0)===0){
      controlStarts++;by[s.players[pid].superstar.id].control++;
      const lm=legalMoves(s,pid); if(!lm.length){
        startsNoMove++;
        const moms=s.players[pid].hand.filter(c=>canPlayMomentum(s,pid,c));
        const unlocking=moms.filter(m=>legalMoves(simAfterMom(s,pid,m),pid).length>0);
        if(unlocking.length)startsUnlockableBySomeMom++;
        if(d.type==='momentum'){
          const chosenUnlocks=legalMoves(simAfterMom(s,pid,d.card),pid).length>0;
          if(!chosenUnlocks && unlocking.length){badMomChoice++;by[s.players[pid].superstar.id].badChoice++;}
          if(!chosenUnlocks && !unlocking.length)unavoidableAfterMom++;
        }
      }
   }
   last[pid]=d.type;
   if(!executeCpuDecision(g,d,pid))break;
   // reset other player's last when control changes; simplistic
   const ns=g.state(); if(ns.playerInControl!==pid){last[ns.playerInControl]='control-start'; last[pid]=null;} else if(ns.phase!=='ACTION' && !['COUNTER','POST_MOVE','SUBMISSION_MAINTAIN'].includes(ns.phase)){}
 }
 matches++;
}
const top=Object.entries(by).map(([id,x])=>({id,...x,momPassPct:+(100*x.momPass/Math.max(1,x.control)).toFixed(1)})).sort((a,b)=>b.momPassPct-a.momPassPct).slice(0,15);
console.log(JSON.stringify({matches,controlStarts,startsNoMove,startsNoMovePct:+(100*startsNoMove/controlStarts).toFixed(1),startsUnlockableBySomeMom,badMomChoice,unavoidableAfterMom,passes,momentumThenPass,momentumThenPassPerMatch:+(momentumThenPass/matches).toFixed(2),passWithLegalMove,top},null,2));
