---
name: brand-film
description: Make a logo-led brand identity film in Remotion for any brand, in the language of OpenAI's "Refreshed" film. A white canvas with ink, the logo's own dot (or one signature element) leading every move, the mark drawn from its own construction lines and measurements, the logo zooming out into the brand's real website, the wordmark spelled letter by letter on the music, real product UI driven by a real mouse with measured dimensions, a few alternate "looks" of the mark, and an end card with the brand's own published line. About 60 s, 4K, cut to a music bed's beat grid. Use when asked for a brand film, identity film, logo film, brand reel, "a film like Refreshed" or "like the ReUI film", for ReUI or any other brand, or to make a new version for a release, a new product set or a new track.
metadata:
  author: faizal
---

# Brand film

A 60 s film about one brand's identity: the mark, the site, the product, the name. Approved first film: ReUI
"Refreshed". `template/` is its code: a working reference
implementation to copy and adapt, not a generic library.

- `brands/<brand>.md`: everything brand-specific (palette, type, text sources, logo, product, music, rules,
  preferences). Read it first. For a new brand, write one from `brands/_new-brand.md`.
- `references/example-reui-refreshed.md`: the approved film's shot map with frames and hits. It is the shape
  to adapt.
- `references/reui-frames/`: the visual template. 38 stills of the approved film plus `sheet.jpg`. Look at
  the sheet before designing, and compare your stills against the matching frame when you check.
- `references/review.md`: weak-spot checklist and the subagent review brief.

## Prerequisites (check first, install what is missing)

Run these checks before the first build on a machine. Install only what fails, and tell the user what you
installed.

| Need | Check | Install |
|---|---|---|
| Node 20.19+ | `node -v` | `brew install node` (or nvm) |
| Remotion and its renderer | `npx remotion versions` in the project | `npm i` in the project (versions are pinned in `template/package.json`); in an existing project: `npm i remotion @remotion/cli @remotion/renderer @remotion/fonts @remotion/media` at one shared version |
| Chrome for Remotion | `npx remotion browser ensure` | same command; it downloads Chrome Headless Shell |
| ffmpeg / ffprobe (final file check) | `ffprobe -version` | `brew install ffmpeg` |
| Python 3 + Pillow (contact sheets) | `python3 -c "import PIL"` | `pip3 install pillow` |
| librosa + numpy (`beat.py`, new tracks only) | `python3 -c "import librosa"` | `pip3 install librosa numpy` |
| Playwright + Chromium (captures) | `node -e "require('playwright')"` in the project | `npm i -D playwright && npx playwright install chromium` |
| A music bed | a file in `public/audio/` | from the source the brand profile names; never invent one |

