import csv, io, json, math, re, statistics, tempfile, unicodedata
from collections import defaultdict
from pathlib import Path
from urllib.request import Request, urlopen, urlretrieve
import pandas as pd

CATS=['scoring','rebounding','passing','three','steals','blocks']
KNOTS=[(0,.0+5),(.01,10),(.05,15),(.15,18),(.30,20),(.50,22),(.70,24),(.85,26),(.95,28),(.99,29),(1,30)]
FULL=1000.; PO_FULL=150.; CLASSIC_PO_CAP=.15
BENCH='stats-per36-current-150-playoff-trajectory.json'
FA_JS='season-free-agent-pool-v0.13.1.js'
LOADER='starting5-runtime-loader-v0.13.0.js'
REG_URL='https://raw.githubusercontent.com/EasySportsApps/nba_api_25_26_data/main/nba_players_regular_season_25_26_wide_data.csv'
PRIOR_URL='https://raw.githubusercontent.com/coder-data/NBA-Stats-Salaries-2024-2025/main/NBA%20Player%20Statistics%202024-2025.csv'
PO_URL='https://raw.githubusercontent.com/llimllib/nba_data/main/data/players_2026_playoffs.parquet'
HIST_URL='https://raw.githubusercontent.com/cmuchina3/nba-stats-1947-present-curated/main/data/raw/Per%2036%20Minutes.csv'


def norm(s):
 s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower(); s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s); return re.sub('[^a-z0-9]','',s)
def get(url):
 with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=90) as r:return r.read().decode('utf-8-sig')
def half(x):return int(math.floor(x+.5))
def prating(p):
 p=max(0,min(1,p))
 for (a,ra),(b,rb) in zip(KNOTS,KNOTS[1:]):
  if p<=b:return max(5,min(30,half(ra+(p-a)/(b-a)*(rb-ra))))
 return 30
def versus(vals,x):
 vals=sorted(vals); n=len(vals); lo=sum(v<x for v in vals); eq=sum(abs(v-x)<1e-9 for v in vals); return prating((lo+(eq-1)/2 if eq else lo)/(n-1))
def canon(c):return re.sub('[^a-z0-9]','',str(c).lower())

def prior_map():
 text=get(PRIOR_URL); lines=[]
 for line in text.splitlines():
  line=line.strip()
  if not line:continue
  if line.startswith('"') and line.endswith('"'):line=line[1:-1].replace('""','"')
  lines.append(line)
 rows=list(csv.DictReader(io.StringIO('\n'.join(lines)))); groups=defaultdict(list)
 for r in rows:groups[norm(r.get('Player'))].append(r)
 out={}
 for k,rs in groups.items():
  totals=[r for r in rs if r.get('Team') in ('2TM','3TM','4TM')]; r=max(totals or rs,key=lambda z:float(z.get('G') or 0)*float(z.get('MP') or 0)); mp=float(r.get('MP') or 0)
  if mp:out[k]={'scoring':float(r.get('PTS') or 0)/mp*36,'rebounding':float(r.get('TRB') or 0)/mp*36,'passing':float(r.get('AST') or 0)/mp*36,'three':float(r.get('3P') or 0)/mp*36,'steals':float(r.get('STL') or 0)/mp*36,'blocks':float(r.get('BLK') or 0)/mp*36}
 return out

def regular_map():
 df=pd.read_csv(io.StringIO(get(REG_URL))); out={}
 for _,r in df.iterrows():
  k=norm(r.player_name); m=float(r.minutes_played or 0)
  if not k or m<=0:continue
  raw={'scoring':(float(r.one_point_made or 0)+2*float(r.two_point_made or 0)+3*float(r.three_point_made or 0))/m*36,'rebounding':(float(r.offensive_rebounds or 0)+float(r.defensive_rebounds or 0))/m*36,'passing':float(r.assists or 0)/m*36,'three':float(r.three_point_made or 0)/m*36,'steals':float(r.steals or 0)/m*36,'blocks':float(r.blocks or 0)/m*36}; gp=float(r.wins or 0)+float(r.losses or 0)
  if k not in out or m>out[k]['minutes']:out[k]={'minutes':m,'gp':gp,'raw':raw}
 return out

