import React from 'react';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';

interface EnrolledFoundationalPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
  onOpenPortfolio: () => void;
  onViewProgramDetails?: () => void;
  onOpenModules?: () => void;
  onOpenLogbook?: () => void;
}

const modules = [
  {
    id: 'foundation-01',
    title: 'Modules',
    description:
      'Access the Foundational syllabus modules including Pilot Gap Module and Pilot Gap Module 2. Continue your mentorship journey.',
    icon: 'Book',
  },
  {
    id: 'foundation-02',
    title: 'Progress & Examination Board',
    description:
      'Track your journey through the Foundational Program. View completed modules, upcoming milestones, and your overall advancement in the WingMentor mentorship flow.',
    icon: 'TrendingUp',
  },
  {
    id: 'foundation-03',
    title: 'Mentorship Logbook',
    description:
      'Record and track your mentorship sessions, hours, 50hrs certification progress tracking, and program milestones in your personalized digital logbook.',
    icon: 'ClipboardList',
  },
];

export const EnrolledFoundationalPage: React.FC<EnrolledFoundationalPageProps> = ({ userProfile, onBack, onOpenPortfolio, onViewProgramDetails, onOpenModules, onOpenLogbook }) => {
  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', paddingTop: '120px' }}>
      <div style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#1e40af',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Back to Program Directory
        </button>
        
        {/* Single White Card Container */}
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
          }}
        >
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '180px', height: 'auto', objectFit: 'contain', marginBottom: '1rem' }} />
            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              WINGMENTOR PROGRAMS
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
              Foundation Program Platform
            </h1>
            <p style={{ color: '#1d4ed8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Welcome back, {displayName}
            </p>
          </div>

          {/* Description */}
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your central hub for the Foundation Program. Track your progress through structured modules, complete assessments, access your pilot portfolio, and connect with mentorship resources all in one place.
          </p>

          {/* Module Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            {modules.map((module) => (
              <div
                key={module.id}
                style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>
                    {module.title}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {module.description}
                  </p>
                </div>
                {module.id === 'foundation-02' ? (
                  <button
                    onClick={onOpenPortfolio}
                    style={{
                      width: '100%',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.6rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    View Progress
                  </button>
                ) : module.id === 'foundation-03' ? (
                  <button
                    onClick={onOpenLogbook}
                    style={{
                      width: '100%',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.6rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Open Logbook
                  </button>
                ) : (
                  <button
                    onClick={onOpenModules}
                    style={{
                      width: '100%',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.6rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    View Details
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* W1000 Directory - URL Directory Bar */}
          <a
            href="https://w1000.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e2e8f0',
              }}>
                <Icons.ExternalLink style={{ width: 20, height: 20, color: '#2563eb' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                  W1000 Directory
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  Launch the W1000 logbook, mentorship assignments, and reference materials
                </p>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#fff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#1e40af',
            }}>
              Access W1000
              <Icons.ExternalLink style={{ width: 14, height: 14 }} />
            </div>
          </a>

          {/* Program Details Directory Link */}
          <button
            onClick={onViewProgramDetails}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2563eb',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.5rem 0',
              marginTop: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Directory for the program details to the enrollment page
            <Icons.ArrowRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrolledFoundationalPage;
