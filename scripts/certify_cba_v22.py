#!/usr/bin/env python3
import json, pathlib, re, sys
root=pathlib.Path(__file__).resolve().parents[1]
errors=[]
def check(cond,msg):
    if not cond: errors.append(msg)
cert=json.loads((root/'data/source-certification-v0.22.json').read_text())
league=json.loads((root/'data/league-2026-08-19.json').read_text())
sources=json.loads((root/'sources.json').read_text())
tx=cert.get('transaction_rules',{})
check(cert.get('version')=='v0.22','source certification version')
check(cert.get('freeze_date')=='2026-08-20','freeze date')
cap=league.get('cap',{})
check(cap.get('salary_cap')==164_961_000,'2026-27 salary cap')
check(cap.get('luxury_tax')==200_428_000,'2026-27 luxury tax')
check(cap.get('first_apron')==209_015_000,'2026-27 first apron')
check(cap.get('second_apron')==221_686_000,'2026-27 second apron')
for k in ['persistent_tpe','sign_and_trade','base_year_compensation','one_year_bird_consent','reacquisition','high_salary_waived_player_first_apron_gate','second_round_exception','minimum_contract_table_terms','max_salary_105pct_prior','cpu_trade_cba_parity','first_apron_taxpayer_mle_mutual_exclusion']:
    check(tx.get(k) is True,f'{k} flag')
eta=tx.get('exception_trade_acquisition',{})
for k in ['non_taxpayer_mle','room_mle','biannual','minimum_generated_contracts']:
    check(eta.get(k) is True,f'exception trade acquisition {k}')
check(eta.get('taxpayer_mle') is False,'taxpayer MLE must not be trade acquisition route')
check(tx.get('contract_raise_math','').startswith('linear'),'linear raise certification')
check('two months' in tx.get('recently_acquired_aggregation_wait',''),'two-month aggregation certification')
check('July 31' in tx.get('second_round_exception_team_salary_defer',''),'SRPE July 31 certification')
check(cert.get('contracts',{}).get('bird_rights',{}).get('first_actionable_exit_certified')==442,'Bird certification retained')
check(cert.get('draft_assets',{}).get('origin_cells')==420,'future-pick certification retained')
check(cert.get('player_stats',{}).get('season_complete_verified')==392,'player-data certification retained')
js=(root/'data/source-certification.js').read_text().strip()
prefix='window.NBA_COURTSIDE_SOURCE_CERT = '
check(js.startswith(prefix) and js.endswith(';'),'browser source-cert wrapper')
if js.startswith(prefix) and js.endswith(';'):
    try:
        browser=json.loads(js[len(prefix):-1])
        check(browser.get('transaction_rules')==cert.get('transaction_rules'),'v0.22 transaction rules retained in current browser cert')
        check(browser.get('contracts',{}).get('bird_rights',{}).get('first_actionable_exit_certified')==442,'current browser Bird certification retained')
        check(browser.get('draft_assets',{}).get('origin_cells')==420,'current browser draft certification retained')
    except Exception as e: errors.append(f'browser source cert parse: {e}')
entry=sources.get('cba_transactions_v0_22',{})
check('NBA.com CBA 101' in entry.get('primary_rule_source',''),'CBA source manifest')
check('nba.com/news/nba-salary-cap-2026-27-season' in entry.get('financial_url',''),'cap source manifest')
result={'version':'v0.22','status':'PASS' if not errors else 'FAIL','cap':cap,'checks':{'persistent_tpe':tx.get('persistent_tpe'),'sign_and_trade':tx.get('sign_and_trade'),'exception_trade_acquisition':eta,'aggregation_wait':tx.get('recently_acquired_aggregation_wait'),'linear_raise_math':tx.get('contract_raise_math'),'cpu_trade_cba_parity':tx.get('cpu_trade_cba_parity'),'srpe_defer':tx.get('second_round_exception_team_salary_defer')},'retained':{'player_final_rows':cert.get('player_stats',{}).get('season_complete_verified'),'bird_exits':cert.get('contracts',{}).get('bird_rights',{}).get('first_actionable_exit_certified'),'draft_origin_cells':cert.get('draft_assets',{}).get('origin_cells')},'errors':errors}
print(json.dumps(result,indent=2))
sys.exit(1 if errors else 0)
