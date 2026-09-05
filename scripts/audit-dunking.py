#!/usr/bin/env python3
# NBA Courtside v0.10.25 — approved subjective 175-player Dunking ratings.
# Dunking is intentionally a scouting-style rating, not a box-score conversion.
# Inputs: existing card dunk baseline, positional realism, known dunk reputation/contest history,
# explosive vertical ability, size, and practical in-game dunk capability.
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def clamp(v): return max(1,min(30,int(round(v))))

foundation=(ROOT/'foundation-v0.9.0.js').read_text(encoding='utf-8')
modern=[]
for n,p,vals in re.findall(r"\['([^']*(?:\\'[^']*)*)','(PG|SG|SF|PF|C)',\[([^\]]+)\]\]",foundation):
    n=n.replace("\\'", "'")
    a=[int(x.strip()) for x in vals.split(',')]
    if len(a)>=2 and not any(x['name']==n for x in modern): modern.append({'name':n,'position':p,'old':a[1],'classic':False,'season':'current'})
if len(modern)!=150: raise SystemExit(f'Expected 150 modern players, got {len(modern)}')

factor={'PG':0.55,'SG':0.75,'SF':0.82,'PF':0.85,'C':0.85}
over={
'Ja Morant':30,'Anthony Edwards':30,'Zion Williamson':30,'Giannis Antetokounmpo':30,'Aaron Gordon':30,'Zach LaVine':30,'Amen Thompson':30,
'Ausar Thompson':29,'Jalen Green':29,'LeBron James':29,'Donovan Mitchell':29,'Jonathan Kuminga':29,'AJ Dybantsa':29,'Jalen Johnson':29,
'Jaylen Brown':28,'Miles Bridges':28,'Anthony Davis':28,
'VJ Edgecombe':27,'Cooper Flagg':27,'Victor Wembanyama':27,'Trey Murphy III':27,'Darryn Peterson':27,
'Daniel Gafford':26,'Jalen Duren':26,'Caleb Wilson':26,'Matas Buzelis':26,'Chet Holmgren':26,'Andrew Wiggins':26,
'Ace Bailey':25,'Christian Braun':25,'Peyton Watson':25,'Evan Mobley':25,'Jarrett Allen':25,'Nic Claxton':25,'Walker Kessler':25,'Onyeka Okongwu':25,'Paolo Banchero':25,
'Mark Williams':25,'Jerami Grant':24,'Jayson Tatum':24,'Pascal Siakam':24,'Bam Adebayo':24,'Rudy Gobert':24,'Scottie Barnes':24,'John Collins':25,
'Kevin Durant':22,'OG Anunoby':23,'RJ Barrett':23,
'De\'Aaron Fox':26,'Shai Gilgeous-Alexander':22,'Cade Cunningham':18,'LaMelo Ball':15,'Dejounte Murray':18,'Damian Lillard':20,'Kyrie Irving':10,'Tyrese Maxey':13,
'Stephon Castle':25,'Dylan Harper':22,'Cedric Coward':24,'Brandon Miller':22,'Mikal Bridges':21,'Jalen Williams':24,'Franz Wagner':23,'Deni Avdija':22,'Luka Dončić':11,
'Trae Young':1,'Fred VanVleet':2,'Jalen Brunson':3,'Stephen Curry':4,'Payton Pritchard':4,'Darius Garland':5,'Immanuel Quickley':6,'Davion Mitchell':5,'CJ McCollum':5,
'Ryan Rollins':7,'Keyonte George':8,'Cason Wallace':9,'James Harden':8,'Tyrese Haliburton':9,'Jamal Murray':11,'Austin Reaves':8,'Derrick White':8,'Andrew Nembhard':8,'Klay Thompson':6,'Duncan Robinson':2,
'Nikola Jokić':15,'Alperen Şengün':20,'Domantas Sabonis':20,'Brook Lopez':15,'Kristaps Porziņģis':21,'Joel Embiid':22,'Zach Edey':22,'Donovan Clingan':23,'Ivica Zubac':23,
'Myles Turner':21,'Isaiah Hartenstein':19,'Karl-Anthony Towns':22
}

