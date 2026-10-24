// Always launch this checkout, never an older executable from release/.
const {spawn,spawnSync}=require('node:child_process');const fs=require('node:fs');const path=require('node:path');const net=require('node:net');const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');const env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
const pipe='\\\\.\\pipe\\memo-desktop-'+crypto.createHash('sha256').update(require('node:os').userInfo().username).digest('hex').slice(0,16);
function current(){return new Promise(resolve=>{const socket=net.createConnection(pipe);let data='';const done=value=>{socket.destroy();resolve(value)};socket.setTimeout(1500,()=>done(null));socket.on('error',()=>done(null));socket.on('connect',()=>socket.write(JSON.stringify({action:'state'})+'\n'));socket.on('data',chunk=>{data+=chunk;if(data.includes('\n')){try{done(JSON.parse(data.split('\n')[0]).result?.info||{})}catch{done({})}}})})}
async function main(){
 const running=await current();const version=require('../package.json').version;
 if(running&&(!running.local||running.version!==version)){console.error('Another Memo version is running. Quit it from the system tray, then run start.cmd again.\n检测到其他版本正在运行。请在托盘中退出旧版本，再运行 start.cmd。');process.exitCode=2;return;}
 if(!fs.existsSync(path.join(root,'node_modules'))){console.error('Run npm install first.');process.exitCode=1;return;}
 const runtime=spawnSync(process.execPath,[path.join(__dirname,'ensure-electron.cjs')],{cwd:root,env,stdio:'inherit',windowsHide:true});if(runtime.status!==0){process.exitCode=1;return;}
 const build=spawnSync(process.env.ComSpec||'cmd.exe',['/d','/s','/c','npm run build'],{cwd:root,env,stdio:'inherit',windowsHide:true});if(build.status!==0){process.exitCode=1;return;}
 const child=spawn(require('electron'),[root,'--local'],{cwd:root,env,detached:true,stdio:'ignore',windowsHide:true});child.on('error',e=>{console.error(e.message);process.exitCode=1});child.unref();console.log(`Memo Desktop ${version}: started from ${root}`);
}
module.exports={main};
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1});
