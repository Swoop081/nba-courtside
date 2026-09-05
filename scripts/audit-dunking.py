#!/usr/bin/env python3
# NBA Courtside v0.10.25 — subjective 175-player Dunking audit.
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

# Default positional realism. Small guards are pulled down unless specifically proven dunkers;
# wings/bigs retain more of the existing subjective baseline.
factor={'PG':0.62,'SG':0.88,'SF':0.96,'PF':1.00,'C':0.96}

# Curated scouting overrides. These deliberately reward elite/contest/reputation dunkers and
# suppress small guards who are not practical NBA dunk threats.
over={
# elite / contest / iconic current players
'Ja Morant':30,'Anthony Edwards':30,'Zion Williamson':30,'Giannis Antetokounmpo':30,'Aaron Gordon':30,'Zach LaVine':30,
'Amen Thompson':30,'Ausar Thompson':29,'Jalen Green':29,'LeBron James':29,'Donovan Mitchell':29,'Jonathan Kuminga':29,
'AJ Dybantsa':29,'Jalen Johnson':29,'Jaylen Brown':28,'Miles Bridges':28,'Daniel Gafford':28,'John Collins':28,
'VJ Edgecombe':28,'Cooper Flagg':28,'Victor Wembanyama':28,'Mark Williams':28,'Jalen Duren':28,'Trey Murphy III':28,
'Caleb Wilson':28,'Matas Buzelis':27,'Ace Bailey':27,'Christian Braun':27,'Peyton Watson':27,'Evan Mobley':27,
'Jarrett Allen':27,'Nic Claxton':27,'Walker Kessler':27,'Rudy Gobert':26,'Chet Holmgren':26,'Onyeka Okongwu':27,
'Jerami Grant':27,'Paolo Banchero':27,'Jayson Tatum':26,'Pascal Siakam':25,'Anthony Davis':28,'Bam Adebayo':26,
'Andrew Wiggins':27,'Kevin Durant':24,'Scottie Barnes':25,'OG Anunoby':24,'RJ Barrett':24,'Darryn Peterson':26,
# athletic guards/wings who genuinely dunk
'De\'Aaron Fox':26,'Shai Gilgeous-Alexander':22,'Cade Cunningham':18,'LaMelo Ball':15,'Dejounte Murray':18,
'Damian Lillard':20,'Kyrie Irving':10,'Tyrese Maxey':13,'Stephon Castle':25,'Dylan Harper':22,'Cedric Coward':25,
'Brandon Miller':23,'Mikal Bridges':21,'Jalen Williams':25,'Franz Wagner':24,'Deni Avdija':22,'Luka Dončić':11,
# practical non-dunking / very rare-dunk guards
'Trae Young':1,'Fred VanVleet':2,'Jalen Brunson':3,'Stephen Curry':4,'Payton Pritchard':4,'Darius Garland':5,
'Immanuel Quickley':6,'Davion Mitchell':5,'CJ McCollum':5,'Ryan Rollins':7,'Keyonte George':8,'Cason Wallace':9,
'James Harden':8,'Tyrese Haliburton':9,'Jamal Murray':11,'Austin Reaves':8,'Derrick White':8,'Andrew Nembhard':8,
'Klay Thompson':6,'Duncan Robinson':2,
# bigs: distinguish power/explosiveness from merely being tall
'Nikola Jokić':15,'Alperen Şengün':20,'Domantas Sabonis':20,'Brook Lopez':15,'Kristaps Porziņģis':22,'Joel Embiid':23,
'Zach Edey':23,'Donovan Clingan':24,'Ivica Zubac':24,'Myles Turner':22,'Isaiah Hartenstein':20,'Karl-Anthony Towns':23
}

rows=[]
for x in modern:
    r=clamp(x['old']*factor[x['position']])
    note='position-adjusted subjective baseline'
    if x['name'] in over:
        r=over[x['name']]
        note='curated scouting override'
    rows.append({**x,'rating':r,'note':note})

# Exact 25 Classic cards. Ratings emphasize the represented-era player's real dunking profile.
classic=[
('Alvin Williams','PG','2003',7),('Vince Carter','SG','2003',30),('Morris Peterson','SF','2003',17),('Jerome Williams','PF','2003',22),('Antonio Davis','C','2003',23),
('Tony Parker','PG','2005',14),('Manu Ginóbili','SG','2005',24),('Bruce Bowen','SF','2005',7),('Tim Duncan','PF','2005',24),('Rasho Nesterović','C','2005',16),
('Ron Harper','PG','1998',18),('Michael Jordan','SG','1998',30),('Scottie Pippen','SF','1998',28),('Dennis Rodman','PF','1998',16),('Luc Longley','C','1998',15),
('Derek Fisher','PG','2002',6),('Kobe Bryant','SG','2002',30),('Rick Fox','SF','2002',13),('Robert Horry','PF','2002',21),("Shaquille O'Neal",'C','2002',30),
('Kenny Smith','PG','1995',8),('Clyde Drexler','SG','1995',29),('Carl Herrera','PF','1995',18),('Robert Horry','SF','1995',23),('Hakeem Olajuwon','C','1995',27)
]
for n,p,s,r in classic: rows.append({'name':n,'position':p,'old':None,'classic':True,'season':s,'rating':r,'note':'curated classic-era scouting rating'})
if len(rows)!=175: raise SystemExit(f'Expected 175 rows, got {len(rows)}')
rows.sort(key=lambda x:(-x['rating'],x['name'],x['season']))
for i,x in enumerate(rows,1): x['rank']=i
bands=[]
for lo in range(1,30,5):
    hi=min(30,lo+4); c=sum(lo<=x['rating']<=hi for x in rows); bands.append({'range':f'{lo}-{hi}','players':c,'percent':round(c/175*100,1)})
result={
 'status':'SUBJECTIVE_AUDIT_ONLY_NOT_APPLIED_TO_GAMEPLAY',
 'method':'existing dunk baseline + positional realism + curated scouting overrides for reputation, contest pedigree, vertical explosiveness, size and practical dunk capability',
 'count':175,'distribution':bands,'players':rows
}
(ROOT/'dunking-audit-v0.10.25.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'count':175,'distribution':bands,'top30':rows[:30],'bottom20':rows[-20:]},ensure_ascii=False,indent=2))