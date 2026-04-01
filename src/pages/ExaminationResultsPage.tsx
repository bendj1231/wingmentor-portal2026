import React, { useState, useEffect } from 'react';

interface ExaminationResultsPageProps {
  onBack: () => void;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    uid?: string;
    enrolledPrograms?: string[];
  } | null;
}

interface ExamCategory {
  id: string;
  name: string;
  description: string;
  type: 'foundational' | 'recency';
  exams: Exam[];
  isEnrolled?: boolean;
}

interface Exam {
  id: string;
  name: string;
  description: string;
  date?: string;
  overall?: number;
  status: 'completed' | 'pending' | 'not-started' | 'locked';
  sections: ExamSection[];
  provider?: string;
}

interface ExamSection {
  label: string;
  score?: number;
  status?: 'completed' | 'pending';
}

const ExaminationResultsPage: React.FC<ExaminationResultsPageProps> = ({ onBack, userProfile }) => {
  const fullName = `${userProfile?.firstName || 'Benjamin'} ${userProfile?.lastName || 'Bowler'}`.trim();
  
  // Loading state for examination setup
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simulate examination setup loading
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    const timer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(progressInterval);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);
  
  // Check if user is enrolled in Foundational Program
  const isEnrolledInFoundational = userProfile?.enrolledPrograms?.includes('Foundational') || 
                                   userProfile?.enrolledPrograms?.includes('foundational') || false;

  const [selectedExamCategory, setSelectedExamCategory] = useState<string | null>(null);

  // Foundational Program Examination
  const foundationalExam: Exam = {
    id: 'foundational-exam-01',
    name: 'Initial Industry Familiarization Examination',
    description: 'Comprehensive assessment covering industry indoctrination, pilot gap analysis, and foundational mentorship concepts.',
    date: 'Pending',
    status: isEnrolledInFoundational ? 'pending' : 'locked',
    sections: [
      { label: 'Industry Indoctrination', status: 'pending' },
      { label: 'Pilot Gap Analysis', status: 'pending' },
      { label: 'Mentorship Framework', status: 'pending' },
      { label: 'Professional Development', status: 'pending' }
    ],
    provider: 'WingMentor Academy'
  };

  // CAAP/FAA Recency Exams (Gleims Integrated)
  const recencyExams: Exam[] = [
    {
      id: 'recency-cpl',
      name: 'CPL - Commercial Pilot License Recency',
      description: 'CAAP/FAA Commercial Pilot License recency examination covering advanced flight operations, commercial regulations, and instrument procedures.',
      date: 'Pending',
      status: 'not-started',
      sections: [
        { label: 'Flight Operations', status: 'pending' },
        { label: 'Commercial Regulations', status: 'pending' },
        { label: 'Advanced Navigation', status: 'pending' },
        { label: 'Aircraft Performance', status: 'pending' }
      ],
      provider: 'Gleims'
    },
    {
      id: 'recency-ppl',
      name: 'PPL - Private Pilot License Recency',
      description: 'Private Pilot License recency check covering basic flight maneuvers, VFR operations, and flight planning fundamentals.',
      date: 'Pending',
      status: 'not-started',
      sections: [
        { label: 'Flight Maneuvers', status: 'pending' },
        { label: 'VFR Operations', status: 'pending' },
        { label: 'Flight Planning', status: 'pending' },
        { label: 'Weather Assessment', status: 'pending' }
      ],
      provider: 'Gleims'
    },
    {
      id: 'recency-ir',
      name: 'IR - Instrument Rating Recency',
      description: 'Instrument Rating recency examination covering IFR procedures, instrument approaches, and emergency procedures under instrument flight rules.',
      date: 'Pending',
      status: 'not-started',
      sections: [
        { label: 'IFR Procedures', status: 'pending' },
        { label: 'Instrument Approaches', status: 'pending' },
        { label: 'Emergency Procedures', status: 'pending' },
        { label: 'Cockpit Resource Mgmt', status: 'pending' }
      ],
      provider: 'Gleims',
      icon: '🌐'
    },
    {
      id: 'recency-me',
      name: 'ME - Multi-Engine Rating Recency',
      description: 'Multi-Engine rating recency covering asymmetric flight, engine-out procedures, and multi-engine aircraft systems.',
      date: 'Pending',
      status: 'not-started',
      sections: [
        { label: 'Asymmetric Flight', status: 'pending' },
        { label: 'Engine-Out Procedures', status: 'pending' },
        { label: 'Multi-Engine Systems', status: 'pending' },
        { label: 'Performance Calculations', status: 'pending' }
      ],
      provider: 'Gleims'
    }
  ];

  const examCategories: ExamCategory[] = [
    {
      id: 'foundational',
      name: 'Foundational Program Examination',
      description: 'Initial Industry Familiarization Examination - Core foundational assessment for program participants',
      type: 'foundational',
      isEnrolled: isEnrolledInFoundational,
      exams: [foundationalExam]
    },
    {
      id: 'recency',
      name: 'CAAP/FAA Pilotage Recency Examinations',
      description: 'Gleims-integrated recency examinations for CPL, PPL, IR, and ME certifications',
      type: 'recency',
      exams: recencyExams
    },
    {
      id: 'mentorship',
      name: 'Mentorship Examination',
      description: 'Comprehensive assessment of mentorship competencies, peer guidance skills, and professional development coaching',
      type: 'mentorship',
      exams: [{
        id: 'mentorship-exam-01',
        name: 'Mentorship Competency Assessment',
        description: 'Evaluation of mentorship techniques, peer support capabilities, and career guidance skills.',
        date: 'Pending',
        status: 'not-started',
        sections: [
          { label: 'Peer Mentorship', status: 'pending' },
          { label: 'Career Guidance', status: 'pending' },
          { label: 'Communication Skills', status: 'pending' },
          { label: 'Professional Development', status: 'pending' }
        ],
        provider: 'WingMentor Academy'
      }]
    },
    {
      id: 'risk-management',
      name: 'Pilot Risk Management Examination',
      description: 'Advanced risk assessment and mitigation strategies for professional pilots',
      type: 'risk-management',
      exams: [{
        id: 'risk-mgmt-exam-01',
        name: 'Pilot Risk Management Assessment',
        description: 'Comprehensive examination covering risk identification, decision making under pressure, and safety management systems.',
        date: 'Pending',
        status: 'not-started',
        sections: [
          { label: 'Risk Identification', status: 'pending' },
          { label: 'Decision Making', status: 'pending' },
          { label: 'Safety Management', status: 'pending' },
          { label: 'Crew Resource Management', status: 'pending' }
        ],
        provider: 'WingMentor Academy'
      }]
    }
  ];

  const completedExams = 0;
  const pendingExams = isEnrolledInFoundational ? 1 : 0;
  const totalExams = isEnrolledInFoundational ? 1 + recencyExams.length : recencyExams.length;

  // Loading screen component
  if (isLoading) {
    return (
      <div className="dashboard-container animate-fade-in">
        <main className="dashboard-card" style={{ 
          position: 'relative', 
          maxWidth: '1200px', 
          margin: '0 auto',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Logo Animation */}
          <div style={{
            marginBottom: '2rem',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <img 
              src="/logo.png" 
              alt="WingMentor Logo" 
              style={{ 
                maxWidth: '150px',
                animation: 'float 3s ease-in-out infinite'
              }} 
            />
          </div>

          {/* Loading Title */}
          <h2 style={{
            margin: '0 0 1rem',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#0f172a',
            letterSpacing: '0.05em'
          }}>
            Gathering Examination Setup
          </h2>

          {/* Loading Status */}
          <p style={{
            margin: '0 0 2rem',
            color: '#64748b',
            fontSize: '0.95rem'
          }}>
            Initializing examination modules and loading your assessment profile...
          </p>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            maxWidth: '400px',
            height: '8px',
            background: 'rgba(226, 232, 240, 0.6)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: `${loadingProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0ea5e9, #10b981)',
              borderRadius: '999px',
              transition: 'width 0.2s ease-out'
            }} />
          </div>

          {/* Loading Steps */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '1rem'
          }}>
            {[
              { label: 'Loading Modules', icon: '📚', active: loadingProgress >= 30 },
              { label: 'Fetching Results', icon: '📊', active: loadingProgress >= 60 },
              { label: 'Ready', icon: '✓', active: loadingProgress >= 100 }
            ].map((step, index) => (
              <div 
                key={step.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: step.active ? 1 : 0.4,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: step.active 
                    ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' 
                    : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  color: step.active ? 'white' : '#64748b',
                  boxShadow: step.active ? '0 4px 12px rgba(14, 165, 233, 0.3)' : 'none'
                }}>
                  {step.active ? step.icon : (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #cbd5e1',
                      borderTop: '2px solid #0ea5e9',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: step.active ? '#0f172a' : '#94a3b8',
                  fontWeight: step.active ? 500 : 400
                }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <main className="dashboard-card" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#475569',
            fontWeight: 500
          }}
        >
          ← Back to Recognition
        </button>

        <div className="dashboard-header" style={{ marginBottom: '2rem', paddingTop: '1rem' }}>
          <div className="dashboard-logo" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
          </div>
          <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em' }}>VERIFIED EXAMINATION DIRECTORY</div>
          <h1 className="dashboard-title" style={{ marginBottom: '0.5rem' }}>Examination Results</h1>
          <p style={{ maxWidth: '40rem', margin: '0 auto', color: '#475569' }}>
            Centralized record of your proctored examinations, knowledge recency checks, and pilot assessments. 
            Foundational Program exams and CAAP/FAA recency examinations integrated with Gleims.
          </p>
        </div>

        {/* Candidate Overview Cards */}
        <section className="dashboard-section" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226,232,240,0.8)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            {[{
              label: 'Candidate',
              value: fullName
            }, {
              label: 'Program Status',
              value: isEnrolledInFoundational ? 'Enrolled' : 'Not Enrolled'
            }, {
              label: 'Exams Available',
              value: totalExams.toString()
            }, {
              label: 'Completed',
              value: completedExams.toString()
            }, {
              label: 'Pending',
              value: pendingExams.toString()
            }].map(card => (
              <div key={card.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{card.label}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: card.value === 'Enrolled' ? '#10b981' : card.value === 'Not Enrolled' ? '#f59e0b' : '#0f172a' }}>{card.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Not Enrolled Warning */}
        {!isEnrolledInFoundational && (
          <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 15px 40px rgba(245, 158, 11, 0.15)',
              border: '2px solid #f59e0b',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.5rem', color: '#92400e' }}>
                Foundational Program Access Required
              </h2>
              <p style={{ margin: '0 0 1.5rem', color: '#a16207', fontSize: '1rem', lineHeight: 1.6, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                Please enroll to the Foundational Program to partake in the Initial Industry Familiarization Examination 
                and gain examination results. The Foundational Program is your gateway to comprehensive pilot mentorship 
                and industry recognition.
              </p>
              <button
                onClick={() => {
                  window.location.href = '/foundational-program';
                }}
                style={{
                  padding: '0.85rem 2rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#f59e0b',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}
              >
                Enroll in Foundational Program →
              </button>
            </div>
          </section>
        )}

        {/* Exam Categories Grid */}
        <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Examination Categories</p>
              <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.5rem', color: '#0f172a' }}>Examination Results</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Foundational Program Exam Card */}
            <div
              onClick={() => !isEnrolledInFoundational && window.location.href}
              style={{
                background: isEnrolledInFoundational 
                  ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                  : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '24px',
                padding: '1.75rem',
                boxShadow: isEnrolledInFoundational 
                  ? '0 15px 40px rgba(16, 185, 129, 0.15)' 
                  : '0 15px 40px rgba(15, 23, 42, 0.08)',
                border: isEnrolledInFoundational ? '2px solid #10b981' : '2px dashed #cbd5e1',
                cursor: isEnrolledInFoundational ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {!isEnrolledInFoundational && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#f59e0b',
                  color: 'white',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Enrollment Required
                </div>
              )}
              
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#0f172a' }}>
                Foundational Program Examination
              </h3>
              <p style={{ margin: '0 0 1rem', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Initial Industry Familiarization Examination covering industry indoctrination, 
                pilot gap analysis, and foundational mentorship concepts.
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {foundationalExam.sections.map(section => (
                  <span key={section.label} style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    background: isEnrolledInFoundational ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    color: isEnrolledInFoundational ? '#059669' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {section.label}
                  </span>
                ))}
              </div>

              {isEnrolledInFoundational ? (
                <button style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#10b981',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Start Examination →
                </button>
              ) : (
                <div style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: 'rgba(255,255,255,0.5)',
                  color: '#64748b',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}>
                  Enroll to Access
                </div>
              )}
            </div>

            {/* Recency Exams Card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: '0 15px 40px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(226,232,240,0.8)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Gleims Integrated
                </div>
              </div>
              
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#0f172a' }}>
                Pilotage Recency Examinations
              </h3>
              <p style={{ margin: '0 0 1rem', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                CAAP/FAA standard recency examinations for Commercial Pilot License (CPL), 
                Private Pilot License (PPL), Instrument Rating (IR), and Multi-Engine (ME) certifications.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {recencyExams.map(exam => (
                  <div key={exam.id} style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>{exam.name.split(' - ')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Pending</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Examination List */}
        <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 15px 40px rgba(15,23,42,0.08)',
            border: '1px solid rgba(226,232,240,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Examination Archive</p>
                <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.5rem', color: '#0f172a' }}>All Examinations</h2>
              </div>
            </div>

            {/* Foundational Exam Row */}
            <div style={{
              background: isEnrolledInFoundational ? '#f8fafc' : '#f1f5f9',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1rem',
              border: isEnrolledInFoundational ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
              opacity: isEnrolledInFoundational ? 1 : 0.7
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '2rem' }}>{foundationalExam.icon}</div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{foundationalExam.name}</h4>
                    {!isEnrolledInFoundational && (
                      <span style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        Enrollment Required
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>WingMentor Academy</p>
                </div>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isEnrolledInFoundational ? '#0ea5e9' : '#94a3b8' }}>
                    {isEnrolledInFoundational ? 'Ready' : 'Locked'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Status</div>
                </div>
              </div>
              
              {!isEnrolledInFoundational && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#fef3c7', 
                  borderRadius: '12px',
                  border: '1px solid #fbbf24'
                }}>
                  <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>
                    Please enroll to the Foundational Program to partake in this examination and gain examination results.
                  </p>
                </div>
              )}
            </div>

            {/* Recency Exams Section */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Gleims Integrated
                </div>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>CAAP/FAA Recency Examinations</span>
              </div>

              {recencyExams.map((exam, index) => (
                <div key={exam.id} style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  marginBottom: index < recencyExams.length - 1 ? '1rem' : 0,
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: '#0f172a' }}>{exam.name}</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {exam.sections.map(section => (
                          <span key={section.label} style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            background: 'rgba(100, 116, 139, 0.1)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {section.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '100px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#94a3b8' }}>Pending</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Status</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Badge */}
        <section className="dashboard-section">
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔗</span>
            <span style={{ color: '#0369a1', fontSize: '0.95rem' }}>
              Gleims Integrated — Your CAAP/FAA recency examination results are automatically synced with your pilot profile
            </span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExaminationResultsPage;
