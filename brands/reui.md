# ReUI profile

- **Site:** https://reui.io. Capture the hero light and dark; the nav's theme toggle is clicked on slam b(28).
  Capture script: `scripts/reui/site-object.mjs`. It hides the dated "Biggest drop" badge.
- **Text sources:** reui.io homepage and https://reui.io/llms.txt. Opening and end line, verbatim:
  "The agent-ready layer for shadcn/ui". Domain: `reui.io`. Check the site before reuse; it can change.
- **Logo:** ring `RING_D`, U `U_D`, the dot `DOT` (lead element), wordmark R E U I. All in `template/src/logo.tsx`.
- **Palette:** ink `#0a0a0a`, paper `#ffffff`, light ink `#fafafa`, dim `#737373` (reui.io's neutral scale).
  Neutrals only. No glass, gold or 3D.
- **Type:** Inter (`public/fonts/inter.woff2`), tracking `-0.025em`.
- **Product:**
  - Real components and blocks from reui.io, captured with a real mouse: `scripts/reui/live.mjs` (components),
    `dash.mjs` (dashboard-7), `block-live.mjs` (flow-1, event-calendar-1).
  - The Flow script clicks the Select tool first. Calendar drags "Design review", since "Focus block" is locked.
  - Viewer links go to `reui.io/blocks/<cat>/<group>/<slug>`, never `/preview/base/`.
  - Block content is demo data: never talk about it.
- **Music:** ElevenLabs marketplace only, never new generations. Film 1: Pixel Lattice, 116 BPM,
  `BED_FROM = 2980`, `BED_VOL = 0.62`.
- **SFX:** `impact` and `slam` only. No click, typing, servo, cartoon or stock sounds.
- **Output:** a project folder per film, composition `Refreshed`, `out/reui-refreshed.mp4` (overwrite, no
  archive).
- **Capture setup:** Playwright in the project folder, or `PLAYWRIGHT_FROM=<folder with playwright>`.
- **Liked / rejected:** see `references/example-reui-refreshed.md`.
