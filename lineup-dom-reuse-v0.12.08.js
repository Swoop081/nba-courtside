/* NBA Starting5 reusable matchup rail — synchronous category binding + exact played values. */
(()=>{
  if(window.__starting5LineupDomReuseV01208)return;
  window.__starting5LineupDomReuseV01208=true;

  const LABEL_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const idOf=p=>String(p?.id||p?.playerId||'');
  const rosterKey=()=>{try{return (Array.isArray(userTeam)?userTeam:[]).map(idOf).join('|')}catch{return ''}};
  const history=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};
  const isUsed=p=>{try{return !!state?.usedUser?.has?.(p.id)}catch{return false}};
  const seasonEffective=(p,k)=>{
    const api=window.STARTING5_DYNAMIC_RATINGS;
    try{if(api?.isSeasonGameplay?.()&&api?.getEffectiveStat)return Number(api.getEffectiveStat(p,k))||0}catch{}
    return Number(p?.stats?.[k]??0)||0;
  };
  const playedEntry=p=>{
    const id=idOf(p),a=history();
    for(let i=a.length-1;i>=0;i--){const h=a[i];if(idOf(h?.user)===id)return h}
    return null;
  };

  function syncDynamicBadge(card,p){
    card.querySelector(':scope > .s5-dynamic-rating')?.remove();
    const api=window.STARTING5_DYNAMIC_RATINGS;
    if(!api?.getDelta||!api?.isSeasonGameplay?.())return;
    const d=Number(api.getDelta(p))||0;if(!d)return;
    const badge=document.createElement('div');
    badge.className=`s5-dynamic-rating s5-dynamic-rating-${d<0?'down':'up'}`;
    badge.setAttribute('aria-label',`${d>0?'+':''}${d} all stats`);
    for(let i=0;i<3;i++){const x=document.createElement('i');if(i<Math.abs(d))x.className='active';badge.appendChild(x)}
    card.insertBefore(badge,card.firstChild);
  }

  function syncCard(card,p){
    if(!card||!p)return;
    const played=playedEntry(p),used=!!played||isUsed(p);
    const current=String(state?.category||'');
    const activeKey=played?String(played.category||''):current;
    const playedPts=played?Number(played.userPts):NaN;
    card.classList.toggle('used',used);
    card.dataset.id=p.id;

    for(const row of card.querySelectorAll('.stats .stat')){
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=LABEL_TO_KEY[label];if(!key)continue;
      row.dataset.s5Stat=key;
      row.classList.toggle('active',key===activeKey);
      const b=row.querySelector('.stat-circle b');if(!b)continue;
      if(played&&key===activeKey&&Number.isFinite(playedPts))b.textContent=String(playedPts);
      else if(!played)b.textContent=String(seasonEffective(p,key));
    }
    syncDynamicBadge(card,p);
  }

  function orderedTeam(team){return [...team].sort((a,b)=>Number(isUsed(a))-Number(isUsed(b)))}

  function fastRender(){
    const rail=document.getElementById('lineup');
    let team=[];try{team=Array.isArray(userTeam)?userTeam:[]}catch{}
    if(!rail||!team.length)return false;
    const key=rosterKey(),ordered=orderedTeam(team);
    const cards=[...rail.querySelectorAll(':scope > .player-card')];
    const reusable=rail.dataset.s5RosterKey===key&&cards.length===team.length;
    if(!reusable){
      rail.innerHTML=ordered.map((p,i)=>cardMarkup(p,{activeStat:state?.category||null,used:isUsed(p),eager:i<2})).join('');
      rail.dataset.s5RosterKey=key;
    }
    const byId=new Map([...rail.querySelectorAll(':scope > .player-card')].map(c=>[String(c.dataset.id||''),c]));
    for(const p of ordered){const card=byId.get(String(p.id));if(!card)continue;syncCard(card,p);rail.appendChild(card)}
    return true;
  }

  function install(){
    let fn=null;try{fn=window.renderLineup||eval('renderLineup')}catch{}
    if(typeof fn!=='function'||fn.__s5DomReuseV01208)return false;
    const wrapped=function(){
      const rail=document.getElementById('lineup');
      if(rail){rail.classList.remove('result-open');if(fastRender())return}
      return fn.apply(this,arguments);
    };
    wrapped.__s5DomReuseV01208=true;
    window.renderLineup=wrapped;try{eval('renderLineup=window.renderLineup')}catch{};
    return true;
  }

  install();setTimeout(install,0);setTimeout(install,100);setTimeout(install,300);
  const style=document.createElement('style');style.id='s5-long-session-performance-v01208';
  style.textContent=`.screen:not(.active) .player-card *{animation-play-state:paused!important}.player-card.used .beam,.player-card.used .spark,.player-card.used .foreground-energy{animation-play-state:paused!important}`;
  document.head.appendChild(style);
  window.STARTING5_SYNC_USER_RAIL=fastRender;
})();
