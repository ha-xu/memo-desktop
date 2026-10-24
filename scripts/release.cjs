// Release metadata and artifacts are prepared locally; publishing is CI's job.
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
function readRelease(root,tag){
 const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
 const lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'),'utf8'));
 const version=pkg.version;
 const match=typeof version==='string'&&version.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?(?:\+([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?$/);
 if(!match||match[4]?.split('.').some(part=>/^0\d+$/.test(part)))throw new Error('package.json must contain a valid semantic version');
 if(lock.version!==version||lock.packages?.['']?.version!==version)throw new Error('package.json and package-lock.json versions do not match');
 if(tag!==undefined&&tag!==`v${version}`)throw new Error(`Release tag must be v${version}, received ${tag}`);
 const lines=fs.readFileSync(path.join(root,'CHANGELOG.md'),'utf8').split(/\r?\n/);
 const heading=new RegExp('^## \\['+version.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\](?:\\s+-\\s+\\d{4}-\\d{2}-\\d{2})?\\s*$');
 const start=lines.findIndex(line=>heading.test(line));if(start<0)throw new Error(`CHANGELOG.md has no release section for ${version}`);
 let end=start+1;while(end<lines.length&&!/^##\s/.test(lines[end]))end++;
 const notes=lines.slice(start+1,end).join('\n').trim();if(!/^[-*] .+/m.test(notes))throw new Error('Release notes must contain at least one change');
 return {version,tag:`v${version}`,prerelease:!!match[4],notes:`# Memo Desktop ${version}\n\n${notes}\n`};
}
function prepareRelease(root,buildDirectory='release',tag){
 const release=readRelease(root,tag);const directory=path.resolve(root,buildDirectory);
 const installer=`Memo Desktop Setup ${release.version}.exe`,names=[installer,installer+'.blockmap'];
 for(const name of names){const target=path.join(directory,name);if(!fs.existsSync(target)||!fs.statSync(target).isFile()||fs.statSync(target).size===0)throw new Error(`Missing or empty release asset: ${name}`)}
 const handle=fs.openSync(path.join(directory,installer),'r');const header=Buffer.alloc(2);try{fs.readSync(handle,header,0,2,0)}finally{fs.closeSync(handle)}if(header.toString()!=='MZ'||fs.statSync(path.join(directory,installer)).size<1024)throw new Error('Installer is not a valid Windows executable');
 const output=path.join(root,'work','release-assets');const expected=new Set([...names,'SHA256SUMS.txt','release-notes.md']);
 if(fs.existsSync(output)&&fs.readdirSync(output).some(name=>!expected.has(name)))throw new Error('Release staging directory contains unexpected files; use a fresh checkout');
 fs.mkdirSync(output,{recursive:true});
 const checksums=names.map(name=>{const source=path.join(directory,name);const hash=crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');fs.copyFileSync(source,path.join(output,name));return `${hash}  ${name}`}).join('\n')+'\n';
 fs.writeFileSync(path.join(output,'SHA256SUMS.txt'),checksums);fs.writeFileSync(path.join(output,'release-notes.md'),release.notes);
 return {...release,output,files:[...names,'SHA256SUMS.txt']};
}
function main(){const root=path.resolve(__dirname,'..');const command=process.argv[2]||'check';const tag=process.env.RELEASE_TAG;let result;if(command==='check')result=readRelease(root,tag);else if(command==='prepare')result=prepareRelease(root,process.argv[3]||'release',tag);else throw new Error('Use: node scripts/release.cjs check | prepare [build-directory]');if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`version=${result.version}\nprerelease=${result.prerelease}\n`);console.log(`Release ${result.tag}: metadata verified${result.output?', assets staged in '+result.output:''}`)}
module.exports={readRelease,prepareRelease};if(require.main===module)try{main()}catch(error){console.error(error.message);process.exitCode=1}
