import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, 
  Lock, 
  Unlock, 
  TrendingUp, 
  Plane, 
  Briefcase, 
  GraduationCap, 
  Search,
  Filter,
  ChevronRight,
  Star,
  Zap,
  Target,
  Globe,
  Users,
  Award,
  Clock,
  MapPin,
  DollarSign,
  Shield,
  CheckCircle2,
  X
} from 'lucide-react';

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
    icon: <Plane className="w-8 h-8" />,
    pathwayCount: 48,
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    accentColor: '#3b82f6'
  },
  {
    id: 'private',
    title: 'Private & Corporate',
    description: 'Executive transport, fractional ownership, and luxury charter operations.',
    icon: <Briefcase className="w-8 h-8" />,
    pathwayCount: 32,
    gradient: 'from-amber-500 via-orange-500 to-rose-400',
    accentColor: '#f59e0b'
  },
  {
    id: 'cargo',
    title: 'Cargo Operations',
    description: 'Freight and logistics operations including express delivery and long-haul cargo.',
    icon: <Globe className="w-8 h-8" />,
    pathwayCount: 24,
    gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
    accentColor: '#10b981'
  },
  {
    id: 'specialty',
    title: 'Specialty & Rotary',
    description: 'Helicopters, air ambulance, firefighting, and aerial photography operations.',
    icon: <Zap className="w-8 h-8" />,
    pathwayCount: 18,
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    accentColor: '#8b5cf6'
  },
  {
    id: 'cadet',
    title: 'Cadet & Instruction',
    description: 'Airline cadet programs and flight instructor positions to build hours.',
    icon: <GraduationCap className="w-8 h-8" />,
    pathwayCount: 27,
    gradient: 'from-rose-600 via-pink-500 to-rose-400',
    accentColor: '#f43f5e'
  },
  {
    id: 'evtols',
    title: 'eVTOL & Air Taxi',
    description: 'Emerging urban air mobility sector with electric vertical take-off and landing.',
    icon: <Target className="w-8 h-8" />,
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
      <Star className="w-3 h-3 fill-current" />
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
                <Zap className="w-4 h-4" /> Urgent
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
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                <Target className="w-5 h-5 text-white" />
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
              <ChevronRight className="w-5 h-5 rotate-180" />
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
              <ChevronRight className="w-5 h-5" />
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
                <MapPin className="w-3 h-3" /> {match.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                <DollarSign className="w-3 h-3" /> {match.salary}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" /> {match.postedAt}
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
                View Details <ChevronRight className="w-4 h-4" />
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
            <Award className="w-4 h-4 text-amber-400" />
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
                    <Lock className="w-8 h-8 text-slate-400" />
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
                    <Star className="w-5 h-5 text-amber-400" />
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
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
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
                    <ArrowRight 
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                <Filter className="w-5 h-5" />
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
                <X className="w-5 h-5 text-slate-400" />
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
