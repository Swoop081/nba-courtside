import json, pathlib, collections, networkx as nx, random
from datetime import date, timedelta
ROOT=pathlib.Path(__file__).resolve().parents[1]
league=json.loads((ROOT/'data/league-2026-08-19.json').read_text())
teams=league['teams']; by={t['abbr']:t for t in teams}; abbrs=list(by)
SEED=20262704
rng=random.Random(SEED)
# Choose four 3-game non-division conference opponents per team: two from each other division.
three=set()
for conf in ['East','West']:
    divs=collections.defaultdict(list)
    for t in teams:
        if t['conference']==conf: divs[t['division']].append(t['abbr'])
    names=sorted(divs)
    for v in divs.values(): v.sort()
    pairs=[(names[0],names[1],(0,1)),(names[0],names[2],(0,2)),(names[1],names[2],(1,3))]
    for d1,d2,offs in pairs:
        A,B=divs[d1],divs[d2]
        for i,a in enumerate(A):
            for o in offs: three.add(tuple(sorted((a,B[(i+o)%5]))))
# Orient 3-game edges so each team gets 2 of its 4 series with two home games.
three_home_extra={}
for conf in ['East','West']:
    G=nx.Graph(); G.add_nodes_from([t['abbr'] for t in teams if t['conference']==conf])
    G.add_edges_from([e for e in three if by[e[0]]['conference']==conf])
    assert all(d==4 for _,d in G.degree())
    circuit=list(nx.eulerian_circuit(G))
    for u,v in circuit:
        key=tuple(sorted((u,v)))
        if key not in three_home_extra: three_home_extra[key]=u
# Pair multiplicities and home allocations.
pair_count={}; homes={}
for i,a in enumerate(abbrs):
    for b in abbrs[i+1:]:
        ta,tb=by[a],by[b]; key=tuple(sorted((a,b)))
        if ta['conference']!=tb['conference']: n=2
        elif ta['division']==tb['division']: n=4
        elif key in three: n=3
        else: n=4
        pair_count[key]=n
        if n==2: homes[key]=[a,b]
        elif n==4: homes[key]=[a,a,b,b]
        else:
            extra=three_home_extra[key]; other=b if extra==a else a
            homes[key]=[extra,extra,other]
        rng.shuffle(homes[key])
assert set(sum(n for p,n in pair_count.items() if t in p) for t in abbrs)=={82}
# Calendar blocks: 82 two-day-ish windows within the official regular-season dates, excluding All-Star break.
start=date(2026,10,20); end=date(2027,4,11)
blocked={date(2027,2,19)+timedelta(days=i) for i in range(6)}
available=[start+timedelta(days=i) for i in range((end-start).days+1) if start+timedelta(days=i) not in blocked]
# 168 available days -> 84 blocks. Keep first/last and drop two low-priority midseason blocks to yield 82 rounds.
blocks=[available[i:i+2] for i in range(0,len(available),2)]
# Remove two blocks around non-marquee midseason dates while preserving Christmas.
drop=[]
for target in [date(2026,12,6), date(2027,1,31)]:
    idx=min(range(len(blocks)), key=lambda i: abs((blocks[i][0]-target).days))
    if idx not in drop: drop.append(idx)
blocks=[b for i,b in enumerate(blocks) if i not in drop]
assert len(blocks)==82
# Generate 82 perfect matchings from the 82-regular opponent multigraph.
for attempt in range(100):
    rem=pair_count.copy(); rounds=[]; ok=True
    local=random.Random(SEED+attempt)
    for r in range(82):
        G=nx.Graph(); G.add_nodes_from(abbrs)
        for (a,b),n in rem.items():
            if n>0:
                G.add_edge(a,b,weight=1000+n*10+local.random())
        m=nx.algorithms.matching.max_weight_matching(G,maxcardinality=True,weight='weight')
        if len(m)!=15:
            ok=False; break
        rd=[]
        for a,b in m:
            key=tuple(sorted((a,b))); rem[key]-=1; rd.append(key)
        rounds.append(rd)
    if ok and all(v==0 for v in rem.values()): break
else:
    raise RuntimeError('Could not build round schedule')

# Build game objects and assign home/away occurrence by occurrence.
games=[]
home_remaining={k:list(v) for k,v in homes.items()}
for r,rd in enumerate(rounds):
    dates=blocks[r]
    for j,key in enumerate(rd):
        a,b=key
        pool=home_remaining[key]
        home=pool.pop()
        away=b if home==a else a
        game_date=dates[0] if j<7 else dates[-1]
        games.append({
            'id':f'G{len(games)+1:04d}', 'date':game_date.isoformat(), 'round':r+1,
            'away':away,'home':home,'status':'scheduled','away_score':None,'home_score':None,
            'source':'generated_nba_style', 'marquee':False,
        })

# Validate team counts / home-away.
count=collections.Counter(); homec=collections.Counter()
for g in games:
    count[g['away']]+=1; count[g['home']]+=1; homec[g['home']]+=1
assert len(games)==1230
assert set(count.values())=={82}, count
assert set(homec.values())=={41}, homec
# Sanity: no team twice on same date.
seen=set()
for g in games:
    for t in [g['away'],g['home']]:
        k=(g['date'],t)
        if k in seen: raise AssertionError(k)
        seen.add(k)
out={
 'season':'2026-27','kind':'NBA-style simulation schedule','official_schedule_exact':False,
 'official_dates':{
   'opening_day':'2026-10-20','opening_day_rosters_set':'2026-10-19','trade_deadline':'2027-02-11',
   'all_star_break_start':'2027-02-19','all_star_break_end':'2027-02-24','regular_season_end':'2027-04-11',
 },
 'notes':[
   'All teams play 82 games with 41 home and 41 away.',
   'Opponent frequency follows the standard NBA 82-game structure.',
   'Remaining dates/matchups are a deterministic simulation calendar for this prototype, not a claim to reproduce the complete official NBA schedule.'
 ],
 'games':sorted(games,key=lambda g:(g['date'],g['id']))
}
(ROOT/'data/schedule-2026-27.json').write_text(json.dumps(out,indent=2))
(ROOT/'data/schedule.js').write_text('window.NBA_COURTSIDE_SCHEDULE = '+json.dumps(out,separators=(',',':'))+';\n')
print('built',len(games),'games')
print('range',out['games'][0]['date'],out['games'][-1]['date'])
