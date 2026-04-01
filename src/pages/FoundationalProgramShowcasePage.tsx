import React from 'react';
import { Icons } from '../icons';
import type { UserProfile } from '../types/user';
import { RestrictionPage } from './RestrictionPage';

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

interface FoundationalProgramShowcasePageProps {
    onBack?: () => void;
    onStartEnrollment?: () => void;
    onLaunchW1000?: () => void;
    onLaunchMentorship?: () => void;
    onLaunchModule01?: () => void;
    onLaunchModule02?: () => void;
    onLaunchModule03?: () => void;
    completedModules?: string[];
    userProfile?: UserProfile | null;
}

const modules: Module[] = [
    {
        id: 'stage-1',
        number: '01',
        title: 'Initial Program Module',
        bullets: ['Industry Status', 'Pilot Gap Analysis', 'Indoctrination Protocols'],
        description: 'Begin with a transparent look at the hiring gap, risk factors, and why Airbus partners expect WingMentor cadets to follow this sequence.',
        status: 'In Progress',
        badge: 'In Progress',
        badgeColor: '#ecfdf5',
        icon: 'Book'
    },
    {
        id: 'stage-2',
        number: '02',
        title: 'Initial Examination Module',
        bullets: ['Academic Bridge Knowledge', 'Baseline Retention', 'Skills Record'],
        description: 'Demonstrate NOTECHS awareness and CRM insight before touching mentorship hours.',
        status: 'Examination',
        icon: 'FileText'
    },
    {
        id: 'stage-3',
        number: '03',
        title: 'Global Industry Registry',
        bullets: ['Centralized Record', 'Recruitment Transparency', 'Recognition Metrics'],
        description: 'Every milestone feeds the WingMentor registry so recruiters see real evidence, not anecdotes.',
        icon: 'Book'
    },
    {
        id: 'stage-4',
        number: '04',
        title: 'Mentorship Module',
        bullets: ['Mentorship Fundamentals', 'Psychological Awareness', 'Peer Observation'],
        description: 'Shift from instructor to mentor—CRM empathy, prescription notes, and Airbus-aligned coaching.',
        icon: 'Users'
    },
    {
        id: 'stage-5',
        number: '05',
        title: 'Pre-Mentorship Examination',
        bullets: ['Mentorship Prep Exam', 'Practical Interview', 'Observation Requirement'],
        description: 'Verify readiness through observation logs and interviews before supervised mentorship.',
        status: 'Examination',
        icon: 'Activity'
    },
    {
        id: 'stage-6',
        number: '06',
        title: 'Supervised Mentorship',
        bullets: ['20-Hour Goal', 'Objective Logging', 'Consultation Delivery'],
        description: 'Execute 20 hours with strict logging that feeds the WingMentor analytics layer.',
        badge: '20h Milestone',
        badgeColor: '#fff7ed',
        icon: 'Award',
        onLaunch: undefined
    },
    {
        id: 'stage-7',
        number: '07',
        title: 'Accreditation & Professional Prescription',
        bullets: ['Mentorship Evaluation', 'Industry Credentials', 'Advanced Placement'],
        description: 'Convert hours into accredited prescriptions recognizable across partner airlines.',
        badge: 'Accreditation',
        badgeColor: '#ecfdf5',
        icon: 'Briefcase'
    },
    {
        id: 'stage-8',
        number: '08',
        title: 'Advanced Mentorship & Leadership',
        bullets: ['50-Hour Milestone', 'Instruction Prep', 'Ecosystem Leadership'],
        description: 'Extend to 50 hours to establish leadership credibility and mentorship resilience.',
        badge: '50h Milestone',
        badgeColor: '#f0f9ff',
        icon: 'Award'
    },
    {
        id: 'stage-9',
        number: '09',
        title: 'AIRBUS Recognition Interview',
        bullets: ['Industry Evaluation', 'Recognition Panel', 'Placement Prep'],
        description: 'Final audit with Airbus-aligned reviewers validating your WingMentor data trail.',
        status: 'Examination',
        badge: 'Final Evaluation',
        badgeColor: '#f0f9ff',
        icon: 'Activity'
    },
    {
        id: 'stage-10',
        number: '10',
        title: 'WingMentor Certification & Recognition',
        bullets: ['Final Accreditation', 'Industry Endorsement', 'Registry Verification'],
        description: 'Publish your record to the WingMentor registry for partner visibility and placements.',
        badge: 'Certified',
        badgeColor: '#e0f2fe',
        icon: 'CheckCircle'
    }
];

