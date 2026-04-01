import React from 'react';
import { Icons } from '../icons';

interface PilotGapModuleChapter2Props {
    onBack: () => void;
}

export const PilotGapModuleChapter2: React.FC<PilotGapModuleChapter2Props> = ({ onBack }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>

            {/* ── Section Header ── */}
            <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
                </div>
                <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                    CHAPTER 02
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400, color: '#0f172a', fontFamily: 'Georgia, serif', margin: '0 auto 1rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                    The "Solution"
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '42rem', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                    The WingMentor approach to bridging the recognition gap—a structured, industry-endorsed framework to transform low-time pilots into verified, placement-ready professionals.
                </p>
                <div style={{ height: '1px', width: '100%', background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)', maxWidth: '56rem', margin: '0 auto' }} />
            </div>

            {/* ── Body Content ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                {/* Placeholder for actual content */}
                <section style={{ textAlign: 'center', maxWidth: '56rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                        Structured Pathway Forward
                    </h3>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2rem' }}>
                        Our solution combines verified training milestones, industry recognition protocols, and mentorship frameworks to create a clear pathway from low-time pilot to aviation professional.
                    </p>
                </section>
            </div>
        </div>
    );
};
