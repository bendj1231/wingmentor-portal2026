import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from '../icons';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PathwayJob {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  matchPercentage: number;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
  tags: string[];
  postedAt: string;
  isLive?: boolean;
  isHot?: boolean;
  image: string;
}

interface CategorySection {
  id: string;
  title: string;
  description: string;
  pathways: PathwayJob[];
  accentColor: string;
}

interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ReactNode;
  urgent?: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const LIVE_JOBS: PathwayJob[] = [
  {
    id: 'live-1',
    title: 'First Officer A320',
    company: 'Emirates',
    matchPercentage: 94,
    location: 'Dubai, UAE',
    type: 'Major Airline',
    salary: '$8,500/mo + housing',
    requirements: ['2500 hrs TT', 'A320 Type Rating', 'ICAO Level 5'],
    tags: ['Hot', 'Visa Sponsored'],
    postedAt: 'Just now',
    isLive: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
  },
  {
    id: 'live-2',
    title: 'CRJ First Officer',
    company: 'SkyWest Airlines',
    matchPercentage: 91,
    location: 'Salt Lake City, UT',
    type: 'Regional',
    salary: '$65,000 - $95,000',
    requirements: ['250 hrs TT', 'ME Rating', 'ATP-CTP'],
    tags: ['Matches Profile', 'Fast Track'],
    postedAt: '2 min ago',
    isLive: true,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
  },
  {
    id: 'live-3',
    title: 'eVTOL Test Pilot',
    company: 'Joby Aviation',
    matchPercentage: 88,
    location: 'Marina, CA',
    type: 'eVTOL / Air Taxi',
    salary: '$95,000 + equity',
    requirements: ['1000 hrs TT', 'Heli Exp Preferred'],
    tags: ['Emerging', 'Stock Options'],
    postedAt: '5 min ago',
    isLive: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80'
  },
  {
    id: 'live-4',
    title: 'Global 7500 Captain',
    company: 'VistaJet',
    matchPercentage: 85,
    location: 'Multiple Bases',
    type: 'Private Aviation',
    salary: '$180,000 + bonus',
    requirements: ['3500 hrs TT', 'Global Exp', 'VIP Service'],
    tags: ['Premium', 'Worldwide'],
    postedAt: '12 min ago',
    isLive: true,
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
  }
];

