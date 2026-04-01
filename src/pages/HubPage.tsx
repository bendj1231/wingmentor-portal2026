import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import type { UserProfile } from '../types/user';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface HubPageProps {
    onSelectCategory: (category: 'programs' | 'pathways' | 'applications') => void;
    onLogout: () => void;
    userProfile?: UserProfile | null;
    onMentorManagement?: () => void;
    onRecognition?: () => void;
}

const PilotPortfolioCard: React.FC<{ onClick: () => void; userProfile?: UserProfile | null }> = ({ onClick, userProfile }) => {
    const [totalHours, setTotalHours] = useState(0);
    const [picHours, setPicHours] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogbookHours = async () => {
            if (!userProfile?.id || !db) {
                setLoading(false);
                return;
            }

            try {
                const logsQuery = query(
                    collection(db, 'flightLogs'),
                    where('userId', '==', userProfile.id)
                );
                const snapshot = await getDocs(logsQuery);
                let total = 0;
                let pic = 0;

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const hours = data.hours || 0;
                    total += hours;
                    if (data.category?.toLowerCase() === 'pic' || data.category?.toLowerCase() === 'solo') {
                        pic += hours;
                    }
                });

                setTotalHours(total);
                setPicHours(pic);
            } catch (error) {
                console.error('Error fetching logbook hours:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogbookHours();
    }, [userProfile?.id]);

    return (
    <div
        className="pilot-portfolio-card"
        style={{
            cursor: 'pointer',
            padding: '1.5rem',
            borderRadius: '18px',
            background: 'linear-gradient(180deg, #f8fbff 0%, rgba(248, 250, 252, 0.8) 60%, #f5f7fb 100%)',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(255,255,255,0.8)' ,
            position: 'relative',
            overflow: 'hidden'
        }}
        onClick={onClick}
    >
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.25rem 0.75rem', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.3)', background: 'rgba(240, 249, 255, 0.9)', fontSize: '0.75rem', fontWeight: 600, color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Icons.CheckCircle style={{ width: 16, height: 16 }} />
            VERIFIED IDENTITY
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '36px', width: 'auto', marginBottom: '0.5rem' }} />
            <p style={{ margin: 0, letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 600, color: '#2563eb' }}>PILOT RECOGNITION PROFILE</p>
            <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.75rem', color: '#0f172a' }}>Pilot Portfolio</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Unified tracking, credentials, and assessments</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '1rem' }}>
            <div style={{ flex: '1 1 140px', background: 'white', borderRadius: '16px', padding: '1rem', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#0f172a', color: 'white', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        BB
                    </div>
                </div>
                <p style={{ margin: '0.5rem 0 0', textAlign: 'center', fontWeight: 600, color: '#0f172a' }}>Benjamin Bowler</p>
                <p style={{ margin: '0.25rem 0', textAlign: 'center', fontSize: '0.75rem', color: '#2563eb', letterSpacing: '0.1em' }}>Student Pilot</p>
                <p style={{ margin: 0, textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>Base: EGLL (London Heathrow)</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', padding: '0.75rem', marginRight: '0.4rem' }}>
                        <p style={{ margin: 0, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Study HR</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>2</p>
                    </div>
                    <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', padding: '0.75rem', marginLeft: '0.4rem' }}>
                        <p style={{ margin: 0, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Exam HR</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>0</p>
                    </div>
                </div>
            </div>
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '16px', padding: '1rem', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>Pilot Credentials</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '0.65rem', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Total HR</p>
                        <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{loading ? '...' : totalHours.toFixed(1)}</p>
                    </div>
                    <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '0.65rem', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>PIC HR</p>
                        <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{loading ? '...' : picHours.toFixed(1)}</p>
                    </div>
                </div>
                <div style={{ marginTop: '0.75rem', borderRadius: '12px', background: totalHours > 0 ? '#f0fdf4' : '#fef3c7', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: totalHours > 0 ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                        {totalHours > 0 ? 'Hours Verified' : 'Hours Pending Verification'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.75rem', color: '#0f172a' }}>
                        <span>Type</span>
                        <strong>Student Pilot</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#0f172a' }}>
                        <span>Status</span>
                        <strong style={{ color: totalHours > 0 ? '#059669' : '#d97706' }}>
                            {totalHours > 0 ? 'Active' : 'Pending'}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export const HubPage: React.FC<HubPageProps> = ({ onSelectCategory, onLogout, userProfile, onMentorManagement, onRecognition }) => {
    return (
        <div className="dashboard-container animate-fade-in">
            <main className="dashboard-card" style={{ position: 'relative' }}>
                <button className="platform-logout-btn" onClick={onLogout}>
                    <Icons.LogOut style={{ width: 16, height: 16 }} />
                    Logout
                </button>
                <div className="dashboard-header">
                    <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="WingMentor Logo" />
                    </div>
                    <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
                    <h1 className="dashboard-title">Wingmentor Network</h1>
                    <p>
                        Welcome to the central portal. Select a category below to explore our mentorship programs, structured pathways, and required applications.
                    </p>
                </div>

                <section className="dashboard-section" style={{ marginTop: '2rem' }}>
                    <div className="cards-list">
                        <div className="horizontal-card" style={{ cursor: 'pointer', padding: '1rem 2rem' }} onClick={() => onSelectCategory('programs')}>
                            <div className="horizontal-card-content-wrapper">
                                <div style={{ maxWidth: '70%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Programs</h3>
                                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                                            Access Foundational and Transition mentorship programs designed to refine your core mechanics and CRM skills through high-fidelity simulator practice.
                                        </p>
                                    </div>
                                </div>
                                <div className="hub-card-arrow">
                                    <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                                </div>
                            </div>
                            <img src="/wingmentor-approach-gap.png" alt="Programs" className="hub-card-bg-image" />
                        </div>

                        <div className="horizontal-card" style={{ cursor: 'pointer', padding: '1rem 2rem' }} onClick={() => onSelectCategory('pathways')}>
                            <div className="horizontal-card-content-wrapper">
                                <div style={{ maxWidth: '70%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pathways</h3>
                                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                                            View structured career roadmaps including the Emirates ATPL, Commercial, and Air Taxi tracks.
                                        </p>
                                    </div>
                                </div>
                                <div className="hub-card-arrow">
                                    <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                                </div>
                            </div>
                            <img src="/pilot-gap-pathways.png" alt="Pathways" className="hub-card-bg-image" />
                        </div>

                        {/* Recognition Card */}
                        <div className="horizontal-card" style={{ cursor: 'pointer', padding: '1rem 2rem' }} onClick={onRecognition}>
                            <div className="horizontal-card-content-wrapper">
                                <div style={{ maxWidth: '70%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                    <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recognition & Achievements</h3>
                                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                                            View your awards, flight hours, certifications, and professional milestones earned through your training journey.
                                        </p>
                                    </div>
                                </div>
                                <div className="hub-card-arrow">
                                    <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                                </div>
                            </div>
                            <img src="/recogntion.png" alt="Recognition" className="hub-card-bg-image" />
                        </div>

                        <PilotPortfolioCard onClick={() => onSelectCategory('applications')} userProfile={userProfile} />

                        {/* Mentor Management Card - Only for Super Admins */}
                        {userProfile?.role === 'super_admin' && onMentorManagement && (
                            <div className="horizontal-card" style={{ cursor: 'pointer', padding: '1rem 2rem', border: '2px solid #ef4444' }} onClick={onMentorManagement}>
                                <div className="horizontal-card-content-wrapper">
                                    <div style={{ maxWidth: '70%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                                        <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mentor Management</h3>
                                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                                                Manage users, control app access, and oversee the entire WingMentor platform. Super Admin panel.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hub-card-arrow">
                                        <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                                    </div>
                                </div>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    right: 0, 
                                    background: '#ef4444', 
                                    color: 'white', 
                                    padding: '0.25rem 0.75rem', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 600,
                                    borderBottomLeftRadius: '8px'
                                }}>
                                    ADMIN
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <div className="dashboard-footer" style={{
                    marginTop: '3.5rem',
                    padding: '2rem 2.5rem',
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {/* Help Section */}
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            Need assistance navigating the platform or understanding your requirements?
                        </p>
                    <button
                        className="help-btn"
                        style={{
                            padding: '0.625rem 1.5rem',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                        }}
                    >
                        Access Help Directory
                    </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
