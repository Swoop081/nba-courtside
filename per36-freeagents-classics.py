import csv, io, json, math, os, re, tempfile, unicodedata
from collections import defaultdict
from pathlib import Path
from urllib.request import Request, urlopen, urlretrieve

import pandas as pd

CATS=['scoring','rebounding','passing','three','steals','blocks']
KNOTS=[(0.00,5),(0.01,10),(0.05,15),(0.15,18),(0.30,20),(0.50,22),(0.70,24),(0.85,26),(0.95,28),(0.99,29),(1.00,30)]
FULL_CONF_MINUTES=1000.0
PLAYOFF_FULL_CONF_MINUTES=150.0
CLASSIC_PLAYOFF_MAX=0.15
MODERN_REG_URL='https://raw.githubusercontent.com/EasySportsApps/nba_api_25_26_data/main/nba_players_regular_season_25_26_wide_data.csv'
PRIOR_URL='https://raw.githubusercontent.com/coder-data/NBA-Stats-Salaries-2024-2025/main/NBA%20Player%20Statistics%202024-2025.csv'
MODERN_PO_URL='https://raw.githubusercontent.com/llimllib/nba_data/main/data/players_2026_playoffs.parquet'
HIST_REG_URL='https://raw.githubusercontent.com/cmuchina3/nba-stats-1947-present-curated/main/data/raw/Per%2036%20Minutes.csv'
BENCHMARK='stats-per36-current-150-playoff-trajectory.json'
FA_FILE='season-free-agent-pool-v0.13.1.js'
LOADER='starting5-runtime-loader-v0.13.0.js'


def norm(s):
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower()
    s=s.replace('’',"'")
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s)
    return re.sub(r'[^a-z0-9]','',s)

def half_up(x): return int(math.floor(x+0.5))

def percentile_to_rating(p):
    p=max(0,min(1,p))
    for (p0,r0),(p1,r1) in zip(KNOTS,KNOTS[1:]):
        if p<=p1:
            y=r0+(p-p0)/(p1-p0)*(r1-r0)
            return max(5,min(30,half_up(y)))
    return 30

def rating_against(vals,x):
    vals=sorted(vals); n=len(vals)
    below=sum(v<x for v in vals); equal=sum(abs(v-x)<1e-9 for v in vals)
    rank=below + ((equal-1)/2 if equal else 0)
    return percentile_to_rating(rank/(n-1))

def download_text(url):
    req=Request(url,headers={'User-Agent':'Mozilla/5.0 NBA Starting5 calibration'})
    with urlopen(req,timeout=90) as r: return r.read().decode('utf-8-sig')

def parse_quoted_csv(text):
    lines=[]
    for line in text.splitlines():
        line=line.strip()
        if not line: continue
        if len(line)>1 and line[0]=='"' and line[-1]=='"': line=line[1:-1].replace('""','"')
        lines.append(line)
    return list(csv.DictReader(io.StringIO('\n'.join(lines))))

def prior_map():
    rows=parse_quoted_csv(download_text(PRIOR_URL)); out={}
    groups=defaultdict(list)
    for r in rows: groups[norm(r.get('Player',''))].append(r)
    for k,rs in groups.items():
        total=[r for r in rs if r.get('Team') in ('2TM','3TM','4TM')]
        pick=max(total or rs,key=lambda r:float(r.get('G') or 0)*float(r.get('MP') or 0))
        mp=float(pick.get('MP') or 0)
        if mp<=0: continue
        out[k]={'scoring':float(pick.get('PTS') or 0)/mp*36,'rebounding':float(pick.get('TRB') or 0)/mp*36,'passing':float(pick.get('AST') or 0)/mp*36,'three':float(pick.get('3P') or 0)/mp*36,'steals':float(pick.get('STL') or 0)/mp*36,'blocks':float(pick.get('BLK') or 0)/mp*36}
    return out

def modern_regular_map():
    df=pd.read_csv(io.StringIO(download_text(MODERN_REG_URL)))
    out={}
    for _,r in df.iterrows():
        k=norm(r['player_name']); m=float(r['minutes_played'] or 0)
        if not k or m<=0: continue
        vals={
          'scoring':(float(r['one_point_made'] or 0)+2*float(r['two_point_made'] or 0)+3*float(r['three_point_made'] or 0))/m*36,
          'rebounding':(float(r['offensive_rebounds'] or 0)+float(r['defensive_rebounds'] or 0))/m*36,
          'passing':float(r['assists'] or 0)/m*36,
          'three':float(r['three_point_made'] or 0)/m*36,
          'steals':float(r['steals'] or 0)/m*36,
          'blocks':float(r['blocks'] or 0)/m*36,
        }
        gp=float(r['wins'] or 0)+float(r['losses'] or 0)
        if k not in out or m>out[k]['minutes']: out[k]={'minutes':m,'gp':gp,'raw':vals,'row':r}
    return out

