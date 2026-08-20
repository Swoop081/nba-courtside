import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner, cpuDecision, executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { moveEligibility, canPlayMomentum, canPlayAction, canPlaySupport, canPlayManager, canPlaySpecial, submissionThreshold } from '../js/engine/rules.js';

const stars = Object.values(superstars);
const N = Number(process.env.MATCHES_PER_PAIR || 20); // total per unordered pair, alternating sides
const KSTART = Number(process.env.K_START || 0);
function rng(seed){ let x=seed>>>0; return ()=>{ x=(x*1664525+1013904223)>>>0; return x/4294967296; }; }
const other=id=>id==='p1'?'p2':'p1';
const pct=(n,d)=>d?100*n/d:0;
const round=(n,d=2)=>Number(n.toFixed(d));
function quantile(sorted,q){ if(!sorted.length)return 0; const pos=(sorted.length-1)*q,lo=Math.floor(pos),hi=Math.ceil(pos); return lo===hi?sorted[lo]:sorted[lo]+(sorted[hi]-sorted[lo])*(pos-lo); }
function blankStar(s){return {id:s.id,name:s.name,setId:s.setId,hp:s.hp,matches:0,wins:0,losses:0,p1Matches:0,p1Wins:0,p2Matches:0,p2Wins:0,turns:0,winTurns:0,lossTurns:0,pinWins:0,subWins:0,decisionWins:0,pinLosses:0,subLosses:0,decisionLosses:0,movesDeclared:0,manualCounters:0,autoCounters:0,counterWindows:0,counterPasses:0,autoCostTotal:0,finishersDeclared:0,finishersCountered:0,trademarksDeclared:0,submissionsDeclared:0,pinAttempts:0,pinEscapes:0,fightForever:0,finalHpWinTotal:0,finalHpLossTotal:0,finalDeckTotal:0,finalHandTotal:0};}
const perStar=Object.fromEntries(stars.map(s=>[s.id,blankStar(s)]));
const counterStates=['arm-extended','leg-extended','running-aerial','diving-aerial','body-elevated','torso-trapped','front-control','rear-control'];
const byState=Object.fromEntries(counterStates.map(s=>[s,{windows:0,manual:0,auto:0,pass:0,finisherWindows:0,finisherManual:0,finisherPass:0}]));
const bySubTarget=Object.fromEntries(['arms','legs','back','head','chest'].map(s=>[s,{declared:0,manualCountered:0,autoCountered:0,connected:0,finishes:0}]));
const counterCards={}; const incomingCards={}; const autoCosts={}; const autoReasons={midHigh:0,trademark:0,lethal:0,submissionTap:0};
const finishers={declared:0,manualCountered:0,connected:0,finishWins:0};
const trademarks={declared:0,manualCountered:0,autoCountered:0,connected:0};
const costBands={low:{declared:0,manual:0,auto:0,pass:0},mid:{declared:0,manual:0,auto:0,pass:0},high:{declared:0,manual:0,auto:0,pass:0}};
const turns=[]; const winnerHpRatios=[]; const loserHpRatios=[]; const endDeckSizes=[]; const endHandSizes=[];
let matches=0,stalls=0,stepsTotal=0,p1Wins=0,p2Wins=0,pinFinishes=0,submissionFinishes=0,decisionFinishes=0;
let manualCounters=0,autoCounters=0,counterPasses=0,counterWindows=0,counterAttacks=0,maxCounterDepth=0;
let actionPasses=0,pinAttempts=0,pinSuccess=0,kickouts=0,pinEscapes=0;
let submissionsDeclared=0,submissionMaintains=0,submissionReleases=0,submissionTapFinishes=0;
let fightForeverUses=0,fightForeverPlayerHeal=0,fightForeverOpponentHeal=0;
let autoPreservationViolations=0, autoMinExpectedRemainder=999;
let matchesOver50=0,matchesOver75=0,matchesOver100=0,maxTurns=0,deckEmptyAtEnd=0,handEmptyAtEnd=0;
let zeroHpSurvivalTurns=0, zeroHpEpisodes=0;
const matchup={};

