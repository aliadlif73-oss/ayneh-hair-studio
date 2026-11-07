/* A short-lived browser-local photo handoff; no upload, analytics or phone is involved. */
(()=>{
 const db=()=>new Promise((resolve,reject)=>{const r=indexedDB.open('ayneh-photo-handoff',1);r.onupgradeneeded=()=>r.result.createObjectStore('drafts');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
 async function transaction(mode,fn){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('drafts',mode),r=fn(t.objectStore('drafts'));let result;r.onsuccess=()=>{result=r.result};t.oncomplete=()=>{d.close();resolve(result)};t.onerror=t.onabort=()=>{d.close();reject(t.error)}})}
 window.__AYN_DRAFT={put:entry=>transaction('readwrite',s=>s.put({...entry,created:Date.now()},'current')),async take(){const e=await transaction('readwrite',s=>{const r=s.get('current');s.delete('current');return r});return e&&Date.now()-e.created<15*60*1000?e:null}};
})();
