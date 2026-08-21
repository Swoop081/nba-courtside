from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
expected={
 'index.html':['data/data-v0.36.js','data/source-certification-v0.36.js','data/future-pick-ledger-v0.36.js','data/schedule-v0.36.js','data/schedule-template-v0.36.js','cba-v0.36.js','data/organizations-v0.36.js','data/g-league-v0.36.js','data/college-draft-v0.36.js','app-v0.36.js'],
 'gameday.html':['data/data-v0.36.js','data/schedule-v0.36.js','data/schedule-template-v0.36.js','gameday-v0.36.js'],
 'exhibition.html':['data/data-v0.36.js','exhibition-v0.36.js'],
}
for page,refs in expected.items():
    text=(ROOT/page).read_text();srcs=re.findall(r'<script\s+src="([^"]+)"',text)
    assert srcs==refs,(page,srcs,refs)
    for ref in refs: assert (ROOT/ref).exists(),(page,ref)
    assert not any('v0.35' in x for x in srcs),(page,srcs)
raw=(ROOT/'data/data-v0.36.js').read_text().strip();prefix='window.NBA_COURTSIDE_DATA = ';assert raw.startswith(prefix)
data=json.loads(raw[len(prefix):].rstrip(';'));by={p['name']:p for p in data['players']}
for name,ovr in {'Payton Pritchard':79,'Paul George':79,'Jayson Tatum':89,'Neemias Queta':76}.items():assert by[name]['ratings']['overall']==ovr,(name,by[name]['ratings']['overall'],ovr)
idx=(ROOT/'index.html').read_text();assert 'V0.36 PLAYER RELATIONS' in idx;assert 'exhibition.html?v=0.36' in idx
assert 'index.html?continue=1&v=0.36' in (ROOT/'gameday-v0.36.js').read_text();assert 'index.html?v=0.36' in (ROOT/'exhibition-v0.36.js').read_text()
assert (ROOT/'app.js').read_bytes()==(ROOT/'app-v0.36.js').read_bytes()
assert (ROOT/'gameday.js').read_bytes()==(ROOT/'gameday-v0.36.js').read_bytes()
assert (ROOT/'exhibition.js').read_bytes()==(ROOT/'exhibition-v0.36.js').read_bytes()
print('PASS v0.36 cache coherence: release-unique NBA + G League + College/Draft + Player Relations runtime assets')
