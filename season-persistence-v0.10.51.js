/* NBA Courtside v0.10.51 — exact active Season game persistence */
(()=>{
  if(window.__courtsideSeasonPersistenceV01051)return;
  window.__courtsideSeasonPersistenceV01051=true;

  const SAVE_KEY='nbaCourtsideSeasonModeV1';
  const ACTIVE_DESC_KEY='nbaCourtsideSeasonActiveDescriptorV2';
  const ACTIVE_KEY='nbaCourtsideSeasonGameActiveV1';
  const RETURN_KEY='nbaCourtsideSeasonReturnPendingV1';

  const read=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const gameState=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
  const teams=()=>{try{return [userTeam?.[0]||null,cpuTeam?.[0]||null]}catch{return [null,null]}};
  const short=p=>p?.teamShort||p?.team||'Team';

  function nextDescriptor(){
    const s=read(SAVE_KEY);if(!s||s.phase!=='regular')return null;
    const g=(s.schedule||[]).filter(g=>!s.results?.[g.id]&&(String(g.home)===String(s.teamId)||String(g.away)===String(s.teamId)))
      .sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.id).localeCompare(String(b.id)))[0];
    if(!g)return null;
    const opp=String(g.home)===String(s.teamId)?g.away:g.home;
    return {gameId:g.id,userId:s.teamId,oppId:opp,home:g.home,away:g.away,date:g.date||'',capturedAt:Date.now()};
  }

  function captureActiveGame(){
    const d=nextDescriptor();if(!d)return;
    sessionStorage.setItem(ACTIVE_DESC_KEY,JSON.stringify(d));
    sessionStorage.setItem(ACTIVE_KEY,'1');
    sessionStorage.setItem(RETURN_KEY,'1');
  }

  function persistExactResult(){
    let d=null;try{d=JSON.parse(sessionStorage.getItem(ACTIVE_DESC_KEY)||'null')}catch{}
    const s=read(SAVE_KEY),gs=gameState(),[u,c]=teams();
    if(!d||!s||!gs||!u||!c||s.phase!=='regular')return false;
    s.results=s.results||{};s.records=s.records||{};s.history=s.history||[];
    if(s.results[d.gameId])return true;
    const g=(s.schedule||[]).find(x=>String(x.id)===String(d.gameId));if(!g)return false;
    const userId=String(d.userId),oppId=String(d.oppId);
    const us=+gs.userScore||0,cs=+gs.cpuScore||0;
    if(us===cs)return false;
    const won=us>cs,winner=won?userId:oppId,loser=won?oppId:userId;
    s.results[g.id]={winner,loser,cardScore:`${us}-${cs}`,userPlayed:true,persistedBy:'v0.10.51'};
    s.records[userId]=s.records[userId]||{w:0,l:0};
    s.records[oppId]=s.records[oppId]||{w:0,l:0};
    if(won){s.records[userId].w=(+s.records[userId].w||0)+1;s.records[oppId].l=(+s.records[oppId].l||0)+1;}
    else{s.records[userId].l=(+s.records[userId].l||0)+1;s.records[oppId].w=(+s.records[oppId].w||0)+1;}
    s.history.unshift({at:new Date().toISOString(),type:'game',gameId:g.id,text:`${won?'Win':'Loss'} ${String(g.home)===userId?'vs':'at'} ${short(c)}, ${us}–${cs}.`});
    write(SAVE_KEY,s);
    return true;
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-play-season],.season-play-btn'))captureActiveGame();
    if(e.target.closest('#compactPlayAgain,#playAgainBtn')){
      if(sessionStorage.getItem(RETURN_KEY)==='1'){
        persistExactResult();
        sessionStorage.removeItem(ACTIVE_DESC_KEY);
      }
    }
  },true);

  const observer=new MutationObserver(()=>{
    const final=document.getElementById('final');
    if(final?.classList.contains('active')&&sessionStorage.getItem(RETURN_KEY)==='1')persistExactResult();
  });
  const start=()=>observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
