import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame as useRealFrame } from 'remotion';
import { DOT, LETTERS, LETTER_X, Mark, RING_D, U_D, U_LINE, U_STROKE, VB, uPoint } from './logo';
import LIVE from '../public/cap/live/meta.json';
import OBJ_META from '../public/cap/site-object/meta.json';

// Language from OpenAI's "Refreshed" film: white canvas, black ink, a dot that leads, the mark drawn from its own
// construction, long still holds. Only moves with a real ReUI source are used. Colours are reui.io's neutral scale.
// All text comes from reui.io: its subline, its primitive names (llms.txt), its token values, its domain.
// Every number on screen is measured: the logo's paths in its own units, the components' DOM boxes in px.

const FPS = 60;
const W = 1920, H = 1080, CX = 960, CY = 540;
const BPM = 116; // Pixel Lattice
// The film's story runs at half the music: one story beat lasts SLOW music beats. Every animation reads this slowed clock,
// so hard-coded frame counts slow with it, and every story beat still lands on a music beat.
const SLOW = 2;
const useCurrentFrame = () => useRealFrame() / SLOW;
const T = (60 / BPM) * FPS; // one story beat, on the slowed clock
const b = (n: number) => Math.round((Math.round(n * 2) / 2) * T); // snapped to the kick: half a story beat
const real = (n: number) => b(n) * SLOW; // the same beat, in frames of the film
export const REFRESHED_BEATS = 60;
export const REFRESHED_FRAMES = real(REFRESHED_BEATS);
export const REFRESHED_FPS = FPS;

const INK = '#0a0a0a', PAPER = '#ffffff', LIGHT_INK = '#fafafa', DIM = '#737373';
const FONT = 'Inter';
const TRACK = '-0.025em'; // the site's h1 tracking: -1.2px at 48px
const MONO = 'ui-monospace, Menlo, monospace'; // data only: measurements, coordinates, hex values

const calm = Easing.bezier(0.22, 0.75, 0.2, 1);
const typing = (t: number) => t; // marks a ramp as typing: a fast burst on each kick, then steady slow letters that never stop
// A calm move follows the kick: it splits into one push per music beat, each hitting on the kick and settling before the next.
const ramp = (f: number, from: number, to: number, ease: (t: number) => number = (t) => t) => {
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
const out = Easing.bezier(0.16, 1, 0.3, 1);
const mix = (a: number, c: number, t: number) => a + (c - a) * t;

const Stage: React.FC<{ bg?: string; children?: React.ReactNode }> = ({ bg = PAPER, children }) => (
  <AbsoluteFill style={{ background: bg, overflow: 'hidden', fontFamily: FONT }}>{children}</AbsoluteFill>
);
const Domain: React.FC<{ color?: string }> = ({ color = DIM }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 836, textAlign: 'center', font: `500 44px ${FONT}`, letterSpacing: '-0.01em', color }}>reui.io</div>
);
const Disc: React.FC<{ x?: number; y?: number; r: number; color?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x = CX, y = CY, r, color = INK, style, children }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>{children}</div>
);

type P = [number, number];
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// a label fades before an edge can crop it
const edgeFade = (x: number, y: number) => clamp01((Math.min(x - 20, W - x - 20, y - 16, H - y - 16)) / 50);
const Txt: React.FC<{ x: number; y: number; ink: string; paper: string; anchor?: 'start' | 'middle' | 'end'; size?: number; opacity?: number; children: React.ReactNode }> = ({ x, y, ink, paper, anchor = 'middle', size = 19, opacity = 1, children }) => (
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" fill={ink} stroke={paper} strokeWidth={7} paintOrder="stroke" opacity={opacity * edgeFade(x, y)}
    style={{ font: `500 ${size}px ${MONO}`, fontVariantNumeric: 'tabular-nums' }}>{children}</text>
);
// A dimension line in screen px: draws from a to b behind a small dot while its number counts up to the measured value.
const Dim: React.FC<{ a: P; b: P; off?: number; value: number; digits?: number; t: number; ink: string; paper: string; labelAt?: P }> = ({ a, b, off = 0, value, digits = 3, t, ink, paper, labelAt }) => {
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
const Lead: React.FC<{ p: P; to: P; text: string; t: number; ink: string; paper: string }> = ({ p, to, text, t, ink, paper }) => {
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
const Flight: React.FC<{ at: (f: number) => P; f: number; r: number; ink: string; tail?: number; invert?: boolean; trace?: boolean }> = ({ at: path, f, r, ink, tail = 22, invert, trace }) => {
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

// Sections hand over instead of cutting (Compound Interest's move): the next page rises over this one, ending exactly on the cut.
const WIPE = Math.round(T / 2); // one kick
const DIM_DRAW = Math.round(T / 4); // a dimension line closes on the next eighth note
const Wipe: React.FC<{ f: number; at: number; color: string }> = ({ f, at, color }) => {
  const t = ramp(f, at - WIPE, at, calm);
  return t <= 0 ? null : <div style={{ position: 'absolute', left: -60, right: -60, top: mix(H + 60, -60, t), height: H + 240, background: color }} />;
};

// on-curve points and bezier handles, read straight from a path's data (absolute M L H V C Z only, which these are)
const pathNodes = (d: string) => {
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
const NODES = pathNodes(U_D);
const RING_NODES = pathNodes(RING_D);

/* 0-8. The logo's dot flies in on a thin line and becomes the caret. It types reui.io's own subline, the domain types
   under it, then both go back. */
const LINE = 'The agent-ready layer for shadcn/ui';
const DOMAIN = 'reui.io';
const caretPath = (f: number): P => {
  const t = ramp(f, -b(0.25), b(1), Easing.bezier(0.3, 0, 0.25, 1)), m = 1 - t; // already on screen on frame 0
  return [m * m * -60 + 2 * m * t * 500 + t * t * CX, m * m * 880 + 2 * m * t * 1040 + t * t * CY];
};
// A word lands big on its kick, drops to line size on the next kick, and collapses to nothing on its way out.
const LINE_WORDS = LINE.split(' ');
const WORD_AT = LINE_WORDS.map((_, i) => b(1 + i * 0.5));
const WORD_OUT = [b(7.5), b(7.5), b(7), b(7), b(6.5)];
const wordSize = (f: number, at: number, exit: number) => (f < at ? 0 : mix(mix(2, 1.7, ramp(f, at, at + 6, out)), 1, ramp(f, at + T / 2, at + T / 2 + 9, out)) * (1 - ramp(f, exit, exit + 9, out)));
const Caret: React.FC = () => {
  const f = useCurrentFrame();
  const sizes = LINE_WORDS.map((_, i) => wordSize(f, WORD_AT[i], WORD_OUT[i]));
  const dot = mix(22, 32, ramp(f, b(1), b(1.25), out) * (1 - ramp(f, b(6.5), b(7.25))));
  return (
    <Stage>
      {f < b(1) && <Flight at={caretPath} f={f} r={11} ink={INK} />}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: f < WORD_AT[0] ? 0 : 24 * Math.max(1, ...sizes) * (1 - ramp(f, b(7.5), b(7.5) + 9, out)) }}>
        <span style={{ font: `500 84px/1 ${FONT}`, letterSpacing: TRACK, color: INK, whiteSpace: 'pre' }}>
          {/* line-height 0 keeps the baseline still while a word's size changes; a space exists only while the next word does */}
          {LINE_WORDS.map((w, i) => sizes[i] > 0 && (
            <React.Fragment key={i}>
              <span style={{ fontSize: 84 * sizes[i], lineHeight: 0 }}>{w}</span>
              {sizes[i + 1] > 0 && <span style={{ fontSize: 84 * Math.min(sizes[i], 1, sizes[i + 1]), lineHeight: 0 }}> </span>}
            </React.Fragment>
          ))}
        </span>
        {f >= b(1) && <span style={{ width: dot, height: dot, borderRadius: dot / 2, background: INK, flex: 'none' }} />}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: CY + 76, textAlign: 'center', font: `500 60px ${FONT}`, letterSpacing: '-0.01em', color: DIM, transformOrigin: '50% 0', transform: `scale(${f < b(3.5) ? 0 : mix(1.4, 1, ramp(f, b(4), b(4) + 9, out)) * (1 - ramp(f, b(6), b(6) + 9, out))})` }}>{DOMAIN}</div>
    </Stage>
  );
};

