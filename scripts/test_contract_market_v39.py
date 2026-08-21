from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parents[1]
idx=(ROOT/'index.html').read_text()
assert 'V0.39 CONTRACTS + AGENTS' in idx
assert 'data/contract-market-v0.39.js' in idx
app=(ROOT/'app-v0.39.js').read_text()
for needle in ['CONTRACTS, AGENTS + FREE AGENCY OVERHAUL','contractMarketV39','agentForV39','FREE AGENCY<br>LIVE','AGENT COUNTER','extensionTalkV39','EXPLORE SIGN-AND-TRADE']:
    assert needle in app,needle
cfg=(ROOT/'data/contract-market-v0.39.js').read_text()
assert 'simulation_boundary' in cfg and 'MONEY FIRST' in cfg and 'SECURITY FIRST' in cfg
# Ensure no release page is still executing v0.38 runtime URLs.
for page in ['index.html','gameday.html','exhibition.html']:
    text=(ROOT/page).read_text(); refs=re.findall(r'<script\s+src="([^"]+)"',text)
    assert refs and all('v0.38' not in x for x in refs),(page,refs)
assert (ROOT/'app.js').read_bytes()==(ROOT/'app-v0.39.js').read_bytes()
assert (ROOT/'gameday.js').read_bytes()==(ROOT/'gameday-v0.39.js').read_bytes()
assert (ROOT/'exhibition.js').read_bytes()==(ROOT/'exhibition-v0.39.js').read_bytes()
print(json.dumps({'status':'PASS','version':39,'agents':'simulated','cache':'release-unique'},indent=2))
