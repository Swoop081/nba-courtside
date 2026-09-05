#!/usr/bin/env python3
# NBA Courtside v0.10.23 — 175-player Steals audit.
# Rating = round(30 * (SPG / 2.5)^0.60), capped 1..30.
import csv,io,json,math,re,unicodedata,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
URL='https://raw.githubusercontent.com/miamiasheep/nba_analysis/main/bbr_per_game_2026.csv'
def norm(s):
 s=unicodedata.normalize('NFD',str(s)).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+',' ',s).strip()
def rating(spg):
 s=max(0.0,float(spg)); return max(1,min(30,int(math.floor(30*((s/2.5)**0.60)+0.5)))) if s>0 else 1
foundation=(ROOT/'foundation-v0.9.0.js').read_text(encoding='utf-8')
modern=[]
for n,p in re.findall(r"\['([^']*(?:\\'[^']*)*)','(PG|SG|SF|PF|C)',\[",foundation):
 n=n.replace("\\'", "'")
 if n not in modern: modern.append(n)
if len(modern)!=150: raise SystemExit(f'Expected 150 modern players, got {len(modern)}')
classic=(ROOT/'classic-teams-v0.9.30.js').read_text(encoding='utf-8')
classic_rows=[]
for season,body in re.findall(r"season:'(\d+)'[\s\S]*?rows:\[([\s\S]*?)\]\s*\}",classic):
 for n,p in re.findall(r"\[['\"]([^'\"]+)['\"],'(PG|SG|SF|PF|C)'",body): classic_rows.append((n,season))
raw=urllib.request.urlopen(URL,timeout=30).read().decode('utf-8-sig'); rows=list(csv.DictReader(io.StringIO(raw)))
by={}
for r in rows:
 name=r.get('Player') or r.get('player') or ''
 val=r.get('STL') or r.get('stl_per_g') or r.get('STL_per_game') or ''
 try: by[norm(name)]=float(val)
 except: pass
fallback={
 'Egor Demin':1.2,'Kyrie Irving':1.3,'Fred VanVleet':1.6,'Tyrese Haliburton':1.4,'Damian Lillard':1.2,
 'Darius Acuff Jr.':1.4,'Cameron Boozer':1.7,'Keaton Wagler':1.2,'Darryn Peterson':1.1,'AJ Dybantsa':1.0,'Caleb Wilson':1.1
}
# Exact depicted-season SPG for Classic Team cards.
cs={
 ('Alvin Williams','2003'):1.4,('Vince Carter','2003'):1.1,('Morris Peterson','2003'):1.0,('Jerome Williams','2003'):1.6,('Antonio Davis','2003'):0.4,
 ('Tony Parker','2005'):1.2,('Manu Ginóbili','2005'):1.6,('Bruce Bowen','2005'):0.7,('Tim Duncan','2005'):0.7,('Rasho Nesterović','2005'):0.4,
 ('Ron Harper','1998'):1.3,('Michael Jordan','1998'):1.7,('Scottie Pippen','1998'):1.8,('Dennis Rodman','1998'):0.6,('Luc Longley','1998'):0.6,
 ('Derek Fisher','2002'):0.9,('Kobe Bryant','2002'):1.5,('Rick Fox','2002'):0.8,('Robert Horry','2002'):1.0,("Shaquille O'Neal",'2002'):0.6,
 ('Kenny Smith','1995'):0.9,('Clyde Drexler','1995'):1.8,('Carl Herrera','1995'):0.6,('Robert Horry','1995'):1.5,('Hakeem Olajuwon','1995'):1.8
}
out=[]; missing=[]
for n in modern:
 s=by.get(norm(n),fallback.get(n))
 if s is None: missing.append(n); continue
 out.append({'name':n,'season':'2025-26/fallback','classic':False,'spg':s,'rating':rating(s)})
for n,seas in classic_rows:
 s=cs.get((n,seas))
 if s is None: missing.append(f'{n} {seas}'); continue
 out.append({'name':n,'season':seas,'classic':True,'spg':s,'rating':rating(s)})
if missing or len(out)!=175: raise SystemExit(f'Expected 175; got {len(out)} missing={missing}')
out.sort(key=lambda x:(-x['rating'],-x['spg'],x['name']))
for i,x in enumerate(out,1): x['rank']=i
bands=[]
for lo in range(1,30,5):
 hi=min(30,lo+4); c=sum(lo<=x['rating']<=hi for x in out); bands.append({'range':f'{lo}-{hi}','players':c,'percent':round(c/175*100,1)})
result={'status':'AUDIT_ONLY_NOT_APPLIED_TO_GAMEPLAY','formula':'round(30 * (SPG / 2.5)^0.60), capped 1..30','count':175,'distribution':bands,'players':out}
(ROOT/'steals-audit-v0.10.23.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'count':175,'distribution':bands,'top20':out[:20],'bottom10':out[-10:]},ensure_ascii=False,indent=2))