const fs=require('fs');const path=require('path');const {chromium}=require('playwright');
(async()=>{
 const base=process.argv.includes('--production')?'https://ifa.org.kz':'http://127.0.0.1:8124';
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'reduce'});
 const old=/сервисн.{0,15}агент|service agents?|сервистік агент/iu;const pages=[];const errors=[];
 for(const file of fs.readdirSync(path.resolve(__dirname,'..')).filter(n=>n.endsWith('.html'))){
  const response=await context.request.get(`${base}/${file}?role=official-partner`);const html=await response.text();
  pages.push({file,status:response.status(),oldRole:old.test(html),newRole:html.includes('Официальный партнёр IDA в ОАЭ')&&html.includes('IDA official partner in the UAE')&&html.includes('БАӘ-дегі IDA ресми серіктесі')});
 }
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const checks=[];
 for(const width of [320,1440])for(const lang of ['ru','en','kk']){
  await page.setViewportSize({width,height:950});await page.goto(`${base}/idp-department.html?lang=${lang}&role=official-partner`,{waitUntil:'networkidle'});
  const content=await page.locator('.idp-international').innerText();const footer=await page.locator('.organisation-network').innerText();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  checks.push({width,lang,content,footer,oldRole:old.test(content+footer),overflow});
 }
 console.log(JSON.stringify({base,pages:pages.length,failures:pages.filter(p=>p.status!==200||p.oldRole||!p.newRole),checks,errors},null,2));await browser.close();
 if(pages.some(p=>p.status!==200||p.oldRole||!p.newRole)||checks.some(p=>p.oldRole||p.overflow)||errors.length)process.exitCode=1;
})();
