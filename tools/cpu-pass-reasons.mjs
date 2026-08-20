import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { moveEligibility,canPlayMomentum,canPlayAction } from '../js/engine/rules.js';
import { totalMomentum } from '../js/engine/utils.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
function simMom(s,pid,c){const x=structuredClone(s),p=x.players[pid];p.momentum[c.method]=(p.momentum[c.method]??0)+(c.amount??1);p.turn.momentumPlayed=(p.turn.momentumPlayed??0)+1;return x;}
function simAction(s,pid,c){const x=structuredClone(s),p=x.players[pid],ef=c.effect??{};p.turn.actionPlayed=(p.turn.actionPlayed??0)+1;if(ef.type==='discountNext')p.nextMoveDiscount=(p.nextMoveDiscount??0)+(ef.amount??0);if(ef.type==='gainAdrenaline'){p.adrenaline=(p.adrenaline??0)+(ef.amount??1);p.momentum.attitude=p.adrenaline;}if(ef.type==='romanOohAhh'){if(p.hand.some(k=>k.name===(ef.name??"Roman's Spear"))){p.adrenaline=(p.adrenaline??0)+(ef.adrenalineIfInHand??0);p.momentum.attitude=p.adrenaline;}p.namedDiscount[ef.name??"Roman's Spear"]=(p.namedDiscount[ef.name??"Roman's Spear"]??0)+(ef.discount??0);}return x;}
function legalMoves(s,pid){return s.players[pid].hand.filter(c=>c.kind==='move'&&!c.defensiveOnly&&moveEligibility(s,pid,c).legal);}
const stars=Object.values(superstars);let samples=0;const reasons={},actionUnlock={};let noOffensiveMoves=0;
for(let i=0;i<20;i++)for(let j=0;j<20;j++)if(i!==j){const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(7070+i*101+j)});let steps=0;while(g.state().phase!=='MATCH_OVER'&&steps++<1500){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const d=cpuDecision(g,pid);if(!d)break;if(s.phase==='ACTION'&&d.type==='momentum'){
 const after=simMom(s,pid,d.card);if(!legalMoves(after,pid).length){samples++;const off=s.players[pid].hand.filter(c=>c.kind==='move'&&!c.defensiveOnly);if(!off.length){noOffensiveMoves++;reasons['no offensive move in hand']=(reasons['no offensive move in hand']||0)+1;}else{const rs=off.map(c=>moveEligibility(after,pid,c).reason);for(const r of new Set(rs))reasons[r]=(reasons[r]||0)+1;}
 for(const a of s.players[pid].hand.filter(c=>canPlayAction(s,pid,c))){const aa=simAction(s,pid,a);if(legalMoves(aa,pid).length){actionUnlock[a.name]=(actionUnlock[a.name]||0)+1;}}
 }
}
if(!executeCpuDecision(g,d,pid))break;}}
console.log(JSON.stringify({samples,noOffensiveMoves,reasons:Object.entries(reasons).sort((a,b)=>b[1]-a[1]).slice(0,30),actionUnlock},null,2));
