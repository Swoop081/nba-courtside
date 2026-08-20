import {superstars} from '../js/data/superstars.js';
import {decks} from '../js/data/decks.js';
import {MatchEngine} from '../js/engine/MatchEngine.js';
import {decisionOwner,cpuDecision,executeCpuDecision} from '../js/ai/WrestlingAI.js';
import {moveEligibility,canPlayMomentum} from '../js/engine/rules.js';
const stars=Object.values(superstars),N=Number(process.env.MATCHES_PER_PAIR||2);
const rng=seed=>{let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};};
const simAfterMomentum=(s,pid,c)=>{const b=s.players[pid],p={...b,momentum:{...b.momentum,[c.method]:(b.momentum[c.method]||0)+(c.amount||1)},turn:{...b.turn,momentumPlayed:(b.turn?.momentumPlayed||0)+1},momentumPlayedThisTurn:true};return {...s,players:{...s.players,[pid]:p}};};
const legalMoves=(s,pid)=>s.players[pid].hand.filter(c=>c.kind==='move'&&!c.defensiveOnly&&moveEligibility(s,pid,c).legal);
let zero=0,noOffense=0,legalAtStart=0,oneMomentumCouldUnlock=0,choseUnlockingMomentum=0,choseWrongMomentum=0,noOneStepUnlock=0,withPlayableMomentum=0;
const examples=[];
for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++)for(let k=0;k<N;k++){
 const a=k%2===0?stars[i]:stars[j],b=k%2===0?stars[j]:stars[i],g=new MatchEngine({p1:a,p2:b,decks,rng:rng(0x51ed270b^(i*1000003+j*10007+k*97))});
 const meta=new Map();let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<2500){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const cs=s.controlSequence;
   if(s.phase==='ACTION'&&!meta.has(cs)){
     const p=s.players[pid],off=p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly),moms=p.hand.filter(c=>canPlayMomentum(s,pid,c));
     const unlock=moms.filter(c=>legalMoves(simAfterMomentum(s,pid,c),pid).length>0);
     meta.set(cs,{owner:pid,star:p.superstar.name,startOffense:off.length,startLegal:legalMoves(s,pid).length,playableMomentum:moms.map(c=>c.method),unlockMethods:[...new Set(unlock.map(c=>c.method))],chosenMomentum:null,moves:0,startMomentum:{...p.momentum},startAd:p.adrenaline});
   }
   const d=cpuDecision(g,pid);if(!d)break;const q=meta.get(cs);
   if(s.phase==='ACTION'&&q&&d.type==='momentum'&&q.chosenMomentum==null)q.chosenMomentum=d.card.method;
   const last=s.log.length;if(!executeCpuDecision(g,d,pid))break;for(const e of g.state().log.slice(last))if(e.type==='MOVE_CONNECTED'){const qq=meta.get(e.controlSequence??cs);if(qq)qq.moves++;}
   if(s.phase==='ACTION'&&d.type==='pass'&&q&&q.moves===0){zero++;if(q.startOffense===0)noOffense++;if(q.startLegal>0)legalAtStart++;if(q.playableMomentum.length)withPlayableMomentum++;if(q.unlockMethods.length){oneMomentumCouldUnlock++;if(q.chosenMomentum&&q.unlockMethods.includes(q.chosenMomentum))choseUnlockingMomentum++;else{choseWrongMomentum++;if(examples.length<20)examples.push(q);}}else noOneStepUnlock++;}
 }
}
console.log(JSON.stringify({zeroMovePasses:zero,noOffense,legalAtStart,withPlayableMomentum,oneMomentumCouldUnlock,choseUnlockingMomentum,choseWrongMomentum,noOneStepUnlock,wrongChoicePctOfUnlockable:oneMomentumCouldUnlock?100*choseWrongMomentum/oneMomentumCouldUnlock:0,oneStepUnlockPct:zero?100*oneMomentumCouldUnlock/zero:0,examples},null,2));
