import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion';
import { DOT, LETTERS, Mark } from '../logo';
import OBJ_META from '../../public/cap/site-object/meta.json';
import { CX, CY, DIM, Flight, H, INK, LETTER_BOX, LET_U, LIGHT_INK, P, PAPER, RING_SIZE, Stage, T, Txt, W, Wipe, b, calm, clamp01, contourPt, fly, mix, out, ramp, typing, useCurrentFrame, useNext } from '../lib';

/* The website as an object, minimal (Vercel Ship 2024): one element at a time, tilted macro, shallow focus.
   The dot passes through the headline and its letters break into dots around it, then it clicks the nav's real toggle. */
export type Cam = { s: number; ax: number; ay: number; rx: number; rz: number };
export const SITE_P = 1400; // perspective
export const camMix = (a: Cam, c: Cam, t: number): Cam => ({ s: mix(a.s, c.s, t), ax: mix(a.ax, c.ax, t), ay: mix(a.ay, c.ay, t), rx: mix(a.rx, c.rx, t), rz: mix(a.rz, c.rz, t) });
export const FLAT: Cam = { s: 1.2, ax: 800, ay: 450, rx: 0, rz: 0 };
export const sb = (n: number) => b(40 + n) - b(40); // the tour's own beat n, on a fixed beat grid (tourG maps the scene's clock onto it)
export const project = (c: Cam, [x, y]: P): P => {
  const x0 = (x - c.ax) * c.s, y0 = (y - c.ay) * c.s, rx = (c.rx * Math.PI) / 180, rz = (c.rz * Math.PI) / 180;
  const y1 = y0 * Math.cos(rx), z = y0 * Math.sin(rx), k = SITE_P / (SITE_P - z);
  return [CX + (x0 * Math.cos(rz) - y1 * Math.sin(rz)) * k, CY + (x0 * Math.sin(rz) + y1 * Math.cos(rz)) * k];
};
export const OBJ_Q = 4; // laid out at the still's full size and scaled down: Chrome rasters a perspective layer at its layout size, so 1600 px wide would go soft
export const PlaneBox: React.FC<{ c: Cam; x?: number; y?: number; w: number; h: number; q: number; children: React.ReactNode }> = ({ c, x = 0, y = 0, w, h, q, children }) => (
  <AbsoluteFill style={{ perspective: SITE_P, perspectiveOrigin: `${CX}px ${CY}px` }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: w * q, height: h * q, transformOrigin: '0 0', transform: `translate(${CX}px, ${CY}px) rotateZ(${c.rz}deg) rotateX(${c.rx}deg) scale(${c.s / q}) translate(${(x - c.ax) * q}px, ${(y - c.ay) * q}px)` }}>{children}</div>
  </AbsoluteFill>
);
export const planeImg: React.CSSProperties = { display: 'block', width: '100%', height: '100%', maxWidth: 'none' };
export const O_WORD = OBJ_META.words['Design-forward'], O_MCP = OBJ_META.words['MCP fluency'], O_CTA = OBJ_META.cta, O_MOON = OBJ_META.moon;
export const O_MID = (r: { x: number; y: number; w: number; h: number }): P => [r.x + r.w / 2, r.y + r.h / 2];
export const macro = (r: { x: number; y: number; w: number; h: number }, s: number, rz: number, drift: number): [Cam, Cam] => [
  { s, ax: O_MID(r)[0] - drift, ay: O_MID(r)[1], rx: 42, rz }, { s: s * 1.06, ax: O_MID(r)[0] + drift, ay: O_MID(r)[1], rx: 42, rz },
];
export const O_HEAD = macro(O_WORD, 5, -15, 60), O_MCP_C = macro(O_MCP, 5.6, 12, 26), O_CTA_C = macro(O_CTA, 7, -15, 9), O_MOON_C = macro(O_MOON, 18, 12, 2);
export const O_DARK = sb(8);
export const objCam = (g: number): Cam => {
  if (g < sb(4)) return camMix(camMix(FLAT, O_HEAD[0], ramp(g, sb(1), sb(2), calm)), O_HEAD[1], ramp(g, sb(2), sb(4), calm));
  if (g < sb(5.5)) return camMix(O_MCP_C[0], O_MCP_C[1], ramp(g, sb(4), sb(5.5), calm));
  if (g < sb(7)) return camMix(O_CTA_C[0], O_CTA_C[1], ramp(g, sb(5.5), sb(7), calm));
  // holds on the toggle after the click, then the site opens out around it: scale first, the frame travels last
  const m = camMix(O_MOON_C[0], O_MOON_C[1], ramp(g, sb(7), O_DARK, calm)), t = ramp(g, sb(8.5), sb(10), calm), far = t * t * t;
  return { ...camMix(m, FLAT, t), s: Math.exp(mix(Math.log(m.s), Math.log(FLAT.s), t)), ax: mix(m.ax, FLAT.ax, far), ay: mix(m.ay, FLAT.ay, far) };
};
export const objDotPage = (g: number): P => {
  if (g < sb(4)) return [mix(O_WORD.x + 6, O_WORD.x + O_WORD.w - 6, ramp(g, sb(2), sb(4), calm)), O_MID(O_WORD)[1]];
  if (g < sb(5.5)) return [O_MCP.x + O_MCP.w + 8, O_MCP.y + O_MCP.h + 8]; // rests just past the word, under the line
  if (g < sb(7)) return [O_MID(O_CTA)[0], O_CTA.y + O_CTA.h + 7]; // just under the button
  return O_MID(O_MOON);
};
export const objTour = (g: number, from: P): P => {
  let at = project(objCam(g), objDotPage(g));
  if (g < sb(0.5)) at = fly(from, at, ramp(g, 0, sb(0.5), out));
  for (const cut of [sb(4), sb(5.5), sb(7)]) if (g >= cut && g < cut + T / 4) at = fly(project(objCam(cut - 1), objDotPage(cut - 1)), at, ramp(g, cut, cut + T / 4, out));
  return at;
};
// paper-coloured halftone over the type: around the dot the letters turn to dots, and close to it they are gone
export const OBJ_GRID = 4, OBJ_R = 22;
export const Dissolve: React.FC<{ c: Cam; at: P }> = ({ c, at }) => {
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
export const objPatch = (n: 'head' | 'nav', file: string, c: Cam) => {
  const p = OBJ_META.patch[n];
  return <PlaneBox c={c} x={p.x} y={p.y} w={p.width} h={p.height} q={p.q}><Img src={staticFile(`cap/site-object/${file}.jpg`)} style={planeImg} /></PlaneBox>;
};
// the page and its macro patches, in focus across one band only while tilted; children sit on the page
export const ObjPlane: React.FC<{ g: number; c: Cam; children?: React.ReactNode }> = ({ g, c, children }) => {
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
export const objPressed = (g: number) => (g >= O_DARK ? 1 - ramp(g, O_DARK, O_DARK + T / 4, out) : 0);
/* site, 12 beats. The logo zooms out and is the site's own nav logo, a fast tour follows, and the toggle's click lands on the slam,
   the scene's beat 8. The camera goes back in, to the R of the nav's own wordmark, which the letters scene draws next.
   Without letters next, shorten the dive (L_IN, L_LAND) or end on the flat page. */
export const NAV_LOGO = { x: 39.625, y: 27.375, size: 30.75 }; // the nav logo's box on the page, measured off the still
export const NAV_DOT: P = [NAV_LOGO.x + ((DOT.cx - 50.5) * NAV_LOGO.size) / 100, NAV_LOGO.y + ((DOT.cy - 50) * NAV_LOGO.size) / 100];
export const NAV_R = (DOT.r * NAV_LOGO.size * FLAT.s) / 100;
export const NAV_U = NAV_LOGO.size / 100; // page px per logo unit
export const R_CAM: Cam = { s: LET_U / NAV_U, ax: NAV_LOGO.x - NAV_LOGO.size / 2 + (400 + ((LETTER_BOX[0][0] + LETTER_BOX[0][1]) / 2 - 0.5) * LET_U) / (LET_U / NAV_U), ay: NAV_LOGO.y, rx: 0, rz: 0 }; // the nav's R exactly where the Letters shot draws it
export const LS = (n: number) => b(20 + n) - b(20); // shortcut: snapped as if the scene starts at film beat 20 (1 frame off elsewhere); use b(n) for a new film
export const L_OUT = LS(1.5), L_TOUR = LS(3), L_IN = LS(10), L_LAND = LS(11.5);
// [film beat, the tour's own beat]: the same tour, played faster
export const WARP = [[23, 0], [23.5, 1], [24.5, 2], [25.5, 4], [26.5, 5.5], [27, 7], [28, 8], [28.5, 8.5], [29.5, 10]];
export const tourG = (f: number) => interpolate(f, WARP.map(([n]) => LS(n - 20)), WARP.map(([, n]) => sb(n)), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
// scale first, the frame travels last, so the logo stays centred while it shrinks
export const logoCam = (t: number): Cam => {
  const far = t * t; // early enough that the page's left edge is out of frame before the page fades in
  return { s: Math.exp(mix(Math.log(RING_SIZE / NAV_LOGO.size), Math.log(FLAT.s), t)), ax: mix(NAV_LOGO.x, FLAT.ax, far), ay: mix(NAV_LOGO.y, FLAT.ay, far), rx: 0, rz: 0 };
};
// going in, the frame travels first
export const rCam = (t: number): Cam => {
  const near = 1 - Math.pow(1 - t, 3);
  return { s: Math.exp(mix(Math.log(FLAT.s), Math.log(R_CAM.s), t)), ax: mix(FLAT.ax, R_CAM.ax, near), ay: mix(FLAT.ay, R_CAM.ay, near), rx: 0, rz: 0 };
};
export const lsCam = (f: number): Cam => (f < L_TOUR ? logoCam(ramp(f, L_OUT, L_TOUR, calm)) : f < L_IN ? objCam(tourG(f)) : rCam(ramp(f, L_IN, L_LAND, calm)));
export const lsDot = (g: number): P => {
  const nav = project(FLAT, NAV_DOT), e = contourPt(0, 0);
  const start: P = [R_CAM.ax + (e[0] - CX) / R_CAM.s, R_CAM.ay + (e[1] - CY) / R_CAM.s]; // the R's first point, on the page
  return fly(objTour(tourG(Math.min(g, L_IN)), nav), project(lsCam(g), start), ramp(g, L_IN, L_IN + T / 2, calm));
};
export const LogoSite: React.FC = () => {
  const f = useCurrentFrame(), next = useNext();
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
      <Wipe f={f} at={LS(12)} color={next.bg} />
      {f >= L_TOUR && <Flight trace invert at={lsDot} f={f} r={r} ink={LIGHT_INK} tail={14} />}
    </Stage>
  );
};
