#!/usr/bin/env python3
import csv, io, json, math, re, unicodedata, urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
MODERN_URL='https://raw.githubusercontent.com/miamiasheep/nba_analysis/main/bbr_per_game_2026.csv'
MODERN_LEAGUE={'three_pa':37.0,'three_pct':0.360}
ERA={
 '1995':{'three_pa':15.3,'three_pct':0.359},
 '1998':{'three_pa':12.7,'three_pct':0.346},
 '2002':{'three_pa':14.7,'three_pct':0.354},
 '2003':{'three_pa':14.7,'three_pct':0.349},
 '2005':{'three_pa':15.8,'three_pct':0.356},
}

def norm(s):
    s=unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().lower()
    s=s.replace('’',"'").replace('‘',"'")
    return re.sub(r'[^a-z0-9]+',' ',s).strip()

def nfloat(x, default=0.0):
    try:return float(x)
    except:return default

# Source roster directly from the game files.
foundation=(ROOT/'foundation-v0.9.0.js').read_text(encoding='utf-8')
modern_names=[]
for name,pos in re.findall(r"\['([^']*(?:\\'[^']*)*)','(PG|SG|SF|PF|C)',\[", foundation):
    name=name.replace("\\'", "'")
    if name not in modern_names: modern_names.append(name)
if len(modern_names)!=150:
    raise RuntimeError(f'Expected 150 Foundation players, found {len(modern_names)}')

# 2024-25 NBA fallbacks for players who did not play in 2025-26, plus 2025-26 NCAA for 2026 rookies.
fallback={
 'Egor Demin': {'three_pm':2.4,'three_pa':6.2,'three_pct':0.385,'source':'2025-26 NBA'},
 'Kyrie Irving': {'three_pm':2.9,'three_pa':7.2,'three_pct':0.401,'source':'2024-25 NBA'},
 'Fred VanVleet': {'three_pm':2.7,'three_pa':7.7,'three_pct':0.345,'source':'2024-25 NBA'},
 'Tyrese Haliburton': {'three_pm':2.7,'three_pa':6.9,'three_pct':0.388,'source':'2024-25 NBA'},
 'Damian Lillard': {'three_pm':3.4,'three_pa':9.0,'three_pct':0.376,'source':'2024-25 NBA'},
 'Darius Acuff Jr.': {'three_pm':2.5,'three_pa':5.8,'three_pct':0.440,'source':'2025-26 NCAA'},
 'Cameron Boozer': {'three_pm':1.4,'three_pa':3.6,'three_pct':0.391,'source':'2025-26 NCAA'},
 'Keaton Wagler': {'three_pm':2.4,'three_pa':5.9,'three_pct':0.397,'source':'2025-26 NCAA'},
 'Darryn Peterson': {'three_pm':2.6,'three_pa':6.9,'three_pct':0.382,'source':'2025-26 NCAA'},
 'AJ Dybantsa': {'three_pm':1.4,'three_pa':4.2,'three_pct':0.331,'source':'2025-26 NCAA'},
 'Caleb Wilson': {'three_pm':0.3,'three_pa':1.1,'three_pct':0.259,'source':'2025-26 NCAA'},
}

# Classic-team regular-season data. Volume is era-adjusted later; percentages remain season-relative.
classic={
 'Alvin Williams|2003':(.6,1.9,.329),'Vince Carter|2003':(1.0,3.0,.344),'Morris Peterson|2003':(1.4,4.2,.337),'Jerome Williams|2003':(0.0,.1,.167),'Antonio Davis|2003':(0.0,0.0,0.0),
 'Tony Parker|2005':(.5,2.0,.276),'Manu Ginóbili|2005':(1.3,3.5,.376),'Bruce Bowen|2005':(1.2,3.1,.403),'Tim Duncan|2005':(0.0,.1,.333),'Rasho Nesterović|2005':(0.0,0.0,0.0),
 'Ron Harper|1998':(.2,1.0,.190),'Michael Jordan|1998':(.4,1.5,.238),'Scottie Pippen|1998':(1.4,4.4,.318),'Dennis Rodman|1998':(.1,.3,.174),'Luc Longley|1998':(0.0,0.0,0.0),
 'Derek Fisher|2002':(2.1,5.0,.413),'Kobe Bryant|2002':(.4,1.7,.250),'Rick Fox|2002':(.8,2.5,.313),'Robert Horry|2002':(1.2,3.2,.374),"Shaquille O'Neal|2002":(0.0,0.0,0.0),
 'Kenny Smith|1995':(1.8,4.1,.429),'Clyde Drexler|1995':(1.7,4.8,.357),'Robert Horry|1995':(1.3,3.5,.379),'Carl Herrera|1995':(0.0,0.0,0.0),'Hakeem Olajuwon|1995':(0.0,.2,.188),
}
classic_source=(ROOT/'classic-teams-v0.9.30.js').read_text(encoding='utf-8')
classic_rows=[]
season=None
for line in classic_source.splitlines():
    m=re.search(r"season:'(\d{4})'", line)
    if m: season=m.group(1)
    for name,pos in re.findall(r"\['([^']*(?:\\'[^']*)*)','(PG|SG|SF|PF|C)',\[", line):
        classic_rows.append((name.replace("\\'", "'"),season))
    # handle Shaq's double-quoted name
    for name,pos in re.findall(r'\["([^"]+)",\'(PG|SG|SF|PF|C)\',\[', line):
        classic_rows.append((name,season))
