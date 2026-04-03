import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../icons';
import type { UserProfile } from '../types/user';
import { RecognitionAchievementPage } from './RecognitionAchievementPage';
import { DashboardPage } from './DashboardPage';
import FoundationalProgramPage from './FoundationalProgramPage';
import FoundationalProgramLogbookPage from './FoundationalProgramLogbookPage';
import { EnrollmentOnboardingPage } from './EnrollmentOnboardingPage';
import { EnrollmentConfirmationPage } from './EnrollmentConfirmationPage';
import { PostEnrollmentSlideshow } from './PostEnrollmentSlideshow';
import EnrolledFoundationalPage from './EnrolledFoundationalPage';
import { TransitionProgramPage } from './TransitionProgramPage';
import ContactPage from './ContactPage';
import { ATPLPathwayPage } from './ATPLPathwayPage';
import { PrivateSectorPathwayPage } from './PrivateSectorPathwayPage';
import LogbookPage from './LogbookPage';
import ExaminationResultsPage from './ExaminationResultsPage';
import AtlasResumePage from './AtlasResumePage';
import FullAtlasResumePage from './FullAtlasResumePage';
import PrintableResumePage from './PrintableResumePage';
import { DigitalLogbookPage } from './DigitalLogbookPage';
import MentorLogbookPage from './FoundationalProgramLogbookPage';
import PilotLicensureExperiencePage from './PilotLicensureExperiencePage';
import { PathwayCarousel } from '../components/PathwayCarousel';
import { getUserTrack, getTrackConfig, canAccessPage, getRedirectPage } from '../config/accessControl';
import { getEnrollmentStatus, supabase } from '../lib/supabase-auth';
import PilotGapModulePage from './PilotGapModulePage';
import MentorModulesPage from './MentorModulesPage';
import { AviationIndustryExpectationsPage } from './AviationIndustryExpectationsPage';
import ProgramProgressPage from './ProgramProgressPage';
import ModulesPage from './ModulesPage';
import ExaminationPortalPage from './ExaminationPortalPage';
import FoundationalKnowledgeExamPage from './FoundationalKnowledgeExamPage';
import LicenseSelectionPage from './LicenseSelectionPage';
import InterviewEvaluationPage from './InterviewEvaluationPage';
import ProgramSyllabusPage from './ProgramSyllabusPage';

