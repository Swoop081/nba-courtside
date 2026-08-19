#!/usr/bin/env python3
from pathlib import Path
import pandas as pd
import numpy as np
import json, re, unicodedata, math, shutil

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'raw'
DATA = ROOT / 'data'
MODEL = ROOT / 'model'
DATA.mkdir(exist_ok=True); MODEL.mkdir(exist_ok=True)

FREEZE_DATE = '2026-08-19'
SEASON = '2026-27'
STATS_SEASON = '2025-26'

TEAM_META = {
'ATL':('Atlanta Hawks','East','Southeast',1610612737,'#E03A3E','#C1D32F'),
'BOS':('Boston Celtics','East','Atlantic',1610612738,'#007A33','#BA9653'),
'BKN':('Brooklyn Nets','East','Atlantic',1610612751,'#000000','#FFFFFF'),
'CHA':('Charlotte Hornets','East','Southeast',1610612766,'#1D1160','#00788C'),
'CHI':('Chicago Bulls','East','Central',1610612741,'#CE1141','#000000'),
'CLE':('Cleveland Cavaliers','East','Central',1610612739,'#860038','#FDBB30'),
'DAL':('Dallas Mavericks','West','Southwest',1610612742,'#00538C','#B8C4CA'),
'DEN':('Denver Nuggets','West','Northwest',1610612743,'#0E2240','#FEC524'),
'DET':('Detroit Pistons','East','Central',1610612765,'#C8102E','#1D42BA'),
'GSW':('Golden State Warriors','West','Pacific',1610612744,'#1D428A','#FFC72C'),
'HOU':('Houston Rockets','West','Southwest',1610612745,'#CE1141','#000000'),
'IND':('Indiana Pacers','East','Central',1610612754,'#002D62','#FDBB30'),
'LAC':('LA Clippers','West','Pacific',1610612746,'#C8102E','#1D428A'),
'LAL':('Los Angeles Lakers','West','Pacific',1610612747,'#552583','#FDB927'),
'MEM':('Memphis Grizzlies','West','Southwest',1610612763,'#5D76A9','#12173F'),
'MIA':('Miami Heat','East','Southeast',1610612748,'#98002E','#F9A01B'),
'MIL':('Milwaukee Bucks','East','Central',1610612749,'#00471B','#EEE1C6'),
'MIN':('Minnesota Timberwolves','West','Northwest',1610612750,'#0C2340','#78BE20'),
'NOP':('New Orleans Pelicans','West','Southwest',1610612740,'#0C2340','#C8102E'),
'NYK':('New York Knicks','East','Atlantic',1610612752,'#006BB6','#F58426'),
'OKC':('Oklahoma City Thunder','West','Northwest',1610612760,'#007AC1','#EF3B24'),
'ORL':('Orlando Magic','East','Southeast',1610612753,'#0077C0','#C4CED4'),
'PHI':('Philadelphia 76ers','East','Atlantic',1610612755,'#006BB6','#ED174C'),
'PHX':('Phoenix Suns','West','Pacific',1610612756,'#1D1160','#E56020'),
'POR':('Portland Trail Blazers','West','Northwest',1610612757,'#E03A3E','#000000'),
'SAC':('Sacramento Kings','West','Pacific',1610612758,'#5A2D81','#63727A'),
'SAS':('San Antonio Spurs','West','Southwest',1610612759,'#000000','#C4CED4'),
'TOR':('Toronto Raptors','East','Atlantic',1610612761,'#CE1141','#000000'),
'UTA':('Utah Jazz','West','Northwest',1610612762,'#002B5C','#F9A01B'),
'WAS':('Washington Wizards','East','Southeast',1610612764,'#002B5C','#E31837'),
}

