import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-auth';

interface JobMatch {
  id: string;
  position: string;
  aircraft: string;
  airline: string;
  location: string;
  description: string;
  matchScore: number;
  requirements: string[];
}

interface PilotProfile {
  flightHours: number;
  licenseType: string;
  examPassRate: string;
  aircraftTypes: string[];
  totalHours: number;
}

interface JobMatchingCardProps {
  userId?: string;
}

interface ExamScoreRow {
  score?: number | null;
}

export const JobMatchingCard: React.FC<JobMatchingCardProps> = ({ userId }) => {
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [pilotProfile, setPilotProfile] = useState<PilotProfile | null>(null);

  // Fetch pilot profile from Supabase
  useEffect(() => {
    const fetchPilotProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) {
          console.warn('Could not fetch user profile:', userError);
        }

        // Fetch flight logbook hours
        const { data: logbookData, error: logbookError } = await supabase
          .from('pilot_logbook')
          .select('total_hours')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch exam results
        const { data: examData, error: examError } = await supabase
          .from('pilot_exams')
          .select('score')
          .eq('user_id', userId);

        const totalHours = logbookData?.[0]?.total_hours || userData?.flight_hours || 0;
        const licenseType = userData?.license_type || 'PPL';
        
        // Calculate average pass rate from exams
        let passRate = '75%';
        if (examData && examData.length > 0) {
          const avgScore = (examData as ExamScoreRow[]).reduce((sum: number, e: ExamScoreRow) => sum + (e.score || 0), 0) / examData.length;
          passRate = `${Math.round(avgScore)}%`;
        }

        // Get aircraft types from user data
        const aircraftTypes = userData?.aircraft_types || ['A320'];

        const profile: PilotProfile = {
          flightHours: totalHours,
          licenseType,
          examPassRate: passRate,
          aircraftTypes: Array.isArray(aircraftTypes) ? aircraftTypes : [aircraftTypes],
          totalHours
        };

        setPilotProfile(profile);
        calculateJobMatches(profile);
      } catch (err) {
        console.error('Error fetching pilot profile:', err);
        // Use default profile if fetch fails
        const defaultProfile: PilotProfile = {
          flightHours: 500,
          licenseType: 'CPL',
          examPassRate: '80%',
          aircraftTypes: ['A320'],
          totalHours: 500
        };
        setPilotProfile(defaultProfile);
        calculateJobMatches(defaultProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchPilotProfile();
  }, [userId]);

  // Calculate job matches based on pilot profile
  const calculateJobMatches = (profile: PilotProfile) => {
    const hours = profile.totalHours;
    const passRate = parseInt(profile.examPassRate) || 75;
    const hasTypeRating = profile.aircraftTypes.length > 0;
    const license = profile.licenseType.toLowerCase();

    // Job database with requirements
    const jobs: JobMatch[] = [
      {
        id: '1',
        position: 'First Officer',
        aircraft: 'Airbus A320',
        airline: 'Cathay Pacific',
        location: 'Hong Kong',
        description: 'Direct entry First Officer position with A330/A350/B777 progression path. Strong match for your multi-engine experience.',
        requirements: ['1500+ hours', 'CPL/ATPL', 'Type Rating preferred', '80%+ exam scores'],
        matchScore: 0
      },
      {
        id: '2',
        position: 'Senior First Officer',
        aircraft: 'ATR72-600',
        airline: 'fly91',
        location: 'Hyderabad, India',
        description: 'Type-rated Senior First Officer role. Excellent fit for your turboprop experience and command potential.',
        requirements: ['2000+ hours', 'CPL/ATPL', 'Multi-engine rating', '75%+ exam scores'],
        matchScore: 0
      },
      {
        id: '3',
        position: 'Cadet Pilot',
        aircraft: 'Airbus & Boeing Fleet',
        airline: 'Singapore Airlines',
        location: 'Asia',
        description: 'Ab-initio cadet program across A320/A321/A330/A350, B737/747/777 fleet. Pathway to wide-body operations.',
        requirements: ['0-500 hours', 'PPL minimum', 'Under 30 years old', '70%+ exam scores'],
        matchScore: 0
      },
      {
        id: '4',
        position: 'First Officer',
        aircraft: 'Boeing 737',
        airline: 'Emirates',
        location: 'Dubai, UAE',
        description: 'First Officer position on B737 fleet with progression to B777 and A380. Competitive package.',
        requirements: ['3000+ hours', 'ATPL', 'Multi-crew experience', '85%+ exam scores'],
        matchScore: 0
      },
      {
        id: '5',
        position: 'Second Officer',
        aircraft: 'Airbus A350',
        airline: 'Qatar Airways',
        location: 'Doha, Qatar',
        description: 'Long-haul operations on modern A350 fleet. Excellent career development opportunities.',
        requirements: ['1500+ hours', 'ATPL', 'ICAO Level 4+ English', '80%+ exam scores'],
        matchScore: 0
      }
    ];

    // Calculate match scores based on pilot profile
    const scoredJobs = jobs.map(job => {
      let score = 50; // Base score

      // Hours requirement matching
      if (hours >= 3000) score += 25;
      else if (hours >= 2000) score += 20;
      else if (hours >= 1500) score += 15;
      else if (hours >= 500) score += 10;
      else score += 5;

      // License matching
      if (license.includes('atpl')) score += 15;
      else if (license.includes('cpl')) score += 10;
      else if (license.includes('ppl')) score += 5;

      // Exam pass rate matching
      if (passRate >= 85) score += 10;
      else if (passRate >= 75) score += 7;
      else score += 5;

      // Type rating bonus
      if (hasTypeRating) score += 10;

      // Cap at 98 to leave room for perfection
      score = Math.min(score, 98);

      return { ...job, matchScore: score };
    });

    // Sort by match score descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    setJobMatches(scoredJobs.slice(0, 3));
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return { bg: '#dcfce7', text: '#166534', border: '#22c55e' };
    if (score >= 80) return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
    if (score >= 70) return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
    return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
  };

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading job matches...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: '16px', 
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.1rem', 
          fontWeight: 600, 
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🎯</span>
          Recommended for Your Profile
        </h3>
        {pilotProfile && (
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            fontSize: '0.8rem', 
            color: '#64748b' 
          }}>
            Based on {pilotProfile.totalHours} hours, {pilotProfile.licenseType}, {pilotProfile.examPassRate} avg exam scores
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {jobMatches.map((job, index) => {
          const colors = getMatchColor(job.matchScore);
          const borderColors = ['#22c55e', '#3b82f6', '#f59e0b'];
          const leftBorder = borderColors[index] || colors.border;

          return (
            <div
              key={job.id}
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${leftBorder}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                    {job.position} — {job.aircraft}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {job.airline} • {job.location}
                  </div>
                </div>
                <span
                  style={{
                    background: colors.bg,
                    color: colors.text,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  Match {job.matchScore}%
                </span>
              </div>

              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                {job.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                {job.requirements.map((req, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.7rem',
                      color: '#64748b',
                      background: '#e2e8f0',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {req}
                  </span>
                ))}
              </div>

              <button
                style={{
                  marginTop: '0.75rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                View Details →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobMatchingCard;
