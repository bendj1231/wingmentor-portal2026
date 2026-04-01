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

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
let supabase;
let supabaseInitialized = false;

const initializeSupabase = () => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Supabase initialization timeout'));
    }, 3000);

    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        clearTimeout(timeout);
        console.error('Missing Supabase credentials');
        resolve(); // Continue without Supabase
        return;
      }

      supabase = createClient(supabaseUrl, supabaseKey);
      supabaseInitialized = true;
      clearTimeout(timeout);
      console.error('Supabase client initialized successfully');
      resolve();
    } catch (error) {
      clearTimeout(timeout);
      console.error('Failed to initialize Supabase:', error.message);
      resolve(); // Continue without Supabase
    }
  });
};

const server = new Server(
  {
    name: 'supabase-server',
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
        name: 'supabase_list_users',
        description: 'List all users from Supabase auth',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Maximum number of users to return', default: 100 }
          }
        }
      },
      {
        name: 'supabase_get_user',
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
        name: 'supabase_create_user',
        description: 'Create new user',
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', description: 'User email' },
            password: { type: 'string', description: 'User password' },
            displayName: { type: 'string', description: 'User display name' },
            role: { type: 'string', enum: ['super_admin', 'mentor_manager', 'mentor', 'mentee'], description: 'User role', default: 'mentee' }
          },
          required: ['email', 'password']
        }
      },
      {
        name: 'supabase_update_user_role',
        description: 'Update user role in profiles table',
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
        name: 'supabase_get_user_profile',
        description: 'Get user profile from profiles table',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID' }
          },
          required: ['userId']
        }
      },
      {
        name: 'supabase_update_app_access',
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
        uri: 'supabase://users/{userId}',
        name: 'User Profile',
        description: 'Fetch user profile data from Supabase',
        mimeType: 'application/json'
      },
      {
        uri: 'supabase://users/{userId}/appAccess',
        name: 'User App Access',
        description: 'Get user app access permissions',
        mimeType: 'application/json'
      },
      {
        uri: 'supabase://logs/appAccess',
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
  
  if (!supabaseInitialized) {
    throw new McpError(ErrorCode.InternalError, 'Supabase not initialized - check environment variables');
  }

  try {
    switch (name) {
      case 'supabase_list_users':
        const { limit = 100 } = args;
        const { data: users, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        return { content: [{ type: 'text', text: JSON.stringify(users.users.slice(0, limit), null, 2) }] };

      case 'supabase_get_user':
        const { userId } = args;
        const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
        if (userError) throw userError;
        return { content: [{ type: 'text', text: JSON.stringify(user, null, 2) }] };

      case 'supabase_create_user':
        const { email, password, displayName, role = 'mentee' } = args;
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          user_metadata: { display_name: displayName, role }
        });
        if (createError) throw createError;
        
        // Create profile record
        if (newUser.user) {
          await supabase
            .from('profiles')
            .insert({
              id: newUser.user.id,
              email: newUser.user.email,
              display_name: displayName,
              role,
              created_at: new Date().toISOString()
            });
        }
        
        return { content: [{ type: 'text', text: JSON.stringify(newUser, null, 2) }] };

      case 'supabase_update_user_role':
        const { userId: uid, role: newRole } = args;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', uid);
        if (updateError) throw updateError;
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, userId: uid, role: newRole }) }] };

      case 'supabase_get_user_profile':
        const { userId: profileId } = args;
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        if (profileError) throw profileError;
        return { content: [{ type: 'text', text: JSON.stringify(profile, null, 2) }] };

      case 'supabase_update_app_access':
        const { userId: accessUserId, appId, granted } = args;
        const { error: accessError } = await supabase
          .from('user_app_access')
          .upsert({
            user_id: accessUserId,
            app_id: appId,
            granted,
            updated_at: new Date().toISOString()
          });
        if (accessError) throw accessError;
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
  
  if (!supabaseInitialized) {
    throw new McpError(ErrorCode.InternalError, 'Supabase not initialized');
  }

  try {
    if (uri.startsWith('supabase://users/')) {
      const userId = uri.replace('supabase://users/', '').replace('/appAccess', '');
      
      if (uri.includes('/appAccess')) {
        const { data: accessData, error } = await supabase
          .from('user_app_access')
          .select('*')
          .eq('user_id', userId);
        if (error) throw error;
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                userId,
                appAccess: accessData || []
              }, null, 2)
            }
          ]
        };
      } else {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) throw error;
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(profileData, null, 2)
            }
          ]
        };
      }
    } else if (uri === 'supabase://logs/appAccess') {
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
    // Initialize Supabase asynchronously
    initializeSupabase().catch(err => {
      console.error('Supabase initialization failed, continuing without Supabase:', err.message);
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Supabase MCP server running on stdio');
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
}

main();
