/* NBA Courtside v0.9.7 — expanded Card Art Editor ranges + clean rectangular plaque */
(()=>{
  const applyEditorRanges=()=>{
    const x=document.getElementById('artX');
    const y=document.getElementById('artY');
    const s=document.getElementById('artScale');
    if(x){x.min='-100';x.max='200';x.step='0.5';}
    if(y){y.min='-600';y.max='600';y.step='1';}
    if(s){s.min='0.25';s.max='6.00';s.step='0.01';}
  };

  const style=document.createElement('style');
  style.id='foundation-editor-plaque-style-v097';
  style.textContent=`
    .player-card.foundation-card .foundation-plaque,
    #lineup .foundation-card .foundation-plaque,
    .catalogue-grid .foundation-card .foundation-plaque,
    .art-editor-preview .foundation-card .foundation-plaque,
    .foundation-face.front .foundation-card .foundation-plaque{
      clip-path:none!important;
      border-radius:0!important;
    }
  `;
  document.head.appendChild(style);

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(applyEditorRanges,180),{once:true});
  }else{
    setTimeout(applyEditorRanges,180);
  }

  const observer=new MutationObserver(()=>applyEditorRanges());
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
