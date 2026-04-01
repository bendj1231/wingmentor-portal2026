import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';

interface EmergingAirTaxiPageProps {
    onBack: () => void;
    onLogout: () => void;
}

export const EmergingAirTaxiPage: React.FC<EmergingAirTaxiPageProps> = ({ onBack, onLogout }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const airTaxiImages = [
        "/Archer-Midnight-eVTOL.png",
        "/WhatsApp Image 2026-02-01 at 20.17.39.jpeg"
    ];

    useEffect(() => {
        console.log('Air Taxi carousel - Setting up simple automatic interval');
        
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % airTaxiImages.length;
                console.log('Air Taxi carousel - Auto-changing to image:', newIndex, airTaxiImages[newIndex]);
                return newIndex;
            });
        }, 4000); // Change every 4 seconds for smooth automatic transitions

        return () => {
            console.log('Air Taxi carousel - Cleaning up interval');
            clearInterval(interval);
        };
    }, []); // Empty dependency array

    return (
        <div className="dashboard-container animate-fade-in">
            <main className="dashboard-card" style={{ position: 'relative' }}>
                <button className="platform-logout-btn" onClick={onLogout}>
                    <Icons.LogOut style={{ width: 16, height: 16 }} />
                    Logout
                </button>
                <div className="dashboard-header" style={{ marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <button onClick={onBack} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Pathways
                    </button>
                    <div className="dashboard-subtitle">PATHWAY PROGRAM</div>
                    <h1 className="dashboard-title" style={{ fontSize: '2.5rem' }}>Emerging Air Taxi Pathway</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto' }}>
                        A specialized curriculum focusing on eVTOL operations, urban air mobility, and the future of short-hop aerial transit.
                    </p>
                </div>

                {/* Main Content with Image */}
                <div style={{ padding: '3rem', backgroundColor: 'white' }}>
                    <div className="animate-fade-in">
                        {/* Main Air Taxi Pathway Card with Image */}
                        <div className="horizontal-card" style={{ 
                            cursor: 'default', 
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
                                            Archer Aviation eVTOL
                                        </h3>
                                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1.5rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                                            Advanced training program for Archer Midnight eVTOL operations, featuring cutting-edge electric vertical takeoff and landing aircraft technology for urban air mobility.
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                            <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', borderRadius: '12px', color: '#3730a3', fontWeight: 500 }}>
                                                eVTOL Focus
                                            </span>
                                            <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                                Urban Mobility
                                            </span>
                                            <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                                Electric Aviation
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                                            <strong>Program Highlights:</strong>
                                            <ul style={{ margin: '0.5rem 0 0 1.5rem', color: '#64748b' }}>
                                                <li>Archer Midnight systems training and certification</li>
                                                <li>Urban air traffic management and operations</li>
                                                <li>eVTOL battery management and efficiency</li>
                                                <li>Passenger safety protocols in urban environments</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="hub-card-arrow">
                                    <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                                </div>
                            </div>
                            <div style={{ position: 'relative', width: '35%', height: '100%', overflow: 'hidden' }}>
                                {airTaxiImages.map((image, index) => (
                                    <img 
                                        key={index}
                                        src={image} 
                                        alt={`Air Taxi ${index === 0 ? 'Archer Midnight eVTOL' : 'Aviation Operations'}`} 
                                        className="hub-card-bg-image" 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover', 
                                            objectPosition: 'center',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            opacity: currentImageIndex === index ? 1 : 0,
                                            transition: 'opacity 1.5s ease-in-out'
                                        }}
                                        onError={(e) => {
                                            console.log('Air Taxi carousel - Image failed to load:', image);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Program Structure */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                                Air Taxi Pathway Structure
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
                                                    Phase 1: eVTOL Fundamentals
                                                </h4>
                                                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                                                    Comprehensive understanding of electric vertical takeoff and landing aircraft systems, battery technology, and urban air mobility concepts.
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                                                        6 Weeks
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                                                        Systems Training
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
                                                    Phase 2: Urban Operations
                                                </h4>
                                                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                                                    Advanced training in urban air traffic management, vertiport operations, and passenger handling in metropolitan environments.
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                                                        8 Weeks
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                                                        Flight Operations
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
                                                    Direct placement assistance with Archer Aviation and urban air mobility operators for air taxi pilot positions.
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                                                        Placement Support
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                                                        Industry Network
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Industry Partners */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                                Industry Partnership
                            </h3>
                            <div className="horizontal-card" style={{ 
                                padding: '2rem', 
                                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                borderRadius: '20px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                                border: '1px solid #bae6fd'
                            }}>
                                <div className="horizontal-card-content-wrapper">
                                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontSize: '1.5rem', color: '#1e40af', fontWeight: 'bold' }}>•</div>
                                        <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Archer Aviation Partnership
                                            </h3>
                                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1.5rem', color: '#1e3a8a', fontSize: '1rem', lineHeight: 1.6 }}>
                                                Direct partnership with Archer Aviation provides exclusive access to Midnight eVTOL training, certification pathways, and career opportunities in the emerging air taxi industry.
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1rem', color: '#1e40af' }}>•</span>
                                                    <span style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
                                                        Exclusive Training Access
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1rem', color: '#1e40af' }}>•</span>
                                                    <span style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
                                                        Direct Career Placement
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1rem', color: '#1e40af' }}>•</span>
                                                    <span style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
                                                        Industry Certification
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1rem', color: '#1e40af' }}>•</span>
                                                    <span style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
                                                        Advanced Technology Training
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
                                    Launch Your Air Taxi Career
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                                    Take the first step toward becoming an eVTOL pilot with our specialized Air Taxi Pathway program.
                                </p>
                                <button
                                    onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com?subject=Air Taxi Pathway Inquiry&body=I am interested in learning more about the Emerging Air Taxi pathway through WingMentor.'}
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
                                    Inquire About Air Taxi Pathway
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
                        Transform your aviation career with cutting-edge eVTOL training through WingMentor's Air Taxi Pathway.
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
