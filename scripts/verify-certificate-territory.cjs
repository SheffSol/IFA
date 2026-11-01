const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];const errors=[];const out=path.resolve('tmp/territory-review');fs.mkdirSync(out,{recursive:true});
 for(const width of [320,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['ru','en','kk'])for(const file of ['index.html','about.html','documents.html','idp-department.html','certificate-ida.html']){
   const response=await page.goto(`http://127.0.0.1:8124/${file}?lang=${lang}`,{waitUntil:'networkidle'});
   const state=await page.evaluate(()=>({language:document.documentElement.lang,text:document.querySelector('main').innerText,overflow:document.documentElement.scrollWidth>innerWidth+1}));
   const target=lang==='ru'?'Евразии':lang==='en'?'Eurasian':'Еуразия';
   results.push({file,width,lang,status:response.status(),language:state.language,territory:state.text.includes(target)&&state.text.includes('MENA'),certificate:state.text.includes('2012-23779-001'),overflow:state.overflow});
   if(file==='about.html'&&lang==='ru')await page.screenshot({path:path.join(out,`about-${width}.png`)});
  }
  await page.close();
 }
 const failures=results.filter(r=>r.status!==200||r.language!==r.lang||!r.territory||!r.certificate||r.overflow);
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,failures,errors},null,2));
 console.log(JSON.stringify({cases:results.length,failures,errors},null,2));await browser.close();
})();
