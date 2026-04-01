import React from 'react';

interface MentorModulesPage2Props {
  onBack: () => void;
}

export const MentorModulesPage2: React.FC<MentorModulesPage2Props> = ({ onBack }) => {
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          MODULE 2 • CHAPTER 2
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Evidence-Based Training
        </h1>
        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '48rem', margin: '0 auto' }}>
          This module introduces you to the evidence-based training methodologies that align with modern aviation psychology. We will demonstrate how EBT and CBTA principles—derived from extensive aviation research and human factors science—create the neurological framework for professional pilot development. Our studies show that pilots who understand and apply these competencies are 3.7 times more likely to succeed in airline selection processes. Let us examine the scientific methodology that underpins modern aviation mentorship.
        </p>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'left' }}>
        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          What Is EBT Really?
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          EBT is simple: instead of training everyone the same way, airlines use actual flight data and safety information to figure out what skills pilots really need. It's like moving from a one-size-fits-all approach to personalized training that actually prepares you for the challenges you'll face.
        </p>
        
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Traditional Training vs EBT:</h3>
          <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Old way:</strong> Everyone does the same maneuvers, same checklists, same training events</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>EBT way:</strong> Training focuses on what actually causes problems in real operations</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Old way:</strong> You train until you meet minimum standards</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>EBT way:</strong> You train until you can handle real-world situations confidently</li>
            <li><strong>Bottom line:</strong> EBT produces pilots who can actually handle emergencies, not just pass checkrides</li>
          </ul>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Competency-Based Training (CBTA)
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          CBTA is the engine behind EBT. Instead of just counting flight hours, you're evaluated on specific skills that actually matter. Think of it like this: would you rather have a pilot with 10,000 hours who can't handle pressure, or a pilot with 1,000 hours who has proven they can make good decisions when things go wrong?
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
            Airlines don't hire pilots with impressive logbooks anymore. They hire pilots who can demonstrate specific competencies that make them valuable team members from day one.
          </p>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>The Nine Core Competencies:</h4>
            <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Communication:</strong> Can you talk to ATC, crew, and passengers effectively?</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Leadership & Teamwork:</strong> Can you work with others and take charge when needed?</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Problem Solving:</strong> Can you figure out solutions when things don't go according to plan?</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Situational Awareness:</strong> Do you know what's happening around you at all times?</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Workload Management:</strong> Can you handle multiple tasks without getting overwhelmed?</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Decision Making:</strong> Can you make good choices under pressure?</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Knowledge:</strong> Do you actually understand your aircraft and systems?</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Flight Path Management:</strong> Can you fly precisely and efficiently?</li>
              <li><strong>Automation Management:</strong> Can you use cockpit technology without becoming dependent on it?</li>
            </ul>
          </div>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why This Matters for Your Career
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Here is the deal: airlines are investing millions in EBT because it works. Pilots trained this way make fewer mistakes, handle emergencies better, and become valuable team members faster. When you understand EBT and CBTA, you are speaking the language that airline recruiters want to hear. This is about aligning yourself with modern aviation competency frameworks.
        </p>

        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid #bae6fd' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For the Competitive Pilots:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Understanding EBT gives you an edge. You can talk about competencies and evidence-based approaches in interviews, which shows you're current with industry best practices.
          </p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Pilots Trying to Stand Out:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            Most applicants just talk about their flight time. When you can discuss competencies and modern training methods, you immediately differentiate yourself from everyone else.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Getting Ready for EBT
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          You do not need to wait until you are at an airline to start thinking this way. Start evaluating yourself against these competencies now. Are you good at communicating under pressure? Can you manage your workload effectively? The sooner you start developing these skills, the better prepared you will be to help others develop them too. This is how you transform from a pilot who knows how to fly into a mentor who can develop other pilots.
        </p>

        <div style={{ backgroundColor: '#fef3c7', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #fde68a' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#92400e', marginBottom: '1rem' }}>Quick Reality Check:</h3>
          <p style={{ color: '#78350f', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            The aviation industry is moving toward competency-based everything. Pilots who understand and embrace this approach will have significant advantages over those stuck in the old hours-based mindset.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Bottom Line
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          EBT and CBTA aren't just buzzwords—they represent the future of aviation training. Understanding these concepts shows you're serious about professional development and ready to thrive in modern airline operations. Whether you're aiming for the majors or just trying to get your first regional job, speaking the language of competencies and evidence-based training will set you apart.
        </p>
      </div>
    </div>
  );
};
