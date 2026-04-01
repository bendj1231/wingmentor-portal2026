#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('Testing MCP server connection from Windsurf perspective...');

// Test the exact configuration Windsurf would use
const server = spawn('node', ['.windsurf/mcp-servers/firebase-mcp-server.js'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'pipe']
});

let response = '';

server.stdout.on('data', (data) => {
  const output = data.toString();
  response += output;
  console.log('Server stdout:', output.trim());
});

server.stderr.on('data', (data) => {
  console.log('Server stderr:', data.toString().trim());
});

server.on('close', (code) => {
  console.log(`Server exited with code: ${code}`);
  if (response.includes('"tools"')) {
    console.log('✅ MCP server is working correctly!');
    console.log('Available tools:', JSON.parse(response).result.tools.map(t => t.name));
  } else {
    console.log('❌ MCP server response issue');
    console.log('Response:', response);
  }
});

// Send tools list request
setTimeout(() => {
  const request = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  });
  server.stdin.write(request + '\n');
  
  // Close after response
  setTimeout(() => {
    server.kill();
    process.exit(0);
  }, 2000);
}, 500);
