import React from 'react';
import { Icons } from '../icons';

interface PilotGapModuleChapter0Props {
    onBack: () => void;
}

export const PilotGapModuleChapter0: React.FC<PilotGapModuleChapter0Props> = ({ onBack }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in-out' }}>
            {/* Hub-Style Header */}
            <div style={{ textAlign: 'center', paddingBottom: '3.5rem', paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
                </div>
                <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                    MODULE 01
                </div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                    Industry Familiarization &<br />Indoctrination
                </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', alignItems: 'center' }}>
                {/* Introduction / Welcome Section */}
                <section style={{ textAlign: 'center', maxWidth: '42rem', marginTop: '2rem' }}>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        INTRODUCTION
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                        Welcome Aboard, Future Aviator
                    </h2>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2.5rem' }}>
                        You've chosen to step beyond the standard pilot career path. The WingMentor Foundational Program is your bridge from "low-timer" to recognized professional. This module will ground you in the realities of our industry, the paradox of the pilot shortage, and the precise framework WingMentor uses to turn your training hours into verifiable industry recognition.
                    </p>
                </section>
            </div>
        </div>
    );
};
