#!/usr/bin/env python3
# NBA Courtside v0.10.26 — 175-player Overall hierarchy audit.
# Overall Raw = 65% Core Impact + 35% average of best 3 category ratings.
# Core Impact = 30% Scoring + 15% Passing + 15% Rebounding + 12% 3PT + 11% Steals + 11% Blocks + 6% Dunking.
import json,re,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def norm(s):
    s=unicodedata.normalize('NFD',str(s)).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+',' ',s).strip()

def read_json(path): return json.loads((ROOT/path).read_text(encoding='utf-8'))

def load_audit(path):
    data=read_json(path); out={}
    for r in data['players']:
        key=(norm(r['name']),str(r.get('season','current')) if r.get('classic') else 'current')
        out[key]=int(r['rating'])
    return out

three=load_audit('three-point-audit-v0.10.20.json')
reb=load_audit('rebounding-audit-v0.10.21.json')
blk=load_audit('blocks-audit-v0.10.22.json')
stl=load_audit('steals-audit-v0.10.23.json')
ast=load_audit('assists-audit-v0.10.24.json')
dnk=load_audit('dunking-audit-v0.10.25.json')

scoring_js=(ROOT/'scoring-audit-v0.10.18.js').read_text(encoding='utf-8')
score_modern={}
for name,rating in re.findall(r'"([^"]+)":\{"ppg":[^}]*?"rating":(\d+)',scoring_js):
    score_modern[norm(name)]=int(rating)
score_modern[norm('Egor Demin')]=10

score_classic={
(norm('Alvin Williams'),'2003'):13,(norm('Vince Carter'),'2003'):21,(norm('Morris Peterson'),'2003'):14,(norm('Jerome Williams'),'2003'):10,(norm('Antonio Davis'),'2003'):14,
(norm('Tony Parker'),'2005'):17,(norm('Manu Ginóbili'),'2005'):16,(norm('Bruce Bowen'),'2005'):8,(norm('Tim Duncan'),'2005'):20,(norm('Rasho Nesterović'),'2005'):6,
(norm('Ron Harper'),'1998'):9,(norm('Michael Jordan'),'1998'):29,(norm('Scottie Pippen'),'1998'):19,(norm('Dennis Rodman'),'1998'):5,(norm('Luc Longley'),'1998'):11,
(norm('Derek Fisher'),'2002'):11,(norm('Kobe Bryant'),'2002'):25,(norm('Rick Fox'),'2002'):13,(norm('Robert Horry'),'2002'):7,(norm("Shaquille O'Neal"),'2002'):27,
(norm('Kenny Smith'),'1995'):10,(norm('Clyde Drexler'),'1995'):21,(norm('Carl Herrera'),'1995'):7,(norm('Robert Horry'),'1995'):10,(norm('Hakeem Olajuwon'),'1995'):28
}

foundation=(ROOT/'foundation-v0.9.0.js').read_text(encoding='utf-8')
modern=[]
for name,pos in re.findall(r"\['([^']*(?:\\'[^']*)*)','(PG|SG|SF|PF|C)',\[",foundation):
    name=name.replace("\\'", "'")
    if not any(x['name']==name for x in modern): modern.append({'name':name,'position':pos,'classic':False,'season':'current'})
if len(modern)!=150: raise SystemExit(f'Expected 150 modern, got {len(modern)}')

classic_src=(ROOT/'classic-teams-v0.9.30.js').read_text(encoding='utf-8')
classic=[]
for season,body in re.findall(r"season:'(\d+)'[\s\S]*?rows:\[([\s\S]*?)\]\s*\}",classic_src):
    for name,pos in re.findall(r"\[['\"]([^'\"]+)['\"],'(PG|SG|SF|PF|C)'",body):
        classic.append({'name':name,'position':pos,'classic':True,'season':season})
if not any(x['name']=="Shaquille O'Neal" for x in classic): classic.append({'name':"Shaquille O'Neal",'position':'C','classic':True,'season':'2002'})
if len(classic)!=25: raise SystemExit(f'Expected 25 classic, got {len(classic)}')

