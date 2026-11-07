"""Hair masks for mirror renders: python tools/make_masks.py   (reads assets/look-sNN.webp, writes assets/mask-sNN.png)
The renders keep the model's warm auburn hair (see docs/landing-assets-brief.md, A6), so hair is found by colour:
warm hue, strong saturation, inside the three mirror panels. Calibrated against the hand-checked assets/hair-mask.png."""
import glob, os, re, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
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
    # Locked, hand-checked silhouettes avoid colour spill onto faces, necks and brass.
    n = re.search(r'look-s(06|12)', str(path))
    if n:
        n = n.group(1)
        img = Image.new('L', (1376, 768))
        d = ImageDraw.Draw(img)
        if n == '06':
            shapes = [
                [(620,326),(622,297),(629,274),(640,257),(658,245),(678,241),(698,245),(716,256),(726,276),(731,300),(738,323),(736,339),(730,347),(717,352),(701,350),(662,350),(645,348),(628,342),(621,335)],
                [(520,279),(530,269),(547,262),(566,258),(582,264),(584,349),(573,353),(555,353),(543,349),(539,333),(538,312),(531,290),(525,281)],
                [(798,264),(815,260),(835,264),(847,274),(852,287),(848,285),(839,279),(832,285),(825,303),(823,329),(821,345),(811,351),(794,350),(787,345),(787,267)]
            ]
            holes = [[(671,269),(681,265),(693,268),(702,278),(707,293),(709,312),(708,325),(700,337),(687,345),(675,344),(662,337),(653,325),(650,311),(651,295),(659,280)]]
        else:
            shapes = [
                [(613,470),(612,442),(617,393),(622,345),(624,300),(630,279),(642,260),(660,249),(680,244),(700,249),(716,262),(726,282),(731,307),(735,350),(743,391),(754,441),(757,470)],
                [(516,298),(517,283),(525,274),(539,265),(559,260),(579,264),(584,272),(584,453),(509,453),(509,437),(524,404),(535,374),(538,350),(538,311),(527,307)],
                [(787,272),(802,264),(819,262),(835,267),(848,279),(853,292),(852,306),(839,305),(825,309),(823,348),(828,378),(843,412),(856,445),(856,454),(787,452)]
            ]
            holes = [
                [(655,299),(665,297),(677,301),(690,299),(702,298),(708,309),(708,326),(701,339),(698,350),(699,394),(681,423),(661,395),(660,350),(653,335),(650,319)],
                [(535,343),(546,348),(560,350),(559,369),(540,396),(532,412),(519,433),(531,394),(537,370)],
                [(825,342),(815,348),(802,350),(803,369),(822,396),(831,412),(846,433),(831,394),(825,370)]
            ]
        for shape in shapes:
            d.polygon(shape, fill=255)
        for hole in holes:
            d.polygon(hole, fill=0)
        if n == '06':
            d.polygon([(661,341),(704,341),(704,365),(659,365)], fill=0)
        face_guard = Image.new('L', img.size)
        guard_draw = ImageDraw.Draw(face_guard)
        for hole in holes:
            guard_draw.polygon(hole, fill=255)
        guard = ndimage.binary_dilation(np.asarray(face_guard) > 0, iterations=4)
        guarded = np.asarray(img).copy()
        guarded[guard] = 0
        img = Image.fromarray(guarded)
        # Remove the warm-grey glass outside each strand silhouette; preserve all hair highlights.
        chroma = np.clip((s - .27) / .13, 0, 1)
        warm = (h >= 8) & (h <= 48)
        alpha = np.asarray(img).astype(float) * chroma * warm
        img = Image.fromarray(alpha.astype('uint8')).filter(ImageFilter.GaussianBlur(.65))
    return img

if __name__ == '__main__':
    os.makedirs('out', exist_ok=True)
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
