/* NBA Starting5 v0.11.80 — compact Rising Stars intro: remove explanatory copy and move Play button directly under East vs West. */
(()=>{
  if(window.__starting5RisingStarsIntroLayoutV01180)return;
  window.__starting5RisingStarsIntroLayoutV01180=true;

  const compact=()=>{
    const screen=document.getElementById('seasonRisingStars');
    const host=document.getElementById('s5RisingStarsContent');
    if(!screen||!host||!screen.classList.contains('active'))return;
    const hero=host.querySelector('.s5-rs-hero');
    const btn=host.querySelector('[data-rs-start]');
    if(!hero||!btn)return;
    hero.querySelectorAll('p').forEach(p=>p.remove());
    if(btn.parentElement!==hero)hero.appendChild(btn);
    btn.classList.add('s5-rs-play-in-hero');
  };

  document.addEventListener('click',e=>{
    if(e.target.closest('#s5PlaySeasonGame')){
      setTimeout(compact,0);setTimeout(compact,50);setTimeout(compact,160);
    }
  },true);

  const observer=new MutationObserver(()=>compact());
  const start=()=>{
    const host=document.getElementById('s5RisingStarsContent');
    if(host)observer.observe(host,{childList:true,subtree:true});
    compact();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  const style=document.createElement('style');
  style.textContent=`
    #seasonRisingStars .s5-rs-hero{padding-bottom:18px!important}
    #seasonRisingStars .s5-rs-hero>p{display:none!important}
    #seasonRisingStars .s5-rs-hero .s5-rs-play-in-hero{margin-top:16px!important;margin-bottom:0!important}
    #seasonRisingStars #s5RisingStarsContent>.s5-rs-play{display:none!important}
    #seasonRisingStars .s5-rs-hero>.s5-rs-play{display:block!important}
  `;
  document.head.appendChild(style);
})();
