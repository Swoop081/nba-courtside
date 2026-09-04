/* NBA Courtside v0.8.58 — Thunder & Lightning player composition refinements */
(()=>{
  const adjustments={
    'kenny-anderson':{x:'50%',y:'108%',s:.88},
    'julius-erving':{x:'50%',y:'108%',s:.82},
    'michael-jordan':{x:'50%',y:'108%',s:.84},
    'deaaron-fox':{x:'50%',y:'108%',s:.82},
    'lonzo-ball':{x:'50%',y:'108%',s:.82}
  };
  players.forEach(p=>{
    const a=adjustments[p.artSlug];
    if(!a)return;
    p.art={...(p.art||{}),x:a.x,y:a.y,s:a.s};
  });
})();
