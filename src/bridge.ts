import {t} from './i18n'
import type {Bridge, State} from './types'
const key='memo-browser-preview'
let state:State=JSON.parse(localStorage.getItem(key)||'null')||{notes:[{id:crypto.randomUUID(),title:t('notes.heading'),content:t('notes.emptyContent'),color:'cream',pinned:false,locked:false,starred:false,visible:false,createdAt:Date.now(),updatedAt:Date.now()}],settings:{language:'system',theme:'system',autoStart:false,startHidden:false,defaultColor:'cream',defaultPinned:false,mcpEnabled:true}}
state.settings.language ??= 'system'
state.settings.edgeDock ??= true
state.notes.forEach(note=>note.starred ??= false)
const listeners=new Set<(s:State)=>void>()
const preview:Bridge={async call(action,args:any={}){
 if(action==='state')return structuredClone(state)
 if(action==='settings')Object.assign(state.settings,args)
 if(['copyMcp','export'].includes(action))throw new Error(t('errors.unsupported'))
 if(action==='create')state.notes.unshift({id:crypto.randomUUID(),title:t('common.untitled'),content:'',color:state.settings.defaultColor,pinned:false,locked:false,starred:false,visible:false,createdAt:Date.now(),updatedAt:Date.now(),...args})
 const note=state.notes.find(n=>n.id===args.id)
 if(action==='update'&&note){if(note.locked&&['title','content','color'].some(k=>k in args))throw new Error(t('errors.locked'));Object.assign(note,args,{updatedAt:Date.now()})}
 if(action==='delete'&&note){if(note.locked)throw new Error(t('errors.locked'));state.notes=state.notes.filter(n=>n.id!==args.id)}
 if(['show','hide'].includes(action))throw new Error(t('errors.unsupported'))
 localStorage.setItem(key,JSON.stringify(state));listeners.forEach(f=>f(structuredClone(state)))
 },subscribe(f){listeners.add(f);return()=>listeners.delete(f)}}
export const bridge=window.memo||preview
