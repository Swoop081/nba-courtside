import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner, cpuDecision, executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { moveEligibility } from '../js/engine/rules.js';

const stars=Object.values(superstars);
const N=Number(process.env.MATCHES_PER_PAIR||2);
const KSTART=Number(process.env.K_START||0);
const rng=seed=>{let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};};
const other=id=>id==='p1'?'p2':'p1';
const pct=(n,d)=>d?100*n/d:0;
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const quant=(a,q)=>{if(!a.length)return 0;const b=[...a].sort((x,y)=>x-y),p=(b.length-1)*q,l=Math.floor(p),h=Math.ceil(p);return l===h?b[l]:b[l]+(b[h]-b[l])*(p-l);};
const round=(n,d=2)=>Number(n.toFixed(d));

let matches=0,stalls=0,p1Wins=0;
const allSeq=[],winnerSeq=[],loserSeq=[],behindSeq=[];
const winnerLongestShares=[],winnerLongestDamage=[],loserLongestDamage=[];
const openingP1Damage=[],firstP2Damage=[],firstP2Ad=[];
const passes={total:0,noOffense:0,withOffense:0,methodBlocked:0,costBlocked:0,postureBlocked:0,otherBlocked:0,afterZeroMoves:0,afterOneMove:0,afterMultiMoves:0,offenseCards:[],handSize:[],adrenaline:[],methodTotal:[]};
const behindPass={total:0,zeroMove:0,oneMove:0,multiMove:0};
const byStar=Object.fromEntries(stars.map(s=>[s.id,{name:s.name,seq:0,moves:0,damage:0,pass:0,methodBlockedPass:0,behindSeq:0,behindZero:0,behindDamage:0}]));

for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++)for(let kk=0;kk<N;kk++){
 const k=KSTART+kk,a=k%2===0?stars[i]:stars[j],b=k%2===0?stars[j]:stars[i];
 const g=new MatchEngine({p1:a,p2:b,decks,rng:rng(0x9e3779b9^(i*1000003+j*10007+k*97))});
 const origLog=g._log.bind(g);
 g._log=(type,data={})=>{const s=g.state();origLog(type,{...data,controlSequence:s.controlSequence,controlOwner:s.playerInControl,p1Hp:s.players.p1.hp,p2Hp:s.players.p2.hp,p1Ad:s.players.p1.adrenaline,p2Ad:s.players.p2.adrenaline});};
 const seqs=new Map();
 const ensure=(cs,owner,snap)=>{if(!seqs.has(cs)){const op=other(owner),p=snap.players[owner],d=snap.players[op];seqs.set(cs,{cs,owner,starId:p.superstar.id,moves:0,damage:0,pass:false,startOwnRatio:p.hp/p.maxHp,startOppRatio:d.hp/d.maxHp,startAd:p.adrenaline,startTurn:snap.turnNumber});}return seqs.get(cs);};
 ensure(g.state().controlSequence,'p1',g.state());
 let lastLog=g.state().log.length,steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<3500){
   const s=g.state(),pid=decisionOwner(s);if(!pid)break;
   ensure(s.controlSequence,s.playerInControl,s);
   const d=cpuDecision(g,pid);if(!d)break;
   if(s.phase==='ACTION'&&d.type==='pass'){
     const q=ensure(s.controlSequence,pid,s),p=s.players[pid];q.pass=true;passes.total++;passes.handSize.push(p.hand.length);passes.adrenaline.push(p.adrenaline);passes.methodTotal.push((p.momentum.strength||0)+(p.momentum.strike||0)+(p.momentum.technical||0)+(p.momentum.agility||0));
     const offense=p.hand.filter(c=>c.kind==='move'&&!c.defensiveOnly);passes.offenseCards.push(offense.length);
     if(!offense.length)passes.noOffense++;else{
       passes.withOffense++;
       const reasons=offense.map(c=>moveEligibility(s,pid,c).reason||'');
       const method=reasons.some(r=>/^Need \d+ (strength|strike|technical|agility) Momentum$/i.test(r));
       const cost=reasons.some(r=>/Momentum \+ Attitude/.test(r));
       const posture=reasons.some(r=>/grounded/.test(r));
       if(method)passes.methodBlocked++;else if(cost)passes.costBlocked++;else if(posture)passes.postureBlocked++;else passes.otherBlocked++;
       if(method)byStar[p.superstar.id].methodBlockedPass++;
     }
     if(q.moves===0)passes.afterZeroMoves++;else if(q.moves===1)passes.afterOneMove++;else passes.afterMultiMoves++;
     if(q.startOwnRatio<q.startOppRatio-.001){behindPass.total++;if(q.moves===0)behindPass.zeroMove++;else if(q.moves===1)behindPass.oneMove++;else behindPass.multiMove++;}
     byStar[p.superstar.id].pass++;
   }
   const ok=executeCpuDecision(g,d,pid);if(!ok)break;
   const logs=g.state().log;
   for(let z=lastLog;z<logs.length;z++){
     const e=logs[z];if(!e.controlSequence)continue;
     const owner=e.controlOwner||e.attackerId||e.playerId;
     let q=seqs.get(e.controlSequence);
     if(!q&&owner&&['p1','p2'].includes(owner)){
       const fake={turnNumber:e.turn,players:g.state().players};
       q=ensure(e.controlSequence,owner,fake);
       // correct snapshot from log where possible
       const po=owner,op=other(owner),pp=g.state().players[po],oo=g.state().players[op];
       const hpOwn=po==='p1'?e.p1Hp:e.p2Hp,hpOpp=op==='p1'?e.p1Hp:e.p2Hp,ad=po==='p1'?e.p1Ad:e.p2Ad;
       if(Number.isFinite(hpOwn))q.startOwnRatio=hpOwn/pp.maxHp;if(Number.isFinite(hpOpp))q.startOppRatio=hpOpp/oo.maxHp;if(Number.isFinite(ad))q.startAd=ad;
     }
     if(e.type==='MOVE_CONNECTED'){
       q=seqs.get(e.controlSequence)||ensure(e.controlSequence,e.attackerId,g.state());
       q.moves++;q.damage+=e.damage||0;
     }
   }
   lastLog=logs.length;
   const ns=g.state();ensure(ns.controlSequence,ns.playerInControl,ns);
 }
 const st=g.state();matches++;if(st.phase!=='MATCH_OVER'){stalls++;continue;}if(st.winner==='p1')p1Wins++;
 const seqArr=[...seqs.values()].sort((x,y)=>x.cs-y.cs);
 for(const q of seqArr){allSeq.push(q);const bs=byStar[q.starId];bs.seq++;bs.moves+=q.moves;bs.damage+=q.damage;if(q.startOwnRatio<q.startOppRatio-.001){behindSeq.push(q);bs.behindSeq++;bs.behindDamage+=q.damage;if(q.moves===0)bs.behindZero++;}}
 const win=st.winner,lose=other(win);const wSeq=seqArr.filter(q=>q.owner===win),lSeq=seqArr.filter(q=>q.owner===lose);winnerSeq.push(...wSeq);loserSeq.push(...lSeq);
 const wd=wSeq.map(q=>q.damage),ld=lSeq.map(q=>q.damage),wt=wd.reduce((x,y)=>x+y,0);winnerLongestDamage.push(Math.max(0,...wd));loserLongestDamage.push(Math.max(0,...ld));winnerLongestShares.push(wt?Math.max(0,...wd)/wt:0);
 const p1Open=seqArr.find(q=>q.owner==='p1');const p2First=seqArr.find(q=>q.owner==='p2');if(p1Open)openingP1Damage.push(p1Open.damage);if(p2First){firstP2Damage.push(p2First.damage);firstP2Ad.push(p2First.startAd);}
}

