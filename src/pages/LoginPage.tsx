import React, { useEffect, useState } from 'react';
import { Icons } from '../icons';
import { signIn } from '../lib/supabase-auth';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import styles from './LoginPage.module.css';

const REMEMBER_STORAGE_KEY = 'wm-remember-email';
const REMEMBER_FLAG_KEY = 'wm-remember-active';

interface LoginPageProps {
    onLogin: (email: string) => void;
    blurred?: boolean;
    onChangeOptimization?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, blurred = false, onChangeOptimization }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPortalInfo, setShowPortalInfo] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const authResult = await signIn(email, password);

            const supabaseUserId = authResult?.user?.id || authResult?.session?.user?.id;
            if (!supabaseUserId) {
                throw new Error('Authentication succeeded but no Supabase user ID was returned.');
            }

            onLogin(email);
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedRememberFlag = localStorage.getItem(REMEMBER_FLAG_KEY) === 'true';
        const savedEmail = savedRememberFlag ? localStorage.getItem(REMEMBER_STORAGE_KEY) : null;
        if (savedRememberFlag && savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (rememberMe && email.trim()) {
            localStorage.setItem(REMEMBER_STORAGE_KEY, email);
            localStorage.setItem(REMEMBER_FLAG_KEY, 'true');
        } else {
            localStorage.removeItem(REMEMBER_STORAGE_KEY);
            localStorage.removeItem(REMEMBER_FLAG_KEY);
        }
    }, [rememberMe, email]);

    return (
        <div className={`${styles.loginContainer} ${blurred ? styles.loginContainerBlurred : ''} animate-fade-in`}>
            {showForgotPassword ? (
                <ForgotPasswordPage onBack={() => setShowForgotPassword(false)} />
            ) : (
                <>
                <div className={styles.backgroundGradient1} />
                <div className={styles.backgroundGradient2} />
                <div className={styles.loginCard}>
                    {/* Left Side (Dark Info Panel) */}
                    <div className={styles.loginInfoPanel}>
                        <div className={styles.infoPanelGradient1} />
                        <div className={styles.infoPanelGradient2} />
                        <div className={styles.loginLogo}>
                            <img src="/logo.png" alt="WingMentor Logo" />
                        </div>

                        <div className={styles.mentorNetworkLabel}>MENTOR NETWORK</div>

                        <h2 className={styles.portalTitle}>Pilot Portal</h2>

                        <p className={styles.portalDescription}>
                            Access personalized program enrollment, pathway briefs, and WingMentor Pilot Portfolio data—covering flight experience, assessments, and ATS-ready records shared with approved aviation bodies. Explore the pilot network search for type-rating intel, airline requirements, and aircraft references, track recognition and examination outcomes, and retrieve your ATLAS CV dossier from one secure hub.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowPortalInfo(true)}
                            aria-label="Learn more about WingMentor Program Portal"
                            className={styles.learnMoreButton}
                        >
                            Learn more
                        </button>

                    </div>

                    {/* Right Side (Login Form) */}
                    <div className={styles.loginFormPanel}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Connecting pilots to the aviation industry</h2>
                            <p className={styles.formSubtitle}>Sign in with your WingMentor credentials.</p>
                            {onChangeOptimization && (
                                <button
                                    type="button"
                                    onClick={onChangeOptimization}
                                    className={styles.optimizationButton}
                                >
                                    Change Optimization
                                </button>
                            )}
                        </div>

                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className={styles.errorMessage}
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.loginForm}>
                            <div className={styles.accountLabel}>
                                WINGMENTOR ACCOUNT
                            </div>

                            <div className={styles.inputGroup}>
                                <div className={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.emailInput}
                                    required
                                />
                            </div>

                            <div className={styles.passwordInputGroup}>
                                <div className={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.passwordInput}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className={styles.passwordToggle}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div className={styles.forgotPasswordContainer}>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    aria-label="Reset your password"
                                    className={styles.forgotPasswordButton}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <div className={styles.loginButtonContainer}>
                                <button type="submit" disabled={loading} className={styles.loginButton}>
                                    {loading ? 'Authenticating...' : 'Login'}
                                    {!loading && <Icons.ArrowRight style={{ width: 18, height: 18 }} />}
                                </button>
                            </div>

                            <div className={styles.rememberMeContainer}>
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className={styles.rememberMeCheckbox}
                                    aria-describedby="remember-me-description"
                                />
                                <label htmlFor="remember-me" className={styles.rememberMeLabel}>
                                    Remember me
                                </label>
                                <span id="remember-me-description" className={styles.srOnly}>
                                    Keep me signed in on this device
                                </span>
                            </div>

                            <div className={styles.signupContainer}>
                                Not a member? <a href="https://wmpilotnetwork.vercel.app" target="_blank" rel="noopener" className={styles.signupLink}>Create an account</a>
                                <span className={styles.separator} aria-hidden="true">•</span>
                                <button
                                    type="button"
                                    onClick={() => window.open('https://wmpilotnetwork.vercel.app', '_blank', 'noopener')}
                                    aria-label="Visit WingMentor Pilot Network website"
                                    className={styles.pilotNetworkButton}
                                >
                                    Visit Pilot Network
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {showPortalInfo && (
                    <div
                        className={styles.portalModalOverlay}
                        onClick={() => setShowPortalInfo(false)}
                    >
                        <div
                            className={styles.portalModal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                aria-label="Close"
                                onClick={() => setShowPortalInfo(false)}
                                className={styles.modalCloseButton}
                            >
                                ×
                            </button>
                            <div className={styles.modalLogo}>
                                <img src="/logo.png" alt="WingMentor Logo" />
                            </div>
                            <div className={styles.modalLabel}>
                                PROGRAM PORTAL
                            </div>
                            <h2 className={styles.modalTitle}>
                                About WingMentor Program Portal
                            </h2>
                            <div className={styles.modalContent}>
                                <p className={styles.modalParagraph}>
                                    The portal is the enrollment gateway for WingMentor pilots. It surfaces every available pathway within the WM ecosystem and tailors recommendations using your Recognition data and Pilot Portfolio profile.
                                </p>
                                <p className={styles.modalParagraph}>
                                    Your Pilot Portfolio consolidates flight experience, cognitive evaluations, and exam performance into ATS-formatted records that are securely shared with approved aviation industry bodies.
                                </p>
                                <p className={styles.modalParagraph}>
                                    Through the pilot network search, you can review type-rating insights, airline requirements, POH references, and broader operational expectations sourced from partners worldwide.
                                </p>
                                <p className={styles.modalParagraph}>
                                    Recognition & Achievements keeps all official examination outcomes, interview boards, and feedback from accountable managers or heads of training in one authenticated archive, alongside access to your ATLAS CV and ATS data exports.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                </>
            )}
        </div>
    );
};
