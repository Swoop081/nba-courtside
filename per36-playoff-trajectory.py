import json, math, random, re, statistics, tempfile, unicodedata
from collections import defaultdict
from urllib.request import urlretrieve

import pandas as pd

BASE='stats-per36-current-150-gameplay.json'
REG_URL='https://raw.githubusercontent.com/llimllib/nba_data/main/data/players_2026.parquet'
PO_URL='https://raw.githubusercontent.com/llimllib/nba_data/main/data/players_2026_playoffs.parquet'
OUT='stats-per36-current-150-playoff-trajectory.json'
REPORT='PER36-150-PLAYOFF-TRAJECTORY.md'
CATS=['scoring','rebounding','passing','three','steals','blocks']
LABELS={'scoring':'Scoring','rebounding':'Rebounding','passing':'Passing','three':'3PT','steals':'Steals','blocks':'Blocks'}
KNOTS=[(0.00,5),(0.01,10),(0.05,15),(0.15,18),(0.30,20),(0.50,22),(0.70,24),(0.85,26),(0.95,28),(0.99,29),(1.00,30)]
PLAYOFF_FULL_CONF_MINUTES=150.0
YOUNG_MAX_WEIGHT=0.30
YOUNG_ROLE_EXPANDED_MAX=0.35
VET_MAX_WEIGHT=0.12
VET_ROLE_EXPANDED_MAX=0.15
ROLE_EXPANSION_THRESHOLD=1.15
PROBES=['Collin Murray-Boyles','Dylan Harper']


def norm(s):
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower()
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s)
    return re.sub(r'[^a-z0-9]','',s)


def half_up(x): return int(math.floor(x+0.5))


def percentile_to_rating(p):
    p=max(0.0,min(1.0,p))
    for (p0,r0),(p1,r1) in zip(KNOTS,KNOTS[1:]):
        if p<=p1:
            y=r0+(p-p0)/(p1-p0)*(r1-r0) if p1>p0 else r1
            return max(5,min(30,half_up(y)))
    return 30


def avg_rank_percentiles(values):
    indexed=sorted(enumerate(values),key=lambda x:x[1]); n=len(values); out=[0.0]*n; i=0
    while i<n:
        j=i+1
        while j<n and abs(indexed[j][1]-indexed[i][1])<1e-12: j+=1
        p=((i+j-1)/2)/(n-1) if n>1 else .5
        for k in range(i,j): out[indexed[k][0]]=p
        i=j
    return out


def col(df,*names):
    lookup={str(c).lower():c for c in df.columns}
    for n in names:
        if n.lower() in lookup: return lookup[n.lower()]
    return None


def num(row,c,default=0.0):
    if c is None: return default
    try:
        v=row[c]
        return default if pd.isna(v) else float(v)
    except Exception: return default


def per36_from_row(row, cols):
    mp=num(row,cols['min'])
    if mp<=0: return None
    # Prefer source Per36 columns; derive from totals when unavailable.
    def stat(key,totalkey=None):
        pc=cols.get(key+'_per36')
        if pc is not None and not pd.isna(row[pc]): return float(row[pc])
        tc=cols.get(totalkey or key)
        return num(row,tc)/mp*36 if tc is not None else 0.0
    return {
        'scoring':stat('pts'),
        'rebounding':stat('reb'),
        'passing':stat('ast'),
        'three':stat('fg3m'),
        'steals':stat('stl'),
        'blocks':stat('blk'),
    }


def map_cols(df):
    return {
      'name':col(df,'player_name','player','name'),
      'age':col(df,'age'), 'gp':col(df,'gp','g'), 'min':col(df,'min','minutes','mp'),
      'draft_year':col(df,'draft_year'),
      'pts':col(df,'pts'), 'reb':col(df,'reb','trb'), 'ast':col(df,'ast'),
      'fg3m':col(df,'fg3m','3p'), 'stl':col(df,'stl'), 'blk':col(df,'blk'),
      'pts_per36':col(df,'pts_per36','pts_per_36'),
      'reb_per36':col(df,'reb_per36','trb_per36','reb_per_36','trb_per_36'),
      'ast_per36':col(df,'ast_per36','ast_per_36'),
      'fg3m_per36':col(df,'fg3m_per36','fg3m_per_36','3p_per36'),
      'stl_per36':col(df,'stl_per36','stl_per_36'),
      'blk_per36':col(df,'blk_per36','blk_per_36'),
    }


