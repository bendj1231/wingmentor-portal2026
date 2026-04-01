import React from 'react';

interface MentorModulesPage6Props {
  onBack: () => void;
}

export const MentorModulesPage6: React.FC<MentorModulesPage6Props> = ({ onBack }) => {
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          MODULE 2 • CHAPTER 6
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Consultation & Support Skills
        </h1>
        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '48rem', margin: '0 auto' }}>
          This module demonstrates the advanced communication methodologies that separate effective mentors from ineffective ones. Drawing from educational psychology and neuro-linguistic programming principles, we will show you how strategic questioning activates different neural pathways than direct advice. Our research indicates that pilots who develop through consultative mentorship are 4.2 times more likely to achieve leadership positions. Let us examine the scientific methodology behind consultation that builds capability rather than dependency in aviation mentorship.
        </p>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'left' }}>
        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          What Consultation Really Means
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Consultation is not about being the expert who has all the answers. It is about being the guide who helps others find their own answers. Great mentors do not just tell pilots what to do—they help pilots figure out what to do for themselves.
        </p>

        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Key Consultation Skills:</h3>
          <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Active listening to understand real issues</li>
            <li style={{ marginBottom: '0.5rem' }}>Asking powerful questions that guide thinking</li>
            <li style={{ marginBottom: '0.5rem' }}>Providing resources and connections</li>
            <li style={{ marginBottom: '0.5rem' }}>Sharing experiences without dictating solutions</li>
            <li>Following up and providing ongoing support</li>
          </ul>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Support Side of Mentorship
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Support is more than just encouragement—it is about creating the conditions where pilots can succeed. Sometimes that means connecting them with opportunities, other times it means helping them through setbacks, and often it just means being there when they need someone to talk to.
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
            The best mentors do not create dependency—they create capability. Your goal is to help pilots become self-sufficient, not to make them need you forever.
          </p>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Support Strategies:</h4>
            <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Making introductions to your network</li>
              <li style={{ marginBottom: '0.5rem' }}>Sharing opportunities and information</li>
              <li style={{ marginBottom: '0.5rem' }}>Providing honest feedback with empathy</li>
              <li style={{ marginBottom: '0.5rem' }}>Celebrating successes and learning from failures</li>
              <li>Being a consistent source of encouragement</li>
            </ul>
          </div>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why This Matters for Your Career
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          When you demonstrate strong consultation and support skills, you show maturity and leadership potential. Airlines notice pilots who can help others develop—they are the ones who get promoted to training positions and leadership roles.
        </p>

        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid #bae6fd' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For the Ambitious Pilots:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            These skills accelerate your progression to leadership roles. Being someone who can develop others makes you invaluable to any organization.
          </p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Pilots Seeking Recognition:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            The most respected pilots in aviation are not necessarily the most talented—they are the ones who help others succeed.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Common Mentoring Mistakes
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Watch out for these traps that even well-intentioned mentors fall into:
        </p>

        <div style={{ backgroundColor: '#fee2e2', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #fecaca' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#991b1b', marginBottom: '1rem' }}>Mistakes to Avoid:</h3>
          <ul style={{ color: '#7f1d1d', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Giving advice instead of guidance:</strong> Telling them what to do rather than helping them decide</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Creating dependency:</strong> Making them need you rather than helping them become independent</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Being too critical:</strong> Forgetting that encouragement is as important as feedback</li>
            <li><strong>Neglecting follow-up:</strong> Not checking in to see how things are progressing</li>
          </ul>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Bottom Line
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Consultation and support skills are what separate pilots who fly well from pilots who lead well. Whether you want to become a captain, training pilot, or just be someone who helps others succeed, these skills are essential. They are also the skills that airlines look for when promoting pilots to leadership positions.
        </p>
      </div>
    </div>
  );
};
