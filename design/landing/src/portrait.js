/* Keep the original portrait immutable; replace only the union of the old/new hair. */
(()=>{
 function compose(original,render,oldHair,newHair,identity,face=identity){
  const scene=new Uint8ClampedArray(original),mask=new Uint8ClampedArray(newHair);
  for(let p=0;p<scene.length;p+=4){
   const protect=identity[p]/255;
   const alpha=Math.max(oldHair[p]*(1-face[p]/255),newHair[p])/255*(1-protect);
   for(let c=0;c<3;c++)scene[p+c]=original[p+c]+(render[p+c]-original[p+c])*alpha;
   const coverage=Math.round(newHair[p]*(1-protect));
   mask[p]=mask[p+1]=mask[p+2]=coverage;mask[p+3]=255;
  }
  return {scene,mask};
 }
 window.__AYN_PORTRAIT={compose};
})();
