import { totalMomentum } from "./utils.js?v=0.13.72";
import { healthRatio, healthZone } from "./health.js?v=0.13.72";
const methodAmount=(p,m)=>p?.momentum?.[m]??0;
const playerFrom=(subject,playerId)=>playerId==null&&subject?.momentum?subject:subject?.players?.[playerId];
export function effectiveTotalMomentum(subject,playerId){ const p=playerFrom(subject,playerId); return totalMomentum(p)+(p?.temporaryDiscount??0); }
export function canPlayMomentum(state,playerId,card){ const p=state.players[playerId]; if(state?.pendingActionDiscard?.playerId===playerId)return false; return state.phase==="ACTION"&&state.playerInControl===playerId&&card?.kind==="momentum"&&(p?.turn?.momentumPlayed??0)<(p?.turn?.momentumPlayLimit??1); }
export function canPlayEntrance(){ return false; }
export function canPlayAction(state,playerId,card){ if(state?.pendingActionDiscard?.playerId===playerId)return false; if(card?.special||card?.pinEscape)return false; const p=state.players[playerId],opp=state.players[playerId==="p1"?"p2":"p1"]; if(card?.defensiveOnly||card?.effect?.type==="onceTooOften")return false; const cost=Math.max(0,card?.cost??0); const afterTurn=Math.max(0,Number(card?.playableAfterTurn??0)); const cond=card?.playCondition??{}; const grounded=["on-mat","grounded"].includes(opp?.posture); if(cond.selfHpAtOrBelowPct!=null&&p?.hp>p?.maxHp*cond.selfHpAtOrBelowPct)return false; if(cond.opponentGrounded&&!grounded)return false; if(cond.afterConnectedMethod&&!p?.events?.connectedMethodsThisControl?.[cond.afterConnectedMethod])return false; if(cond.afterConnectedCard&&!p?.events?.connectedCardNamesThisControl?.[cond.afterConnectedCard])return false; return state.phase==="ACTION"&&state.playerInControl===playerId&&card?.kind==="action"&&(p?.turn?.actionPlayed??0)<1&&!p?.actionLocked&&totalMomentum(p)>=cost&&(state.turnNumber??1)>afterTurn; }
export function canPlaySupport(state,playerId,card){ const p=state.players[playerId]; if(state?.pendingActionDiscard?.playerId===playerId)return false; return state.phase==="ACTION"&&state.playerInControl===playerId&&card?.kind==="support"&&(p?.turn?.supportPlayed??0)<1; }
export function canPlayManager(state,playerId,card){ const p=state.players[playerId]; if(state?.pendingActionDiscard?.playerId===playerId)return false; if(!p||card?.kind!=="manager"||state.phase!=="ACTION"||state.playerInControl!==playerId||p.activeManager)return false; if(card.superstarId&&card.superstarId!==p.superstar?.id)return false; if(Array.isArray(card.allowedSuperstarIds)&&card.allowedSuperstarIds.length&&!card.allowedSuperstarIds.includes(p.superstar?.id))return false; if(Array.isArray(card.allowedFactionTags)&&card.allowedFactionTags.length&&!(p.superstar?.factionTags??[]).some(tag=>card.allowedFactionTags.includes(tag)))return false; return true; }
export function canPlaySpecial(state,playerId,card){ const p=state.players[playerId]; if(state?.pendingActionDiscard?.playerId===playerId)return false; if(!p||card?.kind!=="action"||!card?.special)return false; if(card.superstarId&&card.superstarId!==p.superstar?.id)return false; if((p.usedSpecialIds??[]).includes(card.id))return false; if(state.phase!=="ACTION"||state.playerInControl!==playerId)return false; if(totalMomentum(p)<Math.max(0,card?.cost??0))return false; if(card?.special?.type==="brassKnuckles")return !!p.events?.brassKnucklesWindow; if(card?.special?.type==="jarOfTeeth")return !!p.events?.jarOfTeethWindow; if(card?.special?.type==="paulHeyman"){const after=card.special?.afterName??"Brock’s German";return !!p.events?.connectedCardNamesThisControl?.[after]||!!p.events?.brocksGermanConnectedThisControl;} if(["tiffanyEpiphany","fileComplaint","lastRites","fullSpeed","claymoreCountdown","joeBelieve","roxanneProdigy","dragonLuchaLegacy","austinTheoryAllDay","angeloDawkinsRunIn","lolaFistsDontLie","iguanaLaYesca","hbkShowstopper","exclusiveTrademarkTutor"].includes(card?.special?.type))return true; return false; }
export function moveEligibility(state,playerId,card){
 const p=state.players[playerId]; const fail=reason=>({ok:false,legal:false,reason});
 if(state.phase!=="ACTION")return fail("Not an Action window"); if(state.playerInControl!==playerId)return fail("Not in Control"); if(state?.pendingActionDiscard?.playerId===playerId)return fail("Choose a page to ditch first"); if(card?.kind!=="move"||card.defensiveOnly)return fail("Not an offensive Move"); if(card.superstarId&&card.superstarId!==p?.superstar?.id)return fail("Move is exclusive to another Superstar"); if(Array.isArray(card.allowedSuperstarIds)&&card.allowedSuperstarIds.length&&!card.allowedSuperstarIds.includes(p?.superstar?.id))return fail("Move is restricted to another Superstar family");
 const curseCost=Math.max(0,p.events?.danhausenCurseAdrenalineCost??0); if(curseCost&&p.adrenaline<curseCost)return fail(`Need ${curseCost} Adrenaline — You Are Cursed!`);
 const sequenceDiscount=(card.discountAfterCounter&&p.events?.counteredThisControl)?card.discountAfterCounter:0; const namedChainDiscount=card.discountIfNamedConnectedThisControl&&p.events?.connectedCardNamesThisControl?.[card.discountIfNamedConnectedThisControl.name]?(card.discountIfNamedConnectedThisControl.amount??0):0; const finisherDiscount=card.finisher?Math.max(0,p.events?.nextFinisherDiscount??0):0; const methodChain=card.discountIfMethodConnectedThisControl&&p.events?.connectedMethodsThisControl?.[card.discountIfMethodConnectedThisControl.method]?(card.discountIfMethodConnectedThisControl.amount??0):0; const bodyDiscount=card.discountIfOpponentBodyDamage&&((state.players[playerId==="p1"?"p2":"p1"]?.submissionDamage?.[card.discountIfOpponentBodyDamage.bodyPart]??0)>=(card.discountIfOpponentBodyDamage.min??1))?(card.discountIfOpponentBodyDamage.amount??0):0; const samiDiscount=p.superstar?.id==='sami-zayn'&&p.controlMoveCount===0&&p.hp<(state.players[playerId==="p1"?"p2":"p1"]?.hp??0)?(p.superstar.ability?.trigger?.discount??1):0; const streakDiscount=p.superstar?.id==='goldberg'&&(card.trademark||card.finisher)?Math.max(0,p.streakCounters??0)*(p.superstar.ability?.trigger?.discountPerStreak??1):0; const joeExclusiveDiscount=p.superstar?.id==='joe-hendry'&&card.superstarId==='joe-hendry'?Math.max(0,p.events?.joeExclusiveMoveDiscount??0):0; const vikingoDivingDiscount=p.superstar?.id==='hijo-del-vikingo'&&card.counterState==='diving-aerial'?Math.max(0,p.events?.vikingoDivingAerialDiscount??0):0; const discount=finisherDiscount+namedChainDiscount+(p.nextMoveDiscount??0)+(p.methodDiscount?.[card.method]??0)+(p.moveTypeDiscount?.[card.moveType]??0)+(p.namedDiscount?.[card.name]??0)+sequenceDiscount+methodChain+bodyDiscount+samiDiscount+streakDiscount+joeExclusiveDiscount+vikingoDivingDiscount; const needed=Math.max(0,(card.cost??0)-discount); if(totalMomentum(p)<needed)return fail(`Need ${needed} Momentum + Attitude`);
 if(!card.finisher) for(const [m,n] of Object.entries(card.requirements??{})){if(methodAmount(p,m)<n)return fail(`Need ${n} ${m} Momentum`);}
 const opp=state.players[playerId==="p1"?"p2":"p1"],grounded=['on-mat','grounded'].includes(opp?.posture); if(card.groundedOnly&&!grounded)return fail("Opponent must be grounded"); if(card.moveType==='submission'&&card.standingOnly&&grounded)return fail("Opponent must be standing");
 return {ok:true,legal:true,reason:null,effectiveCost:needed};
}
export function onceTooOftenEligibility(state,playerId,incoming,card){
 const fail=reason=>({ok:false,legal:false,reason,onceTooOften:false});
 if(state?.phase!=="COUNTER")return fail("Not a Counter window");
 if(state?.proposedMove?.defenderId!==playerId)return fail("Not the defending Superstar");
 if(card?.kind!=="action"||card?.effect?.type!=="onceTooOften")return fail("Not Once Too Often");
 if(!incoming||incoming.kind!=="move")return fail("No incoming Move");
 if(state?.proposedMove?.isCounterAttack)return fail("Counter-attacks cannot be answered by Once Too Often");
 const attackerId=state?.proposedMove?.attackerId;
 const history=state?.players?.[attackerId]?.events?.connectedCardIdsMatch??{};
 if((history[incoming.id]??0)<1)return fail(`${incoming.name??"That Move"} has not connected earlier this match`);
 return {ok:true,legal:true,reason:null,onceTooOften:true,effectiveCost:0,offensive:false};
}

