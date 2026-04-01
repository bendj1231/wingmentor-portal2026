import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../icons';

interface PilotRiskPathwaysModulePageProps {
  onBack: () => void;
  onComplete?: () => void;
}

const PilotRiskPathwaysModulePage: React.FC<PilotRiskPathwaysModulePageProps> = ({ onBack, onComplete }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentTopic, setCurrentTopic] = useState<string | null>('welcome');

  const navigationFlow = [
    { chapter: 0, topic: 'welcome' },
    { chapter: 0, topic: 'risk-overview' },
    { chapter: 0, topic: 'pathways-intro' },
    { chapter: 0, topic: null },
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

  useEffect(() => {
    const isLastStep = getCurrentStepIndex() === navigationFlow.length - 1;
    if (isLastStep && onComplete) {
      onComplete();
    }
  }, [currentChapter, currentTopic, onComplete]);

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

  const renderContent = () => {
    // Chapter 0: Introduction
    if (currentChapter === 0 && currentTopic === 'welcome') {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: '#eff6ff',
              borderRadius: '50%',
              marginBottom: '1.5rem'
            }}>
              <Icons.Target style={{ width: 40, height: 40, color: '#2563eb' }} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
              Module 3: Pilot Risk Management & Pilot Pathways
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Master risk management principles and discover your optimal career pathway in aviation.
            </p>
          </div>
          
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '12px', 
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
              Module Overview
            </h3>
            <ul style={{ color: '#64748b', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
              <li>Understanding aviation risk management frameworks</li>
              <li>Identifying and assessing career risks</li>
              <li>Exploring cargo, passenger, corporate, and specialized pathways</li>
              <li>Building your personalized career roadmap</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={goToNext}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Begin Module
            </button>
          </div>
        </div>
      );
    }

    if (currentChapter === 0 && currentTopic === 'risk-overview') {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem' }}>
            Understanding Risk in Aviation
          </h2>
          
          <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Risk management is the cornerstone of safe and successful aviation operations. As a pilot, 
            understanding how to identify, assess, and mitigate risks is essential not only for flight safety 
            but also for navigating your career trajectory effectively.
          </p>

          <div style={{ 
            background: '#eff6ff', 
            borderRadius: '12px', 
            padding: '1.5rem',
            marginBottom: '2rem',
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

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={goToPrevious}
              style={{
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Previous
            </button>
            <button
              onClick={goToNext}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      );
    }

    if (currentChapter === 0 && currentTopic === 'pathways-intro') {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem' }}>
            Aviation Career Pathways
          </h2>
          
          <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '2rem' }}>
            The aviation industry offers diverse career pathways, each with unique opportunities, 
            challenges, and rewards. Understanding these pathways helps you make informed decisions 
            about your professional journey.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { name: 'Cargo Operations', icon: 'Package', desc: 'Freight and logistics transport' },
              { name: 'Passenger Airlines', icon: 'Users', desc: 'Commercial passenger transport' },
              { name: 'Corporate Aviation', icon: 'Briefcase', desc: 'Private and business aviation' },
              { name: 'Specialized Operations', icon: 'Wrench', desc: 'Agricultural, rescue, and more' },
            ].map((pathway) => (
              <div key={pathway.name} style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '1.25rem',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {pathway.name}
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                  {pathway.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={goToPrevious}
              style={{
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Previous
            </button>
            <button
              onClick={goToNext}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      );
    }

    // Chapter 1: Risk Management Deep Dive
    if (currentChapter === 1 && currentTopic === null) {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ 
            background: '#f0f9ff', 
            borderRadius: '12px', 
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid #bae6fd'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0c4a6e', marginBottom: '1rem' }}>
              Chapter 1: Risk Assessment & Mitigation
            </h2>
            <p style={{ color: '#0369a1', margin: 0 }}>
              Deep dive into risk management frameworks and practical applications for pilots.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={goToPrevious}
              style={{
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Previous
            </button>
            <button
              onClick={goToNext}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      );
    }

    // Chapter 2: Pathways
    if (currentChapter === 2 && currentTopic === null) {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ 
            background: '#f0fdf4', 
            borderRadius: '12px', 
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid #bbf7d0'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#14532d', marginBottom: '1rem' }}>
              Chapter 2: Exploring Career Pathways
            </h2>
            <p style={{ color: '#15803d', margin: 0 }}>
              Detailed analysis of each aviation career pathway and how to choose the right one for you.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={goToPrevious}
              style={{
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Previous
            </button>
            <button
              onClick={goToNext}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      );
    }

    // Completion screen
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100px',
          height: '100px',
          background: '#dcfce7',
          borderRadius: '50%',
          marginBottom: '2rem'
        }}>
          <Icons.CheckCircle style={{ width: 50, height: 50, color: '#22c55e' }} />
        </div>
        
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
          Module Complete!
        </h2>
        
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Congratulations! You have completed Module 3: Pilot Risk Management & Pilot Pathways.
          You now have the knowledge to assess risks and choose your optimal career pathway.
        </p>

        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
            Key Takeaways
          </h4>
          <ul style={{ color: '#64748b', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
            <li>Risk management is essential for both safety and career success</li>
            <li>Multiple career pathways exist with unique opportunities</li>
            <li>Personal assessment helps identify the best pathway fit</li>
            <li>Continuous learning and adaptation are key to long-term success</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.75rem 2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Return to Modules
          </button>
          {onComplete && (
            <button
              onClick={onComplete}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 2rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Complete Module
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', paddingTop: '120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: '1.5rem',
            background: 'transparent',
            border: 'none',
            color: '#1e40af',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Icons.ArrowLeft style={{ width: 18, height: 18 }} />
          Back to Modules
        </button>

        <div style={{ 
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          minHeight: '600px',
        }}>
          {/* Progress Bar */}
          <div style={{ 
            padding: '1rem 2rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
              <div style={{ 
                width: `${((getCurrentStepIndex() + 1) / navigationFlow.length) * 100}%`, 
                height: '100%', 
                background: '#2563eb', 
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {getCurrentStepIndex() + 1} / {navigationFlow.length}
            </span>
          </div>

          {/* Content Area */}
          <div style={{ padding: '2rem' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotRiskPathwaysModulePage;
