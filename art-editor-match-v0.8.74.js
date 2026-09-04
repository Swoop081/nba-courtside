/* NBA Courtside v0.8.74 — Card Art Editor preview uses exact gameplay card dimensions */
(()=>{
  const style=document.createElement('style');
  style.id='courtside-art-editor-gameplay-match-v0874';
  style.textContent=`
    .art-editor-preview{width:min(43vw,210px)!important;margin:0 auto 16px!important}
    .art-editor-preview .player-card{width:100%!important;max-width:none!important}
    @media(max-width:430px){
      .art-editor-preview{width:min(45vw,185px)!important}
    }
  `;
  document.head.appendChild(style);
})();
