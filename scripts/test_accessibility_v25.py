#!/usr/bin/env python3
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
errors=[]
def need(path, needle, label=None):
    text=(root/path).read_text(encoding='utf-8')
    if needle not in text: errors.append(label or f'{path}: missing {needle}')
def rx(path, pattern, label):
    text=(root/path).read_text(encoding='utf-8')
    if not re.search(pattern,text,re.I|re.S): errors.append(label)
for page in ['index.html','gameday.html','exhibition.html']:
    need(page,'lang="en"',f'{page}: lang')
    need(page,'name="viewport"',f'{page}: viewport')
    need(page,'class="skipLink"',f'{page}: skip link')
    need(page,':focus-visible',f'{page}: focus-visible')
    need(page,'prefers-reduced-motion',f'{page}: reduced motion')
    need(page,'prefers-contrast:more',f'{page}: increased contrast')
    need(page,'touch-action:manipulation',f'{page}: touch action')
need('index.html','aria-label="Primary"','index: nav label')
need('index.html','role="dialog"','index: sheet dialog semantics')
need('app.js',"'aria-live','polite'",'app: polite live region')
need('app.js','aria-current','app: active navigation current state')
need('app.js',"e.key==='Escape'",'app: Escape closes modal/sheet')
need('app.js','eager?\'eager\':\'lazy\'','app: lazy player images')
need('app.js','decoding="async"','app: async image decoding')
need('gameday.js','loading="lazy"','gameday: lazy player images')
need('exhibition.js','loading="lazy"','exhibition: lazy player images')
# 24 CSS px is the WCAG 2.2 AA minimum target-size floor; key primary controls exceed it.
rx('index.html',r'\.navBtn\s*\{[^}]*min-height\s*:\s*46px','index: bottom nav target height')
rx('index.html',r'\.close\s*\{[^}]*min-width\s*:\s*44px[^}]*min-height\s*:\s*44px','index: close target size')
if errors:
    print('FAIL')
    for e in errors: print(' -',e)
    raise SystemExit(1)
print('PASS — v0.25 accessibility/static interaction audit')
