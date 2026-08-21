(() => {
'use strict';
/*
 * NBA Courtside CBA helper — v0.24 source-certified long-tail pass.
 *
 * The module deliberately separates rules that are mechanically certifiable
 * from data that is not present in the starting snapshot.  It now covers the
 * current apron transaction table, persistent Standard TPEs, sign-and-trade /
 * BYC treatment, service-year certified minimum/max salary math, Team Salary
 * vs Apron Team Salary adjustments, cash, waiver/stretch/set-off helpers,
 * Two-Way / Exhibit 10 / Disabled Player Exception machinery, and specialist
 * extension eligibility.  Starting-universe incentive/bonus/guarantee amounts
 * are not invented; the mechanics are exact for fields created in-save.
 */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pct=(cap,rate)=>Math.round(cap*rate);
const CAP_2024_25=140588000;
const BASE_CAP_2026_27=164961000;
const RATES={
  nt_mle:15044000/BASE_CAP_2026_27,
  tax_mle:6064000/BASE_CAP_2026_27,
  room_mle:9366000/BASE_CAP_2026_27,
  bae:4668000/CAP_2024_25,
  expanded_add:7752000/CAP_2024_25
};

const MINIMUM_2024_25={
  0:[1157153],
  1:[1862265,1955377],
  2:[2087519,2191897,2296271],
  3:[2162606,2270735,2378864,2486995],
  4:[2237691,2349578,2461462,2573347,2685233],
  5:[2425403,2546675,2667944,2789215,2910485],
  6:[2613120,2743776,2874429,3005085,3135742],
  7:[2800834,2940876,3080918,3220959,3361002],
  8:[2988550,3137977,3287406,3436836,3586264],
  9:[3003427,3153598,3303770,3453941,3604113],
  10:[3303771,3468960,3634150,3799338,3964527]
};
const SECOND_ROUND_2024_25={
  3:{min:[1157153,1955377,2296271],max:[1862265,1955377,2296271]},
  4:{min:[1157153,1955377,2296271,2486995],max:[2087519,2191897,2296271,2486995]}
};
// 2024-25 rookie-scale base amounts. NBA contracts may be 80%-120% of scale;
// Courtside uses the common 120% structure for generated first-round picks.
const ROOKIE_SCALE_2024_25=[
 [10474200,10998100,11521700,.261],[9371400,9840200,10308900,.262],[8415800,8836300,9257400,.264],
 [7587600,7967100,8346600,.265],[6871100,7214400,7558000,.267],[6240600,6552700,6864900,.268],
 [5697000,5982000,6266600,.270],[5219100,5480100,5741100,.272],[4797400,5037500,5277300,.274],
 [4557600,4785400,5013000,.275],[4329600,4546300,4762800,.327],[4113300,4319100,4524800,.378],
 [3907500,4103100,4298400,.429],[3712400,3898000,4083800,.481],[3526500,3702800,3879100,.533],
 [3350300,3517800,3685500,.534],[3182600,3341800,3500900,.536],[3023700,3174600,3326000,.538],
 [2887500,3031800,3176500,.540],[2771800,2910400,3048800,.542],[2661000,2794200,2927300,.593],
 [2554700,2682300,2810100,.645],[2452600,2575400,2697600,.697],[2354600,2472300,2590000,.749],
 [2260100,2373000,2486400,.801],[2185300,2294400,2403700,.803],[2122200,2228400,2334700,.804],
 [2109000,2214800,2320200,.805],[2093900,2198500,2303300,.805],[2078600,2182500,2286700,.805]
];

function scale2024(cap,v){return Math.round(v*(cap/CAP_2024_25)/1000)*1000}
function exceptionAmounts(cap){return {
  non_taxpayer_mle:pct(cap,RATES.nt_mle),
  taxpayer_mle:pct(cap,RATES.tax_mle),
  room_mle:pct(cap,RATES.room_mle),
  biannual:pct(cap,RATES.bae)
}}
function serviceYears(player){
  // v0.24 removes the age proxy. Every frozen starting-universe player carries
  // a certified CBA service-year seed; generated players accrue this same field.
  return Number.isFinite(player?.years_service)?clamp(player.years_service,0,30):0;
}
function minimumSalary(cap,player,contractYear=1){
  const y=Math.min(10,serviceYears(player)), row=MINIMUM_2024_25[y]||MINIMUM_2024_25[10];
  const i=clamp((contractYear||1)-1,0,row.length-1);
  return scale2024(cap,row[i]);
}
function modeledMinimum(cap,player){return minimumSalary(cap,player,1)}
function maxSalary(cap,player,priorSalary=0){const y=serviceYears(player),tier=Math.round(cap*(y>=10?.35:y>=7?.30:.25));return Math.max(tier,Math.round((priorSalary||0)*1.05));}
function maxYears({bird=false,earlyBird=false,level=null}={}){return (bird||level==='bird')?5:4}
function annualRaise({bird=false,earlyBird=false,level=null}={}){return (bird||earlyBird||level==='bird'||level==='early_bird')?.08:.05}
function estimatedAveragePlayerSalary(cap){return cap*.105}
function buildContract({seasonYear,years,firstSalary,raise=.05,lastOption='guaranteed',source='cap_room'}){
  const rows=[];
  for(let i=0;i<years;i++)rows.push({
    season_start:seasonYear+i,
    season:`${seasonYear+i}-${String((seasonYear+i+1)%100).padStart(2,'0')}`,
    amount:Math.round(firstSalary*(1+raise*i)/1000)*1000,
    option:i===years-1?lastOption:'guaranteed',
    source
  });
  return rows;
}
function minimumContract(cap,{player,years=1,seasonYear}){
  const n=clamp(Math.round(years||1),1,2), rows=[];
  for(let i=0;i<n;i++)rows.push({
    season_start:seasonYear+i,
    season:`${seasonYear+i}-${String((seasonYear+i+1)%100).padStart(2,'0')}`,
    amount:minimumSalary(cap,player,i+1),
    option:'guaranteed',
    source:'minimum'
  });
  return rows;
}
function rookieScaleContract(cap,pick,seasonYear){
  const r=ROOKIE_SCALE_2024_25[clamp((pick||1)-1,0,29)], mult=1.2;
  const y1=scale2024(cap,r[0])*mult,y2=scale2024(cap,r[1])*mult,y3=scale2024(cap,r[2])*mult,y4=y3*(1+r[3]);
  const vals=[y1,y2,y3,y4].map(v=>Math.round(v/1000)*1000);
  return vals.map((amount,i)=>({season_start:seasonYear+i,season:`${seasonYear+i}-${String((seasonYear+i+1)%100).padStart(2,'0')}`,amount,option:i<2?'guaranteed':'team_option',source:'rookie_scale'}));
}
function secondRoundExceptionContract(cap,{years=4,seasonYear}){
  const n=years===3?3:4, base=SECOND_ROUND_2024_25[n].max;
  return base.map((v,i)=>({season_start:seasonYear+i,season:`${seasonYear+i}-${String((seasonYear+i+1)%100).padStart(2,'0')}`,amount:scale2024(cap,v),option:i===n-1?'team_option':'guaranteed',source:'second_round_exception'}));
}

function oneYearMinimumTeamSalaryCharge(cap,player,actualSalary){
  // One-year minimum contracts for 3+ YOS receive league reimbursement above
  // the two-YOS minimum; only the non-reimbursed amount counts in Team Salary.
  if(serviceYears(player)<3)return Math.round(actualSalary);
  return Math.min(Math.round(actualSalary),minimumSalary(cap,{years_service:2},1));
}
function cashTradeLimit(cap){return Math.round(7240000*(cap/CAP_2024_25)/1000)*1000}
function twoWaySalary(cap){return Math.round(minimumSalary(cap,{years_service:0},1)*.5/1000)*1000}
function twoWayContract(cap,{seasonYear,years=1}){
  const n=clamp(Math.round(years||1),1,2),salary=twoWaySalary(cap);
  return Array.from({length:n},(_,i)=>({season_start:seasonYear+i,season:`${seasonYear+i}-${String((seasonYear+i+1)%100).padStart(2,'0')}`,amount:salary,option:'guaranteed',source:'two_way'}));
}
function exhibit10BonusMax(cap){return Math.round(77500*(cap/CAP_2024_25)/500)*500}
function exhibit10Contract(cap,{seasonYear,bonus=5000,player={years_service:0}}){
  const b=clamp(Math.round(bonus||5000),5000,exhibit10BonusMax(cap));
  return {years:[{season_start:seasonYear,season:`${seasonYear}-${String((seasonYear+1)%100).padStart(2,'0')}`,amount:minimumSalary(cap,player,1),option:'nonguaranteed',guaranteed:0,source:'exhibit_10'}],exhibit10_bonus:b,convertible_to_two_way:true};
}
function disabledPlayerExceptionAmount(cap,currentSalary){return Math.round(Math.min(Math.max(0,currentSalary||0)*.5,exceptionAmounts(cap).non_taxpayer_mle))}
function protectedAmount(year){
  if(!year)return 0;
  if(Number.isFinite(year.guaranteed))return clamp(year.guaranteed,0,year.amount||0);
  return ['team_option','early_termination','nonguaranteed'].includes(year.option)?0:Math.max(0,year.amount||0);
}
function stretchSchedule({amount,seasonsRemaining,startSeason}){
  const n=Math.max(1,Math.round(seasonsRemaining||1)),years=2*n+1,annual=Math.round((amount||0)/years);
  return Array.from({length:years},(_,i)=>({season_start:startSeason+i,amount:i===years-1?(amount||0)-annual*(years-1):annual}));
}
function setOffReduction(cap,{oldPlayerYears=0,newComp=0}){
  const floor=minimumSalary(cap,{years_service:oldPlayerYears>0?1:0},1);
  return Math.round(Math.max(0,(newComp||0)-floor)*.5);
}
function veteranExtensionEligibility({contractYears=[],signedDate=null,currentDate=null,currentSeason=null,route=null}){
  const ys=[...contractYears].sort((a,b)=>(a.season_start||0)-(b.season_start||0));
  if(route==='rookie_scale'){
    const fourth=ys[3]?.season_start;
    return {ok:fourth===currentSeason,kind:'rookie_scale_extension',maxNewYears:5,maxRaise:.08,reason:fourth===currentSeason?'LEGAL':'ROOKIE-SCALE EXTENSION WINDOW IS BEFORE FOURTH SEASON'};
  }
  const originalLength=ys.length;
  if(originalLength<3)return {ok:false,kind:'veteran_extension',reason:'1-2 YEAR VETERAN CONTRACT CANNOT BE EXTENDED'};
  if(!signedDate||!currentDate)return {ok:false,kind:'veteran_extension',reason:'ORIGINAL SIGNING DATE NOT CERTIFIED'};
  const anniversary=originalLength<=4?2:3;
  const d=new Date(signedDate+'T12:00:00Z');d.setUTCFullYear(d.getUTCFullYear()+anniversary);
  const eligible=d.toISOString().slice(0,10);
  return {ok:currentDate>=eligible,kind:'veteran_extension',eligibleDate:eligible,maxNewYears:4,maxRaise:.08,reason:currentDate>=eligible?'LEGAL':`ELIGIBLE ${eligible}`};
}
function veteranExtensionMaxFirst(cap,lastOriginalSalary){return Math.round(Math.max(lastOriginalSalary||0,estimatedAveragePlayerSalary(cap))*1.4)}

function nonBirdMax(cap,player,rights={}){
  return Math.max((rights.last_salary||0)*1.2,minimumSalary(cap,player)*1.2,rights.qualifying_offer||0);
}
function signAndTradeOutgoingSalary({teamSalary,cap,rights,firstSalary,player}){
  const lvl=rights?.level;
  if(teamSalary>cap&&(lvl==='bird'||lvl==='early_bird')&&firstSalary>nonBirdMax(cap,player,rights)+1){
    return Math.max(rights.last_salary||0,firstSalary*.5);
  }
  return firstSalary;
}
function signAndTradeLegal({rights,firstSalary,years,lastOption='guaranteed',cap,player}){
  if(!rights||!['bird','early_bird','non_bird'].includes(rights.level))return {ok:false,reason:'OWN FREE-AGENT RIGHTS REQUIRED'};
  const optionYears=lastOption==='guaranteed'?0:1;
  if(years<3||years>4||years-optionYears<3)return {ok:false,reason:'SIGN-AND-TRADE MUST COVER 3-4 YEARS; AT LEAST 3 NON-OPTION YEARS'};
  const max=rights.level==='bird'?maxSalary(cap,player,rights.last_salary||0):rights.level==='early_bird'?Math.max((rights.last_salary||0)*1.75,estimatedAveragePlayerSalary(cap)*1.05):nonBirdMax(cap,player,rights);
  if(firstSalary>max+1)return {ok:false,reason:'SIGN-AND-TRADE SALARY EXCEEDS RIGHTS ROUTE',max};
  return {ok:true,max,raise:.05};
}
function extensionAndTradeLimits({lastSalary,cap,remainingYears=1}){
  return {maxFirst:Math.min(Infinity,Math.max(lastSalary,estimatedAveragePlayerSalary(cap))*1.2),maxRaise:.05,maxTotalYears:4,maxNewYears:Math.max(0,4-remainingYears)};
}
function expandedTpeMax(outSalary,cap,allowance=250000){
  const scaledAdd=cap*RATES.expanded_add;
  return Math.max(
    Math.min(outSalary*2+allowance,outSalary+scaledAdd),
    outSalary*1.25+allowance
  );
}
function tradeRoutes({teamSalary,outSalary,inSalary,cap,firstApron,secondApron,outCount=1,existingHardCap=null,tradeExceptions=[],tradeSigningExceptions=null,currentSeason=null,firstApronTransactionsBlocked=false,postTeamSalary=null,apronTeamSalary=null,postApronTeamSalary=null}){
  const post=postTeamSalary==null?teamSalary-outSalary+inSalary:postTeamSalary,apronPre=apronTeamSalary==null?teamSalary:apronTeamSalary,apronPost=postApronTeamSalary==null?post:postApronTeamSalary,routes=[];
  const allowance=apronPost>firstApron?0:250000;
  const add=(id,label,maxIncoming,hardCap=null,reason='',meta={})=>{
    const ceiling=existingHardCap?Math.min(existingHardCap,hardCap||Infinity):(hardCap||Infinity);
    let ok=inSalary<=maxIncoming+1&&apronPost<=ceiling+1;
    let why=ok?'LEGAL':reason||'SALARY MATCH';
    if(ok&&firstApronTransactionsBlocked&&hardCap===firstApron){ok=false;why='TAXPAYER MLE · FIRST-APRON TRANSACTION BLOCK'}
    routes.push({id,label,maxIncoming,hardCap,post,ok,reason:why,...meta});
  };
  if(teamSalary<=cap){
    const roomAfterOut=Math.max(0,cap-(teamSalary-outSalary));
    add('room','CAP ROOM',roomAfterOut,null,'CAP ROOM');
  }
  if(apronPre>secondApron){
    if(outCount>1)routes.push({id:'second_apron',label:'SECOND APRON',maxIncoming:outSalary,hardCap:null,post,ok:false,reason:'SECOND APRON · NO SALARY AGGREGATION'});
    else add('second_apron','SECOND APRON',outSalary,null,'SECOND APRON · CANNOT TAKE BACK MORE SALARY');
    return routes;
  }
  if(outCount===1&&outSalary>0)add('standard','STANDARD TPE',outSalary+allowance,null,'STANDARD TPE');
  if(outCount>=2&&outSalary>0)add('aggregated_standard','AGGREGATED STANDARD TPE',outSalary+allowance,secondApron,'SECOND APRON HARD CAP');
  if(outSalary>0)add('expanded','EXPANDED TPE',expandedTpeMax(outSalary,cap,allowance),firstApron,'FIRST APRON HARD CAP');
  // A pre-existing Standard TPE is conservatively used as a standalone route;
  // Courtside does not combine it with current outgoing salary or other exceptions.
  if(outSalary===0&&inSalary>0){
    const se=tradeSigningExceptions||{};
    const ntTrade=se.nt_mle??se.non_taxpayer_mle??0;
    if(ntTrade>0)add('nt_mle_trade','NON-TAXPAYER MLE · TRADE',ntTrade,firstApron,'NON-TAXPAYER MLE TOO SMALL');
    if((se.room_mle||0)>0)add('room_mle_trade','ROOM MLE · TRADE',se.room_mle,null,'ROOM MLE TOO SMALL');
    if((se.biannual||0)>0)add('bae_trade','BI-ANNUAL · TRADE',se.biannual,firstApron,'BI-ANNUAL TOO SMALL');
    if((se.minimum_trade||0)>0)add('minimum_trade','MINIMUM SALARY EXCEPTION · TRADE',se.minimum_trade,null,'MINIMUM EXCEPTION NOT AVAILABLE');
    for(const tpe of tradeExceptions||[]){
      if(!tpe||tpe.remaining<=0)continue;
      let hardCap=null;
      if(tpe.sourceType==='sign_and_trade')hardCap=secondApron;
      if(currentSeason!=null&&tpe.generatedSeason!=null&&tpe.generatedSeason<currentSeason)hardCap=hardCap?Math.min(hardCap,firstApron):firstApron;
      add(`tpe:${tpe.id}`,'TRADED PLAYER EXCEPTION',tpe.remaining+allowance,hardCap,'TPE TOO SMALL',{tpeId:tpe.id,tpeRemaining:tpe.remaining});
    }
  }
  return routes;
}
function tradeLegal(args){
  const routes=tradeRoutes(args), legal=routes.filter(r=>r.ok).sort((a,b)=>b.maxIncoming-a.maxIncoming);
  if(legal.length){
    // Prefer the narrowest legal mechanism: cap room / Standard TPE / stored TPE
    // before invoking an apron-triggering expanded route.
    legal.sort((a,b)=>(a.hardCap?1:0)-(b.hardCap?1:0)||a.maxIncoming-b.maxIncoming);
    return {...legal[0],routes,reason:'LEGAL'};
  }
  const preferred=routes.sort((a,b)=>b.maxIncoming-a.maxIncoming)[0]||{label:'NO ROUTE',maxIncoming:0,post:args.teamSalary-args.outSalary+args.inSalary,reason:'NO TRADE ROUTE'};
  return {...preferred,routes,ok:false,reason:preferred.reason||preferred.label};
}
function signingRoutes({teamSalary,cap,firstApron,secondApron,amount,usage={},ownRights=null,player=null,existingHardCap=null,buyoutRestricted=false,apronTeamSalary=null,postApronTeamSalary=null}){
  const e=exceptionAmounts(cap),out=[];
  const post=teamSalary+amount,apronPost=postApronTeamSalary==null?(apronTeamSalary==null?post:apronTeamSalary+amount):postApronTeamSalary;
  const hardOk=limit=>!limit||apronPost<=limit+1;
  const add=(id,label,max,years,hardCap=null,minYears=1)=>{
    if(buyoutRestricted)hardCap=hardCap?Math.min(hardCap,firstApron):firstApron;
    const ceiling=existingHardCap?Math.min(existingHardCap,hardCap||Infinity):(hardCap||Infinity);
    if(amount<=max+1&&hardOk(ceiling))out.push({id,label,max,years,minYears,hardCap});
  };
  const room=Math.max(0,cap-teamSalary),roomTeam=!!usage.room_team;
  if(room>0)add('cap_room','CAP SPACE',room,4,null);
  if(ownRights?.level==='bird')add('bird','BIRD RIGHTS',maxSalary(cap,player),5,null,1);
  else if(ownRights?.level==='early_bird')add('early_bird','EARLY BIRD',Math.max((ownRights.last_salary||0)*1.75,estimatedAveragePlayerSalary(cap)*1.05),4,null,2);
  else if(ownRights?.level==='non_bird')add('non_bird','NON-BIRD',nonBirdMax(cap,player,ownRights),4,null,1);
  const usedAnyMLE=!!(usage.nt_mle||usage.tax_mle||usage.room_mle);
  if(!usedAnyMLE&&roomTeam)add('room_mle','ROOM MLE',e.room_mle,3,null);
  if(!usedAnyMLE&&!roomTeam&&apronPost<=firstApron)add('nt_mle','NON-TAXPAYER MLE',e.non_taxpayer_mle,4,firstApron);
  if(!usedAnyMLE&&!roomTeam&&!usage.first_apron_transaction&&apronPost>firstApron&&apronPost<=secondApron)add('tax_mle','TAXPAYER MLE',e.taxpayer_mle,2,secondApron);
  if(!usage.bae&&!usage.bae_last_year&&!roomTeam&&!usage.tax_mle&&apronPost<=firstApron)add('bae','BI-ANNUAL EXCEPTION',e.biannual,2,firstApron);
  add('minimum','MINIMUM EXCEPTION',minimumSalary(cap,player),2,null);
  return out.sort((a,b)=>b.max-a.max);
}
window.NBA_COURTSIDE_CBA={
  RATES,exceptionAmounts,serviceYears,minimumSalary,modeledMinimum,maxSalary,maxYears,annualRaise,estimatedAveragePlayerSalary,
  buildContract,minimumContract,rookieScaleContract,secondRoundExceptionContract,oneYearMinimumTeamSalaryCharge,cashTradeLimit,twoWaySalary,twoWayContract,exhibit10BonusMax,exhibit10Contract,disabledPlayerExceptionAmount,protectedAmount,stretchSchedule,setOffReduction,veteranExtensionEligibility,veteranExtensionMaxFirst,nonBirdMax,signAndTradeOutgoingSalary,signAndTradeLegal,extensionAndTradeLimits,
  expandedTpeMax,tradeRoutes,tradeLegal,signingRoutes
};
})();
