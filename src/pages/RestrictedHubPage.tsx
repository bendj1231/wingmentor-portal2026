import React from 'react';
import { CloudBackground } from '../components/CloudBackground';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';

interface RestrictedHubPageProps {
  userProfile: UserProfile;
  onNavigateTo: (page: string) => void;
  onLogout: () => void;
}

const hubSections = [
  {
    title: 'Compliance Briefing',
    description: 'Review the checklist your mentor manager requires before unlocking the restricted programs.',
    action: 'Open Briefing',
    destination: 'programs'
  },
  {
    title: 'Mentor Review',
    description: 'Coordinate directly with Mentor Management to clear outstanding items and update your status.',
    action: 'Contact Mentor',
    destination: 'mentor-management'
  },
  {
    title: 'Support Enquiry',
    description: 'Log a support ticket or send documentation for faster regulatory clearance.',
    action: 'Start Support Enquiry',
    destination: 'support-enquiry'
  }
];

export const RestrictedHubPage: React.FC<RestrictedHubPageProps> = ({ userProfile, onNavigateTo, onLogout }) => {
  const displayName =
    (userProfile.displayName && userProfile.displayName.trim()) ||
    [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ').trim() ||
    userProfile.email ||
    'Pilot';

  return (
    <div className="dashboard-container animate-fade-in" style={{ minHeight: '100vh', position: 'relative', padding: '3rem 1.5rem' }}>
      <CloudBackground variant="dark" />
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => onNavigateTo('restricted-confirmation')}
          style={{
            border: 'none',
            background: 'rgba(15,23,42,0.75)',
            color: 'white',
            borderRadius: '999px',
            padding: '0.5rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
        >
          <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Confirmation
        </button>
        <button
          onClick={onLogout}
          style={{
            border: '1px solid rgba(255,255,255,0.4)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.85)',
            borderRadius: '999px',
            padding: '0.45rem 1.5rem',
            cursor: 'pointer',
            marginBottom: '2rem'
          }}
        >
          Sign Out
        </button>

        <section
          style={{
            background: 'rgba(15,23,42,0.92)',
            borderRadius: '28px',
            padding: '2.5rem',
            color: 'white',
            boxShadow: '0 40px 80px -40px rgba(15,23,42,0.8)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <p style={{ letterSpacing: '0.3em', fontSize: '0.75rem', color: '#38bdf8', margin: 0 }}>RESTRICTED ACCESS HUB</p>
          <h1 style={{ margin: '0.6rem 0 0.4rem', fontSize: '2.3rem', fontWeight: 500 }}>Hello {displayName},</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', maxWidth: '640px', lineHeight: 1.7 }}>
            This hub keeps your restricted track compliant while your mentor manager completes the review. Use the
            actions below to move your request forward or continue collaborating with Mentor Management.
          </p>

          <div
            style={{
              marginTop: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: '1.5rem'
            }}
          >
            {hubSections.map((section) => (
              <div
                key={section.title}
                style={{
                  borderRadius: '22px',
                  border: '1px solid rgba(148,163,184,0.4)',
                  background: 'rgba(15,23,42,0.65)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '1.05rem' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      background: 'rgba(56,189,248,0.15)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icons.Activity style={{ width: 18, height: 18 }} />
                  </div>
                  {section.title}
                </div>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{section.description}</p>
                <button
                  onClick={() => onNavigateTo(section.destination)}
                  style={{
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'transparent',
                    color: '#e0f2fe',
                    padding: '0.65rem 1.5rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    alignSelf: 'flex-start'
                  }}
                >
                  {section.action}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RestrictedHubPage;
