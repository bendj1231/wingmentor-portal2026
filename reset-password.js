#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetPassword() {
  console.log('🔧 Resetting password for benjamintigerbowler@gmail.com...');

  try {
    // Get the user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      return;
    }

    const user = users.find(u => u.email === 'benjamintigerbowler@gmail.com');
    
    if (!user) {
      console.error('❌ User not found');
      return;
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);

    // Update the user's password using admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: 'Andrewjohn1' }
    );

    if (error) {
      console.error('❌ Error updating password:', error.message);
      
      // Try alternative method - generate password reset link
      console.log('🔄 Trying password reset method...');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        'benjamintigerbowler@gmail.com',
        { 
          redirectTo: 'http://localhost:3000/reset-password'
        }
      );
      
      if (resetError) {
        console.error('❌ Password reset failed:', resetError.message);
      } else {
        console.log('✅ Password reset email sent! Check your inbox.');
      }
    } else {
      console.log('✅ Password updated successfully!');
      console.log('📧 Email: benjamintigerbowler@gmail.com');
      console.log('🔑 Password: Andrewjohn1');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

resetPassword();
