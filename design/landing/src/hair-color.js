/* Continuous photographic tone curves retain strand contrast without channel clipping. */
(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const luma=v=>(.2126*v[0]+.7152*v[1]+.0722*v[2])/255;
 const logit=v=>Math.log(clamp(v,.001,.999)/(1-clamp(v,.001,.999)));
 function tint(c,Y,yn,source,anchor){
  source=source||[Y*255,Y*255,Y*255];anchor=anchor||[81.6,81.6,81.6];
  const end=c.ombre?clamp((yn-.25)/.6,0,1):1;
  const target=(c.rgb||[151,105,66]).map((v,i)=>c.ombre?[48,32,24][i]*(1-end)+v*end:v);
  const ref=luma(anchor),dest=luma(target),L=1/(1+Math.exp(-(logit(dest)+logit(Y)-logit(ref))));
  const chroma=1-clamp((L-.65)/.35,0,.85);
  const rgb=source.map((v,i)=>255*L*(1+(target[i]/(255*dest)-1)*chroma+.24*(v/(255*Math.max(.01,Y))-anchor[i]/(255*ref))*chroma));
  const ceiling=Math.max(248,...rgb),scale=248/ceiling;
  return rgb.map(v=>clamp(v*scale,0,248));
 }
 window.__AYN_HAIR_COLOR={tint};
})();
