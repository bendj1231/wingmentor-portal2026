import React from 'react';
import { Icons } from '../icons';

interface PilotGapModuleChapter1Props {
    onBack: () => void;
}

export const PilotGapModuleChapter1: React.FC<PilotGapModuleChapter1Props> = ({ onBack }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>

            {/* ── Page Header ── */}
            <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
                </div>
                <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                    CHAPTER 01
                </div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                    Understanding the What's
                </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                {/* Introduction / Welcome Section */}
                <section style={{ textAlign: 'center', maxWidth: '42rem', marginTop: '2rem' }}>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        INTRODUCTION
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                        The Core Concepts
                    </h2>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2.5rem' }}>
                        Before we can solve the recognition gap, we must first understand the terminology and landscape. This chapter breaks down the fundamental concepts that every pilot must grasp to navigate today's aviation industry successfully.
                    </p>
                </section>
            </div>
        </div>
    );
};
