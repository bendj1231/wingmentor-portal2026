import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, program, type } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const displayName = name || email.split('@')[0]
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('📧 Sending enrollment confirmation to:', email)
    
    // Try to send email using Supabase Auth's magic link with custom redirect
    try {
      const { error: emailError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          emailRedirectTo: `${supabaseUrl.replace('/rest/v1', '')}/enrollment-confirmation`,
          data: {
            display_name: displayName,
            program: program,
            enrollment_date: new Date().toISOString(),
            type: 'enrollment-confirmation'
          }
        }
      })
      
      if (emailError) {
        console.warn('⚠️ Supabase Auth email error:', emailError)
      } else {
        console.log('✅ Email sent via Supabase Auth magic link')
        
        // Store notification for tracking
        await storeNotification(supabase, email, displayName, program, 'supabase-auth-magiclink')
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Enrollment confirmation sent via Supabase Auth',
            email: email,
            method: 'supabase-auth-magiclink'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }
    } catch (authError) {
      console.warn('⚠️ Supabase Auth error:', authError)
    }
    
    // Fallback: Create a signup link that sends a welcome email
    try {
      const { error: signupError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${supabaseUrl.replace('/rest/v1', '')}/enrollment-confirmation`,
          data: {
            display_name: displayName,
            program: program,
            enrollment_date: new Date().toISOString(),
            type: 'enrollment-confirmation'
          }
        }
      })
      
      if (signupError) {
        console.warn('⚠️ Supabase signup email error:', signupError)
      } else {
        console.log('✅ Email sent via Supabase signup link')
        
        // Store notification for tracking
        await storeNotification(supabase, email, displayName, program, 'supabase-auth-signup')
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Enrollment confirmation sent via Supabase signup',
            email: email,
            method: 'supabase-auth-signup'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }
    } catch (signupError) {
      console.warn('⚠️ Supabase signup error:', signupError)
    }
    
    // Final fallback: Store the email content for manual sending
    console.log('📧 Storing email content for manual sending...')
    await storeNotification(supabase, email, displayName, program, 'database-storage')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Enrollment confirmation stored for manual sending',
        email: email,
        method: 'database-storage'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in Edge Function:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function storeNotification(supabase: any, email: string, displayName: string, program: string, method: string) {
  try {
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: null,
        title: 'Enrollment Confirmation Sent',
        message: `Your enrollment confirmation for the WingMentor Foundational Program has been sent to ${email}`,
        type: 'system',
        priority: 'high',
        metadata: {
          email: email,
          displayName: displayName,
          program: program,
          enrollmentDate: new Date().toISOString(),
          emailSubject: '✅ Enrollment Confirmed - WingMentor Foundational Program',
          method: method
        }
      })
    
    if (notificationError) {
      console.warn('⚠️ Could not store notification:', notificationError)
    } else {
      console.log('✅ Notification stored successfully')
    }
  } catch (error) {
    console.warn('⚠️ Error storing notification:', error)
  }
}
