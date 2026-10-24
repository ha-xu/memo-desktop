const assert=require('node:assert/strict');
const {Client}=require('@modelcontextprotocol/sdk/client/index.js');
const {StdioClientTransport}=require('@modelcontextprotocol/sdk/client/stdio.js');
(async()=>{
 const client=new Client({name:'memo-smoke-test',version:'1.0.0'});
 const transport=new StdioClientTransport({command:process.execPath,args:[require('node:path').join(__dirname,'../electron/mcp.cjs')]});
 await client.connect(transport);
 let id;
 try{
  const tools=await client.listTools();assert.equal(tools.tools.length,7);
  const call=async(name,args={})=>{const result=await client.callTool({name,arguments:args});if(result.isError)throw new Error(result.content[0].text);return JSON.parse(result.content[0].text);};
  const note=await call('memo_create',{title:'MCP 集成验证',content:'# 协议连接成功\n\n- [ ] 创建便签\n- [ ] 实时同步',color:'sage',pinned:true});id=note.id;
  await call('memo_append',{id,content:'\n\n**追加内容成功**'});
  const list=await call('memo_list');assert(list.find(n=>n.id===id).content.endsWith('**追加内容成功**'));
  await call('memo_update',{id,locked:true});
  const rejected=await client.callTool({name:'memo_update',arguments:{id,content:'should fail'}});assert(rejected.isError);
  await call('memo_update',{id,locked:false});await call('memo_hide',{id});await call('memo_show',{id});
  console.log('MCP initialize / 7 tools / create / append / list / lock / hide / show passed');
 } finally {
  if(id){await client.callTool({name:'memo_update',arguments:{id,locked:false}});await client.callTool({name:'memo_delete',arguments:{id}});}
  await client.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
