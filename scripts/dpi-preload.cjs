const {contextBridge}=require('electron');
const state={notes:[{id:'dpi-fixture',title:'跨屏缩放检查',content:'测试',color:'cream',pinned:false,locked:false,visible:true,createdAt:0,updatedAt:0}],settings:{theme:'light',autoStart:false,startHidden:true,defaultColor:'cream',defaultPinned:false,mcpEnabled:false,edgeDock:true}};
contextBridge.exposeInMainWorld('memo',{call:async action=>action==='state'?state:action==='dockState'?'docked':undefined,subscribe:()=>()=>{},onDock:()=>()=>{}});
