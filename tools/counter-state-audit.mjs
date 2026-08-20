import { allGameplayCards } from '../js/data/content.js';
import { decks } from '../js/data/decks.js';
import { superstars } from '../js/data/superstars.js';
import { COUNTER_STATES, SUBMISSION_TARGETS } from '../js/data/counter-states.js';

const issues=[];
const moves=allGameplayCards.filter(c=>c.kind==='move');
const offensive=moves.filter(c=>!c.defensiveOnly);
const byId=new Map(allGameplayCards.map(c=>[c.id,c]));
const superstarById=new Map(Object.values(superstars).map(s=>[s.id,s]));
const methodLegalFor=(card,superstar)=>Object.entries(card?.requirements??{}).every(([m,n])=>{
  const lim=superstar?.methodLimits?.[m];
  return lim==null || lim>=n;
});

for(const c of moves){
  if(!COUNTER_STATES.includes(c.counterState))issues.push(`${c.id}: invalid/missing counter state ${c.counterState}`);
  if(c.moveType==='submission'&&!SUBMISSION_TARGETS.includes(c.submissionTarget))issues.push(`${c.id}: invalid/missing submission target ${c.submissionTarget}`);
  for(const s of c.counterStates??[])if(!COUNTER_STATES.includes(s))issues.push(`${c.id}: invalid reversal state ${s}`);
  for(const t of c.counterSubmissionTargets??[])if(!SUBMISSION_TARGETS.includes(t))issues.push(`${c.id}: invalid submission reversal ${t}`);
}

// The original eight are permanent one-to-one anchor relationships.
const anchors={
  punch:'arm-extended',
  'drop-toe-hold':'leg-extended',
  dropkick:'running-aerial',
  'knees-up':'diving-aerial',
  hurricanrana:'body-elevated',
  headbutt:'torso-trapped',
  'arm-drag':'front-control',
  'back-elbow':'rear-control',
};
for(const [id,state] of Object.entries(anchors)){
  const c=byId.get(id);
  const actual=c?.counterStates??[];
  if(actual.length!==1||actual[0]!==state)issues.push(`${id}: anchor must counter only ${state}, found ${actual.join(',')||'none'}`);
}
for(const id of Object.keys(anchors)){
  const req=byId.get(id)?.requirements??{};
  if(['dropkick','hurricanrana'].includes(id)){
    if(req.agility!==1||Object.keys(req).length!==1)issues.push(`${id}: anchor must require exactly Agility 1`);
  }else if(Object.keys(req).length)issues.push(`${id}: anchor should have no Method Momentum requirement`);
}

const reversals=moves.filter(c=>c.counters?.length||c.counterStates?.length||c.counterSubmissionTargets?.length||c.countersCardIds?.length);
for(const state of COUNTER_STATES){
  const n=reversals.filter(c=>(c.counterStates??[]).includes(state)).length;
  if(n<4)issues.push(`${state}: only ${n} distinct reversal cards`);
  const ungated=reversals.filter(c=>(c.counterStates??[]).includes(state)&&Object.keys(c.requirements??{}).length===0).length;
  if(n&&ungated<1)issues.push(`${state}: no Method-ungated reversal exists`);
}
for(const target of SUBMISSION_TARGETS){
  const n=reversals.filter(c=>(c.counterSubmissionTargets??[]).includes(target)).length;
  if(n<4)issues.push(`${target}: only ${n} submission reversal cards`);
}

const deckRows=[];
for(const [sid,deck] of Object.entries(decks)){
  const superstar=superstarById.get(sid);
  if(!superstar)issues.push(`${sid}: no Superstar record`);
  if(deck.length!==60)issues.push(`${sid}: ${deck.length} pages, expected 60`);
  if(deck.filter(c=>c.kind==='momentum').length!==12)issues.push(`${sid}: Momentum != 12`);
  const counters=deck.filter(c=>c.kind==='move'&&(c.counters?.length||c.counterStates?.length||c.counterSubmissionTargets?.length||c.countersCardIds?.length));
  if(counters.length<9)issues.push(`${sid}: only ${counters.length} counter-capable pages`);
  const stateCoverage=new Set(counters.flatMap(c=>c.counterStates??[]));
  const submissionCoverage=new Set(counters.flatMap(c=>c.counterSubmissionTargets??[]));
  if(stateCoverage.size<8)issues.push(`${sid}: only ${stateCoverage.size}/8 counter states covered`);
  if(submissionCoverage.size<4)issues.push(`${sid}: only ${submissionCoverage.size}/4 submission targets covered`);

  // Coverage must be reachable within the Superstar's permanent Method limits, not merely present on paper.
  const legalCounters=counters.filter(c=>methodLegalFor(c,superstar));
  const legalStateCoverage=new Set(legalCounters.flatMap(c=>c.counterStates??[]));
  const legalSubmissionCoverage=new Set(legalCounters.flatMap(c=>c.counterSubmissionTargets??[]));
  if(legalStateCoverage.size<8)issues.push(`${sid}: only ${legalStateCoverage.size}/8 Method-accessible counter states`);
  if(legalSubmissionCoverage.size<4)issues.push(`${sid}: only ${legalSubmissionCoverage.size}/4 Method-accessible submission targets`);
  if((superstar?.methodLimits?.agility??null)===0){
    if(!legalStateCoverage.has('running-aerial'))issues.push(`${sid}: Agility 0 but no accessible Running Aerial reversal`);
    if(!legalStateCoverage.has('diving-aerial'))issues.push(`${sid}: Agility 0 but no accessible Diving Aerial reversal`);
    if(!legalStateCoverage.has('body-elevated'))issues.push(`${sid}: Agility 0 but no accessible Body Elevated reversal`);
  }
  deckRows.push({
    superstarId:sid,
    pages:deck.length,
    momentum:deck.filter(c=>c.kind==='momentum').length,
    counterPages:counters.length,
    counterStateCoverage:stateCoverage.size,
    submissionCoverage:submissionCoverage.size,
    accessibleCounterStateCoverage:legalStateCoverage.size,
    accessibleSubmissionCoverage:legalSubmissionCoverage.size,
  });
}
const stateCounts=Object.fromEntries(COUNTER_STATES.map(state=>[state,moves.filter(c=>c.counterState===state).length]));
const targetCounts=Object.fromEntries(SUBMISSION_TARGETS.map(target=>[target,moves.filter(c=>c.moveType==='submission'&&c.submissionTarget===target).length]));
const reversalByState=Object.fromEntries(COUNTER_STATES.map(state=>[state,reversals.filter(c=>(c.counterStates??[]).includes(state)).map(c=>({id:c.id,name:c.name,requirements:c.requirements??{}}))]));
const reversalBySubmission=Object.fromEntries(SUBMISSION_TARGETS.map(target=>[target,reversals.filter(c=>(c.counterSubmissionTargets??[]).includes(target)).map(c=>({id:c.id,name:c.name,requirements:c.requirements??{}}))]));
const counterCounts=deckRows.map(r=>r.counterPages);
console.log(JSON.stringify({
  gameplayCards:allGameplayCards.length,
  moves:moves.length,
  offensiveMoves:offensive.length,
  anchors,
  stateCounts,
  reversalByState,
  submissionTargetCounts:targetCounts,
  reversalBySubmission,
  reversalCards:reversals.length,
  decks:deckRows.length,
  deckCounterPages:{min:Math.min(...counterCounts),max:Math.max(...counterCounts),average:Number((counterCounts.reduce((a,b)=>a+b,0)/counterCounts.length).toFixed(2))},
  deckRows,
  issues,
},null,2));
if(issues.length)process.exit(1);
