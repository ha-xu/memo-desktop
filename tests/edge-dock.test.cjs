const {test}=require('node:test');const assert=require('node:assert/strict');const {EventEmitter}=require('node:events');
const {EdgeDock,layoutTabs,expandedBounds,tabHitBounds}=require('../electron/edge-dock.cjs');
test('titles overlap slightly and remain within negative-origin work areas',()=>{
  const area={x:-1600,y:-200,width:1600,height:860};
  for(const count of [1,3,25]){const tabs=layoutTabs(area,count);for(const r of tabs){assert.equal(r.width,160);assert.equal(tabHitBounds(r).width,36);assert.equal(r.x+r.width,0);assert(r.y>=area.y);assert(r.y+r.height<=area.y+area.height);}if(count>1)assert(tabs[1].y<tabs[0].y+tabs[0].height);}
});
test('expanded note stays within small screens and avoids taskbar area',()=>{
  const area={x:100,y:30,width:300,height:260};const b=expandedBounds({width:500,height:600},area,{y:250});assert.deepEqual(b,{x:100,y:30,width:260,height:260});
});
class Window extends EventEmitter{
  constructor(bounds){super();this.bounds={...bounds};this.focused=false;this.visible=true;this.zoom=1;this.webContents={setZoomFactor:v=>{this.zoom=v}};}
  getBounds(){return {...this.bounds}} setBounds(b){this.bounds={...b}} isDestroyed(){return false} isVisible(){return this.visible} isFocused(){return this.focused}
  setMinimumSize(){} setMaximumSize(){} setIgnoreMouseEvents(v){this.ignoresMouse=v} moveTop(){} blur(){this.focused=false} setResizable(v){this.resizable=v}setMovable(v){this.movable=v}setAlwaysOnTop(v){this.onTop=v}showInactive(){this.visible=true}focus(){this.focused=true}show(){this.visible=true}
}
function setup(t){let time=1000,point={x:0,y:0};const notes={a:{pinned:false,locked:false},b:{pinned:false,locked:true}};const events=[];
 const dock=new EdgeDock({screen:{getCursorScreenPoint:()=>point,getDisplayMatching:()=>({id:1,workArea:{x:0,y:0,width:1200,height:800}})},enabled:()=>dock.enabledValue,note:id=>notes[id],notify:(id,mode)=>events.push([id,mode]),clock:()=>time});dock.enabledValue=true;
 clearInterval(dock.timer);dock.animate=(e,target,done)=>{e.win.setBounds(target);done()};t.after(()=>dock.dispose());
 const a=new Window({x:840,y:60,width:340,height:380}),b=new Window({x:780,y:90,width:400,height:400});dock.register('a',a);dock.register('b',b);
 return{dock,notes,a,b,events,advance(ms){time+=ms;dock.tick()},cursor(p){point=p}};
}
test('interacting after hover expansion keeps the note open after leaving',t=>{
 const s=setup(t);s.dock.collapse(s.dock.entries.get('a'),true);assert.equal(s.dock.state('a'),'docked');assert.equal(s.dock.canSave('a'),false);assert.equal(s.a.onTop,true);s.advance(100);
 const tab=tabHitBounds(s.a.getBounds());s.cursor({x:tab.x+20,y:tab.y+12});s.advance(1);s.advance(150);assert.equal(s.dock.state('a'),'peek');assert.equal(s.a.focused,false);assert.equal(s.a.getBounds().width,340);
 s.a.focused=true;s.cursor({x:0,y:0});s.advance(2000);assert.equal(s.dock.state('a'),'peek');s.a.focused=false;s.advance(60000);assert.equal(s.dock.state('a'),'peek');
 s.dock.enabledValue=false;s.dock.refresh();assert.equal(s.dock.state('a'),'free');assert.deepEqual(s.a.getBounds(),{x:840,y:60,width:340,height:380});assert.equal(s.a.onTop,false);
});
function hoverOpen(s,id='a'){
 s.dock.collapse(s.dock.entries.get(id),true);s.cursor({x:0,y:0});s.advance(100);
 const tab=tabHitBounds(s.dock.entries.get(id).win.getBounds());s.cursor({x:tab.x+15,y:tab.y+20});s.advance(1);s.advance(150);assert.equal(s.dock.state(id),'peek');
}
test('pure hover preview retracts after leaving for 450ms, and re-entry cancels that delay',t=>{
 const s=setup(t);hoverOpen(s);const b=s.a.getBounds();s.cursor({x:b.x+30,y:b.y+30});s.advance(10000);assert.equal(s.dock.state('a'),'peek');
 s.cursor({x:0,y:0});s.advance(449);assert.equal(s.dock.state('a'),'peek');
 s.cursor({x:b.x+30,y:b.y+30});s.advance(1);s.cursor({x:0,y:0});s.advance(449);assert.equal(s.dock.state('a'),'peek');s.advance(1);assert.equal(s.dock.state('a'),'docked');
});
test('clicking a preview or explicitly opening it makes it persistent across blur',t=>{
 const s=setup(t);hoverOpen(s);s.a.emit('focus');s.a.focused=false;s.cursor({x:0,y:0});s.advance(60000);assert.equal(s.dock.state('a'),'peek');
 s.dock.collapse(s.dock.entries.get('a'),true);s.dock.expand('a',true);s.a.focused=false;s.advance(60000);assert.equal(s.dock.state('a'),'peek');
});
test('dragging or resizing a hover preview keeps it open; locked previews still retract',t=>{
 const s=setup(t);hoverOpen(s);assert(s.dock.beginDrag('a',{x:1000,y:100}));s.dock.endDrag('a');s.cursor({x:0,y:0});s.advance(60000);assert.equal(s.dock.state('a'),'free');
 hoverOpen(s);s.a.emit('will-resize');s.cursor({x:0,y:0});s.advance(60000);assert.equal(s.dock.state('a'),'free');
 hoverOpen(s,'b');s.cursor({x:0,y:0});s.advance(500);assert.equal(s.dock.state('b'),'docked');
});
test('pinned notes stay expanded and locking remains effective after hover',t=>{
 const s=setup(t);s.notes.a.pinned=true;s.advance(1500);assert.equal(s.dock.state('a'),'free');s.dock.collapse(s.dock.entries.get('b'),true);assert.equal(s.dock.state('b'),'docked');s.dock.expand('b');assert.equal(s.b.movable,false);assert.equal(s.b.resizable,false);
 s.notes.b.pinned=true;s.dock.refresh();assert.equal(s.dock.state('b'),'free');assert.equal(s.b.onTop,true);
});
test('closing a collapsed window removes its tab and reflows remaining entries',t=>{
 const s=setup(t);for(const e of s.dock.entries.values())s.dock.collapse(e,true);s.a.emit('closed');assert.equal(s.dock.entries.size,1);assert.equal(s.dock.state('b'),'docked');assert.equal(s.b.getBounds().x+s.b.getBounds().width,1200);
});
test('manual collapse releases focus and requires leaving title before re-expanding',t=>{
 const s=setup(t);s.a.focused=true;s.dock.collapse(s.dock.entries.get('a'),true);assert.equal(s.a.focused,false);const b=tabHitBounds(s.a.getBounds());s.cursor({x:b.x+20,y:b.y+12});s.advance(2000);assert.equal(s.dock.state('a'),'docked');s.cursor({x:0,y:0});s.advance(100);s.cursor({x:b.x+20,y:b.y+12});s.advance(100);s.advance(200);assert.equal(s.dock.state('a'),'peek');
});
test('idle, blur and edge proximity never trigger collapse without clicking',t=>{
 const s=setup(t);s.a.setBounds({x:50,y:60,width:340,height:380});s.advance(10000);assert.equal(s.dock.state('a'),'free');
 s.a.setBounds({x:835,y:60,width:340,height:380});s.advance(5000);assert.equal(s.dock.state('a'),'free');
 s.a.setBounds({x:860,y:60,width:340,height:380});s.a.focused=true;s.advance(1101);s.a.focused=false;s.advance(60000);assert.equal(s.dock.state('a'),'free');
});
test('dragging a peeked note away from the edge disables automatic collapse',t=>{
 const s=setup(t);s.dock.collapse(s.dock.entries.get('a'),true);s.dock.expand('a');s.a.emit('will-move');s.a.setBounds({x:50,y:60,width:340,height:380});s.advance(10000);assert.equal(s.dock.state('a'),'free');
});
test('pointer-controlled grip moves by screen delta and respects locking',t=>{
 const s=setup(t);s.cursor({x:850,y:80});assert.equal(s.dock.beginDrag('a'),true);s.cursor({x:900,y:120});s.dock.moveDrag('a');assert.deepEqual(s.a.getBounds(),{x:890,y:100,width:340,height:380});s.dock.endDrag('a');s.cursor({x:1000,y:220});s.dock.moveDrag('a');assert.equal(s.a.getBounds().x,890);assert.equal(s.dock.beginDrag('b'),false);
 s.dock.beginDrag('a');s.notes.a.locked=true;s.cursor({x:1100,y:300});s.dock.moveDrag('a');assert.equal(s.a.getBounds().x,890);
});
test('250% to 150% monitor migration keeps tab width in DIP and clears stale page zoom',t=>{
 const s=setup(t);const first={id:1,scaleFactor:2.5,workArea:{x:0,y:0,width:1536,height:912}},second={id:2,scaleFactor:1.5,workArea:{x:1536,y:0,width:2560,height:1392}};
 s.dock.screen.getDisplayMatching=b=>b.x>=1536?second:first;
 s.a.zoom=0.6;s.a.setBounds({x:1800,y:80,width:340,height:380});s.a.emit('move');assert.equal(s.a.zoom,1);
 s.dock.collapse(s.dock.entries.get('a'),true);assert.equal(tabHitBounds(s.a.getBounds()).width,36);assert.equal(s.a.getBounds().x+s.a.getBounds().width,4096);
 s.dock.expand('a');assert.equal(s.a.getBounds().width,340);assert(s.a.getBounds().x>=1536);
 s.a.emit('will-move');s.a.setBounds({x:100,y:80,width:340,height:380});s.a.emit('move');s.dock.collapse(s.dock.entries.get('a'),true);assert.equal(tabHitBounds(s.a.getBounds()).width,36);assert.equal(s.a.getBounds().x+s.a.getBounds().width,1536);
});
test('delayed Windows DPI resize is corrected after the tab animation ends',async t=>{
 const s=setup(t);const e=s.dock.entries.get('a');s.dock.collapse(e,true);const expected=s.a.getBounds();
 s.a.bounds={...expected,width:60,height:Math.round(expected.height*2.5/1.5)};s.a.zoom=0.6;s.a.emit('resize');
 await new Promise(resolve=>setTimeout(resolve,190));assert.deepEqual(s.a.getBounds(),expected);assert.equal(s.a.zoom,1);
});
test('screen geometry changes reflow tabs without altering saved free-window bounds',t=>{
 const s=setup(t),home=s.a.getBounds();s.dock.collapse(s.dock.entries.get('a'),true);
 s.dock.screen.getDisplayMatching=()=>({id:2,scaleFactor:1.5,workArea:{x:-2560,y:0,width:2560,height:1392}});s.dock.refresh();assert.equal(s.a.getBounds().x,-160);assert.equal(tabHitBounds(s.a.getBounds()).width,36);assert.deepEqual(s.dock.entries.get('a').home,home);
});
test('queued pointer event coordinates are preserved when the live cursor has already advanced',t=>{
 const s=setup(t);s.cursor({x:1100,y:500});assert(s.dock.beginDrag('a',{x:850,y:80}));s.dock.moveDrag('a',{x:900,y:120});assert.deepEqual(s.a.getBounds(),{x:890,y:100,width:340,height:380});
});
test('transparent host area neither intercepts input nor triggers hover expansion',t=>{
 const s=setup(t);s.dock.collapse(s.dock.entries.get('a'),true);const host=s.a.getBounds();s.cursor({x:host.x+20,y:host.y+20});s.advance(2000);assert.equal(s.dock.state('a'),'docked');assert.equal(s.a.ignoresMouse,true);
 const strip=tabHitBounds(host);s.cursor({x:strip.x+15,y:strip.y+20});s.advance(1);assert.equal(s.a.ignoresMouse,false);s.advance(150);assert.equal(s.dock.state('a'),'peek');assert.equal(s.a.ignoresMouse,false);
});

