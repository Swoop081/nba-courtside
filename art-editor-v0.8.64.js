/* NBA Starting5 v0.14.2 — low-latency Card Art Editor. */
(()=>{
  const KEY='nbaCourtsideArtEditorV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const round=(v,n=2)=>+Number(v).toFixed(n);
  const teamKey=p=>String(p?.teamId||p?.classicTeam||p?.teamShort||p?.team||'Unknown');
  const teamLabel=p=>String(p?.teamShort||p?.team||'Unknown Team');
  const baseFor=p=>({x:parseFloat(p?.art?.x)||50,y:6,scale:round((Number(p?.art?.s)||.76)*1.30,2)});

  function pool(){
    const src=[];
    try{if(typeof players!=='undefined'&&Array.isArray(players))src.push(...players)}catch{}
    for(const k of ['COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers','COURTSIDE_CLASSIC_PLAYERS'])if(Array.isArray(window[k]))src.push(...window[k]);
    const out=[],seen=new Set();
    for(const p of src){if(!p||!p.artSlug)continue;const key=String(p.id||`${teamKey(p)}|${p.artSlug}`);if(seen.has(key))continue;seen.add(key);out.push(p)}
    return out;
  }

  function applyImg(img,c){
    if(!img||!c)return;
    img.style.setProperty('top',`${c.y}px`,'important');
    img.style.setProperty('left',`${c.x}%`,'important');
    img.style.setProperty('transform',`translate3d(-50%,0,0) scale(${c.scale})`,'important');
    img.style.setProperty('transform-origin','center top','important');
  }

  function ensureStyle(){
    let s=document.getElementById('card-art-editor-style-v0142');
    if(s)return;
    document.getElementById('card-art-editor-style-v01144')?.remove();
    s=document.createElement('style');s.id='card-art-editor-style-v0142';s.textContent=`
      .art-editor-launch{width:100%;margin-top:10px;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:#101720;color:#fff;font-size:15px;font-weight:950}
      .art-editor{position:fixed;inset:0;z-index:10000;background:#07090d;overflow:auto;padding:max(14px,env(safe-area-inset-top)) 14px calc(24px + env(safe-area-inset-bottom));color:#fff;-webkit-overflow-scrolling:touch}
      .art-editor.hidden{display:none!important}.art-editor-body{max-width:560px;margin:0 auto}.art-editor-head{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:5;background:#07090d;padding:4px 0 12px}.art-editor-head h2{margin:0;font-size:20px}.art-editor-close{min-width:52px;height:44px}
      .art-editor-selectors{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}.art-editor-selectors #artPlayerSelect{grid-column:1/-1}.art-editor select{width:100%;min-height:44px;border-radius:12px;background:#151b25;color:#fff;border:1px solid rgba(255,255,255,.14);padding:0 10px;font-weight:850}
      .art-editor-nav{display:grid;grid-template-columns:54px 1fr 54px;gap:8px;align-items:center;margin-bottom:12px}.art-editor-nav button{height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:#151b25;color:#fff;font-size:25px}.art-editor-player{text-align:center;font-size:16px;font-weight:950}.art-editor-player small{display:block;margin-top:3px;color:#9da6b4;font-size:10px}
      .art-editor-preview{width:min(72vw,290px);margin:0 auto 16px;contain:layout paint style}.art-editor-preview .player-card{width:100%!important;pointer-events:none!important;contain:layout paint style}.art-editor-preview .foundation-art,.art-editor-preview .art-stage{contain:layout paint}.art-editor-preview .foundation-art img,.art-editor-preview .cutout-art{pointer-events:auto!important;touch-action:none!important;cursor:grab;will-change:transform,left,top;-webkit-user-drag:none;user-select:none;-webkit-user-select:none;backface-visibility:hidden;transform-style:preserve-3d}.art-editor-preview .foundation-art img:active,.art-editor-preview .cutout-art:active{cursor:grabbing}
      .art-editor.is-dragging{overflow:hidden!important;overscroll-behavior:none}.art-editor.is-dragging .art-editor-preview *{animation-play-state:paused!important;transition:none!important}.art-editor.is-dragging .art-editor-preview .beam,.art-editor.is-dragging .art-editor-preview .prism,.art-editor.is-dragging .art-editor-preview .spark,.art-editor.is-dragging .art-editor-preview .foil-field,.art-editor.is-dragging .art-editor-preview .foreground-energy,.art-editor.is-dragging .art-editor-preview .holo-grid,.art-editor.is-dragging .art-editor-preview .rarity-burst{visibility:hidden!important}.art-editor.is-dragging .art-editor-preview .foundation-art img,.art-editor.is-dragging .art-editor-preview .cutout-art{filter:none!important;box-shadow:none!important}
      .art-editor-controls{display:grid;gap:12px;background:#10151d;border:1px solid rgba(255,255,255,.11);border-radius:18px;padding:14px}.art-control label{display:flex;justify-content:space-between;font-size:13px;font-weight:900;margin-bottom:6px}.art-control output{color:#f7b928}.art-control input[type=range]{width:100%;accent-color:#f7b928}
      .art-editor-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.art-editor-actions button{min-height:46px;border-radius:13px;border:1px solid rgba(255,255,255,.16);background:#171e29;color:#fff;font-weight:900}.art-editor-actions .primary{background:#f7b928;color:#080a0d;border-color:#f7b928}.art-editor-progress{text-align:center;margin:10px 0 0;color:#9da6b4;font-size:11px}.art-editor-note{font-size:11px;color:#adb5c2;text-align:center;line-height:1.4}
    `;document.head.appendChild(s);
  }

  function buildEditor(){
    const all=pool();if(!all.length||typeof cardMarkup!=='function')return false;ensureStyle();
    let btn=document.getElementById('cardArtEditorBtn');const options=document.querySelector('.options-card');
    if(!btn&&options){btn=document.createElement('button');btn.id='cardArtEditorBtn';btn.type='button';btn.className='art-editor-launch';btn.textContent='Card Art Editor';options.appendChild(btn)}
    let ed=document.getElementById('cardArtEditor');
    if(!ed){
      ed=document.createElement('section');ed.id='cardArtEditor';ed.className='art-editor hidden';ed.innerHTML=`<div class="art-editor-body"><div class="art-editor-head"><h2>Card Art Editor</h2><button id="artEditorClose" class="ghost-btn art-editor-close" type="button">Done</button></div><div class="art-editor-selectors"><select id="artSetSelect"></select><select id="artTeamSelect"></select><select id="artPlayerSelect"></select></div><div class="art-editor-nav"><button id="artPrev" type="button">‹</button><div id="artPlayerName" class="art-editor-player"></div><button id="artNext" type="button">›</button></div><div id="artPreview" class="art-editor-preview"></div><div class="art-editor-controls"><div class="art-control"><label>X position <output id="artXOut"></output></label><input id="artX" type="range" min="-25" max="125" step="0.5"></div><div class="art-control"><label>Y position <output id="artYOut"></output></label><input id="artY" type="range" min="-300" max="300" step="1"></div><div class="art-control"><label>Size <output id="artScaleOut"></output></label><input id="artScale" type="range" min="0.50" max="4.50" step="0.01"></div></div><div class="art-editor-actions"><button id="artReset" type="button">Reset This Card</button><button id="artCopy" type="button">Copy JSON</button><button id="artExport" class="primary" type="button">Export Art Layout</button><button id="artClearAll" type="button">Clear All Edits</button></div><div id="artProgress" class="art-editor-progress"></div><p class="art-editor-note">Drag the player directly on the card or use the sliders. Changes save when you release.</p></div>`;document.body.appendChild(ed);

      const setSel=ed.querySelector('#artSetSelect'),teamSel=ed.querySelector('#artTeamSelect'),playerSel=ed.querySelector('#artPlayerSelect'),preview=ed.querySelector('#artPreview'),nameEl=ed.querySelector('#artPlayerName'),progress=ed.querySelector('#artProgress'),x=ed.querySelector('#artX'),y=ed.querySelector('#artY'),sc=ed.querySelector('#artScale'),xo=ed.querySelector('#artXOut'),yo=ed.querySelector('#artYOut'),so=ed.querySelector('#artScaleOut');
      let list=[...all],idx=0,draft=null,drag=null;
      const sets=['All Sets',...new Set(all.map(p=>p.set||'Classic Teams'))];setSel.innerHTML=sets.map(v=>`<option value="${v}">${v}</option>`).join('');
      const current=()=>list[idx]||all[0],setPool=()=>setSel.value==='All Sets'?[...all]:all.filter(p=>(p.set||'Classic Teams')===setSel.value),filtered=()=>teamSel.value==='All Teams'?setPool():setPool().filter(p=>teamKey(p)===teamSel.value),saved=p=>read()[p.artSlug]||baseFor(p);
      const syncOut=()=>{x.value=draft.x;y.value=draft.y;sc.value=draft.scale;xo.textContent=`${draft.x.toFixed(1)}%`;yo.textContent=`${draft.y.toFixed(0)}px`;so.textContent=`${draft.scale.toFixed(2)}×`};
      const save=()=>{const p=current(),store=read();store[p.artSlug]={x:round(draft.x,1),y:round(draft.y,0),scale:round(draft.scale,2)};write(store);progress.textContent=`${Object.keys(store).length} of ${all.length} cards edited`;document.querySelectorAll(`.player-card[data-art-slug="${p.artSlug}"] .cutout-art,.player-card[data-art-slug="${p.artSlug}"] .foundation-art img`).forEach(img=>applyImg(img,store[p.artSlug]))};

      function bindDrag(img,stage){
        if(!img||!stage)return;let raf=0,pendingX=0,pendingY=0;
        const paint=()=>{raf=0;if(!drag)return;draft.x=clamp(drag.x+(pendingX-drag.sx)/drag.w*100,-25,125);draft.y=clamp(drag.y+(pendingY-drag.sy),-300,300);applyImg(img,draft);xo.textContent=`${draft.x.toFixed(1)}%`;yo.textContent=`${draft.y.toFixed(0)}px`};
        img.onpointerdown=e=>{e.preventDefault();e.stopPropagation();img.setPointerCapture?.(e.pointerId);const rect=stage.getBoundingClientRect();drag={pointerId:e.pointerId,sx:e.clientX,sy:e.clientY,x:draft.x,y:draft.y,w:rect.width||1,filter:img.style.getPropertyValue('filter'),filterPriority:img.style.getPropertyPriority('filter')};pendingX=e.clientX;pendingY=e.clientY;ed.classList.add('is-dragging');img.style.setProperty('filter','none','important')};
        img.onpointermove=e=>{if(!drag||e.pointerId!==drag.pointerId)return;e.preventDefault();pendingX=e.clientX;pendingY=e.clientY;if(!raf)raf=requestAnimationFrame(paint)};
        const finish=e=>{if(!drag)return;if(e&&e.pointerId!==drag.pointerId)return;if(e){pendingX=e.clientX;pendingY=e.clientY;paint()}const {filter,filterPriority}=drag;drag=null;if(raf){cancelAnimationFrame(raf);raf=0}ed.classList.remove('is-dragging');x.value=draft.x;y.value=draft.y;if(filter)img.style.setProperty('filter',filter,filterPriority||'important');else img.style.removeProperty('filter');save()};
        img.onpointerup=finish;img.onpointercancel=finish;img.onlostpointercapture=()=>{if(drag)finish()};
      }

      const render=()=>{const p=current();if(!p)return;playerSel.value=p.artSlug;nameEl.innerHTML=`${p.name}<small>${p.set||'Classic Teams'} · ${p.teamShort||p.team||''}</small>`;preview.innerHTML=cardMarkup(p,{eager:true});draft=saved(p);syncOut();requestAnimationFrame(()=>{const img=preview.querySelector('.foundation-art img,.cutout-art'),stage=preview.querySelector('.foundation-art,.art-stage');applyImg(img,draft);bindDrag(img,stage);window.applyStarting5PlayerGlow?.()})};
      const rebuildTeams=()=>{const m=new Map();setPool().forEach(p=>m.set(teamKey(p),teamLabel(p)));teamSel.innerHTML='<option value="All Teams">All Teams</option>'+[...m].sort((a,b)=>a[1].localeCompare(b[1])).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')};
      const rebuildPlayers=keep=>{list=filtered();playerSel.innerHTML=list.map(p=>`<option value="${p.artSlug}">${p.name}</option>`).join('');idx=Math.max(0,list.findIndex(p=>p.artSlug===keep));render()};
      let sliderRaf=0;const sliderPaint=()=>{sliderRaf=0;draft={x:+x.value,y:+y.value,scale:+sc.value};applyImg(preview.querySelector('.foundation-art img,.cutout-art'),draft);xo.textContent=`${draft.x.toFixed(1)}%`;yo.textContent=`${draft.y.toFixed(0)}px`;so.textContent=`${draft.scale.toFixed(2)}×`};
      [x,y,sc].forEach(el=>{el.addEventListener('input',()=>{if(!sliderRaf)sliderRaf=requestAnimationFrame(sliderPaint)},{passive:true});el.addEventListener('change',()=>{if(sliderRaf){cancelAnimationFrame(sliderRaf);sliderRaf=0;sliderPaint()}save()})});
      setSel.onchange=()=>{const keep=current()?.artSlug;rebuildTeams();rebuildPlayers(keep)};teamSel.onchange=()=>rebuildPlayers(current()?.artSlug);playerSel.onchange=()=>{idx=list.findIndex(p=>p.artSlug===playerSel.value);render()};
      ed.querySelector('#artPrev').onclick=()=>{if(list.length){idx=(idx-1+list.length)%list.length;render()}};ed.querySelector('#artNext').onclick=()=>{if(list.length){idx=(idx+1)%list.length;render()}};
      ed.querySelector('#artReset').onclick=()=>{const p=current(),store=read();delete store[p.artSlug];write(store);render();progress.textContent=`${Object.keys(store).length} of ${all.length} cards edited`};
      const exportData=()=>{const store=read(),cards={};all.forEach(p=>cards[p.artSlug]={...(store[p.artSlug]||baseFor(p)),edited:!!store[p.artSlug],name:p.name,set:p.set||'Classic Teams',team:p.teamShort||p.team});return {format:'NBA Starting5 Art Layout',version:2,gameVersion:'0.14.2',exportedAt:new Date().toISOString(),cards}};
      ed.querySelector('#artCopy').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(exportData(),null,2))}catch{}};
      ed.querySelector('#artExport').onclick=()=>{const blob=new Blob([JSON.stringify(exportData(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nba-starting5-art-layout.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
      ed.querySelector('#artClearAll').onclick=()=>{if(confirm('Clear every Card Art Editor adjustment on this device?')){localStorage.removeItem(KEY);render()}};
      ed.querySelector('#artEditorClose').onclick=()=>{ed.classList.remove('is-dragging');ed.classList.add('hidden')};
      rebuildTeams();rebuildPlayers();progress.textContent=`${Object.keys(read()).length} of ${all.length} cards edited`;
    }
    if(btn){btn.textContent='Card Art Editor';btn.onclick=()=>{document.getElementById('optionsSheet')?.classList.add('hidden');ed.classList.remove('hidden');window.applyStarting5PlayerGlow?.()}};
    window.openStarting5CardEditor=()=>{ed.classList.remove('hidden');window.applyStarting5PlayerGlow?.()};return true;
  }
  function boot(){let n=0;const run=()=>{if(buildEditor()||++n>80)return;setTimeout(run,100)};run()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
