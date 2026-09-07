/* NBA Starting5 v0.11.92 — thicker reference-style dynamic rating chevrons. */
(()=>{
  if(window.__starting5DynamicRatingArrowStyleV01192)return;
  window.__starting5DynamicRatingArrowStyleV01192=true;

  const old=document.getElementById('s5-dynamic-rating-arrow-style-v01192');
  if(old)old.remove();

  const css=document.createElement('style');
  css.id='s5-dynamic-rating-arrow-style-v01192';
  css.textContent=`
    .player-card .s5-dynamic-rating{
      top:8px!important;
      right:8px!important;
      width:36px!important;
      gap:0!important;
      filter:drop-shadow(0 2px 2px rgba(0,0,0,.8))!important;
    }
    .player-card .s5-dynamic-rating i{
      position:relative!important;
      display:block!important;
      width:34px!important;
      height:20px!important;
      margin-top:-2px!important;
      background:rgba(255,255,255,.34)!important;
      clip-path:polygon(50% 0,100% 37%,100% 70%,50% 31%,0 70%,0 37%)!important;
      filter:drop-shadow(0 1px 1px rgba(0,0,0,.75))!important;
      transform:none!important;
    }
    .player-card .s5-dynamic-rating i::after{
      content:'';
      position:absolute;
      left:5px;
      right:5px;
      top:5px;
      bottom:5px;
      background:rgba(8,13,20,.82);
      clip-path:polygon(50% 0,100% 39%,100% 69%,50% 34%,0 69%,0 39%);
    }
    .player-card .s5-dynamic-rating-up i.active{
      background:linear-gradient(180deg,#4bd46c 0%,#15943a 100%)!important;
      filter:drop-shadow(0 0 3px rgba(40,200,86,.95)) drop-shadow(0 0 7px rgba(40,200,86,.55)) drop-shadow(0 2px 2px rgba(0,0,0,.8))!important;
    }
    .player-card .s5-dynamic-rating-up i.active::after,
    .player-card .s5-dynamic-rating-down i.active::after{display:none!important}
    .player-card .s5-dynamic-rating-down i{
      transform:rotate(180deg)!important;
    }
    .player-card .s5-dynamic-rating-down i.active{
      background:linear-gradient(180deg,#ff5964 0%,#c8102e 100%)!important;
      filter:drop-shadow(0 0 3px rgba(239,51,64,.95)) drop-shadow(0 0 7px rgba(239,51,64,.55)) drop-shadow(0 2px 2px rgba(0,0,0,.8))!important;
    }
    .player-card .s5-dynamic-rating-neutral i{
      background:rgba(255,255,255,.34)!important;
    }
    @media(max-width:430px){
      .player-card .s5-dynamic-rating{top:7px!important;right:7px!important;width:34px!important}
      .player-card .s5-dynamic-rating i{width:32px!important;height:19px!important}
    }
  `;
  document.head.appendChild(css);
})();
