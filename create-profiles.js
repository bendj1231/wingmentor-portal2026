#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProfiles() {
  console.log('🔧 Creating missing profiles from existing users...');
  
  try {
    // Get all users from auth
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }
    
    console.log(`Found ${users.users.length} users in auth`);
    
    // Create profiles for each user
    for (const user of users.users) {
      const profileData = {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name || '',
        role: user.user_metadata?.role || 'mentee',
        status: 'active',
        firebase_uid: user.user_metadata?.firebase_uid || '',
        created_at: user.created_at,
        updated_at: new Date().toISOString()
      };
      
      try {
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });
        
        if (insertError) {
          console.error(`❌ Failed to create profile for ${user.email}:`, insertError.message);
        } else {
          console.log(`✅ Created profile for: ${user.email} (${profileData.role})`);
        }
      } catch (error) {
        console.error(`❌ Error creating profile for ${user.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Profile creation completed!');
    
    // Test by fetching profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message);
    } else {
      console.log(`✅ Successfully created ${profiles.length} profiles in database`);
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

createProfiles();
