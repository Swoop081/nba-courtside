/* NBA Starting5 v0.14.3 — labelled Card Art Editor team filter. */
(()=>{
  if(window.__starting5CardEditorTeamDropdownV0143)return;
  window.__starting5CardEditorTeamDropdownV0143=true;
  function install(){
    const ed=document.getElementById('cardArtEditor');
    const team=document.getElementById('artTeamSelect');
    const set=document.getElementById('artSetSelect');
    const player=document.getElementById('artPlayerSelect');
    const wrap=ed?.querySelector('.art-editor-selectors');
    if(!ed||!team||!set||!player||!wrap)return false;
    if(wrap.dataset.labelled==='1')return true;
    wrap.dataset.labelled='1';
    const make=(label,select,cls)=>{
      const box=document.createElement('label');box.className='art-editor-filter '+cls;
      const title=document.createElement('span');title.className='art-editor-filter-label';title.textContent=label;
      select.parentNode.insertBefore(box,select);box.appendChild(title);box.appendChild(select);
    };
    make('SET',set,'art-editor-filter-set');
    make('TEAM',team,'art-editor-filter-team');
    make('PLAYER',player,'art-editor-filter-player');
    const style=document.createElement('style');style.id='card-editor-team-dropdown-style-v0143';style.textContent=`
      .art-editor-selectors{display:grid!important;grid-template-columns:1fr!important;gap:9px!important}
      .art-editor-filter{display:block;min-width:0}
      .art-editor-filter-label{display:block;margin:0 0 4px 2px;color:#8f99a8;font-size:9px;font-weight:1000;letter-spacing:.16em}
      .art-editor-filter select{width:100%!important;min-height:46px!important}
      .art-editor-filter-team select{border-color:rgba(247,185,40,.5)!important;background:#171d25!important;color:#fff!important;font-size:15px!important}
      .art-editor-filter-player{grid-column:1/-1}
    `;document.head.appendChild(style);
    return true;
  }
  function boot(){let n=0;const run=()=>{if(install()||++n>100)return;setTimeout(run,100)};run()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();