test('hovering another docked tab immediately retracts the previous preview',t=>{
 const s=setup(t);for(const e of s.dock.entries.values())s.dock.collapse(e,true);s.cursor({x:0,y:0});s.advance(1);s.dock.expand('a');assert.equal(s.dock.state('a'),'peek');
 const b=tabHitBounds(s.b.getBounds());s.cursor({x:b.x+b.width-2,y:b.y+20});s.advance(1);s.advance(150);assert.equal(s.dock.state('b'),'peek');assert.equal(s.dock.state('a'),'docked');
});
test('preview replacement cancels in-flight expansion and preserves interacted notes',t=>{
 const s=setup(t);for(const e of s.dock.entries.values())s.dock.collapse(e,true);const finish=s.dock.animate;s.dock.animate=()=>{};s.dock.expand('a');assert.equal(s.dock.state('a'),'expanding');s.dock.animate=finish;s.dock.expand('b');assert.equal(s.dock.state('a'),'docked');assert.equal(s.dock.state('b'),'peek');
 s.b.emit('focus');s.b.focused=false;s.dock.expand('a');assert.equal(s.dock.state('b'),'peek');assert.equal(s.dock.entries.get('b').previewOnly,false);
});

test('hover preview leaves the tab strip and an eight-DIP gap unobstructed',()=>{
 for(const area of [{x:0,y:0,width:1200,height:800},{x:-2560,y:-100,width:2560,height:1392}]){
 const tab=layoutTabs(area,2)[0],strip=tabHitBounds(tab),b=expandedBounds({width:340,height:380},area,tab);assert.equal(strip.x-(b.x+b.width),8);assert.equal(b.width,340);assert(b.x>=area.x);
 }
});

