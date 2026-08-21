from pathlib import Path
import json, re
ROOT=Path(__file__).resolve().parents[1]
expected={
 'index.html':['data/data-v0.31.js','data/source-certification-v0.31.js','data/future-pick-ledger-v0.31.js','data/schedule-v0.31.js','data/schedule-template-v0.31.js','cba-v0.31.js','data/organizations-v0.31.js','app-v0.31.js'],
 'gameday.html':['data/data-v0.31.js','data/schedule-v0.31.js','data/schedule-template-v0.31.js','gameday-v0.31.js'],
 'exhibition.html':['data/data-v0.31.js','exhibition-v0.31.js'],
}
for page,refs in expected.items():
    text=(ROOT/page).read_text()
    srcs=re.findall(r'<script\s+src="([^"]+)"', text)
    assert srcs==refs, (page,srcs,refs)
    for ref in refs: assert (ROOT/ref).exists(), (page,ref)
    assert not any(x in srcs for x in ['data/data.js','app.js','gameday.js','exhibition.js']), (page,srcs)
raw=(ROOT/'data'/'data-v0.31.js').read_text().strip()
prefix='window.NBA_COURTSIDE_DATA = '
assert raw.startswith(prefix)
payload=raw[len(prefix):]
if payload.endswith(';'): payload=payload[:-1]
data=json.loads(payload)
by={p['name']:p for p in data['players']}
checks={'Payton Pritchard':79,'Paul George':79,'Jayson Tatum':89,'Neemias Queta':76}
for name,ovr in checks.items(): assert by[name]['ratings']['overall']==ovr,(name,by[name]['ratings']['overall'],ovr)
idx=(ROOT/'index.html').read_text()
assert 'V0.31 LIVING LEAGUE FOUNDATION' in idx
assert "exhibition.html?v=0.31" in idx
print('PASS v0.31 cache coherence: versioned runtime assets + certified ratings smoke values')
