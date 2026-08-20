const fs=require('fs'),vm=require('vm');
const root=require('path').resolve(__dirname,'..');
const noop=()=>{};
const dummy=()=>({innerHTML:'',classList:{add:noop,remove:noop,toggle:noop},onclick:null,style:{},dataset:{}});
const store={nbaCourtsideTeam:'TOR'};
const ctx={console,structuredClone,Date,Math,URLSearchParams,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:noop,location:{reload:noop,search:''},navigator:{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{documentElement:{style:{setProperty:noop}},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},body:{style:{},appendChild(){}}}};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data/data.js','data/source-certification.js','data/future-pick-ledger.js','data/schedule.js','data/schedule-template.js','cba.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),ctx,{filename:f});
let src=fs.readFileSync(root+'/app.js','utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`window.__assetTest={
  getState:()=>state,
  initialDraftAssets,
  upgradeDraftAssetsV18,
  certifiedFutureAsset,
  ensureFuturePickHorizon,
  pickAssets,
  protectionLabel,
  stepienLegal,
  firstRoundCount
};\n})();`);
vm.runInContext(src,ctx,{filename:'app-test-v18-assets.js',timeout:120000});
const t=ctx.__assetTest;if(!t)throw new Error('asset test hooks missing');
const st=t.getState();st.seasonYear=2026;
const assets=t.initialDraftAssets();
if(assets.length!==420)throw new Error('expected 420 certified origin cells, got '+assets.length);
const locked=assets.filter(x=>x.tradeable===false);
if(locked.length!==223)throw new Error('expected 223 source-locked/complex/frozen cells, got '+locked.length);
for(const x of locked){
  const cell=(ctx.NBA_COURTSIDE_FUTURE_PICKS.cells||[]).find(c=>c.year===x.year&&c.round===x.round&&c.origin===x.origin);
  if(!cell)throw new Error('missing source cell '+x.id);
  if(cell.tradeable!==false)throw new Error('locked app asset is not locked in source '+x.id);
}
const key=(origin,year,round=1)=>assets.find(x=>x.origin===origin&&x.year===year&&x.round===round);
for(const [o,y,owner] of [['ATL',2027,'SAS'],['NYK',2027,'BKN'],['PHX',2027,'HOU'],['NYK',2029,'BKN'],['TOR',2031,'LAC']]){
  const x=key(o,y);if(!x)throw new Error(`missing ${o} ${y}`);if(x.owner!==owner)throw new Error(`${o} ${y} owner ${x.owner}, expected ${owner}`);
}
for(const [o,max,label] of [['DAL',2,'TOP-2 PROTECTED'],['LAL',4,'TOP-4 PROTECTED'],['MIA',14,'TOP-14 PROTECTED']]){
  const x=key(o,2027);if(!x?.protection||x.protection.max!==max)throw new Error(`${o} 2027 protection incorrect`);if(t.protectionLabel(x)!==label)throw new Error(`${o} label ${t.protectionLabel(x)}`);
}
// Source-locked assets must never appear in the tradeable-only picker for their current owner.
st.draftAssets=assets.map(x=>({...x}));
const sampleLocked=st.draftAssets.find(x=>x.tradeable===false&&x.owner);
if(!sampleLocked)throw new Error('no locked sample');
const ownerTradeable=t.pickAssets(sampleLocked.owner,{tradeableOnly:true});
if(ownerTradeable.some(x=>x.id===sampleLocked.id))throw new Error('source-locked asset leaked into tradeable picker: '+sampleLocked.id);
// Migration: an unmodified legacy origin owner is corrected to the certified current owner.
const legacy=assets.map(x=>({...x}));
const atl=legacy.find(x=>x.origin==='ATL'&&x.year===2027&&x.round===1);atl.owner='ATL';
let upgraded=t.upgradeDraftAssetsV18(legacy);
if(upgraded.find(x=>x.id===atl.id).owner!=='SAS')throw new Error('certified owner did not repair unmodified ATL legacy asset');
// Migration: a user trade to a third franchise must not be overwritten by certification.
const legacyTraded=assets.map(x=>({...x}));
const nyk=legacyTraded.find(x=>x.origin==='NYK'&&x.year===2029&&x.round===1);nyk.owner='TOR';
upgraded=t.upgradeDraftAssetsV18(legacyTraded);
if(upgraded.find(x=>x.id===nyk.id).owner!=='TOR')throw new Error('user-modified third-team owner was overwritten');
// Stepien smoke: find consecutive future years where one club owns exactly one first in each, then try sending both.
st.draftAssets=assets.map(x=>({...x}));
let stepienCase=null;
const teamAbbrs=ctx.NBA_COURTSIDE_DATA.league.teams.map(x=>x.abbr);
for(const a of teamAbbrs){
  for(let y=2027;y<=2032;y++){
    const p1=st.draftAssets.filter(x=>x.owner===a&&x.year===y&&x.round===1);
    const p2=st.draftAssets.filter(x=>x.owner===a&&x.year===y+1&&x.round===1);
    if(p1.length===1&&p2.length===1){stepienCase={a,y,picks:[p1[0],p2[0]]};break}
  }
  if(stepienCase)break;
}
if(!stepienCase)throw new Error('could not construct Stepien smoke case');
const step=t.stepienLegal(stepienCase.a,stepienCase.picks);
if(step.ok)throw new Error(`Stepien failed to block consecutive firsts for ${stepienCase.a} ${stepienCase.y}/${stepienCase.y+1}`);
console.log(JSON.stringify({
  version:st.version,
  sourceCells:assets.length,
  lockedCells:locked.length,
  tradeableCells:assets.length-locked.length,
  lockedSample:sampleLocked.id,
  ownerRepair:'ATL 2027 -> SAS',
  userTradePreserved:'NYK 2029 -> TOR',
  stepienBlocked:`${stepienCase.a} ${stepienCase.y}/${stepienCase.y+1}`,
  keyOwners:{ATL2027:key('ATL',2027).owner,NYK2027:key('NYK',2027).owner,PHX2027:key('PHX',2027).owner,NYK2029:key('NYK',2029).owner,TOR2031:key('TOR',2031).owner}
},null,2));
