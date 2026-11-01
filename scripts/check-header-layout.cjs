const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];
 for(const width of [320,390,768,1024,1280,1360,1361,1366,1440,1600,1920]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const lang of ['ru','en','kk']){
   await page.goto(`http://127.0.0.1:8124/index.html?lang=${lang}`,{waitUntil:'networkidle'});
   const data=await page.evaluate(()=>{
    const box=e=>{const b=e.getBoundingClientRect();return {x:b.x,right:b.right,width:b.width,y:b.y,bottom:b.bottom,height:b.height}};
    const brand=document.querySelector('.site-header .brand');const nav=document.querySelector('.main-nav');
    const links=[...nav.querySelectorAll(':scope > a')];
    return {brand:box(brand),brandText:box(brand.querySelector('.brand-copy strong')),brandFont:getComputedStyle(brand.querySelector('.brand-copy strong')).fontSize,nav:box(nav),mobile:matchMedia('(max-width:1360px)').matches,links:links.map(e=>({key:e.dataset.i18n||'documents',text:e.textContent,box:box(e),font:getComputedStyle(e).fontSize,color:getComputedStyle(e).color,scroll:e.scrollWidth})),overflow:document.documentElement.scrollWidth>innerWidth};
   });
   results.push({width,lang,...data});
   if([390,1366,1440,1920].includes(width)&&['ru','kk'].includes(lang)){
    if(data.mobile)await page.locator('.menu-button').click();
    await page.screenshot({path:`tmp/header-review/header-${width}-${lang}.png`});
   }
  }
  await page.close();
 }
 fs.mkdirSync('tmp/header-review',{recursive:true});fs.writeFileSync('tmp/header-review/layout.json',JSON.stringify(results,null,2));
 const failures=results.filter(r=>r.overflow||(!r.mobile&&(r.brandText.right+12>r.links[0].box.x||r.links.some((l,i)=>i>0&&l.box.x-r.links[i-1].box.right<10)))||r.links.find(l=>l.key==='navMembership')?.color!=='rgb(255, 255, 255)'||r.links.find(l=>l.key==='navIdpDepartment')?.color!=='rgb(216, 189, 131)');
 console.log(JSON.stringify({cases:results.length,failures:failures.map(r=>({width:r.width,lang:r.lang,brandRight:r.brandText.right,firstLink:r.links[0].box.x,overflow:r.overflow})),desktop:results.filter(r=>!r.mobile).map(r=>({width:r.width,lang:r.lang,brandGap:Math.round(r.links[0].box.x-r.brandText.right),minLinkGap:Math.round(Math.min(...r.links.slice(1).map((l,i)=>l.box.x-r.links[i].box.right)))}))},null,2));
 await browser.close();
})();