def rows_by_name(df, cols):
    out={}
    if cols['name'] is None: raise RuntimeError('player name column not found: '+','.join(map(str,df.columns)))
    # Prefer combined/totals rows where duplicates exist, otherwise largest-minute row.
    for _,r in df.iterrows():
        k=norm(r[cols['name']]); mp=num(r,cols['min'])
        if not k: continue
        if k not in out or mp>num(out[k],cols['min']): out[k]=r
    return out


def player_is_young(regrow, rcols):
    age=num(regrow,rcols['age'],99)
    draft=''
    if rcols['draft_year'] is not None and not pd.isna(regrow[rcols['draft_year']]): draft=str(regrow[rcols['draft_year']])
    try: draft_y=int(float(draft))
    except Exception: draft_y=0
    return age<=23 or draft_y>=2024


def playoff_weight(regrow, porow, rcols, pcols):
    po_min=num(porow,pcols['min']); po_gp=max(1.0,num(porow,pcols['gp'],1)); reg_min=num(regrow,rcols['min']); reg_gp=max(1.0,num(regrow,rcols['gp'],1))
    confidence=min(1.0,po_min/PLAYOFF_FULL_CONF_MINUTES)
    reg_mpg=reg_min/reg_gp if reg_gp else 0; po_mpg=po_min/po_gp if po_gp else 0
    role_ratio=(po_mpg/reg_mpg) if reg_mpg>0 else 1.0
    young=player_is_young(regrow,rcols)
    expanded=role_ratio>=ROLE_EXPANSION_THRESHOLD
    maxw=(YOUNG_ROLE_EXPANDED_MAX if expanded else YOUNG_MAX_WEIGHT) if young else (VET_ROLE_EXPANDED_MAX if expanded else VET_MAX_WEIGHT)
    # A larger playoff role increases trust modestly; a smaller role reduces it, without exceeding maxw.
    role_factor=max(.75,min(1.25,role_ratio))
    base=(YOUNG_MAX_WEIGHT if young else VET_MAX_WEIGHT)*confidence*role_factor
    w=min(maxw,base)
    return round(w,4), {'young':young,'expandedRole':expanded,'regularMpg':round(reg_mpg,2),'playoffMpg':round(po_mpg,2),'roleRatio':round(role_ratio,3),'playoffMinutes':round(po_min,1),'playoffGames':int(po_gp),'confidence':round(confidence,4),'maxWeight':maxw}


def simulate_team_totals(players,trials=20000):
    byteam=defaultdict(list)
    for p in players: byteam[p['team']].append(p)
    totals=[]; rng=random.Random(20260908)
    for roster in byteam.values():
        if len(roster)!=5: continue
        for _ in range(trials):
            unused=set(range(5)); total=0
            for _q in range(4):
                cat=rng.choice(CATS)
                pick=max(unused,key=lambda i:(roster[i]['ratings'][cat],roster[i]['trajectoryAdjusted'][cat]))
                total+=roster[pick]['ratings'][cat]; unused.remove(pick)
            totals.append(total)
    totals.sort()
    def pct(x): return totals[min(len(totals)-1,max(0,round((len(totals)-1)*x)))]
    return {'trialsPerTeam':trials,'samples':len(totals),'mean':round(statistics.mean(totals),2),'median':round(statistics.median(totals),2),'p10':pct(.1),'p25':pct(.25),'p75':pct(.75),'p90':pct(.9),'minObserved':totals[0],'maxObserved':totals[-1],'perfectCeiling':120}


