from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'app-v0.40.js').read_text()
gd=(ROOT/'gameday-v0.40.js').read_text()
idx=(ROOT/'index.html').read_text()
for needle in ['state.healthPerformance','V40_HEALTH_VERSION=40','HEAD ATHLETIC TRAINER','DIRECTOR OF PERFORMANCE','REHAB SPECIALIST','CONSERVATIVE','BALANCED','AGGRESSIVE','RETURN-TO-PLAY','MEDICAL CENTER','data-health-plan','medical_model:\'v0.40\'']:
    assert needle in app,needle
for needle in ['healthMinuteCapV40','pregameEnergyV40','body_area','courtside_v40_health_possession','applyGameHealthV40']:
    assert needle in gd,needle
assert 'V0.40 HEALTH + PERFORMANCE' in idx
cert=json.loads((ROOT/'data/health-performance-certification-v0.40.json').read_text())
assert cert['health_state_version']==40
assert cert['simulated_medical_departments']==30
assert cert['simulated_medical_staff']==90
assert cert['season_calibration']['regular_season_games']==1230
assert cert['season_calibration']['max_player_regular_season_gp']==82
# Guard the source/simulation boundary in docs.
doc=(ROOT/'docs/HEALTH_PERFORMANCE_V40.md').read_text().lower()
for phrase in ['fictional nba courtside','not medical advice','not a claim']:
    assert phrase in doc,phrase
print('PASS v0.40 health static certification')
