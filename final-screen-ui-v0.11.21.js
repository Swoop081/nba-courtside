/* NBA Starting5 v0.11.21 — large winner banner + reliable final Menu */
(()=>{
  if(window.__starting5FinalUiV01121)return;
  window.__starting5FinalUiV01121=true;

  const enhanceFinal=()=>{
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    const card=final.querySelector('.compact-final-card');
    if(!card)return;
    const old=card.querySelector('h2');
    const text=(old?.textContent||'').trim().replace(/!+$/,'').toUpperCase();
    if(text){
      let banner=final.querySelector('.s5-final-winner-banner');
      if(!banner){
        banner=document.createElement('div');
        banner.className='s5-final-winner-banner';
        final.insertBefore(banner,card);
      }
      if(banner.textContent!==text)banner.textContent=text;
      if(old)old.classList.add('s5-final-old-winner');
    }
  };

  const goMenu=()=>{
    const intro=document.getElementById('intro');
    try{if(typeof showScreen==='function')showScreen('intro');}catch{}
    if(intro&&!intro.classList.contains('active')){
      document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
      intro.classList.add('active');
    }
    window.scrollTo({top:0,behavior:'instant'});
  };

  const style=document.createElement('style');
  style.textContent=`
    #final>.s5-final-winner-banner{
      width:100%;box-sizing:border-box;margin:0 0 10px;padding:0 12px;
      text-align:center;color:#fff;font-size:58px;line-height:.92;font-weight:1000;
      letter-spacing:-.035em;text-transform:uppercase;
    }
    #final .compact-final-card>h2.s5-final-old-winner{display:none!important}
    @media(max-width:430px){#final>.s5-final-winner-banner{font-size:56px;margin-bottom:9px}}
    @media(max-width:370px){#final>.s5-final-winner-banner{font-size:50px}}
  `;
  document.head.appendChild(style);

  const baseFinish=window.finishGame;
  if(typeof baseFinish==='function'&&!baseFinish.__s5FinalV01121){
    const wrapped=function(){
      const out=baseFinish.apply(this,arguments);
      requestAnimationFrame(enhanceFinal);
      setTimeout(enhanceFinal,0);
      return out;
    };
    wrapped.__s5FinalV01121=true;
    window.finishGame=wrapped;
    try{finishGame=wrapped}catch{}
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#compactMenu');
    if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    goMenu();
  },true);

  const final=document.getElementById('final');
  if(final)new MutationObserver(()=>{
    if(final.classList.contains('active'))requestAnimationFrame(enhanceFinal);
  }).observe(final,{attributes:true,attributeFilter:['class'],childList:true});
})();
