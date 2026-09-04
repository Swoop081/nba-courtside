from __future__ import annotations
import html
import re
import sys
from pathlib import Path
from urllib.parse import quote, urljoin
from urllib.request import Request, urlopen

BASE='https://uniqrenders.com'
NBA_HEADSHOT='https://cdn.nba.com/headshots/nba/latest/1040x760/{pid}.png'
OUT=Path('assets/player-art')
OUT.mkdir(parents=True,exist_ok=True)

# NBA Tip-Off 27: one current representative per NBA team.
# Each row stores display name, current team and NBA player id. We prefer a verified
# action/cutout render. If one is not yet available, the official transparent NBA
# player PNG is cached so no card is ever left as ART PENDING.
PLAYERS={
    'derrick-white':('Derrick White','Boston Celtics','1628401'),
    'michael-porter-jr':('Michael Porter Jr','Brooklyn Nets','1629008'),
    'josh-hart':('Josh Hart','New York Knicks','1628404'),
    'vj-edgecombe':('VJ Edgecombe','Philadelphia 76ers','1642845'),
    'jakobe-walter':("Ja'Kobe Walter",'Toronto Raptors','1642266'),
    'josh-giddey':('Josh Giddey','Chicago Bulls','1630581'),
    'jarrett-allen':('Jarrett Allen','Cleveland Cavaliers','1628386'),
    'cade-cunningham':('Cade Cunningham','Detroit Pistons','1630595'),
    'obi-toppin':('Obi Toppin','Indiana Pacers','1630167'),
    'kyle-kuzma':('Kyle Kuzma','Milwaukee Bucks','1628398'),
    'jalen-johnson':('Jalen Johnson','Atlanta Hawks','1630552'),
    'kon-knueppel':('Kon Knueppel','Charlotte Hornets','1642852'),
    'bam-adebayo':('Bam Adebayo','Miami Heat','1628389'),
    'jalen-suggs':('Jalen Suggs','Orlando Magic','1630591'),
    'bub-carrington':('Bub Carrington','Washington Wizards','1642267'),
    'nikola-jokic':('Nikola Jokic','Denver Nuggets','203999'),
    'rudy-gobert':('Rudy Gobert','Minnesota Timberwolves','203497'),
    'shai-gilgeous-alexander':('Shai Gilgeous-Alexander','Oklahoma City Thunder','1628983'),
    'scoot-henderson':('Scoot Henderson','Portland Trail Blazers','1630703'),
    'keyonte-george':('Keyonte George','Utah Jazz','1641718'),
    'brandin-podziemski':('Brandin Podziemski','Golden State Warriors','1641764'),
    'brook-lopez':('Brook Lopez','LA Clippers','201572'),
    'luka-doncic':('Luka Doncic','Los Angeles Lakers','1629029'),
    'dillon-brooks':('Dillon Brooks','Phoenix Suns','1628415'),
    'zach-lavine':('Zach LaVine','Sacramento Kings','203897'),
    'cooper-flagg':('Cooper Flagg','Dallas Mavericks','1642843'),
    'reed-sheppard':('Reed Sheppard','Houston Rockets','1642263'),
    'gg-jackson':('GG Jackson','Memphis Grizzlies','1641713'),
    'jeremiah-fears':('Jeremiah Fears','New Orleans Pelicans','1642847'),
    'victor-wembanyama':('Victor Wembanyama','San Antonio Spurs','1641705'),
}

# Manually verified high-resolution cutouts. Current-team renders are preferred where
# available; otherwise a high-quality player render is used until a newer cutout exists.
VERIFIED={
    'derrick-white':7313,
    'josh-hart':6447,
    'josh-giddey':7538,
    'jarrett-allen':2381,
    'cade-cunningham':8123,
    'obi-toppin':7930,
    'kyle-kuzma':8242,
    'bam-adebayo':7410,
    'nikola-jokic':357,
    'rudy-gobert':100,
    'shai-gilgeous-alexander':6465,
    'brook-lopez':8217,
    'luka-doncic':8434,
    'dillon-brooks':7294,
    'victor-wembanyama':9358,
}

def get(url:str)->tuple[bytes,str]:
    req=Request(url,headers={'User-Agent':'Mozilla/5.0 NBA-Courtside-private-prototype'})
    with urlopen(req,timeout=30) as r:
        return r.read(),r.headers.get('content-type','')

def clean(s:str)->str:
    return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

def discover_render_id(name:str,team:str)->int:
    search=f'{BASE}/searchbyname/{quote(name)}'
    raw,_=get(search)
    text=raw.decode('utf-8','ignore')
    links=[]
    for href in re.findall(r'href=[\"\']([^\"\']*?/athletes/basketball/[^\"\']+)[\"\']',text,re.I):
        url=urljoin(search,html.unescape(href))
        m=re.search(r'-(\d+)(?:\?.*)?$',url)
        if m: links.append((url,int(m.group(1))))
    if not links:
        raise RuntimeError('no player render results')
    team_tokens=[t for t in clean(team).split('-') if len(t)>3]
    links.sort(key=lambda item:(sum(tok in item[0].lower() for tok in team_tokens),item[1]),reverse=True)
    return links[0][1]

def discover_asset(render_id:int)->str:
    page=f'{BASE}/download/transparent/{render_id}'
    raw,_=get(page)
    text=raw.decode('utf-8','ignore')
    candidates=[]
    for attr in re.findall(r'(?:src|href)=[\"\']([^\"\']+)[\"\']',text,re.I):
        u=urljoin(page,html.unescape(attr)); low=u.lower()
        if any(low.endswith(ext) or ext+'?' in low for ext in ('.png','.webp')): candidates.append(u)
    for attr in re.findall(r'data-[\w-]+=[\"\']([^\"\']+)[\"\']',text,re.I):
        u=urljoin(page,html.unescape(attr)); low=u.lower()
        if '.png' in low or '.webp' in low: candidates.append(u)
    candidates=sorted(set(candidates),key=lambda u:(str(render_id) not in u,'preview' in u.lower(),len(u)))
    if not candidates: raise RuntimeError(f'no transparent image URL for render {render_id}')
    return candidates[0]

def write_asset(slug:str,url:str,label:str)->bool:
    data,ctype=get(url)
    if len(data)<12000: raise RuntimeError(f'asset too small ({len(data)} bytes)')
    ext='.webp' if 'webp' in ctype.lower() or url.lower().split('?')[0].endswith('.webp') else '.png'
    target=OUT/f'{slug}{ext}'
    for old in (OUT/f'{slug}.png',OUT/f'{slug}.webp'):
        if old!=target and old.exists(): old.unlink()
    target.write_bytes(data)
    print(f'cached {slug} [{label}] -> {target} ({len(data)} bytes)')
    return True

def save(slug:str,name:str,team:str,pid:str)->bool:
    try:
        rid=VERIFIED.get(slug)
        if rid:
            return write_asset(slug,discover_asset(rid),f'render #{rid}')
        try:
            rid=discover_render_id(name,team)
            return write_asset(slug,discover_asset(rid),f'discovered render #{rid}')
        except Exception as render_error:
            print(f'INFO {slug}: render unavailable ({render_error}); using official NBA transparent PNG',file=sys.stderr)
            return write_asset(slug,NBA_HEADSHOT.format(pid=pid),'NBA transparent')
    except Exception as e:
        print(f'WARNING {slug}: {e}',file=sys.stderr)
        return False

ok=0
for slug,(name,team,pid) in PLAYERS.items():
    ok+=int(save(slug,name,team,pid))
print(f'Cached {ok}/{len(PLAYERS)} Tip-Off 27 transparent player assets')
