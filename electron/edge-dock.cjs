// Screen coordinates are Electron DIP units, including on mixed-DPI displays.
function contains(rect, point, margin=0) {
  return point.x>=rect.x-margin && point.x<rect.x+rect.width+margin && point.y>=rect.y-margin && point.y<rect.y+rect.height+margin;
}
function sameBounds(a,b){return ['x','y','width','height'].every(k=>Math.abs(a[k]-b[k])<1);}
function tabHitBounds(bounds){const width=Math.min(36,bounds.width);return {...bounds,x:bounds.x+bounds.width-width,width};}
function layoutTabs(area, count) {
  // A native window below Windows' minimum track width is expanded on DPI
  // changes. Render a 36-DIP strip at the right of a safe transparent host.
  const width=Math.min(160,area.width);
  const height=Math.min(208,area.height,Math.max(48,Math.floor((area.height-32)/Math.max(1,count))+8));
  const space=Math.max(0,area.height-height-32);
  const step=count>1?Math.min(height-8,space/(count-1)):0;
  return Array.from({length:count},(_,i)=>({x:area.x+area.width-width,y:Math.round(area.y+Math.min(80,Math.max(0,(area.height-height-step*(count-1))/2))+i*step),width,height}));
}
function expandedBounds(home, area, tab) {
  // Reserve the visible 36-DIP tab strip plus an 8-DIP pointer gap.
  const inset=Math.min(44,Math.max(0,area.width-260));
  const width=Math.min(home.width,area.width-inset),height=Math.min(home.height,area.height);
  return {x:Math.max(area.x,area.x+area.width-width-inset),y:Math.max(area.y,Math.min(tab.y-8,area.y+area.height-height)),width,height};
}
class EdgeDock {
  constructor({screen, enabled, note, notify, clock=Date.now}) {
    Object.assign(this,{screen,enabled,note,notify,clock});this.entries=new Map();
    this.timer=setInterval(()=>this.tick(),80);this.timer.unref?.();
  }
  register(id,win){
    const e={id,win,mode:'free',home:win.getBounds(),last:this.clock(),animation:null,hoverAt:0};this.entries.set(id,e);
    win.on('focus',()=>{e.last=this.clock();e.previewOnly=false;if(e.mode==='peek'&&e.hoverRaised){e.hoverRaised=false;win.setAlwaysOnTop(this.note(id).pinned);}});
    const makePersistent=()=>{e.previewOnly=false;if(e.mode==='peek'){e.mode='free';this.notify(id,'free');win.setAlwaysOnTop(this.note(id).pinned);this.reflow();}e.last=this.clock();};
    win.on('will-move',makePersistent);win.on('will-resize',makePersistent);
    const checkDisplay=()=>{
      if(win.isDestroyed())return;
      const d=this.screen.getDisplayMatching(win.getBounds()),key=`${d.id}:${d.scaleFactor||1}`;
      if(e.displayKey!==key){e.displayKey=key;this.normalizeZoom(e);if(e.mode==='docked')this.settleDock(e);}
    };
    win.on('move',checkDisplay);win.on('resize',()=>{checkDisplay();if(e.mode==='docked')this.settleDock(e);});
    win.on('closed',()=>{clearTimeout(e.settleTimer);this.stopAnimation(e);this.entries.delete(id);this.reflow();});checkDisplay();
  }
  normalizeZoom(e){if(!e.win.isDestroyed())e.win.webContents?.setZoomFactor(1);}
  tabInput(e,enabled){const ignore=!enabled;if(e.ignoring!==ignore){e.ignoring=ignore;e.win.setIgnoreMouseEvents(ignore,{forward:true});}}
  applyDockBounds(e){
    if(e.win.isDestroyed()||e.mode!=='docked'||!e.tab)return;
    this.normalizeZoom(e);
    // Refresh fixed-size constraints in the target monitor's DPI context.
    e.win.setResizable(false);e.win.setMinimumSize(1,1);e.win.setMaximumSize(0,0);
    if(!sameBounds(e.win.getBounds(),e.tab))e.win.setBounds(e.tab);
  }
  settleDock(e){
    clearTimeout(e.settleTimer);
    // WM_DPICHANGED may resize again after setBounds returns. Reapply DIP bounds
    // once Windows has finished switching the per-monitor DPI context.
    e.settleTimer=setTimeout(()=>{if(this.entries.get(e.id)===e&&!e.win.isDestroyed()&&e.mode==='docked'&&!e.animation)this.applyDockBounds(e);},150);
    e.settleTimer.unref?.();
  }
  state(id){return this.entries.get(id)?.mode||'free';}
  canSave(id){return this.state(id)==='free';}
  beginDrag(id,point=this.screen.getCursorScreenPoint()){
    const e=this.entries.get(id);if(!e||e.win.isDestroyed()||this.note(id).locked||!['free','peek'].includes(e.mode))return false;
    e.mode='free';e.previewOnly=false;e.drag={point,bounds:e.win.getBounds()};e.win.setAlwaysOnTop(this.note(id).pinned);this.notify(id,'free');this.reflow();return true;
  }
  moveDrag(id,point=this.screen.getCursorScreenPoint()){
    const e=this.entries.get(id);if(!e?.drag||e.win.isDestroyed())return;
    if(this.note(id).locked){e.drag=null;return;}
    const start=e.drag.point,{bounds}=e.drag;
    e.win.setBounds({...bounds,x:Math.round(bounds.x+point.x-start.x),y:Math.round(bounds.y+point.y-start.y)});
  }
  endDrag(id){const e=this.entries.get(id);if(e){if(e.drag&&!e.win.isDestroyed()){
    const b=e.win.getBounds();e.win.setBounds({...b,width:e.drag.bounds.width,height:e.drag.bounds.height});e.home=e.win.getBounds();this.normalizeZoom(e);
  }e.drag=null;}}
  stopAnimation(e){if(e.animation)clearInterval(e.animation);e.animation=null;}
  animate(e,target,done){
    this.stopAnimation(e);const from=e.win.getBounds(),start=this.clock();
    const frame=()=>{if(e.win.isDestroyed()){this.stopAnimation(e);return;}const t=Math.min(1,(this.clock()-start)/240),k=1-Math.pow(1-t,3),b={};
      for(const key of ['x','y','width','height'])b[key]=Math.round(from[key]+(target[key]-from[key])*k);
      e.win.setBounds(b);if(t===1){this.stopAnimation(e);done();}
    };e.animation=setInterval(frame,16);frame();
  }
  groups(){const groups=new Map();for(const e of this.entries.values())if(e.mode!=='free'){
    const display=this.screen.getDisplayMatching(e.home);const group=groups.get(display.id)||{area:display.workArea,entries:[]};group.entries.push(e);groups.set(display.id,group);
  }return groups;}
  reflow(){for(const {area,entries} of this.groups().values()){const tabs=layoutTabs(area,entries.length);entries.forEach((e,i)=>{e.tab=tabs[i];e.area=area;if(e.mode==='docked'){this.applyDockBounds(e);this.settleDock(e);}});}}
  collapse(e,manual=false){
    if(e.win.isDestroyed()||e.mode==='collapsing'||e.mode==='docked')return;
    if(e.mode==='free')e.home=e.win.getBounds();
    e.previewOnly=false;
    if(manual){e.blockHover=true;e.win.blur();}
    e.mode='collapsing';e.win.setMinimumSize(1,1);e.win.setResizable(false);e.win.setMovable(false);e.win.setAlwaysOnTop(true);
    this.reflow();this.notify(e.id,'collapsing');
    this.animate(e,e.tab,()=>{e.mode='docked';e.hoverAt=0;this.normalizeZoom(e);this.reflow();this.tabInput(e,false);this.notify(e.id,'docked');e.win.showInactive();});
  }
  expand(id,focus=false){const e=this.entries.get(id);if(!e||e.win.isDestroyed())return;
    if(e.mode==='free'){if(focus){e.win.show();e.win.focus();}return;}
    if(e.mode==='peek'){if(focus){e.previewOnly=false;e.win.focus();}return;}
    // A new hover preview replaces earlier previews, including in-flight ones.
    if(!focus)for(const other of this.entries.values())if(other!==e&&other.previewOnly&&['peek','expanding'].includes(other.mode)&&!other.win.isDestroyed()&&!other.win.isFocused()&&!this.note(other.id).pinned)this.collapse(other);
    this.stopAnimation(e);this.reflow();e.mode='expanding';e.previewOnly=!focus;e.last=this.clock();this.tabInput(e,true);
    const target=expandedBounds(e.home,e.area,e.tab);e.hoverRaised=true;this.notify(id,'expanding');e.win.setAlwaysOnTop(true,'pop-up-menu');e.win.showInactive();e.win.moveTop();
    this.animate(e,target,()=>{e.mode='peek';e.last=this.clock();e.win.setMinimumSize(260,240);const n=this.note(id);e.win.setMovable(!n.locked);e.win.setResizable(!n.locked);this.notify(id,'peek');e.win.moveTop();if(focus)e.win.focus();});
  }
  restore(e){this.stopAnimation(e);e.mode='free';e.previewOnly=false;e.last=this.clock();this.tabInput(e,true);e.win.setMinimumSize(260,240);e.win.setBounds(e.home);const n=this.note(e.id);e.win.setAlwaysOnTop(n.pinned);e.win.setMovable(!n.locked);e.win.setResizable(!n.locked);this.notify(e.id,'free');}
  refresh(){for(const e of this.entries.values())if((!this.enabled()||this.note(e.id).pinned)&&e.mode!=='free')this.restore(e);this.reflow();}
  tick(){
    if(!this.enabled())return;const now=this.clock(),point=this.screen.getCursorScreenPoint();
    // Last tab is visually on top in the small overlap; expand only one per tick.
    const candidates=[...this.entries.values()].reverse();
    const covered=candidates.some(e=>['peek','expanding'].includes(e.mode)&&contains(e.win.getBounds(),point));
    const hit=!covered&&candidates.find(e=>e.mode==='docked'&&contains(tabHitBounds(e.win.getBounds()),point));
    for(const e of candidates){
      if(e.win.isDestroyed()||e.animation||this.note(e.id).pinned||!e.win.isVisible())continue;
      if(e.mode==='docked'){this.tabInput(e,e===hit);if(e.blockHover){if(!contains(tabHitBounds(e.win.getBounds()),point))e.blockHover=false;continue;}if(e===hit){if(!e.hoverAt)e.hoverAt=now;if(now-e.hoverAt>=140)this.expand(e.id);}else e.hoverAt=0;continue;}
      if(e.mode==='peek'&&e.previewOnly){
        if(e.win.isFocused()){e.previewOnly=false;e.last=now;}
        // The pointer may still be over the original tab after the window slides inward.
        else if(contains(e.win.getBounds(),point,8)||(e.tab&&contains(tabHitBounds(e.tab),point)))e.last=now;
        else if(now-e.last>=450){this.collapse(e);continue;}
      }
      if(e.mode==='peek'&&!e.previewOnly&&e.hoverRaised&&!contains(e.win.getBounds(),point,8)){e.hoverRaised=false;e.win.setAlwaysOnTop(this.note(e.id).pinned);}
    }
  }
  dispose(){clearInterval(this.timer);for(const e of this.entries.values()){clearTimeout(e.settleTimer);this.stopAnimation(e);}}
}
module.exports={EdgeDock,contains,layoutTabs,expandedBounds,tabHitBounds};
