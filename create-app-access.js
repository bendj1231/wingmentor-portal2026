#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAppAccess() {
  console.log('🔧 Creating app access records for users...');

  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, role');

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }

    console.log(`Found ${users.length} users`);

    // Define available apps
    const apps = [
      { id: 'foundational', name: 'Foundational Program' },
      { id: 'pilot-profile', name: 'Pilot Profile' },
      { id: 'mentorship', name: 'Mentorship' },
      { id: 'atlas-cv', name: 'ATLAS CV Generator' },
      { id: 'w1000', name: 'W1000 Logbook' }
    ];

    // Create app access for each user
    for (const user of users) {
      console.log(`Creating app access for ${user.email}...`);

      for (const app of apps) {
        const appAccess = {
          user_id: user.id,
          app_id: app.id,
          granted: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('user_app_access')
          .upsert(appAccess, { onConflict: 'user_id,app_id' });

        if (insertError) {
          console.error(`❌ Error creating app access for ${app.id}:`, insertError.message);
        } else {
          console.log(`   ✅ ${app.name}: Access granted`);
        }
      }
    }

    // Verify the results
    const { data: accessRecords, error: verifyError } = await supabase
      .from('user_app_access')
      .select('*');

    if (verifyError) {
      console.error('❌ Error verifying app access:', verifyError.message);
    } else {
      console.log(`\n✅ Successfully created ${accessRecords.length} app access records`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

createAppAccess();
