import React from 'react';
import { Icons } from '../icons';

interface ATPLPathwayPageProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

export const ATPLPathwayPage: React.FC<ATPLPathwayPageProps> = ({ onBack, isDarkMode = false }) => {
  return (
    <div className="dashboard-container animate-fade-in" style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0, overflow: 'auto', zIndex: 10, padding: '2rem 1rem', alignItems: 'flex-start', minHeight: 'auto' }}>
      <main className="dashboard-card" style={{ maxWidth: '1400px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={onBack}
            className="mb-6 mt-2 text-sm font-medium flex items-center gap-2 transition-colors rounded-full px-4 py-2 shadow-sm border border-solid"
            style={{
              color: isDarkMode ? '#94a3b8' : undefined,
              background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : undefined,
              borderColor: isDarkMode ? 'rgba(71, 85, 105, 0.7)' : undefined,
            }}
          >
            <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Pathways
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/logo.png"
              alt="WingMentor Logo"
              style={{ maxWidth: '260px', height: 'auto', objectFit: 'contain', marginBottom: '2rem' }}
            />
            <div className="tracking-widest text-xs font-bold uppercase mb-3" style={{ color: isDarkMode ? '#60a5fa' : undefined }}>
              ATPL PATHWAY
            </div>
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 400,
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              Airline Transport Pilot License
            </h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.8 }}>
              Advanced ATPL theory training through prestigious Approved Training Organizations (ATOs) in the UAE with comprehensive license conversion support and visa management.
            </p>
          </div>
        </div>

        <div style={{ padding: '0', backgroundColor: 'transparent' }}>
          <div className="animate-fade-in">
            {/* Main ATPL Pathway Overview */}
            <div className="horizontal-card" style={{ 
              marginBottom: '2rem',
              background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
              borderRadius: '18px',
              padding: '1.75rem',
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
              boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ATPL Theory Excellence
                    </h3>
                    <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1.5rem', color: isDarkMode ? '#cbd5e1' : '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                      WingMentor's ATPL Pathway provides comprehensive theoretical training through our prestigious network of Approved Training Organizations (ATOs) in the United Arab Emirates, offering internationally recognized certification with full visa and administrative support.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', borderRadius: '12px', color: isDarkMode ? '#fbbf24' : '#92400e', fontWeight: 500, border: isDarkMode ? '1px solid rgba(245, 158, 11, 0.3)' : undefined }}>
                        ATPL Theory
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '12px', color: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: 500, border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                        UAE Based
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7', borderRadius: '12px', color: isDarkMode ? '#4ade80' : '#166534', fontWeight: 500, border: isDarkMode ? '1px solid rgba(34, 197, 94, 0.25)' : undefined }}>
                        Global Recognition
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner ATOs Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                Our Approved Training Organization Partners
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {/* Emirates Academy */}
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
                  borderRadius: '18px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
                  boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700 }}>
                          Emirates Academy
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Premier aviation training institution with world-class facilities and experienced instructors, offering comprehensive ATPL theoretical training programs.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', borderRadius: '8px', color: isDarkMode ? '#fbbf24' : '#92400e', border: isDarkMode ? '1px solid rgba(245, 158, 11, 0.3)' : undefined }}>
                            Premium Facility
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '8px', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                            Expert Instructors
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fujairah Aviation Flight School */}
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
                  borderRadius: '18px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
                  boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700 }}>
                          Fujairah Aviation Flight School
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Established flight training academy with excellent track record in ATPL theory preparation and practical flight training integration.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff', borderRadius: '8px', color: isDarkMode ? '#a5b4fc' : '#3730a3', border: isDarkMode ? '1px solid rgba(99, 102, 241, 0.3)' : undefined }}>
                            Experienced
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '8px', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                            Comprehensive
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emirates Section Benefits */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(146, 64, 14, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)'
                : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '20px',
              boxShadow: isDarkMode ? '0 8px 32px rgba(2, 6, 23, 0.35)' : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              border: isDarkMode ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #f59e0b'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: isDarkMode ? '#fbbf24' : '#92400e', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isDarkMode ? '#fbbf24' : '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Emirates ATPL Pathway Benefits
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: isDarkMode ? '#fbbf24' : '#92400e', marginBottom: '0.75rem' }}>
                          Complete Administrative Support
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: isDarkMode ? '#fde68a' : '#78350f', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          <li>Visa arrangement and management</li>
                          <li>Flight school enrollment coordination</li>
                          <li>Documentation processing</li>
                          <li>Accommodation assistance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: isDarkMode ? '#fbbf24' : '#92400e', marginBottom: '0.75rem' }}>
                          License Conversion Opportunity
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: isDarkMode ? '#fde68a' : '#78350f', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          <li>Convert existing licenses to UAE standards</li>
                          <li>GCA Emirates license acquisition</li>
                          <li>International license recognition</li>
                          <li>Career mobility enhancement</li>
                        </ul>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#fde68a' : '#78350f', margin: 0, fontStyle: 'italic' }}>
                        WingMentor manages all arrangements with flight schools, ensuring seamless transition to UAE aviation training environment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Examination Value */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
              borderRadius: '18px',
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
              boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Globally Valued UAE Examination
                    </h3>
                    <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1.5rem', color: isDarkMode ? '#cbd5e1' : '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                      The theoretical examination conducted within the Emirates is vital and valued globally, providing pilots with internationally recognized credentials that enhance their career prospects worldwide.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: isDarkMode ? '#60a5fa' : '#2563eb' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>International Recognition</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: isDarkMode ? '#60a5fa' : '#2563eb' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>Global Standard Compliance</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: isDarkMode ? '#60a5fa' : '#2563eb' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>Career Mobility Enhancement</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: isDarkMode ? '#60a5fa' : '#2563eb' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>Industry-Wide Acceptance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CAAP License Holder Example */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: isDarkMode
                ? 'linear-gradient(180deg, rgba(30, 64, 175, 0.18) 0%, rgba(30, 58, 138, 0.12) 100%)'
                : 'white',
              borderRadius: '18px',
              border: isDarkMode ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid #e2e8f0',
              boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: isDarkMode ? '#60a5fa' : '#1e40af', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isDarkMode ? '#93c5fd' : '#1e40af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      CAAP License Holder Advantage
                    </h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: isDarkMode ? '#93c5fd' : '#1e40af', marginBottom: '0.75rem' }}>
                        Example: Philippines to UAE ATPL Pathway
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#bfdbfe' : '#1e3a8a', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                        As a CAAP license holder, undergoing the ATPL pathway in the UAE through WingMentor provides exceptional value and career advancement opportunities.
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div>
                          <h5 style={{ fontSize: '1rem', fontWeight: 600, color: isDarkMode ? '#93c5fd' : '#1e40af', marginBottom: '0.5rem' }}>
                            UAE Benefits
                          </h5>
                          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: isDarkMode ? '#bfdbfe' : '#1e3a8a', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            <li>International examination experience</li>
                            <li>EASA examination standards exposure</li>
                            <li>GCC Emirates license opportunity</li>
                            <li>Global aviation network access</li>
                          </ul>
                        </div>
                        <div>
                          <h5 style={{ fontSize: '1rem', fontWeight: 600, color: isDarkMode ? '#93c5fd' : '#1e40af', marginBottom: '0.5rem' }}>
                            Return to Philippines Value
                          </h5>
                          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: isDarkMode ? '#bfdbfe' : '#1e3a8a', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            <li>Higher credential valuation</li>
                            <li>International examination recognition</li>
                            <li>Enhanced employment prospects</li>
                            <li>Competitive advantage in market</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#93c5fd' : '#1e3a8a', margin: 0, fontWeight: 600 }}>
                        Your credentials as a pilot will be much higher value with international UAE examination experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Structure */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                ATPL Pathway Structure
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
                  borderRadius: '18px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
                  boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700 }}>
                          Phase 1: Theory Foundation
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Comprehensive ATPL theoretical subjects covering air law, meteorology, navigation, and aircraft systems.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '8px', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                            14 Subjects
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '8px', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                            3 Months
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
                  borderRadius: '18px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
                  boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700 }}>
                          Phase 2: Examination Preparation
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Intensive exam preparation with mock tests and EASA standard question banks for optimal performance.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '8px', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                            Mock Tests
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '8px', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                            EASA Standards
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
                  borderRadius: '18px',
                  border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
                  boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: isDarkMode ? '#60a5fa' : '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700 }}>
                          Phase 3: Certification
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Official GCA examination and license issuance with international recognition and career support.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '8px', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                            GCA Exam
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#f1f5f9', borderRadius: '8px', color: isDarkMode ? '#cbd5e1' : '#475569', border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.72)' : undefined }}>
                            License Issuance
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <div className="horizontal-card" style={{ 
                padding: '2rem', 
                background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.94) 100%)' : 'white',
                borderRadius: '18px',
                border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.75)' : '1px solid #e2e8f0',
                boxShadow: isDarkMode ? '0 18px 45px rgba(2,6,23,0.34)' : '0 18px 45px rgba(15,23,42,0.08)'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#0f172a', marginBottom: '1rem' }}>
                  Start Your ATPL Journey Today
                </h3>
                <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#cbd5e1' : '#64748b', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                  Take the next step in your aviation career with our internationally recognized ATPL pathway. Contact us to learn more about enrollment, requirements, and start dates.
                </p>
                <button
                  onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com?subject=ATPL Pathway Inquiry&body=I am interested in learning more about the ATPL pathway through WingMentor in the UAE.'}
                  style={{
                    padding: '1rem 2.5rem',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#1d4ed8';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>📧</span>
                  Inquire About ATPL Pathway
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer" style={{
          marginTop: '1rem',
          padding: '2rem 3.5rem',
          backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc',
          borderTop: isDarkMode ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #f1f5f9',
          textAlign: 'center'
        }}>
          <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Transform your aviation career with internationally recognized ATPL certification through WingMentor.
          </p>
          <button
            className="help-btn"
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: isDarkMode ? '1px solid rgba(71, 85, 105, 0.7)' : '1px solid #e2e8f0',
              background: isDarkMode ? 'rgba(15, 23, 42, 0.82)' : '#ffffff',
              color: isDarkMode ? '#e2e8f0' : '#1e293b',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              boxShadow: isDarkMode ? '0 8px 18px rgba(2, 6, 23, 0.25)' : '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com'}
          >
            ✉️ Contact Support
          </button>
        </footer>
      </main>
    </div>
  );
};
