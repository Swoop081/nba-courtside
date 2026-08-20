#!/usr/bin/env python3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
errors=[]
def need(path,needle,label):
    if needle not in (root/path).read_text(encoding='utf-8'): errors.append(label)
for page in ['index.html','gameday.html','exhibition.html']:
    need(page,'100dvh',f'{page}: dynamic viewport')
    need(page,'env(safe-area-inset-left)',f'{page}: left safe area')
    need(page,'env(safe-area-inset-right)',f'{page}: right safe area')
    need(page,'@media(max-width:390px)',f'{page}: compact-phone breakpoint')
    need(page,'@media(orientation:landscape) and (max-height:520px)',f'{page}: short landscape breakpoint')
need('index.html','.offseasonSteps{display:flex;overflow-x:auto','index: offseason progress rail reflow')
need('index.html','.profileStats{grid-template-columns:repeat(2','index: player profile stat reflow')
need('index.html','.meetingActions{grid-template-columns:1fr}','index: meeting actions stack')
for page in ['gameday.html','exhibition.html']:
    need(page,'.scoreInner{grid-template-columns:1fr 78px 1fr}',f'{page}: compact scoreboard')
    need(page,'.gameControls{grid-template-columns:1fr 1fr}',f'{page}: compact controls')
    need(page,'.boxRow{grid-template-columns:minmax(105px,1fr)',f'{page}: compact box score')
if errors:
    print('FAIL'); [print(' -',e) for e in errors]; raise SystemExit(1)
print('PASS — v0.26 device-layout/static presentation audit')
