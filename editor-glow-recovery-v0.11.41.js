/* NBA Starting5 v0.11.43 — persistent Card Art Editor launcher + player glow recovery. */
(()=>{
  if(window.__starting5EditorGlowRecoveryV01143)return;
  window.__starting5EditorGlowRecoveryV01143=true;

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
    const pool=playerPool(),slug=card.dataset?.artSlug,id=card.dataset?.id;
    if(slug){const p=pool.find(x=>x.artSlug===slug);if(p)return p;}
    if(id){const p=pool.find(x=>String(x.id)===String(id));if(p)return p;}
    const name=card.querySelector?.('.identity h3,.foundation-name')?.textContent;
    return name?pool.find(x=>norm(x.name)===norm(name))||null:null;
  }

  function applyGlow(card){
    const img=card?.querySelector?.('.foundation-art img,.cutout-art,.photo');if(!img)return;
    const p=playerForCard(card),slug=p?.artSlug||card.dataset?.artSlug,enabled=!slug||readGlow()[slug]!==false;
    if(enabled){img.style.setProperty('filter',GLOW,'important');img.dataset.playerGlow='on';}
    else if(img.dataset.playerGlow==='on'){img.style.removeProperty('filter');delete img.dataset.playerGlow;}
  }
  function applyAllGlow(root=document){
    if(root?.matches?.('.player-card,.foundation-card'))applyGlow(root);
    root?.querySelectorAll?.('.player-card,.foundation-card').forEach(applyGlow);
  }
  window.applyStarting5PlayerGlow=()=>applyAllGlow(document);

  let loading=false;
  function loadEditor(done){
    if(document.getElementById('cardArtEditor')){done?.();return;}
    if(loading){setTimeout(()=>loadEditor(done),120);return;}
    loading=true;
    const s=document.createElement('script');
    s.src='art-editor-v0.8.64.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now())+'-v01143-'+Date.now();
    s.onload=()=>{loading=false;setTimeout(()=>done?.(),100)};
    s.onerror=()=>{loading=false;done?.()};
    document.head.appendChild(s);
  }

  function openEditor(btn){
    const finish=()=>{
      const ed=document.getElementById('cardArtEditor');
      if(ed){document.getElementById('optionsSheet')?.classList.add('hidden');ed.classList.remove('hidden');btn.textContent='Card Art Editor';setTimeout(()=>applyAllGlow(ed),0);return;}
      btn.textContent='Card Art Editor';
    };
    const existing=document.getElementById('cardArtEditor');
    if(existing){finish();return;}
    btn.textContent='Loading Editor…';
    loadEditor(()=>{
      let tries=0;
      const wait=()=>{if(document.getElementById('cardArtEditor')||++tries>20){finish();return;}setTimeout(wait,100)};
      wait();
    });
  }

  function ensureLauncher(){
    const options=document.querySelector('.options-card');if(!options)return false;
    let btn=document.getElementById('cardArtEditorBtn');
    if(!btn){
      btn=document.createElement('button');
      btn.id='cardArtEditorBtn';btn.type='button';btn.className='art-editor-launch';btn.textContent='Card Art Editor';
      btn.style.cssText='width:100%;margin-top:10px;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:#101720;color:#fff;font-size:15px;font-weight:950';
      options.appendChild(btn);
    }
    if(btn.dataset.s5PersistentEditor!=='1'){
      btn.dataset.s5PersistentEditor='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openEditor(btn)},true);
    }
    return true;
  }

  function start(){
    applyAllGlow(document);ensureLauncher();
    let tries=0;const timer=setInterval(()=>{applyAllGlow(document);ensureLauncher();if(++tries>40)clearInterval(timer)},250);
    new MutationObserver(ms=>{
      for(const m of ms)for(const n of m.addedNodes||[])if(n.nodeType===1)applyAllGlow(n);
      ensureLauncher();
    }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
