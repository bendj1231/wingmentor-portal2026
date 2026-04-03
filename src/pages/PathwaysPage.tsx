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
  const [searchQuery, setSearchQuery] = useState('');
  const [hasError, setHasError] = useState(false);

  // Debug: log when component mounts
  useEffect(() => {
    console.log('PathwaysPage mounted', { userProfile, isDarkMode });
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100" onError={() => setHasError(true)}>
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

      {/* Debug indicator */}
      <div className="fixed top-0 left-0 z-[9999] bg-red-500 text-white px-2 py-1 text-xs">
        PathwaysPage Loaded
      </div>

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
