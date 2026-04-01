#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSuperAdminAccess() {
  console.log('🔍 Checking super admin access for benjamintigerbowler@gmail.com...');

  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'benjamintigerbowler@gmail.com')
      .single();

    if (profileError || !profile) {
      console.error('❌ Error fetching profile:', profileError?.message);
      return;
    }

    console.log('📋 Current Profile:');
    console.log(`✅ Email: ${profile.email}`);
    console.log(`✅ Role: ${profile.role}`);
    console.log(`✅ Status: ${profile.status}`);

    // Get app access
    const { data: appAccess, error: accessError } = await supabase
      .from('user_app_access')
      .select('*')
      .eq('user_id', profile.id);

    if (accessError) {
      console.error('❌ Error fetching app access:', accessError.message);
      return;
    }

    console.log('\n📱 Current App Access:');
    appAccess.forEach(access => {
      console.log(`   ${access.app_id}: ${access.granted ? '✅ Granted' : '❌ Restricted'}`);
    });

    // Check if mentor-management access exists
    const mentorAccess = appAccess.find(a => a.app_id === 'mentor-management');
    
    if (!mentorAccess || !mentorAccess.granted) {
      console.log('\n🔧 Granting mentor management access...');
      
      // Grant mentor management access
      const { error: updateError } = await supabase
        .from('user_app_access')
        .upsert({
          user_id: profile.id,
          app_id: 'mentor-management',
          granted: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,app_id' });

      if (updateError) {
        console.error('❌ Error granting mentor access:', updateError.message);
      } else {
        console.log('✅ Mentor management access granted!');
      }
    } else {
      console.log('✅ Mentor management already granted');
    }

    // Grant all apps for super admin
    console.log('\n🔧 Ensuring all apps are granted for super admin...');
    
    const allApps = [
      'foundational', 'pilot-profile', 'mentorship', 'atlas-cv', 
      'w1000', 'mentor-management', 'user-management', 'system-admin'
    ];

    for (const appId of allApps) {
      const { error: grantError } = await supabase
        .from('user_app_access')
        .upsert({
          user_id: profile.id,
          app_id: appId,
          granted: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,app_id' });

      if (grantError) {
        console.error(`❌ Error granting ${appId}:`, grantError.message);
      } else {
        console.log(`✅ ${appId}: Granted`);
      }
    }

    // Verify final access
    const { data: finalAccess, error: finalError } = await supabase
      .from('user_app_access')
      .select('*')
      .eq('user_id', profile.id);

    if (!finalError && finalAccess) {
      console.log('\n🎉 Final Super Admin Access:');
      finalAccess.forEach(access => {
        console.log(`   ${access.app_id}: ${access.granted ? '✅ Granted' : '❌ Restricted'}`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkSuperAdminAccess();