CAP_HITS = {
'DEN':223546419,'PHX':219949444,'ORL':219227290,'GSW':218663527,'NYK':218412232,'OKC':218365399,
'MIN':215475367,'IND':211739396,'PHI':208544234,'LAL':207890498,'HOU':205312765,'NOP':204728942,
'TOR':204016904,'BOS':203623048,'SAC':202859372,'MIA':202225742,'SAS':200465083,'ATL':200054950,
'DAL':197866094,'POR':195904863,'WAS':192195342,'MIL':190298316,'DET':188615753,'CHA':183790615,
'UTA':183190627,'CLE':182064794,'LAC':175681867,'CHI':168170020,'BKN':162780296,'MEM':161034793,
}

NBA_ID_OVERRIDES = {'AJ Dybantsa':1643407,'Darryn Peterson':1643408,'Cameron Boozer':1643409}

CAP = {
    'season': SEASON,
    'salary_floor':148465000,
    'salary_cap':164961000,
    'luxury_tax':200428000,
    'first_apron':209015000,
    'second_apron':221686000,
    'opening_day_max_standard_roster':15,
    'offseason_max_roster':21,
    'two_way_max':3,
}

# ---------- helpers ----------
def norm_name(s):
    s = unicodedata.normalize('NFKD', str(s)).encode('ascii','ignore').decode().lower()
    s = s.replace('’',"'").replace('.', '').replace('-', ' ')
    s = re.sub(r"\b(jr|sr|ii|iii|iv)\b", '', s)
    s = re.sub(r'[^a-z0-9 ]','',s)
    return re.sub(r'\s+',' ',s).strip()

ALIASES = {
    'alexandre sarr':'alex sarr',
    'carlton carrington':'bub carrington',
    'cameron christie':'cam christie',
    'nicolas claxton':'nic claxton',
    'lu dort':'luguentz dort',
    'yang hansen':'hansen yang',
}
def stat_norm_name(s):
    n=norm_name(s)
    return ALIASES.get(n,n)

def slugify(s):
    return norm_name(s).replace(' ','-')

def pct_rank(series):
    return series.rank(method='average', pct=True).fillna(0.5)

def rating_from_score(x):
    if pd.isna(x): return None
    return int(np.clip(round(50 + 49*float(x)), 35, 99))

def contract_parse(raw):
    years=[]
    for token in str(raw).split(';'):
        if not token: continue
        yr,val=token.split(':',1)
        option='guaranteed'
        if val=='PENDING':
            amount=None; option='pending'
        else:
            if val.startswith('P'):
                option='player_option'; val=val[1:]
            elif val.startswith('T'):
                option='team_option'; val=val[1:]
            amount=int(val)
        years.append({'season_start':int(yr),'season':f'{yr}-{str(int(yr)+1)[-2:]}','amount':amount,'option':option})
    return years

def pos_group(poslist):
    p=set(poslist)
    if 'C' in p or ('PF' in p and not ({'PG','SG'} & p)):
        return 'big'
    if 'PG' in p or ('SG' in p and not ({'PF','C'} & p)):
        return 'guard'
    return 'wing'

# ---------- stats ----------
stats=pd.read_csv(RAW/'nba_stats_2025_2026_bootstrap.csv')
stats=stats[stats['Player'].notna() & (stats['Player']!='Team Totals')].copy()
for c in ['G','GS','MP','FG','FGA','3P','3PA','2P','2PA','FT','FTA','ORB','DRB','TRB','AST','STL','BLK','TOV','PF','PTS']:
    stats[c]=pd.to_numeric(stats[c],errors='coerce').fillna(0.0)
stats['norm']=stats['Player'].map(norm_name)

# Aggregate player stints by reconstructing totals from per-game numbers.
rows=[]
for n,g in stats.groupby('norm'):
    games=g['G'].sum()
    if games<=0: continue
    out={'norm':n,'Player':g.iloc[0]['Player'],'Age':g['Age'].dropna().iloc[0] if g['Age'].notna().any() else None,'Pos':g.iloc[0]['Pos'],'G':float(games)}
    for c in ['GS','MP','FG','FGA','3P','3PA','2P','2PA','FT','FTA','ORB','DRB','TRB','AST','STL','BLK','TOV','PF','PTS']:
        # source is per-game, except G/GS; GS is count in BRef, so sum directly
        if c=='GS': out[c]=float(g[c].sum())
        else: out[c]=float((g[c]*g['G']).sum()/games)
    rows.append(out)
