# Firebase MCP Server Setup for Windsurf

## Overview
This setup connects Windsurf IDE to your Firebase database through MCP (Model Context Protocol), allowing AI assistants to directly manage users, roles, and app permissions.

## Prerequisites
1. Firebase project with Authentication and Firestore enabled
2. Service account key from Firebase
3. Node.js installed
4. Windsurf IDE with MCP support

## Step 1: Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `wingmentor-ab3ad`
3. Go to Project Settings → Service accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Copy the values from the JSON file

## Step 2: Configure Environment Variables

Update the `.windsurf/mcp.json` file with your actual service account credentials:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "node",
      "args": ["firebase-mcp-server.js"],
      "cwd": ".",
      "env": {
        "FIREBASE_PROJECT_ID": "your-project-id",
        "FIREBASE_CLIENT_EMAIL": "your-service-account@your-project.iam.gserviceaccount.com",
        "FIREBASE_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
        "FIREBASE_DATABASE_URL": "https://your-project-default-rtdb.firebaseio.com"
      }
    }
  }
}
```

## Step 3: Install Dependencies

```bash
npm install @modelcontextprotocol/sdk firebase-admin
```

## Step 4: Start MCP Server

The MCP server will start automatically when Windsurf launches. You can also test it manually:

```bash
node firebase-mcp-server.js
```

## Step 5: Use MCP Tools in Windsurf

Once configured, you can use these Firebase commands in Windsurf:

### User Management:
- `firebase_list_users` - List all users
- `firebase_get_user` - Get specific user by UID
- `firebase_create_user` - Create new user
- `firebase_suspend_user` - Suspend/unsuspend user

### Profile Management:
- `firebase_get_user_profile` - Get user profile from Firestore
- `firebase_update_user_role` - Update user role
- `firebase_update_app_access` - Update app permissions

## Example Usage in Windsurf:

```
List all Firebase users
```

```
Create a new user with email john@example.com, role mentor
```

```
Update user role to mentor_manager for UID abc123
```

```
Grant access to w1000 app for user UID xyz789
```

## Available MCP Tools:

1. **firebase_list_users** - List Firebase Auth users
2. **firebase_get_user** - Get user by UID
3. **firebase_get_user_profile** - Get Firestore profile
4. **firebase_create_user** - Create new user
5. **firebase_update_user_role** - Update user role
6. **firebase_update_app_access** - Manage app permissions
7. **firebase_suspend_user** - Suspend/unsuspend users

## Security Notes:

- Keep your service account key secure
- Only grant necessary permissions to the service account
- The service account needs Firebase Auth and Firestore permissions
- Consider using environment variables instead of hardcoding credentials

## Troubleshooting:

1. **Permission denied**: Check service account permissions
2. **Server not starting**: Verify Node.js and dependencies
3. **Connection failed**: Check Firebase project ID and credentials
4. **Tools not available**: Restart Windsurf after configuration

## Integration with WingMentor:

This MCP server integrates with the WingMentor Mentor Management System, allowing:
- Real-time user management through Windsurf
- Direct database manipulation
- Automated user provisioning
- Role and permission management
