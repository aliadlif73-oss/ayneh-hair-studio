# Hero hair mattes

The committed PNG masks are prepared offline, independently for the front and
each profile reflection. The browser downloads neither an ML model nor an
inference runtime. Hair colouring preserves each source pixel's channel
variation and applies a continuous tone curve around that hairstyle's median.

Rebuild using `scripts/refine-hair-masks.py --model /path/to/resnet34.onnx` with
NumPy, Pillow, SciPy, OpenCV and ONNX Runtime installed. The 19-class face parser
separates hair (class 17) from skin, ears, neck, clothing and room. Neutral wall
pixels are rejected; interior highlights retain their coverage. The blunt fringe
has an explicit foreground correction where the parser mistakes bangs for skin.

Model source: https://github.com/yakhyo/face-parsing/releases/tag/weights

Model SHA-256: `5b805bba7b5660ab7070b5a381dcf75e5b3e04199f1e9387232a77a00095102e`.

Upstream face-parsing is MIT licensed, copyright 2024 Yakhyokhuja Valikhujaev.
The model is a development dependency only and is not included in the site.

Validation checks exposed facial/neck skin, mirror and room coverage separately
from long hair that legitimately covers the neck. In particular, that covered
hair must not be excluded from the colour matte.
