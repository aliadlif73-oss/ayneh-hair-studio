/* Funnel step 8. The post-request answer lives once in #followUpTemplate;
   the OTP dialog and the always-available phone form must never drift. */
(()=>{
 window.__AYN_FOLLOWUP=slot=>{
  const t=document.getElementById('followUpTemplate');
  if(!slot||!t)return;
  if(!slot.firstElementChild)slot.append(t.content.cloneNode(true));
  slot.hidden=false;
 };
})();
