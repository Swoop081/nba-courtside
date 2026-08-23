from pathlib import Path
import json,re,subprocess,sys
root=Path(__file__).resolve().parents[1]
checks=[]
def ck(name,cond):
    checks.append((name,bool(cond)))
    if not cond: print('FAIL',name)
idx=(root/'index.html').read_text()
app=(root/'app-v0.56.js').read_text()
gh=(root/'gameday.html').read_text()
raw=(root/'data/historical-universes-v0.56.js').read_text()
m=re.search(r'window\.NBA_COURTSIDE_HISTORICAL_V56\s*=\s*(\{.*\});\s*window\.NBA_COURTSIDE_HISTORICAL_V55',raw,re.S)
H=json.loads(m.group(1))
ck('v056 data version',H.get('version')=='v0.56')
ck('continuous real years',H.get('realDraftYears')==list(range(2019,2027)))
ck('official real years',H.get('officialHistoricalDraftYears')==list(range(2019,2027)))
expected={2019:(60,60,0,'Zion Williamson'),2020:(60,60,0,'Anthony Edwards'),2021:(60,60,0,'Cade Cunningham'),2022:(60,58,2,'Paolo Banchero'),2023:(60,58,2,'Victor Wembanyama'),2024:(60,58,2,'Zaccharie Risacher'),2025:(60,59,1,'Cooper Flagg'),2026:(60,60,0,'AJ Dybantsa')}
for y,(pool,official,ud,first) in expected.items():
    c=H['realDraftClasses'][str(y)]; p=c['prospects']
    ck(f'{y} 60-player real-entry pool',len(p)==pool)
    ck(f'{y} official selection count',c.get('officialDraftedCount')==official)
    ck(f'{y} undrafted fill count',c.get('undraftedEntrantCount')==ud)
    ck(f'{y} first identity',p[0]['name']==first)
    ck(f'{y} alternate slots complete',[x.get('slot') for x in p]==list(range(1,61)))
    ck(f'{y} unique names',len({x['name'] for x in p})==60)
for y in (2022,2023,2024,2025):
    p=H['realDraftClasses'][str(y)]['prospects']; extras=[x for x in p if x.get('entry_type')=='undrafted']
    ck(f'{y} undrafted official pick null',all(x.get('official_pick') is None and x.get('historical_drafted_by') is None for x in extras))
ck('2022 real undrafted fill',[x['name'] for x in H['realDraftClasses']['2022']['prospects'][-2:]]==['Keon Ellis','AJ Green'])
ck('2023 real undrafted fill',[x['name'] for x in H['realDraftClasses']['2023']['prospects'][-2:]]==['Craig Porter Jr.','Colin Castleton'])
ck('2024 real undrafted fill',[x['name'] for x in H['realDraftClasses']['2024']['prospects'][-2:]]==['Trey Alexander',"N'Faly Dante"])
ck('2025 real undrafted fill',H['realDraftClasses']['2025']['prospects'][-1]['name']=='Dink Pate')
ck('alternate destination metadata 2020',H['realDraftClasses']['2020']['prospects'][0]['historical_drafted_by']=='MIN')
ck('alternate destination metadata 2023',H['realDraftClasses']['2023']['prospects'][0]['historical_drafted_by']=='SAS')
ck('alternate destination metadata 2025',H['realDraftClasses']['2025']['prospects'][0]['historical_drafted_by']=='DAL')
ck('forfeiture rule explicit','forfeited' in H.get('pipelineBoundary','').lower())
ck('future generated remains 2028',H.get('futureGeneratedFrom')==2028)
ck('2027 watch retained','2027' in H['realDraftClasses'] and 'prospects' not in H['realDraftClasses']['2027'])
ck('index v056 historical data','data/historical-universes-v0.56.js' in idx)
ck('index v056 app','app-v0.56.js' in idx and 'href="app-v0.56.js"' in idx)
ck('gameday v056 refs','data/historical-universes-v0.56.js' in gh and 'gameday-v0.56.js' in gh)
ck('schema 25 retained','const SAVE_SCHEMA=25' in app and 'nbaCourtsideSaveV25' in app)
ck('slot separate from official pick',"slot=src.slot||src.pick||i+1" in app and "officialPick=Object.prototype.hasOwnProperty.call(src,'official_pick')" in app)
ck('undrafted metadata retained',"entryType=src.entry_type||'drafted'" in app and 'alternateTimelineSlot:slot' in app)
ck('v056 rating source','v0.56_real_${year}_identity_authentic_uncertainty' in app)
ck('real history remains metadata','officialHistoricalTeam:src.historical_drafted_by||null' in app)
ck('historical opening universe retained','historical-2018-19-opening-night' in idx and 'historical-2018-19-opening-night' in app)
ck('2025 postseason universe retained','historical-2025-26-postseason' in idx)
ck('2018 source pack retained',H['historical_2018_19']['coverage']['openingRosterPlayers']==494 and len(H['historical_2018_19']['scheduleGames'])==1230)
# Runtime file references
scripts=re.findall(r'<script src="([^"]+)"',idx)
ck('all index scripts resolve',all((root/x).exists() for x in scripts))
scripts2=re.findall(r'<script src="([^"]+)"',gh)
ck('all gameday scripts resolve',all((root/x).exists() for x in scripts2))
for f in ['app-v0.56.js','gameday-v0.56.js']:
    r=subprocess.run(['node','--check',str(root/f)],capture_output=True,text=True)
    ck(f'{f} syntax',r.returncode==0)
failed=[n for n,v in checks if not v]
print(f'{len(checks)-len(failed)}/{len(checks)} checks passed')
if failed:
    print('\n'.join(' - '+x for x in failed));sys.exit(1)
