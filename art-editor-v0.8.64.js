/* NBA Courtside v0.8.64 — in-game Card Art Editor */
(() => {
  const KEY='nbaCourtsideArtEditorV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const round=(v,n=2)=>+Number(v).toFixed(n);
  const savedFor=slug=>read()[slug]||null;
  const baseFor=p=>({x:parseFloat(p?.art?.x)||50,y:6,scale:round((Number(p?.art?.s)||.76)*1.30,2)});

  function overrideImageMarkup(html,p){
    const c=savedFor(p.artSlug);
    if(!c)return html;
    html=html.replace('<article class="player-card ',`<article data-art-slug="${p.artSlug}" class="player-card `);
    return html.replace(/<img class="photo cutout-art"([^>]*)>/,(_,attrs)=>{
      attrs=attrs.replace(/\sstyle="[^"]*"/g,'');
      return `<img class="photo cutout-art"${attrs} style="top:${c.y}px!important;left:${c.x}%!important;transform:translateX(-50%) scale(${c.scale})!important;transform-origin:center top!important">`;
    });
  }

  const installCardAuthority=()=>{
    if(window.__courtsideArtEditorAuthority||typeof cardMarkup!=='function')return;
    window.__courtsideArtEditorAuthority=true;
    const before=cardMarkup;
    cardMarkup=function(p,o={}){
      let html=before(p,o);
      if(!html.includes('data-art-slug='))html=html.replace('<article class="player-card ',`<article data-art-slug="${p.artSlug}" class="player-card `);
      return overrideImageMarkup(html,p);
    };
  };

  function applyConfigToImage(img,c){
    if(!img||!c)return;
    img.style.setProperty('top',`${c.y}px`,'important');
    img.style.setProperty('left',`${c.x}%`,'important');
    img.style.setProperty('transform',`translateX(-50%) scale(${c.scale})`,'important');
    img.style.setProperty('transform-origin','center top','important');
  }

  function syncVisible(slug,c){
    document.querySelectorAll(`.player-card[data-art-slug="${slug}"] .cutout-art`).forEach(img=>applyConfigToImage(img,c));
  }

  function effectiveFromPreview(img,stage,p){
    const fallback=baseFor(p);
    if(!img||!stage)return fallback;
    const cs=getComputedStyle(img),ss=getComputedStyle(stage);
    let x=fallback.x,y=parseFloat(cs.top),scale=fallback.scale;
    const left=parseFloat(cs.left),w=parseFloat(ss.width)||stage.clientWidth;
    if(Number.isFinite(left)&&w>0)x=left/w*100;
    if(!Number.isFinite(y))y=fallback.y;
    try{const m=new DOMMatrixReadOnly(cs.transform);if(Number.isFinite(m.a)&&m.a>0)scale=m.a;}catch{}
    return {x:round(x,1),y:round(y,1),scale:round(scale,2)};
  }

  const css=`
  .art-editor-launch{width:100%;margin-top:10px;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:#101720;color:#fff;font-size:15px;font-weight:950}
  .art-editor{position:fixed;inset:0;z-index:400;background:#07090d;overflow:auto;padding:max(14px,env(safe-area-inset-top)) 14px calc(22px + env(safe-area-inset-bottom));color:#fff}
  .art-editor.hidden{display:none!important}.art-editor-head{display:flex;align-items:center;justify-content:space-between;gap:10px;position:sticky;top:0;z-index:5;background:rgba(7,9,13,.96);padding:4px 0 12px}.art-editor-head h2{font-size:20px;margin:0}.art-editor-close{min-width:48px;height:44px}
  .art-editor-selectors{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}.art-editor select{width:100%;min-height:44px;border-radius:12px;background:#151b25;color:#fff;border:1px solid rgba(255,255,255,.14);padding:0 10px;font-weight:850}
  .art-editor-nav{display:grid;grid-template-columns:54px 1fr 54px;align-items:center;gap:8px;margin-bottom:12px}.art-editor-nav button{height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:#151b25;color:#fff;font-size:25px}.art-editor-player{text-align:center;font-weight:950;font-size:16px}.art-editor-player small{display:block;color:#9da6b4;font-size:10px;margin-top:3px}
  .art-editor-preview{width:min(72vw,290px);margin:0 auto 16px}.art-editor-preview .player-card{width:100%!important;pointer-events:none!important}.art-editor-preview .cutout-art{pointer-events:auto!important;touch-action:none!important;cursor:grab}.art-editor-preview .cutout-art:active{cursor:grabbing}
  .art-editor-controls{display:grid;gap:12px;background:#10151d;border:1px solid rgba(255,255,255,.11);border-radius:18px;padding:14px}.art-control label{display:flex;justify-content:space-between;font-size:13px;font-weight:900;margin-bottom:6px}.art-control output{color:#f7b928}.art-control input[type=range]{width:100%;accent-color:#f7b928}.art-editor-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.art-editor-actions button{min-height:46px;border-radius:13px;border:1px solid rgba(255,255,255,.16);background:#171e29;color:#fff;font-weight:900}.art-editor-actions .primary{background:#f7b928;color:#080a0d;border-color:#f7b928}.art-editor-progress{text-align:center;margin:10px 0 0;color:#9da6b4;font-size:11px}.art-editor-note{font-size:11px;line-height:1.4;color:#adb5c2;margin:10px 2px 0;text-align:center}
  @media(min-width:700px){.art-editor-body{max-width:560px;margin:auto}}
  `;

  function installUI(){
    installCardAuthority();
    const options=document.querySelector('.options-card');
    if(!options||document.getElementById('cardArtEditorBtn'))return;
    const style=document.createElement('style');style.id='card-art-editor-style-v0864';style.textContent=css;document.head.appendChild(style);
    const btn=document.createElement('button');btn.id='cardArtEditorBtn';btn.type='button';btn.className='art-editor-launch';btn.textContent='Card Art Editor';options.appendChild(btn);

    const ed=document.createElement('section');ed.id='cardArtEditor';ed.className='art-editor hidden';ed.innerHTML=`<div class="art-editor-body"><div class="art-editor-head"><div><h2>Card Art Editor</h2></div><button id="artEditorClose" class="ghost-btn art-editor-close" type="button">Done</button></div><div class="art-editor-selectors"><select id="artSetSelect"></select><select id="artPlayerSelect"></select></div><div class="art-editor-nav"><button id="artPrev" type="button">‹</button><div id="artPlayerName" class="art-editor-player"></div><button id="artNext" type="button">›</button></div><div id="artPreview" class="art-editor-preview"></div><div class="art-editor-controls"><div class="art-control"><label>X position <output id="artXOut"></output></label><input id="artX" type="range" min="20" max="80" step="0.5"></div><div class="art-control"><label>Y position <output id="artYOut"></output></label><input id="artY" type="range" min="-30" max="140" step="1"></div><div class="art-control"><label>Size <output id="artScaleOut"></output></label><input id="artScale" type="range" min="0.50" max="2.20" step="0.01"></div></div><div class="art-editor-actions"><button id="artReset" type="button">Reset This Card</button><button id="artCopy" type="button">Copy JSON</button><button id="artExport" class="primary" type="button">Export Art Layout</button><button id="artClearAll" type="button">Clear All Edits</button></div><div id="artProgress" class="art-editor-progress"></div><p class="art-editor-note">Drag the player directly on the card to move them. Use Size for precise scaling. Changes save immediately on this device and apply to Catalogue and gameplay.</p></div>`;document.body.appendChild(ed);

    const setSel=ed.querySelector('#artSetSelect'),playerSel=ed.querySelector('#artPlayerSelect'),preview=ed.querySelector('#artPreview'),nameEl=ed.querySelector('#artPlayerName'),x=ed.querySelector('#artX'),y=ed.querySelector('#artY'),sc=ed.querySelector('#artScale'),xo=ed.querySelector('#artXOut'),yo=ed.querySelector('#artYOut'),so=ed.querySelector('#artScaleOut'),progress=ed.querySelector('#artProgress');
    let list=[...players],idx=0,draft=null,drag=null;
    const sets=['All Sets',...new Set(players.map(p=>p.set))];setSel.innerHTML=sets.map(s=>`<option>${s}</option>`).join('');
    const current=()=>list[idx]||players[0];
    const updateProgress=()=>{const count=Object.keys(read()).length;progress.textContent=`${count} of ${players.length} cards edited`};
    const updateOutputs=()=>{xo.textContent=`${draft.x.toFixed(1)}%`;yo.textContent=`${draft.y.toFixed(0)}px`;so.textContent=`${draft.scale.toFixed(2)}×`;x.value=draft.x;y.value=draft.y;sc.value=draft.scale;};
    const save=()=>{const p=current(),store=read();store[p.artSlug]={x:round(draft.x,1),y:round(draft.y,0),scale:round(draft.scale,2)};write(store);syncVisible(p.artSlug,store[p.artSlug]);updateProgress();};
    const renderPreview=()=>{
      const p=current();if(!p)return;nameEl.innerHTML=`${p.name}<small>${p.set} · ${p.teamShort}</small>`;
      playerSel.value=p.artSlug;preview.innerHTML=cardMarkup(p,{eager:true});
      requestAnimationFrame(()=>{const img=preview.querySelector('.cutout-art'),stage=preview.querySelector('.art-stage');draft=savedFor(p.artSlug)||effectiveFromPreview(img,stage,p);updateOutputs();if(savedFor(p.artSlug))applyConfigToImage(img,draft);bindDrag(img,stage);});
    };
    const rebuildPlayers=(keepSlug)=>{const s=setSel.value;list=s==='All Sets'?[...players]:players.filter(p=>p.set===s);playerSel.innerHTML=list.map(p=>`<option value="${p.artSlug}">${p.name}</option>`).join('');idx=Math.max(0,list.findIndex(p=>p.artSlug===keepSlug));if(idx<0)idx=0;renderPreview();};
    function bindDrag(img,stage){if(!img||!stage)return;img.onpointerdown=e=>{e.preventDefault();img.setPointerCapture?.(e.pointerId);drag={sx:e.clientX,sy:e.clientY,x:draft.x,y:draft.y,w:stage.clientWidth||1};};img.onpointermove=e=>{if(!drag)return;draft.x=clamp(drag.x+(e.clientX-drag.sx)/drag.w*100,20,80);draft.y=clamp(drag.y+(e.clientY-drag.sy),-30,140);applyConfigToImage(img,draft);updateOutputs();};img.onpointerup=img.onpointercancel=()=>{if(drag){drag=null;save();}};}
    const sliderChanged=()=>{draft={x:+x.value,y:+y.value,scale:+sc.value};const img=preview.querySelector('.cutout-art');applyConfigToImage(img,draft);updateOutputs();save();};[x,y,sc].forEach(el=>el.addEventListener('input',sliderChanged));
    setSel.onchange=()=>rebuildPlayers();playerSel.onchange=()=>{idx=list.findIndex(p=>p.artSlug===playerSel.value);renderPreview();};ed.querySelector('#artPrev').onclick=()=>{idx=(idx-1+list.length)%list.length;renderPreview();};ed.querySelector('#artNext').onclick=()=>{idx=(idx+1)%list.length;renderPreview();};
    ed.querySelector('#artReset').onclick=()=>{const p=current(),store=read();delete store[p.artSlug];write(store);renderPreview();updateProgress();};
    const exportData=()=>{const store=read(),cards={};players.forEach(p=>{cards[p.artSlug]={...(store[p.artSlug]||baseFor(p)),edited:!!store[p.artSlug],name:p.name,set:p.set,team:p.teamShort};});return {format:'NBA Courtside Art Layout',version:1,gameVersion:'0.8.64',exportedAt:new Date().toISOString(),cards};};
    ed.querySelector('#artExport').onclick=()=>{const data=JSON.stringify(exportData(),null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nba-courtside-art-layout.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);};
    ed.querySelector('#artCopy').onclick=async()=>{const text=JSON.stringify(exportData(),null,2);try{await navigator.clipboard.writeText(text);ed.querySelector('#artCopy').textContent='Copied';setTimeout(()=>ed.querySelector('#artCopy').textContent='Copy JSON',1200)}catch{}};
    ed.querySelector('#artClearAll').onclick=()=>{if(confirm('Clear every Card Art Editor adjustment on this device?')){localStorage.removeItem(KEY);renderPreview();updateProgress();}};
    btn.onclick=()=>{document.getElementById('optionsSheet')?.classList.add('hidden');ed.classList.remove('hidden');rebuildPlayers(current()?.artSlug);updateProgress();};
    ed.querySelector('#artEditorClose').onclick=()=>ed.classList.add('hidden');
    rebuildPlayers();updateProgress();
  }

  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',()=>setTimeout(installUI,80));else setTimeout(installUI,80);
})();