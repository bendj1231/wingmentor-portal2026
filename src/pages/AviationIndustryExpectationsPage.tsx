import React, { useEffect, useMemo, useState } from 'react';
import { Icons } from '../icons';
import { useRecognitionMatches } from '../hooks/useRecognitionMatches';
import { usePilotPortfolio } from '../hooks/usePilotPortfolio';

type Listing = {
  title?: string;
  company?: string;
  aircraft?: string;
  location?: string;
  role?: string;
  url?: string;
  posted?: string;
  status?: string;
  applicationUrl?: string;
  flightTime?: string;
  license?: string;
  visaSponsorship?: string;
  picTime?: string;
  picInTypeTime?: string;
  typeRating?: string;
  medicalClass?: string;
  icaoElpLevel?: string;
  compensation?: string;
};

type OperatorCategory =
  | 'All Categories'
  | 'Pilot Recognition Matches'
  | 'Airlines & Operators'
  | 'Cargo'
  | 'Private Jet & Business Aviation'
  | 'Training & Instruction';

type OperatorSummary = {
  company: string;
  categories: OperatorCategory[];
  jobs: Listing[];
  aircraft: string[];
  locations: string[];
  roles: string[];
};

const normalizeCompany = (company: string) => company.trim();

const looksLikeBizAv = (text: string) =>
  /(gulfstream|falcon|cessna|citation|challenger|global\s*\d|learjet|embraer\s*phenom|hawker|bombardier)/i.test(text);

const looksLikeCargo = (text: string) => /(cargo|freight|\bF\b|\bF\d{2,3}\b|\b777F\b|\b330F\b|\b737-?800F\b)/i.test(text);

const looksLikeTraining = (company: string, text: string) => /(cae|training|simulator|instructor|tri|sfi)/i.test(company) || /(instructor|tri|sfi|simulator)/i.test(text);

const deriveCategories = (company: string, jobs: Listing[]): OperatorCategory[] => {
  const haystack = jobs
    .map((j) => `${j.title} ${j.aircraft} ${j.role}`)
    .join(' | ');

  const categories = new Set<OperatorCategory>();

  if (looksLikeTraining(company, haystack)) categories.add('Training & Instruction');
  if (looksLikeCargo(haystack) || /cargo/i.test(company)) categories.add('Cargo');
  if (looksLikeBizAv(haystack) || looksLikeBizAv(company)) categories.add('Private Jet & Business Aviation');
  if (categories.size === 0) categories.add('Airlines & Operators');

  return Array.from(categories);
};

const uniqSorted = (values: string[]) => Array.from(new Set(values.filter(Boolean).map((v) => v.trim()))).sort((a, b) => a.localeCompare(b));

const pickTop = (values: string[], max: number) => values.slice(0, max);

const buildOperatorDescription = (operator: OperatorSummary) => {
  const aircraftText = operator.aircraft.length ? `Aircraft seen in our database: ${pickTop(operator.aircraft, 6).join(', ')}.` : '';
  const locationText = operator.locations.length ? `Common bases/locations: ${pickTop(operator.locations, 5).join(', ')}.` : '';
  return `${operator.company} appears in the WingMentor job database with ${operator.jobs.length} current or recent pilot opportunities. ${aircraftText} ${locationText}`.trim();
};

const buildOperatorExpectations = (operator: OperatorSummary) => {
  const hasTypeRatingRequired = operator.jobs.some((j) => (j as any).typeRating && String((j as any).typeRating).toLowerCase().includes('required'));
  const hasVisa = operator.jobs.some((j) => (j as any).visaSponsorship && String((j as any).visaSponsorship).toLowerCase().includes('yes'));

  const expectations: string[] = [];
  expectations.push('Strong multi-crew professionalism and SOP discipline.');
  expectations.push('Clean training record and a safety-first mindset.');

  if (hasTypeRatingRequired) expectations.push('Type rating is commonly required or strongly preferred for some roles.');
  expectations.push('Meet the minimum flight-time / recency requirements shown on the specific job posting.');
  expectations.push('Solid CRM, communication, and operational decision-making.');
  if (hasVisa) expectations.push('International candidates may be considered where visa sponsorship is listed.');

  return expectations;
};

