import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame as useRealFrame } from 'remotion';
import { DOT, LETTERS, LETTER_X, Mark, RING_D, U_D } from './logo';

// Language from OpenAI's "Refreshed" film: white canvas, black ink, a dot that leads, the mark drawn from its own
// construction, long still holds. Only moves with a real ReUI source are used. Colours are reui.io's neutral scale.
// All text comes from reui.io: its subline, its primitive names (llms.txt), its token values, its domain.
// Every number on screen is measured: the logo's paths in its own units, the components' DOM boxes in px.

export const FPS = 60;
export const W = 1920, H = 1080, CX = 960, CY = 540;
export const BPM = 116; // Pixel Lattice
// The film's story runs at half the music: one story beat lasts SLOW music beats. Every animation reads this slowed clock,
// so hard-coded frame counts slow with it, and every story beat still lands on a music beat.
export const SLOW = 2;
export const useCurrentFrame = () => useRealFrame() / SLOW;
export const T = (60 / BPM) * FPS; // one story beat, on the slowed clock
export const b = (n: number) => Math.round((Math.round(n * 2) / 2) * T); // snapped to the kick: half a story beat
export const real = (n: number) => b(n) * SLOW; // the same beat, in frames of the film

export const INK = '#0a0a0a', PAPER = '#ffffff', LIGHT_INK = '#fafafa', DIM = '#737373';
export const FONT = 'Inter';
export const TRACK = '-0.025em'; // the site's h1 tracking: -1.2px at 48px
export const MONO = 'ui-monospace, Menlo, monospace'; // data only: measurements, coordinates, hex values

export const calm = Easing.bezier(0.22, 0.75, 0.2, 1);
export const typing = (t: number) => t; // marks a ramp as typing: a fast burst on each kick, then steady slow letters that never stop
// A calm move follows the kick: it splits into one push per music beat, each hitting on the kick and settling before the next.
export const ramp = (f: number, from: number, to: number, ease: (t: number) => number = (t) => t) => {
  const grid = T / 8; // every start and stop lands on the track's sixteenth notes, details included
  from = Math.round(from / grid) * grid;
  to = Math.round(to / grid) * grid;
  if (to <= from) return f >= to ? 1 : 0;
  const t = interpolate(f, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (ease !== calm && ease !== typing) return ease(t);
  const n = Math.max(1, Math.round((to - from) / (T / 2))), x = t * n, i = Math.min(n - 1, Math.floor(x));
  const s = x - i;
  return (i + (ease === typing ? 0.45 * calm(s) + 0.55 * s : calm(s))) / n;
};
export const out = Easing.bezier(0.16, 1, 0.3, 1);
export const mix = (a: number, c: number, t: number) => a + (c - a) * t;

export const Stage: React.FC<{ bg?: string; children?: React.ReactNode }> = ({ bg = PAPER, children }) => (
  <AbsoluteFill style={{ background: bg, overflow: 'hidden', fontFamily: FONT }}>{children}</AbsoluteFill>
);
export const Domain: React.FC<{ color?: string }> = ({ color = DIM }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 836, textAlign: 'center', font: `500 44px ${FONT}`, letterSpacing: '-0.01em', color }}>{DOMAIN}</div>
);
export const Disc: React.FC<{ x?: number; y?: number; r: number; color?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x = CX, y = CY, r, color = INK, style, children }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>{children}</div>
);

