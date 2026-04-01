import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { usePilotJobMatches, type JobMatchData } from '../hooks/usePilotJobMatches';

interface JobMatchRequirement {
  label: string;
  required: string;
  userValue: string;
  status: 'met' | 'partial' | 'missing';
  gap?: string;
}

interface MatchReason {
  type: 'strength' | 'match' | 'opportunity';
  text: string;
  detail?: string;
}

interface JobMatchCardProps {
  job: JobMatchData;
  index?: number;
  userProfile?: {
    totalHours?: number;
    examScores?: number;
    interviewRating?: number;
    typeRatings?: string[];
  } | null;
}

export const JobMatchCard: React.FC<JobMatchCardProps> = ({ job, index = 0, userProfile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Animate the match score on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = job.match_score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= job.match_score) {
        setAnimatedScore(job.match_score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [job.match_score]);

  // Calculate score color based on match percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  // Get status icon
  const getStatusIcon = (status: JobMatchRequirement['status']) => {
    switch (status) {
      case 'met': return '✓';
      case 'partial': return '~';
      case 'missing': return '!';
      default: return '•';
    }
  };

  const scoreColor = getScoreColor(job.match_score);
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Find the most critical gap
  const criticalGap = job.requirements.find(r => r.status === 'missing');
  const partialGap = job.requirements.find(r => r.status === 'partial');
  const displayGap = criticalGap || partialGap;

  // Format posted date
  const formatPostedDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
        borderRadius: '24px',
        padding: '1.75rem',
        boxShadow: isHovered 
          ? '0 30px 60px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(255,255,255,0.5)' 
          : '0 10px 30px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255,255,255,0.3)',
        border: '1px solid rgba(226, 232, 240, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle gradient background on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)' 
            : 'transparent',
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none'
        }}
      />

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Airline Logo / Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: job.airline_logo 
              ? 'white' 
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flexShrink: 0,
            overflow: 'hidden'
          }}
        >
          {job.airline_logo ? (
            <img 
              src={job.airline_logo} 
              alt={job.airline}
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontSize: '1.5rem' }}>✈️</span>
          )}
        </div>

        {/* Job Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            margin: '0 0 0.35rem', 
            fontSize: '1.15rem', 
            fontWeight: 700, 
            color: '#0f172a',
            lineHeight: 1.3
          }}>
            {job.position}
          </h3>
          <p style={{ 
            margin: '0 0 0.25rem', 
            fontSize: '0.9rem', 
            color: '#475569',
            fontWeight: 500
          }}>
            {job.airline}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📍</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{job.location}</span>
          </div>
        </div>

        {/* Match Score Ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="42"
              cy="42"
              r="38"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="42"
              cy="42"
              r="38"
              fill="none"
              stroke={scoreColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </svg>
          {/* Score text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              color: scoreColor,
              lineHeight: 1
            }}>
              {animatedScore}
            </span>
            <span style={{ 
              fontSize: '0.6rem', 
              color: '#94a3b8', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}>
              Match
            </span>
          </div>
        </div>
      </div>

      {/* Gap Analysis Badge */}
      {displayGap && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.875rem',
            borderRadius: '999px',
            background: displayGap.status === 'missing' 
              ? 'rgba(239, 68, 68, 0.08)' 
              : 'rgba(245, 158, 11, 0.08)',
            border: `1px solid ${displayGap.status === 'missing' 
              ? 'rgba(239, 68, 68, 0.2)' 
              : 'rgba(245, 158, 11, 0.2)'}`,
            marginBottom: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 700,
            color: displayGap.status === 'missing' ? '#ef4444' : '#f59e0b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {displayGap.status === 'missing' ? 'Missing' : 'Gap'}
          </span>
          <span style={{ 
            fontSize: '0.8rem', 
            color: '#475569',
            fontWeight: 500
          }}>
            {displayGap.gap || `${displayGap.required} → ${displayGap.userValue}`}
          </span>
        </div>
      )}

      {/* Why You Match - Expandable Section */}
      <div
        style={{
          maxHeight: isHovered ? '200px' : '0',
          opacity: isHovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          marginBottom: isHovered ? '1rem' : '0'
        }}
      >
        <p style={{ 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          color: '#94a3b8', 
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: '0 0 0.75rem'
        }}>
          Why You Match
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {job.match_reasons.map((reason: MatchReason, i: number) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                background: reason.type === 'strength' 
                  ? 'rgba(34, 197, 94, 0.06)' 
                  : reason.type === 'match'
                    ? 'rgba(14, 165, 233, 0.06)'
                    : 'rgba(139, 92, 246, 0.06)',
                border: `1px solid ${reason.type === 'strength' 
                  ? 'rgba(34, 197, 94, 0.15)' 
                  : reason.type === 'match'
                    ? 'rgba(14, 165, 233, 0.15)'
                    : 'rgba(139, 92, 246, 0.15)'}`,
                transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
                opacity: isHovered ? 1 : 0,
                transition: `all 0.3s ease ${i * 50}ms`
              }}
            >
              <span style={{ 
                fontSize: '0.75rem',
                color: reason.type === 'strength' 
                  ? '#22c55e' 
                  : reason.type === 'match'
                    ? '#0ea5e9'
                    : '#8b5cf6',
                fontWeight: 700
              }}>
                {reason.type === 'strength' ? '★' : reason.type === 'match' ? '✓' : '↑'}
              </span>
              <div>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: '#0f172a',
                  fontWeight: 500
                }}>
                  {reason.text}
                </span>
                {reason.detail && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b',
                    marginLeft: '0.25rem'
                  }}>
                    {reason.detail}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Mini-Grid */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '0.5rem' 
        }}>
          {job.requirements.slice(0, 4).map((req, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                background: req.status === 'met' 
                  ? 'rgba(34, 197, 94, 0.06)' 
                  : 'rgba(226, 232, 240, 0.5)',
                border: `1px solid ${req.status === 'met' 
                  ? 'rgba(34, 197, 94, 0.15)' 
                  : 'rgba(226, 232, 240, 0.8)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ 
                fontSize: '0.7rem',
                color: req.status === 'met' ? '#22c55e' : '#94a3b8',
                fontWeight: 700
              }}>
                {getStatusIcon(req.status)}
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                color: req.status === 'met' ? '#0f172a' : '#64748b',
                fontWeight: req.status === 'met' ? 600 : 400
              }}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Row */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {job.salary && (
            <span style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: '#059669',
              background: 'rgba(5, 150, 105, 0.08)',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px'
            }}>
              {job.salary}
            </span>
          )}
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Posted {formatPostedDate(job.posted_date)}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {}}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(15, 23, 42, 0.15)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#0f172a',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.color = '#0f172a';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          View Alignment Details
          <Icons.ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
};

// Enhanced Job Matching Section with Smokey Glassmorphism aesthetic
interface JobMatchingSectionProps {
  userId?: string;
  userProfile?: any;
  onViewJobDatabase?: () => void;
  onUpdateInterests?: () => void;
}

export const JobMatchingSection: React.FC<JobMatchingSectionProps> = ({ 
  userId, 
  onViewJobDatabase,
  onUpdateInterests
}) => {
  const { matches, interestJobs, loading, error, hasProfileData, totalJobs } = usePilotJobMatches({
    userId,
    limit: 10,
    enableRealtime: true
  });

  if (loading) {
    return (
      <div
        style={{
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: '24px',
          padding: '1.75rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            color: '#ffffff',
            letterSpacing: '-0.02em'
          }}>
            Loading Job Matches...
          </h3>
        </div>
      </div>
    );
  }

  const showEmptyState = !hasProfileData || matches.length === 0;

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(226, 232, 240, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '32px',
        padding: '2rem',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        overflow: 'hidden'
      }}
    >
      {/* Header - Dark Slate Text */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.75rem', 
            fontWeight: 900, 
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            Available Jobs: <span style={{ color: '#2563eb' }}>{totalJobs}</span>
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            color: '#64748b'
          }}>
            Matches based on your Pilot Recognition Profile
          </p>
        </div>

        {/* Smokey Glass Button */}
        <button
          onClick={onViewJobDatabase}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <Icons.Search style={{ width: 14, height: 14 }} />
          Check out real pilot career expectations
          <Icons.ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* Credential Matches Section */}
      {matches.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
          {matches.map((job, index) => (
            <JobMatchCard 
              key={job.id} 
              job={job} 
              index={index}
            />
          ))}
        </div>
      ) : (
        /* None Matches - Solid Pure White */
        <div
          style={{
            position: 'relative',
            padding: '3rem 2rem',
            textAlign: 'center',
            borderRadius: '16px',
            background: '#ffffff',
            border: '1px solid rgba(203, 213, 225, 0.4)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
            marginBottom: '2rem'
          }}
        >
          <p style={{ 
            margin: '0 0 0.5rem', 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: '#0f172a'
          }}>
            {hasProfileData ? 'No credential matches found' : 'None matches'}
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            color: '#94a3b8',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5
          }}>
            {hasProfileData 
              ? 'No jobs match your current credentials. Try updating your profile or check interest-based recommendations below.'
              : 'Complete your recognition profile to see matching job opportunities'}
          </p>
        </div>
      )}

      {/* Interest-Based Section */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0 0.5rem'
        }}>
          <h4 style={{
            margin: 0,
            fontSize: '0.85rem',
            fontWeight: 900,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.15em'
          }}>
            Based on Your Interests
          </h4>
          {onUpdateInterests && (
            <button
              onClick={onUpdateInterests}
              style={{
                fontSize: '0.8rem',
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
            >
              Update My Interests
            </button>
          )}
        </div>

        {interestJobs.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {interestJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  padding: '1.25rem',
                  background: '#ffffff',
                  border: '1px solid rgba(203, 213, 225, 0.4)',
                  borderRadius: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                }}
                onClick={onViewJobDatabase}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.4)';
                }}
              >
                <div>
                  <p style={{
                    margin: '0 0 0.25rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#0f172a'
                  }}>
                    {job.position}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '0.8rem',
                    color: '#64748b'
                  }}>
                    {job.airline} • {job.location}
                  </p>
                </div>
                <span style={{
                  fontSize: '1.2rem',
                  color: '#2563eb'
                }}>→</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '1.5rem',
              textAlign: 'center',
              borderRadius: '14px',
              background: '#ffffff',
              border: '1px dashed rgba(203, 213, 225, 0.5)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
            }}
          >
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              color: '#94a3b8',
              fontStyle: 'italic'
            }}>
              Syncing with your interest profile...
            </p>
          </div>
        )}
      </div>

      {/* Bottom Smokey Glass CTA */}
      <button
        onClick={onViewJobDatabase}
        style={{
          width: '100%',
          marginTop: '2rem',
          padding: '1rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#ffffff',
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
        }}
      >
        View All Job Opportunities
        <Icons.ArrowRight style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
};
