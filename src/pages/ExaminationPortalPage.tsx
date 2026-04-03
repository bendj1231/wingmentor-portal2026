import React from 'react';
import type { UserProfile } from '../types/user';
import { Icons } from '../icons';

interface ExaminationPortalPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
  onStartFoundationalExam?: () => void;
  onStartFAAExam?: () => void;
  onStartInterviewEvaluation?: () => void;
  module01Completed?: boolean;
  programCompleted?: boolean;
}

export const ExaminationPortalPage: React.FC<ExaminationPortalPageProps> = ({ 
  userProfile, 
  onBack,
  onStartFoundationalExam,
  onStartFAAExam,
  onStartInterviewEvaluation,
  module01Completed = true,
  programCompleted = false
}) => {
  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';

  const category1Exams = [
    {
      id: 'foundational-knowledge',
      title: 'Foundational Knowledge Examination',
      description: 'Demonstrate your understanding of core WingMentor concepts and aviation mentorship fundamentals.',
      shortcut: { label: 'Module 1: Industry Familiarization', link: '/modules/industry-familiarization' },
      icon: 'Book',
      status: module01Completed ? 'available' : 'locked',
      duration: '45 min',
      questions: 25,
      passingScore: 80,
    },
    {
      id: 'pilot-licensure',
      title: 'Pilot Licensure Examination',
      description: 'Select your current license rating and take the corresponding examination to test your technical knowledge.',
      shortcut: { label: 'W1000 Application, Examination Practice Terminal', link: '/w1000-practice' },
      icon: 'Award',
      status: 'available',
      duration: '90 min',
      questions: 60,
      passingScore: 70,
    },
  ];

  const category2Exams = [
    {
      id: 'pilot-risk-pathways',
      title: 'Pilot Risk Management & Pathways Examination',
      description: 'Assessment of pilot risk management principles and career pathway selection. Evaluate your understanding of aviation risk assessment and pathway planning.',
      icon: 'Target',
      status: 'available',
      duration: '60 min',
      questions: 35,
      passingScore: 75,
    },
    {
      id: 'ongoing-learning',
      title: 'Ongoing Learning & Development Assessment',
      description: 'Continuous assessment designed for mentors who are also learners. Tests your ability to integrate mentorship with ongoing professional development.',
      icon: 'BookOpen',
      status: 'locked',
      duration: '45 min',
      questions: 25,
      passingScore: 70,
      requirement: 'Complete Category 1 exams',
    },
  ];

  const category3Exams = [
    {
      id: 'mentorship-knowledge',
      title: 'Mentorship Knowledge Examination',
      description: 'Test your understanding of mentorship principles, psychology, and best practices.',
      icon: 'BookOpen',
      status: 'locked',
      duration: '60 min',
      questions: 40,
      passingScore: 75,
      requirement: 'Complete Category 1 & 2 exams and Mentor Modules',
    },
    {
      id: 'interview-assessment',
      title: 'Interview Assessment',
      description: 'Comprehensive interview evaluating your readiness for mentorship responsibilities.',
      icon: 'MessageSquare',
      status: 'locked',
      duration: '45 min',
      questions: 30,
      passingScore: 80,
      requirement: 'Complete Category 1 & 2 exams and Mentor Modules',
    },
    {
      id: 'mentorship-practical',
      title: 'Mentorship Practical Examination',
      description: 'Practical scenario-based assessment of your mentorship capabilities.',
      icon: 'ClipboardCheck',
      status: 'locked',
      duration: '120 min',
      questions: 5,
      passingScore: 85,
      requirement: 'Complete Category 1 & 2 exams and Mentor Modules',
    },
  ];

  const category4Exams = [
    {
      id: 'airbus-ebt-interview',
      title: 'Airbus EBT CBTA Interview',
      description: 'Advanced interview assessment aligned with AIRBUS Evidence-Based Training principles.',
      icon: 'Users',
      status: 'locked',
      duration: '60 min',
      questions: 40,
      passingScore: 75,
      requirement: 'Complete Category 1, 2, and 3 examinations',
    },
    {
      id: 'ebt-cbta-practical',
      title: 'EBT CBTA Competency Practical Scenario Examination',
      description: 'Practical examination based on mentorship acquisition and constructivism principles.',
      icon: 'Target',
      status: 'locked',
      duration: '180 min',
      questions: 3,
      passingScore: 80,
      requirement: 'Complete Category 1, 2, and 3 examinations',
    },
  ];

  // Exam Card Component
  const ExamCard = ({ exam }: { exam: any }) => (
    <div
      style={{
        background: exam.status === 'locked' ? '#f8fafc' : '#fff',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        opacity: exam.status === 'locked' ? 0.7 : 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: exam.status === 'locked' ? '#f1f5f9' : '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {(() => {
          const IconComponent = Icons[exam.icon as keyof typeof Icons];
          return IconComponent ? <IconComponent style={{ width: 20, height: 20, color: exam.status === 'locked' ? '#94a3b8' : '#2563eb' }} /> : null;
        })()}
      </div>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>
        {exam.title}
      </h3>
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.5rem', flex: 1 }}>
        {exam.description}
      </p>
      
      {/* Shortcut Link */}
      {exam.shortcut && (
        <a 
          href={exam.shortcut.link}
          style={{ 
            color: '#2563eb', 
            fontSize: '0.8rem', 
            fontWeight: 500,
            textDecoration: 'none',
            marginBottom: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          {exam.shortcut.label}
          <span style={{ fontSize: '0.7rem' }}>→</span>
        </a>
      )}
      
      {/* Exam Details */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Icons.Clock style={{ width: 14, height: 14 }} />
          <span>{exam.duration}</span>
        </div>
        <div>•</div>
        <div>{exam.questions} questions</div>
        <div>•</div>
        <div>{exam.passingScore}% to pass</div>
      </div>

      {exam.id === 'foundational-knowledge' ? (
        <button
          onClick={onStartFoundationalExam}
          disabled={exam.status === 'locked'}
          style={{
            width: '100%',
            background: exam.status === 'locked' ? '#94a3b8' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1rem',
            fontWeight: 600,
            cursor: exam.status === 'locked' ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
        >
          {exam.status === 'locked' ? 'Complete Module 01 First' : 'Start Examination'}
        </button>
      ) : exam.id === 'pilot-licensure' ? (
        <button
          onClick={onStartFAAExam}
          disabled={exam.status === 'locked'}
          style={{
            width: '100%',
            background: exam.status === 'locked' ? '#94a3b8' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1rem',
            fontWeight: 600,
            cursor: exam.status === 'locked' ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Select License & Start
        </button>
      ) : (
        <button
          disabled={exam.status === 'locked'}
          style={{
            width: '100%',
            background: exam.status === 'locked' ? '#94a3b8' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1rem',
            fontWeight: 600,
            cursor: exam.status === 'locked' ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
        >
          {exam.status === 'locked' && exam.requirement ? exam.requirement : 'Start Examination'}
        </button>
      )}
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem',
      position: 'relative',
      zIndex: 10,
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Shader Background - Same as Login Page */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), transparent 40%)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        width: '480px',
        height: '480px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 60%)',
        top: '15%',
        right: '5%',
        filter: 'blur(10px)',
        opacity: 0.8,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '2rem 3rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
        paddingTop: '120px'
      }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: '1.25rem',
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            color: '#1e40af',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.75)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Program Progress
        </button>

        {/* Single White Card Container */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 40px 120px rgba(15, 23, 42, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '180px', height: 'auto', objectFit: 'contain', marginBottom: '1rem' }} />
            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              WINGMENTOR PROGRAMS
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
              Examination Portal
            </h1>
            <p style={{ color: '#1d4ed8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Welcome back, {displayName}
            </p>
          </div>

          {/* Description */}
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', textAlign: 'center', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Complete your certification examinations to track your progress through the Foundational Program. 
            Each exam unlocks new mentorship resources and advancement opportunities.
          </p>

          {/* Category 1: Initial Examinations */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              Category 1: Initial Examinations
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Complete these examinations to establish your foundational knowledge and technical competency.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {category1Exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>

          {/* Category 2: Risk Management & Pathways Assessment */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              Category 2: Risk Management & Pathways Assessment
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Assessment for the Pilot Risk Management & Pathways module. Tests your understanding of risk assessment and career pathway planning.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {category2Exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>

          {/* Category 3: Mentorship Examinations */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              Category 3: Mentorship Examinations
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Available after completing Category 1 and Mentor Modules. Tests your mentorship readiness.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {category3Exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>

          {/* Category 4: EBT CBTA Advanced Assessments */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              Category 4: EBT CBTA Advanced Assessments
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Final assessments based on mentorship acquisition and constructivism principles.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {category4Exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
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
              All examinations are proctored and timed. Ensure you have a stable internet connection before starting.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationPortalPage;
