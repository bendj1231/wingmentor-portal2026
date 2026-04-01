#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

console.log('Testing new service role key...');

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const newKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDI5OSwiZXhwIjoyMDg5MTEwMjk5fQ.8Q0hZ2Y6W7xK3m9PqR4sT5uV8wX2nY7zL1kF6jH3gI4';

console.log('Key length:', newKey.length);
console.log('Key starts with:', newKey.substring(0, 20) + '...');

try {
  const supabase = createClient(supabaseUrl, newKey);
  
  // Test auth first
  console.log('Testing auth...');
  const { data: users, error: authError } = await supabase.auth.admin.listUsers(1);
  
  if (authError) {
    console.log('Auth error:', authError.message);
    console.log('Error details:', authError);
  } else {
    console.log('✅ Auth works! Found users:', users.users.length);
  }
  
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  console.error('Full error:', error);
}
