// Electron 45 installs its runtime separately. Use the official archive and npm-shipped checksum.
const fs=require('node:fs/promises');const path=require('node:path');const crypto=require('node:crypto');
const {promisify}=require('node:util');const {execFile}=require('node:child_process');const run=promisify(execFile);
(async()=>{
 const root=path.resolve(__dirname,'..');const electronDir=path.join(root,'node_modules/electron');
 try{await fs.access(path.join(electronDir,'dist/electron.exe'));await fs.access(path.join(electronDir,'path.txt'));return}catch{}
 const {version}=require(path.join(electronDir,'package.json'));const name=`electron-v${version}-win32-x64.zip`;
 const expected=require(path.join(electronDir,'checksums.json'))[name];if(!expected)throw new Error('Missing official Electron checksum');
 const dir=path.join(root,'work/downloads');await fs.mkdir(dir,{recursive:true});const archive=path.join(dir,name);
 async function verified(){try{return crypto.createHash('sha256').update(await fs.readFile(archive)).digest('hex')===expected}catch{return false}}
 if(!await verified()){
  console.log(`Downloading official Electron ${version}…`);
  const args=['-f','-sS','-L','--retry','2','--max-time','300'];
  const proxy=process.env.HTTPS_PROXY||process.env.HTTP_PROXY;if(proxy)args.push('--proxy',proxy);
  args.push('-o',archive,`https://github.com/electron/electron/releases/download/v${version}/${name}`);
  await run('curl.exe',args,{windowsHide:true,timeout:660000});
  if(!await verified())throw new Error('Electron SHA256 verification failed');
 }
 const dest=path.join(electronDir,'dist');
 await run('powershell.exe',['-NoProfile','-NonInteractive','-Command','Expand-Archive -LiteralPath $env:MEMO_RUNTIME_ZIP -DestinationPath $env:MEMO_RUNTIME_DEST -Force'],{windowsHide:true,timeout:120000,env:{...process.env,MEMO_RUNTIME_ZIP:archive,MEMO_RUNTIME_DEST:dest}});
 await fs.writeFile(path.join(electronDir,'path.txt'),'electron.exe');console.log('Electron runtime verified and ready.');
})().catch(error=>{console.error(error.message);process.exitCode=1});
