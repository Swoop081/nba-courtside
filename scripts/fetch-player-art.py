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

# NBA Tip-Off 27: one current representative per NBA team.
# Prefer a current-team render when one exists; otherwise fall back to the best
# available transparent render of that player rather than using NBA headshots.
PLAYERS={
    'derrick-white':('Derrick White','Boston Celtics'),
    'michael-porter-jr':('Michael Porter Jr','Brooklyn Nets'),
    'josh-hart':('Josh Hart','New York Knicks'),
    'vj-edgecombe':('VJ Edgecombe','Philadelphia 76ers'),
    'jakobe-walter':("Ja'Kobe Walter",'Toronto Raptors'),
    'josh-giddey':('Josh Giddey','Chicago Bulls'),
    'jarrett-allen':('Jarrett Allen','Cleveland Cavaliers'),
    'cade-cunningham':('Cade Cunningham','Detroit Pistons'),
    'obi-toppin':('Obi Toppin','Indiana Pacers'),
    'kyle-kuzma':('Kyle Kuzma','Milwaukee Bucks'),
    'jalen-johnson':('Jalen Johnson','Atlanta Hawks'),
    'kon-knueppel':('Kon Knueppel','Charlotte Hornets'),
    'bam-adebayo':('Bam Adebayo','Miami Heat'),
    'jalen-suggs':('Jalen Suggs','Orlando Magic'),
    'bub-carrington':('Bub Carrington','Washington Wizards'),
    'nikola-jokic':('Nikola Jokic','Denver Nuggets'),
    'rudy-gobert':('Rudy Gobert','Minnesota Timberwolves'),
    'shai-gilgeous-alexander':('Shai Gilgeous-Alexander','Oklahoma City Thunder'),
    'scoot-henderson':('Scoot Henderson','Portland Trail Blazers'),
    'keyonte-george':('Keyonte George','Utah Jazz'),
    'brandin-podziemski':('Brandin Podziemski','Golden State Warriors'),
    'brook-lopez':('Brook Lopez','LA Clippers'),
    'luka-doncic':('Luka Doncic','Los Angeles Lakers'),
    'dillon-brooks':('Dillon Brooks','Phoenix Suns'),
    'zach-lavine':('Zach LaVine','Sacramento Kings'),
    'cooper-flagg':('Cooper Flagg','Dallas Mavericks'),
    'reed-sheppard':('Reed Sheppard','Houston Rockets'),
    'gg-jackson':('GG Jackson','Memphis Grizzlies'),
    'jeremiah-fears':('Jeremiah Fears','New Orleans Pelicans'),
    'victor-wembanyama':('Victor Wembanyama','San Antonio Spurs'),
}

# Verified render IDs are preferred where we already have them.
VERIFIED={
    'derrick-white':7313,
    'josh-hart':6447,
    'jarrett-allen':2381,
    'cade-cunningham':8123,
    'obi-toppin':7930,
    'kyle-kuzma':8242,
    'nikola-jokic':357,
    'shai-gilgeous-alexander':6465,
    'luka-doncic':8434,
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
    for href in re.findall(r'href=[\"\']([^\"\']+/athletes/basketball/[^\"\']+)[\"\']',text,re.I):
        url=urljoin(search,html.unescape(href))
        m=re.search(r'-(\d+)(?:\?.*)?$',url)
        if m: links.append((url,int(m.group(1))))
    if not links:
        raise RuntimeError('no player render results')
    team_tokens=[t for t in clean(team).split('-') if len(t)>3]
    def score(item):
        u=item[0].lower()
        return (sum(tok in u for tok in team_tokens), item[1])
    links.sort(key=score,reverse=True)
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

def save(slug:str,name:str,team:str)->bool:
    try:
        rid=VERIFIED.get(slug) or discover_render_id(name,team)
        url=discover_asset(rid)
        data,ctype=get(url)
        if len(data)<20000: raise RuntimeError(f'asset too small ({len(data)} bytes)')
        ext='.webp' if 'webp' in ctype.lower() or url.lower().split('?')[0].endswith('.webp') else '.png'
        target=OUT/f'{slug}{ext}'
        for old in (OUT/f'{slug}.png',OUT/f'{slug}.webp'):
            if old!=target and old.exists(): old.unlink()
        target.write_bytes(data)
        print(f'cached {slug} #{rid} -> {target} ({len(data)} bytes)')
        return True
    except Exception as e:
        print(f'WARNING {slug}: {e}',file=sys.stderr)
        return False

ok=0
for slug,(name,team) in PLAYERS.items():
    ok+=int(save(slug,name,team))
print(f'Cached {ok}/{len(PLAYERS)} Tip-Off 27 player renders')
