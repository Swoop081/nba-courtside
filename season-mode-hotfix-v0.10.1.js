/* NBA Courtside v0.10.1 — Season Mode loading fallback + compact logo-only team picker */
(()=>{
  if(window.__courtsideSeasonHotfixV0101)return;
  window.__courtsideSeasonHotfixV0101=true;

  const CURRENT_IDS=['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612742','1610612743','1610612765','1610612744','1610612745','1610612754','1610612746','1610612747','1610612763','1610612748','1610612749','1610612750','1610612740','1610612752','1610612760','1610612753','1610612755','1610612756','1610612757','1610612758','1610612759','1610612761','1610612762','1610612764'];
  const nbaUrl=/cdn\.nba\.com\/static\/json\/staticData\/scheduleLeagueV2(?:_1)?\.json/i;
  const realFetch=window.fetch.bind(window);

  function isoDates(count){
    const start=new Date('2026-10-20T12:00:00Z'),end=new Date('2027-04-11T12:00:00Z'),span=end-start;
    return Array.from({length:count},(_,i)=>new Date(start+(span*i/(count-1))).toISOString().slice(0,10));
  }
  function roundRobin(){
    const a=[...CURRENT_IDS],fixed=a[0],rest=a.slice(1),rounds=[];
    for(let r=0;r<29;r++){
      const row=[fixed,...rest],games=[];
      for(let i=0;i<15;i++)games.push([row[i],row[29-i]]);
      rounds.push(games);
      rest.unshift(rest.pop());
    }
    return rounds;
  }
  function localLeagueFeed(){
    const base=roundRobin(),rounds=[];
    base.forEach((g,r)=>rounds.push(g.map((p,i)=>((r+i)%2?p:[p[1],p[0]]))));
    base.forEach((g,r)=>rounds.push(g.map(p=>[p[1],p[0]])));
    base.slice(0,24).forEach((g,r)=>rounds.push(g.map((p,i)=>((r+i)%2?[p[1],p[0]]:p))));
    const dates=isoDates(82),gameDates=rounds.map((games,r)=>({gameDate:dates[r],games:games.map((p,i)=>({
      gameId:`CS27-${String(r+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`,
      gameDateEst:dates[r],gameDateTimeEst:`${dates[r]}T19:30:00`,gameLabel:'Regular Season',
      awayTeam:{teamId:p[0]},homeTeam:{teamId:p[1]}
    }))}));
    return {leagueSchedule:{gameDates},courtsideFallback:true};
  }

  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:input?.url||'';
    if(!nbaUrl.test(url))return realFetch(input,init);
    try{
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),2500);
      const opts={...(init||{}),signal:controller.signal};
      const res=await realFetch(input,opts);clearTimeout(timer);
      if(res.ok)return res;
    }catch{}
    const body=JSON.stringify(localLeagueFeed());
    return new Response(body,{status:200,headers:{'Content-Type':'application/json'}});
  };

  const style=document.createElement('style');
  style.id='season-mode-hotfix-style-v0101';
  style.textContent=`
    #seasonTeamGrid.season-team-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}
    #seasonTeamGrid .season-team-pick{display:grid!important;place-items:center!important;min-height:82px!important;height:82px!important;padding:8px!important;border-radius:16px!important}
    #seasonTeamGrid .season-team-pick img{width:58px!important;height:58px!important;margin:0!important;object-fit:contain!important}
    #seasonTeamGrid .season-team-pick span{display:none!important}
    @media(max-width:430px){#seasonTeamGrid.season-team-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}#seasonTeamGrid .season-team-pick{height:76px!important;min-height:76px!important;padding:7px!important}#seasonTeamGrid .season-team-pick img{width:54px!important;height:54px!important}}
  `;
  document.head.appendChild(style);

  function compactPicker(root=document){
    root.querySelectorAll?.('#seasonTeamGrid .season-team-pick').forEach(btn=>{
      const img=btn.querySelector('img');if(!img)return;
      const label=btn.querySelector('strong')?.textContent||img.alt||'NBA team';
      img.alt=label;btn.setAttribute('aria-label',label);btn.title=label;
      [...btn.children].forEach(ch=>{if(ch!==img)ch.style.display='none'});
    });
  }
  const start=()=>{
    compactPicker();
    new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){compactPicker(n);if(n.matches?.('.season-team-pick'))compactPicker(n.parentElement||document)}}))).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
