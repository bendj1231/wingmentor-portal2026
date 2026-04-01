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

// Initialize Firebase Admin SDK with timeout
let db;
let firebaseInitialized = false;

const initializeFirebase = () => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Firebase initialization timeout'));
    }, 5000); // 5 second timeout

    try {
      const serviceAccount = require('./serviceAccountKey.json');
      
      const app = initializeApp({
        credential: cert(serviceAccount)
      });
      db = getFirestore(app);
      firebaseInitialized = true;
      clearTimeout(timeout);
      console.error('Firebase Admin SDK initialized successfully');
      resolve();
    } catch (error) {
      clearTimeout(timeout);
      console.error('Failed to initialize Firebase Admin SDK:', error.message);
      // Don't exit, just continue without Firebase
      resolve();
    }
  });
};

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
            userId: { type: 'string', description: 'User ID to verify' },
            programAppId: { type: 'string', description: 'Program app ID (e.g., "foundational")' }
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
            userId: { type: 'string', description: 'User ID to update' },
            programAppId: { type: 'string', description: 'Program app ID (e.g., "foundational")' },
            granted: { type: 'boolean', description: 'Whether access is granted' },
            restricted: { type: 'boolean', description: 'Whether access is restricted' },
            grantedBy: { type: 'string', description: 'ID of the admin granting/restricting access' }
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
            email: { type: 'string', description: 'Email address to search for' }
          },
          required: ['email']
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

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (!firebaseInitialized) {
    throw new McpError(ErrorCode.InternalError, 'Firebase not initialized');
  }

  try {
    switch (name) {
      case 'verify_user_access':
        const { userId, programAppId } = args;
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          return { content: [{ type: 'text', text: JSON.stringify({ hasAccess: false, reason: 'User not found' }) }] };
        }
        
        const userData = userDoc.data();
        const hasAccess = userData.appAccess?.includes(programAppId) || false;
        return { content: [{ type: 'text', text: JSON.stringify({ hasAccess, userId, programAppId }) }] };

      case 'update_user_access':
        const { userId: uid, programAppId: appId, granted, restricted, grantedBy } = args;
        await db.collection('users').doc(uid).set({
          appAccess: granted ? [appId] : [],
          status: restricted ? 'restricted' : 'active',
          lastUpdated: new Date().toISOString(),
          updatedBy: grantedBy
        }, { merge: true });
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, userId: uid, programAppId: appId, granted }) }] };

      case 'get_user_by_email':
        const { email } = args;
        const usersSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();
        if (usersSnapshot.empty) {
          throw new McpError(ErrorCode.NotFound, `User with email ${email} not found`);
        }
        
        const user = usersSnapshot.docs[0].data();
        return { content: [{ type: 'text', text: JSON.stringify({ userId: usersSnapshot.docs[0].id, ...user }, null, 2) }] };

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
  
  if (!firebaseInitialized) {
    throw new McpError(ErrorCode.InternalError, 'Firebase not initialized');
  }

  try {
    if (uri.startsWith('firebase://users/')) {
      const userId = uri.replace('firebase://users/', '').replace('/appAccess', '');
      
      if (uri.includes('/appAccess')) {
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
      // Return mock logs for now
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              logs: [],
              message: 'Access logs not implemented yet'
            }, null, 2)
          }
        ]
      };
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
    // Initialize Firebase asynchronously
    initializeFirebase().catch(err => {
      console.error('Firebase initialization failed, continuing without Firebase:', err.message);
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Firebase MCP server running on stdio');
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
}

main();
