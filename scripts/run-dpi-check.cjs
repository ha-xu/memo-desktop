const {spawnSync}=require('node:child_process');
const path=require('node:path');
const result=spawnSync(require('electron'),[path.join(__dirname,'check-dpi.cjs')],{stdio:'inherit',windowsHide:true,timeout:30000});
if(result.error)throw result.error;
process.exitCode=result.status===0?0:1;