const incomingTypes=incoming=>[incoming?.counterState,incoming?.tacticalType,incoming?.moveType].filter(Boolean);
export function canCounter(incoming,counter){
 if(!incoming||incoming.kind!=="move"||counter?.kind!=="move")return false;
 // Jawbreaker is a positional escape, not a mirror exchange: it cannot answer another Jawbreaker.
 if((incoming.id==='jawbreaker'||incoming.name==='Jawbreaker')&&(counter.id==='jawbreaker'||counter.name==='Jawbreaker'))return false;
 const direct=(counter.countersCardIds??[]).includes(incoming.id);
 const stateAware=(counter.counterStates?.length??0)>0||(counter.counterSubmissionTargets?.length??0)>0;
 // Migrated counters use the eight physical states / four submission body targets.
 // Legacy broad type matching is only a fallback for cards that have not yet been migrated.
 const typed=!stateAware&&(counter.counters??[]).some(t=>incomingTypes(incoming).includes(t));
 const stateMatch=(counter.counterStates??[]).includes(incoming.counterState);
 const submissionMatch=incoming.moveType==='submission'&&(counter.counterSubmissionTargets??[]).includes(incoming.submissionTarget);
 if(!direct&&!typed&&!stateMatch&&!submissionMatch)return false;
 if(counter.id==='no-sell'&&(incoming.damage??0)<7)return false;
 return true;
}
export function counterEligibility(state,playerId,incoming,counter){
 const fail=reason=>({ok:false,legal:false,reason}); const p=state?.players?.[playerId];
 if(state?.phase!=="COUNTER")return fail("Not a Counter window");
 if(state?.proposedMove?.defenderId!==playerId)return fail("Not the defending Superstar");
 if(!incoming||incoming.kind!=="move")return fail("Only incoming Moves can be Countered");
 if(counter?.kind==="action"&&counter?.effect?.type==="onceTooOften")return onceTooOftenEligibility(state,playerId,incoming,counter);
 const isCounterAttack=!!state?.proposedMove?.isCounterAttack;
 if(isCounterAttack){
  const exchangeKey=incoming?.counterExchangeKey;
  if(exchangeKey!=='punch-elbow')return fail("This Counter ends the exchange");
  if(counter?.counterExchangeKey!==exchangeKey)return fail(`Only another ${incoming?.name??'exchange Move'} can continue this exchange`);
 }
 const outta=!isCounterAttack&&!!(p?.superstar?.id==='randy-orton'&&!p.specialUsed&&p.hand?.some(c=>c.kind==='action'&&c.special?.type==='outtaNowhere')&&counter?.name==='RKO'); if(!canCounter(incoming,counter)&&!outta)return fail("Move does not Counter this Move Type"); if(counter.superstarId&&counter.superstarId!==p?.superstar?.id)return fail("Counter is exclusive to another Superstar"); if(Array.isArray(counter.allowedSuperstarIds)&&counter.allowedSuperstarIds.length&&!counter.allowedSuperstarIds.includes(p?.superstar?.id))return fail("Counter is restricted to another Superstar family");
 const counterDiscount=Math.max(0,p?.events?.nextCounterDiscount??0)+(outta?(p.superstar.special?.discount??2):0)+(p.superstar?.id==='sami-zayn'&&p.controlMoveCount===0&&p.hp<(state.players[state.proposedMove.attackerId]?.hp??0)?(p.superstar.ability?.trigger?.discount??1):0); const needed=Math.max(0,(counter.cost??0)-counterDiscount); if(totalMomentum(p)<needed)return fail(`Need ${needed} Momentum + Attitude`);
 if(!counter.finisher) for(const [m,n] of Object.entries(counter.requirements??{})){if(methodAmount(p,m)<n)return fail(`Need ${n} ${m} Momentum`);}
 const attacker=state.players[state.proposedMove.attackerId],attackerGrounded=['on-mat','grounded'].includes(attacker?.posture); if(counter.groundedOnly&&!attackerGrounded)return fail("Opponent must be grounded"); if(counter.moveType==='submission'&&counter.standingOnly&&attackerGrounded)return fail("Opponent must be standing");
 return {ok:true,legal:true,reason:null,effectiveCost:needed,offensive:!counter.defensiveOnly,outtaNowhere:outta,outtaNowhereDiscount:outta?(p.superstar.special?.discount??2):0};
}
export function autoCounterCost(state,playerId){
 const uses=Math.max(0,Number(state?.players?.[playerId]?.autoCounterUses??0));
 return 5+uses;
}
export function autoCounterEligibility(state,playerId,incoming=state?.proposedMove?.card){
 const fail=reason=>({ok:false,legal:false,reason,cost:autoCounterCost(state,playerId)});
 const p=state?.players?.[playerId];
 if(state?.phase!=="COUNTER")return fail("Not a Counter window");
 if(state?.proposedMove?.defenderId!==playerId)return fail("Not the defending Superstar");
 if(!incoming||incoming.kind!=="move")return fail("No incoming Move");
 if(state?.proposedMove?.isCounterAttack)return fail("Counter-attacks cannot be Auto Countered");
 if(incoming.finisher)return fail("Finishers cannot be Auto Countered");
 if(state?.proposedMove?.noAutoCounter)return fail("This Move cannot be Auto Countered");
 const cost=autoCounterCost(state,playerId);
 const handSize=p?.hand?.length??0;
 if(handSize<cost+2)return fail(`Need ${cost} pages to ditch and at least 2 pages remaining`);
 return {ok:true,legal:true,reason:null,cost,remaining:handSize-cost,useNumber:(p?.autoCounterUses??0)+1};
}
export function canAttemptPin(state,playerId){
 const p=state.players?.[playerId];
 const defenderId=playerId==="p1"?"p2":"p1";
 const defender=state.players?.[defenderId];
 const freshTurn=!!p&&(p.turn?.momentumPlayed??0)===0&&(p.turn?.specialPlayed??0)===0;
 const hasCoverWindow=!!state.postMove&&state.postMove.attackerId===playerId;
 if(state.phase!=="ACTION"||state.playerInControl!==playerId||!freshTurn||!hasCoverWindow)return {legal:false,cost:0,reason:"No pin window"};
 if(!defender||healthZone(defender)==="green")return {legal:false,cost:0,reason:"Opponent must be in Amber or Red health"};
 return {legal:true,cost:0,reason:null};
}
export function canPlayPinEscape(state,playerId,card){ return state.phase==="PIN_RESPONSE"&&state.proposedPin?.defenderId===playerId&&!!(card?.pinEscape||card?.special?.type==='pinEscape'); }
export function submissionThreshold(player){ return Math.max(0,Math.round(player?.hp??0)); }
export function canReturnToRing(){return false;} export function canFollowOutside(){return false;}
