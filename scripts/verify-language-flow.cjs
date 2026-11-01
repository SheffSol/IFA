const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');const out=path.join(root,'tmp','site-review');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage(); const results=[];const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8124/index.html');
 await page.locator('.menu-button').click();
 await page.locator('.mobile-language-switch [data-lang="kk"]').click();
 await page.screenshot({path:path.join(out,'mobile-menu-kk.png')});
 results.push({check:'mobile menu Kazakh',language:await page.locator('html').getAttribute('lang'),text:await page.locator('.main-nav').innerText()});
 await page.keyboard.press('Escape');
 await page.locator('.geography-section').scrollIntoViewIfNeeded();
 await page.locator('.geography-section').screenshot({path:path.join(out,'geography-mobile-kk.png')});
 await page.locator('[data-atlas-toggle]').first().click();
 results.push({check:'book Kazakh',text:await page.locator('[data-atlas-text]').first().textContent()});
 for(const file of ['documents.html','certificate-ida.html','material-fire-safety.html']){
  await page.goto(`http://127.0.0.1:8124/${file}`,{waitUntil:'networkidle'});
  results.push({check:'language persisted',file,lang:await page.locator('html').getAttribute('lang'),h1:await page.locator('h1').first().textContent()});
 }
 await page.locator('[data-lang="en"]').first().click();
 await page.waitForTimeout(100);
 results.push({check:'article EN',lang:await page.locator('html').getAttribute('lang'),heading:await page.locator('[data-language-content="en"] h1').textContent(),footer:await page.locator('.organisation-details').innerText()});
 await page.locator('[data-lang="ru"]').first().click();
 await page.waitForTimeout(100);
 results.push({check:'article RU',lang:await page.locator('html').getAttribute('lang'),heading:await page.locator('[data-language-content="ru"] h1').textContent()});
 await page.goto('http://127.0.0.1:8124/cooperation.html?lang=kk',{waitUntil:'networkidle'});
 let payload;
 await page.route('**/api/partnership',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,id:'IFA-LOCAL-QA'})});});
 await page.locator('[name="name"]').fill('Local QA');
 await page.locator('[name="organization"]').fill('IFA local review');
 await page.locator('[name="email"]').fill('qa@example.invalid');
 await page.locator('[name="phone"]').fill('+77000000000');
 await page.locator('[name="topic"]').selectOption('other');
 await page.locator('[name="message"]').fill('Local preview validation only');
 await page.locator('[name="consent"]').check();
 await page.locator('button[type="submit"]').click();
 await page.locator('.form-status').waitFor({state:'visible'});
 await page.waitForTimeout(100);
 results.push({check:'Kazakh form (mock API, no real submission)',payload,status:await page.locator('.form-status').innerText()});
 // Capture every remaining Russian source string on the Kazakh pages for editorial review.
 const candidates=[];
 for(const file of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){
  await page.goto(`http://127.0.0.1:8124/${file}?lang=kk`,{waitUntil:'networkidle'});
  const missing=await page.evaluate(()=>{
   const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
   while((n=w.nextNode())){
    const e=n.parentElement;if(!e||e.closest('script,style,svg,[hidden]')||!e.getClientRects().length)continue;
    const text=n.nodeValue.trim();
    if(/(?:\b(?:Согласно|Оформление|Проверить|водитель|страхов|сертификат|Управля|Документ|Официальн|выполн|дорожн|автомобил|Деятельност|сотруднич|подготов|предусмотр)|[ыьъэщё])/i.test(text)&&!/[әғқңөұүһі]/i.test(text)&&text.length>20&&!/International/.test(text))out.push(text);
   }
   return [...new Set(out)];
  });
  if(missing.length)candidates.push({file,missing});
 }
 fs.writeFileSync(path.join(out,'language-flow.json'),JSON.stringify({results,errors,candidates},null,2));
 console.log(JSON.stringify({results,errors,candidates},null,2));
 await browser.close();
})();
