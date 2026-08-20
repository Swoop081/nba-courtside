#!/usr/bin/env python3
import json, math
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PLAYERS=ROOT/'data/players-2026-08-19.json'
DATAJS=ROOT/'data/data.js'

FINAL_RECORDS={
'DET':(60,22),'BOS':(56,26),'NYK':(53,29),'CLE':(52,30),'TOR':(46,36),'ATL':(46,36),'PHI':(45,37),'ORL':(45,37),'CHA':(44,38),'MIA':(43,39),'MIL':(32,50),'CHI':(31,51),'BKN':(20,62),'IND':(19,63),'WAS':(17,65),
'OKC':(64,18),'SAS':(62,20),'DEN':(54,28),'LAL':(53,29),'HOU':(52,30),'MIN':(49,33),'PHX':(45,37),'POR':(42,40),'LAC':(42,40),'GSW':(37,45),'NOP':(26,56),'DAL':(26,56),'MEM':(25,57),'SAC':(22,60),'UTA':(22,60)
}

# Season-complete rows manually verified against the 2025-26 final regular-season NBAstuffer table.
# Totals are used for attempts because that is how the source table exposes them.
# Fields not exposed there (GS, OREB, DREB, PF) remain from the existing near-final bootstrap.
ROWS={
'Cade Cunningham':dict(gp=64,mpg=33.9,fta_t=382,ft=.812,twopa=823,twop=.514,tpa_t=366,tp=.342,pts=23.9,reb=5.5,ast=9.9,stl=1.4,blk=.8,tov=3.7),
'Jalen Duren':dict(gp=70,mpg=28.2,fta_t=430,ft=.747,twopa=803,twop=.650,tpa_t=0,tp=None,pts=19.5,reb=10.5,ast=2.0,stl=.8,blk=.8,tov=1.9),
'Duncan Robinson':dict(gp=77,mpg=27.4,fta_t=110,ft=.755,twopa=162,twop=.605,tpa_t=536,tp=.410,pts=12.2,reb=2.7,ast=2.1,stl=.6,blk=.3,tov=.7),
'Tobias Harris':dict(gp=63,mpg=27.7,fta_t=157,ft=.866,twopa=436,twop=.521,tpa_t=223,tp=.368,pts=13.3,reb=5.1,ast=2.5,stl=.9,blk=.4,tov=1.0),
'Paul George':dict(gp=37,mpg=30.7,fta_t=111,ft=.820,twopa=258,twop=.484,tpa_t=255,tp=.392,pts=17.3,reb=5.3,ast=3.6,stl=1.7,blk=.4,tov=1.7),
'LeBron James':dict(gp=60,mpg=33.2,fta_t=316,ft=.737,twopa=676,twop=.586,tpa_t=243,tp=.317,pts=20.9,reb=6.1,ast=7.2,stl=1.2,blk=.6,tov=3.0),
'Jabari Smith Jr.':dict(gp=77,mpg=35.1,fta_t=209,ft=.775,twopa=486,twop=.537,tpa_t=488,tp=.363,pts=15.8,reb=6.9,ast=1.9,stl=.7,blk=.9,tov=1.4),
'Alperen Sengun':dict(gp=72,mpg=33.3,fta_t=376,ft=.691,twopa=992,twop=.547,tpa_t=131,tp=.305,pts=20.4,reb=8.9,ast=6.2,stl=1.2,blk=1.1,tov=3.2),
'Steven Adams':dict(gp=32,mpg=22.8,fta_t=81,ft=.580,twopa=139,twop=.504,tpa_t=0,tp=None,pts=5.8,reb=8.6,ast=1.5,stl=.7,blk=.6,tov=1.1),
'Kevin Durant':dict(gp=78,mpg=36.4,fta_t=467,ft=.874,twopa=925,twop=.573,tpa_t=450,tp=.413,pts=26.0,reb=5.4,ast=4.8,stl=.8,blk=.9,tov=3.2),
'Amen Thompson':dict(gp=79,mpg=37.4,fta_t=390,ft=.779,twopa=928,twop=.573,tpa_t=116,tp=.216,pts=18.3,reb=7.8,ast=5.3,stl=1.5,blk=.6,tov=2.4),
'Tari Eason':dict(gp=60,mpg=25.8,fta_t=67,ft=.776,twopa=320,twop=.463,tpa_t=260,tp=.358,pts=10.5,reb=6.3,ast=1.5,stl=1.2,blk=.5,tov=1.4),
'Matas Buzelis':dict(gp=77,mpg=29.2,fta_t=238,ft=.786,twopa=468,twop=.583,tpa_t=495,tp=.349,pts=16.3,reb=5.8,ast=2.1,stl=.7,blk=1.5,tov=2.1),
'Nikola Vucevic':dict(gp=48,mpg=30.8,fta_t=74,ft=.838,twopa=442,twop=.568,tpa_t=218,tp=.376,pts=16.9,reb=9.0,ast=3.8,stl=.7,blk=.6,tov=1.4),
'Tre Jones':dict(gp=65,mpg=27.0,fta_t=227,ft=.841,twopa=487,twop=.616,tpa_t=130,tp=.315,pts=14.1,reb=3.1,ast=5.4,stl=1.2,blk=.2,tov=1.4),
'Josh Giddey':dict(gp=54,mpg=32.1,fta_t=228,ft=.763,twopa=434,twop=.502,tpa_t=283,tp=.364,pts=17.0,reb=8.3,ast=9.1,stl=1.0,blk=.5,tov=3.6),
'Kevin Huerter':dict(gp=44,mpg=23.6,fta_t=56,ft=.732,twopa=181,twop=.630,tpa_t=223,tp=.314,pts=10.9,reb=3.8,ast=2.6,stl=.8,blk=.6,tov=1.1),
'Ayo Dosunmu':dict(gp=45,mpg=26.4,fta_t=105,ft=.857,twopa=293,twop=.556,tpa_t=193,tp=.451,pts=15.0,reb=3.0,ast=3.6,stl=.8,blk=.3,tov=1.4),
'Patrick Williams':dict(gp=72,mpg=20.5,fta_t=75,ft=.720,twopa=204,twop=.407,tpa_t=274,tp=.347,pts=7.0,reb=3.0,ast=1.5,stl=.7,blk=.4,tov=1.0),
'Jalen Smith':dict(gp=53,mpg=20.7,fta_t=93,ft=.742,twopa=184,twop=.614,tpa_t=220,tp=.373,pts=10.2,reb=6.7,ast=1.2,stl=.5,blk=.8,tov=1.0),
'Bennedict Mathurin':dict(gp=28,mpg=31.8,fta_t=146,ft=.884,twopa=202,twop=.480,tpa_t=156,tp=.372,pts=17.8,reb=5.4,ast=2.3,stl=.6,blk=.1,tov=2.3),
'Andrew Nembhard':dict(gp=57,mpg=31.3,fta_t=234,ft=.825,twopa=457,twop=.495,tpa_t=296,tp=.361,pts=16.9,reb=2.8,ast=7.7,stl=.9,blk=.1,tov=2.4),
'Obi Toppin':dict(gp=24,mpg=17.7,fta_t=46,ft=.913,twopa=94,twop=.670,tpa_t=105,tp=.352,pts=11.6,reb=4.4,ast=2.3,stl=.5,blk=0.0,tov=1.2),
'Ben Sheppard':dict(gp=65,mpg=21.4,fta_t=51,ft=.765,twopa=155,twop=.542,tpa_t=232,tp=.362,pts=7.1,reb=3.0,ast=1.8,stl=.6,blk=.1,tov=.6),
'Jay Huff':dict(gp=82,mpg=21.0,fta_t=99,ft=.828,twopa=238,twop=.723,tpa_t=373,tp=.319,pts=9.5,reb=4.0,ast=1.5,stl=.5,blk=1.9,tov=.9),
'Jarace Walker':dict(gp=76,mpg=25.7,fta_t=183,ft=.749,twopa=377,twop=.462,tpa_t=356,tp=.374,pts=11.6,reb=5.1,ast=2.5,stl=.8,blk=.3,tov=1.8),
'Johnny Furphy':dict(gp=35,mpg=18.4,fta_t=35,ft=.486,twopa=78,twop=.603,tpa_t=71,tp=.324,pts=5.1,reb=4.4,ast=1.2,stl=.6,blk=.2,tov=.8),
'Shai Gilgeous-Alexander':dict(gp=68,mpg=33.2,fta_t=614,ft=.879,twopa=1023,twop=.602,tpa_t=298,tp=.386,pts=31.1,reb=4.3,ast=6.6,stl=1.4,blk=.8,tov=2.2),
'Kenrich Williams':dict(gp=56,mpg=15.3,fta_t=52,ft=.635,twopa=167,twop=.539,tpa_t=129,tp=.388,pts=6.5,reb=3.3,ast=1.4,stl=.6,blk=.1,tov=.8),
'Jalen Williams':dict(gp=33,mpg=28.4,fta_t=129,ft=.837,twopa=369,twop=.523,tpa_t=77,tp=.299,pts=17.1,reb=4.6,ast=5.5,stl=1.2,blk=.3,tov=1.9),
'Cameron Johnson':dict(gp=54,mpg=30.5,fta_t=112,ft=.839,twopa=219,twop=.539,tpa_t=256,tp=.430,pts=12.2,reb=3.8,ast=2.4,stl=.7,blk=.4,tov=.9),
'Aaron Gordon':dict(gp=36,mpg=27.9,fta_t=163,ft=.767,twopa=241,twop=.568,tpa_t=157,tp=.389,pts=16.2,reb=5.8,ast=2.7,stl=.6,blk=.3,tov=1.1),
'Nikola Jokic':dict(gp=65,mpg=34.8,fta_t=480,ft=.831,twopa=837,twop=.636,tpa_t=295,tp=.380,pts=27.7,reb=12.9,ast=10.7,stl=1.4,blk=.8,tov=3.7),
'Tyler Herro':dict(gp=33,mpg=31.3,fta_t=108,ft=.917,twopa=293,twop=.556,tpa_t=222,tp=.378,pts=20.5,reb=4.8,ast=4.1,stl=.7,blk=.4,tov=1.9),
}