weights={'scoring':.30,'passing':.15,'rebounding':.15,'three':.12,'steals':.11,'blocks':.11,'dunks':.06}
rows=[]; missing=[]
for p in modern+classic:
    key=(norm(p['name']),p['season'] if p['classic'] else 'current')
    scoring=score_classic.get(key) if p['classic'] else score_modern.get(key[0])
    vals={'scoring':scoring,'passing':ast.get(key),'rebounding':reb.get(key),'three':three.get(key),'steals':stl.get(key),'blocks':blk.get(key),'dunks':dnk.get(key)}
    absent=[k for k,v in vals.items() if v is None]
    if absent: missing.append((p['name'],p['season'],absent)); continue
    core=sum(vals[k]*weights[k] for k in weights)
    best3=sorted(vals.values(),reverse=True)[:3]
    star=sum(best3)/3
    raw=.65*core+.35*star
    rows.append({**p,'stats':vals,'core':round(core,3),'starImpact':round(star,3),'raw':round(raw,3)})
if missing or len(rows)!=175: raise SystemExit(f'Expected 175 complete rows, got {len(rows)} missing={missing}')

curve=[(30,3),(29,7),(28,10),(27,12),(26,14),(25,16),(24,17),(23,17),(22,16),(21,14),(20,12),(19,10),(18,8),(17,6),(16,5),(15,4),(14,3),(13,1)]
slots=[]
for rating,count in curve: slots += [rating]*count
assert len(slots)==175
rows.sort(key=lambda x:(-x['raw'],-x['stats']['scoring'],-x['starImpact'],x['name'],x['season']))
for i,x in enumerate(rows): x['rank']=i+1; x['overall']=slots[i]

distribution=[]
for rating,count in curve: distribution.append({'overall':rating,'players':count,'percent':round(count/175*100,1)})
result={'status':'APPROVED_FOR_GAMEPLAY','formula':{'coreWeights':weights,'overallRaw':'0.65 * Core Impact + 0.35 * average(best 3 category ratings)'},'curve':distribution,'count':175,'players':rows}
(ROOT/'overall-audit-v0.10.26.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

runtime_rows=[{'name':r['name'],'season':r['season'],'classic':r['classic'],'overall':r['overall']} for r in rows]
js_rows=json.dumps(runtime_rows,ensure_ascii=False,separators=(',',':'))
js=f'''/* NBA Courtside v0.10.26 — approved 175-player Overall hierarchy runtime. */
(()=>{{
if(window.__courtsideOverallRatingsV01026)return;
window.__courtsideOverallRatingsV01026=true;
const rows={js_rows};
const norm=s=>String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/gi,' ').trim().toLowerCase();
const modern=new Map(),classic=new Map();
rows.forEach(r=>{{const k=norm(r.name)+(r.classic?'|'+r.season:'');(r.classic?classic:modern).set(k,Number(r.overall));}});
const previous=window.courtsideOverall;
const get=p=>{{
  if(!p)return null;
  const isClassic=!!p.classicTeam;
  const k=norm(p.name)+(isClassic?'|'+String(p.season||''):'');
  const v=(isClassic?classic:modern).get(k);
  return Number.isFinite(v)?v:null;
}};
window.courtsideOverall=function(p){{const v=get(p);return v??(typeof previous==='function'?previous(p):0);}};
let applied=0;
try{{(players||[]).forEach(p=>{{const v=get(p);if(v!=null){{p.overall=v;applied++;}}}});}}catch{{}}
window.COURTSIDE_OVERALL_RATINGS_APPLIED=applied;
window.COURTSIDE_OVERALL_RATINGS_COUNT=rows.length;
}})();
'''
(ROOT/'overall-ratings-v0.10.26.js').write_text(js,encoding='utf-8')
print(json.dumps({'count':175,'top30':rows[:30],'distribution':distribution,'runtime':'overall-ratings-v0.10.26.js'},ensure_ascii=False,indent=2))