const highlightStats = [
    {
        label: 'Program Chapters',
        value: '12 Modules',
        detail: 'Every briefing stacks Airbus-aligned NOTECHS analytics and mentorship hours.'
    },
    {
        label: 'Mentorship & Sim Time',
        value: '40+ Hours',
        detail: 'Structured simulator prescriptions plus supervised mentorship logging.'
    },
    {
        label: 'Recognition Path',
        value: 'Airbus Validated',
        detail: 'Evidence flows directly into the Airbus recognition interview readiness pack.'
    }
];

const overviewCards = [
    {
        tag: '1 · Context',
        title: 'The Pilot Gap',
        description: 'Extended hiring cycles and low-time plateaus create a credibility gap. WingMentor keeps cadets active with auditable hours.',
        image: 'https://lh3.googleusercontent.com/d/1jL8lgdJZgdMrzUJkhvDOrlb1S8s7dEb4'
    },
    {
        tag: '2 · Approach',
        title: 'WingMentorship Framework',
        description: 'Simulator, mentorship, and NOTECHS data are orchestrated so airlines trust the evidence, not just flight hours.',
        image: 'https://lh3.googleusercontent.com/d/1hHcJHmG0pTPDuvgiv79l88VpPz_lOXi1'
    },
    {
        tag: '3 · Recognition',
        title: 'Pilot Advocacy',
        description: 'Evidence is syndicated to the WingMentor registry and partner dashboards for instant shortlist decisions.',
        image: 'https://lh3.googleusercontent.com/d/1MfE9fiot6b9kCpgwQfc4aUY6e317nrUj'
    }
];

