import i18n,{type TOptions} from 'i18next'
import {initReactI18next} from 'react-i18next'
import {DirectionProvider} from '@base-ui/react/direction-provider'
import {useTranslation} from 'react-i18next'
import type {ReactNode} from 'react'
import languageMetadata from '../locales/languages.json'
const files=import.meta.glob('../locales/*/translation.json',{eager:true,import:'default'})
const resources=Object.fromEntries(Object.entries(files).map(([path,data])=>[path.split('/')[2],{translation:data as Record<string,unknown>}]))
export const languages=languageMetadata
export function resolveLanguage(value?:string,system=navigator.language){if(value==='system'||!value)value=system;const code=value.replace('_','-');if(/^zh/i.test(code))return /TW|HK|Hant/i.test(code)?'zh-TW':'zh-CN';if(/^pt/i.test(code))return 'pt-BR';return languages.find(l=>l.code.toLowerCase()===code.toLowerCase())?.code||languages.find(l=>l.code===code.split('-')[0].toLowerCase())?.code||'en'}
function applyDirection(language:string){document.documentElement.lang=language;document.documentElement.dir=i18n.dir(language)}
void i18n.use(initReactI18next).init({resources,lng:resolveLanguage(),fallbackLng:'en',supportedLngs:languages.map(l=>l.code),interpolation:{escapeValue:false},initAsync:false,react:{useSuspense:false}})
i18n.on('languageChanged',applyDirection);applyDirection(i18n.language)
export const t=(key:string,options?:Record<string,unknown>):string=>String(i18n.t(key,options as TOptions))
export function LocalizationProvider({children}:{children:ReactNode}){useTranslation();return <DirectionProvider direction={i18n.dir()}>{children}</DirectionProvider>}
export default i18n
