/* NBA Courtside v0.8.82 — Interceptors best-season statistical ratings */
(()=>{
  const O={
    'al-horford':{season:'2016–17',scoring:17,dunks:18,three:16,rebounding:19,passing:18,blocks:17,steals:14},
    'yi-jianlian':{season:'2009–10',scoring:16,dunks:20,three:9,rebounding:20,passing:8,blocks:15,steals:13},
    'patrick-ewing':{season:'1989–90',scoring:27,dunks:28,three:1,rebounding:26,passing:12,blocks:30,steals:15},
    'moses-malone':{season:'1982–83',scoring:24,dunks:29,three:1,rebounding:30,passing:9,blocks:22,steals:16},
    'marc-gasol':{season:'2018–19',scoring:14,dunks:15,three:15,rebounding:19,passing:16,blocks:14,steals:15},
    'dennis-rodman':{season:'1996–97',scoring:11,dunks:25,three:7,rebounding:30,passing:14,blocks:9,steals:12},
    'lebron-james':{season:'2009–10',scoring:28,dunks:30,three:18,rebounding:20,passing:26,blocks:15,steals:20},
    'jalen-duren':{season:'2025–26',scoring:21,dunks:28,three:1,rebounding:25,passing:11,blocks:13,steals:14},
    'rik-smits':{season:'1995–96',scoring:20,dunks:20,three:1,rebounding:19,passing:11,blocks:12,steals:9},
    'glenn-robinson':{season:'1997–98',scoring:24,dunks:26,three:10,rebounding:17,passing:13,blocks:12,steals:17},
    'steve-smith':{season:'1997–98',scoring:21,dunks:20,three:16,rebounding:14,passing:16,blocks:10,steals:15},
    'larry-johnson':{season:'1992–93',scoring:23,dunks:28,three:8,rebounding:25,passing:17,blocks:9,steals:12},
    'udonis-haslem':{season:'2004–05',scoring:15,dunks:20,three:1,rebounding:23,passing:10,blocks:11,steals:14},
    'jameer-nelson':{season:'2008–09',scoring:19,dunks:12,three:22,rebounding:13,passing:19,blocks:6,steals:17},
    'rod-strickland':{season:'1997–98',scoring:20,dunks:16,three:8,rebounding:16,passing:30,blocks:9,steals:21},
    'dikembe-mutombo':{season:'1995–96',scoring:15,dunks:24,three:1,rebounding:27,passing:10,blocks:30,steals:11},
    'kevin-garnett':{season:'2003–04',scoring:24,dunks:28,three:7,rebounding:30,passing:18,blocks:24,steals:20},
    'alex-caruso':{season:'2024–25',scoring:12,dunks:20,three:15,rebounding:12,passing:13,blocks:12,steals:20},
    'brandon-roy':{season:'2008–09',scoring:23,dunks:24,three:15,rebounding:15,passing:19,blocks:9,steals:16},
    'lauri-markkanen':{season:'2022–23',scoring:25,dunks:24,three:26,rebounding:22,passing:11,blocks:12,steals:12},
    'draymond-green':{season:'2015–16',scoring:17,dunks:18,three:16,rebounding:23,passing:23,blocks:18,steals:20},
    'chris-paul':{season:'2013–14',scoring:21,dunks:10,three:17,rebounding:15,passing:30,blocks:6,steals:27},
    'metta-world-peace':{season:'2009–10',scoring:15,dunks:21,three:17,rebounding:15,passing:14,blocks:9,steals:19},
    'shawn-marion':{season:'2005–06',scoring:23,dunks:28,three:16,rebounding:27,passing:11,blocks:20,steals:23},
    'chris-webber':{season:'2000–01',scoring:26,dunks:29,three:1,rebounding:26,passing:17,blocks:20,steals:18},
    'jason-terry':{season:'2008–09',scoring:21,dunks:16,three:22,rebounding:11,passing:15,blocks:9,steals:18},
    'hakeem-olajuwon':{season:'1993–94',scoring:26,dunks:28,three:7,rebounding:27,passing:15,blocks:30,steals:20},
    'shane-battier':{season:'2005–06',scoring:14,dunks:14,three:14,rebounding:16,passing:11,blocks:18,steals:16},
    'derik-queen':{season:'2025–26',scoring:16,dunks:24,three:9,rebounding:19,passing:15,blocks:14,steals:15},
    'bruce-bowen':{season:'2004–05',scoring:13,dunks:12,three:16,rebounding:13,passing:10,blocks:11,steals:13}
  };
  players.filter(p=>p.set==='Interceptors').forEach(p=>{const x=O[p.artSlug];if(!x)return;p.season=x.season;p.stats.scoring=x.scoring;p.stats.dunks=x.dunks;p.stats.three=x.three;p.stats.rebounding=x.rebounding;p.stats.passing=x.passing;p.stats.blocks=x.blocks;p.stats.steals=x.steals;});
})();
