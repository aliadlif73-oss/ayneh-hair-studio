/* Preserve photographic contrast and neutral highlights instead of painting a flat hue. */
(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function tint(c,Y,yn){
  const target=c.rgb||[151,105,66],end=c.ombre?clamp((yn-.25)/.6,0,1):1;
  const color=c.ombre?target.map((v,i)=>[48,32,24][i]*(1-end)+v*end):target;
  const luminance=.2126*color[0]+.7152*color[1]+.0722*color[2];
  // Shadows remain deep; the highlights retain individual strands and shine.
  const exposure=Math.pow(clamp(Y/.32,.025,2.6),.88);
  const highlight=clamp((Y-.48)/.35,0,.42);
  return color.map(v=>clamp(v*exposure*(1-highlight)+luminance*exposure*highlight,0,248));
 }
 window.__AYN_HAIR_COLOR={tint};
})();
