/* NBA Starting5 v0.11.57 — fixed update controls + Rising Stars event bootstrap */
(()=>{
  if(window.__starting5UpdateCheckV01147)return;
  window.__starting5UpdateCheckV01147=true;

  const btn=document.getElementById('checkUpdatesBtn');
  const label=document.querySelector('.brand-version');

  if(!window.__starting5RisingStarsBootstrapV01157){
    window.__starting5RisingStarsBootstrapV01157=true;
    const rs=document.createElement('script');
    rs.src='season-rising-stars-v0.11.57.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(rs);
  }

  if(!btn)return;

  btn.textContent='Check for Updates';
  btn.style.setProperty('min-height','42px');
  btn.style.setProperty('height','42px');

  let status=document.getElementById('starting5UpdateStatus');
  if(!status){
    status=document.createElement('div');
    status.id='starting5UpdateStatus';
    status.setAttribute('aria-live','polite');
    status.style.cssText='min-height:18px;height:18px;margin:8px 0 0;text-align:center;color:#8e96a3;font-size:10px;font-weight:800;letter-spacing:.04em;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    btn.insertAdjacentElement('afterend',status);
  }

  const setStatus=text=>{status.textContent=text||'';};
  const currentVersion=()=>String(label?.dataset?.buildVersion||label?.textContent||'').replace(/^v/i,'').trim();
  const syncLabel=version=>{if(label&&version){label.textContent='v'+version;label.dataset.buildVersion=version;}};

  const showMask=version=>{
    let mask=document.getElementById('s5UpdateMask');
    if(mask)return mask;
    mask=document.createElement('div');mask.id='s5UpdateMask';
    mask.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#05070b;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;color:#fff;font-family:inherit;text-align:center;padding:24px';
    mask.innerHTML='<div style="font-size:18px;font-weight:1000;letter-spacing:.02em">NBA STARTING5</div><div style="font-size:12px;color:#aeb6c3">Updating to v'+String(version||'latest')+'…</div>';
    document.body.appendChild(mask);return mask;
  };

  window.addEventListener('click',async e=>{
    const target=e.target?.closest?.('#checkUpdatesBtn');if(!target)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(btn.disabled)return;
    btn.disabled=true;setStatus('Checking for updates…');
    let b=null;
    try{const r=await fetch('build.json?t='+Date.now(),{cache:'no-store'});if(r.ok)b=await r.json();}catch{}
    if(!b?.version){setStatus('Could not check. Try again.');btn.disabled=false;setTimeout(()=>setStatus(''),1800);return;}
    const running=currentVersion();
    if(String(b.version)===running){syncLabel(b.version);setStatus('You’re up to date · v'+b.version);btn.disabled=false;setTimeout(()=>setStatus(''),1800);return;}
    setStatus('Update available · loading v'+b.version+'…');showMask(b.version);
    try{sessionStorage.setItem('starting5PendingVersion',b.version)}catch{}
    try{
      if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()));}
      if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)));}
    }catch{}
    location.replace('/nba-courtside/?release='+encodeURIComponent(b.commit||b.version)+'&t='+Date.now());
  },true);
})();
