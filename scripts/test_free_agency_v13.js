const fs=require('fs'),vm=require('vm');
const root='/mnt/data/NBA-Courtside-Postseason-v0.14';
const data=fs.readFileSync(root+'/data/data.js','utf8'),sched=fs.readFileSync(root+'/data/schedule.js','utf8'),cba=fs.readFileSync(root+'/cba.js','utf8');
let src=fs.readFileSync(root+'/app.js','utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`window.__test={
 getState:()=>state,getPlayers:()=>players,refreshSeasonConfig,currentTeam,currentStatus,waivePlayer,startFreeAgencyPeriod,faEnsure,faPreferenceProfile,faOfferScore,faAddOffer,faTopOffers,faResolvePlayer,faResolveMatch,advanceFreeAgencyDay,faCpuOfferFor,faRightsRecord,rightsFor,chooseSigningRoute,marketAsk,capHit,freeAgents,overall
};\n})();`);
const noop=()=>{};const store={nbaCourtsideTeam:'DET'};
const dummy=()=>({innerHTML:'',textContent:'',onclick:null,style:{setProperty:noop},dataset:{},classList:{add:noop,remove:noop,toggle:noop},appendChild:noop,remove:noop});const ctx={console,structuredClone,Date,setTimeout:(f)=>f(),confirm:()=>true,scrollTo:noop,location:{reload:noop},window:{},document:{documentElement:{style:{setProperty:noop}},querySelector:()=>dummy(),querySelectorAll:()=>[],getElementById:()=>dummy(),createElement:()=>dummy(),body:{appendChild:noop,style:{}}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},Math};ctx.window=ctx;
vm.createContext(ctx);vm.runInContext(data,ctx);vm.runInContext(sched,ctx);vm.runInContext(cba,ctx);vm.runInContext(src,ctx);
const t=ctx.__test,st=t.getState(),P=t.getPlayers();t.refreshSeasonConfig();
if(st.version!==14)throw new Error('v14 state missing');
st.phase='free_agency';st.date='2026-07-01';st.freeAgency=null;
const fa=t.startFreeAgencyPeriod();
if(!fa||fa.day!==1||fa.complete)throw new Error('FA period did not initialize');
const duren=P.find(p=>p.name==='Jalen Duren');if(!duren)throw new Error('Duren missing');
const rights=t.faRightsRecord(duren);if(!rights||rights.type!=='RFA'||rights.team!=='DET')throw new Error('RFA rights missing');
const pref=t.faPreferenceProfile(duren);if(pref.priorities.length!==3)throw new Error('preference profile missing');
// Make sure an outside RFA offer can only use cap space.
st.otherCap.BKN=(st.otherCap.BKN||0)-80000000;let outside=null;for(const a of ['BKN','ORL','CHA','UTA','WAS']){const o=t.faCpuOfferFor(duren,a,4);if(o){outside=o;break}}
if(outside && outside.route!=='cap_room')throw new Error('outside RFA offer did not use cap room');
// Test user-rights match window deterministically by adding a legal outside offer from a team with room.
if(!outside){
 for(const a of ['ORL','BKN','CHA','UTA','WAS','SAS']){
   const room=Math.max(0,164961000-t.capHit(a));
   if(room>10000000){outside=t.faAddOffer(duren,a,{years:3,firstSalary:Math.min(room,12000000),lastOption:'guaranteed',route:{id:'cap_room',label:'CAP SPACE',max:room,years:4},source:'cpu'});if(outside)break}
 }
}
if(!outside)throw new Error('could not construct outside RFA offer');
// Remove any stronger pending offers so this accepted offer triggers user's match rights.
for(const o of st.freeAgency.offers[duren.id]||[])if(o.id!==outside.id)o.status='lost';
if(!t.faResolvePlayer(duren,true))throw new Error('forced RFA decision did not resolve');
const match=st.freeAgency.rfaMatches[duren.id];if(!match||match.status!=='pending')throw new Error('user RFA match window missing');
t.faResolveMatch(duren,'match');if(t.currentTeam(duren)!=='DET')throw new Error('RFA match did not retain player');
// Test that competitive scoring can prefer fit over pure money.
const testPlayer=P.find(p=>p.name==='LeBron James');
if(t.currentTeam(testPlayer)!=='PHI')throw new Error('LeBron baseline unexpected');
t.waivePlayer(testPlayer,'PHI',{cpu:true});
st.freeAgentRights[testPlayer.id]={team:'PHI',type:'UFA',level:'bird',last_salary:10000000,cap_hold:0,renounced:false};
const ask=t.marketAsk(testPlayer);
const a={id:'a',player_id:testPlayer.id,team:'DET',years:2,firstSalary:Math.round(ask*1.04),lastOption:'guaranteed',route:'cap_room',status:'pending'};
const b={id:'b',player_id:testPlayer.id,team:'BOS',years:2,firstSalary:Math.round(ask*.98),lastOption:'guaranteed',route:'cap_room',status:'pending'};
const sa=t.faOfferScore(testPlayer,a),sb=t.faOfferScore(testPlayer,b);
if(!Number.isFinite(sa.score)||!Number.isFinite(sb.score))throw new Error('offer scoring failed');
// Advance full main wave on a clean fresh period; it must terminate and store decisions.
st.freeAgency=null;st.phase='free_agency';t.startFreeAgencyPeriod();for(let i=0;i<8&&!st.freeAgency.complete;i++)t.advanceFreeAgencyDay();
if(!st.freeAgency.complete||st.freeAgency.day!==7)throw new Error('main wave did not complete');
console.log(JSON.stringify({version:st.version,day:st.freeAgency.day,complete:st.freeAgency.complete,decisions:st.freeAgency.decisions.length,durenMatchedTo:t.currentTeam(duren),preferenceTop3:pref.priorities,offerScores:{detroit:+sa.score.toFixed(1),boston:+sb.score.toFixed(1)},status:'FREE AGENCY v0.13 PASS'},null,2));
