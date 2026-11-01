const fs=require('fs');const path=require('path');const {chromium}=require('playwright');
(async()=>{
 const base=process.argv.includes('--production')?'https://ifa.org.kz':'http://127.0.0.1:8124';
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'reduce'});const results=[];
 for(const file of fs.readdirSync(path.resolve(__dirname,'..')).filter(f=>f.endsWith('.html'))){
  const response=await context.request.get(`${base}/${file}?address=vasnetsova12`);const html=await response.text();
  results.push({file,status:response.status(),newAddress:html.includes('улица Васнецова, дом 12, почтовый индекс 050000'),oldIfaAddress:html.includes('Фактический адрес: Казахстан, Алматы, ул. Тулебаева')});
 }
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const browserChecks=[];
 for(const width of [320,1440])for(const lang of ['ru','en','kk']){
  await page.setViewportSize({width,height:950});await page.goto(`${base}/index.html?lang=${lang}&address=vasnetsova12`,{waitUntil:'networkidle'});
  const address=await page.locator('.organisation-details address').innerText();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  browserChecks.push({width,lang,address,overflow,valid:address.includes('050000')&&/Васнец|Vasnetsov/.test(address)});
 }
 await page.goto(`${base}/idp-department.html?lang=ru&address=vasnetsova12`,{waitUntil:'networkidle'});
 const idaAddress=await page.locator('[data-i18n="idaHeadOfficeAddress"]').innerText();
 const failures=results.filter(r=>r.status!==200||!r.newAddress||r.oldIfaAddress);
 console.log(JSON.stringify({base,pages:results.length,failures,browserChecks,idaUnchanged:idaAddress.includes('Тулебаева, 95/1'),errors},null,2));await browser.close();
 if(failures.length||errors.length||browserChecks.some(r=>!r.valid||r.overflow)||!idaAddress.includes('Тулебаева, 95/1'))process.exitCode=1;
})();
