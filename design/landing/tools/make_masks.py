"""Hair masks for mirror renders: python tools/make_masks.py   (reads assets/look-sNN.webp, writes assets/mask-sNN.png)
The renders keep the model's warm auburn hair (see docs/landing-assets-brief.md, A6), so hair is found by colour:
warm hue, strong saturation, inside the three mirror panels. Calibrated against the hand-checked assets/hair-mask.png."""
import glob, os, re, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

# brass mirror frames and other warm, non-hair things in the locked composition (taken from the base photo)
_b = np.asarray(Image.open('assets/hero.webp').convert('HSV')).astype(float) / 255
_ref = np.asarray(Image.open('assets/hair-mask.png').convert('L')) > 6
FRAMES = ndimage.binary_dilation(((_b[..., 0] * 360 >= 28) & (_b[..., 1] >= .25) & (_b[..., 2] >= .45)) & ~_ref, iterations=2)

def hair_mask(path):
    a = np.asarray(Image.open(path).convert('RGB').resize((1376, 768))).astype(float) / 255
    hsv = np.asarray(Image.open(path).convert('RGB').resize((1376, 768)).convert('HSV')).astype(float) / 255
    h, s, v = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]
    m = (h >= 10) & (h <= 38) & (s >= .45) & (v >= .08) & (v <= .7)
    box = np.zeros_like(m); box[190:490, 470:910] = True   # the mirror panels
    m &= box & ~FRAMES
    m = ndimage.binary_opening(m, iterations=1)
    m = ndimage.binary_closing(m, iterations=3)
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, z in enumerate(sizes) if z > 400])
    m = ndimage.binary_fill_holes(m)
    img = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
    return img

if __name__ == '__main__':
    if '--calibrate' in sys.argv:
        ref = np.asarray(Image.open('assets/hair-mask.png').convert('L')) > 6
        got = np.asarray(hair_mask('assets/hero.webp')) > 127
        print('IoU vs hand mask: %.3f' % ((ref & got).sum() / (ref | got).sum()))
        hair_mask('assets/hero.webp').save('out/mask-calibrate.png')
        sys.exit()
    for f in sorted(glob.glob('assets/look-s[0-9][0-9].webp')):
        n = re.search(r'look-s(\d\d)', f).group(1)
        hair_mask(f).save('assets/mask-s%s.png' % n, optimize=True)
        a = np.asarray(Image.open(f).convert('RGB').resize((1376, 768))).astype(float)
        m = np.asarray(Image.open('assets/mask-s%s.png' % n)) > 127
        a[m] = a[m] * .45 + np.array([255, 0, 140]) * .55
        Image.fromarray(a.astype('uint8')).crop((420, 120, 960, 520)).save('out/maskcheck-s%s.png' % n)
        print('mask-s%s.png (check out/maskcheck-s%s.png)' % (n, n))