function band(card){ if(card?.finisher)return 'finisher'; const c=card?.cost??0; return c<=3?'low':c<=6?'mid':'high'; }
function playableAfterAuto(state,pid,card){
 const p=state.players[pid];
 const sim={...state,phase:'ACTION',playerInControl:pid,proposedMove:null,postMove:null,players:{...state.players,[pid]:{...p,turn:{momentumPlayed:0,momentumPlayLimit:1,actionPlayed:0,supportPlayed:0,specialPlayed:0},momentumPlayedThisTurn:false}}};
 if(card?.kind==='move')return !card.defensiveOnly&&moveEligibility(sim,pid,card).legal;
 if(card?.kind==='momentum')return canPlayMomentum(sim,pid,card);
 if(card?.kind==='action')return canPlayAction(sim,pid,card);
 if(card?.kind==='support')return canPlaySupport(sim,pid,card);
 if(card?.kind==='manager')return canPlayManager(sim,pid,card);
 if(card?.kind==='action'&&card?.special)return canPlaySpecial(sim,pid,card);
 return false;
}
function wouldTap(state,pid,card){
 if(!card?.submission)return false; const p=state.players[pid], part=card.submission.bodyPart; if(!part)return false;
 const projected=(p.submissionDamage?.[part]??0)+(card.submission.pressure??0);
 return projected>=submissionThreshold(p);
}

