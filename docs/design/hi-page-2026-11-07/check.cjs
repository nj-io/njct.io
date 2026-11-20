const {createRequire}=require('module');
const req=createRequire('/Users/neil/.cache/board-tools/node_modules/');
const puppeteer=req('puppeteer-core');
const fs=require('fs'),path=require('path');
const OUT='/Users/neil/dev/njct.io/docs/design/hi-page-2026-11-07';
const CH='/Users/neil/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const dirs=[];
for(const v of fs.readdirSync(OUT)) if(/^v\d/.test(v)) for(const d of fs.readdirSync(path.join(OUT,v))){const p=path.join(OUT,v,d); if(fs.existsSync(p+'/index.html')) dirs.push(p);}
(async()=>{
 const b=await puppeteer.launch({executablePath:CH,headless:true,args:['--use-mock-keychain','--password-store=basic','--no-sandbox']});
 for(const d of dirs){
  const pg=await b.newPage(); await pg.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const errs=[];
  pg.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
  pg.on('pageerror',e=>errs.push('pageerror: '+e.message));
  pg.on('requestfailed',r=>errs.push('reqfail: '+r.url().slice(0,100)));
  await pg.goto('file://'+d+'/index.html?lang=en',{waitUntil:'load'});
  await new Promise(r=>setTimeout(r,5500));
  await pg.screenshot({path:d+'/preview-390x844.png'});
  console.log(path.relative(OUT,d), errs.length?('ERR '+JSON.stringify(errs)):'ok');
  await pg.close();
 }
 await b.close();
})();