def parquet_rows(url):
    with tempfile.NamedTemporaryFile(suffix='.parquet') as f:
        urlretrieve(url,f.name); df=pd.read_parquet(f.name)
    lookup={str(c).lower():c for c in df.columns}
    def col(*ns):
        for n in ns:
            if n.lower() in lookup:return lookup[n.lower()]
    name=col('player_name','player','name'); mins=col('min','minutes','mp'); gp=col('gp','g'); age=col('age'); draft=col('draft_year')
    stats={'scoring':col('pts_per36','pts_per_36'),'rebounding':col('reb_per36','trb_per36','reb_per_36'),'passing':col('ast_per36','ast_per_36'),'three':col('fg3m_per36','fg3m_per_36','3p_per36'),'steals':col('stl_per36','stl_per_36'),'blocks':col('blk_per36','blk_per_36')}
    totals={'scoring':col('pts'),'rebounding':col('reb','trb'),'passing':col('ast'),'three':col('fg3m','3p'),'steals':col('stl'),'blocks':col('blk')}
    out={}
    for _,r in df.iterrows():
        k=norm(r[name]); m=float(r[mins] if mins and not pd.isna(r[mins]) else 0)
        if not k or m<=0: continue
        vals={}
        for c in CATS:
            pc=stats[c]
            vals[c]=float(r[pc]) if pc and not pd.isna(r[pc]) else float(r[totals[c]] if totals[c] and not pd.isna(r[totals[c]]) else 0)/m*36
        item={'minutes':m,'gp':float(r[gp] if gp and not pd.isna(r[gp]) else 1),'per36':vals,'age':float(r[age] if age and not pd.isna(r[age]) else 99),'draftYear':int(float(r[draft])) if draft and not pd.isna(r[draft]) and str(r[draft]).replace('.', '', 1).isdigit() else 0}
        if k not in out or m>out[k]['minutes']:out[k]=item
    return out

def historical_regular():
    df=pd.read_csv(io.StringIO(download_text(HIST_REG_URL)))
    low={str(c).lower():c for c in df.columns}
    def col(*ns):
        for n in ns:
            if n.lower() in low:return low[n.lower()]
    name=col('Player','player'); season=col('Season','season','Year','year'); team=col('Team','Tm','team','tm'); mp=col('MP','mp')
    statcols={'scoring':col('PTS','pts'),'rebounding':col('TRB','trb'),'passing':col('AST','ast'),'three':col('3P','3p'),'steals':col('STL','stl'),'blocks':col('BLK','blk')}
    out=defaultdict(list)
    for _,r in df.iterrows():
        try:y=int(float(r[season]))
        except: 
            m=re.search(r'(19|20)\d{2}',str(r[season])); y=int(m.group()) if m else 0
        if not y: continue
        vals={c:float(r[x]) if x and not pd.isna(r[x]) else 0 for c,x in statcols.items()}
        out[(norm(r[name]),y)].append({'team':str(r[team]) if team else '', 'per36':vals,'minutes':float(r[mp]) if mp and not pd.isna(r[mp]) else 0})
    return out

def playoff_markdown(year):
    # Jina supplies a text rendering of Basketball-Reference when direct anti-bot access is unavailable.
    url=f'https://r.jina.ai/http://www.basketball-reference.com/playoffs/NBA_{year}_per_game.html'
    text=download_text(url)
    rows={}
    for line in text.splitlines():
        if not line.startswith('|') or '---' in line: continue
        cells=[c.strip() for c in line.strip('|').split('|')]
        # Expected BRef order starts Rk, Player, Pos, Age, Tm, G, GS, MP ... 3P ... TRB AST STL BLK ... PTS
        if len(cells)<30 or cells[0] in ('Rk',''): continue
        try:
            name=re.sub(r'\*+$','',cells[1]).strip(); g=float(cells[5]); mpg=float(cells[7]); three=float(cells[12] or 0); trb=float(cells[23] or 0); ast=float(cells[24] or 0); stl=float(cells[25] or 0); blk=float(cells[26] or 0); pts=float(cells[29] or 0)
        except: continue
        mins=g*mpg
        if mins<=0: continue
        rows[norm(name)]={'minutes':mins,'per36':{'scoring':pts/mpg*36,'rebounding':trb/mpg*36,'passing':ast/mpg*36,'three':three/mpg*36,'steals':stl/mpg*36,'blocks':blk/mpg*36}}
    return rows

def parse_fa(js):
    pat=re.compile(r"\['([^']*(?:’[^']*)?)','([^']+)','(PG|SG|SF|PF|C)',\[([^\]]+)\]\]")
    out=[]
    for m in pat.finditer(js):
        vals=[int(x.strip()) for x in m.group(4).split(',')]
        out.append({'team':m.group(1),'name':m.group(2),'position':m.group(3),'old':vals})
    return out

