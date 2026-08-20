const fs=require('fs'),vm=require('vm');
const root='/mnt/data/NBA-Courtside-Postseason-v0.14';
const data=fs.readFileSync(root+'/data/data.js','utf8'),sched=fs.readFileSync(root+'/data/schedule.js','utf8'),cba=fs.readFileSync(root+'/cba.js','utf8');
let src=fs.readFileSync(root+'/app.js','utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`window.__test={
 getState:()=>state,getPlayers:()=>players,getCap:()=>CAP,currentTeam,capHit,rightsFor,rightsHold,deadCapFor,incompleteRosterCharge,cbaAmounts,usageFor,hardCapFor,signingRoutesFor,installContract,contractYears,waivePlayer,applyApronYearEnd,pickAssets,ensureFuturePickHorizon
};\n})();`);
const noop=()=>{};const store={nbaCourtsideTeam:'DET'};
const ctx={console,structuredClone,Date,setTimeout:(f)=>f(),confirm:()=>true,scrollTo:noop,location:{reload:noop},window:{},document:{documentElement:{style:{setProperty:noop}},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({classList:{add:noop,remove:noop}}),body:{appendChild:noop,style:{}}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},Math};ctx.window=ctx;
vm.createContext(ctx);vm.runInContext(data,ctx);vm.runInContext(sched,ctx);vm.runInContext(cba,ctx);vm.runInContext(src,ctx);
const t=ctx.__test,st=t.getState(),P=t.getPlayers();if(!t)throw new Error('hooks missing');if(st.version!==14)throw new Error('v14 state missing');
const cap=t.getCap();if(cap.salary_cap!==164961000||cap.first_apron!==209015000||cap.second_apron!==221686000)throw new Error('cap baseline wrong');
const duren=P.find(p=>p.name==='Jalen Duren');if(!duren)throw new Error('Duren missing');
const rights=t.rightsFor(duren,'DET');if(!rights||rights.type!=='RFA'||rights.cap_hold!==19449432)throw new Error('initial RFA rights missing');
const before=t.capHit('DET');st.freeAgentRights[duren.id]={...rights,renounced:true};const after=t.capHit('DET');if(!(after<before))throw new Error('renouncing cap hold failed');
st.freeAgentRights[duren.id]={...rights,renounced:false};
const routes=t.signingRoutesFor(duren,'DET',rights.qualifying_offer);if(!routes.some(r=>r.id==='bird'))throw new Error('Bird route unavailable for own RFA');
t.installContract(duren,'DET',{years:1,firstSalary:rights.qualifying_offer,lastOption:'guaranteed',route:'bird',raise:0});if(t.currentTeam(duren)!=='DET'||t.contractYears(duren).length!==1)throw new Error('contract install failed');
const lebron=P.find(p=>p.name==='LeBron James');const guar=t.contractYears(lebron).filter(y=>!['player_option','team_option','early_termination'].includes(y.option)).reduce((s,y)=>s+y.amount,0);t.waivePlayer(lebron,'PHI',{cpu:true});if(t.currentTeam(lebron)!==null)throw new Error('waiver assignment failed');if((st.deadCapLedger.PHI?.[2026]||0)<=0||t.deadCapFor('PHI',2026)<=0)throw new Error('dead-cap ledger missing');
// Force a second-apron year-end and verify the seven-seasons-out freeze is persisted.
st.otherCap.DET=(st.otherCap.DET||0)+300000000;t.applyApronYearEnd();const frozen=(st.draftAssets||[]).find(x=>x.year===2034&&x.round===1&&x.origin==='DET');if(!frozen||frozen.tradeable!==false||frozen.frozenBySecondApron!==2026)throw new Error('second-apron pick freeze failed');
console.log(JSON.stringify({version:st.version,cap,detRfa:'Jalen Duren',capHoldRemoved:before-after,qualifyingOffer:rights.qualifying_offer,lebronModeledGuaranteed:guar,phiDeadCap2026:t.deadCapFor('PHI',2026),frozenPick:frozen.id,status:'APP CBA INTEGRATION PASS'},null,2));