export type P = [number, number];
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// a label fades before an edge can crop it
export const edgeFade = (x: number, y: number) => clamp01((Math.min(x - 20, W - x - 20, y - 16, H - y - 16)) / 50);
export const Txt: React.FC<{ x: number; y: number; ink: string; paper: string; anchor?: 'start' | 'middle' | 'end'; size?: number; opacity?: number; children: React.ReactNode }> = ({ x, y, ink, paper, anchor = 'middle', size = 19, opacity = 1, children }) => (
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" fill={ink} stroke={paper} strokeWidth={7} paintOrder="stroke" opacity={opacity * edgeFade(x, y)}
    style={{ font: `500 ${size}px ${MONO}`, fontVariantNumeric: 'tabular-nums' }}>{children}</text>
);
// A dimension line in screen px: draws from a to b behind a small dot while its number counts up to the measured value.
export const Dim: React.FC<{ a: P; b: P; off?: number; value: number; digits?: number; t: number; ink: string; paper: string; labelAt?: P }> = ({ a, b, off = 0, value, digits = 3, t, ink, paper, labelAt }) => {
  if (t <= 0) return null;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const u: P = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P = [-u[1], u[0]];
  const A: P = [a[0] + n[0] * off, a[1] + n[1] * off], B: P = [b[0] + n[0] * off, b[1] + n[1] * off];
  const E: P = [mix(A[0], B[0], t), mix(A[1], B[1], t)];
  const tick = (p: P) => <line x1={p[0] - n[0] * 7} y1={p[1] - n[1] * 7} x2={p[0] + n[0] * 7} y2={p[1] + n[1] * 7} />;
  const lab: P = labelAt ?? [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  return (
    <g>
      <g stroke={ink} strokeWidth={1.4} strokeLinecap="round" fill="none">
        {off !== 0 && <line x1={a[0]} y1={a[1]} x2={A[0]} y2={A[1]} opacity={0.3} />}
        {off !== 0 && t >= 1 && <line x1={b[0]} y1={b[1]} x2={B[0]} y2={B[1]} opacity={0.3} />}
        <line x1={A[0]} y1={A[1]} x2={E[0]} y2={E[1]} />
        {tick(A)}
        {t >= 1 && tick(B)}
      </g>
      {t < 1 && <circle cx={E[0]} cy={E[1]} r={4} fill={ink} />}
      <Txt x={lab[0]} y={lab[1]} ink={ink} paper={paper} anchor={labelAt && labelAt[0] < A[0] ? 'end' : labelAt ? 'start' : 'middle'}>{(value * t).toFixed(digits)}</Txt>
    </g>
  );
};
// A leader from a point on the drawing to a label that types on.
export const Lead: React.FC<{ p: P; to: P; text: string; t: number; ink: string; paper: string }> = ({ p, to, text, t, ink, paper }) => {
  if (t <= 0) return null;
  const e: P = [mix(p[0], to[0], Math.min(1, t * 2)), mix(p[1], to[1], Math.min(1, t * 2))];
  const left = to[0] < p[0];
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke={ink} strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={p[0]} cy={p[1]} r={4} fill={ink} />
      {t > 0.5 && <Txt x={to[0] + (left ? -10 : 10)} y={to[1]} ink={ink} paper={paper} anchor={left ? 'end' : 'start'}>{text.slice(0, Math.ceil((t - 0.5) * 2 * text.length))}</Txt>}
    </g>
  );
};
// The dot in flight: a thin line behind it, and it stretches along its own speed.
// The dot flies straight from kick to kick: it bursts on the kick and only turns on the kick. trace keeps the exact path, for
// flights that draw or follow geometry; those still burst on the kick through their ramps.
export const Flight: React.FC<{ at: (f: number) => P; f: number; r: number; ink: string; tail?: number; invert?: boolean; trace?: boolean }> = ({ at: path, f, r, ink, tail = 22, invert, trace }) => {
  const at = (g: number): P => {
    if (trace) return path(g);
    const kick = T / 2, k = Math.floor(g / kick), p = path(k * kick), q = path((k + 1) * kick), e = calm((g - k * kick) / kick);
    return [mix(p[0], q[0], e), mix(p[1], q[1], e)];
  };
  const [x, y] = at(f), [px, py] = at(f - 1);
  const v = Math.hypot(x - px, y - py), ang = (Math.atan2(y - py, x - px) * 180) / Math.PI;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, mixBlendMode: invert ? 'difference' : undefined }}>
      {Array.from({ length: tail }, (_, i) => {
        const [a, c] = at(f - i), [e, g] = at(f - i - 1);
        return Math.hypot(a - e, c - g) < 0.3 ? null : <line key={i} x1={a} y1={c} x2={e} y2={g} stroke={ink} strokeWidth={1.6} strokeLinecap="round" opacity={1 - i / tail} />;
      })}
      <ellipse cx={x} cy={y} rx={r + Math.min(v * 0.45, r * 2.4)} ry={r * Math.max(0.72, 1 - v * 0.012)} fill={ink} transform={`rotate(${ang} ${x} ${y})`} />
    </svg>
  );
};

// The scene after this one in the SCENES list: its name and the colour of its first frame. Set by Refreshed.tsx.
export const NextScene = createContext<{ name?: string; bg?: string }>({});
export const useNext = () => useContext(NextScene);

// Sections hand over instead of cutting (Compound Interest's move): the next page rises over this one, ending exactly on the cut.
export const WIPE = Math.round(T / 2); // one kick
export const DIM_DRAW = Math.round(T / 4); // a dimension line closes on the next eighth note
// color: the next scene's first colour (useNext). Without a next scene there is nothing to wipe to.
export const Wipe: React.FC<{ f: number; at: number; color?: string }> = ({ f, at, color }) => {
  if (!color) return null;
  const t = ramp(f, at - WIPE, at, calm);
  return t <= 0 ? null : <div style={{ position: 'absolute', left: -60, right: -60, top: mix(H + 60, -60, t), height: H + 240, background: color }} />;
};