rows=[]
for x in modern:
    r=clamp(x['old']*factor[x['position']])
    note='position-adjusted subjective baseline'
    if x['name'] in over:
        r=over[x['name']]
        note='curated scouting override'
    rows.append({**x,'rating':r,'note':note})

classic=[
('Alvin Williams','PG','2003',7),('Vince Carter','SG','2003',30),('Morris Peterson','SF','2003',16),('Jerome Williams','PF','2003',20),('Antonio Davis','C','2003',21),
('Tony Parker','PG','2005',14),('Manu Ginóbili','SG','2005',23),('Bruce Bowen','SF','2005',7),('Tim Duncan','PF','2005',22),('Rasho Nesterović','C','2005',15),
('Ron Harper','PG','1998',18),('Michael Jordan','SG','1998',30),('Scottie Pippen','SF','1998',28),('Dennis Rodman','PF','1998',15),('Luc Longley','C','1998',14),
('Derek Fisher','PG','2002',6),('Kobe Bryant','SG','2002',29),('Rick Fox','SF','2002',12),('Robert Horry','PF','2002',20),("Shaquille O'Neal",'C','2002',30),
('Kenny Smith','PG','1995',8),('Clyde Drexler','SG','1995',29),('Carl Herrera','PF','1995',17),('Robert Horry','SF','1995',22),('Hakeem Olajuwon','C','1995',26)
]
for n,p,s,r in classic: rows.append({'name':n,'position':p,'old':None,'classic':True,'season':s,'rating':r,'note':'curated classic-era scouting rating'})
if len(rows)!=175: raise SystemExit(f'Expected 175 rows, got {len(rows)}')
rows.sort(key=lambda x:(-x['rating'],x['name'],x['season']))
for i,x in enumerate(rows,1): x['rank']=i
bands=[]
for lo in range(1,30,5):
    hi=min(30,lo+4); c=sum(lo<=x['rating']<=hi for x in rows); bands.append({'range':f'{lo}-{hi}','players':c,'percent':round(c/175*100,1)})
result={'status':'APPROVED_APPLIED_TO_GAMEPLAY','method':'existing dunk baseline + stronger positional compression + curated scouting overrides for reputation, dunk-contest pedigree, vertical explosiveness, size and practical dunk capability','count':175,'distribution':bands,'players':rows}
(ROOT/'dunking-audit-v0.10.25.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

runtime_rows=[{'name':x['name'],'season':x['season'],'classic':x['classic'],'rating':x['rating']} for x in rows]
js="""/* NBA Courtside v0.10.25 — approved 175-player subjective Dunking ratings. */
(()=>{
if(window.__courtsideDunkingRatingsV01025)return;
window.__courtsideDunkingRatingsV01025=true;
const rows=__ROWS__;
const norm=s=>String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const current=new Map(),classic=new Map();
rows.forEach(r=>{(r.classic?classic:current).set(norm(r.name)+(r.classic?'|'+r.season:''),r.rating);});
(players||[]).forEach(p=>{
 const isClassic=!!p.classicTeam;
 const key=norm(p.name)+(isClassic?'|'+String(p.season||''): '');
 const v=(isClassic?classic:current).get(key);
 if(Number.isFinite(v)&&p.stats)p.stats.dunks=v;
});
window.COURTSIDE_DUNKING_RATINGS_V01025=rows;
})();
""".replace('__ROWS__',json.dumps(runtime_rows,ensure_ascii=False,separators=(',',':')))
(ROOT/'dunking-ratings-v0.10.25.js').write_text(js,encoding='utf-8')
print(json.dumps({'count':175,'distribution':bands,'top30':rows[:30],'bottom20':rows[-20:]},ensure_ascii=False,indent=2))