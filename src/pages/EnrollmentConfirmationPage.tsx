import React from 'react';
import { Icons } from '../icons';

interface EnrollmentConfirmationPageProps {
    onBack?: () => void;
    onLogout?: () => void;
    userEmail?: string;
}

export const EnrollmentConfirmationPage: React.FC<EnrollmentConfirmationPageProps> = ({
    onBack,
    onLogout,
    userEmail
}) => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <header style={{
                width: '100%',
                padding: '1.5rem 2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                borderBottom: '1px solid #e2e8f0',
                zIndex: 10
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                >
                    <div style={{ transform: 'rotate(180deg)', display: 'flex' }}>
                        <Icons.ArrowRight style={{ width: 16, height: 16 }} />
                    </div>
                    Back to Programs
                </button>

                <div style={{ flex: 1 }}></div>

                <button
                    onClick={onLogout}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                >
                    <Icons.LogOut style={{ width: 16, height: 16 }} />
                    Logout
                </button>
            </header>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '600px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    {/* Success Icon */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.3)'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>

                    {/* Logo */}
                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px', height: 'auto', marginBottom: '2rem' }} />

                    {/* Success Message */}
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '1rem',
                        fontFamily: 'Georgia, serif'
                    }}>
                        Enrollment Confirmed!
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: '#475569',
                        lineHeight: 1.6,
                        marginBottom: '2rem'
                    }}>
                        Your enrollment confirmation has been sent to:
                    </p>

                    {/* Email Display */}
                    <div style={{
                        backgroundColor: '#f1f5f9',
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        border: '1px solid #e2e8f0'
                    }}>
                        <p style={{
                            fontSize: '1.1rem',
                            color: '#1e293b',
                            fontWeight: 600,
                            margin: 0
                        }}>
                            {userEmail || 'Loading email...'}
                        </p>
                        {userEmail && (
                            <p style={{
                                fontSize: '0.85rem',
                                color: '#64748b',
                                margin: '0.5rem 0 0 0',
                                fontStyle: 'italic'
                            }}>
                                This is the email address associated with your logged-in account
                            </p>
                        )}
                    </div>

                    {/* Email Confirmation Card */}
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '3rem 2.5rem',
                        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        textAlign: 'center',
                        width: '100%',
                        boxSizing: 'border-box',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            Email Confirmation
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                            Check Your Inbox
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
                            Your enrollment confirmation has been sent to your registered email address. This email contains your enrollment details, next steps, and important information about the WingMentor Foundational Program.
                        </p>
                        <div style={{
                            backgroundColor: '#f0fdf4',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #bbf7d0',
                            marginTop: '2rem',
                            textAlign: 'left'
                        }}>
                            <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                                What's Included in Your Email
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                                    <span style={{ color: '#475569', fontSize: '0.95rem' }}>Program enrollment confirmation</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                                    <span style={{ color: '#475569', fontSize: '0.95rem' }}>Next steps timeline</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                                    <span style={{ color: '#475569', fontSize: '0.95rem' }}>Mentorship contact info</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                                    <span style={{ color: '#475569', fontSize: '0.95rem' }}>Program components overview</span>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            backgroundColor: '#eff6ff',
                            borderRadius: '12px',
                            borderLeft: '4px solid #3b82f6',
                            marginTop: '2rem',
                            textAlign: 'left'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 500 }}>
                                <strong>Important:</strong> Please keep your confirmation email for your records. If you don't see it within 5 minutes, check your spam folder or contact support.
                            </p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div style={{
                        backgroundColor: '#eff6ff',
                        padding: '2rem',
                        borderRadius: '16px',
                        marginBottom: '2rem',
                        border: '1px solid #bfdbfe',
                        textAlign: 'left'
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: '#1e40af',
                            marginBottom: '1rem',
                            marginTop: 0
                        }}>
                            What Happens Next?
                        </h3>
                        <ul style={{
                            color: '#475569',
                            lineHeight: 1.8,
                            paddingLeft: '1.5rem',
                            margin: 0
                        }}>
                            <li>Check your email for the confirmation message</li>
                            <li>Our mentorship team will review your responses</li>
                            <li>You'll receive scheduler contact information</li>
                            <li>Full portal access will be activated</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={onBack}
                            style={{
                                padding: '1rem 2rem',
                                borderRadius: '12px',
                                border: '2px solid #2563eb',
                                background: 'white',
                                color: '#2563eb',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#eff6ff';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                            }}
                        >
                            Back to Programs
                        </button>

                        <button
                            onClick={() => {
                                if (userEmail) {
                                    console.log('📧 Opening email client for:', userEmail);
                                    window.location.href = `mailto:${userEmail}`;
                                } else {
                                    console.log('❌ No user email available');
                                    alert('Please check your email for the confirmation message. If you don\'t see it, check your spam folder.');
                                }
                            }}
                            style={{
                                padding: '1rem 2rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 15px 25px -3px rgba(37, 99, 235, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)';
                            }}
                        >
                            {userEmail ? 'Check Email' : 'Return to Programs'}
                        </button>
                    </div>

                    {/* Support Info */}
                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <p style={{
                            fontSize: '0.9rem',
                            color: '#64748b',
                            margin: 0
                        }}>
                            <strong>Note:</strong> Email confirmations are currently being logged to the console for development. 
                            In production, emails will be sent automatically to your registered email address.
                        </p>
                        <p style={{
                            fontSize: '0.9rem',
                            color: '#64748b',
                            margin: '0.5rem 0 0 0'
                        }}>
                            For questions, contact{' '}
                            <a 
                                href="mailto:wingmentorprogram@gmail.com" 
                                style={{ color: '#2563eb', textDecoration: 'none' }}
                            >
                                wingmentorprogram@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentConfirmationPage;