/* 8-11. The dot opens into a disc, the disc empties to a line, the line squares up into the logo's ring. */
const RING_SIZE = 620;
const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const size = mix(22, RING_SIZE, ramp(f, 0, b(1.5), calm));
  const back = ramp(f, b(2), b(2.6), calm); // the fill runs back into the dot, the ring stays
  const square = ramp(f, b(2.2), b(3), calm);
  return (
    <Stage>
      <div style={{
        position: 'absolute', left: CX - size / 2, top: CY - size / 2, width: size, height: size, boxSizing: 'border-box',
        borderRadius: `${mix(50, 33.33, square)}%`, border: `1.6px solid ${INK}`,
      }} />
      <Disc r={mix(size / 2, 11, back)} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <Dim a={[CX - size / 2, CY - size / 2]} b={[CX + size / 2, CY - size / 2]} off={-40} value={(size / RING_SIZE) * 100} t={ramp(f, 4, 10)} ink={INK} paper={PAPER} />
      </svg>
    </Stage>
  );
};

/* 11-20. The mark drawn from its own numbers: every line here comes from logo.tsx's paths, none is decoration.
   Flat only. It resolves to the solid logo within a beat. */
const GUIDE_X = [0.5, 4.346, 25.668, 35.064, 65.936, 75.332, 96.654, 100.5];
const GUIDE_Y = [0, 3.846, 25, 65.604, 75, 96.154, 100];
const CIRCLES: [number, number, number][] = [
  [33.833, 33.333, 33.333], [67.167, 33.333, 33.333], [33.833, 66.667, 33.333], [67.167, 66.667, 33.333],
  [43.789, 56.879, 18.121], [43.789, 56.879, 8.725], [57.212, 56.879, 18.121], [57.212, 56.879, 8.725],
  [30.366, 29.698, 4.698], [70.634, 43.59, 4.698],
];
const W_DIMS: { at: number; a: P; b: P; off?: number; v: number; out?: P }[] = [
  { at: 1.6, a: [0.5, 0], b: [100.5, 0], off: -46, v: 100 },
  { at: 1.9, a: [0.5, 100], b: [0.5, 0], off: -46, v: 100 },
  { at: 2.7, a: [96.654, 50], b: [100.5, 50], v: 3.846, out: [40, 0] },
  { at: 3.0, a: [25.668, 75], b: [75.332, 75], off: 40, v: 49.664 },
  { at: 3.25, a: [25.668, 75], b: [25.668, 25], off: -40, v: 50 },
  { at: 3.45, a: [25.668, 25], b: [35.064, 25], off: -26, v: 9.396 },
  { at: 3.65, a: [65.936, 25], b: [75.332, 25], off: -26, v: 9.396 },
  { at: 3.85, a: [70.634, 34.396], b: [70.634, 38.892], v: 4.496, out: [46, 0] },
  { at: 4.2, a: [65.936, 48], b: [75.332, 48], v: 9.396 },
  { at: 4.4, a: [50.5, 65.604], b: [50.5, 75], v: 9.396 },
  { at: 5.3, a: [43.789, 75], b: [57.212, 75], off: 70, v: 13.423 },
];
const circlePt = (cx: number, cy: number, r: number, deg: number): P => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const W_LEADS: { at: number; p: P; d: P; text: string }[] = [
  { at: 2.3, p: circlePt(33.833, 33.333, 33.333, 225), d: [-120, -64], text: 'r 33.333' },
  { at: 3.1, p: [70.634, 29.698], d: [250, -70], text: '70.634, 29.698' },
  { at: 3.3, p: [30.366, 29.698], d: [-190, -90], text: 'r 4.698' },
  { at: 4.0, p: circlePt(57.212, 56.879, 18.121, 40), d: [170, 60], text: 'r 18.121' },
  { at: 4.3, p: circlePt(57.212, 56.879, 8.725, 225), d: [-150, -80], text: 'r 8.725' },
  { at: 4.7, p: [57.212, 75], d: [150, 110], text: '57.212, 75.000' },
  { at: 4.9, p: [43.789, 75], d: [-170, 110], text: '43.789, 75.000' },
  { at: 5.1, p: [75.332, 56.879], d: [150, 10], text: '75.332, 56.879' },
  { at: 5.5, p: [65.936, 56.879], d: [-170, -30], text: '65.936, 56.879' },
];
const Rulers: React.FC<{ sx: (x: number) => number; sy: (y: number) => number; S: number; tx: number; ty: number; t: number }> = ({ sx, sy, S, tx, ty, t }) => {
  const minor = S > 13 ? 1 : 2, major = S > 13 ? 5 : 10;
  const marks = Array.from({ length: Math.floor(100 / minor) + 1 }, (_, i) => i * minor);
  return (
    <g opacity={t}>
      <g stroke={INK} strokeWidth={1.3} strokeLinecap="round">
        {marks.map((m) => { const on = m % major === 0, x = sx(m + 0.5), y = sy(m); return (
          <React.Fragment key={m}>
            {x > 60 && x < W && <line x1={x} y1={22} x2={x} y2={22 + (on ? 16 : 8) * t} opacity={on ? 0.8 : 0.35} />}
            {y > 60 && y < H && <line x1={22} y1={y} x2={22 + (on ? 16 : 8) * t} y2={y} opacity={on ? 0.8 : 0.35} />}
          </React.Fragment>
        ); })}
      </g>
      {marks.filter((m) => m % major === 0).map((m) => (
        <React.Fragment key={m}>
          {sx(m + 0.5) > 70 && <Txt x={sx(m + 0.5)} y={52} ink={DIM} paper={PAPER} size={15}>{m}</Txt>}
          {sy(m) > 70 && <Txt x={46} y={sy(m)} ink={DIM} paper={PAPER} size={15} anchor="start">{m}</Txt>}
        </React.Fragment>
      ))}
      <circle cx={sx(tx)} cy={22} r={5} fill={INK} />
      <circle cx={22} cy={sy(ty)} r={5} fill={INK} />
    </g>
  );
};
const Construct: React.FC = () => {
  const f = useCurrentFrame();
  const uBase = RING_SIZE / 100;
  const zoomOut = ramp(f, b(6.6), b(7.4), calm);
  const cam = (g: number) => {
    const z = ramp(g, b(4), b(5.2), calm) * (1 - ramp(g, b(6.6), b(7.4), calm));
    const pan = ramp(g, b(5.2), b(6.6), calm); // while close, the camera travels up the U's right arm to the dot
    // camera target: where the U's right arc meets its straight, a tangent point worth proving, then up to the dot
    return { S: uBase * mix(1, 4.4, z), tx: mix(50.5, mix(62, 70.634, pan), z), ty: mix(50, mix(72, 42, pan), z) };
  };
  const { S, tx, ty } = cam(f);
  const hair = 1.6 / S;
  const closeUp = clamp01(1 - zoomOut * 1.8); // close-up details leave as the camera backs out, so the full view stays readable
  const sx = (x: number) => CX + (x - tx) * S, sy = (y: number) => CY + (y - ty) * S;
  const guide = ramp(f, b(0.5), b(1.5), calm);
  const circle = ramp(f, b(1.5), b(3), calm);
  const shape = ramp(f, b(2.2), b(4), calm);
  const nodes = ramp(f, b(3.4), b(4), calm);
  // the construction leaves one layer per kick, in this order, and the solid logo arrives with the last one
  const gone = (at: number) => 1 - ramp(f, b(at), b(at + 0.5), calm);
  const keepRulers = gone(6.5), keepDims = gone(7), keepNodes = gone(7.5), keepCircles = gone(8), keepGuides = gone(8.5);
  const solid = ramp(f, b(8.5), b(9), calm);
  // the dot: centre, to the U's open end, along the U as it draws, then up onto its own place in the logo
  const dotU = (g: number): P => {
    if (g < b(2.2)) { const go = ramp(g, b(1.6), b(2.2), calm); return [mix(50.5, 30.366, go), mix(50, 29.698, go)]; }
    if (g < b(4)) return uPoint(ramp(g, b(2.2), b(4), calm));
    return [DOT.cx, mix(43.59, DOT.cy, ramp(g, b(4), b(4.35), calm))];
  };
  const dotAt = (g: number): P => { const c = cam(g), u = dotU(g); return [CX + (u[0] - c.tx) * c.S, CY + (u[1] - c.ty) * c.S]; };
  const dotR = mix(11 / uBase, DOT.r, ramp(f, b(4), b(4.35), calm)) * S;
  return (
    <Stage>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${CX} ${CY}) scale(${S}) translate(${-tx} ${-ty})`} fill="none" stroke={INK} strokeWidth={hair}>
          <g opacity={0.2 * guide * keepGuides}>
            {GUIDE_X.map((x) => <line key={x} x1={x} x2={x} y1={50 - 400 * guide} y2={50 + 400 * guide} />)}
            {GUIDE_Y.map((y) => <line key={y} y1={y} y2={y} x1={50.5 - 400 * guide} x2={50.5 + 400 * guide} />)}
          </g>
          <g opacity={0.35 * keepCircles}>
            {CIRCLES.map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} pathLength={1} strokeDasharray={`${circle} 1`} opacity={circle > 0 ? 1 : 0} />
            ))}
          </g>
          <g opacity={1 - solid}>
          <path d={RING_D} />
          <mask id="uTrace" maskUnits="userSpaceOnUse" x={-10} y={-10} width={121} height={120}>
            <path d={U_LINE} fill="none" stroke="#fff" strokeWidth={U_STROKE + 3} strokeLinecap="round" pathLength={1} strokeDasharray={`${shape} 1`} />
          </mask>
          <path d={U_D} mask="url(#uTrace)" opacity={shape > 0 ? 1 : 0} />
          <circle {...DOT} pathLength={1} strokeDasharray={`${shape} 1`} opacity={shape > 0 ? 1 : 0} />
          </g>
          <g opacity={nodes * keepNodes}>
            {[...NODES.handles, ...RING_NODES.handles.slice(0, 8)].map(([a, c, e, g], i) => <line key={i} x1={a} y1={c} x2={e} y2={g} opacity={0.55} />)}
            {[...NODES.points, ...RING_NODES.points.slice(0, 8)].map(([x, y], i) => {
              const s = 6 / S;
              return <rect key={i} x={x - s / 2} y={y - s / 2} width={s} height={s} fill={PAPER} />;
            })}
          </g>
        </g>
      </svg>
      {f < b(4.35) ? <Flight trace at={dotAt} f={f} r={dotR} ink={INK} /> : <Disc x={sx(DOT.cx)} y={sy(DOT.cy)} r={dotR} />}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g opacity={keepRulers}><Rulers sx={sx} sy={sy} S={S} tx={tx} ty={ty} t={ramp(f, b(0.5), b(1.2), calm)} /></g>
        {W_DIMS.map((d, i) => {
          const a: P = [sx(d.a[0]), sy(d.a[1])], e: P = [sx(d.b[0]), sy(d.b[1])];
          return <g key={i} opacity={keepDims * (d.at >= 4 ? closeUp : 1)}><Dim a={a} b={e} off={d.off} value={d.v} t={ramp(f, b(d.at), b(d.at) + DIM_DRAW, calm)} ink={INK} paper={PAPER} labelAt={d.out ? [e[0] + d.out[0], (a[1] + e[1]) / 2] : undefined} /></g>;
        })}
        {W_LEADS.map((l, i) => {
          const p: P = [sx(l.p[0]), sy(l.p[1])];
          return <g key={i} opacity={keepDims * (l.at >= 4 ? closeUp : 1)}><Lead p={p} to={[p[0] + l.d[0], p[1] + l.d[1]]} text={l.text} t={ramp(f, b(l.at), b(l.at) + 18)} ink={INK} paper={PAPER} /></g>;
        })}
        <Txt x={96} y={1030} ink={DIM} paper={PAPER} anchor="start" opacity={keepRulers * ramp(f, b(1), b(1.4))}>{`zoom ${Math.round((S / uBase) * 100)}%   x ${tx.toFixed(3)}   y ${ty.toFixed(3)}`}</Txt>
        <Txt x={W - 96} y={1030} ink={DIM} paper={PAPER} anchor="end" opacity={keepRulers * ramp(f, b(1), b(1.4))}>viewBox 0.5 0 100 100</Txt>
      </svg>
      <div style={{ position: 'absolute', left: CX - RING_SIZE / 2, top: CY - RING_SIZE / 2, opacity: solid }}><Mark size={RING_SIZE} ink={INK} /></div>
    </Stage>
  );
};

const DOT_AT = (size: number) => ({ x: CX + (DOT.cx - 50.5) * (size / 100), y: CY + (DOT.cy - 50) * (size / 100), r: DOT.r * (size / 100) });

// logo + REUI, centred; letters settle one by one, the way the brand's own logo build does
const LOCK_U = 3;
const Lockup: React.FC<{ ink: string; letters: number; noMark?: boolean; noDot?: boolean }> = ({ ink, letters, noMark, noDot }) => {
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
const Landing: React.FC<{ ink: string; f: number; from: number; dur?: number }> = ({ ink, f, from, dur = T }) => {
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

/* 32-36. The beat arrives: the wordmark's four real letters, each as drawn and as finished, one per beat. */
const LETTER_BOX: [number, number, number][] = [[130.5, 159.175, 68.173], [173.312, 197.886, 68.173], [213.928, 244.077, 68.688], [260.402, 268.091, 68.173]];
const LET_U = 17.5;
const letterPt = (i: number, x: number, y: number): P => [CX - 400 + (x - (LETTER_BOX[i][0] + LETTER_BOX[i][1]) / 2) * LET_U, CY + (y - 50) * LET_U];
const outerOf = (d: string) => d.slice(0, d.indexOf('Z') + 1);
const contours = new Map<number, { el: SVGPathElement; len: number }>();
// a point on the letter's outer contour, read from the path itself (the browser measures it, in Studio and in render)
const contourPt = (i: number, t: number): P => {
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
const letterT = (lf: number) => ramp(lf, 1, T - 2, calm);
const lettersAt = (g: number): P => {
  const i = Math.max(0, Math.min(3, Math.floor(g / T)));
  const lf = g - b(i), p = contourPt(i, letterT(lf));
  if (i === 0) return p;
  const prev = contourPt(i - 1, 1), s = ramp(lf, 0, 6, out);
  return [mix(prev[0], p[0], s), mix(prev[1], p[1], s)];
};
const Letters: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(3, Math.floor(f / T));
  const [x0, x1, y1] = LETTER_BOX[i];
  const lf = f - b(i);
  const u = 17.5;
  const gx = (x0 + x1) / 2;
  const nodes = pathNodes(LETTERS[i]);
  const place = (px: number) => `translate(${px} ${CY}) scale(${u}) translate(${-gx} -50)`;
  const hair = 1.8 / u;
  return (
    <Stage>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g transform={place(CX - 400)} fill="none" stroke={INK} strokeWidth={hair}>
          <path d={outerOf(LETTERS[i])} pathLength={1} strokeDasharray={`${letterT(lf)} 1`} />
          {LETTERS[i].length > outerOf(LETTERS[i]).length && <path d={LETTERS[i].slice(outerOf(LETTERS[i]).length)} pathLength={1} strokeDasharray={`${letterT(lf)} 1`} />}
          {nodes.handles.map(([a, c, e, g], k) => <line key={k} x1={a} y1={c} x2={e} y2={g} opacity={0.45} />)}
          {nodes.points.map(([x, y], k) => <rect key={k} x={x - 0.17} y={y - 0.17} width={0.34} height={0.34} fill={PAPER} />)}
        </g>
        <g transform={place(CX + 400)}><path d={LETTERS[i]} fill={INK} /></g>
        {(() => {
          const sx = (x: number) => CX - 400 + (x - gx) * u, sy = (y: number) => CY + (y - 50) * u;
          const t = ramp(lf, 2, 15, calm);
          const hx = CX + 400 + (x0 - gx) * u;
          return (
            <>
              <Dim a={[sx(x0), sy(y1)]} b={[sx(x0), sy(31.809)]} off={-56} value={y1 - 31.809} t={t} ink={INK} paper={PAPER} />
              <Dim a={[sx(x0), sy(y1)]} b={[sx(x1), sy(y1)]} off={46} value={x1 - x0} t={t} ink={INK} paper={PAPER} />
              <Lead p={[hx, sy(31.809)]} to={[hx, sy(31.809) - 56]} text={`x ${x0.toFixed(3)}`} t={ramp(lf, 4, 18)} ink={INK} paper={PAPER} />
            </>
          );
        })()}
      </svg>
      <Wipe f={f} at={b(4)} color={INK} />
      <Flight trace at={lettersAt} f={f} r={10} ink={f >= b(4) - WIPE ? LIGHT_INK : INK} tail={16} invert={f >= b(4) - WIPE} />
    </Stage>
  );
};

/* 36-44. Real primitive names from reui.io/llms.txt. Two with their real components beside them, then a fast run. */
const WITH_UI: { name: string; dir: 'grid' | 'dash' | 'flow' | 'calendar'; dark: boolean; n: number; dims: { at: number; a: P; b: P; off: number; v: number }[] }[] = [
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
/* A real mouse on the real component (rec/live.mjs): the frames play its own behaviour, the logo's dot is the cursor,
   and its DOM boxes are measured around it. */
const liveEnd = (it: (typeof WITH_UI)[number]): P => { // where the cursor finishes, push included
  const meta = LIVE[it.dir], k = (W - 2 * 96) / meta.clip.width, a = meta.frames[it.n - 1], p = 1.035;
  return [CX + (96 + a.x * k - CX) * p, 432 + (356 + a.y * k - 432) * p];
};
const Live: React.FC<{ it: (typeof WITH_UI)[number]; lf: number; from: P; wipeTo?: string; home?: { at: P; r: number }; end?: number }> = ({ it, lf, from, wipeTo, home, end = T * 3 }) => {
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
/* 36-40. The two names with UI, with only a few of their numbers. */
const pickDims = (it: (typeof WITH_UI)[number], keep: number[]) => ({ ...it, dims: keep.map((i) => it.dims[i]) });
const NAMES_UI: (typeof WITH_UI)[number][] = [
  pickDims(WITH_UI[0], [0, 2, 12]),
  pickDims(WITH_UI[1], [0, 1, 8]),
];
const LiveRun: React.FC<{ items: (typeof WITH_UI)[number][]; from: () => P; home?: { at: P; r: number; bg: string } }> = ({ items, from, home }) => {
  const f = useCurrentFrame();
  const i = Math.min(items.length - 1, Math.floor(f / b(3))), it = items[i], next = items[i + 1];
  return <Stage bg={it.dark ? INK : PAPER}><Live it={it} lf={f - b(i * 3)} from={i === 0 ? from() : liveEnd(items[i - 1])} wipeTo={next ? undefined : home?.bg} home={i === items.length - 1 ? home : undefined} end={next ? T * 3 : T * 4} /></Stage>;
};
const FINAL_DOT = DOT_AT(540);
/* 52-60. The dot is the logo's dot. U and ring draw from it, the logo lands, the letters settle, and it holds. */
const RING_LINE = 'M50.5 1.923H67.167A31.41 31.41 0 0 1 98.577 33.333V66.667A31.41 31.41 0 0 1 67.167 98.077H33.833A31.41 31.41 0 0 1 2.423 66.667V33.333A31.41 31.41 0 0 1 33.833 1.923Z';
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const drawU = ramp(f, b(0.5), b(1.5), calm);
  const drawR = ramp(f, b(0.75), b(2.5), calm);
  const land = b(4) - Math.round(T * 1.125); // the last letter settles on the slam, beat 56
  const size = 540;
  if (f < land) {
    return (
      <Stage>
        <svg width={size} height={size} viewBox={VB} style={{ position: 'absolute', left: CX - size / 2, top: CY - size / 2, overflow: 'visible' }}>
          {drawR > 0 && <path d={RING_LINE} fill="none" stroke={INK} strokeOpacity={0.2} strokeWidth={3.846} pathLength={1} strokeDasharray={`${drawR} 1`} />}
          {drawU > 0 && <path d={U_LINE} fill="none" stroke={INK} strokeWidth={U_STROKE} strokeLinecap="round" pathLength={1} strokeDasharray={`${drawU} 1`} />}
          <circle {...DOT} fill={INK} />
        </svg>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 1 - ramp(f, b(2), b(2.5), calm) }}>
          <Lead p={[FINAL_DOT.x, FINAL_DOT.y]} to={[FINAL_DOT.x + 170, FINAL_DOT.y - 90]} text="70.634, 29.698" t={ramp(f, 0, b(0.5))} ink={INK} paper={PAPER} />
          <Lead p={[FINAL_DOT.x + FINAL_DOT.r, FINAL_DOT.y]} to={[FINAL_DOT.x + 170, FINAL_DOT.y + 30]} text="r 4.698" t={ramp(f, b(0.5), b(1))} ink={INK} paper={PAPER} />
        </svg>
      </Stage>
    );
  }
  return (
    <Stage>
      <Landing ink={INK} f={f - land} from={size} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', font: `500 44px ${FONT}`, letterSpacing: TRACK, color: INK, opacity: ramp(f, b(4), b(4.5), out) }}>{LINE}</div>
      <Domain />
    </Stage>
  );
};

/* The website as an object, minimal (Vercel Ship 2024): one element at a time, tilted macro, shallow focus.
   The dot passes through the headline and its letters break into dots around it, then it clicks the nav's real toggle. */
type Cam = { s: number; ax: number; ay: number; rx: number; rz: number };
const SITE_P = 1400; // perspective
const camMix = (a: Cam, c: Cam, t: number): Cam => ({ s: mix(a.s, c.s, t), ax: mix(a.ax, c.ax, t), ay: mix(a.ay, c.ay, t), rx: mix(a.rx, c.rx, t), rz: mix(a.rz, c.rz, t) });
const FLAT: Cam = { s: 1.2, ax: 800, ay: 450, rx: 0, rz: 0 };
const sb = (n: number) => b(40 + n) - b(40); // this shot's beat n, kept on the film's beat grid: 8 is the film's beat 48
const project = (c: Cam, [x, y]: P): P => {
  const x0 = (x - c.ax) * c.s, y0 = (y - c.ay) * c.s, rx = (c.rx * Math.PI) / 180, rz = (c.rz * Math.PI) / 180;
  const y1 = y0 * Math.cos(rx), z = y0 * Math.sin(rx), k = SITE_P / (SITE_P - z);
  return [CX + (x0 * Math.cos(rz) - y1 * Math.sin(rz)) * k, CY + (x0 * Math.sin(rz) + y1 * Math.cos(rz)) * k];
};
const OBJ_Q = 4; // laid out at the still's full size and scaled down: Chrome rasters a perspective layer at its layout size, so 1600 px wide would go soft
const PlaneBox: React.FC<{ c: Cam; x?: number; y?: number; w: number; h: number; q: number; children: React.ReactNode }> = ({ c, x = 0, y = 0, w, h, q, children }) => (
  <AbsoluteFill style={{ perspective: SITE_P, perspectiveOrigin: `${CX}px ${CY}px` }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: w * q, height: h * q, transformOrigin: '0 0', transform: `translate(${CX}px, ${CY}px) rotateZ(${c.rz}deg) rotateX(${c.rx}deg) scale(${c.s / q}) translate(${(x - c.ax) * q}px, ${(y - c.ay) * q}px)` }}>{children}</div>
  </AbsoluteFill>
);
const planeImg: React.CSSProperties = { display: 'block', width: '100%', height: '100%', maxWidth: 'none' };
const O_WORD = OBJ_META.words['Design-forward'], O_MCP = OBJ_META.words['MCP fluency'], O_CTA = OBJ_META.cta, O_MOON = OBJ_META.moon;
const O_MID = (r: { x: number; y: number; w: number; h: number }): P => [r.x + r.w / 2, r.y + r.h / 2];
const macro = (r: { x: number; y: number; w: number; h: number }, s: number, rz: number, drift: number): [Cam, Cam] => [
  { s, ax: O_MID(r)[0] - drift, ay: O_MID(r)[1], rx: 42, rz }, { s: s * 1.06, ax: O_MID(r)[0] + drift, ay: O_MID(r)[1], rx: 42, rz },
];
const O_HEAD = macro(O_WORD, 5, -15, 60), O_MCP_C = macro(O_MCP, 5.6, 12, 26), O_CTA_C = macro(O_CTA, 7, -15, 9), O_MOON_C = macro(O_MOON, 18, 12, 2);
const O_DARK = sb(8);
const objCam = (g: number): Cam => {
  if (g < sb(4)) return camMix(camMix(FLAT, O_HEAD[0], ramp(g, sb(1), sb(2), calm)), O_HEAD[1], ramp(g, sb(2), sb(4), calm));
  if (g < sb(5.5)) return camMix(O_MCP_C[0], O_MCP_C[1], ramp(g, sb(4), sb(5.5), calm));
  if (g < sb(7)) return camMix(O_CTA_C[0], O_CTA_C[1], ramp(g, sb(5.5), sb(7), calm));
  // holds on the toggle after the click, then the site opens out around it: scale first, the frame travels last
  const m = camMix(O_MOON_C[0], O_MOON_C[1], ramp(g, sb(7), O_DARK, calm)), t = ramp(g, sb(8.5), sb(10), calm), far = t * t * t;
  return { ...camMix(m, FLAT, t), s: Math.exp(mix(Math.log(m.s), Math.log(FLAT.s), t)), ax: mix(m.ax, FLAT.ax, far), ay: mix(m.ay, FLAT.ay, far) };
};
const objDotPage = (g: number): P => {
  if (g < sb(4)) return [mix(O_WORD.x + 6, O_WORD.x + O_WORD.w - 6, ramp(g, sb(2), sb(4), calm)), O_MID(O_WORD)[1]];
  if (g < sb(5.5)) return [O_MCP.x + O_MCP.w + 8, O_MCP.y + O_MCP.h + 8]; // rests just past the word, under the line
  if (g < sb(7)) return [O_MID(O_CTA)[0], O_CTA.y + O_CTA.h + 7]; // just under the button
  return O_MID(O_MOON);
};
const fly = (from: P, to: P, t: number): P => [mix(from[0], to[0], t), mix(from[1], to[1], t)];
const objTour = (g: number, from: P): P => {
  let at = project(objCam(g), objDotPage(g));
  if (g < sb(0.5)) at = fly(from, at, ramp(g, 0, sb(0.5), out));
  for (const cut of [sb(4), sb(5.5), sb(7)]) if (g >= cut && g < cut + T / 4) at = fly(project(objCam(cut - 1), objDotPage(cut - 1)), at, ramp(g, cut, cut + T / 4, out));
  return at;
};
// paper-coloured halftone over the type: around the dot the letters turn to dots, and close to it they are gone
const OBJ_GRID = 4, OBJ_R = 22;
const Dissolve: React.FC<{ c: Cam; at: P }> = ({ c, at }) => {
  const p = OBJ_META.patch.head, dots: React.ReactNode[] = [];
  for (let y = Math.floor((at[1] - OBJ_R) / OBJ_GRID) * OBJ_GRID; y <= at[1] + OBJ_R; y += OBJ_GRID) {
    for (let x = Math.floor((at[0] - OBJ_R) / OBJ_GRID) * OBJ_GRID; x <= at[0] + OBJ_R; x += OBJ_GRID) {
      const d = Math.hypot(x - at[0], y - at[1]) / OBJ_R;
      if (d >= 1) continue;
      const jitter = 0.65 + 0.35 * Math.abs(Math.sin(x * 12.9898 + y * 78.233));
      dots.push(<circle key={`${x}.${y}`} cx={x} cy={y} r={3 * Math.pow(1 - d, 0.6) * (d < 0.45 ? 1 : jitter)} fill={PAPER} />);
    }
  }
  return <PlaneBox c={c} x={p.x} y={p.y} w={p.width} h={p.height} q={p.q}><svg viewBox={`${p.x} ${p.y} ${p.width} ${p.height}`} width="100%" height="100%" style={{ display: 'block' }}>{dots}</svg></PlaneBox>;
};
const objPatch = (n: 'head' | 'nav', file: string, c: Cam) => {
  const p = OBJ_META.patch[n];
  return <PlaneBox c={c} x={p.x} y={p.y} w={p.width} h={p.height} q={p.q}><Img src={staticFile(`cap/site-object/${file}.jpg`)} style={planeImg} /></PlaneBox>;
};
// the page and its macro patches, in focus across one band only while tilted; children sit on the page
const ObjPlane: React.FC<{ g: number; c: Cam; children?: React.ReactNode }> = ({ g, c, children }) => {
  const dark = g >= O_DARK;
  const page = <><PlaneBox c={c} w={OBJ_META.page.width} h={OBJ_META.page.height} q={OBJ_Q}><Img src={staticFile(`cap/site-object/${dark ? 'dark' : 'light'}.jpg`)} style={planeImg} /></PlaneBox>{children}</>;
  const focus = c.rx / 42;
  const band = `linear-gradient(${180 + c.rz}deg, transparent 16%, #000 40%, #000 60%, transparent 84%)`;
  return (
    <>
      {focus > 0.01 && <AbsoluteFill style={{ filter: `blur(${(14 * focus).toFixed(2)}px)` }}>{page}</AbsoluteFill>}
      <AbsoluteFill style={focus > 0.01 ? { maskImage: band, WebkitMaskImage: band } : undefined}>
        {page}
        {g < sb(5.5) && objPatch('head', 'head', c)}
        {g >= sb(2) && g < sb(4) && <Dissolve c={c} at={objDotPage(g)} />}
        {g >= sb(5.5) && g < sb(10) && objPatch('nav', dark ? 'nav-dark' : 'nav', c)}
      </AbsoluteFill>
    </>
  );
};
const objPressed = (g: number) => (g >= O_DARK ? 1 - ramp(g, O_DARK, O_DARK + T / 4, out) : 0);
/* 20-32. The logo zooms out and is the site's own nav logo, a fast tour follows, and the toggle's click lands on the slam,
   beat 28. The camera goes back in, to the R of the nav's own wordmark, so the spelling of REUI still lands on the music's turn,
   beat 32. */
const NAV_LOGO = { x: 39.625, y: 27.375, size: 30.75 }; // the nav logo's box on the page, measured off the still
const NAV_DOT: P = [NAV_LOGO.x + ((DOT.cx - 50.5) * NAV_LOGO.size) / 100, NAV_LOGO.y + ((DOT.cy - 50) * NAV_LOGO.size) / 100];
const NAV_R = (DOT.r * NAV_LOGO.size * FLAT.s) / 100;
const NAV_U = NAV_LOGO.size / 100; // page px per logo unit
const R_CAM: Cam = { s: LET_U / NAV_U, ax: NAV_LOGO.x - NAV_LOGO.size / 2 + (400 + ((LETTER_BOX[0][0] + LETTER_BOX[0][1]) / 2 - 0.5) * LET_U) / (LET_U / NAV_U), ay: NAV_LOGO.y, rx: 0, rz: 0 }; // the nav's R exactly where the Letters shot draws it
const LS = (n: number) => b(20 + n) - b(20);
const L_OUT = LS(1.5), L_TOUR = LS(3), L_IN = LS(10), L_LAND = LS(11.5);
// [film beat, the tour's own beat]: the same tour, played faster
const WARP = [[23, 0], [23.5, 1], [24.5, 2], [25.5, 4], [26.5, 5.5], [27, 7], [28, 8], [28.5, 8.5], [29.5, 10]];
const tourG = (f: number) => interpolate(f, WARP.map(([n]) => LS(n - 20)), WARP.map(([, n]) => sb(n)), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
// scale first, the frame travels last, so the logo stays centred while it shrinks
const logoCam = (t: number): Cam => {
  const far = t * t; // early enough that the page's left edge is out of frame before the page fades in
  return { s: Math.exp(mix(Math.log(RING_SIZE / NAV_LOGO.size), Math.log(FLAT.s), t)), ax: mix(NAV_LOGO.x, FLAT.ax, far), ay: mix(NAV_LOGO.y, FLAT.ay, far), rx: 0, rz: 0 };
};
// going in, the frame travels first
const rCam = (t: number): Cam => {
  const near = 1 - Math.pow(1 - t, 3);
  return { s: Math.exp(mix(Math.log(FLAT.s), Math.log(R_CAM.s), t)), ax: mix(FLAT.ax, R_CAM.ax, near), ay: mix(FLAT.ay, R_CAM.ay, near), rx: 0, rz: 0 };
};
const lsCam = (f: number): Cam => (f < L_TOUR ? logoCam(ramp(f, L_OUT, L_TOUR, calm)) : f < L_IN ? objCam(tourG(f)) : rCam(ramp(f, L_IN, L_LAND, calm)));
const lsDot = (g: number): P => {
  const nav = project(FLAT, NAV_DOT), e = contourPt(0, 0);
  const start: P = [R_CAM.ax + (e[0] - CX) / R_CAM.s, R_CAM.ay + (e[1] - CY) / R_CAM.s]; // the R's first point, on the page
  return fly(objTour(tourG(Math.min(g, L_IN)), nav), project(lsCam(g), start), ramp(g, L_IN, L_IN + T / 2, calm));
};
const LogoSite: React.FC = () => {
  const f = useCurrentFrame();
  const g = tourG(f), c = lsCam(f), touring = f >= L_TOUR && f < L_IN, dark = g >= O_DARK;
  const pageOp = f < L_TOUR ? clamp01((ramp(f, L_OUT, L_TOUR, calm) - 0.35) / 0.25) : 1 - clamp01((ramp(f, L_IN, L_LAND, calm) - 0.4) / 0.3);
  const [lx, ly] = project(c, [NAV_LOGO.x, NAV_LOGO.y]), size = NAV_LOGO.size * c.s, ink = dark ? LIGHT_INK : INK;
  const r = mix(NAV_R, 10 * (1 - 0.35 * objPressed(g)), ramp(f, L_TOUR, L_TOUR + T / 4, out));
  return (
    <Stage bg={dark ? INK : PAPER}>
      {pageOp > 0 && (
        <AbsoluteFill style={{ opacity: pageOp }}>
          <ObjPlane g={g} c={c}>
            {/* the page's own logo gives up its dot while the dot is out touring */}
            {touring && <PlaneBox c={c} x={NAV_DOT[0] - 2} y={NAV_DOT[1] - 2} w={4} h={4} q={1}><div style={{ width: '100%', height: '100%', borderRadius: '50%', background: dark ? INK : PAPER }} /></PlaneBox>}
          </ObjPlane>
        </AbsoluteFill>
      )}
      {!touring && <div style={{ position: 'absolute', left: lx - size / 2, top: ly - size / 2 }}><Mark size={size} ink={ink} parts={f < L_TOUR ? undefined : ['ring', 'u']} /></div>}
      {f >= L_IN && (
        <svg width={size * 2.68} height={size} viewBox="0.5 0 268 100" style={{ position: 'absolute', left: lx - size / 2, top: ly - size / 2, overflow: 'visible' }}>
          {LETTERS.map((d, i) => <path key={i} d={d} fill={ink} />)}
        </svg>
      )}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 1 - ramp(f, L_OUT, LS(2), calm) }}>
        {f < LS(2) && <Txt x={CX} y={905} ink={DIM} paper={PAPER}>{'#0a0a0a on #ffffff'.slice(0, Math.ceil(ramp(f, 4, 30, typing) * 18))}</Txt>}
      </svg>
      <Wipe f={f} at={LS(12)} color={PAPER} />
      {f >= L_TOUR && <Flight trace invert at={lsDot} f={f} r={r} ink={LIGHT_INK} tail={14} />}
    </Stage>
  );
};

