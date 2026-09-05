#!/usr/bin/env python3
# NBA Courtside v0.10.21 — 175-player Rebounding audit.
# Rating = round(RPG * 30 / 13), clamped 1..30.
# Modern cards: 2025-26 regular season; same veteran/rookie fallback policy as scoring/3PT.
# Classic cards: depicted regular season (no era penalty).
import csv,io,json,math,re,unicodedata,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
URL='https://raw.githubusercontent.com/miamiasheep/nba_analysis/main/bbr_per_game_2026.csv'
def norm(s):
 s=unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+',' ',s).strip()
def rating(rpg): return max(1,min(30,int(math.floor(float(rpg)*30/13+0.5))))
foundation=(ROOT/'foundation-v0.9.0.js').read_text()
modern=[]
for n,p in re.findall(r"\['([^']*(?:\\'[^']*)*)','(PG|SG|SF|PF|C)',\[",foundation):
 n=n.replace("\\'", "'")
 if n not in modern: modern.append(n)
classic=(ROOT/'classic-teams-v0.9.30.js').read_text()
classic_rows=[]
for season,body in re.findall(r"season:'(\d+)'[\s\S]*?rows:\[([\s\S]*?)\]\s*\}",classic):
 for n,p in re.findall(r"\[['\"]([^'\"]+)['\"],'(PG|SG|SF|PF|C)'",body): classic_rows.append((n,season))
raw=urllib.request.urlopen(URL,timeout=30).read().decode(); rows=list(csv.DictReader(io.StringIO(raw)))
by={}
for r in rows:
 name=r.get('Player') or r.get('player') or ''
 trb=r.get('TRB') or r.get('trb_per_g') or r.get('TRB_per_game') or ''
 try: by[norm(name)]=float(trb)
 except: pass
# Explicit fallbacks are maintained for cards absent from the 2025-26 NBA feed.
# Values follow the same source-season policy already used by the scoring/3PT audits.
fallback={
 'Kyrie Irving':4.7,'Damian Lillard':4.7,'Tyrese Haliburton':3.5,
 'Jayson Tatum':8.7,'Dejounte Murray':7.4,'Anthony Davis':11.6,
 'AJ Dybantsa':7.2,'Darryn Peterson':5.1,'Cameron Boozer':9.8,'Darius Acuff Jr.':3.8,
 'Keaton Wagler':5.9,'Caleb Wilson':9.4,'Tre Johnson':3.1
}
# Exact depicted regular-season RPG for the 25 classic cards.
cr={
 ('Alvin Williams','2003'):3.1,('Vince Carter','2003'):4.4,('Morris Peterson','2003'):4.4,('Jerome Williams','2003'):8.4,('Antonio Davis','2003'):8.2,
 ('Tony Parker','2005'):3.7,('Manu Ginóbili','2005'):4.4,('Bruce Bowen','2005'):3.5,('Tim Duncan','2005'):11.1,('Rasho Nesterović','2005'):6.6,
 ('Ron Harper','1998'):3.5,('Michael Jordan','1998'):5.8,('Scottie Pippen','1998'):5.2,('Dennis Rodman','1998'):15.0,('Luc Longley','1998'):5.9,
 ('Derek Fisher','2002'):2.1,('Kobe Bryant','2002'):5.5,('Rick Fox','2002'):4.7,('Robert Horry','2002'):5.9,("Shaquille O'Neal",'2002'):10.7,
 ('Kenny Smith','1995'):1.9,('Clyde Drexler','1995'):7.0,('Mario Elie','1995'):2.4,('Robert Horry','1995'):5.1,('Hakeem Olajuwon','1995'):10.8
}
out=[]; missing=[]
for n in modern:
 r=by.get(norm(n),fallback.get(n))
 if r is None: missing.append(n); continue
 out.append({'name':n,'season':'2025-26/fallback','classic':False,'rpg':r,'rating':rating(r)})
for n,s in classic_rows:
 r=cr.get((n,s))
 if r is None: missing.append(f'{n} {s}'); continue
 out.append({'name':n,'season':s,'classic':True,'rpg':r,'rating':rating(r)})
if missing or len(out)!=175: raise SystemExit(f'Expected 175; got {len(out)} missing={missing}')
out.sort(key=lambda x:(-x['rating'],-x['rpg'],x['name']))
for i,x in enumerate(out,1): x['rank']=i
bands=[]
for lo in range(1,30,5):
 hi=min(30,lo+4); c=sum(lo<=x['rating']<=hi for x in out); bands.append({'range':f'{lo}-{hi}','players':c,'percent':round(c/175*100,1)})
result={'status':'AUDIT_ONLY_NOT_APPLIED_TO_GAMEPLAY','formula':'round(RPG * 30 / 13), capped 1..30','count':175,'distribution':bands,'players':out}
(ROOT/'rebounding-audit-v0.10.21.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({'count':175,'distribution':bands,'top20':out[:20],'bottom10':out[-10:]},ensure_ascii=False,indent=2))
