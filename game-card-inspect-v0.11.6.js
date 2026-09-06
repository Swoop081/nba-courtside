/* NBA Starting5 v0.11.6 — nameplate inspect / direct card play interaction */
(()=>{
  if(window.__starting5GameCardInspectV0116)return;
  window.__starting5GameCardInspectV0116=true;

  const LABELS={scoring:'Scoring',dunks:'Dunking',three:'3PT',freeThrows:'Free Throws',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
  const KEYS=['scoring','dunks','three','freeThrows','rebounding','passing','blocks','steals'];
  let overlay=null,current=null,flipped=false;

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const findPlayer=id=>{
    try{return (Array.isArray(userTeam)?userTeam:[]).find(p=>String(p.id)===String(id))||null}catch{return null}
  };

  function ensureOverlay(){
    if(overlay)return overlay;
    overlay=document.createElement('div');
    overlay.id='s5GameCardInspect';
    overlay.className='s5-game-card-inspect';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML='<div class="s5-inspect-stage"><div class="s5-inspect-flipper"><div class="s5-inspect-face s5-inspect-front"></div><div class="s5-inspect-face s5-inspect-back"></div></div><div class="s5-inspect-hint">Tap card to flip</div></div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click',e=>{
      const stage=e.target.closest('.s5-inspect-stage');
      if(!stage){close();return;}
      const flipper=e.target.closest('.s5-inspect-flipper');
      if(flipper){
        flipped=!flipped;
        flipper.classList.toggle('is-flipped',flipped);
      }
    });
    return overlay;
  }

  function backMarkup(p){
    const rows=KEYS.map(k=>`<div class="s5-inspect-stat"><span>${esc(LABELS[k]||k)}</span><strong>${Number(p?.stats?.[k]??0)}</strong></div>`).join('');
    return `<div class="s5-inspect-back-card" style="--s5-a:${p?.theme?.a||'#1d428a'};--s5-b:${p?.theme?.b||'#f5f7fb'}"><div class="s5-inspect-back-logo"><img src="https://cdn.nba.com/logos/nba/${p.teamId}/global/L/logo.svg" alt=""></div><h3>${esc(p.name)}</h3><p>${esc(p.teamShort||p.team||'')}</p><div class="s5-inspect-stats">${rows}</div></div>`;
  }

  function open(p){
    if(!p)return;
    current=p;flipped=false;
    const o=ensureOverlay(),front=o.querySelector('.s5-inspect-front'),back=o.querySelector('.s5-inspect-back'),flipper=o.querySelector('.s5-inspect-flipper');
    let card='';
    try{card=typeof cardMarkup==='function'?cardMarkup(p,{activeStat:state?.category||null,eager:true}):''}catch{}
    front.innerHTML=card;
    back.innerHTML=backMarkup(p);
    flipper.classList.remove('is-flipped');
    o.classList.add('open');
    o.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('s5-inspect-open');
  }

  function close(){
    if(!overlay)return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('s5-inspect-open');
    current=null;flipped=false;
  }

  // Nameplate/plaque only opens the inspector. The player image/card body is left
  // untouched so the existing gameplay handler plays it immediately.
  document.addEventListener('click',e=>{
    const identity=e.target.closest('#lineup .player-card:not(.used) .identity');
    if(!identity)return;
    const card=identity.closest('.player-card');
    if(!card)return;
    const game=document.getElementById('game');
    if(!game?.classList.contains('active'))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    open(findPlayer(card.dataset.id));
  },true);

  const style=document.createElement('style');
  style.textContent=`
    html.s5-inspect-open,html.s5-inspect-open body{overflow:hidden!important}
    .s5-game-card-inspect{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:70px 24px 54px;background:rgba(2,5,10,.9);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
    .s5-game-card-inspect.open{display:flex}
    .s5-inspect-stage{width:min(84vw,380px);display:flex;flex-direction:column;align-items:center;gap:16px;perspective:1300px}
    .s5-inspect-flipper{position:relative;width:100%;aspect-ratio:2.5/3.5;transform-style:preserve-3d;transition:transform .32s ease;cursor:pointer}
    .s5-inspect-flipper.is-flipped{transform:rotateY(180deg)}
    .s5-inspect-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:3px;overflow:hidden}
    .s5-inspect-front>.player-card{width:100%!important;height:100%!important;min-width:0!important;max-width:none!important;transform:none!important;margin:0!important;pointer-events:none!important}
    .s5-inspect-back{transform:rotateY(180deg)}
    .s5-inspect-back-card{width:100%;height:100%;box-sizing:border-box;padding:24px 22px;background:radial-gradient(circle at 50% 18%,color-mix(in srgb,var(--s5-a) 50%,#111),#07101b 55%,#02060b);border:2px solid color-mix(in srgb,var(--s5-b) 60%,#fff);color:#fff;display:flex;flex-direction:column;align-items:center}
    .s5-inspect-back-logo img{width:82px;height:82px;object-fit:contain}.s5-inspect-back-card h3{margin:14px 0 2px;font-size:27px;line-height:1;text-align:center}.s5-inspect-back-card p{margin:0 0 18px;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#aeb8c8}
    .s5-inspect-stats{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px}.s5-inspect-stat{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 11px;border:1px solid rgba(255,255,255,.13);background:rgba(0,0,0,.22)}.s5-inspect-stat span{font-size:10px;font-weight:900;text-transform:uppercase;color:#b7c0ce}.s5-inspect-stat strong{font-size:20px}
    .s5-inspect-hint{font-size:12px;font-weight:900;color:#b9c1cf;letter-spacing:.02em}
    #lineup .player-card .identity{pointer-events:auto!important;cursor:zoom-in!important}
    @media(max-width:430px){.s5-game-card-inspect{padding:66px 22px 48px}.s5-inspect-stage{width:min(86vw,360px)}.s5-inspect-back-card{padding:20px 18px}.s5-inspect-back-card h3{font-size:24px}.s5-inspect-stat{padding:9px 10px}}
  `;
  document.head.appendChild(style);
})();
