import React from 'react';
import { Icons } from '../icons';

interface ContactPageProps {
    onBack?: () => void;
    onLogout?: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack, onLogout }) => {
    return (
        <div className="dashboard-container animate-fade-in">
            <div className="dashboard-card" style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
                <header className="dashboard-header" style={{
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '2.5rem',
                    backgroundColor: 'white'
                }}>
                    <div style={{ position: 'absolute', top: '1.5rem', left: '2rem' }}>
                        <button
                            className="back-btn"
                            onClick={onBack}
                            style={{
                                padding: '0.5rem 0',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#475569',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = '#0f172a';
                                e.currentTarget.style.transform = 'translateX(-4px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = '#475569';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Programs
                        </button>
                    </div>

                    <div style={{ position: 'absolute', top: '1.5rem', right: '2rem' }}>
                        <button
                            className="platform-logout-btn"
                            onClick={onLogout}
                            style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid #f1f5f9',
                                background: 'white',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#64748b',
                                borderRadius: '10px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = '#ef4444';
                                e.currentTarget.style.borderColor = '#fee2e2';
                                e.currentTarget.style.backgroundColor = '#fef2f2';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = '#64748b';
                                e.currentTarget.style.borderColor = '#f1f5f9';
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                            }}
                        >
                            <Icons.LogOut style={{ width: 16, height: 16 }} />
                            Logout
                        </button>
                    </div>

                    <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
                    </div>

                    <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em', color: '#2563eb', fontWeight: 700 }}>
                        CONTACT SUPPORT
                    </div>

                    <h1 className="dashboard-title" style={{
                        fontSize: '3.3rem',
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#0f172a'
                    }}>
                        Get in Touch
                    </h1>

                    <p style={{
                        color: '#64748b',
                        fontSize: '0.875rem',
                        maxWidth: '42rem',
                        margin: '0 auto 1.5rem',
                        padding: '0 1rem',
                        lineHeight: '1.625',
                        textAlign: 'center'
                    }}>
                        Reach out to the WingMentor team for any inquiries about program direction, management, or general support. We're here to help you succeed.
                    </p>
                </header>

                <div className="dashboard-content" style={{
                    padding: '3rem',
                    backgroundColor: 'white'
                }}>
                    <div className="animate-fade-in">
                        {/* Contact Information Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                            
                            {/* Phone Contact Card */}
                            <div className="horizontal-card" style={{ 
                                cursor: 'pointer', 
                                padding: '1rem 2rem', 
                                background: 'white',
                                borderRadius: '20px',
                                boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e2e8f0',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div className="horizontal-card-content-wrapper">
                                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                                        <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Support</h3>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                                                +63 967 048 1890
                                            </div>
                                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                                                Available for program inquiries and management support
                                            </p>
                                            <button
                                                onClick={() => window.location.href = 'tel:+639670481890'}
                                                style={{
                                                    background: '#2563eb',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.75rem 2rem',
                                                    borderRadius: '12px',
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                📞 Call Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email Contact Card */}
                            <div className="horizontal-card" style={{ 
                                cursor: 'pointer', 
                                padding: '1rem 2rem', 
                                background: 'white',
                                borderRadius: '20px',
                                boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e2e8f0',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div className="horizontal-card-content-wrapper">
                                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                                        <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Support</h3>
                                            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem', wordBreak: 'break-word' }}>
                                                wingmentorprogram@gmail.com
                                            </div>
                                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                                                Email the WingMentor team for detailed inquiries
                                            </p>
                                            <button
                                                onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com'}
                                                style={{
                                                    background: '#2563eb',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.75rem 2rem',
                                                    borderRadius: '12px',
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                ✉️ Send Email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="horizontal-card" style={{ 
                            padding: '2rem', 
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div className="horizontal-card-content-wrapper">
                                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Support Information
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '15px',
                                                    background: '#f8fafc',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#2563eb',
                                                    fontSize: '1.75rem',
                                                    margin: '0 auto 1rem auto'
                                                }}>
                                                    🕐
                                                </div>
                                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                                                    Response Time
                                                </h4>
                                                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                                    Within 24 hours for all inquiries
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '15px',
                                                    background: '#f8fafc',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#2563eb',
                                                    fontSize: '1.75rem',
                                                    margin: '0 auto 1rem auto'
                                                }}>
                                                    🌍
                                                </div>
                                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                                                    Global Support
                                                </h4>
                                                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                                    Available for international students
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '15px',
                                                    background: '#f8fafc',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#2563eb',
                                                    fontSize: '1.75rem',
                                                    margin: '0 auto 1rem auto'
                                                }}>
                                                    🎯
                                                </div>
                                                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                                                    Program Support
                                                </h4>
                                                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                                    Technical and guidance assistance
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="dashboard-footer" style={{
                    marginTop: '1rem',
                    padding: '2rem 3.5rem',
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #f1f5f9',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Need assistance? The WingMentor Support Network is active 24/7.
                    </p>
                    <button
                        className="help-btn"
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            color: '#1e293b',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com'}
                    >
                        ✉️ Contact Support
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ContactPage;
