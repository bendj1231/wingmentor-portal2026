import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase-auth';
import { usePilotPortfolio } from '../hooks/usePilotPortfolio';

interface AtlasResumePageProps {
  onBack: () => void;
  onPrint?: () => void;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    uid?: string;
    id?: string;
  } | null;
}

const AtlasResumePage: React.FC<AtlasResumePageProps> = ({ onBack, userProfile, onPrint }) => {
  const userId = userProfile?.uid || userProfile?.id;
  const { portfolio } = usePilotPortfolio(userId);
  const [digitalLogbookTotal, setDigitalLogbookTotal] = useState(0);

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

        if (error) {
          throw error;
        }

        const hoursSum = (data || []).reduce((sum, log) => sum + Number(log.hours || 0), 0);
        setDigitalLogbookTotal(hoursSum);
      } catch (error) {
        console.error('Failed to sync atlas resume logbook totals:', error);
        setDigitalLogbookTotal(0);
      }
    };

    fetchTotals();
  }, [userProfile?.uid]);
  const fullName = `${userProfile?.firstName || 'Benjamin'} ${userProfile?.lastName || 'Bowler'}`.trim();

  const formatHours = (value: number) => `${value.toLocaleString('en-US')} hr`;
  const flightExperienceItems = [
    { label: 'Total Hours', value: formatHours(portfolio?.total_hours ?? 0) },
    { label: 'Pilot-in-Command', value: formatHours(portfolio?.pic_hours ?? 0) },
    { label: 'IFR / IMC', value: formatHours(portfolio?.ifr_hours ?? 0) },
    { label: 'Night', value: formatHours(portfolio?.night_hours ?? 0) }
  ];

  const resumeSections = [
    {
      title: 'Flight Experience',
      items: [
        ...flightExperienceItems
      ]
    },
    {
      title: 'Certifications & Training',
      items: [
        { label: 'License', value: 'ATPL (Frozen) – UAE GCAA' },
        { label: 'Medical', value: 'Class 1 – Valid' },
        { label: 'Simulator', value: 'Airbus A320 | Boeing 737 MAX' }
      ]
    },
    {
      title: 'Mentorship & Leadership',
      items: [
        { label: 'WingMentor Hours', value: '22 hr' },
        { label: 'Peer Mentorship', value: '10 hr observation' },
        { label: 'Consultation', value: '4 structured cases' }
      ]
    }
  ];

  const achievements = [
    'WingMentor Foundational Program – Verified',
    'Airbus Evidence-Based Training Certified',
    'Emirates ATPL Readiness Program – Enrolled'
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <main className="dashboard-card" style={{ position: 'relative' }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#475569',
            fontWeight: 500
          }}
        >
          ← Back to Recognition
        </button>

        <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
          <div className="dashboard-logo" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
          </div>
          <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em' }}>ATLAS RESUME DIRECTORY</div>
          <h1 className="dashboard-title">Atlas-formatted Resume</h1>
          <p style={{ maxWidth: '42rem', margin: '0 auto', color: '#475569' }}>
            A digital resume designed for airline recruiters, presenting your verified WingMentor recognitions, hour breakdown, and mentorship credentials.
          </p>
        </div>

        <section className="dashboard-section" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226,232,240,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Candidate</div>
                <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.75rem', color: '#0f172a' }}>{fullName}</h2>
                <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>WingMentor Recognition Portfolio</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Share link</div>
                <button style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: 'transparent',
                  color: '#0f172a',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => navigator.clipboard.writeText('https://wingmentor.app/resume/' + (userProfile?.uid || 'demo'))}
                >
                  Copy shareable resume URL
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {resumeSections.map((section) => (
              <div key={section.title} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                border: '1px solid rgba(226,232,240,0.8)'
              }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', marginBottom: '0.75rem' }}>{section.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {section.items.map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                      <span>{item.label}</span>
                      <strong style={{ color: '#0f172a' }}>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226,232,240,0.8)'
          }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', color: '#0f172a' }}>Highlighted Achievements</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', lineHeight: 1.7 }}>
              {achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dashboard-section">
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226,232,240,0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Export & Verification</h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>
              Download a PDF copy of your Atlas-formatted resume or share the verification link directly with airline recruiters.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#0ea5e9',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: onPrint ? 'pointer' : 'default'
                }}
                onClick={() => onPrint?.()}
              >
                Open Printable Resume
              </button>
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: 'transparent',
                  color: '#0f172a',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => alert('Live verification feed coming soon')}
              >
                Share verification
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AtlasResumePage;
