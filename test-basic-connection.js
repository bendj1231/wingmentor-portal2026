#!/usr/bin/env node

console.log('Testing basic project connection...');

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';

try {
  // Try to fetch the project info directly
  const response = await fetch(supabaseUrl + '/rest/v1/', {
    method: 'GET',
    headers: {
      'apikey': 'dummy',
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    console.log('✅ Project URL is accessible');
    console.log('Status:', response.status);
  } else {
    console.log('❌ Project URL error:', response.status, response.statusText);
  }
  
} catch (error) {
  console.error('❌ Cannot connect to project:', error.message);
}
