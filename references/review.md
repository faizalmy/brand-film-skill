# Review checklist

Use for a subagent review ("find weak spots") and for your own final pass. Report by frame, ranked.

## Subagent brief (paste, fill the <...>)

> You are reviewing a 60 s brand film made in Remotion. Project: `<project path>`, composition `Refreshed`,
> 60 fps, story map in `~/.claude/skills/brand-film/references/example-reui-refreshed.md (structure) and ~/.claude/skills/brand-film/brands/<brand>.md (brand rules)`, film code in `src/Refreshed.tsx`.
> Do not edit any file and do not render a video.
>
> 1. From the project folder, run `~/.claude/skills/brand-film/scripts/qa.sh <scratch>/review 0.35 <every 40th frame from 0 to the end>`
>    and read `sheet.jpg`. Then render denser stills (every 6-10 frames) around each shot join and each sync frame
>    in the map.
> 2. Judge it as a viewer of a premium brand film. Use the checklist below: pacing, sync, ending, defects, never.
> 3. Return at most 10 weak spots, most severe first. For each: frame range, what a viewer sees, why it hurts, and
>    one concrete fix in terms of the code (shot, constant, capture script).
> 4. Add a short "don't touch" list: the moments that work best, with frames.
> 5. Say what stills cannot show: motion, easing, sound.
>
> Be concrete and blunt. No praise outside the "don't touch" list. Only report what the frames show.

Before relaying it:
- Check each finding against the frames and the current file.
- A review once claimed the mp4 was old while a render was still running.

## Pacing
- Does any stretch hold one idea too long (film 1: 16 s of logo-only near the end, a sag in the construction)?
- Do blocks get enough time to read: at least 3 beats each (action 2 beats, settled hold 1 beat)?
- Is there a flat hold after each big move (the site needs a moment before its tour starts)?
- Do two similar transitions repeat (film 1: the same wipe-with-a-dot used 7 times)?

## Sync
- Does each big change land on its hit (`HITS`) and does the final wordmark complete on the last slam?
- Does `KickBump` pulse during holds where the picture should be still?

## Ending
- Does the end card say what the brand is, in the brand's own published words?

## Defects (all happened once)
- **Hard panel edge:** a page or plane's edge visible during a zoom-out. Fixed by an earlier camera curve
  (`far = t * t`) and a later page fade.
- **Guide collisions:** a guide line crossing a measurement label, or ticks hitting a number. Labels knock out the
  lines behind them (`Txt` with `paper`).
- **Cropped UI:** a tooltip cropped by the capture, or a calendar's bottom row cut by the clip. Fix in the capture
  script (cursor path or clip height), then recapture.
- **Dims inside the UI:** a block's dimension labels drawn on its canvas. Move them outside, above or left.
- **Dissolve or macro reading as corruption:** a dissolve that runs too long (`OBJ_R`), or a macro crop that
  half-shows an icon (`macro(..., scale)`).
- **Stretched dot:** at a cut the dot must stay a disc, not a dash.

## Never
- Logo or text over product UI.
- Demo data inside the product used as content.
- An invented tagline.
- A colour outside the brand profile's palette, except inside the real UI.
