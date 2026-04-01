import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';
import { supabase } from "../lib/supabase-auth";

interface ProgramProgressPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
  completedModules?: string[];
  onViewExaminationPortal?: () => void;
  onViewSyllabus?: () => void;
}

interface ProgressData {
  overall_progress: number;
  breakdown: {
    modules: { weight: number; score: number; completed: number; total: number };
    exams: { weight: number; score: number; passed: number; total: number };
    milestones: { weight: number; score: number };
  };
  stats: {
    exams_completed: number;
    average_score: number;
    certifications: number;
  };
}

const progressModules = [
  {
    id: 'module-01',
    title: 'Module 1: Industry Familiarization & Indoctrination',
    description: 'Introduction to WingMentor and the aviation mentorship framework.',
    status: 'completed',
    progress: 100,
  },
  {
    id: 'module-02',
    title: 'Module 2: Psychology of Mentorship & Practical Application',
    description: 'Advanced mentorship techniques and portfolio building.',
    status: 'in-progress',
    progress: 65,
  },
  {
    id: 'module-03',
    title: 'Module 3: Pilot Risk Management & Pilot Pathways',
    description: 'Core concepts in pilot development and skill assessment.',
    status: 'locked',
    progress: 0,
  },
];

const milestones = [
  { id: 'm1', title: 'Enrollment Complete', date: '2024-01-15', completed: true },
  { id: 'm2', title: 'Module 01 Passed', date: '2024-01-22', completed: true },
  { id: 'm3', title: 'First Mentorship Session', date: '2024-02-01', completed: true },
  { id: 'm4', title: 'Module 02 Certification', date: 'In Progress', completed: false },
];

