#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError 
} from '@modelcontextprotocol/sdk/types.js';

// Firebase Admin SDK
import admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.firestore();
const auth = admin.auth();

const server = new Server(
  {
    name: 'firebase-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'firebase_list_users',
        description: 'List all users from Firebase Authentication',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of users to return',
              default: 100
            }
          }
        }
      },
      {
        name: 'firebase_get_user',
        description: 'Get specific user by UID',
        inputSchema: {
          type: 'object',
          properties: {
            uid: {
              type: 'string',
              description: 'User UID'
            }
          },
          required: ['uid']
        }
      },
      {
        name: 'firebase_update_user_role',
        description: 'Update user role in Firestore',
        inputSchema: {
          type: 'object',
          properties: {
            uid: {
              type: 'string',
              description: 'User UID'
            },
            role: {
              type: 'string',
              enum: ['super_admin', 'mentor_manager', 'mentor', 'mentee'],
              description: 'User role'
            }
          },
          required: ['uid', 'role']
        }
      },
      {
        name: 'firebase_get_user_profile',
        description: 'Get user profile from Firestore',
        inputSchema: {
          type: 'object',
          properties: {
            uid: {
              type: 'string',
              description: 'User UID'
            }
          },
          required: ['uid']
        }
      },
      {
        name: 'firebase_update_app_access',
        description: 'Update user app access permissions',
        inputSchema: {
          type: 'object',
          properties: {
            uid: {
              type: 'string',
              description: 'User UID'
            },
            appId: {
              type: 'string',
              description: 'Application ID'
            },
            granted: {
              type: 'boolean',
              description: 'Whether access is granted'
            }
          },
          required: ['uid', 'appId', 'granted']
        }
      },
      {
        name: 'firebase_create_user',
        description: 'Create new user with email and password',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'User email'
            },
            password: {
              type: 'string',
              description: 'User password'
            },
            displayName: {
              type: 'string',
              description: 'User display name'
            },
            role: {
              type: 'string',
              enum: ['super_admin', 'mentor_manager', 'mentor', 'mentee'],
              description: 'User role',
              default: 'mentee'
            }
          },
          required: ['email', 'password']
        }
      },
      {
        name: 'firebase_suspend_user',
        description: 'Suspend or unsuspend user',
        inputSchema: {
          type: 'object',
          properties: {
            uid: {
              type: 'string',
              description: 'User UID'
            },
            suspended: {
              type: 'boolean',
              description: 'Whether to suspend the user'
            }
          },
          required: ['uid', 'suspended']
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
      case 'firebase_list_users':
        const listUsersResult = await auth.listUsers(args.limit || 100);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                users: listUsersResult.users.map(user => ({
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  emailVerified: user.emailVerified,
                  disabled: user.disabled,
                  metadata: user.metadata
                }))
              }, null, 2)
            }
          ]
        };

      case 'firebase_get_user':
        const userRecord = await auth.getUser(args.uid);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                emailVerified: userRecord.emailVerified,
                disabled: userRecord.disabled,
                metadata: userRecord.metadata
              }, null, 2)
            }
          ]
        };

      case 'firebase_get_user_profile':
        const userDoc = await db.collection('users').doc(args.uid).get();
        if (!userDoc.exists) {
          throw new McpError(ErrorCode.NotFound, 'User profile not found');
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                id: userDoc.id,
                ...userDoc.data()
              }, null, 2)
            }
          ]
        };

      case 'firebase_update_user_role':
        await db.collection('users').doc(args.uid).update({
          role: args.role,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return {
          content: [
            {
              type: 'text',
              text: `User role updated to ${args.role}`
            }
          ]
        };

      case 'firebase_update_app_access':
        const profileRef = db.collection('users').doc(args.uid);
        const profile = await profileRef.get();
        
        if (!profile.exists) {
          throw new McpError(ErrorCode.NotFound, 'User profile not found');
        }

        const appAccess = profile.data().appAccess || [];
        const updatedAppAccess = appAccess.map(app => 
          app.appId === args.appId 
            ? { ...app, granted: args.granted, grantedBy: 'mcp-server', grantedAt: new Date() }
            : app
        );

        await profileRef.update({
          appAccess: updatedAppAccess,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
          content: [
            {
              type: 'text',
              text: `App access updated for ${args.appId}: ${args.granted ? 'granted' : 'restricted'}`
            }
          ]
        };

      case 'firebase_create_user':
        const newUser = await auth.createUser({
          email: args.email,
          password: args.password,
          displayName: args.displayName
        });

        // Create Firestore profile
        await db.collection('users').doc(newUser.uid).set({
          id: newUser.uid,
          email: newUser.email,
          displayName: newUser.displayName || '',
          firstName: newUser.displayName?.split(' ')[0] || '',
          lastName: newUser.displayName?.split(' ').slice(1).join(' ') || '',
          role: args.role || 'mentee',
          totalHours: 0,
          enrolledPrograms: [],
          appAccess: [
            { appId: 'foundational', appName: 'Foundational Program', granted: true, restricted: false }
          ],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastLogin: null,
          status: 'active'
        });

        return {
          content: [
            {
              type: 'text',
              text: `User created successfully with UID: ${newUser.uid}`
            }
          ]
        };

      case 'firebase_suspend_user':
        await auth.updateUser(args.uid, {
          disabled: args.suspended
        });

        await db.collection('users').doc(args.uid).update({
          status: args.suspended ? 'suspended' : 'active',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
          content: [
            {
              type: 'text',
              text: `User ${args.suspended ? 'suspended' : 'unsuspended'} successfully`
            }
          ]
        };

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Firebase operation failed: ${error.message}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Firebase MCP Server running on stdio');
}

main().catch(console.error);
