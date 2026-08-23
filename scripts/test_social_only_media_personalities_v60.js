const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),noop=()=>{};
function dummy(){return {innerHTML:'',textContent:'',classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},onclick:null,oninput:null,onchange:null,style:{setProperty:noop,removeProperty:noop},dataset:{},disabled:false,hidden:false,offsetParent:{},appendChild:noop,prepend:noop,insertAdjacentHTML:noop,insertAdjacentElement:noop,setAttribute:noop,removeAttribute:noop,getAttribute:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop,focus:noop,contains:()=>true,scrollIntoView:noop,remove:noop};}
const store={};
const sandbox={console,structuredClone,Date,Math,setTimeout:()=>{},clearTimeout:()=>{},requestAnimationFrame:f=>f(),confirm:()=>true,scrollTo:()=>{},MutationObserver:function(){this.observe=noop},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},sessionStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{activeElement:null,contains:()=>false,addEventListener:noop,documentElement:{style:{setProperty:noop}},head:{appendChild:noop},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},body:{style:{},appendChild:noop,addEventListener:noop}},location:{reload(){},search:''},navigator:{},URLSearchParams};sandbox.window=sandbox;vm.createContext(sandbox);
for(const f of ['data/data-v0.44.js','data/source-certification-v0.44.js','data/future-pick-ledger-v0.44.js','data/schedule-v0.44.js','data/schedule-template-v0.44.js','cba-v0.44.js','data/organizations-v0.44.js','data/staff-careers-v0.44.js','data/g-league-v0.44.js','data/college-draft-v0.44.js','data/contract-market-v0.44.js','data/historical-universes-v0.56.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox,{filename:f});
let code=fs.readFileSync(path.join(root,'app-v0.60.js'),'utf8');
code=code.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`renderView=()=>{};setTop=()=>{};toast=()=>{};persist=()=>{};closeSheet=()=>{};
state=newState();userTeam='TOR';state.userTeam='TOR';state.seasonStarted=true;state.seasonComplete=false;state.phase='regular_season';rebuildPlayerIndex();refreshSeasonConfig();ensureCbaState();ensureFuturePickHorizon();ensureAllRotations();
state.date='2026-10-21';ll();
const v60HeroHtml=String(mediaHero());const v60StatsHtml=String(aroundLeague());const v60NewsHtml=String(leagueNews());const v60StudioHtml=String(studioRoundtable());const v60SocialHtml=String(socialFeed());
const v60StandaloneHtml=v60HeroHtml+v60StatsHtml+v60NewsHtml+v60StudioHtml;
for(const name of ['SCOTT VAN PELT','MALIKA ANDREWS','ERNIE JOHNSON','Kenny Smith','Shaquille O’Neal','Charles Barkley','Shams Charania'])if(v60StandaloneHtml.toLowerCase().includes(name.toLowerCase()))throw new Error('standalone media personality leaked: '+name);
if(!v60StatsHtml.includes('SCORES + PERFORMANCE'))throw new Error('SportsCenter informational label missing');
if(!v60NewsHtml.includes('HEADLINES · SIMULATED COVERAGE'))throw new Error('NBA Today neutral label missing');
if(v60StudioHtml.trim()!=='')throw new Error('standalone studio roundtable still renders');
if(!v60HeroHtml.includes('LEAGUE COVERAGE'))throw new Error('neutral hero label missing');
// Social is intentionally allowed to preserve media personalities when the generated feed contains them.
const home=String(homeView());if(home.includes('bcInside')||home.includes('llInside'))throw new Error('studio roundtable leaked into home');
console.log(JSON.stringify({status:'PASS',neutralHero:true,neutralStats:true,neutralNews:true,roundtableRemoved:true,socialFeedRetained:!!v60SocialHtml,saveSchema:state.schemaVersion||state.schema_version||25},null,2));})();`);
vm.runInContext(code,sandbox,{filename:'app-v0.60-social-only-media-runtime.js',timeout:120000});
