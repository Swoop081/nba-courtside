/* NBA Courtside v0.9.18 — translucent team logo blended into Foundation card spotlight */
(()=>{
  const decorate=card=>{
    if(!card?.classList?.contains('foundation-card')||card.querySelector('.foundation-bg-team-logo'))return;
    const imgs=[...card.querySelectorAll('img')];
    const logo=imgs.find(img=>!img.classList.contains('cutout-art')&&!img.classList.contains('photo')&&!img.closest('.foundation-art'));
    if(!logo?.src)return;
    const mark=document.createElement('img');
    mark.className='foundation-bg-team-logo';
    mark.src=logo.src;
    mark.alt='';
    mark.setAttribute('aria-hidden','true');
    card.appendChild(mark);
  };
  const scan=root=>{
    if(root?.matches?.('.foundation-card'))decorate(root);
    root?.querySelectorAll?.('.foundation-card').forEach(decorate);
  };
  const start=()=>{
    scan(document);
    const mo=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)})));
    mo.observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
