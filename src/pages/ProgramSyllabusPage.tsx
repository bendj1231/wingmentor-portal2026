import React from 'react';
import { Icons } from '../icons';
import type { UserProfile } from '../types/user';

interface ProgramSyllabusPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
}

const syllabusStages = [
  {
    stage: 1,
    title: 'Examination & Technical Rigor',
    description: 'Upon completion of Chapter 1, candidates undergo a formal transition assessment. This evaluates industry comprehension and technical retention through our integrated software, utilizing FAA and CAAP standards alongside proprietary internal metrics.',
    objectives: [
      'Verify cross-regulatory technical knowledge and industry comprehension.',
      'Evaluate baseline retention via integrated FAA/CAAP standards.',
      "Establish the candidate's first Verified Skills Record."
    ],
    isFinal: false
  },
  {
    stage: 2,
    title: 'Global Industry Registry',
    description: 'All assessment outcomes are archived within the Global Industry Registry. This centralized, immutable record provides total transparency and high-level credibility for our airline recruitment partners.',
    objectives: [
      'Initialize a centralized, verifiable professional profile.',
      'Enable immediate data transparency for airline recruitment partners.',
      'Archive baseline recognition metrics for longitudinal tracking.'
    ],
    isFinal: false
  },
  {
    stage: 3,
    title: 'Mentorship Psychology & Human Factors',
    description: 'Following technical validation, you advance to the Mentorship Preparation Modules. This phase focuses on the critical differentiation between instructing and mentoring.',
    objectives: [
      'Deconstruct the operational differences between Instruction and Mentorship.',
      'Develop psychological awareness and objective issue-resolution techniques.',
      'Master peer-observation metrics and behavioral assessment.'
    ],
    isFinal: false
  },
  {
    stage: 4,
    title: 'Pre-Mentorship Validation & Observation',
    description: 'Before beginning the 20-hour supervised phase, candidates must pass a validation interview based on the Mentorship Psychology modules.',
    objectives: [
      'Validate comprehension of human factors and mentorship theory.',
      'Assess practical readiness via specialized one-on-one professional interviews.',
      'Complete 10 hours of active peer-mentorship shadowing and documentation.'
    ],
    isFinal: false
  },
  {
    stage: 5,
    title: 'Supervised Mentorship (20-Hour Milestone)',
    description: 'Candidates execute 20 hours of supervised mentorship under the guidance of a Senior WingMentor. Every session is logged with surgical precision.',
    objectives: [
      'Execute 20 hours of strategically tracked, supervised peer mentorship.',
      'Maintain high-fidelity, objective logs and Pilot ID verifications.',
      'Issue accurate problem-solving "prescriptions" and developmental plans.'
    ],
    isFinal: false
  },
  {
    stage: 6,
    title: 'Accreditation & Professional Endorsement',
    description: 'Upon meeting all operational criteria, your experience is accredited against standards recognized by partners such as Airbus and Etihad Airways.',
    objectives: [
      'Finalize the audit of mentorship impact, logs, and prescriptions.',
      'Award credentials aligned with Airbus and Etihad Airways industry standards.',
      'Authorize the candidate for advanced placement within the ecosystem.'
    ],
    isFinal: false
  },
  {
    stage: 7,
    title: 'The Foundation Capstone (50-Hour Milestone) & AIRBUS Interview',
    description: 'The final integration phase involves extending your professional logging to the 50-hour milestone, demonstrating sustained leadership and consistency.',
    objectives: [
      'Document 50 verifiable hours of active, high-impact peer mentorship.',
      'Demonstrate sustained situational leadership and problem-solving.',
      'Pass the AIRBUS Recognition Interview to secure a top-tier industry endorsement.'
    ],
    isFinal: true
  }
];

export const ProgramSyllabusPage: React.FC<ProgramSyllabusPageProps> = ({ 
  userProfile, 
  onBack 
}) => {
  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px clamp(1.25rem, 4vw, 3rem) 2.5rem' }}>
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
            ← Back to Program Progress
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
                Program Syllabus
              </h1>
              <p style={{ color: '#1d4ed8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
                Welcome back, {displayName}
              </p>
            </div>

            {/* Description */}
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem', textAlign: 'center', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              A comprehensive roadmap of your journey from foundational knowledge to verified industry recognition.
            </p>

            {/* Program Syllabus Stages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {syllabusStages.map((stageData, idx) => (
                <div key={idx} style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: stageData.isFinal ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  boxShadow: stageData.isFinal ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: stageData.isFinal ? '#1e40af' : '#2563eb',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    {stageData.stage}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Stage {stageData.stage}
                    </div>
                    <strong style={{ color: '#0f172a', fontSize: '1rem', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {stageData.title}
                    </strong>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                      {stageData.description}
                    </p>
                    <div style={{ paddingLeft: '0.75rem', borderLeft: '2px solid #bfdbfe' }}>
                      <strong style={{ fontSize: '0.7rem', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Objectives</strong>
                      <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1rem', fontSize: '0.85rem', color: '#64748b', listStyleType: 'disc', lineHeight: 1.6 }}>
                        {stageData.objectives.map((obj, oidx) => (
                          <li key={oidx}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Complete all stages to earn your Foundation Program certification.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramSyllabusPage;
