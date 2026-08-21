from pathlib import Path
root=Path(__file__).resolve().parents[1]
checks={
 'index.html':['data/data-v0.41.js','cba-v0.41.js','data/organizations-v0.41.js','data/staff-careers-v0.41.js','app-v0.41.js'],
 'gameday.html':['data/data-v0.41.js','data/schedule-v0.41.js','data/schedule-template-v0.41.js','data/organizations-v0.41.js','data/staff-careers-v0.41.js','gameday-v0.41.js'],
 'exhibition.html':['data/data-v0.41.js','exhibition-v0.41.js'],
}
for f,needles in checks.items():
    s=(root/f).read_text()
    for n in needles:
        assert n in s,(f,n)
    assert 'v0.40.js' not in s,f'{f} still references v0.40 runtime'
app=(root/'app-v0.41.js').read_text()
assert "'v=0.41'" in app or 'v=0.41' in app
assert "replace(/v=0\\.\\d+/g,'v=0.41')" in app
for f in ['app','cba','exhibition','gameday']:
    assert (root/f'{f}-v0.41.js').exists()
# canonical runtime should equal current versioned runtime so local/offline tests exercise release code.
for f in ['app','cba','exhibition','gameday']:
    assert (root/f'{f}.js').read_bytes()==(root/f'{f}-v0.41.js').read_bytes(),f
print({'status':'PASS','release':'v0.41','entry_points':list(checks),'game_day_links':'v0.41'})
