#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function enrollUser(email) {
  console.log(`🔧 Enrolling ${email} in Foundational Program...`);
  
  try {
    // Get user by email
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error getting users:', authError);
      return;
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User ${email} not found`);
      return;
    }
    
    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);
    
    // Update user profile with enrollment
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        enrolled_programs: ['Foundational'],
        enrollment_agreement_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Error updating profile:', profileError);
      return;
    }
    
    console.log('✅ Profile updated with enrollment');
    
    // Create enrollment record
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        program_name: 'Foundational',
        enrollment_status: 'completed',
        onboarding_data: {
          interest: 'Manual enrollment',
          goals: 'Complete Foundational Program',
          agreementVersion: '1.0',
          agreedAt: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (enrollmentError) {
      console.error('❌ Error creating enrollment record:', enrollmentError);
      return;
    }
    
    console.log('✅ Enrollment record created');
    console.log(`🎉 ${email} is now enrolled in Foundational Program!`);
    
  } catch (error) {
    console.error('❌ Enrollment error:', error);
  }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node enroll-user.js <email>');
  process.exit(1);
}

enrollUser(email);
