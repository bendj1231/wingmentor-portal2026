import React, { useState } from 'react';
import { Icons } from '../icons';

interface PilotRiskPathwaysModulePageProps {
  onBack: () => void;
  onComplete?: () => void;
}

const PilotRiskPathwaysModulePage: React.FC<PilotRiskPathwaysModulePageProps> = ({ onBack, onComplete }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentTopic, setCurrentTopic] = useState<string | null>('welcome');

  const totalChapters = 3;
  const progress = ((currentChapter + 1) / totalChapters) * 100;

  const navigationFlow = [
    { chapter: 0, topic: 'welcome' },
    { chapter: 0, topic: 'risk-overview' },
    { chapter: 0, topic: 'pathways-intro' },
    { chapter: 1, topic: null },
    { chapter: 1, topic: 'risk-assessment' },
    { chapter: 1, topic: 'mitigation-strategies' },
    { chapter: 1, topic: 'decision-making' },
    { chapter: 2, topic: null },
    { chapter: 2, topic: 'cargo-pathway' },
    { chapter: 2, topic: 'passenger-pathway' },
    { chapter: 2, topic: 'corporate-pathway' },
    { chapter: 2, topic: 'specialized-pathway' },
    { chapter: 2, topic: 'exam-prep' },
  ];

  const getCurrentStepIndex = () => {
    return navigationFlow.findIndex(step => step.chapter === currentChapter && step.topic === currentTopic);
  };

  const goToNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < navigationFlow.length - 1) {
      const nextStep = navigationFlow[currentIndex + 1];
      setCurrentChapter(nextStep.chapter);
      setCurrentTopic(nextStep.topic);
    }
  };

  const goToPrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      const prevStep = navigationFlow[currentIndex - 1];
      setCurrentChapter(prevStep.chapter);
      setCurrentTopic(prevStep.topic);
    }
  };

  const handleNext = () => {
    if (currentChapter < totalChapters - 1) {
      setCurrentChapter(prev => prev + 1);
      setCurrentTopic(null);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
      setCurrentTopic(null);
    }
  };

  const renderChapterContent = () => {
    // Welcome Screen
    if (currentChapter === 0 && currentTopic === 'welcome') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
          {/* Hub-Style Header */}
          <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
            </div>
            <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
              MODULE 03
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              Pilot Risk Management &<br />Pilot Pathways
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
            {/* Introduction / Welcome Section */}
            <section style={{ textAlign: 'center', maxWidth: '42rem', marginTop: '2rem' }}>
              <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                INTRODUCTION
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                Welcome to Your Career Pathway
              </h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2.5rem' }}>
                You've mastered the fundamentals of mentorship and industry familiarization. Now it's time to navigate your career trajectory. This module integrates risk management principles with comprehensive pathway analysis, helping you make informed decisions about your aviation future.
              </p>
            </section>

            {/* Module Overview Card */}
            <section style={{ width: '100%', maxWidth: '48rem' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px',
                padding: '3rem',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}>
                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>
                  Module Overview
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                  What You'll Master
                </h3>
                <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                  <li style={{ marginBottom: '0.75rem' }}>Understanding aviation risk management frameworks</li>
                  <li style={{ marginBottom: '0.75rem' }}>Identifying and assessing career risks</li>
                  <li style={{ marginBottom: '0.75rem' }}>Exploring cargo, passenger, corporate, and specialized pathways</li>
                  <li style={{ marginBottom: '0.75rem' }}>Building your personalized career roadmap</li>
                  <li>Portfolio development and examination preparation</li>
                </ul>
              </div>
            </section>

            {/* Begin Module Button */}
            <button
              onClick={goToNext}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '1rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.3)';
              }}
            >
              Begin Module <Icons.ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      );
    }

    // Risk Overview
    if (currentChapter === 0 && currentTopic === 'risk-overview') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center' }}>
          <section style={{ textAlign: 'center', maxWidth: '42rem' }}>
            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Chapter 0.1
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem' }}>
              Understanding Risk in Aviation
            </h2>
          </section>

          <div style={{ width: '100%', maxWidth: '48rem' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
            }}>
              <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Risk management is the cornerstone of safe and successful aviation operations. As a pilot, understanding how to identify, assess, and mitigate risks is essential not only for flight safety but also for navigating your career trajectory effectively.
              </p>

              <div style={{ 
                background: '#eff6ff', 
                borderRadius: '12px', 
                padding: '1.5rem',
                marginTop: '2rem',
                border: '1px solid #bfdbfe'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e40af', marginBottom: '1rem' }}>
                  Key Risk Management Principles
                </h4>
                <ul style={{ color: '#3b82f6', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                  <li>Identify potential hazards before they become problems</li>
                  <li>Assess the likelihood and severity of risks</li>
                  <li>Develop mitigation strategies for high-priority risks</li>
                  <li>Monitor and review risk controls continuously</li>
                  <li>Learn from incidents and near-misses</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={goToPrevious}
              style={{
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '50px',
                padding: '0.75rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <Icons.ArrowLeft style={{ width: 18, height: 18 }} /> Previous
            </button>
            <button
              onClick={goToNext}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '0.75rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              Next <Icons.ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      );
    }

    // Chapter 1 Hub
    if (currentChapter === 1 && currentTopic === null) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center' }}>
          <section style={{ textAlign: 'center', maxWidth: '42rem' }}>
            <div style={{ 
              background: '#f0f9ff', 
              borderRadius: '12px', 
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Chapter 1
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.1rem', fontWeight: 400, color: '#0c4a6e', margin: 0 }}>
                Risk Assessment & Mitigation
              </h2>
            </div>
            <p style={{ color: '#0369a1', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Deep dive into risk management frameworks and practical applications for pilots.
            </p>
          </section>
        </div>
      );
    }

    // Chapter 2 Hub
    if (currentChapter === 2 && currentTopic === null) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center' }}>
          <section style={{ textAlign: 'center', maxWidth: '42rem' }}>
            <div style={{ 
              background: '#f0fdf4', 
              borderRadius: '12px', 
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ color: '#15803d', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Chapter 2
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.1rem', fontWeight: 400, color: '#14532d', margin: 0 }}>
                Exploring Career Pathways
              </h2>
            </div>
            <p style={{ color: '#15803d', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Detailed analysis of each aviation career pathway and how to choose the right one for you.
            </p>
          </section>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', position: 'relative' }}>
      {/* Minimal Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Reading</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Module 03: Pilot Risk Management & Pilot Pathways</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '2px' }}>
              {currentChapter === 0 ? 'Overview' : `Chapter ${String(currentChapter).padStart(2, '0')}`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '200px', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.3s ease-out' }}></div>
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{Math.round(progress)}% Complete</span>
        </div>
      </header>

      {/* Main Layout wrapper for sidebar and content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Module Viewer Sidebar */}
        <aside style={{ width: '320px', flexShrink: 0, backgroundColor: 'white', borderRight: '1px solid #e2e8f0', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '104px', height: 'calc(100vh - 104px)', overflowY: 'auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0',
              marginBottom: '0',
              border: 'none',
              background: 'transparent',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s',
              width: 'fit-content'
            }}
            onMouseOver={e => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
            Exit Module
          </button>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Module Viewer</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {([
              { title: 'Welcome Aboard', id: 0 },
              { title: 'Risk Overview', id: 0 },
              { title: 'Pathways Introduction', id: 0 },
              { title: 'Risk Assessment', id: 1 },
              { title: 'Mitigation Strategies', id: 1 },
              { title: 'Career Pathways', id: 2 },
              { title: 'Cargo Operations', id: 2 },
              { title: 'Passenger Airlines', id: 2 },
              { title: 'Corporate Aviation', id: 2 },
            ] as Array<{ title: string; id: number }>)
              .map((item, index) => {
                const isHighlighted = currentChapter === item.id;

                return (
                  <li key={index}>
                    <button
                      onClick={() => { 
                        setCurrentChapter(item.id);
                        setCurrentTopic(null);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.65rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: isHighlighted ? 'rgba(37,99,235,0.08)' : 'transparent',
                        color: isHighlighted ? '#0f172a' : '#475569',
                        fontWeight: isHighlighted ? 600 : 500,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderLeft: isHighlighted ? '3px solid #2563eb' : '3px solid transparent',
                        fontSize: '0.9rem'
                      }}
                      onMouseOver={(e) => { if (!isHighlighted) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseOut={(e) => { if (!isHighlighted) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {item.title}
                    </button>
                  </li>
                );
              })}
          </ul>
        </aside>

        <main style={{ flex: 1, padding: '4rem 2rem', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            {renderChapterContent()}

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={handlePrev}
                disabled={currentChapter === 0}
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: currentChapter === 0 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.05)',
                  color: currentChapter === 0 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.35)',
                  border: `1px solid ${currentChapter === 0 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.06)'}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentChapter === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(20px) saturate(100%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(100%)',
                  opacity: currentChapter === 0 ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  if (currentChapter !== 0) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.color = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.12)';
                  }
                }}
                onMouseLeave={e => {
                  if (currentChapter !== 0) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.color = 'rgba(0, 0, 0, 0.35)';
                    e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.06)';
                  }
                }}
              >
                <Icons.ArrowLeft style={{ width: 24, height: 24 }} />
              </button>

              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                Page {currentChapter + 1} of {totalChapters}
              </div>

              <button
                onClick={handleNext}
                disabled={currentChapter === totalChapters - 1}
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: currentChapter === totalChapters - 1 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.05)',
                  color: currentChapter === totalChapters - 1 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.35)',
                  border: `1px solid ${currentChapter === totalChapters - 1 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.06)'}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentChapter === totalChapters - 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(20px) saturate(100%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(100%)',
                  opacity: currentChapter === totalChapters - 1 ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  if (currentChapter !== totalChapters - 1) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.color = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.12)';
                  }
                }}
                onMouseLeave={e => {
                  if (currentChapter !== totalChapters - 1) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.color = 'rgba(0, 0, 0, 0.35)';
                    e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.06)';
                  }
                }}
              >
                <Icons.ArrowRight style={{ width: 24, height: 24 }} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PilotRiskPathwaysModulePage;
