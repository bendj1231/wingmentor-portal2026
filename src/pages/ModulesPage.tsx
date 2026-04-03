import React from 'react';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';

interface ModulesPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
  onLaunchPilotGapModule?: () => void;
  onLaunchPilotGapModule2?: () => void;
  onLaunchModule3?: () => void;
}

const syllabusModules = [
  {
    id: 'pilot-gap-01',
    title: 'Module 1: Industry Familiarization & Indoctrination',
    description: 'Introduction to the pilot gap analysis framework. Understand your current position and identify key areas for development in your aviation career.',
    icon: 'Book',
    status: 'available',
    duration: '45 min',
  },
  {
    id: 'pilot-gap-02',
    title: 'Module 2: Psychology of Mentorship & Practical Application',
    description: 'Advanced mentorship techniques and practical application of the WingMentor methodology. Build actionable strategies for career advancement.',
    icon: 'TrendingUp',
    status: 'available',
    duration: '60 min',
  },
  {
    id: 'module-03',
    title: 'Module 3: Pilot Risk Management & Pilot Pathways',
    description: 'Comprehensive integration of concepts from previous modules. Focus on portfolio development, examination preparation, and mentorship consolidation.',
    icon: 'Award',
    status: 'available',
    duration: '75 min',
  },
];

export const ModulesPage: React.FC<ModulesPageProps> = ({ 
  userProfile, 
  onBack, 
  onLaunchPilotGapModule,
  onLaunchPilotGapModule2,
  onLaunchModule3
}) => {
  const displayName = [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ').trim() || userProfile?.displayName || userProfile?.email || 'Pilot';

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
          ← Back to Program Platform
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
              Modules
            </h1>
            <p style={{ color: '#1d4ed8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Welcome back, {displayName}
            </p>
          </div>

          {/* Description */}
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', textAlign: 'center' }}>
            Access your Foundational Program syllabus modules. Complete Pilot Gap Module and Pilot Gap Module 2 to continue your mentorship journey.
          </p>

          {/* Module Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {syllabusModules.map((module) => (
              <div
                key={module.id}
                style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '320px'
                }}
              >
                {/* Content area that grows to push button down */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>
                    {module.title}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {module.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{module.duration}</span>
                  </div>
                </div>
                
                {/* Button pushed to bottom with marginTop: 'auto' */}
                <button
                  onClick={module.id === 'pilot-gap-01' ? onLaunchPilotGapModule : module.id === 'pilot-gap-02' ? onLaunchPilotGapModule2 : onLaunchModule3}
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
                    marginTop: '1rem'
                  }}
                >
                  Launch Module
                </button>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div 
            style={{ 
              borderTop: '1px solid #e2e8f0', 
              paddingTop: '1.5rem',
              marginTop: '2rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Complete both modules to unlock additional mentorship resources and certification.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;
