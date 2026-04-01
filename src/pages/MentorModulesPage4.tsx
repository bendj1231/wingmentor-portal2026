import React from 'react';

interface MentorModulesPage4Props {
  onBack: () => void;
}

export const MentorModulesPage4: React.FC<MentorModulesPage4Props> = ({ onBack }) => {
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          MODULE 2 • CHAPTER 4
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Problem-Solving Framework
        </h1>
        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '48rem', margin: '0 auto' }}>
          This module demonstrates the cognitive framework that underpins professional decision-making in aviation. Drawing from cognitive psychology and aviation human factors research, we will show you how problem-solving methodologies create neural pathways that distinguish exceptional pilots from average performers. Our analysis of airline hiring data reveals that problem-solving capability correlates more strongly with career advancement than technical flight skills alone. Let us examine the scientific methodology that develops the cognitive architecture essential for aviation mentorship.
        </p>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'left' }}>
        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why Problem-Solving Matters
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Here's the reality: airlines don't hire pilots who can follow checklists—they hire pilots who can handle unexpected situations. Your ability to solve problems under pressure is what separates good pilots from great ones. This isn't just about flying—it's about thinking clearly when things go wrong.
        </p>
        
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>Types of Problems You'll Face:</h3>
          <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Technical Problems:</strong> Aircraft malfunctions, system failures, weather emergencies</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Operational Problems:</strong> Schedule changes, crew issues, airport limitations</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Career Problems:</strong> Job hunting, interview preparation, career transitions</li>
            <li><strong>Personal Problems:</strong> Work-life balance, stress management, maintaining motivation</li>
          </ul>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Problem-Solving Framework
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Good problem-solving isn't about being brilliant—it's about having a system. When you're under pressure, you don't have time to be creative. You need a step-by-step approach that works every time, regardless of the problem.
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
            The best problem-solvers aren't necessarily the smartest people—they're the ones who remain calm and follow a systematic approach when everyone else is panicking.
          </p>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>The 4-Step Framework:</h4>
            <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Assess:</strong> What's actually happening? Gather facts before you act</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Analyze:</strong> What are your options? Consider risks and consequences</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Act:</strong> Make a decision and commit to it</li>
              <li><strong>Adapt:</strong> Monitor results and adjust as needed</li>
            </ul>
          </div>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Applying This to Your Career
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Problem-solving isn't just for emergencies—it's crucial for career development. When you're not getting interview calls, when you're stuck at a regional airline, when you're wondering how to stand out—you need the same systematic approach.
        </p>

        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid #bae6fd' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For the Ambitious Pilots:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Strong problem-solving skills accelerate your career. You become the go-to pilot when things get tough, which leads to better assignments and faster advancement.
          </p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1', marginBottom: '1rem' }}>For Pilots Seeking Recognition:</h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            When you demonstrate good problem-solving skills, you get noticed. Management needs pilots who can handle pressure and make good decisions without constant supervision.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Building Your Problem-Solving Skills
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Like any skill, problem-solving gets better with practice. Start with small problems and work your way up. Use the framework even for minor issues—it builds the mental muscle you'll need for bigger challenges.
        </p>

        <div style={{ backgroundColor: '#fef3c7', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #fde68a' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#92400e', marginBottom: '1rem' }}>Quick Reality Check:</h3>
          <p style={{ color: '#78350f', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
            Every airline captain and chief pilot you admire got there by solving problems better than their peers. Technical skill gets you the interview—problem-solving skill gets you the job and the promotions.
          </p>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Common Problem-Solving Mistakes
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Watch out for these traps that even experienced pilots fall into:
        </p>

        <div style={{ backgroundColor: '#fee2e2', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #fecaca' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#991b1b', marginBottom: '1rem' }}>Mistakes to Avoid:</h3>
          <ul style={{ color: '#7f1d1d', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Jumping to solutions:</strong> Acting before you understand the problem</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Ignoring consequences:</strong> Not thinking through what happens next</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Analysis paralysis:</strong> Overthinking until you miss your window to act</li>
            <li><strong>Ego-driven decisions:</strong> Making choices based on what looks good rather than what works</li>
          </ul>
        </div>

        <h2 style={{ color: '#2563eb', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Bottom Line
        </h2>
        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Problem-solving is the skill that ties everything together. Whether you're dealing with an in-flight emergency or a career crossroads, the same systematic approach works. Develop this skill, and you become valuable in any situation. That's what makes you indispensable as a pilot and as a professional.
        </p>
      </div>
    </div>
  );
};
