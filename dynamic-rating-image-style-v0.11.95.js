/* NBA Starting5 v0.11.98 — supplied-style transparent dynamic rating indicators with equal-spaced asset refresh. */
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
})();
