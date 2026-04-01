import React from 'react';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';

interface LicenseSelectionPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
  onSelectLicense?: (licenseType: string) => void;
}

const licenseTypes = [
  {
    id: 'CPL',
    name: 'Commercial Pilot License (CPL)',
    description: 'For pilots pursuing commercial aviation careers. Covers advanced aerodynamics, flight planning, and commercial regulations.',
    icon: 'TrendingUp',
    color: '#2563eb',
    questions: 60,
    duration: '90 min',
  },
  {
    id: 'IR',
    name: 'Instrument Rating (IR)',
    description: 'Focuses on instrument flight rules, navigation systems, and procedures for flying in IFR conditions.',
    icon: 'Navigation',
    color: '#7c3aed',
    questions: 50,
    duration: '75 min',
  },
  {
    id: 'ME',
    name: 'Multi-Engine Rating (ME)',
    description: 'Covers multi-engine aircraft systems, engine-out procedures, and performance calculations.',
    icon: 'Layers',
    color: '#0891b2',
    questions: 40,
    duration: '60 min',
  },
  {
    id: 'PPL',
    name: 'Private Pilot License (PPL)',
    description: 'Fundamental aviation knowledge for private pilots including basic aerodynamics and VFR regulations.',
    icon: 'Book',
    color: '#16a34a',
    questions: 40,
    duration: '60 min',
  },
];

export const LicenseSelectionPage: React.FC<LicenseSelectionPageProps> = ({ 
  userProfile, 
  onBack,
  onSelectLicense
}) => {
  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
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
          ← Back to Examination Portal
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
              FAA / CAAP GLEIMS
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
              Select Your License Rating
            </h1>
            <p style={{ color: '#1d4ed8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Welcome back, {displayName}
            </p>
          </div>

          {/* Description */}
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', textAlign: 'center', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Choose your current license rating to begin the Gleims examination. 
            The exam will test your technical knowledge specific to your certification level.
          </p>

          {/* License Type Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              maxWidth: '900px',
              margin: '0 auto 2rem',
            }}
          >
            {licenseTypes.map((license) => (
              <button
                key={license.id}
                onClick={() => onSelectLicense?.(license.id)}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '2px solid #e2e8f0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: `${license.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {(() => {
                      const IconComponent = Icons[license.icon as keyof typeof Icons];
                      return IconComponent ? <IconComponent style={{ width: 24, height: 24, color: license.color }} /> : null;
                    })()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>
                      {license.name}
                    </h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {license.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <span>{license.questions} questions</span>
                      <span>•</span>
                      <span>{license.duration}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Note */}
          <div 
            style={{ 
              borderTop: '1px solid #e2e8f0', 
              paddingTop: '1.5rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              All Gleims examinations are standardized tests based on FAA and CAAP regulations. 
              Select the rating that matches your current certification.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseSelectionPage;
