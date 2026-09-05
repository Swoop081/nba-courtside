/* NBA Courtside v0.10.2 — robust 2026-27 schedule + real NBA Cup TBD resolver + oversized borderless team picker */
(()=>{
  if(window.__courtsideSeasonHotfixV0102)return;
  window.__courtsideSeasonHotfixV0102=true;

  const SAVE_KEY='nbaCourtsideSeasonModeV1';
  const IDS=['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612742','1610612743','1610612765','1610612744','1610612745','1610612754','1610612746','1610612747','1610612763','1610612748','1610612749','1610612750','1610612740','1610612752','1610612760','1610612753','1610612755','1610612756','1610612757','1610612758','1610612759','1610612761','1610612762','1610612764'];
  const EAST=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const GROUPS={
    WA:['1610612743','1610612745','1610612756','1610612742','1610612762'],
    WB:['1610612760','1610612750','1610612746','1610612740','1610612763'],
    WC:['1610612759','1610612747','1610612757','1610612744','1610612758'],
    EA:['1610612765','1610612761','1610612753','1610612749','1610612751'],
    EB:['1610612752','1610612739','1610612755','1610612748','1610612754'],
    EC:['1610612738','1610612737','1610612766','1610612741','1610612764']
  };
  const TEAM_GROUP=Object.fromEntries(Object.entries(GROUPS).flatMap(([g,ids])=>ids.map(id=>[id,g])));
  const CUP_NIGHTS=new Set(['2026-10-30','2026-11-06','2026-11-13','2026-11-20','2026-11-24','2026-11-25','2026-11-27']);
  const nbaUrl=/cdn\.nba\.com\/static\/json\/staticData\/scheduleLeagueV2(?:_1)?\.json/i;
  const realFetch=window.fetch.bind(window);
  const nativeSet=Storage.prototype.setItem;

  const normDate=raw=>{const s=String(raw||'');const m=s.match(/(20\d\d)-(\d\d)-(\d\d)/);return m?`${m[1]}-${m[2]}-${m[3]}`:''};
  const gameTeams=g=>[String(g?.awayTeam?.teamId||g?.awayTeamId||''),String(g?.homeTeam?.teamId||g?.homeTeamId||'')];
  function feedUsable(data){
    const blocks=data?.leagueSchedule?.gameDates||data?.gameDates||[];let n=0;
    blocks.forEach(b=>(b.games||[]).forEach(g=>{const d=normDate(g.gameDateEst||g.gameDateTimeEst||g.gameDate||b.gameDate),[a,h]=gameTeams(g);if(d>='2026-10-20'&&d<='2027-04-11'&&IDS.includes(a)&&IDS.includes(h)&&a!==h)n++}));
    return n>=1180;
  }

  function rrRounds(ids,roundCount){
    const fixed=ids[0],rest=ids.slice(1),out=[];
    for(let r=0;r<roundCount;r++){
      const row=[fixed,...rest],games=[];
      for(let i=0;i<15;i++){const a=row[i],b=row[29-i],home=(r+i)%2?a:b,away=home===a?b:a;games.push([away,home]);}
      out.push(games);rest.unshift(rest.pop());
    }
    return out;
  }
  function fiveTeamRounds(group){
    const a=[...group,null],out=[];
    for(let r=0;r<5;r++){
      const pairs=[];
      for(let i=0;i<3;i++){const x=a[i],y=a[5-i];if(x&&y){const ix=group.indexOf(x),iy=group.indexOf(y),home=((iy-ix+5)%5===1||(iy-ix+5)%5===2)?x:y,away=home===x?y:x;pairs.push([away,home]);}}
      const bye=a.find(x=>x&&!pairs.some(p=>p.includes(x)));out.push({pairs,bye});a.splice(1,0,a.pop());
    }
    return out;
  }
  function normalDates(n){
    const start=Date.UTC(2026,9,20,12),end=Date.UTC(2027,3,11,12),blocked=new Set([...CUP_NIGHTS,'2026-12-04','2026-12-05','2026-12-06','2026-12-07','2026-12-08','2026-12-09','2026-12-10','2026-12-11']);
    const pool=[];for(let t=start;t<=end;t+=86400000){const d=new Date(t).toISOString().slice(0,10);if(!blocked.has(d))pool.push(d)}
    return Array.from({length:n},(_,i)=>pool[Math.min(pool.length-1,Math.round(i*(pool.length-1)/(n-1)))]);
  }
  function local80Feed(){
    const dates=normalDates(75),games=[];rrRounds(IDS,75).forEach((round,r)=>round.forEach((p,i)=>games.push({id:`CS27-R${String(r+1).padStart(2,'0')}-${i+1}`,date:dates[r],away:p[0],home:p[1],label:'Regular Season'})));
    const groupRounds=Object.fromEntries(Object.entries(GROUPS).map(([k,v])=>[k,fiveTeamRounds(v)]));
    const cupDates=['2026-10-30','2026-11-06','2026-11-13','2026-11-20','2026-11-27'];
    for(let r=0;r<5;r++){
      const byes=[];Object.entries(groupRounds).forEach(([g,rs])=>{rs[r].pairs.forEach((p,i)=>games.push({id:`CUP-GRP-${g}-${r+1}-${i+1}`,date:cupDates[r],away:p[0],home:p[1],label:'Emirates NBA Cup Group Play'}));byes.push(rs[r].bye)});
      for(let i=0;i<3;i++){const away=byes[i*2],home=byes[i*2+1];games.push({id:`CS27-CUPNIGHT-FILL-${r+1}-${i+1}`,date:cupDates[r],away,home,label:'Regular Season'});}
    }
    const blocks=new Map();games.forEach(g=>{if(!blocks.has(g.date))blocks.set(g.date,[]);blocks.get(g.date).push({gameId:g.id,gameDateEst:g.date,gameDateTimeEst:`${g.date}T19:30:00`,gameLabel:g.label,awayTeam:{teamId:g.away},homeTeam:{teamId:g.home}})});
    return {leagueSchedule:{gameDates:[...blocks].sort((a,b)=>a[0].localeCompare(b[0])).map(([gameDate,gs])=>({gameDate,games:gs}))},courtsideFallback:true,courtsideFixedGamesPerTeam:80};
  }

  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:input?.url||'';
    if(!nbaUrl.test(url))return realFetch(input,init);
    try{
      const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),3200);const res=await realFetch(input,{...(init||{}),signal:ctl.signal});clearTimeout(timer);
      if(res.ok){try{if(feedUsable(await res.clone().json()))return res}catch{}}
    }catch{}
    return new Response(JSON.stringify(local80Feed()),{status:200,headers:{'Content-Type':'application/json'}});
  };

  function isCupGroupGame(g){
    const a=String(g.away),h=String(g.home);return !!(CUP_NIGHTS.has(g.date)&&TEAM_GROUP[a]&&TEAM_GROUP[a]===TEAM_GROUP[h]);
  }
  function marginFor(g,res){
    if(Number.isFinite(res?.cupMargin))return Math.abs(res.cupMargin);
    const seed=[...String(g.id)].reduce((n,c)=>(n*33+c.charCodeAt(0))>>>0,2166136261);return 3+(seed%15);
  }
  function groupTable(s,groupId){
    const ids=GROUPS[groupId],rows=Object.fromEntries(ids.map(id=>[id,{id,w:0,l:0,diff:0}]));
    s.schedule.filter(g=>g.cupGroup&&TEAM_GROUP[g.home]===groupId).forEach(g=>{const r=s.results[g.id];if(!r)return;const winner=String(r.winner),loser=winner===String(g.home)?String(g.away):String(g.home),m=marginFor(g,r);if(rows[winner]){rows[winner].w++;rows[winner].diff+=m}if(rows[loser]){rows[loser].l++;rows[loser].diff-=m}});
    const head=(a,b)=>{const g=s.schedule.find(x=>x.cupGroup&&x.home!==x.away&&[String(x.home),String(x.away)].includes(a.id)&&[String(x.home),String(x.away)].includes(b.id));const r=g&&s.results[g.id];if(!r)return 0;return String(r.winner)===a.id?-1:1};
    return Object.values(rows).sort((a,b)=>b.w-a.w||(a.w===b.w?head(a,b):0)||b.diff-a.diff||a.id.localeCompare(b.id));
  }
  const mk=(id,date,away,home,meta={})=>({id,date,away:String(away),home:String(home),official:false,cupTbd:true,...meta});
  function pairCycle(ids,prefix){return ids.map((id,i)=>{const next=ids[(i+1)%ids.length];return mk(`${prefix}-${i+1}`,i%2?'2026-12-10':'2026-12-06',i%2?id:next,i%2?next:id,{cupConsolation:true})});}

  function resolveGroupStage(s){
    const tables=Object.fromEntries(Object.keys(GROUPS).map(g=>[g,groupTable(s,g)]));
    const eastGroups=['EA','EB','EC'],westGroups=['WA','WB','WC'];
    const qualifiers=[];
    function confQual(groups,conf){
      const winners=groups.map(g=>tables[g][0]).sort((a,b)=>b.w-a.w||b.diff-a.diff||a.id.localeCompare(b.id));
      const others=groups.flatMap(g=>tables[g].slice(1)).sort((a,b)=>b.w-a.w||b.diff-a.diff||a.id.localeCompare(b.id));
      const seeds=[winners[0],winners[1],winners[2],others[0]].map((x,i)=>({id:x.id,seed:i+1,conf}));qualifiers.push(...seeds);return seeds;
    }
    const e=confQual(eastGroups,'E'),w=confQual(westGroups,'W');
    const qf=[];[e,w].forEach(seeds=>{qf.push(mk(`cup-qf-${seeds[0].conf}-1`,'2026-12-04',seeds[3].id,seeds[0].id,{cupQuarterfinal:true,conf:seeds[0].conf,seedA:1,seedB:4}));qf.push(mk(`cup-qf-${seeds[0].conf}-2`,'2026-12-05',seeds[2].id,seeds[1].id,{cupQuarterfinal:true,conf:seeds[0].conf,seedA:2,seedB:3}))});
    const qIds=new Set(qualifiers.map(x=>x.id)),eastNon=IDS.filter(id=>EAST.has(id)&&!qIds.has(id)),westNon=IDS.filter(id=>!EAST.has(id)&&!qIds.has(id));
    const nonGames=[...pairCycle(eastNon,'cup-nonqual-E'),...pairCycle(westNon,'cup-nonqual-W')];
    const pending=[mk('cup-stage2-pending-E-1','2026-12-10',e[1].id,e[0].id,{cupPending:true,conf:'E'}),mk('cup-stage2-pending-E-2','2026-12-10',e[3].id,e[2].id,{cupPending:true,conf:'E'}),mk('cup-stage2-pending-W-1','2026-12-10',w[1].id,w[0].id,{cupPending:true,conf:'W'}),mk('cup-stage2-pending-W-2','2026-12-10',w[3].id,w[2].id,{cupPending:true,conf:'W'})];
    s.schedule=s.schedule.filter(g=>!g.cupTbd).concat(qf,nonGames,pending).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
    s.cup={...(s.cup||{}),groupResolved:true,qualifiers,quarterfinalIds:qf.map(g=>g.id),stage2Resolved:false,champion:null};
    s.history?.unshift?.({at:new Date().toISOString(),type:'cup',text:'Emirates NBA Cup Group Play complete. Knockout Round matchups are set.'});
  }
  function resolveAfterQuarterfinals(s){
    const qf=s.schedule.filter(g=>g.cupQuarterfinal),byConf={E:[],W:[]};qf.forEach(g=>{const r=s.results[g.id];if(!r)return;byConf[g.conf].push({g,w:String(r.winner),l:String(r.winner)===String(g.home)?String(g.away):String(g.home)})});if(byConf.E.length!==2||byConf.W.length!==2)return;
    const repl=[];['E','W'].forEach((conf,ci)=>{const x=byConf[conf];repl.push(mk(`cup-sf-${conf}`,ci?'2026-12-09':'2026-12-08',x[1].w,x[0].w,{cupSemifinal:true,conf}));repl.push(mk(`cup-qf-losers-${conf}`,'2026-12-10',x[1].l,x[0].l,{cupQfLoserGame:true,conf}));});
    s.schedule=s.schedule.filter(g=>!g.cupPending).concat(repl).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));s.cup.stage2Resolved=true;s.cup.semifinalIds=repl.filter(g=>g.cupSemifinal).map(g=>g.id);
  }
  function resolveCupFinal(s){
    if(!s.cup?.stage2Resolved||s.cup.final)return;const semis=s.schedule.filter(g=>g.cupSemifinal);if(semis.length!==2||semis.some(g=>!s.results[g.id]))return;const finalists=semis.map(g=>String(s.results[g.id].winner));
    const score=id=>{try{const ps=(window.players||[]).filter(p=>String(p.teamId)===id&&!p.classicTeam);return ps.length?ps.reduce((n,p)=>n+(['scoring','dunks','three','rebounding','passing','blocks','steals'].reduce((a,k)=>a+(p.stats?.[k]||0),0)/7),0)/ps.length:20}catch{return 20}};
    const p=Math.max(.2,Math.min(.8,.5+(score(finalists[0])-score(finalists[1]))/38)),winner=Math.random()<p?finalists[0]:finalists[1];s.cup.final={id:'cup-final-2026',date:'2026-12-11',away:finalists[1],home:finalists[0],winner,countsInRegularSeason:false};s.cup.champion=winner;s.history?.unshift?.({at:new Date().toISOString(),type:'cup',text:'Emirates NBA Cup Championship completed. The Championship does not count toward the 82-game regular-season record.',winner});
  }
  function prepareSave(raw){
    let s;try{s=JSON.parse(raw)}catch{return raw}if(!s||s.season!=='2026-27'||!Array.isArray(s.schedule))return raw;
    s.cup=s.cup||{groupResolved:false,stage2Resolved:false,champion:null};
    s.schedule.forEach(g=>{if(isCupGroupGame(g)){g.cupGroup=true;g.cupTbd=false;g.cupGroupId=TEAM_GROUP[String(g.home)]}if(/^cup-tbd/i.test(String(g.id)))g.cupTbd=true});
    const groupGames=s.schedule.filter(g=>g.cupGroup);if(!s.cup.groupResolved&&groupGames.length>=60&&groupGames.every(g=>s.results?.[g.id]))resolveGroupStage(s);
    if(s.cup.groupResolved&&!s.cup.stage2Resolved)resolveAfterQuarterfinals(s);resolveCupFinal(s);
    return JSON.stringify(s);
  }
  Storage.prototype.setItem=function(k,v){if(k===SAVE_KEY){try{v=prepareSave(v)}catch(e){console.warn('Courtside Cup resolver',e)}}return nativeSet.call(this,k,v)};

  const style=document.createElement('style');style.id='season-mode-hotfix-style-v0102';style.textContent=`
    #seasonTeamGrid.season-team-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;align-items:center!important}
    #seasonTeamGrid .season-team-pick{display:grid!important;place-items:center!important;height:86px!important;min-height:86px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;color:transparent!important}
    #seasonTeamGrid .season-team-pick img{display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;object-fit:contain!important;transform:scale(1.12)!important;transform-origin:center!important}
    #seasonTeamGrid .season-team-pick span,#seasonTeamGrid .season-team-pick strong,#seasonTeamGrid .season-team-pick small{display:none!important}
    #seasonTeamGrid .season-team-pick:focus-visible{outline:2px solid #f7b928!important;outline-offset:2px!important;border-radius:10px!important}
    @media(max-width:430px){#seasonTeamGrid.season-team-grid{gap:7px!important}#seasonTeamGrid .season-team-pick{height:80px!important;min-height:80px!important}#seasonTeamGrid .season-team-pick img{transform:scale(1.16)!important}}
  `;document.head.appendChild(style);

  function cleanPicker(root=document){root.querySelectorAll?.('#seasonTeamGrid .season-team-pick').forEach(btn=>{const img=btn.querySelector('img');if(!img)return;const label=btn.querySelector('strong')?.textContent||img.alt||'NBA team';img.alt=label;btn.setAttribute('aria-label',label);btn.title=label;[...btn.children].forEach(ch=>{if(ch!==img)ch.style.display='none'})})}
  const start=()=>{cleanPicker();new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)cleanPicker(n)}))).observe(document.documentElement,{childList:true,subtree:true})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