def playoff_map():
 with tempfile.NamedTemporaryFile(suffix='.parquet') as f:urlretrieve(PO_URL,f.name); df=pd.read_parquet(f.name)
 cmap={canon(c):c for c in df.columns}
 def cc(*names):
  for n in names:
   if canon(n) in cmap:return cmap[canon(n)]
 name=cc('player_name','player','name'); mins=cc('min','minutes','mp'); gp=cc('gp','g'); age=cc('age'); draft=cc('draft_year')
 per={'scoring':cc('pts_per36','pts_per_36'),'rebounding':cc('reb_per36','trb_per36','reb_per_36'),'passing':cc('ast_per36','ast_per_36'),'three':cc('fg3m_per36','fg3m_per_36','3p_per36'),'steals':cc('stl_per36','stl_per_36'),'blocks':cc('blk_per36','blk_per_36')}; tot={'scoring':cc('pts'),'rebounding':cc('reb','trb'),'passing':cc('ast'),'three':cc('fg3m','3p'),'steals':cc('stl'),'blocks':cc('blk')}; out={}
 for _,r in df.iterrows():
  k=norm(r[name]); m=float(r[mins]) if mins and not pd.isna(r[mins]) else 0
  if not k or m<=0:continue
  vals={c:(float(r[per[c]]) if per[c] and not pd.isna(r[per[c]]) else float(r[tot[c]])/m*36) for c in CATS}; ds=str(r[draft]) if draft and not pd.isna(r[draft]) else ''
  item={'minutes':m,'gp':float(r[gp]) if gp and not pd.isna(r[gp]) else 1,'age':float(r[age]) if age and not pd.isna(r[age]) else 99,'draft':int(float(ds)) if re.fullmatch(r'\d+(\.0)?',ds) else 0,'per36':vals}
  if k not in out or m>out[k]['minutes']:out[k]=item
 return out

def classic_files():
 text=Path(LOADER).read_text(); found=[]
 for f in re.findall(r"['\"](classic-[^'\"]+\.js)(?:\?[^'\"]*)?['\"]",text):
  if any(x in f for x in ['logo-','team-order','year-display','authority','integrity','transparency']):continue
  if Path(f).exists():found.append(f)
 return list(dict.fromkeys(found))

def tuple_entries(path):
 text=Path(path).read_text(); pat=re.compile(r"(\[\s*(['\"])(.*?)\2\s*,\s*(['\"])(PG|SG|SF|PF|C)\4\s*,\s*\[)([^\]]+)(\])"); out=[]
 for m in pat.finditer(text):
  try:old=[int(x.strip()) for x in m.group(6).split(',')]
  except:continue
  if len(old)!=7:continue
  prefix=text[:m.start()]; seasons=re.findall(r"season\s*:\s*['\"](\d{4})['\"]",prefix); year=int(seasons[-1]) if seasons else 0
  out.append({'file':path,'name':m.group(3),'position':m.group(5),'season':year,'old':old,'start':m.start()})
 return out

def historical_regular():
 df=pd.read_csv(io.StringIO(get(HIST_URL))); cmap={canon(c):c for c in df.columns}
 def cc(*names):
  for n in names:
   if canon(n) in cmap:return cmap[canon(n)]
 name=cc('player'); season=cc('season'); team=cc('tm','team'); mp=cc('mp'); cols={'scoring':cc('pts'),'rebounding':cc('trb'),'passing':cc('ast'),'three':cc('3p','x3p','fg3m'),'steals':cc('stl'),'blocks':cc('blk')}
 if not name or not season or any(v is None for v in cols.values()):raise RuntimeError('Historical Per36 schema unresolved: '+str(list(df.columns)))
 out=defaultdict(list)
 for _,r in df.iterrows():
  try:y=int(float(r[season]))
  except:continue
  vals={c:float(r[col]) if not pd.isna(r[col]) else 0 for c,col in cols.items()}; out[(norm(r[name]),y)].append({'team':str(r[team]) if team else '','minutes':float(r[mp]) if mp and not pd.isna(r[mp]) else 0,'per36':vals})
 return out

