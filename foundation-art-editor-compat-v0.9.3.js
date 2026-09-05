/* NBA Courtside v0.9.3 — Foundation Card Art Editor compatibility */
(()=>{
  if(typeof cardMarkup!=='function')return;
  const before=cardMarkup;
  cardMarkup=function(p,o={}){
    let html=before(p,o);
    if(!html.includes('data-art-slug=')){
      html=html.replace('<article class="player-card foundation-card ',`<article data-art-slug="${p.artSlug}" class="player-card foundation-card `);
    }
    html=html.replace('<div class="foundation-art">','<div class="foundation-art art-stage">');
    html=html.replace('<img src="','<img class="photo cutout-art" src="');
    return html;
  };

  const style=document.createElement('style');
  style.id='foundation-art-editor-compat-style-v093';
  style.textContent=`
    .foundation-card .foundation-art.art-stage{position:absolute!important;z-index:5!important;left:0!important;right:0!important;top:4%!important;bottom:18%!important;overflow:hidden!important}
    .foundation-card .foundation-art.art-stage .photo.cutout-art{position:absolute!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center bottom!important;transform-origin:center bottom!important;max-width:none!important}
    .art-editor-preview .foundation-card{width:100%!important}
    .art-editor-preview .foundation-card .foundation-rating{left:2%!important;top:2%!important}
  `;
  document.head.appendChild(style);
})();
