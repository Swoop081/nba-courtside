#!/usr/bin/env python3
from pathlib import Path
import csv,json,re,sys,unicodedata,hashlib
import pandas as pd
ROOT=Path(__file__).resolve().parents[1]
players=json.load(open(ROOT/'data/players-2026-08-19.json',encoding='utf-8'))
raw=pd.read_csv(ROOT/'raw/bref_player_per_game_2025_26_final.csv')
raw=raw[(raw.season==2026)&(raw.lg=='NBA')].copy()
MULTI={'2TM','3TM','4TM','5TM','6TM'}
ALIASES={'alexandresarr':'alexsarr','cameronchristie':'camchristie','nicolasclaxton':'nicclaxton','ludort':'luguentzdort','carltoncarrington':'bubcarrington','egordmin':'egordemin','hansenyang':'yanghansen','yanickonanniederhauser':'yanicniederhauser'}
def norm(s):
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower()
    s=s.replace('’',"'").replace('.','').replace('-',' ')
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s); s=re.sub(r'[^a-z0-9]','',s)
    return ALIASES.get(s,s)
canon=[]
for _,g in raw.groupby('player_id',sort=False):
    agg=g[g.team.isin(MULTI)]; canon.append((agg.iloc[0] if len(agg) else g.iloc[0]).copy())
source={norm(r.player):r for r in canon}
errors=[]
def ck(x,msg):
    if not x: errors.append(msg)
ck(len(players)==442,'442 player records')
ck(len({p['id'] for p in players})==442,'unique internal ids')
nba=[p['nba_id'] for p in players if p.get('nba_id') is not None]
ck(len(nba)==len(set(nba)),'unique nba ids')
evidence=[p for p in players if p.get('stats_2025_26')]; proj=[p for p in players if not p.get('stats_2025_26')]
ck(len(evidence)==393,'393 evidence players'); ck(len(proj)==49,'49 projection players')
# Raw source join and field plausibility.
for p in evidence:
    n=norm(p['name']); ck(n in source,f'raw source join: {p["name"]}')
    s=p['stats_2025_26']
    if n in source:
        rr=source[n]
        exact={
          'gp':int(round(rr.g)),'gs':int(round(rr.gs)),'mpg':round(float(rr.mp_per_game),1),
          'pts':round(float(rr.pts_per_game),1),'reb':round(float(rr.trb_per_game),1),'ast':round(float(rr.ast_per_game),1),
          'stl':round(float(rr.stl_per_game),1),'blk':round(float(rr.blk_per_game),1),'tov':round(float(rr.tov_per_game),1),
          'fga':round(float(rr.fga_per_game),1),'three_pa':round(float(rr.x3pa_per_game),1),'fta':round(float(rr.fta_per_game),1),
          'oreb':round(float(rr.orb_per_game),1),'dreb':round(float(rr.drb_per_game),1),'pf':round(float(rr.pf_per_game),1),
        }
        for k,v in exact.items(): ck(s.get(k)==v,f'exact source field {k} {p["name"]}')
        pctmap={'fg_pct':'fg_percent','three_pct':'x3p_percent','ft_pct':'ft_percent'}
        for k,rc in pctmap.items():
            rv=rr[rc]
            want=None if pd.isna(rv) else round(float(rv),3)
            # 3P/FT percentages are null when the player had no corresponding attempts.
            if k=='three_pct' and float(rr.x3pa_per_game)==0: want=None
            if k=='ft_pct' and float(rr.fta_per_game)==0: want=None
            ck(s.get(k)==want,f'exact source field {k} {p["name"]}')
    ck(1<=s['gp']<=82,f'gp plausible {p["name"]}')
    ck(0<s['mpg']<=48,f'mpg plausible {p["name"]}')
    ck(0<=s['pts']<=50 and 0<=s['reb']<=25 and 0<=s['ast']<=15,f'box line plausible {p["name"]}')
    for k in ['fg_pct','three_pct','ft_pct']:
        if s.get(k) is not None: ck(0<=s[k]<=1,f'{k} plausible {p["name"]}')
    ck(s['fga']+1e-9>=s['three_pa'],f'FGA >= 3PA {p["name"]}')
    ck(abs((s['oreb']+s['dreb'])-s['reb'])<=0.2,f'rebounding identity {p["name"]}')
    ck(p['rating_source']=='2026-27_current_ability_model_v0.29',f'evidence rating source {p["name"]}')
for p in proj:
    ck(p['rating_source']=='projection_translation_model_v0.29_rebased',f'projection rating source {p["name"]}')
    ck(p.get('stats_2025_26') is None,f'projection no fake NBA stats {p["name"]}')