def historical_playoffs(year):
 # Basketball-Reference per-game table through Jina's text renderer.
 text=get(f'https://r.jina.ai/http://www.basketball-reference.com/playoffs/NBA_{year}_per_game.html'); out={}
 for line in text.splitlines():
  if not line.startswith('|') or '---' in line:continue
  cells=[c.strip() for c in line.strip('|').split('|')]
  if len(cells)<30 or cells[0] in ('Rk',''):continue
  try:
   name=re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',cells[1]); name=re.sub(r'\*+$','',name).strip(); g=float(cells[5]); mpg=float(cells[7]); vals={'scoring':float(cells[29] or 0)/mpg*36,'rebounding':float(cells[23] or 0)/mpg*36,'passing':float(cells[24] or 0)/mpg*36,'three':float(cells[11] or 0)/mpg*36,'steals':float(cells[25] or 0)/mpg*36,'blocks':float(cells[26] or 0)/mpg*36}
  except:continue
  if mpg>0:out[norm(name)]={'minutes':g*mpg,'per36':vals}
 return out

def replace_arrays(path,updates):
 text=Path(path).read_text(); pat=re.compile(r"(\[\s*(['\"])(.*?)\2\s*,\s*(['\"])(PG|SG|SF|PF|C)\4\s*,\s*\[)([^\]]+)(\])"); buckets=defaultdict(list)
 for u in updates:buckets[u['name']].append(u)
 used=defaultdict(int)
 def fn(m):
  name=m.group(3)
  if name not in buckets:return m.group(0)
  i=used[name]; used[name]+=1; u=buckets[name][min(i,len(buckets[name])-1)]; return m.group(1)+','.join(map(str,u['new']))+m.group(7)
 Path(path).write_text(pat.sub(fn,text))