/* 48-52. The kick stops. One mark, a new way of drawing it on every beat, the dot never changing: as its own path data, as halftone,
   filled with reui.io's neutrals, and as the lines Final goes on to draw it from. */
const OUTER = 'M33.833 1.923H67.167A31.41 31.41 0 0 1 98.577 33.333V66.667A31.41 31.41 0 0 1 67.167 98.077H33.833A31.41 31.41 0 0 1 2.423 66.667V33.333A31.41 31.41 0 0 1 33.833 1.923Z'; // the ring's centre line, closed
const PATH_TEXT = (RING_D + U_D).repeat(4);
const HT_GRID = Array.from({ length: 42 * 42 }, (_, i) => [0.5 + 1.2 + (i % 42) * 2.4, 1.2 + Math.floor(i / 42) * 2.4]);
const LookSvg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={RING_SIZE} height={RING_SIZE} viewBox={VB} style={{ position: 'absolute', left: CX - RING_SIZE / 2, top: CY - RING_SIZE / 2, overflow: 'visible' }}>{children}</svg>
);
const HOLE = (id: string, inner: React.ReactNode) => <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="101" height="100">{inner}</mask>;
const LOOKS: { bg: string; dot: string; look: React.ReactNode }[] = [
  { bg: INK, dot: LIGHT_INK, look: (
    <LookSvg>
      <defs>{HOLE('look-text', <><path d={OUTER} fill="#fff" /><path d={U_D} fill="#000" /><circle cx={DOT.cx} cy={DOT.cy} r={DOT.r + 1.4} fill="#000" /></>)}</defs>
      <g mask="url(#look-text)" fill={LIGHT_INK} fontFamily={MONO} fontSize={1.85} opacity={0.9}>
        {Array.from({ length: 46 }, (_, i) => <text key={i} x={0.5} y={2.2 * (i + 1)} textLength={100} lengthAdjust="spacing">{PATH_TEXT.slice(i * 70, i * 70 + 90)}</text>)}
      </g>
    </LookSvg>
  ) },
  { bg: PAPER, dot: INK, look: (
    <LookSvg>
      <defs>
        {HOLE('look-ht-u', <path d={U_D} fill="#fff" />)}
        {HOLE('look-ht-in', <><path d={OUTER} fill="#fff" /><path d={U_D} fill="#000" /></>)}
      </defs>
      <g fill={INK}>
        <g mask="url(#look-ht-in)">{HT_GRID.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.34} />)}</g>
        <g mask="url(#look-ht-u)">{HT_GRID.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.08} />)}</g>
      </g>
    </LookSvg>
  ) },
  { bg: PAPER, dot: INK, look: (
    <LookSvg>
      <g fill="none" stroke={INK} strokeWidth={0.3}><path d={OUTER} /><path d={U_LINE} /><path d={U_D} strokeOpacity={0.45} />
        {pathNodes(U_D).handles.map(([a, c, e, g], i) => <line key={i} x1={a} y1={c} x2={e} y2={g} opacity={0.45} />)}
      </g>
    </LookSvg>
  ) },
];
const LogoSwap: React.FC = () => {
  const f = useCurrentFrame();
  const it = LOOKS[Math.min(LOOKS.length - 1, Math.floor(f / b(1)))], d = DOT_AT(RING_SIZE), home = ramp(f, b(2.5), b(3), calm);
  return (
    <Stage bg={it.bg}>
      {it.look}
      {f < b(2.5) && <Disc x={d.x} y={d.y} r={d.r} color={it.dot} />}
      <Wipe f={f} at={b(3)} color={PAPER} />
      {f >= b(2.5) && <Flight trace invert at={(g) => fly([d.x, d.y], [FINAL_DOT.x, FINAL_DOT.y], ramp(g, b(2.5), b(3), calm))} f={f} r={mix(d.r, FINAL_DOT.r, home)} ink={LIGHT_INK} tail={14} />}
    </Stage>
  );
};

