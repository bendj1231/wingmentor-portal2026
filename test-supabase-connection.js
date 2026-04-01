#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpwMnpMx-BnabMgEnbM';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey.length);

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test basic connection
  const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
  
  if (error) {
    console.log('Connection test result:', error.message);
    
    // Try to list users instead
    try {
      const { data: users, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) {
        console.log('User list error:', userError.message);
      } else {
        console.log('✅ Connection successful! Found users:', users.users.length);
      }
    } catch (e) {
      console.log('User list exception:', e.message);
    }
  } else {
    console.log('✅ Database connection successful!');
  }
  
} catch (error) {
  console.error('❌ Connection failed:', error.message);
}
