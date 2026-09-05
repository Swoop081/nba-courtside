#!/usr/bin/env python3
# NBA Courtside v0.10.22 — 175-player Blocks audit/gameplay generator.
# Because BPG is compressed into a ~0-3.5 range, use square-root scaling to preserve order
# while spreading role players and elite rim protectors across the 1-30 game scale.
# Rating = round(30 * sqrt(BPG / 3.0)), clamped 1..30.
import csv,io,json,math,re,unicodedata,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
URL='https://raw.githubusercontent.com/miamiasheep/nba_analysis/main/bbr_per_game_2026.csv'
def norm(s):
 s=unicodedata.normalize('NFD',str(s)).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+',' ',s).strip()
def rating(bpg):
 b=max(0.0,float(bpg)); return max(1,min(30,int(math.floor(30*math.sqrt(b/3.0)+0.5)))) if b>0 else 1
foundation=(ROOT/'foundation-v0.9.0.js').read_text(encoding='utf-8')
modern=[]
for n,p in re.findall(r"\['([^']*(?:\\'[^']*)*)','(PG|SG|SF|PF|C)',\[",foundation):
 n=n.replace("\\'", "'")
 if n not in modern: modern.append(n)
if len(modern)!=150: raise SystemExit(f'Expected 150 modern players, got {len(modern)}')
raw=urllib.request.urlopen(URL,timeout=30).read().decode('utf-8-sig'); rows=list(csv.DictReader(io.StringIO(raw)))
by={}
for r in rows:
 name=r.get('Player') or r.get('player') or ''
 val=r.get('BLK') or r.get('blk_per_g') or r.get('BLK_per_game') or ''
 try: by[norm(name)]=float(val)
 except: pass
fallback={
 'Egor Demin':0.4,'Kyrie Irving':0.5,'Fred VanVleet':0.4,'Tyrese Haliburton':0.7,'Damian Lillard':0.2,
 'Darius Acuff Jr.':0.2,'Cameron Boozer':0.8,'Keaton Wagler':0.3,'Darryn Peterson':0.4,'AJ Dybantsa':0.7,'Caleb Wilson':1.4
}
cb={
 ('Alvin Williams','2003'):0.3,('Vince Carter','2003'):1.0,('Morris Peterson','2003'):0.4,('Jerome Williams','2003'):0.4,('Antonio Davis','2003'):1.2,
 ('Tony Parker','2005'):0.1,('Manu Ginóbili','2005'):0.4,('Bruce Bowen','2005'):0.5,('Tim Duncan','2005'):2.6,('Rasho Nesterović','2005'):1.7,
 ('Ron Harper','1998'):0.6,('Michael Jordan','1998'):0.5,('Scottie Pippen','1998'):1.0,('Dennis Rodman','1998'):0.2,('Luc Longley','1998'):1.1,
 ('Derek Fisher','2002'):0.1,('Kobe Bryant','2002'):0.4,('Rick Fox','2002'):0.3,('Robert Horry','2002'):1.1,("Shaquille O'Neal",'2002'):2.0,
 ('Kenny Smith','1995'):0.1,('Clyde Drexler','1995'):0.7,('Carl Herrera','1995'):0.6,('Robert Horry','1995'):1.2,('Hakeem Olajuwon','1995'):3.4
}
classic_rows=list(cb.keys())
out=[]; missing=[]
for n in modern:
 b=by.get(norm(n),fallback.get(n))
 if b is None: missing.append(n); continue
 out.append({'name':n,'season':'2025-26/fallback','classic':False,'bpg':b,'rating':rating(b)})
for n,s in classic_rows:
 b=cb.get((n,s))
 if b is None: missing.append(f'{n} {s}'); continue
 out.append({'name':n,'season':s,'classic':True,'bpg':b,'rating':rating(b)})
if missing or len(out)!=175: raise SystemExit(f'Expected 175; got {len(out)} missing={missing}')
out.sort(key=lambda x:(-x['rating'],-x['bpg'],x['name']))
for i,x in enumerate(out,1): x['rank']=i
bands=[]
for lo in range(1,30,5):
 hi=min(30,lo+4); c=sum(lo<=x['rating']<=hi for x in out); bands.append({'range':f'{lo}-{hi}','players':c,'percent':round(c/175*100,1)})
result={'status':'APPROVED_FOR_GAMEPLAY','formula':'round(30 * sqrt(BPG / 3.0)), capped 1..30','count':175,'distribution':bands,'players':out}
(ROOT/'blocks-audit-v0.10.22.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
payload=json.dumps(out,ensure_ascii=False,separators=(',',':'))
js=f'''/* NBA Courtside v0.10.22 — approved 175-player BPG-based Blocks ratings. */\n(()=>{{\nif(window.__courtsideBlocksRatingsV01022)return;\nwindow.__courtsideBlocksRatingsV01022=true;\nconst rows={payload};\nconst norm=s=>String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();\nconst modern=new Map(),classic=new Map();\nrows.forEach(r=>{{if(r.classic)classic.set(`${{norm(r.name)}}|${{String(r.season)}}`,r.rating);else modern.set(norm(r.name),r.rating);}});\nlet applied=0;\n(players||[]).forEach(p=>{{const v=p.classicTeam?classic.get(`${{norm(p.name)}}|${{String(p.season||'')}}`):modern.get(norm(p.name));if(Number.isFinite(v)){{p.stats.blocks=v;applied++;}}}});\nwindow.COURTSIDE_BLOCKS_RATINGS_V01022=rows;\nwindow.COURTSIDE_BLOCKS_RATINGS_APPLIED=applied;\n}})();\n'''
(ROOT/'blocks-ratings-v0.10.22.js').write_text(js,encoding='utf-8')
print(json.dumps({'count':175,'distribution':bands,'top20':out[:20],'bottom10':out[-10:]},ensure_ascii=False,indent=2))
