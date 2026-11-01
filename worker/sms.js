// Melipayamak (ملی‌پیامک) shared-line pattern SMS.
// A shared line can only send pre-approved patterns: the text lives in the Melipayamak panel and
// we send the pattern id (bodyId) plus its variables. Two patterns are used:
//   MELIPAYAMAK_OTP_BODY_ID     "کد تأیید شما در آینه: {0}"
//   MELIPAYAMAK_INVITE_BODY_ID  "{0} ... https://<domain>/s/{1}"   (salon name, salon slug)
// Credentials, either:
//   MELIPAYAMAK_USERNAME + MELIPAYAMAK_PASSWORD  REST BaseServiceNumber (rest.payamak-panel.com), the
//                                              documented route; password = the panel's ApiKey (-110)
//   MELIPAYAMAK_TOKEN                          console API key (console.melipayamak.com), alternative
// Melipayamak rejects links inside variables (error -10), so links must live in the pattern text.
export const smsReady=env=>!!(env?.MELIPAYAMAK_TOKEN||(env?.MELIPAYAMAK_USERNAME&&env?.MELIPAYAMAK_PASSWORD));
export const otpEnabled=env=>smsReady(env)&&Number(env?.MELIPAYAMAK_OTP_BODY_ID)>0;
export const inviteEnabled=env=>smsReady(env)&&Number(env?.MELIPAYAMAK_INVITE_BODY_ID)>0;
// Error codes from the provider's SharedNumber web-service guide, for readable logs.
const ERRORS={'-110':'به جای رمز عبور باید ApiKey بگذارید','-109':'پنل تنظیم IP مجاز را الزامی کرده است','-108':'IP به دلیل تلاش ناموفق مسدود شده','-10':'لینک در متغیرها مجاز نیست','-6':'خطای داخلی سامانه','-5':'متغیرها با متن الگو همخوانی ندارد','-4':'کد الگو صحیح نیست یا تأیید نشده','-3':'خط ارسالی تعریف نشده','-2':'فقط یک شماره در هر ارسال','-1':'دسترسی وب‌سرویس غیرفعال است','0':'نام کاربری یا رمز صحیح نیست','2':'اعتبار کافی نیست','6':'سامانه در حال به‌روزرسانی','7':'متن حاوی کلمهٔ فیلترشده','10':'کاربر فعال نیست','11':'ارسال نشد','12':'مدارک کاربر کامل نیست','18':'شمارهٔ موبایل معتبر نیست','19':'سقف روزانهٔ وب‌سرویس پر شده'};
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
  // Per the provider's SharedNumber guide: success is RetStatus 1 with a recId of more than
  // 15 digits in Value; otherwise RetStatus is 35 (InvalidData) and Value holds the error code.
  if(res.ok&&d.RetStatus===1&&/^\d{15,}$/.test(id))return {ok:true,id};
  return {ok:false,error:('code_'+(id||'http_'+res.status)+' '+(ERRORS[id]||d.StrRetStatus||'')).trim().slice(0,200)};
 }catch(e){return {ok:false,uncertain:true,error:'network: '+String(e?.message||e).slice(0,150)}}
}
export async function logSms(db,row){
 await db.prepare('INSERT INTO sms_log(id,salon_id,kind,phone,provider_id,status,error,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),row.salon_id||null,row.kind,row.phone,row.id||null,row.ok?'sent':row.uncertain?'unknown':'failed',row.error||null,Date.now()).run();
}
