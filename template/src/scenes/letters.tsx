import React from 'react';
import { LETTERS } from '../logo';
import { CX, CY, Dim, Flight, H, INK, LETTER_BOX, LIGHT_INK, Lead, PAPER, Stage, T, W, WIPE, Wipe, b, calm, letterT, lettersAt, outerOf, pathNodes, ramp, useCurrentFrame, useNext } from '../lib';

/* letters, one beat per letter. The wordmark's real letters, each as drawn and as finished, one per beat. */
export const Letters: React.FC = () => {
  const f = useCurrentFrame(), next = useNext();
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
      <Wipe f={f} at={b(4)} color={next.bg} />
      <Flight trace at={lettersAt} f={f} r={10} ink={f >= b(4) - WIPE ? LIGHT_INK : INK} tail={16} invert={f >= b(4) - WIPE} />
    </Stage>
  );
};
