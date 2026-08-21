#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def ck(x,msg):
    if not x: errors.append(msg)
def load_js(path,prefix):
    raw=(ROOT/path).read_text(encoding='utf-8').strip(); ck(raw.startswith(prefix),f'{path} prefix')
    return json.loads(raw[len(prefix):].rstrip(';')) if raw.startswith(prefix) else {}
cd=load_js('data/college-draft-v0.35.js','window.NBA_COURTSIDE_COLLEGE_DRAFT_V35 = ')
app=(ROOT/'app-v0.35.js').read_text(encoding='utf-8');idx=(ROOT/'index.html').read_text(encoding='utf-8')
pros=cd.get('prospects',[]); programs=cd.get('programs',[])
ck(cd.get('version')=='v0.35','college data version')
ck(cd.get('freeze_date')=='2026-08-21','freeze date')
ck(cd.get('draft_year')==2027,'2027 draft cycle')
ck(len(pros)==30,'30 source-backed watch prospects')
ck(len({p['id'] for p in pros})==30,'unique prospect ids')
ck(len(programs)==44,'44 tracked programs')
ck(len({t['id'] for t in programs})==44,'unique program ids')
ck(pros[0]['name']=='Tyran Stokes' and pros[0]['program']=='Kansas','Tyran Stokes source rank anchor')
anchors={'Jordan Smith Jr.':'Arkansas','Caleb Holt':'Arizona','Bruce Branch III':'BYU','Thomas Haugh':'Florida','Braylon Mullins':'UConn','Patrick Ngongba II':'Duke','Tounde Yessoufou':"St. John's",'Alijah Arenas':'USC','Milan Momcilovic':'Kentucky','Flory Bidunga':'Louisville'}
by={p['name']:p for p in pros}
for n,school in anchors.items(): ck(n in by and by[n]['program']==school,f'{n} program anchor')
ck(sum(1 for p in pros if p.get('program_id'))==29,'29 NCAA-tracked prospects')
ck(sum(1 for p in pros if not p.get('program_id'))==1,'one international watch prospect')
ck(all(65<=p['nba_readiness']<=80 for p in pros),'conservative NBA readiness range')
ck(all(p['potential']>=p['nba_readiness'] for p in pros),'potential >= readiness')
for needle,label in [
 ('function college35()','persistent college/draft save branch'),('simulateCollegeDayV35','college daily simulation'),('collegeHashV35','separate deterministic college hash'),
 ('prospectRangeV35','scouting fog of war'),('scoutProspectSeasonV35','individual scouting'),('scoutGroupV35','position scouting sweeps'),('mockDraftV35','live mock draft'),
 ('draftWatchHomeV35','Daily Hub Draft Watch'),('collegeLeaguePortalV35','League draft portal'),('collegeDraftViewV35','dedicated draft hub'),
 ('source-2027-','source-backed draft persistence'),('fictional_2027_second_round_depth','fictional second-round boundary'),("replaceAll('v=0.34','v=0.35')",'Game Day v0.35 cache route')
]: ck(needle in app,label)
ck('V0.35 COLLEGE + DRAFT WORLD' in idx,'menu release badge')
ck('data/college-draft-v0.35.js' in idx,'college draft runtime data loaded')
expected={
 'index.html':['data/data-v0.35.js','data/source-certification-v0.35.js','data/future-pick-ledger-v0.35.js','data/schedule-v0.35.js','data/schedule-template-v0.35.js','cba-v0.35.js','data/organizations-v0.35.js','data/g-league-v0.35.js','data/college-draft-v0.35.js','app-v0.35.js'],
 'gameday.html':['data/data-v0.35.js','data/schedule-v0.35.js','data/schedule-template-v0.35.js','gameday-v0.35.js'],
 'exhibition.html':['data/data-v0.35.js','exhibition-v0.35.js']}
for page,refs in expected.items():
    text=(ROOT/page).read_text(encoding='utf-8');srcs=re.findall(r'<script\s+src="([^"]+)"',text)
    ck(srcs==refs,f'{page} exact v0.35 runtime order')
    for ref in refs: ck((ROOT/ref).exists(),f'{ref} exists')
    ck(not any('v0.34' in x for x in srcs),f'{page} has no v0.34 runtime URL')
ck('index.html?continue=1&v=0.35' in (ROOT/'gameday-v0.35.js').read_text(),'Game Day return route v0.35')
ck('index.html?v=0.35' in (ROOT/'exhibition-v0.35.js').read_text(),'Exhibition return route v0.35')
if errors:
    print(f'FAIL — v0.35 College + Draft certification ({len(errors)} issues)')
    for e in errors: print(' -',e)
    sys.exit(1)
print('PASS — v0.35 College + Draft World certification')
print(json.dumps({'tracked_programs':len(programs),'source_backed_watch_prospects':len(pros),'college_prospects':29,'international_prospects':1,'draft_year':2027,'save_schema':25},indent=2))
