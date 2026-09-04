from __future__ import annotations
import html
import re
import sys
from pathlib import Path
from urllib.parse import quote, urljoin
from urllib.request import Request, urlopen

BASE='https://uniqrenders.com'
OUT=Path('assets/player-art')
OUT.mkdir(parents=True,exist_ok=True)

PLAYERS={
    'derrick-white':('Derrick White','Boston Celtics'),'michael-porter-jr':('Michael Porter Jr','Brooklyn Nets'),'josh-hart':('Josh Hart','New York Knicks'),'vj-edgecombe':('VJ Edgecombe','Philadelphia 76ers'),'jakobe-walter':("Ja'Kobe Walter",'Toronto Raptors'),'josh-giddey':('Josh Giddey','Chicago Bulls'),'jarrett-allen':('Jarrett Allen','Cleveland Cavaliers'),'cade-cunningham':('Cade Cunningham','Detroit Pistons'),'obi-toppin':('Obi Toppin','Indiana Pacers'),'kyle-kuzma':('Kyle Kuzma','Milwaukee Bucks'),'jalen-johnson':('Jalen Johnson','Atlanta Hawks'),'kon-knueppel':('Kon Knueppel','Charlotte Hornets'),'bam-adebayo':('Bam Adebayo','Miami Heat'),'jalen-suggs':('Jalen Suggs','Orlando Magic'),'bub-carrington':('Bub Carrington','Washington Wizards'),'nikola-jokic':('Nikola Jokic','Denver Nuggets'),'rudy-gobert':('Rudy Gobert','Minnesota Timberwolves'),'shai-gilgeous-alexander':('Shai Gilgeous-Alexander','Oklahoma City Thunder'),'scoot-henderson':('Scoot Henderson','Portland Trail Blazers'),'keyonte-george':('Keyonte George','Utah Jazz'),'brandin-podziemski':('Brandin Podziemski','Golden State Warriors'),'brook-lopez':('Brook Lopez','LA Clippers'),'luka-doncic':('Luka Doncic','Los Angeles Lakers'),'dillon-brooks':('Dillon Brooks','Phoenix Suns'),'zach-lavine':('Zach LaVine','Sacramento Kings'),'cooper-flagg':('Cooper Flagg','Dallas Mavericks'),'reed-sheppard':('Reed Sheppard','Houston Rockets'),'gg-jackson':('GG Jackson','Memphis Grizzlies'),'jeremiah-fears':('Jeremiah Fears','New Orleans Pelicans'),'victor-wembanyama':('Victor Wembanyama','San Antonio Spurs')}

# These cached files were visually rejected in physical-iPhone testing. Never let the
# automated search silently put them back. Wembanyama is served from a separately
# verified correct-player override in app.js until a proper tall Spurs render is approved.
QUARANTINED={'michael-porter-jr','bub-carrington','cooper-flagg','jalen-suggs','scoot-henderson','victor-wembanyama'}

VERIFIED={'derrick-white':589,'josh-hart':6447,'josh-giddey':7538,'jarrett-allen':2381,'cade-cunningham':7751,'obi-toppin':7930,'kyle-kuzma':7508,'bam-adebayo':7410,'nikola-jokic':357,'shai-gilgeous-alexander':6465,'keyonte-george':7389,'brook-lopez':8217,'luka-doncic':8434,'dillon-brooks':7294,'zach-lavine':7540}

def get(url:str)->tuple[bytes,str]:
    req=Request(url,headers={'User-Agent':'Mozilla/5.0 NBA-Courtside-private-prototype'})
    with urlopen(req,timeout=30) as r:return r.read(),r.headers.get('content-type','')

def clean(s:str)->str:return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def page_resolution(url:str):
    try:
        raw,_=get(url);text=raw.decode('utf-8','ignore');m=re.search(r'Resolution[^0-9]{0,80}(\d+)x(\d+)',text,re.I)
        return (int(m.group(1)),int(m.group(2))) if m else None
    except Exception:return None

def discover_render_id(name:str,team:str)->int:
    search=f'{BASE}/searchbyname/{quote(name)}';raw,_=get(search);text=raw.decode('utf-8','ignore');links=[]
    for href in re.findall(r'href=[\"\']([^\"\']+/athletes/basketball/[^\"\']+)[\"\']',text,re.I):
        url=urljoin(search,html.unescape(href));m=re.search(r'-(\d+)(?:\?.*)?$',url)
        if not m:continue
        rid=int(m.group(1));res=page_resolution(url)
        if not res:continue
        w,h=res;aspect=h/max(w,1)
        if aspect<1.45 or aspect>2.45 or h<1400:continue
        tokens=[t for t in clean(team).split('-') if len(t)>3];team_score=sum(t in url.lower() for t in tokens);links.append((team_score,h,rid))
    if not links:raise RuntimeError('no approved tall/action render candidate')
    links.sort(reverse=True);return links[0][2]

def discover_asset(rid:int)->str:
    page=f'{BASE}/download/transparent/{rid}';raw,_=get(page);text=raw.decode('utf-8','ignore');c=[]
    for attr in re.findall(r'(?:src|href)=[\"\']([^\"\']+)[\"\']',text,re.I):
        u=urljoin(page,html.unescape(attr));low=u.lower()
        if any(low.endswith(e) or e+'?' in low for e in ('.png','.webp')):c.append(u)
    c=sorted(set(c),key=lambda u:(str(rid) not in u,'preview' in u.lower(),len(u)))
    if not c:raise RuntimeError('no transparent asset')
    return c[0]

def clear_bad(slug):
    for old in (OUT/f'{slug}.png',OUT/f'{slug}.webp'):
        if old.exists():old.unlink();print('removed rejected render',old)

def save(slug,name,team):
    if slug in QUARANTINED:clear_bad(slug);return False
    try:
        rid=VERIFIED.get(slug) or discover_render_id(name,team);url=discover_asset(rid);data,ctype=get(url)
        if len(data)<20000:raise RuntimeError('asset too small')
        ext='.webp' if 'webp' in ctype.lower() or url.lower().split('?')[0].endswith('.webp') else '.png';target=OUT/f'{slug}{ext}'
        for old in (OUT/f'{slug}.png',OUT/f'{slug}.webp'):
            if old!=target and old.exists():old.unlink()
        target.write_bytes(data);print(f'cached {slug} #{rid} -> {target}');return True
    except Exception as e:
        clear_bad(slug);print(f'WARNING {slug}: {e}',file=sys.stderr);return False

ok=0
for slug,(name,team) in PLAYERS.items():ok+=int(save(slug,name,team))
print(f'Cached {ok}/{len(PLAYERS)} approved Tip-Off 27 renders; quarantined cards remain pending')
