from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
app=(root/'app-v0.36.js').read_text()
idx=(root/'index.html').read_text()
gd=(root/'gameday.html').read_text()
ex=(root/'exhibition.html').read_text()
need=[
 'state.playerRelations','version:36','FRANCHISE PLAYER','Front Office Conversations',
 'function playerRelationsV36','function teamChemistryV36','function extensionOutlookV36',
 'function respondConversationV36','FRONT-OFFICE NO-TRADE PROMISE','PLAYER · SIMULATED'
]
missing=[x for x in need if x not in app]
if missing: raise SystemExit('missing v0.36 markers: '+', '.join(missing))
for name,text in [('index',idx),('gameday',gd),('exhibition',ex)]:
    old=re.findall(r'(?:src|href)="[^"]*v0\.35[^\"]*"',text)
    if old: raise SystemExit(f'{name} still has v0.35 runtime refs: {old[:3]}')
if 'app-v0.36.js' not in idx or 'data/data-v0.36.js' not in idx: raise SystemExit('index missing v0.36 runtime')
if 'gameday-v0.36.js' not in gd or 'data/data-v0.36.js' not in gd: raise SystemExit('gameday missing v0.36 runtime')
if 'exhibition-v0.36.js' not in ex or 'data/data-v0.36.js' not in ex: raise SystemExit('exhibition missing v0.36 runtime')
print({'status':'PASS','release':'v0.36','runtime_urls':'cache-coherent','player_relations_markers':len(need)})