Remotion's license: free for individuals and small teams; companies above its size limit need a company license
(https://remotion.dev/license). Mention it once when the brand is a company.

## The language (same for every brand)

- One canvas and one ink from the brand's own neutrals. Colour only where the brand truly has it, or inside its
  real UI. No glass, gold, 3D or glow unless the brand is made of them.
- **One element leads.** It flies on a thin line, carries the cuts and lands in the final logo. Every shot hands it
  to the next at the same screen position. In ReUI's mark this is the dot. Find this element in a new mark: a
  dot, a corner, a stroke end.
- **Every line is real.** Construction guides come from the logo's own paths. Every number on screen is measured
  (logo units, DOM boxes in px). Nothing is decoration.
- The brand's own typeface (the one its site uses). A mono only for measurements.
- No logo or text over product UI. Labels sit outside the UI, in clear space.
- Long still holds are part of it. Calm is fine, dead is not.

## Story shape (adapt, don't copy blindly)

| Part | Beats (of 60) | Job |
|---|---|---|
| Line | 0-8 | The lead element becomes a caret and types the brand's own line |
| Mark | 8-20 | The element opens into the mark; the mark is drawn from its construction |
| Site | 20-32 | The logo zooms out and is the site's own nav logo, then a quick tour; a real site interaction on a hit |
| Name | 32-36 | The wordmark, one letter per beat |
| Product | 36-49 | 3-4 real product views, real drags, measured dims, hard cuts, about 3 beats each |
| Looks | 49-52 | The mark drawn differently each beat; the lead element never moves |
| End | 52-60 | Logo lands, letters settle on the last hit, then the brand's line and domain |

Give time to what the brand is proud of. Trim the looks before the construction or the product.

## Hard rules

- **Brand text is copied, never written.** Taglines, lines and names come verbatim from the brand's own site or
  docs. Never invent, combine or shorten.
- Demo data inside product UI is never content: no featuring its names, numbers or people.
- Real UI only, captured with a real mouse. Never mock the product.
- **Audio:**
  - Music comes from the source the brand profile names, never a new generation unless the profile allows it.
  - Hits are a few impacts and slams on the sync points.
  - No click or typing SFX unless the profile asks for them.
- **Never render or export unless asked that turn.** After an edit, hand over the Studio preview and don't offer
  a render. When asked: 4K, same file name, overwrite.
- Trial ideas go in a duplicate composition. Prove the approved one is unchanged by comparing stills. "Fix all" or
  "remove X" goes straight to main.
- The user points at frames ("remove 3150"). Render that frame and name the shot before changing anything.

## Timing system (easy to break)

All in `src/Refreshed.tsx`:

- **Clock.**
  - `BPM` of the bed. `SLOW = 2`: the story runs at half the music. Local `useCurrentFrame()` returns slowed frames.
  - `T` = one story beat. `b(n)` = beat n, **snapped to half beats**: `b(0.25)` is not a quarter, use `T / 4`.
  - `real(n) = b(n) * SLOW` = the film frame of beat n.
- **`ramp(f, from, to, ease)`** is the only way to animate. It snaps from/to to the `T / 8` grid and returns 1
  when they snap together. Never pass 0-1 fractions; use `clamp01((x - a) / (b - a))`.
- **Shots.** `SHOTS = [[fromBeat, toBeat, Component]]`. Move a boundary together with every beat constant inside
  that shot.
- **Sound.**
  - `HITS` = sfx on beats.
  - `BED_FROM` = start offset into the track. `BED_VOL`, with a `volume` callback for ducks.
- **Kick.** `KickBump` pulses the frame per kick until the looks. `STILL` = beat ranges with no pulse.
- **Sync points** are the spine: each big change sits on a hit. Moving one means re-pinning the shots around it.
- **New track:** `python3 scripts/beat.py <track.wav>` gives tempo, first-beat phase and the drop. Set `BPM` and
  `BED_FROM`, then put the sync points on its accents.

## Adapting the template to a brand

| Swap | Where |
|---|---|
| Mark paths (ring, inner shape, lead element), the shape's centreline and stroke, wordmark letters and positions, viewBox | `src/logo.tsx` (`RING_D`, `U_D`, `DOT`, `U_LINE`, `U_STROKE`, `LETTERS`, `LETTER_X`, `VB`, `uPoint`) |
| Palette, font, tracking | top of `src/Refreshed.tsx` (`INK`, `PAPER`, `LIGHT_INK`, `DIM`, `FONT`, `TRACK`) and `public/fonts` |
| The brand's line and domain | `LINE`, `DOMAIN` |
| Site captures | a capture script like `scripts/reui/site-object.mjs` writing `public/cap/site-object/` |
| Product views | capture scripts like `scripts/reui/live.mjs`, `dash.mjs`, `block-live.mjs`. Each writes one screenshot per mouse step plus measured boxes to `public/cap/live/<dir>/` and `meta.json`. Then edit the `NAMES_UI`/`BLOCK_UI` entries and the `dir` union in `WITH_UI` |
| Looks | `LOOKS`: 3-4 ways to draw the mark (as its path data, halftone, construction lines) |
| Music and hits | `public/audio/`, `BPM`, `BED_FROM`, `HITS` |

A mark with a different structure (no dot, no ring) needs its own `Construct`, `Opening` and `Final`. Keep the
idea: draw it from its real geometry, led by one element.

## Workflow

1. Read `brands/<brand>.md` (or write it). Measure the logo SVG and the site; collect the brand's verbatim lines.
2. **New film:**
   - `cp -R ~/.claude/skills/brand-film/template <project>` and `npm i`.
   - Put the bed in `public/audio/`.
   - Capture scripts load Playwright from the project folder (`npm i -D playwright`), or from the folder in
     `PLAYWRIGHT_FROM`.
3. **Capture** site and product with a real mouse. Back up `meta.json` before a recapture. Pick product views
   unlike each other and drag something real; never a hover tour.
4. **Edit** only what the brand changes (table above). Keep the helpers (`Flight`, `Wipe`, `Dim`, `Lead`, `Disc`,
   `Live`, `LiveRun`).
5. **Check.**
   - `npx tsc --noEmit`. Only `TS6192` on unused imports is acceptable.
   - From the project folder: `~/.claude/skills/brand-film/scripts/qa.sh <scratch>/q1 0.4 <frames...>`, then read
     `sheet.jpg`.
   - Sample every shot, both frames of each join, each sync frame and the ending.
   - Put your sheet next to `references/reui-frames/sheet.jpg`. Anything sparser, louder or more crowded than the
     template's matching shot is a finding.
   - Single stills can flicker; re-render one before fixing it.
6. **Review (always, before the first hand-over of a new cut):**
   - Spawn one subagent with the brief in `references/review.md`. It gets the code, not your conclusions.
   - It returns weak spots ranked, with frames and a "don't touch" list.
   - Check its top findings in the frames yourself and drop any the frames don't show.
   - Show the user the short ranked list and ask what to fix, unless they said "fix all".
   - Recheck the fixed frames. Never undo what the user liked (brand profile).
7. **Preview** in Remotion Studio (`http://localhost:<port>/Refreshed`). Hand over the preview, not a render.
8. **Render (only when asked):**
   `npx remotion render src/index.ts Refreshed out/<name>.mp4 --scale=2 --codec=h264 --crf=16 --pixel-format=yuv420p --overwrite --log=error`
   in the background. Then `ffprobe`: 3840x2160, 60 fps, frame count, audio stream.

## Close every turn with

What changed (by frame), what was not checked (motion and sound never show in stills), and whether the rendered
mp4 is stale.
