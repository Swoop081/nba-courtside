/* NBA Starting5 v0.10.80 — runtime edge-matte removal for four stubborn Classic logos */
(()=>{
  if(window.__starting5ClassicRuntimeTransparencyV01080)return;
  window.__starting5ClassicRuntimeTransparencyV01080=true;

  const TARGETS=[
    'sacramento-kings-2002',
    'indiana-pacers-2000',
    'houston-rockets-1995',
    'san-antonio-spurs-2005'
  ];
  const cache=new Map();
  const working=new Map();
  const isTarget=src=>TARGETS.some(k=>String(src||'').includes(k));

  function connectedMatteToTransparent(img){
    const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
    if(!w||!h)return null;
    const c=document.createElement('canvas'); c.width=w; c.height=h;
    const ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(img,0,0,w,h);
    const id=ctx.getImageData(0,0,w,h),d=id.data;
    const idx=(x,y)=>(y*w+x)*4;
    const seen=new Uint8Array(w*h);
    const qx=new Int32Array(w*h*2), qy=new Int32Array(w*h*2);
    let head=0,tail=0;
    const push=(x,y)=>{if(x<0||y<0||x>=w||y>=h)return;const p=y*w+x;if(seen[p])return;seen[p]=1;qx[tail]=x;qy[tail]=y;tail++;};
    for(let x=0;x<w;x++){push(x,0);push(x,h-1)}
    for(let y=0;y<h;y++){push(0,y);push(w-1,y)}

    const bgLike=(r,g,b,a)=>{
      if(a<12)return true;
      const max=Math.max(r,g,b),min=Math.min(r,g,b),avg=(r+g+b)/3;
      // Covers white/off-white/grey checkerboard mattes without entering saturated logo colours.
      return (max-min<78 && avg>128) || (avg>214 && max-min<125);
    };

    while(head<tail){
      const x=qx[head],y=qy[head++],i=idx(x,y);
      const r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];
      if(!bgLike(r,g,b,a))continue;
      d[i+3]=0;
      // 8-neighbour fill handles checkerboard cells and anti-aliased joins.
      push(x+1,y);push(x-1,y);push(x,y+1);push(x,y-1);
      push(x+1,y+1);push(x+1,y-1);push(x-1,y+1);push(x-1,y-1);
    }

    // Remove a thin residual neutral halo only where it touches transparent pixels.
    for(let pass=0;pass<4;pass++){
      const kill=[];
      for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
        const i=idx(x,y); if(d[i+3]===0)continue;
        const r=d[i],g=d[i+1],b=d[i+2],avg=(r+g+b)/3;
        if(Math.max(r,g,b)-Math.min(r,g,b)>88||avg<145)continue;
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
      im.onload=()=>{
        try{const out=connectedMatteToTransparent(im)||src;cache.set(src,out);resolve(out)}catch(e){console.warn('Starting5 logo transparency',e);resolve(src)}
      };
      im.onerror=()=>resolve(src);
      im.src=src;
    });
    working.set(src,p);p.finally(()=>working.delete(src));return p;
  }

  async function fix(img){
    if(!img||img.dataset.starting5Alpha80==='1')return;
    const src=img.getAttribute('src')||'';
    if(!isTarget(src))return;
    img.dataset.starting5Alpha80='1';
    const out=await transparentURL(src);
    if(out&&out!==src)img.src=out;
  }
  function scan(root=document){
    if(root?.tagName==='IMG')fix(root);
    root?.querySelectorAll?.('img').forEach(fix);
  }
  function start(){
    scan();
    new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}))).observe(document.body,{childList:true,subtree:true});
    // Existing catalogue cards/header may have their src changed after initial insertion.
    setInterval(()=>document.querySelectorAll('img').forEach(img=>{if(isTarget(img.getAttribute('src')||'')&&img.dataset.starting5Alpha80!=='1')fix(img)}),500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
