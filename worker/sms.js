// Melipayamak (ملی‌پیامک) shared-line pattern SMS.
// A shared line can only send pre-approved patterns: the text lives in the Melipayamak panel and
// we send the pattern id (bodyId) plus its variables. Two patterns are used:
//   MELIPAYAMAK_OTP_BODY_ID     "کد تأیید شما در آینه: {0}"
//   MELIPAYAMAK_INVITE_BODY_ID  "{0} ... https://<domain>/s/{1}"   (salon name, salon slug)
// Credentials, either:
//   MELIPAYAMAK_TOKEN                          console API key (console.melipayamak.com), preferred
//   MELIPAYAMAK_USERNAME + MELIPAYAMAK_PASSWORD  classic REST (rest.payamak-panel.com); the password
//                                              may be the panel's API key (error -110 asks for it)
// Melipayamak rejects links inside variables (error -10), so links must live in the pattern text.
export const smsReady=env=>!!(env?.MELIPAYAMAK_TOKEN||(env?.MELIPAYAMAK_USERNAME&&env?.MELIPAYAMAK_PASSWORD));
export const otpEnabled=env=>smsReady(env)&&Number(env?.MELIPAYAMAK_OTP_BODY_ID)>0;
export const inviteEnabled=env=>smsReady(env)&&Number(env?.MELIPAYAMAK_INVITE_BODY_ID)>0;
const local=p=>String(p).replace(/^\+98/,'0');
const LINKY=/https?:|www\.|\.(ir|com|net|org|dev|me|io|app)\b/i;
// Returns {ok:true,id} on acceptance, {ok:false,error} on a definite rejection and
// {ok:false,uncertain:true,error} when the network failed and the SMS may still have gone out.
export async function sendPattern(env,to,bodyId,args){
 const vars=args.map(a=>String(a??'').replace(/;/g,'،').trim());
 if(vars.some(v=>LINKY.test(v)))return {ok:false,error:'link_in_variable'};
 try{
  if(env.MELIPAYAMAK_TOKEN){
   const res=await fetch('https://console.melipayamak.com/api/send/shared/'+encodeURIComponent(env.MELIPAYAMAK_TOKEN),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bodyId:Number(bodyId),to:local(to),args:vars}),signal:AbortSignal.timeout(15000)});
   const d=await res.json().catch(()=>({}));const id=String(d.recId??'');
   if(res.ok&&/^\d{8,}$/.test(id))return {ok:true,id};
   return {ok:false,error:String(d.status||'http_'+res.status).slice(0,200)};
  }
  const res=await fetch('https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},body:new URLSearchParams({username:env.MELIPAYAMAK_USERNAME,password:env.MELIPAYAMAK_PASSWORD,text:vars.join(';'),to:local(to),bodyId:String(Number(bodyId))}),signal:AbortSignal.timeout(15000)});
  const d=await res.json().catch(()=>({}));const id=String(d.Value??'');
  // A recId is a long number; anything short (-110, -10, 35, ...) is an error code.
  if(res.ok&&/^\d{11,}$/.test(id))return {ok:true,id};
  return {ok:false,error:('code_'+(id||'http_'+res.status)+(d.StrRetStatus?' '+d.StrRetStatus:'')).slice(0,200)};
 }catch(e){return {ok:false,uncertain:true,error:'network: '+String(e?.message||e).slice(0,150)}}
}
export async function logSms(db,row){
 await db.prepare('INSERT INTO sms_log(id,salon_id,kind,phone,provider_id,status,error,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),row.salon_id||null,row.kind,row.phone,row.id||null,row.ok?'sent':row.uncertain?'unknown':'failed',row.error||null,Date.now()).run();
}
