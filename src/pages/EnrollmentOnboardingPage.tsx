import React, { useState } from 'react';
import { Icons } from '../icons';
import { completeEnrollment, supabase } from '../lib/supabase-auth';
import { sendEnrollmentConfirmationEmail } from '../lib/email';

interface EnrollmentOnboardingPageProps {
    onComplete: () => void;
    onBackToPrograms: () => void;
    onLogout: () => void;
    onShowTerms: () => void;
}

export const EnrollmentOnboardingPage: React.FC<EnrollmentOnboardingPageProps> = ({ onComplete, onBackToPrograms, onLogout, onShowTerms }) => {
    const [interest, setInterest] = useState('');
    const [goals, setGoals] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLegal, setShowLegal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed || !interest || !goals) return;

        setLoading(true);
        setError(null); // Clear previous errors
        try {
            console.log('🚀 Starting enrollment process...');
            
            // Get authenticated user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError) {
                console.error('❌ Auth error:', authError);
                setError(`Authentication error: ${authError.message}`);
                return;
            }
            
            if (!user) {
                console.error('❌ No authenticated user found');
                setError('No authenticated user found. Please log in again.');
                return;
            }
            
            console.log('✅ User authenticated:', { id: user.id, email: user.email });
            
            // Complete enrollment in Supabase
            console.log('💾 Saving enrollment data...');
            await completeEnrollment(user.id, {
                interest,
                goals,
                agreementVersion: '1.0',
                agreedAt: new Date().toISOString()
            });
            console.log('✅ Enrollment data saved successfully');
            console.log('🎉 Enrollment process completed successfully');
            onComplete();
            
        } catch (error) {
            console.error('❌ Enrollment error details:', error);
            
            let errorMessage = 'Failed to complete enrollment. Please try again.';
            
            if (error instanceof Error) {
                if (error.message.includes('Authentication')) {
                    errorMessage = 'Authentication error. Please log in again and try.';
                } else if (error.message.includes('duplicate') || error.message.includes('unique') || error.message.includes('already enrolled')) {
                    errorMessage = 'You are already enrolled in this program.';
                } else if (error.message.includes('permission') || error.message.includes('authorization')) {
                    errorMessage = 'Permission denied. Please contact support.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            padding: '4rem 1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 20
        }}>

            {/* Master Floating Container */}
            <div className="mx-auto bg-slate-50 rounded-xl shadow-2xl overflow-hidden" style={{
                maxWidth: '1100px',
                width: '100%',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                overflow: 'hidden' // Ensure clipping
            }}>

                {/* Unified Header (Inside Container) */}
                <header style={{
                    width: '100%',
                    padding: '1.5rem 2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    zIndex: 10,
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                }}>
                    <button
                        onClick={onBackToPrograms}
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
                            transition: 'all 0.2s',
                            zIndex: 5
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
                        className="platform-logout-btn"
                        onClick={onLogout}
                        style={{ position: 'static', margin: 0, zIndex: 5 }}
                    >
                        <Icons.LogOut style={{ width: 16, height: 16 }} />
                        Logout
                    </button>
                </header>

                {/* Master Content Area - FORCED BACKGROUND */}
                <div style={{
                    backgroundColor: '#f8fafc', // bg-slate-50
                    padding: '4rem 3rem 6rem',
                    width: '100%'
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        {/* Centered Page Header (Editorial Style) */}
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
                            </div>
                            <div style={{
                                color: '#2563eb',
                                fontWeight: 600,
                                letterSpacing: '0.25em',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                marginBottom: '1.5rem'
                            }}>
                                ENROLLMENT & ONBOARDING
                            </div>
                            <h1 style={{
                                fontSize: '3.5rem',
                                fontWeight: 400,
                                color: '#0f172a',
                                fontFamily: 'Georgia, serif',
                                lineHeight: 1.1,
                                marginBottom: '1.5rem'
                            }}>
                                Foundational Program
                            </h1>
                            <p style={{
                                fontSize: '1.125rem',
                                color: '#475569',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                maxWidth: '650px',
                                margin: '0 auto'
                            }}>
                                Transforming low-time pilots into verifiable assets through Pilot Quality Assurance and Pathway Credibility.
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                            gap: '3.5rem',
                            alignItems: 'start'
                        }}>

                            {/* Left Column: Context & Recognition */}
                            <div className="onboarding-info">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    <section>
                                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                                            Industry Recognition
                                        </h3>
                                        <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.05rem' }}>
                                            Recognized by <strong>Airbus</strong> and various global airlines, making its official debut at the Etihad Aviation Career Fair on January 21st, 2026.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                                            The WingMentor Difference
                                        </h3>
                                        <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.05rem' }}>
                                            We do not teach initial concepts or replace your flight school's curriculum. Instead, we act as diagnostic consultants. By analyzing your specific performance gaps and grading sheets, we provide the targeted, 1-on-1 consultation that standard flight instruction simply cannot accommodate.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                                            Core Deliverables
                                        </h3>
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            {[
                                                "Master advanced Crew Resource Management (CRM) and diagnostic problem-solving skills for multi-crew environments.",
                                                "Synthesize your flight hours into a Pilot Quality Assurance (PQA) profile that provides verifiable credibility.",
                                                "Earn an industry-recognized 50-Hour Mentorship Certificate through an accredited and structured program pathway.",
                                                "Utilize manufacturer-specific modules (Airbus & more) to bridge the 'Pilot Gap' and demonstrate airline readiness."
                                            ].map((item, i) => (
                                                <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '1rem', color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                                    <div style={{
                                                        marginTop: '0.35rem',
                                                        width: '22px',
                                                        height: '22px',
                                                        backgroundColor: 'rgba(15, 23, 42, 0.05)',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        border: '1px solid rgba(15, 23, 42, 0.1)',
                                                        backdropFilter: 'blur(4px)',
                                                        WebkitBackdropFilter: 'blur(4px)'
                                                    }}>
                                                        <div style={{ width: '6px', height: '6px', backgroundColor: '#0f172a', borderRadius: '50%' }}></div>
                                                    </div>
                                                    <span style={{ fontWeight: 500 }}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                </div>
                            </div>

                            {/* Right Column: Form Card (NESTED WHITE CARD) */}
                            <div className="onboarding-form">
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '2.5rem',
                                    borderRadius: '20px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    border: '1px solid #f1f5f9'
                                }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '2.5rem' }}>Enrollment Application</h2>

                                    {/* Error Display */}
                                    {error && (
                                        <div style={{
                                            backgroundColor: '#fef2f2',
                                            border: '1px solid #fecaca',
                                            borderRadius: '12px',
                                            padding: '1rem 1.5rem',
                                            marginBottom: '2rem',
                                            color: '#dc2626'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    backgroundColor: '#dc2626',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    marginTop: '2px'
                                                }}>
                                                    <div style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>!</div>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Enrollment Error</div>
                                                    <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{error}</div>
                                                    <button
                                                        onClick={() => setError(null)}
                                                        style={{
                                                            marginTop: '0.75rem',
                                                            background: 'none',
                                                            border: '1px solid #dc2626',
                                                            color: '#dc2626',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '6px',
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#dc2626';
                                                            e.currentTarget.style.color = 'white';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                            e.currentTarget.style.color = '#dc2626';
                                                        }}
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <div className="form-group">
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>
                                                Why are you interested in this program?
                                            </label>
                                            <textarea
                                                required
                                                value={interest}
                                                onChange={(e) => setInterest(e.target.value)}
                                                placeholder="Tell us about your motivation..."
                                                style={{
                                                    width: '100%',
                                                    minHeight: '120px',
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    outline: 'none',
                                                    fontSize: '1rem',
                                                    resize: 'none',
                                                    backgroundColor: '#f8fafc',
                                                    color: '#1e293b'
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>
                                                What are your primary aviation interests and goals?
                                            </label>
                                            <textarea
                                                required
                                                value={goals}
                                                onChange={(e) => setGoals(e.target.value)}
                                                placeholder="Share your long-term vision..."
                                                style={{
                                                    width: '100%',
                                                    minHeight: '120px',
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    outline: 'none',
                                                    fontSize: '1rem',
                                                    resize: 'none',
                                                    backgroundColor: '#f8fafc',
                                                    color: '#1e293b'
                                                }}
                                            />
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            padding: '1.5rem',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <div style={{ paddingTop: '0.2rem' }}>
                                                <input
                                                    type="checkbox"
                                                    id="agreement"
                                                    checked={agreed}
                                                    onChange={(e) => setAgreed(e.target.checked)}
                                                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                                />
                                            </div>
                                            <label htmlFor="agreement" style={{ fontSize: '0.875rem', color: '#64748b', cursor: 'pointer', lineHeight: 1.5 }}>
                                                I agree to the <span onClick={(e) => { e.preventDefault(); onShowTerms(); }} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline' }}>Terms and Conditions</span>, acknowledge that WingMentor is <strong>not</strong> a training program or flight school, but a <strong>Pilot Quality Assurance and Credibility Experience provider</strong>, and fully release WingMentor from any legal liability regarding the outcomes of this experience.
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!agreed || loading || !interest || !goals}
                                            className="w-full"
                                            style={{
                                                backgroundColor: agreed && interest && goals ? '#2563eb' : '#94a3b8',
                                                color: 'white',
                                                border: 'none',
                                                padding: '1.1rem',
                                                borderRadius: '12px',
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                cursor: agreed && interest && goals && !loading ? 'pointer' : 'not-allowed',
                                                transition: 'all 0.2s',
                                                boxShadow: agreed && interest && goals ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' : 'none'
                                            }}
                                            onClick={(e) => {
                                                if (!agreed) {
                                                    e.preventDefault();
                                                    alert('Please agree to the Terms and Conditions to complete enrollment.');
                                                } else if (!interest || !goals) {
                                                    e.preventDefault();
                                                    alert('Please fill in all required fields before completing enrollment.');
                                                }
                                            }}
                                        >
                                            {loading ? 'Processing...' : 
                                             !agreed ? 'Please Agree to Terms & Conditions' :
                                             (!interest || !goals) ? 'Please Complete All Fields' :
                                             'Complete Enrollment'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Modal */}
                {showLegal && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '2rem'
                    }}>
                        <div className="animate-scale-in" style={{
                            backgroundColor: 'white',
                            width: '100%',
                            maxWidth: '800px',
                            maxHeight: '85vh',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}>
                            <div style={{
                                padding: '1.5rem 2.5rem',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Legal Documentation</h2>
                                <button
                                    onClick={() => setShowLegal(false)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}
                                >
                                    <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                                </button>
                            </div>

                            <div style={{ padding: '2.5rem', overflowY: 'auto', flex: 1, backgroundColor: '#fcfdfe' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    {/* Privacy Policy moves to top or stays as main content of this modal */}

                                    {/* Privacy Policy */}
                                    <section>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', borderBottom: '2px solid #eff6ff', paddingBottom: '0.5rem' }}>Privacy Policy</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
                                            <div>
                                                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '0.5rem' }}>1. Data Collection & Advocacy</strong>
                                                To provide personalized mentorship and industry advocacy, WingMentor collects information provided during enrollment and subsequent training sessions. This data is used to give pilots "a voice" within the industry, ensuring your input reaches major aviation governing bodies.
                                            </div>
                                            <div>
                                                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '0.4rem' }}>2. Logbook & Performance Synthesis</strong>
                                                Your mentorship hours, session metrics, and peer-verification statuses are stored in our secure architecture. This data is synthesized into the "WingMentor Portfolio," which serves as evidence of your leadership and technical CRM skills to potential employers.
                                            </div>
                                            <div>
                                                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '0.5rem' }}>3. Industry Sharing & Efficacy</strong>
                                                Your personal data is never sold. However, anonymized data is shared with manufacturing partners (like <strong>Airbus</strong>) and airlines to optimize program efficacy and advocate for pilot needs. Your full portfolio is only shared with recruiters upon your explicit opt-in for specific placement initiatives.
                                            </div>
                                            <div>
                                                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '0.5rem' }}>4. Professional Transparency</strong>
                                                WingMentor maintains a high standard of data integrity. Falsification of session data or logbook entries will result in immediate termination of the mentorship agreement and potentially impact industry-recognized certifications.
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'white' }}>
                                <button
                                    onClick={() => setShowLegal(false)}
                                    style={{
                                        backgroundColor: '#0f172a',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.875rem 2.5rem',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
