import React from 'react';

// Real paths from reui.io's header SVG (public/cap/logo-*.svg). The site fills them with currentColor,
// so the light logo is foreground #0a0a0a on #ffffff and the dark logo is #fafafa on #0a0a0a.
export const RING_D = 'M67.1667 3.84615H33.8333C17.548 3.84615 4.34615 17.048 4.34615 33.3333V66.6667C4.34615 82.952 17.548 96.1538 33.8333 96.1538H67.1667C83.452 96.1538 96.6538 82.952 96.6538 66.6667V33.3333C96.6538 17.048 83.452 3.84615 67.1667 3.84615ZM33.8333 0C15.4238 0 0.5 14.9238 0.5 33.3333V66.6667C0.5 85.0762 15.4238 100 33.8333 100H67.1667C85.5762 100 100.5 85.0762 100.5 66.6667V33.3333C100.5 14.9238 85.5762 0 67.1667 0H33.8333Z';
export const U_D = 'M25.668 56.879V29.6978C25.668 27.1032 27.7713 24.9998 30.366 24.9998V24.9998C32.9606 24.9998 35.0639 27.1032 35.0639 29.6978V56.879C35.0639 61.6976 38.9702 65.6038 43.7888 65.6038H57.2116C62.0302 65.6038 65.9364 61.6976 65.9364 56.879V43.5904C65.9364 40.9958 68.0398 38.8924 70.6344 38.8924V38.8924C73.229 38.8924 75.3324 40.9958 75.3324 43.5904V56.879C75.3324 66.8869 67.2194 74.9998 57.2116 74.9998H43.7888C33.7809 74.9998 25.668 66.8869 25.668 56.879Z';
export const DOT = { cx: 70.634, cy: 29.698, r: 4.698 };
// the U's centre line, same geometry as U_D, for drawing it as a stroke (promo-motion-kit S10Brand)
export const U_LINE = 'M30.366 29.698V56.879A13.424 13.424 0 0 0 43.789 70.302H57.212A13.424 13.424 0 0 0 70.634 56.879V43.590';
export const U_STROKE = 9.396;
export const LETTERS = [
  'M130.5 68.1729V31.8093H144.847C147.593 31.8093 149.937 32.3005 151.878 33.283C153.831 34.2536 155.317 35.6327 156.335 37.4201C157.364 39.1956 157.879 41.2849 157.879 43.6878C157.879 46.1026 157.358 48.18 156.317 49.9201C155.275 51.6483 153.766 52.974 151.789 53.8973C149.824 54.8206 147.445 55.2823 144.651 55.2823H135.045V49.1033H143.408C144.876 49.1033 146.095 48.9021 147.066 48.4996C148.037 48.0971 148.759 47.4935 149.232 46.6885C149.718 45.8836 149.96 44.8834 149.96 43.6878C149.96 42.4804 149.718 41.4624 149.232 40.6338C148.759 39.8052 148.031 39.1779 147.048 38.7517C146.078 38.3138 144.853 38.0948 143.373 38.0948H138.188V68.1729H130.5ZM150.138 51.6246L159.175 68.1729H150.688L141.846 51.6246H150.138Z',
  'M173.312 68.1729V31.8093H197.815V38.148H181.001V46.8128H196.555V53.1516H181.001V61.8341H197.886V68.1729H173.312Z',
  'M236.389 31.8093H244.077V55.4243C244.077 58.0758 243.444 60.3959 242.177 62.3846C240.922 64.3732 239.164 65.9238 236.904 67.0365C234.643 68.1374 232.009 68.6878 229.002 68.6878C225.984 68.6878 223.344 68.1374 221.083 67.0365C218.822 65.9238 217.065 64.3732 215.81 62.3846C214.555 60.3959 213.928 58.0758 213.928 55.4243V31.8093H221.616V54.7674C221.616 56.1523 221.918 57.3834 222.521 58.4605C223.137 59.5377 224.001 60.3841 225.114 60.9996C226.227 61.6151 227.523 61.9229 229.002 61.9229C230.494 61.9229 231.79 61.6151 232.891 60.9996C234.004 60.3841 234.862 59.5377 235.465 58.4605C236.081 57.3834 236.389 56.1523 236.389 54.7674V31.8093Z',
  'M268.091 31.8093V68.1729H260.402V31.8093H268.091Z',
];
export const LETTER_X = [144.8, 185.6, 229.0, 264.2];
// square box around the ring, so a mark at size S is exactly S across its ring and centred on it
export const VB = '0.5 0 100 100';

// centre line point, t in 0..1, for a cursor following the U as it draws
export const uPoint = (t: number): [number, number] => {
  const r = 13.424;
  const arc = (Math.PI / 2) * r;
  const seg = [27.181, arc, 13.423, arc, 13.289];
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  if (d <= seg[0]) return [30.366, 29.698 + d];
  d -= seg[0];
  if (d <= seg[1]) { const a = d / r; return [43.789 - r * Math.cos(a), 56.879 + r * Math.sin(a)]; }
  d -= seg[1];
  if (d <= seg[2]) return [43.789 + d, 70.302];
  d -= seg[2];
  if (d <= seg[3]) { const a = d / r; return [57.212 + r * Math.sin(a), 56.879 + r * Math.cos(a)]; }
  d -= seg[3];
  return [70.634, 56.879 - d];
};

export const hexMix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};

// The flat mark: brand ring at 0.2 opacity, U, dot. parts picks which pieces show.
export const Mark: React.FC<{ size: number; ink: string; parts?: ('ring' | 'u' | 'dot')[]; ringOpacity?: number; style?: React.CSSProperties }> = ({ size, ink, parts = ['ring', 'u', 'dot'], ringOpacity = 0.2, style }) => (
  <svg width={size} height={size} viewBox={VB} style={{ display: 'block', overflow: 'visible', ...style }}>
    {parts.includes('ring') && <path d={RING_D} fill={ink} fillRule="evenodd" opacity={ringOpacity} />}
    {parts.includes('u') && <path d={U_D} fill={ink} fillRule="evenodd" />}
    {parts.includes('dot') && <circle {...DOT} fill={ink} />}
  </svg>
);
