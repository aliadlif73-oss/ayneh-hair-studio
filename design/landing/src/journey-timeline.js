/* One timeline shared by the automatic handoff and the user's native scroll. */
(()=>{
 const bridge=.27;
 const duration=d=>Math.max(.05,Number.isFinite(d)?d-.05:7.95);
 const progressAt=(time,d)=>bridge+(1-bridge)*Math.min(duration(d),Math.max(0,time))/duration(d);
 const timeAt=(p,d)=>Math.max(0,Math.min(1,(p-bridge)/(1-bridge)))*duration(d);
 window.__AYN_JOURNEY={bridge,progressAt,timeAt};
})();
