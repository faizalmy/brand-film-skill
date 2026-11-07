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
- `<skill>` below means this skill's folder: `~/.claude/skills/brand-film` for a global install, or
  `<project>/.claude/skills/brand-film` for a per-project one.

## Prerequisites (check first, install what is missing)

Run these checks before the first build on a machine. Install only what fails, and tell the user what you
installed.

| Need | Check | Install |
|---|---|---|
| Node 20.19+ | `node -v` | `brew install node` (or nvm) |
| Remotion and its renderer | `npx remotion versions` in the project | `npm i` in the project (versions are pinned in `template/package.json`); in an existing project: `npm i remotion @remotion/cli @remotion/renderer @remotion/fonts @remotion/media` at one shared version |
| Chrome for Remotion | `npx remotion browser ensure` | same command; it downloads Chrome Headless Shell |
| ffmpeg / ffprobe (final file check) | `ffprobe -version` | `brew install ffmpeg` |
| bash (QA script) | `bash --version` | ships with macOS and Linux |
| Python 3 + Pillow (contact sheets) | `python3 -c "import PIL"` | `pip3 install pillow` |
| librosa + numpy (`beat.py`, new tracks only) | `python3 -c "import librosa"` | `pip3 install librosa numpy` |
| Playwright + Chromium (captures) | `node -e "require('playwright')"` in the project | `npm i -D playwright && npx playwright install chromium` |
| A music bed | `public/audio/bed.wav` | from the source the brand profile names; never invent one |
| Captures | `public/cap/site-object/*.jpg`, `public/cap/live/<dir>/*.jpg` | run the capture scripts (Workflow 3). The template ships no screenshots, so it does not play before this |

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

## Scenes (pick, reorder or remove)

Each scene is its own file in `template/src/scenes/`, registered by name in `scenes/index.ts` with the colour of its
first frame. The film is the `SCENES` list in `template/src/Refreshed.tsx`, which picks scenes by name. To drop a
scene, delete its line; to reorder, move the line. Nothing else needs to change: start beats, total length, hits,
holds, kick, music ducks and each scene's closing wipe (to the next scene's first colour) follow the list.

| Scene | File | Beats | Job | Frames in `references/reui-frames/` |
|---|---|---|---|---|
| `line` | `scenes/line.tsx` | 8 | The lead dot flies in, becomes a caret, types the brand's line and domain | f0060-f0496 |
| `ring` | `scenes/ring.tsx` | 3 | The dot opens to a disc, empties to a line, squares up into the mark's ring | f0560 f0682 |
| `construct` | `scenes/construct.tsx` | 9 | The mark drawn from its own paths: rulers, circles, measured dims, zoom and pan | f0760-f1100 |
| `site` | `scenes/site.tsx` | 12 | The logo becomes the site's nav logo, a tilted tour, the dark toggle on beat 8 | f1241-f1850 |
| `letters` | `scenes/letters.tsx` | 4 | The wordmark, one letter per beat, construction beside each | f1986-f2120 |
| `blocks` | `scenes/blocks.tsx` | 13 | Real product views, real drags, measured dims, hard cuts | f2234-f2950 |
| `looks` | `scenes/looks.tsx` | 3 | The mark drawn three other ways; the dot never moves | f3042-f3166 |
| `final` | `scenes/final.tsx` | 8 | The dot draws the mark, logo lands, name settles on the slam, the line | f3228-f3700 |