def classic_files():
    loader=Path(LOADER).read_text()
    files=re.findall(r'src=\\?"([^"?]+\.js)',loader)
    keep=[]
    for f in files:
        if not f.startswith('classic-'): continue
        if any(x in f for x in ['logo-','team-order','year-display','authority','integrity','transparency']):continue
        if Path(f).exists(): keep.append(f)
    return sorted(set(keep))

def parse_classics_file(path):
    text=Path(path).read_text(); entries=[]
    tup=re.compile(r"\[['\"]([^'\"]+)['\"],['\"](PG|SG|SF|PF|C)['\"],\[([^\]]+)\]\]")
    for m in tup.finditer(text):
        vals=[int(x.strip()) for x in m.group(3).split(',')]
        prefix=text[max(0,m.start()-2500):m.start()]
        seasons=re.findall(r"season\s*:\s*['\"](\d{4})['\"]",prefix)
        year=int(seasons[-1]) if seasons else 0
        if not year:
            years=re.findall(r'(19\d{2}|20\d{2})',path); year=int(years[-1]) if years else 0
        entries.append({'file':path,'name':m.group(1),'position':m.group(2),'season':year,'old':vals,'start':m.start(),'end':m.end()})
    return entries

def apply_tuple_updates(path,updates):
    text=Path(path).read_text(); original=text
    pat=re.compile(r"(\[['\"]([^'\"]+)['\"],['\"](PG|SG|SF|PF|C)['\"],\[)([^\]]+)(\]\])")
    seen=defaultdict(int)
    def repl(m):
        name=m.group(2); seen[name]+=1
        candidates=[u for u in updates if u['name']==name]
        if not candidates:return m.group(0)
        # File-local duplicates are rare; consume in source order.
        u=candidates[min(seen[name]-1,len(candidates)-1)]
        return m.group(1)+','.join(map(str,u['new']))+m.group(5)
    text=pat.sub(repl,text)
    if text!=original:Path(path).write_text(text)

