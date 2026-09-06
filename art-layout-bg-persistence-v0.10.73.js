/* NBA Starting5 v0.10.73 — persist/export/import background team-logo placement */
(()=>{
  if(window.__starting5BgLayoutPersistenceV01073)return;
  window.__starting5BgLayoutPersistenceV01073=true;
  const ART_KEY='nbaCourtsideArtEditorV1';
  const SIZE_KEY='nbaCourtsideBgLogoSizeV1';
  const POS_KEY='nbaCourtsideBgLogoPositionV1';
  const ROT_KEY='nbaCourtsideBgLogoRotationV1';
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return {}}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const players=()=>window.COURTSIDE_FOUNDATION_PLAYERS||[];
  const playerForCard=card=>players().find(p=>String(p.id)===String(card?.dataset?.id))||null;
  const baseWidthFor=card=>card.closest('.catalogue-grid')?118:112;
  const BASE_TOP=-23,BASE_RIGHT=-23;
  const bgFor=p=>{const size=Number(read(SIZE_KEY)[p?.teamId])||1,pos=read(POS_KEY)[p?.teamId]||{},rot=read(ROT_KEY)[p?.teamId];return {x:Number(pos.x)||0,y:Number(pos.y)||0,scale:size,rotation:Number.isFinite(Number(rot))?Number(rot):45};};
  const applyCard=card=>{
    const p=playerForCard(card);if(!p)return;
    const bg=card.querySelector('.foundation-bg-team-logo');if(!bg)return;
    if(p.classicTeam&&p.classicLogo&&bg.getAttribute('src')!==p.classicLogo)bg.setAttribute('src',p.classicLogo);
    const c=bgFor(p),w=baseWidthFor(card)*c.scale;
    bg.style.setProperty('width',`${w}%`,'important');
    bg.style.setProperty('height',`${w}%`,'important');
    bg.style.setProperty('right',`${BASE_RIGHT-c.x}%`,'important');
    bg.style.setProperty('top',`${BASE_TOP+c.y}%`,'important');
    bg.style.setProperty('transform',`rotate(${c.rotation}deg)`,'important');
  };
  const scan=root=>{if(root?.matches?.('.foundation-card'))applyCard(root);root?.querySelectorAll?.('.foundation-card').forEach(applyCard);};
  const applyAll=()=>scan(document);

  const exportData=()=>{
    const art=read(ART_KEY),size=read(SIZE_KEY),pos=read(POS_KEY),rot=read(ROT_KEY),cards={},teamLogos={};
    players().forEach(p=>{
      const base={x:parseFloat(p?.art?.x)||50,y:6,scale:+(((Number(p?.art?.s)||.76)*1.30).toFixed(2))};
      const bg=bgFor(p),editedBg=Object.prototype.hasOwnProperty.call(size,p.teamId)||Object.prototype.hasOwnProperty.call(pos,p.teamId)||Object.prototype.hasOwnProperty.call(rot,p.teamId);
      cards[p.artSlug]={...(art[p.artSlug]||base),edited:!!art[p.artSlug],name:p.name,set:p.set,team:p.teamShort,bgLogo:{...bg,edited:editedBg}};
      if(!teamLogos[p.teamId])teamLogos[p.teamId]={...bg,edited:editedBg,team:p.teamShort};
    });
    return {format:'NBA Starting5 Art Layout',version:2,gameVersion:'0.10.73',exportedAt:new Date().toISOString(),cards,teamLogos};
  };
  const download=data=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nba-starting5-art-layout.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);};
  const importData=data=>{
    if(!data||typeof data!=='object')throw new Error('Invalid layout');
    const art=read(ART_KEY),size=read(SIZE_KEY),pos=read(POS_KEY),rot=read(ROT_KEY);
    const bySlug=new Map(players().map(p=>[p.artSlug,p]));
    Object.entries(data.cards||{}).forEach(([slug,c])=>{
      const p=bySlug.get(slug);if(!p||!c)return;
      if(c.edited)art[slug]={x:Number(c.x),y:Number(c.y),scale:Number(c.scale)};
      const b=c.bgLogo;if(b&&b.edited){size[p.teamId]=Number(b.scale)||1;pos[p.teamId]={x:Number(b.x)||0,y:Number(b.y)||0};rot[p.teamId]=Number.isFinite(Number(b.rotation))?Number(b.rotation):45;}
    });
    Object.entries(data.teamLogos||{}).forEach(([teamId,b])=>{if(!b||!b.edited)return;size[teamId]=Number(b.scale)||1;pos[teamId]={x:Number(b.x)||0,y:Number(b.y)||0};rot[teamId]=Number.isFinite(Number(b.rotation))?Number(b.rotation):45;});
    write(ART_KEY,art);write(SIZE_KEY,size);write(POS_KEY,pos);write(ROT_KEY,rot);applyAll();
  };
  const installEditorIO=()=>{
    const ed=document.getElementById('cardArtEditor');if(!ed)return false;
    const exportBtn=ed.querySelector('#artExport'),copyBtn=ed.querySelector('#artCopy');
    if(exportBtn&&!exportBtn.dataset.bgLayoutV2){exportBtn.dataset.bgLayoutV2='1';exportBtn.onclick=()=>download(exportData());}
    if(copyBtn&&!copyBtn.dataset.bgLayoutV2){copyBtn.dataset.bgLayoutV2='1';copyBtn.onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(exportData(),null,2));copyBtn.textContent='Copied';setTimeout(()=>copyBtn.textContent='Copy JSON',1200)}catch{}};}
    if(!ed.querySelector('#artImportLayout')){
      const actions=ed.querySelector('.art-editor-actions');if(actions){const b=document.createElement('button');b.id='artImportLayout';b.type='button';b.textContent='Import Art Layout';const input=document.createElement('input');input.type='file';input.accept='application/json,.json';input.hidden=true;b.onclick=()=>input.click();input.onchange=async()=>{const f=input.files?.[0];if(!f)return;try{importData(JSON.parse(await f.text()));b.textContent='Imported';setTimeout(()=>b.textContent='Import Art Layout',1400)}catch{b.textContent='Import Failed';setTimeout(()=>b.textContent='Import Art Layout',1600)}};actions.appendChild(b);actions.appendChild(input);}}
    return true;
  };
  const start=()=>{
    applyAll();let tries=0;const timer=setInterval(()=>{if(installEditorIO()||++tries>100)clearInterval(timer)},100);
    new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}));requestAnimationFrame(applyAll);installEditorIO();}).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
