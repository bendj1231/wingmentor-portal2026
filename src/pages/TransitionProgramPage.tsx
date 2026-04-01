import React, { useState } from 'react';
import { Icons } from '../icons';
import type { UserProfile } from '../types/user';
import { RestrictionPage } from './RestrictionPage';

interface Module {
    id: string;
    number: string;
    title: string;
    bullets: string[];
    description: string;
    status: string;
    badge: string;
    duration: string;
    difficulty: string;
}

interface TransitionProgramPageProps {
    onBack?: () => void;
    userProfile?: UserProfile | null;
}

export const TransitionProgramPage: React.FC<TransitionProgramPageProps> = ({ 
    onBack, 
    userProfile 
}) => {
    const [activeView, setActiveView] = useState<'cards' | 'core' | 'profile' | 'overview' | 'module-detail'>('cards');
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [hoveredModule, setHoveredModule] = useState<string | null>(null);

    // Check if user has access to transition program
    const checkProgramAccess = () => {
        if (!userProfile) return true; // Allow access if no profile (guest/preview mode)
        
        const transitionAccess = userProfile.appAccess?.find(access => access.appId === 'transition');
        if (!transitionAccess) {
            // If no specific access, check if it's required (it's not)
            return true; // Default to granted for non-required apps
        }
        
        return transitionAccess.granted && !transitionAccess.restricted;
    };

    // If access is restricted, show restriction page
    if (!checkProgramAccess()) {
        return (
            <RestrictionPage
                onBack={() => onBack?.() || (() => {})}
                userProfile={userProfile!}
                programName="Transition Program"
                restrictionReason="Your access to the Transition Program has been restricted by an administrator. Please contact your mentor or program administrator for assistance."
            />
        );
    }

    const modules: Module[] = [
        {
            id: 'transition-1',
            number: '01',
            title: 'Airline Pathway Preparation',
            bullets: [
                'Airline Application Strategies',
                'Interview Technique Mastery',
                'Technical Assessment Preparation',
                'Psychometric Testing Skills'
            ],
            description: 'Comprehensive preparation for airline selection processes including technical interviews, psychometric testing, and simulator assessments used by major airlines.',
            status: 'Available',
            badge: 'Core Module',
            duration: '4 Weeks',
            difficulty: 'Advanced'
        },
        {
            id: 'transition-2',
            number: '02',
            title: 'Advanced CRM & Leadership',
            bullets: [
                'Multi-Crew Coordination',
                'Leadership in Aviation',
                'Crisis Management',
                'Team Building Strategies'
            ],
            description: 'Advanced Crew Resource Management techniques focusing on leadership roles, multi-crew operations, and crisis management in commercial aviation environments.',
            status: 'Available',
            badge: 'Core Module',
            duration: '3 Weeks',
            difficulty: 'Advanced'
        },
        {
            id: 'transition-3',
            number: '03',
            title: 'Specialized Operations',
            bullets: [
                'Corporate Aviation Procedures',
                'Charter Operations',
                'International Operations',
                'Regulatory Compliance'
            ],
            description: 'Specialized training for corporate, charter, and international operations including regulatory requirements and operational procedures.',
            status: 'Coming Soon',
            badge: 'Elective',
            duration: '2 Weeks',
            difficulty: 'Expert'
        }
    ];

    const handleModuleClick = (module: Module) => {
        setSelectedModule(module);
        setActiveView('module-detail');
    };

    const handleBack = () => {
        if (activeView === 'module-detail') {
            setActiveView('cards');
            setSelectedModule(null);
        } else {
            onBack?.();
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'auto', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            {/* Header */}
            <div style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                padding: '1rem 2rem',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={handleBack}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                border: '1px solid #e2e8f0',
                                background: 'white',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                color: '#475569',
                                fontWeight: 500,
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
                            Back
                        </button>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                Transition Program
                            </h1>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                                Advanced career transition training for experienced pilots
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#dcfce7', 
                            color: '#166534', 
                            borderRadius: '20px', 
                            fontSize: '0.875rem', 
                            fontWeight: 600 
                        }}>
                            {modules.length} Modules Available
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {activeView === 'cards' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {modules.map((module, index) => (
                            <div
                                key={module.id}
                                onClick={() => handleModuleClick(module)}
                                onMouseEnter={() => setHoveredModule(module.id)}
                                onMouseLeave={() => setHoveredModule(null)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(226, 232, 240, 0.8)',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: hoveredModule === module.id ? 'translateY(-4px)' : 'translateY(0)',
                                    boxShadow: hoveredModule === module.id 
                                        ? '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)'
                                        : '0 4px 20px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
                                            {module.number}
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                                            {module.title}
                                        </h3>
                                    </div>
                                    <div style={{
                                        padding: '0.25rem 0.75rem',
                                        background: module.badge === 'Core Module' ? '#dbeafe' : '#f3f4f6',
                                        color: module.badge === 'Core Module' ? '#1e40af' : '#374151',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {module.badge}
                                    </div>
                                </div>
                                
                                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                                    {module.description}
                                </p>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Key Topics:</div>
                                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                        {module.bullets.map((bullet, idx) => (
                                            <li key={idx} style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.25rem' }}>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            <span style={{ fontWeight: 600 }}>Duration:</span> {module.duration}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            <span style={{ fontWeight: 600 }}>Level:</span> {module.difficulty}
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '0.5rem 1rem',
                                        background: module.status === 'Available' ? '#dcfce7' : '#f3f4f6',
                                        color: module.status === 'Available' ? '#166534' : '#6b7280',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        {module.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeView === 'module-detail' && selectedModule && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
                                    {selectedModule.number}
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0' }}>
                                    {selectedModule.title}
                                </h2>
                                <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.7, maxWidth: '800px' }}>
                                    {selectedModule.description}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    background: selectedModule.badge === 'Core Module' ? '#dbeafe' : '#f3f4f6',
                                    color: selectedModule.badge === 'Core Module' ? '#1e40af' : '#374151',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem'
                                }}>
                                    {selectedModule.badge}
                                </div>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    background: selectedModule.status === 'Available' ? '#dcfce7' : '#f3f4f6',
                                    color: selectedModule.status === 'Available' ? '#166534' : '#6b7280',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}>
                                    {selectedModule.status}
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Duration</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>{selectedModule.duration}</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Difficulty Level</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>{selectedModule.difficulty}</div>
                            </div>
                        </div>
                        
                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Curriculum Topics</h3>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                {selectedModule.bullets.map((bullet, idx) => (
                                    <li key={idx} style={{ fontSize: '1rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                onClick={() => setIsEnrolled(!isEnrolled)}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: isEnrolled ? '#dcfce7' : '#2563eb',
                                    color: isEnrolled ? '#166534' : 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                            </button>
                            <button
                                onClick={handleBack}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: 'white',
                                    color: '#475569',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Back to Modules
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
