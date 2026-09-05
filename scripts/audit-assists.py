#!/usr/bin/env python3
# NBA Courtside v0.10.24 — 175-player Assists audit.
# Rating = round(30 * (APG / 11.0)^0.75), capped 1..30.
import csv,io,json,math,re,unicodedata,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
URL='https://raw.githubusercontent.com/miamiasheep/nba_analysis/main/bbr_per_game_2026.csv'
def norm(s):
 s=unicodedata.normalize('NFD',str(s)).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+',' ',s).strip()
def rating(apg):
 a=max(0.0,float(apg)); return max(1,min(30,int(math.floor(30*((a/11.0)**0.75)+0.5)))) if a>0 else 1
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
 val=r.get('AST') or r.get('ast_per_g') or r.get('AST_per_game') or ''
 try: by[norm(name)]=float(val)
 except: pass
# Same fallback-season policy as prior audited categories.
fallback={
 'Egor Demin':3.4,'Kyrie Irving':4.7,'Fred VanVleet':5.6,'Tyrese Haliburton':9.2,'Damian Lillard':7.1,
 'Darius Acuff Jr.':3.8,'Cameron Boozer':4.1,'Keaton Wagler':4.2,'Darryn Peterson':3.1,'AJ Dybantsa':2.9,'Caleb Wilson':2.6
}
# Exact depicted-season APG for Classic Team cards.
ca={
 ('Alvin Williams','2003'):5.3,('Vince Carter','2003'):3.3,('Morris Peterson','2003'):2.0,('Jerome Williams','2003'):1.3,('Antonio Davis','2003'):2.5,
 ('Tony Parker','2005'):6.1,('Manu Ginóbili','2005'):3.9,('Bruce Bowen','2005'):1.5,('Tim Duncan','2005'):2.7,('Rasho Nesterović','2005'):1.0,
 ('Ron Harper','1998'):2.9,('Michael Jordan','1998'):3.5,('Scottie Pippen','1998'):5.8,('Dennis Rodman','1998'):2.9,('Luc Longley','1998'):2.8,
 ('Derek Fisher','2002'):2.6,('Kobe Bryant','2002'):5.5,('Rick Fox','2002'):3.5,('Robert Horry','2002'):2.9,("Shaquille O'Neal",'2002'):3.0,
 ('Kenny Smith','1995'):4.0,('Clyde Drexler','1995'):4.4,('Carl Herrera','1995'):0.7,('Robert Horry','1995'):3.5,('Hakeem Olajuwon','1995'):3.5
}
out=[]; missing=[]
for n in modern:
 a=by.get(norm(n),fallback.get(n))
 if a is None: missing.append(n); continue
 out.append({'name':n,'season':'2025-26/fallback','classic':False,'apg':a,'rating':rating(a)})
for n,seas in classic_rows:
 a=ca.get((n,seas))
 if a is None: missing.append(f'{n} {seas}'); continue
 out.append({'name':n,'season':seas,'classic':True,'apg':a,'rating':rating(a)})
# Classic parser misses Shaq because of the apostrophe in his name.
if not any(x['classic'] and x['name']=="Shaquille O'Neal" for x in out):
 a=ca[("Shaquille O'Neal",'2002')]; out.append({'name':"Shaquille O'Neal",'season':'2002','classic':True,'apg':a,'rating':rating(a)})
if missing or len(out)!=175: raise SystemExit(f'Expected 175; got {len(out)} missing={missing}')
out.sort(key=lambda x:(-x['rating'],-x['apg'],x['name']))
for i,x in enumerate(out,1): x['rank']=i
bands=[]
for lo in range(1,30,5):
 hi=min(30,lo+4); c=sum(lo<=x['rating']<=hi for x in out); bands.append({'range':f'{lo}-{hi}','players':c,'percent':round(c/175*100,1)})
result={'status':'AUDIT_ONLY_NOT_APPLIED_TO_GAMEPLAY','formula':'round(30 * (APG / 11.0)^0.75), capped 1..30','count':175,'distribution':bands,'players':out}
(ROOT/'assists-audit-v0.10.24.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'count':175,'distribution':bands,'top20':out[:20],'bottom10':out[-10:]},ensure_ascii=False,indent=2))