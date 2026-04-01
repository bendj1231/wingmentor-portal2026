import React, { useState } from 'react';
import { Icons } from '../icons';

interface PostEnrollmentSlideshowProps {
    onComplete: () => void;
}

export const PostEnrollmentSlideshow: React.FC<PostEnrollmentSlideshowProps> = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Your Mentorship Foundation",
            subtitle: "Phase 1: Starter Mentee Track",
            content: "Welcome to the Foundational Program. This phase is designed to transition you from a low-time pilot into a verifiable asset. Rather than reteaching initial concepts, we will focus on analyzing your specific performance gaps, targeted 1-on-1 consultation, and building your professional portfolio.",
            points: [
                "Cultivate advanced problem-solving skills, learning to assess scenarios and peers diagnostically, like a doctor.",
                "Master advanced Crew Resource Management (CRM) and targeted consultation techniques.",
                "Log your first 10 verified mentorship hours to unlock the Black Box Knowledge Vault."
            ],
            icon: <Icons.BookOpen style={{ width: 48, height: 48 }} />
        },
        {
            title: "Your Command Center",
            subtitle: "Phase 2: The Pilot App Ecosystem",
            content: "Access the full suite of WingMentor pilot-engineered applications. From running diagnostic CRM scenarios in the w1000 Simulator to securing your progress in the dual-verification logbook, these systems are your gateway to career acceleration.",
            points: [
                "Execute high-fidelity CRM scenarios via the w1000 Simulator engine.",
                "Securely log and peer-verify your consultation hours to build your official portfolio.",
                "Assess peers and diagnose performance gaps in 1-on-1 collaborative testing environments."
            ],
            icon: <Icons.Monitor style={{ width: 48, height: 48 }} />
        },
        {
            title: "Enter the Network",
            subtitle: "Phase 3: Network & Progression",
            content: "The WingMentor portal is your centralized tracking authority. From here, you will manage your flight profile, log your verifiable consultation hours, and engage directly with our exclusive community of vetted aviators.",
            points: [
                "Track your verifiable progress towards the official 50-Hour Mentorship Certificate.",
                "Unlock the Black Box Knowledge Vault as you reach new mentorship milestones.",
                "Access the Pilot Gap Forum for industry intelligence and professional networking."
            ],
            icon: <Icons.Cpu style={{ width: 48, height: 48 }} />
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <div className="dashboard-container animate-fade-in" style={{ zIndex: 20 }}>
            <main className="dashboard-card" style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '500px',
                padding: 0
            }}>
                {/* Progress Bar */}
                <div style={{ display: 'flex', width: '100%', height: '6px', backgroundColor: '#f1f5f9' }}>
                    <div style={{
                        height: '100%',
                        width: `${((currentSlide + 1) / slides.length) * 100}%`,
                        backgroundColor: '#2563eb',
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                </div>

                {/* Slides content area */}
                <div style={{ padding: '4rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                        <div className="dashboard-logo">
                            <img src="/logo.png" alt="WingMentor Logo" />
                        </div>

                        <div className="dashboard-subtitle">
                            {slides[currentSlide].subtitle}
                        </div>

                        <h1 className="dashboard-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                            {slides[currentSlide].title}
                        </h1>

                        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem', color: '#475569', lineHeight: 1.6 }}>
                            {slides[currentSlide].content}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px', textAlign: 'left' }}>
                        {slides[currentSlide].points.map((point, index) => (
                            <div key={index} className="animate-fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', animationDelay: `${index * 0.15}s` }}>
                                <div style={{ marginTop: '0.25rem', color: '#10b981' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <p style={{ margin: 0, color: '#334155', fontSize: '1rem', lineHeight: 1.5 }}>{point}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={{ padding: '1.5rem 3rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
                    <button
                        onClick={prevSlide}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: currentSlide === 0 ? 'transparent' : '#64748b',
                            cursor: currentSlide === 0 ? 'default' : 'pointer',
                            padding: '0.5rem 1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            pointerEvents: currentSlide === 0 ? 'none' : 'auto'
                        }}
                    >
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Previous
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {slides.map((_, i) => (
                            <div key={i} style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: i === currentSlide ? '#2563eb' : '#cbd5e1',
                                transition: 'background-color 0.3s'
                            }}></div>
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        style={{
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 2rem',
                            borderRadius: '10px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#1d4ed8';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {currentSlide === slides.length - 1 ? 'Go to Program' : 'Continue'}
                        <Icons.ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                </div>
            </main>
        </div>
    );
};
