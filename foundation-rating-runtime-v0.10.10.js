/* NBA Courtside v0.10.11 — tighter glowing Foundation rating in gameplay and full-card preview */
(()=>{
  if(window.__courtsideFoundationRatingRuntimeV01011)return;
  window.__courtsideFoundationRatingRuntimeV01011=true;

  const apply=()=>{
    document.querySelectorAll('.player-card.foundation-card .foundation-rating').forEach(r=>{
      const s=r.querySelector('span');
      const css={
        top:'0',left:'0',right:'auto',bottom:'auto',width:'auto',height:'auto',minWidth:'0',minHeight:'0',
        padding:'4px 0 0 5px',margin:'0',display:'block',background:'none',backgroundColor:'transparent',backgroundImage:'none',
        border:'0',borderRadius:'0',boxShadow:'none',clipPath:'none',webkitClipPath:'none',overflow:'visible',
        backdropFilter:'none',webkitBackdropFilter:'none',filter:'none',color:'#fff',textShadow:'none',zIndex:'40',boxSizing:'border-box'
      };
      Object.entries(css).forEach(([k,v])=>r.style.setProperty(k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v,'important'));
      if(s){
        const scss={display:'block',position:'relative',margin:'0',padding:'0',transform:'none',fontSize:'20cqw',lineHeight:'.82',fontWeight:'1000',letterSpacing:'-.065em',color:'#fff',webkitTextStroke:'.45px rgba(255,255,255,.9)',textShadow:'0 0 2px #fff,0 0 6px var(--team-a),0 0 13px var(--team-a),0 0 24px var(--team-a)',filter:'drop-shadow(0 2px 2px rgba(0,0,0,.85))'};
        Object.entries(scss).forEach(([k,v])=>s.style.setProperty(k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v,'important'));
      }
    });
  };

  const start=()=>{
    apply();
    if(document.body)new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.body,{childList:true,subtree:true});
    setTimeout(apply,0);setTimeout(apply,120);setTimeout(apply,400);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
