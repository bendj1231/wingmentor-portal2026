import React from 'react';
import { CloudBackground } from '../components/CloudBackground';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';

interface RestrictedConfirmationPageProps {
  userProfile: UserProfile;
  restrictedProgram: string;
  onContinue: () => void;
  onNavigateTo: (pageId: string) => void;
}

const playbookSteps = [
  {
    title: 'Verify Mentor Management Status',
    description:
      'Ensure your assigned mentor manager has cleared the restriction flag. This check happens automatically once your status is restored.'
  },
  {
    title: 'Schedule a Compliance Review',
    description:
      'A short 15-minute review ensures training data, identity documents, and flight-hour logs match regulatory requirements.'
  },
  {
    title: 'Return to the Restricted Hub',
    description:
      'Once compliance signs off, you can continue through the restricted hub for tailored access and updates.'
  }
];

export const RestrictedConfirmationPage: React.FC<RestrictedConfirmationPageProps> = ({
  userProfile,
  restrictedProgram,
  onContinue,
  onNavigateTo
}) => {
  const displayName =
    (userProfile.displayName && userProfile.displayName.trim()) ||
    [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ').trim() ||
    userProfile.email ||
    'Pilot';

  return (
    <div
      className="dashboard-container animate-fade-in"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem 2rem',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <CloudBackground />
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.78)',
            borderRadius: '28px',
            padding: '3rem',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 35px 60px -24px rgba(15,23,42,0.35)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, letterSpacing: '0.4em', fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>RESTRICTED ACCESS</p>
              <h1 style={{ margin: '0.75rem 0 0.25rem', fontSize: '2.25rem', color: '#0f172a', fontWeight: 500 }}>Confirmation Required</h1>
              <p style={{ margin: 0, color: '#475569', fontSize: '1rem', lineHeight: 1.7 }}>
                {displayName}, before continuing into <strong>{restrictedProgram}</strong>, we need to complete a short confirmation process to keep our restricted programs compliant and secure.
              </p>
            </div>
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '18px',
                border: '1px solid #fee2e2',
                background: '#fff7ed',
                minWidth: '260px'
              }}
            >
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.3em', color: '#ea580c' }}>PROFILE SNAPSHOT</p>
              <h3 style={{ margin: '0.65rem 0 0.35rem', fontSize: '1.25rem', color: '#c2410c' }}>{userProfile.status?.toUpperCase() || 'PENDING'}</h3>
              <p style={{ margin: 0, color: '#9a3412', fontSize: '0.95rem' }}>Track: {userProfile.track ?? 'Restricted'}</p>
              <p style={{ margin: '0.2rem 0 0', color: '#9a3412', fontSize: '0.9rem' }}>Email: {userProfile.email}</p>
            </div>
          </div>

          <div
            style={{
              marginTop: '2.75rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: '1.25rem'
            }}
          >
            {playbookSteps.map((step, index) => (
              <div
                key={step.title}
                style={{
                  borderRadius: '18px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  minHeight: '220px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 600 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '12px',
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    {index + 1}
                  </div>
                  {step.title}
                </div>
                <p style={{ margin: 0, color: '#475569', lineHeight: 1.7, fontSize: '0.96rem' }}>{step.description}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '3rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <button
              onClick={onContinue}
              style={{
                border: 'none',
                borderRadius: '999px',
                padding: '0.95rem 2.5rem',
                background: 'linear-gradient(135deg,#0f172a,#1d4ed8)',
                color: 'white',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              Proceed to Restricted Hub
              <Icons.ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            <button
              onClick={() => onNavigateTo('contact')}
              style={{
                borderRadius: '999px',
                padding: '0.95rem 2rem',
                border: '1px solid #cbd5f5',
                background: 'white',
                color: '#1e293b',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Contact Support
            </button>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15,23,42,0.9)',
            borderRadius: '24px',
            padding: '2.5rem',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
            <Icons.Shield style={{ width: 22, height: 22 }} />
            Restricted Track Assurance
          </div>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
            You are currently viewing a confirmation screen for restricted-track pilots. These flows ensure we only surface sensitive training tools to pilots who have completed the required verifications. Once your mentor manager clears the restriction, this screen will automatically forward you into the dedicated hub.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestrictedConfirmationPage;