S=pd.DataFrame(rows).set_index('norm')

# League averages weighted by attempts for Bayesian shrinkage.
def weighted_rate(made,att):
    total_made=(S[made]*S['G']).sum(); total_att=(S[att]*S['G']).sum()
    return float(total_made/total_att) if total_att else 0
lg3=weighted_rate('3P','3PA'); lg2=weighted_rate('2P','2PA'); lgft=weighted_rate('FT','FTA')
K3,K2,KFT=100,150,75
mins=S['MP']*S['G']
for c in ['FGA','3PA','2PA','FTA','ORB','DRB','AST','STL','BLK','TOV','PF','PTS']:
    S[c+'36']=np.where(S['MP']>0,S[c]*36/S['MP'],0)
S['adj3p']=((S['3P']*S['G']) + K3*lg3)/((S['3PA']*S['G'])+K3)
S['adj2p']=((S['2P']*S['G']) + K2*lg2)/((S['2PA']*S['G'])+K2)
S['adjft']=((S['FT']*S['G']) + KFT*lgft)/((S['FTA']*S['G'])+KFT)
S['ast_to']=S['AST36']/(S['TOV36']+0.65)
S['responsibility']=S['FGA36'] + 2*S['AST36'] + .44*S['FTA36']
S['tov_resp']=S['TOV36']/(S['responsibility']+2.0)
S['low_pf36']=-S['PF36']

# percentiles
P={c:pct_rank(S[c]) for c in ['adj3p','adj2p','adjft','3PA36','2PA36','FTA36','FGA36','PTS36','AST36','ast_to','ORB36','DRB36','STL36','BLK36','low_pf36','MP','G']}
P['security']=pct_rank(-S['tov_resp'])

rating_table=pd.DataFrame(index=S.index)
rating_table['three_pt']=[rating_from_score(x) for x in (.75*P['adj3p']+.25*P['3PA36'])]
rating_table['finishing']=[rating_from_score(x) for x in (.65*P['adj2p']+.25*P['2PA36']+.10*P['FTA36'])]
rating_table['free_throw']=[rating_from_score(x) for x in P['adjft']]
rating_table['shot_creation']=[rating_from_score(x) for x in (.55*P['FGA36']+.25*P['FTA36']+.20*P['PTS36'])]
rating_table['playmaking']=[rating_from_score(x) for x in (.70*P['AST36']+.30*P['ast_to'])]
rating_table['ball_security']=[rating_from_score(x) for x in P['security']]
rating_table['offensive_rebounding']=[rating_from_score(x) for x in P['ORB36']]
rating_table['defensive_rebounding']=[rating_from_score(x) for x in P['DRB36']]
rating_table['stamina']=[rating_from_score(x) for x in (.65*P['MP']+.35*P['G'])]
# defense gets position proxy later because roster position is more trustworthy.
rating_table['steal_component']=P['STL36']
rating_table['block_component']=P['BLK36']
rating_table['discipline_component']=P['low_pf36']

# ---------- roster ----------
roster=pd.read_csv(RAW/'rosters_contracts_2026-08-19.tsv',sep='\t',dtype={'team':str})
modern=pd.read_csv(RAW/'modern_index.csv')
modern['norm']=modern['player'].map(norm_name)
# Prefer most recent record, nba id nonnull.
modern=modern.sort_values(['norm','year']).drop_duplicates('norm',keep='last').set_index('norm')

