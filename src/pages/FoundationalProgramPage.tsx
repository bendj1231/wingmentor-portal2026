import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../icons';
import type { UserProfile } from '../types/user';
import { RestrictionPage } from './RestrictionPage';
import { EnrolledFoundationalCard } from '../components/EnrolledFoundationalCard';

interface Module {
    id: string;
    number: string;
    title: string;
    bullets: string[];
    description: string;
    status?: string;
    badge?: string;
    badgeColor?: string;
    icon: keyof typeof Icons;
    onLaunch?: () => void;
}

interface FoundationalProgramPageProps {
    onBack?: () => void;
    onLogout?: () => void;
    onStartEnrollment?: () => void;
    onStartSlideshow?: () => void;
    onSelectDownload?: () => void;
    onLaunchW1000?: () => void;
    onLaunchMentorship?: () => void;
    onLaunchModule01?: () => void;
    onLaunchModule02?: () => void;
    onLaunchModule03?: () => void;
    onOpenPortfolio?: () => void;
    completedModules?: string[];
    userProfile?: UserProfile | null;
}

const FoundationalProgramPage: React.FC<FoundationalProgramPageProps> = ({
    onBack,
    onLogout,
    onStartEnrollment,
    onLaunchW1000,
    onLaunchMentorship,
    onLaunchModule01,
    onLaunchModule02,
    onLaunchModule03,
    onOpenPortfolio,
    completedModules = [],
    userProfile
}) => {

    // Debug: Log when component receives props
    React.useEffect(() => {
        console.log('🔍 FoundationalProgramPage props:', {
            onBack: !!onBack,
            onLogout: !!onLogout,
            onStartEnrollment: !!onStartEnrollment,
            userProfile: !!userProfile,
            userProfileEmail: userProfile?.email
        });
    }, [onBack, onLogout, onStartEnrollment, userProfile]);

    // Video Player State
    const heroVideoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [heroVolume, setHeroVolume] = useState(0.6);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [videoControlsVisible, setVideoControlsVisible] = useState(true);

    const displayName =
        (userProfile?.displayName && userProfile.displayName.trim()) ||
        [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ').trim() ||
        userProfile?.email ||
        'Pilot';

    // Check if user is enrolled in Foundational Program
    const userHasFoundationalEnrollment = Boolean(userProfile?.enrolledPrograms?.includes('Foundational'));

    // Video Player Helpers
    const toggleHeroVideoPlayback = () => {
        const video = heroVideoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
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
        const volume = Number(event.target.value);
        setHeroVolume(volume);
        if (heroVideoRef.current) {
            heroVideoRef.current.volume = volume;
        }
    };

    const formatTime = (value: number) => {
        if (!value || value === 0) return '0:00';
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const VolumeIcon = ({ muted }: { muted: boolean }) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {muted ? (
                <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </>
            ) : (
                <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </>
            )}
        </svg>
    );

    const FullscreenIcon = ({ active }: { active: boolean }) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {active ? (
                <>
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </>
            ) : (
                <>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </>
            )}
        </svg>
    );

    const handleFullscreenToggle = () => {
        const video = heroVideoRef.current;
        if (!video) return;
        if (!document.fullscreenElement) {
            video.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
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

    // Program access is now open for all authenticated users.

    const modules: Module[] = [
        {
            id: 'stage-1',
            number: '01',
            title: 'Initial Program Module',
            bullets: [
                'Current Industry Status',
                'Pilot Gap Market Analysis',
                'Indoctrination Protocols'
            ],
            description: 'A deep dive into the current status of the aviation industry and the pilot market. Understand the systemic gaps in training and employment that WingMentor addresses through its foundational indoctrination.',
            status: 'In Progress',
            badge: 'In Progress',
            badgeColor: '#ecfdf5',
            icon: 'Book',
            onLaunch: onLaunchModule01
        },
        {
            id: 'stage-2',
            number: '02',
            title: 'Initial Examination Module',
            bullets: [
                'Academic Bridge Knowledge',
                'Baseline Retention',
                'Initial Skills Record'
            ],
            description: 'After the initial induction, you must prepare for a knowledge assessment based on the industry information provided. Your baseline retention is evaluated using integrated FAA/CAAP standards to establish your first verified skills record.',
            status: 'Examination',
            icon: 'FileText',
            onLaunch: () => console.log('Launch Initial Examination Module')
        },
        {
            id: 'stage-3',
            number: '03',
            title: 'Global Industry Registry',
            bullets: [
                'Centralized Professional Record',
                'Recruitment Transparency',
                'Pilot Recognition Metrics'
            ],
            description: 'All examination outcomes are safely archived within the Global Industry Registry. This serves as your verifiable professional record, ensuring transparency and credibility for airline recruitment partners.',
            icon: 'Book',
            onLaunch: () => console.log('Launch Stage 3')
        },
        {
            id: 'stage-4',
            number: '04',
            title: 'Mentorship Module',
            bullets: [
                'Mentorship Fundamentals',
                'Psychological Awareness',
                'Peer Observation Psychology'
            ],
            description: 'Learn the core difference between instructing and mentoring. This stage focuses on self-assessment, issue-resolution techniques, and the pre-psychology of peer observation.',
            icon: 'Users',
            onLaunch: onLaunchModule02
        },
        {
            id: 'stage-5',
            number: '05',
            title: 'Pre-Mentorship Examination & Observation',
            bullets: [
                'Mentorship Prep Exam',
                'Practical Interview',
                '10hr Observation Requirement'
            ],
            description: 'Prior to your 20-hour official supervised phase, you must pass a pre-examination on mentorship knowledge and complete 10 hours of active peer mentorship observation.',
            status: 'Examination',
            icon: 'Activity',
            onLaunch: onLaunchModule03
        },
        {
            id: 'stage-6',
            number: '06',
            title: 'Supervised Mentorship',
            bullets: [
                '20-Hour Mentorship Goal',
                'Objective Logging',
                'Consultation Delivery'
            ],
            description: 'Execute 20 hours of supervised, tracked peer mentorship. You must maintain highly detailed, objective logs delivering accurate problem-solving consultations and prescriptions.',
            badge: '20h Milestone',
            badgeColor: '#fff7ed',
            icon: 'Award',
            onLaunch: onLaunchW1000
        },
        {
            id: 'stage-8',
            number: '08',
            title: 'Advanced Mentorship & Leadership Milestone',
            bullets: [
                '50-Hour Milestone',
                'Advanced Instruction Prep',
                'Ecosystem Leadership'
            ],
            description: 'Continue your mentorship to the 50-hour milestone to demonstrate sustained leadership and advanced instructional readiness within the WingMentor ecosystem.',
            badge: '50h Milestone',
            badgeColor: '#f0f9ff',
            icon: 'Award',
            onLaunch: () => console.log('Launch Stage 8')
        },
        {
            id: 'stage-9',
            number: '09',
            title: 'AIRBUS Recognition Interview',
            bullets: [
                'Industry Evaluation',
                'AIRBUS Recognition',
                'Airline Placement Prep'
            ],
            description: 'The final culmination of the program: the AIRBUS Recognition Interview. This rigorous assessment verifies your readiness for direct airline placement and official industry recognition.',
            status: 'Examination',
            badge: 'Final Evaluation',
            badgeColor: '#f0f9ff',
            icon: 'Activity',
            onLaunch: () => console.log('Launch Stage 9')
        },
        {
            id: 'stage-7',
            number: '07',
            title: 'Accreditation & Professional Prescription',
            bullets: [
                'Mentorship Evaluation',
                'Industry Credentials',
                'Advanced Ecosystem Placement'
            ],
            description: 'Upon meeting criteria, your experience is accredited against industry standards recognized by major partners, authorizing you for advanced placement within the ecosystem.',
            badge: 'Accreditation',
            badgeColor: '#ecfdf5',
            icon: 'Briefcase',
            onLaunch: onLaunchMentorship
        },
        {
            id: 'stage-10',
            number: '10',
            title: 'WingMentor Certification & Recognition',
            bullets: [
                'Final Accreditation',
                'Industry Endorsement',
                'Registry Verification'
            ],
            description: 'Official certification of all mentorship hours and industry recognition. Your profile is now verified for our global airline partners and the industry registry.',
            badge: 'Certified',
            badgeColor: '#f0f9ff',
            icon: 'CheckCircle',
            onLaunch: () => console.log('Launch Stage 10')
        }
    ];

    const highlightStats = [
        {
            label: 'Program Chapters',
            value: '12 Modules',
            detail: 'Each briefing compounds into Airbus-aligned competency evidence.'
        },
        {
            label: 'Simulation & Mentorship',
            value: '40+ Hours',
            detail: 'Structured simulator + supervised mentorship prescriptions.'
        },
        {
            label: 'Recognition Path',
            value: 'Airbus Validated',
            detail: 'Evidence tracked toward AIRBUS Recognition Interview readiness.'
        }
    ];

    const overviewCards = [
        {
            title: "The Pilot Gap",
            description: "Maps the critical transition between flight school graduation and airline employment. This program provides recent graduates with essential hands-on experience, helping you maintain strict professional proficiency during extended hiring cycles. Bridge the 1,500-hour gap through structured peer mentorship and build the data-driven portfolio that airlines demand.",
            tag: "1. The Context",
            image: "https://lh3.googleusercontent.com/d/1jL8lgdJZgdMrzUJkhvDOrlb1S8s7dEb4",
            bullets: []
        },
        {
            title: "Wingmentorship Approach",
            description: "We create a database of vetting screened pilots based not just on flight hours, but on industry recognition through EBT & CBTA applications provided by Airbus, Foundational Program leadership skills, and our pilot recognition logging system. Our mentorship program builds credible and accredited experience for pilots to gain prior to their interview with an ATO or any aviation body.",
            tag: "2. The Goal",
            image: "https://lh3.googleusercontent.com/d/1hHcJHmG0pTPDuvgiv79l88VpPz_lOXi1",
            bullets: []
        },
        {
            title: "Pilot Recognition & Advocacy",
            description: "Your efforts and input won't go to waste. Your data is recognized by airlines, manufacturers, and industry insiders to give pilots what they really want: the chance to be seen. Gain guidance and a clear pathway while meeting the verified expectations of global aviation governing bodies.",
            tag: "3. Recognition",
            image: "https://lh3.googleusercontent.com/d/1MfE9fiot6b9kCpgwQfc4aUY6e317nrUj",
            bullets: []
        },
        {
            title: "Instructor vs WingMentor",
            description: "Traditional instructors often struggle to support dozens of students simultaneously. WingMentors provide the one-on-one consultation and targeted problem-solving that large classrooms lack. This accredited program builds the leadership skills essential for future flight instructors and airline-bound pilots, ensuring you are truly industry-ready.",
            image: "https://lh3.googleusercontent.com/d/1GyMG1004Ny93i4_ktGikIXgzy-FHiPBI"
        }
    ];

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#f8fafc',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                position: 'relative',
                paddingBottom: '4rem'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem clamp(1.25rem, 4vw, 3rem)' }}>
                {/* Show enrolled card if user is enrolled */}
                {userHasFoundationalEnrollment && (
                    <EnrolledFoundationalCard 
                        userProfile={userProfile}
                        onOpenPortfolio={() => onOpenPortfolio?.()}
                        onReviewDetails={() => {
                            const anchor = document.getElementById('foundational-details');
                            if (anchor) {
                                anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                    />
                )}
                
                <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                    <button
                        onClick={() => onBack?.()}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            border: '1px solid rgba(37,99,235,0.3)',
                            background: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            cursor: 'pointer'
                        }}
                    >
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Hub
                    </button>
                </div>

                <section id="foundational-details" style={{ textAlign: 'center', marginBottom: '2.5rem', filter: userHasFoundationalEnrollment ? 'blur(2px)' : 'none', transition: 'filter 0.3s ease' }}>
                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '250px', height: 'auto', objectFit: 'contain', marginBottom: '1rem' }} />
                    <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        WINGMENTOR PROGRAMS
                    </div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Foundation Program
                    </h1>
                    <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}>
                        WingMentor Programs provide comprehensive pathways for aviation career advancement. The Foundational Program delivers essential industry familiarization, mentorship integration, and risk management strategies, while the upcoming Transition Program offers advanced career progression for experienced pilots seeking specialized aviation roles. Both programs combine simulator training, industry-aligned credentialing, and verified mentorship to prepare you for airline recruitment and industry recognition.
                    </p>
                </section>

                {/* Header outside the card */}
                <div style={{ textAlign: 'center', marginBottom: '2rem', filter: userHasFoundationalEnrollment ? 'blur(2px)' : 'none', transition: 'filter 0.3s ease' }}>
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        The First Step Towards Pilot Recognition
                    </h2>
                </div>

                {/* Floating Video */}
                <div style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto 4rem', 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    boxShadow: '0 20px 60px rgba(15,23,42,0.15)', 
                    background: '#0f172a',
                    position: 'relative',
                    zIndex: 10,
                    filter: userHasFoundationalEnrollment ? 'blur(2px)' : 'none',
                    transition: 'filter 0.3s ease'
                }}>
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#020617' }} onMouseEnter={() => setVideoControlsVisible(true)} onMouseLeave={() => setVideoControlsVisible(false)}>
                        <video
                            ref={heroVideoRef}
                            src="/wm%20productions%20final%20output.mov"
                            preload="auto"
                            playsInline
                            autoPlay
                            loop
                            muted={isVideoMuted}
                            controls={false}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            aria-label="WingMentor mission footage"
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                            onEnded={() => {
                                setIsVideoPlaying(false);
                                if (heroVideoRef.current) {
                                    heroVideoRef.current.currentTime = 0;
                                    heroVideoRef.current.play();
                                }
                            }}
                            onTimeUpdate={(e) => setVideoCurrentTime(e.currentTarget.currentTime)}
                            onDurationChange={(e) => setVideoDuration(e.currentTarget.duration)}
                            onError={(e) => console.error('Video playback error:', e)}
                            onWaiting={() => console.log('Video buffering...')}
                            onCanPlay={() => console.log('Video can play')}
                            onLoadedData={() => {
                                console.log('Video loaded');
                                if (heroVideoRef.current && heroVideoRef.current.paused) {
                                    heroVideoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
                                }
                            }}
                        >
                            <track kind="captions" />
                            Your browser does not support the mission footage video.
                        </video>
                        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.25) 50%, rgba(15,23,42,0.55) 100%)' }} />
                        <div
                            style={{
                                position: 'absolute',
                                left: '50%',
                                bottom: '1.5rem',
                                transform: 'translateX(-50%)',
                                width: '78%',
                                background: 'rgba(11,14,28,0.55)',
                                backdropFilter: 'blur(32px)',
                                borderRadius: '28px',
                                padding: '1.15rem 1.5rem',
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.9rem',
                                boxShadow: '0 40px 80px rgba(2,4,12,0.5)',
                                opacity: isVideoPlaying && !videoControlsVisible ? 0 : 1,
                                transition: 'opacity 0.4s ease',
                                pointerEvents: isVideoPlaying && !videoControlsVisible ? 'none' : 'auto'
                            }}
                            onMouseEnter={() => setVideoControlsVisible(true)}
                            onMouseLeave={() => setVideoControlsVisible(false)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.85, minWidth: '2.5rem' }}>{formatTime(videoCurrentTime)}</span>
                                <input type="range" min={0} max={100} value={videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0} onChange={handleHeroVideoSeek} style={{ flex: 1, appearance: 'none', height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.25)', outline: 'none' }} />
                                <span style={{ fontSize: '0.8rem', opacity: 0.85, minWidth: '2.5rem', textAlign: 'right' }}>{formatTime(videoDuration)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <button type="button" onClick={toggleHeroVideoPlayback} aria-pressed={isVideoPlaying} aria-label={isVideoPlaying ? 'Pause mission footage' : 'Play mission footage'} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', cursor: 'pointer' }}>
                                        {isVideoPlaying ? '❚❚' : '▶'}
                                    </button>
                                    <button type="button" onClick={toggleHeroVideoMute} aria-label={isVideoMuted ? 'Unmute mission footage' : 'Mute mission footage'} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.12)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', cursor: 'pointer' }}>
                                        <VolumeIcon muted={isVideoMuted} />
                                    </button>
                                    <input type="range" min={0} max={1} step={0.05} value={heroVolume} onChange={handleHeroVolumeChange} style={{ width: '110px', appearance: 'none', height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.22)', outline: 'none' }} />
                                </div>
                                <button type="button" onClick={handleFullscreenToggle} style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                                    <FullscreenIcon active={isFullScreen} />
                                    {isFullScreen ? 'Exit Full View' : 'Full View'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Content Outside Card */}
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
                    {/* Subtopic: Our Mission */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            OUR MISSION
                        </div>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                            The Foundational Program is designed to immerse aspiring pilots in critical industry familiarization, shedding light on common pitfalls and equipping them with robust pilot risk management strategies. You'll discover the pilot gap and what defines a low timer pilot, gain insight into why airlines are not hiring you, and appreciate the importance of pilot recognition. This program helps you navigate through aviation's biggest hurdle - the aviation industry gap - providing the essential knowledge and skills needed to bridge the divide between flight school graduation and airline employment.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            {['12 Modules', 'EBT CBTA aligned Airbus Pilot Portfolio Interview', '50hrs Mentorship & Certification', 'Pilot Recognition'].map((tag) => (
                                <span key={tag} style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: '#eff4ff', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Subtopic: Program Features */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            PROGRAM FEATURES
                        </div>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                            {[
                                { title: 'Evidence-Based Orientation', text: 'The Foundational Program is your evidence-based orientation into WingMentor, blending a cinematic hero chapter with measurable milestones that feed recognition pathways.' },
                                { title: 'Mentorship Integration', text: 'Pairs mentorship, simulator flight time, and Airbus-aligned credentialing into a transparent orientation so you enter the ecosystem confident, informed, and recognized.' },
                                { title: 'Industry Recognition', text: 'Build the data-driven portfolio that airlines demand through structured simulator training modules and verified mentorship hours.' },
                                { title: 'Career Preparation', text: 'Experience the introduction pilots deserve with comprehensive training that prepares you for airline recruitment and industry recognition.' }
                            ].map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284c7', marginTop: '0.6rem', flexShrink: 0 }} />
                                    <p style={{ margin: 0, fontSize: '16px', color: '#475569', textAlign: 'left' }}>
                                        <strong style={{ color: '#0f172a' }}>{item.title}:</strong> {item.text}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* New Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '300px', height: 'auto', objectFit: 'contain', marginBottom: '1rem' }} />
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Earn Experience
                    </h2>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, color: '#2563eb', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Gain Your Pilot Recognition
                    </h3>
                </div>

                {/* Foundation Program Enrollment Table */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    marginBottom: '2rem',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    {/* Table Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                        padding: '1.75rem 2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                            PROGRAM ENROLLMENT
                        </div>
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400, color: '#fff', margin: 0 }}>
                            Foundation Program
                        </h3>
                    </div>

                    {/* Table Content */}
                    <div style={{ padding: '2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#475569' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0f172a' }}>
                                        Program Component
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0f172a' }}>
                                        Description
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0f172a' }}>
                                        Duration
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', flexShrink: 0 }} />
                                            <strong>Modules</strong>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        Comprehensive industry insight and foundational knowledge designed to navigate the pilot gap. Master critical concepts including aviation pilot shortage dynamics, pilot risk management strategies, and gain exclusive access to advanced mentor modules upon successful initial examination completion.
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', verticalAlign: 'top' }}>
                                        Self-paced
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', flexShrink: 0 }} />
                                            <strong>Examination & W1000 Application</strong>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        Assessments & examinations based on foundational modules provided along with mentor modules, FAA & CAAP examinations monthly recency for mentorship certification.
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', verticalAlign: 'top' }}>
                                        recurrency & assigned
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', flexShrink: 0 }} />
                                            <strong>Mentorship 50 hrs Certification</strong>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        Upon completion of 50hrs logged verified and evaluated mentor sessions will gain an official certification and will be eligible for the Transition Program.
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', verticalAlign: 'top' }}>
                                        50hrs (verified logs)
                                    </td>
                                </tr>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', flexShrink: 0 }} />
                                            <strong>EBT CBTA Airbus interview & Pilot Recognition</strong>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                        EBT CBTA aligned interview with a representative from Airbus, evaluation and assessment for pilot portfolio & initial Pilot Recognition along with ATS formatted ATLAS Resume (Curriculum Vitae).
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', verticalAlign: 'top' }}>
                                        completion of foundation program
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Mission Statement */}
                        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 500, lineHeight: 1.6 }}>
                                <strong>Industry Recognition:</strong> The Foundation Program is accredited and recognized as the industry's first with direct contact and support and assurance from AIRBUS, Etihad, ATOs (flight schools), Cadet Programs, Airlines & Operators.
                            </p>
                        </div>

                        {/* Enrollment Button */}
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button
                                onClick={() => {
                                    console.log('🔘 Enrollment button clicked');
                                    console.log('🔘 onStartEnrollment function:', onStartEnrollment);
                                    
                                    if (onStartEnrollment) {
                                        console.log('🚀 Calling onStartEnrollment...');
                                        onStartEnrollment();
                                    } else {
                                        console.error('❌ onStartEnrollment is not defined');
                                        alert('Enrollment function is not available. Please refresh the page and try again.');
                                    }
                                }}
                                style={{
                                    padding: '1.25rem 4rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 12px 30px rgba(37, 99, 235, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 18px 40px rgba(37, 99, 235, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.3)';
                                }}
                            >
                                Start Enrollment
                            </button>
                        </div>
                    </div>
                </div>

                {/* New Header Section */}
                <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Join the Pilot Network
                    </h2>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, color: '#2563eb', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Get Recognized
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default FoundationalProgramPage;
