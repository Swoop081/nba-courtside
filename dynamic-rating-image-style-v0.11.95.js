/* NBA Starting5 v0.13.0-dev.10 — dynamic indicator assets + effective Foundation front rating sync. */
(()=>{
  if(window.__starting5DynamicRatingImageStyleV01195)return;
  window.__starting5DynamicRatingImageStyleV01195=true;
  const css=document.createElement('style');
  css.id='s5-dynamic-rating-image-style-v01195';
  css.textContent=`
    .player-card .s5-dynamic-rating{position:absolute!important;top:7px!important;right:7px!important;width:34px!important;height:45px!important;display:block!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important;filter:drop-shadow(0 2px 2px rgba(0,0,0,.55))!important;pointer-events:none!important;z-index:28!important}
    .player-card .s5-dynamic-rating i,.player-card .s5-dynamic-rating i::after{display:none!important}
    .player-card .s5-dynamic-rating-neutral{display:none!important;background-image:none!important}
    .player-card .s5-dynamic-rating-up:not(.s5-dynamic-rating-neutral):has(i:nth-child(1).active):not(:has(i:nth-child(2).active)){background-image:url('assets/ui/dynamic-rating-up-1.svg?v=01198')!important}
    .player-card .s5-dynamic-rating-up:has(i:nth-child(2).active):not(:has(i:nth-child(3).active)){background-image:url('assets/ui/dynamic-rating-up-2.svg?v=01198')!important}
    .player-card .s5-dynamic-rating-up:has(i:nth-child(3).active){background-image:url('assets/ui/dynamic-rating-up-3.svg?v=01198')!important}
    .player-card .s5-dynamic-rating-down:not(.s5-dynamic-rating-neutral):has(i:nth-child(1).active):not(:has(i:nth-child(2).active)){background-image:url('assets/ui/dynamic-rating-down-1.svg?v=01198')!important}
    .player-card .s5-dynamic-rating-down:has(i:nth-child(2).active):not(:has(i:nth-child(3).active)){background-image:url('assets/ui/dynamic-rating-down-2.svg?v=01198')!important}
    .player-card .s5-dynamic-rating-down:has(i:nth-child(3).active){background-image:url('assets/ui/dynamic-rating-down-3.svg?v=01198')!important}
    @media(max-width:430px){.player-card .s5-dynamic-rating{top:7px!important;right:7px!important;width:32px!important;height:43px!important}}
  `;
  document.head.appendChild(css);

  const id=p=>String(p?.id||p?.playerId||'');
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const pool=()=>{const out=[];try{if(Array.isArray(userTeam))out.push(...userTeam);if(Array.isArray(cpuTeam))out.push(...cpuTeam);if(Array.isArray(players))out.push(...players)}catch{}return out};
  const playerFor=card=>{const k=String(card?.dataset?.id||'');return pool().find(p=>id(p)===k)||null};
  const playedFor=(p,side)=>{try{const h=Array.isArray(state?.history)?state.history:[];for(let i=h.length-1;i>=0;i--){const row=h[i],q=side==='cpu'?row?.cpu:row?.user;if(id(q)===id(p))return row}}catch{}return null};
  const effective=(p,cat)=>{try{return Number(dyn()?.getEffectiveStat?.(p,cat))||0}catch{return Number(p?.stats?.[cat])||0}};
  function syncCard(card){
    if(!card?.classList?.contains('foundation-card'))return;
    const p=playerFor(card),rating=card.querySelector('.foundation-rating');if(!p||!rating)return;
    const side=card.closest('#lineup')?'user':'cpu',played=playedFor(p,side),cat=played?.category||state?.category;if(!cat)return;
    const value=played?Number(side==='cpu'?played.cpuPts:played.userPts)||0:effective(p,cat);
    rating.dataset.rating=String(value);const span=rating.querySelector('span');if(span)span.textContent=String(value);else rating.textContent=String(value);
  }
  const sync=()=>document.querySelectorAll('#game.active #lineup .foundation-card,#game.active #s5CpuChoiceStage .foundation-card').forEach(syncCard);
  ['s5:game-start','s5:matchup-start','s5:matchup-resolved','s5:overtime-start'].forEach(name=>window.addEventListener(name,()=>requestAnimationFrame(sync)));
})();