players=[]; unmatched=[]; projected=[]; low_conf=[]
for _,r in roster.iterrows():
    n=stat_norm_name(r['name']); pos=[x.strip() for x in str(r['positions']).split(',') if x.strip()]
    group=pos_group(pos)
    p={
        'id':slugify(r['name']), 'name':r['name'], 'team':r['team'], 'age':int(r['age']),
        'positions':pos, 'position_group':group, 'roster_status':r['roster_status'],
        'contract':{'years':contract_parse(r['contract']),'expiry':r['expiry']},
        'headshot_url':None, 'stats_2025_26':None, 'ratings':None, 'tendencies':None,
        'rating_source':None, 'data_confidence':0.0, 'career_status':None, 'data_quality':[]
    }
    if r['name'] in NBA_ID_OVERRIDES:
        nbaid=NBA_ID_OVERRIDES[r['name']]
        p['nba_id']=nbaid
        p['headshot_url']=f'https://cdn.nba.com/headshots/nba/latest/1040x760/{nbaid}.png'
    elif n in modern.index and pd.notna(modern.loc[n].get('nba_id')):
        try:
            nbaid=int(float(modern.loc[n]['nba_id']))
            p['nba_id']=nbaid
            p['headshot_url']=f'https://cdn.nba.com/headshots/nba/latest/1040x760/{nbaid}.png'
        except Exception: pass
    if n in S.index:
        s=S.loc[n]; total_minutes=float(s['G']*s['MP']); conf=min(1.0,total_minutes/1200.0)
        p['data_confidence']=round(conf,3)
        p['career_status']='nba_established' if s['G']>=1 else 'insufficient_sample'
        p['rating_source']='2025-26_box_score_model'
        p['stats_2025_26']={
            'gp':int(round(s['G'])),'gs':int(round(s['GS'])),'mpg':round(float(s['MP']),1),
            'pts':round(float(s['PTS']),1),'reb':round(float(s['TRB']),1),'ast':round(float(s['AST']),1),
            'stl':round(float(s['STL']),1),'blk':round(float(s['BLK']),1),'tov':round(float(s['TOV']),1),
            'fg_pct':round(float((s['FG']/s['FGA']) if s['FGA'] else 0),3),
            'three_pct':round(float((s['3P']/s['3PA']) if s['3PA'] else 0),3) if s['3PA'] else None,
            'ft_pct':round(float((s['FT']/s['FTA']) if s['FTA'] else 0),3) if s['FTA'] else None,
            'fga':round(float(s['FGA']),1),'three_pa':round(float(s['3PA']),1),'fta':round(float(s['FTA']),1),
            'oreb':round(float(s['ORB']),1),'dreb':round(float(s['DRB']),1),'pf':round(float(s['PF']),1)
        }
        rt=rating_table.loc[n]
        perim_proxy={'guard':.85,'wing':.70,'big':.40}[group]
        int_proxy={'guard':.20,'wing':.45,'big':.90}[group]
        perim=rating_from_score(.65*rt['steal_component']+.20*rt['discipline_component']+.15*perim_proxy)
        interior=rating_from_score(.55*rt['block_component']+.25*P['DRB36'].loc[n]+.20*int_proxy)
        ratings={k:int(rt[k]) for k in ['finishing','three_pt','free_throw','shot_creation','playmaking','ball_security','offensive_rebounding','defensive_rebounding','stamina']}
        ratings['perimeter_defense']=perim; ratings['interior_defense']=interior
        # Until a prior-season blend is imported, temper volatile low-minute samples toward league-average (75).
        if conf < 1.0:
            for rk in list(ratings):
                ratings[rk]=int(round(75 + conf*(ratings[rk]-75)))
        off=.24*ratings['finishing']+.17*ratings['three_pt']+.05*ratings['free_throw']+.20*ratings['shot_creation']+.20*ratings['playmaking']+.14*ratings['ball_security']
        de=.40*perim+.35*interior+.10*ratings['offensive_rebounding']+.15*ratings['defensive_rebounding']
        ratings['offense']=int(round(off)); ratings['defense']=int(round(de))
        wgts={
          'guard':{'finishing':.15,'three_pt':.20,'free_throw':.04,'shot_creation':.15,'playmaking':.18,'ball_security':.10,'offensive_rebounding':.01,'defensive_rebounding':.03,'perimeter_defense':.08,'interior_defense':0,'stamina':.06},
          'wing': {'finishing':.18,'three_pt':.17,'free_throw':.04,'shot_creation':.14,'playmaking':.12,'ball_security':.08,'offensive_rebounding':.03,'defensive_rebounding':.06,'perimeter_defense':.10,'interior_defense':.02,'stamina':.06},
          'big':  {'finishing':.22,'three_pt':.08,'free_throw':.04,'shot_creation':.08,'playmaking':.08,'ball_security':.05,'offensive_rebounding':.10,'defensive_rebounding':.12,'perimeter_defense':.03,'interior_defense':.12,'stamina':.08}}
        overall=sum(ratings[k]*w for k,w in wgts[group].items())
        ratings['overall']=int(round(overall))
        p['ratings']=ratings
        p['tendencies']={
            'three_point_rate':round(float(s['3PA']/(s['FGA']+1e-9)),3),
            'free_throw_rate':round(float(s['FTA']/(s['FGA']+1e-9)),3),
            'shot_volume_per36':round(float(s['FGA36']),2),
            'assist_per36':round(float(s['AST36']),2),
            'turnover_per36':round(float(s['TOV36']),2)
        }
        if conf < .25:
            p['career_status']='low_sample_established'; p['data_quality'].append('needs_prior_season_blend'); low_conf.append(p['name'])
    else:
        contract_years=p['contract']['years']
        first_year_rookie=(p['age']<=24 and len(contract_years)>=4 and contract_years[0]['season_start']==2026)
        if first_year_rookie:
            p['career_status']='rookie_2026_projection_pending'
            p['rating_source']='pre_nba_projection_pending'
            projected.append(p['name'])
        else:
            p['career_status']='no_2025_26_nba_sample'
            p['rating_source']='prior_or_external_sample_pending'
            unmatched.append(p['name'])
        p['data_quality'].append('no_2025_26_stat_match')
    if not p['headshot_url']:
        p['data_quality'].append('headshot_id_unmatched')
    players.append(p)

