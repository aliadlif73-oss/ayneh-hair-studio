// Builds isolated copies; does not modify worker/index.js, wrangler.toml or original resources.
import {readFile,writeFile,mkdir,readdir,cp,rm} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const args=process.argv.slice(2),lines=args.length?args:['hair','color','nails','lashes'];
for(const line of lines){
 if(!['hair','color','nails','lashes'].includes(line))throw Error('Unknown edition');
 const dir=path.join(root,'editions-dist',line);await rm(dir,{recursive:true,force:true});await mkdir(path.join(dir,'worker'),{recursive:true});
 await cp(path.join(root,'worker'),path.join(dir,'worker'),{recursive:true});
 const change=async(file,edits)=>{let s=await readFile(path.join(dir,'worker',file),'utf8');for(const [from,to]of edits){if(!s.includes(from))throw Error(file+': source anchor missing '+from.slice(0,70));s=s.replace(from,to);}await writeFile(path.join(dir,'worker',file),s);};
 await change('customer.js',[
  ["state.line=lq||(LINES.label[lm]?lm:'hair');",`state.line='${line}';`],
  ["var pm=pending&&pending.match(/^(hair|color|nails|lashes):(.+)$/);if(pm){lq=pm[1];pending=pm[2]}",`var pm=pending&&pending.match(/^(hair|color|nails|lashes):(.+)$/);if(pm){pending=pm[1]==='${line}'?pm[2]:null}`],
  ["var LINE_LIST=[['hair','مدل مو','scissors'],['color','رنگ مو','drop'],['nails','ناخن','nails'],['lashes','مژه','lashes']];",`var LINE_LIST=[['${line}',LINES.label['${line}'],'${{hair:'scissors',color:'drop',nails:'nails',lashes:'lashes'}[line]}']];`],
  ["if(to===state.line||!LINES.label[to])return;",`if(to!=='${line}'||to===state.line||!LINES.label[to])return;`],
  ["if(L==='hair')box.append",`if(false)box.append`],
  ["مدل مو، رنگ مو، طرح ناخن یا مژهٔ",`${{hair:'مدل موی',color:'رنگ موی',nails:'طرح ناخن',lashes:'مدل مژه'}[line]}`],
  ["مدل مو، رنگ مو، طرح ناخن یا مژهٔ",`${{hair:'مدل موی',color:'رنگ موی',nails:'طرح ناخن',lashes:'مدل مژه'}[line]}`],
  ["مدل مو، رنگ مو، طرح ناخن یا مژه",`${{hair:'مدل مو',color:'رنگ مو',nails:'طرح ناخن',lashes:'مدل مژه'}[line]}`],
  ["function tourSteps(){",`function tourSteps(){return [{el:'.hero__cta',title:'شروع با عکس خودت',text:'عکس واضح اضافه کن؛ بعد از مدل آماده، نمونه‌کار متخصص یا عکس مرجع انتخاب کن.'},{el:'#steps',title:'عکس، انتخاب و نتیجه',text:'این نسخه فقط برای '+LINES.label['${line}']+' است. نتیجه را ببین و برای متخصص بفرست.',last:true}];}\nfunction unusedMultiServiceTourSteps(){`],
  ["var qs=(location.search.match",`var qs=(location.search.match`],
  ["if(qs!==undefined&&state.line==='hair'&&+qs<20)state.style=+qs;",`if(qs!==undefined&&+qs<(state.line==='hair'?STYLES:LINES[state.line].styles).length)state.style=+qs;`],
  ["function heroTag(){",`function heroTag(){if(state.line==='color')return 'رنگ موی دلخواهت را با حفظ مدل فعلی روی عکس خودت ببین و برای متخصص رنگ بفرست.';return originalHeroTag()}\nfunction originalHeroTag(){`]
 ]);
 await change('ui.js',[
  ["[['hair','مدل مو'],['color','رنگ مو'],['nails','ناخن'],['lashes','مژه']].map(function(o)",`[['${line}',${JSON.stringify({hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'}[line])}]].map(function(o)`],
  ["[['hair','مدل مو'],['color','رنگ مو'],['nails','ناخن'],['lashes','مژه']].map(function(o)",`[['${line}',${JSON.stringify({hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'}[line])}]].map(function(o)`],
  ["$('#app').replaceChildren(head,",`head.append(el('a',{class:'btn btn--ghost',href:'/admin/integrations',text:'تنظیم سرویس تصویر و ربات'}));$('#app').replaceChildren(head,`],
  // Free images of a page built in the bot (onboarding.js): used/limit, the specialist's mobile, the cap or «فعال‌سازی کامل».
  ["el('div',{class:'stack'},[tg,teamC,set,leads])","el('div',{class:'stack'},[tg,teamC,set,freeCard(d),leads].filter(Boolean))"],
  ["function salonPage(){",`function freeCard(d){var f=d.free;if(!f)return null;var n=el('input',{id:'fr-n',type:'number',min:'0',step:'1',inputmode:'numeric',value:String(f.limit)});
 return el('section',{class:'card'},[h('h2','تصویر رایگان (ساخته‌شده با ربات)'),h('p',(f.full?'فعال‌سازی کامل: بدون سقف کل؛ سهم هر مشتری سر جایش است.':fa(f.used)+' از '+fa(f.limit)+' تصویر رایگان مصرف شده.')+(f.phone?' موبایل متخصص: '+f.phone:''),'lead'),check('fr-full','فعال‌سازی کامل (بدون سقف کل)',f.full),el('label',{class:'field'},[el('span',{class:'lbl',text:'سقف تصویر رایگان کل صفحه'}),n]),el('button',{class:'btn btn--primary',type:'button',text:'ذخیره',onclick:act(function(){return api('/api/s/'+slug+'/owner/free',{full:$('#fr-full').checked,limit:Number(n.value)}).then(function(){toast('ذخیره شد.');salonPage()})})})]);}
function salonPage(){`]
 ]);
 await change('server.js',[
  ["JSON.stringify({generation_enabled:true,reference_verified:true})","JSON.stringify({generation_enabled:true,reference_verified:false})"],
  ["const others=LINE_KEYS.filter(k=>k!==line&&left[k]>0).map(k=>'«'+LINE_LABEL[k]+'»');","const others=[];"],
  ["if(route==='views'&&req.method==='POST'){",`if(route==='views'&&req.method==='POST'){must('${line}'==='hair','نمای دور سر فقط برای مدل مو است',404);`],
  ["const b=await req.json();const line=LINE_KEYS.includes(b.line)?b.line:'hair';",`const b=await req.json();must(!b.line||b.line==='${line}','خدمت دیگری در این نسخه وجود ندارد');const line='${line}';`],
  // Pages built in the bot (onboarding.js) keep the per-customer quota on top of their free images.
  ["if(!trial&&!demo&&!free)await spendQuota(db,salon,s,visitor,line);","if((!trial||cfg.bot_made)&&!demo&&!free)await spendQuota(db,salon,s,visitor,line);"],
  ["if(!trial&&!free)await spendQuota(db,salon,s,visitor,'hair')","if((!trial||cfg.bot_made)&&!free)await spendQuota(db,salon,s,visitor,'hair')"],
  ["quota:trial||demo||await unlimited(db,s)?null:","quota:(trial&&!cfg.bot_made)||demo||await unlimited(db,s)?null:"]
 ]);
 await change('trial.js',[["JSON.stringify({generation_enabled:true,reference_verified:true,trial:true})","JSON.stringify({generation_enabled:true,reference_verified:false,trial:true})"]]);
 await change('telegram.js',[
  ["const line=guessed||groupLine||lineFromSpecialty(t?.specialty)||'hair';",`const line='${line}';`],
  ["if(!LINE_LABEL[line]||!/^[a-f0-9-]{36}$/.test(id||''))",`if(line!=='${line}'||!LINE_LABEL[line]||!/^[a-f0-9-]{36}$/.test(id||''))`],
  ["inline_keyboard:[['hair','color'],['nails','lashes']].map",`inline_keyboard:[['${line}']].map`],
  ["body={...body};",`body={...body};if(body.text)body.text=body.text.replaceAll('مدیر سالن','متخصص').replaceAll('سالن','متخصص');if(body.caption)body.caption=body.caption.replaceAll('سالن','متخصص');`]
 ]);
 const assets={},catalog=path.join(root,'public','catalog'),sub=line==='hair'?catalog:path.join(catalog,line);
 for(const name of await readdir(sub)){if(!name.endsWith('.webp'))continue;assets['/catalog/'+(line==='hair'?'':line+'/')+name]=(await readFile(path.join(sub,name))).toString('base64');}
 await writeFile(path.join(dir,'worker','edition-assets.js'),'export const LINE='+JSON.stringify(line)+';\nexport const ASSETS='+JSON.stringify(assets)+';\n');
 await writeFile(path.join(dir,'package.json'),'{"type":"module"}\n');
 console.log(line+': '+Object.keys(assets).length+' catalog/demo assets; isolated entrypoint ready');
}
