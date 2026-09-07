/* NBA Starting5 v0.13.0-dev.6 — glowing card-rating presentation, event-driven. */
(()=>{
  if(window.__starting5RatingGlowV01306)return;
  window.__starting5RatingGlowV01306=true;
  const apply=()=>{
    document.querySelectorAll('.player-card .foundation-rating,.foundation-card .foundation-rating').forEach(r=>{
      const s=r.querySelector('span')||r;
      const css={top:'0',left:'0',right:'auto',bottom:'auto',width:'auto',height:'auto',minWidth:'0',minHeight:'0',padding:'4px 0 0 5px',margin:'0',display:'block',background:'none',backgroundColor:'transparent',backgroundImage:'none',border:'0',borderRadius:'0',boxShadow:'none',clipPath:'none',webkitClipPath:'none',overflow:'visible',backdropFilter:'none',webkitBackdropFilter:'none',filter:'none',color:'#fff',zIndex:'40',boxSizing:'border-box'};
      Object.entries(css).forEach(([k,v])=>r.style.setProperty(k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v,'important'));
      const scss={display:'block',position:'relative',margin:'0',padding:'0',transform:'none',fontSize:'20cqw',lineHeight:'.82',fontWeight:'1000',letterSpacing:'-.065em',color:'#fff',webkitTextStroke:'.45px rgba(255,255,255,.95)',textShadow:'0 0 2px #fff,0 0 6px var(--team-a),0 0 13px var(--team-a),0 0 24px var(--team-a),0 0 34px var(--team-a)',filter:'drop-shadow(0 2px 2px rgba(0,0,0,.85))'};
      Object.entries(scss).forEach(([k,v])=>s.style.setProperty(k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v,'important'));
    });
  };
  const schedule=()=>requestAnimationFrame(apply);
  window.__courtsideFoundationRatingApply=apply;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  ['s5:game-start','s5:matchup-start','s5:matchup-resolved','s5:season-hub-opened','s5:allstar-champions-open','s5:rising-stars-intro-open','s5:allstar-intro-open'].forEach(name=>window.addEventListener(name,schedule));
  document.addEventListener('click',schedule,true);
})();