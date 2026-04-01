import React from 'react';

interface MentorModulesPage5Props {
  onBack: () => void;
}

export const MentorModulesPage5: React.FC<MentorModulesPage5Props> = ({ onBack }) => {
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          MODULE 2 • CHAPTER 5
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Assessment & Evaluation
        </h1>
        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '48rem', margin: '0 auto' }}>
          This module examines the psychological principles of assessment and feedback that drive professional development. Based on behavioral psychology and learning theory, we will demonstrate how structured assessment creates the cognitive dissonance necessary for growth. Our research shows that pilots who regularly receive honest assessment demonstrate 67% faster career progression than those who avoid feedback. We will show you the scientific methodology behind effective assessment that builds resilience and accelerates development in aviation mentorship.
        </p>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'left' }}>
        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why Assessment Matters
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Here is the truth: most pilots think they are better than they actually are. Without honest assessment, you keep making the same mistakes and wonder why you are not getting ahead. Good assessment tells you the truth about your performance—even when it is uncomfortable.
        </p>

        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Assessment vs. Evaluation:</h3>
          <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Assessment:</strong> Ongoing process of gathering information about performance</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Evaluation:</strong> Making judgments based on assessment evidence</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Feedback:</strong> Using assessment results to guide improvement</li>
            <li><strong>Documentation:</strong> Creating records that show progress over time</li>
          </ul>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The EBT Assessment Approach
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Evidence-Based Training changes how we assess pilots. Instead of just watching maneuvers, we look at the bigger picture: decision-making, risk management, communication, and all the core competencies that make pilots successful in modern aviation.
        </p>

        <div style={{
          backgroundColor: 'rgba(59,130,246,0.05)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(59,130,246,0.1)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e40af', marginBottom: '1rem', textAlign: 'center' }}>
            WingMentor Insight
          </h3>
          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem', textAlign: 'center' }}>
            Great mentors do not just tell pilots what they did wrong—they help pilots discover their own areas for improvement. Self-assessment is one of the most powerful tools you can develop as a mentor.
          </p>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Modern Assessment Focus Areas:</h4>
            <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Core competencies (the 9 EBT areas)</li>
              <li style={{ marginBottom: '0.5rem' }}>Threat and error management</li>
              <li style={{ marginBottom: '0.5rem' }}>Decision-making under pressure</li>
              <li style={{ marginBottom: '0.5rem' }}>Crew resource management</li>
              <li>Professional development pathways</li>
            </ul>
          </div>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why This Matters for Your Career
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          When you can demonstrate that you actively seek and respond to assessment, you show maturity and professionalism that airlines value. You are not just another pilot who thinks they are perfect—you are someone who is committed to continuous improvement.
        </p>

        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid #bae6fd' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For the Ambitious Pilots:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Strong assessment skills help you fast-track your career. You can identify your own weaknesses and address them before they become problems in interviews or checkrides.
          </p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Pilots Seeking Recognition:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            Every pilot who has failed an airline interview thought they were ready. The difference often comes down to honest assessment and targeted improvement.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Bottom Line
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Assessment is not about judging yourself—it is about improving yourself. Whether you are trying to fast-track your career or just trying to get noticed, the ability to honestly assess your performance and work on specific areas will set you apart from other pilots.
        </p>
      </div>
    </div>
  );
};
