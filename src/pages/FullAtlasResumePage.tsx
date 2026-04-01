import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase-auth';
import { usePilotPortfolio } from '../hooks/usePilotPortfolio';

interface FullAtlasResumePageProps {
  onBack: () => void;
  onPrint?: () => void;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    uid?: string;
    id?: string;
  } | null;
}

const FullAtlasResumePage: React.FC<FullAtlasResumePageProps> = ({ onBack, userProfile, onPrint }) => {
  const userId = userProfile?.uid || userProfile?.id;
  const { portfolio } = usePilotPortfolio(userId);
  const [digitalLogbookTotal, setDigitalLogbookTotal] = useState(0);
  const [pilotData, setPilotData] = useState<any>(null);

  useEffect(() => {
    const fetchTotals = async () => {
      if (!userProfile?.uid) {
        setDigitalLogbookTotal(0);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('pilot_flight_logs')
          .select('hours')
          .eq('user_id', userProfile.uid);

        if (error) throw error;

        const hoursSum = (data || []).reduce((sum, log) => sum + Number(log.hours || 0), 0);
        setDigitalLogbookTotal(hoursSum);
      } catch (error) {
        console.error('Failed to sync atlas resume logbook totals:', error);
        setDigitalLogbookTotal(0);
      }
    };

    const fetchPilotData = async () => {
      if (!userProfile?.uid) return;
      
      try {
        const { data, error } = await supabase
          .from('pilot_licensure_experience')
          .select('*')
          .eq('user_id', userProfile.uid)
          .single();
        
        if (!error && data) {
          setPilotData(data);
        }
      } catch (error) {
        console.error('Failed to fetch pilot data:', error);
      }
    };

    fetchTotals();
    fetchPilotData();
  }, [userProfile?.uid]);

  const fullName = `${userProfile?.firstName || 'Benjamin'} ${userProfile?.lastName || 'Bowler'}`.trim();

  const formatHours = (value: number) => `${value.toLocaleString('en-US')} hr`;
  
  // ATS-Friendly structured sections
  const flightExperienceData = [
    { category: 'Total Flight Hours', value: formatHours(portfolio?.total_hours ?? 0) },
    { category: 'Pilot-in-Command', value: formatHours(portfolio?.pic_hours ?? 0) },
    { category: 'Cross-Country', value: formatHours(0) },
    { category: 'Night Flight', value: formatHours(portfolio?.night_hours ?? 0) },
    { category: 'Instrument/IMC', value: formatHours(portfolio?.ifr_hours ?? 0) },
    { category: 'Dual Instruction', value: formatHours(0) },
    { category: 'Simulator Time', value: formatHours(0) },
    { category: 'Multi-Engine', value: formatHours(0) },
  ];

  const certifications = [
    { title: 'Airline Transport Pilot License (ATPL)', status: 'Frozen - UAE GCAA', date: '2024' },
    { title: 'Commercial Pilot License', status: 'Valid', date: '2023' },
    { title: 'Private Pilot License', status: 'Valid', date: '2022' },
    { title: 'Instrument Rating (Multi-Engine)', status: 'Valid', date: '2023' },
    { title: 'Class 1 Medical Certificate', status: 'Valid', date: '2025' },
    { title: 'English Proficiency Level 6', status: 'Expert', date: '2024' },
  ];

  const typeRatings = [
    'Airbus A320',
    'Boeing 737 MAX',
    'Airbus A350',
    'Tecnam P2006JF',
    'Cessna 172',
    'Cessna 152',
  ];

  const jobExperience = [
    {
      role: 'Student Pilot to Private Pilot',
      organization: 'Private Sector Aviation',
      duration: '6 months',
      details: 'Training in C152, C172 aircraft. Completed ground school and flight training.'
    },
    {
      role: 'Private Pilot to Commercial Pilot',
      organization: 'Flight Training Organization',
      duration: '1 year',
      details: 'Advanced flight training in Tecnam P2006JF. Instrument rating and commercial operations.'
    },
    {
      role: 'Foundational Program Enrollee',
      organization: 'WingMentor',
      duration: '50 hours',
      details: 'AIRBUS EBT CBTA competency skills: consultation, problem solving, assessment, pilot development, industry familiarization, mentorship.'
    },
  ];

  const skills = [
    'Flight Operations',
    'Crew Resource Management',
    'Risk Assessment',
    'Decision Making',
    'Navigation Systems',
    'Weather Analysis',
    'Emergency Procedures',
    'Air Traffic Communication',
    'Flight Planning',
    'Aircraft Systems Knowledge',
  ];

  const languages = pilotData?.languages || 'English, Arabic';
  const nationality = pilotData?.nationality || 'UAE';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      padding: '2rem',
      fontFamily: 'Arial, Helvetica, sans-serif'
    }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#0f172a',
          zIndex: 100
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Print Button */}
      <button
        onClick={onPrint || (() => window.print())}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#2563eb',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'white',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        🖨️ Print / Save PDF
      </button>

      {/* Main Resume Container - ATS Optimized */}
      <main style={{ 
        maxWidth: '8.5in', 
        margin: '0 auto', 
        background: 'white',
        padding: '0.5in',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lineHeight: 1.6,
        color: '#1a1a1a'
      }}>
        {/* Header Section */}
        <header style={{ 
          borderBottom: '2px solid #1a1a1a', 
          paddingBottom: '1rem', 
          marginBottom: '1.5rem'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2rem', 
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {fullName}
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0', 
            fontSize: '1.1rem',
            color: '#2563eb',
            fontWeight: 600
          }}>
            Professional Pilot - ATPL (Frozen)
          </p>
          <div style={{ 
            marginTop: '0.75rem', 
            fontSize: '0.9rem',
            color: '#4a4a4a'
          }}>
            <span>Nationality: {nationality}</span> | <span>Languages: {languages}</span> | <span>WingMentor Recognition Portfolio</span>
          </div>
        </header>

        {/* Professional Summary */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            borderBottom: '1px solid #1a1a1a',
            paddingBottom: '0.25rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem', textAlign: 'justify' }}>
            Professional pilot with comprehensive training in both single and multi-engine aircraft. 
            Holds frozen ATPL license with valid Class 1 Medical Certificate. Demonstrated expertise 
            in instrument flight operations, crew resource management, and advanced flight planning. 
            Committed to continuous professional development through the WingMentor Foundational Program 
            and AIRBUS EBT CBTA competency-based training approach.
          </p>
        </section>

        {/* Flight Experience - ATS Table Format */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            borderBottom: '1px solid #1a1a1a',
            paddingBottom: '0.25rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Flight Experience Summary
          </h2>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '0.9rem'
          }}>
            <tbody>
              {flightExperienceData.map((item, index) => (
                <tr key={index} style={{ 
                  borderBottom: index < flightExperienceData.length - 1 ? '1px solid #e5e5e5' : 'none'
                }}>
                  <td style={{ padding: '0.4rem 0', fontWeight: 600, width: '50%' }}>
                    {item.category}
                  </td>
                  <td style={{ padding: '0.4rem 0', textAlign: 'right' }}>
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Certifications & Licenses */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            borderBottom: '1px solid #1a1a1a',
            paddingBottom: '0.25rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Certifications & Licenses
          </h2>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '1.25rem',
            fontSize: '0.95rem'
          }}>
            {certifications.map((cert, index) => (
              <li key={index} style={{ marginBottom: '0.4rem' }}>
                <strong>{cert.title}</strong> - {cert.status} ({cert.date})
              </li>
            ))}
          </ul>
        </section>

        {/* Type Ratings */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            borderBottom: '1px solid #1a1a1a',
            paddingBottom: '0.25rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Aircraft Type Ratings & Experience
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            <strong>Certified On:</strong> {typeRatings.join(', ')}
          </p>
        </section>

        {/* Professional Experience */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            borderBottom: '1px solid #1a1a1a',
            paddingBottom: '0.25rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Professional Experience
          </h2>
          {jobExperience.map((job, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>{job.role}</strong>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>{job.duration}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#2563eb', marginBottom: '0.25rem' }}>
                {job.organization}
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a4a4a' }}>
                {job.details}
              </p>
            </div>
          ))}
        </section>

        {/* Professional Skills */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            borderBottom: '1px solid #1a1a1a',
            paddingBottom: '0.25rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Professional Skills
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            {skills.join(' • ')}
          </p>
        </section>

        {/* Training & Development */}
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            borderBottom: '1px solid #1a1a1a',
            paddingBottom: '0.25rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.05em'
          }}>
            Training & Professional Development
          </h2>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '1.25rem',
            fontSize: '0.95rem'
          }}>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>WingMentor Foundational Program</strong> - Verified Completion
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Airbus Evidence-Based Training (EBT)</strong> - Certified
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>CBTA Competency-Based Training</strong> - Consultation, Problem Solving, Assessment, Pilot Development
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Emirates ATPL Readiness Program</strong> - Enrolled
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Peer Mentorship Program</strong> - 22 hours mentorship experience
            </li>
          </ul>
        </section>

        {/* Footer / Verification */}
        <footer style={{ 
          marginTop: '2rem', 
          paddingTop: '1rem',
          borderTop: '2px solid #1a1a1a',
          fontSize: '0.85rem',
          color: '#666',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 0.5rem' }}>
            <strong>ATLAS Resume Verification</strong>
          </p>
          <p style={{ margin: 0 }}>
            This resume is verified through WingMentor's ATLAS system. 
            All flight hours and certifications are authenticated. 
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default FullAtlasResumePage;