# Future-pick origin-cell safety map. Simple direct rights are executable; complex swap/protection chains are source-locked.
TEAMS=list(FINAL_RECORDS)
# ensure stable alphabetical data shape
TEAMS=sorted(TEAMS)

complex_first={
'ATL':[2028], 'BOS':[2028,2029], 'BKN':[2027,2028,2029], 'CHA':[2028,2029,2030], 'CLE':[2027,2028,2029],
'DAL':[2028,2029,2030], 'DEN':[2027,2028,2029,2030], 'HOU':[2027,2029], 'LAC':[2027,2028,2029],
'LAL':[2030], 'MEM':[2029,2030], 'MIA':[2028,2030], 'MIL':[2027,2028,2029,2030], 'MIN':[2027,2028,2029,2030],
'NOP':[2027], 'NYK':[2028], 'OKC':[2027,2028,2029,2030], 'ORL':[2029], 'PHI':[2028,2029], 'PHX':[2028,2029,2030],
'POR':[2028,2029,2030], 'SAC':[2031], 'SAS':[2028,2030,2031], 'TOR':[2027], 'UTA':[2027,2028,2029,2030], 'WAS':[2027,2028,2029,2030]
}
frozen_first={('BOS',2032):'Second-apron frozen-pick window through 2027-28.',('CLE',2033):'Second-apron frozen-pick window through 2028-29.',('MIN',2032):'Second-apron frozen-pick window through 2027-28.',('PHX',2032):'Second-apron frozen-pick window through 2027-28.'}
# simple direct current owner obligations
direct_first={
('ATL',2027):'SAS',('NYK',2027):'BKN',('PHX',2027):'HOU',('NYK',2029):'BKN',('NYK',2031):'BKN',('PHX',2031):'MEM',('PHX',2033):'CHA',('DEN',2032):'BKN',('IND',2029):'LAC',('ORL',2028):'POR',('ORL',2030):'MEM',('MIN',2031):'SAC',('MIN',2033):'CHA',('TOR',2031):'LAC',('TOR',2033):'LAC',('LAL',2029):'DAL',('LAL',2031):'UTA',('LAL',2033):'UTA',('MIA',2031):'MIL',('MIA',2033):'MIL',('PHI',2031):'BOS'
}
protected_first={
('DAL',2027):dict(owner='CHA',protection={'type':'retain_top','max':2,'protectedOwner':'DAL'},summary='Charlotte receives Dallas if No. 3-30; Dallas retains No. 1-2.'),
('LAL',2027):dict(owner='MEM',protection={'type':'retain_top','max':4,'protectedOwner':'LAL'},summary='Memphis receives Lakers if No. 5-30; Lakers retains No. 1-4.'),
('MIA',2027):dict(owner='CHA',protection={'type':'retain_top','max':14,'protectedOwner':'MIA'},summary='Charlotte receives Miami if No. 15-30; Miami retains No. 1-14.'),
('SAS',2027):dict(owner='SAC',protection={'type':'split','max':16,'fallbackOwner':'OKC'},summary='Sacramento receives San Antonio at No. 1-16; Oklahoma City receives No. 17-30.')
}
# Selected simple second-round current-owner obligations. Everything else is deliberately locked pending exact chain execution.
direct_second={
('TOR',2030):'LAC',('TOR',2031):'NOP',('TOR',2032):'BKN',('TOR',2033):'LAC',
('DAL',2028):'LAC',('DAL',2029):'BKN',('DAL',2030):'BKN',('DAL',2031):'DET',('DAL',2032):'NYK',('DAL',2033):'WAS',
('DEN',2027):'UTA',('DEN',2032):'BKN',('HOU',2028):'CHA',('HOU',2029):'MEM',('HOU',2033):'CHA',
('LAL',2029):'MEM',('LAL',2030):'BKN',('MIA',2032):'BKN',('MIA',2033):'MIL',
('MIN',2027):'POR',('MIN',2028):'DEN',('MIN',2032):'CHA',('MIN',2033):'CHA',
('NOP',2028):'SAS',('NOP',2029):'SAS',('NYK',2031):'CHI',('OKC',2033):'MEM',
('PHX',2029):'NYK',('PHX',2031):'CHA',('PHX',2033):'NYK',
('SAC',2028):'POR',('SAC',2029):'NYK',('SAC',2030):'SAS',('SAC',2031):'DEN',('SAC',2032):'CLE',('SAC',2033):'ATL',
('WAS',2031):'LAL',('WAS',2032):'LAL',('WAS',2033):'MEM',('CLE',2027):'CHI',('CLE',2028):'UTA',('CLE',2029):'ATL',('CLE',2030):'SAS',
('BOS',2029):'OKC',('GSW',2029):'BKN',('MEM',2028):'BKN',('MEM',2029):'BKN',('MIL',2030):'ORL',('MIL',2031):'CHA',('MIL',2032):'CHA',
('ORL',2028):'CHA',('PHI',2030):'NYK',('ATL',2028):'BKN',('ATL',2030):'OKC',('ATL',2032):'OKC',('LAC',2029):'SAS'
}