// on-curve points and bezier handles, read straight from a path's data (absolute M L H V C Z only, which these are)
export const pathNodes = (d: string) => {
  const tok = d.match(/[MLHVCZ]|-?\d*\.?\d+/g) ?? [];
  let i = 0, x = 0, y = 0, cmd = '';
  const points: [number, number][] = [];
  const handles: [number, number, number, number][] = [];
  const n = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    if (/[MLHVCZ]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'Z') continue;
    if (cmd === 'M' || cmd === 'L') { x = n(); y = n(); points.push([x, y]); }
    else if (cmd === 'H') { x = n(); points.push([x, y]); }
    else if (cmd === 'V') { y = n(); points.push([x, y]); }
    else if (cmd === 'C') {
      const [a, c, e, g, h, k] = [n(), n(), n(), n(), n(), n()];
      handles.push([x, y, a, c], [h, k, e, g]);
      x = h; y = k; points.push([x, y]);
    }
  }
  return { points, handles };
};
export const NODES = pathNodes(U_D);
export const RING_NODES = pathNodes(RING_D);

export const RING_SIZE = 620;
// where the logo's dot sits on screen when the mark is `size` px, centred (50.5, 50 = the centre of VB in logo.tsx)
export const DOT_AT = (size: number) => ({ x: CX + (DOT.cx - 50.5) * (size / 100), y: CY + (DOT.cy - 50) * (size / 100), r: DOT.r * (size / 100) });

// logo + REUI, centred; letters settle one by one, the way the brand's own logo build does
export const LOCK_U = 3;
export const Lockup: React.FC<{ ink: string; letters: number; noMark?: boolean; noDot?: boolean }> = ({ ink, letters, noMark, noDot }) => {
  const w = 268 * LOCK_U, h = 100 * LOCK_U;
  return (
    <div style={{ position: 'absolute', left: CX - w / 2, top: CY - h / 2, width: w, height: h }}>
      {!noMark && <Mark size={h} ink={ink} parts={noDot ? ['ring', 'u'] : undefined} />}
      <svg width={w} height={h} viewBox="0.5 0 268 100" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {LETTERS.map((d, i) => {
          const t = interpolate(letters - (i * T) / 8, [0, T / 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out });
          if (t <= 0) return null;
          const sc = mix(1.3, 1, t);
          return <g key={i} opacity={Math.min(1, t * 2.5)} transform={`translate(${LETTER_X[i]} 68.17) scale(${sc}) translate(${-LETTER_X[i]} -68.17)`}><path d={d} fill={ink} /></g>;
        })}
      </svg>
    </div>
  );
};
export const Landing: React.FC<{ ink: string; f: number; from: number; dur?: number }> = ({ ink, f, from, dur = T }) => {
  const t = ramp(f, 0, dur, calm);
  const h = 100 * LOCK_U;
  const size = mix(from, h, t);
  const left = mix(CX - from / 2, CX - (268 * LOCK_U) / 2, t);
  const top = mix(CY - from / 2, CY - h / 2, t);
  return (
    <>
      <Lockup ink={ink} letters={f - dur / 2} noMark={t < 1} />
      {t < 1 && <div style={{ position: 'absolute', left, top }}><Mark size={size} ink={ink} /></div>}
    </>
  );
};

export const LETTER_BOX: [number, number, number][] = [[130.5, 159.175, 68.173], [173.312, 197.886, 68.173], [213.928, 244.077, 68.688], [260.402, 268.091, 68.173]];
export const LET_U = 17.5;
export const letterPt = (i: number, x: number, y: number): P => [CX - 400 + (x - (LETTER_BOX[i][0] + LETTER_BOX[i][1]) / 2) * LET_U, CY + (y - 50) * LET_U];
export const outerOf = (d: string) => d.slice(0, d.indexOf('Z') + 1);
export const contours = new Map<number, { el: SVGPathElement; len: number }>();
// a point on the letter's outer contour, read from the path itself (the browser measures it, in Studio and in render)
export const contourPt = (i: number, t: number): P => {
  let c = contours.get(i);
  if (!c) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', outerOf(LETTERS[i]));
    c = { el, len: el.getTotalLength() };
    contours.set(i, c);
  }
  const p = c.el.getPointAtLength(clamp01(t) * c.len);
  return letterPt(i, p.x, p.y);
};
export const letterT = (lf: number) => ramp(lf, 1, T - 2, calm);
export const lettersAt = (g: number): P => {
  const i = Math.max(0, Math.min(LETTERS.length - 1, Math.floor(g / T)));
  const lf = g - b(i), p = contourPt(i, letterT(lf));
  if (i === 0) return p;
  const prev = contourPt(i - 1, 1), s = ramp(lf, 0, 6, out);
  return [mix(prev[0], p[0], s), mix(prev[1], p[1], s)];
};
export const FINAL_DOT = DOT_AT(540);
export const fly = (from: P, to: P, t: number): P => [mix(from[0], to[0], t), mix(from[1], to[1], t)];

// The brand's own line and domain, verbatim from its site. Used by the line and final scenes.
export const LINE = 'The agent-ready layer for shadcn/ui';
export const DOMAIN = 'reui.io';
