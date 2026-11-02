import {must,phone,text,uid} from './domain.js';
import {notifyOwner} from './alerts.js';

// Free trial salon page: a salon owner builds it from the landing form and can use it for a short
// time with a small image budget. Both limits are enforced here on the server, never in the page.
export const TRIAL_HOURS=10,TRIAL_IMAGES=5;
export const BRANDS=['#B9975B','#8E3050','#5E6B3A','#2E5468'];
const run=(db,sql,...a)=>db.prepare(sql).bind(...a).run();
const one=(db,sql,...a)=>db.prepare(sql).bind(...a).first();

export const trialOf=(db,salonId)=>one(db,'SELECT * FROM trials WHERE salon_id=?',salonId);
export const trialLive=t=>!!t&&Date.now()<t.expires_at;
export function trialPublic(t){if(!t)return null;return {expires_at:t.expires_at,expired:!trialLive(t),images_limit:t.images_limit,images_left:Math.max(0,t.images_limit-t.images_used),brand:t.brand||''};}

// Takes one image from the trial's budget, atomically. Called before any paid request is created.
export async function spendTrialImage(db,t){
 if(!t)return;
 must(trialLive(t),'مهلت ۱۰ ساعتهٔ صفحهٔ آزمایشی تمام شده است؛ برای ادامه با ما تماس بگیرید',410);
 const r=await run(db,'UPDATE trials SET images_used=images_used+1 WHERE id=? AND images_used<images_limit AND expires_at>?',t.id,Date.now());
 must(r.meta.changes,'سهمیهٔ '+t.images_limit+' تصویر صفحهٔ آزمایشی تمام شده است؛ برای ادامه با ما تماس بگیرید',402);
}

const rand=()=>Array.from(crypto.getRandomValues(new Uint8Array(4)),x=>x.toString(16).padStart(2,'0')).join('');

// POST /api/trial body: {name,salon,city,phone,brand,consent,note}. Creates the salon, its trial row
// and the lead for the project owner in one go, and returns the page address.
export async function createTrial(db,env,origin,b){
 must(b.consent===true,'برای ساخت صفحه، تأیید تماس لازم است');
 const name=text(String(b.name||''),60),salon=text(String(b.salon||''),80),city=text(String(b.city||''),40),note=text(String(b.note||''),300);
 must(name.length>=2,'نام خودت را بنویس');must(salon.length>=2,'نام سالن را بنویس');
 const tel=phone(b.phone),brand=BRANDS.includes(b.brand)?b.brand:BRANDS[0];
 must(!await one(db,'SELECT 1 FROM trials WHERE phone=?',tel),'برای این شماره قبلاً صفحهٔ آزمایشی ساخته شده است؛ با ما تماس بگیرید',409);
 const id=uid(),salonId=uid(),slug='t-'+rand(),now=Date.now(),expires=now+TRIAL_HOURS*3600000;
 await db.batch([
  db.prepare('INSERT INTO salons(id,slug,owner_id,name,created_at,profile,settings) VALUES(?,?,?,?,?,?,?)').bind(salonId,slug,'trial',salon,now,JSON.stringify(city?{address:city}:{}),JSON.stringify({generation_enabled:true,reference_verified:true,trial:true})),
  db.prepare('INSERT INTO trials(id,salon_id,name,phone,brand,created_at,expires_at,images_limit) VALUES(?,?,?,?,?,?,?,?)').bind(id,salonId,name,tel,brand,now,expires,TRIAL_IMAGES),
  db.prepare('INSERT INTO inquiries(id,name,salon,city,phone,note,chosen,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(uid(),name,salon,city,tel,note,'صفحهٔ آزمایشی '+slug,now)
 ]);
 const url=(env.APP_ORIGIN||origin)+'/s/'+slug;
 await notifyOwner(env,{kind:'trial',level:'good',text:'صفحهٔ آزمایشی «'+salon+'»'+(city?' ('+city+')':'')+' ساخته شد',detail:'👤 '+name+'\n📞 '+tel+'\n🔗 '+url+'\n⏳ '+TRIAL_HOURS+' ساعت · '+TRIAL_IMAGES+' تصویر'+(note?'\n📝 '+note:'')});
 return {ok:true,path:'/s/'+slug,url,expires_at:expires,images:TRIAL_IMAGES,hours:TRIAL_HOURS};
}
