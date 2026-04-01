import React from 'react';

interface MentorModulesPage1Props {
  onBack: () => void;
}

export const MentorModulesPage1: React.FC<MentorModulesPage1Props> = ({ onBack }) => {
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          MODULE 2 • CHAPTER 1
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          What Is a Mentor?
        </h1>
        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '48rem', margin: '0 auto' }}>
          This module is built for pilots who just crossed the finish line of training, logbook filled but still piecing together a professional narrative. Mentorship isn’t another checkbox—it’s the bridge between technical competence and leadership presence. Here you’ll explore what the mentor role really looks like, how it feels to carry the responsibility, and why adopting the right mindset turns awkward first conversations into clear, future-focused exchanges.
        </p>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'left' }}>
        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Difference Between Flight Instruction and Mentorship
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          This section breaks down the distinct mental models behind instruction and mentorship so you know the shift in responsibility. Instruction keeps the procedure airtight; mentorship shapes how pilots move beyond compliance and into initiative.
        </p>

        <section style={{ borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>What Flight Instructors Do</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Flight instructors focus on delivering technical precision, adhering to regulatory standards, and guiding pilots safely through familiar procedures.
          </p>
          <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Ensure every maneuver meets regulatory checklists and documentation requirements.</li>
            <li style={{ marginBottom: '0.5rem' }}>Correct procedures in real time to reinforce safe, repeatable habits.</li>
            <li style={{ marginBottom: '0.5rem' }}>Validate pilots’ technical currency and emergency responses before signing off on endorsements.</li>
            <li style={{ marginBottom: '0.5rem' }}>Manage risk in the cockpit by maintaining clear communications and situational awareness.</li>
            <li style={{ marginBottom: '0.5rem' }}>Deliver structured debriefs that highlight performance gaps and compliance needs.</li>
            <li>Record and escalate non-standard events so training records remain airtight.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 10px 32px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>What Mentors Do</h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Mentors guide pilots beyond procedures, shaping their approach to leadership, culture, and long-term capability. They assess, evaluate, and problem-solve so the pilots they serve can continue to climb.
            </p>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Self-awareness is part of that work—mentors know they may not have the answers in the moment, but they track that gap, reflect on it, and come back when the time allows.
            </p>
            <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Assess performance with the lens of outcomes, not just procedure, to spot where pilots need more calibrated challenges.</li>
              <li style={{ marginBottom: '0.5rem' }}>Evaluate context rapidly so every coaching moment targets the right capability and confidence gap.</li>
              <li style={{ marginBottom: '0.5rem' }}>Problem-solve alongside pilots by translating messy scenarios into developmental experiments.</li>
              <li style={{ marginBottom: '0.5rem' }}>Foster psychological safety so pilots feel safe acknowledging uncertainty and asking for help.</li>
              <li style={{ marginBottom: '0.5rem' }}>Reflect on what you don’t yet know, then circle back with evidence-based guidance once the time and insight align.</li>
              <li>Track growth trajectories so developmental conversations stay future-focused and the next action plan is clear.</li>
            </ul>
          </div>
        </section>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Mentor Mindset in Practice
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Mentorship happens between structured lessons. It is built on curiosity, emotional calibration, and relentless accountability. Mentors ask hard questions, stay calm under pressure, and keep the focus on long-term capability rather than short-term comfort. In the coming sections we break those habits down so you can practice them deliberately.
        </p>

        <div style={{
          backgroundColor: 'rgba(59,130,246,0.05)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(59,130,246,0.1)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e40af', marginBottom: '1rem', textAlign: 'center' }}>
            The WingMentor Way
          </h3>
          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem', textAlign: 'center' }}>
            You are not being trained to recreate a checklist; you are being trained to architect experiences. That is the hard truth. Mentors earn respect by helping pilots see the patterns beneath the problem, not by telling them what to do next.
          </p>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Mentor Psychology</h4>
            <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>You frame every interaction as a case study in development.</li>
              <li style={{ marginBottom: '0.5rem' }}>You calibrate emotional intensity while staying focused on capability.</li>
              <li style={{ marginBottom: '0.5rem' }}>You use inquiry more than instruction.</li>
              <li style={{ marginBottom: '0.5rem' }}>You shift evaluation toward potential and away from compliance.</li>
              <li style={{ marginBottom: '0.5rem' }}>You lean on executive control, not just procedural memory.</li>
              <li>Neurological pathway: Prefrontal circuits that regulate attention, intention, and empathy.</li>
            </ul>
          </div>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why This Momentum Matters
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          This is the foundation module. If you walk away with nothing else, take this truth: mentors are measured by who they develop, not by how many hours they log. Airlines and leadership teams reward pilots who can cultivate new talent because that is the only way culture scales. Your mentor mindset is the leverage point; invest in it.
        </p>

        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid #bae6fd' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Pilots Who Lead Teams:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Mentors are the pilots who can step back, diagnose the developmental gap, and design the next 90 days of progress. That skill is the difference between a good captain and someone who builds a training culture.
          </p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Pilots Building Legacy:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            This mindset is your professional currency. When you are recognized as a person who can grow others, your voice carries weight in every room.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Starting Point
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          You have the technical base. Now build the psychological architecture: curiosity, inquiry, accountability, and recognition. The next modules will show you how to execute on that architecture, but it begins with understanding what mentorship truly requires.
        </p>
      </div>
    </div>
  );
};
