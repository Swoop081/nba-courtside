/* NBA Courtside v0.10.50 — late Season Mode runtime: guaranteed result persistence + broadcast scoreboard + live ticker */
(()=>{
  if(window.__courtsideSeasonRuntimeV01050)return;
  window.__courtsideSeasonRuntimeV01050=true;
  const ACTIVE_KEY='nbaCourtsideSeasonGameActiveV1';
  const RETURN_KEY='nbaCourtsideSeasonReturnPendingV1';
  const SAVE_KEY='nbaCourtsideSeasonModeV1';
  const isSeason=()=>sessionStorage.getItem(ACTIVE_KEY)==='1'||sessionStorage.getItem(RETURN_KEY)==='1';
  const labelMap={scoring:'SCORING',dunks:'DUNKS',three:'3PT',freeThrows:'FREE THROWS',rebounding:'REBOUNDS',passing:'ASSISTS',blocks:'BLOCKS',steals:'STEALS'};
  const safeState=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
  const safeTeams=()=>{try{return [userTeam?.[0]||null,cpuTeam?.[0]||null]}catch{return [null,null]}};
  const logoFor=p=>p?.teamId?`assets/team-logos/current/${p.teamId}.svg`:'';
  const short=p=>p?.teamShort||p?.team||'Team';
  const readSave=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const writeSave=s=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(s));return true}catch{return false}};

  function repairScoreboard(){
    if(!isSeason())return;
    const game=document.getElementById('game');if(!game?.classList.contains('active'))return;
    const board=game.querySelector('.scoreboard');const sides=board?.querySelectorAll('.score-side');
    const s=safeState(),[home,away]=safeTeams();if(!board||!sides||sides.length<2||!home||!away||!s)return;
    const paint=(side,p,score,awaySide)=>{
      const a=p.theme?.a||'#172233',b=p.theme?.b||'#f7b928',c=p.theme?.c||'#080b10';
      side.style.setProperty('--score-primary',a);side.style.setProperty('--score-secondary',b);side.style.setProperty('--score-dark',c);
      side.innerHTML=awaySide
        ?`<div class="score-team away-team"><div class="score-number"><strong id="cpuScore">${score}</strong></div><div class="score-logo-wrap"><img src="${logoFor(p)}" alt="${short(p)}"></div><div class="score-name">${short(p).toUpperCase()}</div></div>`
        :`<div class="score-team"><div class="score-logo-wrap"><img src="${logoFor(p)}" alt="${short(p)}"></div><div class="score-number"><strong id="userScore">${score}</strong></div><div class="score-name">${short(p).toUpperCase()}</div></div>`;
    };
    paint(sides[0],home,s.userScore||0,false);paint(sides[1],away,s.cpuScore||0,true);
  }

  function repairTicker(){
    const s=safeState();const bar=document.getElementById('gameInfoBar');if(!bar||!s||bar.classList.contains('is-transition'))return;
    const strong=bar.querySelector('strong');if(!strong)return;
    strong.textContent=`${s.overtime?'OT':'Q'+s.quarter} ${labelMap[s.category]||'MATCHUP'}`;
  }

  function guaranteeRegularSeasonResult(){
    if(!isSeason())return false;
    const s=readSave(),gs=safeState(),[user,cpu]=safeTeams();
    if(!s||!gs||!user||!cpu||s.phase!=='regular')return false;
    s.results=s.results||{};s.records=s.records||{};s.history=s.history||[];
    const userId=String(s.teamId||user.teamId||''),oppId=String(cpu.teamId||'');
    if(!userId||!oppId)return false;
    const unresolved=(s.schedule||[])
      .filter(g=>!s.results?.[g.id]&&(String(g.home)===userId||String(g.away)===userId))
      .sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.id).localeCompare(String(b.id)));
    let g=unresolved.find(x=>[String(x.home),String(x.away)].includes(oppId))||unresolved[0];
    if(!g||s.results[g.id])return false;
    const won=(+gs.userScore||0)>(+gs.cpuScore||0);
    const winner=won?userId:oppId,loser=won?oppId:userId;
    s.results[g.id]={winner,loser,cardScore:`${+gs.userScore||0}-${+gs.cpuScore||0}`,userPlayed:true,seasonRuntimeSaved:true};
    s.records[userId]=s.records[userId]||{w:0,l:0};s.records[oppId]=s.records[oppId]||{w:0,l:0};
    if(won){s.records[userId].w=(+s.records[userId].w||0)+1;s.records[oppId].l=(+s.records[oppId].l||0)+1;}
    else{s.records[userId].l=(+s.records[userId].l||0)+1;s.records[oppId].w=(+s.records[oppId].w||0)+1;}
    s.history.unshift({at:new Date().toISOString(),type:'game',gameId:g.id,text:`${won?'Win':'Loss'} ${String(g.home)===userId?'vs':'at'} ${short(cpu)}, ${+gs.userScore||0}–${+gs.cpuScore||0}.`});
    return writeSave(s);
  }

  const install=()=>{
    let presentationFinish=null,presentationBegin=null,presentationPlay=null;
    try{presentationFinish=finishGame;presentationBegin=beginQuarter;presentationPlay=playQuarter}catch{}
    if(typeof presentationFinish==='function'&&!presentationFinish.__seasonRuntimeV01050){
      const wrapped=function(){
        if(isSeason()){
          // First let the original Season Mode handler save the game. Then independently
          // guarantee the next unresolved regular-season game is persisted if that handler
          // was bypassed by a later presentation wrapper.
          if(typeof window.__courtsideSeasonFinishGameV01049==='function'){
            try{window.__courtsideSeasonFinishGameV01049.apply(this,arguments);}catch(e){console.error('Season result save failed',e);}
          }
          guaranteeRegularSeasonResult();
          try{const s=safeState();if(s)s.finished=false;}catch{}
        }
        return presentationFinish.apply(this,arguments);
      };
      wrapped.__seasonRuntimeV01050=true;
      try{finishGame=wrapped}catch{};window.finishGame=wrapped;
    }
    if(typeof presentationBegin==='function'&&!presentationBegin.__seasonRuntimeV01050){
      const wrapped=function(){const out=presentationBegin.apply(this,arguments);requestAnimationFrame(()=>{repairScoreboard();repairTicker();});setTimeout(()=>{repairScoreboard();repairTicker();},40);return out;};
      wrapped.__seasonRuntimeV01050=true;try{beginQuarter=wrapped}catch{};window.beginQuarter=wrapped;
    }
    if(typeof presentationPlay==='function'&&!presentationPlay.__seasonRuntimeV01050){
      const wrapped=function(){const out=presentationPlay.apply(this,arguments);requestAnimationFrame(()=>{repairScoreboard();repairTicker();});return out;};
      wrapped.__seasonRuntimeV01050=true;try{playQuarter=wrapped}catch{};window.playQuarter=wrapped;
    }
    repairScoreboard();repairTicker();
    setInterval(()=>{repairScoreboard();repairTicker();},220);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
})();
