import React from 'react';

export const TopNavbar: React.FC = () => {
    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '0 2rem',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src="/logo.png" alt="WingMentor Logo" style={{ height: '40px', objectFit: 'contain' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '50%',
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                }}>
                    PT  {/* Placeholder initials for Pilot Trainee */}
                </div>
            </div>
        </nav>
    );
};
