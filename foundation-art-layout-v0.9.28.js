/* NBA Courtside v0.9.28 — canonical 150-card Foundation artwork layout */
(()=>{
const L={
'cj-mccollum':{x:48,y:-55,scale:1.39},'nickeil-alexander-walker':{x:49,y:-300,scale:1.97},'dyson-daniels':{x:52.5,y:-41,scale:1.49},'jalen-johnson':{x:51.5,y:-48,scale:1.59},'onyeka-okongwu':{x:45,y:-128,scale:2.53},
'payton-pritchard':{x:55,y:-552,scale:3.39},'derrick-white':{x:51.5,y:-369,scale:2.23},'paul-george':{x:51.5,y:-41,scale:1.85},'jayson-tatum':{x:46.5,y:0,scale:1.47},'neemias-queta':{x:47.5,y:0,scale:1.22},
'egor-demin':{x:43,y:-303,scale:2},'terance-mann':{x:51,y:-10,scale:1.29},'michael-porter-jr':{x:51,y:-303,scale:1.97},'julius-randle':{x:44,y:-31,scale:1.39},'day-ron-sharpe':{x:73.5,y:-431,scale:2.68},
'coby-white':{x:56,y:-14,scale:1.32},'brandon-miller':{x:55,y:-293,scale:1.94},'kon-knueppel':{x:51,y:-17,scale:1.36},'naz-reid':{x:56,y:-290,scale:1.89},'moussa-diabate':{x:71.5,y:-279,scale:1.82},
'josh-giddey':{x:63,y:-300,scale:2.03},'norman-powell':{x:51,y:-441,scale:2.7},'matas-buzelis':{x:52.5,y:-17,scale:1.49},'caleb-wilson':{x:49,y:-317,scale:1.98},'nic-claxton':{x:46.5,y:-17,scale:1.54},
'james-harden':{x:56,y:-321,scale:2.08},'donovan-mitchell':{x:75,y:-331,scale:2.12},'peyton-watson':{x:51.5,y:-17,scale:1.36},'evan-mobley':{x:61,y:-445,scale:2.73},'jarrett-allen':{x:58,y:-17,scale:1.62},
'kyrie-irving':{x:56,y:-290,scale:1.89},'max-christie':{x:56,y:-31,scale:1.34},'cooper-flagg':{x:54.5,y:-469,scale:2.81},'p-j-washington':{x:76,y:-324,scale:2.05},'daniel-gafford':{x:56,y:-48,scale:1.62},
'jamal-murray':{x:58,y:-372,scale:2.35},'christian-braun':{x:29.5,y:-500,scale:2.94},'cameron-johnson':{x:45,y:-348,scale:2.3},'aaron-gordon':{x:78.5,y:-290,scale:1.9},'nikola-jokic':{x:51,y:-45,scale:1.47},
'cade-cunningham':{x:108.5,y:-359,scale:2.48},'duncan-robinson':{x:40.5,y:-390,scale:2.55},'ausar-thompson':{x:34.5,y:-386,scale:2.41},'john-collins':{x:50,y:-62,scale:1.27},'jalen-duren':{x:54.5,y:-414,scale:2.53},
'stephen-curry':{x:51,y:10,scale:1.03},'brandin-podziemski':{x:51.5,y:-410,scale:2.48},'jimmy-butler':{x:52.5,y:-152,scale:2.15},'draymond-green':{x:59.5,y:-366,scale:2.4},'kristaps-porzingis':{x:52.5,y:-34,scale:1.32},
'fred-vanvleet':{x:51,y:-45,scale:2.2},'amen-thompson':{x:72.5,y:-293,scale:2},'kevin-durant':{x:52,y:-317,scale:2.05},'jabari-smith-jr':{x:56,y:-455,scale:2.76},'alperen-sengun':{x:62,y:-366,scale:2.13},
'tyrese-haliburton':{x:43,y:-372,scale:2.46},'andrew-nembhard':{x:89.5,y:-341,scale:2.05},'aaron-nesmith':{x:45.5,y:-10,scale:1.22},'pascal-siakam':{x:50,y:-400,scale:2.53},'ivica-zubac':{x:47.5,y:-34,scale:1.41},
'darius-garland':{x:49,y:-355,scale:2.18},'keaton-wagler':{x:52.5,y:-14,scale:1.44},'brandon-ingram':{x:45,y:-438,scale:2.56},'rui-hachimura':{x:59.5,y:-283,scale:2.08},'brook-lopez':{x:39,y:-328,scale:2.05},
'luka-doncic':{x:82,y:-355,scale:2.3},'austin-reaves':{x:47.5,y:-300,scale:2.02},'ziaire-williams':{x:56,y:-41,scale:1.72},'jarred-vanderbilt':{x:42,y:-310,scale:2.02},'walker-kessler':{x:64,y:-331,scale:2.17},
'jaylen-wells':{x:56,y:-528,scale:3.14},'cedric-coward':{x:56,y:-293,scale:2.08},'jerami-grant':{x:50,y:-372,scale:2.17},'cameron-boozer':{x:60.5,y:-290,scale:2.02},'zach-edey':{x:50,y:-17,scale:1.41},
'davion-mitchell':{x:50,y:-10,scale:1.46},'klay-thompson':{x:47.5,y:-31,scale:1.7},'andrew-wiggins':{x:50,y:-14,scale:1.14},'giannis-antetokounmpo':{x:50,y:-17,scale:1.51},'bam-adebayo':{x:71.5,y:-407,scale:2.58},
'ryan-rollins':{x:61,y:-31,scale:1.62},'tyler-herro':{x:88,y:-321,scale:2.07},'jaime-jaquez-jr':{x:61,y:-283,scale:1.9},'kyle-kuzma':{x:44,y:-476,scale:2.96},'myles-turner':{x:54.5,y:-48,scale:1.52},
'lamelo-ball':{x:50,y:-21,scale:1.11},'anthony-edwards':{x:65.5,y:-90,scale:1.62},'jaden-mcdaniels':{x:56,y:-276,scale:2.08},'jonathan-kuminga':{x:56,y:-28,scale:1.54},'rudy-gobert':{x:52.5,y:-334,scale:2.05},
'dejounte-murray':{x:51,y:-390,scale:2.46},'jeremiah-fears':{x:43,y:-362,scale:2.27},'trey-murphy-iii':{x:76,y:-310,scale:2},'zion-williamson':{x:53.5,y:-7,scale:1.34},'derik-queen':{x:52.5,y:3,scale:1.47},
'jalen-brunson':{x:56,y:-10,scale:1.21},'mikal-bridges':{x:61,y:-393,scale:2.48},'josh-hart':{x:50,y:-31,scale:1.52},'og-anunoby':{x:51,y:-10,scale:1.47},'karl-anthony-towns':{x:56,y:-407,scale:2.45},
'shai-gilgeous-alexander':{x:63.5,y:-390,scale:2.5},'cason-wallace':{x:55,y:-434,scale:2.4},'jalen-williams':{x:61,y:-28,scale:2.08},'chet-holmgren':{x:42,y:-407,scale:2.66},'isaiah-hartenstein':{x:50,y:-355,scale:2.28},
'jalen-suggs':{x:53.5,y:-459,scale:2.65},'desmond-bane':{x:53.5,y:-52,scale:1.56},'franz-wagner':{x:62,y:-17,scale:1.54},'paolo-banchero':{x:52.5,y:-66,scale:1.82},'wendell-carter-jr':{x:51,y:-52,scale:1.51},
'tyrese-maxey':{x:51,y:-366,scale:2.28},'vj-edgecombe':{x:45,y:-17,scale:1.18},'jaylen-brown':{x:32,y:-372,scale:2.43},'lebron-james':{x:48.5,y:-376,scale:2.25},'joel-embiid':{x:90.5,y:-383,scale:2.46},
'devin-booker':{x:48.5,y:-14,scale:1.36},'jalen-green':{x:7,y:-421,scale:2.6},'dillon-brooks':{x:59.5,y:-424,scale:2.68},'miles-bridges':{x:58.5,y:-293,scale:1.89},'mark-williams':{x:23.5,y:-310,scale:1.97},
'ja-morant':{x:46.5,y:-359,scale:2.32},'damian-lillard':{x:56,y:-321,scale:2.17},'toumani-camara':{x:50,y:-334,scale:2.15},'deni-avdija':{x:49,y:-38,scale:1.98},'donovan-clingan':{x:80,y:-328,scale:2.15},
'darius-acuff-jr':{x:49,y:-17,scale:1.32},'zach-lavine':{x:59.5,y:-369,scale:2.32},'keegan-murray':{x:45,y:-424,scale:2.46},'de-andre-hunter':{x:48.5,y:-31,scale:1.52},'domantas-sabonis':{x:39,y:-352,scale:2.17},
'de-aaron-fox':{x:46.5,y:-24,scale:1.56},'dylan-harper':{x:57,y:-328,scale:2.05},'stephon-castle':{x:52.5,y:-66,scale:1.24},'tobias-harris':{x:56,y:-45,scale:1.74},'victor-wembanyama':{x:47.5,y:-24,scale:1.22},
'immanuel-quickley':{x:59.5,y:-472,scale:2.96},'rj-barrett':{x:55,y:-52,scale:1.74},'kawhi-leonard':{x:66.5,y:-272,scale:2.03},'scottie-barnes':{x:56,y:-28,scale:1.51},'collin-murray-boyles':{x:52.5,y:-514,scale:3.01},
'keyonte-george':{x:51,y:-314,scale:1.97},'darryn-peterson':{x:49,y:-28,scale:1.56},'ace-bailey':{x:52.5,y:-17,scale:1.37},'lauri-markkanen':{x:51.5,y:-21,scale:1.39},'jaren-jackson-jr':{x:51,y:-48,scale:1.39},
'trae-young':{x:56,y:-28,scale:1.41},'tre-johnson':{x:30,y:-379,scale:2.43},'aj-dybantsa':{x:52.5,y:-3,scale:1.13},'anthony-davis':{x:51,y:-14,scale:1.18},'alex-sarr':{x:39.5,y:-324,scale:2.13}
};
window.COURTSIDE_FOUNDATION_ART_LAYOUT=L;
if(typeof cardMarkup!=='function'||window.__foundationArtLayoutV0928)return;
window.__foundationArtLayoutV0928=true;
const before=cardMarkup;
cardMarkup=function(p,o={}){
  let html=before(p,o),c=L[p?.artSlug];
  if(!c)return html;
  if(!html.includes('data-art-slug='))html=html.replace('<article class="player-card foundation-card ',`<article data-art-slug="${p.artSlug}" class="player-card foundation-card `);
  return html.replace(/<img class="photo cutout-art"([^>]*)>/,(_,attrs)=>{
    attrs=attrs.replace(/\sstyle="[^"]*"/g,'');
    return `<img class="photo cutout-art"${attrs} style="top:${c.y}px!important;left:${c.x}%!important;transform:translateX(-50%) scale(${c.scale})!important;transform-origin:center top!important">`;
  });
};
})();