def derive(row, old):
    gp=row['gp']; fga_t=row['twopa']+row['tpa_t']
    fg_pct=((row['twopa']*row['twop'] + row['tpa_t']*(row['tp'] or 0))/fga_t) if fga_t else None
    out=dict(old or {})
    out.update({
        'gp':gp,'mpg':row['mpg'],'pts':row['pts'],'reb':row['reb'],'ast':row['ast'],'stl':row['stl'],'blk':row['blk'],'tov':row['tov'],
        'fg_pct':round(fg_pct,3) if fg_pct is not None else None,'three_pct':round(row['tp'],3) if row['tp'] is not None else None,'ft_pct':round(row['ft'],3),
        'fga':round(fga_t/gp,1),'three_pa':round(row['tpa_t']/gp,1),'fta':round(row['fta_t']/gp,1)
    })
    return out

def patch_players(players):
    byname={p['name']:p for p in players}
    matched=[]
    for p in players:
        if p.get('stats_2025_26'):
            p['stat_source_status']='bootstrap_hybrid'
            p['stat_source']='Near-final 2025-26 bootstrap; season-complete row not yet source-verified in v0.18.'
            p['stat_verified_fields']=[]
            p['stat_bootstrap_fields']=['gp','gs','mpg','pts','reb','ast','stl','blk','tov','fg_pct','three_pct','ft_pct','fga','three_pa','fta','oreb','dreb','pf']
        else:
            p['stat_source_status']='projection'
            p['stat_source']='No 2025-26 NBA baseline; projection model.'
            p['stat_verified_fields']=[]
            p['stat_bootstrap_fields']=[]
        p['contract_source_status']='structure_certified'
        p['bird_rights_source_status']='engine_inferred'
    for name,row in ROWS.items():
        p=byname.get(name)
        if not p: continue
        p['stats_2025_26']=derive(row,p.get('stats_2025_26'))
        p['stat_source_status']='season_complete_verified'
        p['stat_source']='NBAstuffer 2025-26 final regular-season verification overlay.'
        p['stat_verified_date']='2026-04-18'
        p['stat_verified_fields']=['gp','mpg','pts','reb','ast','stl','blk','tov','fg_pct','three_pct','ft_pct','fga','three_pa','fta']
        p['stat_bootstrap_fields']=['gs','oreb','dreb','pf']
        matched.append(name)
    return matched

