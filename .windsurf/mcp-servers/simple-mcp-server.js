#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
  ListResourcesRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');

const fs = require('fs');
const path = require('path');

// Simple in-memory data store for testing
let users = [
  { id: '1', email: 'bowlerbenjamin3@gmail.com', role: 'super_admin', status: 'active' },
  { id: '2', email: 'karlbrianabibas@gmail.com', role: 'mentor', status: 'active' },
  { id: '3', email: 'benjaminbowler15@gmail.com', role: 'mentee', status: 'active' }
];

let appAccess = [
  { userId: '1', appId: 'foundational', granted: true },
  { userId: '2', appId: 'foundational', granted: true },
  { userId: '3', appId: 'foundational', granted: true }
];

const server = new Server(
  {
    name: 'simple-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_users',
        description: 'List all users',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Maximum number of users to return', default: 100 }
          }
        }
      },
      {
        name: 'get_user',
        description: 'Get specific user by ID',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID' }
          },
          required: ['userId']
        }
      },
      {
        name: 'update_user_role',
        description: 'Update user role',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID' },
            role: { type: 'string', enum: ['super_admin', 'mentor_manager', 'mentor', 'mentee'], description: 'User role' }
          },
          required: ['userId', 'role']
        }
      },
      {
        name: 'update_app_access',
        description: 'Update user app access permissions',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID' },
            appId: { type: 'string', description: 'Application ID' },
            granted: { type: 'boolean', description: 'Whether access is granted' }
          },
          required: ['userId', 'appId', 'granted']
        }
      }
    ]
  };
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'simple://users/{userId}',
        name: 'User Profile',
        description: 'Fetch user profile data',
        mimeType: 'application/json'
      },
      {
        uri: 'simple://users/{userId}/appAccess',
        name: 'User App Access',
        description: 'Get user app access permissions',
        mimeType: 'application/json'
      }
    ]
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_users':
        const { limit = 100 } = args;
        return { content: [{ type: 'text', text: JSON.stringify(users.slice(0, limit), null, 2) }] };

      case 'get_user':
        const { userId } = args;
        const user = users.find(u => u.id === userId);
        if (!user) {
          throw new McpError(ErrorCode.NotFound, `User ${userId} not found`);
        }
        return { content: [{ type: 'text', text: JSON.stringify(user, null, 2) }] };

      case 'update_user_role':
        const { userId: uid, role } = args;
        const userIndex = users.findIndex(u => u.id === uid);
        if (userIndex === -1) {
          throw new McpError(ErrorCode.NotFound, `User ${uid} not found`);
        }
        users[userIndex].role = role;
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, userId: uid, role }) }] };

      case 'update_app_access':
        const { userId: accessUserId, appId, granted } = args;
        const accessIndex = appAccess.findIndex(a => a.userId === accessUserId && a.appId === appId);
        if (accessIndex === -1) {
          appAccess.push({ userId: accessUserId, appId, granted });
        } else {
          appAccess[accessIndex].granted = granted;
        }
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, userId: accessUserId, appId, granted }) }] };

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
  }
});

// Read resource handler
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    if (uri.startsWith('simple://users/')) {
      const userId = uri.replace('simple://users/', '').replace('/appAccess', '');
      
      if (uri.includes('/appAccess')) {
        const userAccess = appAccess.filter(a => a.userId === userId);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                userId,
                appAccess: userAccess
              }, null, 2)
            }
          ]
        };
      } else {
        const user = users.find(u => u.id === userId);
        if (!user) {
          throw new McpError(ErrorCode.NotFound, `User ${userId} not found`);
        }
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(user, null, 2)
            }
          ]
        };
      }
    }
    
    throw new McpError(ErrorCode.NotFound, `Resource not found: ${uri}`);
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(ErrorCode.InternalError, `Resource read failed: ${error.message}`);
  }
});

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Simple MCP server running on stdio');
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
}

main();
