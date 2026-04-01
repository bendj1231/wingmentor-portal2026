import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-auth';
import { Icons } from '../icons';

export const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializePage = async () => {
            console.log('🔍 Reset password page - URL hash:', window.location.hash);
            
            try {
                // Get the session from the URL hash
                const hash = window.location.hash;
                const urlParams = new URLSearchParams(hash.substring(1));
                const accessToken = urlParams.get('access_token');
                const refreshToken = urlParams.get('refresh_token');
                const type = urlParams.get('type');
                
                console.log('🔍 Parsed params:', { 
                    accessToken: accessToken?.substring(0, 20) + '...', 
                    refreshToken: refreshToken?.substring(0, 20) + '...', 
                    type,
                    hashLength: hash.length,
                    fullHash: hash.substring(0, 100) + '...'
                });
                
                // Simplified approach - just try to get current user
                if (hash.includes('access_token') && hash.includes('type=recovery')) {
                    console.log('� Recovery tokens detected, attempting to set session...');
                    
                    try {
                        // Try direct session setup first
                        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                            access_token: accessToken || '',
                            refresh_token: refreshToken || ''
                        });
                        
                        console.log('🔍 Session result:', { 
                            hasData: !!sessionData, 
                            hasUser: !!sessionData?.user, 
                            userEmail: sessionData?.user?.email,
                            error: sessionError?.message
                        });
                        
                        if (!sessionError && sessionData.user?.email) {
                            setEmail(sessionData.user.email);
                            console.log('✅ Session setup successful for:', sessionData.user.email);
                        } else {
                            throw new Error(sessionError?.message || 'Session setup failed');
                        }
                    } catch (err: any) {
                        console.error('❌ Session setup failed:', err.message);
                        
                        // Try alternative approach
                        try {
                            console.log('🔄 Trying alternative approach...');
                            const { data: altData, error: altError } = await supabase.auth.getUser(accessToken || undefined);
                            
                            if (!altError && altData.user?.email) {
                                setEmail(altData.user.email);
                                console.log('✅ Alternative approach successful for:', altData.user.email);
                            } else {
                                throw new Error(altError?.message || 'Alternative approach failed');
                            }
                        } catch (altErr: any) {
                            console.error('❌ All approaches failed');
                            throw new Error('Unable to process reset link. The link may be expired or invalid.');
                        }
                    }
                } else {
                    throw new Error('Invalid reset link format. Missing required tokens.');
                }
            } catch (err: any) {
                console.error('❌ Unexpected error:', err);
                setError(`Reset link error: ${err.message || 'Unknown error occurred'}. Please request a new password reset.`);
            } finally {
                setIsInitialized(true);
            }
        };

        initializePage();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!isInitialized) {
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
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), transparent 40%)',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '480px',
                    height: '480px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 60%)',
                    top: '15%',
                    right: '5%',
                    filter: 'blur(10px)',
                    opacity: 0.8,
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
                            LOADING
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#ffffff', marginBottom: '2.5rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            Processing Reset Link
                        </h2>
                        <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            border: '3px solid rgba(255,255,255,0.2)', 
                            borderTop: '3px solid #ffffff', 
                            borderRadius: '50%', 
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }} />
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                    <div style={{
                        flex: '1',
                        padding: '4rem 4.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{ fontSize: '1.1rem', color: '#64748b', textAlign: 'center' }}>
                            Setting up your secure password reset session...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
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
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), transparent 40%)',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '480px',
                    height: '480px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 60%)',
                    top: '15%',
                    right: '5%',
                    filter: 'blur(10px)',
                    opacity: 0.8,
                    pointerEvents: 'none'
                }} />
                <div style={{
                    width: '100%',
                    maxWidth: '520px',
                    background: 'rgba(255,255,255,0.92)',
                    borderRadius: '24px',
                    boxShadow: '0 40px 120px rgba(15,23,42,0.25)',
                    border: '1px solid rgba(255,255,255,0.65)',
                    overflow: 'hidden',
                    backdropFilter: 'blur(18px)',
                    transform: 'scale(1.05)',
                    transformOrigin: 'center',
                    padding: '4rem 4.25rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1.5rem'
                    }}>
                        ✅
                    </div>
                    <h2 style={{ fontSize: '1.95rem', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        Password Reset Successful
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
                        Your password has been successfully updated. You can now sign in with your new password.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            width: '100%',
                            padding: '1.1rem 2.75rem',
                            background: 'linear-gradient(120deg, #0f172a 0%, #111827 60%, #0b1120 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.25s ease',
                            boxShadow: '0 25px 45px rgba(15,23,42,0.3)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                            e.currentTarget.style.boxShadow = '0 30px 60px rgba(15,23,42,0.35)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 25px 45px rgba(15,23,42,0.3)';
                        }}
                    >
                        Back to Login
                        <Icons.ArrowRight style={{ width: 18, height: 18 }} />
                    </button>
                </div>
            </div>
        );
    }

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
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), transparent 40%)',
                mixBlendMode: 'screen',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                width: '480px',
                height: '480px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 60%)',
                top: '15%',
                right: '5%',
                filter: 'blur(10px)',
                opacity: 0.8,
                pointerEvents: 'none'
            }} />
            <div style={{
                width: '100%',
                maxWidth: '520px',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '24px',
                boxShadow: '0 40px 120px rgba(15,23,42,0.25)',
                border: '1px solid rgba(255,255,255,0.65)',
                overflow: 'hidden',
                backdropFilter: 'blur(18px)',
                transform: 'scale(1.05)',
                transformOrigin: 'center',
                padding: '4rem 4.25rem'
            }}>
                <h2 style={{ fontSize: '1.95rem', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#0f172a', marginBottom: '0.35rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    Reset Your Password
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    {email ? `Enter a new password for ${email}` : 'Enter your new password below'}
                </p>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                        NEW PASSWORD
                    </div>
                    <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            display: 'flex',
                            zIndex: 1
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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

                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                        CONFIRM PASSWORD
                    </div>
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            display: 'flex',
                            zIndex: 1
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <button type="submit" disabled={loading} style={{
                        width: '100%',
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
                        {loading ? 'Updating...' : 'Update Password'}
                        {!loading && <Icons.ArrowRight style={{ width: 18, height: 18 }} />}
                    </button>
                </form>

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
    );
};
