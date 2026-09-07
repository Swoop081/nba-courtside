/* NBA Starting5 v0.11.94 — flatter compact reference chevrons. */
(()=>{
  if(window.__starting5DynamicRatingArrowStyleV01194)return;
  window.__starting5DynamicRatingArrowStyleV01194=true;

  const css=document.createElement('style');
  css.id='s5-dynamic-rating-arrow-style-v01194';
  css.textContent=`
    .player-card .s5-dynamic-rating{
      top:8px!important;
      right:8px!important;
      width:31px!important;
      height:34px!important;
      display:flex!important;
      flex-direction:column-reverse!important;
      align-items:center!important;
      justify-content:flex-start!important;
      gap:0!important;
      filter:drop-shadow(0 1px 1px rgba(0,0,0,.82))!important;
    }
    .player-card .s5-dynamic-rating i{
      position:relative!important;
      display:block!important;
      width:31px!important;
      height:12px!important;
      min-height:12px!important;
      margin:-1px 0 0 0!important;
      padding:0!important;
      border:0!important;
      border-radius:0!important;
      background:rgba(255,255,255,.32)!important;
      clip-path:polygon(50% 0,100% 31%,100% 55%,50% 25%,0 55%,0 31%)!important;
      transform:none!important;
      filter:drop-shadow(0 1px 1px rgba(0,0,0,.78))!important;
    }
    .player-card .s5-dynamic-rating i::after{
      content:''!important;
      position:absolute!important;
      left:3px!important;
      right:3px!important;
      top:3px!important;
      bottom:3px!important;
      background:rgba(9,14,21,.88)!important;
      clip-path:polygon(50% 0,100% 31%,100% 54%,50% 27%,0 54%,0 31%)!important;
    }
    .player-card .s5-dynamic-rating-up i.active{
      background:linear-gradient(180deg,#59df78 0%,#16963c 100%)!important;
      filter:drop-shadow(0 0 3px rgba(40,200,86,.92)) drop-shadow(0 1px 1px rgba(0,0,0,.78))!important;
    }
    .player-card .s5-dynamic-rating-up i.active::after,
    .player-card .s5-dynamic-rating-down i.active::after{display:none!important}
    .player-card .s5-dynamic-rating-down{
      flex-direction:column!important;
    }
    .player-card .s5-dynamic-rating-down i{
      transform:rotate(180deg)!important;
    }
    .player-card .s5-dynamic-rating-down i.active{
      background:linear-gradient(180deg,#ff6470 0%,#c8102e 100%)!important;
      filter:drop-shadow(0 0 3px rgba(239,51,64,.92)) drop-shadow(0 1px 1px rgba(0,0,0,.78))!important;
    }
    .player-card .s5-dynamic-rating-neutral i{background:rgba(255,255,255,.32)!important}
    @media(max-width:430px){
      .player-card .s5-dynamic-rating{top:7px!important;right:7px!important;width:30px!important;height:32px!important}
      .player-card .s5-dynamic-rating i{width:30px!important;height:11px!important;min-height:11px!important}
    }
  `;
  document.head.appendChild(css);
})();
