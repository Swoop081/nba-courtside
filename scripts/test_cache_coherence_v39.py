from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
expected={
 'index.html':['data/data-v0.39.js','data/source-certification-v0.39.js','data/future-pick-ledger-v0.39.js','data/schedule-v0.39.js','data/schedule-template-v0.39.js','cba-v0.39.js','data/organizations-v0.39.js','data/staff-careers-v0.39.js','data/g-league-v0.39.js','data/college-draft-v0.39.js','data/contract-market-v0.39.js','app-v0.39.js'],
 'gameday.html':['data/data-v0.39.js','data/schedule-v0.39.js','data/schedule-template-v0.39.js','gameday-v0.39.js'],
 'exhibition.html':['data/data-v0.39.js','exhibition-v0.39.js'],
}
for page,refs in expected.items():
    text=(ROOT/page).read_text();srcs=re.findall(r'<script\s+src="([^"]+)"',text)
    assert srcs==refs,(page,srcs,refs)
    for ref in refs: assert (ROOT/ref).exists(),(page,ref)
    assert not any('v0.38' in x for x in srcs),(page,srcs)
raw=(ROOT/'data/data-v0.39.js').read_text().strip();prefix='window.NBA_COURTSIDE_DATA = ';assert raw.startswith(prefix)
data=json.loads(raw[len(prefix):].rstrip(';'));by={p['name']:p for p in data['players']}
for name,ovr in {'Payton Pritchard':79,'Paul George':79,'Jayson Tatum':89,'Neemias Queta':76}.items():assert by[name]['ratings']['overall']==ovr,(name,by[name]['ratings']['overall'],ovr)
idx=(ROOT/'index.html').read_text();assert 'V0.39 CONTRACTS + AGENTS' in idx;assert 'exhibition.html?v=0.39' in idx
assert 'index.html?continue=1&v=0.39' in (ROOT/'gameday-v0.39.js').read_text();assert 'index.html?v=0.39' in (ROOT/'exhibition-v0.39.js').read_text()
assert (ROOT/'app.js').read_bytes()==(ROOT/'app-v0.39.js').read_bytes()
assert (ROOT/'gameday.js').read_bytes()==(ROOT/'gameday-v0.39.js').read_bytes()
assert (ROOT/'exhibition.js').read_bytes()==(ROOT/'exhibition-v0.39.js').read_bytes()
print('PASS v0.39 cache coherence: release-unique NBA + Living League + contract-market runtime assets')
