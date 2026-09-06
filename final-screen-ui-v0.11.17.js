/* NBA Starting5 v0.11.17 — final winner headline placement + working lower Menu */
(()=>{
  if(window.__starting5FinalUiV01117)return;
  window.__starting5FinalUiV01117=true;

  const syncWinnerHeadline=()=>{
    const final=document.getElementById('final');
    const result=document.getElementById('finalResult');
    if(!final||!result)return;

    // Put the winner directly below the persistent Starting5 header.
    if(result.parentElement!==final){
      final.insertBefore(result,final.firstChild);
    }
    result.classList.add('s5-final-winner-headline');
    const text=(result.textContent||'').trim();
    if(text)result.textContent=text.toUpperCase();
  };

  const style=document.createElement('style');
  style.textContent=`
    #final>.s5-final-winner-headline{
      display:block!important;
      width:100%!important;
      margin:2px 0 14px!important;
      padding:0 12px!important;
      box-sizing:border-box!important;
      text-align:center!important;
      font-size:56px!important;
      line-height:.94!important;
      font-weight:1000!important;
      letter-spacing:-.035em!important;
      text-transform:uppercase!important;
      color:#fff!important;
    }
    #final .final-card>#finalResult{display:none!important}
    @media(max-width:430px){
      #final>.s5-final-winner-headline{font-size:52px!important;margin-bottom:12px!important}
    }
    @media(max-width:370px){
      #final>.s5-final-winner-headline{font-size:46px!important}
    }
  `;
  document.head.appendChild(style);

  // Keep the headline synced when final-result code updates its text.
  const result=document.getElementById('finalResult');
  if(result)new MutationObserver(syncWinnerHeadline).observe(result,{childList:true,subtree:true,characterData:true});

  // The lower Menu button on the compact final had no dependable route.
  // Capture it before stale handlers can swallow the tap.
  document.addEventListener('click',e=>{
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    const btn=e.target.closest('button');
    if(!btn)return;
    const text=(btn.textContent||'').trim().toUpperCase();
    if(text!=='MENU'||btn.id==='newGameBtn')return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    try{if(typeof showScreen==='function')showScreen('intro');}catch{}
    try{if(typeof renderStarterFive==='function')renderStarterFive();}catch{}
    window.scrollTo(0,0);
  },true);

  const final=document.getElementById('final');
  if(final)new MutationObserver(()=>{
    if(final.classList.contains('active'))requestAnimationFrame(syncWinnerHeadline);
  }).observe(final,{attributes:true,attributeFilter:['class']});

  syncWinnerHeadline();
})();
