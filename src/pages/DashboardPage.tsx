import React, { useEffect, useMemo, useState } from 'react';
import { Icons } from '../icons';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { useAirlinePassport } from '../hooks/useAirlinePassport';
import { usePilotPortfolio } from '../hooks/usePilotPortfolio';
import { supabase } from '../lib/supabase-auth';
import PilotLicensureExperiencePage from './PilotLicensureExperiencePage';
import { PathwaysCarousel } from '../components/PathwaysCarousel';
import { PathwayStrategyCarousel } from '../components/PathwayStrategyCarousel';

interface DashboardPageProps {
  onBack: () => void;
  onViewLogbook?: () => void;
  onViewDigitalLogbook?: () => void;
  onViewMentorLogbook?: () => void;
  onViewAtlas?: () => void;
  onViewRecognition?: () => void;
  onViewPrograms?: () => void;
  onViewPathways?: () => void;
  onViewExamination?: () => void;
  onViewExaminationPortal?: () => void;
  onViewFoundationalProgram?: () => void;
  onViewFoundationalPlatform?: () => void;
  onViewFoundationalEnrollment?: () => void;
  onViewLicensureExperience?: () => void;
  onViewJobDatabase?: () => void;
  onViewModule01?: () => void;
  onViewModule02?: () => void;
  isDarkMode?: boolean;
  userProfile?: {
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    licenseType?: string;
    licenseStatus?: string;
    totalHours?: number;
  } | null;
}

const CategorySection: React.FC<{ title: string; description?: string; children: React.ReactNode; isDarkMode?: boolean }> = ({ title, description, children, isDarkMode = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div>
      <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: isDarkMode ? '#94a3b8' : '#94a3b8', fontWeight: 600 }}>{title}</p>
      {description && <p style={{ margin: '0.25rem 0 0', color: isDarkMode ? '#cbd5e1' : '#475569', fontSize: '0.9rem' }}>{description}</p>}
    </div>
    {children}
  </div>
);

const renderCard = (card: {
  title: string;
  description: string;
  cta?: string;
  filled?: boolean;
  progress?: number;
  onClick?: (() => void) | undefined;
}, isDarkMode = false) => (
  <div key={card.title} className="recognition-glass-card" style={{
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
      : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '24px',
    padding: '1.75rem',
    boxShadow: isDarkMode 
      ? '0 20px 45px rgba(0,0,0,0.3)'
      : '0 20px 45px rgba(15, 23, 42, 0.08)',
    border: isDarkMode 
      ? '1px solid rgba(71,85,105,0.5)'
      : '1px solid rgba(255,255,255,0.45)',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '1.5rem',
    alignItems: 'center'
  }}>
    <div>
      <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.25rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{card.title}</h3>
      <p style={{ margin: 0, color: isDarkMode ? '#cbd5e1' : '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>{card.description}</p>
      {card.progress !== undefined && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ height: '6px', borderRadius: '999px', background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0', overflow: 'hidden' }}>
            <div style={{ width: `${card.progress}%`, height: '100%', background: 'linear-gradient(90deg, #34d399, #0ea5e9)' }} />
          </div>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: isDarkMode ? '#94a3b8' : '#475569', fontWeight: 600 }}>{card.progress}% complete</p>
        </div>
      )}
    </div>
    {card.cta && (
      <button
        style={{
          padding: '0.65rem 1.75rem',
          borderRadius: '999px',
          border: card.filled ? 'none' : isDarkMode ? '1px solid rgba(71,85,105,0.8)' : '1px solid #cbd5e1',
          background: card.filled ? '#0ea5e9' : 'transparent',
          color: card.filled ? '#fff' : isDarkMode ? '#f8fafc' : '#0f172a',
          fontWeight: 600,
          cursor: 'pointer'
        }}
        onClick={card.onClick}
      >
        {card.cta}
      </button>
    )}
  </div>
);

// Icon wrapper for safety
const Icon: React.FC<{ name: keyof typeof Icons; style?: React.CSSProperties }> = ({ name, style }) => {
  try {
    const IconComponent = Icons[name];
    if (IconComponent) {
      return <IconComponent style={style} />;
    }
  } catch (error) {
    console.warn(`Icon ${name} failed:`, error);
  }
  const fallbacks: Record<string, string> = {
    ArrowLeft: '←', ArrowRight: '→', Award: '🏆', CheckCircle: '✓',
    Activity: '📊', Clock: '⏱', BookOpen: '📖', FileText: '📄',
    ChevronRight: '›', TrendingUp: '📈', MessageSquare: '💬',
    Clipboard: '📋', Users: '👥'
  };
  return <span style={style}>{fallbacks[name] || '•'}</span>;
};

// Airline Passport Component - Now with Supabase integration
interface AirlinePassportProps {
  userId?: string;
}