for(let i=0;i<stars.length;i++) for(let j=i+1;j<stars.length;j++) for(let kk=0;kk<N;kk++){ const k=KSTART+kk;
 const a=(k%2===0)?stars[i]:stars[j], b=(k%2===0)?stars[j]:stars[i];
 const seed=0x9e3779b9 ^ (i*1000003+j*10007+k*97);
 const g=new MatchEngine({p1:a,p2:b,decks,rng:rng(seed)});
 let steps=0; let lastLog=0; let zeroHpStart={p1:null,p2:null};
 while(g.state().phase!=='MATCH_OVER' && steps++<3500){
   const s=g.state();
   for(const pid of ['p1','p2']){
     if(s.players[pid].hp<=0 && zeroHpStart[pid]==null){zeroHpStart[pid]=s.turnNumber;zeroHpEpisodes++;}
     if(s.players[pid].hp>0 && zeroHpStart[pid]!=null){zeroHpSurvivalTurns+=Math.max(0,s.turnNumber-zeroHpStart[pid]);zeroHpStart[pid]=null;}
   }
   const pid=decisionOwner(s), d=cpuDecision(g,pid); if(!d)break;
   const ps=pid?s.players[pid]:null;
   const starId=ps?.superstar?.id;
   if(s.phase==='COUNTER'){
     counterWindows++; perStar[starId].counterWindows++;
     const inc=s.proposedMove.card, st=inc.counterState; if(st&&byState[st]){byState[st].windows++; if(inc.finisher)byState[st].finisherWindows++;}
     const bnd=band(inc); if(costBands[bnd])costBands[bnd].declared++;
     incomingCards[inc.name]??={name:inc.name,windows:0,manual:0,auto:0,pass:0,state:st,finisher:!!inc.finisher,trademark:!!inc.trademark}; incomingCards[inc.name].windows++;
     maxCounterDepth=Math.max(maxCounterDepth,s.proposedMove.counterDepth??0);
     if(d.type==='counter'){
       manualCounters++; perStar[starId].manualCounters++; if(st&&byState[st]){byState[st].manual++;if(inc.finisher)byState[st].finisherManual++;}
       if(costBands[bnd])costBands[bnd].manual++;
       incomingCards[inc.name].manual++;
       counterCards[d.card.name]??={name:d.card.name,uses:0,damage:d.card.damage??0,cost:d.card.cost??0,defensiveOnly:!!d.card.defensiveOnly}; counterCards[d.card.name].uses++;
       if(!d.card.defensiveOnly)counterAttacks++;
       if(inc.finisher){finishers.manualCountered++; perStar[s.proposedMove.attackerId? s.players[s.proposedMove.attackerId].superstar.id:starId].finishersCountered++;}
       if(inc.trademark)trademarks.manualCountered++;
       if(inc.submission?.bodyPart&&bySubTarget[inc.submission.bodyPart])bySubTarget[inc.submission.bodyPart].manualCountered++;
     } else if(d.type==='autoCounter'){
       autoCounters++; perStar[starId].autoCounters++;
       const cost=5+(ps.autoCounterUses??0); perStar[starId].autoCostTotal+=cost; autoCosts[cost]=(autoCosts[cost]??0)+1;
       if(st&&byState[st])byState[st].auto++; if(costBands[bnd])costBands[bnd].auto++; incomingCards[inc.name].auto++;
       if(inc.trademark)trademarks.autoCountered++;
       if(inc.submission?.bodyPart&&bySubTarget[inc.submission.bodyPart])bySubTarget[inc.submission.bodyPart].autoCountered++;
       const lethal=(inc.damage??0)>=ps.hp, tap=wouldTap(s,pid,inc); if(inc.trademark)autoReasons.trademark++; else if(tap)autoReasons.submissionTap++; else if(lethal)autoReasons.lethal++; else autoReasons.midHigh++;
       const selected=new Set(d.indices); const remain=ps.hand.filter((_,idx)=>!selected.has(idx)); const playable=remain.filter(c=>playableAfterAuto(s,pid,c)).length;
       if(playable<2)autoPreservationViolations++; autoMinExpectedRemainder=Math.min(autoMinExpectedRemainder,remain.length);
     } else if(d.type==='passCounter'){
       counterPasses++; perStar[starId].counterPasses++; if(st&&byState[st]){byState[st].pass++;if(inc.finisher)byState[st].finisherPass++;}
       if(costBands[bnd])costBands[bnd].pass++; incomingCards[inc.name].pass++;
     }
   } else if(s.phase==='ACTION'){
     if(d.type==='move'){
       perStar[starId].movesDeclared++; if(d.card.finisher){finishers.declared++;perStar[starId].finishersDeclared++;}
       if(d.card.trademark){trademarks.declared++;perStar[starId].trademarksDeclared++;}
       if(d.card.submission){submissionsDeclared++;perStar[starId].submissionsDeclared++;const part=d.card.submission.bodyPart;if(bySubTarget[part])bySubTarget[part].declared++;}
     } else if(d.type==='pass') actionPasses++;
     else if(d.type==='pin'){pinAttempts++;perStar[starId].pinAttempts++;}
     else if(d.type==='action'&&d.card?.effect?.type==='fightForever'){fightForeverUses++;perStar[starId].fightForever++;}
   } else if(s.phase==='PIN_RESPONSE'){
     if(d.type==='pinEscape'){pinEscapes++;perStar[starId].pinEscapes++;}
   } else if(s.phase==='SUBMISSION_MAINTAIN'){
     if(d.type==='maintain')submissionMaintains++; else if(d.type==='release')submissionReleases++;
   }
   const ok=executeCpuDecision(g,d,pid); if(!ok)break;
   // inspect new logs for connected / FF / pin outcome / submission finish context
   const logs=g.state().log;
   for(let z=lastLog;z<logs.length;z++){
     const e=logs[z];
     if(e.type==='MOVE_CONNECTED'){
       const card=[...Object.values(g.state().players).flatMap(p=>p.discard)].reverse().find(c=>c.id===e.cardId) || null;
       if(card?.finisher)finishers.connected++; if(card?.trademark)trademarks.connected++;
       if(card?.submission?.bodyPart&&bySubTarget[card.submission.bodyPart])bySubTarget[card.submission.bodyPart].connected++;
     }
     if(e.type==='PIN_CHECK'){ if((e.roll??101)<=(e.chance??0))pinSuccess++; else kickouts++; }
     if(e.type==='FIGHT_FOREVER'){fightForeverPlayerHeal+=e.playerHeal??0;fightForeverOpponentHeal+=e.opponentHeal??0;}
     if(e.type==='SUBMISSION_RELEASED'){};
   }
   lastLog=logs.length;
 }
 const st=g.state(); matches++;stepsTotal+=steps;
 for(const pid of ['p1','p2'])if(zeroHpStart[pid]!=null){zeroHpSurvivalTurns+=Math.max(0,st.turnNumber-zeroHpStart[pid]);zeroHpStart[pid]=null;}
 if(st.phase!=='MATCH_OVER'){stalls++;continue;}
 const t=st.turnNumber;turns.push(t);maxTurns=Math.max(maxTurns,t);if(t>50)matchesOver50++;if(t>75)matchesOver75++;if(t>100)matchesOver100++;
 const winner=st.winner, loser=other(winner); if(winner==='p1')p1Wins++; else p2Wins++;
 if(st.finish?.type==='pin')pinFinishes++; else if(st.finish?.type==='submission'){submissionFinishes++;submissionTapFinishes++;} else if(st.finish?.type==='decision')decisionFinishes++;
 const w=st.players[winner],l=st.players[loser],wid=w.superstar.id,lid=l.superstar.id;
 const sa=perStar[a.id], sb=perStar[b.id]; for(const x of [sa,sb]){x.matches++;x.turns+=t;}
 perStar[wid].wins++;perStar[wid].winTurns+=t;perStar[lid].losses++;perStar[lid].lossTurns+=t;
 perStar[a.id].p1Matches++; if(wid===a.id)perStar[a.id].p1Wins++; perStar[b.id].p2Matches++; if(wid===b.id)perStar[b.id].p2Wins++;
 if(st.finish?.type==='pin'){perStar[wid].pinWins++;perStar[lid].pinLosses++;} else if(st.finish?.type==='submission'){perStar[wid].subWins++;perStar[lid].subLosses++; const logs=st.log; const lastSub=[...logs].reverse().find(e=>e.type==='SUBMISSION_DAMAGE'); if(lastSub?.bodyPart&&bySubTarget[lastSub.bodyPart])bySubTarget[lastSub.bodyPart].finishes++;} else {perStar[wid].decisionWins++;perStar[lid].decisionLosses++;}
 perStar[wid].finalHpWinTotal+=w.hp/w.maxHp;perStar[lid].finalHpLossTotal+=l.hp/l.maxHp;
 for(const pid of ['p1','p2']){const p=st.players[pid];perStar[p.superstar.id].finalDeckTotal+=p.deck.length;perStar[p.superstar.id].finalHandTotal+=p.hand.length;endDeckSizes.push(p.deck.length);endHandSizes.push(p.hand.length);if(p.deck.length===0)deckEmptyAtEnd++;if(p.hand.length===0)handEmptyAtEnd++;}
 winnerHpRatios.push(w.hp/w.maxHp); loserHpRatios.push(l.hp/l.maxHp);
 const key=[a.id,b.id].sort().join('::'); matchup[key]??={a:[a.id,b.id].sort()[0],b:[a.id,b.id].sort()[1],matches:0,wins:{}};matchup[key].matches++;matchup[key].wins[wid]=(matchup[key].wins[wid]??0)+1;
}

