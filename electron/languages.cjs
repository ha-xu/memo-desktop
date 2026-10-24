const resources=Object.fromEntries(['zh-CN','zh-TW','en','ja','ko','de','fr','es','pt-BR','ru','ar'].map(code=>[code,{translation:require(`../locales/${code}/translation.json`)}]));
const languages=require('../locales/languages.json');
function resolveLanguage(value,system='en'){if(value==='system'||!value)value=system;const code=String(value).replace('_','-');if(/^zh/i.test(code))return /TW|HK|Hant/i.test(code)?'zh-TW':'zh-CN';if(/^pt/i.test(code))return 'pt-BR';return languages.find(l=>l.code.toLowerCase()===code.toLowerCase())?.code||languages.find(l=>l.code===code.split('-')[0].toLowerCase())?.code||'en';}
module.exports={resources,languages,resolveLanguage};
