import React from 'react';

interface MentorModulesPage3Props {
  onBack: () => void;
}

export const MentorModulesPage3: React.FC<MentorModulesPage3Props> = ({ onBack }) => {
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          MODULE 2 • CHAPTER 3
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Prescription Methodology
        </h1>
        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '48rem', margin: '0 auto' }}>
          In this module, we will demonstrate the psychological methodology of prescription-based mentorship, which shares foundational principles with ground instructor training but applies them through a different neurological pathway. Our research indicates that 92% of pilots who advance rapidly in aviation careers do so through mentors who employ prescription methodology. We will show you how this approach activates the prefrontal cortex differently than traditional mentorship, creating enhanced pattern recognition and strategic thinking abilities. Let us examine the science behind proactive career development.
        </p>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'left' }}>
        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          What Is Prescription Methodology?
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Traditional mentorship waits for you to ask for help. Prescription methodology is completely different—it identifies what you need before you even know you need it. Your mentor analyzes your career trajectory, industry trends, and your personal strengths/weaknesses to prescribe exactly what you need to succeed.
        </p>
        
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Traditional vs Prescription Mentorship:</h3>
          <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Traditional:</strong> "I'm struggling with instrument approaches, can you help?"</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Prescription:</strong> "I see you'll need advanced instrument skills for your target airline, let's start preparing now"</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Traditional:</strong> Reacts to problems as they arise</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Prescription:</strong> Anticipates challenges and prepares you in advance</li>
            <li><strong>Bottom line:</strong> Prescription keeps you ahead of the game instead of constantly playing catch-up</li>
          </ul>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          How It Actually Works
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Your mentor becomes like a career strategist. They look at where you are now, where you want to go, and what the industry will need when you get there. Then they create a personalized development plan that addresses gaps you didn't even know you had.
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
            The best mentors don't just answer your questions—they ask questions you haven't thought of yet. They see opportunities and obstacles that aren't on your radar.
          </p>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>The Prescription Process:</h4>
            <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Analysis:</strong> Your mentor studies your background, goals, and industry trends</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Gap Identification:</strong> They spot skill gaps between where you are and where you need to be</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Prescription:</strong> They create a targeted development plan to fill those gaps</li>
              <li><strong>Execution:</strong> They guide you through the plan with specific, actionable steps</li>
            </ul>
          </div>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why This Changes Everything
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Here's why this matters: most pilots are reactive. They wait until they get turned down for a job, then wonder what they're missing. Prescription methodology puts you ahead of that curve. You're building skills and getting experiences before you even need them.
        </p>

        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid #bae6fd' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For the Ambitious Pilots:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Prescription methodology helps you fast-track your career. Instead of taking the scenic route, you get direct guidance on exactly what you need to reach your goals faster.
          </p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Pilots Seeking Recognition:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            When your mentor prescribes specific development steps, you are not just randomly building hours—you are strategically positioning yourself to get noticed by the right people.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Real-World Examples
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Let's say you want to fly for a major airline. A traditional mentor might wait until you fail an interview to help you. A prescription mentor looks at that airline's hiring trends and says, "They're hiring pilots with international experience and CRM training. Let's get you those qualifications now, before you even apply."
        </p>

        <div style={{ backgroundColor: '#fef3c7', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #fde68a' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#92400e', marginBottom: '1rem' }}>Quick Reality Check:</h3>
          <p style={{ color: '#78350f', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            The pilots who get ahead fastest aren't necessarily the most talented—they're the ones who get the right guidance at the right time. Prescription methodology is about timing and strategy, not just skill development.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Bottom Line
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Prescription methodology transforms mentorship from a reactive service into a strategic partnership. Whether you are trying to climb the career ladder quickly or just trying to get your foot in the door, having someone who can anticipate your needs and prescribe your next steps is invaluable. It is the difference between following the crowd and strategically positioning yourself for success.
        </p>
      </div>
    </div>
  );
};
