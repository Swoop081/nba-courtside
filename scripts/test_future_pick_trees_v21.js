const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const noop=()=>{};const dummy=()=>({innerHTML:'',classList:{add:noop,remove:noop,toggle:noop},onclick:null,style:{},dataset:{},addEventListener:noop,disabled:false});
const store={nbaCourtsideTeam:'TOR'};
const ctx={console,structuredClone,Date,Math,URLSearchParams,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:noop,location:{reload:noop,search:''},navigator:{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{documentElement:{style:{setProperty:noop}},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},body:{style:{},appendChild(){}}}};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data/data.js','data/source-certification.js','data/future-pick-ledger.js','data/schedule.js','data/schedule-template.js','cba.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),ctx,{filename:f});
let src=fs.readFileSync(root+'/app.js','utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`window.__pickTreeTest={getState:()=>state,initialDraftAssets,upgradeDraftAssetsV18,pickAssets,protectionLabel,resolveDraftOwners,resolve2027FirstOwners,resolve2028FirstOwners,resolve2029FirstOwners,resolve2030FirstOwners,resolve2031FirstOwners,resolve2032FirstOwners,resolve2033FirstOwners,resolveSecondOwners};\n})();`);
vm.runInContext(src,ctx,{filename:'app-pick-trees-v21.js',timeout:120000});
const t=ctx.__pickTreeTest;if(!t)throw new Error('pick-tree hooks missing');
const st=t.getState(), teams=ctx.NBA_COURTSIDE_DATA.league.teams.map(x=>x.abbr);st.seasonYear=2026;st.draftAssets=t.initialDraftAssets().map(x=>({...x}));st.pickHistory={};
const ledger=ctx.NBA_COURTSIDE_FUTURE_PICKS;
if(ledger.cells.length!==420)throw new Error('expected 420 origin cells');
const byStatus=ledger.cells.reduce((m,x)=>(m[x.status]=(m[x.status]||0)+1,m),{});
if(byStatus.source_locked!==7)throw new Error('expected seven unresolved/pending source-locked origin cells, got '+byStatus.source_locked);
if(byStatus.frozen!==4)throw new Error('expected four CBA-frozen cells');
const unresolved=ledger.cells.filter(x=>x.status==='source_locked').map(x=>`${x.year}-${x.round}-${x.origin}`).sort();
const wantUnresolved=['2029-1-CHA','2029-1-CLE','2029-1-MIN','2029-1-UTA','2031-1-CLE','2032-2-SAC','2033-2-DET'].sort();
if(JSON.stringify(unresolved)!==JSON.stringify(wantUnresolved))throw new Error('unexpected unresolved cells '+unresolved.join(','));
for(const x of st.draftAssets.filter(x=>x.sourceStatus==='conditional'||x.frozen||x.dataStatus==='source_locked'))if(x.tradeable!==false)throw new Error('linked/frozen/locked claim is tradeable '+x.id);
const cle31=st.draftAssets.find(x=>x.year===2031&&x.round===1&&x.origin==='CLE');if(cle31.owner!=='CLE'||cle31.tradeable!==false||cle31.sourceStatus!=='source_locked')throw new Error('CLE 2031 pending-transfer source lock failed');
const sac32=st.draftAssets.find(x=>x.year===2032&&x.round===2&&x.origin==='SAC');if(sac32.owner!=='CLE'||sac32.tradeable!==false||sac32.sourceStatus!=='source_locked')throw new Error('SAC 2032 pending-transfer source lock failed');
const cle31src=ledger.cells.find(x=>x.year===2031&&x.round===1&&x.origin==='CLE'),sac32src=ledger.cells.find(x=>x.year===2032&&x.round===2&&x.origin==='SAC');if(cle31src.pending_target!=='DEN'||sac32src.pending_target!=='DEN')throw new Error('pending Denver destination metadata missing');

function orderWith(spec,round=1){
 const arr=[...teams];
 for(const [team,pick] of Object.entries(spec)){
   const idx=round===1?pick-1:pick-31;if(idx<0||idx>=30)throw new Error('bad pick '+pick);
   const cur=arr.indexOf(team);[arr[idx],arr[cur]]=[arr[cur],arr[idx]];
 }
 return arr;
}
function ownerAt(year,round,origins,origin){const owners=t.resolveDraftOwners(year,round,origins);return owners[origins.indexOf(origin)];}
function assertOwner(year,round,spec,origin,want,msg=''){const o=orderWith(spec,round),got=ownerAt(year,round,o,origin);if(got!==want)throw new Error(`${year} R${round} ${origin}: got ${got}, want ${want}${msg?' '+msg:''}`);return o;}
// 2027 direct protections and linked firsts.
assertOwner(2027,1,{DAL:1},'DAL','DAL');
assertOwner(2027,1,{DAL:3},'DAL','CHA');
assertOwner(2027,1,{LAL:5},'LAL','MEM');
assertOwner(2027,1,{MIA:15},'MIA','CHA');
assertOwner(2027,1,{SAS:16},'SAS','SAC');
assertOwner(2027,1,{SAS:17},'SAS','OKC');
let o=orderWith({DEN:6,OKC:10,LAC:20,TOR:25});let ow=t.resolveDraftOwners(2027,1,o);let m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.DEN!=='OKC'||m.OKC!=='OKC'||m.LAC!=='LAC'||m.TOR!=='TOR')throw new Error('2027 DEN/OKC/LAC/TOR chain');
o=orderWith({UTA:4,CLE:10,MIN:20});ow=t.resolveDraftOwners(2027,1,o);m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.UTA!=='UTA'||m.CLE!=='MEM'||m.MIN!=='PHX')throw new Error('2027 UTA top-5 protection chain');
o=orderWith({NOP:1,MIL:2});ow=t.resolveDraftOwners(2027,1,o);m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.NOP!=='NOP'||m.MIL!=='NOP')throw new Error('2027 NOP/MIL both top-4');
o=orderWith({NOP:2,MIL:5});ow=t.resolveDraftOwners(2027,1,o);m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.NOP!=='NOP'||m.MIL!=='ATL')throw new Error('2027 NOP/MIL Atlanta branch');
// 2027 second branch depends on the resolved SAS first-round position.
t.resolveDraftOwners(2027,1,orderWith({SAS:16,LAL:5}));assertOwner(2027,2,{SAC:40},'SAC','OKC');
t.resolveDraftOwners(2027,1,orderWith({SAS:17,LAL:5}));assertOwner(2027,2,{SAC:40},'SAC','CHA');
// 2028 rollover branches from 2027 history.
st.pickHistory[2027]=orderWith({DEN:3,MIA:10,DAL:1});assertOwner(2028,1,{DEN:6},'DEN','OKC');assertOwner(2028,1,{MIA:20},'MIA','CHA');
t.resolveDraftOwners(2028,1,orderWith({PHI:5}));assertOwner(2028,2,{DET:56},'DET','PHI');t.resolveDraftOwners(2028,1,orderWith({PHI:5}));assertOwner(2028,2,{PHI:40},'PHI','BKN');
// 2029 clean multi-team distributions.
st.pickHistory[2027]=orderWith({DEN:10});
o=orderWith({HOU:3,DAL:10,PHX:20,BOS:4,POR:12,MIL:25});ow=t.resolveDraftOwners(2029,1,o);m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.HOU!=='HOU'||m.DAL!=='HOU'||m.PHX!=='BKN')throw new Error('2029 HOU/DAL/PHX');if(m.BOS!=='POR'||m.POR!=='WAS'||m.MIL!=='POR')throw new Error('2029 BOS/POR/MIL');
// Denver first serial: 2027 conveyed => second protected obligation may convey in 2029.
st.pickHistory[2027]=orderWith({DEN:10});assertOwner(2029,1,{DEN:6},'DEN','OKC');
// 2030 GSW first/second fallback.
o=orderWith({GSW:21});ow=t.resolveDraftOwners(2030,1,o);m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.GSW!=='MEM')throw new Error('2030 GSW first 21-30');assertOwner(2030,2,{GSW:40},'GSW','GSW');
o=orderWith({GSW:20});t.resolveDraftOwners(2030,1,o);assertOwner(2030,2,{GSW:40},'GSW','MEM');
// 2030 Charlotte exact conditional swap: if MIN is 4-30, CHA may take the less favorable of MIN and the more favorable of DAL/SAS when that asset is better than CHA.
o=orderWith({MIN:4,SAS:8,CHA:15,DAL:20});ow=t.resolveDraftOwners(2030,1,o);m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.MIN!=='SAS'||m.SAS!=='CHA'||m.CHA!=='MIN'||m.DAL!=='DAL')throw new Error('2030 CHA/MIN/SAS/DAL exact swap branch');
o=orderWith({MIN:2,SAS:8,CHA:15,DAL:20});ow=t.resolveDraftOwners(2030,1,o);m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.MIN!=='SAS'||m.SAS!=='MIN'||m.CHA!=='CHA'||m.DAL!=='DAL')throw new Error('2030 CHA swap must be barred when MIN is top-3');
// 2031/32/33 direct and swap cases.
o=orderWith({SAS:5,SAC:20});ow=t.resolveDraftOwners(2031,1,o);m=Object.fromEntries(o.map((x,i)=>[x,ow[i]]));if(m.SAS!=='SAS'||m.SAC!=='SAC'||m.CLE!=='CLE'||m.PHI!=='BOS')throw new Error('2031 first ownership/swap');
assertOwner(2032,1,{DEN:10},'DEN','BKN');assertOwner(2032,2,{SAC:45},'SAC','CLE');assertOwner(2033,2,{DET:50},'DET','DET');
// Randomized safety: every year/round always yields exactly 30 valid team owners.
let seed=721091;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
for(let n=0;n<250;n++)for(let year=2027;year<=2033;year++){
 const first=shuffle(teams);const fo=t.resolveDraftOwners(year,1,first);if(fo.length!==30||fo.some(x=>!teams.includes(x)))throw new Error(`invalid randomized first ${year}`);
 const second=shuffle(teams);const so=t.resolveDraftOwners(year,2,second);if(so.length!==30||so.some(x=>!teams.includes(x)))throw new Error(`invalid randomized second ${year}`);
}
console.log(JSON.stringify({status:'PASS',cells:ledger.cells.length,statusCounts:byStatus,unresolved,randomizedScenarios:250*7*2,sourceCorrections:['CLE 2031 1st locked at finalized CLE; DEN pending','SAC 2032 2nd locked at finalized CLE; DEN pending','SAC 2027 2nd branch','DET 2028 2nd 56-60 -> PHI','PHX 2029 own origin remains executable separately from unresolved incoming claim','CHA 2030 exact protected swap branch']},null,2));
