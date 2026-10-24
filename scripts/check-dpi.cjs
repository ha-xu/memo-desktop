// Tests only dedicated hidden windows with dummy data; never uses live notes.
const {app,BrowserWindow,screen}=require('electron');
const path=require('node:path');const assert=require('node:assert/strict');
const {EdgeDock}=require('../electron/edge-dock.cjs');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
app.whenReady().then(async()=>{
 let win,dock,failed=false;
 try{
  const displays=screen.getAllDisplays();const first=displays[0].workArea;
  win=new BrowserWindow({show:false,width:340,height:380,x:first.x+80,y:first.y+80,frame:false,transparent:true,backgroundColor:'#00000000',webPreferences:{preload:path.join(__dirname,'dpi-preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false,backgroundThrottling:false,partition:'dpi-test-'+Date.now()}});
  win.webContents.setZoomMode('disabled');
  // Exercise controller transitions without ever showing or raising this fixture.
  win.showInactive=()=>{};win.moveTop=()=>{};win.focus=()=>{};
  await win.loadFile(path.join(__dirname,'../dist/index.html'),{query:{note:'dpi-fixture'}});
  dock=new EdgeDock({screen,enabled:()=>true,note:()=>({pinned:false,locked:false}),notify:()=>{}});dock.register('fixture',win);const entry=dock.entries.get('fixture');
  const results=[];
  for(const display of [...displays,displays[0]]){
   entry.home={x:display.workArea.x+80,y:display.workArea.y+80,width:340,height:380};entry.mode='docked';win.setMinimumSize(1,1);win.setResizable(false);dock.reflow();await pause(420);
   const actual=await win.webContents.executeJavaScript(`(()=>{const strip=document.querySelector('.floating'),tab=document.querySelector('.edge-tab'),text=tab?.querySelector('strong'),icon=tab?.querySelector('svg');return {viewportWidth:innerWidth,viewportHeight:innerHeight,dpr:devicePixelRatio,visibleWidth:strip?.getBoundingClientRect().width,tabWidth:tab?.getBoundingClientRect().width,fontSize:text?parseFloat(getComputedStyle(text).fontSize):null,iconSize:icon?.getBoundingClientRect().width,textOrientation:text?getComputedStyle(text).textOrientation:null}})()`);
   const bounds=win.getBounds();assert.equal(bounds.width,160);assert.equal(bounds.x+bounds.width,display.workArea.x+display.workArea.width);
   assert(Math.abs(actual.visibleWidth-36)<1,JSON.stringify(actual));assert(Math.abs(actual.fontSize-12)<0.5,JSON.stringify(actual));assert(Math.abs(actual.iconSize-15)<0.5,JSON.stringify(actual));
   assert.equal(win.isVisible(),false);
   dock.expand('fixture');await pause(360);const expanded=win.getBounds();assert.equal(expanded.width,340);assert.equal(expanded.height,380);assert.equal(win.isVisible(),false);
   results.push({display:display.id,scaleFactor:display.scaleFactor,nativeWidth:bounds.width,...actual,expandedWidth:expanded.width,expandedHeight:expanded.height});
  }
  console.log(JSON.stringify({passed:true,results},null,2));
 }catch(e){console.error(e);failed=true;}
 finally{dock?.dispose();if(win&&!win.isDestroyed())win.destroy();app.exit(failed?1:0);}
});