const CATEGORY_SECTIONS: CategorySection[] = [
  {
    id: 'commercial',
    title: 'Commercial Airlines',
    description: 'Major, regional, and budget carriers serving scheduled passenger routes',
    accentColor: '#3b82f6',
    pathways: [
      {
        id: 'comm-1',
        title: 'First Officer A320',
        company: 'Singapore Airlines',
        matchPercentage: 92,
        location: 'Singapore',
        type: 'Major Airline',
        salary: '$120,000/year',
        requirements: ['1500 hrs', 'A320 TR', 'Medical 1'],
        tags: ['Full Benefits', 'Training Bond'],
        postedAt: '1 day ago',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
      },
      {
        id: 'comm-2',
        title: 'B737 First Officer',
        company: 'Ryanair',
        matchPercentage: 89,
        location: 'Dublin, Ireland',
        type: 'Low-Cost Carrier',
        salary: '€65,000/year',
        requirements: ['500 hrs', 'B737 TR', 'EU Passport'],
        tags: ['Fast Upgrade', 'Base Options'],
        postedAt: '2 days ago',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
      },
      {
        id: 'comm-3',
        title: 'ATR72 First Officer',
        company: 'AirAsia',
        matchPercentage: 87,
        location: 'Kuala Lumpur',
        type: 'Regional',
        salary: '$45,000/year',
        requirements: ['250 hrs', 'ME/IR', 'ICAO 4'],
        tags: ['Growing Fleet', 'Asia Pacific'],
        postedAt: '3 days ago',
        image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
      },
      {
        id: 'comm-4',
        title: 'Q400 First Officer',
        company: 'Horizon Air',
        matchPercentage: 94,
        location: 'Seattle, WA',
        type: 'Regional',
        salary: '$55,000/year',
        requirements: ['250 hrs', 'ME Rating'],
        tags: ['Alaska Group', 'Flow Program'],
        postedAt: '1 week ago',
        image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
      },
      {
        id: 'comm-5',
        title: 'E175 First Officer',
        company: 'Republic Airways',
        matchPercentage: 90,
        location: 'Indianapolis, IN',
        type: 'Regional',
        salary: '$60,000/year',
        requirements: ['250 hrs', 'ATP-CTP'],
        tags: ['Partner Airlines', 'Upgrade Fast'],
        postedAt: '4 days ago',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
      },
      {
        id: 'comm-6',
        title: 'A350 Second Officer',
        company: 'Qatar Airways',
        matchPercentage: 86,
        location: 'Doha, Qatar',
        type: 'Major Airline',
        salary: '$95,000 tax-free',
        requirements: ['750 hrs', 'Widebody Exp'],
        tags: ['Tax Free', 'Housing'],
        postedAt: '5 days ago',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
      },
      {
        id: 'comm-7',
        title: 'B787 First Officer',
        company: 'ANA',
        matchPercentage: 83,
        location: 'Tokyo, Japan',
        type: 'Major Airline',
        salary: '¥12,000,000',
        requirements: ['2000 hrs', 'B787 TR', 'JLPT N2'],
        tags: ['Premium Airline', 'Japan'],
        postedAt: '6 days ago',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
      }
    ]
  },
  {
    id: 'private',
    title: 'Private & Corporate',
    description: 'Executive transport, fractional ownership, and luxury charter operations',
    accentColor: '#f59e0b',
    pathways: [
      {
        id: 'priv-1',
        title: 'G650 Captain',
        company: 'NetJets',
        matchPercentage: 88,
        location: 'Columbus, OH',
        type: 'Fractional',
        salary: '$200,000/year',
        requirements: ['3000 hrs', 'Gulfstream Type', 'Part 135'],
        tags: ['Premium Benefits', 'Global'],
        postedAt: '2 days ago',
        image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
      },
      {
        id: 'priv-2',
        title: 'Citation XLS Captain',
        company: 'Flexjet',
        matchPercentage: 85,
        location: 'Dallas, TX',
        type: 'Fractional',
        salary: '$165,000/year',
        requirements: ['2500 hrs', 'CE560XL'],
        tags: ['Fractional Leader', 'Fleet Modern'],
        postedAt: '3 days ago',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
      },
      {
        id: 'priv-3',
        title: 'Challenger 350 Captain',
        company: 'VistaJet',
        matchPercentage: 91,
        location: 'Malta / Global',
        type: 'Private Charter',
        salary: '$190,000 + bonus',
        requirements: ['3500 hrs', 'Bombardier Exp', 'VIP Exp'],
        tags: ['Worldwide', 'Silver Service'],
        postedAt: '1 day ago',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
      },
      {
        id: 'priv-4',
        title: 'Falcon 7X Captain',
        company: 'Global Jet',
        matchPercentage: 82,
        location: 'Geneva, Switzerland',
        type: 'Private Charter',
        salary: 'CHF 220,000',
        requirements: ['4000 hrs', 'Falcon Type', 'EU'],
        tags: ['European', 'Long Range'],
        postedAt: '5 days ago',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
      },
      {
        id: 'priv-5',
        title: 'PC-12 Captain',
        company: 'PlaneSense',
        matchPercentage: 79,
        location: 'Portsmouth, NH',
        type: 'Fractional',
        salary: '$110,000/year',
        requirements: ['1500 hrs', 'Turboprop', 'Single Pilot'],
        tags: ['Turboprop', 'Growth'],
        postedAt: '1 week ago',
        image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
      },
      {
        id: 'priv-6',
        title: 'Legacy 650 Captain',
        company: 'ExecuJet',
        matchPercentage: 84,
        location: 'Dubai, UAE',
        type: 'Private Charter',
        salary: '$175,000 tax-free',
        requirements: ['3500 hrs', 'Embraer', 'Middle East'],
        tags: ['Tax Free', 'VIP'],
        postedAt: '4 days ago',
        image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
      }
    ]
  },
  {
    id: 'cargo',
    title: 'Cargo Operations',
    description: 'Freight and logistics operations including express delivery and long-haul cargo',
    accentColor: '#10b981',
    pathways: [
      {
        id: 'cargo-1',
        title: 'B747-8F Captain',
        company: 'Atlas Air',
        matchPercentage: 89,
        location: 'Purchase, NY',
        type: 'Heavy Cargo',
        salary: '$280,000/year',
        requirements: ['4000 hrs', 'B747 Type', 'Heavy Jet'],
        tags: ['Global Routes', 'Union'],
        postedAt: '3 days ago',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
      },
      {
        id: 'cargo-2',
        title: 'MD-11F First Officer',
        company: 'FedEx',
        matchPercentage: 86,
        location: 'Memphis, TN',
        type: 'Express Cargo',
        salary: '$145,000/year',
        requirements: ['1000 hrs', 'Heavy Jet'],
        tags: ['Fortune 500', 'Great Benefits'],
        postedAt: '5 days ago',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
      },
      {
        id: 'cargo-3',
        title: 'B767F First Officer',
        company: 'UPS Airlines',
        matchPercentage: 92,
        location: 'Louisville, KY',
        type: 'Express Cargo',
        salary: '$155,000/year',
        requirements: ['500 hrs', 'ATP'],
        tags: ['Teamsters', 'Pension'],
        postedAt: '2 days ago',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
      },
      {
        id: 'cargo-4',
        title: 'A330F Captain',
        company: 'DHL Aviation',
        matchPercentage: 84,
        location: 'Leipzig, Germany',
        type: 'Express Cargo',
        salary: '€150,000/year',
        requirements: ['3000 hrs', 'A330 Type', 'EU Base'],
        tags: ['European', 'Hub Operations'],
        postedAt: '6 days ago',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
      },
      {
        id: 'cargo-5',
        title: 'B777F Captain',
        company: 'Ethiopian Cargo',
        matchPercentage: 81,
        location: 'Addis Ababa',
        type: 'Long-Haul Cargo',
        salary: '$220,000/year',
        requirements: ['5000 hrs', 'B777 Type'],
        tags: ['Africa Hub', 'Growth Market'],
        postedAt: '1 week ago',
        image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
      }
    ]
  }
];

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Industry Alert: VistaJet Increases Minimums',
    subtitle: 'New requirement for 4000 hours TT effective immediately across all captain positions',
    category: 'Industry Update',
    icon: <Icons.AlertTriangle className="w-5 h-5" />,
    urgent: true
  },
  {
    id: 'news-2',
    title: 'Emirates Announces 200 New Pilot Positions',
    subtitle: 'Expansion of A350 and B777X fleet creates opportunities for First Officers and Captains',
    category: 'Hiring Surge',
    icon: <Icons.TrendingUp className="w-5 h-5" />
  },
  {
    id: 'news-3',
    title: 'eVTOL Sector Raises $2.4B in Q1 2026',
    subtitle: 'Joby, Archer, and Lilium secure major funding - pilot hiring expected to accelerate',
    category: 'Market Intel',
    icon: <Icons.Zap className="w-5 h-5" />
  }
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const MatchBadge: React.FC<{ percentage: number }> = ({ percentage }) => {
  const getGlowColor = (p: number) => {
    if (p >= 90) return 'shadow-emerald-500/50';
    if (p >= 80) return 'shadow-blue-500/50';
    if (p >= 70) return 'shadow-amber-500/50';
    return 'shadow-slate-500/30';
  };

  const getGradient = (p: number) => {
    if (p >= 90) return 'from-emerald-400 to-teal-300';
    if (p >= 80) return 'from-blue-400 to-cyan-300';
    if (p >= 70) return 'from-amber-400 to-yellow-300';
    return 'from-slate-400 to-zinc-300';
  };

  return (
    <div 
      className={`
        relative inline-flex items-center gap-1 
        px-2 py-0.5 rounded-full text-xs font-bold
        bg-gradient-to-r ${getGradient(percentage)}
        text-slate-950 shadow-lg ${getGlowColor(percentage)}
      `}
    >
      <span>{percentage}%</span>
    </div>
  );
};

