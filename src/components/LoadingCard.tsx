import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
    "INITIALIZING FLIGHT PARAMETERS...",
    "FETCHING MENTORSHIP DATA...",
    "CALIBRATING SIMULATOR INTERFACE...",
    "VERIFYING PILOT CREDENTIALS...",
    "LOADING CURRICULUM ASSETS...",
    "SYNCHRONIZING TRAINING LOGS..."
];

export const LoadingCard: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-container animate-fade-in">
            <main className="dashboard-card" style={{
                minHeight: '450px',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(248, 250, 252, 0.95)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
            }}>
                <div className="dashboard-header" style={{ borderBottom: 'none', background: 'transparent', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
                    </div>

                    <div className="dashboard-subtitle" style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        SYSTEM LOADING
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{
                            fontSize: '1.25rem',
                            color: '#64748b',
                            fontWeight: 500,
                            minHeight: '2rem',
                            transition: 'all 0.3s ease',
                            margin: '0 auto',
                            maxWidth: '600px'
                        }}>
                            {LOADING_MESSAGES[messageIndex]}
                        </p>
                    </div>

                    <div className="loading-spinner-container" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                        <div className="outer-ring" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #e2e8f0',
                            borderTopColor: '#2563eb',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                </div>

                <div className="dashboard-footer" style={{
                    padding: '2rem',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    letterSpacing: '0.1em'
                }}>
                    ESTABLISHING SECURE CONNECTION...
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}} />
            </main>
        </div>
    );
};