test('stationary pointer over the original tab keeps its preview open without cycling',t=>{
 const s=setup(t);hoverOpen(s);const strip=tabHitBounds(s.dock.entries.get('a').tab);s.cursor({x:strip.x+strip.width-2,y:strip.y+20});const collapsedBefore=s.events.filter(([id,mode])=>id==='a'&&mode==='collapsing').length;
 for(let i=0;i<30;i++)s.advance(500);assert.equal(s.dock.state('a'),'peek');assert.equal(s.events.filter(([id,mode])=>id==='a'&&mode==='collapsing').length,collapsedBefore);
 s.cursor({x:0,y:0});s.advance(449);assert.equal(s.dock.state('a'),'peek');s.advance(1);assert.equal(s.dock.state('a'),'docked');s.advance(1000);assert.equal(s.dock.state('a'),'docked');
});
test('moving across the gap from the original tab into the preview keeps it open',t=>{
 const s=setup(t);hoverOpen(s);const strip=tabHitBounds(s.dock.entries.get('a').tab),preview=s.a.getBounds(),y=strip.y+20;
 s.cursor({x:strip.x+strip.width-2,y});s.advance(1000);assert.equal(s.dock.state('a'),'peek');
 s.cursor({x:strip.x-4,y});s.advance(1000);assert.equal(s.dock.state('a'),'peek');
 s.cursor({x:preview.x+preview.width-20,y});s.advance(1000);assert.equal(s.dock.state('a'),'peek');
});
