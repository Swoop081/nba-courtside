#!/usr/bin/env python3
import json,sys,re,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[1]; errors=[]
def ck(x,m):
    if not x: errors.append(m)
def loadj(p):
    return json.load(open(p,encoding='utf-8'))
players=loadj(R/'data/players-2026-08-19.json')
quality=loadj(R/'data/data-quality.json')
sc=loadj(R/'data/source-certification-v0.24.json')
yos=loadj(R/'data/service-years-certification-v0.24.json')
delta=loadj(R/'data/player-source-delta-v0.24.json')
proj=loadj(R/'raw/projection-inputs-v0.24.json')
# Browser-source certification parity.
sj=(R/'data/source-certification.js').read_text(encoding='utf-8').strip(); sp='window.NBA_COURTSIDE_SOURCE_CERT = '
ck(sj.startswith(sp) and sj.endswith(';'),'source-cert browser wrapper')
if sj.startswith(sp) and sj.endswith(';'):
    try: ck(json.loads(sj[len(sp):-1])==sc,'source-cert JSON/browser parity')
    except Exception as e: errors.append('source-cert browser parse: '+str(e))
# Main browser data parity.
dj=(R/'data/data.js').read_text(encoding='utf-8').strip(); dp='window.NBA_COURTSIDE_DATA = '
ck(dj.startswith(dp) and dj.endswith(';'),'data browser wrapper')
payload=None
if dj.startswith(dp) and dj.endswith(';'):
    try:
        payload=json.loads(dj[len(dp):-1])
        ck(payload.get('players')==players,'player JSON/browser parity')
        ck(payload.get('quality')==quality,'quality JSON/browser parity')
        ck(payload.get('source_certification')==sc,'source cert embedded parity')
    except Exception as e: errors.append('data browser parse: '+str(e))
# Version/count boundary.
ck(sc.get('version')=='v0.24','source certification version')
ck(quality.get('version')=='v0.24','quality version')
ck(yos.get('version')=='v0.24' and yos.get('status')=='PASS','YOS certification')
ck(len(players)==442,'442 player/right rows')
final=[p for p in players if p.get('stats_2025_26') is not None]
projected=[p for p in players if p.get('stats_2025_26') is None]
ck(len(final)==393,'393 final NBA rows')
ck(len(projected)==49,'49 projection rows')
ck(len(proj.get('records',[]))==49,'49 projection input records')
ck(all(p.get('ratings') and p.get('simulation_profile') for p in players),'442 runtime rating/profile rows')
ck(all(isinstance(p.get('years_service'),int) and p.get('years_service_certainty')=='certified' for p in players),'442 exact/certified service-year rows')
ck(quality.get('source_backed_projection_players')==49 and quality.get('signed_two_way')==1 and quality.get('signed_standard_or_inactive')==438,'quality counts current')
# Key source fixes.
yanic=next((p for p in players if p.get('id')=='yanic-niederhauser'),None)
dillon=next((p for p in players if p.get('id')=='dillon-mitchell'),None)
ck(yanic and (yanic.get('stats_2025_26') or {}).get('gp')==41 and yanic.get('stat_source_status')=='season_complete_verified','Yanic final NBA repair')
ck(dillon and dillon.get('roster_status')=='two_way' and dillon.get('years_service')==0,'Dillon Two-Way correction')
# v0.19 frozen 392-player core remains certified by v0.24 source script and manifest.
ck((R/'data/v019-evidence-core-hashes.json').exists(),'v0.19 core hash manifest')
ck(sc.get('projection_model',{}).get('reference_nba_players_unchanged')==392,'392 v0.19 core retained')
# Long-tail declarations and runtime hooks.
tr=sc.get('transaction_rules',{})
ck(tr.get('years_of_service')=='442/442 certified; age proxy removed','YOS runtime declaration')
ck(tr.get('team_salary_and_apron_team_salary',{}).get('separate_ledgers') is True,'Team/Apron salary split')
ck(tr.get('waivers',{}).get('period_hours')==48 and tr.get('waivers',{}).get('competing_claim_priority') is True,'48-hour waiver claims')
ck(tr.get('disabled_player_exception',{}).get('grant_and_use') is True,'DPE live')
ck(tr.get('two_way',{}).get('live') is True and tr.get('two_way',{}).get('max_slots')==3,'Two-Way live')
ck(tr.get('exhibit_10',{}).get('live') is True,'Exhibit 10 live')
app=(R/'app.js').read_text(encoding='utf-8')
cba=(R/'cba.js').read_text(encoding='utf-8')
gd=(R/'gameday.js').read_text(encoding='utf-8')
for needle,label,text in [
    ('nbaCourtsideSaveV18','save key retained',app),
    ('function submitWaiverClaim','waiver claim runtime',app),
    ('function processWaiverWire','waiver resolution runtime',app),
    ('function applyDisabledPlayerException','DPE runtime',app),
    ('function signTwoWay','Two-Way runtime',app),
    ('function signExhibit10','Exhibit 10 runtime',app),
    ('function apronTeamSalary','Apron Team Salary runtime',app),
    ('twoWayContract','Two-Way CBA helper',cba),
    ('disabledPlayerExceptionAmount','DPE CBA helper',cba),
    ('stretchSchedule','stretch helper',cba),
    ('save.twoWayGames','Two-Way Game Day counter',gd),
]: ck(needle in text,label)
# Required docs/source files.
for f in [
    'README.md','docs/CBA_SOURCE_LONG_TAIL_V24.md','docs/VALIDATION_V24.md',
    'data/source-certification-v0.24.json','data/service-years-certification-v0.24.json',
    'data/player-source-delta-v0.24.json','raw/projection-inputs-v0.24.json',
    'raw/nba_players_25_26_regular_season_wide_data.csv','scripts/test_cba_source_long_tail_v24.js',
    'scripts/test_offseason_bridge_v24.js','scripts/certify_cba_source_long_tail_v24.py'
]: ck((R/f).exists(),f+' exists')
# No stale count assertions in current quality/README.
rt=(R/'README.md').read_text(encoding='utf-8')+'\n'+json.dumps(quality)
ck('50 no-2025-26-NBA-baseline' not in rt,'no stale 50-player projection warning')
result={'version':'v0.24','status':'PASS' if not errors else 'FAIL','players':len(players),'final_nba':len(final),'projection':len(projected),'yos_certified':sum(p.get('years_service_certainty')=='certified' for p in players),'two_way':[p['name'] for p in players if p.get('roster_status')=='two_way'],'save_key':'nbaCourtsideSaveV18','errors':errors}
print(json.dumps(result,indent=2))
sys.exit(1 if errors else 0)
