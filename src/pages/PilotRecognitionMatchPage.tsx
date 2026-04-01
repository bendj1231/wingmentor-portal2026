import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';
import type { UserProfile } from '../types/user';

interface PilotRecognitionMatchPageProps {
  onBack: () => void;
  userProfile?: UserProfile | null;
}

interface JobMatch {
  id: string;
  job_id: string;
  job_title: string;
  airline_company: string;
  aircraft_types: string[];
  overall_match_score: number;
  readiness_level: string;
  missing_hours: number;
  missing_ratings: string[];
  missing_certifications: string[];
  skill_gaps: string[];
  training_recommendations: string[];
  estimated_readiness_months: number;
  hours_match_score: number;
  ratings_match_score: number;
  experience_match_score: number;
  certification_match_score: number;
}

interface JobOpportunity {
  job_id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  aircraft_types: string[];
  minimum_requirements: any;
  preferred_qualifications: any;
  benefits: any;
  application_url: string;
}

export const PilotRecognitionMatchPage: React.FC<PilotRecognitionMatchPageProps> = ({ onBack, userProfile }) => {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [filterLevel, setFilterLevel] = useState<'all' | 'ready' | 'nearly_ready' | 'needs_training'>('all');

  useEffect(() => {
    if (userProfile?.uid) {
      fetchMatches();
      fetchJobOpportunities();
    }
  }, [userProfile?.uid]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      // First, calculate matches for all active jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('job_opportunities')
        .select('*')
        .eq('is_active', true);

      if (jobsError) throw jobsError;

      // Get pilot's complete profile data
      const { data: pilotProfile } = await supabase
        .from('pilot_profiles')
        .select('*')
        .eq('user_id', userProfile?.uid)
        .single();

      const { data: flightLogs } = await supabase
        .from('pilot_flight_logs')
        .select('hours')
        .eq('user_id', userProfile?.uid);

      const { data: exams } = await supabase
        .from('pilot_exams')
        .select('exam_name, exam_type, passed')
        .eq('user_id', userProfile?.uid);

      const { data: achievements } = await supabase
        .from('achievements')
        .select('title, category')
        .eq('user_id', userProfile?.uid);

      // Calculate matches for each job
      const calculatedMatches: JobMatch[] = (jobs || []).map(job => {
        return calculateJobMatch(job, pilotProfile, flightLogs || [], exams || [], achievements || []);
      });

      // Sort by match score
      calculatedMatches.sort((a, b) => b.overall_match_score - a.overall_match_score);
      setMatches(calculatedMatches);

    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('job_opportunities')
        .select('*')
        .eq('is_active', true)
        .order('priority_level', { ascending: true });

      if (error) throw error;
      setJobOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching job opportunities:', error);
    }
  };

  const calculateJobMatch = (
    job: JobOpportunity,
    pilotProfile: any,
    flightLogs: any[],
    exams: any[],
    achievements: any[]
  ): JobMatch => {
    const requirements = job.minimum_requirements;
    const preferred = job.preferred_qualifications || {};

    // Calculate pilot's current stats
    const totalHours = flightLogs?.reduce((sum, log) => sum + Number(log.hours || 0), 0) || 0;
    const pilotData = pilotProfile || {};
    
    const pilotStats = {
      total_hours: totalHours,
      pic_hours: pilotData.pic_hours || 0,
      ifr_hours: pilotData.ifr_hours || 0,
      night_hours: pilotData.night_hours || 0,
      cross_country_hours: pilotData.cross_country_hours || 0,
      license_type: pilotData.license_type || 'Student',
      ratings: [
        ...(pilotData.instrument_rating ? ['IFR'] : []),
        ...(pilotData.multi_engine_rating ? ['Multi-engine'] : []),
        ...(pilotData.flight_instructor_certificate ? ['CFI'] : []),
        ...(pilotData.airline_transport_pilot ? ['ATPL'] : [])
      ],
      certifications: (exams || [])
        .filter(exam => exam.passed)
        .map(exam => exam.exam_name),
      achievements: (achievements || []).map(a => a.title)
    };

    // Calculate individual match scores
    const hoursMatch = calculateHoursMatch(pilotStats, requirements, preferred);
    const ratingsMatch = calculateRatingsMatch(pilotStats, requirements, preferred);
    const experienceMatch = calculateExperienceMatch(pilotStats, requirements, preferred);
    const certificationMatch = calculateCertificationMatch(pilotStats, requirements, preferred);

    // Calculate overall score
    const overallScore = (hoursMatch + ratingsMatch + experienceMatch + certificationMatch) / 4;

    // Determine readiness level
    const readinessLevel = determineReadinessLevel(overallScore);

    // Calculate gaps
    const missingHours = Math.max(0, (requirements.total_hours || 0) - pilotStats.total_hours);
    const missingRatings = calculateMissingRatings(pilotStats, requirements);
    const missingCertifications = calculateMissingCertifications(pilotStats, requirements);
    const skillGaps = calculateSkillGaps(pilotStats, requirements);
    const trainingRecommendations = generateTrainingRecommendations(missingHours, missingRatings, missingCertifications);
    const estimatedReadinessMonths = calculateReadinessMonths(missingHours, missingRatings, missingCertifications);

    return {
      id: Math.random().toString(),
      job_id: job.job_id,
      job_title: job.title,
      airline_company: job.company,
      aircraft_types: job.aircraft_types,
      overall_match_score: overallScore,
      readiness_level: readinessLevel,
      missing_hours: missingHours,
      missing_ratings: missingRatings,
      missing_certifications: missingCertifications,
      skill_gaps: skillGaps,
      training_recommendations: trainingRecommendations,
      estimated_readiness_months: estimatedReadinessMonths,
      hours_match_score: hoursMatch,
      ratings_match_score: ratingsMatch,
      experience_match_score: experienceMatch,
      certification_match_score: certificationMatch
    };
  };

  const calculateHoursMatch = (pilotStats: any, requirements: any, preferred: any): number => {
    const required = requirements.total_hours || 0;
    const preferredHours = preferred.total_hours || required;
    const current = pilotStats.total_hours;
    
    if (current >= preferredHours) return 100;
    if (current >= required) return 80 + ((current - required) / (preferredHours - required)) * 20;
    return Math.max(0, (current / required) * 80);
  };

  const calculateRatingsMatch = (pilotStats: any, requirements: any, preferred: any): number => {
    const requiredRatings = requirements.ratings || [];
    const preferredRatings = preferred.ratings || [...requiredRatings];
    const currentRatings = pilotStats.ratings;
    
    if (currentRatings.length >= preferredRatings.length) return 100;
    if (currentRatings.length >= requiredRatings.length) return 80;
    return (currentRatings.length / requiredRatings.length) * 80;
  };

  const calculateExperienceMatch = (pilotStats: any, requirements: any, preferred: any): number => {
    const requiredPIC = requirements.pic_hours || 0;
    const preferredPIC = preferred.pic_hours || requiredPIC;
    const currentPIC = pilotStats.pic_hours;
    
    if (currentPIC >= preferredPIC) return 100;
    if (currentPIC >= requiredPIC) return 80 + ((currentPIC - requiredPIC) / (preferredPIC - requiredPIC)) * 20;
    return Math.max(0, (currentPIC / requiredPIC) * 80);
  };

  const calculateCertificationMatch = (pilotStats: any, requirements: any, preferred: any): number => {
    const requiredCerts = requirements.certifications || [];
    const preferredCerts = preferred.certifications || [...requiredCerts];
    const currentCerts = pilotStats.certifications;
    
    const requiredMatch = requiredCerts.filter((cert: string) => currentCerts.includes(cert)).length;
    const preferredMatch = preferredCerts.filter((cert: string) => currentCerts.includes(cert)).length;
    
    if (currentCerts.length >= preferredCerts.length) return 100;
    if (requiredMatch >= requiredCerts.length) return 80 + ((preferredMatch - requiredMatch) / (preferredCerts.length - requiredCerts.length)) * 20;
    return Math.max(0, (requiredMatch / requiredCerts.length) * 80);
  };

  const determineReadinessLevel = (score: number): string => {
    if (score >= 85) return 'Ready';
    if (score >= 70) return 'Nearly Ready';
    if (score >= 50) return 'Needs Training';
    return 'Not Ready';
  };

  const calculateMissingRatings = (pilotStats: any, requirements: any): string[] => {
    const required = requirements.ratings || [];
    const current = pilotStats.ratings;
    return required.filter((rating: string) => !current.includes(rating));
  };

  const calculateMissingCertifications = (pilotStats: any, requirements: any): string[] => {
    const required = requirements.certifications || [];
    const current = pilotStats.certifications;
    return required.filter((cert: string) => !current.includes(cert));
  };

  const calculateSkillGaps = (pilotStats: any, requirements: any): string[] => {
    const gaps = [];
    if (pilotStats.ifr_hours < (requirements.ifr_hours || 0)) {
      gaps.push('IFR Experience');
    }
    if (pilotStats.cross_country_hours < (requirements.cross_country_hours || 0)) {
      gaps.push('Cross-country Experience');
    }
    return gaps;
  };

  const generateTrainingRecommendations = (missingHours: number, missingRatings: string[], missingCerts: string[]): string[] => {
    const recommendations = [];
    if (missingHours > 0) {
      recommendations.push(`Build ${missingHours} more flight hours`);
    }
    if (missingRatings.includes('IFR')) {
      recommendations.push('Complete IFR training and rating');
    }
    if (missingRatings.includes('Multi-engine')) {
      recommendations.push('Obtain multi-engine rating');
    }
    if (missingCerts.includes('ATPL')) {
      recommendations.push('Complete ATPL theoretical knowledge exams');
    }
    return recommendations;
  };

  const calculateReadinessMonths = (missingHours: number, missingRatings: string[], missingCerts: string[]): number => {
    let months = 0;
    if (missingHours > 0) months += Math.ceil(missingHours / 20); // 20 hours per month
    if (missingRatings.length > 0) months += missingRatings.length * 3; // 3 months per rating
    if (missingCerts.length > 0) months += missingCerts.length * 2; // 2 months per certification
    return months;
  };

  const filteredMatches = matches.filter(match => {
    if (filterLevel === 'all') return true;
    return match.readiness_level.toLowerCase().replace(' ', '_') === filterLevel;
  });

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'Ready': return '#10b981';
      case 'Nearly Ready': return '#f59e0b';
      case 'Needs Training': return '#f97316';
      case 'Not Ready': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getReadinessIcon = (level: string) => {
    switch (level) {
      case 'Ready': return '✅';
      case 'Nearly Ready': return '⚡';
      case 'Needs Training': return '📚';
      case 'Not Ready': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
          Back
        </button>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
          Pilot Recognition Match
        </h1>
      </div>

      {/* Filter Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['all', 'ready', 'nearly_ready', 'needs_training'].map(level => (
          <button
            key={level}
            onClick={() => setFilterLevel(level as any)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: filterLevel === level ? '#3b82f6' : 'white',
              color: filterLevel === level ? 'white' : '#374151',
              cursor: 'pointer'
            }}
          >
            {level === 'all' ? 'All Jobs' : level.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Analyzing your profile against job opportunities...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredMatches.map(match => (
            <div
              key={match.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onClick={() => setSelectedMatch(match)}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                    {match.job_title}
                  </h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    {match.airline_company} • {match.aircraft_types.join(', ')}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: getReadinessColor(match.readiness_level),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {getReadinessIcon(match.readiness_level)} {match.readiness_level}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {Math.round(match.overall_match_score)}% Match
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getReadinessColor(match.readiness_level) }}>
                    {Math.round(match.overall_match_score)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Overall Match</div>
                </div>
              </div>

              {/* Progress Bars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Hours</div>
                  <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${match.hours_match_score}%`,
                      background: getReadinessColor(match.readiness_level),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ratings</div>
                  <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${match.ratings_match_score}%`,
                      background: getReadinessColor(match.readiness_level),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Experience</div>
                  <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${match.experience_match_score}%`,
                      background: getReadinessColor(match.readiness_level),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Certifications</div>
                  <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${match.certification_match_score}%`,
                      background: getReadinessColor(match.readiness_level),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>

              {/* Quick Gap Summary */}
              {(match.missing_hours > 0 || match.missing_ratings.length > 0 || match.missing_certifications.length > 0) && (
                <div style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#92400e', marginBottom: '0.5rem' }}>
                    Gap Analysis:
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#78350f' }}>
                    {match.missing_hours > 0 && <div>• {match.missing_hours} more flight hours needed</div>}
                    {match.missing_ratings.length > 0 && <div>• Missing ratings: {match.missing_ratings.join(', ')}</div>}
                    {match.missing_certifications.length > 0 && <div>• Missing certifications: {match.missing_certifications.join(', ')}</div>}
                    {match.estimated_readiness_months > 0 && <div>• Estimated readiness: {match.estimated_readiness_months} months</div>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detailed Match Modal */}
      {selectedMatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            margin: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {selectedMatch.job_title}
                </h2>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  {selectedMatch.airline_company} • {selectedMatch.aircraft_types.join(', ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                style={{
                  padding: '0.5rem',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Match Scores */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
                Match Analysis
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>Overall Match</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getReadinessColor(selectedMatch.readiness_level) }}>
                    {Math.round(selectedMatch.overall_match_score)}%
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>Readiness Level</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: getReadinessColor(selectedMatch.readiness_level) }}>
                    {getReadinessIcon(selectedMatch.readiness_level)} {selectedMatch.readiness_level}
                  </div>
                </div>
              </div>
            </div>

            {/* Training Recommendations */}
            {selectedMatch.training_recommendations.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
                  Training Recommendations
                </h3>
                <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '1rem' }}>
                  {selectedMatch.training_recommendations.map((rec, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem', color: '#1e40af' }}>
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedMatch(null)}
              >
                Close
              </button>
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  // Open application URL
                  const job = jobOpportunities.find(j => j.job_id === selectedMatch.job_id);
                  if (job?.application_url) {
                    window.open(job.application_url, '_blank');
                  }
                }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
