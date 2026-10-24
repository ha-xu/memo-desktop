const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

test('MCP adapter exposes usable schemas and rejects invalid edits before desktop IPC', { timeout: 15000 }, async t => {
  const client = new Client({ name: 'memo-schema-test', version: '1.0.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(__dirname, '../electron/mcp.cjs')],
    stderr: 'pipe',
  });
  t.after(() => client.close());
  await client.connect(transport);
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map(tool => tool.name).sort(), [
    'memo_append', 'memo_create', 'memo_delete', 'memo_hide', 'memo_list', 'memo_show', 'memo_update',
  ]);
  const create = tools.find(tool => tool.name === 'memo_create').inputSchema;
  assert.equal(create.properties.content.type, 'string');
  assert.equal(create.properties.content.maxLength, 1000000);
  assert.deepEqual(create.properties.color.enum, ['cream', 'sage', 'lavender', 'rose', 'sky']);
  const result = await client.callTool({ name: 'memo_update', arguments: { id: 'invalid-id', content: 'must not be written' } });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /validation|invalid/i);
});
