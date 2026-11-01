const fs=require('fs');const path=require('path');const {chromium}=require('playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');const out=path.join(root,'tmp','about-review');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];const errors=[];
 for(const width of [320,390,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['ru','en','kk']){
   await page.goto(`http://127.0.0.1:8124/about.html?lang=${lang}`,{waitUntil:'networkidle'});
   const result=await page.evaluate(()=>({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth>innerWidth+1,image:document.querySelector('.dossier-hero-media img').getAttribute('src'),loaded:document.querySelector('.dossier-hero-media img').naturalWidth>0,alt:document.querySelector('.dossier-hero-media img').alt,uae:document.querySelector('.organisation-network a').textContent}));
   results.push({width,expectedLang:lang,...result});
   if([390,1440].includes(width)&&lang==='ru'){
    await page.screenshot({path:path.join(out,`about-${width}.png`)});
    await page.locator('.dossier-hero-media').screenshot({path:path.join(out,`illustration-${width}.png`)});
   }
  }
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const wording=[];
 for(const file of fs.readdirSync(root).filter(v=>v.endsWith('.html'))){
  for(const lang of ['ru','en','kk']){
   await page.goto(`http://127.0.0.1:8124/${file}?lang=${lang}`,{waitUntil:'networkidle'});
   const text=await page.locator('.organisation-network a').first().innerText();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   if(/дубайск|dubai office|Дубай кеңсесі/i.test(text)||overflow)wording.push({file,lang,text,overflow});
  }
 }
 const failures=results.filter(r=>r.lang!==r.expectedLang||r.overflow||!r.loaded||r.image!=='assets/hero-eurasian-route.webp');
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,failures,errors,wording},null,2));
 console.log(JSON.stringify({aboutCases:results.length,footerCases:48,failures,errors,wording},null,2));
 await browser.close();
})();
