import csv, io, json, math, random, re, statistics, unicodedata
from collections import defaultdict
from urllib.request import urlopen

CURRENT='stats-per36-current-150-audit.json'
PRIOR_URL='https://raw.githubusercontent.com/coder-data/NBA-Stats-Salaries-2024-2025/main/NBA%20Player%20Statistics%202024-2025.csv'
CATS=['scoring','rebounding','passing','three','steals','blocks']
LABELS={'scoring':'Scoring','rebounding':'Rebounding','passing':'Passing','three':'3PT','steals':'Steals','blocks':'Blocks'}
FULL_CONF_MINUTES=1000.0
KNOTS=[(0.00,5),(0.01,10),(0.05,15),(0.15,18),(0.30,20),(0.50,22),(0.70,24),(0.85,26),(0.95,28),(0.99,29),(1.00,30)]
VETERAN_NO_CURRENT={'Kyrie Irving','Herb Jones','Damian Lillard','Fred VanVleet','Tyrese Haliburton'}


def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s)
    return re.sub(r'[^a-z0-9]','',s)


def half_up(x):
    return int(math.floor(x+0.5))


def percentile_to_rating(p):
    p=max(0.0,min(1.0,p))
    for (p0,r0),(p1,r1) in zip(KNOTS,KNOTS[1:]):
        if p<=p1:
            y=r0+(p-p0)/(p1-p0)*(r1-r0) if p1>p0 else r1
            return max(5,min(30,half_up(y)))
    return 30


def avg_rank_percentiles(values):
    indexed=sorted(enumerate(values),key=lambda x:x[1])
    n=len(values)
    out=[0.0]*n
    i=0
    while i<n:
        j=i+1
        while j<n and abs(indexed[j][1]-indexed[i][1])<1e-12:
            j+=1
        avg=((i)+(j-1))/2
        p=avg/(n-1) if n>1 else 0.5
        for k in range(i,j): out[indexed[k][0]]=p
        i=j
    return out


def parse_prior_csv(text):
    rows=[]
    for line in text.splitlines():
        line=line.strip()
        if not line: continue
        if len(line)>=2 and line[0]=='"' and line[-1]=='"':
            line=line[1:-1].replace('""','"')
        rows.append(next(csv.reader([line])))
    header=rows[0]
    return [dict(zip(header,r)) for r in rows[1:] if len(r)==len(header)]


def choose_prior_rows(rows):
    grouped=defaultdict(list)
    for r in rows: grouped[norm(r.get('Player',''))].append(r)
    out={}
    for k,rs in grouped.items():
        combined=[r for r in rs if r.get('Team') in ('2TM','3TM','4TM')]
        if combined:
            pick=max(combined,key=lambda r:float(r.get('G') or 0))
        else:
            pick=max(rs,key=lambda r:float(r.get('G') or 0)*float(r.get('MP') or 0))
        out[k]=pick
    return out


def prior_per36(r):
    mp=float(r.get('MP') or 0)
    if mp<=0: return None
    return {
        'scoring':float(r.get('PTS') or 0)/mp*36,
        'rebounding':float(r.get('TRB') or 0)/mp*36,
        'passing':float(r.get('AST') or 0)/mp*36,
        'three':float(r.get('3P') or 0)/mp*36,
        'steals':float(r.get('STL') or 0)/mp*36,
        'blocks':float(r.get('BLK') or 0)/mp*36,
    }


def simulate_team_totals(players, trials=20000):
    byteam=defaultdict(list)
    for p in players: byteam[p['team']].append(p)
    totals=[]
    rng=random.Random(20260908)
    for team,roster in byteam.items():
        if len(roster)!=5: continue
        for _ in range(trials):
            unused=set(range(5)); total=0
            for q in range(4):
                cat=rng.choice(CATS)
                choice=max(unused,key=lambda i:(roster[i]['ratings'][cat],roster[i]['adjusted'][cat]))
                total+=roster[choice]['ratings'][cat]
                unused.remove(choice)
            totals.append(total)
    totals.sort()
    def pct(p): return totals[min(len(totals)-1,max(0,round((len(totals)-1)*p)))]
    return {
        'trialsPerTeam':trials,
        'samples':len(totals),
        'mean':round(statistics.mean(totals),2),
        'median':round(statistics.median(totals),2),
        'p10':pct(.10),'p25':pct(.25),'p75':pct(.75),'p90':pct(.90),
        'minObserved':totals[0],'maxObserved':totals[-1],
        'perfectCeiling':120,
        'note':'Six Per36 categories only; Dunking remains on its separate methodology.'
    }