def main():
    bench=json.load(open(BENCHMARK))['players']
    bvals={c:[p['trajectoryAdjusted'][c] for p in bench] for c in CATS}
    posbase={}
    for pos in range(5):
        group=[p for p in bench if p.get('positionIndex')==pos]
        posbase[pos]={c:sorted(p['trajectoryAdjusted'][c] for p in group)[len(group)//2] for c in CATS}
    posidx={'PG':0,'SG':1,'SF':2,'PF':3,'C':4}
    pri=prior_map(); reg=modern_regular_map(); mpo=parquet_rows(MODERN_PO_URL)

    # Free agents
    fajs=Path(FA_FILE).read_text(); fas=parse_fa(fajs)
    fa_audit=[]
    for p in fas:
        k=norm(p['name']); idx=posidx[p['position']]; current=reg.get(k); prior=pri.get(k); base=posbase[idx]
        if current:
            w=min(1,current['minutes']/FULL_CONF_MINUTES); adj={c:w*current['raw'][c]+(1-w)*(prior or base)[c] for c in CATS}; source='2025-26' if w>=1 else ('2025-26 + 2024-25' if prior else '2025-26 + position baseline')
        elif prior:
            w=0; adj=dict(prior); source='2024-25 fallback'
        else:
            w=0; adj=dict(base); source='position baseline (no NBA season sample)'
        powt=0; po=mpo.get(k)
        if current and po:
            conf=min(1,po['minutes']/PLAYOFF_FULL_CONF_MINUTES); regmpg=current['minutes']/max(1,current.get('gp',82)); pompg=po['minutes']/max(1,po['gp']); ratio=pompg/regmpg if regmpg else 1
            young=po['age']<=23 or po['draftYear']>=2024; cap=(.35 if young and ratio>=1.15 else .30 if young else .15 if ratio>=1.15 else .12); basew=.30 if young else .12; powt=min(cap,basew*conf*max(.75,min(1.25,ratio)))
            adj={c:(1-powt)*adj[c]+powt*po['per36'][c] for c in CATS}
        ratings={c:rating_against(bvals[c],adj[c]) for c in CATS}
        old=p['old']; new=[ratings['scoring'],old[1],ratings['three'],ratings['rebounding'],ratings['passing'],ratings['blocks'],ratings['steals']]
        p.update(new=new,adjusted={c:round(adj[c],4) for c in CATS},ratings=ratings,regularConfidence=round(w,4),playoffWeight=round(powt,4),source=source)
        fa_audit.append(p)
    if len(fa_audit)!=30: raise RuntimeError(f'Expected 30 free agents, found {len(fa_audit)}')
    # update FA arrays, source order
    it=iter(fa_audit)
    pat=re.compile(r"(\['[^']*(?:’[^']*)?','[^']+','(?:PG|SG|SF|PF|C)',\[)([^\]]+)(\]\])")
    def far(m):
        p=next(it); return m.group(1)+','.join(map(str,p['new']))+m.group(3)
    Path(FA_FILE).write_text(pat.sub(far,fajs))

    # Classics
    hreg=historical_regular(); files=classic_files(); classics=[]
    for f in files: classics.extend(parse_classics_file(f))
    if not classics: raise RuntimeError('No classic player tuples discovered')
    years=sorted(set(p['season'] for p in classics if p['season']))
    po_by_year={}
    for y in years:
        try: po_by_year[y]=playoff_markdown(y)
        except Exception as e:
            print('WARN playoff source',y,e); po_by_year[y]={}
    missing=[]; classic_audit=[]
    for p in classics:
        k=norm(p['name']); y=p['season']; rows=hreg.get((k,y),[])
        if not rows:
            missing.append(f"{p['name']} {y}"); continue
        rr=max(rows,key=lambda x:x['minutes']); adj=dict(rr['per36']); po=po_by_year.get(y,{}).get(k); powt=0
        if po:
            powt=CLASSIC_PLAYOFF_MAX*min(1,po['minutes']/PLAYOFF_FULL_CONF_MINUTES)
            adj={c:(1-powt)*adj[c]+powt*po['per36'][c] for c in CATS}
        ratings={c:rating_against(bvals[c],adj[c]) for c in CATS}; old=p['old']
        new=[ratings['scoring'],old[1],ratings['three'],ratings['rebounding'],ratings['passing'],ratings['blocks'],ratings['steals']]
        p.update(new=new,adjusted={c:round(adj[c],4) for c in CATS},ratings=ratings,playoffWeight=round(powt,4),regularSourceYear=y,playoffMatched=bool(po))
        classic_audit.append(p)
    if missing: raise RuntimeError('Missing historical regular data: '+', '.join(missing[:30]))
    byfile=defaultdict(list)
    for p in classic_audit:byfile[p['file']].append(p)
    for f,ups in byfile.items():apply_tuple_updates(f,ups)

    # Integrity: six stats may change, dunk must not.
    assert all(p['new'][1]==p['old'][1] for p in fa_audit+classic_audit)
    assert all(5<=v<=30 for p in fa_audit+classic_audit for i,v in enumerate(p['new']) if i!=1)

    json.dump({'schema':'nba-starting5-free-agents-per36-v1','count':len(fa_audit),'benchmarkPopulation':150,'players':fa_audit},open('stats-per36-free-agents.json','w'),indent=2,ensure_ascii=False)
    json.dump({'schema':'nba-starting5-classics-per36-v1','count':len(classic_audit),'benchmarkPopulation':150,'classicFiles':files,'playoffYearsFetched':{str(y):bool(po_by_year[y]) for y in years},'players':classic_audit},open('stats-per36-classics.json','w'),indent=2,ensure_ascii=False)
    with open('PER36-FREE-AGENTS.md','w') as f:
        f.write('# NBA Starting5 — Free-agent Per36 calibration\n\n30 free agents mapped against the fixed 150-player gameplay benchmark. Dunking is preserved.\n\n| Player | Pos | SCO | REB | PAS | 3PT | STL | BLK | PO wt |\n|---|---|---:|---:|---:|---:|---:|---:|---:|\n')
        for p in fa_audit:f.write(f"| {p['name']} | {p['position']} | {p['ratings']['scoring']} | {p['ratings']['rebounding']} | {p['ratings']['passing']} | {p['ratings']['three']} | {p['ratings']['steals']} | {p['ratings']['blocks']} | {p['playoffWeight']:.3f} |\n")
    with open('PER36-CLASSICS.md','w') as f:
        f.write(f'# NBA Starting5 — Classic-team Per36 calibration\n\n{len(classic_audit)} classic player entries across {len(files)} runtime modules, mapped against the fixed modern 150-player benchmark. Represented season only; playoffs can contribute up to 15%. Dunking is preserved.\n\n| Player | Season | SCO | REB | PAS | 3PT | STL | BLK | PO wt |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n')
        for p in classic_audit:f.write(f"| {p['name']} | {p['season']} | {p['ratings']['scoring']} | {p['ratings']['rebounding']} | {p['ratings']['passing']} | {p['ratings']['three']} | {p['ratings']['steals']} | {p['ratings']['blocks']} | {p['playoffWeight']:.3f} |\n")
    print(json.dumps({'freeAgents':len(fa_audit),'classicEntries':len(classic_audit),'classicFiles':len(files),'classicYears':years,'playoffYearsWithRows':[y for y in years if po_by_year[y]],'faChanged':sum(p['new']!=p['old'] for p in fa_audit),'classicChanged':sum(p['new']!=p['old'] for p in classic_audit)},indent=2))

if __name__=='__main__': main()
