const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');let checked=0;const missing=[];
for(const file of fs.readdirSync(root).filter(v=>v.endsWith('.html'))){
 const content=fs.readFileSync(path.join(root,file),'utf8');
 for(const match of content.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
  const url=new URL(match[1],'http://local.test/');
  if(url.origin!=='http://local.test')continue;
  if(!url.pathname||url.pathname==='/')continue;
  const target=path.join(root,decodeURIComponent(url.pathname));checked++;
  if(!fs.existsSync(target))missing.push({file,link:match[1]});
 }
}
console.log(JSON.stringify({checked,missing},null,2));
if(missing.length)process.exitCode=1;
