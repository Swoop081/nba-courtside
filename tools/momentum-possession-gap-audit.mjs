import {superstars} from '../js/data/superstars.js';
import {decks} from '../js/data/decks.js';
import {MatchEngine} from '../js/engine/MatchEngine.js';
import {decisionOwner,cpuDecision,executeCpuDecision} from '../js/ai/WrestlingAI.js';
const stars=Object.values(superstars),N=Number(process.env.MATCHES_PER_PAIR||2);const rng=seed=>{let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};};
const totalMethod=p=>(p.momentum.strength||0)+(p.momentum.strike||0)+(p.momentum.technical||0)+(p.momentum.agility||0);const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;const pct=(n,d)=>d?100*n/d:0;const round=(n,d=2)=>Number(n.toFixed(d));
let matches=0,stalls=0,firstP2Zero=0,firstP2Total=0;const firstControlGap=[],openingP1Moves=[],openingP1MomentumPlays=[],winnerEndM=[],loserEndM=[],winnerMomPlays=[],loserMomPlays=[],firstP2Damage=[];const buckets={};
for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++)for(let k=0;k<N;k++){
 const a=k%2===0?stars[i]:stars[j],b=k%2===0?stars[j]:stars[i],g=new MatchEngine({p1:a,p2:b,decks,rng:rng(0x4a39b70d^(i*1000003+j*10007+k*97))});
 const mom={p1:0,p2:0},movesBySeq=new Map(),damageBySeq=new Map();let p2FirstSeen=false,p2FirstSeq=null,p2FirstStartGap=null,steps=0,last=g.state().log.length;
 while(g.state().phase!=='MATCH_OVER'&&steps++<2500){const s=g.state(),pid=decisionOwner(s);if(!pid)break;if(!p2FirstSeen&&s.phase==='ACTION'&&s.playerInControl==='p2'){p2FirstSeen=true;p2FirstSeq=s.controlSequence;p2FirstStartGap=totalMethod(s.players.p1)-totalMethod(s.players.p2);firstControlGap.push(p2FirstStartGap);}
 const d=cpuDecision(g,pid);if(!d)break;if(!executeCpuDecision(g,d,pid))break;const logs=g.state().log;for(const e of logs.slice(last)){if(e.type==='MOMENTUM_PLAYED')mom[e.playerId]++;if(e.type==='MOVE_CONNECTED'){const cs=g.state().controlSequence; /* engine seq is stable for retained offense; counter attacks are rare */ movesBySeq.set(cs,(movesBySeq.get(cs)||0)+1);damageBySeq.set(cs,(damageBySeq.get(cs)||0)+(e.damage||0));}}last=logs.length;
 }
 const s=g.state();matches++;if(s.phase!=='MATCH_OVER'){stalls++;continue;}const win=s.winner,lose=win==='p1'?'p2':'p1';winnerEndM.push(totalMethod(s.players[win]));loserEndM.push(totalMethod(s.players[lose]));winnerMomPlays.push(mom[win]);loserMomPlays.push(mom[lose]);
 // sequence 1 is opening P1 Control. P2 first sequence is whatever state recorded.
 const openMoves=movesBySeq.get(1)||0;openingP1Moves.push(openMoves);openingP1MomentumPlays.push(Math.min(mom.p1,openMoves+1));
 if(p2FirstSeq!=null){firstP2Total++;const m=movesBySeq.get(p2FirstSeq)||0,dmg=damageBySeq.get(p2FirstSeq)||0;firstP2Damage.push(dmg);if(m===0)firstP2Zero++;const key=String(Math.min(5,openMoves));buckets[key]??={matches:0,p2Zero:0,gap:0,p2Damage:0};buckets[key].matches++;buckets[key].p2Zero+=m===0;buckets[key].gap+=p2FirstStartGap||0;buckets[key].p2Damage+=dmg;}
}
const bucketRows=Object.entries(buckets).map(([openingMoves,x])=>({openingMoves:openingMoves==='5'?'5+':Number(openingMoves),matches:x.matches,p2ZeroPct:round(pct(x.p2Zero,x.matches),1),avgMethodGapAtP2FirstControl:round(x.gap/x.matches,2),avgP2FirstDamage:round(x.p2Damage/x.matches,2)})).sort((a,b)=>String(a.openingMoves).localeCompare(String(b.openingMoves),undefined,{numeric:true}));
console.log(JSON.stringify({matches,stalls,firstP2:{zeroMovePct:round(pct(firstP2Zero,firstP2Total),1),avgMethodGapP1MinusP2:round(avg(firstControlGap),2),avgDamage:round(avg(firstP2Damage),2)},openingP1:{avgMoves:round(avg(openingP1Moves),2)},endMomentum:{winnerAvg:round(avg(winnerEndM),2),loserAvg:round(avg(loserEndM),2),gap:round(avg(winnerEndM)-avg(loserEndM),2)},momentumPlays:{winnerAvg:round(avg(winnerMomPlays),2),loserAvg:round(avg(loserMomPlays),2),gap:round(avg(winnerMomPlays)-avg(loserMomPlays),2)},byOpeningSequenceLength:bucketRows},null,2));
