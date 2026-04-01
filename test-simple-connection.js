#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

console.log('Testing with exact key from dashboard...');

// Try with the key exactly as shown in dashboard
const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpwMnpMx-BnabMgEnbM';

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test with a simple table query
  console.log('Testing database connection...');
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .limit(1);
  
  if (error) {
    console.log('Database error:', error.message);
    
    // Try auth instead
    console.log('Testing auth connection...');
    try {
      const { data: users, error: authError } = await supabase.auth.admin.listUsers(1);
      if (authError) {
        console.log('Auth error:', authError.message);
        console.log('This suggests the key might be invalid or expired.');
      } else {
        console.log('✅ Auth connection works! Users found:', users.users.length);
      }
    } catch (e) {
      console.log('Auth exception:', e.message);
    }
  } else {
    console.log('✅ Database connection works!');
  }
  
} catch (error) {
  console.error('❌ Connection failed:', error.message);
}