turns.sort((a,b)=>a-b);winnerHpRatios.sort((a,b)=>a-b);loserHpRatios.sort((a,b)=>a-b);endDeckSizes.sort((a,b)=>a-b);endHandSizes.sort((a,b)=>a-b);
const rows=Object.values(perStar).map(x=>({...x,winRate:round(pct(x.wins,x.matches),1),p1WinRate:round(pct(x.p1Wins,x.p1Matches),1),p2WinRate:round(pct(x.p2Wins,x.p2Matches),1),avgTurns:round(x.turns/x.matches,2),avgWinHpPct:round(100*x.finalHpWinTotal/Math.max(1,x.wins),1),avgAutoCost:round(x.autoCostTotal/Math.max(1,x.autoCounters),2),manualCountersPerMatch:round(x.manualCounters/x.matches,2),autoCountersPerMatch:round(x.autoCounters/x.matches,2),counterPassRate:round(pct(x.counterPasses,x.counterWindows),1),movesPerMatch:round(x.movesDeclared/x.matches,2),finishersPerMatch:round(x.finishersDeclared/x.matches,2),pinAttemptsPerMatch:round(x.pinAttempts/x.matches,2),avgFinalDeck:round(x.finalDeckTotal/x.matches,1),avgFinalHand:round(x.finalHandTotal/x.matches,1)})).sort((a,b)=>b.winRate-a.winRate);
const matchupRows=Object.values(matchup).map(m=>{const wa=m.wins[m.a]??0,wb=m.wins[m.b]??0;return {...m,aWins:wa,bWins:wb,aRate:round(pct(wa,m.matches),1),spread:round(Math.abs(50-pct(wa,m.matches)),1)};}).sort((a,b)=>b.spread-a.spread);
const stateRows=Object.entries(byState).map(([state,x])=>({state,...x,manualRate:round(pct(x.manual,x.windows),1),autoRate:round(pct(x.auto,x.windows),1),passRate:round(pct(x.pass,x.windows),1),finisherCounterRate:round(pct(x.finisherManual,x.finisherWindows),1)})).sort((a,b)=>b.windows-a.windows);
const counterCardRows=Object.values(counterCards).sort((a,b)=>b.uses-a.uses).slice(0,40);
const incomingRows=Object.values(incomingCards).map(x=>({...x,counterRate:round(pct(x.manual+x.auto,x.windows),1)})).sort((a,b)=>b.windows-a.windows).slice(0,50);
const summary={
 config:{matchesPerPair:N,superstars:stars.length,matches},stalls,stepsTotal,
 matchLength:{average:round(turns.reduce((a,b)=>a+b,0)/turns.length,2),median:quantile(turns,.5),p75:quantile(turns,.75),p90:quantile(turns,.9),p95:quantile(turns,.95),p99:quantile(turns,.99),max:maxTurns,over50:matchesOver50,over75:matchesOver75,over100:matchesOver100},
 finishes:{pin:pinFinishes,submission:submissionFinishes,decision:decisionFinishes,pinPct:round(pct(pinFinishes,matches),1),submissionPct:round(pct(submissionFinishes,matches),1),decisionPct:round(pct(decisionFinishes,matches),3)},
 sideBias:{p1Wins,p2Wins,p1WinPct:round(pct(p1Wins,matches),2)},
 counters:{windows:counterWindows,manual:manualCounters,auto:autoCounters,pass:counterPasses,manualPct:round(pct(manualCounters,counterWindows),1),autoPct:round(pct(autoCounters,counterWindows),1),passPct:round(pct(counterPasses,counterWindows),1),counterAttacks,maxCounterDepth,autoCosts,autoReasons,autoPreservationViolations,autoMinExpectedRemainder},
 pins:{attempts:pinAttempts,successes:pinSuccess,kickouts,pinEscapes,successPct:round(pct(pinSuccess,pinAttempts),1),escapesPct:round(pct(pinEscapes,pinAttempts),1)},
 submissions:{declared:submissionsDeclared,maintains:submissionMaintains,releases:submissionReleases,finishes:submissionTapFinishes,finishPerDeclaredPct:round(pct(submissionTapFinishes,submissionsDeclared),1)},
 fightForever:{uses:fightForeverUses,usesPer100Matches:round(100*fightForeverUses/matches,2),avgSelfHeal:round(fightForeverPlayerHeal/Math.max(1,fightForeverUses),2),avgOpponentHeal:round(fightForeverOpponentHeal/Math.max(1,fightForeverUses),2),totalNetHpAdded:fightForeverPlayerHeal+fightForeverOpponentHeal},
 endState:{winnerHpPctAvg:round(100*winnerHpRatios.reduce((a,b)=>a+b,0)/winnerHpRatios.length,1),winnerHpPctMedian:round(100*quantile(winnerHpRatios,.5),1),loserHpPctAvg:round(100*loserHpRatios.reduce((a,b)=>a+b,0)/loserHpRatios.length,1),deckRemainingAvg:round(endDeckSizes.reduce((a,b)=>a+b,0)/endDeckSizes.length,1),deckRemainingP10:quantile(endDeckSizes,.1),handRemainingAvg:round(endHandSizes.reduce((a,b)=>a+b,0)/endHandSizes.length,1),deckEmptyAtEnd,handEmptyAtEnd,zeroHpEpisodes,zeroHpSurvivalTurns},
 costBands,stateRows,bySubTarget,finishers,trademarks,
 roster:rows,mostLopsidedMatchups:matchupRows.slice(0,25),topCounterCards:counterCardRows,topIncomingMoves:incomingRows
};
console.log(JSON.stringify(summary,null,2));
