// Isolated API verification: generated test credentials and mocked Google calls.
const fs=require('fs');const vm=require('vm');const crypto=require('node:crypto');
(async()=>{
 const privateKey=crypto.generateKeyPairSync('rsa',{modulusLength:2048}).privateKey.export({type:'pkcs8',format:'pem'});
 const rows=[];
 const sandbox={module:{exports:{}},require,Buffer,URL,URLSearchParams,console,Date,Map,process:{env:{GOOGLE_SERVICE_ACCOUNT_EMAIL:'local@example.invalid',GOOGLE_PRIVATE_KEY:privateKey,GOOGLE_SHEETS_ID:'LOCAL-TEST'}},fetch:async(url,options)=>{
  if(url.includes('oauth2.googleapis.com'))return{ok:true,json:async()=>({access_token:'LOCAL-TEST'})};
  rows.push(JSON.parse(options.body).values[0]);return{ok:true};
 }};
 vm.runInNewContext(fs.readFileSync('api/partnership.js','utf8'),sandbox);
 const results=[];
 for(const language of ['ru','en','kk']){
  let body;
  const response={setHeader(){},end(value){body=JSON.parse(value)}};
  await sandbox.module.exports({method:'POST',headers:{host:'localhost',origin:'http://localhost','x-forwarded-for':`local-${language}`},body:{name:'Local QA',organization:'IFA',email:'qa@example.invalid',phone:'+77000000000',topicKey:'other',message:'Local verification only',consent:true,language}},response);
  results.push({language,status:response.statusCode,ok:body.ok,sheetLanguage:rows.at(-1)?.[8],topic:rows.at(-1)?.[6]});
 }
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>r.status!==201||!r.ok||r.sheetLanguage!==r.language.toUpperCase()))process.exitCode=1;
})();