def main():
 bench=json.load(open(BENCH))['players']; bvals={c:[p['trajectoryAdjusted'][c] for p in bench] for c in CATS}; posbase={}; posidx={'PG':0,'SG':1,'SF':2,'PF':3,'C':4}
 for i in range(5):
  ps=[p for p in bench if p['positionIndex']==i]; posbase[i]={c:statistics.median(p['trajectoryAdjusted'][c] for p in ps) for c in CATS}
 reg=regular_map(); prior=prior_map(); po=playoff_map()
 # Free agents
 text=Path(FA_JS).read_text(); fapat=re.compile(r"\['([^']+)','([^']+)','(PG|SG|SF|PF|C)',\[([^\]]+)\]\]"); fas=[]
 for m in fapat.finditer(text):fas.append({'team':m.group(1),'name':m.group(2),'position':m.group(3),'old':[int(x.strip()) for x in m.group(4).split(',')]})
 if len(fas)!=30:raise RuntimeError(f'Free agents expected 30, got {len(fas)}')
 for p in fas:
  k=norm(p['name']); idx=posidx[p['position']]; cur=reg.get(k); pri=prior.get(k); base=posbase[idx]
  if cur:
   w=min(1,cur['minutes']/FULL); adj={c:w*cur['raw'][c]+(1-w)*(pri or base)[c] for c in CATS}; src='2025-26' if w==1 else ('2025-26 + 2024-25' if pri else '2025-26 + positional baseline')
  elif pri:w=0;adj=dict(pri);src='2024-25 fallback'
  else:w=0;adj=dict(base);src='positional baseline'
  q=po.get(k); pw=0
  if cur and q:
   conf=min(1,q['minutes']/PO_FULL); rgmpg=cur['minutes']/max(1,cur['gp']); pompg=q['minutes']/max(1,q['gp']); ratio=pompg/rgmpg if rgmpg else 1; young=q['age']<=23 or q['draft']>=2024; cap=.35 if young and ratio>=1.15 else .30 if young else .15 if ratio>=1.15 else .12; pw=min(cap,(.30 if young else .12)*conf*max(.75,min(1.25,ratio))); adj={c:(1-pw)*adj[c]+pw*q['per36'][c] for c in CATS}
  rat={c:versus(bvals[c],adj[c]) for c in CATS}; o=p['old']; p.update(new=[rat['scoring'],o[1],rat['three'],rat['rebounding'],rat['passing'],rat['blocks'],rat['steals']],ratings=rat,adjusted={c:round(adj[c],4) for c in CATS},regularWeight=round(w,4),playoffWeight=round(pw,4),source=src)
 it=iter(fas)
 def far(m):p=next(it);return m.group(0).replace(m.group(4),','.join(map(str,p['new'])))
 Path(FA_JS).write_text(fapat.sub(far,text))
 # Classics
 files=classic_files(); entries=[]
 for f in files:entries+=tuple_entries(f)
 if len(files)<18 or len(entries)<80:raise RuntimeError(f'Classic discovery too small: {len(files)} files, {len(entries)} entries')
 hist=historical_regular(); years=sorted(set(p['season'] for p in entries)); pomaps={}
 for y in years:
  try:pomaps[y]=historical_playoffs(y)
  except Exception as e:print('WARN playoff',y,e);pomaps[y]={}
 missing=[]
 for p in entries:
  rows=hist.get((norm(p['name']),p['season']),[])
  if not rows:missing.append(f"{p['name']} {p['season']}");continue
  rr=max(rows,key=lambda x:x['minutes']); adj=dict(rr['per36']); q=pomaps[p['season']].get(norm(p['name'])); pw=0
  if q:pw=CLASSIC_PO_CAP*min(1,q['minutes']/PO_FULL);adj={c:(1-pw)*adj[c]+pw*q['per36'][c] for c in CATS}
  rat={c:versus(bvals[c],adj[c]) for c in CATS};o=p['old'];p.update(new=[rat['scoring'],o[1],rat['three'],rat['rebounding'],rat['passing'],rat['blocks'],rat['steals']],ratings=rat,adjusted={c:round(adj[c],4) for c in CATS},playoffWeight=round(pw,4),playoffMatched=bool(q))
 if missing:raise RuntimeError('Missing classic regular data ('+str(len(missing))+'): '+', '.join(missing[:40]))
 byf=defaultdict(list)
 for p in entries:byf[p['file']].append(p)
 for f,u in byf.items():replace_arrays(f,u)
 # Integrity and audits
 allp=fas+entries
 assert all(p['old'][1]==p['new'][1] for p in allp);assert all(5<=v<=30 for p in allp for i,v in enumerate(p['new']) if i!=1)
 faout={'schema':'nba-starting5-free-agents-per36-v2','count':len(fas),'players':fas}; clout={'schema':'nba-starting5-classics-per36-v2','count':len(entries),'classicFiles':files,'years':years,'playoffMatches':sum(p['playoffMatched'] for p in entries),'players':entries}
 json.dump(faout,open('stats-per36-free-agents.json','w'),indent=2,ensure_ascii=False);json.dump(clout,open('stats-per36-classics.json','w'),indent=2,ensure_ascii=False)
 with open('PER36-FREE-AGENTS.md','w') as f:
  f.write('# Free-agent Per36 calibration\n\n30 free agents mapped against the fixed 150-player gameplay benchmark. Dunking preserved.\n\n| Player | Pos | SCO | REB | PAS | 3PT | STL | BLK | PO wt |\n|---|---|---:|---:|---:|---:|---:|---:|---:|\n');[f.write(f"| {p['name']} | {p['position']} | {p['ratings']['scoring']} | {p['ratings']['rebounding']} | {p['ratings']['passing']} | {p['ratings']['three']} | {p['ratings']['steals']} | {p['ratings']['blocks']} | {p['playoffWeight']:.3f} |\n") for p in fas]
 with open('PER36-CLASSICS.md','w') as f:
  f.write(f'# Classic-team Per36 calibration\n\n{len(entries)} classic player entries across {len(files)} active runtime modules. Represented regular season plus same-season playoffs (max 15%), mapped against the fixed modern 150-player benchmark. Dunking preserved.\n\n| Player | Season | SCO | REB | PAS | 3PT | STL | BLK | PO wt |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n');[f.write(f"| {p['name']} | {p['season']} | {p['ratings']['scoring']} | {p['ratings']['rebounding']} | {p['ratings']['passing']} | {p['ratings']['three']} | {p['ratings']['steals']} | {p['ratings']['blocks']} | {p['playoffWeight']:.3f} |\n") for p in entries]
 print(json.dumps({'freeAgents':len(fas),'classicFiles':len(files),'classicEntries':len(entries),'classicPlayoffMatches':clout['playoffMatches'],'years':years,'faChanged':sum(p['new']!=p['old'] for p in fas),'classicChanged':sum(p['new']!=p['old'] for p in entries)},indent=2))
if __name__=='__main__':main()
