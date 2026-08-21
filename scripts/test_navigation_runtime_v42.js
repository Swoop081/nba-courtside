const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
let src=read('app-v0.42.js');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`window.__v42={
 getState:()=>state,setUserTeam:a=>{userTeam=a;state.userTeam=a;},init:()=>{ll();playerRelationsV36();staff38();health40();gl34();college35();contractMarketV39();},
 actions:v42ActionItems,blocking:v42BlockingActions,search:v42SearchIndex,teamHub:v42TeamHub,txHub:v42TransactionsHub,more:v42MoreView,primary:v42PrimaryFor,ui:ui42,ll,
 setSeason:(date='2027-01-12')=>{state.date=date;state.phase='regular_season';state.seasonYear=2026;state.seasonStarted=true;state.seasonComplete=false;refreshSeasonConfig();},players:()=>players
};\n})();`)
.replace(/function setTop\(\)\{[^\n]*\}/,'function setTop(){}')
.replace(/function renderView\(\)\{[^\n]*\}/,'function renderView(){}')
.replace(/function toast\(text\)\{[^\n]*\}/,'function toast(){}');
function cls(init=[]){const s=new Set(init);return {add(...x){x.forEach(v=>s.add(v))},remove(...x){x.forEach(v=>s.delete(v))},contains:v=>s.has(v),toggle(){return false}}}
function el(){return {innerHTML:'',textContent:'',value:'',dataset:{},style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},contains(){return false},toggle(){return false}},onclick:null,hidden:false,disabled:false,setAttribute(){},removeAttribute(){},getAttribute(){return null},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},focus(){},contains(){return true},appendChild(){},insertAdjacentHTML(){},offsetParent:{}}}
const store={nbaCourtsideTeam:'BOS'};
const document={documentElement:{style:{setProperty(){}}},head:{appendChild(){}},body:el(),activeElement:el(),querySelector(){return null},querySelectorAll(){return[]},getElementById(){return null},createElement(){return el()},addEventListener(){},contains(){return true}};
const ctx={console,structuredClone,Date,URLSearchParams,Math,document,location:{search:'',reload(){}},navigator:{},scrollTo(){},confirm:()=>true,setTimeout:f=>f(),clearTimeout(){},requestAnimationFrame:f=>f(),MutationObserver:function(){this.observe=()=>{}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},sessionStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},window:{}};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data/data-v0.42.js','data/source-certification-v0.42.js','data/future-pick-ledger-v0.42.js','data/schedule-v0.42.js','data/schedule-template-v0.42.js','cba-v0.42.js','data/organizations-v0.42.js','data/staff-careers-v0.42.js','data/g-league-v0.42.js','data/college-draft-v0.42.js','data/contract-market-v0.42.js'])vm.runInContext(read(f),ctx,{filename:f});
vm.runInContext(src,ctx,{filename:'app-v0.42.js'});const t=ctx.__v42;if(!t)throw new Error('v42 hooks missing');
t.setUserTeam('BOS');t.setSeason();t.init();
if(t.ui().version!==42)throw new Error('ui42 migration');
if(t.primary('medical')!=='team'||t.primary('trade')!=='transactions'||t.primary('college')!=='league')throw new Error('primary world mapping');
const search=t.search('tatum');if(!search.some(x=>x.type==='PLAYER'&&x.name==='Jayson Tatum'))throw new Error('player search failed');
const prospect=t.search('stokes');if(!prospect.some(x=>x.type==='PROSPECT'))throw new Error('prospect search failed');
const staff=t.search('mazzulla');if(!staff.some(x=>x.type==='STAFF'))throw new Error('staff search failed');
const team=t.search('celtics');if(!team.some(x=>x.type==='TEAM'&&x.id==='BOS'))throw new Error('team search failed');
if(!t.teamHub().includes('TEAM WORKSPACE')||!t.teamHub().includes('Player Relations')||!t.teamHub().includes('Health + Performance'))throw new Error('team workspace incomplete');
if(!t.txHub().includes('TRANSACTIONS.')||!t.txHub().includes('Trade Center')||!t.txHub().includes('Free Agency Live'))throw new Error('transactions workspace incomplete');
const L=t.ll(),bos=t.players().find(p=>p.team==='BOS'),ny=t.players().find(p=>p.team==='NYK');
L.incomingTrades.push({id:'T42',status:'pending',from:'NYK',to:'BOS',user_player_id:bos.id,cpu_player_id:ny.id});
const actions=t.actions();if(!actions.some(x=>x.kind==='TRADE'&&x.blocking))throw new Error('formal trade not unified into Action Center');
if(t.blocking().length<1)throw new Error('blocking queue empty');
if(!t.more().includes('GLOBAL SEARCH'))throw new Error('More/search view missing');
console.log(JSON.stringify({status:'PASS',release:'v0.42',searchTypes:[...new Set([...search,...prospect,...staff,...team].map(x=>x.type))],blocking:t.blocking().length,teamWorkspace:true,transactionsWorkspace:true},null,2));
