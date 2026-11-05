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
  ["function tourSteps(){",`function tourSteps(){return [{el:'.hero__cta',title:'شروع با عکس خودت',text:'عکس واضح اضافه کن؛ بعد از مدل آماده، نمونه‌کار متخصص یا عکس مرجع انتخاب کن.'},{el:'#steps',title:'عکس، انتخاب و نتیجه',text:'این نسخه فقط برای '+LINES.label['${line}']+' است. نتیجه را ببین و برای متخصص بفرست.',last:true}];}\nfunction unusedMultiServiceTourSteps(){`],
  ["var qs=(location.search.match",`var qs=(location.search.match`],
  ["if(qs!==undefined&&state.line==='hair'&&+qs<20)state.style=+qs;",`if(qs!==undefined&&+qs<(state.line==='hair'?STYLES:LINES[state.line].styles).length)state.style=+qs;`],
  ["function heroTag(){",`function heroTag(){if(state.line==='color')return 'رنگ موی دلخواهت را با حفظ مدل فعلی روی عکس خودت ببین و برای متخصص رنگ بفرست.';return originalHeroTag()}\nfunction originalHeroTag(){`]
 ]);
 await change('ui.js',[
  ["[['hair','مدل مو'],['color','رنگ مو'],['nails','ناخن'],['lashes','مژه']].map(function(o)",`[['${line}',${JSON.stringify({hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'}[line])}]].map(function(o)`],
  ["[['hair','مدل مو'],['color','رنگ مو'],['nails','ناخن'],['lashes','مژه']].map(function(o)",`[['${line}',${JSON.stringify({hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'}[line])}]].map(function(o)`],
  ["$('#app').replaceChildren(head,",`head.append(el('a',{class:'btn btn--ghost',href:'/admin/integrations',text:'تنظیم سرویس تصویر و ربات'}));$('#app').replaceChildren(head,`]
 ]);
 await change('server.js',[
  ["JSON.stringify({generation_enabled:true,reference_verified:true})","JSON.stringify({generation_enabled:true,reference_verified:false})"],
  ["const others=LINE_KEYS.filter(k=>k!==line&&left[k]>0).map(k=>'«'+LINE_LABEL[k]+'»');","const others=[];"],
  ["if(route==='views'&&req.method==='POST'){",`if(route==='views'&&req.method==='POST'){must('${line}'==='hair','نمای دور سر فقط برای مدل مو است',404);`],
  ["const b=await req.json();const line=LINE_KEYS.includes(b.line)?b.line:'hair';",`const b=await req.json();must(!b.line||b.line==='${line}','خدمت دیگری در این نسخه وجود ندارد');const line='${line}';`]
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
