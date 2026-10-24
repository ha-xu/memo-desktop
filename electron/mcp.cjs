// stdio MCP adapter. Only the desktop main process writes the data file.
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const net = require('node:net');
const crypto = require('node:crypto');
const PIPE='\\\\.\\pipe\\memo-desktop-'+crypto.createHash('sha256').update(require('node:os').userInfo().username).digest('hex').slice(0,16);
function request(action,args={}) {return new Promise((resolve,reject)=>{
  const socket=net.createConnection(PIPE);let data='';
  socket.setEncoding('utf8');socket.setTimeout(10000,()=>socket.destroy(new Error('Memo Desktop 请求超时')));
  socket.on('connect',()=>socket.write(JSON.stringify({action,args})+'\n'));
  socket.on('error',e=>reject(new Error('请先启动 Memo Desktop 桌面应用。'+e.message)));
  socket.on('data',chunk=>{data+=chunk;if(data.includes('\n')){socket.end();try{const reply=JSON.parse(data.split('\n')[0]);reply.error?reject(new Error(reply.error)):resolve(reply.result);}catch(e){reject(e);}}});
});}
const server=new McpServer({name:'memo-desktop',version:'1.0.0'});
const text=z.string().max(1000000), id=z.string().uuid();
const fields={title:z.string().max(200).optional(),content:text.optional(),color:z.enum(['cream','sage','lavender','rose','sky']).optional(),pinned:z.boolean().optional(),starred:z.boolean().optional(),locked:z.boolean().optional()};
function tool(name,description,schema,action,adapt=x=>x){server.tool(name,description,schema,async args=>{try{let result=await request(action,adapt(args));if(name==='memo_list')result=result.notes;return {content:[{type:'text',text:JSON.stringify(result??{ok:true})}]};}catch(e){return {isError:true,content:[{type:'text',text:e.message}]};}});}
tool('memo_list','列出所有便签，包含 ID、正文及窗口状态',{},'state');
tool('memo_create','创建便签并显示桌面窗口',{...fields,visible:z.boolean().optional()},'create');
tool('memo_update','编辑便签。锁定时必须先单独解锁',{id,...fields},'update');
tool('memo_append','向便签末尾追加文本，保留原有正文',{id,content:text},'append');
tool('memo_delete','删除指定便签；锁定便签须先解锁',{id},'delete');
tool('memo_show','显示便签桌面窗口',{id},'show');
tool('memo_hide','隐藏便签桌面窗口，保留数据',{id},'hide');
server.connect(new StdioServerTransport()).catch(e=>{console.error(e);process.exitCode=1;});
