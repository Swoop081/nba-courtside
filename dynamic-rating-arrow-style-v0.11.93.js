/* NBA Starting5 v0.11.93 — compact, reference-shaped dynamic rating arrows. */
(()=>{
  if(window.__starting5DynamicRatingArrowStyleV01193)return;
  window.__starting5DynamicRatingArrowStyleV01193=true;

  const css=document.createElement('style');
  css.id='s5-dynamic-rating-arrow-style-v01193';
  css.textContent=`
    .player-card .s5-dynamic-rating{
      top:8px!important;
      right:8px!important;
      width:30px!important;
      gap:0!important;
      filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))!important;
    }
    .player-card .s5-dynamic-rating i{
      position:relative!important;
      display:block!important;
      width:30px!important;
      height:15px!important;
      margin-top:-1px!important;
      background:rgba(255,255,255,.34)!important;
      clip-path:polygon(50% 0,100% 34%,100% 62%,50% 29%,0 62%,0 34%)!important;
      filter:drop-shadow(0 1px 1px rgba(0,0,0,.75))!important;
      transform:none!important;
    }
    .player-card .s5-dynamic-rating i::after{
      content:'';
      position:absolute;
      left:3px;
      right:3px;
      top:3px;
      bottom:3px;
      background:rgba(8,13,20,.82);
      clip-path:polygon(50% 0,100% 35%,100% 61%,50% 31%,0 61%,0 35%);
    }
    .player-card .s5-dynamic-rating-up i.active{
      background:linear-gradient(180deg,#4bd46c 0%,#15943a 100%)!important;
      filter:drop-shadow(0 0 3px rgba(40,200,86,.9)) drop-shadow(0 0 6px rgba(40,200,86,.42)) drop-shadow(0 1px 1px rgba(0,0,0,.8))!important;
    }
    .player-card .s5-dynamic-rating-up i.active::after,
    .player-card .s5-dynamic-rating-down i.active::after{display:none!important}
    .player-card .s5-dynamic-rating-down i{transform:rotate(180deg)!important}
    .player-card .s5-dynamic-rating-down i.active{
      background:linear-gradient(180deg,#ff5964 0%,#c8102e 100%)!important;
      filter:drop-shadow(0 0 3px rgba(239,51,64,.9)) drop-shadow(0 0 6px rgba(239,51,64,.42)) drop-shadow(0 1px 1px rgba(0,0,0,.8))!important;
    }
    .player-card .s5-dynamic-rating-neutral i{background:rgba(255,255,255,.34)!important}
    @media(max-width:430px){
      .player-card .s5-dynamic-rating{top:7px!important;right:7px!important;width:29px!important}
      .player-card .s5-dynamic-rating i{width:29px!important;height:14px!important}
    }
  `;
  document.head.appendChild(css);
})();
