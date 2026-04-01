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

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

// Initialize Firebase Admin SDK using service account key file
let db;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  
  const app = initializeApp({
    credential: cert(serviceAccount)
  });
  db = getFirestore(app);
  console.error('Firebase Admin SDK initialized with service account key');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  console.error('Make sure serviceAccountKey.json exists and is valid');
  process.exit(1);
}

const server = new Server(
  {
    name: 'firebase-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'firebase://users/{userId}',
        name: 'User Profile',
        description: 'Fetch user profile data from Firestore',
        mimeType: 'application/json'
      },
      {
        uri: 'firebase://users/{userId}/appAccess',
        name: 'User App Access',
        description: 'Get user app access permissions',
        mimeType: 'application/json'
      },
      {
        uri: 'firebase://logs/appAccess',
        name: 'App Access Logs',
        description: 'Access control change logs',
        mimeType: 'application/json'
      }
    ]
  };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  try {
    if (uri.startsWith('firebase://users/')) {
      const userId = uri.replace('firebase://users/', '').replace('/appAccess', '');
      
      if (uri.includes('/appAccess')) {
        // Get user app access
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          throw new McpError(ErrorCode.NotFound, `User ${userId} not found`);
        }
        
        const userData = userDoc.data();
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                userId,
                appAccess: userData.appAccess || [],
                status: userData.status,
                track: userData.track
              }, null, 2)
            }
          ]
        };
      } else {
        // Get full user profile
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          throw new McpError(ErrorCode.NotFound, `User ${userId} not found`);
        }
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                userId,
                ...userDoc.data()
              }, null, 2)
            }
          ]
        };
      }
    } else if (uri === 'firebase://logs/appAccess') {
      // Get app access logs
      const logsSnapshot = await db.collection('app_access_logs')
        .orderBy('grantedAt', 'desc')
        .limit(50)
        .get();
      
      const logs = logsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(logs, null, 2)
          }
        ]
      };
    } else {
      throw new McpError(ErrorCode.NotFound, `Unknown resource: ${uri}`);
    }
  } catch (error) {
    console.error('Error reading resource:', error);
    throw new McpError(ErrorCode.InternalError, `Failed to read resource: ${error.message}`);
  }
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'verify_user_access',
        description: 'Verify if a user has access to a specific program',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'User ID to verify'
            },
            programAppId: {
              type: 'string',
              description: 'Program app ID (e.g., "foundational")'
            }
          },
          required: ['userId', 'programAppId']
        }
      },
      {
        name: 'update_user_access',
        description: 'Update user access permissions for a program',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'User ID to update'
            },
            programAppId: {
              type: 'string',
              description: 'Program app ID (e.g., "foundational")'
            },
            granted: {
              type: 'boolean',
              description: 'Whether access is granted'
            },
            restricted: {
              type: 'boolean',
              description: 'Whether access is restricted'
            },
            grantedBy: {
              type: 'string',
              description: 'ID of the admin granting/restricting access'
            }
          },
          required: ['userId', 'programAppId', 'granted', 'restricted', 'grantedBy']
        }
      },
      {
        name: 'get_user_by_email',
        description: 'Get user profile by email address',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email address to search for'
            }
          },
          required: ['email']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'verify_user_access': {
        const { userId, programAppId } = args;
        
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          throw new McpError(ErrorCode.NotFound, `User ${userId} not found`);
        }
        
        const userData = userDoc.data();
        const appAccess = userData.appAccess?.find(access => access.appId === programAppId);
        
        let status = 'not_configured';
        if (appAccess) {
          status = appAccess.granted && !appAccess.restricted ? 'granted' : 'restricted';
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                userId,
                programAppId,
                status,
                userStatus: userData.status,
                track: userData.track,
                appAccess: appAccess || null
              }, null, 2)
            }
          ]
        };
      }
      
      case 'update_user_access': {
        const { userId, programAppId, granted, restricted, grantedBy } = args;
        
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          throw new McpError(ErrorCode.NotFound, `User ${userId} not found`);
        }
        
        const userData = userDoc.data();
        const currentAppAccess = userData.appAccess || [];
        
        // Update or add app access
        const updatedAppAccess = currentAppAccess.map(access =>
          access.appId === programAppId
            ? { ...access, granted, restricted, grantedBy, grantedAt: new Date() }
            : access
        );
        
        if (!updatedAppAccess.find(access => access.appId === programAppId)) {
          updatedAppAccess.push({
            appId: programAppId,
            appName: programAppId,
            granted,
            restricted,
            grantedBy,
            grantedAt: new Date()
          });
        }
        
        // Update user document
        await db.collection('users').doc(userId).update({
          appAccess: updatedAppAccess
        });
        
        // Log the action
        await db.collection('app_access_logs').add({
          userId,
          appId: programAppId,
          action: restricted ? 'restricted' : granted ? 'granted' : 'revoked',
          previousStatus: userData.status,
          grantedBy,
          grantedAt: new Date(),
          reason: `Access ${restricted ? 'restricted' : granted ? 'granted' : 'revoked'} via MCP`
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                userId,
                programAppId,
                granted,
                restricted,
                updatedAppAccess
              }, null, 2)
            }
          ]
        };
      }
      
      case 'get_user_by_email': {
        const { email } = args;
        
        const usersSnapshot = await db.collection('users')
          .where('email', '==', email)
          .limit(1)
          .get();
        
        if (usersSnapshot.empty) {
          throw new McpError(ErrorCode.NotFound, `User with email ${email} not found`);
        }
        
        const userDoc = usersSnapshot.docs[0];
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                userId: userDoc.id,
                ...userDoc.data()
              }, null, 2)
            }
          ]
        };
      }
      
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('Error executing tool:', error);
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Firebase MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
