import React, { useState } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';

type Step = 'email' | 'success';

interface ForgotPasswordPageProps {
    onBack: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Helper to get the correct Edge Function URL
    const getEdgeFunctionUrl = (path: string) => {
        const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
        return `${supabaseUrl}/functions/v1/password-reset/${path}`;
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            setSuccessMessage('Password reset link sent to your email. Please check your inbox and click the link to continue.');
            setStep('success');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'email':
                return (
                    <>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                            PASSWORD RESET
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#0f172a', marginBottom: '2.5rem', textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            Forgot Your Password?
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2rem', textAlign: 'center', maxWidth: '40rem' }}>
                            <strong>Enter your email address below.</strong> We'll send you a secure link to reset your password and regain access to your WingMentor account.
                        </p>
                        <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                                EMAIL ADDRESS
                            </div>
                            <div className="input-group" style={{ marginBottom: '1.25rem', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8',
                                    display: 'flex',
                                    zIndex: 1
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.95rem 1rem 0.95rem 2.85rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(148,163,184,0.5)',
                                        backgroundColor: 'rgba(248,250,252,0.7)',
                                        fontSize: '0.97rem',
                                        outline: 'none',
                                        transition: 'all 0.25s ease',
                                        color: '#0f172a',
                                        boxShadow: '0 15px 35px rgba(15,23,42,0.06)'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#2563eb';
                                        e.currentTarget.style.boxShadow = '0 20px 45px rgba(37, 99, 235, 0.18)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)';
                                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(15,23,42,0.06)';
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={onBack}
                                    style={{
                                        flex: 1,
                                        padding: '1.1rem 2.75rem',
                                        background: 'rgba(241,245,249,0.8)',
                                        color: '#475569',
                                        border: '1px solid rgba(148,163,184,0.3)',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'rgba(226,232,240,0.9)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(241,245,249,0.8)';
                                    }}
                                >
                                    Back
                                </button>
                                <button type="submit" disabled={loading} style={{
                                    flex: 2,
                                    padding: '1.1rem 2.75rem',
                                    background: 'linear-gradient(120deg, #0f172a 0%, #111827 60%, #0b1120 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.25s ease',
                                    opacity: loading ? 0.75 : 1,
                                    boxShadow: '0 25px 45px rgba(15,23,42,0.3)'
                                }}
                                    onMouseOver={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                                            e.currentTarget.style.boxShadow = '0 30px 60px rgba(15,23,42,0.35)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 25px 45px rgba(15,23,42,0.3)';
                                        }
                                    }}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                    {!loading && <Icons.ArrowRight style={{ width: 18, height: 18 }} />}
                                </button>
                            </div>
                        </form>
                    </>
                );
            case 'success':
                return (
                    <>
                        <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                            EMAIL SENT
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#0f172a', marginBottom: '2.5rem', textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            Reset Link Sent
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2rem', textAlign: 'center', maxWidth: '40rem' }}>
                            <strong>Password reset instructions have been sent to your email.</strong> Please check your inbox and click the secure link to reset your password.
                        </p>
                        <div style={{ textAlign: 'center', margin: '2.5rem 0' }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '1.5rem 2rem',
                                background: 'rgba(147, 197, 253, 0.15)',
                                border: '2px solid rgba(147, 197, 253, 0.4)',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: '#1e40af',
                                boxShadow: '0 4px 16px rgba(147, 197, 253, 0.2)',
                                backdropFilter: 'blur(8px)'
                            }}>
                                ✓ Check your email
                            </div>
                        </div>
                        <div style={{ background: '#dbeafe', borderLeft: '4px solid #2563eb', padding: '15px', margin: '20px 0', textAlign: 'left' }}>
                            <p style={{ color: '#1e40af', margin: 0, fontSize: '0.9rem' }}><strong>Tip:</strong> If you don't see the email within 5 minutes, check your spam folder.</p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem',
            position: 'relative',
            zIndex: 10,
            overflow: 'hidden'
        }}>
            {/* Shader Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), transparent 40%)',
                mixBlendMode: 'screen',
                pointerEvents: 'none'
            }} />
            
            <div style={{
                width: '100%',
                maxWidth: '1180px',
                minHeight: '660px',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '24px',
                boxShadow: '0 40px 120px rgba(15,23,42,0.25)',
                border: '1px solid rgba(255,255,255,0.65)',
                overflow: 'hidden',
                backdropFilter: 'blur(18px)',
                transform: 'scale(1.05)',
                transformOrigin: 'center',
                display: 'flex'
            }}>
                {/* Left Side (Dark Info Panel) */}
                <div style={{
                    flex: '0 0 44%',
                    background: 'radial-gradient(circle at top, rgba(59,130,246,0.35), transparent 60%) , linear-gradient(145deg, #020817 0%, #04182b 60%, #032130 100%)',
                    padding: '3.5rem 2.8rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textAlign: 'center',
                    paddingBottom: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: '20% 10% auto',
                        height: '220px',
                        background: 'radial-gradient(circle, rgba(9,132,227,0.25), transparent 70%)',
                        filter: 'blur(60px)',
                        opacity: 0.8,
                        pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute',
                        inset: 'auto 15% 5%',
                        height: '120px',
                        background: 'radial-gradient(circle, rgba(14,165,233,0.15), transparent 70%)',
                        filter: 'blur(80px)',
                        pointerEvents: 'none'
                    }} />
                    <div style={{ marginBottom: '2rem' }}>
                        <img src="https://lh3.googleusercontent.com/d/1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6" alt="WingMentor Logo" style={{ width: '240px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    <div style={{ color: '#e11d48', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        PASSWORD RESET
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#ffffff', marginBottom: '2.5rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        Account Recovery
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '320px' }}>
                        <strong>Regain access to your WingMentor account.</strong> Enter your email address and we'll send you a secure link to reset your password.
                    </p>
                </div>
                
                {/* Right Side (Form) */}
                <div style={{
                    flex: '1',
                    padding: '4rem 4.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}
                {successMessage && step !== 'success' && (
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {successMessage}
                    </div>
                )}
                {renderStepContent()}
                {/* Contact Us bar */}
                <div style={{
                    marginTop: '2.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(148,163,184,0.2)',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#64748b',
                    lineHeight: 1.6
                }}>
                    <div style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Contact Us</div>
                    <div>Phone: <a href="tel:+1234567890" style={{ color: '#2563eb', textDecoration: 'none' }}>+1 234 567 890</a></div>
                    <div>Email: <a href="mailto:wingmentorprogram@gmail.com" style={{ color: '#2563eb', textDecoration: 'none' }}>wingmentorprogram@gmail.com</a></div>
                </div>
                </div>
            </div>
        </div>
    );
};