const FoundationalProgramShowcasePage: React.FC<FoundationalProgramShowcasePageProps> = ({
    onBack,
    onStartEnrollment,
    onLaunchMentorship,
    onLaunchModule01,
    onLaunchModule02,
    onLaunchModule03,
    onLaunchW1000,
    completedModules = [],
    userProfile
}) => {
    const displayName =
        (userProfile?.displayName && userProfile.displayName.trim()) ||
        [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ').trim() ||
        userProfile?.email ||
        'Pilot';

    const checkProgramAccess = () => {
        if (!userProfile) return true;
        const foundationalAccess = userProfile.appAccess?.find(access => access.appId === 'foundational');
        if (!foundationalAccess) return true;
        return foundationalAccess.granted && !foundationalAccess.restricted;
    };

    if (!checkProgramAccess()) {
        return (
            <RestrictionPage
                onBack={() => onBack?.() || (() => {})}
                userProfile={userProfile!}
                programName="Foundational Program"
                restrictionReason="Your access to the Foundational Program has been restricted by an administrator. Please contact your mentor or program administrator for assistance."
            />
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'radial-gradient(circle at top, #f8fbff 0%, #eef2ff 45%, #f8fafc 100%)'
            }}
        >
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '3rem clamp(1.5rem, 5vw, 4rem) 5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => onBack?.()}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.25rem',
                            borderRadius: '999px',
                            border: '1px solid rgba(148, 163, 184, 0.4)',
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(12px)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#475569',
                            cursor: 'pointer',
                            boxShadow: '0 15px 35px rgba(15,23,42,0.12)'
                        }}
                    >
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Programs
                    </button>
                </div>

                <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px', height: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                    <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.85rem' }}>
                        Foundational Program
                    </div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.1rem)', fontWeight: 400, color: '#0f172a', marginBottom: '0.85rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                        Guided Orientation
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '38rem', margin: '0 auto' }}>
                        Follow the same cadence as our public news hub—logo header, floating hero, highlight pills, and a single CTA. That continuity is intentional for cadets and partners alike.
                    </p>
                </section>

                <div
                    style={{
                        borderRadius: '28px',
                        overflow: 'hidden',
                        background: 'white',
                        border: '1px solid rgba(15,23,42,0.08)',
                        boxShadow: '0 20px 50px rgba(15,23,42,0.12)',
                        marginBottom: '2.5rem'
                    }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 360px', padding: '2.25rem 2.5rem', minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <span style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: '#2563eb',
                                    background: 'rgba(37,99,235,0.14)',
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '999px'
                                }}>
                                    Orientation Briefing
                                </span>
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Airbus-aligned</span>
                            </div>
                            <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.01em' }}>
                                The First Chapter of Recognition
                            </h2>
                            <p style={{ margin: '0.85rem 0 1.5rem', color: '#475569', lineHeight: 1.65 }}>
                                Cadets step into the program with the exact structure seen on our announcements page—tagged chips, floating commentary, and a focused CTA.
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.5rem' }}>
                                {['12 Modules', '40+ Simulator Hours', 'Beginner Friendly'].map((tag) => (
                                    <span key={tag} style={{ padding: '0.45rem 1rem', borderRadius: '999px', background: '#eff4ff', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>{tag}</span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button
                                    style={{
                                        padding: '0.85rem 2.5rem',
                                        borderRadius: '999px',
                                        border: 'none',
                                        background: 'linear-gradient(120deg, #0f172a, #1d4ed8)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: '0 18px 35px rgba(37,99,235,0.35)'
                                    }}
                                    onClick={() => onStartEnrollment?.()}
                                >
                                    Begin Enrollment
                                </button>
                                <button
                                    style={{
                                        padding: '0.85rem 2.5rem',
                                        borderRadius: '999px',
                                        border: '1px solid rgba(15,23,42,0.2)',
                                        background: 'transparent',
                                        color: '#0f172a',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => onLaunchW1000?.()}
                                >
                                    Launch W1000 App
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: '1 1 320px', minHeight: '360px', position: 'relative', background: '#0f172a' }}>
                            <div style={{ position: 'absolute', top: '18px', right: '18px', background: 'rgba(15,23,42,0.9)', color: 'white', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', letterSpacing: '0.08em', zIndex: 2 }}>
                                Orientation Stream
                            </div>
                            <iframe
                                title="Foundational Program Orientation"
                                src="https://www.youtube.com/embed/7oswD6v1u4w"
                                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
                    {highlightStats.map((stat) => (
                        <div
                            key={stat.label}
                            style={{
                                padding: '1.2rem',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(148,163,184,0.2)',
                                boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.4rem' }}>
                                {stat.label}
                            </div>
                            <div style={{ fontSize: '1.35rem', fontFamily: 'Georgia, serif', color: '#0f172a', marginBottom: '0.4rem' }}>{stat.value}</div>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>{stat.detail}</p>
                        </div>
                    ))}
                </div>

                <section style={{ marginBottom: '4rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
                            Orientation Overview
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', fontWeight: 400, color: '#0f172a', marginBottom: '0.75rem' }}>
                            How WingMentor Bridges the Pilot Gap
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, maxWidth: '38rem', margin: '0 auto' }}>
                            A transparent roadmap outlining why the Foundational Program exists, how it operates, and what recognition pilots gain along the way.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {overviewCards.map((card) => (
                            <div
                                key={card.title}
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '1.5rem',
                                    padding: '1.75rem',
                                    borderRadius: '24px',
                                    background: 'rgba(255,255,255,0.85)',
                                    border: '1px solid rgba(148,163,184,0.2)',
                                    boxShadow: '0 15px 45px rgba(15,23,42,0.08)'
                                }}
                            >
                                <div style={{ flex: '1 1 320px' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                                        {card.tag}
                                    </div>
                                    <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.01em' }}>
                                        {card.title}
                                    </h3>
                                    <p style={{ margin: '0.85rem 0 1.5rem', color: '#475569', lineHeight: 1.65 }}>
                                        {card.description}
                                    </p>
                                </div>
                                <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FoundationalProgramShowcasePage;