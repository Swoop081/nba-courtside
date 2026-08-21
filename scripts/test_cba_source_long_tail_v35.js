const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),noop=()=>{},dummy=()=>({innerHTML:'',classList:{add:noop,remove:noop,toggle:noop},onclick:null,style:{},dataset:{},addEventListener:noop,disabled:false});
const store={nbaCourtsideTeam:'PHI'};
const ctx={console,structuredClone,Date,Math,URLSearchParams,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:noop,location:{reload:noop,search:''},navigator:{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{head:{appendChild:noop},documentElement:{style:{setProperty:noop}},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},body:{style:{},appendChild(){}}}};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data/data-v0.35.js','data/source-certification-v0.35.js','data/future-pick-ledger-v0.35.js','data/schedule-v0.35.js','data/schedule-template-v0.35.js','cba-v0.35.js','data/organizations-v0.35.js','data/g-league-v0.35.js','data/college-draft-v0.35.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),ctx,{filename:f});
vm.runInContext(fs.readFileSync(root+'/data/g-league-v0.35.js','utf8'),ctx,{filename:'data/g-league-v0.35.js'});vm.runInContext(fs.readFileSync(root+'/data/college-draft-v0.35.js','utf8'),ctx,{filename:'data/college-draft-v0.35.js'});
let src=fs.readFileSync(root+'/app-v0.35.js','utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`refreshSeasonConfig();userTeam='PHI';state.userTeam='PHI';ensureCbaState();ensureCbaLongTailState();renderView=()=>{};setTop=()=>{};toast=()=>{};persist=()=>{};closeSheet=()=>{};window.__v24={getState:()=>state,getPlayers:()=>players,CBA:window.NBA_COURTSIDE_CBA,cap:()=>CAP,currentTeam,currentStatus,capHit,apronTeamSalary,teamSalaryPlayerCharge,apronPlayerCharge,signedCount,twoWayCount,waivePlayer,waiverEntry,waiverClaimRoute,submitWaiverClaim,processWaiverWire,waiverPriorityCompare,claimWaivedPlayer,clearWaivers,signTwoWay,signExhibit10,convertExhibit10ToTwoWay,applyDisabledPlayerException,dpeRows,consumeDpe,signingRoutesFor,installContract,recordCashTrade,cashRow,cashTradeRemaining,extensionInfo,extensionEligible,incompleteRosterCharge};\n})();`);
vm.runInContext(src,ctx,{filename:'app-v24-test.js'});
const T=ctx.__v24,s=T.getState(),ps=T.getPlayers(),C=T.CBA,assert=(x,m)=>{if(!x)throw new Error(m)};

// Exact CBA years of service: no age proxy remains.
const lebron=ps.find(p=>p.name==='LeBron James'),dillon=ps.find(p=>p.name==='Dillon Mitchell'),yanic=ps.find(p=>p.name==='Yanic Niederhauser');
assert(C.serviceYears(lebron)===23,'LeBron exact YOS');
assert(C.serviceYears({age:39})===0,'no age proxy fallback');
assert(yanic.stats_2025_26?.gp===41&&yanic.stat_source_status==='season_complete_verified'&&yanic.rating_source==='2026-27_current_ability_model_v0.29','Yanic final NBA source repair');

// Current certified Two-Way status is outside standard Team Salary and roster count.
assert(T.currentStatus(dillon)==='two_way'&&T.currentTeam(dillon)==='BOS','Dillon current Two-Way certification');
assert(T.teamSalaryPlayerCharge(dillon)===0&&T.apronPlayerCharge(dillon)===0,'Two-Way excluded from salary ledgers');
assert(T.twoWayCount('BOS')>=1,'Boston Two-Way slot');

// Team Salary vs Apron Team Salary: unlikely incentives count only for apron accounting.
const ph=T.getPlayers().find(p=>T.currentTeam(p)==='PHI'&&T.currentStatus(p)==='active');
const original=structuredClone(s.contractOverrides[ph.id]||ph.contract),row=structuredClone((original.years||[]).find(y=>y.season_start===s.seasonYear));
s.contractOverrides[ph.id]={...original,years:(original.years||[]).map(y=>y.season_start===s.seasonYear?{...y,incentives:{likely:200000,unlikely:700000}}:{...y}),team:'PHI'};
const teamCharge=T.teamSalaryPlayerCharge(ph),apronCharge=T.apronPlayerCharge(ph);
assert(apronCharge-teamCharge===700000,'unlikely incentive only in Apron Team Salary');
delete s.contractOverrides[ph.id];

// One-year veteran minimum reimbursement uses the two-YOS minimum Team Salary charge for 3+ YOS.
const min3=C.minimumSalary(T.cap().salary_cap,{years_service:3}),charge=C.oneYearMinimumTeamSalaryCharge(T.cap().salary_cap,{years_service:3},min3);
assert(charge===C.minimumSalary(T.cap().salary_cap,{years_service:2})&&charge<min3,'one-year veteran minimum reimbursement');

// Exhibit 10 uses the player's own service-year minimum; Two-Way remains half the zero-YOS minimum.
const ex=C.exhibit10Contract(T.cap().salary_cap,{seasonYear:s.seasonYear,player:{years_service:3},bonus:20000});
assert(ex.years[0].amount===C.minimumSalary(T.cap().salary_cap,{years_service:3}),'Exhibit 10 service-year minimum');
assert(C.twoWaySalary(T.cap().salary_cap)===Math.round(C.minimumSalary(T.cap().salary_cap,{years_service:0})*.5),'Two-Way salary');

// Waiver claims wait 48 hours and competing claims use waiver preference.
const wav=ps.find(p=>p.name==='Mike Conley'&&T.currentTeam(p)==='BOS');
assert(wav,'waiver test player');const detOpen=ps.find(p=>T.currentTeam(p)==='DET'&&T.currentStatus(p)==='active');s.assignments[detOpen.id]=null;s.statusOverrides[detOpen.id]='free_agent';s.date='2026-10-10';s.seasonStarted=false;assert(T.waivePlayer(wav,'BOS',{cpu:true}),'waive opens wire');
assert(T.currentStatus(wav)==='waivers'&&T.currentTeam(wav)==='BOS','waived player stays assigned during 48h');
assert(T.submitWaiverClaim(wav,'DET',{cpu:true})&&T.submitWaiverClaim(wav,'WAS',{cpu:true}),'claims filed');
assert(T.currentTeam(wav)==='BOS','claim not immediate');
const w=T.waiverEntry(wav);assert(T.waiverPriorityCompare('WAS','DET',w)<0,'previous-season worst record gets priority before Dec 1');
s.date=w.clears;T.processWaiverWire(s.date);assert(T.currentTeam(wav)==='WAS','waiver priority assignment at clear');

// DPE: amount, grant, source window and single-use signing route.
const injP=ps.find(p=>T.currentTeam(p)==='PHI'&&T.currentStatus(p)==='active'&&T.teamSalaryPlayerCharge(p)>8000000);
s.date='2026-08-20';s.seasonStarted=false;s.injuries=s.injuries||{};s.injuries[injP.id]={player_id:injP.id,team_at_injury:'PHI',name:'Test season-ending injury',start_date:s.date,return_date:'2027-07-01',days_out:315,source:'test'};
const dpe=T.applyDisabledPlayerException(injP,'PHI');assert(dpe&&dpe.amount===C.disabledPlayerExceptionAmount(T.cap().salary_cap,T.teamSalaryPlayerCharge(injP)),'DPE grant amount');
const free=ps.find(p=>T.currentTeam(p)==='NYK'&&T.currentStatus(p)==='active'&&C.serviceYears(p)>=1);const oldTeam=T.currentTeam(free);s.assignments[free.id]=null;s.statusOverrides[free.id]='free_agent';delete s.freeAgentRights[free.id];
const dpeAmt=Math.min(dpe.amount,Math.max(1000000,C.minimumSalary(T.cap().salary_cap,free)));
T.installContract(free,'PHI',{years:1,firstSalary:dpeAmt,route:`dpe:${dpe.id}`});assert(s.disabledPlayerExceptions.find(x=>x.id===dpe.id)?.used===true,'DPE consumed by signing');

// Prospective Two-Way and Exhibit 10 routes are executable.
const twCand=ps.find(p=>T.currentTeam(p)==='UTA'&&T.currentStatus(p)==='active'&&C.serviceYears(p)<=3&&p.id!==wav.id);assert(twCand,'Two-Way candidate');s.assignments[twCand.id]=null;s.statusOverrides[twCand.id]='free_agent';delete s.freeAgentRights[twCand.id];
assert(T.signTwoWay(twCand,'PHI'),'Two-Way signing');assert(T.currentStatus(twCand)==='two_way'&&T.teamSalaryPlayerCharge(twCand)===0,'Two-Way runtime status');
const exCand=ps.find(p=>T.currentTeam(p)==='SAS'&&T.currentStatus(p)==='active'&&C.serviceYears(p)<=3);assert(exCand,'Exhibit 10 candidate');s.assignments[exCand.id]=null;s.statusOverrides[exCand.id]='free_agent';delete s.freeAgentRights[exCand.id];s.seasonStarted=false;
assert(T.signExhibit10(exCand,'PHI'),'Exhibit 10 signing');assert(T.currentStatus(exCand)==='exhibit_10','Exhibit 10 runtime status');

// Cash consideration has separate annual paid/received ledgers and cash-sending apron consequences.
const cash=T.recordCashTrade('BKN','WAS',1000000);assert(cash.ok&&T.cashRow('BKN').paid===1000000&&T.cashRow('WAS').received===1000000,'cash trade ledger');
assert(T.cashTradeRemaining('BKN','paid')===C.cashTradeLimit(T.cap().salary_cap)-1000000,'cash annual limit');

// Stretch/set-off and extension helpers are deterministic and cap-aware.
assert(C.stretchSchedule({amount:15000000,seasonsRemaining:2,startSeason:2026}).length===5,'stretch 2n+1');
assert(C.setOffReduction(T.cap().salary_cap,{oldPlayerYears:5,newComp:5000000})>0,'set-off formula');
const ext=C.veteranExtensionEligibility({contractYears:[{season_start:2024},{season_start:2025},{season_start:2026}],signedDate:'2024-07-10',currentDate:'2026-07-10',currentSeason:2026,route:'minimum'});assert(ext.ok,'3-year veteran extension after second anniversary');

console.log(JSON.stringify({status:'PASS',players:ps.length,finalNba:ps.filter(p=>p.stats_2025_26).length,projection:ps.filter(p=>!p.stats_2025_26).length,lebronYOS:C.serviceYears(lebron),yanicGP:yanic.stats_2025_26.gp,dillonStatus:T.currentStatus(dillon),waiverWinner:T.currentTeam(wav),dpeAmount:dpe.amount,twoWaySalary:C.twoWaySalary(T.cap().salary_cap),cashLimit:C.cashTradeLimit(T.cap().salary_cap)},null,2));
