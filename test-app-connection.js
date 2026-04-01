#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

console.log('🔍 Testing Supabase connection for React app...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Basic connection successful');

    // Test 2: Get user profiles
    console.log('2. Testing user profiles access...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, status')
      .limit(5);

    if (profileError) {
      console.error('❌ Profile access failed:', profileError.message);
      return false;
    }

    console.log(`✅ Found ${profiles.length} user profiles`);
    profiles.forEach(profile => {
      console.log(`   - ${profile.email} (${profile.role})`);
    });

    // Test 3: Get app access
    console.log('3. Testing app access data...');
    const { data: appAccess, error: accessError } = await supabase
      .from('user_app_access')
      .select('*')
      .limit(5);

    if (accessError) {
      console.error('❌ App access failed:', accessError.message);
      return false;
    }

    console.log(`✅ Found ${appAccess.length} app access records`);

    console.log('\n🎉 All tests passed! Supabase is ready for React app.');
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

testConnection();
