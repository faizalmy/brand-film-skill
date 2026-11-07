import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame as useRealFrame } from 'remotion';
import { FPS, NextScene, PAPER, SLOW, T, b, real } from './lib';
import { ALL_SCENES } from './scenes';

// The film is this list. Each scene runs `beats` story beats, one after the other; start beats are added up for you.
// `name` picks the scene from scenes/index.ts. To drop a scene, delete or comment out its line; to reorder, move the line.
// Every time below is in beats from the scene's own start:
//   hits:  [sound, beat, volume] - sfx in public/sfx/
//   still: [from, to] - no kick pulse here (holds)
//   kick:  the frame pulses on the music's kick (off once the track's kick stops)
//   duck:  music volume under this scene (1 = full), eased in and out over its first and last beat
// Each scene wipes to the next one's first colour. The lead dot can still jump at a new join: render both frames of it.
type Scene = { name: keyof typeof ALL_SCENES; beats: number; hits?: [string, number, number][]; still?: [number, number][]; kick?: boolean; duck?: number };
export const SCENES: Scene[] = [
  { name: 'line', beats: 8, still: [[3.5, 6]], kick: true },                                     // the dot types the brand's line
  { name: 'ring', beats: 3, hits: [['impact', 0, 0.55]], kick: true },                         // dot opens into the ring
  { name: 'construct', beats: 9, kick: true, duck: 0.75 },                                   // the mark drawn from its own numbers
  { name: 'site', beats: 12, hits: [['slam', 0, 0.7], ['slam', 8, 0.8]], still: [[0, 1.5]], kick: true }, // logo becomes the site's nav logo, tour, dark toggle on beat 8
  { name: 'letters', beats: 4, hits: [['impact', 0, 0.6]], kick: true },                       // R E U I, one per beat
  { name: 'blocks', beats: 13, hits: [['impact', 0, 0.6]], still: [[2, 3], [5, 6], [8, 9], [11, 13]], kick: true }, // real product, real drags
  { name: 'looks', beats: 3, hits: [['impact', 0, 0.7]] },                                    // the mark drawn three other ways
  { name: 'final', beats: 8, hits: [['slam', 4, 0.9]] },                                         // logo lands, name settles on the slam, the line
];

const START = SCENES.reduce<number[]>((a, s, i) => [...a, i ? a[i - 1] + SCENES[i - 1].beats : 0], []);
export const REFRESHED_BEATS = SCENES.reduce((n, s) => n + s.beats, 0);
export const REFRESHED_FRAMES = real(REFRESHED_BEATS);
export const REFRESHED_FPS = FPS;

const HITS = SCENES.flatMap((s, i) => (s.hits ?? []).map(([name, at, vol]) => [name, b(START[i] + at), vol] as const));
const STILL = SCENES.flatMap((s, i) => (s.still ?? []).map(([a, c]) => [START[i] + a, START[i] + c]));
const KICK = SCENES.flatMap((s, i) => (s.kick ? [[START[i], START[i] + s.beats]] : []));
// Each sound's peak in seconds, so a hit lands on its frame (measure a new sound's with ffmpeg or beat.py's peak).
const PEAK: Record<string, number> = { impact: 0.005, slam: 0 };
const BED = 'audio/bed.wav'; // the brand's music bed: save the track under this name
const BED_FROM = 2980; // film frames (60 fps) into the track where the film starts, on a kick: seconds x 60
const BED_VOL = 0.62;
const bedVolume = (f: number) => SCENES.reduce((v, s, i) => {
  if (s.duck === undefined || s.duck === 1) return v;
  const a = START[i], c = a + s.beats;
  return v * interpolate(f, [real(a), real(a + 1), real(c - 1), real(c)], [1, s.duck, s.duck, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}, BED_VOL);

// The whole frame takes each kick in kick scenes; long holds stay still.
const KickBump: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useRealFrame();
  const on = KICK.some(([a, c]) => f >= real(a) && f < real(c)) && !STILL.some(([a, c]) => f >= real(a) && f < real(c));
  const kick = on ? Math.pow(1 - (f % T) / T, 3) : 0; // one kick lasts T film frames, since SLOW is 2
  return <AbsoluteFill style={{ transform: `scale(${1 + 0.008 * kick})` }}>{children}</AbsoluteFill>;
};

export const Refreshed: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    <KickBump>
      {SCENES.map(({ name, beats }, i) => {
        const { Scene } = ALL_SCENES[name], next = SCENES[i + 1];
        return (
          <Sequence key={name} name={name} from={real(START[i])} durationInFrames={real(START[i] + beats) - real(START[i])} premountFor={30}>
            <NextScene.Provider value={next ? { name: next.name, bg: ALL_SCENES[next.name].bg } : {}}><Scene /></NextScene.Provider>
          </Sequence>
        );
      })}
    </KickBump>
    <Audio src={staticFile(BED)} startFrom={BED_FROM} volume={bedVolume} />
    {HITS.map(([name, at, vol], i) => (
      <Sequence key={i} from={Math.max(0, Math.round(at * SLOW - (PEAK[name] ?? 0) * FPS))} durationInFrames={60}><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} /></Sequence>
    ))}
  </AbsoluteFill>
);