const companyToLogoUrl = (company: string) => {
  const domainMap: Record<string, string> = {
    'air astana': 'airastana.com',
    'air macau': 'airmacau.com.mo',
    'air wisconsin': 'airwisconsin.com',
    'airx charter': 'airx.aero',
    'airx charter ltd': 'airx.aero',
    'british airways': 'britishairways.com',
    'cae': 'cae.com',
    'cameron air': 'cameronair.ca',
    'cathay pacific': 'cathaypacific.com',
    'chair airlines': 'chair.ch',
    'contour aviation': 'contouraviation.com',
    'contour airlines': 'contourairlines.com',
    'copa airlines': 'copaair.com',
    'emirates': 'emirates.com',
    'envoy air': 'envoyair.com',
    'etihad': 'etihad.com',
    'etihad airways': 'etihad.com',
    'executive jet management (ejm)': 'ejmjets.com',
    'flyadeal': 'flyadeal.com',
    'hk express': 'hkexpress.com',
    'jet aviation': 'jetaviation.com',
    'k5 aviation': 'k5-aviation.com',
    'peach': 'flypeach.com',
    'peach aviation': 'flypeach.com',
    'pegasus airlines': 'flypgs.com',
    'qatar airways': 'qatarairways.com',
    'riyadh air': 'riyadhair.com',
    'scandinavian airlines': 'flysas.com',
    'seaborne airlines': 'seaborneairlines.com',
    'singapore airlines': 'singaporeair.com',
    'skyalps': 'skyalps.com',
    'starlink aviation': 'starlinkaviation.com',
    'talon air': 'talonair.com',
    'volotea': 'volotea.com',
    'wizz air uk': 'wizzair.com'
  };

  const mappedDomain = domainMap[company.trim().toLowerCase()];
  if (mappedDomain) return `https://logo.clearbit.com/${mappedDomain}`;

  const slug = company
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .trim();

  if (!slug) return '';

  // Best-effort logo source; not perfect, but gives most airlines/operators a mark.
  return `https://logo.clearbit.com/${slug}.com`;
};

interface AviationIndustryExpectationsPageProps {
  onBack: () => void;
  userId?: string;
}

