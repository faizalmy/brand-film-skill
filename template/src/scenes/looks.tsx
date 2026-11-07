import React from 'react';
import { DOT, RING_D, U_D, U_LINE, VB } from '../logo';
import { CX, CY, DOT_AT, Disc, FINAL_DOT, Flight, INK, LIGHT_INK, MONO, PAPER, RING_SIZE, Stage, Wipe, b, calm, fly, mix, pathNodes, ramp, useCurrentFrame, useNext } from '../lib';

/* looks, one beat per look. The kick stops. One mark, a new way of drawing it on every beat, the dot never changing: as its own path data, as halftone,
   filled with reui.io's neutrals, and as the lines Final goes on to draw it from. */
export const OUTER = 'M33.833 1.923H67.167A31.41 31.41 0 0 1 98.577 33.333V66.667A31.41 31.41 0 0 1 67.167 98.077H33.833A31.41 31.41 0 0 1 2.423 66.667V33.333A31.41 31.41 0 0 1 33.833 1.923Z'; // the ring's centre line, closed
export const PATH_TEXT = (RING_D + U_D).repeat(4);
export const HT_GRID = Array.from({ length: 42 * 42 }, (_, i) => [0.5 + 1.2 + (i % 42) * 2.4, 1.2 + Math.floor(i / 42) * 2.4]);
export const LookSvg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={RING_SIZE} height={RING_SIZE} viewBox={VB} style={{ position: 'absolute', left: CX - RING_SIZE / 2, top: CY - RING_SIZE / 2, overflow: 'visible' }}>{children}</svg>
);
export const HOLE = (id: string, inner: React.ReactNode) => <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="101" height="100">{inner}</mask>;
export const LOOKS: { bg: string; dot: string; look: React.ReactNode }[] = [
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
export const LogoSwap: React.FC = () => {
  const f = useCurrentFrame(), next = useNext();
  const it = LOOKS[Math.min(LOOKS.length - 1, Math.floor(f / b(1)))], d = DOT_AT(RING_SIZE), home = ramp(f, b(2.5), b(3), calm);
  return (
    <Stage bg={it.bg}>
      {it.look}
      {f < b(2.5) && <Disc x={d.x} y={d.y} r={d.r} color={it.dot} />}
      <Wipe f={f} at={b(3)} color={next.bg} />
      {f >= b(2.5) && <Flight trace invert at={(g) => fly([d.x, d.y], [FINAL_DOT.x, FINAL_DOT.y], ramp(g, b(2.5), b(3), calm))} f={f} r={mix(d.r, FINAL_DOT.r, home)} ink={LIGHT_INK} tail={14} />}
    </Stage>
  );
};