if len(classic_rows)!=25:
    raise RuntimeError(f'Expected 25 Classic players, found {len(classic_rows)}')

# Load completed 2025-26 NBA per-game dataset.
with urllib.request.urlopen(MODERN_URL, timeout=30) as r:
    txt=r.read().decode('utf-8-sig')
rows=list(csv.DictReader(io.StringIO(txt)))
by_name={}
for row in rows:
    k=norm(row.get('Player',''))
    if not k: continue
    by_name.setdefault(k,[]).append(row)

def pick_row(name):
    rr=by_name.get(norm(name),[])
    if not rr:return None
    # Prefer a combined multi-team row if available; otherwise highest games played.
    combined=[r for r in rr if re.fullmatch(r'\dTM|TOT',r.get('Team','') or '')]
    return max(combined or rr,key=lambda r:nfloat(r.get('G')))

def clamp(x,a=0.0,b=1.0):return max(a,min(b,x))

def score_components(pm,pa,pct,league_pa,league_pct):
    era_factor=math.sqrt(MODERN_LEAGUE['three_pa']/league_pa)
    adj_pm=pm*era_factor; adj_pa=pa*era_factor
    # Efficiency is relative to that season's league. Tiny samples lose efficiency credit.
    sample=clamp(adj_pa/3.0)
    eff=clamp(0.5+(pct-league_pct)/0.15)*sample if pa>0 else 0.0
    makes=clamp(adj_pm/4.5)
    attempts=clamp(adj_pa/11.0)
    raw=.50*eff+.30*makes+.20*attempts
    return raw,eff,makes,attempts,era_factor,adj_pm,adj_pa

records=[]; missing=[]
for name in modern_names:
    if name in fallback:
        d=fallback[name]; pm,pa,pct=d['three_pm'],d['three_pa'],d['three_pct']; source=d['source']
    else:
        row=pick_row(name)
        if not row:
            missing.append(name); continue
        pm=nfloat(row.get('3P')); pa=nfloat(row.get('3PA')); pct=nfloat(row.get('3P%')); source='2025-26 NBA'
    raw,eff,mk,att,fac,apm,apa=score_components(pm,pa,pct,MODERN_LEAGUE['three_pa'],MODERN_LEAGUE['three_pct'])
    records.append({'name':name,'season':'2025-26','classic':False,'three_pm':pm,'three_pa':pa,'three_pct':pct,'era_factor':fac,'adj_three_pm':apm,'adj_three_pa':apa,'efficiency_component':eff,'makes_component':mk,'attempts_component':att,'raw':raw,'source':source})

for name,season in classic_rows:
    key=f'{name}|{season}'
    if key not in classic:
        missing.append(key); continue
    pm,pa,pct=classic[key]; era=ERA[season]
    raw,eff,mk,att,fac,apm,apa=score_components(pm,pa,pct,era['three_pa'],era['three_pct'])
    records.append({'name':name,'season':season,'classic':True,'three_pm':pm,'three_pa':pa,'three_pct':pct,'era_factor':fac,'adj_three_pm':apm,'adj_three_pa':apa,'efficiency_component':eff,'makes_component':mk,'attempts_component':att,'raw':raw,'source':f'{season} depicted regular season'})

