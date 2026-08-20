# Custom card art

`tools/card-art-studio.html` exports final cropped WebP artwork here by convention.

- Exact card art: `assets/cards/art/custom/<card-id>.webp`
- Optional wrestler-wide temporary defaults: `assets/cards/art/custom/superstars/<superstar-id>.webp`

The Card Art Studio can update `js/data/card-art-overrides.js` automatically when a supported desktop browser is connected to the project folder. On browsers without project-folder writing, export the WebP and the generated manifest, then place/replace those files in the paths shown by the tool.
