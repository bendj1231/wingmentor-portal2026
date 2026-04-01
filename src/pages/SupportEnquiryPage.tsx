import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types/user';
import { CloudBackground } from '../components/CloudBackground';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SupportEnquiryPageProps {
  onBack: () => void;
  userProfile: UserProfile;
  programName: string;
  restrictionReason?: string;
}

export const SupportEnquiryPage: React.FC<SupportEnquiryPageProps> = ({
  onBack,
  userProfile,
  programName,
  restrictionReason
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    enquiryType: 'appeal' as 'appeal' | 'question' | 'technical',
    message: '',
    contactMethod: 'email' as 'email' | 'phone',
    urgency: 'normal' as 'low' | 'normal' | 'high'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cooldownMessage, setCooldownMessage] = useState('');
  const [isCheckingCooldown, setIsCheckingCooldown] = useState(false);

  // Single useEffect to check cooldown on component mount only
  useEffect(() => {
    checkExistingEnquiry();
  }, []); // Empty dependency - only run once on mount

  // Check if user has already submitted an enquiry for this program
  const checkExistingEnquiry = async () => {
    // Prevent multiple simultaneous queries
    if (isCheckingCooldown) {
      return;
    }

    setIsCheckingCooldown(true);
    
    console.log(`🔍 DEBUG - SupportEnquiryPage Cooldown Check:`);
    console.log(`  - User ID: ${userProfile?.id}`);
    console.log(`  - User Email: ${userProfile?.email}`);
    console.log(`  - Program Name: "${programName}"`);
    
    try {
      // Query Firestore for existing enquiries from this user for this program
      const enquiriesRef = collection(db, 'supportEnquiries');
      const q = query(
        enquiriesRef,
        where('userId', '==', userProfile.id),
        where('program', '==', programName),
        where('type', '==', 'support_enquiry'),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      console.log(`  - Query results: ${querySnapshot.docs.length} documents found`);
      
      if (!querySnapshot.empty) {
        const lastEnquiry = querySnapshot.docs[0].data();
        console.log(`  - Last enquiry:`, lastEnquiry);
        
        const submissionTime = lastEnquiry.timestamp?.toDate()?.getTime() || Date.now();
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - submissionTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        console.log(`  - Time difference: ${hoursDiff.toFixed(2)} hours`);
        
        // If submitted within last 24 hours, show cooldown
        if (hoursDiff < 24) {
          const hoursRemaining = Math.ceil(24 - hoursDiff);
          const message = `Unable to send enquiry. Please wait ${hoursRemaining} hours before submitting another enquiry. After 24 hours, please contact support for help at +629670481890`;
          setCooldownMessage(message);
          console.log(`  - ✅ Cooldown ACTIVE: ${hoursRemaining} hours remaining`);
          return true;
        } else {
          setCooldownMessage('');
          console.log(`  - ✅ No cooldown: enquiry was ${hoursDiff.toFixed(2)} hours ago (> 24 hours)`);
        }
      } else {
        setCooldownMessage('');
        console.log(`  - ✅ No cooldown: no enquiries found for this program`);
      }
    } catch (error) {
      // Fallback to localStorage if Firebase fails
      try {
        const existingNotifications = JSON.parse(localStorage.getItem('supportNotifications') || '[]');
        const userEnquiries = existingNotifications.filter((n: any) => 
          n.user?.id === userProfile.id && 
          n.program === programName && 
          n.type === 'support_enquiry'
        );
        
        if (userEnquiries.length > 0) {
          const lastEnquiry = userEnquiries[0];
          const submissionTime = new Date(lastEnquiry.timestamp).getTime();
          const currentTime = new Date().getTime();
          const timeDiff = currentTime - submissionTime;
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            const hoursRemaining = Math.ceil(24 - hoursDiff);
            setCooldownMessage(`Unable to send enquiry. Please wait ${hoursRemaining} hours before submitting another enquiry. After 24 hours, please contact support for help at +629670481890`);
            return true;
          }
        }
      } catch (localError) {
        // Silent error handling
      }
    } finally {
      setIsCheckingCooldown(false);
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check cooldown before submitting
    const hasCooldown = await checkExistingEnquiry();
    if (hasCooldown) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create enquiry object for Firebase
      const enquiryData = {
        userId: userProfile.id,
        type: 'support_enquiry',
        title: `Support Enquiry: ${formData.subject}`,
        message: formData.message,
        user: {
          id: userProfile.id,
          name: userProfile.displayName || userProfile.email,
          email: userProfile.email,
          role: userProfile.role
        },
        program: programName,
        enquiryType: formData.enquiryType,
        urgency: formData.urgency,
        contactMethod: formData.contactMethod,
        restrictionReason,
        timestamp: serverTimestamp(),
        status: 'pending'
      };

      // Store in Firestore
      const enquiriesRef = collection(db, 'supportEnquiries');
      await addDoc(enquiriesRef, enquiryData);

      // Also store in notifications collection for admin dashboard
      const notificationData = {
        ...enquiryData,
        id: `support-${Date.now()}`, // Keep for compatibility with existing notification system
        timestamp: new Date().toISOString() // Keep string format for notifications
      };
      
      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, notificationData);

      // Simulate email notification (in production, this would trigger an email service)
      console.log('📧 Email notification sent to super admin:', {
        to: 'benjamintigerbowler@gmail.com',
        subject: `New Support Enquiry: ${formData.subject}`,
        enquiry: notificationData
      });

      // Immediately activate cooldown after successful submission
      setCooldownMessage('Unable to send enquiry. Please wait 24 hours before submitting another enquiry. After 24 hours, please contact support for help at +629670481890');

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="dashboard-container animate-fade-in" style={{ 
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        padding: '3rem 1rem 2rem',
        background: 'transparent',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CloudBackground />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', textAlign: 'left', width: '100%', maxWidth: '56rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '4rem 3rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
            
            <div style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              ENQUIRY SUBMITTED
            </div>
            
            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
              Appeal Received
            </h2>
            
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
              <strong>Your support enquiry has been successfully submitted.</strong> Our team will review your case and respond within 24-48 hours. You'll receive a notification once your appeal has been processed.
              <br /><br />
              Thank you for your patience as we work to resolve your access restriction as quickly as possible.
            </p>

            <div style={{ 
              background: '#dcfce7', 
              border: '1px solid #86efac', 
              borderRadius: '16px', 
              padding: '2rem',
              margin: '2.5rem 0',
              textAlign: 'left'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: '#166534', 
                marginBottom: '1.5rem',
                fontFamily: 'Georgia, serif'
              }}>
                Enquiry Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div><strong>Reference ID:</strong> SUPP-{Date.now()}</div>
                <div><strong>Program:</strong> {programName}</div>
                <div><strong>Type:</strong> {formData.enquiryType}</div>
                <div><strong>Urgency:</strong> {formData.urgency}</div>
                <div><strong>Contact Method:</strong> {formData.contactMethod}</div>
                <div><strong>Submitted:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '16px', 
              padding: '2rem',
              margin: '2.5rem 0',
              textAlign: 'left'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: '#374151', 
                marginBottom: '1.5rem',
                fontFamily: 'Georgia, serif'
              }}>
                What Happens Next?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: '#dcfce7', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    color: '#16a34a',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Review Process</strong>
                    <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                      Our support team will review your appeal details and restriction context
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: '#dcfce7', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    color: '#16a34a',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Decision Made</strong>
                    <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                      We'll make a decision on your appeal within 24-48 hours
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: '#dcfce7', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    color: '#16a34a',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Notification Sent</strong>
                    <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                      You'll receive a notification about the decision and any next steps
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fca5a5', 
              borderRadius: '12px', 
              padding: '1.5rem',
              margin: '2rem 0',
              fontSize: '0.85rem',
              color: '#991b1b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '1.2rem', color: '#dc2626' }}>⚠️</div>
                <strong>Important Note:</strong>
              </div>
              <div style={{ marginLeft: '2rem' }}>
                <div>You can submit one appeal per program every 24 hours.</div>
                <div>For urgent matters, please contact support at +629670481890.</div>
                <div>All decisions are final and subject to program policies.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button
                onClick={async () => {
                  // Reset form but maintain cooldown and stay on the same page
                  setSubmitted(false);
                  setFormData({
                    subject: '',
                    message: '',
                    enquiryType: 'appeal',
                    urgency: 'normal',
                    contactMethod: 'email'
                  });
                  
                  // IMPORTANT: Don't navigate anywhere, just show the form with cooldown
                  return false;
                }}
                style={{
                  padding: '0.875rem 2.5rem',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#374151',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Georgia, serif'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                ← Submit Another Appeal
              </button>
              
              <button
                onClick={onBack}
                style={{
                  padding: '0.875rem 2.5rem',
                  border: 'none',
                  background: '#16a34a',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Georgia, serif'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#15803d';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#16a34a';
                }}
              >
                → Back to Programs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in" style={{ 
      alignItems: 'flex-start', 
      justifyContent: 'center', 
      padding: '3rem 1rem 2rem',
      background: 'transparent',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <CloudBackground />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', textAlign: 'left', width: '100%', maxWidth: '56rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '4rem 3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
          
          <div style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            SUPPORT ENQUIRY
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
            Submit Your Request
          </h2>

        {restrictionReason && (
          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fca5a5', 
            borderRadius: '12px', 
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.2rem', color: '#dc2626' }}>ℹ️</div>
              <div>
                <strong style={{ color: '#991b1b' }}>Restriction Notice:</strong>
                <p style={{ color: '#991b1b', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                  {restrictionReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {cooldownMessage && (
          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fca5a5', 
            borderRadius: '16px', 
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#dc2626' }}>⏰</div>
              <div>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 600, 
                  color: '#991b1b', 
                  marginBottom: '0.5rem',
                  fontFamily: 'Georgia, serif'
                }}>
                  Appeal Already Submitted
                </h3>
                <p style={{ 
                  color: '#991b1b', 
                  lineHeight: 1.6, 
                  margin: 0,
                  fontSize: '0.95rem'
                }}>
                  {cooldownMessage}
                </p>
              </div>
            </div>
            
            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '1rem',
              marginTop: '1rem',
              fontSize: '0.85rem',
              color: '#6b7280'
            }}>
              <strong>Note:</strong> This cooldown is enforced across all devices and sessions to ensure fair processing of your appeal.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem', textAlign: 'left' }}>
            {cooldownMessage && (
              <div style={{ 
                background: '#fef2f2', 
                border: '1px solid #fca5a5', 
                borderRadius: '12px', 
                padding: '1rem',
                marginBottom: '1rem',
                textAlign: 'center',
                opacity: 0.8
              }}>
                <p style={{ color: '#991b1b', margin: 0, fontSize: '0.9rem' }}>
                  <strong>⏰ Form Disabled:</strong> Please wait for the cooldown period to end before submitting another appeal.
                </p>
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: cooldownMessage ? '#9ca3af' : '#374151', marginBottom: '0.5rem' }}>
                Enquiry Type *
              </label>
              <select
                value={formData.enquiryType}
                onChange={(e) => setFormData({...formData, enquiryType: e.target.value as any})}
                required
                disabled={!!cooldownMessage}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: cooldownMessage ? '#f9fafb' : 'white',
                  opacity: cooldownMessage ? 0.6 : 1,
                  cursor: cooldownMessage ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="appeal">Appeal Restriction</option>
                <option value="question">General Question</option>
                <option value="technical">Technical Issue</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: cooldownMessage ? '#9ca3af' : '#374151', marginBottom: '0.5rem' }}>
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
                placeholder="Brief description of your enquiry"
                disabled={!!cooldownMessage}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: cooldownMessage ? '#f9fafb' : 'white',
                  opacity: cooldownMessage ? 0.6 : 1,
                  cursor: cooldownMessage ? 'not-allowed' : 'pointer'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: cooldownMessage ? '#9ca3af' : '#374151', marginBottom: '0.5rem' }}>
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                placeholder="Please provide detailed information about your enquiry..."
                rows={6}
                disabled={!!cooldownMessage}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  background: cooldownMessage ? '#f9fafb' : 'white',
                  opacity: cooldownMessage ? 0.6 : 1,
                  cursor: cooldownMessage ? 'not-allowed' : 'pointer'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: cooldownMessage ? '#9ca3af' : '#374151', marginBottom: '0.5rem' }}>
                  Urgency
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
                  disabled={!!cooldownMessage}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: cooldownMessage ? '#f9fafb' : 'white',
                    opacity: cooldownMessage ? 0.6 : 1,
                    cursor: cooldownMessage ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: cooldownMessage ? '#9ca3af' : '#374151', marginBottom: '0.5rem' }}>
                  Preferred Contact Method
                </label>
                <select
                  value={formData.contactMethod}
                  onChange={(e) => setFormData({...formData, contactMethod: e.target.value as any})}
                  disabled={!!cooldownMessage}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: cooldownMessage ? '#f9fafb' : 'white',
                    opacity: cooldownMessage ? 0.6 : 1,
                    cursor: cooldownMessage ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="email">Email ({userProfile.email})</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
            </div>

            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '1rem',
              fontSize: '0.85rem',
              color: '#6b7280'
            }}>
              <strong>Your Information:</strong><br />
              Name: {userProfile.displayName || userProfile.email}<br />
              Email: {userProfile.email}<br />
              Role: {userProfile.role}<br />
              User ID: {userProfile.id}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: '0.875rem 2.5rem',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Georgia, serif'
              }}
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!cooldownMessage}
              style={{
                padding: '0.875rem 2.5rem',
                border: 'none',
                background: (isSubmitting || !!cooldownMessage) ? '#9ca3af' : '#3b82f6',
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: (isSubmitting || !!cooldownMessage) ? 'not-allowed' : 'pointer',
                fontFamily: 'Georgia, serif'
              }}
            >
              {isSubmitting ? 'Submitting...' : cooldownMessage ? 'Unable to Send' : 'Submit Enquiry'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
