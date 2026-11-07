import React from 'react';
import { DOT, U_LINE, U_STROKE, VB } from '../logo';
import { CX, CY, Domain, FINAL_DOT, FONT, H, INK, LINE, Landing, Lead, PAPER, Stage, T, TRACK, W, b, calm, out, ramp, useCurrentFrame } from '../lib';

/* final, 8 beats. The dot is the logo's dot. U and ring draw from it, the logo lands, the letters settle, and it holds. */
export const RING_LINE = 'M50.5 1.923H67.167A31.41 31.41 0 0 1 98.577 33.333V66.667A31.41 31.41 0 0 1 67.167 98.077H33.833A31.41 31.41 0 0 1 2.423 66.667V33.333A31.41 31.41 0 0 1 33.833 1.923Z';
export const Final: React.FC = () => {
  const f = useCurrentFrame();
  const drawU = ramp(f, b(0.5), b(1.5), calm);
  const drawR = ramp(f, b(0.75), b(2.5), calm);
  const land = b(4) - Math.round(T * 1.125); // the last letter settles on the slam, the scene's beat 4
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
