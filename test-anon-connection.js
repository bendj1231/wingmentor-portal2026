#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

console.log('Testing with anon key first...');

// Try with anon key to test basic connection
const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzQxOTEsImV4cCI6MjA4OTExMDE5MX0.a7jM4qQkXeXz4e7Y8ZkF5wL6mN9pO2qR1sT3uV4wYc';

try {
  const supabase = createClient(supabaseUrl, anonKey);
  
  console.log('Testing basic connection with anon key...');
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .limit(1);
  
  if (error) {
    console.log('Anon key error:', error.message);
  } else {
    console.log('✅ Basic connection works with anon key!');
    console.log('Now we need the service role key for admin operations.');
  }
  
} catch (error) {
  console.error('❌ Connection failed:', error.message);
}
