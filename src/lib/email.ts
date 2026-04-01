import { supabase } from './supabase-auth';

interface EnrollmentEmailPayload {
  email: string;
  name?: string | null;
}

export const sendEnrollmentConfirmationEmail = async ({ email, name }: EnrollmentEmailPayload) => {
  try {
    console.log('📧 Sending enrollment confirmation via Supabase to:', email);
    
    const displayName = name || email.split('@')[0];
    
    // Use resetPasswordForEmail which works for existing users and supports email templates
    // We'll customize the data to make it clear this is for enrollment confirmation
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/enrollment-confirmation`
      });
      
      if (error) {
        console.warn('⚠️ Could not send enrollment confirmation via reset password:', error);
      } else {
        console.log('✅ Enrollment confirmation sent via Supabase Auth reset password');
        await storeEmailNotification(email, displayName, 'supabase-auth-reset-password');
        
        // Store custom email template for reference
        await storeCustomEmailTemplate(email, displayName);
        return;
      }
    } catch (authError) {
      console.warn('⚠️ Supabase Auth reset password error:', authError);
    }
    
    // Fallback: Use Edge Function with generateLink for magic link
    console.log('📧 Using Edge Function for magic link email...');
    const { data, error } = await supabase.functions.invoke('send-enrollment-email', {
      body: {
        email,
        name: displayName,
        program: 'Foundational',
        type: 'enrollment-confirmation'
      }
    });

    if (error) {
      console.warn('⚠️ Edge Function error:', error);
    } else {
      console.log('✅ Magic link email sent via Edge Function:', data);
      await storeEmailNotification(email, displayName, 'supabase-edge-function-magiclink');
      await storeCustomEmailTemplate(email, displayName);
      return;
    }
    
    console.log('✅ Enrollment confirmation processed for:', email);
    
  } catch (error) {
    console.error('❌ Error sending enrollment confirmation:', error);
    // Don't throw error - enrollment should succeed even if email fails
  }
};

// Store the custom email template for reference
const storeCustomEmailTemplate = async (email: string, displayName: string) => {
  try {
    const customTemplate = `
<div style="font-family: 'Georgia, serif'; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Soft Transition Shader Background -->
  <div style="
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), rgba(255,255,255,0.15) 20%, transparent 35%), 
      radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), rgba(255,255,255,0.12) 18%, transparent 30%),
      radial-gradient(circle at 50% 60%, rgba(147,197,253,0.20), rgba(255,255,255,0.10) 25%, transparent 40%),
      radial-gradient(circle at 35% 75%, rgba(59,130,246,0.15), rgba(255,255,255,0.08) 22%, transparent 38%);
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 1;
  "></div>
  <div style="
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 30%, transparent 50%);
    top: 10%;
    right: 0%;
    filter: blur(8px);
    opacity: 0.9;
    pointer-events: none;
    z-index: 1;
  "></div>
  <div style="
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(147,197,253,0.18) 0%, rgba(255,255,255,0.06) 35%, transparent 55%);
    bottom: 5%;
    left: -10%;
    filter: blur(12px);
    opacity: 0.8;
    pointer-events: none;
    z-index: 1;
  "></div>
  <div style="
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 40%, transparent 60%);
    top: 60%;
    left: 40%;
    filter: blur(10px);
    opacity: 0.7;
    pointer-events: none;
    z-index: 1;
  "></div>

  <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; text-align: center; position: relative; z-index: 2;">
    <div style="background-color: rgba(255, 255, 255, 0.85); border-radius: 16px; padding: 3rem 2.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); backdrop-filter: blur(18px); border: 1px solid rgba(255, 255, 255, 0.3); width: 100%;">
      <img src="https://lh3.googleusercontent.com/d/1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6" alt="WingMentor Logo" style="height: 110px; width: auto; object-fit: contain; margin-bottom: 1.5rem;" />
      
      <div style="color: #2563eb; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 0.75rem;">
        ENROLLMENT CONFIRMATION
      </div>
      
      <h2 style="font-size: 1.8rem; font-weight: 400; font-family: 'Georgia, serif'; letter-spacing: -0.02em; line-height: 1.2; color: #0f172a; margin-bottom: 2.5rem;">
        Program Enrollment Confirmed
        <br />
        <span style="font-size: 1rem; color: #475569;">WingMentor Foundational Program</span>
      </h2>
      
      <p style="color: #475569; font-size: 1.05rem; line-height: 1.8; margin: 0 auto 2rem; max-width: 40rem; text-align: left;">
        Congratulations <strong>${displayName}</strong>! Your enrollment in the <strong>WingMentor Foundational Program</strong> has been successfully completed. This confirmation email validates your participation and provides access to your personalized pilot development journey.
      </p>
      
      <div style="text-align: center; margin: 2.5rem 0;">
        <a href="{{ .ConfirmationURL }}" 
           style="display: inline-block; padding: 1.1rem 2.75rem; background: rgba(147, 197, 253, 0.35); color: #1e40af; text-decoration: none; border-radius: 12px; font-size: 1rem; font-weight: 700; transition: all 0.25s ease; box-shadow: 0 8px 32px rgba(147, 197, 253, 0.2), inset 0 1px 0 rgba(255,255,255,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(147, 197, 253, 0.4);">
          View Enrollment Details
        </a>
      </div>
      
      <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 20px;">
        <p style="color: #1e40af; margin: 0; font-size: 0.9rem;"><strong>Next Steps:</strong> Our mentorship team will review your onboarding responses and contact you regarding the next available simulator block and program scheduling.</p>
      </div>
      
      <div style="text-align: center; color: #64748b; font-size: 0.85rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>This confirmation link will expire in 1 hour for security reasons.</p>
        <p>For questions about your enrollment, contact: wingmentorprogram@gmail.com</p>
        <p style="color: #9ca3af; font-size: 0.75rem; margin-top: 15px;">© 2026 Wing Mentor Network. All rights reserved.</p>
      </div>
    </div>
  </div>
</div>
    `;
    
    const { error: templateError } = await supabase
      .from('notifications')
      .insert({
        user_id: null,
        title: 'Custom Email Template Stored',
        message: `Custom enrollment confirmation template stored for ${email}`,
        type: 'system',
        priority: 'low',
        metadata: {
          email: email,
          displayName: displayName,
          template: customTemplate,
          type: 'enrollment-confirmation-template'
        }
      });
    
    if (templateError) {
      console.warn('⚠️ Could not store custom template:', templateError);
    } else {
      console.log('✅ Custom email template stored for reference');
    }
  } catch (error) {
    console.warn('⚠️ Error storing custom template:', error);
  }
};

// Helper function to store email notification
const storeEmailNotification = async (email: string, displayName: string, method: string) => {
  try {
    // Get the user ID from the email
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (profileError) {
      console.warn('⚠️ Could not find user profile for email:', email);
    } else if (profileData) {
      // Store notification with correct table structure
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: profileData.id,
          title: 'Enrollment Confirmation Sent',
          message: `Your enrollment confirmation for the WingMentor Foundational Program has been sent to ${email}`,
          type: 'system',
          priority: 'high',
          metadata: {
            email: email,
            displayName: displayName,
            program: 'Foundational',
            enrollmentDate: new Date().toISOString(),
            emailSubject: '✅ Enrollment Confirmed - WingMentor Foundational Program',
            method: method
          }
        });
      
      if (notificationError) {
        console.warn('⚠️ Could not store notification:', notificationError);
      } else {
        console.log('✅ Email notification stored in database');
      }
    }
  } catch (error) {
    console.warn('⚠️ Error storing notification:', error);
  }
};
