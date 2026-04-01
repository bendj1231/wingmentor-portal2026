import React from 'react';
import { Icons } from '../icons';

interface PrivateSectorPathwayPageProps {
  onBack: () => void;
}

export const PrivateSectorPathwayPage: React.FC<PrivateSectorPathwayPageProps> = ({ onBack }) => {
  return (
    <div className="dashboard-container animate-fade-in">
      <main className="dashboard-card" style={{ position: 'relative' }}>
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
              <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
              Back to Pathways
            </button>
          </div>

          <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
          </div>

          <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em', color: '#2563eb', fontWeight: 700 }}>
            PRIVATE SECTOR PATHWAY
          </div>

          <h1 className="dashboard-title" style={{
            fontSize: '3.3rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
            color: '#0f172a'
          }}>
            Private Jet Sector Excellence
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
            Specialized pathway for pilots seeking careers in private aviation with direct insights from Gulfstream, charter companies, and private jet operators.
          </p>
        </header>

        <div className="dashboard-content" style={{ padding: '3rem', backgroundColor: 'white' }}>
          <div className="animate-fade-in">
            {/* Main Private Sector Overview */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Private Aviation Excellence
                    </h3>
                    <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1.5rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                      WingMentor's Private Sector Pathway provides specialized training for pilots seeking careers in the private jet sector, with direct feedback from Gulfstream and private charter companies on ideal pilot profiles and requirements.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', borderRadius: '12px', color: '#3730a3', fontWeight: 500 }}>
                        Private Jet Focus
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                        Industry Insights
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                        Direct Relations
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hub-card-arrow">
                  <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                </div>
              </div>
              <img 
                src="/Silhouette-of-pilot-walking-aw-1140x760.jpg" 
                alt="Private Sector Pilot" 
                className="hub-card-bg-image" 
                style={{ 
                  width: '35%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center',
                  opacity: 0.9,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
              />
            </div>

            {/* Industry Differences Section */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #f59e0b'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#92400e', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Private vs General Aviation
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#92400e', marginBottom: '0.75rem' }}>
                          Private Aviation Operations
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#78350f', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          <li>High-net-worth client service excellence</li>
                          <li>Flexible scheduling and global operations</li>
                          <li>Advanced aircraft systems proficiency</li>
                          <li>Discretion and confidentiality protocols</li>
                          <li>Premium service delivery standards</li>
                        </ul>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#92400e', marginBottom: '0.75rem' }}>
                          General Aviation Differences
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#78350f', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          <li>Standardized commercial procedures</li>
                          <li>Fixed route structures</li>
                          <li>Regulatory compliance focus</li>
                          <li>Cost-efficient operations</li>
                          <li>Volume-based service models</li>
                        </ul>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: '#78350f', margin: 0, fontStyle: 'italic' }}>
                        Private aviation demands a unique skill set combining technical excellence with premium service delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Industry Partner Insights */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                Direct Industry Partner Insights
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {/* Gulfstream Insights */}
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>
                          Gulfstream Requirements
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Direct feedback from Gulfstream on ideal pilot profiles for their advanced aircraft fleet, including technical proficiency and service excellence standards.
                        </p>
                        <div style={{ marginBottom: '1rem' }}>
                          <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Ideal Pilot Profile:
                          </h5>
                          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            <li>Advanced systems knowledge (G500/650/700)</li>
                            <li>International operational experience</li>
                            <li>Client service excellence</li>
                            <li>Problem-solving capabilities</li>
                            <li>Adaptability to dynamic schedules</li>
                          </ul>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#fef3c7', borderRadius: '8px', color: '#92400e' }}>
                            G650 Rating
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Global Ops
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charter Companies Insights */}
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>
                          Charter Company Insights
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Exclusive feedback from leading private charter companies on pilot requirements and operational expectations in the private jet sector.
                        </p>
                        <div style={{ marginBottom: '1rem' }}>
                          <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Operational Requirements:
                          </h5>
                          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            <li>Multi-type rating proficiency</li>
                            <li>International flight planning expertise</li>
                            <li>Client relationship management</li>
                            <li>Discretion and professionalism</li>
                            <li>Flexibility and adaptability</li>
                          </ul>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#e0e7ff', borderRadius: '8px', color: '#3730a3' }}>
                            Multi-Type
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Client Focus
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guided Pathway Section */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #3b82f6'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#1e40af', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Guided Pathway Alignment
                    </h3>
                    <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1.5rem', color: '#1e3a8a', fontSize: '1rem', lineHeight: 1.6 }}>
                      Our guided pathway aligns your skills and experience with the specific requirements of Gulfstream and private charter companies, ensuring you meet their ideal pilot profile criteria.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.75rem' }}>
                          Skill Development
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e3a8a', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          <li>Advanced aircraft systems training</li>
                          <li>International procedures mastery</li>
                          <li>Service excellence protocols</li>
                          <li>Client communication skills</li>
                        </ul>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.75rem' }}>
                          Portfolio Building
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e3a8a', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          <li>Type rating acquisition strategy</li>
                          <li>Flight experience optimization</li>
                          <li>Professional network development</li>
                          <li>Industry certification alignment</li>
                        </ul>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: '#1e3a8a', margin: 0, fontWeight: 600 }}>
                        Direct relations with operators and private jet brokers ensure pathway alignment with industry requirements
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aircraft Type Rating Focus */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                Target Aircraft Type Ratings
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Gulfstream Series
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          G280, G450, G550, G650, G700 with advanced systems training and operational procedures.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#fef3c7', borderRadius: '8px', color: '#92400e' }}>
                            Premium
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Long Range
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Bombardier Series
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Learjet, Challenger, Global series with focus on performance and operational flexibility.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#e0e7ff', borderRadius: '8px', color: '#3730a3' }}>
                            Versatile
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Performance
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Dassault Falcon
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Falcon series with advanced technology and efficiency for private jet operations.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#dcfce7', borderRadius: '8px', color: '#166534' }}>
                            Efficient
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Advanced
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Private Jet Broker Relations */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Private Jet Broker Network
                    </h3>
                    <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1.5rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                      Direct relations with private jet brokers provide insights into market demands and pilot requirements, ensuring your training aligns with current industry needs.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#2563eb' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>Market Intelligence</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#2563eb' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>Demand Analysis</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#2563eb' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>Career Placement</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#2563eb' }}>•</span>
                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>Industry Networking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Structure */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                Private Sector Pathway Structure
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Phase 1: Industry Foundation
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Comprehensive understanding of private aviation operations, service standards, and industry expectations.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            4 Weeks
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Service Excellence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Phase 2: Type Rating Focus
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Specialized training on target aircraft types with direct operator feedback and evaluation.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            8-12 Weeks
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Aircraft Systems
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Phase 3: Career Placement
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Direct placement assistance with our network of private jet operators and charter companies.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Placement Support
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Network Access
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
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #bae6fd'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                  Elevate Your Career in Private Aviation
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                  Take the first step toward a prestigious career in private aviation with our guided pathway. Contact us to learn about enrollment and career opportunities.
                </p>
                <button
                  onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com?subject=Private Sector Pathway Inquiry&body=I am interested in learning more about the Private Sector pathway through WingMentor.'}
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
                  Inquire About Private Sector Pathway
                </button>
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
            Transform your aviation career with specialized private jet sector training through WingMentor.
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
      </main>
    </div>
  );
};