const summarizeSeq=arr=>({count:arr.length,avgMoves:round(avg(arr.map(x=>x.moves)),2),medianMoves:round(quant(arr.map(x=>x.moves),.5),2),zeroMovePct:round(pct(arr.filter(x=>x.moves===0).length,arr.length),1),oneMovePct:round(pct(arr.filter(x=>x.moves===1).length,arr.length),1),multiMovePct:round(pct(arr.filter(x=>x.moves>=2).length,arr.length),1),avgDamage:round(avg(arr.map(x=>x.damage)),2),medianDamage:round(quant(arr.map(x=>x.damage),.5),2)});
const starRows=Object.entries(byStar).map(([id,x])=>({id,name:x.name,sequences:x.seq,avgMoves:round(x.moves/Math.max(1,x.seq),2),avgDamage:round(x.damage/Math.max(1,x.seq),2),passes:x.pass,methodBlockedPasses:x.methodBlockedPass,methodBlockedPassPct:round(pct(x.methodBlockedPass,x.pass),1),behindSequences:x.behindSeq,behindZeroMovePct:round(pct(x.behindZero,x.behindSeq),1),behindAvgDamage:round(x.behindDamage/Math.max(1,x.behindSeq),2)}));
const out={config:{matchesPerPair:N,matches,superstars:stars.length},stalls,p1WinPct:round(pct(p1Wins,matches),2),sequences:{all:summarizeSeq(allSeq),winner:summarizeSeq(winnerSeq),loser:summarizeSeq(loserSeq),whenBehind:summarizeSeq(behindSeq),winnerLongestDamageAvg:round(avg(winnerLongestDamage),2),loserLongestDamageAvg:round(avg(loserLongestDamage),2),winnerLongestShareOfConnectedDamagePct:round(100*avg(winnerLongestShares),1),openingP1DamageAvg:round(avg(openingP1Damage),2),firstP2DamageAvg:round(avg(firstP2Damage),2),firstP2StartAdrenalineAvg:round(avg(firstP2Ad),2)},passes:{...passes,offenseCardsAvg:round(avg(passes.offenseCards),2),handSizeAvg:round(avg(passes.handSize),2),adrenalineAvg:round(avg(passes.adrenaline),2),methodMomentumAvg:round(avg(passes.methodTotal),2),methodBlockedPctOfPassesWithOffense:round(pct(passes.methodBlocked,passes.withOffense),1),zeroMovePct:round(pct(passes.afterZeroMoves,passes.total),1),oneMovePct:round(pct(passes.afterOneMove,passes.total),1),multiMovePct:round(pct(passes.afterMultiMoves,passes.total),1)},behindPass:{...behindPass,zeroMovePct:round(pct(behindPass.zeroMove,behindPass.total),1),oneMovePct:round(pct(behindPass.oneMove,behindPass.total),1),multiMovePct:round(pct(behindPass.multiMove,behindPass.total),1)},worstMethodBlocked:starRows.sort((a,b)=>b.methodBlockedPassPct-a.methodBlockedPassPct).slice(0,15),worstBehindRecovery:[...starRows].sort((a,b)=>b.behindZeroMovePct-a.behindZeroMovePct).slice(0,15)};
console.log(JSON.stringify(out,null,2));
