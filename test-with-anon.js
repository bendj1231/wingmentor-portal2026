#!/usr/bin/env node

console.log('Testing with anon key from dashboard...');

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzQxOTEsImV4cCI6MjA4OTExMDE5MX0.a7jM4qQkXeXz4e7Y8ZkF5wL6mN9pO2qR1sT3uV4wYc';

try {
  const response = await fetch(supabaseUrl + '/rest/v1/', {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Response status:', response.status);
  
  if (response.ok) {
    console.log('✅ Anon key works!');
    const data = await response.text();
    console.log('Response data:', data.substring(0, 100) + '...');
  } else {
    console.log('❌ Anon key failed:', response.statusText);
    const error = await response.text();
    console.log('Error details:', error);
  }
  
} catch (error) {
  console.error('❌ Connection failed:', error.message);
}
