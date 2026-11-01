const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

(async()=>{
 const root=path.resolve(__dirname,'..');
 const out=path.join(root,'tmp','site-review');fs.mkdirSync(out,{recursive:true});
 const files=fs.readdirSync(root).filter(v=>v.endsWith('.html'));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];
 const langs=process.argv.includes('--quick')?['ru','en']:['ru','en','kk'];
 const sizes=process.argv.includes('--quick')?[390,1440]:[320,390,768,1024,1440];
 for(const width of sizes){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const lang of langs){
   await page.addInitScript(l=>localStorage.setItem('ifa-language',l),lang);
   for(const file of files){
    const errors=[]; const listener=err=>errors.push(err.message);page.on('pageerror',listener);
    const response=await page.goto(`http://127.0.0.1:8124/${file}`,{waitUntil:'networkidle'});
    const state=await page.evaluate(()=>{
     const visible=e=>e.getClientRects().length && !e.closest('[hidden]');
     const broken=[...document.images].filter(e=>e.hasAttribute('src')&&e.complete&&!e.naturalWidth).map(e=>e.getAttribute('src'));
     const big=[...document.querySelectorAll('body *')].filter(visible).filter(e=>{const b=e.getBoundingClientRect();return b.right>innerWidth+2&&getComputedStyle(e).position!=='fixed'&&!e.closest('.main-nav,.register-scroll,.history-track,.route-track,.journey-gallery')}).slice(0,5).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right}));
     const arrows=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
     while((n=w.nextNode())) if(n.parentElement?.closest('a,button')&&!n.parentElement.closest('script,style,svg')&&/[↗→←➡➜]/.test(n.nodeValue)) arrows.push(n.nodeValue);
     return {lang:document.documentElement.lang,title:document.title,h1:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth+1,broken,big,arrows,footer:!!document.querySelector('.organisation-details'),privateText:/020340011237|141140004839|Васнецова|КАЛЫМКУЛОВ|КЕРИМОВ/.test(document.body.innerText)};
    });
    results.push({file,width,expectedLang:lang,status:response.status(),...state,errors});
    if(width===1440&&['index.html','documents.html','idp-department.html','certificate-ida.html'].includes(file)&&lang==='ru') await page.screenshot({path:path.join(out,file.replace('.html',`-${width}-${lang}.png`)),fullPage:true});
    if(width===390&&['documents.html','idp-department.html'].includes(file)&&lang==='kk') await page.screenshot({path:path.join(out,file.replace('.html',`-${width}-${lang}.png`)),fullPage:true});
    page.off('pageerror',listener);
   }
  }
  await context.close();
  console.log(`checked width ${width}`);
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
 const failures=results.filter(v=>v.status!==200||v.lang!==v.expectedLang||v.overflow||v.errors.length||v.broken.length||v.arrows.length||v.privateText||!v.footer);
 console.log(JSON.stringify({cases:results.length,failures},null,2));
 await browser.close();
})();
