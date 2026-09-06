/* NBA Starting5 v0.10.66 — replace NBA Courtside branding everywhere and load local Classic PNG logo repair */
(()=>{
  if(window.__nbaStarting5BrandV01062)return;
  window.__nbaStarting5BrandV01062=true;

  const WORDMARK=`<div class="starting5-wordmark" aria-label="NBA Starting5"><img class="starting5-nba-logo" src="assets/brand/nba-logoman-v0.8.23.png" alt="NBA"><span class="starting5-type">STARTING<span class="starting5-five">5</span></span></div>`;

  function applyMeta(){
    document.title='NBA Starting5';
    const appTitle=document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if(appTitle)appTitle.setAttribute('content','NBA Starting5');
  }

  function replaceWordmarks(){
    document.querySelectorAll('.courtside-wordmark').forEach(el=>{
      if(el.dataset.starting5Branded==='1')return;
      const holder=document.createElement('div');holder.innerHTML=WORDMARK;
      const mark=holder.firstElementChild;
      mark.classList.add(...Array.from(el.classList).filter(c=>c!=='courtside-wordmark'));
      mark.dataset.starting5Branded='1';
      el.replaceWith(mark);
    });
  }

  function replaceText(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{
      const p=n.parentElement;if(!p||p.closest('script,style'))return;
      let s=n.nodeValue;
      if(!s)return;
      s=s.replace(/NBA COURTSIDE/g,'NBA STARTING5').replace(/NBA Courtside/g,'NBA Starting5');
      if(s!==n.nodeValue)n.nodeValue=s;
    });
  }

  function sync(){applyMeta();replaceWordmarks();replaceText();}
  sync();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});
  new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{childList:true,subtree:true});
  window.NBA_STARTING5_BRAND={name:'NBA Starting5',wordmarkHtml:WORDMARK};

  if(!window.__starting5ClassicPngLoaderV01066){
    window.__starting5ClassicPngLoaderV01066=true;
    const t=window.COURTSIDE_ASSET_TOKEN||Date.now();
    document.write('<script src="classic-local-png-logos-v0.10.66.js?t='+t+'"><\\/script>');
  }
})();