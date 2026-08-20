import {superstars} from '../js/data/superstars.js';import {decks} from '../js/data/decks.js';import {allGameplayCards} from '../js/data/content.js';import {MatchEngine} from '../js/engine/MatchEngine.js';import {decisionOwner,cpuDecision,executeCpuDecision} from '../js/ai/WrestlingAI.js';import {moveEligibility} from '../js/engine/rules.js';
const stars=Object.values(superstars),byId=new Map(allGameplayCards.map(c=>[c.id,c])),N=Number(process.env.MATCHES_PER_PAIR||2);const rng=seed=>{let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};};
let autoPages=0,autoMom=0,subPages=0,subMom=0,matches=0,methodPasses=0,methodPassAfterMomDiscard=0;const methods={strength:0,strike:0,technical:0,agility:0};
for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++)for(let k=0;k<N;k++){
 const a=k%2===0?stars[i]:stars[j],b=k%2===0?stars[j]:stars[i],g=new MatchEngine({p1:a,p2:b,decks,rng:rng(0x7f4a7c15^(i*1000003+j*10007+k*97))}),discardedMom={p1:{},p2:{}};let last=g.state().log.length,steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<2500){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const d=cpuDecision(g,pid);if(!d)break;if(s.phase==='ACTION'&&d.type==='pass'){
   const offense=s.players[pid].hand.filter(c=>c.kind==='move'&&!c.defensiveOnly);const reasons=offense.map(c=>({c,r:moveEligibility(s,pid,c).reason||''}));const blockedMethods=new Set();for(const {r} of reasons){const m=r.match(/^Need \d+ (strength|strike|technical|agility) Momentum$/i);if(m)blockedMethods.add(m[1].toLowerCase());}
   if(blockedMethods.size){methodPasses++;if([...blockedMethods].some(m=>(discardedMom[pid][m]||0)>0))methodPassAfterMomDiscard++;}
 }
 if(!executeCpuDecision(g,d,pid))break;const logs=g.state().log;for(const e of logs.slice(last)){
   if(e.type==='AUTO_COUNTER'){autoPages+=(e.discardedCardIds||[]).length;for(const id of e.discardedCardIds||[]){const c=byId.get(id);if(c?.kind==='momentum'){autoMom++;methods[c.method]=(methods[c.method]||0)+1;discardedMom[e.defenderId][c.method]=(discardedMom[e.defenderId][c.method]||0)+1;}}}
   if(e.type==='SUBMISSION_MAINTAINED'){subPages++;const c=byId.get(e.cardId);if(c?.kind==='momentum'){subMom++;methods[c.method]=(methods[c.method]||0)+1;discardedMom[e.attackerId][c.method]=(discardedMom[e.attackerId][c.method]||0)+1;}}
 }last=logs.length;
 }matches++;
}
console.log(JSON.stringify({matches,autoCounter:{pagesDiscarded:autoPages,momentumDiscarded:autoMom,momentumPct:autoPages?100*autoMom/autoPages:0},submission:{pagesDiscarded:subPages,momentumDiscarded:subMom,momentumPct:subPages?100*subMom/subPages:0},momentumDiscardMethods:methods,methodBlockedPasses:methodPasses,methodBlockedPassesAfterSameMethodMomentumDiscard:methodPassAfterMomDiscard,pct:methodPasses?100*methodPassAfterMomDiscard/methodPasses:0},null,2));
