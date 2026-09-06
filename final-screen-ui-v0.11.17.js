/* NBA Starting5 v0.11.22 — large winner banner + reliable final Menu + POTG score spacing */
(()=>{
  if(window.__starting5FinalUiV01122)return;
  window.__starting5FinalUiV01122=true;

  let syncing=false;
  const enhanceFinal=()=>{
    if(syncing)return;
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    syncing=true;
    try{
      const card=final.querySelector('.compact-final-card');
      if(card){
        const old=card.querySelector('h2');
        const text=(old?.textContent||'').trim().replace(/!+$/,'').toUpperCase();
        if(text){
          let banner=final.querySelector('.s5-final-winner-banner');
          if(!banner){banner=document.createElement('div');banner.className='s5-final-winner-banner';final.insertBefore(banner,card);}
          if(banner.textContent!==text)banner.textContent=text;
          old?.classList.add('s5-final-old-winner');
        }
      }else{
        const result=document.getElementById('finalResult');
        if(result){
          const text=(result.textContent||'').trim();
          const upper=text.toUpperCase();
          if(text&&text!==upper)result.textContent=upper;
          if(result.parentElement!==final)final.insertBefore(result,final.firstChild);
          result.classList.add('s5-final-winner-headline');
        }
      }
    }finally{syncing=false}
  };

  const goMenu=()=>{
    const intro=document.getElementById('intro');
    try{if(typeof showScreen==='function')showScreen('intro')}catch{}
    if(intro&&!intro.classList.contains('active')){
      document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
      intro.classList.add('active');
    }
    window.scrollTo({top:0,behavior:'instant'});
  };

  const style=document.createElement('style');
  style.textContent=`
    #final>.s5-final-winner-banner,#final>.s5-final-winner-headline{
      display:block!important;width:100%!important;box-sizing:border-box!important;
      margin:0 0 10px!important;padding:0 12px!important;text-align:center!important;
      font-size:58px!important;line-height:.92!important;font-weight:1000!important;
      letter-spacing:-.035em!important;text-transform:uppercase!important;color:#fff!important;
    }
    #final .compact-final-card>h2.s5-final-old-winner,#final .final-card>#finalResult{display:none!important}
    #final .compact-final-scoreboard{margin-bottom:26px!important}
    #final .compact-final-scoreboard + h2.s5-final-old-winner + .potg-label,
    #final .compact-final-scoreboard + .potg-label{margin-top:0!important}
    @media(max-width:430px){
      #final>.s5-final-winner-banner,#final>.s5-final-winner-headline{font-size:56px!important;margin-bottom:9px!important}
      #final .compact-final-scoreboard{margin-bottom:24px!important}
    }
    @media(max-width:370px){#final>.s5-final-winner-banner,#final>.s5-final-winner-headline{font-size:50px!important}}
  `;
  document.head.appendChild(style);

  const result=document.getElementById('finalResult');
  if(result)new MutationObserver(()=>{if(!syncing)requestAnimationFrame(enhanceFinal)}).observe(result,{childList:true,subtree:true,characterData:true});

  document.addEventListener('click',e=>{
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    const btn=e.target.closest('button');
    if(!btn)return;
    const isMenu=btn.id==='compactMenu'||((btn.textContent||'').trim().toUpperCase()==='MENU'&&btn.id!=='newGameBtn');
    if(!isMenu)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    goMenu();
  },true);

  const final=document.getElementById('final');
  if(final)new MutationObserver(()=>{
    if(!syncing&&final.classList.contains('active'))requestAnimationFrame(enhanceFinal);
  }).observe(final,{attributes:true,attributeFilter:['class'],childList:true});

  enhanceFinal();
})();
