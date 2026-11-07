"""Build runtime hair coverage masks from imagegen's fixed-camera renders.

Usage: python scripts/prepare-hero-renders.py /path/to/style-path-map.json
The portrait compositor separately locks the original facial features.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parents[1] / 'design/landing/assets'
for number, path in json.load(open(sys.argv[1])).items():
    image = Image.open(path).convert('RGB').resize((1376, 768), Image.Resampling.LANCZOS)
    rgb = np.asarray(image).astype(float)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    # Chestnut hair, bounded to the three reflections. Exclude black clothing,
    # neutral room/mirror pixels and the skin highlights before softening edges.
    coverage = (r > g * 1.12) & (g > b * 1.03) & (r-b > 20) & (g < 145) & (r > 42)
    region = np.zeros((768, 1376), dtype=bool)
    for left, top, right, bottom in [(606,190,763,471),(508,220,584,454),(786,220,862,454)]:
        region[top:bottom, left:right] = True
    mask = Image.fromarray(((coverage & region)*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.65))
    image.save(root / f'look-s{int(number):02}.webp', quality=92, method=6)
    mask.save(root / f'mask-s{int(number):02}.png', optimize=True)