# Prove the v0.28 non-rating basketball/CBA core stayed frozen.
manifest=json.load(open(ROOT/'data/v028-nonrating-core-hashes.json',encoding='utf-8'))
def sha_obj(obj): return hashlib.sha256(json.dumps(obj,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
core_fields=['team','age','positions','position_group','roster_status','contract','stats_2025_26','tendencies','simulation_profile','development_profile','rights_team','nba_id','years_service']
for p in players:
    ck(sha_obj({k:p.get(k) for k in core_fields})==manifest['players'][p['id']],f'v0.28 non-rating player core unchanged {p["name"]}')
for rel,want in manifest['files'].items():
    if rel in {'gameday.js','exhibition.js'}: continue
    ck(hashlib.sha256((ROOT/rel).read_bytes()).hexdigest()==want,f'v0.28 critical file unchanged {rel}')
ck((ROOT/'gameday.js').read_bytes()==(ROOT/'gameday-v0.34.js').read_bytes(),'canonical Game Day matches v0.34 runtime')
ck((ROOT/'exhibition.js').read_bytes()==(ROOT/'exhibition-v0.34.js').read_bytes(),'canonical Exhibition matches v0.34 runtime')

# Rating integrity and scale.
for p in players:
    r=p['ratings']
    for k in ['overall','impact','offense','defense','skill_overall']:
        ck(isinstance(r.get(k),int) and 55<=r[k]<=99,f'{k} range {p["name"]}')
ov=[p['ratings']['overall'] for p in players]
ck(70<=sorted(ov)[len(ov)//2]<=74,'median OVR target 70-74')
ck(sum(x>=80 for x in ov)<=85,'80+ population controlled')
ck(24<=sum(x>=86 for x in ov)<=38,'86+ All-Star band controlled')
ck(sum(x>=90 for x in ov)<=12,'90+ superstar band controlled')
# Explicit regression checks for previously implausible cases / star protections.
by={norm(p['name']):p for p in players}
def o(n): return by[norm(n)]['ratings']['overall']
def d(n): return by[norm(n)]['ratings']['defense']
checks={
 'Paul Reed <= 73':o('Paul Reed')<=73,
 "Kel'el Ware <= 79":o("Kel'el Ware")<=79,
 'Sandro <= 77':o('Sandro Mamukelashvili')<=77,
 'Giannis >= 91':o('Giannis Antetokounmpo')>=91,
 'Tatum >= 88':o('Jayson Tatum')>=88,
 'Dort defense >= 87':d('Lu Dort')>=87,
 'Herb defense >= 83':d('Herbert Jones')>=83,
 'Jokic/Shai elite':o('Nikola Jokic')>=95 and o('Shai Gilgeous-Alexander')>=95,
}
for k,v in checks.items(): ck(v,k)
# Browser payload and summary synchronization.
s=(ROOT/'data/data.js').read_text(encoding='utf-8').strip(); pre='window.NBA_COURTSIDE_DATA = '
ck(s.startswith(pre),'data.js prefix')
if s.startswith(pre):
    payload=json.loads(s[len(pre):].rstrip(';'))
    ck(payload['players']==players,'data.js players sync')
    ck(payload['model']['version']=='0.29','browser model v0.29')
rows=list(csv.DictReader(open(ROOT/'data/players-summary.csv',encoding='utf-8')))
ck(len(rows)==442,'summary 442 rows')
for row,p in zip(rows,players): ck(row['name']==p['name'] and int(row['overall'])==p['ratings']['overall'],f'summary sync {p["name"]}')
if errors:
    print(f'FAIL — v0.34 retained ratings tests ({len(errors)} issues)')
    for e in errors[:80]: print(' -',e)
    sys.exit(1)
print('PASS — v0.34 retained ratings/source tests')
print(json.dumps({'players':len(players),'evidence':len(evidence),'projection':len(proj),'median':sorted(ov)[len(ov)//2],'80_plus':sum(x>=80 for x in ov),'86_plus':sum(x>=86 for x in ov),'90_plus':sum(x>=90 for x in ov),'spot':{x:o(x) for x in ['Nikola Jokic','Shai Gilgeous-Alexander','Luka Doncic','Giannis Antetokounmpo','Jayson Tatum','Trae Young','Ja Morant','Jalen Duren','Paul Reed','Herbert Jones','Lu Dort',"Kel\'el Ware",'Sandro Mamukelashvili']}},indent=2))