if missing or len(records)!=175:
    raise RuntimeError(f'3PT audit incomplete: {len(records)} records; missing={missing}')

# Calibrate to the same broad population shape as Scoring: 2 / 23 / 49 / 53 / 29 / 19.
# Within each band, ratings are spread evenly; the raw composite determines every player's ordering.
bands=[(2,[4,5]),(23,[6,7,8,9,10]),(49,[11,12,13,14,15]),(53,[16,17,18,19,20]),(29,[21,22,23,24,25]),(19,[26,27,28,29,30])]
ordered=sorted(records,key=lambda x:(x['raw'],x['three_pct'],x['adj_three_pm'],x['name']))
pos=0
for count,vals in bands:
    chunk=ordered[pos:pos+count]
    for i,r in enumerate(chunk):
        idx=min(len(vals)-1, int(i*len(vals)/max(1,count)))
        r['rating']=vals[idx]
    pos+=count
assert pos==175

ranked=sorted(records,key=lambda x:(-x['rating'],-x['raw'],-x['three_pct'],-x['adj_three_pm'],x['name']))
for i,r in enumerate(ranked,1):r['rank']=i
bucket_labels=[(1,5),(6,10),(11,15),(16,20),(21,25),(26,30)]
distribution=[]
for lo,hi in bucket_labels:
    n=sum(lo<=r['rating']<=hi for r in records)
    distribution.append({'range':f'{lo}-{hi}','players':n,'percent':round(n/175*100,1)})

out={
 'status':'AUDIT_ONLY_NOT_APPLIED_TO_GAMEPLAY',
 'formula':{'weights':{'efficiency':0.50,'makes':0.30,'attempts':0.20},'efficiency':'season-relative 3P% with low-volume sample shrink','classic_volume':'3PM/3PA scaled by 2025-26 league 3PA divided by depicted-season league 3PA','modern_league':MODERN_LEAGUE,'era':ERA,'calibration':'rank-preserving distribution matched to Scoring broad bands'},
 'distribution':distribution,
 'top20':[{k:r[k] for k in ('rank','name','season','classic','rating','raw','three_pm','three_pa','three_pct','era_factor')} for r in ranked[:20]],
 'bottom10':[{k:r[k] for k in ('rank','name','season','classic','rating','raw','three_pm','three_pa','three_pct','era_factor')} for r in ranked[-10:]],
 'rated30':[r['name']+(f' ({r["season"]})' if r['classic'] else '') for r in ranked if r['rating']==30],
 'players':ranked,
}
(ROOT/'three-point-audit-v0.10.20.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

lines=['# NBA Courtside v0.10.20 — 3PT Audit (NOT APPLIED TO GAMEPLAY)','',
       '**Formula:** 50% era-relative efficiency + 30% era-adjusted makes + 20% era-adjusted attempts. Low-volume percentages are sample-shrunk. Ratings are rank-calibrated to the same broad 1–30 population shape as Scoring.','',
       '## Distribution','', '| Range | Players | % |','|---|---:|---:|']
for d in distribution:lines.append(f"| {d['range']} | {d['players']} | {d['percent']:.1f}% |")
lines+=['','## Top 20','', '| Rank | Player | Rating | 3PM | 3PA | 3P% | Era factor |','|---:|---|---:|---:|---:|---:|---:|']
for r in ranked[:20]:lines.append(f"| {r['rank']} | {r['name']}{' ('+r['season']+')' if r['classic'] else ''} | {r['rating']} | {r['three_pm']:.1f} | {r['three_pa']:.1f} | {r['three_pct']*100:.1f}% | {r['era_factor']:.2f} |")
lines+=['','## Bottom 10','', '| Rank | Player | Rating | 3PM | 3PA | 3P% |','|---:|---|---:|---:|---:|---:|']
for r in ranked[-10:]:lines.append(f"| {r['rank']} | {r['name']}{' ('+r['season']+')' if r['classic'] else ''} | {r['rating']} | {r['three_pm']:.1f} | {r['three_pa']:.1f} | {r['three_pct']*100:.1f}% |")
(ROOT/'THREE-POINT-AUDIT-v0.10.20.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(json.dumps({'count':len(records),'distribution':distribution,'rated30':out['rated30'],'top10':[(r['name'],r['rating']) for r in ranked[:10]],'bottom':[(r['name'],r['rating']) for r in ranked[-5:]]},ensure_ascii=False,indent=2))
