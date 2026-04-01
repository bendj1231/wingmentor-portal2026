import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icons } from '../icons';
import { MentorModulesPage0 } from './MentorModulesPage0';
import { MentorModulesPage1 } from './MentorModulesPage1';
import { MentorModulesPage2 } from './MentorModulesPage2';
import { MentorModulesPage3 } from './MentorModulesPage3';
import { MentorModulesPage4 } from './MentorModulesPage4';
import { MentorModulesPage5 } from './MentorModulesPage5';
import { MentorModulesPage6 } from './MentorModulesPage6';
import { MentorModulesPage7 } from './MentorModulesPage7';

interface PilotGapModule2Props {
    onBack: () => void;
    onComplete?: () => void;
}

const PilotGapModule2: React.FC<PilotGapModule2Props> = ({ onBack, onComplete }) => {
    const [currentChapter, setCurrentChapter] = useState(1);
    const [currentTopic, setCurrentTopic] = useState<string | null>('mentor-differentiation');

    const navigationFlow = [
        { chapter: 1, topic: 'mentor-differentiation' },
        { chapter: 2, topic: 'ebt-cbta-competencies' },
        { chapter: 3, topic: 'prescription-methodology' },
        { chapter: 4, topic: 'problem-solving-framework' },
        { chapter: 5, topic: 'assessment-techniques' },
        { chapter: 6, topic: 'consultation-support' },
        { chapter: 7, topic: 'behavioral-change' }
    ];

    const getCurrentStepIndex = () => {
        return navigationFlow.findIndex(step => step.chapter === currentChapter && step.topic === currentTopic);
    };

    useEffect(() => {
        const isLastStep = getCurrentStepIndex() === navigationFlow.length - 1;
        if (isLastStep && onComplete) {
            onComplete();
        }
    }, [currentChapter, currentTopic, onComplete]);

    // ── Inline editing ──────────────────────────────────────────────────────
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: HTMLElement } | null>(null);
    const [editingEl, setEditingEl] = useState<HTMLElement | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // ── Video Player State ──────────────────────────────
    const heroVideoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // ── Context Menu ───────────────────────────────────────────────────────
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        setContextMenu({ x: rect.left, y: rect.top, target });
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                closeContextMenu();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [closeContextMenu]);

    // ── Inline Editing Functions ────────────────────────────────────────
    const startEdit = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.isContentEditable) return;
        setEditingEl(target);
        target.contentEditable = 'true';
        target.focus();
    }, []);

    const stopEdit = useCallback(() => {
        if (editingEl) {
            editingEl.contentEditable = 'false';
            setEditingEl(null);
        }
    }, [editingEl]);

    // ── Progress Calculation ───────────────────────────────────────────────
    const progress = ((getCurrentStepIndex() + 1) / navigationFlow.length) * 100;

    // ── Navigation Functions ───────────────────────────────────────────────
    const handleNext = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex < navigationFlow.length - 1) {
            const nextStep = navigationFlow[currentIndex + 1];
            setCurrentChapter(nextStep.chapter);
            setCurrentTopic(nextStep.topic);
        }
    };

    const handlePrev = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex > 0) {
            const prevStep = navigationFlow[currentIndex - 1];
            setCurrentChapter(prevStep.chapter);
            setCurrentTopic(prevStep.topic);
        }
    };

    // ── Keyboard Navigation ───────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't navigate if user is currently editing content
            if (editingEl) return;

            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, editingEl]);

    // ── Global scroll-to-top on navigation change ────────────────────────
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentChapter, currentTopic]);

    // ── Render Current Chapter/Topic ───────────────────────────────────────
    const renderCurrentContent = () => {
        console.log('Rendering Module 2 content for chapter:', currentChapter);
        switch (currentChapter) {
            case 1:
                console.log('Rendering MentorModulesPage1');
                return <MentorModulesPage1 onBack={onBack} />;
            case 2:
                console.log('Rendering MentorModulesPage2');
                return <MentorModulesPage2 onBack={onBack} />;
            case 3:
                console.log('Rendering MentorModulesPage3');
                return <MentorModulesPage3 onBack={onBack} />;
            case 4:
                console.log('Rendering MentorModulesPage4');
                return <MentorModulesPage4 onBack={onBack} />;
            case 5:
                console.log('Rendering MentorModulesPage5');
                return <MentorModulesPage5 onBack={onBack} />;
            case 6:
                console.log('Rendering MentorModulesPage6');
                return <MentorModulesPage6 onBack={onBack} />;
            case 7:
                console.log('Rendering MentorModulesPage7');
                return <MentorModulesPage7 onBack={onBack} />;
            default:
                console.log('Rendering default MentorModulesPage1');
                return <MentorModulesPage1 onBack={onBack} />;
        }
    };

    return (
        <div
            style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', position: 'relative' }}
            onContextMenu={handleContextMenu}
            onBlur={(e) => {
                const blurred = e.target as HTMLElement;
                if (blurred.contentEditable === 'true') commitEdit(blurred);
            }}
        >
            {/* ── Right-click context menu ── */}
            {contextMenu && (
                <div
                    ref={contextMenuRef}
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 9999,
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px -5px rgba(15,23,42,0.15), 0 4px 10px -3px rgba(15,23,42,0.08)',
                        overflow: 'hidden',
                        minWidth: '160px',
                        animation: 'fadeIn 0.12s ease-out',
                    }}
                >
                    <button
                        onClick={startEdit}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            width: '100%',
                            padding: '0.625rem 1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#1e293b',
                            textAlign: 'left',
                            transition: 'background 0.15s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#eff6ff')}
                        onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Text
                    </button>
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0 0.5rem' }} />
                    <button
                        onClick={closeContextMenu}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            width: '100%',
                            padding: '0.625rem 1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#64748b',
                            textAlign: 'left',
                            transition: 'background 0.15s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* ── Header ── */}
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'rgba(226, 232, 240, 0.7)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#1e293b',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(203, 213, 225, 0.9)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(226, 232, 240, 0.7)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Icons.ChevronLeft style={{ width: '16px', height: '16px' }} />
                        Back to Modules
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
                            Module 2 • Chapter {currentChapter}
                        </span>
                        <div style={{
                            width: '120px',
                            height: '6px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: '#2563eb',
                                borderRadius: '3px',
                                transition: 'width 0.3s ease',
                            }} />
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main style={{ paddingTop: '80px', paddingBottom: '4rem' }}>
                {renderCurrentContent()}
            </main>

            {/* ── Navigation Controls ── */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '1rem',
                zIndex: 40,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '0.75rem',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
            }}>
                <button
                    onClick={handlePrev}
                    disabled={getCurrentStepIndex() === 0}
                    style={{
                        background: getCurrentStepIndex() === 0 ? '#f1f5f9' : '#2563eb',
                        color: getCurrentStepIndex() === 0 ? '#94a3b8' : 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem 1.5rem',
                        cursor: getCurrentStepIndex() === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                    onMouseOver={(e) => {
                        if (getCurrentStepIndex() !== 0) {
                            e.currentTarget.style.background = '#1d4ed8';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (getCurrentStepIndex() !== 0) {
                            e.currentTarget.style.background = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    <Icons.ChevronLeft style={{ width: '16px', height: '16px' }} />
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={getCurrentStepIndex() === navigationFlow.length - 1}
                    style={{
                        background: getCurrentStepIndex() === navigationFlow.length - 1 ? '#f1f5f9' : '#2563eb',
                        color: getCurrentStepIndex() === navigationFlow.length - 1 ? '#94a3b8' : 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem 1.5rem',
                        cursor: getCurrentStepIndex() === navigationFlow.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                    onMouseOver={(e) => {
                        if (getCurrentStepIndex() !== navigationFlow.length - 1) {
                            e.currentTarget.style.background = '#1d4ed8';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (getCurrentStepIndex() !== navigationFlow.length - 1) {
                            e.currentTarget.style.background = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    Next
                    <Icons.ChevronRight style={{ width: '16px', height: '16px' }} />
                </button>
            </div>
        </div>
    );
};

// Helper function for inline editing
const commitEdit = (element: HTMLElement) => {
    // In a real implementation, this would save the edited content
    console.log('Content edited:', element.textContent);
};

export default PilotGapModule2;