# duplicate player identity audit
id_counts=pd.Series([p['id'] for p in players]).value_counts()
dups=id_counts[id_counts>1].to_dict()

# teams data
teams=[]
for abbr,(name,conf,div,nbaid,c1,c2) in TEAM_META.items():
    rp=[p for p in players if p['team']==abbr]
    standard=sum(p['roster_status']=='active' for p in rp)
    teams.append({
      'abbr':abbr,'name':name,'conference':conf,'division':div,'nba_team_id':nbaid,
      'primary_color':c1,'secondary_color':c2,
      'logo_url':f'https://cdn.nba.com/logos/nba/{nbaid}/global/L/logo.svg',
      'cap_hit':CAP_HITS.get(abbr),'standard_active_in_snapshot':standard,
      'nonactive_standard_in_snapshot':len(rp)-standard,
      'opening_day_cuts_required_from_active_snapshot':max(0,standard-CAP['opening_day_max_standard_roster'])
    })

league={
 'project':'NBA Courtside','version':'2026-data-foundation-v0.1','freeze_date':FREEZE_DATE,
 'season':SEASON,'stats_seed_season':STATS_SEASON,'cap':CAP,
 'teams':sorted(teams,key=lambda x:(x['conference'],x['division'],x['name'])),
 'notes':[
   'Offseason snapshot: standard-contract rosters are intentionally not forced to 15 players before opening day.',
   'Current cap hits include team-level accounting beyond the player rows represented here.',
   '2025-26 statistical seed is a near-final bootstrap dataset; official NBA.com final import can replace it without changing the rating schema.'
 ]
}

