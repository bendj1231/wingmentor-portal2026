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

interface MentorModulesPageProps {
    onBack: () => void;
    onComplete?: () => void;
}

const MentorModulesPage: React.FC<MentorModulesPageProps> = ({ onBack, onComplete }) => {
    const [currentChapter, setCurrentChapter] = useState(1);
    const [currentTopic, setCurrentTopic] = useState<string | null>('what-is-mentor');

    const navigationFlow = [
        { chapter: 1, topic: 'what-is-mentor' },
        { chapter: 2, topic: 'mentor-differentiation' },
        { chapter: 3, topic: 'ebt-cbta-competencies' },
        { chapter: 4, topic: 'prescription-methodology' },
        { chapter: 5, topic: 'problem-solving-framework' },
        { chapter: 6, topic: 'assessment-techniques' },
        { chapter: 7, topic: 'consultation-support' }
    ];

    // VERY EXPLICIT DEBUGGING
    console.log('=== NAVIGATION DEBUG ===');
    console.log('navigationFlow:', navigationFlow);
    console.log('navigationFlow.length:', navigationFlow.length);
    console.log('navigationFlow[7]:', navigationFlow[7]); // Check if 8th item exists
    console.log('=== END DEBUG ===');

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
    const startEditing = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.isContentEditable) return;
        setEditingEl(target);
        target.contentEditable = 'true';
        target.focus();
    }, []);

    const stopEditing = useCallback(() => {
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
        console.log('Rendering content for chapter:', currentChapter);
        switch (currentChapter) {
            case 1:
                console.log('Rendering MentorModulesPage0');
                return <MentorModulesPage0 onBack={onBack} />;
            case 2:
                console.log('Rendering MentorModulesPage1');
                return <MentorModulesPage1 onBack={onBack} />;
            case 3:
                console.log('Rendering MentorModulesPage2');
                return <MentorModulesPage2 onBack={onBack} />;
            case 4:
                console.log('Rendering MentorModulesPage3');
                return <MentorModulesPage3 onBack={onBack} />;
            case 5:
                console.log('Rendering MentorModulesPage4');
                return <MentorModulesPage4 onBack={onBack} />;
            case 6:
                console.log('Rendering MentorModulesPage5');
                return <MentorModulesPage5 onBack={onBack} />;
            case 7:
                console.log('Rendering MentorModulesPage6');
                return <MentorModulesPage6 onBack={onBack} />;
            default:
                console.log('Rendering default MentorModulesPage0');
                return <MentorModulesPage0 onBack={onBack} />;
        }
    };

    // ── Module Navigation Sidebar ───────────────────────────────────────────
    const ModuleNavigation = () => (
        <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '280px',
            height: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRight: '1px solid #cbd5e1',
            padding: '1.5rem',
            overflowY: 'auto',
            zIndex: 20
        }}>
            {/* Module Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        color: '#64748b'
                    }}
                >
                    <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
                    Back to Programs
                </button>
                
                <div style={{ textAlign: 'center' }}>
                    <img
                        src="/logo.png"
                        alt="WingMentor Logo"
                        style={{ maxWidth: '120px', height: 'auto', marginBottom: '1rem' }}
                    />
                    <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Module 2
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#1f2937', fontWeight: '600' }}>
                        Mentor Training
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Progress</span>
                    <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600' }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Chapter Navigation */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Chapters ({navigationFlow.length} total)
                </div>
                
                {navigationFlow.map((step, index) => {
                    const isActive = step.chapter === currentChapter;
                    const isCompleted = index < getCurrentStepIndex();
                    
                    return (
                        <button
                            key={`chapter-${step.chapter}-${step.topic}`}
                            onClick={() => {
                                setCurrentChapter(step.chapter);
                                setCurrentTopic(step.topic);
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: isActive ? '#3b82f6' : isCompleted ? '#f0fdf4' : 'white',
                                border: isActive ? '1px solid #3b82f6' : isCompleted ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '0.5rem',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: isActive ? 'white' : isCompleted ? '#22c55e' : '#f1f5f9',
                                color: isActive ? '#3b82f6' : isCompleted ? 'white' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}>
                                {isCompleted ? '✓' : step.chapter}
                            </div>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: isActive ? 'white' : isCompleted ? '#166534' : '#1f2937',
                                    marginBottom: '0.1rem'
                                }}>
                                    Chapter {step.chapter}
                                </div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: isActive ? 'rgba(255,255,255,0.8)' : isCompleted ? '#166534' : '#64748b'
                                }}>
                                    {getChapterTitle(step.chapter)}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    // ── Helper Function for Chapter Titles ───────────────────────────────────
    const getChapterTitle = (chapterIndex: number): string => {
        const titles = [
            '', // Index 0 - unused
            'What Is a Mentor?', // Index 1 - Chapter 1
            'Developing Mentor Mindset', // Index 2 - Chapter 2
            'EBT CBTA Competencies', // Index 3 - Chapter 3
            'Prescription Methodology', // Index 4 - Chapter 4
            'Problem-Solving Framework', // Index 5 - Chapter 5
            'Assessment Techniques', // Index 6 - Chapter 6
            'Consultation & Support' // Index 7 - Chapter 7
        ];
        return titles[chapterIndex] || '';
    };

    // ── Main Render ───────────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
            {/* Module Navigation Sidebar */}
            <ModuleNavigation />
            
            {/* Main Content */}
            <div style={{
                flex: 1,
                marginLeft: '280px',
                overflowY: 'auto',
                position: 'relative'
            }}>
                {/* Navigation Arrows */}
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    display: 'flex',
                    gap: '1rem',
                    zIndex: 10
                }}>
                    <button
                        onClick={handlePrev}
                        disabled={getCurrentStepIndex() === 0}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: getCurrentStepIndex() === 0 ? '#f1f5f9' : '#3b82f6',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: getCurrentStepIndex() === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: getCurrentStepIndex() === 0 ? '#9ca3af' : 'white',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
                        Previous
                    </button>
                    
                    <button
                        onClick={handleNext}
                        disabled={getCurrentStepIndex() === navigationFlow.length - 1}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: getCurrentStepIndex() === navigationFlow.length - 1 ? '#f1f5f9' : '#3b82f6',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: getCurrentStepIndex() === navigationFlow.length - 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: getCurrentStepIndex() === navigationFlow.length - 1 ? '#9ca3af' : 'white',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Next
                        <Icons.ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                {/* Content */}
                {renderCurrentContent()}
            </div>
        </div>
    );
};

export default MentorModulesPage;
