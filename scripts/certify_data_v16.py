#!/usr/bin/env python3
import csv, json, math, re
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
players=json.loads((ROOT/'data/players-2026-08-19.json').read_text())
league=json.loads((ROOT/'data/league-2026-08-19.json').read_text())
quality=json.loads((ROOT/'data/data-quality.json').read_text())
with (ROOT/'raw/rosters_contracts_2026-08-19.tsv').open(newline='',encoding='utf-8-sig') as f:
    roster_rows=list(csv.DictReader(f,delimiter='\t'))
with (ROOT/'raw/nba_stats_2025_2026_bootstrap.csv').open(newline='',encoding='utf-8-sig') as f:
    stat_rows=list(csv.DictReader(f))

teams=league['teams'] if isinstance(league,dict) else league
team_abbr={t['abbr'] for t in teams}
errors=[]; warnings=[]; checks=[]
def check(name,ok,detail=''):
    checks.append({'name':name,'status':'PASS' if ok else 'FAIL','detail':detail})
    if not ok: errors.append(f'{name}: {detail}')

ids=[p.get('id') for p in players]; names=[p.get('name') for p in players]
check('30 unique NBA teams',len(teams)==30 and len(team_abbr)==30,f'{len(teams)} rows / {len(team_abbr)} unique abbreviations')
check('442 player/right records',len(players)==442,f'{len(players)} records')
check('unique player ids',len(ids)==len(set(ids)) and None not in ids,f'{len(ids)-len(set(ids))} duplicate IDs')
check('roster snapshot row parity',len(roster_rows)==len(players),f'{len(roster_rows)} TSV rows vs {len(players)} JSON rows')
json_name_team=Counter((p.get('name'),p.get('team')) for p in players)
tsv_name_team=Counter((r.get('name'),r.get('team')) for r in roster_rows)
check('roster snapshot identity parity',json_name_team==tsv_name_team,f'{sum((json_name_team-tsv_name_team).values())} JSON-only / {sum((tsv_name_team-json_name_team).values())} TSV-only')
check('valid player team abbreviations',all(p.get('team') in team_abbr for p in players),'all player snapshot teams resolve to a league team')
check('valid ages',all(isinstance(p.get('age'),int) and 18<=p['age']<=50 for p in players),'expected 18–50 range')
valid_pos={'PG','SG','SF','PF','C'}
check('valid positions',all(p.get('positions') and set(p['positions'])<=valid_pos for p in players),'all position arrays nonempty and NBA-standard')

nba_ids=[p.get('nba_id') for p in players if p.get('nba_id') is not None]
check('NBA IDs unique where present',len(nba_ids)==len(set(nba_ids)),f'{len(nba_ids)} mapped NBA IDs')

contract_errors=[]
for p in players:
    years=p.get('contract',{}).get('years') or []
    starts=[y.get('season_start') for y in years]
    if any(not isinstance(y,int) for y in starts) or starts!=sorted(starts) or len(starts)!=len(set(starts)):
        contract_errors.append(f"{p['name']}: season order")
    for y in years:
        if not isinstance(y.get('amount'),(int,float)) or y.get('amount',-1)<0:
            contract_errors.append(f"{p['name']}: invalid salary")
    if p.get('roster_status')!='restricted_free_agent_unsigned' and not years:
        contract_errors.append(f"{p['name']}: signed/inactive player without contract year")
check('contract-year structure',not contract_errors,f'{len(contract_errors)} structural issues')

rfas=[p for p in players if p.get('roster_status')=='restricted_free_agent_unsigned']
rfa_ok=len(rfas)==3 and all(p.get('rights_team') in team_abbr and p.get('contract',{}).get('qualifying_offer') and p.get('contract',{}).get('cap_hold') for p in rfas)
check('unsigned RFA rights cases',rfa_ok,f"{len(rfas)} cases: {', '.join(p['name'] for p in rfas)}")

stat_errors=[]; conf_errors=[]; rated=0; stats_count=0
pct_keys=('fg_pct','three_pct','ft_pct')
for p in players:
    st=p.get('stats_2025_26')
    if st:
        stats_count+=1
        for k in pct_keys:
            v=st.get(k)
            if v is not None and not (0<=v<=1): stat_errors.append(f"{p['name']} {k}={v}")
        if st.get('fga',0)<st.get('three_pa',0): stat_errors.append(f"{p['name']} FGA<3PA")
        if st.get('gp',0)<0 or st.get('mpg',0)<0: stat_errors.append(f"{p['name']} negative GP/MPG")
        expected=min(1,(float(st.get('gp') or 0)*float(st.get('mpg') or 0))/1200)
        actual=p.get('data_confidence')
        if actual is None or abs(float(actual)-expected)>.006:
            conf_errors.append((p['name'],actual,round(expected,3)))
    if p.get('ratings'): rated+=1
check('2025–26 stat field ranges',not stat_errors,f'{stats_count} player baselines / {len(stat_errors)} range issues')
check('confidence formula parity',not conf_errors,f'{len(conf_errors)} mismatches against min(1, total_minutes/1200)')
check('rating coverage',rated==quality.get('rated_players'),f'{rated} rated / quality manifest says {quality.get("rated_players")}')

headshots=sum(bool(p.get('headshot_url')) for p in players)
projection_pending=sum(p.get('career_status')=='rookie_2026_projection_pending' or p.get('rating_source')=='projection_pending' for p in players)
no_current=sum(not p.get('ratings') for p in players)
conf_bins={'high':0,'medium':0,'low':0,'projection':0}
for p in players:
    if not p.get('stats_2025_26'):
        conf_bins['projection']+=1
    else:
        c=float(p.get('data_confidence') or 0)
        conf_bins['high' if c>=.75 else 'medium' if c>=.35 else 'low']+=1

