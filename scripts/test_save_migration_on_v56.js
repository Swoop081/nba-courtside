const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),noop=()=>{},dummy=()=>({innerHTML:'',classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},onclick:null,style:{},dataset:{},disabled:false,addEventListener:noop,setAttribute:noop,getAttribute:()=>null,removeAttribute:noop,hasAttribute:()=>false});
function boot(store){
 const ctx={console,structuredClone,Date,Math,URLSearchParams,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:noop,location:{reload:noop,search:''},navigator:{},performance:{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{documentElement:{style:{setProperty:noop}},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},addEventListener:noop,body:{style:{},appendChild(){}}}};ctx.window=ctx;vm.createContext(ctx);
 for(const f of ['data/data.js','data/source-certification.js','data/future-pick-ledger.js','data/schedule.js','data/schedule-template.js','cba.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),ctx,{filename:f});
 let src=fs.readFileSync(root+'/app-v0.56.js','utf8');
 src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`window.__v25={getState:()=>state,loadState,migrateLegacy,persist,supportedSaveKeys,SAVE_KEY,SAVE_SCHEMA};\n})();`);
 vm.runInContext(src,ctx,{filename:'app-save-v25-test.js'});return ctx.__v25;
}
const assert=(x,m)=>{if(!x)throw new Error(m)};
const old={version:18,userTeam:'PHI',seasonYear:2028,date:'2028-01-11',phase:'regular_season',seasonStarted:true,results:{G1:{home:'PHI',away:'BOS'}},transactions:[{type:'TEST'}],birdClock:{'foo':2},teamTenure:{'foo':1},scheduleMode:'official_2026'};
let store={nbaCourtsideSaveV18:JSON.stringify(old),nbaCourtsideTeam:'PHI'};let T=boot(store),s=T.getState();
assert(T.SAVE_KEY==='nbaCourtsideSaveV25'&&T.SAVE_SCHEMA===25,'v25 save identity');
assert(s.version===25&&s.seasonYear===2028&&s.results.G1&&s.birdClock.foo===2,'v18 payload preserved');
assert(s.migratedFrom==='nbaCourtsideSaveV18','migration provenance');
for(const k of ['tradeExceptions','transactionAudit','waiverWire','disabledPlayerExceptions'])assert(Array.isArray(s[k]),k+' array initialized');
for(const k of ['tradeRestrictions','aggregationRestrictions','reacquisitionLocks','waiverHistory','recentTrades','waiverTerminations','cashLedger','twoWayGames','exhibit10','apronAdjustments'])assert(s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k]),k+' object initialized');
T.persist();assert(store.nbaCourtsideSaveV25,'persist writes new key');const round=JSON.parse(store.nbaCourtsideSaveV25);assert(round.version===25&&round.seasonYear===2028&&round.results.G1,'round trip critical state');
// Corrupt newest save must not block fallback to an older healthy save.
store={nbaCourtsideSaveV25:'{not json',nbaCourtsideSaveV18:JSON.stringify(old),nbaCourtsideTeam:'PHI'};T=boot(store);s=T.getState();assert(s.seasonYear===2028&&s.migratedFrom==='nbaCourtsideSaveV18','corrupt newest key fallback');
// Very old minimal saves remain loadable and receive safe defaults.
store={nbaCourtsideSaveV04:JSON.stringify({version:4,userTeam:'PHI',seasonYear:2026,seasonStarted:false}),nbaCourtsideTeam:'PHI'};T=boot(store);s=T.getState();assert(s.version===25&&s.userTeam==='PHI'&&Array.isArray(s.draftAssets)&&s.draftAssets.length===420,'v04 migration');
// Legacy started scaffold is labelled rather than incorrectly claiming official schedule.
store={nbaCourtsideSaveV17:JSON.stringify({version:17,userTeam:'PHI',seasonYear:2026,seasonStarted:true,results:{OLD1:{winner:'PHI'}}}),nbaCourtsideTeam:'PHI'};T=boot(store);s=T.getState();assert(s.scheduleMode==='legacy_scaffold','active legacy schedule boundary');
console.log(JSON.stringify({status:'PASS',saveKey:'nbaCourtsideSaveV25',schema:25,migratedFromV18:true,corruptFallback:true,v04Supported:true,activeLegacyScheduleBoundary:true},null,2));
