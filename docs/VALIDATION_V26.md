# NBA Courtside — Validation v0.26

Release gate for v0.26:

1. Presentation/source certification JSON and browser wrapper agree on v0.26.
2. Device-layout static audit verifies dynamic viewport, all-edge safe areas, compact-phone breakpoints and Game Day/Exhibition reflow rules.
3. Modal accessibility audit verifies inert/aria-hidden closed state, focus containment and focus restoration hooks.
4. JavaScript syntax passes for shipped Franchise/Game Day/Exhibition scripts.
5. v0.25 save-migration, accessibility and 10-season durability gates remain green.
6. Retained gameplay gates remain green: Bird rights, future-pick resolver, v0.24 CBA long-tail, full offseason bridge, regular Game Day, Cup Game Day, postseason and official schedule.

v0.26 intentionally does not claim that automated layout checks replace a physical iPhone Safari/Chrome smoke test.
