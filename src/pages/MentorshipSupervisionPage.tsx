import React, { useState } from 'react';

// Shared Icons from the established design system
const Icons = {
    Clock: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    Activity: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    ),
    MessageSquare: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    Zap: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
    Mic: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
    ),
    Plus: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="15 18 9 12 15 6" />
        </svg>
    ),
    Award: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
    )
};

interface Session {
    id: string;
    date: string;
    duration: number; // minutes
    type: 'In-person' | 'Online';
    mentee: string;
    skills: {
        problemSolving: number;
        consultation: number;
        communication: number;
    };
}

interface MentorshipSupervisionPageProps {
    onBack: () => void;
    onLogout: () => void;
}

export const MentorshipSupervisionPage: React.FC<MentorshipSupervisionPageProps> = ({ onBack, onLogout }) => {
    const [sessions] = useState<Session[]>([
        {
            id: '1',
            date: '2026-02-24',
            duration: 90,
            type: 'Online',
            mentee: 'Candidate Foxtrot',
            skills: { problemSolving: 85, consultation: 70, communication: 92 }
        },
        {
            id: '2',
            date: '2026-02-25',
            duration: 120,
            type: 'In-person',
            mentee: 'Candidate Delta',
            skills: { problemSolving: 78, consultation: 88, communication: 85 }
        }
    ]);

    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const totalHoursNum = parseFloat((totalMinutes / 60).toFixed(1));
    const targetHours = 50;
    const supervisionMilestone = 20;
    const progressPercent = Math.min((totalHoursNum / targetHours) * 100, 100);
    const isOfficialMentor = totalHoursNum >= supervisionMilestone;

    const avgSkills = {
        problemSolving: Math.round(sessions.reduce((acc, s) => acc + s.skills.problemSolving, 0) / sessions.length),
        consultation: Math.round(sessions.reduce((acc, s) => acc + s.skills.consultation, 0) / sessions.length),
        communication: Math.round(sessions.reduce((acc, s) => acc + s.skills.communication, 0) / sessions.length)
    };

    // Interview Metrics (Simulated/Ready for implementation)
    const interviewMetrics = {
        behavioral: 88,
        constructivism: 75,
        cognitive: 82
    };

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2.5rem',
                padding: '1.5rem 2rem',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: '#f1f5f9',
                            border: 'none',
                            padding: '0.6rem',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    >
                        <Icons.ChevronLeft style={{ width: 24, height: 24, color: '#475569' }} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>Mentorship Certification</h1>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Module 05 • {isOfficialMentor ? 'Official Mentor Status Registered' : 'Supervision Phase'}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {isOfficialMentor && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#fefce8',
                            border: '1px solid #fde047',
                            borderRadius: '12px',
                            color: '#854d0e',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                        }}>
                            <Icons.Award style={{ width: 18, height: 18 }} />
                            Official Mentor
                        </div>
                    )}
                    <button
                        onClick={onLogout}
                        style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >Sign Out</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Progress Card */}
                    <section style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                                <div>
                                    <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Certification Path</p>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalHoursNum} <span style={{ fontSize: '1.25rem', color: '#64748b' }}>/ {targetHours} Hrs</span></h2>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ opacity: totalHoursNum >= 20 ? 1 : 0.4 }}>
                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>PHASE 01</p>
                                            <Icons.Zap style={{ width: 24, height: 24, color: '#fbbf24' }} />
                                        </div>
                                        <div style={{ opacity: totalHoursNum >= 50 ? 1 : 0.4 }}>
                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>PHASE 02</p>
                                            <Icons.Award style={{ width: 24, height: 24, color: '#3b82f6' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginBottom: '1rem', position: 'relative' }}>
                                <div style={{
                                    width: `${progressPercent}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                                    borderRadius: '10px',
                                    boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
                                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} />
                                {/* Milestone Marker */}
                                <div style={{
                                    position: 'absolute',
                                    left: '40%',
                                    top: '-4px',
                                    width: '2px',
                                    height: '20px',
                                    background: '#fbbf24',
                                    zIndex: 2
                                }}>
                                    <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.65rem', color: '#fbbf24', fontWeight: 700, marginBottom: '2px' }}>OFFICIAL MENTOR (20H)</div>
                                </div>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                Next Milestone: {totalHoursNum < 20 ? 'Reach 20 hours to become an Official Mentor.' : 'Reach 50 hours for Certification of Achievement and Interview entry.'}
                            </p>
                        </div>
                    </section>

                    {/* Certification Interview Dashboard */}
                    <section style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Certification Interview Analysis</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Core behavioral and cognitive analysis for verifiable certification.</p>
                            </div>
                            <span style={{
                                padding: '0.4rem 1rem',
                                backgroundColor: totalHoursNum >= 50 ? '#dcfce7' : '#f1f5f9',
                                color: totalHoursNum >= 50 ? '#16a34a' : '#94a3b8',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 700
                            }}>
                                {totalHoursNum >= 50 ? 'UNLOCKED' : 'LOCKED (Requires 50H)'}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', opacity: totalHoursNum >= 50 ? 1 : 0.6 }}>
                            {[
                                { title: 'Behavioral', score: interviewMetrics.behavioral, desc: 'Interview technique & adaptability', color: '#0ea5e9' },
                                { title: 'Constructivism', score: interviewMetrics.constructivism, desc: 'Knowledge building methods', color: '#8b5cf6' },
                                { title: 'Cognitive', score: interviewMetrics.cognitive, desc: 'Mental processing & agility', color: '#ec4899' }
                            ].map((core) => (
                                <div key={core.title} style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h4 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{core.title}</h4>
                                        <span style={{ color: core.color, fontWeight: 800 }}>{core.score}%</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>{core.desc}</p>
                                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                                        <div style={{ width: `${core.score}%`, height: '100%', background: core.color, borderRadius: '3px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skill Breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {[
                            { label: 'Problem Solving', value: avgSkills.problemSolving, color: '#3b82f6', icon: <Icons.Zap style={{ width: 20, height: 20 }} /> },
                            { label: 'Consultation', value: avgSkills.consultation, color: '#8b5cf6', icon: <Icons.Activity style={{ width: 20, height: 20 }} /> },
                            { label: 'Communication', value: avgSkills.communication, color: '#ec4899', icon: <Icons.MessageSquare style={{ width: 20, height: 20 }} /> }
                        ].map((metric) => (
                            <div key={metric.label} style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div style={{
                                        padding: '0.5rem',
                                        borderRadius: '10px',
                                        backgroundColor: `${metric.color}15`,
                                        color: metric.color
                                    }}>
                                        {metric.icon}
                                    </div>
                                    <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{metric.label}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{metric.value}%</span>
                                </div>
                                <div style={{ marginTop: '1rem', height: '6px', background: '#f1f5f9', borderRadius: '4px' }}>
                                    <div style={{ width: `${metric.value}%`, height: '100%', borderRadius: '4px', backgroundColor: metric.color }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Session Log */}
                    <section style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Recent Recordings</h3>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 1.25rem',
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer'
                            }}>
                                <Icons.Plus style={{ width: 18, height: 18 }} />
                                Log Completed Session
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sessions.map(session => (
                                <div key={session.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    border: '1px solid #f1f5f9',
                                    backgroundColor: '#ffffff',
                                    transition: 'all 0.2s ease'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
                                >
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{
                                            padding: '0.75rem',
                                            borderRadius: '12px',
                                            backgroundColor: session.type === 'Online' ? '#eff6ff' : '#f0fdf4',
                                            color: session.type === 'Online' ? '#2563eb' : '#16a34a'
                                        }}>
                                            <Icons.Clock style={{ width: 24, height: 24 }} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{session.mentee}</h4>
                                            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{session.date} • {session.duration} mins</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <div style={{ backgroundColor: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 600 }}>Skill Match: {Math.max(session.skills.problemSolving, session.skills.consultation)}%</div>
                                        </div>
                                        <button style={{ color: '#64748b', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>View Diffs</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* Sidebar: Monitoring & Recording */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{
                        background: '#ffffff',
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Icons.Mic style={{ width: 24, height: 24 }} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Recording Ready</h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            Start a live recording to analyze your speech patterns and leadership cores (Behavioral, Cognitive, Constructivism) in real-time.
                        </p>
                        <button style={{
                            width: '100%',
                            padding: '1rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                        }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'white' }} />
                            {totalHoursNum >= 50 ? 'Start Certification Interview' : 'Start Session Recording'}
                        </button>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        padding: '2rem',
                        borderRadius: '24px',
                        color: 'white'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Certification Status</h3>
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800 }}>{Math.round(progressPercent)}<span style={{ fontSize: '1.5rem' }}>%</span></div>
                            <p style={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>To Achievement Certificate</p>
                        </div>
                        <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '1.5rem 0' }} />
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Icons.Zap style={{ width: 14, height: 14 }} /> {isOfficialMentor ? 'Official Mentor Status' : 'Pending Mentor Status'}
                            </li>
                            <li style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Icons.Zap style={{ width: 14, height: 14 }} /> Data verifiable via WM-Central
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};
