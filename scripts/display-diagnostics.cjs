// Read-only screen metadata. Does not create or manipulate any windows.
const {app,screen}=require('electron');
app.whenReady().then(()=>{console.log(JSON.stringify(screen.getAllDisplays().map(({id,bounds,workArea,scaleFactor})=>({id,bounds,workArea,scaleFactor})),null,2));app.quit();});
