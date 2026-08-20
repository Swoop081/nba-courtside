(() => {
'use strict';
/*
 * NBA Courtside CBA helper.
 * Major 2023 CBA mechanics are represented here so the GM UI can stay simple.
 * It is intentionally conservative on edge cases that require data not yet in
 * the player snapshot (bonuses, BYC, sign-and-trade timing, cash, TPE ledgers).
 */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pct=(cap,rate)=>Math.round(cap*rate);
const CAP_2023_24=136021000;
const BASE_CAP_2026_27=164961000;
const RATES={
  nt_mle:15044000/BASE_CAP_2026_27,
  tax_mle:6064000/BASE_CAP_2026_27,
  room_mle:9366000/BASE_CAP_2026_27,
  bae:.0332,
  rookie_min:.00824
};
function exceptionAmounts(cap){return {
  non_taxpayer_mle:pct(cap,RATES.nt_mle),
  taxpayer_mle:pct(cap,RATES.tax_mle),
  room_mle:pct(cap,RATES.room_mle),
  biannual:pct(cap,RATES.bae)
}}
function serviceYears(player){
  if(Number.isFinite(player?.years_service))return clamp(player.years_service,0,20);
  // Snapshot v0.12 does not yet carry certified NBA service time for every player.
  return clamp(Math.floor((player?.age||20)-19),0,10);
}
function modeledMinimum(cap,player){
  const zero=pct(cap,RATES.rookie_min), y=serviceYears(player);
  const mult=[1,1.08,1.18,1.28,1.38,1.48,1.58,1.68,1.78,1.88,1.98][Math.min(10,y)];
  return Math.round(zero*mult/1000)*1000;
}
function maxSalary(cap,player){const y=serviceYears(player);return Math.round(cap*(y>=10?.35:y>=7?.30:.25));}
function maxYears({bird=false}={}){return bird?5:4}
function annualRaise({bird=false}={}){return bird?.08:.05}
function buildContract({seasonYear,years,firstSalary,raise=.05,lastOption='guaranteed',source='cap_room'}){
  const rows=[];
  for(let i=0;i<years;i++)rows.push({
    season_start:seasonYear+i,
    season:`${seasonYear+i}-${String((seasonYear+i+1)%100).padStart(2,'0')}`,
    amount:Math.round(firstSalary*Math.pow(1+raise,i)/1000)*1000,
    option:i===years-1?lastOption:'guaranteed',
    source
  });
  return rows;
}
function expandedTpeMax(outSalary,cap){
  const scaled75=7500000*(cap/CAP_2023_24);
  return Math.max(
    Math.min(outSalary*2+250000,outSalary+scaled75),
    outSalary*1.25+250000
  );
}
function tradeRoutes({teamSalary,outSalary,inSalary,cap,firstApron,secondApron,outCount=1,existingHardCap=null}){
  const post=teamSalary-outSalary+inSalary, routes=[];
  const add=(id,label,maxIncoming,hardCap=null,reason='')=>{
    const ceiling=existingHardCap?Math.min(existingHardCap,hardCap||Infinity):(hardCap||Infinity);
    const ok=inSalary<=maxIncoming+1 && post<=ceiling+1;
    routes.push({id,label,maxIncoming,hardCap,post,ok,reason:ok?'LEGAL':reason||'SALARY MATCH'});
  };
  // A team below the cap can use room created after sending salary, plus $250k.
  if(teamSalary<=cap){
    const roomAfterOut=Math.max(0,cap-(teamSalary-outSalary));
    add('room','CAP ROOM',roomAfterOut+250000,null,'CAP ROOM');
  }
  // Above the second apron we use a deliberately conservative current-CBA rule:
  // no aggregation and no increase in incoming salary.
  if(teamSalary>secondApron){
    if(outCount>1)routes.push({id:'second_apron',label:'SECOND APRON',maxIncoming:outSalary,hardCap:null,post,ok:false,reason:'SECOND APRON · NO SALARY AGGREGATION'});
    else add('second_apron','SECOND APRON',outSalary,null,'SECOND APRON · CANNOT TAKE BACK MORE SALARY');
    return routes;
  }
  // Standard TPE is 100% + $250k. It does not itself create an in-season apron hard cap here.
  if(outCount===1)add('standard','STANDARD TPE',outSalary+250000,null,'STANDARD TPE');
  // Aggregating 2+ outgoing contracts invokes a second-apron hard cap.
  if(outCount>=2)add('aggregated_standard','AGGREGATED STANDARD TPE',outSalary+250000,secondApron,'SECOND APRON HARD CAP');
  // Expanded matching is the most permissive band, but invokes the first-apron hard cap.
  add('expanded','EXPANDED TPE',expandedTpeMax(outSalary,cap),firstApron,'FIRST APRON HARD CAP');
  return routes;
}
function tradeLegal(args){
  const routes=tradeRoutes(args), legal=routes.filter(r=>r.ok).sort((a,b)=>b.maxIncoming-a.maxIncoming);
  if(legal.length)return {...legal[0],routes,reason:'LEGAL'};
  const preferred=routes.sort((a,b)=>b.maxIncoming-a.maxIncoming)[0]||{label:'NO ROUTE',maxIncoming:0,post:args.teamSalary-args.outSalary+args.inSalary,reason:'NO TRADE ROUTE'};
  return {...preferred,routes,ok:false,reason:preferred.reason||preferred.label};
}
function signingRoutes({teamSalary,cap,firstApron,secondApron,amount,usage={},ownRights=null,player=null,existingHardCap=null}){
  const e=exceptionAmounts(cap),out=[];
  const post=teamSalary+amount;
  const hardOk=limit=>!limit||post<=limit+1;
  const add=(id,label,max,years,hardCap=null)=>{
    const ceiling=existingHardCap?Math.min(existingHardCap,hardCap||Infinity):(hardCap||Infinity);
    if(amount<=max+1&&hardOk(ceiling))out.push({id,label,max,years,hardCap});
  };
  const room=Math.max(0,cap-teamSalary);
  if(room>0)add('cap_room','CAP SPACE',room,4,null);
  if(ownRights?.level==='bird')add('bird','BIRD RIGHTS',maxSalary(cap,player),5,null);
  else if(ownRights?.level==='early_bird')add('early_bird','EARLY BIRD',Math.max((ownRights.last_salary||0)*1.75,cap*.105),4,null);
  else if(ownRights?.level==='non_bird')add('non_bird','NON-BIRD',Math.max((ownRights.last_salary||0)*1.2,modeledMinimum(cap,player)*1.2),4,null);
  const usedAnyMLE=!!(usage.nt_mle||usage.tax_mle||usage.room_mle);
  if(!usedAnyMLE&&teamSalary<cap)add('room_mle','ROOM MLE',e.room_mle,3,null);
  if(!usedAnyMLE&&post<=firstApron)add('nt_mle','NON-TAXPAYER MLE',e.non_taxpayer_mle,4,firstApron);
  // The Taxpayer MLE is the route for a team ending above the first apron but not above the second.
  if(!usedAnyMLE&&post>firstApron&&post<=secondApron)add('tax_mle','TAXPAYER MLE',e.taxpayer_mle,2,secondApron);
  if(!usage.bae&&!usage.bae_last_year&&!usage.room_mle&&post<=firstApron)add('bae','BI-ANNUAL EXCEPTION',e.biannual,2,firstApron);
  add('minimum','MINIMUM EXCEPTION',modeledMinimum(cap,player),2,null);
  return out.sort((a,b)=>b.max-a.max);
}
window.NBA_COURTSIDE_CBA={RATES,exceptionAmounts,serviceYears,modeledMinimum,maxSalary,maxYears,annualRaise,buildContract,expandedTpeMax,tradeRoutes,tradeLegal,signingRoutes};
})();
