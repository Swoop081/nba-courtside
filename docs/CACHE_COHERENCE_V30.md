# v0.30 — Ratings Cache-Coherence Hotfix

## Symptom
A physical iPhone Safari deployment could display the v0.29 main-menu badge while franchise player cards still showed v0.28 Overall ratings. Boston reproduced the failure exactly: Pritchard 84, Paul George 83, Tatum 80, Queta 83.

## Root cause
The HTML shell changed between releases but external runtime assets retained stable URLs such as `data/data.js` and `app.js`. GitHub Pages/Safari could therefore assemble a mixed release: current HTML plus cached v0.28 JavaScript/data.

## Fix
Franchise, Game Day and Exhibition now reference release-unique v0.30 runtime asset URLs. Page-to-page navigation also carries a v0.30 cache key. Canonical source filenames remain in the package for tooling/tests, while the browser executes the versioned copies.

## Save compatibility
No save migration is required. Existing `nbaCourtsideSaveV25` franchises continue normally. Ratings come from the current base player dataset unless a legitimate future-season development override exists.

## Certified Boston smoke values
- Payton Pritchard — 79
- Paul George — 79
- Jayson Tatum — 89
- Neemias Queta — 76