export const ProgramProgressPage: React.FC<ProgramProgressPageProps> = ({
  userProfile,
  onBack,
  completedModules = [],
  onViewExaminationPortal,
  onViewSyllabus
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const displayName = 
    [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ').trim() ||
    userProfile?.displayName?.trim() ||
    userProfile?.email ||
    'Pilot';
  
  // Calculate overall progress from real data
  const overallProgress = progressData?.overall_progress ?? 
    Math.round(progressModules.reduce((acc, m) => acc + m.progress, 0) / progressModules.length);
  
  // Get stats from real data or fallback
  const examStats = progressData?.stats ?? { exams_completed: 2, average_score: 87, certifications: 1 };

  // Fetch progress data from edge function
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userProfile?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('calculate-program-progress', {
          body: { user_id: userProfile.id }
        });

        if (error) throw error;
        
        if (data) {
          setProgressData(data);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        // Fallback to calculated data
        const calculated = Math.round(progressModules.reduce((acc, m) => acc + m.progress, 0) / progressModules.length);
        setProgressData({
          overall_progress: calculated,
          breakdown: {
            modules: { weight: 0.4, score: Math.round(calculated * 0.4), completed: 1, total: 3 },
            exams: { weight: 0.35, score: Math.round(87 * 0.35), passed: 1, total: 2 },
            milestones: { weight: 0.25, score: Math.round(100 * 0.25) }
          },
          stats: { exams_completed: 1, average_score: 87, certifications: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userProfile?.id]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % progressModules.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + progressModules.length) % progressModules.length);
  };

  const currentModule = progressModules[currentSlide];

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
              Program Progress & Examination Board
            </h1>
            <p style={{ color: '#1d4ed8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Welcome back, {displayName}
            </p>
          </div>

          {/* Program Progress Timeline */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: '0 0 1.5rem 0', textAlign: 'center' }}>
              Program Progress
            </h2>
            
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { stage: 1, title: 'Module 1 Completion', description: 'Complete Industry Familiarization & Indoctrination', status: 'completed' },
                { stage: 2, title: 'Initial Examination', description: 'Pass the foundational knowledge assessment', status: 'completed' },
                { stage: 3, title: 'Mentor Modules', description: 'Complete Psychology of Mentorship & Practical Application', status: 'locked' },
                { stage: 4, title: 'Mentorship Knowledge Examination', description: 'Pass mentorship validation assessment', status: 'locked' },
                { stage: 5, title: 'Pilot Risk Management & Pathways', description: 'Complete pilot risk management and pathway selection module', status: 'locked' },
                { stage: 6, title: 'Risk Management Examination', description: 'Pass the risk management and pathways assessment', status: 'locked' },
                { stage: 7, title: '50hrs Mentorship', description: 'Complete supervised peer mentorship hours', status: 'locked' },
                { stage: 8, title: 'AIRBUS EBT CBTA Interview', description: 'Final industry-aligned assessment', status: 'locked' },
                { stage: 9, title: 'Pilot Recognition & Pathways Access', description: 'Access pilot recognition directory and pathway placement opportunities', status: 'locked' },
              ].map((item, index, arr) => {
                const isCompleted = item.status === 'completed';
                const isInProgress = item.status === 'in-progress';
                const isLocked = item.status === 'locked';
                const isLast = index === arr.length - 1;
                
                return (
                  <div key={item.stage} style={{ display: 'flex', gap: '1rem' }}>
                    {/* Timeline line and dot */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isCompleted ? '#22c55e' : isInProgress ? '#2563eb' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isCompleted || isInProgress ? '#fff' : '#94a3b8',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {isCompleted ? '✓' : item.stage}
                      </div>
                      {!isLast && (
                        <div
                          style={{
                            width: '2px',
                            flex: 1,
                            minHeight: '40px',
                            background: isCompleted ? '#22c55e' : '#e2e8f0',
                            margin: '4px 0',
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: '1.25rem' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          color: isLocked ? '#94a3b8' : '#0f172a',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: isLocked ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                        {item.description}
                      </div>
                      {isInProgress && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              background: '#eff6ff',
                              color: '#2563eb',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            In Progress
                          </span>
                        </div>
                      )}
                      {isCompleted && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              background: '#dcfce7',
                              color: '#22c55e',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Completed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Examination Board */}
          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            }}
          >
            {/* Header with Logo */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img 
                src="/logo.png" 
                alt="WingMentor Logo" 
                style={{ maxWidth: '120px', height: 'auto', objectFit: 'contain', marginBottom: '0.75rem' }} 
              />
              <div style={{ color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                CERTIFICATION EXAMINATIONS
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Examination Board
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                Complete your certification assessments to demonstrate competency and advance through the Foundational Program.
              </p>
            </div>

            {/* Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Exams Completed</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>{examStats.exams_completed}</div>
              </div>
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Average Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>{examStats.average_score}%</div>
              </div>
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Certifications</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e40af' }}>{examStats.certifications}</div>
              </div>
            </div>

            {/* Improved Button */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem' }}>
                Click here to access the examination portal
              </p>
              <button
                onClick={onViewExaminationPortal}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.875rem 2rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                Access Examination Portal
              </button>
            </div>
          </div>

          {/* W1000 Practice Notice */}
          <div
            style={{
              background: '#eff6ff',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>!</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#1e40af', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Practice Your Examinations
              </div>
              <div style={{ color: '#3b82f6', fontSize: '0.85rem' }}>
                You can practice your Foundation Program examinations under the W1000 application
              </div>
            </div>
            <button
              onClick={() => window.open('https://w1000.vercel.app', '_blank')}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              Open W1000
            </button>
          </div>

          {/* Module Progress - Simplified Rectangular Design */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
              Module Progress
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {progressModules.map((module, index) => (
                <div
                  key={module.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {/* Module Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      {module.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {module.status === 'completed' ? 'Completed' : module.status === 'in-progress' ? 'In Progress' : 'Locked'}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: '#e2e8f0',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${module.progress}%`,
                          height: '100%',
                          background: module.status === 'completed' ? '#22c55e' : '#2563eb',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', textAlign: 'right' }}>
                      {module.progress}%
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    disabled={module.status === 'locked'}
                    style={{
                      padding: '0.5rem 1rem',
                      background: module.status === 'completed' ? '#22c55e' : module.status === 'in-progress' ? '#2563eb' : '#94a3b8',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: module.status === 'locked' ? 'not-allowed' : 'pointer',
                      opacity: module.status === 'locked' ? 0.6 : 1,
                      flexShrink: 0,
                    }}
                  >
                    {module.status === 'completed' ? 'Review' : module.status === 'in-progress' ? 'Continue' : 'Locked'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Program Syllabus Link */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <button
              onClick={onViewSyllabus}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2.5rem',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              }}
            >
              View Program Syllabus
            </button>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              7 stages of the Foundation Program
            </div>
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

export default ProgramProgressPage;
