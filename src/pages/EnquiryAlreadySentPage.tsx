import React from 'react';
import type { UserProfile } from '../types/user';
import { CloudBackground } from '../components/CloudBackground';

interface EnquiryAlreadySentPageProps {
  onBack: () => void;
  userProfile: UserProfile;
  programName: string;
  hoursRemaining: number;
  supportPhone: string;
}

export const EnquiryAlreadySentPage: React.FC<EnquiryAlreadySentPageProps> = ({
  onBack,
  userProfile,
  programName,
  hoursRemaining,
  supportPhone
}) => {
  return (
    <div className="dashboard-container animate-fade-in" style={{ 
      alignItems: 'flex-start', 
      justifyContent: 'center', 
      padding: '3rem 1rem 2rem',
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
          
          <div style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            SUBMISSION COOLDOWN
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
            Enquiry Already Sent
          </h2>
          
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
            <strong>You have already submitted a support enquiry for {programName}.</strong> To ensure our team can properly review your request and provide you with the best possible assistance, please wait {hoursRemaining} hours before submitting another enquiry.
            <br /><br />
            This cooldown period helps us maintain quality support and ensures each enquiry receives the attention it deserves. We understand your situation is important, and we're committed to helping you resolve it as quickly as possible.
          </p>

          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fca5a5', 
            borderRadius: '16px', 
            padding: '2rem',
            margin: '2.5rem 0',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem', color: '#dc2626', marginTop: '0.25rem' }}>⚠️</div>
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  color: '#991b1b', 
                  marginBottom: '0.75rem',
                  fontFamily: 'Georgia, serif'
                }}>
                  Need Immediate Help?
                </h3>
                <p style={{ 
                  color: '#991b1b', 
                  lineHeight: 1.6, 
                  margin: 0,
                  fontSize: '0.95rem'
                }}>
                  For urgent matters that cannot wait, please contact our support team directly at <strong style={{ color: '#dc2626' }}>{supportPhone}</strong>. Our team is available to assist you with time-sensitive issues.
                </p>
              </div>
            </div>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
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
                  <strong style={{ color: '#374151' }}>Current Enquiry Review</strong>
                  <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                    Your existing enquiry is being reviewed by our support team
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
                  <strong style={{ color: '#374151' }}>Wait Period</strong>
                  <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                    {hoursRemaining} hours remaining until you can submit another enquiry
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
                  <strong style={{ color: '#374151' }}>New Enquiry Available</strong>
                  <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                    After 24 hours, you'll be able to submit additional enquiries if needed
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
              <div style={{ fontSize: '1.2rem', color: '#dc2626' }}>ℹ️</div>
              <strong>Your Information:</strong>
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <div><strong>User:</strong> {userProfile.displayName || userProfile.email}</div>
              <div><strong>Program:</strong> {programName}</div>
              <div><strong>Cooldown:</strong> {hoursRemaining} hours remaining</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button
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
              ← Back to Programs
            </button>
            
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(supportPhone);
                  alert('Support phone number copied to clipboard!');
                } else {
                  alert(`Support phone number: ${supportPhone}`);
                }
              }}
              style={{
                padding: '0.875rem 2.5rem',
                border: 'none',
                background: '#dc2626',
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
                e.currentTarget.style.background = '#b91c1c';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#dc2626';
              }}
            >
              📞 Copy Support Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
