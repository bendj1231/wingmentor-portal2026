#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserProfile() {
  console.log('🔍 Debugging user profile for benjamintigerbowler@gmail.com...');

  try {
    // Get user profile exactly like the app does
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'benjamintigerbowler@gmail.com')
      .single();

    if (profileError || !profile) {
      console.error('❌ Error fetching profile:', profileError?.message);
      return;
    }

    console.log('📋 User Profile Data:');
    console.log(JSON.stringify(profile, null, 2));

    // Get app access exactly like the app does
    const { data: appAccess, error: accessError } = await supabase
      .from('user_app_access')
      .select('*')
      .eq('user_id', profile.id);

    if (accessError) {
      console.error('❌ Error fetching app access:', accessError.message);
      return;
    }

    console.log('\n📱 App Access Data:');
    console.log(JSON.stringify(appAccess, null, 2));

    // Map app access to proper format like the app does
    const appAccessMap = {
      'foundational': 'Foundational Program',
      'pilot-profile': 'Pilot Profile', 
      'mentorship': 'Mentorship',
      'atlas-cv': 'ATLAS CV Generator',
      'w1000': 'W1000 Logbook',
      'mentor-management': 'Mentor Management'
    };

    const userProfile = {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name || '',
      firstName: profile.display_name?.split(' ')[0] || '',
      lastName: profile.display_name?.split(' ').slice(1).join(' ') || '',
      role: profile.role,
      totalHours: 0,
      enrolledPrograms: [],
      appAccess: appAccess?.map(access => ({
        appId: access.app_id,
        appName: appAccessMap[access.app_id] || access.app_id,
        granted: access.granted,
        restricted: !access.granted
      })) || [],
      createdAt: new Date(profile.created_at),
      lastLogin: new Date(profile.updated_at),
      status: profile.status
    };

    console.log('\n🎯 Final User Profile (App Format):');
    console.log(JSON.stringify(userProfile, null, 2));

    // Check mentor management access
    const mentorManagementAccess = userProfile.appAccess.find(app => app.appId === 'mentor-management');
    const isSuperAdmin = userProfile.role === 'super_admin';
    
    console.log('\n🔍 Mentor Management Access Check:');
    console.log(`✅ User Role: ${userProfile.role}`);
    console.log(`✅ Is Super Admin: ${isSuperAdmin}`);
    console.log(`✅ Mentor Management App Access: ${mentorManagementAccess ? 'Found' : 'Not Found'}`);
    if (mentorManagementAccess) {
      console.log(`✅ Mentor Management Granted: ${mentorManagementAccess.granted}`);
    }
    console.log(`✅ Can Access Mentor Management: ${isSuperAdmin || (mentorManagementAccess?.granted)}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

debugUserProfile();
