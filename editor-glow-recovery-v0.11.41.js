/* NBA Starting5 v0.11.41 — Card Art Editor recovery + player glow authority. */
(()=>{
  if(window.__starting5EditorGlowRecoveryV01141)return;
  window.__starting5EditorGlowRecoveryV01141=true;

  const GLOW_KEY='nbaCourtsidePlayerGlowV1';
  const GLOW='drop-shadow(0 0 2px rgba(255,255,255,.95)) drop-shadow(0 0 5px rgba(255,255,255,.85)) drop-shadow(0 0 8px rgba(255,255,255,.55))';
  const readGlow=()=>{try{return JSON.parse(localStorage.getItem(GLOW_KEY)||'{}')}catch{return {}}};
  const norm=s=>String(s||'').trim().toLowerCase();

  function playerPool(){
    const pools=[];
    try{if(typeof players!=='undefined'&&Array.isArray(players))pools.push(players)}catch{}
    ['COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers','COURTSIDE_CLASSIC_PLAYERS'].forEach(k=>{if(Array.isArray(window[k]))pools.push(window[k])});
    const out=[],seen=new Set();
    for(const pool of pools)for(const p of pool||[]){
      if(!p)continue;
      const key=String(p.id||p.artSlug||`${p.teamId||p.team||''}|${p.name||''}`);
      if(seen.has(key))continue;seen.add(key);out.push(p);
    }
    return out;
  }

  function playerForCard(card){
    if(!card)return null;
    const pool=playerPool();
    const slug=card.dataset?.artSlug;
    if(slug){const p=pool.find(x=>x.artSlug===slug);if(p)return p;}
    const id=card.dataset?.id;
    if(id){const p=pool.find(x=>String(x.id)===String(id));if(p)return p;}
    const name=card.querySelector?.('.identity h3')?.textContent;
    return name?pool.find(x=>norm(x.name)===norm(name))||null:null;
  }

  function applyGlow(card){
    const img=card?.querySelector?.('.foundation-art img,.cutout-art,.photo');
    if(!img)return;
    const p=playerForCard(card);
    const slug=p?.artSlug||card.dataset?.artSlug;
    const enabled=!slug||readGlow()[slug]!==false;
    if(enabled){
      img.style.setProperty('filter',GLOW,'important');
      img.dataset.playerGlow='on';
    }else if(img.dataset.playerGlow==='on'){
      img.style.removeProperty('filter');
      delete img.dataset.playerGlow;
    }
  }

  function applyAllGlow(root=document){
    if(root?.matches?.('.player-card,.foundation-card'))applyGlow(root);
    root?.querySelectorAll?.('.player-card,.foundation-card').forEach(applyGlow);
  }
  window.applyStarting5PlayerGlow=()=>applyAllGlow(document);

  let editorReloading=false;
  function wireDirectButton(btn,ed){
    if(!btn||!ed||btn.dataset.s5RecoveryWired==='1')return;
    btn.dataset.s5RecoveryWired='1';
    btn.addEventListener('click',()=>{
      document.getElementById('optionsSheet')?.classList.add('hidden');
      ed.classList.remove('hidden');
      setTimeout(()=>applyAllGlow(ed),0);
    });
  }
  function reloadEditor(){
    if(editorReloading)return;editorReloading=true;
    const s=document.createElement('script');
    s.src='art-editor-v0.8.64.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now())+'-recovery-'+Date.now();
    s.onload=()=>{editorReloading=false;setTimeout(ensureEditor,140)};
    s.onerror=()=>{editorReloading=false};
    document.head.appendChild(s);
  }
  function ensureEditor(){
    const options=document.querySelector('.options-card');
    if(!options)return false;
    let btn=document.getElementById('cardArtEditorBtn');
    let ed=document.getElementById('cardArtEditor');
    if(ed&&!btn){
      btn=document.createElement('button');btn.id='cardArtEditorBtn';btn.type='button';btn.className='art-editor-launch';btn.textContent='Card Art Editor';options.appendChild(btn);
      wireDirectButton(btn,ed);return true;
    }
    if(btn&&ed){wireDirectButton(btn,ed);return true;}
    if(btn&&!ed)btn.remove();
    reloadEditor();return false;
  }

  function start(){
    applyAllGlow(document);
    ensureEditor();
    let tries=0;const timer=setInterval(()=>{applyAllGlow(document);if(ensureEditor()||++tries>20)clearInterval(timer)},250);
    new MutationObserver(ms=>{
      for(const m of ms)for(const n of m.addedNodes||[])if(n.nodeType===1)applyAllGlow(n);
      ensureEditor();
    }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
