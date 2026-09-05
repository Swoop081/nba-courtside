/* NBA Courtside v0.10.16 — Season Rewards: cumulative matchup-margin MVP ladder + History rewards panel */
(()=>{
  if(window.__courtsideSeasonRewardsV01016)return;
  window.__courtsideSeasonRewardsV01016=true;

  const SAVE_KEY='nbaCourtsideSeasonModeV1';
  const LEAGUE_KEY='nbaCourtsideLeagueHistoryV1';
  const ACTIVE_KEY='nbaCourtsideSeasonGameActiveV1';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const write=(key,v)=>localStorage.setItem(key,JSON.stringify(v));
  const pkey=p=>String(p?.playerId||p?.id||p?.name||'player');

  const style=document.createElement('style');
  style.id='season-rewards-style-v01016';
  style.textContent=`
    .season-rewards{border:1px solid rgba(247,185,40,.35);border-radius:18px;background:linear-gradient(180deg,rgba(247,185,40,.11),#0c1118 42%);overflow:hidden;margin-bottom:12px}
    .season-rewards-head{padding:13px 14px 10px;border-bottom:1px solid rgba(255,255,255,.08)}
    .season-rewards-kicker{font-size:9px;font-weight:1000;letter-spacing:.18em;color:#f7b928;text-transform:uppercase}
    .season-rewards-head h3{margin:3px 0 2px;font-size:18px}.season-rewards-head p{margin:0;color:#9aa4b2;font-size:9px;line-height:1.35}
    .mvp-ladder{display:grid}.mvp-row{display:grid;grid-template-columns:30px 1fr auto;align-items:center;gap:8px;padding:9px 11px;border-top:1px solid rgba(255,255,255,.065)}
    .mvp-row:first-child{border-top:0}.mvp-row.leader{background:rgba(247,185,40,.09)}.mvp-rank{font-size:15px;font-weight:1000;color:#7f8998;text-align:center}.mvp-row.leader .mvp-rank{color:#f7b928}
    .mvp-player{min-width:0}.mvp-player strong{display:block;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mvp-player small{display:block;color:#8f99a8;font-size:8px;margin-top:2px;text-transform:uppercase;letter-spacing:.05em}
    .mvp-points{text-align:right}.mvp-points strong{display:block;font-size:19px;line-height:1;color:#fff}.mvp-points small{display:block;color:#f7b928;font-size:7px;font-weight:1000;letter-spacing:.08em;text-transform:uppercase;margin-top:3px}
    .mvp-award{margin:10px 11px 12px;padding:10px 11px;border-radius:12px;background:linear-gradient(135deg,#f7b928,#ffdf69);color:#0a0c0f;display:flex;justify-content:space-between;align-items:center;gap:8px}.mvp-award span{font-size:8px;font-weight:1000;letter-spacing:.14em;text-transform:uppercase}.mvp-award strong{font-size:13px;text-align:right}
    .mvp-empty{padding:16px 14px;color:#9ba5b3;font-size:10px;line-height:1.45}
  `;
  document.head.appendChild(style);

  function ensureRewards(s){
    s.rewards=s.rewards||{};
    s.rewards.mvp=s.rewards.mvp||{scores:{},awarded:null,updatedAt:null};
    s.rewards.mvp.scores=s.rewards.mvp.scores||{};
    return s.rewards.mvp;
  }

  function addGameMargins(s,hist){
    const mvp=ensureRewards(s);
    for(const h of hist||[]){
      if(!h?.user||!Number.isFinite(+h.userPts)||!Number.isFinite(+h.cpuPts))continue;
      if(String(h.user.teamId)!==String(s.teamId))continue;
      const margin=+h.userPts-(+h.cpuPts);
      if(margin<=0)continue;
      const key=pkey(h.user),row=mvp.scores[key]||(mvp.scores[key]={playerId:h.user.playerId||h.user.id||key,name:h.user.name||'Player',teamId:h.user.teamId,total:0,wins:0});
      row.total+=margin;row.wins+=1;row.name=h.user.name||row.name;row.teamId=h.user.teamId||row.teamId;
    }
    mvp.updatedAt=new Date().toISOString();
  }

  function ladder(s){
    const mvp=ensureRewards(s);
    return Object.values(mvp.scores).sort((a,b)=>(b.total||0)-(a.total||0)||(b.wins||0)-(a.wins||0)||String(a.name).localeCompare(String(b.name))).slice(0,5);
  }

  function maybeAward(s){
    const mvp=ensureRewards(s);
    if(!s.completed||mvp.awarded)return;
    const top=ladder(s)[0];if(!top)return;
    mvp.awarded={playerId:top.playerId,name:top.name,total:top.total,wins:top.wins,at:new Date().toISOString()};
    s.history=s.history||[];
    s.history.unshift({at:mvp.awarded.at,type:'reward',text:`${top.name} won Season MVP with a +${top.total} cumulative matchup margin.`,reward:'MVP',playerId:top.playerId,total:top.total});
    const archive=read(LEAGUE_KEY,[]);
    const hit=archive.find(x=>x.season===s.season&&String(x.userTeam)===String(s.teamId));
    if(hit){hit.rewards=hit.rewards||{};hit.rewards.mvp=mvp.awarded;write(LEAGUE_KEY,archive);}
  }

  function rewardsMarkup(s){
    const rows=ladder(s),award=ensureRewards(s).awarded;
    return `<section id="seasonRewardsPanel" class="season-rewards"><div class="season-rewards-head"><div class="season-rewards-kicker">Season Rewards</div><h3>${award?'MVP Award':'MVP Ladder'}</h3><p>Every matchup win adds the winning margin to that player’s season total. Losses and ties add nothing.</p></div>${rows.length?`<div class="mvp-ladder">${rows.map((r,i)=>`<div class="mvp-row ${i===0?'leader':''}"><div class="mvp-rank">${i+1}</div><div class="mvp-player"><strong>${esc(r.name)}</strong><small>${r.wins||0} matchup win${r.wins===1?'':'s'}</small></div><div class="mvp-points"><strong>+${r.total||0}</strong><small>MVP score</small></div></div>`).join('')}</div>`:`<div class="mvp-empty">The MVP ladder will begin after the first Season Mode matchup win.</div>`}${award?`<div class="mvp-award"><span>2026–27 MVP</span><strong>${esc(award.name)} · +${award.total}</strong></div>`:''}</section>`;
  }

  function paintRewards(){
    const content=document.getElementById('seasonContent');
    const active=[...document.querySelectorAll('#seasonTabs .season-tab')].find(b=>b.classList.contains('active'));
    if(!content||!active||active.dataset.tab!=='history'||document.getElementById('seasonRewardsPanel'))return;
    const s=read(SAVE_KEY,null);if(!s)return;
    content.insertAdjacentHTML('afterbegin',rewardsMarkup(s));
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-play-season]'))sessionStorage.setItem(ACTIVE_KEY,'1');
    if(e.target.closest('#seasonTabs [data-tab="history"]'))setTimeout(paintRewards,0);
  },true);

  const originalFinish=window.finishGame;
  if(typeof originalFinish==='function'){
    window.finishGame=function(){
      const active=sessionStorage.getItem(ACTIVE_KEY)==='1';
      const snapshot=active&&typeof state!=='undefined'&&state?.history?state.history.map(h=>({...h})):null;
      const before=read(SAVE_KEY,null);
      const beforeHistory=before?.history?.length||0;
      const out=originalFinish.apply(this,arguments);
      if(active){
        sessionStorage.removeItem(ACTIVE_KEY);
        const s=read(SAVE_KEY,null);
        if(s){
          const changed=(s.history?.length||0)!==beforeHistory||s.completed!==before?.completed;
          if(changed&&snapshot?.length)addGameMargins(s,snapshot);
          maybeAward(s);write(SAVE_KEY,s);
          setTimeout(paintRewards,0);
        }
      }
      return out;
    };
  }

  const start=()=>{
    const content=document.getElementById('seasonContent');
    if(content)new MutationObserver(()=>requestAnimationFrame(paintRewards)).observe(content,{childList:true});
    paintRewards();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,250),{once:true});else setTimeout(start,250);
})();
