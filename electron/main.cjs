const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen, dialog, clipboard } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const net = require('node:net');
const crypto = require('node:crypto');
const {translate,setSystemLocale}=require('./i18n.cjs');
const tr=key=>translate(key,store?.data.settings.language);
const { Store } = require('./store.cjs');
const { EdgeDock } = require('./edge-dock.cjs');
const PIPE = '\\\\.\\pipe\\memo-desktop-' + crypto.createHash('sha256').update(require('node:os').userInfo().username).digest('hex').slice(0,16);
// Keep existing installations' note storage after the display-name change.
app.setPath('userData',path.join(app.getPath('appData'),app.isPackaged||process.argv.includes('--local')?'Memo':'memo-desktop'));
app.setName('Memo Desktop');
let store, manager, tray, server, dock, quitting = false;
const notes = new Map();
if (!app.requestSingleInstanceLock()) app.quit();
else {
app.on('second-instance', () => showManager());
app.whenReady().then(() => {
  setSystemLocale(app.getLocale());
  try { store = new Store(path.join(app.getPath('userData'), 'memo.json')); }
  catch (e) { dialog.showErrorBox(tr('errors.readTitle'), e.message); app.quit(); return; }
  dock=new EdgeDock({screen,enabled:()=>store.data.settings.edgeDock,note:id=>store.get(id),notify:(id,mode)=>notes.get(id)?.webContents.send('memo:dock',mode)});
  for(const event of ['display-added','display-removed','display-metrics-changed'])screen.on(event,()=>dock.refresh());
  ipcMain.handle('memo:call', (event, action, args) => {
    if (!BrowserWindow.fromWebContents(event.sender)) throw new Error(tr('errors.unsupported'));
    if(['dockState','dockExpand','dockCollapse','dragStart','dragMove','dragEnd'].includes(action)){
      const id=[...notes].find(([,win])=>win.webContents===event.sender)?.[0];
      if(!id)throw new Error(tr('errors.unsupported'));
      if(action==='dockState')return dock.state(id);
      if(action==='dragStart'||action==='dragMove'){
        if(!args||!Number.isFinite(args.x)||!Number.isFinite(args.y)||Math.abs(args.x)>100000||Math.abs(args.y)>100000)throw new Error(tr('errors.invalid'));
        const point={x:args.x,y:args.y};
        if(action==='dragStart')return dock.beginDrag(id,point);
        dock.moveDrag(id,point);return;
      }
      if(action==='dragEnd'){dock.endDrag(id);return;}
      if(action==='dockCollapse'){
        if(!store.data.settings.edgeDock)throw new Error(tr('errors.dockDisabled'));
        if(store.get(id).pinned)throw new Error(tr('editor.unpinDock'));
        dock.collapse(dock.entries.get(id),true);return;
      }
      dock.expand(id,true);return;
    }
    return dispatch(action, args);
  });
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname,'../public/memo-icon.png')).resize({width:32,height:32}));
  tray.setToolTip('Memo Desktop'); tray.on('double-click', showManager); updateTray();
  for(const n of store.data.notes) if(n.visible) openNote(n.id);
  if(!store.data.settings.startHidden && !process.argv.includes('--hidden')) showManager();
  server = net.createServer(socket => {
    socket.setEncoding('utf8'); let buffer=''; socket.setTimeout(15000,()=>socket.destroy());
    socket.on('error',()=>{});
    socket.on('data',chunk=>{ buffer+=chunk; if(buffer.length>2100000){socket.destroy();return;} let at;
      while((at=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,at);buffer=buffer.slice(at+1); Promise.resolve().then(()=>{
        if(!store.data.settings.mcpEnabled) throw new Error(tr('errors.mcpDisabled'));
        const req=JSON.parse(line); if(!['state','create','update','append','delete','show','hide'].includes(req.action)) throw new Error(tr('errors.unsupported'));
        return dispatch(req.action,req.args);
      }).then(result=>socket.write(JSON.stringify({result})+'\n'),error=>socket.write(JSON.stringify({error:error.message})+'\n')); }
    });
  });
  server.on('error',e=>dialog.showErrorBox(tr('errors.mcpTitle'),e.message)); server.listen(PIPE);
});
}
function makeWindow(options) {
  const w = new BrowserWindow({icon:path.join(__dirname,'../public/memo-icon.ico'),backgroundColor:'#fafaf9',show:false, webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true},...options});
  w.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  w.webContents.on('will-navigate',e=>e.preventDefault());
  w.once('ready-to-show',()=>w.show()); return w;
}
function load(w, query={}) { w.loadFile(path.join(__dirname,'../dist/index.html'),{query}); }
function showManager() {
  if(manager && !manager.isDestroyed()){manager.show();manager.focus();return;}
  manager=makeWindow({width:1120,height:780,minWidth:800,minHeight:580,frame:false,title:tr('app.title'),autoHideMenuBar:true});
  load(manager); manager.on('close',e=>{if(!quitting){e.preventDefault();manager.hide();}});
}
function openNote(id) {
  const n=store.get(id); let w=notes.get(id);
  if(w && !w.isDestroyed()){dock.expand(id,true);return;}
  const b=n.bounds || {}; const display=screen.getDisplayMatching({x:b.x||0,y:b.y||0,width:b.width||340,height:b.height||380}).workArea;
  const width=Math.max(260,Math.min(b.width||340,display.width)), height=Math.max(240,Math.min(b.height||380,display.height));
  w=makeWindow({width,height,x:Math.max(display.x,Math.min(b.x??display.x+90,display.x+display.width-width)),y:Math.max(display.y,Math.min(b.y??display.y+90,display.y+display.height-height)),minWidth:260,minHeight:240,frame:false,transparent:true,backgroundColor:'#00000000',hasShadow:false,alwaysOnTop:n.pinned,resizable:!n.locked,movable:!n.locked,skipTaskbar:true,title:n.title});
  // Keep note CSS pixels aligned with Electron DIP bounds on every monitor.
  // Zoom is per webContents, so changing one note cannot resize its siblings.
  w.webContents.setZoomMode('disabled');
  w.webContents.setVisualZoomLevelLimits(1,1).catch(()=>{});
  notes.set(id,w);dock.register(id,w); load(w,{note:id}); n.visible=true;store.save();
  let timer; const saveBounds=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(w.isDestroyed()||!dock.canSave(id))return;n.bounds=w.getBounds();store.save();},200);};
  w.on('move',saveBounds);w.on('resize',saveBounds);
  w.on('close',()=>{clearTimeout(timer);if(!quitting){n.visible=false;store.save();}notes.delete(id);if(!quitting)broadcast();});
}
function updateTray(){tray?.setContextMenu(Menu.buildFromTemplate([{label:tr('tray.open'),click:showManager},{label:tr('tray.new'),click:()=>dispatch('create',{})},{type:'separator'},{label:tr('tray.show'),click:()=>{for(const n of store.data.notes)openNote(n.id);broadcast();}},{label:tr('tray.hide'),click:()=>{for(const w of [...notes.values()])w.close();}},{type:'separator'},{label:tr('tray.quit'),click:()=>app.quit()}]));}
function snapshot(){return {...store.data, info:{dataPath:store.file,mcpCommand:process.execPath,mcpScript:path.join(__dirname,'mcp.cjs'),packaged:app.isPackaged,locale:app.getLocale(),version:app.getVersion(),local:process.argv.includes('--local')}};}
function broadcast(){for(const w of BrowserWindow.getAllWindows())w.webContents.send('memo:state',snapshot());}
async function dispatch(action,args={}) {
  let result;
  switch(action){
    case 'state': return snapshot();
    case 'create': result=store.create(args); if(args.visible!==false)openNote(result.id); break;
    case 'append': {const n=store.get(args.id);if(typeof args.content!=='string')throw new Error(tr('errors.invalid'));args={id:n.id,content:n.content+args.content};}
    case 'update': result=store.update(args.id,args); {const w=notes.get(args.id);if(w){const mode=dock.state(args.id);if(mode==='free')w.setAlwaysOnTop(result.pinned);if(mode==='free'||mode==='peek'){w.setMovable(!result.locked);w.setResizable(!result.locked);}w.setTitle(result.title);}dock.refresh(); if(args.visible===true)openNote(args.id);if(args.visible===false)notes.get(args.id)?.close();} break;
    case 'delete': store.delete(args.id);notes.get(args.id)?.close();break;
    case 'show':openNote(args.id);break;
    case 'hide':notes.get(args.id)?.close();break;
    case 'manager':showManager();break;
    case 'minimize':manager?.minimize();return;
    case 'closeManager':manager?.hide();return;
    case 'settings': {
      if(args.autoStart!==undefined){app.setLoginItemSettings({openAtLogin:args.autoStart,path:process.execPath,args:app.isPackaged?['--hidden']:[app.getAppPath(),'--hidden']}); if(app.getLoginItemSettings().openAtLogin!==args.autoStart)throw new Error(tr('errors.autoStart'));}
      result=store.settings(args);updateTray();if(manager&&!manager.isDestroyed())manager.setTitle(tr('app.title'));dock.refresh();break;
    }
    case 'copyMcp': {const config={mcpServers:{memo:{command:process.execPath,args:[path.join(__dirname,'mcp.cjs')],env:{ELECTRON_RUN_AS_NODE:'1'}}}};clipboard.writeText(JSON.stringify(config,null,2));return;}
    case 'export': {const n=store.get(args.id); const target=await dialog.showSaveDialog({defaultPath:n.title.replace(/[<>:"/\\|?*]/g,'_')+'.md',filters:[{name:'Markdown',extensions:['md']}]});if(!target.canceled)fs.writeFileSync(target.filePath,n.content,'utf8');return;}
    default:throw new Error(tr('errors.unsupported'));
  }
  broadcast();return result;
}
app.on('before-quit',()=>{quitting=true;dock?.dispose();server?.close();});
app.on('window-all-closed',()=>{});
app.on('activate',showManager);
