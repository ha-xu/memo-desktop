const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('memo', {
  onDock: (callback) => {const listener=(_,mode)=>callback(mode);ipcRenderer.on('memo:dock',listener);return()=>ipcRenderer.removeListener('memo:dock',listener);},
  call: (action, args) => ipcRenderer.invoke('memo:call', action, args),
  subscribe: (callback) => { const listener = (_, state) => callback(state); ipcRenderer.on('memo:state', listener); return () => ipcRenderer.removeListener('memo:state', listener); }
});