def main():
    with open(CURRENT,encoding='utf-8') as f: audit=json.load(f)
    players=[dict(p) for p in audit['players']]

    # Restore the intended current five where the first audit had to substitute a player with no 2025-26 sample.
    # Injured veterans use 2024-25 as their statistical baseline. 2026 rookies use their position-index population
    # baseline for this calibration pass so uncertain projections do not distort the 150-player scale.
    sub_by_audit={(s['team'],s['auditPlayer']):s['projected'] for s in audit.get('substitutions',[])}
    for p in players:
        repl=sub_by_audit.get((p['team'],p['name']))
        if repl:
            p['auditSubstituteName']=p['name']
            p['name']=repl
            p['restoredProjectedPlayer']=True

    prior_text=urlopen(PRIOR_URL,timeout=60).read().decode('utf-8-sig')
    prior=choose_prior_rows(parse_prior_csv(prior_text))

    # Position-index fallback medians from actual current-season samples.
    pos_medians={}
    for pos in range(5):
        pos_medians[pos]={}
        group=[p for p in players if p['positionIndex']==pos and not p.get('restoredProjectedPlayer')]
        for c in CATS:
            pos_medians[pos][c]=statistics.median(p['raw'][c] for p in group)

    for p in players:
        pk=prior.get(norm(p['name']))
        pp=prior_per36(pk) if pk else None
        restored=p.get('restoredProjectedPlayer',False)
        if restored and p['name'] in VETERAN_NO_CURRENT and pp:
            p['confidenceWeight']=0.0
            p['reliabilitySource']='2024-25 prior season only; no 2025-26 sample'
            p['adjusted']={c:round(pp[c],4) for c in CATS}
            p['currentRawAvailable']=False
        elif restored:
            p['confidenceWeight']=0.0
            p['reliabilitySource']='provisional position baseline; no NBA sample yet'
            p['adjusted']={c:round(pos_medians[p['positionIndex']][c],4) for c in CATS}
            p['currentRawAvailable']=False
        else:
            mins=float(p.get('minutes2025_26') or 0)
            w=min(1.0,mins/FULL_CONF_MINUTES)
            fallback=pp if pp else pos_medians[p['positionIndex']]
            p['confidenceWeight']=round(w,4)
            p['reliabilitySource']='2025-26 only' if w>=1 else ('blend with 2024-25 prior' if pp else 'blend with position baseline')
            p['adjusted']={c:round(w*p['raw'][c]+(1-w)*fallback[c],4) for c in CATS}
            p['currentRawAvailable']=True
            if pp: p['priorPer36']={c:round(pp[c],4) for c in CATS}

    # Gameplay mapping: preserve relative order from adjusted Per36, then lift the population so the median is ~22.
    for c in CATS:
        vals=[p['adjusted'][c] for p in players]
        ps=avg_rank_percentiles(vals)
        for p,pc in zip(players,ps):
            p.setdefault('percentiles',{})[c]=round(pc,5)
            p.setdefault('ratings',{})[c]=percentile_to_rating(pc)

    dist={c:{str(n):0 for n in range(5,31)} for c in CATS}
    top5={}
    means={}; medians={}
    for c in CATS:
        for p in players: dist[c][str(p['ratings'][c])]+=1
        ordered=sorted(players,key=lambda p:(p['ratings'][c],p['adjusted'][c]),reverse=True)
        top5[c]=[{'name':p['name'],'team':p['team'],'adjustedPer36':p['adjusted'][c],'rating':p['ratings'][c],'confidenceWeight':p['confidenceWeight']} for p in ordered[:5]]
        means[c]=round(statistics.mean(p['ratings'][c] for p in players),3)
        medians[c]=round(statistics.median(p['ratings'][c] for p in players),3)

    ty=next((p for p in players if p['name']=='Ty Jerome'),None)
    sim=simulate_team_totals(players)

    out={
      'schema':'nba-starting5-per36-gameplay-weighted-v1',
      'population':150,'teamCount':30,
      'method':{
        'sampleReliability':f'2025-26 reaches full confidence at {int(FULL_CONF_MINUTES)} minutes; below that blends with 2024-25 when available, otherwise a position-index baseline',
        'noCurrentVeterans':'use 2024-25 baseline',
        'noNbaSampleRookies':'provisional position-index baseline for calibration only',
        'gameplayMapping':'average-rank percentile within 150 adjusted players, then piecewise gameplay curve',
        'curveKnots':[{'percentile':p,'rating':r} for p,r in KNOTS],
        'targetMedian':22,
        'ratingRange':[5,30],
        'quarterCeiling':30,'fourQuarterCeiling':120,
      },
      'ratingMeans':means,'ratingMedians':medians,
      'distribution':dist,'top5':top5,
      'teamScoreSimulation':sim,
      'tyJeromeCheck':ty,
      'players':players
    }
    with open('stats-per36-current-150-gameplay.json','w',encoding='utf-8') as f: json.dump(out,f,ensure_ascii=False,indent=2)

    lines=['# NBA Starting5 — 150-player gameplay-weighted Per36 calibration','',
      'Population: 30 current team fives = 150 intended players.','',
      f'Reliability: 2025–26 reaches full confidence at {int(FULL_CONF_MINUTES)} minutes. Below that, current Per36 is blended with 2024–25 when available; players with no NBA sample use a provisional position-index baseline for this calibration pass.','',
      'Gameplay curve: adjusted Per36 determines percentile/rank; percentile is mapped to a 5–30 gameplay score with population median targeted at 22.','',
      'Curve knots: 0%=5, 1%=10, 5%=15, 15%=18, 30%=20, 50%=22, 70%=24, 85%=26, 95%=28, 99%=29, 100%=30.','',
      '## Population rating profile','',
      '| Category | Mean | Median |','|---|---:|---:|']
    for c in CATS: lines.append(f"| {LABELS[c]} | {means[c]:.2f} | {medians[c]:.2f} |")
    lines += ['', '## Expected four-quarter scoring','',
      f"Greedy best-unused-player simulation over the six Per36 categories: **mean {sim['mean']}**, median {sim['median']}, middle 50% {sim['p25']}–{sim['p75']}, 10th–90th percentile {sim['p10']}–{sim['p90']}. Maximum remains **120**.",
      '', 'Dunking is excluded from this simulation because it remains a separately calibrated seventh category.','',
      '## Top five by category','']
    for c in CATS:
        lines.append(f"### {LABELS[c]}")
        for i,p in enumerate(top5[c],1): lines.append(f"{i}. {p['name']} ({p['team']}) — adjusted {p['adjustedPer36']:.2f}/36 → {p['rating']}")
        lines.append('')
    lines += ['## Rating distribution','', '| Rating | SCO | REB | PAS | 3PT | STL | BLK |','|---:|---:|---:|---:|---:|---:|---:|']
    for n in range(5,31): lines.append('| '+str(n)+' | '+' | '.join(str(dist[c][str(n)]) for c in CATS)+' |')
    if ty:
        lines += ['', '## Ty Jerome sample check','',
          f"2025–26 minutes: {ty.get('minutes2025_26',0):.1f}; confidence weight: {ty['confidenceWeight']:.3f}; source: {ty['reliabilitySource']}.",
          f"Scoring raw {ty['raw']['scoring']:.2f}/36 → adjusted {ty['adjusted']['scoring']:.2f}/36 → gameplay rating {ty['ratings']['scoring']}." ]
    with open('PER36-150-GAMEPLAY-CALIBRATION.md','w',encoding='utf-8') as f: f.write('\n'.join(lines)+'\n')

    print(json.dumps({'means':means,'medians':medians,'top5':top5,'simulation':sim,'tyJerome':None if not ty else {'minutes':ty.get('minutes2025_26'),'weight':ty['confidenceWeight'],'rawScoring':ty['raw']['scoring'],'adjustedScoring':ty['adjusted']['scoring'],'rating':ty['ratings']['scoring']}},indent=2))

if __name__=='__main__': main()