// Foundational Enrollment Check Component
const FoundationalEnrollmentCheck: React.FC<{ 
  userId?: string; 
  onResult: (enrolled: boolean) => void;
  preloadedEnrollment?: any;
  preloadedPrograms?: string[];
  userProfile?: any;
}> = ({ userId, onResult, preloadedEnrollment, preloadedPrograms, userProfile }) => {
  const [isLoading, setIsLoading] = useState(!preloadedEnrollment && !preloadedPrograms);

  useEffect(() => {
    const checkEnrollment = async () => {
      console.log('🔍 FoundationalEnrollmentCheck: Starting check', { userId, hasPreloadedPrograms: !!preloadedPrograms, hasPreloadedEnrollment: !!preloadedEnrollment });
      
      if (!userId) {
        console.log('⚠️ FoundationalEnrollmentCheck: No userId, routing to foundational (not enrolled)');
        onResult(false);
        setIsLoading(false);
        return;
      }

      // Use preloaded data if available
      if (preloadedPrograms && preloadedPrograms.length > 0) {
        console.log('📋 FoundationalEnrollmentCheck: preloadedPrograms contents:', preloadedPrograms);
        const isEnrolled = preloadedPrograms.includes('Foundational');
        console.log('✅ FoundationalEnrollmentCheck: Using preloadedPrograms, isEnrolled:', isEnrolled);
        onResult(isEnrolled);
        setIsLoading(false);
        return;
      }

      // Check userProfile enrolled_programs as fallback
      if (userProfile?.enrolledPrograms && userProfile.enrolledPrograms.length > 0) {
        console.log('📋 FoundationalEnrollmentCheck: userProfile.enrolledPrograms:', userProfile.enrolledPrograms);
        const isEnrolled = userProfile.enrolledPrograms.includes('Foundational');
        console.log('✅ FoundationalEnrollmentCheck: Using userProfile, isEnrolled:', isEnrolled);
        onResult(isEnrolled);
        setIsLoading(false);
        return;
      }

      if (preloadedEnrollment && Object.keys(preloadedEnrollment).length > 0) {
        console.log('📋 FoundationalEnrollmentCheck: preloadedEnrollment contents:', preloadedEnrollment);
        const isEnrolled = preloadedEnrollment.program === 'Foundational' || 
                          preloadedEnrollment.status === 'active';
        console.log('✅ FoundationalEnrollmentCheck: Using preloadedEnrollment, isEnrolled:', isEnrolled);
        onResult(isEnrolled);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🌐 FoundationalEnrollmentCheck: Fetching enrollment status from API');
        const enrolledPrograms = await getEnrollmentStatus(userId);
        const isEnrolled = enrolledPrograms.includes('Foundational');
        console.log('✅ FoundationalEnrollmentCheck: API result, isEnrolled:', isEnrolled);
        onResult(isEnrolled);
      } catch (error) {
        console.error('❌ FoundationalEnrollmentCheck: Error checking enrollment status:', error);
        onResult(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnrollment();

    // Failsafe: ensure loading completes even if something hangs
    const timeout = setTimeout(() => {
      console.warn('⚠️ FoundationalEnrollmentCheck: Timeout - forcing completion');
      setIsLoading(false);
      onResult(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [userId, onResult, preloadedEnrollment, preloadedPrograms]);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '4px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }} />
          <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>
            Checking Enrollment Status
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            Please wait while we verify your program enrollment...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return null;
};

const jobApplicationListings = [
  { title: 'Non Rated First Officers — Airbus A320 - Macau', url: 'https://pilotcareercenter.com/ASIA', company: 'Air Macau', aircraft: 'Airbus A320', location: 'Macau', role: 'First Officer' },
  { title: 'Type Rated First Officers — Airbus A320 - Macau', url: 'https://pilotcareercenter.com/ASIA', company: 'Air Macau', aircraft: 'Airbus A320', location: 'Macau', role: 'First Officer' },
  { title: 'Type Rated Captains — Airbus A320 - Macau', url: 'https://pilotcareercenter.com/ASIA', company: 'Air Macau', aircraft: 'Airbus A320', location: 'Macau', role: 'Captain' },
  { title: 'First Officers (Direct Entry) — A330/A350/B777/B747 - Hong Kong', url: 'https://pilotcareercenter.com/ASIA', company: 'Cathay Pacific', aircraft: 'Airbus A330, Airbus A350, Boeing 777, Boeing 747', location: 'Hong Kong', role: 'First Officer' },
  { title: 'TR SNR First Officers — ATR72-600 - Hyderabad, India', url: 'https://pilotcareercenter.com/ASIA', company: 'fly91', aircraft: 'ATR72-600', location: 'Hyderabad, India', role: 'Senior First Officer' },
  { title: 'TR NTR Captains — ATR72-600 - Hyderabad, India', url: 'https://pilotcareercenter.com/ASIA', company: 'fly91', aircraft: 'ATR72-600', location: 'Hyderabad, India', role: 'Captain' },
  { title: 'Ab-Initio Cadet Pilots — Airbus & Boeing', url: 'https://pilotcareercenter.com/ASIA', company: 'Singapore Airlines', aircraft: 'Airbus A320/A321/A330/A350, Boeing 737/747/777', location: 'Asia', role: 'Cadet Pilot' },
  { title: 'Type Rated Captains — Airbus A320/A321 - Tashkent', url: 'https://pilotcareercenter.com/ASIA', company: 'Uzbekistan Airways', aircraft: 'Airbus A320, Airbus A321', location: 'Tashkent', role: 'Captain' },
  { title: 'Type Rated First Officers — Airbus A320/A321 - Tashkent', url: 'https://pilotcareercenter.com/ASIA', company: 'Uzbekistan Airways', aircraft: 'Airbus A320, Airbus A321', location: 'Tashkent', role: 'First Officer' },
  { title: 'Experienced Captain — Global 8000 - Shanghai, China', url: 'https://pilotcareercenter.com/ASIA', company: 'Metrojet', aircraft: 'Global 8000', location: 'Shanghai, China', role: 'Experienced Captain' },
  { title: 'First Officers w/ Command Potential — Airbus A320 - Ho Chi Minh / Hanoi', url: 'https://pilotcareercenter.com/ASIA', company: 'Vietravel Airlines', aircraft: 'Airbus A320', location: 'Ho Chi Minh / Hanoi', role: 'First Officer' },
  { title: 'Type Rated First Officers — Airbus A320 - Ho Chi Minh / Hanoi', url: 'https://pilotcareercenter.com/ASIA', company: 'Vietravel Airlines', aircraft: 'Airbus A320', location: 'Ho Chi Minh / Hanoi', role: 'First Officer' },
  { title: 'Type Rated First Officers — Airbus A320 - Hong Kong', url: 'https://pilotcareercenter.com/ASIA', company: 'HK Express', aircraft: 'Airbus A320', location: 'Hong Kong', role: 'First Officer' },
  { title: 'Non Rated First Officers — Airbus A320 - Hong Kong', url: 'https://pilotcareercenter.com/ASIA', company: 'HK Express', aircraft: 'Airbus A320', location: 'Hong Kong', role: 'First Officer' },
  { title: 'Second Officers — Airbus A320 - Hong Kong', url: 'https://pilotcareercenter.com/ASIA', company: 'HK Express', aircraft: 'Airbus A320', location: 'Hong Kong', role: 'Second Officer' },
  { title: 'Non Rated Captains — Airbus A320 - Hong Kong', url: 'https://pilotcareercenter.com/ASIA', company: 'HK Express', aircraft: 'Airbus A320', location: 'Hong Kong', role: 'Captain' },
  { title: 'Type Rated Captains — Airbus A320 - Hong Kong', url: 'https://pilotcareercenter.com/ASIA', company: 'HK Express', aircraft: 'Airbus A320', location: 'Hong Kong', role: 'Captain' },
  { title: 'Senior First Officers — Boeing 737-800F Cargo', url: 'https://pilotcareercenter.com/ASIA', company: 'Blue Dart Aviation', aircraft: 'Boeing 737', location: 'India', role: 'Senior First Officer' },
  { title: 'Non Rated Captains — Airbus A320 - Almaty, Kazakhstan', url: 'https://pilotcareercenter.com/ASIA', company: 'Air Astana', aircraft: 'Airbus A320', location: 'Almaty, Kazakhstan', role: 'Captain' },
  { title: 'First Officers — Airbus A330F - Hong Kong', url: 'https://pilotcareercenter.com/ASIA', company: 'Air Hongkong', aircraft: 'Airbus A330', location: 'Hong Kong', role: 'First Officer' },
  { title: 'Amphibious Captain — DHC6 300/400', url: 'https://pilotcareercenter.com/ASIA', company: 'Airfast Indonesia', aircraft: 'DHC6 300/400', location: 'Indonesia', role: 'Amphibious Captain' },
  { title: 'Type Rated First Officers — Airbus A320 - Manila', url: 'https://pilotcareercenter.com/ASIA', company: 'AirAsia Philippines', aircraft: 'Airbus A320', location: 'Manila', role: 'First Officer' },
  { title: 'Seaplane Captains — C208 Caravan Amphibians', url: 'https://pilotcareercenter.com/ASIA', company: 'Thai Seaplane Co.', aircraft: 'C208 Caravan Amphibians', location: 'Thailand', role: 'Seaplane Captain' },
  { title: 'First Officers — Boeing & Airbus', url: 'https://pilotcareercenter.com/ASIA', company: 'China Airlines (Taiwan)', aircraft: 'Airbus A320/A321/A330/A350, Boeing 737/747/777', location: 'RCTP Taiwan', role: 'First Officer' },
  { title: 'Non Rated First Officers — Airbus A320 - Almaty, Kazakhstan', url: 'https://pilotcareercenter.com/ASIA', company: 'Air Astana', aircraft: 'Airbus A320', location: 'Almaty, Kazakhstan', role: 'First Officer' },
  { title: 'Type Rated First Officers — Airbus A320 - Almaty, Kazakhstan', url: 'https://pilotcareercenter.com/ASIA', company: 'Air Astana', aircraft: 'Airbus A320', location: 'Almaty, Kazakhstan', role: 'First Officer' },
  { title: 'Cadet Pilots — B777 / A350 / A330 - Hong Kong', url: 'https://pilotcareercenter.com/ASIA', company: 'Cathay Pacific', aircraft: 'Airbus A330, Airbus A350, Boeing 777', location: 'Hong Kong', role: 'Cadet Pilot' },
  { title: 'JCAB Direct Entry Captains — Airbus A320 - Japan', url: 'https://pilotcareercenter.com/ASIA', company: 'Peach', aircraft: 'Airbus A320', location: 'Japan', role: 'Captain' },
  { title: 'ICAO Direct Entry Captains — Airbus A320 - Japan', url: 'https://pilotcareercenter.com/ASIA', company: 'Peach', aircraft: 'Airbus A320', location: 'Japan', role: 'Captain' }
];

interface WingMentorHomeProps {
  onLogout: () => void;
  userProfile?: UserProfile | null;
  onStartFoundationalEnrollment?: () => void;
  onViewChange?: (view: string, returnView?: string) => void;
  initialView?: MainView;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  preloadedData?: {
    portfolio?: any;
    achievements?: any;
    enrollment?: any;
    pathways?: any;
    programs?: any;
  };
}

export type MainView = 
  | 'dashboard'
  | 'news'
  | 'programs' 
  | 'pathways'
  | 'applications'
  | 'recognition'
  | 'pilot-portfolio'
  | 'foundational'
  | 'foundational-get-started'
  | 'foundational-onboarding'
  | 'foundational-loading'
  | 'enrollment-confirmation'
  | 'post-enrollment-slideshow'
  | 'transition'
  | 'pilot-profile'
  | 'contact'
  | 'wingmentor-network'
  | 'aviation-expectations'
  | 'atpl-pathway'
  | 'private-sector'
  | 'examination-results'
  | 'logbook'
  | 'digital-logbook'
  | 'foundational-logbook'
  | 'pilot-licensure-experience'
  | 'atlas-resume'
  | 'printable-resume'
  | 'pilot-gap-module'
  | 'pilot-gap-module-2'
  | 'module-3'
  | 'mentor-modules'
  | 'foundational-enrollment-check'
  | 'foundational-enrolled'
  | 'foundational-logbook'
  | 'program-progress'
  | 'modules'
  | 'examination-portal'
  | 'foundational-exam'
  | 'license-selection'
  | 'interview-evaluation'
  | 'program-syllabus'
  | 'full-atlas-resume';

const pathwayUpdates = [
  {
    title: 'Emirates ATPL Applications Open',
    summary: 'New cadet program cohort starting Q2 2024 with enhanced training curriculum.',
    date: 'March 15, 2026',
    source: 'WingMentor Admissions',
    platform: 'Program Update'
  },
  {
    title: 'Cargo Pathway Industry Partnerships',
    summary: 'Major cargo carriers offering guaranteed interviews for pathway graduates.',
    date: 'March 12, 2026',
    source: 'Cargo Partnerships',
    platform: 'Industry News'
  },
  {
    title: 'Flight Instructor Scholarships',
    summary: 'New funding opportunities for CFI candidates with structured mentorship.',
    date: 'March 10, 2026',
    source: 'Innovation Fund',
    platform: 'Scholarships'
  }
];

export const WingMentorHome: React.FC<WingMentorHomeProps> = ({ 
  onLogout, 
  userProfile, 
  onStartFoundationalEnrollment,
  onViewChange,
  initialView = 'programs',
  isDarkMode = false,
  onToggleDarkMode,
  preloadedData = {}
}) => {
  const [mainView, setMainView] = useState<MainView>(initialView || 'dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const SIDEBAR_BASE_WIDTH = 520;
  const SIDEBAR_BASE_HEIGHT = 980;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only sync initialView to mainView on mount or when initialView actually changes from parent
  useEffect(() => {
    if (initialView && initialView !== mainView) {
      setMainView(initialView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialView]);

  const [sidebarScale, setSidebarScale] = useState(1);

  // Program progress state for Foundation Program Journey
  const [programProgress, setProgramProgress] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Fetch program progress from Supabase
  useEffect(() => {
    const fetchProgramProgress = async () => {
      if (!userProfile?.id) {
        setLoadingProgress(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('program_progress')
          .select('*')
          .eq('user_id', userProfile.id)
          .eq('program_type', 'Foundational')
          .single();

        if (error) {
          console.log('No program progress found, using defaults');
          setProgramProgress({
            completion_percentage: 0,
            modules_completed: [],
            total_modules: 3,
            status: 'not_started'
          });
        } else {
          setProgramProgress(data);
        }
      } catch (err) {
        console.error('Error fetching program progress:', err);
        setProgramProgress({
          completion_percentage: 0,
          modules_completed: [],
          total_modules: 3,
          status: 'not_started'
        });
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgramProgress();
  }, [userProfile?.id]);

  // Calculate progress values
  const completedCount = programProgress?.modules_completed?.length || 0;
  const totalCount = programProgress?.total_modules || 3;
  const progressPercent = programProgress?.completion_percentage || Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    const handleResize = () => {
      const widthScale = window.innerWidth / 1400;
      const heightScale = window.innerHeight / SIDEBAR_BASE_HEIGHT;
      const nextScale = Math.min(1, Math.max(0.65, Math.min(widthScale, heightScale)));
      setSidebarScale(nextScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userProfileDisplayName = (userProfile?.displayName && userProfile.displayName.trim())
    || [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ').trim()
    || userProfile?.email
    || 'Pilot';
  const userDisplayName = userProfileDisplayName;
  const userHasFoundationalEnrollment = Boolean(userProfile?.enrolledPrograms?.includes('Foundational'));
  const userFirstName = userProfile?.firstName?.trim() || userDisplayName.split(' ')[0] || 'Pilot';
  const handleAccessWebsite = () => {
    window.open('https://wingmentor.app', '_blank', 'noopener,noreferrer');
  };

  // Sidebar component - HubPage cards only with logo
  const Sidebar = () => {
    const scaledSidebarWidth = SIDEBAR_BASE_WIDTH * sidebarScale;
    return (
      <div style={{
        width: `${scaledSidebarWidth}px`,
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 10,
        background: isDarkMode
          ? 'linear-gradient(180deg, #020817 0%, #0f172a 55%, #111827 100%)'
          : 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)'
      }}>
        <div
          className="dashboard-container animate-fade-in"
          style={{
            transform: `scale(${sidebarScale})`,
            transformOrigin: 'top left',
            width: `${SIDEBAR_BASE_WIDTH}px`,
            height: `${SIDEBAR_BASE_HEIGHT}px`,
            padding: 0
          }}
        >
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', padding: '1rem' }}>
          <button 
            onClick={onLogout}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              background: isDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.9)',
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : '1px solid rgba(226, 232, 240, 0.8)',
              color: isDarkMode ? '#e2e8f0' : '#1e293b',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: isDarkMode ? '0 10px 30px rgba(2, 6, 23, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Icons.LogOut style={{ width: 16, height: 16 }} />
            Logout
          </button>
          
          {/* Sidebar Logo */}
          <div
            className="dashboard-header"
            style={{
              marginBottom: '1rem',
              marginTop: '0.5rem',
              background: isDarkMode ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%)' : undefined,
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : undefined,
              borderBottom: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : undefined,
              borderRadius: isDarkMode ? '20px' : undefined,
              boxShadow: isDarkMode ? '0 18px 36px rgba(2, 6, 23, 0.32)' : undefined
            }}
          >
            <div className="dashboard-logo" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
            </div>
            <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
          </div>

          <section className="dashboard-section" style={{ marginTop: '0.5rem' }}>
            <div className="cards-list">
              <div 
                className={`horizontal-card ${mainView === 'applications' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'applications' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('applications')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Flight logs, training records, and documents
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/Captain-Paperwork-Medium.jpg" alt="Dashboard" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              <div 
                className={`horizontal-card ${mainView === 'programs' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'programs' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('programs')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Programs</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Foundational and Transition mentorship programs
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/Gemini_Generated_Image_7awns87awns87awn.png" alt="Programs" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              <div 
                className={`horizontal-card ${mainView === 'pathways' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'pathways' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('pathways')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pathways</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Structured career roadmaps and training tracks
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/shutterstock_1698112222.jpg" alt="Pathways" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              <div 
                className={`horizontal-card ${mainView === 'recognition' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'recognition' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('recognition')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pilot Recognition</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Awards, flight hours, and certifications
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/Gemini_Generated_Image_tka3njtka3njtka3.png" alt="Recognition & Achievements" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              {/* WingMentor Network Directory Card */}
              <div 
                className={`horizontal-card ${mainView === 'wingmentor-network' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'wingmentor-network' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('wingmentor-network')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>WingMentor Network</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Recognition hub, knowledge bank, and aviation community
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/Networking.jpg" alt="WingMentor Network" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              {/* News & Updates Card - Moved under WingMentor Network */}
              <div 
                className={`horizontal-card ${mainView === 'news' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'news' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('news')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>News & Updates</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Latest announcements and industry insights
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="News & Updates" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>
            </div>
          </section>
          
          {/* Sidebar Footer */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1rem',
            background: isDarkMode
              ? 'linear-gradient(180deg, transparent 0%, rgba(2, 6, 23, 0.92) 30%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(240, 244, 248, 0.9) 30%)',
            borderTop: isDarkMode ? '1px solid rgba(51, 65, 85, 0.75)' : '1px solid rgba(226, 232, 240, 0.6)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setMainView('contact')}
                style={{
                  padding: '0.75rem 1rem',
                  background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.8)',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: '12px',
                  color: isDarkMode ? '#cbd5e1' : '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(30, 41, 59, 0.96)' : 'rgba(255, 255, 255, 0.95)';
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(96, 165, 250, 0.4)' : 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.color = isDarkMode ? '#93c5fd' : '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(71, 85, 105, 0.7)' : 'rgba(226, 232, 240, 0.8)';
                  e.currentTarget.style.color = isDarkMode ? '#cbd5e1' : '#475569';
                }}
              >
                <Icons.MessageCircle style={{ width: 16, height: 16 }} />
                Contact Support
              </button>
              <button
                onClick={() => setMainView('contact')}
                style={{
                  padding: '0.75rem 1rem',
                  background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.8)',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: '12px',
                  color: isDarkMode ? '#cbd5e1' : '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(30, 41, 59, 0.96)' : 'rgba(255, 255, 255, 0.95)';
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.3)';
                  e.currentTarget.style.color = '#f59e0b';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = isDarkMode ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(71, 85, 105, 0.7)' : 'rgba(226, 232, 240, 0.8)';
                  e.currentTarget.style.color = isDarkMode ? '#cbd5e1' : '#475569';
                }}
              >
                <Icons.Settings style={{ width: 16, height: 16 }} />
                Guidance
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };

  // News View Component
  const NewsView = () => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [selectedNewsItem, setSelectedNewsItem] = useState<any>(null);
    
    const handleNewsClick = (newsItem: any) => {
      setSelectedNewsItem(newsItem);
    };

    const handleBackToNews = () => {
      setSelectedNewsItem(null);
    };
    
    const newsItems = [
      {
        id: 1,
        title: "WingMentor Partners with Airbus on EBT/CBTA Alignment",
        date: "March 19, 2026",
        category: "Partnership",
        excerpt: "Airbus collaborates with WingMentor to embed EBT and CBTA standards across the Foundation and Transition Programs, reinforcing pilot readiness.",
        image: "https://www.groupcaliber.com/wp-content/uploads/2023/11/Airbus-Logo.webp"
      },
      {
        id: 2,
        title: "W1000 Application Launches for Foundation Program",
        date: "March 18, 2026",
        category: "Product Release",
        excerpt: "WingMentor debuts the W1000 application with integrated examinations and progress-tracking systems tailored for Foundation Program pilots.",
        image: "/w1000.png"
      },
      {
        id: 3,
        title: "WingMentor Featured at Promising Future Aviation Career Fair",
        date: "January 21, 2026",
        category: "Recognition",
        excerpt: "WingMentor joins Etihad and regional partners at the Promising Future Aviation Career Fair inside Dubai's Etihad Museum, spotlighting Foundation and Transition Program pathways.",
        image: "https://media.assettype.com/gulfnews%2F2026-01-21%2F7zv1p4ib%2FSTAFFBUS_260121_Aviation_Career_Fair_VSAKLANI_131768990559515.jpg?w=1200&ar=40%3A21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100"
      }
    ];

    const airlineFeedback = [
      {
        airline: "AirAsia",
        feedback: "WingMentor's recognition system has transformed our recruitment process. We now have access to verified, well-trained pilots.",
        logo: "/airline-airasia.jpg"
      },
      {
        airline: "Emirates",
        feedback: "The quality of pilots from WingMentor programs exceeds our expectations. Excellent training standards.",
        logo: "/airline-emirates.jpg"
      },
      {
        airline: "Singapore Airlines",
        feedback: "WingMentor graduates demonstrate superior CRM skills and technical proficiency.",
        logo: "/airline-singapore.jpg"
      }
    ];

    const linkedInProfiles = [
      {
        name: "Captain Sarah Chen",
        role: "First Officer, Emirates",
        achievement: "Completed Foundational Program • Now flying A380",
        image: "/profile-sarah-chen.jpg"
      },
      {
        name: "Michael Rodriguez",
        role: "Captain, AirAsia",
        achievement: "Transition Program Graduate • Fleet Commander",
        image: "/profile-michael-rodriguez.jpg"
      },
      {
        name: "Priya Patel",
        role: "First Officer, Singapore Airlines",
        achievement: "Fast-track Program • 500+ hours experience",
        image: "/profile-priya-patel.jpg"
      }
    ];

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
      }, 5000);
      return () => clearInterval(timer);
    }, [newsItems.length]);

    return (
      <div className="wingmentor-subpage news-view-page" style={{ 
        padding: '2.5rem 3rem 2rem 3rem', 
        maxWidth: '1400px', 
        margin: '0 auto',
        position: 'fixed',
        top: '120px',
        left: '0',
        right: '0',
        bottom: '0',
        overflow: 'auto',
        background: isDarkMode ? 'linear-gradient(135deg, #020817 0%, #0f172a 100%)' : 'white',
        zIndex: 10
      }}>
        {selectedNewsItem ? (
          // Detailed News View
          <div>
            {/* Back button */}
            <button
              onClick={handleBackToNews}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '2rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
              Back to News
            </button>

            {/* News Detail Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#059669',
                  background: 'rgba(5, 150, 105, 0.1)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px'
                }}>
                  {selectedNewsItem.source}
                </span>
                {selectedNewsItem.platform && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#6b7280',
                    background: 'rgba(107, 114, 128, 0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    {selectedNewsItem.platform}
                  </span>
                )}
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {selectedNewsItem.date}
                </span>
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                {selectedNewsItem.title}
              </h1>
            </div>

            {/* News Image */}
            {selectedNewsItem.image && (
              selectedNewsItem.title.includes('Airbus') ? (
                <div style={{
                  width: '100%',
                  borderRadius: '28px',
                  padding: '2.75rem 2.5rem',
                  marginBottom: '3rem',
                  boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 70%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <img src="/logo.png" alt="WingMentor" style={{ width: '180px', maxWidth: '40vw', height: 'auto', objectFit: 'contain' }} />
                    <span style={{ fontSize: '0.85rem', color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase' }}>WingMentor</span>
                  </div>
                  <div style={{ width: '1px', height: '80px', background: 'rgba(148,163,184,0.5)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={selectedNewsItem.image} alt="Airbus" style={{ width: '200px', maxWidth: '45vw', height: 'auto', objectFit: 'contain' }} />
                    <span style={{ fontSize: '0.85rem', color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Airbus</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  marginBottom: '3rem',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  backgroundColor: selectedNewsItem.source === 'EASA' ? '#1e3a8a' : 'transparent'
                }}>
                  <img
                    src={selectedNewsItem.image}
                    alt={selectedNewsItem.title}
                    style={{ 
                      width: '100%', 
                      height: selectedNewsItem.source === 'EASA' ? '200px' : '400px', 
                      objectFit: selectedNewsItem.source === 'EASA' ? 'contain' : 'cover',
                      padding: selectedNewsItem.source === 'EASA' ? '2rem' : '0'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-news.jpg';
                    }}
                  />
                </div>
              )
            )}

            {/* IATA Description */}
            {selectedNewsItem.source === 'IATA' && (
              <p style={{ 
                maxWidth: '700px', 
                margin: '0 auto 2rem', 
                fontSize: '0.95rem', 
                lineHeight: 1.6, 
                color: '#94a3b8',
                textAlign: 'center'
              }}>
                The International Air Transport Association (IATA) is the trade association for the world's airlines, representing 360 airlines or 83% of total air traffic, supporting aviation policy and ensuring safe, secure, and sustainable air transport worldwide.
              </p>
            )}

            {/* News Content */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem', 
              color: isDarkMode ? '#94a3b8' : '#475569', 
              fontSize: '17px', 
              lineHeight: 1.75,
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <p>
                {selectedNewsItem.excerpt}
              </p>
              
              {/* Extended content based on news type */}
              {selectedNewsItem.source === 'IATA' && selectedNewsItem.platform === 'Press Release No: 13' && (
                <>
                  <p>
                    The International Air Transport Association (IATA) released its Long-Term Demand Projections (LTDP) for air travel, showing that global air passenger demand is expected to more than double by 2050.
                  </p>
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Key Projections:</strong> Under the mid-range scenario, demand is forecast to reach 20.8 trillion revenue passenger kilometers (RPKs), based on a compound annual growth rate (CAGR) of 3.1% (2024-2050) from the 9 trillion RPKs seen in 2024.
                    </p>
                  </div>
                  <p>
                    "The outlook for air travel is positive. People want to travel and, under all our modeled scenarios, the demand to fly is expected to more than double by mid-century. That is good news for global economic and social development because aviation growth will catalyze opportunities, including jobs, around the world," said Willie Walsh, IATA's Director General.
                  </p>
                  <p>
                    The pace of growth will be uneven across regions, reflecting differences in demographics, market maturity, economic development, and connectivity potential. Under the mid-range scenario, Asia-Pacific and Africa are expected to be the fastest-growing regions over 2024-2050, with CAGRs of 3.8% and 3.6% respectively.
                  </p>
                  <p>
                    The LTDP identifies the fastest-growing markets as intra-Africa (4.9%), Africa-Asia-Pacific (4.5%), Asia-Pacific-Middle East (3.9%), intra-Asia-Pacific (3.9%), and Africa-North America (3.8%).
                  </p>
                </>
              )}
              
              {/* EASA Content */}
              {selectedNewsItem.source === 'EASA' && (
                <>
                  <p>
                    The European Union Aviation Safety Agency (EASA) has announced significant regulatory changes for 2026, including updates to pilot training, operations control, and the continued implementation of Evidence-Based Training (EBT) under the European Plan for Aviation Safety (EPAS) 2026-2028.
                  </p>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Key changes and requirements for 2026 include:</strong> Expanded EBT Implementation, Air Operations Rule Updates (Opinion 01/2026), EDTO Implementation, Helicopter EBT, Information Security (Part-IS), Ground Handling Rules, and New Technologies & GNSS.
                    </p>
                  </div>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Expanded EBT Implementation
                  </h4>
                  <p>
                    Operators are moving toward full EBT implementation, utilizing competency-based assessment and grading systems. The training involves grading competencies on a scale based on observable behaviors, with instructors needing to complete standardized training to perform EBT practical assessments.
                  </p>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Air Operations Rule Updates (Opinion 01/2026)
                  </h4>
                  <p>
                    Published on January 28, 2026, this opinion introduces new requirements for the duties, responsibilities, and training of operations control personnel (OCP), such as flight dispatchers.
                  </p>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    EDTO Implementation
                  </h4>
                  <p>
                    EASA is aligning EU legal frameworks with ICAO standards on Extended Diversion Time Operations (EDTO), updating ETOPS provisions for twin-engine aircraft, which affects fuel and diversion planning.
                  </p>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Additional Regulatory Updates
                  </h4>
                  <p>
                    The EBT framework is extending to helicopter operations (RMT 0599), setting the baseline for helicopter training programs. Mandatory Information Security Management Systems (ISMS) are being implemented under Part-IS, with compliance checks expected during 2026 audits. First-ever EU safety regulations for ground handling services are introduced, with implementation expected by 2028.
                  </p>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Technology Focus:</strong> The EPAS 2026 elevates GNSS jamming and spoofing to a top safety priority, focusing on training pilots for reversion to conventional navigation.
                    </p>
                  </div>
                  
                  <p>
                    These measures aim to ensure higher safety levels through a modernized, competence-focused, and technology-aware training environment.
                  </p>
                </>
              )}
              
              {/* Airbus Partnership Content */}
              {selectedNewsItem.title.includes('Airbus') && (
                <>
                  <div style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                    COLLABORATION ASSURANCE
                  </div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Airbus Validates the WingMentor Application Pipeline
                  </h4>
                  <p>
                    Airbus has affirmed WingMentor's application pipeline following a technical review of our Foundation and Transition Program data models. Their compliance team confirmed that our EBT/CBTA workflows provide an auditable trail of NOTECHS scoring, competency deltas, and remediation plans—giving operators confidence that WingMentor pilots arrive with measurable behaviors, not just logged hours.
                  </p>
                  <div style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '2.5rem 0 0.75rem 0' }}>
                    PILOT READINESS MANDATE
                  </div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                    Aligning Cadets with EBT/CBTA & the Nine Core Competencies
                  </h4>
                  <p>
                    This collaboration doubles as an assurance to implement the next wave of industry changes pilots are expected to master. Airbus encouraged WingMentor to continue familiarizing cadets with EBT/CBTA methodologies and the nine ICAO core competencies so that every graduate speaks the same technical language airlines are moving toward.
                  </p>

                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Application Assurance:</strong> Every WingMentor submission now includes Airbus-aligned evidence packs—structured competency reports, mentorship prescriptions, and W1000 examination dashboards—so talent partners can validate proficiency in minutes.
                    </p>
                  </div>

                  <p>
                    Airbus leaders also hosted a dedicated 15-minute interview with our mentorship faculty to understand how we escalate candidates into the Pilot Recognition Database. That conversation covered how WingMentor surfaces priority applicants, how quickly remediation plans are executed, and how Airbus recruitment teams can subscribe to live application alerts.
                  </p>

                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#eff6ff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #3b82f6',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 500 }}>
                      <strong>Want the briefing?</strong> We are offering the same overview to airline partners and training organizations that want a closer look at the WingMentor application stack—<a href="/inquiry" style={{ color: '#1d4ed8', fontWeight: 600 }}>submit an inquiry here</a> to receive the full collaboration summary.
                    </p>
                  </div>

                  <p>
                    If you have additional questions or would like a deeper integration session, please <a href="/inquiry" style={{ color: '#2563eb', fontWeight: 600 }}>contact the WingMentor team here</a> and the team will schedule a slot.
                  </p>
                </>
              )}

              {/* W1000 Application Content */}
              {selectedNewsItem.title === 'W1000 Application Launches for Foundation Program' && (
                <>
                  <p>
                    WingMentor officially released the W1000 application for all Foundation Program pilots, providing a unified platform for examinations, competency tracking, and mentor touchpoints.
                  </p>
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Integrated Assessments:</strong> Computer-based exams, NOTECHS behavioral scoring, and EBT-aligned evaluations now live in a single interface with automated result syncing.
                    </p>
                  </div>
                  <p>
                    The W1000 also introduces a persistent progress-tracking dashboard, allowing mentors and program staff to monitor attendance, module completion, and assessment readiness in real time.
                  </p>
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Mentor Visibility:</strong> Live dashboards show mentoring hours, CBT milestones, and pending evaluations so instructors can intervene early.
                    </p>
                  </div>
                  <p>
                    For Foundation pilots, the app centralizes everything previously spread across spreadsheets, email threads, and manual record-keeping—giving each participant a clear roadmap toward Transition eligibility.
                  </p>
                </>
              )}

              {/* Aviation Week Fuel Spikes Content */}
              {selectedNewsItem.source === 'Aviation Week Network' && selectedNewsItem.title.includes('Fuel Spikes') && (
                <>
                  <p>
                    Though faced with rising fuel prices just ahead of busy spring and summer travel, strong demand is helping U.S. airlines navigate the headwind, even allowing some to raise their revenue targets for the first quarter while contending with higher costs.
                  </p>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Natural Hedge Strategy:</strong> Instead of traditional fuel hedging, airlines are using a "natural hedge" by passing fuel costs directly to consumers through fare increases, United Airlines CFO Mike Leskinen explained.
                    </p>
                  </div>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Record Demand Strength
                  </h4>
                  
                  <p>
                    American Airlines, Delta, and United each cited a $400 million spike in fuel costs during the first quarter, yet all highlighted strong demand trends with upward revisions to revenue forecasts.
                  </p>
                  
                  <ul style={{ color: '#475569', fontSize: '17px', lineHeight: 1.75, paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <strong>Delta:</strong> Projects high single-digit growth vs. previous 5-7% forecast, with eight of ten highest sales days in history this year
                    </li>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <strong>American:</strong> Expects &gt;10% growth vs. earlier 8.5% forecast, recording eight of top ten revenue weeks in Q1
                    </li>
                    <li style={{ marginBottom: '0.75rem' }}>
                      <strong>United:</strong> Recorded 10 biggest booking weeks in history in first 10 weeks of 2026, targeting $4.6 billion fuel offset
                    </li>
                  </ul>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Strategic Responses
                  </h4>
                  
                  <p>
                    "Sales for us have been very strong all quarter long," Delta CEO Ed Bastian said, noting demand strength spans all segments—corporate, international, premium leisure, main cabin and domestic markets.
                  </p>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Pricing Power:</strong> Delta has seen pricing increase twice in just two weeks, showing industry urgency about covering higher fuel costs with a 2-3 month lagging basis historically.
                    </p>
                  </div>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Unique Positioning
                  </h4>
                  
                  <p>
                    Delta's Monroe Energy refinery provides a meaningful hedge on crack spreads—refining margins for converting crude oil into jet fuel. "Starting in the second quarter, I think you'll see the Monroe profits start to generate that," Bastian explained.
                  </p>
                  
                  <p>
                    Meanwhile, Alaska Air Group described itself as "a little disadvantaged on the West Coast," paying roughly $0.20 more per gallon than other carriers. The carrier's Hawaiian Airlines acquisition provides access to cheaper Singapore fuel, with plans to tanker fuel from Singapore to Seattle.
                  </p>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Industry Outlook
                  </h4>
                  
                  <p>
                    "If fuel prices stay higher for longer, that's really where it gets interesting," United CEO Scott Kirby said. "There's a reasonable chance that that happens and, if it does, I think it's going to further accelerate the gap between the brand loyal airlines and everyone else."
                  </p>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Market Dynamics:</strong> Strong demand, moderating competitive capacity, and ongoing revenue management initiatives are driving "meaningfully higher unit revenues" across the industry.
                    </p>
                  </div>
                  
                  <p>
                    Whether rising fuel will be a short-, medium-, or long-term challenge remains unknown, hinging on the duration of the conflict in Iran and the status of the Strait of Hormuz. But airlines appear prepared to react as the situation evolves.
                  </p>
                  
                  <p>
                    "I think we're getting used to this volatility," United Chief Commercial Officer Andrew Nocella said. "If it's not one thing, it's another."
                  </p>
                </>
              )}
              
              {/* Default content for other news items */}
              {(!selectedNewsItem.source || (selectedNewsItem.source !== 'IATA' && selectedNewsItem.source !== 'EASA' && selectedNewsItem.source !== 'Boeing' && selectedNewsItem.source !== 'Aviation Week Network')) && (
                <>
                  <p>
                    This development marks a significant milestone in the aviation industry's ongoing evolution and adaptation to changing market conditions.
                  </p>
                  <p>
                    Industry experts anticipate that this trend will continue to shape the landscape of commercial aviation, creating new opportunities and challenges for stakeholders across the ecosystem.
                  </p>
                  <p>
                    The implications for pilot training, recruitment, and career development are substantial, with organizations like WingMentor positioned to play a crucial role in meeting the evolving demands of the industry.
                  </p>
                </>
              )}
              
              {/* Boeing Content */}
              {selectedNewsItem.source === 'Boeing' && (
                <>
                  <p>
                    Fueled by emerging markets and changes in fleet mix, Boeing projects continued demand for aviation personnel as the global commercial fleet changes to meet the demands of the flying public. Boeing's 2025 Pilot and Technician Outlook (PTO) anticipates the industry will require nearly 2.4 million new aviation professionals through 2044 to meet the long-term increase in air travel.
                  </p>
                  
                  <p>
                    Boeing, which released its annual 20-year forecast at EAA AirVenture Oshkosh, said commercial carriers will need substantial hiring and training to sustain the global commercial fleet.
                  </p>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Global Personnel Requirements:</strong> 660,000 pilots, 710,000 maintenance technicians, 1,000,000 cabin crew members - Total: 2.37 million professionals
                    </p>
                  </div>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Industry Focus on Innovation
                  </h4>
                  
                  <p>
                    "As commercial air traffic demand continues to outpace economic growth and the global fleet expands to meet demand, our industry will keep the fleet flying safely and efficiently by supporting workforce development for carriers worldwide," said Chris Broom, vice president, Commercial Training Solutions, Boeing Global Services.
                  </p>
                  
                  <p>
                    "The industry is investing in technologies, including mixed reality— an immersive blend of physical and digital environments that enhances hands-on learning and situational awareness. Boeing is supporting customers with digitally advanced aviation training products and services to meet their needs. The bedrock of our approach remains competency-based training and assessment methodology to ensure high quality aviation training."
                  </p>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Key Projections Through 2044
                  </h4>
                  
                  <p>
                    Two-thirds of new personnel will address replacement due to attrition, while one-third supports growth in the commercial fleet. Demand for new personnel is driven primarily by single-aisle airplanes.
                  </p>
                  
                  <p>
                    As in past years, Eurasia, China and North America continue to drive demand for more than half of new industry personnel. South Asia and Southeast Asia are the fastest-growing regions for personnel with staffing demand expected to more than triple.
                  </p>
                  
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>
                    Regional Breakdown
                  </h4>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'collapse',
                      fontSize: '0.9rem',
                      color: '#475569'
                    }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Region</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>New Pilots</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>New Technicians</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>New Cabin Crew</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>Global</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>660,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>710,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>1,000,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>2,370,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                          <td style={{ padding: '0.75rem' }}>Africa</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>23,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>24,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>27,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>74,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem' }}>China</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>124,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>131,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>171,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>426,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                          <td style={{ padding: '0.75rem' }}>Eurasia</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>149,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>165,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>236,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>550,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem' }}>Latin America</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>37,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>42,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>55,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>134,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                          <td style={{ padding: '0.75rem' }}>Middle East</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>67,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>63,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>104,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>234,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem' }}>North America</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>119,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>123,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>193,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>435,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                          <td style={{ padding: '0.75rem' }}>Northeast Asia</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>23,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>27,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>42,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>92,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem' }}>Oceania</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>11,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>12,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>18,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>41,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                          <td style={{ padding: '0.75rem' }}>South Asia</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>45,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>45,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>51,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>141,000</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0.75rem' }}>Southeast Asia</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>62,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>78,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>103,000</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>243,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #2563eb',
                    margin: '1.5rem 0'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                      <strong>Technology Focus:</strong> Continued industry focus on innovative training and career development is key to addressing pilot and technician shortages. Advancements in AI, virtual and mixed reality technologies will enhance and augment training to transform aviation workforce preparedness.
                    </p>
                  </div>
                </>
              )}
              
              {/* Source attribution */}
              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                <p style={{ margin: 0 }}>
                  <strong>Source:</strong> {selectedNewsItem.source}
                  {selectedNewsItem.platform && ` - ${selectedNewsItem.platform}`}
                </p>
                <p style={{ margin: '0.5rem 0 0' }}>
                  For more information, please contact the respective organization's corporate communications department.
                </p>
                {selectedNewsItem.url && (
                  <div style={{ marginTop: '1rem' }}>
                    <a
                      href={selectedNewsItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#2563eb',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#1d4ed8';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                      }}
                    >
                      <Icons.ArrowRight style={{ width: 14, height: 14 }} />
                      View Original Press Release
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Normal News List View
          <>
          {/* Industry News & Updates Section - PilotGapModulePage Style */}
          <section style={{ marginBottom: '4rem' }}>
            {/* Section header — matches main page title style */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
              <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                Industry Intelligence
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Industry News & Updates
              </h2>
              <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '36rem', margin: '0 auto' }}>
                Stay informed about the latest aviation industry developments, regulatory changes, and market trends affecting pilot careers worldwide.
              </p>
            </div>

            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: isDarkMode ? 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)' : 'white',
              boxShadow: isDarkMode ? '0 15px 35px rgba(0,0,0,0.3)' : '0 15px 35px rgba(0,0,0,0.08)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.04)',
              marginBottom: '2.5rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  {
                    title: "Air Travel Demand Will More Than Double by 2050",
                    date: "March 17, 2026",
                    source: "IATA",
                    platform: "Press Release No: 13",
                    excerpt: "International Air Transport Association releases Long-Term Demand Projections showing global air passenger demand expected to reach 20.8 trillion RPKs by 2050, with 3.1% CAGR from 2024-2050.",
                    image: "https://www.iata.org/contentassets/b4db3a07a13a4b64be2bcdc79a3e8b86/ltdp.jpg?width=330&height=216&rmode=crop&v=20260317081134",
                    url: "https://www.iata.org/en/pressroom/2026-releases/2026-03-17-01/"
                  },
                  {
                    title: "EASA Announces Major Regulatory Changes for 2026",
                    date: "March 16, 2026", 
                    source: "EASA",
                    platform: "Regulatory Update",
                    excerpt: "European Union Aviation Safety Agency introduces significant updates to pilot training, operations control, and EBT implementation under EPAS 2026-2028.",
                    image: "https://www.easa.europa.eu/themes/custom/easa_foundation/logo.svg",
                    url: "https://www.easa.europa.eu/en/domains/aircrew-and-medical/evidence-based-training-ebt#:~:text=Oversight%20guidance%20for%20transition%20to,and%20the%20different%20options%20available."
                  },
                  {
                    title: "Boeing Forecasts 20-Year Global Demand for Nearly 2.4 Million New Commercial Pilots, Technicians, Cabin Crew",
                    date: "July 22, 2025",
                    source: "Boeing",
                    platform: "2025 Pilot & Technician Outlook",
                    excerpt: "Boeing projects continued demand for aviation personnel as the global commercial fleet changes to meet the demands of the flying public through 2044.",
                    image: "https://s2.q4cdn.com/661678649/files/images/airplanes/777x_ramp.jpg",
                    url: "https://investors.boeing.com/investors/news/press-release-details/2025/Boeing-Forecasts-20-Year-Global-Demand-for-Nearly-2-4-Million-New-Commercial-Pilots-Technicians-Cabin-Crew/default.aspx"
                  },
                  {
                    title: "U.S. Airlines Navigate Fuel Spikes With Strong Demand",
                    date: "March 12, 2026",
                    source: "Aviation Week Network",
                    platform: "Industry Analysis",
                    excerpt: "Major carriers use 'natural hedge' strategy to pass fuel costs to consumers amid strong demand and record booking weeks.",
                    image: "https://aviationweek.com/sites/default/files/styles/crop_freeform/public/2026-03/getty_images_southwest_sunset_j._david_ake_getty_images.jpg?itok=jN5yMWmK",
                    url: "https://aviationweek.com/air-transport/airlines-lessors/us-airlines-navigate-fuel-spikes-natural-hedge-strong-demand"
                  }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '1.5rem 2rem',
                    borderBottom: index < 4 ? '1px solid #e2e8f0' : 'none',
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleNewsClick(item)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: item.source === 'EASA' ? '#1e3a8a' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: item.source === 'EASA' ? '0.5rem' : '0'
                    }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: item.source === 'EASA' ? 'contain' : 'cover' 
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-industry.jpg';
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#059669',
                          background: 'rgba(5, 150, 105, 0.1)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          {item.source}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#6b7280',
                          background: 'rgba(107, 114, 128, 0.1)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          {item.platform}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {item.date}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                        {item.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Program News & Updates Section - PilotGapModulePage Style */}
          <section style={{ marginBottom: '4rem' }}>
            {/* Section header — matches main page title style */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
              <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                Latest Announcements
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Program News & Updates
              </h2>
              <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '36rem', margin: '0 auto' }}>
                Stay informed about the latest developments, partnerships, and success stories from WingMentor's aviation training ecosystem.
              </p>
            </div>

            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              background: isDarkMode ? 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)' : 'white',
              boxShadow: isDarkMode ? '0 15px 35px rgba(0,0,0,0.3)' : '0 15px 35px rgba(0,0,0,0.08)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.04)',
              marginBottom: '2.5rem'
            }}>
              <div style={{
                display: 'flex',
                transition: 'transform 0.5s ease',
                transform: `translateX(-${currentNewsIndex * 100}%)`
              }}>
                {newsItems.map((item) => (
                  <div key={item.id} style={{ minWidth: '100%', display: 'flex' }}>
                    <div style={{ flex: '1', padding: '2rem', cursor: 'pointer' }} onClick={() => handleNewsClick(item)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#2563eb',
                          background: 'rgba(37, 99, 235, 0.1)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px'
                        }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {item.date}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: '#475569', fontSize: '17px', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                        {item.excerpt}
                      </p>
                      <button
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#1d4ed8';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#2563eb';
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNewsClick(item);
                        }}
                      >
                        Read More
                      </button>
                    </div>
                    <div style={{ width: '400px', height: '300px' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-news.jpg';
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Indicators */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                {newsItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentNewsIndex(index)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: index === currentNewsIndex ? '#2563eb' : '#e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* LinkedIn Profiles Section - PilotGapModulePage Style */}
          <section style={{ display: 'none' }}>
            {/* Section hidden - content removed */}
          </section>
          </>
        )}
      </div>
    );
  };

  // Programs View Component
  const ProgramsView = () => {
    const [activeUpdate, setActiveUpdate] = useState(0);
    const heroVideoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [heroVolume, setHeroVolume] = useState(0.6);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
      const timer = setInterval(() => {
        setActiveUpdate((prev) => (prev + 1) % pathwayUpdates.length);
      }, 5000);
      return () => clearInterval(timer);
    }, [pathwayUpdates.length]);

    useEffect(() => {
      return () => {
        heroVideoRef.current?.pause();
        setIsVideoPlaying(false);
      };
    }, []);

    useEffect(() => {
      const video = heroVideoRef.current;
      if (!video) return;
      const handleTimeUpdate = () => {
        setVideoCurrentTime(video.currentTime);
        setVideoDuration(video.duration || 0);
      };
      const handleLoadedMetadata = () => {
        setVideoDuration(video.duration || 0);
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }, []);

    useEffect(() => {
      if (heroVideoRef.current) {
        heroVideoRef.current.volume = heroVolume;
      }
    }, [heroVolume]);

    const toggleHeroVideoPlayback = () => {
      const video = heroVideoRef.current;
      if (!video) return;
      if (video.paused) {
        void video.play();
      } else {
        video.pause();
      }
    };

    const toggleHeroVideoMute = () => {
      const video = heroVideoRef.current;
      if (!video) return;
      video.muted = !video.muted;
      setIsVideoMuted(video.muted);
    };

    const handleHeroVideoSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
      const video = heroVideoRef.current;
      if (!video || !videoDuration) return;
      const percentage = Number(event.target.value);
      const newTime = (percentage / 100) * videoDuration;
      video.currentTime = newTime;
      setVideoCurrentTime(newTime);
    };

    const handleHeroVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const video = heroVideoRef.current;
      if (!video) return;
      const nextVolume = Number(event.target.value);
      setHeroVolume(nextVolume);
      video.volume = nextVolume;
      if (nextVolume === 0) {
        video.muted = true;
        setIsVideoMuted(true);
      } else {
        video.muted = false;
        setIsVideoMuted(false);
      }
    };

    const formatTime = (value: number) => {
      if (!Number.isFinite(value) || value < 0) return '0:00';
      const minutes = Math.floor(value / 60);
      const seconds = Math.floor(value % 60)
        .toString()
        .padStart(2, '0');
      return `${minutes}:${seconds}`;
    };

    const VolumeIcon = ({ muted }: { muted: boolean }) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5l-4 4H4v6h3l4 4V5z" />
        <path d="M15.54 8.46a5 5 0 010 7.07" />
        <path d="M18.36 5.64a8 8 0 010 11.31" />
        {muted && <line x1="19" y1="5" x2="23" y2="9" />}
      </svg>
    );

    const FullscreenIcon = ({ active }: { active: boolean }) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {active ? (
          <>
            <path d="M9 9L4 4" />
            <path d="M4 10V4h6" />
            <path d="M15 15l5 5" />
            <path d="M20 14v6h-6" />
          </>
        ) : (
          <>
            <path d="M9 5H5v4" />
            <path d="M15 19h4v-4" />
            <path d="M5 19h4v4" />
            <path d="M19 5h-4V1" />
          </>
        )}
      </svg>
    );

    const handleFullscreenToggle = () => {
      const video = heroVideoRef.current;
      if (!video) return;

      const requestFullscreen =
        video.requestFullscreen ||
        // @ts-expect-error vendor prefixes
        video.webkitRequestFullscreen ||
        // @ts-expect-error vendor prefixes
        video.mozRequestFullScreen ||
        // @ts-expect-error vendor prefixes
        video.msRequestFullscreen;

      const exitFullscreen =
        document.exitFullscreen ||
        // @ts-expect-error vendor prefixes
        document.webkitExitFullscreen ||
        // @ts-expect-error vendor prefixes
        document.mozCancelFullScreen ||
        // @ts-expect-error vendor prefixes
        document.msExitFullscreen;

      if (!document.fullscreenElement && requestFullscreen) {
        requestFullscreen.call(video);
        setIsFullScreen(true);
      } else if (document.fullscreenElement && exitFullscreen) {
        exitFullscreen.call(document);
        setIsFullScreen(false);
      }
    };

    useEffect(() => {
      const handleChange = () => {
        setIsFullScreen(Boolean(document.fullscreenElement));
      };
      document.addEventListener('fullscreenchange', handleChange);
      return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    return (
    <div className="wingmentor-subpage programs-view-page" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div className="wingmentor-subpage-shell" style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
        <button
          onClick={() => setMainView('dashboard')}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#475569',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#0f172a';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#475569';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Hub
        </button>

        {/* Programs Header - Matching Dashboard Format */}
        <div style={{ padding: '2rem 2rem 0 2rem', textAlign: 'center', maxWidth: '100%', margin: '0 auto' }}>
          <div style={{
            background: isDarkMode 
              ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 70%, rgba(15, 23, 42, 0) 100%)'
              : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 70%, rgba(255, 255, 255, 0) 100%)',
            borderRadius: '16px',
            padding: '3rem 3rem 4rem 3rem',
            boxShadow: isDarkMode
              ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 -10px 40px rgba(15, 23, 42, 0.3)'
              : '0 20px 60px rgba(15, 23, 42, 0.08), 0 -10px 40px rgba(255, 255, 255, 0.5)',
            border: isDarkMode 
              ? '1px solid rgba(71, 85, 105, 0.6)' 
              : '1px solid rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
            </div>
            <div style={{ color: isDarkMode ? '#60a5fa' : '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
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
              Programs
            </h1>
            <p style={{ 
              color: isDarkMode ? '#94a3b8' : '#64748b', 
              fontSize: '1.15rem', 
              lineHeight: 1.7, 
              maxWidth: '36rem', 
              margin: '0 auto',
              padding: '0 1rem'
            }}>
              Access Foundational and Transition mentorship programs designed to refine your core mechanics and CRM skills through high-fidelity simulator practice.
            </p>
          </div>
        </div>

        <section className="dashboard-section" style={{ width: '100%', maxWidth: '1200px', margin: '2rem auto 0' }}>
          <div style={{ padding: '0 3rem 2rem 3rem' }}>
            {/* Program Selection Subheader */}
            <div style={{ marginBottom: '2rem', marginTop: '1rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                Select Your Program
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              </p>
            </div>
          </div>

          {/* Foundational Program Directory Card */}
          <div className="horizontal-card" style={{ 
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
          onClick={() => setMainView('foundational-enrollment-check')}
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
            <div style={{ 
              flex: '1', 
              padding: '2rem 2.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2
            }}>
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
                  Core Training
                </span>
              </div>
              <h3 style={{ 
                fontSize: '1.75rem', 
                marginBottom: '0.75rem', 
                color: '#0f172a', 
                fontWeight: 700, 
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                Foundational Program
              </h3>
              <p style={{ 
                marginBottom: '1.25rem', 
                color: '#64748b', 
                fontSize: '1rem', 
                lineHeight: 1.7,
                maxWidth: '90%'
              }}>
                Master core aviation fundamentals, instrument procedures, and advanced CRM techniques through structured simulator training modules.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                  7 Modules
                </span>
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
                  50 Hours Mentorship
                </span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.5rem 1rem', 
                  background: 'rgba(100, 116, 139, 0.1)', 
                  borderRadius: '100px', 
                  color: '#475569', 
                  fontWeight: 600,
                  border: '1px solid rgba(100, 116, 139, 0.2)'
                }}>
                  Pilot Recognition Initial
                </span>
              </div>
            </div>
            <div style={{ 
              position: 'relative',
              width: '40%',
              minHeight: '220px',
              overflow: 'hidden',
              borderRadius: '0 24px 24px 0',
              pointerEvents: 'none'
            }}>
              <img 
                src="/Gemini_Generated_Image_7awns87awns87awn.png" 
                alt="Foundational Program" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none'
                }} 
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isDarkMode 
                  ? 'linear-gradient(90deg, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0) 30%)'
                  : 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 30%)',
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
                transition: 'all 0.3s ease',
                pointerEvents: 'none'
              }}>
                <Icons.ArrowRight style={{ width: 20, height: 20, color: '#0f172a' }} />
              </div>
            </div>
          </div>

          {/* Transition Program Directory Card */}
          <div className="horizontal-card" style={{ 
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
            onClick={() => setMainView('transition')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = isDarkMode
                ? '0 24px 48px rgba(2, 6, 23, 0.42), 0 10px 20px rgba(2, 6, 23, 0.24)'
                : '0 20px 40px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.08)';
              e.currentTarget.style.borderColor = isDarkMode ? 'rgba(96, 165, 250, 0.35)' : 'rgba(148, 163, 184, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkMode
                ? '0 18px 40px rgba(2, 6, 23, 0.34), 0 1px 3px rgba(2, 6, 23, 0.22)'
                : '0 4px 20px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)';
              e.currentTarget.style.borderColor = isDarkMode ? 'rgba(71, 85, 105, 0.7)' : 'rgba(226, 232, 240, 0.6)';
            }}
            >
              <div style={{ 
                flex: '1', 
                padding: '2rem 2.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2
              }}>
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
                    Advanced Track
                  </span>
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
                    Coming Soon
                  </span>
                </div>
                <h3 style={{ 
                  fontSize: '1.75rem', 
                  marginBottom: '0.75rem', 
                  color: isDarkMode ? '#f8fafc' : '#0f172a', 
                  fontWeight: 700, 
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}>
                  Transition Program
                </h3>
                <p style={{ 
                  marginBottom: '1.25rem', 
                  color: isDarkMode ? '#94a3b8' : '#64748b', 
                  fontSize: '1rem', 
                  lineHeight: 1.7,
                  maxWidth: '90%'
                }}>
                  Advanced career transition training for experienced pilots seeking airline pathways and specialized aviation roles.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                    Advanced
                  </span>
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
                    Career Focus
                  </span>
                </div>
              </div>
              <div style={{ 
                position: 'relative',
                width: '40%',
                minHeight: '220px',
                overflow: 'hidden',
                borderRadius: '0 24px 24px 0'
              }}>
                <img 
                  src="/WhatsApp Image 2026-02-07 at 20.06.18.jpeg" 
                  alt="Transition Program" 
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
                  background: isDarkMode 
                    ? 'linear-gradient(90deg, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0) 30%)'
                    : 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 30%)',
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

            {/* Program Progress Notifications */}
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: '-30px 0 20px',
                borderRadius: '32px',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(56,189,248,0.08))',
                filter: 'blur(40px)',
                opacity: 0.8,
                pointerEvents: 'none'
              }} />
              <div style={{
                background: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '24px',
                boxShadow: isDarkMode ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(15, 23, 42, 0.12)',
                border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.8)' : '1px solid rgba(255, 255, 255, 0.8)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a', margin: 0 }}>Program Updates & News</h3>
                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b', margin: '0.35rem 0 0' }}>Stay current with the latest program headlines.</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: isDarkMode ? '#60a5fa' : '#2563eb', fontWeight: 600 }}>Updated moments ago</span>
                </div>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <div
                    style={{
                      display: 'flex',
                      transition: 'transform 0.5s ease',
                      transform: `translateX(-${activeUpdate * 100}%)`,
                      width: `${pathwayUpdates.length * 100}%`
                    }}
                  >
                    {pathwayUpdates.map((update) => (
                      <div
                        key={update.title}
                        style={{
                          minWidth: '100%',
                          padding: '1rem',
                          borderRadius: '12px',
                          background: isDarkMode ? 'rgba(51, 65, 85, 0.6)' : '#f8fafc',
                          border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0',
                          backdropFilter: isDarkMode ? 'blur(8px)' : 'none',
                          WebkitBackdropFilter: isDarkMode ? 'blur(8px)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{update.title}</h4>
                        </div>
                        <p style={{ margin: 0, color: isDarkMode ? '#cbd5e1' : '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>{update.summary}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: isDarkMode ? '#94a3b8' : '#94a3b8' }}>
                          <span>{update.source}</span>
                          <span>{update.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => setActiveUpdate((prev) => (prev - 1 + pathwayUpdates.length) % pathwayUpdates.length)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: '0.5rem',
                    }}
                  >
                    <Icons.ArrowLeft style={{ width: 20, height: 20, color: '#94a3b8' }} />
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {pathwayUpdates.map((_, idx) => (
                      <button
                        key={`dot-${idx}`}
                        onClick={() => setActiveUpdate(idx)}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          background: idx === activeUpdate ? '#2563eb' : '#cbd5e1',
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveUpdate((prev) => (prev + 1) % pathwayUpdates.length)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: '0.5rem',
                    }}
                  >
                    <Icons.ArrowRight style={{ width: 20, height: 20, color: '#94a3b8' }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Foundation Program Progress Card - Hard Truth Format */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', textAlign: 'left' }}>
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  padding: '4rem 3rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                  <div style={{ color: '#60a5fa', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    PROGRESS TRACKING
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#f8fafc', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                    Foundation Program Journey
                  </h2>
                  
                  {/* Carousel Container */}
                  <div style={{ position: 'relative', height: '200px', width: '100%', maxWidth: '40rem', margin: '0 auto' }}>
                    {/* Progress Update 1 */}
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      height: '100%',
                      opacity: 1,
                      animation: 'slideInOut 8s infinite'
                    }}>
                      <div style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                        <strong>Your Foundation Program progress is tracked in real-time.</strong> WingMentor monitors your training advancement and syncs with our comprehensive database.
                        <br /><br />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
                            Module Progress
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#60a5fa', fontWeight: 600 }}>
                            {completedCount} of {totalCount} Complete
                          </span>
                        </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          width: `${progressPercent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <span>{progressPercent}% Complete</span>
                        <span>Last sync: {loadingProgress ? 'Loading...' : new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Update 2 */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '100%',
                    opacity: 0,
                    animation: 'slideInOut 8s infinite 4s'
                  }}>
                    <div style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                      <strong>Advanced CRM techniques module now available.</strong> The latest module in your Foundation Program includes enhanced simulator scenarios and real-world case studies.
                      <br /><br />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
                          Recent Achievement
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#34d399', fontWeight: 600 }}>
                          Completed
                        </span>
                      </div>
                      <div style={{
                        padding: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <div style={{ fontSize: '0.8rem', color: '#6ee7b7', lineHeight: 1.5 }}>
                          ✅ Module 8: Advanced CRM Techniques<br/>
                          ✅ Module 9: Decision Making Under Pressure<br/>
                          ✅ Module 10: Team Communication
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel Progress Indicator */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  marginTop: '2rem',
                  justifyContent: 'center',
                  zIndex: 20
                }}>
                  <div style={{
                    width: '32px',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    animation: 'progressPulse 8s infinite'
                  }}></div>
                  <div style={{
                    width: '32px',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(255, 255, 255, 0.2)'
                  }}></div>
                </div>
              </div>


              {/* Enhanced CSS Animations */}
              <style>{`
                @keyframes slideInOut {
                  0%, 100% { 
                    opacity: 0; 
                    transform: translateX(-20px); 
                  }
                  10%, 45% { 
                    opacity: 1; 
                    transform: translateX(0); 
                  }
                  55%, 90% { 
                    opacity: 0; 
                    transform: translateX(20px); 
                  }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.6; transform: scale(1.2); }
                }
                @keyframes progressPulse {
                  0%, 100% { opacity: 0.3; }
                  50% { opacity: 1; }
                }
              `}</style>
            </div>
        </section>

        {/* Footer Section */}
        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem',
          borderTop: '1px solid #e2e8f0',
          background: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <button 
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => setMainView('contact')}
              >
                Contact Support
              </button>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                Need help with your training program? Our support team is here to assist you.
              </p>
              <p style={{ margin: 0 }}>
                © 2024 WingMentor Network. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

  // Pathways View Component
  const PathwaysView = () => {
    const [showAllPathways, setShowAllPathways] = useState(false);
    const [teaserHovered, setTeaserHovered] = useState(false);
    const [activeUpdate, setActiveUpdate] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setActiveUpdate((prev) => (prev + 1) % pathwayUpdates.length);
      }, 5000);
      return () => clearInterval(timer);
    }, [pathwayUpdates.length]);

    return (
      <div className="wingmentor-subpage pathways-view-page" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <div className="wingmentor-subpage-shell" style={{ position: 'relative', minHeight: '100vh', background: isDarkMode ? 'linear-gradient(135deg, #020817 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
          <button
            onClick={() => setMainView('dashboard')}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#475569',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: '16px' }}>←</span> Back to Hub
          </button>

          <div style={{ padding: '2rem 3rem 1.5rem 3rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              background: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'rgba(255, 255, 255, 0.95)',
              borderRadius: '28px',
              padding: '3rem',
              boxShadow: isDarkMode ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(15, 23, 42, 0.07)',
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)'
            }}>
              <div className="dashboard-logo" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
              </div>
              <div className="dashboard-subtitle" style={{ color: isDarkMode ? '#60a5fa' : '#2563eb' }}>CONNECTING PILOTS TO THE INDUSTRY</div>
              <h1 className="dashboard-title" style={{ marginBottom: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Pathways</h1>
              <p style={{ fontSize: '1rem', color: isDarkMode ? '#94a3b8' : '#475569', lineHeight: 1.5, maxWidth: '42rem', margin: '0 auto 1.5rem' }}>
                Explore structured career roadmaps designed to guide your journey from student pilot to professional aviation careers.
              </p>
              <div style={{ maxWidth: '720px', margin: '0 auto 2rem', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(15,23,42,0.12)', border: '1px solid rgba(226,232,240,0.8)' }}>
                <img
                  src="/wingmentor terminal.png"
                  alt="WingMentor Terminal"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>

          <section className="dashboard-section" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ padding: '0 3rem 2rem 3rem' }}>
              {/* Pathways Selection Subheader */}
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                  Select Your Career Pathway
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Choose from specialized training tracks tailored to your aviation career goals
                </p>
              </div>

              {/* Main Pathways - Always Visible */}
              <div style={{ marginBottom: '2rem' }}>
                {/* Emirates ATPL Pathway */}
                <div className="horizontal-card" style={{ 
                  cursor: 'pointer', 
                  padding: '1.5rem 2rem', 
                  marginBottom: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setMainView('atpl-pathway')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
                >
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emirates ATPL Pathway</h3>
                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                          Advanced ATPL theory training through prestigious ATOs with visa support, license conversion, and global recognition.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#fef3c7', borderRadius: '12px', color: '#92400e', fontWeight: 500 }}>
                            ATPL Focus
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                            18 Months
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                            Airline Ready
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hub-card-arrow">
                      <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <img 
                    src="/fleet-header-the-etihad-fleet-1.jpg.avif.jpg" 
                    alt="Etihad Fleet" 
                    className="hub-card-bg-image" 
                    style={{ 
                      width: '35%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'center',
                      opacity: 0.9,
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                  />
                </div>

                {/* Commercial Pathway */}
                <div className="horizontal-card" style={{ 
                  cursor: 'pointer', 
                  padding: '1.5rem 2rem', 
                  marginBottom: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setMainView('private-sector')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
                >
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Private Sector Pathway</h3>
                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                          Private jet sector excellence with Gulfstream insights, charter company requirements, and direct operator relations.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', borderRadius: '12px', color: '#3730a3', fontWeight: 500 }}>
                            Private Jet Focus
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                            12 Months
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                            Multi-Engine
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hub-card-arrow">
                      <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <img 
                    src="/Silhouette-of-pilot-walking-aw-1140x760.jpg" 
                    alt="Private Sector Pilot" 
                    className="hub-card-bg-image" 
                    style={{ 
                      width: '35%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'center',
                      opacity: 0.9,
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                  />
                </div>

                {/* Air Taxi Pathway */}
                <div className="horizontal-card" style={{ 
                  cursor: 'pointer', 
                  padding: '1.5rem 2rem', 
                  marginBottom: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => alert('Air Taxi Pathway coming soon!')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
                >
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Air Taxi Pathway</h3>
                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                          Specialized training for air taxi and charter operations with emphasis on customer service and flexible scheduling.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#fce7f3', borderRadius: '12px', color: '#9f1239', fontWeight: 500 }}>
                            Charter Focus
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                            9 Months
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                            Customer Service
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hub-card-arrow">
                      <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <img 
                    src="/Archer-Midnight-eVTOL.png" 
                    alt="Archer Midnight eVTOL" 
                    className="hub-card-bg-image" 
                    style={{ 
                      width: '35%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'center',
                      opacity: 0.9,
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                  />
                </div>
              </div>

              {/* Expandable Pathways Section */}
              <div style={{ position: 'relative' }}>
                {/* Hidden Pathways Container */}
                <div style={{
                  overflow: 'hidden',
                  transition: 'max-height 0.6s ease-out',
                  maxHeight: showAllPathways ? '2000px' : '0px'
                }}>
                  <div style={{ paddingTop: showAllPathways ? '0' : '2rem' }}>
                    {/* Military Pathway */}
                    <div className="horizontal-card" style={{ 
                      cursor: 'pointer', 
                      padding: '1.5rem 2rem', 
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => alert('Military Pathway coming soon!')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                    >
                      <div className="horizontal-card-content-wrapper">
                        <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                          <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Military Pathway</h3>
                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                              Advanced military aviation training with focus on tactical operations and transition to civilian aviation careers.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f3f4f6', borderRadius: '12px', color: '#374151', fontWeight: 500 }}>
                                Tactical Focus
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                24 Months
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                Advanced Systems
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hub-card-arrow">
                          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                        </div>
                      </div>
                    </div>

                    {/* Cargo Pathway */}
                    <div className="horizontal-card" style={{ 
                      cursor: 'pointer', 
                      padding: '1.5rem 2rem', 
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => alert('Cargo Pathway coming soon!')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                    >
                      <div className="horizontal-card-content-wrapper">
                        <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                          <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cargo Pathway</h3>
                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                              Specialized cargo operations training including freight logistics, night operations, and international cargo procedures.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#fef2f2', borderRadius: '12px', color: '#991b1b', fontWeight: 500 }}>
                                Cargo Focus
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                15 Months
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                International
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hub-card-arrow">
                          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                        </div>
                      </div>
                    </div>

                    {/* Flight Instructor Pathway */}
                    <div className="horizontal-card" style={{ 
                      cursor: 'pointer', 
                      padding: '1.5rem 2rem', 
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => alert('Flight Instructor Pathway coming soon!')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                    >
                      <div className="horizontal-card-content-wrapper">
                        <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                          <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flight Instructor Pathway</h3>
                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                              Comprehensive flight instructor training with focus on teaching methodologies, curriculum development, and student assessment.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#ecfdf5', borderRadius: '12px', color: '#065f46', fontWeight: 500 }}>
                                Teaching Focus
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                6 Months
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                CFI Certified
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hub-card-arrow">
                          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                        </div>
                      </div>
                    </div>

                    {/* Corporate Aviation Pathway */}
                    <div className="horizontal-card" style={{ 
                      cursor: 'pointer', 
                      padding: '1.5rem 2rem', 
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => alert('Corporate Aviation Pathway coming soon!')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                    >
                      <div className="horizontal-card-content-wrapper">
                        <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                          <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Aviation Pathway</h3>
                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                              Elite corporate flight operations with focus on executive transport, international procedures, and VIP service excellence.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f0fdf4', borderRadius: '12px', color: '#14532d', fontWeight: 500 }}>
                                Executive Focus
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                12 Months
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                VIP Service
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hub-card-arrow">
                          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section - Always Visible Top Edge */}
                {!showAllPathways && (
                  <div
                    onClick={() => setShowAllPathways(true)}
                    onMouseEnter={() => setTeaserHovered(true)}
                    onMouseLeave={() => setTeaserHovered(false)}
                    style={{
                      margin: '0 auto 2rem',
                      maxWidth: '1100px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      height: '170px',
                      borderRadius: '30px',
                      overflow: 'hidden',
                      background: 'transparent',
                      perspective: '1200px'
                    }}>
                      <div
                        style={{
                          position: 'absolute',
                          inset: '45px 20px 0',
                          borderRadius: '28px',
                          background: 'rgba(255,255,255,0.3)',
                          boxShadow: '0 25px 45px rgba(15,23,42,0.15)',
                          transform: 'rotateX(24deg) translateY(55px)',
                          transformOrigin: 'top center'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: '55px 30px 0',
                          borderRadius: '26px',
                          background: 'rgba(255,255,255,0.4)',
                          boxShadow: '0 18px 35px rgba(15,23,42,0.12)',
                          transform: 'rotateX(18deg) translateY(40px)',
                          transformOrigin: 'top center'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0 0 auto',
                          top: '-70px',
                          borderRadius: '28px',
                          background: 'linear-gradient(120deg, rgba(255,255,255,0.95), rgba(244,248,255,0.85))',
                          boxShadow: '0 25px 55px rgba(15, 23, 42, 0.2)',
                          transform: teaserHovered ? 'rotateX(4deg) translateY(10px)' : 'rotateX(14deg) translateY(0)',
                          transformOrigin: 'bottom center',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ padding: '1.5rem 2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', letterSpacing: '0.35em', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>• EXPANDING HORIZONS</div>
                            <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>Discover More Pathways</h4>
                            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                              Military, Cargo, Instructor, and corporate tracks are queued below—hover to bring them into view.
                            </p>
                          </div>
                          <div style={{ width: '48px', height: '48px' }} />
                        </div>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '30px',
                          backgroundImage: 'url(/shutterstock_1698112222.jpg)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'blur(16px)',
                          opacity: 0.35
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '30px',
                          background: 'linear-gradient(180deg, rgba(248,250,252,0) 0%, rgba(248,250,252,0.9) 60%, rgba(248,250,252,1) 100%)'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '30px',
                          boxShadow: '0 15px 40px rgba(15, 23, 42, 0.12)',
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 5
                        }}
                      >
                        <div style={{
                          padding: '0.7rem 1.6rem',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.95)',
                          color: '#2563eb',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          boxShadow: '0 8px 18px rgba(15,23,42,0.12)',
                          border: '1px solid rgba(37,99,235,0.2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}>
                          Discover More Pathways — Click Here
                          <span style={{
                            display: 'inline-block',
                            animation: 'bounceArrow 1.6s infinite',
                            fontSize: '1.1rem'
                          }}>↓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showAllPathways && (
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <button
                      onClick={() => setShowAllPathways(false)}
                      style={{
                        padding: '0.9rem 2rem',
                        background: '#f1f5f9',
                        color: '#1e293b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>↑</span>
                      View Less Pathways
                    </button>
                  </div>
                )}
              </div>

              {/* Pathways News Section */}
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem', textAlign: 'center' }}>
                  Latest Pathway Updates
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div className="horizontal-card" style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                  }}>
                    <div className="horizontal-card-content-wrapper">
                      <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                        <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                          <h4 className="horizontal-card-title" style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600 }}>
                            Emirates ATPL Applications Open
                          </h4>
                          <p className="horizontal-card-desc" style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            New cadet program cohort starting Q2 2024 with enhanced training curriculum.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="horizontal-card" style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                  }}>
                    <div className="horizontal-card-content-wrapper">
                      <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                        <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                          <h4 className="horizontal-card-title" style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600 }}>
                            Cargo Pathway Industry Partnerships
                          </h4>
                          <p className="horizontal-card-desc" style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            Major cargo carriers offering guaranteed interviews for pathway graduates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="horizontal-card" style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                  }}>
                    <div className="horizontal-card-content-wrapper">
                      <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                        <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                          <h4 className="horizontal-card-title" style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600 }}>
                            Flight Instructor Scholarships
                          </h4>
                          <p className="horizontal-card-desc" style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            New funding opportunities for CFI candidates with industry mentorship.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personalized Pathway Inquiry Component */}
              <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
                <div style={{
                  background: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  padding: '3rem',
                  boxShadow: isDarkMode ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 12px 40px rgba(15, 23, 42, 0.08)',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid rgba(255, 255, 255, 0.8)',
                  textAlign: 'center'
                }}>
                  <img src="/logo.png" alt="WingMentor Logo" style={{ height: '90px', width: 'auto', marginBottom: '1rem' }} />
                  <div style={{ color: isDarkMode ? '#60a5fa' : '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Personalized Pathway Inquiry
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', margin: '0 0 1.5rem', fontFamily: 'Georgia, serif' }}>
                    Tailored Aviation Career Tracks
                  </h2>
                  <p style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: '1rem', lineHeight: 1.6, margin: '0 auto 2rem', maxWidth: '36rem' }}>
                    Is there a particular pathway you're interested in through your pilot journey? WingMentor creates specialized tracks for corporate pilotage, air rescue operations, crop dusting, and other individualized careers that align with your long-term aviation goals.
                  </p>
                  <div style={{ textAlign: 'left', maxWidth: '34rem', margin: '0 auto 2rem' }}>
                    {[{
                      title: 'Corporate Pilotage',
                      description: 'Executive transport and private aviation'
                    }, {
                      title: 'Air Rescue Operations',
                      description: 'Emergency medical and rescue services'
                    }, {
                      title: 'Crop Dusting',
                      description: 'Agricultural aviation operations'
                    }, {
                      title: 'Specialized Operations',
                      description: 'Custom pathways for unique careers'
                    }].map((item) => (
                      <div key={item.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '0.35rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ width: 8, height: 8, borderRadius: 999, marginTop: 6, background: '#0ea5e9' }}></div>
                          <h4 style={{ fontSize: '1.0625rem', margin: 0, fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{item.title}</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <button
                      onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com?subject=Personalized Pathway & Internship Inquiry&body=I am interested in learning more about personalized aviation pathways for my pilot career and internship opportunities with WingMentor.'}
                      style={{
                        padding: '0.85rem 1.75rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#2563eb',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 15px 30px rgba(37, 99, 235, 0.3)'
                      }}
                    >
                      Inquire About Pathways & Internships
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                    Contact us for personalized pathway guidance and internship opportunities with WingMentor
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };


  // Dashboard View Component
  const DashboardView = () => {
    return (
    <div className="dashboard-container animate-fade-in">
      <div style={{ position: 'relative', minHeight: '100vh', background: isDarkMode ? 'linear-gradient(135deg, #020817 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
        <div className="dashboard-header" style={{ marginBottom: '3rem', padding: '2rem 2rem 0 2rem' }}>
          <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" />
          </div>
          <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
          <h1 className="dashboard-title">Wingmentor Network</h1>
          <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Welcome to the central portal. Select a category below to explore our mentorship programs, structured pathways, and required applications.
          </p>
        </div>

        <div style={{ padding: '0 2rem 2rem 2rem' }}>
          {/* Welcome Section */}
          <div style={{
            background: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderLeft: isDarkMode ? '4px solid #60a5fa' : '4px solid #0ea5e9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
                ✈️
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  Welcome to Your Flight Training Hub
                </h2>
                <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>
                  Your comprehensive aviation training and career development platform
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0ea5e9', marginBottom: '0.25rem' }}>
                  194
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Flight Hours
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', marginBottom: '0.25rem' }}>
                  12
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Skills
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.25rem' }}>
                  3
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Certifications
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.25rem' }}>
                  4
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Awards
                </div>
              </div>
            </div>
          </div>

          {/* Pilot Recognition Section */}
          <div style={{
            background: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderLeft: isDarkMode ? '4px solid #8b5cf6' : '4px solid #7c3aed'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Pilot Recognition</h2>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Awards, certifications & achievements</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.25rem' }}>
                  4
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Awards
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0ea5e9', marginBottom: '0.25rem' }}>
                  194
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Flight Hours
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', marginBottom: '0.25rem' }}>
                  12
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Skills
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.25rem' }}>
                  3
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Certifications
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => setMainView('recognition')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #7c3aed',
                  background: 'transparent',
                  color: '#7c3aed',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                View Full Recognition Portfolio
              </button>
            </div>
          </div>

          {/* News & Updates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            
            {/* WingMentor Updates */}
            <div style={{
              background: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderLeft: isDarkMode ? '4px solid #60a5fa' : '4px solid #0ea5e9'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem'
                }}>
                  🚀
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 700, 
                  color: isDarkMode ? '#f8fafc' : '#1e293b', 
                  margin: 0
                }}>
                  WingMentor Updates
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0ea5e9' }}>
                      New Feature
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      2 days ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
                    Recognition & Achievements page now available! Track your awards and certifications.
                  </div>
                </div>
                <div style={{ 
                  padding: '1rem', 
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0ea5e9' }}>
                      Platform Update
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      1 week ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
                    Enhanced dashboard with new navigation and improved user experience.
                  </div>
                </div>
              </div>
            </div>

            {/* Program Notifications */}
            <div style={{
              background: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderLeft: isDarkMode ? '4px solid #34d399' : '4px solid #10b981'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem'
                }}>
                  📚
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 700, 
                  color: isDarkMode ? '#f8fafc' : '#1e293b', 
                  margin: 0
                }}>
                  Program Notifications
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
                      Enrollment Open
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      3 days ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
                    Advanced ATPL Program enrollment now open for Q2 2024.
                  </div>
                </div>
                <div style={{ 
                  padding: '1rem', 
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
                      Reminder
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      5 days ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
                    Complete your Foundational Program modules by end of month.
                  </div>
                </div>
              </div>
            </div>

            {/* Industry News */}
            <div style={{
              background: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderLeft: isDarkMode ? '4px solid #fbbf24' : '4px solid #f59e0b'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem'
                }}>
                  📰
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 700, 
                  color: isDarkMode ? '#f8fafc' : '#1e293b', 
                  margin: 0
                }}>
                  Industry News
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>
                      Aviation Industry
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      1 day ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
                    Major airlines announce pilot recruitment drive for 2024-2025.
                  </div>
                </div>
                <div style={{ 
                  padding: '1rem', 
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc', 
                  borderRadius: '12px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>
                      Technology Update
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      4 days ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
                    New simulator technology enhances training effectiveness by 40%.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    );
  };

  // Main content panel
  const MainPanel = () => {
    const marginLeft = showSidebar ? SIDEBAR_BASE_WIDTH * sidebarScale : 0;
    const mainPanelScale = (mainView === 'programs' || mainView === 'pathways') ? 1 : 1.25;
    const inverseScalePercent = `${(100 / mainPanelScale).toFixed(4)}%`;
    return (
      <div style={{
        marginLeft: `${marginLeft}px`,
        width: showSidebar ? `calc(100% - ${marginLeft}px)` : '100%',
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        paddingTop: showSidebar ? '70px' : '0'
      }}>
        {/* Global top bar - moved outside scaled div so position:fixed works */}
        {showSidebar && (
        <div
          style={{
            width: `calc(100% - ${marginLeft}px)`,
            padding: '1.5rem 2.75rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: `${marginLeft}px`,
            right: 0,
            zIndex: 100,
            background: isDarkMode
              ? 'linear-gradient(180deg, rgba(2,6,23,0.96) 0%, rgba(15,23,42,0.9) 100%)'
              : 'linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(248,250,252,0.9) 100%)',
            backdropFilter: 'blur(8px)',
            borderBottom: isDarkMode ? '1px solid rgba(71,85,105,0.55)' : '1px solid rgba(226,232,240,0.8)',
            boxSizing: 'border-box',
          }}
        >
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#94a3b8', letterSpacing: '0.08em' }}>WELCOME BACK</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Icons.User style={{ width: 22, height: 22, color: isDarkMode ? '#60a5fa' : '#2563eb' }} />
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 600 }}>
                  {userFirstName}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={onToggleDarkMode}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.2rem',
                  borderRadius: '999px',
                  border: isDarkMode ? '1px solid rgba(148,163,184,0.35)' : '1px solid #dbeafe',
                  background: isDarkMode ? 'rgba(30,41,59,0.9)' : '#eff6ff',
                  color: isDarkMode ? '#e2e8f0' : '#1e40af',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: isDarkMode ? '0 8px 20px rgba(2,6,23,0.3)' : '0 2px 6px rgba(37,99,235,0.08)'
                }}
              >
                <Icons.Monitor style={{ width: 16, height: 16 }} />
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>

              <button
                onClick={() => onViewChange?.('module-01')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.65rem 1.2rem',
                  borderRadius: '999px',
                  border: isDarkMode ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid #dbeafe',
                  background: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : '#eff6ff',
                  color: isDarkMode ? '#bfdbfe' : '#1e40af',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: isDarkMode ? '0 8px 24px rgba(2, 6, 23, 0.28)' : '0 2px 6px rgba(37,99,235,0.08)'
                }}
              >
                <Icons.BookOpen style={{ width: 16, height: 16 }} /> Pilot Modules
              </button>

              <button
                onClick={() => setMainView('pilot-portfolio')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.65rem 1.2rem',
                  borderRadius: '999px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : '1px solid #e2e8f0',
                  background: isDarkMode ? 'rgba(15, 23, 42, 0.92)' : '#fff',
                  color: isDarkMode ? '#e2e8f0' : '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: isDarkMode ? '0 8px 24px rgba(2, 6, 23, 0.28)' : '0 2px 6px rgba(15,23,42,0.08)'
                }}
              >
                <Icons.User style={{ width: 16, height: 16 }} /> Profile
              </button>

              <button
                onClick={() => setMainView('applications')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.65rem 1.2rem',
                  borderRadius: '999px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.65)' : '1px solid transparent',
                  background: isDarkMode ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.96) 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  color: isDarkMode ? '#cbd5e1' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: isDarkMode ? '0 8px 24px rgba(2, 6, 23, 0.28)' : 'inset 0 1px 1px rgba(255,255,255,0.8)'
                }}
              >
                <Icons.Settings style={{ width: 16, height: 16 }} /> Settings
              </button>

              <button
                onClick={handleAccessWebsite}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(31,41,55,0.18)'
                }}
              >
                <Icons.Globe style={{ width: 18, height: 18 }} /> Access Website
              </button>
            </div>
          </div>
        )}

          <div
            style={{
              transform: `scale(${mainPanelScale})`,
              transformOrigin: 'top left',
              width: inverseScalePercent,
              minWidth: inverseScalePercent,
              height: inverseScalePercent,
              minHeight: inverseScalePercent,
              animation: 'fadeInSlide 0.7s ease-out'
            }}
          >
            {renderMainContent()}
          </div>
          <style>{`
            @keyframes fadeInSlide {
              from {
                opacity: 0;
                transform: scale(${mainPanelScale}) translateY(20px);
              }
              to {
                opacity: 1;
                transform: scale(${mainPanelScale}) translateY(0);
              }
            }
          `}</style>
        </div>
    );
  };

  const WingMentorNetworkView = ({ onBack, onViewChange }: { onBack: () => void; onViewChange?: (view: string, returnView?: string) => void }) => {
    return (
    <div
      className="dashboard-container animate-fade-in"
      style={{
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '3rem 1rem 2rem',
        background: isDarkMode ? 'linear-gradient(180deg, #020817 0%, #071122 100%)' : 'transparent'
      }}
    >
      <main
        className="dashboard-card network-panel"
        style={{ position: 'relative', padding: 0, background: 'transparent', boxShadow: 'none', border: 'none', width: '100%', maxWidth: '1100px' }}
      >
        <header className="dashboard-header" style={{
          borderBottom: isDarkMode ? '1px solid rgba(51, 65, 85, 0.9)' : '1px solid rgba(226, 232, 240, 0.7)',
          paddingBottom: '2.5rem',
          background: isDarkMode ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'transparent',
          backgroundColor: isDarkMode ? undefined : 'transparent',
          borderRadius: isDarkMode ? '28px 28px 0 0' : undefined,
          paddingTop: isDarkMode ? '2rem' : undefined,
          boxShadow: isDarkMode ? '0 18px 48px rgba(2, 6, 23, 0.35)' : 'none'
        }}>
          <div style={{ position: 'absolute', top: '1.5rem', left: '2rem' }}>
            <button
              className="back-btn"
              onClick={onBack}
              style={{
                padding: '0.5rem 0',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isDarkMode ? '#94a3b8' : '#475569',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = isDarkMode ? '#e2e8f0' : '#0f172a';
                e.currentTarget.style.transform = 'translateX(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = isDarkMode ? '#94a3b8' : '#475569';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
              Back to Hub
            </button>
          </div>

          <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
          </div>

          <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em', color: isDarkMode ? '#60a5fa' : '#2563eb', fontWeight: 700 }}>
            WINGMENTOR NETWORK
          </div>

          <h1 style={{
            fontSize: '3.3rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            fontFamily: '"Georgia", serif',
            fontWeight: 400
          }}>
            Connecting Pilots to the Industry
          </h1>

          <p style={{
            color: isDarkMode ? '#94a3b8' : '#64748b',
            fontSize: '0.875rem',
            maxWidth: '42rem',
            margin: '0 auto 1.5rem',
            padding: '0 1rem',
            lineHeight: '1.625',
            textAlign: 'center'
          }}>
            Connect with the aviation community, access shared knowledge, and stay updated with industry insights through our comprehensive network platform.
          </p>
        </header>

        <div className="dashboard-content" style={{ padding: '3rem 1rem 4rem', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center' }}>
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="horizontal-card" style={{
              padding: '2rem',
              marginBottom: '2rem',
              background: isDarkMode ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%)' : 'rgba(15, 23, 42, 0.03)',
              borderRadius: '20px',
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : '1px solid rgba(226, 232, 240, 0.6)',
              boxShadow: isDarkMode ? '0 25px 60px rgba(2, 6, 23, 0.35)' : '0 25px 60px rgba(15, 23, 42, 0.07)',
              backdropFilter: 'blur(22px)'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      WingMentor Search Engine
                    </h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <input
                        type="text"
                        placeholder="Search requirements, knowledge base, type ratings..."
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: isDarkMode ? '2px solid rgba(71, 85, 105, 0.85)' : '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          color: isDarkMode ? '#e2e8f0' : '#0f172a',
                          background: isDarkMode ? 'rgba(2, 6, 23, 0.75)' : '#f8fafc',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563eb';
                          e.currentTarget.style.background = isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'white';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = isDarkMode ? 'rgba(71, 85, 105, 0.85)' : '#e2e8f0';
                          e.currentTarget.style.background = isDarkMode ? 'rgba(2, 6, 23, 0.75)' : '#f8fafc';
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        🔍 Search Database
                      </button>
                      <button style={{ padding: '0.5rem 1rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.92)' : '#f1f5f9', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        📚 Knowledge Bank
                      </button>
                      <button style={{ padding: '0.5rem 1rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.92)' : '#f1f5f9', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        ✈️ Type Ratings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="horizontal-card" style={{
              cursor: 'pointer',
              padding: '0',
              marginBottom: '2rem',
              background: isDarkMode ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: isDarkMode ? '0 18px 40px rgba(2, 6, 23, 0.34), 0 1px 3px rgba(2, 6, 23, 0.22)' : '0 4px 20px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)',
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : '1px solid rgba(226, 232, 240, 0.6)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'stretch'
            }}
            onClick={() => setMainView('aviation-expectations')}>
              <div style={{ flex: '1', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isDarkMode ? '#93c5fd' : '#64748b', background: isDarkMode ? 'rgba(37, 99, 235, 0.16)' : 'rgba(100, 116, 139, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px' }}>
                    Directory
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Aviation Industry Expectations
                </h3>
                <p style={{ marginBottom: '1.25rem', color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '1rem', lineHeight: 1.7, maxWidth: '90%' }}>
                  Explore airline hiring requirements, career paths & expectations
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: isDarkMode ? 'rgba(2, 6, 23, 0.82)' : 'white', borderRadius: '100px', color: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: 500, border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : '1px solid rgba(226, 232, 240, 0.8)', boxShadow: isDarkMode ? '0 8px 18px rgba(2, 6, 23, 0.25)' : '0 1px 2px rgba(0,0,0,0.02)' }}>
                    Hiring Requirements
                  </span>
                  <span style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: isDarkMode ? 'rgba(2, 6, 23, 0.82)' : 'white', borderRadius: '100px', color: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: 500, border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : '1px solid rgba(226, 232, 240, 0.8)', boxShadow: isDarkMode ? '0 8px 18px rgba(2, 6, 23, 0.25)' : '0 1px 2px rgba(0,0,0,0.02)' }}>
                    Career Paths
                  </span>
                </div>
              </div>
              <div style={{ position: 'relative', width: '40%', minHeight: '220px', overflow: 'hidden', borderRadius: '0 24px 24px 0' }}>
                <img src="/Gemini_Generated_Image_7awns87awns87awn.png" alt="Aviation Industry Expectations" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: isDarkMode ? 'linear-gradient(90deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0) 30%)' : 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 30%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: isDarkMode ? 'rgba(2, 6, 23, 0.88)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDarkMode ? '0 8px 20px rgba(2,6,23,0.35)' : '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.3s ease' }}>
                  <Icons.ArrowRight style={{ width: 20, height: 20, color: isDarkMode ? '#e2e8f0' : '#0f172a' }} />
                </div>
              </div>
            </div>

            <div className="horizontal-card" style={{ padding: '2rem', marginBottom: '2rem', background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white', borderRadius: '20px', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid rgba(226, 232, 240, 0.8)', boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)' }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Job Application Database Directory
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: isDarkMode ? '#cbd5e1' : '#475569', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                      Track every WingMentor application in one industry-grade ledger. Airlines, operators, and recruitment partners receive structured dossiers with NOTECHS deltas, remediation steps, and status updates synchronized with the Pilot Recognition database.
                    </p>
                    <div style={{ marginTop: '1.5rem' }}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (onViewChange) onViewChange('job-database');
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#0ea5e9', color: 'white', borderRadius: '999px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s ease' }}
                      >
                        Explore Full Database
                        <Icons.ArrowRight style={{ width: 16, height: 16 }} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(248, 250, 252, 0.8)', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(71,85,105,0.75)' : '1px solid #e2e8f0', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#94a3b8', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                🔄 WingMentor Database Sync • Real-time Updates • Community Powered
              </div>
            </div>
          </div>
        </div>

        <footer className="dashboard-footer" style={{
          marginTop: '1rem',
          padding: '2rem 3.5rem',
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
          borderTop: isDarkMode ? '1px solid rgba(51,65,85,0.9)' : '1px solid #f1f5f9',
          textAlign: 'center'
        }}>
          <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Connect with the WingMentor Network for comprehensive aviation resources and community support.
          </p>
          <button
            className="help-btn"
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: isDarkMode ? '1px solid rgba(71,85,105,0.75)' : '1px solid #e2e8f0',
              background: isDarkMode ? 'rgba(2,6,23,0.88)' : '#ffffff',
              color: isDarkMode ? '#e2e8f0' : '#1e293b',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              boxShadow: isDarkMode ? '0 8px 20px rgba(2,6,23,0.32)' : '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com'}
          >
            ✉️ Contact Support
          </button>
        </footer>
      </main>
    </div>
    );
  };

  // Main Content Renderer
  const renderMainContent = () => {
    switch (mainView) {
      case 'news':
        return <NewsView />;
      case 'dashboard':
        return <DashboardView />;
      case 'programs':
        return <ProgramsView />;
      case 'pathways':
        return (
          <div style={{ transform: 'scale(1.15)', transformOrigin: 'top center' }}>
            <PathwaysView />
          </div>
        );
      case 'pilot-gap-module':
        return (
          <PilotGapModulePage 
            onBack={() => setMainView('modules')}
            onComplete={() => setMainView('modules')}
            onNavigateToMentorModules={() => setMainView('mentor-modules')}
          />
        );
      case 'pilot-gap-module-2':
        return (
          <PilotGapModulePage 
            onBack={() => setMainView('modules')}
            onComplete={() => setMainView('modules')}
            onNavigateToMentorModules={() => setMainView('mentor-modules')}
          />
        );
      case 'module-3':
        return (
          <PilotGapModulePage 
            onBack={() => setMainView('modules')}
            onComplete={() => setMainView('modules')}
            onNavigateToMentorModules={() => setMainView('mentor-modules')}
          />
        );
      case 'mentor-modules':
        return (
          <MentorModulesPage 
            onBack={() => setMainView('pilot-gap-module')}
            onComplete={() => setMainView('dashboard')}
          />
        );
      case 'applications':
        return (
          <DashboardPage 
            onBack={() => setMainView('dashboard')} 
            onViewLogbook={() => setMainView('logbook')}
            onViewDigitalLogbook={() => setMainView('digital-logbook')}
            onViewMentorLogbook={() => setMainView('foundational-logbook')}
            onViewAtlas={() => setMainView('atlas-resume')}
            onViewRecognition={() => setMainView('recognition')}
            onViewPrograms={() => setMainView('programs')}
            onViewPathways={() => setMainView('pathways')}
            onViewExamination={() => setMainView('examination-results')}
            onViewFoundationalProgram={() => setMainView('applications')}
            onViewFoundationalEnrollment={() => setMainView('foundational')}
            onViewLicensureExperience={() => setMainView('pilot-licensure-experience')}
            onViewJobDatabase={() => onViewChange?.('job-database')}
            onViewModule01={() => onViewChange?.('module-01', 'applications')}
            onViewModule02={() => onViewChange?.('module-02', 'applications')}
            onViewExaminationPortal={() => onViewChange?.('examination-portal')}
            onViewFoundationalPlatform={() => onViewChange?.('foundational-enrolled')}
            isDarkMode={isDarkMode}
          />
        );
      case 'recognition':
        return (
          <RecognitionAchievementPage
            onBack={() => setMainView('dashboard')}
            userProfile={userProfile}
            onViewExams={() => setMainView('examination-results')}
            onViewAtlas={() => setMainView('atlas-resume')}
          />
        );
      case 'examination-results':
        return <ExaminationResultsPage onBack={() => setMainView('recognition')} userProfile={userProfile} />;
      case 'pilot-portfolio':
        return (
          <DashboardPage 
            onBack={() => setMainView('dashboard')} 
            onViewLogbook={() => setMainView('logbook')}
            onViewDigitalLogbook={() => setMainView('digital-logbook')}
            onViewMentorLogbook={() => setMainView('foundational-logbook')}
            onViewAtlas={() => setMainView('atlas-resume')}
            onViewRecognition={() => setMainView('recognition')}
            onViewPrograms={() => setMainView('programs')}
            onViewPathways={() => setMainView('pathways')}
            onViewExamination={() => setMainView('examination-results')}
            onViewFoundationalProgram={() => setMainView('applications')}
            onViewFoundationalEnrollment={() => setMainView('foundational')}
            onViewLicensureExperience={() => setMainView('pilot-licensure-experience')}
            onViewModule01={() => onViewChange?.('module-01', 'pilot-portfolio')}
            onViewModule02={() => onViewChange?.('module-02', 'pilot-portfolio')}
            onViewExaminationPortal={() => onViewChange?.('examination-portal')}
            onViewFoundationalPlatform={() => onViewChange?.('foundational-enrolled')}
          />
        );
      case 'logbook':
        return <LogbookPage onBack={() => setMainView('pilot-portfolio')} userProfile={userProfile} />;
      case 'digital-logbook':
        return <DigitalLogbookPage onBack={() => setMainView('pilot-portfolio')} userProfile={userProfile ?? undefined} />;
      case 'foundational-logbook':
        return <MentorLogbookPage onBack={() => setMainView('pilot-portfolio')} userProfile={userProfile ?? undefined} />;
      case 'pilot-licensure-experience':
        return <PilotLicensureExperiencePage onBack={() => setMainView('pilot-portfolio')} userProfile={userProfile ?? undefined} />;
      case 'atlas-resume':
        return <AtlasResumePage onBack={() => setMainView('recognition')} onPrint={() => setMainView('printable-resume')} userProfile={userProfile} />;
      case 'full-atlas-resume':
        return <FullAtlasResumePage onBack={() => setMainView('dashboard')} onPrint={() => window.print()} userProfile={userProfile} />;
      case 'wingmentor-network':
        return <WingMentorNetworkView onBack={() => setMainView('dashboard')} onViewChange={onViewChange} />;
      case 'aviation-expectations':
        return (
          <AviationIndustryExpectationsPage
            onBack={() => setMainView('wingmentor-network')}
            userId={userProfile?.id}
          />
        );
      case 'atpl-pathway':
        return <ATPLPathwayPage onBack={() => setMainView('pathways')} isDarkMode={isDarkMode} />;
      case 'private-sector':
        return <PrivateSectorPathwayPage onBack={() => setMainView('pathways')} />;
      case 'foundational-enrollment-check':
        return (
          <FoundationalEnrollmentCheck
            userId={userProfile?.id}
            onResult={(enrolled) => setMainView(enrolled ? 'foundational-enrolled' : 'foundational')}
            preloadedEnrollment={preloadedData?.enrollment}
            preloadedPrograms={preloadedData?.programs}
            userProfile={userProfile}
          />
        );

      case 'foundational-enrolled':
        return (
          <EnrolledFoundationalPage
            userProfile={userProfile}
            onBack={() => setMainView('programs')}
            onOpenPortfolio={() => setMainView('program-progress')}
            onViewProgramDetails={() => setMainView('foundational')}
            onOpenModules={() => onViewChange?.('modules', 'foundational-enrolled')}
            onOpenLogbook={() => setMainView('foundational-logbook')}
          />
        );

      case 'foundational-loading':
        return (
          <div
            style={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(1rem, 3vw, 3rem)'
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
                style={{ width: '220px', height: 'auto' }}
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
        );

      case 'examination-portal':
        return (
          <ExaminationPortalPage
            userProfile={userProfile}
            onBack={() => setMainView('program-progress')}
            onStartFoundationalExam={() => setMainView('foundational-exam')}
            onStartFAAExam={() => setMainView('license-selection')}
            onStartInterviewEvaluation={() => setMainView('interview-evaluation')}
            module01Completed={true}
            programCompleted={false}
          />
        );

      case 'foundational-exam':
        return (
          <FoundationalKnowledgeExamPage
            userProfile={userProfile}
            onBack={() => setMainView('examination-portal')}
          />
        );

      case 'license-selection':
        return (
          <LicenseSelectionPage
            userProfile={userProfile}
            onBack={() => setMainView('examination-portal')}
            onSelectLicense={(licenseType) => console.log('Selected license:', licenseType)}
          />
        );

      case 'interview-evaluation':
        return (
          <InterviewEvaluationPage
            userProfile={userProfile}
            onBack={() => setMainView('examination-portal')}
          />
        );

      case 'program-syllabus':
        return (
          <ProgramSyllabusPage
            userProfile={userProfile}
            onBack={() => setMainView('program-progress')}
          />
        );

      case 'foundational':
        return (
          <FoundationalProgramPage
            onBack={() => setMainView(userProfile?.enrolledPrograms?.includes('Foundational') ? 'foundational-enrolled' : 'programs')}
            onLogout={onLogout}
            onOpenPortfolio={() => setMainView('pilot-portfolio')}
          />
        );
      case 'enrollment-confirmation':
        console.log('🔍 WingMentorHome: Loading enrollment confirmation with user:', {
            userProfile: !!userProfile,
            userEmail: userProfile?.email,
            userId: userProfile?.id
        });
        return (
          <EnrollmentConfirmationPage
            onBack={() => setMainView('programs')}
            onLogout={onLogout}
            userEmail={userProfile?.email}
          />
        );
      case 'post-enrollment-slideshow':
        return (
          <PostEnrollmentSlideshow
            onComplete={() => setMainView('programs')}
          />
        );
      default:
        return <DashboardView />;
    }
  };

  // Determine if we should show the sidebar (hide for standalone views like enrollment and program platform)
  const showSidebar = mainView !== 'foundational' && mainView !== 'foundational-get-started' && mainView !== 'foundational-onboarding' && mainView !== 'foundational-enrolled' && mainView !== 'foundational-loading';

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: isDarkMode ? '#020817' : '#f8fafc'
    }}>
      {showSidebar && <Sidebar />}
      
      {/* Main Content Area */}
      <MainPanel />
    </div>
  );
};