const LivePulsingDot: React.FC = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
);

// ============================================================================
// MAIN COMPONENT SECTIONS
// ============================================================================

const OmniSearchBar: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  return (
    <div className="sticky top-0 z-50 w-full px-4 py-4 bg-[#0B0F19]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icons.Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 
              bg-slate-900/50 border border-white/10 rounded-2xl
              text-slate-100 placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30
              transition-all duration-200
              shadow-inner shadow-black/20"
            placeholder="Search airlines, requirements, aircraft type..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <Icons.X className="h-5 w-5 text-slate-400 hover:text-slate-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const LiveJobBoard: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <LivePulsingDot />
            <h2 className="text-lg font-semibold text-slate-100">
              Live Matches for Your Profile
            </h2>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
              {LIVE_JOBS.length} active
            </span>
          </div>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {LIVE_JOBS.map((job) => (
            <div
              key={job.id}
              className="flex-shrink-0 w-[300px] p-4 rounded-2xl
                bg-slate-900/80 border border-white/10
                hover:bg-slate-800/80 hover:border-white/20
                transition-all duration-300 cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-300">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm leading-tight">{job.title}</h3>
                    <p className="text-slate-500 text-xs">{job.company}</p>
                  </div>
                </div>
                <MatchBadge percentage={job.matchPercentage} />
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  <Icons.MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  <Icons.DollarSign className="w-3 h-3" /> {job.salary}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Posted Time */}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-slate-500">{job.postedAt}</span>
                {job.isLive && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded">
                    <LivePulsingDot /> Live
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryRow: React.FC<{ section: CategorySection; index: number }> = ({ section, index }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 20);
    }
  };

  return (
    <section className="py-8 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{section.title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50 transition-colors"
              >
                <Icons.ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50 transition-colors"
            >
              <Icons.ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cards Container with Blur Reveal */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {section.pathways.map((pathway, i) => (
              <div
                key={pathway.id}
                className="flex-shrink-0 w-[280px] group cursor-pointer"
              >
                {/* Thumbnail Image */}
                <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                  <img
                    src={pathway.image}
                    alt={pathway.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  
                  {/* Match Badge on Image */}
                  <div className="absolute top-2 right-2">
                    <MatchBadge percentage={pathway.matchPercentage} />
                  </div>

                  {/* Company on Image */}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur text-slate-200 text-xs rounded font-medium">
                      {pathway.company}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-1">
                  <h3 className="font-semibold text-slate-100 text-sm leading-tight mb-1 group-hover:text-blue-400 transition-colors">
                    {pathway.title}
                  </h3>
                  <p className="text-slate-500 text-xs mb-2">{pathway.type}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {pathway.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs text-slate-400 bg-white/5 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Spacer for button positioning */}
            <div className="flex-shrink-0 w-48" />
          </div>

          {/* Blur Fade Overlay + Button */}
          <div className="absolute right-0 top-0 bottom-0 w-48 
            bg-gradient-to-l from-[#0B0F19] via-[#0B0F19]/95 to-transparent
            pointer-events-none flex items-center justify-end pr-2">
            <button 
              className="pointer-events-auto px-4 py-2 rounded-full
                bg-slate-800/90 border border-white/20 backdrop-blur-sm
                text-slate-100 text-sm font-medium
                hover:bg-slate-700/90 hover:border-white/30
                shadow-lg shadow-black/30
                transition-all duration-300
                flex items-center gap-2 group"
            >
              <span>Discover More</span>
              <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const NewsFeedCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  return (
    <div className="py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className={`
          p-4 rounded-xl border
          ${item.urgent 
            ? 'bg-rose-500/5 border-rose-500/20' 
            : 'bg-slate-800/30 border-white/5'
          }
        `}>
          <div className="flex items-start gap-3">
            <div className={`
              p-2 rounded-lg flex-shrink-0
              ${item.urgent ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}
            `}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`
                  text-xs font-semibold uppercase tracking-wider
                  ${item.urgent ? 'text-rose-400' : 'text-blue-400'}
                `}>
                  {item.category}
                </span>
                {item.urgent && (
                  <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 text-xs rounded border border-rose-500/20">
                    Urgent
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.subtitle}</p>
            </div>
            <button className="flex-shrink-0 p-2 text-slate-500 hover:text-slate-300 transition-colors">
              <Icons.ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export const PathwaysPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      {/* Global Styles for Scrollbar Hiding */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Omni-Search Bar */}
      <OmniSearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Main Content */}
      <main className="pb-20">
        {/* Live Job Board */}
        <LiveJobBoard />

        {/* Category Rows with News Injections */}
        {CATEGORY_SECTIONS.map((section, index) => (
          <React.Fragment key={section.id}>
            <CategoryRow section={section} index={index} />
            
            {/* Inject News Card after each section */}
            {NEWS_ITEMS[index] && (
              <NewsFeedCard item={NEWS_ITEMS[index]} />
            )}
          </React.Fragment>
        ))}

        {/* Final News Item if more news than categories */}
        {NEWS_ITEMS.length > CATEGORY_SECTIONS.length && (
          <NewsFeedCard item={NEWS_ITEMS[NEWS_ITEMS.length - 1]} />
        )}
      </main>
    </div>
  );
};

export default PathwaysPage;

// Inline SVG Icon Components for icons not in Icons.tsx
const IconComponents = {
  Plane: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12h20M2 12l5-5m-5 5l5 5M22 12l-5-5m5 5l-5 5M12 2v20" />
    </svg>
  ),
  GraduationCap: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  MapPin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  DollarSign: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Star: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Filter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  CheckCircle2: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PathwayMatch {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  matchPercentage: number;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
  tags: string[];
  postedAt: string;
  isNew?: boolean;
  isHot?: boolean;
}

interface SectorCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  pathwayCount: number;
  gradient: string;
  accentColor: string;
}

interface TrendingIntel {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  backgroundImage: string;
  ctaText: string;
  isUrgent?: boolean;
}

interface ExclusivePathway {
  id: string;
  title: string;
  description: string;
  partner: string;
  slotsAvailable: number;
  totalSlots: number;
  deadline: string;
  isLocked: boolean;
  unlockRequirement: string;
  benefits: string[];
}

interface FilterOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const TRENDING_INTEL: TrendingIntel[] = [
  {
    id: '1',
    title: 'Airlines Hiring Now',
    subtitle: 'Emirates, Qatar Airways & Singapore Airlines are actively recruiting First Officers with 500+ hours',
    category: 'Industry Update',
    backgroundImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'View Opportunities',
    isUrgent: true
  },
  {
    id: '2',
    title: 'WingMentor Alumni Spotlight',
    subtitle: 'Congratulations to Sarah Chen who just landed a role at Emirates as A380 First Officer!',
    category: 'Success Story',
    backgroundImage: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Read Her Journey'
  },
  {
    id: '3',
    title: 'New ATPL Partnership',
    subtitle: 'WingMentor partners with Leading Edge Aviation for exclusive fast-track ATPL program',
    category: 'Partnership',
    backgroundImage: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Learn More'
  },
  {
    id: '4',
    title: 'eVTOL Market Boom',
    subtitle: 'Air taxi sector projected to create 15,000 new pilot positions by 2030',
    category: 'Market Intel',
    backgroundImage: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Explore eVTOL Pathway'
  }
];

const FOR_YOU_MATCHES: PathwayMatch[] = [
  {
    id: '1',
    title: 'SkyWest First Officer',
    company: 'SkyWest Airlines',
    matchPercentage: 94,
    location: 'Salt Lake City, UT',
    type: 'Regional Airline',
    salary: '$65,000 - $95,000',
    requirements: ['250 hrs TT', 'ME Rating', 'ATP-CTP'],
    tags: ['Matches your 250 hrs', 'ME Rating needed', 'Visa Sponsorship'],
    postedAt: '2 days ago',
    isNew: true,
    isHot: true
  },
  {
    id: '2',
    title: 'Atlas Air Cargo Pilot',
    company: 'Atlas Air',
    matchPercentage: 87,
    location: 'Multiple Bases',
    type: 'Cargo Operations',
    salary: '$85,000 - $120,000',
    requirements: ['500 hrs TT', 'ATP License', 'Boeing Type Rating'],
    tags: ['Needs 250 more hrs', 'High Growth Sector', 'Global Routes'],
    postedAt: '5 days ago',
    isHot: true
  },
  {
    id: '3',
    title: 'NetJets Corporate Pilot',
    company: 'NetJets',
    matchPercentage: 82,
    location: 'Columbus, OH',
    type: 'Private Aviation',
    salary: '$95,000 - $140,000',
    requirements: ['350 hrs TT', 'Jet Experience', 'Customer Service'],
    tags: ['Premium Benefits', 'Flexible Schedule', 'Luxury Focus'],
    postedAt: '1 week ago'
  },
  {
    id: '4',
    title: 'Emirates Cadet Program',
    company: 'Emirates',
    matchPercentage: 76,
    location: 'Dubai, UAE',
    type: 'Major Airline',
    salary: 'Full Sponsorship',
    requirements: ['CPL License', 'Valid Passport', 'Medical Class 1'],
    tags: ['Fully Sponsored', 'A380 Training', 'Global Career'],
    postedAt: '3 days ago',
    isNew: true
  },
  {
    id: '5',
    title: 'Joby Aviation eVTOL Pilot',
    company: 'Joby Aviation',
    matchPercentage: 91,
    location: 'Marina, CA',
    type: 'eVTOL / Air Taxi',
    salary: '$75,000 - $110,000',
    requirements: ['200 hrs TT', 'Heli Experience Preferred', 'Innovation Mindset'],
    tags: ['Emerging Sector', 'Cutting Edge', 'Stock Options'],
    postedAt: '4 days ago',
    isNew: true,
    isHot: true
  },
  {
    id: '6',
    title: 'Flexjet First Officer',
    company: 'Flexjet',
    matchPercentage: 89,
    location: 'Dallas, TX',
    type: 'Fractional Ownership',
    salary: '$80,000 - $115,000',
    requirements: ['300 hrs TT', 'ME Rating', 'Professional Demeanor'],
    tags: ['Matches your profile', 'Gulfstream Fleet', 'Premium Clients'],
    postedAt: '6 days ago'
  }
];

const EXCLUSIVE_PATHWAYS: ExclusivePathway[] = [
  {
    id: '1',
    title: 'Emirates Direct Entry Program',
    description: 'Fast-track your career with Emirates\' exclusive WingMentor partnership. Direct entry for qualified candidates.',
    partner: 'Emirates Airlines',
    slotsAvailable: 12,
    totalSlots: 50,
    deadline: '2024-06-30',
    isLocked: true,
    unlockRequirement: 'Complete Foundation Program',
    benefits: ['Full Sponsorship', 'A380 Type Rating', 'Housing Allowance', 'Tax-Free Salary']
  },
  {
    id: '2',
    title: 'NetJets Priority Track',
    description: 'Skip the queue with NetJets\' priority hiring track for WingMentor graduates.',
    partner: 'NetJets',
    slotsAvailable: 8,
    totalSlots: 20,
    deadline: '2024-05-15',
    isLocked: false,
    unlockRequirement: '',
    benefits: ['Direct Interview', 'Accelerated Training', 'Premium Fleet Access', 'Signing Bonus']
  },
  {
    id: '3',
    title: 'Joby Aviation Founding Pilot',
    description: 'Join the eVTOL revolution as a founding pilot with Joby Aviation.',
    partner: 'Joby Aviation',
    slotsAvailable: 5,
    totalSlots: 15,
    deadline: '2024-07-15',
    isLocked: true,
    unlockRequirement: 'Complete Module 3 + Exam',
    benefits: ['Equity Package', 'Early Adopter Status', 'Innovation Leadership', 'Stock Options']
  },
  {
    id: '4',
    title: 'Atlas Air Fast-Track Cargo',
    description: 'Accelerated cargo pilot pathway with Atlas Air. Global routes, premium pay.',
    partner: 'Atlas Air',
    slotsAvailable: 20,
    totalSlots: 40,
    deadline: '2024-08-01',
    isLocked: false,
    unlockRequirement: '',
    benefits: ['Boeing Training', 'Global Routes', 'Quick Upgrade', 'Travel Benefits']
  }
];

const SECTOR_CATEGORIES: SectorCategory[] = [
  {
    id: 'commercial',
    title: 'Commercial Airlines',
    description: 'Major, regional, and budget carriers serving scheduled passenger routes globally.',
    icon: <IconComponents.Plane className="w-8 h-8" />,
    pathwayCount: 48,
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    accentColor: '#3b82f6'
  },
  {
    id: 'private',
    title: 'Private & Corporate',
    description: 'Executive transport, fractional ownership, and luxury charter operations.',
    icon: <Icons.Briefcase className="w-8 h-8" />,
    pathwayCount: 32,
    gradient: 'from-amber-500 via-orange-500 to-rose-400',
    accentColor: '#f59e0b'
  },
  {
    id: 'cargo',
    title: 'Cargo Operations',
    description: 'Freight and logistics operations including express delivery and long-haul cargo.',
    icon: <Icons.Globe className="w-8 h-8" />,
    pathwayCount: 24,
    gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
    accentColor: '#10b981'
  },
  {
    id: 'specialty',
    title: 'Specialty & Rotary',
    description: 'Helicopters, air ambulance, firefighting, and aerial photography operations.',
    icon: <Icons.Zap className="w-8 h-8" />,
    pathwayCount: 18,
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    accentColor: '#8b5cf6'
  },
  {
    id: 'cadet',
    title: 'Cadet & Instruction',
    description: 'Airline cadet programs and flight instructor positions to build hours.',
    icon: <IconComponents.GraduationCap className="w-8 h-8" />,
    pathwayCount: 27,
    gradient: 'from-rose-600 via-pink-500 to-rose-400',
    accentColor: '#f43f5e'
  },
  {
    id: 'evtols',
    title: 'eVTOL & Air Taxi',
    description: 'Emerging urban air mobility sector with electric vertical take-off and landing.',
    icon: <Icons.Target className="w-8 h-8" />,
    pathwayCount: 15,
    gradient: 'from-cyan-600 via-sky-500 to-blue-400',
    accentColor: '#06b6d4'
  }
];

const QUICK_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Pathways', isActive: true },
  { id: 'jet', label: 'Jet Aircraft' },
  { id: 'turboprop', label: 'Turboprop' },
  { id: 'low-hours', label: 'Low Hours (<300)' },
  { id: 'visa', label: 'Visa Sponsorship' },
  { id: 'global', label: 'Global Routes' },
  { id: 'fast-track', label: 'Fast Track' },
  { id: 'sponsored', label: 'Fully Sponsored' }
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const MatchBadge: React.FC<{ percentage: number; size?: 'sm' | 'md' | 'lg' }> = ({ percentage, size = 'md' }) => {
  const getColor = (p: number) => {
    if (p >= 90) return 'from-emerald-400 via-green-400 to-teal-400';
    if (p >= 80) return 'from-blue-400 via-cyan-400 to-sky-400';
    if (p >= 70) return 'from-amber-400 via-yellow-400 to-orange-400';
    return 'from-slate-400 via-gray-400 to-zinc-400';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <div 
      className={`relative inline-flex items-center gap-1 rounded-full font-bold text-slate-900 ${sizeClasses[size]}`}
      style={{
        background: `linear-gradient(135deg, ${percentage >= 90 ? '#34d399' : percentage >= 80 ? '#60a5fa' : '#fbbf24'} 0%, ${percentage >= 90 ? '#10b981' : percentage >= 80 ? '#3b82f6' : '#f59e0b'} 100%)`,
        boxShadow: `0 0 20px ${percentage >= 90 ? 'rgba(52, 211, 153, 0.5)' : percentage >= 80 ? 'rgba(96, 165, 250, 0.5)' : 'rgba(251, 191, 36, 0.5)'}`
      }}
    >
      <IconComponents.Star className="w-3 h-3 fill-current" />
      <span>{percentage}% Match</span>
    </div>
  );
};

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', hover = true, onClick }) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-3xl
      bg-white/5 backdrop-blur-xl
      border border-white/10
      ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1' : ''}
      transition-all duration-500 ease-out
      ${className}
    `}
  >
    {children}
  </div>
);

const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count}{suffix}</span>;
};

// ============================================================================
// SECTION 1: TRENDING & INTEL HERO
// ============================================================================

const TrendingHero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setActiveSlide(current => (current + 1) % TRENDING_INTEL.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const current = TRENDING_INTEL[activeSlide];

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image with Ken Burns Effect */}
      <div 
        className="absolute inset-0 transition-transform duration-[10000ms] ease-linear"
        style={{
          backgroundImage: `url(${current.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.1)',
          animation: 'kenBurns 10s ease-in-out infinite alternate'
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
      
      {/* Glassmorphism Content Card */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <GlassCard className="max-w-4xl w-full p-8 md:p-12">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`
              px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
              ${current.isUrgent 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}
            `}>
              {current.category}
            </span>
            {current.isUrgent && (
              <span className="flex items-center gap-1 text-rose-400 text-sm font-semibold animate-pulse">
                <Icons.Zap className="w-4 h-4" /> Urgent
              </span>
            )}
          </div>
          
          {/* Title & Subtitle */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {current.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
            {current.subtitle}
          </p>
          
          {/* CTA Button */}
          <button className="
            group flex items-center gap-3 px-8 py-4 
            bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500
            hover:from-blue-400 hover:via-blue-500 hover:to-cyan-400
            rounded-xl font-semibold text-white
            transition-all duration-300
            shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40
          ">
            {current.ctaText}
            <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </GlassCard>
      </div>
      
      {/* Pagination Dots & Progress */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {TRENDING_INTEL.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveSlide(index);
              setProgress(0);
            }}
            className="relative group"
          >
            <div className={`
              w-12 h-1.5 rounded-full transition-all duration-300
              ${index === activeSlide ? 'bg-slate-600' : 'bg-slate-700 hover:bg-slate-600'}
            `}>
              {index === activeSlide && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
      
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1.1) translate(0, 0); }
          100% { transform: scale(1.2) translate(-2%, -2%); }
        }
      `}</style>
    </section>
  );
};

// ============================================================================
// SECTION 2: FOR YOU MATCHING FEED
// ============================================================================

const ForYouFeed: React.FC<{ userProfile?: any }> = ({ userProfile }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 px-4 md:px-8">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg">
                <Icons.Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">
                Personalized For You
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Career Matches Based on Your Profile
            </h2>
            <p className="text-slate-400 mt-2">
              AI-powered recommendations using your {userProfile?.flightHours || '250'} flight hours and certifications
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`
                p-3 rounded-full border border-white/10 backdrop-blur-sm
                transition-all duration-300
                ${canScrollLeft 
                  ? 'bg-white/10 text-white hover:bg-white/20 hover:scale-110' 
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              <Icons.ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`
                p-3 rounded-full border border-white/10 backdrop-blur-sm
                transition-all duration-300
                ${canScrollRight 
                  ? 'bg-white/10 text-white hover:bg-white/20 hover:scale-110' 
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              <Icons.ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 px-4 md:px-8 scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {FOR_YOU_MATCHES.map((match) => (
          <GlassCard
            key={match.id}
            className="flex-shrink-0 w-[380px] p-6 cursor-pointer group"
          >
            {/* Header with Match Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center text-2xl">
                  {match.company.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{match.title}</h3>
                  <p className="text-slate-400 text-sm">{match.company}</p>
                </div>
              </div>
              <MatchBadge percentage={match.matchPercentage} />
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                <IconComponents.MapPin className="w-3 h-3" /> {match.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                <IconComponents.DollarSign className="w-3 h-3" /> {match.salary}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                <Icons.Clock className="w-3 h-3" /> {match.postedAt}
              </span>
            </div>

            {/* Match Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {match.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${tag.includes('Matches') 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : tag.includes('Needed') 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Requirements */}
            <div className="space-y-2 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Requirements</p>
              <div className="flex flex-wrap gap-2">
                {match.requirements.map((req, i) => (
                  <span key={i} className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with Status Badges */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex gap-2">
                {match.isNew && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-semibold">
                    NEW
                  </span>
                )}
                {match.isHot && (
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-xs rounded-full font-semibold">
                    HOT
                  </span>
                )}
              </div>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                View Details <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 3: WINGMENTOR EXCLUSIVES
// ============================================================================

const WingMentorExclusives: React.FC<{ userProfile?: any }> = ({ userProfile }) => {
  const hasCompletedFoundation = userProfile?.foundationCompleted || false;

  return (
    <section className="py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 mb-4">
            <Icons.Award className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-semibold text-sm uppercase tracking-wider">
              WingMentor Exclusives
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Direct Entry Partnerships
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Skip the line with exclusive fast-track pathways. These opportunities are only available to WingMentor members.
          </p>
        </div>

        {/* Exclusives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXCLUSIVE_PATHWAYS.map((exclusive) => (
            <GlassCard
              key={exclusive.id}
              className={`p-6 ${exclusive.isLocked ? 'opacity-80' : ''}`}
              hover={!exclusive.isLocked}
            >
              {/* Lock Overlay */}
              {exclusive.isLocked && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4">
                    <Icons.Lock className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-300 font-semibold mb-2">Locked</p>
                  <p className="text-slate-500 text-sm text-center max-w-xs">
                    {exclusive.unlockRequirement}
                  </p>
                  <button className="mt-4 px-6 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                    View Requirements
                  </button>
                </div>
              )}

              {/* Partner Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-400/20 flex items-center justify-center">
                    <IconComponents.Star className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-amber-300 font-semibold">{exclusive.partner}</span>
                </div>
                {!exclusive.isLocked && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-semibold border border-emerald-500/30">
                    Available Now
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-2">{exclusive.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{exclusive.description}</p>

              {/* Benefits */}
              <div className="flex flex-wrap gap-2 mb-4">
                {exclusive.benefits.map((benefit, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs text-slate-300 bg-white/5 px-2 py-1 rounded-full"
                  >
                    <IconComponents.CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {benefit}
                  </span>
                ))}
              </div>

              {/* Slots & Deadline */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Limited Spots</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"
                        style={{ width: `${(exclusive.slotsAvailable / exclusive.totalSlots) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-300">
                      {exclusive.slotsAvailable}/{exclusive.totalSlots} left
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Apply by</p>
                  <p className="text-sm text-slate-300">{new Date(exclusive.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              {/* CTA Button */}
              {!exclusive.isLocked && (
                <button className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40">
                  Apply Now
                </button>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 4: EXPLORE BY SECTOR GRID
// ============================================================================

const ExploreBySector: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Explore by Sector
          </h2>
          <p className="text-slate-400">
            Discover career pathways across different aviation sectors
          </p>
        </div>

        {/* Sector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTOR_CATEGORIES.map((sector) => (
            <div
              key={sector.id}
              className="group relative overflow-hidden rounded-3xl cursor-pointer"
              style={{ aspectRatio: '16/10' }}
            >
              {/* Gradient Background */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${sector.gradient} 
                opacity-20 group-hover:opacity-30 transition-opacity duration-500
              `} />
              
              {/* Glass Overlay */}
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm group-hover:bg-slate-900/70 transition-colors duration-500" />
              
              {/* Hover Glow */}
              <div 
                className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${sector.accentColor}20, transparent 40%)`
                }}
              />
              
              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div>
                  {/* Icon */}
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                    bg-gradient-to-br ${sector.gradient} text-white
                    shadow-lg group-hover:scale-110 transition-transform duration-500
                  `}>
                    {sector.icon}
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                    {sector.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {sector.description}
                  </p>
                </div>
                
                {/* Pathway Count & Arrow */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-slate-500 text-sm">
                    <AnimatedCounter value={sector.pathwayCount} /> pathways
                  </span>
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    bg-white/5 group-hover:bg-white/10 
                    group-hover:translate-x-1 group-hover:-translate-y-1
                    transition-all duration-300
                  `}>
                    <Icons.ArrowRight 
                      className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 5: STICKY SEARCH & FILTER BAR
// ============================================================================

const StickySearchBar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFilter = (id: string) => {
    if (id === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.filter(f => f !== 'all');
      if (activeFilters.includes(id)) {
        const filtered = newFilters.filter(f => f !== id);
        setActiveFilters(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setActiveFilters([...newFilters, id]);
      }
    }
  };

  return (
    <>
      {/* Sticky Search Container */}
      <div className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}>
        <div className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img src="/logo.png" alt="WingMentor" className="h-8 w-auto" />
              </div>
              
              {/* Search Input */}
              <div className="flex-1 relative">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pathways, airlines, or positions..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <IconComponents.Filter className="w-5 h-5" />
                <span className="hidden md:inline">Filters</span>
              </button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                    transition-all duration-300
                    ${activeFilters.includes(filter.id)
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/10'}
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Drawer Modal */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowFilterDrawer(false)}
          />
          <GlassCard className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Advanced Filters</h3>
              <button 
                onClick={() => setShowFilterDrawer(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <IconComponents.X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            {/* Filter Sections */}
            <div className="space-y-6">
              {/* Aircraft Type */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Aircraft Type</h4>
                <div className="flex flex-wrap gap-2">
                  {['Boeing 737', 'Airbus A320', 'Gulfstream G650', 'Bombardier Global', 'CRJ Series', 'Embraer E-Jet'].map((type) => (
                    <button
                      key={type}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Experience Level */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Experience Level</h4>
                <div className="flex flex-wrap gap-2">
                  {['0-250 hrs', '250-500 hrs', '500-1000 hrs', '1000-1500 hrs', '1500+ hrs'].map((level) => (
                    <button
                      key={level}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Location */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Location</h4>
                <div className="flex flex-wrap gap-2">
                  {['North America', 'Europe', 'Middle East', 'Asia Pacific', 'Remote/Flexible'].map((loc) => (
                    <button
                      key={loc}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Salary Range */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Salary Range</h4>
                <div className="flex flex-wrap gap-2">
                  {['$40k-$60k', '$60k-$80k', '$80k-$100k', '$100k-$150k', '$150k+'].map((salary) => (
                    <button
                      key={salary}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                    >
                      {salary}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
              <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition-all">
                Reset Filters
              </button>
              <button 
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl text-white font-semibold transition-all"
              >
                Apply Filters
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

interface PathwaysPageProps {
  userProfile?: any;
  onBack?: () => void;
  isDarkMode?: boolean;
}

export const PathwaysPage: React.FC<PathwaysPageProps> = ({ 
  userProfile, 
  onBack,
  isDarkMode = true 
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[200px]" />
      </div>

      {/* Sticky Search Bar */}
      <StickySearchBar />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Back Button */}
        {onBack && (
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Hub
            </button>
          </div>
        )}

        {/* Hero Section */}
        <TrendingHero />

        {/* For You Feed */}
        <ForYouFeed userProfile={userProfile} />

        {/* WingMentor Exclusives */}
        <WingMentorExclusives userProfile={userProfile} />

        {/* Explore by Sector */}
        <ExploreBySector />

        {/* Bottom Spacing */}
        <div className="h-20" />
      </main>

      {/* Global Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PathwaysPage;
