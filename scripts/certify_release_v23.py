#!/usr/bin/env python3
import json,re,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]; errors=[]
def ck(x,m):
    if not x: errors.append(m)
players=json.load(open(R/'data/players-2026-08-19.json',encoding='utf-8'))
quality=json.load(open(R/'data/data-quality.json',encoding='utf-8'))
sc=json.load(open(R/'data/source-certification-v0.23.json',encoding='utf-8'))
pc=json.load(open(R/'data/projection-certification-v0.23.json',encoding='utf-8'))
text=(R/'data/source-certification.js').read_text(encoding='utf-8').strip(); pre='window.NBA_COURTSIDE_SOURCE_CERT = '
ck(text.startswith(pre) and text.endswith(';'),'source-cert wrapper')
if text.startswith(pre) and text.endswith(';'): ck(json.loads(text[len(pre):-1])==sc,'source-cert JSON/browser parity')
dj=(R/'data/data.js').read_text(encoding='utf-8').strip(); dp='window.NBA_COURTSIDE_DATA = '
ck(dj.startswith(dp),'data wrapper')
if dj.startswith(dp):
    payload=json.loads(dj[len(dp):].rstrip(';')); ck(payload['players']==players,'player JSON/browser parity'); ck(payload['quality']==quality,'quality JSON/browser parity')
ck(sc.get('version')=='v0.23','source cert version'); ck(quality.get('version')=='v0.23','quality version'); ck(pc.get('status')=='PASS','projection certification')
ck(len(players)==442 and sum(p.get('stats_2025_26') is not None for p in players)==392,'player counts')
ck(sum(p.get('rating_source')=='projection_translation_model_v0.23' for p in players)==50,'projection count')
ck(all(p.get('ratings') and p.get('simulation_profile') for p in players),'442 runtime profiles')
ck('nbaCourtsideSaveV18' in (R/'app.js').read_text(encoding='utf-8'),'save key retained')
ck((R/'docs/VALIDATION_V23.md').exists() and (R/'docs/PROJECTION_INPUTS_V23.md').exists(),'v0.23 docs')
for f in ['app.js','gameday.js','exhibition.js','cba.js','data/data.js','data/source-certification.js']:
    ck((R/f).exists(),f+' exists')
print(json.dumps({'version':'v0.23','status':'PASS' if not errors else 'FAIL','players':len(players),'final_nba':392,'projection':50,'rated':sum(bool(p.get('ratings')) for p in players),'save_key':'nbaCourtsideSaveV18','errors':errors},indent=2))
sys.exit(1 if errors else 0)
