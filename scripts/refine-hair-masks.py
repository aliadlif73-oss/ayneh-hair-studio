"""Rebuild coverage inside mirror glass, excluding face, neck, chest and frame.
This is a rendering mask, not a modified photograph.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import binary_fill_holes, binary_closing

root=Path(__file__).resolve().parents[1]/'design/landing/assets'
W,H=1376,768
glass=Image.new('L',(W,H));g=ImageDraw.Draw(glass)
g.rectangle((617,239,754,467),fill=255)
g.ellipse((617,153,754,325),fill=255)
g.rectangle((516,248,577,450),fill=255)
g.rectangle((792,248,854,450),fill=255)
skin=Image.new('L',(W,H));d=ImageDraw.Draw(skin)
for polygon in [
 [(660,298),(668,293),(699,293),(711,301),(711,325),(700,343),(682,350),(664,339),(654,323),(654,307)],
 [(522,291),(537,288),(547,301),(547,319),(549,333),(541,347),(526,347),(517,335),(513,323),(520,312)],
 [(825,288),(840,291),(843,308),(850,321),(846,335),(837,347),(823,347),(815,335),(816,315),(817,300)],
 [(667,342),(698,342),(702,362),(708,379),(685,417),(654,380),(663,365)],
 [(528,341),(547,340),(549,364),(558,370),(536,404),(527,375)],
 [(823,341),(840,341),(841,371),(830,401),(807,373),(820,362)]]:
 d.polygon(polygon,fill=255)
allowed=np.array(glass)>0
for n in range(1,20):
 image=Image.open(root/('hero.webp' if n==1 else f'look-s{n:02}.webp')).convert('RGB')
 a=np.array(image,dtype=float);r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
 hair=(r>g*1.13)&(g>b*1.06)&(r-b>22)&(g<151)&(r>35)&allowed
 hair=binary_closing(hair,iterations=2)
 hair=binary_fill_holes(hair)&allowed
 # Neck/chest skin is warmer than the neutral wall and used to pass the brown
 # threshold. Protect it by both anatomy and chroma; keep dark hair crossing it.
 anatomy=np.zeros((H,W),dtype=bool)
 anatomy[337:424,646:720]=True
 anatomy[339:415,518:566]=True
 anatomy[339:415,802:850]=True
 hair &= ~(anatomy & (g>r*.65) & (b>g*.56))
 # The arched brass rim is not hair, including its small isolated gold flecks.
 hair[:210,:]=False
 hair[:227,:646]=False
 hair[:227,722:]=False
 coverage=Image.fromarray((hair*255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.6))
 result=np.minimum(np.array(coverage),255-np.array(skin.filter(ImageFilter.GaussianBlur(.6))))
 Image.fromarray(result.astype('uint8')).save(root/('hair-mask.png' if n==1 else f'mask-s{n:02}.png'),optimize=True)
