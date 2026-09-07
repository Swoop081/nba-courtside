/* NBA Starting5 v0.13.0-dev.2 — single authoritative gameplay core rebuild.
   Owns matchup categories, card interaction, opponent rail, effective stats, CPU choice,
   scoring, history, quarter flow, overtime and final handoff. No polling and no gameplay wrappers. */
(()=>{
  if(window.__starting5GameplayCoreV01300)return;
  window.__starting5GameplayCoreV01300=true;

  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const LABELS={scoring:'Scoring',dunks:'Dunking',three:'3PT',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
  const CARD_KEYS={scoring:'SCO',dunks:'DNK',three:'3PT',rebounding:'REB',passing:'PAS',blocks:'BLK',steals:'STL'};
  const id=p=>String(p?.id||p?.playerId||'');
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const seasonActive=()=>{try{return !!dyn()?.isSeasonGameplay?.()}catch{return false}};
  const base=(p,k)=>Number(p?.stats?.[k]??0)||0;
  const effective=(p,k)=>{if(!p||!k)return 0;try{if(seasonActive()&&dyn()?.getEffectiveStat)return Number(dyn().getEffectiveStat(p,k))||0}catch{}return base(p,k)};
  const delta=p=>{try{return seasonActive()?Number(dyn()?.getDelta?.(p)||0):0}catch{return 0}};
  const isUsed=(p,side)=>{try{return side==='cpu'?state.usedCpu.has(p.id):state.usedUser.has(p.id)}catch{return false}};
  const hist=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};
  const playedFor=(p,side)=>{const key=id(p);for(let i=hist().length-1;i>=0;i--){const h=hist()[i],q=side==='cpu'?h?.cpu:h?.user;if(id(q)===key)return h}return null};
  const emit=(name,detail={})=>{try{window.dispatchEvent(new CustomEvent(name,{detail}))}catch{}};

  let busy=false,pendingCpu=null,transitionTimer=0;

  function ensureNav(){
    const rail=document.getElementById('lineup');if(!rail)return;
    let prev=document.getElementById('s5LineupPrev'),next=document.getElementById('s5LineupNext');
    if(!prev){prev=document.createElement('button');prev.id='s5LineupPrev';prev.type='button';prev.className='s5-rail-arrow s5-rail-prev';prev.textContent='‹';rail.insertAdjacentElement('beforebegin',prev)}
    if(!next){next=document.createElement('button');next.id='s5LineupNext';next.type='button';next.className='s5-rail-arrow s5-rail-next';next.textContent='›';rail.insertAdjacentElement('afterend',next)}
    const move=d=>rail.scrollBy({left:d*Math.max(rail.clientWidth*.72,180),behavior:'smooth'});prev.onclick=()=>move(-1);next.onclick=()=>move(1);prev.hidden=false;next.hidden=false;
  }
  function ensureCpuStage(){
    const rail=document.getElementById('lineup');if(!rail)return null;let stage=document.getElementById('s5CpuChoiceStage');
    if(!stage){stage=document.createElement('section');stage.id='s5CpuChoiceStage';stage.className='s5-cpu-choice-stage';stage.innerHTML='<div class="s5-cpu-choice-ticker">WAITING FOR PLAYER CHOICE</div><div class="s5-cpu-choice-card"></div>';const after=document.getElementById('s5LineupNext')||rail;after.insertAdjacentElement('afterend',stage)}return stage;
  }
  function ratingIndicator(d){
    if(!d)return '';
    const n=Math.min(3,Math.abs(Math.trunc(d))),dir=d>0?'up':'down';
    return `<span class="s5-dynamic-rating s5-dynamic-rating-${dir}" aria-label="${d>0?'up':'down'} ${n}">${[1,2,3].map(i=>`<i class="${i<=n?'active':''}"></i>`).join('')}</span>`;
  }
  function paintCardValues(card,p,played,side){
    if(!card||!p)return;const labels={};Object.entries(CARD_KEYS).forEach(([k,v])=>labels[v]=k);
    card.querySelectorAll('.stats .stat').forEach(row=>{const lab=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase(),k=labels[lab];if(!k)return;const out=row.querySelector('.stat-circle b');if(!out)return;let value=effective(p,k);if(played&&played.category===k)value=Number(side==='cpu'?played.cpuPts:played.userPts)||0;out.textContent=String(value)});
    card.querySelectorAll('.stats .stat').forEach(row=>{const lab=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();row.classList.toggle('active',lab===CARD_KEYS[played?.category||state?.category])});
    card.querySelector(':scope>.s5-dynamic-value')?.remove();card.querySelector(':scope>.s5-dynamic-rating')?.remove();
    const d=delta(p),html=ratingIndicator(d);if(html)card.insertAdjacentHTML('beforeend',html);
  }
  function makeCard(p,side,eager=false){const played=playedFor(p,side),used=!!played||isUsed(p,side),active=played?.category||state?.category||null,t=document.createElement('template');t.innerHTML=cardMarkup(p,{activeStat:active,used,eager}).trim();const card=t.content.firstElementChild;if(!card)return '';paintCardValues(card,p,played,side);if(used)card.classList.add('used');return card.outerHTML}
  function renderLineup(){const rail=document.getElementById('lineup');if(!rail||!Array.isArray(userTeam)||!state)return;ensureNav();rail.classList.toggle('result-open',busy&&!!hist().length);const available=userTeam.filter(p=>!isUsed(p,'user')),used=userTeam.filter(p=>isUsed(p,'user')),ordered=[...available,...used];rail.innerHTML=ordered.map((p,i)=>makeCard(p,'user',i<2)).join('')}
  function renderCpuStage(mode='waiting'){
    const stage=ensureCpuStage();if(!stage)return;const ticker=stage.querySelector('.s5-cpu-choice-ticker'),host=stage.querySelector('.s5-cpu-choice-card');ticker.textContent=mode==='choosing'?'CPU CHOOSES':'WAITING FOR PLAYER CHOICE';const entries=[];
    if(pendingCpu)entries.push({p:pendingCpu,pending:true});for(let i=hist().length-1;i>=0;i--){const p=hist()[i]?.cpu;if(!p)continue;if(pendingCpu&&id(p)===id(pendingCpu))continue;entries.push({p,pending:false})}
    host.innerHTML=entries.map((x,i)=>`<div class="s5-cpu-history-card${i>0?' previous':''}">${makeCard(x.p,'cpu',true)}</div>`).join('');
    if(mode==='choosing'){const wrap=host.querySelector('.s5-cpu-history-card');if(wrap){wrap.querySelectorAll('.stat-circle b').forEach(n=>n.style.visibility='hidden');wrap.querySelectorAll('.stat-circle').forEach(n=>n.classList.add('s5-hidden-stat'))}}
  }
  function pickCpu(){const k=state?.category,available=(Array.isArray(cpuTeam)?cpuTeam:[]).filter(p=>!isUsed(p,'cpu'));if(!available.length)return null;return available.reduce((best,p)=>effective(p,k)>effective(best,k)?p:best,available[0])}
  function syncScore(){let u=0,c=0;hist().forEach(h=>{u+=Number(h.userPts)||0;c+=Number(h.cpuPts)||0});state.userScore=u;state.cpuScore=c;const ue=document.getElementById('userScore'),ce=document.getElementById('cpuScore');if(ue)ue.textContent=String(u);if(ce)ce.textContent=String(c);return{userScore:u,cpuScore:c}}
  function chooseCategory(){return CATS[Math.floor(Math.random()*CATS.length)]}
  function beginQuarter(){
    clearTimeout(transitionTimer);busy=false;pendingCpu=null;if(!state)return;state.category=chooseCategory();
    const q=document.getElementById('quarterLabel'),cat=document.getElementById('categoryLabel'),inst=document.getElementById('instruction');if(q)q.textContent=state.overtime?'OVERTIME':'MATCHUP IS';if(cat)cat.textContent=(LABELS[state.category]||state.category).toUpperCase();if(inst)inst.textContent=state.overtime?'Overtime — tap your final unused card when ready':'Choose one unused player for '+LABELS[state.category];
    syncScore();renderLineup();renderCpuStage('waiting');const panel=document.getElementById('revealPanel'),result=document.getElementById('quarterResult'),next=document.getElementById('nextQuarterBtn');panel?.classList.remove('hidden');if(result)result.innerHTML=`<span class="matchup-category-only">${LABELS[state.category]}</span>`;if(next){next.disabled=true;next.style.removeProperty('display');next.textContent=LABELS[state.category]};requestAnimationFrame(()=>{const rail=document.getElementById('lineup');if(rail)rail.scrollLeft=0});
    const detail={quarter:state.overtime?'OT':state.quarter,category:state.category,overtime:!!state.overtime,userScore:state.userScore,cpuScore:state.cpuScore};emit('s5:category-changed',detail);emit('s5:matchup-start',detail);
  }
  function resolvePick(userPlayer,cpuPlayer){
    const k=state.category,ud=delta(userPlayer),cd=delta(cpuPlayer),uv=effective(userPlayer,k),cv=effective(cpuPlayer,k),entry={quarter:state.overtime?'OT':state.quarter,category:k,user:userPlayer,cpu:cpuPlayer,userPts:uv,cpuPts:cv,userDynamicDelta:ud,cpuDynamicDelta:cd};
    state.usedUser.add(userPlayer.id);state.usedCpu.add(cpuPlayer.id);state.history.push(entry);syncScore();
    emit('s5:matchup-resolved',{entry,userScore:state.userScore,cpuScore:state.cpuScore,overtime:!!state.overtime});
    try{if(uv>cv)dyn()?.recordMatchupResult?.(userPlayer,cpuPlayer);else if(cv>uv)dyn()?.recordMatchupResult?.(cpuPlayer,userPlayer);else dyn()?.recordTie?.(userPlayer,cpuPlayer)}catch{}
    pendingCpu=null;busy=true;renderLineup();renderCpuStage('waiting');const result=document.getElementById('quarterResult');if(result)result.innerHTML=`<span class="big">${uv} – ${cv}</span>${uv===cv?'Matchup tied':uv>cv?userPlayer.name+' wins the matchup':cpuPlayer.name+' wins the matchup'}`;const next=document.getElementById('nextQuarterBtn');if(next)next.style.setProperty('display','none','important');transitionTimer=setTimeout(advance,900);
  }
  function playQuarter(playerId){if(busy||!state)return;const u=(Array.isArray(userTeam)?userTeam:[]).find(p=>String(p.id)===String(playerId));if(!u||isUsed(u,'user'))return;const c=pickCpu();if(!c)return;busy=true;pendingCpu=c;const selected=document.querySelector(`#lineup .player-card[data-id="${CSS.escape(String(u.id))}"]`);selected?.classList.add('s5-selected-card');renderCpuStage('choosing');transitionTimer=setTimeout(()=>resolvePick(u,c),280)}
  function advance(){if(!state)return;if(state.overtime){finishGame();return}if(state.quarter>=4){if(state.userScore===state.cpuScore){startOvertime();return}finishGame();return}state.quarter++;beginQuarter();window.scrollTo({top:0,behavior:'instant'})}
  function nextQuarter(){advance()}
  function startOvertime(){state.overtime=true;state.quarter=5;emit('s5:overtime-start',{userScore:state.userScore,cpuScore:state.cpuScore});beginQuarter();window.scrollTo({top:0,behavior:'instant'})}
  function finishGame(){clearTimeout(transitionTimer);busy=false;pendingCpu=null;syncScore();showScreen('final');const fu=document.getElementById('finalUser'),fc=document.getElementById('finalCpu'),fr=document.getElementById('finalResult'),qs=document.getElementById('quarterSummary');if(fu)fu.textContent=String(state.userScore);if(fc)fc.textContent=String(state.cpuScore);if(fr)fr.textContent=state.userScore===state.cpuScore?'Game Tied':state.userScore>state.cpuScore?'Starting5 Victory':'Defeat';if(qs)qs.innerHTML=hist().map(h=>`<div class="summary-row"><strong>${h.quarter==='OT'?'OT':'Q'+h.quarter}</strong><span>${LABELS[h.category]} · ${h.user.name} vs ${h.cpu.name}</span><b>${h.userPts}–${h.cpuPts}</b></div>`).join('');emit('s5:game-finished',{userScore:state.userScore,cpuScore:state.cpuScore,history:[...hist()],state});window.scrollTo({top:0,behavior:'instant'})}
  function resetGame(){clearTimeout(transitionTimer);busy=false;pendingCpu=null;dealTeams();state={quarter:1,userScore:0,cpuScore:0,usedUser:new Set(),usedCpu:new Set(),category:null,history:[],overtime:false};showScreen('game');emit('s5:game-start',{state,userTeam,cpuTeam});beginQuarter()}

  document.addEventListener('click',e=>{
    if(e.target.closest('#startBtn')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();resetGame();return}
    const card=e.target.closest('#lineup .player-card');if(!card||card.classList.contains('used'))return;const game=document.getElementById('game');if(!game?.classList.contains('active'))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();playQuarter(card.dataset.id);
  },true);

  Object.assign(window,{resetGame,renderLineup,beginQuarter,pickCpu,playQuarter,nextQuarter,startOvertime,finishGame});
  const style=document.createElement('style');style.id='starting5-gameplay-core-v01300';style.textContent=`#game{position:relative}.s5-rail-arrow{position:absolute;z-index:30;width:36px;height:54px;border-radius:14px;border:1px solid rgba(255,255,255,.28);background:rgba(8,12,18,.92);color:#fff;font-size:34px;font-weight:900;display:grid!important;place-items:center;top:178px;box-shadow:0 6px 18px rgba(0,0,0,.35)}.s5-rail-prev{left:4px}.s5-rail-next{right:4px}#lineup{scroll-padding-left:44px!important;scroll-padding-right:44px!important}.s5-selected-card{outline:3px solid #72ff8b!important;outline-offset:2px!important;box-shadow:0 0 0 2px rgba(114,255,139,.22),0 0 24px rgba(114,255,139,.35)!important}.s5-cpu-choice-stage{margin:14px 0 0;display:flex!important;flex-direction:column;gap:10px}.s5-cpu-choice-ticker{min-height:58px;border:1px solid rgba(255,255,255,.16);border-radius:17px;background:linear-gradient(180deg,#171f2b,#0d1219);display:flex;align-items:center;justify-content:center;padding:10px 14px;color:#f7b928;font-size:21px;font-weight:1000;text-align:center}.s5-cpu-choice-card{display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch}.s5-cpu-choice-card::-webkit-scrollbar{display:none}.s5-cpu-choice-card:empty{display:none}.s5-cpu-history-card{flex:0 0 34.4vw;max-width:154px;aspect-ratio:2.5/3.5}.s5-cpu-history-card>.player-card{width:100%!important;height:100%!important;min-width:0!important;margin:0!important;pointer-events:none!important}.s5-cpu-history-card.previous{opacity:.38;filter:grayscale(.7) saturate(.45)}.s5-hidden-stat{position:relative!important}.s5-hidden-stat b{visibility:hidden!important}.s5-hidden-stat:after{content:'?';position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-weight:1000}#quarterHistoryStrip,.quarter-history-strip{display:none!important}.game-action-panel{display:block!important}@media(max-width:430px){.s5-rail-arrow{top:168px;width:34px;height:50px}.s5-cpu-choice-ticker{font-size:19px}.s5-cpu-history-card{flex-basis:34.4vw}}`;document.head.appendChild(style);
  ensureNav();ensureCpuStage();window.STARTING5_GAMEPLAY_CORE={effective,pickCpu,renderLineup,syncScore,events:['s5:game-start','s5:matchup-start','s5:matchup-resolved','s5:overtime-start','s5:game-finished']};
})();
