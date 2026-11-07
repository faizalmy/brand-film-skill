# Tempo, first-beat phase, energy by second and biggest jump, for choosing a bed and pinning the film's beat grid to it.
import sys, numpy as np, librosa
for f in sys.argv[1:]:
    y, sr = librosa.load(f, sr=22050, mono=True)
    env = librosa.onset.onset_strength(y=y, sr=sr)
    t, beats = librosa.beat.beat_track(onset_envelope=env, sr=sr, start_bpm=92, tightness=400)
    bt = librosa.frames_to_time(beats, sr=sr)
    ib = np.diff(bt)
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
    tt = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=512)
    sec = [round(float(rms[(tt >= s) & (tt < s + 2)].mean()), 2) for s in range(0, int(tt[-1]), 2)]
    pk = float(np.abs(y).max())
    # biggest two-second energy step = the drop
    w = int(2 * sr / 512); c = np.convolve(rms, np.ones(w) / w, 'same'); j = np.argmax(c[w:] - c[:-w]) + w // 2
    onsets = librosa.onset.onset_detect(onset_envelope=env, sr=sr)
    print(f.split('/')[-1], 'dur', round(len(y) / sr, 2), 'bpm', round(60 / float(np.median(ib)), 2), 'beat sd', round(float(ib.std()) * 1000), 'ms', 'first beats', [round(float(x), 2) for x in bt[:3]], 'peak', round(pk, 2), 'onsets/s', round(len(onsets) / (len(y) / sr), 2), 'drop', round(float(tt[j]), 2))
    print('   rms/2s', sec)