/* Two more real blocks straight after Dashboard, made the same way: a real mouse on flow-1 and event-calendar-1
   (rec/block-live.mjs), boxes measured from their DOM. */
const BLOCK_UI: (typeof WITH_UI)[number][] = [
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
const AllBlocks: React.FC = () => {
  const d = DOT_AT(RING_SIZE);
  return <LiveRun items={[...NAMES_UI, ...BLOCK_UI]} from={() => contourPt(3, 1)} home={{ at: [d.x, d.y], r: d.r, bg: INK }} />;
};

// [sound, hit frame, volume], pinned by each sound's peak (public/sfx/meta.json). ElevenLabs set, sound read off amihai's
// film: sparse 808s, dry cracks, near silence between hits.
const PEAK: Record<string, number> = { impact: 0.005, slam: 0 };
// Only the big moments, the music carries them.
const SHOTS: [number, number, React.FC][] = [
  [0, 8, Caret], [8, 11, Opening], [11, 20, Construct], [20, 32, LogoSite], [32, 36, Letters], [36, 49, AllBlocks], [49, 52, LogoSwap], [52, 60, Final],
];
const HITS: [string, number, number][] = [['impact', b(8), 0.55], ['slam', b(20), 0.7], ['slam', b(28), 0.8], ['impact', b(32), 0.6], ['impact', b(36), 0.6], ['impact', b(49), 0.7], ['slam', b(56), 0.9]];
const BED_FROM = 2980; // 49.67 s, on the kick
const BED_VOL = 0.62;

// The whole frame takes each kick, until the track's kick stops on story beat 48.
// long holds stay still: the opening line, the logo, the flat site, each block once it settles
const STILL = [[3.5, 6], [20, 21.5], [38, 39], [41, 42], [44, 45], [47, 49]];
const KickBump: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useRealFrame();
  const kick = f < real(49) && !STILL.some(([a, c]) => f >= real(a) && f < real(c)) ? Math.pow(1 - (f % T) / T, 3) : 0; // one kick lasts T film frames, since SLOW is 2
  return <AbsoluteFill style={{ transform: `scale(${1 + 0.008 * kick})` }}>{children}</AbsoluteFill>;
};

export const Refreshed: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    <KickBump>
      {SHOTS.map(([from, to, Shot], i) => <Sequence key={i} from={real(from)} durationInFrames={real(to) - real(from)} premountFor={30}><Shot /></Sequence>)}
    </KickBump>
    {/* Pixel Lattice from 96 music beats in, on a phrase turn, uncut after that: phrases turn on story beats 16 and 32, the
        kick stops for good on 48, and the track ends on its own on 56, under the last slam */}
    <Audio src={staticFile('audio/pixel-lattice.wav')} startFrom={BED_FROM}
      volume={(f) => BED_VOL * interpolate(f, [real(11), real(12), real(19), real(20)], [1, 0.75, 0.75, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
    {HITS.map(([name, at, vol], i) => (
      <Sequence key={i} from={Math.max(0, Math.round(at * SLOW - (PEAK[name] ?? 0) * FPS))} durationInFrames={60}><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} /></Sequence>
    ))}
  </AbsoluteFill>
);
