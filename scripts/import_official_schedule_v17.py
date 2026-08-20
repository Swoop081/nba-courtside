#!/usr/bin/env python3
import re, json, sys
from pathlib import Path
from datetime import datetime

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'raw'/'official_schedule_2026_27.txt'
OUT=ROOT/'data'/'schedule-2026-27.json'
JS=ROOT/'data'/'schedule.js'

TEAM_MAP={
'Atlanta':'ATL','Boston':'BOS','Brooklyn':'BKN','Charlotte':'CHA','Chicago':'CHI','Cleveland':'CLE',
'Dallas':'DAL','Denver':'DEN','Detroit':'DET','Golden State':'GSW','Houston':'HOU','Indiana':'IND',
'LA Clippers':'LAC','LA Lakers':'LAL','Memphis':'MEM','Miami':'MIA','Milwaukee':'MIL','Minnesota':'MIN',
'New Orleans':'NOP','New York':'NYK','Oklahoma City':'OKC','Orlando':'ORL','Philadelphia':'PHI','Phoenix':'PHX',
'Portland':'POR','Sacramento':'SAC','San Antonio':'SAS','Toronto':'TOR','Utah':'UTA','Washington':'WAS'}
NAMES=sorted(TEAM_MAP,key=len,reverse=True)
name_pat='|'.join(re.escape(x) for x in NAMES)
# Line is fixed-ish text extracted from official NBA PDF. Capture both teams by explicit canonical names.
RX=re.compile(r'^\s*(\d{1,4})\s+(Mon\.|Tue\.|Wed\.|Thu\.|Fri\.|Sat\.|Sun\.)\s+(\d{1,2}/\d{1,2}/\d{2})\s+('+name_pat+r')\s+(at|vs)\s+('+name_pat+r')\s+(\d{1,2}:\d{2}\s+[AP]M)\s+(\d{1,2}:\d{2}\s+[AP]M)(.*)$')

CUP_GROUPS={
'EAST A':['DET','BKN','ORL','TOR','MIL'],
'EAST B':['NYK','PHI','IND','MIA','CLE'],
'EAST C':['CHA','WAS','CHI','BOS','ATL'],
'WEST A':['HOU','DAL','DEN','PHX','UTA'],
'WEST B':['LAC','MIN','OKC','MEM','NOP'],
'WEST C':['LAL','GSW','POR','SAC','SAS'],
}
TEAM_GROUP={t:g for g,ts in CUP_GROUPS.items() for t in ts}
VENUES={
'A':'Moody Center, Austin','B':'Arena CDMX, Mexico City','D':'Accor Arena, Paris','E':'Co-op Live, Manchester'}

def iso_date(s):
    return datetime.strptime(s,'%m/%d/%y').strftime('%Y-%m-%d')

def parse_remainder(rest):
    # Columns after ET: NAT TV | R | #. Text extraction loses empty columns, so detect trailing flags.
    toks=rest.strip().split()
    note=None; rflag=False
    # Arena note is a single trailing letter A/B/D/E, group play is C.
    if toks and toks[-1] in {'A','B','C','D','E'}:
        note=toks.pop()
    if toks and toks[-1]=='R':
        rflag=True; toks.pop()
    tv=' '.join(toks).strip() or None
    return tv,rflag,note

games=[]
unparsed=[]
for ln in SRC.read_text(encoding='utf-8',errors='replace').splitlines():
    m=RX.match(ln)
    if not m:
        if re.match(r'^\s*\d{1,4}\s+(Mon\.|Tue\.|Wed\.|Thu\.|Fri\.|Sat\.|Sun\.)',ln): unparsed.append(ln)
        continue
    no,day,ds,t1,sep,t2,local,et,rest=m.groups()
    tv,rflag,note=parse_remainder(rest)
    a,h=TEAM_MAP[t1],TEAM_MAP[t2]
    neutral=(sep=='vs')
    cup=(note=='C')
    g={
      'id':f'G{int(no):04d}','official_game_no':int(no),'date':iso_date(ds),
      'away':a,'home':h,'local_time':local,'et_time':et,'national_tv':tv,
      'official':True,'source':'NBA official schedule, Aug. 13 2026',
    }
    if neutral:
        g['neutral_site']=True
    if cup:
        g['nba_cup_group']=True
        ga,gb=TEAM_GROUP.get(a),TEAM_GROUP.get(h)
        g['cup_group']=ga if ga==gb else None
    if note in VENUES:
        g['venue_note']=VENUES[note]
        if note in {'B','D','E'}: g['neutral_site']=True
        g['arena_code']=note
    if rflag: g['r_flag']=True
    games.append(g)

if unparsed:
    print('UNPARSED GAME-LIKE LINES:',len(unparsed),file=sys.stderr)
    print('\n'.join(unparsed[:20]),file=sys.stderr)
    raise SystemExit(2)

# official game numbers are expected 1..1200 exactly once
nums=sorted(g['official_game_no'] for g in games)
assert len(games)==1200, len(games)
assert nums==list(range(1,1201)), (nums[:10],nums[-10:],len(set(nums)))
# chronologically present to app; stable IDs remain official game numbers
games.sort(key=lambda g:(g['date'],g['official_game_no']))

obj={
 'season':'2026-27',
 'kind':'official_80_plus_dynamic_cup',
 'official_schedule_exact':True,
 'official_schedule_as_of':'2026-08-13',
 'source_urls':{
   'schedule_release':'https://www.nba.com/news/2026-27-nba-regular-season-schedule',
   'cup_rules':'https://www.nba.com/news/nba-cup-101',
   'cup_groups':'https://www.nba.com/news/emirates-nba-cup-2026-groups-announced'
 },
 'assigned_games':1200,
 'unassigned_games':30,
 'notes':[
   'Official NBA schedule assigns 80 games per team as of Aug. 13, 2026.',
   'Two additional regular-season games per team are NBA Cup-dependent and are generated in-save after Group Play, yielding 82 games per team.',
   'NBA Cup Championship is stored separately and does not count in regular-season standings.',
   'Future simulated seasons use NBA Courtside\'s 82-game schedule template because no official future schedule exists yet.'
 ],
 'official_dates':{
   'opening_day':'2026-10-20','regular_season_end':'2027-04-11','trade_deadline':'2027-02-11',
   'cup_group_start':'2026-10-30','cup_group_end':'2026-11-27','cup_qf_start':'2026-12-04','cup_qf_end':'2026-12-05',
   'cup_sf_start':'2026-12-08','cup_sf_end':'2026-12-09','cup_final':'2026-12-11',
   'all_star_break_start':'2027-02-19','all_star_break_end':'2027-02-24','play_in_start':'2027-04-13','play_in_end':'2027-04-16'
 },
 'cup_groups':CUP_GROUPS,
 'games':games
}
OUT.write_text(json.dumps(obj,indent=2)+'\n',encoding='utf-8')
JS.write_text('window.NBA_COURTSIDE_SCHEDULE='+json.dumps(obj,separators=(',',':'))+';\n',encoding='utf-8')
print(f'Imported {len(games)} official assigned games -> {OUT}')
