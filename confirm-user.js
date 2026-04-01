#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function confirmUser() {
  console.log('🔧 Confirming user email and checking status...');

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

    console.log(`Found user: ${user.email}`);
    console.log(`Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`Phone confirmed: ${user.phone_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`User status: ${user.banned ? 'Banned' : 'Active'}`);

    // Confirm the user's email
    if (!user.email_confirmed_at) {
      console.log('🔄 Confirming user email...');
      
      const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        { 
          email_confirm: true,
          user_metadata: {
            ...user.user_metadata,
            email_confirmed: true
          }
        }
      );

      if (error) {
        console.error('❌ Error confirming email:', error.message);
        
        // Try alternative method - manually set email_confirmed_at
        console.log('🔄 Trying alternative confirmation method...');
        
        const { error: altError } = await supabase.auth.admin.updateUserById(
          user.id,
          { 
            email: user.email, // Re-set the same email to trigger confirmation
            email_confirm: true
          }
        );
        
        if (altError) {
          console.error('❌ Alternative confirmation failed:', altError.message);
        } else {
          console.log('✅ Email confirmed via alternative method!');
        }
      } else {
        console.log('✅ Email confirmed successfully!');
      }
    } else {
      console.log('✅ Email already confirmed');
    }

    // Check final status
    const { data: { users: updatedUsers }, error: checkError } = await supabase.auth.admin.listUsers();
    const updatedUser = updatedUsers.find(u => u.email === 'benjamintigerbowler@gmail.com');
    
    if (updatedUser) {
      console.log('\n📋 Final User Status:');
      console.log(`✅ Email: ${updatedUser.email}`);
      console.log(`✅ Email Confirmed: ${updatedUser.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`✅ User ID: ${updatedUser.id}`);
      console.log(`✅ Role: ${updatedUser.user_metadata?.role || 'mentee'}`);
      console.log(`✅ Status: ${updatedUser.banned ? 'Banned' : 'Active'}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

confirmUser();
