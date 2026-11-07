"""Build-time semantic hair mattes; no model downloads or inference in the browser.

Requires numpy, Pillow, opencv-python-headless, onnxruntime.
Use --model /path/to/resnet34.onnx from the MIT-licensed yakhyo/face-parsing
release: https://github.com/yakhyo/face-parsing/releases/tag/weights
Hair class is 17; skin, ears, neck, clothing and background are excluded.
"""
from pathlib import Path
import argparse
import cv2
import numpy as np
from PIL import Image
import onnxruntime as ort
from scipy.ndimage import binary_fill_holes

args=argparse.ArgumentParser();args.add_argument('--model',required=True);args.add_argument('--styles',default=','.join(map(str,range(1,20))));args=args.parse_args()
root=Path(__file__).resolve().parents[1]/'design/landing/assets'
options=ort.SessionOptions();options.intra_op_num_threads=2
session=ort.InferenceSession(args.model,options,providers=['CPUExecutionProvider'])
name=session.get_inputs()[0].name
mean=np.array([.485,.456,.406],dtype='float32');std=np.array([.229,.224,.225],dtype='float32')
# Each reflected head is parsed independently; surrounding mirror pixels cannot
# be confused with a second person's hair in the same model input.
regions=[(607,205,763,473),(511,240,582,454),(788,240,858,454)]
for n in map(int,args.styles.split(',')):
 image=Image.open(root/('hero.webp' if n==1 else f'look-s{n:02}.webp')).convert('RGB')
 result=np.zeros((768,1376),dtype='uint8')
 for x0,y0,x1,y1 in regions:
  photo=np.array(image)[y0:y1,x0:x1];h,w=photo.shape[:2]
  size=max(h,w);canvas=np.full((size,size,3),[184,172,154],dtype='uint8');dx=(size-w)//2;dy=(size-h)//2;canvas[dy:dy+h,dx:dx+w]=photo
  tensor=(cv2.resize(canvas,(512,512)).astype('float32')/255-mean)/std
  logits=session.run(None,{name:tensor.transpose(2,0,1)[None]})[0][0]
  labels=logits.argmax(axis=0)
  # Resize a semantic silhouette without carving holes based on strand colour.
  matte=cv2.resize((labels==17).astype('float32'),(size,size),interpolation=cv2.INTER_LINEAR)[dy:dy+h,dx:dx+w]
  # Reject neutral wall/black clothing falsely labelled hair; fill the interior
  # so light strands never become uncoloured holes.
  rgb=photo.astype('float32');r,g,b=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
  pigment=(r>g*1.15)&(g>b*1.08)&(r-b>22)
  if n==12:
   if x0==607:matte[28:92,28:127]=np.maximum(matte[28:92,28:127],pigment[28:92,28:127])
   else:matte[20:55,:]=np.maximum(matte[20:55,:],pigment[20:55,:])
  silhouette=binary_fill_holes((matte>.5)&pigment).astype('float32')
  matte=np.minimum(matte,cv2.GaussianBlur(silhouette,(3,3),.45))
  # Edge-guided subpixel coverage follows image detail instead of a hard binary
  # threshold; interior blonde highlights remain fully inside the hair region.
  guide=cv2.cvtColor(photo,cv2.COLOR_RGB2GRAY).astype('float32')/255
  box=lambda a:cv2.boxFilter(a,-1,(3,3))
  mi,mp=box(guide),box(matte);weight=(box(guide*matte)-mi*mp)/(box(guide*guide)-mi*mi+.00005)
  alpha=np.clip(box(weight)*guide+box(mp-weight*mi),0,1)
  result[y0:y1,x0:x1]=(alpha*255).astype('uint8')
 Image.fromarray(result).save(root/('hair-mask.png' if n==1 else f'mask-s{n:02}.png'),optimize=True)
 print('Prepared semantic hair mask',n,flush=True)