const AirlinePassport: React.FC<AirlinePassportProps> = ({ userId }) => {
  const { connections, loading, error, refreshConnections, connectAirline, syncAirlineData } = useAirlinePassport(userId);

  // Default airlines to show if no connections exist
  const defaultAirlines = [
    { id: 'etihad', name: 'Etihad Airways', code: 'EY', logo: 'https://logo.clearbit.com/etihad.com', domain: 'etihad.com' },
    { id: 'airbus', name: 'Airbus', code: 'AB', logo: 'https://logo.clearbit.com/airbus.com', domain: 'airbus.com' },
    { id: 'emirates', name: 'Emirates', code: 'EK', logo: 'https://logo.clearbit.com/emirates.com', domain: 'emirates.com' },
    { id: 'flydubai', name: 'flydubai', code: 'FZ', logo: 'https://logo.clearbit.com/flydubai.com', domain: 'flydubai.com' }
  ];

  const handleConnect = async (airline: typeof defaultAirlines[0]) => {
    await connectAirline(airline.id, airline.name, airline.code, airline.logo);
  };

  const handleSync = async (connectionId: string) => {
    await syncAirlineData(connectionId);
  };

  // Combine real connections with default airlines for display
  const displayAirlines = defaultAirlines.map(airline => {
    const connection = connections.find(c => c.airline_id === airline.id);
    return {
      ...airline,
      status: connection?.status || 'available',
      lastSynced: connection?.last_synced_at 
        ? formatTimeAgo(connection.last_synced_at)
        : undefined,
      matchPercentage: connection?.match_percentage || 0,
      connectionId: connection?.id
    };
  });

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(0,0,0, 0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          🛂
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>
            Airline Passport
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            One-tap sync to recruitment portals
          </p>
        </div>
      </div>

      <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        Share your verified WingMentor Network data directly with airline recruiters. Sync flight hours, competencies, and achievements instantly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {displayAirlines.map((airline) => (
          <div key={airline.id} style={{
            background: airline.status === 'connected' ? 'rgba(16, 185, 129, 0.1)' : 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(51,65,85,0.8))',
            borderRadius: '16px',
            padding: '1.25rem',
            border: airline.status === 'connected' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: airline.status === 'connected' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: airline.status === 'connected'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #64748b, #475569)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {airline.logo ? (
                  <img 
                    src={airline.logo} 
                    alt={airline.name}
                    style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>{airline.code}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f1f5f9' }}>{airline.name}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: airline.status === 'connected' ? '#34d399' : airline.status === 'pending' ? '#fbbf24' : '#94a3b8' }}>
                  {airline.status === 'connected' ? '✓ Connected' : airline.status === 'pending' ? '⏳ Pending' : '○ Available'}
                </div>
              </div>
            </div>

            {airline.status === 'connected' && airline.lastSynced && (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                Last synced {airline.lastSynced}
              </div>
            )}

            {airline.matchPercentage > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginBottom: '0.75rem', fontWeight: 600 }}>
                {airline.matchPercentage}% Profile Match
              </div>
            )}

            <button
              onClick={() => airline.connectionId ? handleSync(airline.connectionId) : handleConnect(airline)}
              disabled={airline.status === 'pending' || loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '12px',
                border: 'none',
                background: airline.status === 'connected'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : airline.status === 'pending'
                    ? '#e2e8f0'
                    : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: airline.status === 'pending' ? '#94a3b8' : 'white',
                fontWeight: 600,
                cursor: airline.status === 'pending' || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? (
                <span>⟳ Syncing...</span>
              ) : airline.status === 'connected' ? (
                <>
                  <span>↻</span> Re-sync Data
                </>
              ) : airline.status === 'pending' ? (
                <>
                  <span>⏳</span> Verification Pending
                </>
              ) : (
                <>
                  <span>⚡</span> Connect & Sync
                </>
              )}
            </button>

            {airline.status === 'connected' && (
              <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', fontSize: '0.75rem', color: '#34d399', textAlign: 'center' }}>
                Flight hours auto-synced to recruitment portal
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(30, 41, 59, 0.6)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>Verified Data Passport</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {displayAirlines.filter(a => a.status === 'connected').length} of {displayAirlines.length} airlines connected
          </div>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>
          ✓ Verified by WingMentor
        </div>
      </div>
      
      {error && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(220, 38, 38, 0.2)', borderRadius: '8px', color: '#f87171', fontSize: '0.875rem' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

// Competency Compass Component
const CompetencyCompass: React.FC<{ 
  scores: {
    knowledge: number;
    recency: number;
    exams: number;
    progress: number;
    interview: number;
    resilience: number;
    awareness: number;
  };
  isDarkMode?: boolean;
}> = ({ scores, isDarkMode = false }) => {
  const competencies = [
    { label: 'Knowledge Depth', score: scores.knowledge, color: '#0ea5e9' },
    { label: 'Recency of Training', score: scores.recency, color: '#10b981' },
    { label: 'Exam Performance', score: scores.exams, color: '#f59e0b' },
    { label: 'Program Progress', score: scores.progress, color: '#8b5cf6' },
    { label: 'Interview Impression', score: scores.interview, color: '#ef4444' },
    { label: 'Situational Awareness', score: scores.awareness, color: '#fb7185' },
    { label: 'Resilience', score: scores.resilience, color: '#f97316' }
  ];

  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const angleStep = (2 * Math.PI) / competencies.length;

  // Calculate polygon points based on scores (0-100)
  const getPoint = (index: number, score: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (score / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  // Generate data polygon points
  const dataPoints = competencies.map((comp, i) => getPoint(i, comp.score));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Generate background pentagon points (max score)
  const bgPoints = Array.from({ length: competencies.length }, (_, i) => getPoint(i, 100));
  const bgPolygon = bgPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Generate intermediate grid lines (25%, 50%, 75%)
  const gridLevels = [25, 50, 75];
  const gridPolygons = gridLevels.map(level => {
    const points = Array.from({ length: competencies.length }, (_, i) => getPoint(i, level));
    return points.map(p => `${p.x},${p.y}`).join(' ');
  });

  // Calculate average score
  const avgScore = Math.round(
    (scores.knowledge + scores.recency + scores.exams + scores.progress + scores.interview + scores.awareness + scores.resilience) /
    competencies.length
  );

  return (
    <div style={{
      background: isDarkMode 
        ? 'linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.9) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: isDarkMode 
        ? '0 20px 60px rgba(0, 0, 0, 0.3)'
        : '0 20px 60px rgba(15, 23, 42, 0.12)',
      border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
        {/* Left side - Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem'
            }}>
              ★
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                Competency Compass
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                Verified Competency Score
              </p>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Just as Uber shows your driver's rating, this radar now blends knowledge depth, training recency, exam performance,
            overall program progress, and interview impressions into a single recruiter-facing score.
          </p>

          {/* Score Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {competencies.map((comp) => (
              <div key={comp.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)',
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71,85,105,0.4)' : '1px solid rgba(226,232,240,0.8)'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: comp.color
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {comp.label}
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: comp.color }}>
                    {comp.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Score Badge */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: isDarkMode 
              ? 'linear-gradient(135deg, #0f172a, #1e293b)'
              : 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Overall Verified Score
              </div>
              <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                Visible to recruiters and airlines
              </div>
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: avgScore >= 90 ? '#10b981' : avgScore >= 75 ? '#0ea5e9' : '#f59e0b'
            }}>
              {avgScore}
            </div>
          </div>
        </div>

        {/* Right side - Radar Chart */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Background circles */}
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {gridPolygons.map((polygon, i) => (
              <polygon
                key={i}
                points={polygon}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            
            {/* Background pentagon */}
            <polygon
              points={bgPolygon}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            
            {/* Data polygon */}
            <polygon
              points={dataPolygon}
              fill="url(#radarGradient)"
              stroke="#0ea5e9"
              strokeWidth="2"
            />
            
            {/* Labels */}
            {competencies.map((comp, i) => {
              const labelPoint = getPoint(i, 115);
              return (
                <g key={comp.label}>
                  <circle
                    cx={labelPoint.x}
                    cy={labelPoint.y}
                    r="4"
                    fill={comp.color}
                  />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#475569"
                    fontWeight="600"
                  >
                    {comp.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

type FlightLogEntry = {
  id: string;
  date?: string;
  aircraft?: string;
  route?: string;
  hours?: number;
  remarks?: string;
};

// Pilot Recognition Ticker Component - Shows actual airline readiness based on real pilot data
interface AirlineReadiness {
  airline: string;
  status: 'eligible' | 'developing' | 'not-ready';
  matchScore: number;
  requirements: string[];
  metRequirements: string[];
}

const PilotRecognitionTicker: React.FC<{ 
  flightHours: number; 
  examPassRate: string;
  licenseType: string;
  airlineConnections: { name: string; status: string }[];
}> = ({ flightHours, examPassRate, licenseType, airlineConnections }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Calculate readiness based on actual pilot data
  const calculateReadiness = (): AirlineReadiness[] => {
    const passRateNum = parseInt(examPassRate) || 0;
    const hours = flightHours || 0;
    
    return airlineConnections.map(conn => {
      const requirements: string[] = [];
      const met: string[] = [];
      let score = 0;
      
      // Base requirements for any airline
      if (conn.name === 'Emirates') {
        requirements.push('3500+ flight hours', 'ATPL License', '90%+ exam scores', 'Type Rating');
        if (hours >= 3500) { met.push('Flight hours'); score += 25; }
        if (licenseType.includes('ATPL')) { met.push('ATPL License'); score += 25; }
        if (passRateNum >= 90) { met.push('Exam scores'); score += 25; }
        score += 25; // Assume type rating in progress
      } else if (conn.name === 'Etihad') {
        requirements.push('2000+ flight hours', 'CPL License', '85%+ exam scores');
        if (hours >= 2000) { met.push('Flight hours'); score += 33; }
        if (licenseType.includes('CPL') || licenseType.includes('ATPL')) { met.push('License'); score += 33; }
        if (passRateNum >= 85) { met.push('Exam scores'); score += 34; }
      } else if (conn.name === 'Fly Dubai') {
        requirements.push('1500+ flight hours', 'CPL License', '80%+ exam scores');
        if (hours >= 1500) { met.push('Flight hours'); score += 33; }
        if (licenseType.includes('CPL') || licenseType.includes('ATPL')) { met.push('License'); score += 33; }
        if (passRateNum >= 80) { met.push('Exam scores'); score += 34; }
      } else {
        requirements.push('1000+ flight hours', 'Valid License', '75%+ exam scores');
        if (hours >= 1000) { met.push('Flight hours'); score += 33; }
        if (!licenseType.includes('Student')) { met.push('License'); score += 33; }
        if (passRateNum >= 75) { met.push('Exam scores'); score += 34; }
      }
      
      let status: AirlineReadiness['status'] = 'not-ready';
      if (score >= 85) status = 'eligible';
      else if (score >= 60) status = 'developing';
      
      return {
        airline: conn.name,
        status,
        matchScore: Math.min(score, 100),
        requirements,
        metRequirements: met
      };
    });
  };
  
  const readinessData = calculateReadiness();
  
  useEffect(() => {
    if (readinessData.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % readinessData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [readinessData.length]);

  if (readinessData.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          No airline connections. Add airlines to your profile to see recognition status.
        </div>
      </div>
    );
  }

  const current = readinessData[currentIndex];
  
  const statusConfig = {
    eligible: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)', label: 'Eligible' },
    developing: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', label: 'Developing' },
    'not-ready': { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', label: 'Building' }
  };
  
  const statusStyle = statusConfig[current.status];

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      borderRadius: '20px',
      padding: '1.25rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.9rem',
        background: statusStyle.bgColor,
        borderRadius: '999px',
        border: `1px solid ${statusStyle.color}40`
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: statusStyle.color
        }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: statusStyle.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {statusStyle.label}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div key={currentIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'slideIn 0.5s ease' }}>
          <span style={{ fontSize: '1.3rem' }}>🏆</span>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{current.airline}:</span>
          <span style={{ fontSize: '1rem', color: '#cbd5f5' }}>
            {current.metRequirements.length}/{current.requirements.length} requirements met
          </span>
          <span style={{
            marginLeft: 'auto',
            padding: '0.25rem 0.9rem',
            background: current.matchScore >= 85 ? 'rgba(34, 197, 94, 0.2)' : current.matchScore >= 60 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: current.matchScore >= 85 ? '#22c55e' : current.matchScore >= 60 ? '#f59e0b' : '#ef4444'
          }}>
            {current.matchScore}% Match
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {readinessData.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              background: i === currentIndex ? '#38bdf8' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        `}
      </style>
    </div>
  );
};

// Job Matching Section Component - Now imported from JobMatchCard.tsx
import { JobMatchingSection } from '../components/JobMatchCard';

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onBack, onViewLogbook, onViewDigitalLogbook, onViewMentorLogbook, onViewAtlas, 
  onViewRecognition, onViewPrograms, onViewPathways, onViewExamination, onViewExaminationPortal, onViewFoundationalProgram, onViewFoundationalPlatform, onViewLicensureExperience, onViewJobDatabase, onViewModule01, onViewModule02, userProfile, isDarkMode = false 
}) => {
  const [competencyScores] = useState({
    knowledge: 86,
    recency: 73,
    exams: 92,
    progress: 68,
    interview: 81,
    awareness: 88,
    resilience: 84
  });
  const [airlineAffiliations, setAirlineAffiliations] = useState([
    { id: 'etihad', name: 'Etihad Airways', logo: 'EY', status: 'connected' as const, lastSynced: '2 hours ago' },
    { id: 'airbus', name: 'Airbus', logo: 'AB', status: 'connected' as const, lastSynced: '1 day ago' },
    { id: 'emirates', name: 'Emirates', logo: 'EK', status: 'pending' as const },
    { id: 'flydubai', name: 'flydubai', logo: 'FZ', status: 'available' as const }
  ]);
  const baseCardStyle: React.CSSProperties = {
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
      : 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(241,245,249,0.75))',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: isDarkMode 
      ? '0 20px 45px rgba(0,0,0,0.3)'
      : '0 20px 45px rgba(15,23,42,0.08)',
    border: isDarkMode 
      ? '1px solid rgba(71,85,105,0.5)'
      : '1px solid rgba(255,255,255,0.45)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)'
  };
  const [pilotData, setPilotData] = useState({
    name: `${userProfile?.firstName || 'Benjamin'} ${userProfile?.lastName || 'Bowler'}`,
    initials: `${(userProfile?.firstName || 'Benjamin')[0]}${(userProfile?.lastName || 'Bowler')[0]}`.toUpperCase(),
    role: 'STUDENT PILOT',
    base: 'EGLL (London Heathrow)',
    studyHours: 2,
    examHours: 0,
    totalHours: 0,
    picHours: 0,
    licenseType: 'Student Pilot',
    licenseStatus: 'Pending Verification',
    avgRating: '0%',
    passRate: '0%',
    interviewCount: 0,
    flightLogbookHours: 0,
    mentorHours: 'UNENROLLED / N/A',
    foundationalProgress: 'FOUNDATIONAL PROGRAM IN PROGRESS',
    radioLicenseNumber: 'N/A',
    radioLicenseExpiry: 'TBD',
    lastFlownDate: 'Not yet logged'
  });
  const [flightLogs, setFlightLogs] = useState<FlightLogEntry[]>([]);
  const [flightLogsLoading, setFlightLogsLoading] = useState(false);
  const [mentorHoursLabel, setMentorHoursLabel] = useState('0 hrs');
  const [latestLogbookHours, setLatestLogbookHours] = useState(0);
  const [foundationalPlatformLoading, setFoundationalPlatformLoading] = useState(false);
  const { portfolio, updatePortfolio } = usePilotPortfolio(userProfile?.uid);
  
  // New state variables for redesigned portfolio
  const [progress, setProgress] = useState({ foundational: 0 });
  const [stats, setStats] = useState({ awards: 0, certifications: 0 });
  const completedCount = 0;
  const totalCount = 7;
  
  // Module progress state - tracks mentorship modules status
  const [moduleProgress, setModuleProgress] = useState({
    module1: { 
      completed: true, 
      name: 'Industry Familiarization & Indoctrination', 
      description: 'Introduction to the pilot gap analysis framework. Understand your current position and identify key areas for development in your aviation career.',
      duration: '45 min',
      current: false 
    },
    module2: { 
      completed: false, 
      name: 'Psychology of Mentorship & Practical Application', 
      description: 'Advanced mentorship techniques and practical application of the WingMentor methodology. Build actionable strategies for career advancement.',
      duration: '60 min',
      current: true 
    },
    module3: { 
      completed: false, 
      name: 'Pilot Risk Management & Pilot Pathways', 
      description: 'Comprehensive integration of concepts from previous modules. Focus on portfolio development, examination preparation, and mentorship consolidation.',
      duration: '75 min',
      current: false,
      locked: false,
      lockedReason: ''
    }
  });
  
  // Mentorship enrollment state from Supabase
  const [mentorshipEnrolled, setMentorshipEnrolled] = useState(true);
  const [mentorshipHoursRemaining, setMentorshipHoursRemaining] = useState(50);

  // Licensure data from Supabase
  interface LicensureData {
    current_license?: string[];
    license_number?: string;
    license_expiry?: string;
    medical_class?: string;
    medical_expiry?: string;
    medical_country?: string;
    radio_license_expiry?: string;
    aircraft_ratings?: { aircraftType: string; ratingDate: string; isCurrent: boolean }[];
    languages?: string;
    english_proficiency?: string;
    job_experiences?: { company: string; position: string; fromDate: string; toDate: string; description: string }[];
    current_occupation?: string;
    current_employer?: string;
    current_position?: string;
  }
  const [licensureData, setLicensureData] = useState<LicensureData | null>(null);
  const [licensureLoading, setLicensureLoading] = useState(true);

  useEffect(() => {
    const fetchFirebaseData = async () => {
      if (!userProfile?.uid || !db) {
        return;
      }

      let updatedRadioNumber = pilotData.radioLicenseNumber;
      let updatedRadioExpiry = pilotData.radioLicenseExpiry;
      let lastEntryDate = pilotData.lastFlownDate;

      try {
        // Fetch study sessions from Supabase
        const { data: studyData, error: studyError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', userProfile.uid)
          .order('session_date', { ascending: false });

        if (studyError) {
          throw studyError;
        }

        let totalStudyMinutes = 0;
        (studyData || []).forEach((session) => {
          totalStudyMinutes += session.duration || 0;
        });
        const studyHours = Math.round(totalStudyMinutes / 60);

        // Fetch exam results from Supabase
        const { data: examData, error: examError } = await supabase
          .from('pilot_exams')
          .select('*')
          .eq('user_id', userProfile.uid)
          .order('exam_date', { ascending: false });

        if (examError) {
          throw examError;
        }

        let examHours = 0;
        let totalScore = 0;
        let examCount = 0;
        let passedCount = 0;
        (examData || []).forEach((exam) => {
          examHours += exam.duration || 0;
          if (exam.score !== undefined) {
            totalScore += Number(exam.score);
            examCount++;
          }
          if (exam.passed) passedCount++;
        });
        
        const avgRating = examCount > 0 ? `${Math.round(totalScore / examCount)}%` : '0%';
        const passRate = examCount > 0 ? `${Math.round((passedCount / examCount) * 100)}%` : '0%';

        // Fetch flight logbook hours from Supabase
        setFlightLogsLoading(true);
        const { data: logbookData, error: logbookError } = await supabase
          .from('pilot_flight_logs')
          .select('*')
          .eq('user_id', userProfile.uid)
          .order('date', { ascending: false });

        if (logbookError) {
          throw logbookError;
        }

        let totalFlightHours = 0;
        const entries: FlightLogEntry[] = (logbookData || []).map((log) => {
          totalFlightHours += Number(log.hours) || 0;
          return {
            id: log.id,
            date: log.date,
            aircraft: log.aircraft_type || log.aircraft,
            route: log.route,
            hours: Number(log.hours),
            remarks: log.remarks || ''
          };
        });

        if (entries[0]?.date) {
          lastEntryDate = new Date(entries[0].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }

        let licenseType = pilotData.licenseType;
        let licenseStatus = pilotData.licenseStatus;
        let totalHoursOverride = pilotData.totalHours;
        let picHoursOverride = pilotData.picHours;
        let foundationalProgress = pilotData.foundationalProgress;

        try {
          const { data: profileData, error: profileError } = await supabase
            .from('pilot_profiles')
            .select('*')
            .eq('user_id', userProfile.uid)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (profileData) {
            licenseType = profileData.license_type || licenseType;
            licenseStatus = profileData.license_status || licenseStatus;
            totalHoursOverride = profileData.total_hours ?? totalHoursOverride;
            picHoursOverride = profileData.pic_hours ?? picHoursOverride;
            updatedRadioNumber = profileData.radio_license_number || updatedRadioNumber;
            updatedRadioExpiry = profileData.radio_license_expiry || updatedRadioExpiry;
          }
        } catch (profileError) {
          console.warn('Unable to load pilot profile license info:', profileError);
        }

        try {
          const { data: progressData, error: progressError } = await supabase
            .from('program_progress')
            .select('*')
            .eq('user_id', userProfile.uid)
            .eq('program_type', 'foundational')
            .single();

          if (progressError && progressError.code !== 'PGRST116') {
            throw progressError;
          }

          if (progressData) {
            const percent = Math.round(progressData.completion_percentage ?? 0);
            foundationalProgress = `${percent}% complete`;
          }
        } catch (progressError) {
          console.warn('Unable to load foundational progress:', progressError);
        }

        // Fetch mentor hours from study_sessions for mentorship entries
        let totalMentorHours = 0;
        try {
          // TEMPORARY: Force mentorship enrollment to true for testing
          console.log('🔧 FORCING mentorship enrollment to TRUE');
          setMentorshipEnrolled(true);
          
          // Also fetch the actual data for display
          const SUPABASE_PROFILE_ID = 'aab93297-93f6-4524-b475-8d7ae20e25a9';
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('enrolled_programs')
            .eq('id', SUPABASE_PROFILE_ID)
            .single();
          
          console.log('📊 Profile lookup result:', { profileData, profileError, email: userProfile?.email });
          
          if (profileError) {
            console.error('❌ Profile lookup error:', profileError);
          } else if (profileData && profileData.enrolled_programs) {
            const enrolledPrograms = profileData.enrolled_programs;
            console.log('📋 Enrolled programs found:', enrolledPrograms);
            
            if (Array.isArray(enrolledPrograms)) {
              const hasMentorship = enrolledPrograms.some((p: string) => 
                p.toLowerCase().includes('mentor') || p.toLowerCase().includes('mentorship')
              );
              console.log('🔍 Mentorship check:', hasMentorship);
              
              if (hasMentorship) {
                console.log('✅ Setting mentorshipEnrolled to TRUE');
                setMentorshipEnrolled(true);
              }
            }
          } else {
            console.log('⚠️ No enrolled_programs data found');
          }

          const { data: mentorData, error: mentorError } = await supabase
            .from('study_sessions')
            .select('*')
            .eq('user_id', userProfile.uid)
            .eq('session_type', 'mentorship')
            .order('session_date', { ascending: false });

          if (mentorError) {
            console.warn('Unable to fetch mentor hours:', mentorError);
          } else if (mentorData && mentorData.length > 0) {
            let mentorMinutes = 0;
            mentorData.forEach((session) => {
              mentorMinutes += session.duration || 0;
            });
            totalMentorHours = Math.round(mentorMinutes / 60 * 10) / 10; // Round to 1 decimal
            setMentorHoursLabel(`${totalMentorHours} hr`);
            // Update remaining hours countdown (50 hrs total)
            setMentorshipHoursRemaining(Math.max(0, 50 - Math.round(totalMentorHours)));
          }
        } catch (mentorError) {
          console.warn('Unable to load mentor hours:', mentorError);
        }

        const logbookHoursRounded = parseFloat(totalFlightHours.toFixed(1));

        setPilotData((prev) => ({
          ...prev,
          studyHours,
          examHours: Math.round(examHours / 60),
          avgRating,
          passRate,
          flightLogbookHours: logbookHoursRounded,
          licenseType,
          licenseStatus,
          totalHours: logbookHoursRounded,
          picHours: picHoursOverride,
          foundationalProgress,
          radioLicenseNumber: updatedRadioNumber,
          radioLicenseExpiry: updatedRadioExpiry,
          lastFlownDate: lastEntryDate
        }));
        setLatestLogbookHours(logbookHoursRounded);
        setFlightLogs(entries);
        setFlightLogsLoading(false);
      } catch (error) {
        console.error('Error fetching pilot data:', error);
        setFlightLogsLoading(false);
      }
    };

    fetchFirebaseData();
  }, [userProfile?.uid]);

  // Fetch licensure data from Supabase
  useEffect(() => {
    const fetchLicensureData = async () => {
      if (!userProfile?.uid) {
        setLicensureLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('pilot_licensure_experience')
          .select('*')
          .eq('user_id', userProfile.uid)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn('Error fetching licensure data:', error);
        }

        if (data) {
          setLicensureData({
            current_license: data.current_license || [],
            license_number: data.license_number,
            license_expiry: data.license_expiry,
            medical_class: data.medical_class,
            medical_expiry: data.medical_expiry,
            medical_country: data.medical_country,
            radio_license_expiry: data.radio_license_expiry,
            aircraft_ratings: data.aircraft_ratings || [],
            languages: data.languages,
            english_proficiency: data.english_proficiency,
            job_experiences: data.job_experiences || [],
            current_occupation: data.current_occupation,
            current_employer: data.current_employer,
            current_position: data.current_position
          });
        }
      } catch (error) {
        console.warn('Error fetching licensure data:', error);
      } finally {
        setLicensureLoading(false);
      }
    };

    fetchLicensureData();
  }, [userProfile?.uid]);

  return (
    <div className="dashboard-container animate-fade-in pilot-profile-page" style={{ backgroundColor: '#eef4fb', paddingBottom: '4rem' }}>
      <main
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '100vh'
        }}
      >
        {/* Foundation Program Platform Loading Screen */}
        {foundationalPlatformLoading && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: 'clamp(1rem, 3vw, 3rem)',
            }}
          >
            <div
              style={{
                maxWidth: '520px',
                width: '100%',
                background: 'white',
                borderRadius: '28px',
                padding: '3rem',
                boxShadow: '0 30px 80px rgba(15, 23, 42, 0.15)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                animation: 'fadeIn 0.4s ease-out'
              }}
            >
              {/* Logo */}
              <img
                src="/logo.png"
                alt="WingMentor"
                style={{
                  width: '220px',
                  height: 'auto'
                }}
              />

              {/* Loading Screen Title */}
              <div style={{ textAlign: 'center' }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    textAlign: 'center',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Loading Screen
                </h1>
                <p
                  style={{
                    margin: '0.75rem 0 0',
                    fontSize: '1rem',
                    color: '#64748b',
                    textAlign: 'center'
                  }}
                >
                  Foundational Program Platform
                </p>
              </div>

              {/* Loading Spinner */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '4px solid #e2e8f0',
                  borderTopColor: '#0ea5e9',
                  borderRightColor: '#0ea5e9',
                  animation: 'spin 1s linear infinite'
                }}
              />

              {/* Loading Steps */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  width: '100%'
                }}
              >
                {[
                  'Verifying enrollment status',
                  'Loading training modules',
                  'Preparing simulator scenarios'
                ].map((step, index) => (
                  <div
                    key={step}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.9rem',
                      color: '#475569',
                      padding: '0.5rem 0'
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#0ea5e9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #0ea5e9, #0284c7)',
                    borderRadius: '999px',
                    animation: 'loadingProgress 2.5s ease-in-out infinite'
                  }}
                />
              </div>
            </div>

            {/* Keyframe Animations */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes loadingProgress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0); }
                100% { transform: translateX(100%); }
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Header - Matching News & Updates Style */}
        <header className="pilot-profile-header" style={{
          padding: '3rem 4rem',
          background: isDarkMode 
            ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(180deg, #fff 0%, #f0f4fb 100%)',
          position: 'relative',
          textAlign: 'center',
          borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
        }}>
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isDarkMode ? '#94a3b8' : '#475569'
            }}
          >
            <Icon name="ArrowLeft" style={{ width: 16, height: 16 }} />
            Back to Hub
          </button>

          <div style={{ marginBottom: '2rem', marginTop: '0.5rem' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain' }} />
          </div>
          
          <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
            Connecting Pilots to the Industry
          </div>
          
          <h1 style={{ 
            fontFamily: 'Georgia, serif', 
            fontSize: 'clamp(2rem, 5vw, 3.25rem)', 
            fontWeight: 400, 
            color: isDarkMode ? '#f8fafc' : '#0f172a', 
            marginBottom: '1rem', 
            letterSpacing: '-0.02em', 
            lineHeight: 1.15 
          }}>
            Dashboard
          </h1>
          
          <p style={{ 
            color: isDarkMode ? '#94a3b8' : '#64748b', 
            fontSize: '1.15rem', 
            lineHeight: 1.7, 
            maxWidth: '36rem', 
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            Your central hub for flight logs, training records, program progress, and career development resources.
          </p>
        </header>

        <section style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* 1. Pilot Programs Progress */}
            <div style={{ marginBottom: '3rem' }}>
              {/* Section Header */}
              <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', margin: '0 0 0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
                  Programs
                </h2>
                <p style={{ margin: '0', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '500px' }}>
                  Track your training progress and program enrollment across all WingMentor programs
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Foundational Program Card - Clickable */}
                <div
                  onClick={() => {
                    const isEnrolled = progress.foundational > 0 || pilotData.foundationalProgress !== 'UNENROLLED / N/A';
                    if (isEnrolled) {
                      // Navigate to platform in full-screen
                      onViewFoundationalPlatform?.();
                    } else {
                      onViewFoundationalEnrollment?.();
                    }
                  }}
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                      : 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: isDarkMode 
                      ? '0 20px 45px rgba(0,0,0,0.3)'
                      : '0 20px 45px rgba(15,23,42,0.08)',
                    border: isDarkMode 
                      ? '1px solid rgba(71,85,105,0.5)'
                      : '1px solid rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,1), rgba(15,23,42,0.95))'
                      : 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 25px 50px rgba(0,0,0,0.4)'
                      : '0 25px 50px rgba(15,23,42,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                      : 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 20px 45px rgba(0,0,0,0.3)'
                      : '0 20px 45px rgba(15,23,42,0.08)';
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Core Training</span>
                    <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Foundational Program</h3>
                  </div>
                  
                  <p style={{ margin: 0, color: isDarkMode ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Master core aviation fundamentals, instrument procedures, and CRM techniques through structured simulator training.
                  </p>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#475569', marginBottom: '0.5rem' }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 600, color: '#0ea5e9' }}>{progress.foundational}%</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(226, 232, 240, 0.6)', overflow: 'hidden' }}>
                      <div style={{ width: `${progress.foundational}%`, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #0284c7)', borderRadius: '999px' }} />
                    </div>
                  </div>
                  
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: (progress.foundational > 0 || pilotData.foundationalProgress !== 'UNENROLLED / N/A') ? 'rgba(14, 165, 233, 0.9)' : '#10b981',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {(progress.foundational > 0 || pilotData.foundationalProgress !== 'UNENROLLED / N/A') ? 'Access Platform →' : 'Enroll Now →'}
                  </div>
                </div>

                {/* Transition Program Card - EBT CBTA Interview - Clickable */}
                <a
                  href="/transition-program"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.75))'
                      : 'rgba(243, 244, 246, 0.9)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: isDarkMode 
                      ? '0 20px 45px rgba(0,0,0,0.3)'
                      : '0 20px 45px rgba(15,23,42,0.04)',
                    border: isDarkMode 
                      ? '1px solid rgba(71,85,105,0.4)'
                      : '1px solid rgba(209, 213, 219, 0.5)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.9))'
                      : 'rgba(229, 231, 235, 0.95)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 25px 50px rgba(0,0,0,0.4)'
                      : '0 25px 50px rgba(15,23,42,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.75))'
                      : 'rgba(243, 244, 246, 0.9)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 20px 45px rgba(0,0,0,0.3)'
                      : '0 20px 45px rgba(15,23,42,0.04)';
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AIRBUS Aligned</span>
                    <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#6b7280' }}>EBT CBTA Initial Pilot Recognition Interview</h3>
                  </div>
                  
                  <p style={{ margin: 0, color: isDarkMode ? '#cbd5e1' : '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    AIRBUS-aligned Evidence-Based Training and Competency-Based Training & Assessment interview for initial pilot recognition and industry placement readiness.
                  </p>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#9ca3af', marginBottom: '0.5rem' }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 600 }}>Locked</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(209, 213, 219, 0.5)', overflow: 'hidden' }}>
                      <div style={{ width: '0%', height: '100%', background: isDarkMode ? '#64748b' : '#9ca3af', borderRadius: '999px' }} />
                    </div>
                  </div>
                  
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : '#d1d5db',
                      color: isDarkMode ? '#94a3b8' : '#9ca3af',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textAlign: 'center'
                    }}
                  >
                    Coming Soon
                  </div>
                </a>

                {/* Examination Portal Access Card - Black */}
                <div
                  onClick={() => {
                    console.log('Card clicked, onViewExaminationPortal:', onViewExaminationPortal);
                    onViewExaminationPortal?.();
                  }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: '0 20px 45px rgba(15,23,42,0.2)',
                    border: '1px solid rgba(51, 65, 85, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/examinationterminalapp.png" alt="Examination Portal" style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Assessments</span>
                      <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Examination Portal</h3>
                    </div>
                  </div>
                  
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Access your examination portal, view results, and track your assessment progress across all modules.
                  </p>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
                      <span>Latest Score</span>
                      <span style={{ fontWeight: 600, color: '#10b981' }}>{competencyScores.exams}%</span>
                    </div>
                  </div>
                  
                  <button
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      background: 'transparent',
                      color: '#f8fafc',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Access Portal clicked, onViewExaminationPortal:', onViewExaminationPortal);
                      onViewExaminationPortal?.();
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Access Portal →
                  </button>
                </div>

                {/* Program Stats Card - Glassy Grey Style */}
                <div style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                    : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  boxShadow: isDarkMode 
                    ? '0 20px 45px rgba(0,0,0,0.3)'
                    : '0 20px 45px rgba(15,23,42,0.08)',
                  border: isDarkMode 
                    ? '1px solid rgba(71,85,105,0.5)'
                    : '1px solid rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: isDarkMode ? '#f8fafc' : '#0f172a',
                  gridColumn: '1 / -1'
                }}>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Program Overview</h3>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                    <div style={{ 
                      background: isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(248, 250, 252, 0.8)', 
                      borderRadius: '12px', 
                      padding: '1rem', 
                      textAlign: 'center', 
                      flex: 1, 
                      border: isDarkMode ? '1px solid rgba(71,85,105,0.3)' : '1px solid rgba(226,232,240,0.5)' 
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>{completedCount}</div>
                      <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: '0.25rem' }}>Modules Completed</div>
                    </div>
                    <div style={{ 
                      background: isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(248, 250, 252, 0.8)', 
                      borderRadius: '12px', 
                      padding: '1rem', 
                      textAlign: 'center', 
                      flex: 1, 
                      border: isDarkMode ? '1px solid rgba(71,85,105,0.3)' : '1px solid rgba(226,232,240,0.5)' 
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>{competencyScores.exams}%</div>
                      <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: '0.25rem' }}>Latest Exam Score</div>
                    </div>
                    <div style={{ 
                      background: isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(248, 250, 252, 0.8)', 
                      borderRadius: '12px', 
                      padding: '1rem', 
                      textAlign: 'center', 
                      flex: 1, 
                      border: isDarkMode ? '1px solid rgba(71,85,105,0.3)' : '1px solid rgba(226,232,240,0.5)' 
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>{competencyScores.recency}%</div>
                      <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: '0.25rem' }}>FAA Recency Score</div>
                    </div>
                    <div style={{ 
                      background: isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(248, 250, 252, 0.8)', 
                      borderRadius: '12px', 
                      padding: '1rem', 
                      textAlign: 'center', 
                      flex: 1, 
                      border: isDarkMode ? '1px solid rgba(71,85,105,0.3)' : '1px solid rgba(226,232,240,0.5)' 
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>{mentorshipHoursRemaining} hrs</div>
                      <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: '0.25rem' }}>Mentorship Hours Left</div>
                    </div>
                  </div>
                </div>

                {/* Mentorship Logbook Card - Glassy Grey Style */}
                <div style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                    : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  boxShadow: isDarkMode 
                    ? '0 20px 45px rgba(0,0,0,0.3)'
                    : '0 20px 45px rgba(15,23,42,0.08)',
                  border: isDarkMode 
                    ? '1px solid rgba(71,85,105,0.5)'
                    : '1px solid rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: isDarkMode ? '#f8fafc' : '#0f172a',
                  gridColumn: '1 / -1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Mentorship Logbook</h3>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Track your mentorship sessions and hours</p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: mentorshipEnrolled ? (isDarkMode ? '#94a3b8' : '#64748b') : (isDarkMode ? '#64748b' : '#94a3b8') }}>
                          {mentorshipEnrolled ? mentorHoursLabel : '0 hr'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: '0.25rem' }}>
                          Total Mentor Hours
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (mentorshipEnrolled) {
                            // Navigate to mentorship logbook page
                            onViewMentorLogbook?.();
                          } else {
                            // Navigate to mentorship enrollment page
                            window.location.href = '/mentorship-enroll';
                          }
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '12px',
                          border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid rgba(100, 116, 139, 0.3)',
                          background: mentorshipEnrolled 
                            ? (isDarkMode ? 'rgba(30,41,59,0.6)' : 'rgba(255, 255, 255, 0.5)') 
                            : (isDarkMode ? 'rgba(15,23,42,0.4)' : 'rgba(255, 255, 255, 0.3)'),
                          color: mentorshipEnrolled ? (isDarkMode ? '#f8fafc' : '#0f172a') : (isDarkMode ? '#94a3b8' : '#64748b'),
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = mentorshipEnrolled 
                            ? (isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255, 255, 255, 0.8)') 
                            : (isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255, 255, 255, 0.5)');
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = mentorshipEnrolled 
                            ? (isDarkMode ? 'rgba(30,41,59,0.6)' : 'rgba(255, 255, 255, 0.5)') 
                            : (isDarkMode ? 'rgba(15,23,42,0.4)' : 'rgba(255, 255, 255, 0.3)');
                        }}
                      >
                        {mentorshipEnrolled ? 'Access Logbook' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modules Access Card - Glassy Grey Style */}
                <div style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                    : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  boxShadow: isDarkMode 
                    ? '0 20px 45px rgba(0,0,0,0.3)'
                    : '0 20px 45px rgba(15,23,42,0.08)',
                  border: isDarkMode 
                    ? '1px solid rgba(71,85,105,0.5)'
                    : '1px solid rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: isDarkMode ? '#f8fafc' : '#0f172a',
                  gridColumn: '1 / -1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Modules Access</h3>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        Continue your mentorship journey through structured modules
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {/* Module 1 */}
                    <div
                      style={{
                        background: moduleProgress.module1.completed 
                          ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(236, 253, 245, 0.6)')
                          : (isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.6)'),
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: isDarkMode ? '1px solid rgba(71,85,105,0.4)' : '1px solid rgba(226,232,240,0.5)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Module 1</span>
                        <h4 style={{ margin: '0.5rem 0 0', fontSize: '1rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{moduleProgress.module1.name}</h4>
                        <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>{moduleProgress.module1.description}</p>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: isDarkMode ? '#64748b' : '#94a3b8' }}>{moduleProgress.module1.duration}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewModule01?.();
                          }}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: moduleProgress.module1.completed ? 'rgba(16, 185, 129, 0.9)' : '#2563eb',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = moduleProgress.module1.completed ? 'rgba(5, 150, 105, 0.9)' : '#1d4ed8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = moduleProgress.module1.completed ? 'rgba(16, 185, 129, 0.9)' : '#2563eb';
                          }}
                        >
                          {moduleProgress.module1.completed ? 'Recap' : 'Launch Module'}
                        </button>
                      </div>
                    </div>

                    {/* Module 2 */}
                    <div
                      style={{
                        background: moduleProgress.module2.current 
                          ? (isDarkMode ? 'rgba(37, 99, 235, 0.15)' : 'rgba(240, 249, 255, 0.6)')
                          : (isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.6)'),
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: moduleProgress.module2.current 
                          ? (isDarkMode ? '1px solid rgba(37, 99, 235, 0.4)' : '1px solid rgba(37, 99, 235, 0.3)')
                          : (isDarkMode ? '1px solid rgba(71,85,105,0.4)' : '1px solid rgba(226,232,240,0.5)'),
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Module 2</span>
                          {moduleProgress.module2.current && (
                            <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>Current</span>
                          )}
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{moduleProgress.module2.name}</h4>
                        <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>{moduleProgress.module2.description}</p>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: isDarkMode ? '#64748b' : '#94a3b8' }}>{moduleProgress.module2.duration}</p>
                        <button
                          onClick={() => {
                            onViewModule02?.();
                          }}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#2563eb',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#1d4ed8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#2563eb';
                          }}
                        >
                          Open Module
                        </button>
                      </div>
                    </div>

                    {/* Module 3 */}
                    <div
                      style={{
                        background: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(248, 250, 252, 0.4)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: isDarkMode ? '1px solid rgba(71,85,105,0.3)' : '1px solid rgba(226,232,240,0.5)',
                        opacity: 0.7,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Module 3</span>
                          <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#64748b' : '#94a3b8', fontWeight: 600 }}>Locked</span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{moduleProgress.module3.name}</h4>
                        <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>{moduleProgress.module3.description}</p>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: isDarkMode ? '#64748b' : '#94a3b8' }}>{moduleProgress.module3.duration}</p>
                        <button
                          disabled
                          style={{
                            width: '100%',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            border: isDarkMode ? '1px solid rgba(71,85,105,0.3)' : '1px solid rgba(148, 163, 184, 0.3)',
                            background: isDarkMode ? 'rgba(15,23,42,0.4)' : 'rgba(148, 163, 184, 0.2)',
                            color: isDarkMode ? '#64748b' : '#94a3b8',
                            fontWeight: 600,
                            cursor: 'not-allowed',
                            fontSize: '0.9rem'
                          }}
                        >
                          {moduleProgress.module3.lockedReason}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Pilot Recognition */}
            <div style={{ marginBottom: '3rem' }}>
              {/* Section Header - Matching Programs Format */}
              <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', margin: '0 0 0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
                  Pilot Recognition & Achievements
                </h2>
                <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Your Pilot Digital Footprint to Pathways
                </p>
                <p style={{ margin: '0', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '500px' }}>
                  View your awards, flight hours, certifications, and professional milestones earned through your training journey.
                </p>
              </div>
            </div>

            {/* Official Documentation Section */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Pilot Recognition Credentials</h2>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: isDarkMode ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>Awards, certifications & achievements</span>
                  </div>
                  {[{
                    title: 'Examination Results',
                    description: 'Dive into your latest verified exam scores and subcategory breakdowns.',
                    cta: 'View Examination Directory',
                    filled: true,
                    onClick: onViewExamination
                  }, {
                    title: 'Digital Flight Logbook',
                    description: 'View your complete collection of licenses, flight hours, certifications, and professional milestones.',
                    cta: 'View Logbook',
                    filled: false,
                    onClick: onViewDigitalLogbook
                  }, {
                    title: 'Pilot Licensure & Experience Data Entry',
                    description: 'Access your comprehensive digital flight log with detailed flight records, aircraft types, and operational experience.',
                    cta: 'Open Data Entry',
                    filled: true,
                    onClick: onViewLicensureExperience
                  }].map((card, index) => (
                    <div key={card.title} style={{ marginBottom: index < 2 ? '1rem' : 0 }}>
                      {renderCard(card, isDarkMode)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Atlas Resume Section */}
            <div style={{ marginBottom: '3rem' }}>
              {/* Section Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', margin: '0 0 0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
                  Atlas Resume
                </h2>
                <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  ATS - (AI screening) ATLAS CV Format
                </p>
                <p style={{ margin: '0 auto', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6, fontSize: '0.9rem', maxWidth: '600px' }}>
                  The Atlas CV format is the industry-standard resume format used across aviation. Airlines and recruiters use AI-powered ATS (Applicant Tracking Systems) to screen candidates automatically—your experience matters, but if your CV isn't ATS-optimized, you may never be seen.
                </p>
              </div>

              {/* Atlas Resume Content */}
              <section style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                    : 'white',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  boxShadow: isDarkMode 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', letterSpacing: '0.25em', color: isDarkMode ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>Candidate</div>
                      <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.75rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{userProfile?.firstName && userProfile?.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : 'Benjamin Bowler'}</h2>
                      <p style={{ margin: '0.2rem 0 0', color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>WingMentor Recognition Portfolio</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: isDarkMode ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>Share link</div>
                      <button style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '12px',
                        border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #cbd5e1',
                        background: 'transparent',
                        color: isDarkMode ? '#f8fafc' : '#0f172a',
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

              <section style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {/* Pilot Credentials Card */}
                  <div style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                      : 'white',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: isDarkMode 
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #e2e8f0'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '0.25rem', fontWeight: 700 }}>Pilot Credentials</h3>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Licensing, hours, and access pass</p>
                    
                    {/* Stats Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        background: isDarkMode ? 'rgba(15,23,42,0.6)' : '#f8fafc',
                        borderRadius: '12px',
                        padding: '1rem',
                        textAlign: 'center'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Dual XC hrs</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>0</p>
                      </div>
                      <div style={{
                        background: isDarkMode ? 'rgba(15,23,42,0.6)' : '#f8fafc',
                        borderRadius: '12px',
                        padding: '1rem',
                        textAlign: 'center'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Dual LOC</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>0</p>
                      </div>
                      <div style={{
                        background: isDarkMode ? 'rgba(15,23,42,0.6)' : '#f8fafc',
                        borderRadius: '12px',
                        padding: '1rem',
                        textAlign: 'center'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>PIC LOC</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>0</p>
                      </div>
                      <div style={{
                        background: isDarkMode ? 'rgba(15,23,42,0.6)' : '#f8fafc',
                        borderRadius: '12px',
                        padding: '1rem',
                        textAlign: 'center'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>LOC XC</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>0</p>
                      </div>
                    </div>
                    
                    {/* Type & Status */}
                    <div style={{
                      background: isDarkMode ? 'rgba(15,23,42,0.6)' : '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Type</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Student Pilot</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Status</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Pending Verification</span>
                      </div>
                    </div>
                    
                    {/* Link */}
                    <button
                      onClick={onViewDigitalLogbook}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0
                      }}
                    >
                      View Flight Digital Logbook →
                    </button>
                  </div>

                  {/* Certifications & Training Card */}
                  <div style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                      : 'white',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: isDarkMode 
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #e2e8f0'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '0.75rem', fontWeight: 700 }}>Training</h3>
                    {licensureLoading ? (
                      <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>Loading...</div>
                    ) : licensureData ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                          <span>License</span>
                          <strong style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                            {licensureData.current_license?.join(', ') || 'Not specified'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                          <span>Medical</span>
                          <strong style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                            {licensureData.medical_class ? `${licensureData.medical_class} – ${licensureData.medical_expiry ? new Date(licensureData.medical_expiry).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }) : 'Valid'}` : 'Not specified'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                          <span>Type Ratings</span>
                          <strong style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                            {licensureData.aircraft_ratings?.filter(r => r.isCurrent).map(r => r.aircraftType).join(', ') || 'None added'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                          <span>English Proficiency</span>
                          <strong style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                            {licensureData.english_proficiency || 'Not specified'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                          <span>Languages</span>
                          <strong style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                            {licensureData.languages || 'Not specified'}
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
                        <p style={{ margin: '0 0 0.5rem' }}>No licensure data found.</p>
                        <button
                          onClick={onViewLicensureExperience}
                          style={{
                            fontSize: '0.8rem',
                            color: '#2563eb',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0
                          }}
                        >
                          Add your pilot licensure data →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pilot Licensure Card */}
                  <div style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                      : '#f8fafc',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: isDarkMode 
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', letterSpacing: '0.2em', color: isDarkMode ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>Readiness Snapshot</p>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700 }}>Resource & Availability</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{
                        background: isDarkMode ? 'rgba(15,23,42,0.6)' : 'white',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Medical Certificate</span>
                        <strong style={{ fontSize: '0.9rem', color: isDarkMode ? '#f8fafc' : '#0f172a', textAlign: 'right' }}>
                          {licensureData?.medical_class 
                            ? `${licensureData.medical_class} – ${licensureData.medical_expiry 
                                ? new Date(licensureData.medical_expiry).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }) 
                                : 'Valid'}`
                            : 'Not specified'}
                        </strong>
                      </div>
                      <div style={{
                        background: isDarkMode ? 'rgba(15,23,42,0.6)' : 'white',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>Radio License</span>
                        <strong style={{ fontSize: '0.9rem', color: isDarkMode ? '#f8fafc' : '#0f172a', textAlign: 'right' }}>
                          {licensureData?.radio_license_expiry 
                            ? `Expires ${new Date(licensureData.radio_license_expiry).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}`
                            : 'Not specified'}
                        </strong>
                      </div>
                      <div style={{
                        background: isDarkMode ? 'rgba(15,23,42,0.6)' : 'white',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>License Expiry</span>
                        <strong style={{ fontSize: '0.9rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                          {licensureData?.license_expiry 
                            ? new Date(licensureData.license_expiry).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })
                            : 'Not specified'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <div style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                    : 'white',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: isDarkMode 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Recent Job Experience & Industry Aligned Accredited Programs</h3>
                    <button
                      onClick={onViewLicensureExperience}
                      style={{
                        fontSize: '0.75rem',
                        color: '#2563eb',
                        background: isDarkMode ? 'rgba(30,41,59,0.6)' : '#eff6ff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Edit Experience →
                    </button>
                  </div>
                  
                  {licensureLoading ? (
                    <p style={{ margin: 0, color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>Loading experience data...</p>
                  ) : licensureData?.job_experiences && licensureData.job_experiences.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.7 }}>
                      {licensureData.job_experiences.map((job, index) => (
                        <li key={index}>
                          <strong>{job.position}</strong> – {job.company} – {job.fromDate} to {job.toDate || 'Present'}
                          {job.description && <span style={{ display: 'block', fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>{job.description}</span>}
                        </li>
                      ))}
                      {licensureData.current_occupation && (
                        <li style={{ marginTop: '0.5rem' }}>
                          <strong>Current Status:</strong> {licensureData.current_occupation}
                          {licensureData.current_employer && ` at ${licensureData.current_employer}`}
                          {licensureData.current_position && ` – ${licensureData.current_position}`}
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div>
                      <p style={{ margin: '0 0 0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
                        No job experience data added yet.
                      </p>
                      <button
                        onClick={onViewLicensureExperience}
                        style={{
                          fontSize: '0.85rem',
                          color: '#2563eb',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0
                        }}
                      >
                        Add your job experience →
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))'
                    : 'white',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: isDarkMode 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Export & Verification</h3>
                  <p style={{ margin: 0, color: isDarkMode ? '#94a3b8' : '#475569', fontSize: '0.9rem' }}>
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
                        cursor: 'pointer'
                      }}
                      onClick={onViewAtlas}
                    >
                      Access Full ATLAS Resume
                    </button>
                    <button
                      style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '12px',
                        border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #cbd5e1',
                        background: 'transparent',
                        color: isDarkMode ? '#f8fafc' : '#0f172a',
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
            </div>

            {/* Pilot Pathways Section */}
            <div style={{ marginBottom: '3rem' }}>
              {/* Section Header with Logo - Styled like Dashboard */}
              <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '2rem', marginTop: '0.5rem' }}>
                  <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain' }} />
                </div>
                
                <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                  Lead towards pilot pathways
                </div>
                
                <h1 style={{ 
                  fontFamily: 'Georgia, serif', 
                  fontSize: 'clamp(2rem, 5vw, 3.25rem)', 
                  fontWeight: 400, 
                  color: '#0f172a', 
                  marginBottom: '1rem', 
                  letterSpacing: '-0.02em', 
                  lineHeight: 1.15 
                }}>
                  Pilot Pathways
                </h1>
                
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '1.15rem', 
                  lineHeight: 1.7, 
                  maxWidth: '36rem', 
                  margin: '0 auto',
                  padding: '0 1rem'
                }}>
                  Where your Pilot Recognition opens many doors towards various pathways. Explore ATPL pathway, Emerging air taxi sector pathway, private sector pathways.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {/* Section Header - Recognition-Based Approach */}
                <div style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', margin: '0 0 0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    A Recognition-Based Approach to Career Pathways
                  </h2>
                  <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    From Collected Data to Structured Pathways
                  </p>
                  <p style={{ margin: '0', color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '500px' }}>
                    Transform your pilot recognition profile into actionable career pathways with AI-powered strategy and personalized recommendations.
                  </p>
                </div>

                {/* High-Fidelity Pathways Carousel */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Foundation Program Direct Entry pathways</h2>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>ATPL Pathway</span>
                  </div>
                  
                  <PathwaysCarousel
                    cards={[{
                      id: 'atpl-direct',
                      title: 'ATPL Direct Entry',
                      description: 'Fast-track your career with direct entry into Airline Transport Pilot License program through our foundation partnership.',
                      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
                      cta: 'Explore ATPL Pathway',
                      onClick: onViewPathways
                    }, {
                      id: 'foundation',
                      title: 'Foundation Program Entry',
                      description: 'Start your aviation journey with comprehensive foundation training and CPL license preparation through certified academies.',
                      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
                      cta: 'View Foundation Program',
                      onClick: onViewPathways
                    }, {
                      id: 'type-rating',
                      title: 'Type Rating Sponsorship',
                      description: 'Secure airline-sponsored type ratings with guaranteed interview opportunities upon successful completion.',
                      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=1200&auto=format&fit=crop',
                      cta: 'View Type Rating Options',
                      onClick: onViewPathways
                    }, {
                      id: 'air-taxi',
                      title: 'Emerging Air Taxi Sector',
                      description: 'Join the future of aviation with eVTOL and urban air mobility opportunities in the rapidly growing air taxi market.',
                      image: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?q=80&w=1200&auto=format&fit=crop',
                      cta: 'Explore Air Taxi Pathway',
                      onClick: onViewPathways
                    }, {
                      id: 'private-aviation',
                      title: 'Private Aviation Pathway',
                      description: 'Build a career in business aviation with corporate flight departments and private charter operations.',
                      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=1200&auto=format&fit=crop',
                      cta: 'View Private Sector',
                      onClick: onViewPathways
                    }, {
                      id: 'instructor',
                      title: 'Flight Instructor Pathway',
                      description: 'Develop your skills as a certified flight instructor while building hours toward airline requirements.',
                      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop',
                      cta: 'Explore Instructor Path',
                      onClick: onViewPathways
                    }]}
                    autoPlay={true}
                    autoPlayInterval={6000}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>AI-Powered Pathway Strategy</h2>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Profile Matched</span>
                  </div>
                  <PathwayStrategyCarousel
                    cards={[{
                      id: 'atpl-strategy',
                      title: 'ATPL Fast-Track Strategy',
                      subtitle: 'Complete Airline Transport Pilot License in 18 months with our accelerated pathway.',
                      description: 'Fast-track your career with our comprehensive ATPL program designed for ambitious pilots seeking rapid career advancement.',
                      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
                      advantages: [
                        { text: 'Fast-track to First Officer position', highlight: 'First Officer' },
                        { text: 'Full tuition reimbursement program', highlight: 'Full Tuition' },
                        { text: 'Direct airline placement guarantee', highlight: 'Direct Placement' },
                        { text: 'Mentorship from current airline captains' }
                      ],
                      cta: 'Discover Pathway',
                      onClick: onViewPathways
                    }, {
                      id: 'partnership-strategy',
                      title: 'Emirates Partnership Track',
                      subtitle: 'Exclusive recruitment pathway with Emirates Airlines for qualified pilots.',
                      description: 'Join our exclusive partnership program with Emirates Airlines and secure your position with one of the world\'s leading carriers.',
                      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=1200&auto=format&fit=crop',
                      advantages: [
                        { text: 'Guaranteed interview opportunity', highlight: 'Guaranteed Interview' },
                        { text: 'Type rating sponsorship', highlight: 'Sponsorship' },
                        { text: 'Housing allowance included', highlight: 'Housing Allowance' },
                        { text: 'Tax-free salary package' }
                      ],
                      cta: 'Discover Pathway',
                      onClick: onViewPathways
                    }, {
                      id: 'transition-strategy',
                      title: 'Career Transition Blueprint',
                      subtitle: 'Structured program for pilots transitioning to professional aviation roles.',
                      description: 'Comprehensive career transition support to help you navigate from training to your first professional aviation role.',
                      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop',
                      advantages: [
                        { text: 'CV optimization for airlines', highlight: 'CV Optimization' },
                        { text: 'Interview preparation coaching', highlight: 'Interview Prep' },
                        { text: 'Network building events access', highlight: 'Network Access' },
                        { text: 'Personal branding strategy' }
                      ],
                      cta: 'Discover Pathway',
                      onClick: onViewPathways
                    }]}
                    autoPlay={true}
                    autoPlayInterval={8000}
                  />
                </div>

                {/* Job Matching Component - Pilot Career Opportunities */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Available Jobs Matching Your Credentials</h2>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Live Job Database</span>
                  </div>
                  <JobMatchingSection userProfile={userProfile} onViewJobDatabase={onViewJobDatabase} />
                </div>
              </div>
            </div>

            {/* 4. Applications & Quick Links */}
            <CategorySection title="Applications" description="Quick access to W1000, examination portal, and external resources">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* W1000 Link */}
                <a
                  href="https://w1000.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
                    border: '1px solid rgba(226,232,240,0.8)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>W1000</h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>Training Platform</p>
                  </div>
                </a>

                {/* Examination Portal */}
                <button
                  onClick={onViewExamination}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
                    border: '1px solid rgba(226,232,240,0.8)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Examinations</h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>Portal & Results</p>
                  </div>
                </button>

                {/* Main Website */}
                <a
                  href="https://wmpilotnetwork.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
                    border: '1px solid rgba(226,232,240,0.8)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Website</h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>wmpilotnetwork.vercel.app</p>
                  </div>
                </a>
              </div>
            </CategorySection>

          </div>
        </section>
      </main>
    </div>
  );
};
