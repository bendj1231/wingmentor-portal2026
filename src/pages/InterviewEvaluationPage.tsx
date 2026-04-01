import React, { useState } from 'react';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';

interface InterviewEvaluationPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
  onComplete?: (score: number) => void;
}

const interviewQuestions = [
  {
    id: 1,
    category: 'Technical Knowledge',
    question: 'Describe the key principles of Evidence-Based Training (EBT) and how they differ from traditional training methods.',
    type: 'text',
  },
  {
    id: 2,
    category: 'CRM Skills',
    question: 'You notice a conflict between two crew members during pre-flight. How would you handle this situation?',
    type: 'multiple',
    options: [
      'Ignore it and focus on your duties',
      'Address it immediately in front of everyone',
      'Speak to each member privately and mediate',
      'Report it to management immediately',
    ],
    correctAnswer: 2,
  },
  {
    id: 3,
    category: 'Operational Decision-Making',
    question: 'During a flight, you encounter unexpected severe weather. Walk through your decision-making process.',
    type: 'text',
  },
  {
    id: 4,
    category: 'Competency Assessment',
    question: 'Which competencies are most critical for effective CRM?',
    type: 'multiple',
    options: [
      'Communication, Leadership, Situational Awareness',
      'Technical knowledge only',
      'Physical fitness and stamina',
      'Navigation skills exclusively',
    ],
    correctAnswer: 0,
  },
];

export const InterviewEvaluationPage: React.FC<InterviewEvaluationPageProps> = ({ 
  userProfile, 
  onBack,
  onComplete
}) => {
  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    interviewQuestions.forEach((q, idx) => {
      if (q.type === 'multiple' && answers[idx] === q.correctAnswer) {
        score += 25;
      } else if (q.type === 'text' && answers[idx]?.length > 20) {
        score += 25;
      }
    });
    return score;
  };

  const score = calculateScore();
  const passed = score >= 75;

  if (showResults) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ padding: '2rem 3rem', maxWidth: '800px', margin: '0 auto' }}>
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

          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: passed ? '#dcfce7' : '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              {passed ? (
                <Icons.CheckCircle style={{ width: 40, height: 40, color: '#22c55e' }} />
              ) : (
                <Icons.AlertCircle style={{ width: 40, height: 40, color: '#ef4444' }} />
              )}
            </div>

            <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              {passed ? 'Congratulations!' : 'Evaluation Complete'}
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              You scored {score}% on the AIRBUS Aligned EBT CBTA Interview Evaluation
            </p>

            <div
              style={{
                background: passed ? '#dcfce7' : '#fee2e2',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ fontSize: '3rem', fontWeight: 700, color: passed ? '#22c55e' : '#ef4444' }}>
                {score}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                {passed ? 'You passed! (75% required)' : 'You did not pass (75% required)'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={onBack}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Return to Portal
              </button>
              {!passed && (
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                  }}
                  style={{
                    background: '#2563eb',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Retry Evaluation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = interviewQuestions[currentQuestion];
  const hasAnswer = answers[currentQuestion] !== undefined && answers[currentQuestion] !== '';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ padding: '2rem 3rem', maxWidth: '800px', margin: '0 auto' }}>
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

        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>AIRBUS EBT CBTA Interview</h1>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Question {currentQuestion + 1} of {interviewQuestions.length}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${((currentQuestion + 1) / interviewQuestions.length) * 100}%`,
                  height: '100%',
                  background: '#2563eb',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'inline-block', 
              background: '#eff6ff', 
              color: '#2563eb', 
              padding: '0.35rem 0.75rem', 
              borderRadius: '999px', 
              fontSize: '0.75rem', 
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              {currentQ.category}
            </div>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {currentQ.question}
            </h2>

            {currentQ.type === 'multiple' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentQ.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      border: answers[currentQuestion] === index ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: answers[currentQuestion] === index ? '#eff6ff' : '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontWeight: 600, marginRight: '0.75rem', color: '#2563eb' }}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Enter your response here..."
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.95rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  resize: 'vertical',
                }}
              />
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: currentQuestion === 0 ? '#94a3b8' : '#64748b',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {interviewQuestions.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: answers[index] !== undefined && answers[index] !== '' ? '#22c55e' : index === currentQuestion ? '#2563eb' : '#e2e8f0',
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: hasAnswer ? '#2563eb' : '#94a3b8',
                color: '#fff',
                cursor: hasAnswer ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              {currentQuestion === interviewQuestions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewEvaluationPage;
