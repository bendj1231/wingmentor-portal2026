# Firebase to Supabase Migration Guide

## Overview
This guide will help you migrate your existing Firebase data to Supabase and set up the Supabase MCP server.

## Prerequisites

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Note your project URL and service role key from Settings > API

### 2. Set up Database Tables
Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  role text default 'mentee' check (role in ('super_admin', 'mentor_manager', 'mentor', 'mentee')),
  status text default 'active',
  track text,
  firebase_uid text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create user app access table
create table user_app_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  app_id text not null,
  granted boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, app_id)
);

-- Create indexes for better performance
create index profiles_firebase_uid_idx on profiles(firebase_uid);
create index profiles_email_idx on profiles(email);
create index user_app_access_user_id_idx on user_app_access(user_id);
create index user_app_access_app_id_idx on user_app_access(app_id);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table user_app_access enable row level security;

-- Create policies (you can adjust these based on your needs)
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);
create policy "Users can view own app access" on user_app_access for select using (
  exists (select 1 from profiles where id = user_id and auth.uid() = id)
);
```

## Migration Steps

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js firebase-admin
```

### 2. Set Environment Variables
Create a `.env` file or set environment variables:

```bash
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

### 3. Run Migration Script
```bash
node migrate-to-supabase.js
```

The script will:
- Export all users from Firebase Auth
- Export all profiles from Firestore
- Create users in Supabase Auth
- Create profiles in Supabase database
- Migrate app access permissions

### 4. Update MCP Configuration
Update your `.vscode/settings.json` with your Supabase credentials:

```json
{
  "mcp.servers": {
    "supabase": {
      "command": "node",
      "args": [".windsurf/mcp-servers/supabase-mcp-server.js"],
      "cwd": ".",
      "env": {
        "SUPABASE_URL": "https://your-project-id.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key-here"
      }
    }
  }
}
```

## What Gets Migrated

### Users
- Firebase Auth users → Supabase Auth users
- Email verification status
- Phone numbers (if any)
- Display names
- Custom metadata (role, status, track)

### Profiles
- Firestore `users` collection → Supabase `profiles` table
- All custom fields (role, status, track, etc.)
- Firebase UID reference for compatibility

### App Access
- User app permissions → `user_app_access` table
- Granted/restricted status
- App-specific permissions

## Post-Migration Steps

### 1. Verify Migration
```sql
-- Check user count
select count(*) from profiles;

-- Check role distribution
select role, count(*) from profiles group by role;

-- Check app access
select count(*) from user_app_access;
```

### 2. Update Application Code
- Replace Firebase SDK calls with Supabase SDK calls
- Update authentication flows
- Update database queries

### 3. Test MCP Server
```bash
# Test the Supabase MCP server
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node .windsurf/mcp-servers/supabase-mcp-server.js
```

### 4. Restart Windsurf
After updating the configuration, restart Windsurf to load the new Supabase MCP server.

## Available MCP Tools

After migration, you'll have these tools available:

- `supabase_list_users` - List all users
- `supabase_get_user` - Get specific user by ID
- `supabase_create_user` - Create new user
- `supabase_update_user_role` - Update user role
- `supabase_get_user_profile` - Get user profile
- `supabase_update_app_access` - Update app permissions

## Troubleshooting

### Common Issues

1. **Migration fails with auth error**
   - Check your Supabase service role key
   - Ensure the key has admin privileges

2. **Users not created in Supabase**
   - Check if email already exists in Supabase
   - Verify email format is valid

3. **Profile creation fails**
   - Ensure the profiles table exists
   - Check RLS policies

4. **MCP server not connecting**
   - Verify environment variables are set
   - Check Supabase URL and key format

### Rollback Plan
If something goes wrong, you can:
1. Keep Firebase running as backup
2. Delete Supabase project and start over
3. Run migration script again with fixes

## Benefits of Supabase

- **PostgreSQL**: More powerful than Firestore
- **Real-time**: Built-in real-time subscriptions
- **Auth**: Built-in authentication with multiple providers
- **Storage**: File storage with CDN
- **Edge Functions**: Serverless functions
- **Open Source**: Full control over your data

## Next Steps

1. Set up your Supabase project
2. Run the migration script
3. Test the MCP server
4. Update your application code
5. Deploy to production

Need help with any of these steps? Just ask!
