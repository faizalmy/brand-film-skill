# Tempo, first beat, energy by second and the drop, for choosing a bed and pinning the film's beat grid to it.
# python3 beat.py <track.wav>...  BPM comes from a straight-line fit through every beat, not librosa's tempo grid.
import sys, numpy as np, librosa
FPS = 60
for f in sys.argv[1:]:
    y, sr = librosa.load(f, sr=22050, mono=True)
    env = librosa.onset.onset_strength(y=y, sr=sr)
    _, beats = librosa.beat.beat_track(onset_envelope=env, sr=sr, tightness=400)
    bt = librosa.frames_to_time(beats, sr=sr)
    slope, phase = np.polyfit(np.arange(len(bt)), bt, 1)  # seconds per beat, time of beat 0
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
    tt = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=512)
    sec = [round(float(rms[(tt >= s) & (tt < s + 2)].mean()), 2) for s in range(0, int(tt[-1]), 2)]
    # the drop: biggest step between the 2 s before and the 2 s after, away from the track's edges
    w = int(2 * sr / 512); c = np.convolve(rms, np.ones(w) / w, 'valid')
    j = int(np.argmax(c[w:] - c[:-w])) + w
    drop = float(tt[j]); drop_beat = round((drop - phase) / slope)
    print(f.split('/')[-1], 'dur', round(len(y) / sr, 2), 's  bpm', round(60 / slope, 2), ' beat sd', round(float(np.std(bt - (phase + slope * np.arange(len(bt))))) * 1000), 'ms')
    print('   first beat', round(float(phase), 3), 's  drop', round(drop, 2), 's = beat', drop_beat, 'at', round(float(phase + drop_beat * slope), 3), 's')
    print('   BED_FROM for a film that starts on the drop beat:', round((phase + drop_beat * slope) * FPS), 'frames')
    print('   rms/2s', sec)
