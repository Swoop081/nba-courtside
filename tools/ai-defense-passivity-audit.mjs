import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { autoCounterEligibility, counterEligibility } from '../js/engine/rules.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars);
let windows=0, noManual=0, autoLegal=0, autoPassed=0, autoUsed=0, passiveSetup=0, passiveSeq2=0, passiveSeq3=0, passiveLow=0, passiveGround=0, passiveSearch=0, passiveDiscountSetup=0;
const by={}; for(const st of stars)by[st.id]={autoLegal:0,autoPassed:0,seq2:0,setup:0};
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){
 const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(81273+i*317+j*31)}); let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps++<1800){
  const s=g.state(),pid=decisionOwner(s); if(!pid)break; const d=cpuDecision(g,pid); if(!d)break;
  if(s.phase==='COUNTER'){
    windows++; const p=s.players[pid], inc=s.proposedMove.card, attacker=s.players[s.proposedMove.attackerId];
    const manual=p.hand.some(c=>counterEligibility(s,pid,inc,c).legal); if(!manual)noManual++;
    const ac=autoCounterEligibility(s,pid,inc);
    if(ac.legal){autoLegal++;by[p.superstar.id].autoLegal++; if(d.type==='autoCounter')autoUsed++; else if(d.type==='passCounter'){
      autoPassed++;by[p.superstar.id].autoPassed++;
      const seq=attacker.controlMoveCount??0; if(seq>=1){passiveSeq2++;by[p.superstar.id].seq2++;} if(seq>=2)passiveSeq3++;
      if((inc.cost??0)<=3)passiveLow++;
      const setup=!!inc.groundOpponent||!!inc.searchOnConnectName||!!inc.nextFinisherDiscountOnConnect||!!inc.discountIfMethodConnectedThisControl||!!inc.bonusDamageAfterNamed||!!inc.priorMoveBonusDamage||!!inc.priorConnectedMethodBonus||!!inc.bonusDamageIfStrikeEarlierThisControl;
      if(setup){passiveSetup++;by[p.superstar.id].setup++;}
      if(inc.groundOpponent)passiveGround++;
      if(inc.searchOnConnectName)passiveSearch++;
      if(inc.nextFinisherDiscountOnConnect||inc.discountIfMethodConnectedThisControl)passiveDiscountSetup++;
    }}
  }
  if(!executeCpuDecision(g,d,pid))break;
 }
}
const top=Object.entries(by).map(([id,x])=>({id,...x,passPct:+(100*x.autoPassed/Math.max(1,x.autoLegal)).toFixed(1)})).sort((a,b)=>b.autoPassed-a.autoPassed).slice(0,15);
console.log(JSON.stringify({windows,noManual,autoLegal,autoUsed,autoPassed,autoPassPct:+(100*autoPassed/Math.max(1,autoLegal)).toFixed(1),passiveSeq2,passiveSeq3,passiveLow,passiveSetup,passiveGround,passiveSearch,passiveDiscountSetup,top},null,2));
