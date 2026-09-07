/* NBA Starting5 v0.12.07 — reusable matchup rail with unused cards first and played cards moved to the end. */
(()=>{
  if(window.__starting5LineupDomReuseV01207)return;
  window.__starting5LineupDomReuseV01207=true;

  const statKeys=()=>{try{return Array.isArray(STAT_KEYS)?STAT_KEYS:['scoring','dunks','three','freeThrows','rebounding','passing','blocks','steals']}catch{return ['scoring','dunks','three','freeThrows','rebounding','passing','blocks','steals']}};
  const rosterKey=()=>{try{return (Array.isArray(userTeam)?userTeam:[]).map(p=>String(p?.id||p?.playerId||p?.name||'')).join('|')}catch{return ''}};
  const isUsed=p=>{try{return !!state?.usedUser?.has?.(p.id)}catch{return false}};

  function syncDynamicBadge(card,p){
    card.querySelector(':scope > .s5-dynamic-rating')?.remove();
    const api=window.STARTING5_DYNAMIC_RATINGS;
    if(!api||typeof api.getDelta!=='function')return;
    if(typeof api.isSeasonGameplay==='function'&&!api.isSeasonGameplay())return;
    const d=Number(api.getDelta(p))||0;if(!d)return;
    const badge=document.createElement('div');
    badge.className=`s5-dynamic-rating s5-dynamic-rating-${d<0?'down':'up'}`;
    badge.setAttribute('aria-label',`${d>0?'+':''}${d} all stats`);
    for(let i=0;i<3;i++){const x=document.createElement('i');if(i<Math.abs(d))x.className='active';badge.appendChild(x)}
    card.insertBefore(badge,card.firstChild);
  }

  function syncCard(card,p){
    if(!card||!p)return;
    const used=isUsed(p);
    card.classList.toggle('used',used);
    card.dataset.id=p.id;
    const keys=statKeys(),stats=[...card.querySelectorAll('.stats .stat')];
    keys.forEach((k,i)=>{
      const row=stats[i];if(!row)return;
      let active=false;try{active=state?.category===k}catch{}
      row.classList.toggle('active',active);
      const b=row.querySelector('.stat-circle b');if(b)b.textContent=String(p?.stats?.[k]??0);
    });
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
      return true;
    }
    const byId=new Map(cards.map(c=>[String(c.dataset.id||''),c]));
    for(const p of ordered){
      const card=byId.get(String(p.id));
      if(!card)continue;
      syncCard(card,p);
      rail.appendChild(card);
    }
    return true;
  }

  function install(){
    let fn=null;try{fn=window.renderLineup||eval('renderLineup')}catch{}
    if(typeof fn!=='function'||fn.__s5DomReuseV01207)return false;
    const wrapped=function(){
      const rail=document.getElementById('lineup');
      if(rail){rail.classList.remove('result-open');if(fastRender())return}
      return fn.apply(this,arguments);
    };
    wrapped.__s5DomReuseV01207=true;
    window.renderLineup=wrapped;try{eval('renderLineup=window.renderLineup')}catch{}
    return true;
  }

  install();setTimeout(install,0);setTimeout(install,100);setTimeout(install,300);
  const style=document.createElement('style');style.id='s5-long-session-performance-v01207';
  style.textContent=`.screen:not(.active) .player-card *{animation-play-state:paused!important}.player-card.used .beam,.player-card.used .spark,.player-card.used .foreground-energy{animation-play-state:paused!important}`;
  document.head.appendChild(style);
})();
