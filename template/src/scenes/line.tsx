import React from 'react';
import { Easing } from 'remotion';
import { CX, CY, DIM, DOMAIN, FONT, Flight, INK, LINE, P, Stage, T, TRACK, b, mix, out, ramp, useCurrentFrame } from '../lib';

/* line, 8 beats. The logo's dot flies in on a thin line and becomes the caret. It types the brand's own line, the domain types
   under it, then both go back. */
export const caretPath = (f: number): P => {
  const t = ramp(f, -b(0.25), b(1), Easing.bezier(0.3, 0, 0.25, 1)), m = 1 - t; // already on screen on frame 0
  return [m * m * -60 + 2 * m * t * 500 + t * t * CX, m * m * 880 + 2 * m * t * 1040 + t * t * CY];
};
// A word lands big on its kick, drops to line size on the next kick, and collapses to nothing on its way out.
export const LINE_WORDS = LINE.split(' ');
export const WORD_AT = LINE_WORDS.map((_, i) => b(1 + i * 0.5));
export const WORD_OUT = [b(7.5), b(7.5), b(7), b(7), b(6.5)];
export const wordSize = (f: number, at: number, exit: number) => (f < at ? 0 : mix(mix(2, 1.7, ramp(f, at, at + 6, out)), 1, ramp(f, at + T / 2, at + T / 2 + 9, out)) * (1 - ramp(f, exit, exit + 9, out)));
export const Caret: React.FC = () => {
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