export const AviationIndustryExpectationsPage: React.FC<AviationIndustryExpectationsPageProps> = ({ onBack, userId }) => {
  const [selectedCategory, setSelectedCategory] = useState<OperatorCategory>('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Recognition matches from Supabase
  const { matches, topMatches, calculateMatches, saveMatch, dismissMatch } = useRecognitionMatches(userId);
  const { portfolio } = usePilotPortfolio(userId);

  useEffect(() => {
    let mounted = true;
    import('./PilotJobDatabasePage')
      .then((mod) => {
        if (!mounted) return;
        const nextListings = (mod as any).jobApplicationListings as Listing[] | undefined;
        setListings(Array.isArray(nextListings) ? nextListings : []);
        
        // Calculate matches once listings are loaded
        if (userId && nextListings) {
          calculateMatches(nextListings);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load job database');
        setListings([]);
      });
    return () => {
      mounted = false;
    };
  }, [userId]);

  const operators = useMemo<OperatorSummary[]>(() => {
    const byCompany = new Map<string, Listing[]>();

    if (!listings) return [];

    for (const job of listings) {
      const company = normalizeCompany((job as any).company || '');
      if (!company) continue;
      const existing = byCompany.get(company);
      if (existing) existing.push(job);
      else byCompany.set(company, [job]);
    }

    const summaries: OperatorSummary[] = Array.from(byCompany.entries()).map(([company, jobs]) => {
      const aircraft = uniqSorted(jobs.map((j) => String((j as any).aircraft || '')).filter(Boolean));
      const locations = uniqSorted(jobs.map((j) => String((j as any).location || '')).filter(Boolean));
      const roles = uniqSorted(jobs.map((j) => String((j as any).role || '')).filter(Boolean));
      const categories = deriveCategories(company, jobs);
      return { company, jobs, aircraft, locations, roles, categories };
    });

    return summaries.sort((a, b) => a.company.localeCompare(b.company));
  }, [listings]);

  const baseCategories: OperatorCategory[] = [
    'Airlines & Operators',
    'Cargo',
    'Private Jet & Business Aviation',
    'Training & Instruction'
  ];

  const categories: OperatorCategory[] = useMemo(() => {
    const set = new Set<OperatorCategory>(baseCategories);
    for (const op of operators) {
      for (const c of op.categories) set.add(c);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [operators]);

  const filteredOperators = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    // If "Pilot Recognition Matches" is selected, filter to only show operators with matching jobs
    if (selectedCategory === 'Pilot Recognition Matches') {
      if (matches.length === 0) {
        // Always return empty array when no matches exist
        return [];
      }
      
      const matchingOperatorNames = new Set(matches.map(m => m.operator_name.toLowerCase()));
      return operators.filter((op) => {
        const matchesQuery = !q || op.company.toLowerCase().includes(q);
        const isMatching = matchingOperatorNames.has(op.company.toLowerCase());
        return matchesQuery && isMatching;
      }).sort((a, b) => {
        // Sort by match percentage if available
        const matchA = matches.find(m => m.operator_name.toLowerCase() === a.company.toLowerCase())?.overall_match_percentage || 0;
        const matchB = matches.find(m => m.operator_name.toLowerCase() === b.company.toLowerCase())?.overall_match_percentage || 0;
        return matchB - matchA;
      });
    }
    
    return operators.filter((op) => {
      const matchesQuery = !q || op.company.toLowerCase().includes(q);
      const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || op.categories.includes(selectedCategory);
      return matchesQuery && matchesCategory;
    });
  }, [operators, searchQuery, selectedCategory, matches]);

  const activeOperator = useMemo(() => {
    if (!selectedOperator) return null;
    return operators.find((op) => op.company === selectedOperator) || null;
  }, [operators, selectedOperator]);

  const handleBack = () => {
    if (selectedOperator) {
      setSelectedOperator(null);
      return;
    }
    onBack();
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ paddingTop: '70px' }}>
      <main className="dashboard-card" style={{ maxWidth: '1400px', padding: '2rem', minHeight: 'calc(100vh - 70px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={handleBack}
            className="mb-6 mt-2 text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors bg-slate-50 rounded-full px-4 py-2 shadow-sm border border-solid border-slate-200"
          >
            <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> {selectedOperator ? 'Back to Results' : 'Back to Network'}
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/logo.png"
              alt="WingMentor Logo"
              style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }}
            />
            <div className="text-blue-600 tracking-widest text-xs font-bold uppercase mb-3">
              INDUSTRY INTELLIGENCE
            </div>
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 400,
                color: '#0f172a',
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              Aviation Industry Expectations
            </h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: '#64748b', lineHeight: 1.8 }}>
              Comprehensive guide to airline hiring requirements, expectations, and career insights for pilots across major carriers, business aviation, and regional operators.
            </p>
          </div>
        </div>

        {listings === null ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Loading operators…</p>
            <p style={{ fontSize: '0.875rem' }}>Building the index from the pilot job database.</p>
          </div>
        ) : loadError ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Couldn’t load the job database</p>
            <p style={{ fontSize: '0.875rem' }}>{loadError}</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                <Icons.Search style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#94a3b8',
                  width: 20,
                  height: 20
                }} />
                <input
                  type="text"
                  placeholder="Search airlines/operators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '9999px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              marginBottom: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setSelectedCategory('All Categories')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: selectedCategory === 'All Categories' ? '#0ea5e9' : '#f1f5f9',
                  color: selectedCategory === 'All Categories' ? 'white' : '#64748b',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                All Categories
              </button>
              {/* Pilot Recognition Matches tab */}
              <button
                onClick={() => setSelectedCategory('Pilot Recognition Matches')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  background: selectedCategory === 'Pilot Recognition Matches' 
                    ? 'linear-gradient(135deg, #10b981, #059669)' 
                    : '#f0fdf4',
                  color: selectedCategory === 'Pilot Recognition Matches' ? 'white' : '#059669',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedCategory === 'Pilot Recognition Matches' ? 'none' : '2px solid #10b981'
                }}
              >
                Pilot Recognition Matches
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: selectedCategory === category ? '#0ea5e9' : '#f1f5f9',
                    color: selectedCategory === category ? 'white' : '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {activeOperator ? (
              <div style={{ maxWidth: '980px', margin: '0 auto' }}>
                {/* Main Operator Card - Transition Program Style */}
                <div
                  style={{
                    cursor: 'pointer',
                    padding: '0',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)',
                    border: '1px solid rgba(226, 232, 240, 0.6)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'stretch'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.6)';
                  }}
                >
                  {/* Left Content */}
                  <div style={{
                    flex: '1',
                    padding: '2rem 2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    {/* Logo */}
                    <div style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '14px',
                      border: '1px solid rgba(226,232,240,0.9)',
                      background: '#f8fafc',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={companyToLogoUrl(activeOperator.company)}
                        alt={activeOperator.company}
                        style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                        background: 'rgba(100, 116, 139, 0.1)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px'
                      }}>
                        Operator Profile
                      </span>
                      <span style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: '9999px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {activeOperator.jobs.length} Jobs
                      </span>
                    </div>

                    <h2 style={{
                      fontSize: '1.75rem',
                      marginBottom: '0.75rem',
                      color: '#0f172a',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2
                    }}>
                      {activeOperator.company}
                    </h2>

                    <p style={{
                      marginBottom: '1.25rem',
                      color: '#64748b',
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      maxWidth: '90%'
                    }}>
                      {activeOperator.jobs.length} current pilot opportunities. Aircraft: {pickTop(activeOperator.aircraft, 3).join(', ') || 'Various'}.
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {activeOperator.categories.slice(0, 2).map((c) => (
                        <span key={c} style={{
                          fontSize: '0.8rem',
                          padding: '0.5rem 1rem',
                          background: 'white',
                          borderRadius: '100px',
                          color: '#475569',
                          fontWeight: 500,
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}>
                          {c}
                        </span>
                      ))}
                      <span style={{
                        fontSize: '0.8rem',
                        padding: '0.5rem 1rem',
                        background: 'white',
                        borderRadius: '100px',
                        color: '#475569',
                        fontWeight: 500,
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}>
                        {pickTop(activeOperator.roles, 2).join(' / ') || 'Multiple Roles'}
                      </span>
                    </div>
                  </div>

                  {/* Right Image Section */}
                  <div style={{
                    position: 'relative',
                    width: '40%',
                    minHeight: '220px',
                    overflow: 'hidden',
                    borderRadius: '0 24px 24px 0'
                  }}>
                    <img
                      src="/Gemini_Generated_Image_7awns87awns87awn.png"
                      alt={activeOperator.company}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 30%)',
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      position: 'absolute',
                      right: '1.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease'
                    }}>
                      <Icons.ArrowRight style={{ width: 20, height: 20, color: '#0f172a' }} />
                    </div>
                  </div>
                </div>

                {/* Recommended Jobs Widget - Separate Component Below */}
                <div style={{
                  background: 'white',
                  borderRadius: '18px',
                  padding: '1.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 18px 45px rgba(15,23,42,0.08)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icons.Briefcase style={{ width: 18, height: 18, color: 'white' }} />
                    </div>
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#0f172a'
                      }}>
                        Recommended for Your Profile
                      </h3>
                      <p style={{
                        margin: '0.15rem 0 0 0',
                        fontSize: '0.85rem',
                        color: '#64748b'
                      }}>
                        Top 3 matching roles from {activeOperator.company}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {activeOperator.jobs.slice(0, 3).map((job, idx) => (
                      <a
                        key={`${(job as any).url || job.title}-${idx}`}
                        href={(job as any).url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '14px',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0f9ff';
                          e.currentTarget.style.borderColor = '#0ea5e9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f8fafc';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            fontWeight: 700,
                            color: '#0f172a',
                            fontSize: '0.95rem',
                            lineHeight: 1.4
                          }}>
                            {(job as any).title}
                          </div>
                          <Icons.ArrowRight style={{
                            width: 16,
                            height: 16,
                            color: '#0ea5e9',
                            flexShrink: 0,
                            marginTop: '0.15rem'
                          }} />
                        </div>
                        <div style={{
                          color: '#64748b',
                          fontSize: '0.85rem',
                          lineHeight: 1.5
                        }}>
                          {[(job as any).role, (job as any).aircraft, (job as any).location].filter(Boolean).join(' | ')}
                        </div>
                        {(job as any).flightTime && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            background: 'rgba(14, 165, 233, 0.1)',
                            color: '#0ea5e9',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            width: 'fit-content',
                            marginTop: '0.25rem'
                          }}>
                            {(job as any).flightTime} hrs
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Operator Details Section */}
                <div style={{
                  background: 'white',
                  borderRadius: '18px',
                  padding: '1.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
                  marginTop: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    What pilots should expect
                  </h3>
                  <ul style={{ margin: '0.75rem 0 0 0', padding: 0, listStyle: 'none' }}>
                    {buildOperatorExpectations(activeOperator).map((item, idx) => (
                      <li key={idx} style={{ position: 'relative', paddingLeft: '1.25rem', marginBottom: '0.5rem', color: '#475569', lineHeight: 1.6 }}>
                        <span style={{ position: 'absolute', left: 0, color: '#0ea5e9', fontWeight: 900 }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <>
                {/* Operators List */}
                <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {filteredOperators.map((op) => {
                    const logoUrl = companyToLogoUrl(op.company);
                    return (
                      <button
                        key={op.company}
                        type="button"
                        onClick={() => setSelectedOperator(op.company)}
                        style={{
                          textAlign: 'left',
                          background: 'white',
                          borderRadius: '18px',
                          padding: '1.15rem 1.25rem',
                          border: '1px solid rgba(226, 232, 240, 0.9)',
                          boxShadow: '0 18px 45px rgba(15,23,42,0.06)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'flex-start'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 25px 55px rgba(15,23,42,0.10)';
                          e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 18px 45px rgba(15,23,42,0.06)';
                          e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
                        }}
                      >
                        <div
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '14px',
                            border: '1px solid rgba(226,232,240,0.9)',
                            background: '#f8fafc',
                            overflow: 'hidden',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={op.company}
                              style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                            <div style={{ minWidth: 0 }}>
                              <h3 style={{ fontSize: '1.15rem', fontWeight: 850, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                                {op.company}
                              </h3>
                              <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
                                {buildOperatorDescription(op)}
                              </p>
                            </div>
                            <div style={{
                              padding: '0.35rem 0.7rem',
                              borderRadius: '9999px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              fontWeight: 900,
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}>
                              {op.jobs.length} Jobs
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem' }}>
                            {op.categories.slice(0, 2).map((c) => (
                              <span
                                key={c}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '9999px',
                                  background: '#f1f5f9',
                                  color: '#475569',
                                  fontSize: '0.75rem',
                                  fontWeight: 850
                                }}
                              >
                                {c}
                              </span>
                            ))}
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              background: '#f0fdf4',
                              color: '#15803d',
                              fontSize: '0.75rem',
                              fontWeight: 850
                            }}>
                              {pickTop(op.roles, 2).join(' / ') || 'Roles'}
                            </span>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              background: '#fff7ed',
                              color: '#9a3412',
                              fontSize: '0.75rem',
                              fontWeight: 850
                            }}>
                              {pickTop(op.aircraft, 2).join(' / ') || 'Aircraft'}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {filteredOperators.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                    {selectedCategory === 'Pilot Recognition Matches' ? (
                      <>
                        <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                          {userId ? 'No recognition matches found' : 'Sign in to view recognition matches'}
                        </p>
                        <p style={{ fontSize: '0.875rem' }}>
                          {userId
                            ? 'Complete your pilot profile to generate personalized job matches'
                            : 'Connect your WingMentor profile to unlock personalized matches'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No operators found</p>
                        <p style={{ fontSize: '0.875rem' }}>Try adjusting your search query or category</p>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};