- Scene entry fields, all in beats from the scene's own start: `beats`, `hits` (`[sound, beat, volume]`), `still`
  (no kick pulse), `kick` (pulse on the music's kick), `duck` (music volume under the scene).
- Changing a scene's `beats` also needs its inner timing changed (the beat constants inside its file).
- A new scene: add its file, register it in `scenes/index.ts` with its first colour, read `useNext()` for its exit.
- **Dot handoffs.** Each scene starts its dot where the scene before it left it. After a removal or a reorder,
  render both frames of every new join.
  - A jump there is a hard cut. Accept it, or set the next scene's start position. `blocks` starts from the last
    letter (`contourPt`); `looks` and `final` use `DOT_AT` and `FINAL_DOT` in `lib.tsx`.
  - `site` ends by diving into the R of the nav wordmark, which `letters` draws next. With another scene after it,
    shorten the dive (`L_IN`, `L_LAND` in `scenes/site.tsx`) or the dive lands on a blank frame.
- Give time to what the brand is proud of. Trim `looks` before `construct` or `blocks`.
- Shared code lives in `src/lib.tsx`: clock, palette, helpers, and the logo and letter geometry.
  Scene files import only from it and from `logo.tsx`.

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

Clock and helpers in `src/lib.tsx`; scene timing in the `SCENES` list in `src/Refreshed.tsx`:

- **Clock.**
  - `BPM` of the bed. `SLOW = 2`: the story runs at half the music. Local `useCurrentFrame()` returns slowed frames.
  - `T` = one story beat. `b(n)` = beat n, **snapped to half beats**: `b(0.25)` is not a quarter, use `T / 4`.
  - `real(n) = b(n) * SLOW` = the film frame of beat n.
- **`ramp(f, from, to, ease)`** is the only way to animate. It snaps from/to to the `T / 8` grid and returns 1
  when they snap together. Never pass 0-1 fractions; use `clamp01((x - a) / (b - a))`.
- **Scenes.** `SCENES` (see above) places scenes and their hits, holds, kick and ducks.
- **Music.** `BED` is the file (`public/audio/bed.wav`), `BED_FROM` the start offset into the track in film
  frames (seconds x 60), `BED_VOL` the level.
- **Sync points** are the spine: each big change sits on a hit. Moving one means re-pinning the shots around it.
- **New track:** `python3 <skill>/scripts/beat.py <track.wav>` gives the BPM, the first beat, the drop and a
  `BED_FROM` in frames. Set `BPM` and `BED_FROM`, then put the sync points on its accents.

## Adapting the template to a brand

| Swap | Where |
|---|---|
| Mark paths (ring, inner shape, lead element), the shape's centreline and stroke, wordmark letters and positions, viewBox | `src/logo.tsx` (`RING_D`, `U_D`, `DOT`, `U_LINE`, `U_STROKE`, `LETTERS`, `LETTER_X`, `VB`, `uPoint`) |
| Palette, font, tracking, music tempo | top of `src/lib.tsx` (`INK`, `PAPER`, `LIGHT_INK`, `DIM`, `FONT`, `TRACK`, `BPM`), `public/fonts` and the `loadFont` call in `src/Root.tsx` |
| The brand's line and domain | `LINE`, `DOMAIN` at the end of `src/lib.tsx` |
| Logo geometry used across scenes | `src/lib.tsx`: `DOT_AT` (mark centre 50.5, 50), `LETTER_BOX` (each letter's x0, x1, baseline), `LET_U`, the lockup width `268` and cap height `31.809` in `Lockup`, `Landing` and `scenes/letters.tsx` |
| Construction numbers | `scenes/construct.tsx`: `GUIDE_X`, `GUIDE_Y`, `CIRCLES`, `W_DIMS`, `W_LEADS` (all measured off the mark) |
| Site captures | a capture script like `scripts/reui/site-object.mjs` writing `public/cap/site-object/`; in `scenes/site.tsx` the hero words it reads (`O_WORD`, `O_MCP`), `NAV_LOGO` (measured off the still) and the typed `'#0a0a0a on #ffffff'` |
| Product views | capture scripts like `scripts/reui/live.mjs`, `dash.mjs`, `block-live.mjs`. Each writes one screenshot per mouse step plus measured boxes to `public/cap/live/<dir>/` and its entry in `meta.json` (others kept). Then edit the `NAMES_UI`/`BLOCK_UI` entries and the `dir` union in `WITH_UI` (`scenes/blocks.tsx`) |
| Looks | `LOOKS` and `OUTER` (the ring's centre line) in `scenes/looks.tsx`: 3-4 ways to draw the mark |
| End card | `scenes/final.tsx`: `RING_LINE` and the two `Lead` labels (the dot's measured centre and radius) |
| Music and hits | `public/audio/bed.wav`, `BPM` (`lib.tsx`), `BED_FROM`, `BED_VOL`, `PEAK` and each scene's `hits` (`Refreshed.tsx`) |

The wordmark is built for four letters: `Lockup`'s width and the `letters` scene assume the R E U I set. A longer name
needs `LETTER_BOX`, the lockup width and the `letters` beats redone from its own SVG.

A mark with a different structure (no dot, no ring) needs its own `construct`, `ring` and `final` scenes. Keep the
idea: draw it from its real geometry, led by one element.

## Workflow

1. Read `brands/<brand>.md` (or write it). Measure the logo SVG and the site; collect the brand's verbatim lines.
2. **New film:**
   - `cp -R <skill>/template <project>` and `npm i`.
   - Save the bed as `public/audio/bed.wav`.
   - Capture scripts load Playwright from the project folder (`npm i -D playwright`), or from the folder in
     `PLAYWRIGHT_FROM`.
3. **Capture** site and product with a real mouse, from the project folder: the site script first, then each
   product script (`node <skill>/scripts/reui/site-object.mjs`, then `live.mjs`, `dash.mjs`, `block-live.mjs` for
   ReUI). Each adds its own entry to `meta.json`. The film plays only once every scene's captures exist. Back up
   `meta.json` before a recapture. Pick product views unlike each other and drag something real; never a hover tour.
4. **Edit** only what the brand changes (table above). Keep the helpers (`Flight`, `Wipe`, `Dim`, `Lead`, `Disc`,
   `Live`, `LiveRun`).
5. **Check.**
   - `npx tsc --noEmit`. Only `TS6192` on unused imports is acceptable.
   - From the project folder: `<skill>/scripts/qa.sh <scratch>/q1 0.4 <frames...>`, then read `sheet.jpg`. The
     out folder must be new or hold only earlier stills.
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
