import React from 'react';
import { DOT, Mark, RING_D, U_D, U_LINE, U_STROKE, uPoint } from '../logo';
import { CX, CY, DIM, DIM_DRAW, Dim, Disc, Flight, H, INK, Lead, NODES, P, PAPER, RING_NODES, RING_SIZE, Stage, Txt, W, b, calm, clamp01, mix, ramp, useCurrentFrame } from '../lib';

/* construct, 9 beats. The mark drawn from its own numbers: every line here comes from logo.tsx's paths, none is decoration.
   Flat only. It resolves to the solid logo within a beat. */
export const GUIDE_X = [0.5, 4.346, 25.668, 35.064, 65.936, 75.332, 96.654, 100.5];
export const GUIDE_Y = [0, 3.846, 25, 65.604, 75, 96.154, 100];
export const CIRCLES: [number, number, number][] = [
  [33.833, 33.333, 33.333], [67.167, 33.333, 33.333], [33.833, 66.667, 33.333], [67.167, 66.667, 33.333],
  [43.789, 56.879, 18.121], [43.789, 56.879, 8.725], [57.212, 56.879, 18.121], [57.212, 56.879, 8.725],
  [30.366, 29.698, 4.698], [70.634, 43.59, 4.698],
];
export const W_DIMS: { at: number; a: P; b: P; off?: number; v: number; out?: P }[] = [
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
export const circlePt = (cx: number, cy: number, r: number, deg: number): P => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
export const W_LEADS: { at: number; p: P; d: P; text: string }[] = [
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
export const Rulers: React.FC<{ sx: (x: number) => number; sy: (y: number) => number; S: number; tx: number; ty: number; t: number }> = ({ sx, sy, S, tx, ty, t }) => {
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
export const Construct: React.FC = () => {
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
