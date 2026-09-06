/* NBA Starting5 v0.11.37 — user-exported edited art layouts */
(()=>{
  if(window.__starting5ArtLayoutEditsV01065)return;
  window.__starting5ArtLayoutEditsV01065=true;

  const E={
    'cj-mccollum':{x:47.2,y:-55,scale:1.39},
    'coby-white':{x:56,y:-14,scale:1.32},
    'jarrett-allen':{x:58,y:-17,scale:1.62},
    'tyrese-haliburton':{x:43,y:-390,scale:2.58},
    'davion-mitchell':{x:49.5,y:14,scale:1.36},
    'magic-johnson':{x:51.5,y:-55,scale:1.75},
    'byron-scott':{x:46.5,y:-28,scale:1.67},
    'james-worthy':{x:49,y:-21,scale:1.85},
    'ac-green':{x:-7,y:-334,scale:3.95},
    'kareem-abdul-jabbar':{x:45.5,y:-38,scale:1.84},
    'derek-fisher':{x:44,y:-21,scale:1.51},
    'kobe-bryant':{x:52.5,y:-10,scale:1.39},
    'rick-fox':{x:53.5,y:-10,scale:1.34},
    'robert-horry-2002':{x:45,y:-66,scale:1.9},
    'shaquille-o-neal':{x:48.5,y:-41,scale:1.41},
    'mario-chalmers':{x:49,y:-45,scale:1.87},
    'dwyane-wade':{x:70,y:-293,scale:1.9},
    'shane-battier':{x:56,y:-383,scale:2.35},
    'lebron-james-2013':{x:43,y:-34,scale:1.59},
    'chris-bosh':{x:48.5,y:-7,scale:1.14},
    'steve-nash':{x:46.5,y:-31,scale:1.37},
    'raja-bell':{x:50,y:0,scale:1.39},
    'shawn-marion':{x:53.5,y:-48,scale:1.9},
    'boris-diaw':{x:43,y:-45,scale:1.44},
    'amare-stoudemire':{x:56,y:6,scale:2.08},
    'tony-parker':{x:63,y:-324,scale:2.12},
    'manu-ginobili':{x:61,y:-355,scale:2.25},
    'bruce-bowen':{x:45.5,y:-355,scale:2.08},
    'tim-duncan':{x:51.5,y:-7,scale:1.24},
    'rasho-nesterovic':{x:58.5,y:-62,scale:1.67},
    'gary-payton':{x:51.5,y:-45,scale:1.57},
    'hersey-hawkins':{x:49,y:-31,scale:1.51},
    'detlef-schrempf':{x:56,y:-62,scale:1.29},
    'shawn-kemp':{x:49,y:-17,scale:1.79},
    'ervin-johnson':{x:51.5,y:-52,scale:1.74},
    'alvin-williams':{x:44,y:-83,scale:1.64},
    'vince-carter':{x:51.5,y:-10,scale:1.39},
    'morris-peterson':{x:59.5,y:6,scale:1.36},
    'jerome-williams':{x:60.5,y:3,scale:1.22},
    'antonio-davis':{x:59.5,y:-69,scale:1.59},
    'john-stockton':{x:51,y:-31,scale:1.51},
    'jeff-hornacek':{x:56,y:-55,scale:1.41},
    'bryon-russell':{x:52.5,y:-31,scale:1.41},
    'karl-malone':{x:60.5,y:-48,scale:1.51},
    'greg-ostertag':{x:51.5,y:-28,scale:1.46},
    'greg-anthony':{x:38,y:-69,scale:2.02},
    'anthony-peeler':{x:45,y:-31,scale:2.2},
    'shareef-abdur-rahim':{x:54.5,y:-62,scale:1.26},
    'george-lynch':{x:49.3,y:-24,scale:1.26},
    'bryant-reeves':{x:39,y:-28,scale:1.7},
    'payton-pritchard':{x:55,y:-552,scale:3.39},
    'egor-demin':{x:43,y:-303,scale:1.94},
    'mookie-blaylock-1993':{x:112,y:-10,scale:4.12},
    'mikki-moore':{x:48.9,y:6,scale:1.06},
    'chauncey-billups':{x:73.5,y:90,scale:3.85}
  };

  window.STARTING5_ART_LAYOUT_EDITS=Object.assign({},window.STARTING5_ART_LAYOUT_EDITS||{},E);

  if(window.COURTSIDE_FOUNDATION_ART_LAYOUT){
    for(const [slug,c] of Object.entries(E)){
      if(window.COURTSIDE_FOUNDATION_ART_LAYOUT[slug]){
        window.COURTSIDE_FOUNDATION_ART_LAYOUT[slug]={...window.COURTSIDE_FOUNDATION_ART_LAYOUT[slug],...c};
      }
    }
  }

  if(typeof cardMarkup!=='function')return;
  const before=cardMarkup;
  cardMarkup=function(p,o={}){
    let html=before(p,o),c=E[p?.artSlug];
    if(!c)return html;
    if(!html.includes('data-art-slug='))html=html.replace('<article class="player-card ',`<article data-art-slug="${p.artSlug}" class="player-card `);
    return html.replace(/<img class="photo cutout-art"([^>]*)>/,(_,attrs)=>{
      attrs=attrs.replace(/\sstyle="[^"]*"/g,'');
      return `<img class="photo cutout-art"${attrs} style="top:${c.y}px!important;left:${c.x}%!important;transform:translateX(-50%) scale(${c.scale})!important;transform-origin:center top!important">`;
    });
  };
})();