model={
 'version':'0.1','historical_portability':'core inputs are traditional box-score stats available across eras',
 'input_fields':['GP','GS','MIN','FGM','FGA','3PM','3PA','FTM','FTA','OREB','DREB','AST','TOV','STL','BLK','PF','PTS','age','position'],
 'normalization':'per-36 volume + season-relative percentile normalization',
 'bayesian_shrinkage':{'three_point_attempt_prior':K3,'two_point_attempt_prior':K2,'free_throw_attempt_prior':KFT,'league_3p_pct':round(lg3,4),'league_2p_pct':round(lg2,4),'league_ft_pct':round(lgft,4)},
 'display_rating':'clip(round(50 + 49 * percentile_score), 35, 99)',
 'ratings':{
   'three_pt':'75% adjusted 3P% percentile + 25% 3PA/36 percentile',
   'finishing':'65% adjusted 2P% percentile + 25% 2PA/36 + 10% FTA/36',
   'free_throw':'adjusted FT% percentile',
   'shot_creation':'55% FGA/36 + 25% FTA/36 + 20% PTS/36',
   'playmaking':'70% AST/36 + 30% AST:TOV proxy',
   'ball_security':'turnovers relative to offensive-responsibility proxy',
   'offensive_rebounding':'OREB/36 percentile','defensive_rebounding':'DREB/36 percentile',
   'perimeter_defense':'65% STL/36 + 20% foul discipline + 15% position proxy',
   'interior_defense':'55% BLK/36 + 25% DREB/36 + 20% position proxy',
   'stamina':'65% MPG percentile + 35% GP percentile'
 },
 'confidence':{'formula':'min(1, total_minutes / 1200)','low_sample_flag_below':0.25,'future':'blend low-sample season with prior established level'},
 'rookies':{'no_nba_stats':'ratings remain null / projection_pending in this foundation','planned_projection_inputs':['pre-NBA stats','age','height/weight','competition level','draft/scouting tier'],'draft_position_rule':'potential signal > current ability','nba_takeover':'nba_weight=min(1, career_nba_minutes/1500)'},
 'development':{'future_system':'attribute-specific age curve + hidden potential + controlled variance','prime':'individualized, generally late 20s','decline':'post-prime ratings trend downward until retirement'}
}

quality={
 'freeze_date':FREEZE_DATE,'player_rows':len(players),'teams':len(teams),
 'established_with_stats':sum(p['ratings'] is not None for p in players),
 'projection_pending':sum(p['career_status']=='rookie_2026_projection_pending' for p in players),
 'insufficient_or_no_match':sum(p['ratings'] is None and p['career_status']!='rookie_2026_projection_pending' for p in players),
 'headshot_matched':sum(bool(p['headshot_url']) for p in players),
 'low_sample_prior_blend_needed':len(low_conf),'duplicate_player_ids':dups,
 'unmatched_established_names':sorted(set(unmatched)),
 'projection_pending_names':sorted(set(projected)),
 'warnings':[
   'Roster/contracts are a frozen SalarySwish-based 2026-08-19 working snapshot, not an official NBA transaction feed.',
   'Stat seed file was published before the final end-of-season refresh; use it as the formula/bootstrap dataset, not final canonical statistics.',
   'Some offseason roster categories (camp/two-way/nonstandard) are intentionally not yet modeled as standard roster players.',
   'Pending rookie/pre-NBA projection importer is intentionally not replaced with invented ratings.'
 ]
}

(DATA/'league-2026-08-19.json').write_text(json.dumps(league,indent=2,ensure_ascii=False),encoding='utf-8')
(DATA/'players-2026-08-19.json').write_text(json.dumps(players,indent=2,ensure_ascii=False),encoding='utf-8')
(DATA/'data-quality.json').write_text(json.dumps(quality,indent=2,ensure_ascii=False),encoding='utf-8')
(MODEL/'rating-model.json').write_text(json.dumps(model,indent=2,ensure_ascii=False),encoding='utf-8')
# browser-friendly embedded payload for file:// opening
payload='window.NBA_COURTSIDE_DATA = '+json.dumps({'league':league,'players':players,'quality':quality,'model':model},ensure_ascii=False)+';\n'
(DATA/'data.js').write_text(payload,encoding='utf-8')
print(json.dumps(quality,indent=2,ensure_ascii=False))
