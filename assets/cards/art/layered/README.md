# Layered Card Front v1 art plates

Layered art plates live in type subfolders mirroring `assets/cards/art/custom/`.
A plate is not used merely because a file exists. After installing it, explicitly add the card id to `LAYERED_FRONT_IDS` in `js/data/card-fronts.js`.

This opt-in registry is intentional: all legacy flat fronts remain visually untouched until migrated one card at a time.
