import numpy as np
from PIL import Image
from scipy import ndimage as ndi
im=Image.open('assets/hero.webp').convert('RGB'); a=np.asarray(im).astype(float)
mk=np.asarray(Image.open('assets/hair-mask.png').convert('L')).astype(float)/255
H,W=mk.shape; yy,xx=np.mgrid[0:H,0:W]
hair=mk>0.3; hairD=ndi.binary_dilation(hair,iterations=4)
mx=a.max(2);mn=a.min(2);sat=(mx-mn)/(mx+1e-6)
V=mx/255
lowsat=((sat<0.34)&(V<0.93)&(V>0.45))|(V<0.16)
interior=((xx>522)&(xx<580))|((xx>608)&(xx<760))|((xx>794)&(xx<856))
lowsat=lowsat&interior&(yy>180)
src=(~hairD)&lowsat
# nearest low-saturation (bg / blazer) pixel fill
idx=ndi.distance_transform_edt(~src,return_distances=False,return_indices=True)
fill=a[idx[0],idx[1]]
# centre mirror: explicit neck / chest skin
skin=a[395:402,676:690].reshape(-1,3).mean(0); neck=a[360:366,676:690].reshape(-1,3).mean(0)
dx=np.abs(xx-683.0)
neck_m=(yy>336)&(yy<392)&(dx<(15+np.clip(yy-340,0,50)*0.30))
v_m=(yy>=380)&(yy<428)&(dx<(48-(yy-380)*1.02))
centre=(xx>606)&(xx<762)
lsk=a[364:370,538:546].reshape(-1,3).mean(0); rsk=a[366:372,816:824].reshape(-1,3).mean(0)
nl=(xx>526)&(xx<560)&(yy>348)&(yy<392)&(xx<(540+(yy-348)*0.5)+16)
nr=(xx>802)&(xx<836)&(yy>348)&(yy<392)&(xx>(826-(yy-348)*0.5)-16)
skin_m=(centre&(neck_m|v_m))
tone=np.where((yy[...,None]<384),neck,skin)
def build(name,ycut,taper):
    ycl=np.where(centre,ycut-np.abs(xx-683.0)*taper,402-np.abs(xx-683.0)*0.10)
    keep=yy<ycl
    edge=np.clip((ycl-yy)/7.0,0,1)
    m2=mk*edge
    removed=hair&~keep
    out=a.copy()
    out[removed]=fill[removed]
    # explicit skin where neck/chest was covered by removed hair
    sk=removed&skin_m
    out[sk]=tone[sk]

    # soften the repaired area
    r=ndi.binary_dilation(removed,iterations=3)
    bl=np.stack([ndi.gaussian_filter(out[...,c],1.6) for c in range(3)],-1)
    w=ndi.gaussian_filter(r.astype(float),1.2)[...,None]
    out=out*(1-w)+bl*w
    # kept hair on top
    out=out*(1-m2[...,None])+a*m2[...,None]
    Image.fromarray(out.clip(0,255).astype('uint8')).save(f'assets/look-{name}.webp',quality=90,method=6)
    Image.fromarray((m2*255).astype('uint8')).save(f'assets/hair-mask-{name}.png',optimize=True)
    Image.fromarray(out.clip(0,255).astype('uint8')).crop((480,150,900,480)).save(f'look_{name}.png')
build('lob',402,0.10); build('bob',356,0.28)
ims=[Image.open(f'look_{n}.png') for n in ['lob','bob']]
o=Image.new('RGB',(sum(i.width for i in ims),ims[0].height));x=0
for i in ims:o.paste(i,(x,0));x+=i.width
o.save('looks_preview.png')
