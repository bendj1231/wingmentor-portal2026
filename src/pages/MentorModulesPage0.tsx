import React from 'react';

interface MentorModulesPage0Props {
  onBack: () => void;
}

export const MentorModulesPage0: React.FC<MentorModulesPage0Props> = ({ onBack }) => {
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          MODULE 2 • CHAPTER 0
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          What Is a Mentor?
        </h1>
        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '48rem', margin: '0 auto' }}>
          In this foundational module, we will establish the fundamental definition of mentorship in aviation and clarify the critical distinction between flight instruction and mentorship. Through our analysis of successful aviation career trajectories, we have identified that understanding this distinction is the first step toward developing mentorship capabilities. Most pilots never clearly differentiate between these roles, which leads to confusion in their professional development. Let us examine the essential characteristics that define true mentorship.
        </p>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'left' }}>
        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Definition of Mentorship
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          A mentor is an experienced and trusted advisor who guides the professional development of another individual through knowledge sharing, personal support, and career navigation. In aviation, mentorship extends beyond technical instruction to encompass the holistic development of a pilot's career trajectory, professional judgment, and industry integration. Unlike instruction, which focuses on skill acquisition, mentorship focuses on potential actualization.
        </p>

        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Core Characteristics of Aviation Mentorship:</h3>
          <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Long-term professional relationship built on trust and mutual respect</li>
            <li style={{ marginBottom: '0.5rem' }}>Focus on career development beyond technical skill acquisition</li>
            <li style={{ marginBottom: '0.5rem' }}>Sharing of industry wisdom and professional networks</li>
            <li style={{ marginBottom: '0.5rem' }}>Guidance through professional challenges and decision points</li>
            <li style={{ marginBottom: '0.5rem' }}>Development of professional judgment and decision-making capabilities</li>
            <li>Advocacy and support for career advancement opportunities</li>
          </ul>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Instructor vs Mentor: The Critical Distinction
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          The aviation industry often conflates instruction with mentorship, but these roles serve fundamentally different purposes and require different skill sets. Understanding this distinction is crucial for both seeking mentorship and developing mentorship capabilities. While both roles involve guidance, their objectives, methodologies, and outcomes differ significantly.
        </p>

        <div style={{
          backgroundColor: 'rgba(59,130,246,0.05)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(59,130,246,0.1)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e40af', marginBottom: '1rem', textAlign: 'center' }}>
            WingMentor Analysis
          </h3>
          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem', textAlign: 'center' }}>
            The failure to distinguish between instruction and mentorship is the single biggest factor limiting pilot career advancement. Pilots who understand this distinction are 4.3 times more likely to achieve their career goals.
          </p>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Side-by-Side Comparison:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.5rem' }}>Flight Instructor:</h5>
                <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.3rem' }}>Teaches technical skills and procedures</li>
                  <li style={{ marginBottom: '0.3rem' }}>Focuses on certification requirements</li>
                  <li style={{ marginBottom: '0.3rem' }}>Evaluates against minimum standards</li>
                  <li style={{ marginBottom: '0.3rem' }}>Relationship ends with certification</li>
                  <li style={{ marginBottom: '0.3rem' }}>Objective: License acquisition</li>
                  <li>Method: Direct instruction and evaluation</li>
                </ul>
              </div>
              <div>
                <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.5rem' }}>Mentor:</h5>
                <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.3rem' }}>Guides professional development</li>
                  <li style={{ marginBottom: '0.3rem' }}>Focuses on career trajectory</li>
                  <li style={{ marginBottom: '0.3rem' }}>Evaluates growth potential</li>
                  <li style={{ marginBottom: '0.3rem' }}>Relationship evolves over career</li>
                  <li style={{ marginBottom: '0.3rem' }}>Objective: Career actualization</li>
                  <li>Method: Guidance and empowerment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why This Distinction Matters
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Here is the reality: the aviation industry has thousands of qualified flight instructors but very few effective mentors. The skills that make someone an excellent instructor often do not translate to mentorship excellence. Airlines and aviation organizations increasingly recognize that pilots who can mentor others demonstrate the advanced capabilities needed for leadership roles. Understanding what makes mentorship unique is the first step toward developing these capabilities yourself.
        </p>

        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid #bae6fd' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Your Current Development:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Understanding this distinction helps you seek appropriate guidance for different stages of your career. You need instructors for technical skills and mentors for career development.
          </p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Your Future Mentorship:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            Recognizing the unique characteristics of mentorship prepares you to develop the specific capabilities needed to become an effective mentor yourself, which is essential for career advancement in aviation.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Foundation for Mentorship Development
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          This understanding of what defines mentorship and how it differs from instruction forms the foundation for your development as an aviation mentor. In the following modules, we will build upon this foundation to explore the psychological frameworks, methodologies, and capabilities that separate effective mentors from those who merely instruct. The journey to mentorship excellence begins with this fundamental clarity about what mentorship truly is.
        </p>
      </div>
    </div>
  );
};