def make_ledger():
    cells=[]
    for y in range(2027,2034):
        for origin in TEAMS:
            # first
            cell={'origin':origin,'year':y,'round':1,'status':'own','owner':origin,'tradeable':True,'summary':'Own first-round origin right in the source snapshot.','source_status':'source_checked'}
            if (origin,y) in direct_first:
                cell.update(status='outgoing',owner=direct_first[(origin,y)],tradeable=True,summary=f'{origin} {y} first-round origin right currently belongs to {direct_first[(origin,y)]}.')
            if (origin,y) in protected_first:
                x=protected_first[(origin,y)]; cell.update(status='protected',owner=x['owner'],tradeable=True,protection=x['protection'],summary=x['summary'])
            if y in complex_first.get(origin,[]):
                cell.update(status='complex',owner=origin,tradeable=False,summary='Linked swap/protection chain is source-identified but locked from trade until exact draft-year resolution.',source_status='source_locked')
            if (origin,y) in frozen_first:
                cell.update(status='frozen',owner=origin,tradeable=False,summary=frozen_first[(origin,y)],source_status='source_locked')
            cells.append(cell)
            # second
            cell2={'origin':origin,'year':y,'round':2,'status':'source_locked','owner':origin,'tradeable':False,'summary':'Second-round origin right is source-indexed but locked pending exact chain execution.','source_status':'source_locked'}
            if (origin,y) in direct_second:
                ow=direct_second[(origin,y)]
                cell2.update(status='outgoing',owner=ow,tradeable=True,summary=f'{origin} {y} second-round origin right currently belongs to {ow}.',source_status='source_checked')
            cells.append(cell2)
    return cells

