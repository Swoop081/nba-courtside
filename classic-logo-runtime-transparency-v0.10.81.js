/* NBA Starting5 v0.10.81 — persistent Classic logo transparency after any later src rewrite */
(()=>{
  if(window.__starting5ClassicRuntimeTransparencyV01081)return;
  window.__starting5ClassicRuntimeTransparencyV01081=true;

  const TARGETS=['sacramento-kings-2002','indiana-pacers-2000','houston-rockets-1995','san-antonio-spurs-2005'];
  const cache=new Map();
  const working=new Map();
  const isTarget=src=>TARGETS.some(k=>String(src||'').includes(k));

  function clean(img){
    const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
    if(!w||!h)return null;
    const c=document.createElement('canvas'); c.width=w; c.height=h;
    const ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(img,0,0,w,h);
    const id=ctx.getImageData(0,0,w,h),d=id.data,idx=(x,y)=>(y*w+x)*4;

    // First pass: strip all obvious white/off-white/checkerboard matte pixels.
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=idx(x,y),r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];
      if(a<8)continue;
      const max=Math.max(r,g,b),min=Math.min(r,g,b),avg=(r+g+b)/3;
      if((max-min<34&&avg>218)||(max-min<58&&avg>236)) d[i+3]=0;
    }

    // Second pass: remove neutral halo/checker cells only when connected to transparency.
    for(let pass=0;pass<12;pass++){
      const kill=[];
      for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
        const i=idx(x,y); if(d[i+3]===0)continue;
        const r=d[i],g=d[i+1],b=d[i+2],avg=(r+g+b)/3,spread=Math.max(r,g,b)-Math.min(r,g,b);
        if(spread>82||avg<135)continue;
        let touch=false;
        for(let yy=-1;yy<=1&&!touch;yy++)for(let xx=-1;xx<=1;xx++)if(xx||yy){if(d[idx(x+xx,y+yy)+3]===0){touch=true;break}}
        if(touch)kill.push(i);
      }
      if(!kill.length)break;
      kill.forEach(i=>d[i+3]=0);
    }

    ctx.putImageData(id,0,0);
    return c.toDataURL('image/png');
  }

  function transparentURL(src){
    if(cache.has(src))return Promise.resolve(cache.get(src));
    if(working.has(src))return working.get(src);
    const p=new Promise(resolve=>{
      const im=new Image();
      im.onload=()=>{try{const out=clean(im)||src;cache.set(src,out);resolve(out)}catch(e){console.warn('Starting5 logo alpha 81',e);resolve(src)}};
      im.onerror=()=>resolve(src);
      im.src=src;
    });
    working.set(src,p);p.finally(()=>working.delete(src));return p;
  }

  async function fix(img){
    if(!img)return;
    const src=img.getAttribute('src')||'';
    if(!isTarget(src))return;
    // Re-run whenever another runtime rewrites the src back to a target asset.
    if(img.dataset.starting5AlphaSource===src && img.dataset.starting5Alpha81==='working')return;
    img.dataset.starting5AlphaSource=src;
    img.dataset.starting5Alpha81='working';
    const out=await transparentURL(src);
    // Only replace if the same source is still present; if another runtime changed it, the observer will process that new source.
    if((img.getAttribute('src')||'')===src && out&&out!==src){
      img.dataset.starting5Alpha81='done';
      img.src=out;
    }
  }

  function scan(root=document){
    if(root?.tagName==='IMG')fix(root);
    root?.querySelectorAll?.('img').forEach(fix);
  }

  function start(){
    scan();
    const mo=new MutationObserver(ms=>ms.forEach(m=>{
      if(m.type==='attributes'&&m.target?.tagName==='IMG')fix(m.target);
      m.addedNodes?.forEach?.(n=>{if(n.nodeType===1)scan(n)});
    }));
    mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    // Safety sweep catches framework property writes that may not survive mutation ordering.
    setInterval(()=>document.querySelectorAll('img').forEach(fix),250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
