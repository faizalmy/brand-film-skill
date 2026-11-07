# Example: ReUI "Refreshed" (approved 7 Nov 2026)

The film `template/` was cut from. Use it as the shape to adapt: which beat does what, how long each part holds,
where the hits fall.

Pixel Lattice, 116 BPM, `SLOW = 2`, 60 beats, 3724 frames (62 s). Frame = film frame (`real(n)`).

| Beats | Frames | Shot | What happens | Lands on |
|---|---|---|---|---|
| 0-8 | 0-496 | `Caret` | Dot flies in on a thin line, becomes the caret, types reui.io's subline, then holds | impact b(8) |
| 8-11 | 496-682 | `Opening` | Dot opens to a disc, empties to a line, squares up into the ring | |
| 11-20 | 682-1242 | `Construct` | Mark drawn from its own paths: rulers, circles, handles, measured dims, zoom in, pan, zoom out to the clean logo | slam b(20) |
| 20-32 | 1242-1986 | `LogoSite` | Logo holds, zooms out and becomes the reui.io nav logo. Short flat hold, then a fast tour (tilted planes, macro patches, dissolve) | dark toggle flips on slam b(28) = 1738 |
| 32-36 | 1986-2234 | `Letters` | R E U I, one letter per beat: construction, then finished | impact b(32) |
| 36-49 | 2234-3042 | `AllBlocks` | Data Grid 2234, Dashboard 2420, Flow 2606 (3 beats each, hard cuts), Calendar 2794 (4 beats). Real drags, dims outside the canvas. Last block wipes to ink and the dot flies home | impact b(36) |
| 49-52 | 3042-3228 | `LogoSwap` | Kick stops. One look per beat: path text on ink, halftone on paper, construction lines on paper. Dot never moves | impact b(49) |
| 52-60 | 3228-3724 | `Final` | Dot draws U and ring, logo lands, R E U I settle, then reui.io subline and domain | slam b(56) = 3476, wordmark complete |

Audio:
- Bed from `BED_FROM = 2980` frames into the track at `0.62`, ducked to 75% under `Construct` (beats 11-20).
- `KickBump` (0.8% scale per kick) runs until beat 49, off in `STILL` ranges (opening hold, logo hold, settled
  block holds).

Things the user rejected (do not bring back):
- Click, typing and servo SFX.
- A giant REUI word sliding behind the logo.
- A token stack slide.
- A solid-fill logo look and a neutral-bands look.
- A white wipe between blocks.
- Trimming `Construct`: the user wants the full logo construction. Cut from the logo looks near the end instead.

Things the user liked (keep): the dark toggle flip on 1738, the dive into R and the letter construction, the dot-led
opening line at 225-385.

## Frames (visual template)

`references/reui-frames/` holds 38 stills of the approved film at 960x540, named by film frame (`f1738.jpg`), plus
`sheet.jpg` with all of them. Open the sheet before designing a new brand's film, and match its density, spacing,
type scale and holds. Open single frames to copy a composition.

| Shot | Frames |
|---|---|
| Line: dot flies in, types the line, line clears | f0060 f0250 f0385 f0496 |
| Opening: disc, ring | f0560 f0682 |
| Construct: rulers, measured guides, zoom in and pan, clean logo | f0760 f0900 f1000 f1100 |
| Logo hold, then zoom out into the site | f1241 f1330 f1395 f1450 |
| Site tour: tilted plane, macro, toggle flip to dark on the slam | f1530 f1650 f1738 f1850 |
| Name: R E U I construction beside each letter | f1986 f2050 f2120 |
| Product: title types, block slides up, real drag, dims outside the canvas | f2234 f2330 f2420 f2510 f2606 f2700 f2794 f2950 |
| Looks: path text, halftone, construction lines | f3042 f3104 f3166 |
| End: dot draws the mark, logo lands, letters settle, line and domain | f3228 f3300 f3400 f3476 f3600 f3700 |
