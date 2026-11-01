// Read-only post-deployment checks. Never submits partnership applications.
const fs=require('fs');const path=require('path');const crypto=require('node:crypto');const {execFileSync}=require('child_process');const {chromium}=require('playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 const out=path.join(root,'tmp','production-review');fs.mkdirSync(out,{recursive:true});
 const base='https://ifa.org.kz';const errors=[];const results=[];const hashes=[];
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'reduce'});
 const files=execFileSync('git',['diff-tree','--no-commit-id','--name-only','-r','HEAD'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(f=>!/^(scripts|docs|api)\//.test(f)&&!/^(\.gitignore|\.vercelignore|README.md|locales-kk-overrides.json)$/.test(f));
 for(const file of files){
  const response=await context.request.get(`${base}/${file}?release=${sha.slice(0,8)}`,{timeout:45000});
  const expected=execFileSync('git',['show',`HEAD:${file}`],{cwd:root,maxBuffer:10*1024*1024});
  const actual=await response.body();
  const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
  hashes.push({file,status:response.status(),match:digest(expected)===digest(actual),bytes:actual.length});
 }
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const htmlFiles=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:950});
  for(const lang of ['ru','en','kk'])for(const file of htmlFiles){
   const route=file==='index.html'?'/':`/${file.replace('.html','')}`;
   const response=await page.goto(`${base}${route}?lang=${lang}&release=${sha.slice(0,8)}`,{waitUntil:'networkidle',timeout:45000});
   const state=await page.evaluate(()=>({lang:document.documentElement.lang,title:document.title,overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>i.hasAttribute('src')&&i.complete&&!i.naturalWidth).map(i=>i.src),privateText:/020340011237|141140004839|КАЛЫМКУЛОВ|КЕРИМОВ/.test(document.body.innerText),footer:!!document.querySelector('.organisation-details')}));
   results.push({file,width,expectedLang:lang,status:response.status(),...state});
   if(lang==='ru'&&['index.html','about.html','documents.html','idp-department.html'].includes(file))await page.screenshot({path:path.join(out,`${file}-${width}.png`)});
  }
  console.log(`production browser checks complete: ${width}px`);
 }
 await page.goto(`${base}/?lang=ru`,{waitUntil:'networkidle'});
 const colors=await page.evaluate(()=>({membership:getComputedStyle(document.querySelector('[data-i18n="navMembership"]')).color,idp:getComputedStyle(document.querySelector('[data-i18n="navIdpDepartment"]')).color}));
 await page.setViewportSize({width:390,height:844});
 await page.locator('.menu-button').click();
 await page.locator('.mobile-language-switch [data-lang="kk"]').click();
 await page.waitForTimeout(100);
 const menuLanguage=await page.locator('html').getAttribute('lang');
 await page.locator('.main-nav a[href="documents.html"]').click();
 await page.waitForLoadState('networkidle');
 const persistedLanguage=await page.locator('html').getAttribute('lang');
 const api=await context.request.get(`${base}/api/partnership`);
 const failures=results.filter(r=>r.status!==200||r.lang!==r.expectedLang||r.overflow||r.broken.length||r.privateText||!r.footer);
 const report={sha,hashes,results,failures,errors,colors,menuLanguage,persistedLanguage,apiGetStatus:api.status()};
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({sha,assetChecks:hashes.length,hashFailures:hashes.filter(v=>!v.match||v.status!==200),browserChecks:results.length,failures,errors,colors,menuLanguage,persistedLanguage,apiGetStatus:api.status()},null,2));
 await browser.close();
 if(failures.length||errors.length||hashes.some(v=>!v.match||v.status!==200)||menuLanguage!=='kk'||persistedLanguage!=='kk'||api.status()!==405)process.exitCode=1;
})();