def main():
    players=json.loads(PLAYERS.read_text())
    matched=patch_players(players)
    PLAYERS.write_text(json.dumps(players,ensure_ascii=False,indent=2)+'\n')
    txt=DATAJS.read_text()
    prefix='window.NBA_COURTSIDE_DATA = '
    assert txt.startswith(prefix)
    obj=json.loads(txt[len(prefix):].rstrip().rstrip(';'))
    dmatched=patch_players(obj['players'])
    assert sorted(matched)==sorted(dmatched)
    DATAJS.write_text(prefix+json.dumps(obj,ensure_ascii=False,separators=(',',':'))+';\n')

    cells=make_ledger()
    ledger={'source':'RealGM NBA Future Draft Picks By Team / detailed team ledger','as_of':'2026-08-20','scope':'Origin-pick rights safety ledger for 2027-2033. Complex chains are source-locked rather than falsely executable.','cells':cells}
    (ROOT/'data/future-pick-ledger-2026-08-20.json').write_text(json.dumps(ledger,indent=2)+'\n')
    (ROOT/'data/future-pick-ledger.js').write_text('window.NBA_COURTSIDE_FUTURE_PICKS = '+json.dumps(ledger,separators=(',',':'))+';\n')

    counts={k:sum(1 for p in players if p.get('stat_source_status')==k) for k in ['season_complete_verified','bootstrap_hybrid','projection']}
    records={k:{'w':v[0],'l':v[1]} for k,v in FINAL_RECORDS.items()}
    summary={
      'version':'v0.18','freeze_date':'2026-08-20','prior_season_records':records,
      'player_stats':{'total_players':len(players),**counts,'rating_population':'calibrated_bootstrap_population','note':'Verified overlay updates exact source fields for explicitly checked rows; ratings were not globally regenerated.'},
      'contracts':{'snapshot_rows':442,'structure_certified':442,'bird_rights':'engine_inferred','note':'Year, salary, option marker and expiry structure are audited against the frozen roster/contract snapshot.'},
      'draft_assets':{'origin_cells':len(cells),'years':'2027-2033','first_round_cells':210,'second_round_cells':210,'complex_or_locked':sum(1 for c in cells if not c['tradeable']),'note':'Safety ledger blocks complex/frozen rights from fake trading; it is not a full executable swap-tree engine.'}
    }
    (ROOT/'data/source-certification-v0.18.json').write_text(json.dumps(summary,indent=2)+'\n')
    (ROOT/'data/source-certification.js').write_text('window.NBA_COURTSIDE_SOURCE_CERT = '+json.dumps(summary,separators=(',',':'))+';\n')
    print(f'Patched {len(matched)} season-complete verified players')
    print('Matched:',', '.join(matched))
    print('Statuses:',counts)
    print('Ledger cells:',len(cells),'locked:',summary['draft_assets']['complex_or_locked'])

if __name__=='__main__': main()
