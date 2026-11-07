import React from 'react';
import { CX, CY, Dim, Disc, H, INK, PAPER, RING_SIZE, Stage, W, b, calm, mix, ramp, useCurrentFrame } from '../lib';

/* ring, 3 beats. The dot opens into a disc, the disc empties to a line, the line squares up into the logo's ring. */
export const Opening: React.FC = () => {
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
