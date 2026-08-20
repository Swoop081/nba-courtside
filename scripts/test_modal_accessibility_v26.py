#!/usr/bin/env python3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
js=(root/'app.js').read_text(encoding='utf-8')
checks={
 'closed dialog aria-hidden':'aria-hidden="true" inert' in html,
 'focusable collector':'function sheetFocusable()' in js,
 'focus synchronization':'function syncSheetAccessibility()' in js,
 'remove inert on open':"s.removeAttribute('inert')" in js,
 'restore inert on close':"s.setAttribute('inert','')" in js,
 'restore invoking focus':'lastSheetFocus.focus()' in js,
 'tab containment':"e.key!=='Tab'" in js and 'e.shiftKey' in js,
 'escape retained':"e.key==='Escape'" in js,
}
failed=[k for k,v in checks.items() if not v]
if failed:
    print('FAIL'); [print(' -',x) for x in failed]; raise SystemExit(1)
print('PASS — v0.26 modal focus/inert accessibility audit')
