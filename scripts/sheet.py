# Contact sheet of QA stills: python3 sheet.py <dir> [cols] -> <dir>/sheet.jpg, each still labelled with its frame.
import sys, glob
from PIL import Image, ImageDraw
d = sys.argv[1]; c = int(sys.argv[2]) if len(sys.argv) > 2 else 4
fs = sorted(glob.glob(d + '/f*.jpg')); assert fs, 'no stills in ' + d
r = (len(fs) + c - 1) // c; tw = 2880 // c; th = tw * 9 // 16
s = Image.new('RGB', (c * (tw + 6), r * (th + 6)), (120, 120, 120))
for i, f in enumerate(fs):
    im = Image.open(f).resize((tw, th)); ImageDraw.Draw(im).text((6, 6), f[-9:-4], fill=(255, 0, 80))
    s.paste(im, (i % c * (tw + 6), i // c * (th + 6)))
s.save(d + '/sheet.jpg', quality=88); print(d + '/sheet.jpg', len(fs), 'stills')