# Team Totals are intentionally treated as the bundled near-final bootstrap calibration target,
# not as an assertion that this CSV is the exact official season-complete NBA.com export.
team_total_rows=[r for r in stat_rows if r.get('Player')=='Team Totals']
metric_map={'fgm':'FG','fga':'FGA','three_pm':'3P','three_pa':'3PA','ftm':'FT','fta':'FTA','oreb':'ORB','dreb':'DRB','reb':'TRB','ast':'AST','stl':'STL','blk':'BLK','tov':'TOV','pf':'PF','pts':'PTS'}
targets={}
for outk,ink in metric_map.items():
    vals=[]
    for r in team_total_rows:
        try: vals.append(float(r[ink]))
        except (ValueError,TypeError,KeyError): pass
    if vals: targets[outk]=sum(vals)/len(vals)
for outk,ink in {'fg_pct':'FG%','three_pct':'3P%','ft_pct':'FT%'}.items():
    vals=[]
    for r in team_total_rows:
        try: vals.append(float(r[ink]))
        except (ValueError,TypeError,KeyError): pass
    if vals: targets[outk]=sum(vals)/len(vals)
if team_total_rows:
    poss=[]
    for r in team_total_rows:
        try: poss.append(float(r['FGA'])+.44*float(r['FTA'])-float(r['ORB'])+float(r['TOV']))
        except: pass
    if poss: targets['possessions_proxy']=sum(poss)/len(poss)
check('bootstrap team calibration rows',len(team_total_rows)==30,f'{len(team_total_rows)} Team Totals rows')

source_pending=[
    'The bundled 2025–26 statistical seed is a near-final bootstrap, not yet the exact season-complete NBA.com bulk export.',
    'Current roster/contract structure is internally audited, but every specialist contract/CBA edge and every external contract term has not been independently re-certified in this pass.',
    'The 2026–27 game calendar remains NBA Courtside’s deterministic 1,230-game scaffold rather than an exact official schedule import.',
    'Complex future second-round conveyances and some linked future pick obligations remain explicitly audit-pending.'
]

report={
 'version':'v0.16',
 'freeze_date':'2026-08-19',
 'certification_scope':{
   'structure_certified':'Internal schema, identity, roster, contract-year, stat-range and confidence invariants pass the automated audit.' if not errors else 'FAILED — see checks.',
   'model_ready':'392 stat-backed players plus projection handling can feed the v0.16 shrinkage/calibration model.',
   'source_pending':source_pending
 },
 'counts':{
   'teams':len(teams),'player_records':len(players),'rated_players':rated,'stat_backed_players':stats_count,
   'projection_or_no_baseline':sum(1 for p in players if not p.get('stats_2025_26')),
   'no_current_rating':no_current,'headshot_urls':headshots,'unsigned_rfas':len(rfas),
   'nba_ids_mapped':len(nba_ids),'confidence_tiers':conf_bins
 },
 'bootstrap_2025_26_team_targets':{k:round(v,4) for k,v in targets.items()},
 'checks':checks,'errors':errors,'warnings':source_pending
}
(ROOT/'data/certification-v0.16.json').write_text(json.dumps(report,indent=2)+'\n')

lines=[
 '# NBA Courtside v0.16 — Data Certification', '',
 f'**Freeze date:** 19 Aug 2026  ',
 f'**Automated result:** {"PASS" if not errors else "FAIL"}', '',
 '## What “certified” means here', '',
 '**Structure-certified** means the bundled game data passes internal identity, schema, roster, contract-year, stat-range and model-confidence checks. It does **not** mean every row has been independently re-downloaded from an official source in this pass.', '',
 f'- {len(teams)} unique teams', f'- {len(players)} player/right records; 0 duplicate player IDs' if len(ids)==len(set(ids)) else f'- {len(players)} player/right records; duplicates detected',
 f'- {rated} currently rated players', f'- {stats_count} players with a 2025–26 NBA statistical baseline', f'- {sum(1 for p in players if not p.get("stats_2025_26"))} projection/no-baseline records', f'- {headshots} headshot URLs', f'- {len(rfas)} unsigned RFA rights cases', '',
 '## Model confidence tiers', '',
 f'- High: {conf_bins["high"]}', f'- Medium: {conf_bins["medium"]}', f'- Low: {conf_bins["low"]}', f'- Projection/no 2025–26 baseline: {conf_bins["projection"]}', '',
 'Low-sample players are now shrunk toward role/position priors in the simulation instead of allowing a tiny per-36 sample to dominate their output.', '',
 '## Bundled 2025–26 calibration target', '',
 'The raw bootstrap CSV contains 30 `Team Totals` rows. v0.16 uses their league mean as an internal calibration target while preserving the existing warning that the file is near-final rather than the exact official season-complete NBA.com export.', '',
 '| Metric | Per team |','|---|---:|'
]
for k in ['pts','reb','ast','stl','blk','tov','fgm','fga','three_pm','three_pa','ftm','fta','pf','possessions_proxy']:
    if k in targets: lines.append(f'| {k.upper().replace("THREE_","3")} | {targets[k]:.2f} |')
lines += ['', '## Automated checks', '']
for c in checks: lines.append(f'- **{c["status"]} — {c["name"]}:** {c["detail"]}')
lines += ['', '## Explicit source-pending boundaries', '']
for w in source_pending: lines.append(f'- {w}')
lines += ['', 'These boundaries are intentional. v0.16 improves model reliability without relabelling bootstrap or modeled data as official facts.']
(ROOT/'docs/DATA_CERTIFICATION_V16.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'result':'PASS' if not errors else 'FAIL','checks':len(checks),'errors':len(errors),'counts':report['counts']},indent=2))
if errors: raise SystemExit(1)