def projected_probe(name, regrow, porow, rcols, pcols, population):
    reg36=per36_from_row(regrow,rcols); po36=per36_from_row(porow,pcols)
    w,meta=playoff_weight(regrow,porow,rcols,pcols)
    adj={c:round((1-w)*reg36[c]+w*po36[c],4) for c in CATS}
    ratings={}
    for c in CATS:
        vals=sorted([p['trajectoryAdjusted'][c] for p in population])
        below=sum(v<adj[c] for v in vals); equal=sum(abs(v-adj[c])<1e-12 for v in vals)
        rankpos=below+(equal-1)/2 if equal else below
        pct=rankpos/(len(vals)-1)
        ratings[c]=percentile_to_rating(pct)
    return {'name':name,'regularPer36':{c:round(reg36[c],4) for c in CATS},'playoffPer36':{c:round(po36[c],4) for c in CATS},'playoffWeight':w,'trajectoryAdjusted':adj,'projectedRatingsAgainst150':ratings,'meta':meta}


def main():
    with open(BASE,encoding='utf-8') as f: base=json.load(f)
    players=[dict(p) for p in base['players']]
    with tempfile.TemporaryDirectory() as td:
        rp=td+'/reg.parquet'; pp=td+'/po.parquet'; urlretrieve(REG_URL,rp); urlretrieve(PO_URL,pp)
        reg=pd.read_parquet(rp); po=pd.read_parquet(pp)
    rcols=map_cols(reg); pcols=map_cols(po); rr=rows_by_name(reg,rcols); pr=rows_by_name(po,pcols)

    direct=[]; matched=0
    for p in players:
        k=norm(p['name']); regrow=rr.get(k); porow=pr.get(k)
        p['prePlayoffAdjusted']=dict(p['adjusted']); p['trajectoryAdjusted']=dict(p['adjusted']); p['playoffWeight']=0.0; p['playoffMeta']=None
        if regrow is None or porow is None: continue
        po36=per36_from_row(porow,pcols)
        if po36 is None: continue
        matched+=1
        w,meta=playoff_weight(regrow,porow,rcols,pcols)
        p['playoffWeight']=w; p['playoffMeta']=meta; p['playoffPer36']={c:round(po36[c],4) for c in CATS}
        p['trajectoryAdjusted']={c:round((1-w)*p['prePlayoffAdjusted'][c]+w*po36[c],4) for c in CATS}
        if w>0: direct.append(p)

    oldratings={p['name']:dict(p['ratings']) for p in players}
    for c in CATS:
        ps=avg_rank_percentiles([p['trajectoryAdjusted'][c] for p in players])
        for p,pc in zip(players,ps):
            p.setdefault('trajectoryPercentiles',{})[c]=round(pc,5); p['ratings'][c]=percentile_to_rating(pc)
    for p in players:
        p['ratingChanges']={c:p['ratings'][c]-oldratings[p['name']][c] for c in CATS}

    top5={}; means={}; medians={}; dist={c:{str(n):0 for n in range(5,31)} for c in CATS}
    for c in CATS:
        ordered=sorted(players,key=lambda p:(p['ratings'][c],p['trajectoryAdjusted'][c]),reverse=True)
        top5[c]=[{'name':p['name'],'team':p['team'],'adjustedPer36':p['trajectoryAdjusted'][c],'rating':p['ratings'][c]} for p in ordered[:5]]
        means[c]=round(statistics.mean(p['ratings'][c] for p in players),3); medians[c]=round(statistics.median(p['ratings'][c] for p in players),3)
        for p in players: dist[c][str(p['ratings'][c])]+=1

    movers=[]
    for p in players:
        abschange=sum(abs(v) for v in p['ratingChanges'].values())
        rawshift=sum(abs(p['trajectoryAdjusted'][c]-p['prePlayoffAdjusted'][c]) for c in CATS)
        if abschange or p['playoffWeight']>0: movers.append({'name':p['name'],'team':p['team'],'playoffWeight':p['playoffWeight'],'playoffMeta':p['playoffMeta'],'changes':p['ratingChanges'],'absRatingChange':abschange,'rawShift':round(rawshift,4)})
    movers.sort(key=lambda x:(x['absRatingChange'],x['rawShift']),reverse=True)

    probes={}
    for name in PROBES:
        k=norm(name)
        if k in rr and k in pr: probes[name]=projected_probe(name,rr[k],pr[k],rcols,pcols,players)

    sim=simulate_team_totals(players)
    out={'schema':'nba-starting5-per36-gameplay-weighted-playoff-trajectory-v1','population':150,'teamCount':30,'sources':{'regularSeason':REG_URL,'playoffs':PO_URL},'method':{'base':'stats-per36-current-150-gameplay.json reliability-adjusted regular-season model','playoffFullConfidenceMinutes':PLAYOFF_FULL_CONF_MINUTES,'youngDefinition':'age <= 23 OR drafted 2024 or later','youngPlayoffWeight':'30% at full playoff confidence; up to 35% when playoff MPG is at least 15% above regular-season MPG','veteranPlayoffWeight':'12% at full confidence; up to 15% for expanded playoff role','playoffConfidence':'linear by playoff minutes up to 150','gameplayMapping':'rerank trajectory-adjusted Per36 against same 150-player population and same median-22 curve'},'playoffMatchedPopulation':matched,'ratingMeans':means,'ratingMedians':medians,'distribution':dist,'top5':top5,'teamScoreSimulation':sim,'largestMovers':movers[:30],'probes':probes,'players':players}
    with open(OUT,'w',encoding='utf-8') as f: json.dump(out,f,ensure_ascii=False,indent=2)

    lines=['# NBA Starting5 — 150-player playoff trajectory audit','',f'Playoff data matched **{matched}** of the 150 current-team population players.','',
      '## Locked trajectory rule','',
      '- Base remains the reliability-adjusted 2025–26 regular-season Per36 model.','- Playoff sample reaches full confidence at 150 minutes.','- Young player = age 23 or younger, or drafted in 2024/2025.','- Young players: up to 30% playoff weight; up to 35% when playoff MPG rose at least 15%.','- Established players: up to 12%; up to 15% with an expanded playoff role.','- The resulting Per36 values are reranked through the same gameplay curve with median 22.','',
      '## Expected four-quarter scoring','',f"Mean **{sim['mean']}**, median **{sim['median']}**, middle 50% **{sim['p25']}–{sim['p75']}**, 10th–90th **{sim['p10']}–{sim['p90']}**, ceiling **120**.",'',
      '## Population rating profile','', '| Category | Mean | Median |','|---|---:|---:|']
    for c in CATS: lines.append(f"| {LABELS[c]} | {means[c]:.2f} | {medians[c]:.2f} |")
    lines += ['','## Biggest rating movers','', '| Player | Team | PO wt | MPG reg→PO | Rating changes |','|---|---|---:|---:|---|']
    for m in movers[:20]:
        meta=m['playoffMeta']; mpg='—' if not meta else f"{meta['regularMpg']}→{meta['playoffMpg']}"
        changes=', '.join(f"{LABELS[c]} {v:+d}" for c,v in m['changes'].items() if v) or 'no integer change'
        lines.append(f"| {m['name']} | {m['team']} | {m['playoffWeight']:.3f} | {mpg} | {changes} |")
    lines += ['','## User-noted trajectory probes','']
    for name,p in probes.items():
        lines += [f"### {name}",f"Playoff minutes {p['meta']['playoffMinutes']:.0f}; MPG {p['meta']['regularMpg']}→{p['meta']['playoffMpg']}; playoff weight {p['playoffWeight']:.3f}.",'', '| Category | Regular /36 | Playoff /36 | Trajectory /36 | Rating vs 150 |','|---|---:|---:|---:|---:|']
        for c in CATS: lines.append(f"| {LABELS[c]} | {p['regularPer36'][c]:.2f} | {p['playoffPer36'][c]:.2f} | {p['trajectoryAdjusted'][c]:.2f} | {p['projectedRatingsAgainst150'][c]} |")
        lines.append('')
    lines += ['## Top five after trajectory layer','']
    for c in CATS:
        lines.append(f"### {LABELS[c]}")
        for i,p in enumerate(top5[c],1): lines.append(f"{i}. {p['name']} ({p['team']}) — {p['adjustedPer36']:.2f}/36 → {p['rating']}")
        lines.append('')
    with open(REPORT,'w',encoding='utf-8') as f: f.write('\n'.join(lines)+'\n')
    print(json.dumps({'matched':matched,'simulation':sim,'probes':probes,'largestMovers':movers[:12]},indent=2))

if __name__=='__main__': main()
