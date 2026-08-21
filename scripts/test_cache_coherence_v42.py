from pathlib import Path
root=Path(__file__).resolve().parents[1]
checks={
 'index.html':['data/data-v0.42.js','data/source-certification-v0.42.js','data/future-pick-ledger-v0.42.js','data/schedule-v0.42.js','data/schedule-template-v0.42.js','cba-v0.42.js','data/organizations-v0.42.js','data/staff-careers-v0.42.js','data/g-league-v0.42.js','data/college-draft-v0.42.js','data/contract-market-v0.42.js','app-v0.42.js'],
 'gameday.html':['data/data-v0.42.js','data/schedule-v0.42.js','data/schedule-template-v0.42.js','data/organizations-v0.42.js','data/staff-careers-v0.42.js','gameday-v0.42.js'],
 'exhibition.html':['data/data-v0.42.js','exhibition-v0.42.js'],
}
for f,needles in checks.items():
 s=(root/f).read_text()
 for n in needles: assert n in s,(f,n)
 assert 'v0.41.js' not in s,f
app=(root/'app-v0.42.js').read_text()
assert "replace(/v=0\\.\\d+/g,'v=0.42')" in app
for f in ['app','cba','exhibition','gameday']:
 assert (root/f'{f}.js').read_bytes()==(root/f'{f}-v0.42.js').read_bytes(),f
print({'status':'PASS','release':'v0.42','entry_points':list(checks),'game_day_links':'v0.42'})
