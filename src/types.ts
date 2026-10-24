export type Color = 'cream'|'sage'|'lavender'|'rose'|'sky'
export type NotePatch = Partial<Note> & {expectedContent?:string;expectedTitle?:string}
export interface Note {id:string;title:string;content:string;color:Color;pinned:boolean;locked:boolean;starred:boolean;visible:boolean;createdAt:number;updatedAt:number}
export type DockMode = 'free'|'collapsing'|'docked'|'expanding'|'peek'
export interface Settings {language:string;theme:'light'|'dark'|'system';autoStart:boolean;startHidden:boolean;defaultColor:Color;defaultPinned:boolean;mcpEnabled:boolean;edgeDock:boolean}
export interface State {notes:Note[];settings:Settings;info?:{dataPath:string;mcpCommand:string;mcpScript:string;packaged:boolean;locale:string;version:string;local:boolean}}
export interface Bridge {call:(action:string,args?:unknown)=>Promise<any>;subscribe:(callback:(state:State)=>void)=>()=>void;onDock?:(callback:(mode:DockMode)=>void)=>()=>void}
declare global {interface Window {memo?:Bridge}}
