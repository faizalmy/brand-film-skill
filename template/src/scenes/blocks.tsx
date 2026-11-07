import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import LIVE from '../../public/cap/live/meta.json';
import { LETTERS } from '../logo';
import { CX, DOT_AT, Dim, FONT, Flight, H, INK, LIGHT_INK, P, PAPER, RING_SIZE, Stage, T, TRACK, W, WIPE, Wipe, b, calm, contourPt, fly, mix, out, ramp, useCurrentFrame, useNext } from '../lib';

/* blocks, 3 beats per view, 4 for the last. Real primitive names from reui.io/llms.txt. Two with their real components beside them, then a fast run. */
export const WITH_UI: { name: string; dir: 'grid' | 'dash' | 'flow' | 'calendar'; dark: boolean; n: number; dims: { at: number; a: P; b: P; off: number; v: number }[] }[] = [
  { name: 'Data Grid', dir: 'grid', dark: true, n: 28, dims: [
    // Boxes measured from c-data-grid-22's DOM (card 16,8 1104 x 445), all drawn outside it. One wave per kick.
    { at: 4, a: [16, 8], b: [1120, 8], off: -50, v: 1104 },
    { at: 15.5, a: [16, 8], b: [51, 8], off: -20, v: 35 },
    { at: 17, a: [51, 8], b: [510, 8], off: -20, v: 459 },
    { at: 18.5, a: [510, 8], b: [660, 8], off: -20, v: 150 },
    { at: 20, a: [660, 8], b: [810, 8], off: -20, v: 150 },
    { at: 21.5, a: [810, 8], b: [960, 8], off: -20, v: 150 },
    { at: 23, a: [960, 8], b: [1060, 8], off: -20, v: 100 },
    { at: 24.5, a: [1060, 8], b: [1120, 8], off: -20, v: 60 },
    { at: 31, a: [16, 68], b: [16, 8], off: -34, v: 60 },
    { at: 31, a: [1120, 8], b: [1120, 68], off: -34, v: 60 },
    { at: 31.5, a: [16, 108], b: [16, 68], off: -34, v: 40 },
    { at: 32, a: [1120, 68], b: [1120, 397], off: -34, v: 329 },
    { at: 32.5, a: [16, 166], b: [16, 108], off: -34, v: 58 },
    { at: 33.5, a: [16, 224], b: [16, 166], off: -34, v: 58 },
    { at: 34.5, a: [16, 282], b: [16, 224], off: -34, v: 58 },
    { at: 35.5, a: [16, 340], b: [16, 282], off: -34, v: 58 },
    { at: 36.5, a: [16, 397], b: [16, 340], off: -34, v: 57 },
    { at: 37.5, a: [16, 453], b: [16, 397], off: -34, v: 56 },
    { at: 37.5, a: [1120, 397], b: [1120, 453], off: -34, v: 56 },
  ] },
  // dashboard-7, a real block. Boxes measured from its DOM, all drawn outside them; the lower frames run off the bottom of the shot.
  { name: 'Dashboard', dir: 'dash', dark: false, n: 28, dims: [
    { at: 4, a: [4, 6], b: [1284, 6], off: -50, v: 1280 },
    { at: 15.5, a: [4, 6], b: [315, 6], off: -20, v: 311 },
    { at: 17, a: [315, 6], b: [327, 6], off: -20, v: 12 },
    { at: 18.5, a: [327, 6], b: [638, 6], off: -20, v: 311 },
    { at: 20, a: [638, 6], b: [650, 6], off: -20, v: 12 },
    { at: 21.5, a: [650, 6], b: [961, 6], off: -20, v: 311 },
    { at: 23, a: [961, 6], b: [973, 6], off: -20, v: 12 },
    { at: 24.5, a: [973, 6], b: [1284, 6], off: -20, v: 311 },
    { at: 31, a: [4, 138], b: [4, 6], off: -34, v: 132 },
    { at: 31, a: [1284, 6], b: [1284, 138], off: -34, v: 132 },
    { at: 33, a: [4, 154], b: [4, 138], off: -34, v: 16 },
    { at: 33, a: [1284, 138], b: [1284, 154], off: -34, v: 16 },
    { at: 35, a: [4, 218], b: [4, 154], off: -34, v: 64 },
    { at: 35, a: [1284, 154], b: [1284, 604], off: -34, v: 450 },
    { at: 37, a: [4, 600], b: [4, 218], off: -34, v: 382 },
  ] },
];
/* A real mouse on the real component (scripts/reui/live.mjs): the frames play its own behaviour, the logo's dot is the cursor,
   and its DOM boxes are measured around it. */
