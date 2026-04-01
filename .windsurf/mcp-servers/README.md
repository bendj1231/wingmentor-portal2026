# Firebase MCP Server Configuration

This directory contains the MCP (Model Context Protocol) server configuration for Firebase operations.

## Setup

1. Install dependencies:
```bash
cd .windsurf/mcp-servers
npm install
```

2. Set up Firebase service account:
   - Go to Firebase Console → Project Settings → Service accounts
   - Generate a new private key and download the JSON file
   - Rename the downloaded file to `serviceAccountKey.json` and place it in this directory
   - Update the `serviceAccountKey.json` with your actual project details

3. Add to your Windsurf MCP configuration:
   - The server will be available as "firebase"
   - Resources: user profiles, app access, logs
   - Tools: verify access, update access, get user by email

## Available Resources

- `firebase://users/{userId}` - Full user profile
- `firebase://users/{userId}/appAccess` - User app access permissions
- `firebase://logs/appAccess` - Access control change logs

## Available Tools

- `verify_user_access` - Check if user has program access
- `update_user_access` - Grant/restrict user access
- `get_user_by_email` - Find user by email address

## Usage in Code

```typescript
// Read user profile
const userProfile = await read_resource('firebase', 'firebase://users/user123');

// Verify access
const result = await call_tool('firebase', 'verify_user_access', {
  userId: 'user123',
  programAppId: 'foundational'
});
```
