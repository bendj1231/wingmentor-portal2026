import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icons } from '../icons';
import { PilotGapModuleChapter0 } from './PilotGapModuleChapter0';
import { PilotGapModuleChapter1 } from './PilotGapModuleChapter1';
import { PilotGapModuleChapter2 } from './PilotGapModuleChapter2';
import { MentorModulesPage1 } from './MentorModulesPage1';
import { MentorModulesPage2 } from './MentorModulesPage2';
import { MentorModulesPage3 } from './MentorModulesPage3';
import { MentorModulesPage4 } from './MentorModulesPage4';
import { MentorModulesPage5 } from './MentorModulesPage5';
import { MentorModulesPage6 } from './MentorModulesPage6';
import { MentorModulesPage7 } from './MentorModulesPage7';

interface PilotGapModulePageProps {
    onBack: () => void;
    onComplete?: () => void;
    onNavigateToMentorModules?: () => void;
}

const PilotGapModulePage: React.FC<PilotGapModulePageProps> = ({ onBack, onComplete, onNavigateToMentorModules }) => {
    const [currentChapter, setCurrentChapter] = useState(0);
    const [currentTopic, setCurrentTopic] = useState<string | null>('welcome');

    const navigationFlow = [
        { chapter: 0, topic: 'welcome' },
        { chapter: 0, topic: 'mission' },
        { chapter: 0, topic: 'difference' },
        { chapter: 0, topic: 'program-syllabus' },
        { chapter: 0, topic: null },
        { chapter: 1, topic: null },
        { chapter: 1, topic: 'what-low-timer' },
        { chapter: 1, topic: 'what-pilot-shortage' },
        { chapter: 1, topic: 'what-pilot-gap' },
        { chapter: 1, topic: 'pilot-risk-management' },
        { chapter: 1, topic: 'what-pilot-recognition' },
        { chapter: 1, topic: 'what-now' },
        { chapter: 2, topic: null },
        { chapter: 2, topic: 'why-statistics' },
        { chapter: 2, topic: 'w1000-poh' },
        { chapter: 2, topic: 'initial-exam-access' },
    ];

    const getCurrentStepIndex = () => {
        return navigationFlow.findIndex(step => step.chapter === currentChapter && step.topic === currentTopic);
    };

    useEffect(() => {
        const isLastStep = getCurrentStepIndex() === navigationFlow.length - 1;
        if (isLastStep && onComplete) {
            onComplete();
        }
    }, [currentChapter, currentTopic, onComplete]);

    // ── Inline editing ──────────────────────────────────────────────────────
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: HTMLElement } | null>(null);
    const [editingEl, setEditingEl] = useState<HTMLElement | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // ── Video Player State ──────────────────────────────
    const heroVideoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [heroVolume, setHeroVolume] = useState(0.6);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [videoControlsVisible, setVideoControlsVisible] = useState(true);

    const closeContextMenu = useCallback(() => setContextMenu(null), []);

    // Dismiss context menu on outside click or Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeContextMenu();
                if (editingEl) {
                    editingEl.contentEditable = 'false';
                    editingEl.style.outline = '';
                    editingEl.style.borderRadius = '';
                    editingEl.style.backgroundColor = '';
                    setEditingEl(null);
                }
            }
        };
        const onMouseDown = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                closeContextMenu();
            }
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onMouseDown);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onMouseDown);
        };
    }, [closeContextMenu, editingEl]);

    const handleContentContextMenu = (e: React.MouseEvent) => {
        const EDITABLE_TAGS = ['P', 'H1', 'H2', 'H3', 'H4', 'LI', 'SPAN', 'STRONG', 'EM', 'I'];
        const target = (e.target as HTMLElement).closest(
            EDITABLE_TAGS.map(t => t.toLowerCase()).join(',')
        ) as HTMLElement | null;
        if (!target) return;
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, target });
    };

    const startEdit = () => {
        if (!contextMenu) return;
        const el = contextMenu.target as HTMLElement;
        // eslint-disable-next-line react-hooks/immutability
        el.contentEditable = 'true';
        // eslint-disable-next-line react-hooks/immutability
        el.style.outline = '2px solid #2563eb';
        // eslint-disable-next-line react-hooks/immutability
        el.style.borderRadius = '4px';
        // eslint-disable-next-line react-hooks/immutability
        el.style.backgroundColor = 'rgba(219,234,254,0.25)';
        el.focus();
        // Move caret to end
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        setEditingEl(el);
        setContextMenu(null);
    };

    const commitEdit = (el: HTMLElement) => {
        el.contentEditable = 'false';
        el.style.outline = '';
        el.style.borderRadius = '';
        el.style.backgroundColor = '';
        setEditingEl(null);
    };
    // ────────────────────────────────────────────────────────────────────────

    const totalChapters = 3;
    // ── Video Player Helpers ────────────────────────────
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

    const progress = ((getCurrentStepIndex() + 1) / navigationFlow.length) * 100;



    const handleNext = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex < navigationFlow.length - 1) {
            const nextStep = navigationFlow[currentIndex + 1];
            setCurrentChapter(nextStep.chapter);
            setCurrentTopic(nextStep.topic);
        }
    };

    const handlePrev = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex > 0) {
            const prevStep = navigationFlow[currentIndex - 1];
            setCurrentChapter(prevStep.chapter);
            setCurrentTopic(prevStep.topic);
        }
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't navigate if user is currently editing content
            if (editingEl) return;

            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, editingEl]);

    // Global scroll-to-top on navigation change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentChapter, currentTopic]);

    const renderChapterContent = () => {
        // ── Page 1: What is a Low-Timer Pilot? ──────────────────────────────
        if (currentTopic === 'what-low-timer') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
                    {/* ── Page Header ── */}
                    <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                        <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                            CHAPTER 01 — UNDERSTANDING THE WHAT'S
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            What is a Low-Timer Pilot?
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '42rem', margin: '0 auto', fontWeight: 400 }}>
                            Upon earning your commercial license, you are immediately pushed into a new, unspoken classification. In this section, we define the true identity of the "Low-Timer." You will learn how the industry hourglass restricts your movement, the fierce competitive landscape of airline recruitment, and how this label dictates your immediate options.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>

                        {/* Hourglass Analysis Section */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '1rem' }}>
                            {/* Improved Image Container */}
                            <div style={{
                                width: '100%',
                                maxWidth: '100%',
                                margin: '0 auto 2.5rem auto',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.04)',
                                backgroundColor: '#fff',
                                position: 'relative'
                            }}>
                                <img src="/hourglass-pilot-gap.png" alt="Hourglass showing pilots filtering down" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE RESERVOIR
                            </div>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                Those who successfully navigate the restrictive "neck" of the hourglass reach the bottom—becoming part of the <strong>High-Timers</strong> segment. This lower reservoir represents the actual global pilot shortage aggressively reported by the media. The crucial takeaway is this: the industry does not have a general pilot shortage; it has a "ready-to-hire" shortage, driven entirely by the prohibitive barriers to entry at the midpoint.
                            </p>
                        </section>

                        {/* The Reality Section */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            {/* Candidates Image */}
                            <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc', marginBottom: '3rem', position: 'relative' }}>
                                <img src="/candidates-pilot-gap.png" alt="Different pilot candidates at an interview" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                            </div>

                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE REALITY
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Understanding Where You Stand
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                    When applying for your first airline role, it is critical to understand exactly who is sitting next to you in the waiting room. You are not just competing with other fresh graduates. You are positioned alongside seasoned military pilots molded by highly structured operational environments, and flight instructors who have already ground out their 1,500 hours.
                                </p>

                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                    As a 200-hour pilot with no category or type ratings, the harsh reality is that you are placed at the very bottom of the stack. Without verifiable data to prove your competency, you represent the highest operational risk to an employer.
                                </p>

                                <p style={{ color: '#0284c7', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                                    In relation to this fiercely competitive landscape, you must understand the "Pilot Paradox & Shortage"—the critical misalignment between the sheer volume of licenses held and the industry's actual operational demand. You will discover exactly what this paradox means, and the heavy impact it has on your career trajectory, on the next page.
                                </p>
                            </div>
                        </section>

                        {/* The Experience Gap Section */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE EXPERIENCE GAP
                            </div>

                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Multi-Crew Deficit
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '42rem' }}>
                                    To an airline recruiter or an insurance underwriter, being a Low-Timer means you have only mastered the sterile, predictable environment of a single-pilot training bubble. It means you inherently lack the advanced Crew Resource Management (CRM) and multi-crew experience required to manage a commercial flight deck under stress.
                                </p>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '42rem' }}>
                                    You are no longer judged on how well you execute a steep turn. You are judged on your perceived operational immaturity. You are legally certified to fly, but operationally, you are viewed as an unknown, un-standardized risk.
                                </p>
                            </div>

                            {/* Wingmentor Solutions Blended Card */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '3.5rem 2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                    <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        WINGMENTOR SOLUTIONS
                                    </div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>
                                        Bridging the Gap
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                        WingMentor exists to neutralize that risk. Through our Foundational Program, we move far beyond basic CRM theory; we systematically build and verify your operational maturity. We transition you out of the training bubble and align your capabilities with the industry's most advanced frameworks: Evidence-Based Training (EBT) and Competency-Based Training and Assessment (CBTA).
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* The Manufacturer vs Reality Section */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                A VISUAL SUMMARY
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Manufacturer's Promise vs. Industry Reality
                            </h2>

                            <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc', marginBottom: '2.5rem' }}>
                                <img src="/pilot-manufacturer-reality.png" alt="Comic showing manufacturer promise vs industry reality" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ textAlign: 'left', padding: '0 1rem' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '1.5rem' }}>
                                    This visual perfectly captures the conflicting messaging low-timer pilots experience when navigating the start of their career:
                                </p>
                                <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>Panel 1: The Manufacturer Booth —</strong> A low-timer pilot is enthusiastically assured by a sales representative that purchasing an expensive Type Rating fully qualifies them for an airline career. The manufacturer sells the dream, framing their specific program as the ultimate "golden ticket."
                                    </li>
                                    <li>
                                        <strong>Panel 2: The Industry Reality —</strong> The harsh awakening. The exact same pilot, holding their expensive new credentials, faces an "Industry Evaluation Panel" comprised of an Airline Recruiter, an Insurance Underwriter, and a Governing Body official enforcing the 1,500-hour rule. Despite the manufacturer's promises, the pilot is outright rejected—told forcefully by the regulators that until sheer flight hours or verified operational metrics are met, a rating does not override the barrier to entry.
                                    </li>
                                </ul>
                            </div>

                            {/* Airbus Insight Blended Card */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '3.5rem 2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                    <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        INDUSTRY INSIGHT
                                    </div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>
                                        A Perspective from Airbus
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                        In direct conversations with the Head of Training and Head of Flight Operations at Airbus, a striking reality emerged: from a purely technical capability standpoint, a low-timer undergoing a Type Rating performs on par with a veteran high-timer.
                                        <br /><br />
                                        However, as an aircraft manufacturer, Airbus cannot publicly override the system. Prohibitive constraints—such as the 1,500-hour rule, restrictive state regulations, and stringent airline insurance policies—exist completely outside their control. They build the aircraft and certify the training program; they cannot force an airline or an insurance underwriter to accept the liability of hiring you.
                                    </p>
                                </div>
                            </div>

                        </section>

                        {/* Identity Section */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE ANALYSIS
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                                The Industry Split
                            </h2>

                            <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc', marginBottom: '3rem' }}>
                                <img src="/low-timer-reality-presentation.png" alt="Recruitment Reality Image" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                            </div>


                            <div style={{ textAlign: 'left', padding: '0 1.5rem', marginBottom: '3.5rem' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '1.5rem' }}>
                                    This illustration captures "The Split"—the defining moment where a pilot's career path is bifurcated based purely on accumulated flight hours rather than actual operational potential:
                                </p>
                                <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>The Shortage (High-Timers) —</strong> Experienced pilots are aggressively pursued. They receive sign-on bonuses, immediate placements, and VIP treatment. The highly publicized "global pilot shortage" is localized almost entirely within this specific group.
                                    </li>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>The Purgatory (Low-Timers) —</strong> Despite holding the exact same commercial license, newly graduated pilots are diverted into a "250-hour purgatory." They are met with automated, standardized rejection, told to scan a QR code, and instructed to wait 8-12 months before even being considered.
                                    </li>
                                    <li>
                                        <strong>The Stigma —</strong> This separation is not just logistical; it is psychological. The split establishes a brutal "unknown vs. trusted" dynamic that low-timers are forced to navigate blindly at the very start of their professional journey.
                                    </li>
                                </ul>
                            </div>

                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                IDENTITY
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Industry Stigma
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                You passed your commercial checkride. You followed the syllabus perfectly and expected respect. Instead, the moment you graduated, the industry slapped you with a label: the "Low-Timer." It is not just a reflection of your logbook; it is a heavy industry stigma that immediately devalues your hard-earned license.
                            </p>

                            {/* Industry Hard Truth Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                    <div style={{ color: '#e11d48', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        HARD TRUTH
                                    </div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                                        The Recruitment Reality
                                    </h2>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                        The hard truth is that most of the industry simply does not want to entertain low-timer pilots. WingMentor has experienced this firsthand.
                                        <br /><br />
                                        We approached recruitment stalls presenting as typical 200-hour pilots to test the response. Without fail, the answer was uniform: "Scan the QR code and please move on." They tell you, "You know the requirement is 1,500 hours. Come back to us once you have that, and then we can talk."
                                        <br /><br />
                                        WingMentor has broken the silence barrier between the airline industry and the entry-level pilot. We are not just a support network; we operate as a verified database of pilots seeking answers, coordination, and clear expectations. We act as the direct bridge of communication between you and the industry, ensuring you have a voice, a structured pathway, and the professional recognition you deserve.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* The Insurance Factor Section */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc', marginBottom: '3rem' }}>
                                <img src="/insurance-reality.png" alt="Insurance Reality for Low Timers" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                            </div>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE INSURANCE FACTOR
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Financial Liability
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                An often-overlooked hurdle for low-time pilots is the insurance equation. Airlines and operators face exponentially higher premiums when placing an unverified 200-hour pilot in the right seat compared to a pre-qualified candidate with substantial experience. This stark difference in financial liability makes it overwhelmingly difficult for graduates to get a foot in the door, as operators naturally default to the lowest-risk option.
                            </p>

                            {/* Insurance Factor Blended Card */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '3.5rem 2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                    <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        WINGMENTOR INSIGHT
                                    </div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>
                                        Mitigating the Risk
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                        WingMentor is actively working to shift this paradigm by providing the exact data insurance firms and operators need to mitigate that risk.
                                        <br /><br />
                                        Because our pilots are rigorously vetted, continuously assessed, and fully familiarized with airline expectations, they represent a fundamentally lower liability. By tracking your performance, logging your mentorship experience, and structuring your evaluations through EBT frameworks, we transform you from an "unknown risk" into a verified, highly documented asset prior to employment.
                                    </p>
                                </div>
                            </div>

                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', marginTop: '3.5rem' }}>
                                IN CONTINUATION
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Connection
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                The profile of a Low-Timer is not an isolated issue; it is the direct symptom of the "Pilot Gap." These two forces are inextricably linked, forming the core of the current aviation recruitment crisis. Having defined who you are in the eyes of the industry, we must now deconstruct the structural chasm you are expected to cross—and how WingMentor provides the bridge.
                            </p>
                        </section>

                    </div>
                    <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '2rem', marginTop: '4rem' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '48rem', margin: '0 auto', width: '100%' }}>
                        <button onClick={handlePrev} style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            ← Back
                        </button>
                        <button
                            onClick={handleNext}
                            style={{ background: '#0284c7', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#0369a1')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#0284c7')}
                        >
                            Next →
                        </button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p style={{ color: '#0284c7', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                            Next, we will explore the <strong>Pilot Gap</strong>—the invisible wall that separates the classroom from the cockpit.
                        </p>
                    </div>
                </div>
            );
        } else if (currentTopic === 'pilot-risk-management') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
                    {/* ── Page Header ── */}
                    <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                        <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                            CHAPTER 01 — UNDERSTANDING THE WHAT'S
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            What is Pilot Risk Management?
                        </h1>

                        {/* ── New Header Image ── */}
                        <div style={{
                            width: '100%',
                            maxWidth: '56rem',
                            margin: '2rem auto 3rem auto',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(0,0,0,0.04)',
                            backgroundColor: '#fff'
                        }}>
                            <img src="/Gemini_Generated_Image_pl6llkpl6llkpl6l.png" alt="Pilot Risk Management Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>

                        {/* ── Visual Breakdown: The 3 Pillars ── */}
                        <div style={{ maxWidth: '52rem', margin: '0 auto 4rem auto', textAlign: 'left' }}>
                            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                                Pilot Risk Management is not just a safety protocol—it's a comprehensive framework for navigating the "game" of aviation. The illustration above encapsulates the three critical cards every pilot must play carefully to survive and thrive in this high-stakes industry:
                            </p>

                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <span style={{ color: '#2563eb', marginRight: '1rem', marginTop: '0.2rem', fontSize: '1.2rem' }}>•</span>
                                    <div>
                                        <strong style={{ color: '#0f172a', fontSize: '1.1rem', fontFamily: 'Georgia, serif' }}>Health Risk:</strong>
                                        <span style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, display: 'block', marginTop: '0.25rem' }}>
                                            Focuses on internal stressors—Sleep Loss, Heavy Workloads, and Relationship Strain. It maps the human factors that determine a pilot's career longevity and future certainty.
                                        </span>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <span style={{ color: '#2563eb', marginRight: '1rem', marginTop: '0.2rem', fontSize: '1.2rem' }}>•</span>
                                    <div>
                                        <strong style={{ color: '#0f172a', fontSize: '1.1rem', fontFamily: 'Georgia, serif' }}>Decision Making:</strong>
                                        <span style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, display: 'block', marginTop: '0.25rem' }}>
                                            Addresses the career gamble—Seniority lists, Debt Management, and the Industry Blindspots. It encourages pilots to make autonomous decisions rather than blindly following traditional paths.
                                        </span>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <span style={{ color: '#2563eb', marginRight: '1rem', marginTop: '0.2rem', fontSize: '1.2rem' }}>•</span>
                                    <div>
                                        <strong style={{ color: '#0f172a', fontSize: '1.1rem', fontFamily: 'Georgia, serif' }}>Financial Risk:</strong>
                                        <span style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, display: 'block', marginTop: '0.25rem' }}>
                                            The high-stakes investment landscape—Type Rating costs (A320/B737), the "Golden Handcuffs" of airline benefits, and the divide between safe vs. high-risk financial decisions in a volatile market.
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '48rem', margin: '0 auto', fontWeight: 400 }}>
                            In this section, we explore this critical framework in detail. We will analyze aviation investments from the distinct perspectives of bankers, casino managers, airline managers, and seasoned airline pilots to help you navigate the industry chasm safely and efficiently.
                        </p>

                        {/* Wingmentor Insight Card — PRM Core Definition */}
                        <div style={{ maxWidth: '52rem', margin: '3rem auto 0 auto', textAlign: 'center' }}>
                            <div style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: '24px',
                                padding: '3rem 2.5rem',
                                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                textAlign: 'left',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <img src="/logo.png" alt="WingMentor Logo" style={{ height: '72px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 1.5rem auto' }} />
                                <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
                                    WINGMENTOR INSIGHT
                                </div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    The Three Pillars of Risk
                                </h3>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                    <strong>Pilot Risk Management (PRM)</strong> is the proactive framework every pilot—from student pilots and flight instructors to seasoned airline pilots—must master.
                                    It is built on three core pillars: <strong>Financial Risk</strong>—understanding the true cost of training, debt, and return on investment before committing capital;
                                    <strong> Pilot Health</strong>—maintaining physical, mental, and situational airworthiness throughout your career; and
                                    <strong> Pilot Decision Making</strong>—developing the discipline to make sound, strategic career decisions under pressure, uncertainty, and industry volatility.
                                    <br /><br />
                                    Most pilots learn these lessons the hard way. Wingmentor exists to ensure you learn them before the cost becomes irreversible.
                                </p>
                            </div>
                        </div>

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                        {/* Pilot Health Risk Management Section Header */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                THE HUMAN ELEMENT
                            </div>
                            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                Pilot Health
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '48rem', margin: '0 auto', fontWeight: 400, textAlign: 'center' }}>
                                Navigating the Pilot Gap is as much a mental challenge as it is a professional one. In this section, we examine how to manage stress through this turbulent period. Many of us—our own founders included—have reached points of denial, feeling stressed that our dreams were shattered or blocked by an immovable wall. Compounded by investment risks, it is critical to focus on managing what you can. Do not overwork yourself into the ground. The constant grind often leads to mental fatigue or overexhaustion, leaving many pilots medically or mentally unfit for the flight deck when the opportunity finally arises.
                            </p>
                        </section>

                        {/* Pilot Fitness Section */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>PHYSICAL READINESS</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    Pilot Fitness: Being Airworthy
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_lkiqzllkiqzllkiq.png" alt="Pilot Fitness Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Being an airline pilot is not simply a career choice; it is a lifestyle. Just as an aircraft requires routine maintenance and rigorous checks to remain airworthy, you must maintain your own physical and mental airworthiness. This means learning how to live like a pilot long before you sit in the right seat.
                                </p>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Sleeping right, eating healthy, and exercising regularly are crucial factors. Building a habit of hitting the gym or maintaining physical activity ensures you are resilient against the physical demands of flying. But fitness must be balanced.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>THE SCIENCE OF SLEEP</h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        Studies universally show that exactly <strong>7 hours of high-quality sleep</strong> is optimal for human performance. Sleeping significantly more than this can leave you feeling laggy and slow (sleep inertia), while sleeping less critically reduces your cognitive ability, reaction time, and decision-making skills. When fatigue arises, you are no longer safe to fly.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Mental Health Industry Culture Section */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>MENTAL WELL-BEING</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    The Archaic Reality
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_4fglej4fglej4fgl.png" alt="Mental Fatigue Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem', color: '#334155' }}>
                                    However, there are several downsides as well, where the industry's archaic mental health culture truly strikes. This reality hits early—even during your initial training as a student. You will encounter the fatigue or "drained" factor. You may not feel physically tired, but performing repetitive, high-stakes maneuvers is intensely mentally draining. Your mindset becomes fixated; it shifts from "I want to do this" to "I <em>have</em> to do this."
                                </p>
                                <p style={{ marginBottom: '1.5rem', color: '#334155' }}>
                                    Yes, flying may be your passion. You may dream of flying long hauls or commanding jumbo jets. But to achieve that, you must sacrifice extensively—especially your time. Your life becomes concentrated purely on aviation. You must study endlessly for written exams, prepare for simulator sessions, execute cross-country flights, and pass grueling checkrides. Moreover, you must remain physically fit simply to obtain and retain your medical certificates, which are absolute requirements to fly.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>THE ULTIMATE TABOO</h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        Navigating mental fatigue is possibly one of the biggest taboos in aviation, as many international regulators have historically maintained an inflexible, outdated approach to pilot mental health and medical certification.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Stress Management Section */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>THE COGNITIVE CHALLENGE</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    Stress Management & Workload
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_nbhb1gnbhb1gnbhb.png" alt="Stress Management Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    When navigating the Pilot Gap, studying under immense pressure can actually degrade your ability to focus. Aviation psychology demonstrates that pilots operating under high stress are significantly less cognitively aware of their surroundings. This degradation in situational awareness is a primary catalyst for poor decision-making.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        THE SWISS CHEESE MODEL
                                    </h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        Accidents rarely happen from a single failure. The <strong>Swiss Cheese Model</strong> illustrates how danger arises when a series of small, seemingly insignificant errors align—like the holes in slices of Swiss cheese. A poor decision fueled by stress creates the first hole. Fatigue creates the next. If you do not manage your mental load, those holes align, and you slip straight through to an unrecoverable failure. This underscores the danger of letting stress dictate your thoughts or actions.
                                    </p>
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Recognizing and stopping this chain reaction is a foundational element of modern pilot training. In fact, <strong>Stress and Workload Management</strong> is strictly evaluated as a core competency within the Evidence-Based Training (EBT) and Competency-Based Training and Assessment (CBTA) frameworks utilized by airlines worldwide. Managing your mental capacity—especially when you are stretching your abilities—is not just good advice; it is a mandatory professional skill.
                                </p>
                            </div>
                        </section>

                        {/* Situational Awareness Section */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>KNOWING YOUR LIMITS</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    Situational Awareness In Health
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_trogq9trogq9trog.png" alt="Situational Awareness Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    One of the most disregarded aspects of overall well-being is situational awareness of your own body and mind. If you ever feel that something is wrong, or you are reluctant to fly due to an underlying health concern—even if it means being grounded for a month—it is always best to consult a private doctor or clinic for evaluation.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>THE SILENCE EPIDEMIC</h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        First and foremost is the fear within the industry: pilots are often afraid to seek therapy, or afraid to voice out that they are burnt out, drained, or stressed. Why? Because it can result in an immediate grounding and a thorough investigation of their medical certificates. In reality, this creates a deeply flawed system where pilots suffer in silence instead of seeking medical attention. This is the exact opposite of the "safety-first" culture the industry claims to want.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Relationships & Personal Life Section */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>THE PERSONAL COST</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    Relationships & Personal Life
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_nspqu6nspqu6nspq.png" alt="Relationships & Personal Life Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Your mental well-being is deeply intertwined with your personal life. Whether you are married, have a girlfriend, or are navigating a recent breakup, the state of your relationships will directly affect your performance and cognitive abilities on the flight deck. It is a harsh reality that many pilots experience firsthand.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>AVIATION INDUCED DIVORCE SYNDROME (AIDS)</h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        It is a macabre industry joke with a deeply serious undertone: the divorce rates among airline pilots are statistically high. You are continuously working, often missing special holidays, birthdays, and major life events. Being miles away from home for days or months at a time frequently leads to family conflict, particularly because you are absent exactly when your loved ones need you most.
                                    </p>
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    The paradox of the job is striking. The career is fantastic—you are earning far more than the average earner, capable of providing incredible financial support and deluxe items for your family. However, <strong>your physical presence is missing</strong>. Ultimately, no amount of financial compensation can replace what your partner or children will find lacking, which is quite simply, <em>you</em>.
                                </p>
                            </div>
                        </section>

                        {/* Unforeseen Health Indications Section */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>HIDDEN LONG-TERM RISKS</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    Unforeseen Health Indications
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_2xu5h52xu5h52xu5.png" alt="Unforeseen Health Indications Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Flight schools rigorously teach you about immediate physiological threats like hypoxia and spatial disorientation. However, they rarely teach you about the <strong>long-term health effects</strong> that an airline career inflicts upon the human body.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>INVISIBLE HAZARDS: RADIATION & THE ATMOSPHERE</h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        Commercial jets routinely fly at extremely high altitudes where the protective atmosphere is much thinner. This exposes pilots to substantially higher levels of cosmic radiation compared to the general public. While the aircraft fuselage and cockpit sunvisors can help lessen direct sunlight, they do not fully protect you. Radiation is invisible and omnidirectional, meaning standard shielding cannot block all of the airborne exposure you will accumulate over a 30-year flying career.
                                    </p>
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Beyond the atmosphere, there is the circadian burden. Constantly working across different time zones entirely disrupts your body's natural clock. Long-term studies have strongly associated this continuous disruption with severe metabolic and cardiovascular issues, which, in extreme cases of unmanaged health, can even lead to cardiac rupture.
                                </p>
                            </div>
                        </section>

                        {/* Pilot Health Summary */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '2rem', paddingTop: '3rem', borderTop: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                CHAPTER SUMMARY
                            </div>
                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem' }}>
                                What You Have Learned: Pilot Health
                            </h2>
                            <div style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: '24px',
                                padding: '3rem 2.5rem',
                                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                textAlign: 'left',
                            }}>
                                <img src="/logo.png" alt="WingMentor Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem', display: 'block', margin: '0 auto 1.5rem auto' }} />
                                <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
                                    WINGMENTOR INSIGHT
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    Your Most Important Asset is You
                                </h3>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                    Across this chapter, you have learned that a pilot's health is multi-dimensional. <strong>Physical fitness</strong> and the discipline of 7 hours of sleep keep you airworthy. <strong>Stress and workload management</strong> prevent the Swiss Cheese holes from aligning into disaster. <strong>Situational awareness of your own mind</strong> means breaking the silence epidemic before it grounds you permanently. <strong>Your relationships</strong> require active management alongside your career—the Aviation Induced Divorce Syndrome is real and preventable. And crucially, the <strong>unforeseen physical risks</strong> of radiation and circadian disruption must be monitored proactively throughout your entire career.
                                    <br /><br />
                                    The industry's greatest taboo is the pilot who suffers in silence. <strong>Wingmentor's foundation is built on the opposite — awareness, honesty, and sustainable performance.</strong>
                                </p>
                            </div>
                        </section>

                        {/* Pilot Decision Making Section Header */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '2rem', paddingTop: '4rem', borderTop: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                THE COMMAND MINDSET
                            </div>
                            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                Pilot Decision Making
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '48rem', margin: '0 auto', fontWeight: 400, textAlign: 'center' }}>
                                Every action inside the cockpit is a decision, and every decision carries weight. The same principle applies to your career. In this section, we explore how pilots think, how they assess risk in real-time, and how the habits you build today—whether in the sim, at your desk, or in your personal life—directly shape the quality of every command decision you will ever make.
                            </p>
                        </section>

                        {/* Pilot Decision Making - Perfectionism Trap */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>MINDSET & IDENTITY</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    The Perfectionism Trap
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_cw7bdkcw7bdkcw7b.png" alt="Perfectionism Trap Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Flight training is a series of highly consequential tests and checkrides. This fosters a climate of perfectionism where numerous pilots—even high-timers and well-experienced aviators—secretly feel as though their skills are still not good enough. This is widely known as <strong>Impostor Syndrome</strong>, and it is far more prevalent in aviation than the industry openly admits.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>SCHOOL VS. THE REAL WORLD</h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        Most flight schools teach you how to <em>pass</em> checkrides and written exams—not necessarily how to <em>be</em> a pilot in the real world. Many new pilots feel genuinely lost the first time they must navigate a complex international airport without an instructor beside them. The gap between training and reality is real, and it catches most pilots off guard.
                                    </p>
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Despite all of these challenges, the vast majority of pilots will still tell you it remains the best office in the world. The point, however, is that your eyes must open to the true lifestyle and reality of flying—<strong>prepared, not blindsided.</strong>
                                </p>
                            </div>
                        </section>
                        {/* Pilot Decision Making - The Seniority Gamble */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>CAREER STRUCTURE</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    The Seniority Gamble
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_a0rjm7a0rjm7a0rj.png" alt="Seniority Gamble Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Unlike almost any other profession, an airline pilot's entire career trajectory is governed by a single, ruthless mechanism: the <strong>seniority list</strong>. Your salary, your routes, your aircraft type, your roster quality—all of it is determined by your position on that list. And that list is extraordinarily fragile.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>START FROM ZERO — EVERY TIME</h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        If your airline goes bankrupt or another pandemic grounds the industry, you do not simply "get another job." You go straight to the <strong>bottom of the list</strong> at the next airline—regardless of your total experience, years, or ratings. Different airlines have different training standards and procedures. You must undergo costly conversion training all over again, and the bill lands on you.
                                    </p>
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    The waiting is its own trap. After applying to a new airline, you sit at home with no clear timeline—no idea when the call will come. Days turn into weeks, weeks into months. During this limbo, pilots risk losing momentum, letting their currency lapse, and watching their skills and knowledge quietly erode. In aviation, standing still is moving backward.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '16px',
                                    padding: '1.5rem 2rem',
                                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255,255,255,0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                                        "The seniority system creates a career that is fundamentally non-transferable. Understanding this from day one is not pessimism—it is the most important strategic decision you will ever make as a pilot."
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Pilot Decision Making - The Lost Decade */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>FINANCIAL REALITY</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    The Lost Decade: Debt vs. Pay
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_adg4jbadg4jbadg4.png" alt="Lost Decade Financials" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Flight schools sell the dream of a $300,000 captain's salary. What they rarely mention is what comes before it — the <strong>lost decade</strong>. The gap between the promise and the reality of early-career pay is one of the most financially dangerous decisions a young pilot can be underprepared for.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>THE NUMBERS NOBODY PUTS ON THE BROCHURE</h4>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                        You may graduate with upwards of <strong>$100,000 in training debt</strong>, only to earn between <strong>$30,000–$60,000 per year</strong> as a flight instructor or junior first officer for several years. Meanwhile, life doesn't pause: rent, utilities, groceries, insurance, taxes, and potentially a family to support all continue demanding payment — every single month.
                                    </p>
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Many schools offer a "study now, pay later" programme that sounds appealing on paper. But the reality is that once you graduate, accumulate hours, and finally land that airline position, the debt follows you in. Your early airline salary is simply not enough to service that loan comfortably while also covering living expenses. Your earnings lag behind your obligations for years.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '16px',
                                    padding: '1.5rem 2rem',
                                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255,255,255,0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                                        "The captain's salary is real. But the decade of financial sacrifice required to reach it is rarely advertised. A pilot who enters their career without a financial plan is not just broke — they are a decision-making risk waiting to happen inside the cockpit."
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Pilot Decision Making - The Industry Blind Spot */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>INDUSTRY AWARENESS</div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                    The Industry Blind Spot
                                </h3>
                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                    <img src="/Gemini_Generated_Image_tiw3pqtiw3pqtiw3.png" alt="Industry Blind Spot Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    From the outside, being a pilot looks everything a dream career should be—high paychecks, globe-trotting, and enviable airline perks. But these are only the external attractions. The internal reality of the industry is something the majority of student pilots never see coming.
                                </p>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Most student pilots are exclusively focused on the traditional pathway: enrol in flight school, build hours, obtain a type rating, get hired. What they have no visibility on is what happens next—or more critically, <strong>why so many never make it past that final step</strong>. After spending approximately $100,000 on training licenses and then another $50,000 on a type rating, a significant number of pilots still cannot get hired. The primary reason is the <strong>1,500-hour rule</strong>, a regulatory barrier that simply takes time and additional cost to clear.
                                </p>
                                <div style={{
                                    backgroundColor: '#f8fafc',
                                    borderLeft: '4px solid #475569',
                                    padding: '1.5rem',
                                    borderRadius: '0 8px 8px 0',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem', fontWeight: 600 }}>The Retirement Wave</h4>
                                    <p style={{ margin: 0, color: '#334155', fontSize: '1rem' }}>
                                        The industry simultaneously faces an accelerating retirement wave, most acutely felt across Europe and the United States. A large segment of the workforce belongs to the "baby boomer" generation, with pilots rapidly approaching the mandatory retirement age of 65. Every year, thousands of experienced captains leave their seats—creating massive vacancies that the training pipeline simply cannot fill quickly enough due to that same hour-barrier.
                                    </p>
                                </div>
                                <div style={{
                                    backgroundColor: '#fef2f2',
                                    borderLeft: '4px solid #ef4444',
                                    padding: '1.5rem',
                                    borderRadius: '0 8px 8px 0',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#991b1b', fontSize: '1.1rem', fontWeight: 600 }}>The COVID Fault Line</h4>
                                    <p style={{ margin: 0, color: '#7f1d1d', fontSize: '1rem' }}>
                                        COVID-19 did not just pause aviation — it broke parts of it permanently. Entire fleets were grounded, regional airlines filed for bankruptcy, and a large number of pilots took early retirement. Flight training stalled. When travel demand rebounded, the industry discovered it had nowhere near enough trained crew to meet it. The training system could not recover fast enough to replace those who had left.
                                    </p>
                                </div>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    The downstream effects continue today. Flight cancellations, route reductions, and understaffed regional carriers are all symptoms of this structural gap. Worse, major airlines routinely raid regional fleets to poach their most experienced pilots — leaving smaller carriers further depleted and forcing reductions in service to smaller and underserved communities.
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '16px',
                                    padding: '1.5rem 2rem',
                                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255,255,255,0.8)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                                        "The pilot shortage is real. But so is the blind spot. Most pilots only discover the gap after they've already invested everything. Wingmentor exists to illuminate this before it's too late to navigate."
                                    </p>
                                </div>
                            </div>
                        </section>


                        {/* Hidden Costs Section */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                THE FINANCIAL BARRIER
                            </div>
                            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                Financial Risk
                            </h1>
                            <div style={{ textAlign: 'left', maxWidth: '52rem', margin: '0 auto' }}>
                                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                    Before exploring the financial risks of aviation, it is crucial to first understand what a <strong>Type Rating</strong> is. While a Commercial Pilot License allows a pilot to fly for hire, a type rating is an advanced, aircraft-specific certification (such as an Airbus A320 or Boeing 737) required by aviation authorities. Historically, airlines paid for this training upon hiring a pilot. Today, the sheer volume of low-timer graduates has shifted this dynamic: many airlines now require pilots to securely hold a type rating <em>before</em> they even apply, completely shifting the financial burden onto the applicant's shoulders.
                                </p>
                                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                    This shift has exposed a massive vulnerability in <strong>investment knowledge</strong> among young aviators. The psychology of this financial commitment can be viewed through two contrasting perspectives: the <strong>Banker</strong> versus the <strong>Casino Manager</strong>.
                                </p>

                                {/* Embedded Banker vs Casino Section */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center', marginTop: '3rem', marginBottom: '3rem' }}>
                                    <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', backgroundColor: 'white', padding: '1rem' }}>
                                        <img src="/banker-vs-casino.png" alt="Banker vs Casino Manager Psychology" style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', width: '100%', marginTop: '1rem' }}>
                                        <section>
                                            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#0f172a', marginBottom: '1.5rem' }}>The Banker's Perspective</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
                                                <p>A banker looks for <strong>collateral</strong>, <strong>liquidity</strong>, and <strong>predictable growth</strong>. From this lens, a self-funded Type Rating is a "Toxic Asset":</p>
                                                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <li><strong>Non-Refundable:</strong> Once paid, the capital is gone forever. There is no "sell-back" option.</li>
                                                    <li><strong>Intangible:</strong> You aren't buying a house or a car; you're buying a piece of paper that only has value if an airline says it does.</li>
                                                    <li><strong>The Subscription Model:</strong> You don't keep it forever. If you leave the industry or fail to fly the aircraft type regularly, the rating expires. It's a lease on a skill, not ownership of an asset.</li>
                                                    <li><strong>No Appreciation:</strong> The rating doesn't grow in value. In fact, it only costs more to "renew" it every year if you aren't employed.</li>
                                                </ul>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#0f172a', marginBottom: '1.5rem' }}>The Casino Manager's View</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
                                                <p>The Casino Manager sees the Pilot Training industry as a high-stakes table. They love the "Side Bet" of a self-funded rating because:</p>
                                                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <li><strong>Asymmetric Risk:</strong> The pilot takes 100% of the financial risk. The "Casino" (the airline or agency) takes 0%.</li>
                                                    <li><strong>The "Near Miss" Effect:</strong> Pilots see others getting hired and think they are "due" for a win, leading them to stay in the game longer than they should.</li>
                                                    <li><strong>House Edge:</strong> The house always wins because even if the pilot isn't hired, the training center still gets paid for the rating.</li>
                                                </ul>
                                                <div style={{ padding: '1.5rem', backgroundColor: '#fff7ed', borderRadius: '16px', border: '1px solid #ffedd5', marginTop: '1rem' }}>
                                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#9a3412', fontWeight: 600 }}>
                                                        ⚠️ Are you investing or gambling? Without a job offer, a self-funded Type Rating is almost always a gamble.
                                                    </p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>
                                    Without a fundamental understanding of market demand, financial liquidity, and risk management, pilots often trap themselves in insurmountable debt with a rating they cannot legally use—a hand where the casino always wins.
                                </p>
                            </div>

                            {/* Financial Risk - The Instructor's Dilemma */}
                            <div style={{ textAlign: 'left', maxWidth: '52rem', margin: '3rem auto 0 auto' }}>
                                <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center', marginTop: '3rem' }}>THE INSTRUCTOR TRAP</div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        The Instructor's Dilemma
                                    </h3>
                                    <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2rem', position: 'relative' }}>
                                        <img src="/instructor-wrong-investment-pilot-gap.png" alt="Flight instructor stuck paying for Airbus rating" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                    </div>
                                    <p style={{ marginBottom: '1.5rem' }}>
                                        Even pilots who chose the <strong>traditional flight instructor route</strong> are not immune. Trapped in a holding pattern, some will burn their hard-earned cash on a Category 3 type rating (like an A320) out of pure frustration, hoping it will force an airline to notice them. Sadly, they remain stuck as instructors, now burdened with a heavy training loan and recurrent costs they can't afford.
                                    </p>
                                </div>
                            </div>

                            {/* Financial Risk - "Shiny Type Rating" Syndrome */}
                            <div style={{ textAlign: 'left', maxWidth: '52rem', margin: '3rem auto 0 auto' }}>
                                <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center', marginTop: '3rem' }}>THE SYNDROME</div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        "Shiny Type Rating" Syndrome
                                    </h3>
                                    <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2rem', position: 'relative' }}>
                                        <img src="/financial-drain-pilot-gap.jpg" alt="Cartoon showing the financial drain of type ratings" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                    </div>
                                    <p style={{ marginBottom: '1.5rem' }}>
                                        Trapped with no clear direction, many succumb to <strong>"Shiny Type Rating Syndrome."</strong> Out of frustration, they spend tens of thousands on complex ratings (A320 or ATR) <em>before</em> securing a job offer. Without line experience, this is often a catastrophic mistake—bleeding their remaining funds dry just as an airline might finally call.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div >

                    {/* The Aftermath Section */}
                    {/* Expectations vs Reality Section */}
                    <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '1rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            PERSPECTIVE
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                            Expectations vs. Reality
                        </h2>

                        <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '3rem', position: 'relative' }}>
                            <img src="/low-timer-expectation.png" alt="Pilot holding commercial license dreaming of a jet" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>

                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '2.5rem', textAlign: 'left' }}>
                            The journey often begins with towering expectations. Fresh out of flight school, clutching a newly printed Commercial Pilot License, the immediate dream is a fast-tracked leap into the right seat of a shiny corporate jet or major airliner.
                        </p>

                        <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '3rem', position: 'relative' }}>
                            <img src="/low-timer-reality.jpg" alt="Bankrupt pilot regretting buying a type rating" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>

                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '2.5rem', textAlign: 'left' }}>
                            However, reality quickly sets in. Desperate to bridge the massive experience gap and stand out from the immense stack of identical resumes, many pilots succumb to paying out-of-pocket for expensive, heavy jet type ratings without any guaranteed job offer attached. The aftermath is often devastating—wishing they had simply invested that money into building organic flight hours instead.
                        </p>
                    </section>




                    {/* PRM Section */}
                    <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '1rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            PILOT RISK MANAGEMENT (PRM)
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                            The Liquidity Trap
                        </h2>

                        <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '3rem', position: 'relative' }}>
                            <img src="/what-is-a-type-rating.png" alt="Be smart with your investments. You can cash out and sell a plane, but not a type rating." style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>

                        <div style={{ textAlign: 'left', color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                            <p style={{ marginBottom: '1.5rem' }}>
                                A core tenet of <strong>Pilot Risk Management (PRM)</strong> is understanding liquidity. As the image illustrates: <em>"Be smart with your investments. You can cash out and sell a plane, but not a type rating."</em>
                            </p>
                            <p style={{ marginBottom: '1.5rem' }}>
                                A pilot stands holding a massive scroll showing an <strong>"Airbus A320 Type Rating - Cost: $50,000"</strong>. Next to him sits a tangible light aircraft also worth $50,000. In a thought bubble, he remembers a devastating medical diagnosis requiring exactly that much money for treatment.
                            </p>
                            <p style={{ margin: 0, padding: '1.5rem', backgroundColor: '#fdf2f8', borderRadius: '12px', borderLeft: '4px solid #db2777', fontStyle: 'italic' }}>
                                The stark reality is that while an airplane is a tangible asset that can be sold to recover cash in a crisis, a Type Rating is purely experiential. Once that money is spent, it is gone forever. If your career stalls or life throws a curveball, you cannot liquidate a certification.
                            </p>
                        </div>
                    </section>
                    <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '2rem', marginTop: '4rem', width: '100%', maxWidth: '52rem', margin: '0 auto' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '48rem', margin: '0 auto', width: '100%' }}>
                        <button onClick={handlePrev} style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            ← Back
                        </button>
                        <button
                            onClick={handleNext}
                            style={{ background: '#0284c7', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#0369a1')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#0284c7')}
                        >
                            Next →
                        </button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p style={{ color: '#0284c7', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                            Beyond the rating, one must bypass the "insurmountable wall" of recruitment. Learn about the <strong>Pilot Recognition System</strong> on the next page.
                        </p>
                    </div>
                </div >
            );
        }

        // ── Page 2: What is the Pilot Gap? ──────────────────────────────────
        if (currentTopic === 'what-pilot-gap') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
                    {/* ── Page Header ── */}
                    <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                        <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                            CHAPTER 01 — UNDERSTANDING THE WHAT'S
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            What is the Pilot Gap?
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '48rem', margin: '0 auto', fontWeight: 400 }}>
                            An industry-wide crisis affecting pilots at every stage of their career—from students seeking direction and instructors looking to evolve, to airline pilots constrained by time. It is the invisible gap where talent and potential are lost, threatening the very foundation of the aviation industry.
                        </p>
                    </div>

                    {/* ── Main Hero Image ── */}
                    <div style={{ textAlign: 'center', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                        {/* Title above image */}
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            THE PILOT GAP
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0' }}>
                            A System Failing at Every Level
                        </h2>

                        {/* Image */}
                        <div style={{
                            width: '100%',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.10)',
                            border: '1px solid rgba(0,0,0,0.04)',
                            backgroundColor: '#fff',
                            position: 'relative',
                            marginBottom: '1.25rem'
                        }}>
                            <img
                                src="/the-pilot-gap.png"
                                alt="The Pilot Gap — A Massive Loss of Talent and Potential"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>

                        {/* Caption below image */}
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.6, margin: '0 auto 2rem auto', maxWidth: '680px', fontStyle: 'italic' }}>
                            The Pilot Gap is no longer just a "low-timer" issue — it affects all levels. Instructors looking to evolve, airline pilots constrained by schedules, and graduates desperate for direction all fall into this gap, resulting in a massive loss of talent and potential.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                        {/* Introductory Lead Text */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem' }}>
                            <div style={{ padding: '2rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', marginBottom: '3rem' }}>
                                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', lineHeight: 1.6, color: '#334155', margin: 0, textAlign: 'justify', marginBottom: '1.5rem' }}>
                                    This is <strong>'The Pilot Gap'</strong>. It is no longer just a "low-timer" issue—it affects all levels of the industry. <strong>Instructors</strong> looking to evolve and progress rather than remaining stagnant; <strong>airline pilots</strong> seeking recognition but constrained by flight schedules and lack of time to find opportunities; and <strong>student pilots/graduates</strong> desperate for direction and navigation through blocked entries, often mislabeled as inexperienced. Many fall into this gap, resulting in a massive loss of talent and potential. The industry is essentially collapsing at its base, right where the new generation is supposed to carry it forward.
                                </p>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', lineHeight: 1.7, color: '#475569', margin: 0, textAlign: 'justify' }}>
                                    Ultimately, the Pilot Gap is not a singular issue, but a complex combination of several factors we've discussed: The stigma of being a <strong>Low-Timer</strong>, the illusion of an immediate <strong>Pilot Shortage</strong> at all experience levels, and the brutal <strong>cause-and-effect of the current industry paradoxes</strong>. It is the friction point where massive pilot supply meets an insurmountable bottleneck of operational and insurance requirements.
                                </p>
                            </div>
                        </section>

                        {/* The Connection Bridge Section */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '1rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE LANDSCAPE
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Connection of Pilots to the Industry
                            </h2>

                            <div style={{
                                width: '100%',
                                maxWidth: '850px',
                                margin: '0 auto 2.5rem auto',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.04)',
                                backgroundColor: '#fff',
                                position: 'relative'
                            }}>
                                <img src="/universal-pilot-gap.jpg" alt="The Universal Pilot Gap: A Systemic Failure" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 1.5rem 0', textAlign: 'left' }}>
                                The relationship between pilots and the aviation industry has always been one of mutual dependency — yet today, it is fundamentally broken. Airlines require experience to hire, but offer no pathway to gain it. Pilots invest years and significant capital into their licences, only to arrive at an industry door that remains firmly shut. This is not a supply problem. It is a <strong>connection problem</strong>.
                            </p>
                            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, textAlign: 'left', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: '0.75rem' }}><strong>No Structured Pipeline:</strong> Unlike medicine or law, aviation has no formal cadet-to-career pipeline that guarantees progression. Each pilot must individually navigate a fragmented, often contradictory set of requirements with no authoritative guide.</li>
                                <li style={{ marginBottom: '0.75rem' }}><strong>Communication Silence:</strong> Airlines rarely communicate what they truly need beyond hour thresholds. Pilots are left interpreting vague recruitment criteria, leading to misaligned investments in ratings, courses, and training that carry no guaranteed return.</li>
                                <li style={{ marginBottom: '0.75rem' }}><strong>No Advocacy Layer:</strong> There is no industry body that actively represents the low-timer pilot to the airline or the insurer. Pilots enter the system as individuals, competing against institutional bias with no collective voice.</li>
                                <li><strong>The Wingmentor Bridge:</strong> This is precisely the gap Wingmentor was built to fill — acting as the structured layer of communication, advocacy, and preparation between pilots and the industry, ensuring no qualified pilot is left uninformed or unrepresented.</li>
                            </ul>
                        </section>
                    </div>


                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.8, marginBottom: '4rem' }}>


                        {/* The Experience Void Section */}
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            borderRadius: '24px',
                            padding: '3.5rem 2.5rem',
                            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            textAlign: 'center',
                            margin: '2rem 0 3rem 0',
                            boxSizing: 'border-box' as const
                        }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                RECAP: THE BROKEN BRIDGE
                            </div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', fontFamily: 'Georgia, serif', marginBottom: '2rem' }}>
                                The Experience Void
                            </h3>
                            <p style={{ fontSize: '1.2rem', fontFamily: 'Georgia, serif', color: '#2563eb', fontStyle: 'italic', margin: '0 auto 1rem auto', maxWidth: '40rem', textAlign: 'center' }}>
                                "The void between ability and opportunity."
                            </p>
                            <p style={{ fontSize: '1.05rem', color: '#2563eb', margin: '0 auto 1.5rem auto', maxWidth: '38rem', textAlign: 'center', lineHeight: 1.7 }}>
                                The Pilot Gap is the brutal, multi-year waiting period between earning a ~200-hour Commercial Pilot License and possessing the operational maturity that airlines demand.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', textAlign: 'center', maxWidth: '38rem' }}>
                                You are trapped in an industry Catch-22: you need a job to gain experience, but operators demand experience before giving you a job. This leaves newly licensed pilots fully qualified, yet commercially unemployable.
                            </p>
                        </div>

                        {/* Transition Header */}
                        <div style={{ textAlign: 'center', margin: '6rem 0 4rem 0', padding: '0 1rem' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                            <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                                THE BRIDGING THE GAP APPROACH
                            </div>
                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                Wingmentor's Approach Towards the Gap
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '48rem', margin: '0 auto', fontWeight: 400 }}>
                                Wingmentor acts as the structured bridge connecting pilots at every level to the aviation industry — stripping away the ambiguity and explicitly showing you the exact, targeted frameworks you need to cross the gap efficiently.
                            </p>
                        </div>

                        {/* Moved Program Context */}
                        <div style={{ maxWidth: '56rem', margin: '0 auto 3rem auto' }}>
                            {/* Section Image */}
                            <div style={{
                                width: '100%',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.04)',
                                backgroundColor: '#fff',
                                marginBottom: '2.5rem'
                            }}>
                                <img src="/wingmentor-approach-gap.png" alt="Bridging the Pilot Gap" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem', textAlign: 'left' }}>
                                    There is <strong>no such thing as "on-the-job training" for a commercial pilot</strong>—because the job <em>is</em> the training. You are expected to arrive ready. This is exactly where the <strong>Wingmentor Foundation Program</strong> steps in.
                                </p>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem', textAlign: 'left' }}>
                                    We build the critical, viable "pre-experience" skills that airlines require. This program isn't just theory; it is industry-recognized and accredited, with affirmation from <strong>Airbus</strong> and other major manufacturers to actively advise on current industry pathways. Here at Wingmentor, we will strip away the ambiguity and explicitly show you the exact, targeted operational hours and frameworks you need to cross the gap efficiently.
                                </p>
                                <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '12px', borderLeft: '4px solid #16a34a', textAlign: 'left' }}>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#166534', fontWeight: 500, lineHeight: 1.6 }}>
                                        By establishing a formalized pilot recognition system and strategic networking, we are solving the pilot gap at its core. Our mission is to fundamentally unclog the pilot pipeline—meaning current flight instructors will no longer be trapped at flight schools for five years, but instead will be recognized through our system, moving on to airlines and freeing up space for new instructors to enter the industry.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* The Wingmentor Foundation Program Section */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '1rem' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The 3 Core Segments of Industry Recognition
                            </h2>

                            {/* Section Image */}
                            <div style={{
                                width: '100%',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.04)',
                                backgroundColor: '#fff',
                                marginBottom: '2.5rem'
                            }}>
                                <img src="/wingmentor-3-segments.png" alt="Wingmentor 3 core segments approach" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 1.5rem 0', textAlign: 'left' }}>
                                To bridge the Pilot Gap, Wingmentor breaks its approach into <strong>3 core segments</strong> — each designed to build a verifiable, industry-recognized pilot profile that airlines and operators can act on:
                            </p>
                            <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 2rem 0', textAlign: 'left', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <strong>Pilot Recognition —</strong> A structured credentialing process that documents your Foundation Program attendance, mentoring hours, EBT &amp; CBTA core familiarity, knowledge exam results, and licensure outcomes. This recognition is submitted through an assessment pipeline and formally acknowledged by our airline partner network — including Air Asia, Singapore Airlines, and Cathay Pacific.
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <strong>Pilot Cognitive &amp; Workflow Assessment —</strong> A data-driven evaluation of your situational awareness, decision-making flow, and skills acquired during training. Presented as performance metrics — microaviation competency, workflow score, and skills gained — this gives airlines a quantified, standardized view of your readiness that goes far beyond a logbook hour count.
                                </li>
                                <li>
                                    <strong>Pilot Profile Examination —</strong> A consolidated digital profile that aggregates your certifications, flight data, and performance trends into a single, shareable record. This is the document that represents you to the industry — turning your raw experience into a professional, structured case for recognition.
                                </li>
                            </ul>

                            {/* Pilot Database Callout */}
                            <div style={{ padding: '2rem', backgroundColor: '#f0f9ff', borderRadius: '16px', border: '1px solid #bae6fd', margin: '2rem 0', textAlign: 'left' }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0369a1', marginBottom: '1.5rem' }}>The Wingmentor Pilot Database</h4>
                                <div style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    backgroundColor: '#fff',
                                    marginBottom: '1.5rem'
                                }}>
                                    <img src="/wingmentor-pilot-database.png" alt="Wingmentor Pilot Database Visualization" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <p style={{ color: '#0c4a6e', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                                    We handle and maintain a comprehensive <strong>database of pilots</strong>. Your profile in our database is not just a resume; it is a quantified record recognized through our <strong>Pilot Recognition System</strong>, making you visible to our network of industry partners who are looking for standardized excellence.
                                </p>
                            </div>
                        </section>

                        {/* Operational Briefing: Program Framework (Cont.) */}
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            borderRadius: '24px',
                            padding: '4rem 3rem',
                            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            textAlign: 'center',
                            width: '100%',
                            boxSizing: 'border-box',
                            marginBottom: '3rem'
                        }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                            <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                WINGMENTOR INSIGHT
                            </div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '-0.02em', borderBottom: '3px solid #eab308', paddingBottom: '0.5rem', display: 'inline-block' }}>
                                Operational Briefing: Program Framework (Cont.)
                            </h3>

                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem', textAlign: 'left' }}>
                                Building on our mission to bridge the Low Timer Gap, the Wingmentor Foundation Program is structured around core principles designed to foster genuine growth and verifiable expertise. We emphasize a proactive approach to career development, moving beyond passive hour-building to active skill refinement and strategic networking.
                            </p>

                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left' }}>
                                Core Principles of Engagement
                            </h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                                {[
                                    { title: 'Targeted Consultation', text: 'Focus on specific challenges identified in mentee debriefs.' },
                                    { title: 'Verifiable Progress', text: 'All mentorship interactions are meticulously logged and validated.' },
                                    { title: 'Skill Amplification', text: 'Transform theoretical knowledge into practical, command-ready experience.' },
                                    { title: 'Community & Ethics', text: 'Cultivate a supportive, professional, and compliant aviation network.' }
                                ].map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284c7', marginTop: '0.6rem', flexShrink: 0 }} />
                                        <p style={{ margin: 0, fontSize: '16px', color: '#475569', textAlign: 'left' }}>
                                            <strong style={{ color: '#0f172a' }}>{item.title}:</strong> {item.text}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(15, 23, 42, 0.1)', textAlign: 'left' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Mentor-Mentee Dynamics: A Synergistic Partnership
                                </h4>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                                    The relationship between mentor and mentee is a cornerstone of our program. Mentors gain invaluable leadership and communication skills through structured guidance, while mentees receive precise, peer-level support to navigate their training. This creates a powerful feedback loop where both parties accelerate their development, ensuring mutual benefit and contributing to a stronger, more resilient aviation community.
                                </p>
                            </div>
                        </div>

                        {/* Our Approach to Bridging the Gap */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3.5rem', textAlign: 'left', maxWidth: '48rem', margin: '3.5rem auto 0 auto' }}>
                            <div style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: '24px',
                                padding: '4rem 3rem',
                                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                textAlign: 'center',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    WINGMENTOR INSIGHT
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                                    Our Approach to Bridging the Gap
                                </h2>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                    Within the Wingmentor Foundation Program, you will experience real aviation industry expectations. We transform your thinking from a fresh graduate to a seasoned pilot, instilling real pilot ethics, mentor standards, and the foundational information to assess any situation.
                                    <br /><br />
                                    We guide you to be aware of aviation investments regarding your status as a pilot. We provide hands-on experience and one-to-one consultation, getting you ready for your next interview so you can say, "I've helped X amount of pilots with their IR, PPL, etc.," backed by documented and verified practical Crew Resource Management and mentor skills.
                                </p>
                            </div>
                        </div>

                        {/* Page Conclusion */}
                        <section style={{ textAlign: 'center', maxWidth: '48rem', margin: '4rem auto 0 auto' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE FINAL STEP
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Bridging the Knowledge Chasm
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                                You have learned the hard truth about the Pilot Gap and how Wingmentor is going to guide you through this gap. You will need to learn about <strong>Pilot Risk Management</strong> as the last core part of the "whats".
                            </p>
                        </section>
                    </div>

                    <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '2rem', marginTop: '4rem', width: '100%', maxWidth: '52rem', margin: '0 auto' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '48rem', margin: '0 auto', width: '100%' }}>
                        <button onClick={handlePrev} style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            ← Back
                        </button>
                        <button
                            onClick={handleNext}
                            style={{ background: '#0284c7', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#0369a1')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#0284c7')}
                        >
                            Next →
                        </button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p style={{ color: '#0284c7', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                            Next, we explore <strong>Pilot Risk Management</strong>—the final pillar of understanding the industry landscape.
                        </p>
                    </div>
                </div >
            );
        }

        // ── Page 3: The Pilot Shortage & Paradox ─────────────────────────────
        if (currentTopic === 'what-pilot-shortage') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
                    {/* ── Page Header ── */}
                    <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                        <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                            CHAPTER 01 — UNDERSTANDING THE WHAT'S
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            The Pilot Shortage & Paradox
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '42rem', margin: '0 auto', fontWeight: 400 }}>
                            Building on our profile of the 'Low Timer,' we must now confront the paradox that defines this stage of the journey. While global media headlines scream about a "Global Pilot Shortage," the reality for a 200-hour pilot is often one of silence and rejection. This gap between the industry's desperate need for crew and the individual pilot's struggle for a first job is the defining bottleneck of modern commercial aviation.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                        {/* 1. The Pilot Shortage in a Nutshell */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '1rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                THE PILOT SHORTAGE
                            </div>
                            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                Understanding the Shortage
                            </h1>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#475569', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                                In a Nutshell
                            </h2>

                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '3rem', position: 'relative' }}>
                                <img src="/hopeful-news-paradox.png" alt="Comic showing the pilot shortage in a nutshell" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ textAlign: 'left', color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    This visual perfectly captures the conflicting messaging low-timer pilots experience when navigating the start of their career:
                                </p>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyleType: 'none', color: '#475569', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <li style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '-1.5rem', color: '#0f172a' }}>•</span>
                                        <strong>Panel 1: The Hopeful News</strong> — Aspiring pilots are bombarded with media headlines projecting a need for hundreds of thousands of new pilots by 2030. This sells the dream of a "guaranteed ticket" to an airline flight deck immediately upon graduation.
                                    </li>
                                    <li style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '-1.5rem', color: '#0f172a' }}>•</span>
                                        <strong>Panel 2: The Reality</strong> — Four years later at the career fair, the demoralizing truth is revealed. While the "High-Timer Section (1,500+ Hours)" is wide open, the queue for the "Low-Timer Section (200–400 Hours)" stretches out the door. The industry was "specific" about their need—they just weren't specific about the barrier to entry.
                                        <div style={{ marginTop: '0.5rem', color: '#64748b', fontStyle: 'italic' }}>
                                            "The industry was 'specific' about their need—they just weren't specific about the barrier to entry."
                                        </div>
                                    </li>
                                </ul>
                            </div>


                        </section>

                        {/* The Illusion of the Shortage */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE ILLUSION
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Illusion of the Shortage
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, textAlign: 'left' }}>
                                The shortage is real, but the narrative is a paradox. There is no shortage of 250-hour commercial license holders. Operators are starving for crew, but they are desperate for qualified, operationally mature pilots—Captains and seasoned First Officers who can manage complex, unscripted scenarios without the oversight of a training environment.
                            </p>

                        </section>

                        {/* Experience Void & Pathways */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE RECRUITMENT REALITY
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Experience Void
                            </h2>

                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                <img src="/pilot-gap-pathways.png" alt="Aviation Career Pathways Illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ textAlign: 'left', padding: '0 1.5rem', marginBottom: '3.5rem' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '1.5rem' }}>
                                    This illustration captures the "Experience Void"—a structural gap where both the supply and demand ends of the industry have reached operational saturation:
                                </p>
                                <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>The Dual-Ended Rejection —</strong> A phase where both the airlines (the goal) and flight schools (the fallback) are effectively saying "No." This leaves qualified pilots in a career holding pattern, possessing licenses that the industry currently lacks the capacity to utilize.
                                    </li>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>Industry Fatigue —</strong> Recruiters and managers are overwhelmed by a "herd" of thousands sharing identical profiles. Consequently, they are no longer inclined to explain industry nuances or provide the individual career guidance that was once standard.
                                    </li>
                                    <li>
                                        <strong>The Automated Routine —</strong> Meaningful professional communication has been replaced by deferral systems. Instead of mentorship, candidates are met with standardized responses—"Scan the QR code and move on"—or placed on indefinite administrative holds that offer no actionable path forward.
                                    </li>
                                </ul>

                                {/* Wingmentor Insight Blended Card */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3.5rem', textAlign: 'left' }}>
                                    <div style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        borderRadius: '24px',
                                        padding: '3.5rem 2.5rem',
                                        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                        border: '1px solid rgba(255, 255, 255, 0.8)',
                                        textAlign: 'center',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    }}>
                                        <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                        <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                            INDUSTRY INSIGHT
                                        </div>
                                        <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>
                                            A Perspective from the Frontlines
                                        </h3>
                                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                            Wingmentor has experienced this exact reality firsthand. Our presence at the <strong>First Aviation Career Fair at Etihad Museum (January 21st)</strong> marked a pivotal moment in our journey—where Wingmentor evolved from a simple mentoring idea into a dedicated industry-gap solving movement.
                                            <br /><br />
                                            During this landmark event, we gained massive upfront reputation and received direct assurance and affirmation from industry giants, including <strong>Archer, AIRBUS, Etihad, Air Arabia, Fly Dubai, GCAA, Emirates Academy, and Fujairah Flight Academy</strong>.
                                            <br /><br />
                                            Through these high-level discussions—which included insights from the private jet industry, brokerage operators, and even influencers like <strong>@theAirportGuy</strong>—we secured a deep understanding of the industry's future. It confirmed that our mission to provide clear pathways, specialized programs, and professional recognition is exactly what the modern aviation landscape is starving for.
                                            <br /><br />
                                            What a pilot faces immediately after getting their commercial license is no longer a giant question mark. With Wingmentor, the 1,500-hour boundary—a hurdle set in 2013 that has caused massive structural backlash—is a challenge we are actively helping pilots navigate and overcome.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>


                        {/* Shifting the Bottleneck */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE SATURATION SHIFT
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Shifting the Bottleneck
                            </h2>

                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '3rem', position: 'relative' }}>
                                <img src="/saturation-shift-pilot-gap.jpg" alt="Aviation Career Fair showing pilots rejected from airlines and joining a massive backlog line for Flight Instructor Plan B" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                    The visual above illustrates the <strong>Industry Backlog</strong>. When "Plan A" (Airline Recruitment) turns away graduates for lacking 1,500 hours, the "herd" mass-pivots to "Plan B" (Flight Instruction). This doesn't solve the bottleneck—it simply moves it downstream, creating a saturated queue where pilots face waits of over two years instead of progressing their careers.
                                </p>
                            </div>
                        </section>

                        {/* The Pivot to Instruction */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE PIVOT
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Pivot to Instruction
                            </h2>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                    When the realization hits—that Plan A (Airlines) is currently impossible without hours—the mass of pilots executes a collective pivot to Plan B: Flight Instruction. They return to their own flight schools, not out of a passion for teaching, but out of necessity for flight hours.
                                </p>
                            </div>
                        </section>

                        {/* Saturation of Plan B */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE PARADOX
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Saturation of Plan B
                            </h2>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                    Consequently, flight schools become flooded with their own graduates clamoring for instructor positions. The competition for Plan B becomes just as fierce as Plan A. We now have a "Pilot Paradox": A massive supply of pilots, a massive demand for flight hours, but a bottleneck that prevents the flow of careers.
                                </p>
                            </div>


                        </section>



                        {/* The Instructor Bottleneck */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE FLIGHT SCHOOL QUEUE
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Instructor Bottleneck: Plan B Saturation
                            </h2>
                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem', position: 'relative' }}>
                                <img src="/instructor-bottleneck.png" alt="Illustration of the Instructor Bottleneck" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '2.5rem' }}>
                                    The dilemma extends beyond the airlines. The universally accepted 'Plan B' for low-timer pilots—becoming a Flight or Ground Instructor to build hours—has become as saturated as the airline market itself. This creates a secondary bottleneck, trapping pilots in a prolonged holding pattern.
                                </p>
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '2rem' }}>
                                    This illustration vividly captures the <strong>"Saturation Event"</strong> at flight academies. While the front door (left) continues to welcome new students with the promise of a dream, the back door (right) reveals a staggering reality: a massive queue of graduates—some waiting since 2015—competing for a single instructor position. With selection rates as low as <strong>1 out of 400</strong>, the 'Plan B' is no longer a guaranteed safety net, but a highly competitive bottleneck that leaves thousands stranded in an experience vacuum.
                                </p>
                            </div>
                        </section>

                        {/* Saturation Event */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE SATURATION EVENT: DATA ANALYSIS
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The 94% Consensus
                            </h2>

                            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '1.5rem' }}>
                                    Survey data reveals a staggering consensus: <strong>94%</strong> of students entering flight school list <strong>"Major Airline Pilot"</strong> as their primary career goal. This singularity of purpose creates a funnel effect. Thousands of individuals enter the pipeline with diverse backgrounds, yet they all emerge aiming for the exact same narrow exit.
                                </p>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '2rem' }}>
                                    Critically, <strong>74%</strong> of these students are completely unaware of the challenges awaiting them post-graduation. They do not know about the <strong>1500-hour hurdle</strong>, the <strong>insurance minimums</strong>, or the <strong>lack of entry-level turbine jobs</strong> until they have already spent their tuition.
                                </p>

                                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                                        We must be clear: This is not a failure of the education system or flight schools. These institutions excel at their mandate: producing licensed, safe aviators. Rather, this <strong>"Blind Spot"</strong> is a lack of shared knowledge regarding market realities.
                                    </p>
                                </div>

                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                    We are not pointing fingers at flight schools or anyone; we are providing vital information that should not be disregarded or turned away with blindness.
                                </p>
                            </div>
                        </section>

                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '2rem' }}>
                            <div style={{ textAlign: 'left', marginBottom: '2rem', padding: '2rem', backgroundColor: '#fafafa', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    THE BLIND INVESTMENT
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                    Pilots Without Family History in Aviation
                                </h3>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '1.5rem' }}>
                                    Furthermore, over <strong>80%</strong> of new pilots come from <strong>non-aviation backgrounds</strong>. They do not have family members in the industry to warn them of the cyclical nature of hiring or the "Gap". They invest blindly, trusting that their license will lead directly to a job. Without mentorship or industry foresight, they are walking into a <strong>saturation event</strong> completely unprotected.
                                </p>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                    For those without aviation lineage, the path is often navigated blind. You are sold a dream by flight schools that rely on your tuition, but the post-graduation reality is omitted. This leads to the <strong>Saturation Loop</strong>: where unhired graduates return to schools as instructors, saturating the only entry-level job market available.
                                </p>
                            </div>
                        </section>

                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ textAlign: 'left', marginBottom: '2rem', backgroundColor: '#fafafa', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #b91c1c' }}>
                                <div style={{ color: '#b91c1c', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    DATA INSIGHT
                                </div>
                                <h3 style={{ color: '#b91c1c', fontSize: '1.4rem', fontWeight: 400, marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                    A Decade-Long Queue: Real-World Data
                                </h3>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                                    Data from a credible administrative source within a major flight school reveals a startling reality (identities withheld for legal protection): a prospective instructor faces a minimum two-year waiting list. The backlog contains over 2,000 applicants. More shockingly, pilots from batches as far back as 2015 are still returning to apply, creating a queue that is nearly a decade long.
                                </p>
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    THE CRISIS
                                </div>
                                <h3 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: 400, marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                    The Implication: A Career Holding Pattern
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                        This is not a temporary delay; it is a systemic crisis. The 'safe' fallback option is no longer viable for the vast majority. Without a strategic alternative, pilots are left with expired ratings, diminished skills, and a dream that fades on an endless waiting list. The system forces you into a holding pattern with no clearance in sight.
                                    </p>
                                    <p style={{ color: '#0284c7', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                                        To navigate these systemic obstacles, you will learn more about PRM (What is Pilot Risk Management) within this chapter of The What's.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* WingMentor Insight Card: Untying the Knot */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>

                            {/* WingMentor Insight Card */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                    <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        WINGMENTOR INSIGHT
                                    </div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>
                                        Untying the Knot
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                                        The aviation industry is moving at a pace where it simply doesn't have the time or resources to focus on individual low-timer navigation. This creates the "knot" of confusion you see today.
                                        <br /><br />
                                        <strong>Our solution is to provide the missing infrastructure:</strong> clear pathways, structured programs, coordinated applications, and robust pilot recognition systems. We untie this mess by providing the industry with pre-vetted, high-quality candidates, while providing you with the roadmap to bypass the chasm.
                                    </p>
                                </div>
                            </div>
                        </section>
                        {/* The Economic Trap */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                THE ECONOMIC TRAP: PILOT DEBT SPIRAL
                            </div>
                            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                Understanding the Paradox
                            </h1>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#475569', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Promising the Aviation Dream
                            </h2>

                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '3rem', position: 'relative' }}>
                                <img src="/pilot-economic-cycle.png" alt="Drawing showing the Pilot Economic Cycle" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    WAITING FOR CLEARANCE
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                    The Endless Hold
                                </h3>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '3rem' }}>
                                    The system operates as a closed loop. Pilots graduate into a saturated market and become instructors, relying on teaching new students to build their own required flight hours. This structural paradox forces pilots into a prolonged career holding pattern, dependent on new entrants just to survive the wait for an airline placement.
                                </p>

                                <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        THE ILLUSION OF INVESTMENT
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                        The Illusion of Investment vs. True Return
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, marginBottom: '1.5rem' }}>
                                        For many aspiring pilots, the journey is not just about mastering skills but also navigating a treacherous financial landscape. The promise of an airline career often leads to significant investment in licenses, ratings, and even speculative type ratings, sometimes without a guaranteed return. This section dissects the financial pitfalls and how they can lead to an 'Economic Trap' – a cycle of debt and diminished opportunity.
                                    </p>
                                </div>

                                <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        THE PONZI EFFECT
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                        The Ponzi Scheme Effect
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                        This misalignment creates what we call the <strong>Instructor Loop</strong>. Current instructors will blindly point you toward their own path: the "traditional" instructor route. But many of those same instructors are now realizing they are trapped, facing upwards of five years instructing before airlines even glance at their CVs. In reality, some argue the flight instructor route has structurally become akin to a <strong>ponzi scheme</strong>—constantly promising returns to new investors (low-timers needing hours) funded by the time and money of older investors who also had the exact same dream of reaching the airlines. This is no longer a viable modern pathway.
                                    </p>
                                </div>

                                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '3rem', position: 'relative' }}>
                                    <img src="/dream-paradox-pilot-gap.png" alt="Comic showing the pilot dream paradox" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>

                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'left' }}>
                                    THE DREAM PARADOX
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'left' }}>
                                    Perpetuating the Cycle
                                </h2>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1rem', textAlign: 'left' }}>
                                    The <strong>Pilot Dream Paradox</strong> illustrates the harsh reality of the current training ecosystem. Most flight instructors never set out to teach; they became instructors simply because it was the only readily available way to build the flight hours required by airlines. They entered the system with the exact same dream of flying jets that their new students currently hold.
                                </p>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left', marginBottom: '3rem' }}>
                                    To keep the flight schools running and to continue building their own necessary hours, these instructors must sell the same "airline pilot dream" to the next wave of incoming students. This creates a self-sustaining cycle where students become instructors to teach new students, while the queue for actual airline placements grows longer and wait times continually extend. The paradox is that the very system designed to train airline pilots often ends up just training more flight instructors.
                                </p>
                            </div>





                        </section>


                        {/* Conclusion */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '5rem', marginBottom: '3rem' }}>
                            <div style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: '24px',
                                padding: '4rem 3rem',
                                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                textAlign: 'center',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    CONCLUSION
                                </div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>
                                    Now You See the Bigger Picture
                                </h3>

                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.15rem', fontWeight: 400, color: '#475569', marginBottom: '0.5rem', fontFamily: 'Georgia, serif', fontStyle: 'italic', textAlign: 'center' }}>
                                        The industry is not broken. It is simply operating in a way no one bothered to explain to you — until now.
                                    </h2>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                        What you have just navigated through is not a collection of isolated problems. It is a single, interconnected system — one that Wingmentor has experienced and studied first-hand. The shortage is real, but its causes are layered. On one side, the structural factors: a lack of guidance, the absence of credible mentorship, and a market so saturated by Plan B that the fallback has itself become the bottleneck.
                                    </p>

                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                        On the other side lie the paradoxes — the silent forces that quietly sustain the crisis. The <strong>Pilot Dream Paradox</strong> reveals how the very instructors you turn to for guidance are navigating the same holding pattern you are. They are not withholding the truth to deceive you; they are constrained by their own circumstances. An instructor trapped in a five-year queue cannot afford to tell you the system has failed him too. All he can do is tell you to keep your licences current, start somewhere, and whatever you do — do not walk away. Not because that is bad advice, but because it is the only honest advice he has left.
                                    </p>

                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                        Then there is the culture of silence within the pilot community itself. When a first-year student walks up to a third-year commercial flying student, what he often receives is not guidance — it is ego. It is deflection. It is the industry’s unspoken rule that you figure it out yourself or you do not belong. No transparency. No honest conversation about what this career actually looks like beyond the uniform.
                                    </p>

                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                        <strong>This is where we break the silence.</strong> Wingmentor was built to throw the ego away and speak to you with brutal, unfiltered honesty about what is really happening inside this industry. Because here is the hard truth: if a pilot does not understand the industry he is entering — its economic cycles, its structural realities, its paradoxes — he will not be equipped to navigate a job application, a flight operator conversation, or the demands of the flight deck itself. Understanding your industry is not optional. It is foundational.
                                    </p>

                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                        You now understand the shortage. You understand the paradoxes that drive it. You understand why guidance has been so hard to find, and why the silence has gone on for so long. That knowledge is your first real instrument. Use it.
                                    </p>

                                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(15, 23, 42, 0.1)', textAlign: 'center' }}>
                                        <p style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 600, margin: 0, fontFamily: 'Georgia, serif' }}>
                                            Benjamin Tiger Bowler & Karl Brian Vogt
                                        </p>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Founders, Wingmentor
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section style={{ textAlign: 'center', maxWidth: '52rem', marginTop: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                OUR MISSION
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Unclogging the Pipes
                            </h2>

                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2rem', position: 'relative' }}>
                                <img src="/unclogging-pipes-pilot-gap.png" alt="Cartoon illustrating the clogged pipeline of flight instructors" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                    The reality of the current flight instruction pipeline: thousands of highly qualified pilots are stuck waiting for the airline hiring gates to open, creating a massive holding pattern that obstructs the entire flow of new entrants.
                                </p>
                            </div>

                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2rem', position: 'relative' }}>
                                <img src="/unclogging-pipes-pilot-gap-2.png" alt="Cartoon illustrating the unclogged pipeline of flight instructors through Wingmentor Pilot Recognition" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                                    Through the Wingmentor Pilot Recognition program, these highly qualified instructors are recognized, validated, and ushered through the correct channels to Airline Flight Decks, opening up the gates and clearing the backlog—allowing new pilots to access these entry-level instructional positions.
                                </p>
                            </div>

                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                                At <strong>Wingmentor</strong>, we are dedicated to <strong>unclogging these pipes</strong>. Our mission is to provide the standardization and recognition required to move these veteran instructors into airline flight decks where they belong. By facilitating this transition, we free up critical instructor positions, allowing the new generation to enter the industry and start their journey, rather than being stalled at the starting line.
                            </p>
                        </section>


                    </div >

                    <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '2rem', marginTop: '4rem', width: '100%', maxWidth: '52rem', margin: '0 auto' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6rem' }}>
                        <button onClick={handlePrev} style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            ← Back
                        </button>
                        <button
                            onClick={handleNext}
                            style={{ background: '#0284c7', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#0369a1')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#0284c7')}
                        >
                            Next →
                        </button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p style={{ color: '#0284c7', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                            Next, we will define <strong>What is a Low-Timer Pilot</strong>—and explore how this paradox directly creates the low-timer label.
                        </p>
                    </div>
                </div >
            );
        }

        // ── Page 4: What is Pilot Recognition? ──────────────────────────────
        if (currentTopic === 'what-pilot-recognition') {
            return (
                <div style={{ maxWidth: '56rem', margin: '0 auto', paddingTop: '3rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', animation: 'fadeIn 0.4s ease-in-out' }}>
                    {/* Centered logo + header block */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                            Chapter 01 — Understanding the What's
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 400, color: '#0f172a', marginBottom: '0', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                            What is Pilot Recognition?
                        </h1>
                    </div>

                    <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '1rem' }}>
                        <img src="/recogntion.png" alt="Pilot Recognition — Wingmentor Foundation Program" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', margin: '0 0 3rem 0', lineHeight: 1.5 }}>
                        A recognized pilot completing a standardized multi-crew assessment — the foundation of airline-level readiness.
                    </p>

                    <div style={{ color: '#475569', fontSize: '17px', lineHeight: 1.85, marginBottom: '4rem' }}>
                        <p style={{ margin: '0 0 1.5rem 0' }}>
                            Every year, thousands of newly licensed pilots enter the job market with near-identical profiles — same flight hours, same certificates, same lack of verifiable multi-crew experience. To an airline recruiter sifting through this wall of applications, one 200-hour resume looks exactly like the next. <strong>Pilot Recognition</strong> exists to break that cycle. It is the mechanism that separates a pilot who simply holds a license from a pilot whose operational competency has been independently measured, standardized, and verified.
                        </p>
                        <p style={{ margin: 0 }}>
                            At its core, Pilot Recognition is about proving two things airlines care about most: <strong>standardized multi-crew proficiency</strong> and <strong>advanced behavioral competencies (NOTECHS)</strong> — not through self-reported logbook entries, but through a structured evaluation that airlines can immediately trust. Without it, you remain a high-risk unknown in a crowded field. With recognition — upheld and verified through the Wingmentor Foundation Program — you transform into a quantified, credible candidate already aligned with the standards required for type rating induction and airline line training.
                        </p>
                    </div>


                    {/* Beyond the Blind Submit Section */}
                    <div style={{ marginTop: '1rem', marginBottom: '2rem', color: '#475569', fontSize: '17px', lineHeight: 1.75 }}>

                        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE BLIND APPLICATION TRAP
                            </div>
                            <h4 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>
                                The Blind Application Trap
                            </h4>
                            <img
                                src="/pilotcenter.png"
                                alt="Pilot Center — blind resume submission"
                                style={{ width: '100%', height: 'auto', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', marginBottom: '1.75rem', display: 'block' }}
                            />
                            <p style={{ marginBottom: '1.5rem' }}>
                                Majority of pilots send resumes blindly to airlines or upload them to sites like <em>pilotcenter.com</em>. While you may technically meet the basic requirements, the "Next Step"—the follow-up response—is where most careers stall.
                            </p>
                        </div>

                        <div style={{ marginTop: '2.5rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                BEYOND THE BLIND SUBMIT
                            </div>
                            <h4 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>
                                Beyond the "Blind Submit"
                            </h4>
                            <img
                                src="/staffingimg.png"
                                alt="Pilot Staffing & Recruitment"
                                style={{ width: '100%', height: 'auto', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', marginBottom: '2rem', display: 'block' }}
                            />
                            <p style={{ marginBottom: '1.5rem' }}>
                                Look at this from the airline's perspective: every year, thousands of newly-minted low-timer pilots graduate globally and immediately begin sending their 200-hour resumes blindly to every carrier they can find. The sheer volume of applications creates an insurmountable administrative wall for internal HR departments.
                            </p>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Airlines simply do not have the manpower to sift through thousands of identical 200-hour resumes to find the diamond in the rough. Because of this overwhelming influx, the vast majority of airlines completely ignore direct applications and instead fully outsource their low-timer recruitment to specialized airline staffing and recruitment companies to act as aggressive filters. If you aren't going through these specific agencies, your resume is likely going straight into the bin.
                            </p>

                            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: '0 8px 32px rgba(15,23,42,0.04)', border: '1px solid rgba(255,255,255,0.8)', marginTop: '2rem' }}>
                                {/* Logo + header */}
                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '160px', height: 'auto', objectFit: 'contain', marginBottom: '1.25rem' }} />
                                    <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                        WINGMENTOR INSIGHT
                                    </div>
                                    <h5 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '0.5rem' }}>
                                        Direct Industry Connections
                                    </h5>
                                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '30rem', margin: '0 auto' }}>
                                        How Wingmentor connects you directly to airline decision-makers and recruitment pipelines.
                                    </p>
                                </div>

                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                    Wingmentor provides a <strong>direct network</strong> of pilots who already know the specific expectations of major carriers like <strong>Etihad</strong>, <strong>Air Asia</strong>, or <strong>Eurowings</strong>, as well as the private sector, including <strong>private jets</strong>. We give you the opportunity to choose a pathway and familiarize yourself with the industry before you even step into the interview room.
                                </p>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                    Wingmentor maintains direct, active contact with the decision-makers shaping the future of flight:
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0f172a', fontWeight: 500, fontSize: '1.05rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
                                        Etihad Cadet Program
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0f172a', fontWeight: 500, fontSize: '1.05rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
                                        Head of Training at Airbus
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0f172a', fontWeight: 500, fontSize: '1.05rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
                                        Head of Infrastructure at Archer (Pioneering Pilot Air Taxis)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ── Examination & Assessments ── */}
                    <div style={{ marginTop: '3rem', marginBottom: '2rem', paddingTop: '3rem', borderTop: '1px solid #e2e8f0' }}>

                        {/* Section header */}
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            EXAMINATION &amp; ASSESSMENTS
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                            How Recognition Is Formally Validated
                        </h2>
                        <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2rem' }}>
                            <img src="/theintervew.png" alt="Examination & Assessments — How Recognition Is Formally Validated" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                            Pilot Recognition is not a self-declared credential. It is earned through a structured assessment pipeline that verifies your competencies against internationally recognised aviation standards. Below are the key examination and assessment pathways that form part of the Wingmentor Recognition framework.
                        </p>

                        {/* Airbus Recognition Interview Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 8px 28px rgba(0,0,0,0.05)',
                            overflow: 'hidden',
                            marginBottom: '2rem',
                        }}>
                            {/* Card header bar */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
                                padding: '1.75rem 2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                            }}>

                                <div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                                        ASSESSMENT TYPE 01
                                    </div>
                                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400, color: '#fff', margin: 0 }}>
                                        Airbus Recognition Interview
                                    </h3>
                                </div>
                            </div>

                            {/* Card body */}
                            <div style={{ padding: '2rem', color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <p style={{ margin: 0 }}>
                                    The <strong>Airbus Recognition Interview</strong> is a structured competency assessment conducted in collaboration with Wingmentor's industry contacts at Airbus — including the <strong>Head of Training at Airbus</strong>. It is designed to evaluate a low-timer pilot's readiness, situational awareness, and behavioral competencies against the operational standards expected by major aircraft manufacturers and their airline partners.
                                </p>
                                <p style={{ margin: 0 }}>
                                    Unlike a standard job interview, the Airbus Recognition Interview is not a hiring test — it is a <strong>recognition event</strong>. Its outcome is fed directly into your Pilot Recognition profile and reflected in your ATLAS CV, providing a manufacturer-level endorsement of your competency baseline that carries significant weight with airline recruitment pipelines.
                                </p>

                                {/* What it assesses */}
                                <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                                        What the Interview Assesses
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        {[
                                            { icon: '🧠', text: 'NOTECHS Behavioural Competencies' },
                                            { icon: '🗣️', text: 'Communication & Crew Resource Management' },
                                            { icon: '📐', text: 'EBT & CBTA Core Familiarity' },
                                            { icon: '🎯', text: 'Situational Awareness & Decision Making' },
                                            { icon: '📋', text: 'Industry & Regulatory Knowledge' },
                                            { icon: '✅', text: 'Professionalism & Readiness Standard' },
                                        ].map(({ icon, text }) => (
                                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#334155', fontSize: '0.95rem' }}>
                                                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                                                <span>{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Insight callout */}
                                <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 500 }}>
                                        <strong>Why this matters:</strong> A manufacturer-level recognition signal on your ATLAS CV transforms your profile from an anonymous low-timer into a vetted candidate — one that airline recruitment agencies have a specific reason to escalate rather than filter out.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Foundation Program Alignment */}
                        <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                FOUNDATION PROGRAM ALIGNMENT
                            </div>
                            <h4 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>
                                Building Towards the 9 Core Competencies
                            </h4>
                            <p style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.85 }}>
                                Everything you encounter within the Wingmentor Foundation Program — <strong>leadership skills</strong>, <strong>problem-solving</strong>, <strong>assessment and cognitive development</strong>, <strong>behaviorism</strong>, and <strong>constructivism</strong> — is deliberately designed to align with the <strong>9 Core Competencies</strong> recognized by ICAO and adopted by airlines worldwide. These competencies form the universal standard against which every commercial pilot is ultimately measured.
                            </p>
                            <p style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.85 }}>
                                However, it is important to understand the scope of this program: within the <strong>Foundation Program</strong>, you will be limited to the <em>foundational knowledge base</em> of these 9 Core Competencies. You are not expected to master them here — you are expected to <strong>build the groundwork</strong>. The concepts, frameworks, and behavioral awareness introduced at this stage are the building blocks that will prepare you for what comes next.
                            </p>
                            <p style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.85 }}>
                                When you become eligible for the <strong>Transition Program</strong>, that is when you will be formally introduced to the full depth and application of the 9 Core Competencies. The Foundation Program exists to ensure that, by the time you reach that stage, you already possess the foundational understanding and mindset required to exceed — not merely meet — the competency standards expected of you.
                            </p>

                            {/* Competency alignment visual */}
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 32px rgba(15,23,42,0.04)', border: '1px solid rgba(255,255,255,0.8)', marginTop: '2rem' }}>
                                <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    How Foundation Skills Map to the 9 Core Competencies
                                </h5>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                    {[
                                        { skill: 'Leadership Skills', competency: 'Leadership & Teamwork', icon: '👨‍✈️' },
                                        { skill: 'Problem Solving', competency: 'Problem Solving & Decision Making', icon: '🧩' },
                                        { skill: 'Assessment & Cognitive', competency: 'Situational Awareness & Knowledge', icon: '🧠' },
                                        { skill: 'Behaviorism', competency: 'Communication & Workload Management', icon: '🔄' },
                                        { skill: 'Constructivism', competency: 'Application of Procedures & Flight Path Management', icon: '🏗️' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{item.skill}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>→ {item.competency}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Foundation vs Transition callout */}
                            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#fefce8', borderRadius: '12px', borderLeft: '4px solid #eab308', marginTop: '2rem' }}>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#854d0e', fontWeight: 500 }}>
                                    <strong>Remember:</strong> The Foundation Program builds the base. The Transition Program introduces the full 9 Core Competencies. What you learn here is not the end — it is the launchpad designed to ensure you exceed the standard, not just meet it.
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
                                ℹ️ <em>Additional examination and assessment pathways will be introduced in later modules of the Foundation Program.</em>
                            </p>
                        </div>
                    </div>

                    {/* ── WingMentor Pilot Recognition ── */}
                    <div style={{ marginTop: '5rem', paddingTop: '4rem', borderTop: '2px solid #e2e8f0', marginBottom: '2rem' }}>

                        {/* Section header */}
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                                Chapter 01 — Understanding the What's
                            </div>
                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                                WingMentor Pilot Recognition
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '36rem', margin: '0 auto' }}>
                                A collaborative database that doesn't just store profiles — it opens doors, builds relationships, and redefines how the aviation industry discovers its next generation of pilots.
                            </p>
                        </div>

                        <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem' }}>
                            <img src="/dadawdwa.png" alt="WingMentor Pilot Recognition" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>

                        {/* Intro paragraphs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.85, marginBottom: '3rem' }}>
                            <p style={{ margin: 0 }}>
                                At the heart of Wingmentor lies a simple but powerful idea: <strong>the more pilots we recognise, the stronger every pilot's position becomes</strong>. The Wingmentor Pilot Recognition database is not just a list of names — it is a living, growing ecosystem of vetted, qualified aviation professionals. Every pilot who completes the program and earns recognition strengthens the collective credibility of the entire database, creating a network effect that benefits everyone within it.
                            </p>
                            <p style={{ margin: 0 }}>
                                This is a collaborative model. As the database expands, so does Wingmentor's ability to advocate on behalf of its pilots — approaching airlines, manufacturers, private operators, and aviation organisations with a credible, data-backed proposition that no individual pilot could achieve alone.
                            </p>
                        </div>

                        {/* Subtopic: The Power of Scale */}
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE POWER OF SCALE
                            </div>
                            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem' }}>
                                A Larger Database Opens Larger Doors
                            </h3>


                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2rem' }}>
                                <img src="/databases.png" alt="A Larger Database Opens Larger Doors" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.85 }}>
                                <p style={{ margin: 0 }}>
                                    Imagine a scenario where Wingmentor has a database of 500, 1,000, or even 5,000 recognised pilots — each one vetted, each one verified through the Foundation Program. That scale transforms the conversation entirely. Instead of a single pilot cold-emailing <strong>Gulfstream</strong> or <strong>Learjet</strong> asking "What do you look for?", Wingmentor can approach these organisations directly on behalf of the entire pilot community, with the weight and credibility of a structured program behind it.
                                </p>
                                <p style={{ margin: 0 }}>
                                    The larger the database grows, the more leverage Wingmentor carries. What starts as a recognition program evolves into an <strong>industry-recognised talent pipeline</strong> — one that operators actively want to be connected to, because it solves their recruitment problem at scale.
                                </p>
                            </div>
                        </div>

                        {/* Subtopic: Asking the Questions Pilots Want Answered */}
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                DIRECT INDUSTRY DIALOGUE
                            </div>
                            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem' }}>
                                Asking the Questions Pilots Want Answered
                            </h3>


                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2rem' }}>
                                <img src="/inquiry.png" alt="Asking the Questions Pilots Want Answered" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            {/* Image breakdown */}
                            <div style={{ padding: '1.5rem 1.75rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                                <div style={{ color: '#0f172a', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                    What's Happening Here
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#475569', fontSize: '1rem', lineHeight: 1.85 }}>
                                    <p style={{ margin: 0 }}>
                                        The scene above captures a reality that thousands of aspiring pilots face every year. A young pilot has approached an airline career booth — in this case, <strong>Skyward Airlines</strong> — and is asking a direct, legitimate question: <em>"So, about the 500-hour multi-engine requirement…"</em> He wants clarity. He wants to understand exactly what the airline expects and how he can meet those standards.
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        But instead of receiving a clear, informative answer, he is <strong>redirected</strong>. The representative behind the desk hands him a generic card and points to a sign: <em>"For specific questions, please email the address on the sign behind me."</em> The information is not being clearly transferred — it is being deferred. The pilot walks away with a business card and a vague instruction to send an email to <strong>careers@skywardair.com</strong>.
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        And here is where the cycle breaks down completely: <strong>that enquiry email almost never gets responded to</strong>. The pilot sends a carefully written email asking about requirements, recommended pathways, or interview expectations — and it disappears into a recruitment inbox that receives hundreds, sometimes thousands, of similar emails every month. No reply. No acknowledgement. No clarity.
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        The pilot is left exactly where he started — uninformed, uncertain, and without a clear path forward. The information gap remains wide open, and the airline moves on without ever knowing they lost a potentially qualified candidate to poor communication.
                                    </p>
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6', marginBottom: '2rem' }}>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 500 }}>
                                    <strong>This is exactly the problem Wingmentor solves.</strong> Instead of individual pilots chasing generic email addresses, Wingmentor approaches these organisations directly — with the weight of a verified pilot database behind it — and asks the questions that actually matter, on behalf of every pilot in the program.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.85 }}>
                                <p style={{ margin: 0 }}>
                                    The questions that every aspiring pilot wants answered — <em>"What are your requirements? What experience do you recommend? What does the ideal candidate profile look like? How do I get there?"</em> — become questions that Wingmentor can ask directly to companies like Gulfstream, Bombardier, Dassault, or any major operator. And because Wingmentor is presenting a qualified pipeline of candidates, these companies have every reason to engage, share their expectations, and even shape pathway recommendations that feed directly back into the program.
                                </p>
                            </div>
                        </div>

                        {/* Subtopic: They Come to You */}
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                REVERSING THE APPLICATION MODEL
                            </div>
                            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem' }}>
                                They Come to You
                            </h3>

                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem' }}>
                                <img src="/wingmentor terminal.png" alt="Wingmentor Terminal — Reversing the Application Model" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.85 }}>
                                <p style={{ margin: 0 }}>
                                    The traditional model in aviation is broken: pilots spend months — sometimes years — blindly applying to airlines, recruitment agencies, and operators, hoping someone notices them in a sea of identical resumes. Wingmentor flips this model entirely.
                                </p>
                                <p style={{ margin: 0 }}>
                                    As the Wingmentor database gains exposure across the pilot industry, airlines and aviation companies will not need to be convinced — they will be <strong>intrigued</strong>. An application that houses a massive databank of qualified, vetted pilots who have completed a structured recognition program is inherently attractive to any organisation looking to recruit. Instead of you applying to them, they begin exploring <em>you</em>. The database becomes a destination, not a submission.
                                </p>
                                <p style={{ margin: 0 }}>
                                    Through partnerships, industry events, word of mouth, and direct outreach, the Wingmentor Pilot Database will gain visibility across the aviation sector — from commercial airlines and charter operators to corporate aviation firms and emerging sectors like urban air mobility. The goal is simple: <strong>make the database impossible to ignore</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Subtopic: The Differentiation Factor */}
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE DIFFERENTIATION FACTOR
                            </div>
                            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem' }}>
                                Program Pilots vs. Non-Program Pilots
                            </h3>

                            <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem' }}>
                                <img src="/johnsi.png" alt="Program Pilots vs. Non-Program Pilots — The Differentiation Factor" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.85 }}>
                                <p style={{ margin: 0 }}>
                                    Not every pilot in the Wingmentor database will carry the same weight — and that is entirely by design. Pilots who have completed the <strong>Wingmentor Foundation Program</strong> will carry a significantly greater edge of recognition than someone who simply registers seeking recognition without having done the work.
                                </p>
                                <p style={{ margin: 0 }}>
                                    The difference is measurable and visible. Every program you complete, every mentoring session you attend, every assessment you pass, and every competency you demonstrate is recorded and reflected in your profile. The <strong>effort you invest is held accountable</strong> — it shows up in your data, in your ATLAS CV, and in the way your profile is ranked and surfaced to industry partners.
                                </p>
                                <p style={{ margin: 0 }}>
                                    When an airline or operator searches the database, they will see a clear distinction: pilots who have earned their recognition through demonstrated commitment, structured development, and verified competency — versus those who have not. The programs you take, the experiences you accumulate, and the genuine effort you put in will <strong>all be held accountable</strong> when your profile is being reviewed.
                                </p>
                            </div>

                            {/* Insight callout */}
                            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6', marginTop: '2rem' }}>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 500 }}>
                                    <strong>The bottom line:</strong> Recognition is not given — it is earned. Wingmentor tracks everything. The pilots who invest in themselves through the program will always stand apart from those who simply want to be on the list. Your effort is your edge.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── ATLAS CV Recognition (merged) ── */}
                    <div style={{ marginTop: '5rem', paddingTop: '4rem', borderTop: '2px solid #e2e8f0', marginBottom: '2rem' }}>

                        {/* Section header — matches main page title style */}
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                                Chapter 01 — Understanding the What's
                            </div>
                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                                ATLAS CV Recognition
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '36rem', margin: '0 auto' }}>
                                Your verified pilot identity, translated into the globally standardised portfolio format trusted by airlines and aviation recruiters worldwide.
                            </p>
                        </div>

                        <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', backgroundColor: '#fff', marginBottom: '2.5rem' }}>
                            <img src="/atlascv.png" alt="ATLAS CV Recognition — Wingmentor" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#475569', fontSize: '17px', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                            <p style={{ margin: 0 }}>
                                Once you complete the Wingmentor Foundation Program, your journey doesn't end at a certificate — it begins at a credential. Every piece of data collected across your program is systematically captured by the <strong>Pilot Recognition System</strong>, then translated into the globally standardised <strong>ATLAS CV Format</strong>: the aviation industry's recognised portfolio structure for low-timer pilots seeking airline placement.
                            </p>
                            <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 500 }}>
                                    <strong>What is the ATLAS CV?</strong> The ATLAS CV is not a traditional résumé. It is a structured, standardised aviation portfolio that translates your verified program data — mentoring hours, EBT &amp; CBTA familiarity, knowledge exam results, NOTECHS behavioral scores, and licensure outcomes — into a format immediately readable and trusted by airline recruitment pipelines.
                                </p>
                            </div>
                            <p style={{ margin: 0 }}>
                                Unlike a generic CV, the ATLAS format is designed around what airlines and their outsourced recruitment agencies actually look for. It removes ambiguity, standardises the candidate profile, and presents your competencies in a verifiable, quantified manner rather than a self-reported list of qualifications.
                            </p>
                        </div>

                        {/* 3-step process */}
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            THE PROCESS
                        </div>
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.75rem' }}>
                            From Program Data to Industry Portfolio
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
                            {[
                                {
                                    step: '01',
                                    title: 'Data Collection via the Pilot Recognition System',
                                    body: `Throughout the Foundation Program, the Pilot Recognition System continuously captures your verified activity: Foundation Program attendance, mentoring hours logged, EBT & CBTA core module completions, knowledge examination results, and your assessed behavioral competencies (NOTECHS framework). Nothing is self-reported — every data point is independently verified by Wingmentor's operational team.`
                                },
                                {
                                    step: '02',
                                    title: 'Translation to the ATLAS CV Format',
                                    body: `Your verified data is then structured and formatted into the ATLAS CV — a globally recognised aviation portfolio layout. This translation process standardises your profile to match the specific intake criteria of our airline and industry partner network, removing the guesswork from candidate evaluation and replacing it with measurable, comparable output.`
                                },
                                {
                                    step: '03',
                                    title: 'Access Granted to the Pilot Database',
                                    body: `Upon successful ATLAS CV compilation, your profile is formally submitted to Wingmentor's curated Pilot Database — a live, vetted pool of recognised candidates shared directly with our network of airline and aviation industry partners, including Air Asia, Singapore Airlines, and Cathay Pacific. Your ATLAS CV becomes the key that unlocks access to opportunities that are entirely invisible to candidates applying through conventional channels.`
                                },
                                {
                                    step: '04',
                                    title: 'Industry API Key Access',
                                    body: `The Wingmentor Pilot Database is not an open directory — it is a secured, API-gated system. Airlines, recruitment agencies, and aviation industry companies are issued unique API keys that grant them controlled access to search, filter, and review pilot profiles and portfolios within the database. Every query is authenticated, logged, and traceable — meaning when an airline wants to verify a candidate or discover new talent, they must go through the Wingmentor API search engine. This architecture adds a critical layer of professionalism and exclusivity: your profile is not passively sitting on a job board — it is being actively retrieved through a secure, enterprise-grade system built for the aviation industry.`
                                },
                            ].map(({ step, title, body }) => (
                                <div key={step} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
                                    <div style={{ minWidth: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eff6ff', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#2563eb', flexShrink: 0 }}>
                                        {step}
                                    </div>
                                    <div>
                                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', fontWeight: 400, color: '#0f172a', marginBottom: '0.4rem' }}>{title}</h4>
                                        <p style={{ color: '#475569', fontSize: '0.975rem', lineHeight: 1.75, margin: 0 }}>{body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inside the ATLAS CV */}
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            INSIDE THE ATLAS CV
                        </div>
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                            What Gets Recognised
                        </h3>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            The ATLAS CV is a composite of every verified data point from your Foundation Program progress. Below is what constitutes your recognised pilot profile:
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                            {[
                                { icon: '📋', label: 'Foundation Program Attendance', detail: 'Verified session logs and participation records' },
                                { icon: '🤝', label: 'Mentoring Hours', detail: 'Documented one-on-one and group mentoring engagements' },
                                { icon: '✈️', label: 'EBT & CBTA Familiarity', detail: 'Evidence-based training module competency records' },
                                { icon: '📝', label: 'Knowledge Exam Results', detail: 'Standardised examination outcomes and pass records' },
                                { icon: '🧠', label: 'NOTECHS Behavioural Scores', detail: 'Assessed Non-Technical Skills per competency framework' },
                                { icon: '🎓', label: 'Licensure Outcomes', detail: 'Verified licence and rating holdings on record' },
                            ].map(({ icon, label, detail }) => (
                                <div key={label} style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{label}</div>
                                    <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>{detail}</div>
                                </div>
                            ))}
                        </div>

                        {/* Mentorship Validation & Certification */}
                        <div style={{ backgroundColor: '#f0f9ff', padding: '2.5rem', borderRadius: '24px', borderLeft: '4px solid #0284c7', marginBottom: '3.5rem', marginTop: '3.5rem' }}>
                            <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                WINGMENTOR INSIGHT
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0c4a6e', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Mentorship Certification
                            </h3>
                            <p style={{ color: '#1e293b', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                Following a series of engagements with an assigned WingMentor official, and upon reaching the <strong>20-hour milestone</strong>, candidates undergo a final <strong>Examined Mentorship Session</strong>. This session serves as a high-level assessment where your ability to synthesize and apply mentor knowledge is rigorously evaluated by an official mentor.
                            </p>
                            <p style={{ color: '#1e293b', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>
                                The objective is to verify that you have not only understood the core methodologies but are also equipped to <strong>mentor others independently</strong>. Successful completion marks your transition into a recognized mentor within the ecosystem, providing a critical validation point in your professional profile.
                            </p>
                        </div>

                        {/* WingMentor Insight */}
                        <div style={{ backgroundColor: '#f0f9ff', padding: '2.5rem', borderRadius: '24px', borderLeft: '4px solid #0284c7', marginBottom: '2rem' }}>
                            <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                WINGMENTOR INSIGHT
                            </div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0c4a6e', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Why Standard CVs Fail the Airline Test
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#1e293b', fontSize: '1.1rem', lineHeight: 1.8 }}>
                                <p style={{ margin: 0 }}>
                                    A traditional pilot CV is a self-reported history of past actions. The ATLAS CV is a <strong>verified record of future potential</strong>. In a global market saturated with identical 200-hour profiles, the distinction between career stagnation and airline assessment is rarely about flying hours — it is about the documented credibility of your professional character.
                                </p>
                                <p style={{ margin: 0 }}>
                                    The ATLAS CV provides airline recruitment partners with a standardized, high-trust credential. It bypasses the noise of the open market, speaks directly to the advanced intake criteria defined by major carriers, and positions you as a pre-vetted candidate who has already cleared the industry's most rigorous preparatory hurdle.
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '1rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#2563eb', fontWeight: 500, textAlign: 'center' }}>
                                ℹ️ <em>You will build and review your ATLAS CV in detail during later modules of the Foundation Program.</em>
                            </p>
                        </div>
                    </div>

                    {/* Quiz Section */}
                    <div style={{ marginTop: '5rem', marginBottom: '3rem' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 0 2rem 0' }}>
                                <Icons.Zap style={{ width: 24, height: 24, color: '#2563eb' }} />
                                Quiz: Pilot Recognition
                            </h3>
                            <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#93c5fd';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>Internal Exam 01.B</div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>Understanding Operational Readiness</h4>
                                <p style={{ fontSize: '1rem', color: '#475569', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.6 }}>"What is the primary objective of the ATLAS CV in the Wingmentor ecosystem?"</p>
                                <button style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                    Start Quiz <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '2rem' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6rem' }}>
                        <button onClick={handlePrev} style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            ← Back
                        </button>
                        <button
                            onClick={handleNext}
                            style={{ background: '#0284c7', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#0369a1')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#0284c7')}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            );
        }

        // ── The Difference Page ────────────────────────────────────────────
        if (currentTopic === 'difference') {
            return (
                <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                            THE DIFFERENCES
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            The Differences
                        </h1>
                        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '48rem', margin: '0 auto' }}>
                            This brief is your primer on how WingMentor diverges from flight schools, instructor pipelines, traditional job boards, and pilot agencies. By understanding the system-level reality check, the operator fear equation, and our ecosystem differential, you will know exactly how we quantify readiness and why each phase matters before you advance.
                        </p>
                    </div>

                    

                    <section style={{ textAlign: 'center', maxWidth: '56rem', marginBottom: '2.5rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            THE INSTRUCTOR LENS
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                            Flight Instructor vs WingMentor
                        </h2>
                        <div style={{ width: '100%', maxWidth: '720px', margin: '2rem auto 0', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(15,23,42,0.12)', border: '1px solid rgba(15,23,42,0.08)' }}>
                            <img
                                src={encodeURI('/instructor vs wing mentor -2.png')}
                                alt="Comparison of flight instructor pathways versus WingMentor"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.8, maxWidth: '48rem', margin: '1.75rem auto' }}>
                            The left panel captures the traditional classroom bottleneck—one instructor drowning under 30 raised hands, unable to deliver individualized support beyond rote Q&amp;A. The right panel shows the WingMentor scene: a focused, peer-to-peer debrief where a mentor drills into a single pilot’s struggle, translating it into actionable coaching and measurable growth.
                        </p>
                        <p style={{ color: '#475569', fontSize: '1.03rem', lineHeight: 1.8, maxWidth: '48rem', margin: '0 auto 1rem' }}>
                            It is crucial to understand the distinction: we do not teach lectures or seminars, nor do we replace your flight school’s curriculum. Our mission is to support and consult based on the specific performance you demonstrate throughout your education and flight training journey.
                        </p>
                        <p style={{ color: '#475569', fontSize: '1.03rem', lineHeight: 1.8, maxWidth: '48rem', margin: '0 auto 1.5rem' }}>
                            Whether you are a student pilot struggling with a maneuver, a flight instructor refining your briefing techniques, or a pilot returning after a decade and needing a refresher, WingMentor analyzes your performance gaps and delivers targeted consultation to bridge them.
                        </p>
                    </section>

                    <section style={{ textAlign: 'center', maxWidth: '56rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            THE DIFFERENTIAL
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.3rem, 5vw, 3.4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                            Flight School vs WingMentor Differences
                        </h2>
                    </section>

                    <div style={{ maxWidth: '56rem', margin: '3rem auto 0', textAlign: 'left', color: '#475569' }}>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            Flight schools are highly effective at one specific task: churning out graduates with freshly printed licenses and logged flight hours. However, to an airline's recruitment software and human resources department, these newly minted pilots are essentially "raw data." In the high-stakes environment of commercial aviation, raw data is inherently risky, unproven, and difficult to parse.
                        </p>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            While a traditional agency simply forwards this raw data blindly into the abyss of airline application portals, Wingmentor operates as a definitive quality control filter. By inserting our Indoctrination and Assessment phases at the very front of the funnel, we actively pre-process candidates before they ever face an airline recruiter.
                        </p>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                            This initial phase is the most critical lever in our ecosystem because it addresses a fundamental industry flaw: flight school teaches a pilot how to keep an aircraft in the sky, but it rarely teaches them the harsh business realities of commercial aviation.
                        </p>

                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.94)',
                            borderRadius: '28px',
                            padding: '3.5rem',
                            border: '1px solid rgba(226,232,240,0.9)',
                            boxShadow: '0 25px 45px rgba(15,23,42,0.08)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                    WingMentor System Insight
                                </div>
                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', margin: 0 }}>
                                    The System View: An Expectation Reset
                                </h3>
                            </div>
                            <p style={{ fontSize: '1.08rem', lineHeight: 1.8, marginBottom: '1.5rem', color: '#475569' }}>
                                Many pilots fall into the post-graduation gap because their expectations are deeply misaligned with actual airline requirements. Our indoctrination process is a comprehensive expectation reset, teaching graduates the real rules of the commercial system. We focus on:
                            </p>
                            <ul style={{ fontSize: '1.08rem', lineHeight: 1.8, margin: '0 0 1.5rem 1.25rem', color: '#1e293b' }}>
                                <li style={{ marginBottom: '0.85rem' }}><strong>Decoding the ATS:</strong> Showing pilots exactly how Applicant Tracking Systems evaluate and filter résumés.</li>
                                <li style={{ marginBottom: '0.85rem' }}><strong>Beyond the Logbook:</strong> Revealing what recruitment boards are genuinely searching for so you move past generic hour counts into operational maturity.</li>
                                <li><strong>Operational Soft Skills:</strong> Instilling the CRM, leadership, and problem-solving behaviors operators need to trust you in dynamic crews.</li>
                            </ul>
                            <p style={{ fontSize: '1.08rem', lineHeight: 1.8, color: '#475569', margin: 0 }}>
                                Through this rigorous pre-processing, we do not just filter candidates; we elevate them—transforming frustrated graduates into informed, strategic professionals ready to navigate and conquer the commercial sector.
                            </p>
                        </div>
                    </div>

                    <section style={{ textAlign: 'center', maxWidth: '56rem', margin: '3rem auto 0' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                            PILOT REALITY VS. OPERATOR FEAR
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)', fontWeight: 400, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Pilot Reality vs. Operator Fear
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
                            Quantifying the Intangibles for Carrier Confidence
                        </p>
                        <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            There is a massive psychological and operational disconnect at the entry point of commercial aviation. A newly graduated pilot asks, “I am licensed, I have passed every checkride, and I am highly capable—so why am I invisible to recruiters?” Meanwhile, operators stare at multi-million dollar assets and worry, “Can this graduate survive dynamic crew operations without the constant supervision of a flight instructor?” Flight schools produce stick-and-rudder proficiency; operators demand stress management, procedural discipline, and leadership under pressure.
                        </p>
                        <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                            WingMentor’s response is to eliminate that fear with what traditional résumés cannot deliver: verifiable proof of operational maturity. We do not simply tell airlines you are ready—we actively quantify the intangibles so your true capability is undeniable.
                        </p>
                        <ul style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.75, margin: '0 auto 1.75rem', maxWidth: '46rem', textAlign: 'left', paddingLeft: '1.25rem' }}>
                            <li style={{ marginBottom: '0.85rem' }}><strong>Live Mentorship Hours:</strong> Demonstrate peer support, emotional intelligence, and leadership inside a crew-centric environment.</li>
                            <li style={{ marginBottom: '0.85rem' }}><strong>Indoctrination Debriefs:</strong> Evaluate how you assess, adapt, and learn from complex operational scenarios far beyond rote memorization.</li>
                            <li><strong>Independent Assessments:</strong> Stress-test CRM judgment and decision quality through rigorous, unbiased reviews before any carrier sees your profile.</li>
                        </ul>
                        <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.8 }}>
                            By transforming abstract soft skills into quantified, credible data streams, we neutralize operator fear. Airlines see resilience metrics, decision logs, and mentor sign-offs—tangible evidence that you can be trusted on their flight deck.
                        </p>
                    </section>

                    <section style={{ textAlign: 'center', maxWidth: '56rem', margin: '3rem auto 0' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                            The Diagnostic Bridge vs. The Static Noticeboard
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)', fontWeight: 400, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Redefining the Job Search
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            Why Legacy Platforms Fail
                        </p>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                            You cannot fix a gap if you do not know its exact dimensions. Traditional job boards only understand half the equation—they know what an airline wants, but they have zero capacity to measure what a pilot actually possesses.
                        </p>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                            Platforms like PilotCareerCenter embody the legacy static noticeboard. Airlines post rigid lists of hours, ratings, and aircraft types while pilots toss generic résumés into the void. There is no feedback loop, so a rejected pilot is left guessing whether the failure came from ATS formatting, missing core EBT competencies, or simple timing.
                        </p>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                            WingMentor obliterates that one-way street by turning it into a two-way Diagnostic Bridge. We do not just list the gap—we measure it, explain it, and supply the exact tools to close it via a structured three-phase system.
                        </p>
                        <div style={{ textAlign: 'left', maxWidth: '52rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            <div>
                                <div style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Phase 1 — Measuring the Pilot</div>
                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: 500, margin: '0 0 0.6rem', color: '#0f172a' }}>Indoctrination & Assessment</h3>
                                <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.75, margin: 0 }}>
                                    Instead of relying on self-reported flight hours, we capture rigorous, verifiable data. By integrating EBT and CBTA standards—and utilizing Airbus HINFACT applications—we map the exact dimensions of your foundational knowledge in the precise language airlines already trust.
                                </p>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(148,163,184,0.35)' }} />
                            <div>
                                <div style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Phase 2 — Packaging the Data</div>
                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: 500, margin: '0 0 0.6rem', color: '#0f172a' }}>Pilot Recognition</h3>
                                <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.75, margin: 0 }}>
                                    Raw data must be formatted perfectly to matter. We track exam performance and live mentoring surveillance to turn a messy, unreadable PDF into an ATLAS-compliant, ATS-ready Recognition Profile that undeniably proves competency for rigorous evaluations such as an Airbus interview.
                                </p>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(148,163,184,0.35)' }} />
                            <div>
                                <div style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Phase 3 — The AI Matchmaker</div>
                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: 500, margin: '0 0 0.6rem', color: '#0f172a' }}>Pathways Engine</h3>
                                <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.75, margin: 0 }}>
                                    Our AI engine compares your structured Recognition Profile against live market requirements and speaks plainly: “You do not meet these specific requirements yet—here is the module or experience to complete.” Airlines simultaneously receive only those candidates who are already assessed, formatted, and validated against their operational needs.
                                </p>
                            </div>
                        </div>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginTop: '1.5rem' }}>
                            We are building the engine a static job board never could: translating raw, inexperienced pilots into verified, airline-ready assets while giving carriers a completely frictionless way to find exactly who they need.
                        </p>
                    </section>

                    <section style={{ textAlign: 'center', maxWidth: '56rem', marginTop: '3rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            PILOT AGENCY VS WINGMENTOR DIFFERENCES
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                            Why We Refuse the Traditional Agency Route
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
                            Redefining Pilot Recognition and Industry Readiness
                        </p>
                        <div style={{ textAlign: 'left', color: '#475569', fontSize: '1.08rem', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <p>
                                When you step out of the highly controlled bubble of flight school, traditional recruitment agencies treat your freshly printed license as a mere commodity. Operating strictly as middlemen and gatekeepers, these agencies rely on a purely transactional model—collecting a fee to simply throw your resume at an airline in hopes of placing you in a seat. They completely ignore the glaring paradox of the modern industry: operators are desperate for crew, yet terrified to hand the keys of a multi-million dollar aircraft to an untested pilot whose primary skill is rote memorization.
                            </p>
                            <p>
                                We recognize that tossing an unprepared pilot into the vast, unpredictable wilderness of commercial aviation is a disservice to both the aviator and the operator. That is exactly why we refuse the agency route. Instead of acting as a resume-forwarding service, we have engineered a transformative ecosystem designed to empower you directly.
                            </p>
                            <p>
                                Before you ever submit an application to a carrier, our Indoctrination & Assessment programs are designed to tear down the basic behaviorism learned in flight school and rebuild your operational mindset. We take the time to comprehensively assess your capabilities, reset your expectations, and bridge the massive psychological chasm between passing a checkride and leading in a dynamic crew environment.
                            </p>
                            <p>
                                We tackle the root causes of the post-graduation void—visibility and true industry readiness—ensuring you step onto the flight deck not just as a licensed graduate, but as a quantified, credible, and unequivocally airline-ready asset.
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.94)',
                            borderRadius: '28px',
                            padding: '3rem',
                            border: '1px solid rgba(226,232,240,0.9)',
                            boxShadow: '0 25px 45px rgba(15,23,42,0.08)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '2rem',
                            marginTop: '2.5rem'
                        }}>
                            <div style={{ flex: '1 1 260px', minWidth: '240px' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    Traditional Agency Route
                                </div>
                                <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.1rem' }}>
                                    <li style={{ marginBottom: '0.8rem' }}>Transactional placements focused on finder’s fees</li>
                                    <li style={{ marginBottom: '0.8rem' }}>Little to no validation of your mentorship or crew leadership capabilities</li>
                                    <li>Resumés pushed into crowded pipelines with minimal context</li>
                                </ul>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(148,163,184,0.4)', alignSelf: 'stretch' }} />
                            <div style={{ flex: '1 1 260px', minWidth: '240px' }}>
                                <div style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    WingMentor Ecosystem
                                </div>
                                <ul style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, paddingLeft: '1.1rem' }}>
                                    <li style={{ marginBottom: '0.8rem' }}>Indoctrination + Assessment rebuilds operational mindset before applications</li>
                                    <li style={{ marginBottom: '0.8rem' }}>Quantified mentorship logs, CRM data, and EBT/CBTA alignment shared with operators</li>
                                    <li>Pathway-specific readiness reviews before you ever meet a recruiter</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '46rem', margin: '0 auto 1.75rem' }}>
                            This page is your pivot point. Once you internalize the difference, the Program Syllabus will show you exactly how we operationalize it—module by module.
                        </p>
                        <button
                            onClick={() => setCurrentTopic('program-syllabus')}
                            style={{
                                background: '#0f172a',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                padding: '1rem 2.5rem',
                                borderRadius: '999px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 15px 35px rgba(15,23,42,0.25)'
                            }}
                        >
                            Continue to Program Syllabus
                        </button>
                    </section>
                </div>
            );
        }

        if (currentTopic === 'what-now') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
                    {/* ── Page Header ── */}
                    <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }} />
                        <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                            CHAPTER 01 — UNDERSTANDING THE WHAT'S
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            What Now?
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '48rem', margin: '0 auto', fontWeight: 400 }}>
                            So you have established the realities of the industry gap, the illusion of the shortage, and the need for recognized behavioural maturity. Now it is time to pivot from analysis to actionable strategy.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>

                        {/* Analysis Section */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem', marginTop: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                                <p style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '1.05rem' }}>
                                    The most agonizing question you must ask yourself is: <em>What am I going to do now? What am I actually going to face?</em> Here is the unspoken truth: you are not the only one who knows the reality of the <strong>Industry Gap</strong>. Deep down, the instructors who taught you know it. The head of your flight college knows it. But they are bound by a different directive: keeping the aviation pipeline flowing. Most pilots rely entirely on their flight school, totally trusting the process they laid out. For a school to admit that their CPL doesn't actually make you airline-ready would be like telling a child that Santa Claus isn't real. So, they keep you dreaming your goal. To be fair, if flight schools laid out the brutal truth of these requirements on day one, many aspiring aviators would have never taken the leap, and these schools would go out of business. Ultimately, the fault doesn't lie maliciously with the schools; it lies with the rigid, outdated regulations that created this chasm.
                                </p>
                                <p style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '1.05rem' }}>
                                    So, what now? You are what the industry universally labels a <strong>"Low-Timer,"</strong> a term carrying a heavy stigma. It means you have the legal right to fly, but you lack the "operational miles" to be trusted. While in flight school, the environment dictated your schedule; every scenario was predictable. Now you are faced with a developmental void. The harsh reality for most graduates is sitting at home, holding a fresh license, and desperately waiting for an interview with their own flight school to become an instructor—because everyone knows that is their "best bet" for a job.
                                </p>
                                <p style={{ marginBottom: '2.5rem', color: '#475569', fontSize: '1.05rem' }}>
                                    You are going to face the harsh reality that your previous <strong>Constructivism</strong>—how you built your knowledge base—was flawed. You built knowledge based on passing tests, not on practical, commercial survival. You will realize that the gap isn't just about a lack of flight hours; it is about the immaturity of your non-technical skills (NOTECHS).
                                </p>

                                <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem', fontFamily: '"Inter", sans-serif' }}>
                                    The Wingmentor Approach
                                </h3>
                                <div style={{
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    border: '1px solid #e2e8f0',
                                    borderLeft: '4px solid #3b82f6',
                                    marginBottom: '1.5rem',
                                    position: 'relative'
                                }}>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
                                        <strong>Real Talk:</strong> Most pilots think the hard part is over once the CPL is printed. In reality, the true test is the "Experience Void." You can sit at home hoping for an instructor slot to open up, or you can take decisive action. This is exactly where Wingmentor steps in—to actively break the cycle of waiting and forge you into a standardized, ready-to-hire commercial asset.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Charting Your Trajectory Section */}
                        <section style={{ textAlign: 'center', maxWidth: '52rem' }}>
                            {/* Conceptual Image */}
                            <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc', marginBottom: '3rem', position: 'relative' }}>
                                <img src="/the-pilot-gap.png" alt="Evaluating what comes next in the pilot journey" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                            </div>

                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE NEXT STEPS
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Charting Your Trajectory
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                    The industry isn't going to lower its standards to meet you; you must elevate your competencies to meet the industry. The subsequent chapters of this Foundation platform are designed identically to tackle that reality.
                                </p>
                                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                    This framework shifts the focus entirely toward actionable development. You will engage with advanced problem-solving methodologies, establish rigorous Crew Resource Management protocols, and undergo continuous peer collaboration through our established mentorship networks to ensure you don't stall your career at the 250-hour mark.
                                </p>
                            </div>
                        </section>

                        {/* Evidence-Based Evolution Section */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                                THE NEW GLOBAL STANDARD
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                The Evidence-Based Evolution
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.1rem', lineHeight: 1.7, color: '#475569' }}>
                                <p>
                                    We bridge this intimidating gap not by tossing you into the deep end, but through the new global industry standard: structured, psychologically-driven <strong>Evidence-Based Training and Assessment (EBTA)</strong>. It is no longer about <em>how long</em> you've flown, but <em>how well</em> you handle specific behavioural cores under operational stress.
                                </p>
                                <p>
                                    You will take part through rigorous peer-mentorship, deep scenario-based evaluations, and guided indoctrination into professional workflows aimed directly at mitigating that perceived risk. We dissect the pilot into three core psychological pillars. We reconstruct your <strong>Behaviorism</strong> so that adhering to SOPs becomes an ingrained reflex rather than an active choice. We elevate your <strong>Cognitive Thinking</strong> so you learn to anticipate industry-wide multi-crew dynamics, manage immense workloads, and make critical, split-second safety decisions.
                                </p>
                                <p>
                                    Finally, we foster true <strong>Constructivism</strong>: teaching you how to build upon your failures constructively, actively self-critique your performances, and continuously learn in the cockpit, day after day.
                                </p>
                            </div>
                        </section>

                        {/* Industry Credibility Closing */}
                        <section style={{ textAlign: 'left', maxWidth: '52rem' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Result Factor: What will you achieve?
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.1rem', lineHeight: 1.7, color: '#475569' }}>
                                <p style={{ margin: 0 }}>
                                    Experience is the true foundation of knowledge. The ultimate result of this rigorous module is unquestionable <strong>Industry Credibility</strong>.
                                </p>
                                <p style={{ margin: 0 }}>
                                    This program isn&apos;t designed to get you a job at one specific airline; it is designed to make you undeniably hirable across the entire commercial aviation spectrum—whether you&apos;re flying cargo at 3 AM, navigating complex corporate charter operations, or flying for a legacy carrier. By focusing intensely on the core fundamentals that all operators actually evaluate during simulator checks and technical interviews, we take your &quot;Low-Timer&quot; risk and forge it into verifiable &quot;High-Competency&quot; value.
                                </p>
                                <p style={{ margin: 0 }}>
                                    As you complete this module and generate irrefutable Pilot Quality Assurance (PQA) metrics, you build a data-driven portfolio. This portfolio proves that you have the psychological maturity, the standardized behavior, and the advanced CRM capabilities that the industry desperately seeks. You will have transitioned from a student pilot into a professional airman.
                                </p>
                            </div>

                            {/* Closing blockquote */}
                            <blockquote style={{
                                margin: '2.5rem 0 0 0',
                                paddingLeft: '1.5rem',
                                borderLeft: '3px solid #2563eb',
                                color: '#334155',
                                fontSize: '1.1rem',
                                lineHeight: 1.75,
                                fontStyle: 'italic'
                            }}>
                                &quot;We don&apos;t just teach you to fly a plane; we prepare you to lead a career across the entire industry. This is the foundation of turning flight hours into true operational knowledge.&quot;
                            </blockquote>
                        </section>

                        {/* Navigation Footer */}
                        <div style={{ marginTop: '4rem', paddingTop: '2.5rem', width: '100%', maxWidth: '42rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                onClick={handlePrev}
                                style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                            >
                                <Icons.ArrowLeft style={{ width: 18, height: 18 }} /> Previous
                            </button>
                            <button
                                onClick={handleNext}
                                style={{
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                            >
                                Continue to Chapter 2 <Icons.ArrowRight style={{ width: 18, height: 18 }} />
                            </button>
                        </div>
                    </div>
                </div>
            );
        }



        // ── Page: why-statistics ───────────────────────────────────────────
        if (currentTopic === 'why-statistics') {
            return (
                <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                            CHAPTER 02 — THE WHY
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
                            Initial Examinations for the Foundational Program
                        </h1>

                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', color: '#334155', fontSize: '1.2rem', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                We are now focusing on the program requirements. Stage 1 is Examination Preparation — centred on the industry formation covered in Chapter 1. You are required to study each module from <strong>Low Timer</strong> through to <strong>What is Pilot Recognition</strong>, reading through every section thoroughly to gain a clear understanding of the industry landscape and where you stand as a pilot.
                            </p>
                        </div>

                        <div style={{ marginTop: '4rem', maxWidth: '800px', margin: '4rem auto 0', textAlign: 'left', color: '#334155' }}>

                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem' }}>
                                Stage 1 — Examination Preparation
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
                                Stage 1 of the examination is centred on the industry formation covered in <strong>Chapter 1</strong>. You are required to study each module — from the Low Timer perspective through to Pilot Recognition — reading through every section thoroughly to gain a clear understanding of the industry landscape and where you stand as a pilot. You will then be assessed on your foundational knowledge of the industry through structured examination questions.
                            </p>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '0.75rem', fontFamily: 'Georgia, serif' }}>
                                The following chapters must be studied in full:
                            </p>
                            <ul style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '1.5rem', paddingLeft: '1.5rem', color: '#334155', fontFamily: 'Georgia, serif' }}>
                                <li>What is a Low Timer?</li>
                                <li>What is the Pilot Shortage?</li>
                                <li>What is the Pilot Gap?</li>
                                <li>What is Pilot Recognition?</li>
                            </ul>

                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginTop: '3rem', marginBottom: '1.5rem' }}>
                                The W1000 Application
                            </h2>
                            <img
                                src="/W1000 application.jpg"
                                alt="W1000 WingMentor Application"
                                style={{ width: '100%', borderRadius: '16px', marginBottom: '1.75rem', display: 'block', objectFit: 'cover' }}
                            />
                            <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', color: '#64748b', fontStyle: 'italic' }}>
                                The W1000 application is currently accessible on <strong style={{ fontStyle: 'normal', color: '#334155' }}>iPad</strong> and <strong style={{ fontStyle: 'normal', color: '#334155' }}>desktop</strong>. The mobile version is still under development.
                            </p>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Upon enrolment in the Foundational Program, you will be granted access to the <strong>W1000 WingMentor Application</strong>. This platform is your primary resource for examination practice and knowledge access, including articles, PowerPoint slides, and textbook content covering <strong>PPL, CPL, and SPL</strong>.
                            </p>
                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginTop: '3rem', marginBottom: '1.5rem' }}>
                                Program Modules
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Within the <strong>Program Modules</strong>, you can access the full content library for each module in the Foundational Program. This comprehensive curriculum provides all the necessary documentation, presentations, and study material to ensure your progression through the program stages.
                            </p>

                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginTop: '3rem', marginBottom: '1.5rem' }}>
                                Examination Terminal
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The <strong>Examination Terminal</strong> allows for practice examinations with full data tracking. You have two modes selection: <em>Profile Mode</em> (where scores are recorded to your pilot profile as official progress and learning metrics) and <em>Practice Mode</em> (where results are not recorded officially — ideal for casual practice without impacting your profile's progress rate or error rate).
                            </p>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif', borderLeft: '3px solid #0284c7', paddingLeft: '1.25rem' }}>
                                <strong>Important:</strong> Within the Examination Terminal, you are able to <strong>select which licensure you are currently on</strong> and choose the specific topics you would like to be examined on — allowing you to tailor your assessment to your current level and focus areas.
                            </p>

                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginTop: '3rem', marginBottom: '1.5rem' }}>
                                The Black Box
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The <strong>Black Box</strong> is WingMentor's official knowledge archive, providing exclusive access to curated PowerPoint slides and structured study material across a wide range of aviation topics. Content spans <strong>PPL, CPL, Instrument Rating (IR), and Multi-Engine (ME)</strong> knowledge areas, giving you a comprehensive reference library to support your examinations and ongoing development.
                            </p>

                            {/* Examination Structure Card Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '4rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        EXAMINATION STRUCTURE
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                                        Calibration &amp; Regulatory Standards
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            The examination you undertake is calibrated to your <strong>current licence rating</strong>. If you hold a PPL, you will be examined at PPL level. To gain a higher rating or elevated mentor classification, you will need to sit the examination again at the appropriate level — this evaluation process continues throughout your participation in the Foundational Program and beyond.
                                        </p>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            For Philippines-based pilots, the examination is aligned with <strong>CAAP</strong> regulations. For USA-based pilots, examinations follow <strong>FAA</strong> standards. Note that while the Philippines framework is interrelated with FAA regulations, the <em>Air Law component differs</em> due to distinct national airspace regulations.
                                        </p>
                                        <p style={{ fontSize: '1.1rem', color: '#2563eb', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginTop: '2rem', borderLeft: '3px solid #2563eb', paddingLeft: '1.25rem' }}>
                                            <strong>Important:</strong> The official WingMentor examination is accessed directly through this <strong>portal</strong> — not through the Examination Terminal on the W1000 application. The W1000 is provided solely for <strong>study material and practice</strong>. When you are ready to sit your official examination, you will do so here.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Unlocked Access Card Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '4rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        UNLOCKED ACCESS &amp; BENEFITS
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                                        Beyond the Official Initial Examination
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '3rem' }}>
                                            Once you have completed and passed your official WingMentor examination, the following resources, environments, and community platforms are unlocked within your program access.
                                        </p>

                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            Simulator Room
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '0.75rem', fontFamily: 'Georgia, serif', color: '#475569' }}>
                                            Gain access to a full range of simulation practice sessions including:
                                        </p>
                                        <ul style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '2.5rem', paddingLeft: '1.5rem', color: '#475569', fontFamily: 'Georgia, serif' }}>
                                            <li>IFR Planning scenarios</li>
                                            <li>Multi-Engine (ME) failure simulations</li>
                                            <li>VFR and IFR practice environments</li>
                                            <li>EBT (Evidence-Based Training) and CBT (Computer-Based Training) modules</li>
                                        </ul>

                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            Pilot Gap Forum
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.25rem', fontFamily: 'Georgia, serif', color: '#475569' }}>
                                            A structured discussion board for community sharing, information questioning, and subject-specific topics. This is separate from direct mentor communication.
                                        </p>

                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            WingMentor Network Application
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.25rem', fontFamily: 'Georgia, serif', color: '#475569' }}>
                                            Your primary platform for <strong>direct chat and real-time communication</strong> with mentors and fellow mentees.
                                        </p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>

                        <p style={{ fontSize: '1.15rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', textAlign: 'center', maxWidth: '42rem', marginBottom: '-1rem' }}>
                            The next page will provide a comprehensive walkthrough and guide on the use of the <strong>W1000 application</strong>, detailing its primary functions and how to utilize its resources for your progression.
                        </p>

                        <div style={{ height: '1px', background: '#e2e8f0', width: '100%', maxWidth: '42rem' }} />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6rem', width: '100%', maxWidth: '42rem' }}>
                            <button onClick={handlePrev} style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                ← Back
                            </button>
                            <button
                                onClick={handleNext}
                                style={{ background: '#0284c7', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#0369a1')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#0284c7')}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            );
        }


        // ── Page: w1000-poh ────────────────────────────────────────────────
        if (currentTopic === 'w1000-poh') {
            return (
                <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                            W1000 — PILOT OPERATING HANDBOOK
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
                            Application Walkthrough & Guide
                        </h1>

                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', color: '#334155', fontSize: '1.2rem', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The <strong>W1000 Application</strong> is your primary auxiliary tool for the WingMentor Foundation Program. It serves as your personal study terminal, containing all the technical curriculum, examination practice environments, and national standard modules required for your progression.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', marginTop: '4rem' }}>

                            {/* Card 1: The Technical Interface */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                                        SECTION 01
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        The Technical Interface
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            Primary Navigation (Sidebar)
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            The left-hand sidebar is your command centre. From here, you can toggle between the <strong>Program Modules</strong>, the <strong>Examination Terminal</strong>, and the <strong>Black Box Archive</strong>. Each section is colour-coded and grouped by logical progression.
                                        </p>

                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            Module Selection
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            Clicking a module (e.g., PPL or CPL) will expand its specific sub-topics. You can track your progress as you read through each interactive slide. Each module is designed to be self-paced, allowing you to return to complex subjects as many times as necessary before attempting a practice session.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Examination Terminal Guide */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                                        SECTION 02
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        The Examination Terminal
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            Study Practice Environment
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            The W1000's primary purpose is <strong>preparation</strong>. The Examination Terminal provides an infinite-reset practice environment where you can test your knowledge under timed conditions without consequence. Use this to identify weak areas in your Air Law, Navigation, or Technical knowledge.
                                        </p>

                                        <p style={{ fontSize: '1.1rem', color: '#2563eb', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginTop: '2rem', borderLeft: '3px solid #2563eb', paddingLeft: '1.25rem' }}>
                                            <strong>Note:</strong> While the W1000 is used for training, your <strong>Official Examination</strong> (the one used for program recognition and milestone progression) must be sat via this Portal interface, as discussed in the previous section.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Regional Standards */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                                        SECTION 03
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        Regional Calibration
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '2rem' }}>
                                            Ensure you have selected the correct regional setting within the application settings gear icon (⚙️) on the bottom left.
                                        </p>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                            <div>
                                                <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>CAAP (Philippines)</h4>
                                                <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>Specific focus on local Air Law, PCARs, and regional meteorology.</p>
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>FAA (International)</h4>
                                                <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>Aligned with FAR/AIM standards and international ICAO procedures.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Avionics-Inspired Navigation */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                                        SECTION 04
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        Avionics-Inspired Navigation
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            The Soft Key System
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            The W1000 features a signature <strong>Soft Key navigation bar</strong> at the bottom of the screen, directly inspired by the real-life <strong>Garmin G1000 avionics suite</strong>. These keys provide ease of access to your entire toolkit with a single click.
                                        </p>

                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            This design allows you to switch between <strong>Examinations</strong>, <strong>Study Modules</strong>, and the <strong>Simulator Room</strong> all at once, mirroring the workflow of a professional glass cockpit environment. By integrating these familiar pilot aesthetics, the W1000 ensures your transition from study to cockpit is as intuitive as possible.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Dynamic Topic Selection */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                                        SECTION 05
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        Dynamic Topic Selection
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            Smart Learning Flow
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            The main dashboard utilizes an intelligent carousel to help you manage your curriculum. You can instantly jump back into <strong>Recent Topics</strong> that you were previously practicing, ensuring zero friction in your study sessions.
                                        </p>

                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            Additionally, the system provides <strong>Suggested Topics and Modules</strong> based on your progress and upcoming milestones. Whether it's a specific technical module or a new simulator challenge, these suggestions are designed to keep your training path clear and optimized.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 6: Core Application Ecosystem */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                                        SECTION 06
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        Core Application Ecosystem
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                                            <div>
                                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                                                    Program Modules
                                                </h3>
                                                <p style={{ fontSize: '1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.7' }}>
                                                    Access the complete WingMentor curriculum in an interactive digital format. Track which subjects you've mastered and view your real-time reading progress across the foundation stages.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                                                    Examination Terminal
                                                </h3>
                                                <p style={{ fontSize: '1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.7' }}>
                                                    A high-fidelity testing suite where you can analyze your performance across different air law, meteorology, and navigation subjects with professional-grade scoring metrics.
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                            <div>
                                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                                                    The Black Box Archive
                                                </h3>
                                                <p style={{ fontSize: '1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.7' }}>
                                                    Every study session and practice exam is logged. The Black Box serves as your immutable data history, recording time spent on specific areas and providing a data-driven view of your learning habits.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>
                                                    Pilot Profile Performance
                                                </h3>
                                                <p style={{ fontSize: '1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.7' }}>
                                                    A centralized dashboard to monitor overall statistics, total time spent in each area, and communication logs including recent messages from mentors or program progression team.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 7: Login & Access Control */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                                        SECTION 07
                                    </div>
                                    <h2 style={{ fontSize: '2.1rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                                        Login & Access Control
                                    </h2>

                                    <div style={{ textAlign: 'left', maxWidth: '42rem', margin: '0 auto' }}>
                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            Secure Profile Management
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            The W1000 implements a <strong>Secure Login System</strong> to ensure your pilot profile, progress data, and performance analytics are always protected and synchronized. This system maintains your digital identity across the WingMentor ecosystem.
                                        </p>

                                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.25rem' }}>
                                            Access Policy & Digital Rights
                                        </h3>
                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            Please note that access to the W1000 suite is contingent upon fulfillment of the program's terms and agreements. Access may be temporarily <strong>Revoked</strong> or put <strong>On Hold</strong> during scheduled system updates or security reviews.
                                        </p>

                                        <p style={{ fontSize: '1.1rem', color: '#475569', fontFamily: 'Georgia, serif', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                            In the event of a breach of terms or unauthorized data access, accounts may be subject to <strong>Termination</strong> to protect the integrity of the WingMentor Foundation Program. We maintain strict compliance standards to ensure a fair and secure learning environment for all cadets.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6rem', width: '100%', maxWidth: '42rem', margin: '6rem auto 0' }}>
                            <button onClick={handlePrev} style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                ← Back
                            </button>
                            <button
                                onClick={handleNext}
                                style={{ background: '#0284c7', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#0369a1')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#0284c7')}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // ── Our Mission Page ────────────────────────────────────────────────
        if (currentTopic === 'mission') {
            return (
                <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                            MODULE 01 MISSION
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
                            Our Mission
                        </h1>

                        {/* Mission Video */}
                        <div style={{ width: '100%', margin: '0 auto 3rem', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', background: '#0f172a' }}>
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

                        {/* Video Description */}
                        <div style={{ maxWidth: '900px', margin: '2rem auto 3rem', textAlign: 'left', color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
                            <p style={{ marginBottom: '1.5rem', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#64748b' }}>
                                This short film follows the operational arc of a modern aviator navigating the "Pilot Paradox" and the eventually successful transition into the WingMentor ecosystem.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>The Illusion:</strong>{' '}
                                    <span style={{ color: '#475569' }}>The journey begins with the high-status goal of "earning the stripes," representing the aspirational dream sold to every student pilot.</span>
                                </div>

                                <div>
                                    <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>The Experience Void:</strong>{' '}
                                    <span style={{ color: '#475569' }}>The narrative shifts to the "Hard Truth"—the demoralizing cycle of rejection letters, unemployment, and the systemic silence faced by low-timers despite holding a valid commercial license.</span>
                                </div>

                                <div>
                                    <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>The Transition:</strong>{' '}
                                    <span style={{ color: '#475569' }}>The pilot moves from a "High-Risk Unknown" to a "Verified Asset" by initializing his Pilot Recognition Profile. This results in immediate industry visibility, with airlines like AirAsia actively escalating his application rather than filtering it out.</span>
                                </div>

                                <div>
                                    <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>The Mission Accomplished:</strong>{' '}
                                    <span style={{ color: '#475569' }}>The cycle closes as the recognized pilot transitions into a leadership role, having mentored over 50 peers. This illustrates the WingMentor mission in action: clearing the backlog by validating veteran instructors and ushering them toward the airline flight deck.</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', color: '#334155', fontSize: '1.2rem', lineHeight: '1.8' }}>
                            <p style={{ marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                When you emerge from flight school with a freshly printed license, you're stepping out of a highly controlled simulator bubble and into the vast wilderness of the commercial aviation industry. You quickly realize that the industry is facing a massive disconnect: operators across all sectors—from regional airlines to corporate jet charters and cargo haulers—are desperately short on crew, yet they are extremely hesitant to hand the keys of a multi-million dollar aircraft to a pilot with 250 hours.
                            </p>
                            <p style={{ marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Why does this paradox exist? Because the structured, repetitive environment of a flight school naturally breeds a very specific type of <strong>Behaviorism</strong>. You learned to fly by rote. You memorized maneuvers for a checkride, learned to navigate controlled airspace under the watchful eye of an instructor, and reacted to standard emergencies with rehearsed, step-by-step <strong>Cognitive Thinking</strong>.
                            </p>
                            <p style={{ marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                But the commercial industry does not operate on rote memorization. It requires complex dynamic problem solving. Flight schools teach you how to pass a test; the industry demands that you know how to survive, standardise, and lead in an unpredictable operational environment. This foundational program exists to bridge that massive psychological and operational chasm. It's designed to provide the "Solution": Why aren't you getting hired instantly, and why is your current level of experience insufficient for the harsh realities of the industry?
                            </p>
                        </div>

                        <div style={{ marginTop: '4rem', maxWidth: '800px', margin: '4rem auto 0', textAlign: 'left', color: '#334155' }}>
                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem' }}>
                                The Foundational Knowledge That Every Pilot Should Have
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Leadership and mentorship are not just buzzwords; they are the bedrock of a professional aviator's career. Through WingMentor, you don't just receive guidance—you provide it. Gaining <strong>50 hours of guidance, support, and consultation</strong> by helping other pilots under your scale is a valuable accredited experience. This peer-to-peer mentorship is recognized as your <strong>Initial Pilot Recognition</strong>, proving that you have the emotional intelligence and leadership capacity to contribute to a crew environment. Every hour of mentorship, every assessment score, and every EBT competency you master is actively tracked and encrypted into your centralized Pilot Recognition Database—building a highly structured, ATS-friendly asset that works for you 24/7.
                            </p>
                            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.45rem', fontWeight: 500, color: '#0f172a', marginBottom: '0.75rem' }}>
                                The Milestone Assessment: Airbus Evaluation
                            </h3>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                At the culmination of your program, you will undergo a rigorous <strong>Examination & Assessment</strong>—an interview with a representative from <strong>Airbus</strong>. This is not a technical quiz; it is an evaluation of your evolution. They will assess how your perspective of the industry has shifted, the soft skills you have acquired, and how effectively you present your "future self."
                            </p>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                This interview serves as your first professional impression. We focus on how you talk, how you present yourself, and how you curate a comprehensive portfolio that defines your career trajectory and end goals. The results of this assessment are integrated into your profile database and shared across the <strong>Wingmentor network</strong>, making your verified credentials accessible to senior recruitment figures and operators worldwide.
                            </p>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Wingmentor Foundation Program is meticulously aligned with the <strong>nine core competencies of Evidence-Based Training (EBT) and Competency-Based Training and Assessment (CBTA)</strong>. This represents a critical shift from traditional flight training records, focusing on how a pilot manages complex situations, stress, and operational decision-making. By mastering these competencies now, we are preparing you for our <strong>flagship program</strong>—the ultimate transition from graduate to the airline environment, where you will be fully familiarized with the standards expected by the world's leading carriers.
                            </p>

                            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginTop: '3rem', marginBottom: '1.5rem' }}>
                                The Transition Program (Flagship)
                            </h2>

                            <section style={{
                                marginBottom: '3rem',
                                padding: '2.5rem',
                                width: '100%',
                                maxWidth: '820px',
                                background: 'rgba(255,255,255,0.92)',
                                borderRadius: '28px',
                                boxShadow: '0 18px 35px rgba(15,23,42,0.08)',
                                border: '1px solid rgba(226,232,240,0.9)',
                                textAlign: 'left'
                            }}>
                                <div style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                    FLAGSHIP PROGRAM
                                </div>
                                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginBottom: '0.75rem' }}>
                                    The Transition Program
                                </h3>
                                <p style={{ fontSize: '1rem', color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                                    Bridging License to Commercial Airline Operations
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '1.05rem', lineHeight: 1.75, color: '#475569' }}>
                                    <p>
                                        The <strong>Transition Program</strong> is our globally recognised and accredited program, specifically designed to bridge the gap between initial license acquisition and the high-pressure environment of commercial airline operations. Building upon the bedrock of the Foundation Program, we transition graduates and flight instructors into a professional airline setting using industry-leading Airbus applications like <strong>HINFACT</strong>—the primary tool for <strong>Evidence-Based Training (EBT)</strong>. You will receive direct familiarization with these systems, experiencing firsthand how modern airlines evaluate competency.
                                    </p>
                                    <p>
                                        A critical component of this transition is the <strong>ATLAS CV Recognition Factor</strong>. We ensure your data profile is aligned with the <strong>Atlas format</strong>, the global standard used by major <strong>Applicant Tracking Systems (ATS)</strong>. This guarantees that your skills and verified experiences are not overlooked by automated scanners but instead highlighted as professional assets when reviewed by recruitment agencies and airline hiring boards.
                                    </p>
                                    <p>
                                        We bridge the communication gap by sharing direct <strong>Airline Expectations</strong>. We maintain active dialogue with the <strong>Heads of Cadet Programs at Etihad</strong> and various other international carriers. This direct line ensures you are being prepared for the exact requirements of the world's most prestigious airlines.
                                    </p>
                                    <p>
                                        However, our focus extends far beyond the traditional airline cockpit. Through our <strong>WingMentor Pathways</strong>, we provide strategic, guided approaches to diverse sectors of the industry. This is not a static job board—Pathways utilizes our proprietary AI matchmaking engine, continuously comparing your Pilot Recognition Profile against live, evolving airline requirements. If a gap exists between your metrics and an operator’s standards, the system flags the precise <strong>Delta</strong> and directs you to the foundational modules required to close it. If your goal is the <strong>Private Jet Sector</strong>, we leverage our connections with operators, brokers, and manufacturers like <strong>Gulfstream</strong> to give you direct insight into how to break into corporate aviation.
                                    </p>
                                    <p>
                                        We also pave the way for the emerging <strong>Air Taxi and UAM (Urban Air Mobility)</strong> industries. With deep insights into industry leaders like <strong>Archer and Joby</strong>, we provide the roadmap for transitioning into the next generation of flight, whether as a piloted air taxi or a remote drone operator. Our network also expands into <strong>Cargo, Air Rescue</strong>, and specialized operations, ensuring you have multiple career choices upon graduation rather than being limited to a single path.
                                    </p>
                                    <p>
                                        This is where <strong>Pilot Recognition</strong> is valued the most. We are the first in the industry to directly address the dual crisis of the pilot shortage and the lack of pilot recognition. There are countless pilots with diverse experiences who are currently stuck without guidance, searching for answers from a fragmented industry. Wingmentor is that voice—and that guide. We are paving a clear approach for various industry sectors, providing pilots with the professional choice and the industry voice they have long been denied.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                        {/* Mission Statement */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                CORE PURPOSE
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Bridging the Experience Void
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.8, margin: 0 }}>
                                Our mission is to eliminate the "Pilot Gap" by transforming high-risk, unknown pilots into quantified, credible assets. We believe every licensed pilot deserves an intelligent, structured pathway to employment—provided they are willing to meet the industry's highest operational standards.
                            </p>
                        </section>

                        {/* Three Pillars of Wingmentor - Bulleted Version */}
                        <section style={{ width: '100%', maxWidth: '780px', marginTop: '1rem', padding: '0 1rem' }}>
                            <ul style={{
                                listStyleType: 'disc',
                                paddingLeft: '1.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.75rem',
                                margin: 0
                            }}>
                                {[
                                    {
                                        title: 'Standardisation (The Programs)',
                                        body: 'Aligning low-timer training with the exact Evidence-Based Training (EBT) standards that airlines expect from senior crews, beginning with a rigorous indoctrination to reset your operational mindset.'
                                    },
                                    {
                                        title: 'Mentorship',
                                        body: 'Connecting the next generation of pilots with seasoned industry veterans to transfer critical operational knowledge.'
                                    },
                                    {
                                        title: 'Recognition (Pilot Recognition)',
                                        body: 'Creating a verifiable data-trail of competency that makes you visible and attractive to airline recruitment pipelines.'
                                    },
                                    {
                                        title: 'Intelligent Matching (Pathways)',
                                        body: 'Utilizing our AI engine to proactively align your verified profile with the exact operational requirements and specific sectors of the aviation industry.'
                                    }
                                ].map((pillar, idx) => (
                                    <li key={idx} style={{ color: '#0f172a' }}>
                                        <h3 style={{
                                            fontFamily: 'Georgia, serif',
                                            fontSize: '1.25rem',
                                            fontWeight: 500,
                                            marginBottom: '0.35rem'
                                        }}>
                                            {pillar.title}
                                        </h3>
                                        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                                            {pillar.body}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Commitment Section */}
                        <section style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '4rem 3rem', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE COMMITMENT
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Your Growth is Our Success
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '42rem' }}>
                                At WingMentor, we go far beyond standard guidance and community. We provide an actionable, data-driven ecosystem built on EBT standards, integrity, and safety. Our commitment is simple: the aviation industry's barriers are high, but by transforming your potential into verified, industry-recognized metrics, your ability to clear them is never in question.
                            </p>
                        </section>

                        <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '6rem' }}>
                            <button
                                onClick={handleNext}
                                style={{
                                    background: '#0f172a',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    padding: '1.25rem 3rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(15, 23, 42, 0.3)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.2)';
                                }}
                            >
                                Continue to Program Syllabus <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // ── Program Syllabus Page ───────────────────────────────────────────
        if (currentTopic === 'program-syllabus') {
            return (
                <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                            MODULE 01 SYLLABUS
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                            Program Syllabus
                        </h1>
                        <p style={{ maxWidth: '700px', margin: '0 auto', color: '#475569', fontSize: '1.2rem' }}>
                            A comprehensive roadmap of your journey from foundational knowledge to verified industry recognition.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '850px', margin: '0 auto' }}>
                        {[
                            {
                                stage: 1,
                                title: 'Examination & Technical Rigor',
                                description: 'Upon completion of Chapter 1, candidates undergo a formal transition assessment. This evaluates industry comprehension and technical retention through our integrated software, utilizing FAA and CAAP standards alongside proprietary internal metrics. This score constitutes your initial performance record within the WingMentor ecosystem.',
                                objectives: [
                                    'Verify cross-regulatory technical knowledge and industry comprehension.',
                                    'Evaluate baseline retention via integrated FAA/CAAP standards.',
                                    "Establish the candidate's first Verified Skills Record."
                                ],
                                isFinal: false
                            },
                            {
                                stage: 2,
                                title: 'Global Industry Registry',
                                description: 'All assessment outcomes are archived within the Global Industry Registry. This centralized, immutable record provides total transparency and high-level credibility for our airline recruitment partners. This is your professional "digital footprint"—the first step in your formal Pilot Recognition journey.',
                                objectives: [
                                    'Initialize a centralized, verifiable professional profile.',
                                    'Enable immediate data transparency for airline recruitment partners.',
                                    'Archive baseline recognition metrics for longitudinal tracking.'
                                ],
                                isFinal: false
                            },
                            {
                                stage: 3,
                                title: 'Mentorship Psychology & Human Factors',
                                description: 'Following technical validation, you advance to the Mentorship Preparation Modules. This phase focuses on the critical differentiation between instructing and mentoring. The curriculum emphasizes psychological human factors: professional self-assessment, conflict resolution, and the "pre-psychology" of peer observation. You will master the ability to detect subtle performance struggles in others—an essential skill for the modern flight deck.',
                                objectives: [
                                    'Deconstruct the operational differences between Instruction and Mentorship.',
                                    'Develop psychological awareness and objective issue-resolution techniques.',
                                    'Master peer-observation metrics and behavioral assessment.'
                                ],
                                isFinal: false
                            },
                            {
                                stage: 4,
                                title: 'Pre-Mentorship Validation & Observation',
                                description: 'Before beginning the 20-hour supervised phase, candidates must pass a validation interview based on the Mentorship Psychology modules. This is followed by 10 hours of active observation, where you will shadow an official WingMentor lead. This ensures you are operationally prepared to manage a peer-to-peer consultation environment.',
                                objectives: [
                                    'Validate comprehension of human factors and mentorship theory.',
                                    'Assess practical readiness via specialized one-on-one professional interviews.',
                                    'Complete 10 hours of active peer-mentorship shadowing and documentation.'
                                ],
                                isFinal: false
                            },
                            {
                                stage: 5,
                                title: 'Supervised Mentorship (20-Hour Milestone)',
                                description: 'Candidates execute 20 hours of supervised mentorship under the guidance of a Senior WingMentor. Every session is logged with surgical precision—capturing hours, Pilot IDs, and a detailed Consultation Prescription. These logs must be objective and data-driven, reflecting your ability to solve complex training hurdles for your peers.',
                                objectives: [
                                    'Execute 20 hours of strategically tracked, supervised peer mentorship.',
                                    'Maintain high-fidelity, objective logs and Pilot ID verifications.',
                                    'Issue accurate problem-solving "prescriptions" and developmental plans.'
                                ],
                                isFinal: false
                            },
                            {
                                stage: 6,
                                title: 'Accreditation & Professional Endorsement',
                                description: 'Upon meeting all operational criteria, your experience is accredited against standards recognized by partners such as Airbus and Etihad Airways. This stage finalizes your transition from a "Low-Timer" to a verified, operationally mature asset within the recruitment funnel.',
                                objectives: [
                                    'Finalize the audit of mentorship impact, logs, and prescriptions.',
                                    'Award credentials aligned with Airbus and Etihad Airways industry standards.',
                                    'Authorize the candidate for advanced placement within the ecosystem.'
                                ],
                                isFinal: false
                            },
                            {
                                stage: 7,
                                title: 'The Foundation Capstone (50-Hour Milestone) & AIRBUS Interview',
                                description: 'The final integration phase involves extending your professional logging to the 50-hour milestone, demonstrating sustained leadership and consistency. The program culminates in the formal AIRBUS Recognition Interview. This comprehensive evaluation verifies your leadership qualities, technical command, and total readiness for airline placement.',
                                objectives: [
                                    'Document 50 verifiable hours of active, high-impact peer mentorship.',
                                    'Demonstrate sustained situational leadership and problem-solving.',
                                    'Pass the AIRBUS Recognition Interview to secure a top-tier industry endorsement.'
                                ],
                                isFinal: true
                            }
                        ].map((stageData, idx) => (
                            <div key={idx} style={{
                                backgroundColor: 'rgba(255,255,255,0.85)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: '20px',
                                padding: '2rem 2.25rem',
                                boxShadow: stageData.isFinal ? '0 8px 32px rgba(2,132,199,0.12)' : '0 4px 24px rgba(15,23,42,0.07)',
                                border: stageData.isFinal ? '2px solid rgba(37,99,235,0.15)' : '1px solid rgba(226,232,240,0.8)',
                                display: 'flex',
                                gap: '1.5rem',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: stageData.isFinal ? 'linear-gradient(135deg, #1d4ed8, #0f172a)' : 'linear-gradient(135deg, #0284c7, #2563eb)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    boxShadow: stageData.isFinal ? '0 4px 12px rgba(29,78,216,0.35)' : '0 4px 12px rgba(2,132,199,0.3)'
                                }}>
                                    {stageData.stage}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: stageData.isFinal ? '#1d4ed8' : '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                        Stage {stageData.stage}
                                    </div>
                                    <strong style={{ color: '#0f172a', fontSize: '1.25rem', display: 'block', marginBottom: '0.75rem', fontFamily: 'Georgia, serif', fontWeight: 400 }}>
                                        {stageData.title}
                                    </strong>
                                    <p style={{ margin: '0 0 1.25rem 0', fontSize: '1.05rem', color: '#475569', lineHeight: 1.75 }}>
                                        {stageData.description.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: '#0f172a' }}>{part}</strong> : part)}
                                    </p>
                                    <div style={{ paddingLeft: '1rem', borderLeft: `3px solid ${stageData.isFinal ? '#93c5fd' : '#bfdbfe'}` }}>
                                        <strong style={{ fontSize: '0.8rem', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mission Objectives</strong>
                                        <ul style={{ margin: '0.4rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.95rem', color: '#475569', listStyleType: 'disc', lineHeight: 1.7 }}>
                                            {stageData.objectives.map((obj, oidx) => (
                                                <li key={oidx}>{obj}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>,

                    <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '6rem' }}>
                        <button
                            onClick={handleNext}
                            style={{
                                background: '#0f172a',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                padding: '1.25rem 3rem',
                                borderRadius: '50px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(15, 23, 42, 0.3)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.2)';
                            }}
                        >
                            Continue to Industry Overview <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                        </button>
                    </div>
                </div>
            );
        }

        // ── Welcome Aboard Page ──────────────────────────────────────────────
        if (currentTopic === 'welcome') {
            return (
                <div style={{ maxWidth: '950px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '320px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                            MODULE 01 START
                        </div>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', marginBottom: '0', letterSpacing: '-0.02em' }}>
                            Welcome Aboard
                        </h1>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                        {/* Section 1 */}
                        <section style={{ textAlign: 'center', maxWidth: '56rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                INTRODUCTION
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Welcome to the Wingmentor Foundation Program
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                This program is engineered to provide you with the structure, support, and verifiable experience necessary to navigate the complexities of the aviation industry. We do not just prepare you to apply; we rigorously assess and calibrate your skills against active EBT (Evidence-Based Training) and CBTA standards, ensuring you are inherently airline-ready. Your journey towards command starts now.
                            </p>
                        </section>

                        {/* Section 2 - Elevated Card */}
                        <section style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '4rem 3rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                SUPPORT NETWORK
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                A Message From the Wingmentor Team
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto', maxWidth: '40rem' }}>
                                The entire WingMentor operational team is here to support you. We are a collective of active pilots, instructors, and industry professionals dedicated to your success. We manage the logistics, verify the experience, and leverage advanced tracking applications to ensure this program’s standards are upheld with unwavering integrity. Consider us—and the platform we’ve built—your ground crew, ready to keep your flight path clear and your objectives met.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                VISION & COMMITMENT
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                A Welcome From the Founders
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '42rem', margin: '0 auto' }}>
                                <p style={{ margin: 0 }}>
                                    On behalf of the entire Wingmentor team, we extend our warmest welcome. You have officially joined a dedicated Pilot Recognition Program committed to excellence, mutual support, and overcoming one of the industry's greatest challenges.
                                </p>
                                <p style={{ margin: 0 }}>
                                    You are now more than a pilot; you are a vital contributor to a movement that is reshaping the future of aviation careers. We operate with professionalism, integrity, and a relentless focus on our collective success. This handbook is your guide. Welcome aboard.
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '5rem', marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid #e2e8f0' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 700, color: '#0f172a', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '0.25rem' }}>BENJAMIN TIGER BOWLER</div>
                                    <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>FOUNDER</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 700, color: '#0f172a', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '0.25rem' }}>KARL BRIAN VOGT</div>
                                    <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>FOUNDER</div>
                                </div>
                            </div>
                        </section>

                        {/* Section 4 - Ecosystem Overview */}
                        <section style={{ textAlign: 'center', width: '100%', maxWidth: '56rem' }}>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                THE ECOSYSTEM
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                Your Digital Footprint
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.08rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '44rem' }}>
                                WingMentor is not an agency—it is a complete ecosystem designed to put you in control. As you progress through the Foundation Program, every assessment, evaluation, and milestone is tracked. This data culminates in your Pilot Recognition Profile—an ATLAS-compliant, verified portfolio. We do not just send your resume into the void. Our proprietary AI-driven Pathways system actively matches your verified profile with the exact, current requirements of our airline partners. You do the work; we ensure the industry sees it.
                            </p>
                        </section>

                        {/* Quote Block */}
                        <section style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '4rem 3rem', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'center', width: '100%', boxSizing: 'border-box', marginTop: '1rem' }}>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                                <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '160px', height: 'auto', objectFit: 'contain' }} />
                            </div>
                            <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                OUR PHILOSOPHY
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                The Experience Paradox
                            </h2>
                            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '44rem', fontStyle: 'italic' }}>
                                "We couldn't stand by and watch qualified pilots give up. The gap in the industry isn't a lack of talent; it's a lack of opportunity. WingMentor is our answer to the 'experience paradox'—providing a structured environment where pilots can prove their worth and keep their dreams alive. By transforming your raw potential into verified, actionable data, we are shifting the balance of power. We are building a system where airlines come looking for you."
                            </p>
                        </section>

                        <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '6rem' }}>
                            <button
                                onClick={handleNext}
                                style={{
                                    background: '#2563eb',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    padding: '1.25rem 3rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(37, 99, 235, 0.4)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                                }}
                            >
                                Continue to Our Mission <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // ── Page: initial-exam-access ─────────────────────────────────────────
        if (currentTopic === 'initial-exam-access') {
            return (
                <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            CHAPTER 2 — THE SOLUTION
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 400, color: '#0f172a', fontFamily: 'Georgia, serif', marginBottom: '1.25rem' }}>
                            Initial Examination Access
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                            Stage 1 of your WingMentor Foundational Program begins here.
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', padding: '3.5rem 3rem', boxShadow: '0 8px 32px rgba(15,23,42,0.06)', border: '1px solid rgba(226,232,240,0.8)', marginBottom: '2rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                            EXAMINATION PORTAL
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#0f172a', fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>
                            Access Your WingMentor Foundational Examination
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                            You can access your <strong>Initial Examination</strong> for the WingMentor Foundational Program directly through this portal. This is your official examination — the results are recorded in the Global Industry Registry as your first verified skills record. Ensure you have thoroughly studied the Chapter 1 material and completed your W1000 practice sessions before proceeding.
                        </p>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                            When you are ready, click the button below to begin. The examination will assess your academic bridge knowledge and industry comprehension against integrated <strong>FAA / CAAP</strong> standards.
                        </p>

                        {/* Callout */}
                        <div style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #2563eb', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '2.5rem', fontSize: '0.95rem', color: '#1e40af', lineHeight: 1.6 }}>
                            <strong>Important:</strong> This is your official WingMentor examination — not the W1000 practice terminal. Your score will be formally recorded and will serve as your first milestone within the program.
                        </div>

                        {/* CTA Button */}
                        <div style={{ textAlign: 'center' }}>
                            <a
                                href="/examination"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    padding: '1.1rem 2.75rem',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    boxShadow: '0 10px 28px rgba(37,99,235,0.35)',
                                    transition: 'all 0.3s ease',
                                    letterSpacing: '0.02em',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 16px 36px rgba(37,99,235,0.45)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 28px rgba(37,99,235,0.35)';
                                }}
                            >
                                <Icons.FileText style={{ width: 20, height: 20 }} />
                                Begin Initial Examination
                            </a>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2.5rem', paddingBottom: '2rem' }}>
                        <button
                            onClick={onNavigateToMentorModules}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                padding: '1rem 2.5rem',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                boxShadow: '0 8px 24px rgba(2,132,199,0.3)',
                                transition: 'all 0.3s ease',
                                letterSpacing: '0.02em',
                                border: 'none',
                                cursor: 'pointer',
                                marginBottom: '2rem'
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(2,132,199,0.4)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(2,132,199,0.3)';
                            }}
                        >
                            <Icons.ArrowRight style={{ width: 18, height: 18 }} />
                            Go to Module 2 Mentorship
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '0', paddingBottom: '4rem' }}>
                        <button
                            onClick={handleNext}
                            style={{
                                background: 'transparent',
                                color: '#64748b',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                padding: '0.75rem 2rem',
                                borderRadius: '50px',
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            Continue <Icons.ArrowRight style={{ width: 18, height: 18 }} />
                        </button>
                    </div>
                </div>
            );
        }

        switch (currentChapter) {
            case 0:
                return <PilotGapModuleChapter0 onBack={onBack} />;

            case 1:
                return <PilotGapModuleChapter1 onBack={onBack} />;

            case 2:
                return <PilotGapModuleChapter2 onBack={onBack} />;
        }
        
        return null;
    };

    return (
        <div
            style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', position: 'relative' }}
            onContextMenu={handleContentContextMenu}
            onBlur={(e) => {
                const blurred = e.target as HTMLElement;
                if (blurred.contentEditable === 'true') commitEdit(blurred);
            }}
        >
            {/* ── Right-click context menu ── */}
            {contextMenu && (
                <div
                    ref={contextMenuRef}
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 9999,
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px -5px rgba(15,23,42,0.15), 0 4px 10px -3px rgba(15,23,42,0.08)',
                        overflow: 'hidden',
                        minWidth: '160px',
                        animation: 'fadeIn 0.12s ease-out',
                    }}
                >
                    <button
                        onClick={startEdit}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            width: '100%',
                            padding: '0.625rem 1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#1e293b',
                            textAlign: 'left',
                            transition: 'background 0.15s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#eff6ff')}
                        onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Text
                    </button>
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0 0.5rem' }} />
                    <button
                        onClick={closeContextMenu}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            width: '100%',
                            padding: '0.625rem 1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#64748b',
                            textAlign: 'left',
                            transition: 'background 0.15s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Cancel
                    </button>
                </div>
            )}

            {/* ── Editing active tooltip ── */}
            {editingEl && (
                <div style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1e293b',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                    animation: 'fadeIn 0.2s ease-out',
                    pointerEvents: 'none',
                }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                    Editing — click away or press <kbd style={{ background: '#334155', padding: '0.1rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>Esc</kbd> to finish
                </div>
            )}
            {/* Minimal Header */}
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain' }} />
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Reading</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Module 01: Industry Familiarization & Indoctrination</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '2px' }}>
                            {currentChapter === 0 ? 'Overview' : `Chapter ${String(currentChapter).padStart(2, '0')}`}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '200px', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.3s ease-out' }}></div>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{Math.round(progress)}% Complete</span>
                </div>
            </header>

            {/* Main Layout wrapper for sidebar and content */}
            <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
                {/* Module Viewer Sidebar */}
                <aside style={{ width: '320px', flexShrink: 0, backgroundColor: 'white', borderRight: '1px solid #e2e8f0', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '104px', height: 'calc(100vh - 104px)', overflowY: 'auto' }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0',
                            marginBottom: '0',
                            border: 'none',
                            background: 'transparent',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.2s',
                            width: 'fit-content'
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.color = '#0f172a';
                            e.currentTarget.style.transform = 'translateX(-4px)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
                        Exit Module
                    </button>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Module Viewer</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {([
                            { title: 'Welcome Aboard', id: 0 },
                            { title: 'Our Mission', id: 0 },
                            { title: 'The Differences', id: 0 },
                            { title: 'Program Syllabus', id: 0 },
                            { title: 'Introduction & Overview', id: 0 },
                            {
                                title: 'The "What"', id: 1,
                                topics: [
                                    { label: 'What is a Low-Timer Pilot?', slug: 'what-low-timer' },
                                    { label: 'The Pilot Shortage & Paradox', slug: 'what-pilot-shortage' },
                                    { divider: true },
                                    { label: 'What is the Pilot Gap?', slug: 'what-pilot-gap' },
                                    { label: 'What is Pilot Risk Management?', slug: 'pilot-risk-management' },
                                    { label: 'What is Pilot Recognition?', slug: 'what-pilot-recognition' },
                                    { label: 'What Now?', slug: 'what-now' },

                                ],
                            },
                            {
                                title: 'The "Solution"', id: 2,
                                topics: [
                                    { label: 'Initial Examinations for the Foundational Program', slug: 'why-statistics' },
                                    { label: 'Application Walkthrough & Guide', slug: 'w1000-poh' },
                                    { label: 'Initial Examination Access', slug: 'initial-exam-access' },
                                ]
                            },

                        ] as Array<{ title: string; id: number; topics?: Array<{ label: string; slug: string }> }>)
                            .map((item, index) => {
                                const hasTopics = item.topics && item.topics.length > 0;
                                const isTopicActive = currentTopic && hasTopics && item.topics!.some(t => t.slug === currentTopic);
                                const isChapterHubActive = !currentTopic && currentChapter === item.id && (item.title === 'Introduction & Overview' || item.id !== 0);
                                const isDirectPageActive = currentTopic && !hasTopics && (
                                    (item.title === 'Welcome Aboard' && currentTopic === 'welcome') ||
                                    (item.title === 'Our Mission' && currentTopic === 'mission') ||
                                    (item.title === 'The Differences' && currentTopic === 'difference') ||
                                    (item.title === 'Program Syllabus' && currentTopic === 'program-syllabus')
                                );
                                const isHighlighted = isTopicActive || isChapterHubActive || isDirectPageActive;

                                return (
                                    <li key={index}>
                                        <button
                                            onClick={() => { 
                                                if (item.title === 'Solutions - Mentor Training') {
                                                    // Navigate to Module 2 file
                                                    window.location.href = '/module2';
                                                } else {
                                                    setCurrentChapter(item.id);
                                                    setCurrentTopic(null);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '0.65rem 1rem',
                                                borderRadius: '10px',
                                                backgroundColor: isHighlighted ? 'rgba(37,99,235,0.08)' : 'transparent',
                                                color: isHighlighted ? '#0f172a' : '#475569',
                                                fontWeight: isHighlighted ? 600 : 500,
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                borderLeft: isHighlighted ? '3px solid #2563eb' : '3px solid transparent',
                                                fontSize: '0.9rem'
                                            }}
                                            onMouseOver={(e) => { if (!isHighlighted) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                            onMouseOut={(e) => { if (!isHighlighted) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        >
                                            {item.title}
                                        </button>

                                        {/* Sub-topics — shown when this chapter is active and has topics */}
                                        {hasTopics && currentChapter === item.id && (
                                            <ul style={{ listStyle: 'none', padding: '0.25rem 0 0.25rem 1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                                                {item.topics!.map(topic => {
                                                    const isTopicActive = currentTopic === topic.slug;
                                                    return (
                                                        <li key={topic.slug}>
                                                            <button
                                                                onClick={() => { 
                                                                    if (item.title === 'Solutions - Mentor Training') {
                                                                        // Navigate to Module 2 file
                                                                        window.location.href = '/module2';
                                                                    } else {
                                                                        setCurrentTopic(topic.slug);
                                                                    }
                                                                }}
                                                                style={{
                                                                    display: 'block', width: '100%', textAlign: 'left',
                                                                    padding: '0.5rem 0.75rem', borderRadius: '6px',
                                                                    backgroundColor: isTopicActive ? '#dbeafe' : 'transparent',
                                                                    color: isTopicActive ? '#1d4ed8' : '#64748b',
                                                                    fontWeight: isTopicActive ? 600 : 400,
                                                                    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                                                                    fontSize: '0.8125rem',
                                                                    borderLeft: isTopicActive ? '2px solid #1d4ed8' : '2px solid transparent',
                                                                }}
                                                                onMouseOver={e => { if (!isTopicActive) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                                                                onMouseOut={e => { if (!isTopicActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                            >
                                                                {topic.label}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                    </ul>
                </aside>


                <main style={{ flex: 1, padding: '4rem 2rem', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                        {renderChapterContent()}

                        {/* Pagination Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
                            <button
                                onClick={handlePrev}
                                disabled={currentChapter === 0}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    backgroundColor: currentChapter === 0 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.05)',
                                    color: currentChapter === 0 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.35)',
                                    border: `1px solid ${currentChapter === 0 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: currentChapter === 0 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backdropFilter: 'blur(20px) saturate(100%)',
                                    WebkitBackdropFilter: 'blur(20px) saturate(100%)',
                                    opacity: currentChapter === 0 ? 0.5 : 1,
                                }}
                                onMouseEnter={e => {
                                    if (currentChapter !== 0) {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.6)';
                                        e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.12)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (currentChapter !== 0) {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.35)';
                                        e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.06)';
                                    }
                                }}
                            >
                                <Icons.ArrowLeft style={{ width: 24, height: 24 }} />
                            </button>

                            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                                Page {currentChapter + 1} of {totalChapters}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentChapter === totalChapters - 1}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    backgroundColor: currentChapter === totalChapters - 1 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.05)',
                                    color: currentChapter === totalChapters - 1 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.35)',
                                    border: `1px solid ${currentChapter === totalChapters - 1 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: currentChapter === totalChapters - 1 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backdropFilter: 'blur(20px) saturate(100%)',
                                    WebkitBackdropFilter: 'blur(20px) saturate(100%)',
                                    opacity: currentChapter === totalChapters - 1 ? 0.5 : 1,
                                }}
                                onMouseEnter={e => {
                                    if (currentChapter !== totalChapters - 1) {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.6)';
                                        e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.12)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (currentChapter !== totalChapters - 1) {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.35)';
                                        e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.06)';
                                    }
                                }}
                            >
                                <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Bottom Advocacy Banner */}
            < div style={{ backgroundColor: '#0f172a', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', margin: '0 0 1rem 0' }}>Industry Credibility Starts Here</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>Building the future of Pilot Quality Assurance.</p>
                <div style={{ display: 'inline-block' }}>
                    <button
                        onClick={onBack}
                        style={{
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 3rem',
                            borderRadius: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PilotGapModulePage;