export const liveEnd = (it: (typeof WITH_UI)[number]): P => { // where the cursor finishes, push included
  const meta = LIVE[it.dir], k = (W - 2 * 96) / meta.clip.width, a = meta.frames[it.n - 1], p = 1.035;
  return [CX + (96 + a.x * k - CX) * p, 432 + (356 + a.y * k - 432) * p];
};
export const Live: React.FC<{ it: (typeof WITH_UI)[number]; lf: number; from: P; wipeTo?: string; home?: { at: P; r: number }; end?: number }> = ({ it, lf, from, wipeTo, home, end = T * 3 }) => {
  const meta = LIVE[it.dir];
  const ink = it.dark ? LIGHT_INK : INK, paper = it.dark ? INK : PAPER;
  const uw = W - 2 * 96, k = uw / meta.clip.width, uh = meta.clip.height * k;
  const top = 356;
  const y = mix(H + 40, top, ramp(lf, -3, 13, out)); // already moving on the cut's first frame, never a blank one
  const push = mix(1, 1.035, ramp(lf, 0, end));
  const dur = T * 2; // the action plays, then it holds settled for a beat
  const idxAt = (g: number) => ramp(g, 0, dur, calm) * (it.n - 1);
  const idx = Math.round(idxAt(lf));
  const cur = (g: number): P => {
    const v = idxAt(g), i = Math.floor(v), j = Math.min(it.n - 1, i + 1), s = v - i;
    const a = meta.frames[i], c = meta.frames[j];
    return [96 + mix(a.x, c.x, s) * k, y + mix(a.y, c.y, s) * k];
  };
  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 40%' }}>
      <div style={{ position: 'absolute', left: 96, top: 34, height: 310, overflow: 'hidden', display: 'flex', font: `600 270px/310px ${FONT}`, letterSpacing: TRACK, color: ink, whiteSpace: 'pre' }}>
        {it.name.split('').map((c, i) => (
          <span key={i} style={{ display: 'inline-block', transform: `translateY(${mix(320, 0, ramp(lf, i * 1.5 - 3, i * 1.5 + 11, out))}px)` }}>{c}</span>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 96, top: y, width: uw, height: uh }}>
        {Array.from({ length: it.n }, (_, i) => (
          <Img key={i} src={staticFile(`cap/live/${it.dir}/${String(i).padStart(3, '0')}.jpg`)} style={{ position: 'absolute', inset: 0, width: uw, height: uh, visibility: i === idx ? 'visible' : 'hidden' }} />
        ))}
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {it.dims.map((d, i) => (
          <Dim key={i} a={[96 + d.a[0] * k, y + d.a[1] * k]} b={[96 + d.b[0] * k, y + d.b[1] * k]} off={d.off} value={d.v} digits={0} t={ramp(lf, d.at, d.at + 12, calm)} ink={ink} paper={paper} />
        ))}
      </svg>
      {wipeTo && <Wipe f={lf} at={end} color={wipeTo} />}
      <Flight trace invert={(!!wipeTo && lf >= end - WIPE)} at={(g) => { const c = cur(g), s = ramp(g, 0, 12, out), p: P = [mix(from[0], c[0], s), mix(from[1], c[1], s)]; return home ? fly(p, [CX + (home.at[0] - CX) / 1.035, 432 + (home.at[1] - 432) / 1.035], ramp(g, end - WIPE, end, calm)) : p; }} f={lf} r={home ? mix(10, home.r / 1.035, ramp(lf, end - WIPE, end, calm)) : 10} ink={it.dark || (wipeTo && lf >= end - WIPE) ? LIGHT_INK : INK} tail={12} />
    </AbsoluteFill>
  );
};
/* The two names with UI, with only a few of their numbers. */
export const pickDims = (it: (typeof WITH_UI)[number], keep: number[]) => ({ ...it, dims: keep.map((i) => it.dims[i]) });
export const NAMES_UI: (typeof WITH_UI)[number][] = [
  pickDims(WITH_UI[0], [0, 2, 12]),
  pickDims(WITH_UI[1], [0, 1, 8]),
];
export const LiveRun: React.FC<{ items: (typeof WITH_UI)[number][]; from: () => P; home?: { at: P; r: number; bg?: string } }> = ({ items, from, home }) => {
  const f = useCurrentFrame();
  const i = Math.min(items.length - 1, Math.floor(f / b(3))), it = items[i], next = items[i + 1];
  return <Stage bg={it.dark ? INK : PAPER}><Live it={it} lf={f - b(i * 3)} from={i === 0 ? from() : liveEnd(items[i - 1])} wipeTo={next ? undefined : home?.bg} home={i === items.length - 1 ? home : undefined} end={next ? T * 3 : T * 4} /></Stage>;
};
/* Two more real blocks straight after Dashboard, made the same way: a real mouse on flow-1 and event-calendar-1
   (scripts/reui/block-live.mjs), boxes measured from their DOM. */
export const BLOCK_UI: (typeof WITH_UI)[number][] = [
  { name: 'Flow', dir: 'flow', dark: true, n: 28, dims: [
    { at: 4, a: [80, 0], b: [320, 0], off: -16, v: 240 }, // above the canvas, never on it
    { at: 15.5, a: [320, 0], b: [380, 0], off: -16, v: 60 },
    { at: 31, a: [0, 286], b: [0, 203], off: -22, v: 83 },
  ] },
  { name: 'Calendar', dir: 'calendar', dark: false, n: 28, dims: [
    { at: 4, a: [16, 8], b: [1584, 8], off: -36, v: 1568 },
    { at: 15.5, a: [16, 8], b: [240, 8], off: -14, v: 224 },
    { at: 31, a: [16, 218], b: [16, 86], off: -34, v: 132 },
  ] },
];
export const AllBlocks: React.FC = () => {
  const d = DOT_AT(RING_SIZE), next = useNext();
  return <LiveRun items={[...NAMES_UI, ...BLOCK_UI]} from={() => contourPt(LETTERS.length - 1, 1)} home={{ at: [d.x, d.y], r: d.r, bg: next.bg }} />;
};
