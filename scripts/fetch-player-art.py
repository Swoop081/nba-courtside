from __future__ import annotations
import html
import os
import re
import sys
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen

BASE='https://uniqrenders.com'
OUT=Path('assets/player-art')
OUT.mkdir(parents=True,exist_ok=True)

# Private-prototype transparent render sources. Cached locally into the Pages repo.
# IDs are used where a suitable render has been verified; unresolved/new players are
# intentionally left for the next sourcing pass rather than silently using headshots.
RENDERS={
    'derrick-white':7313,
    'josh-hart':6447,
    'josh-giddey':7538,
    'jarrett-allen':2381,
    'cade-cunningham':8123,
    'obi-toppin':7930,
    'kyle-kuzma':8242,
    'bam-adebayo':7410,
    'nikola-jokic':357,
    'shai-gilgeous-alexander':6465,
    'luka-doncic':8434,
    'victor-wembanyama':9358,
}

def get(url:str)->tuple[bytes,str]:
    req=Request(url,headers={'User-Agent':'Mozilla/5.0 NBA-Courtside-private-prototype'})
    with urlopen(req,timeout=30) as r:
        return r.read(),r.headers.get('content-type','')

def discover(render_id:int)->str:
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
    if not candidates: raise RuntimeError(f'No transparent image URL found for render {render_id}')
    return candidates[0]

def save(slug:str,render_id:int)->bool:
    try:
        url=discover(render_id); data,ctype=get(url)
        if len(data)<20000: raise RuntimeError(f'asset too small ({len(data)} bytes)')
        ext='.webp' if 'webp' in ctype.lower() or url.lower().split('?')[0].endswith('.webp') else '.png'
        target=OUT/f'{slug}{ext}'
        for old in (OUT/f'{slug}.png',OUT/f'{slug}.webp'):
            if old!=target and old.exists(): old.unlink()
        target.write_bytes(data)
        print(f'cached {slug}: {url} -> {target} ({len(data)} bytes)')
        return True
    except Exception as e:
        print(f'WARNING {slug}: {e}',file=sys.stderr); return False

ok=0
for slug,rid in RENDERS.items(): ok+=int(save(slug,rid))
print(f'Cached {ok}/{len(RENDERS)} verified Tip-Off 27 player renders')
