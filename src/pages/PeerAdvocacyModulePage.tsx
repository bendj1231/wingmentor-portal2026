import React, { useState } from 'react';
import { Icons } from '../icons';

interface PeerAdvocacyModulePageProps {
    onBack: () => void;
    onLogout: () => void;
}

const PeerAdvocacyModulePage: React.FC<PeerAdvocacyModulePageProps> = ({ onBack, onLogout }) => {
    const [gameState, setGameState] = useState<'idle' | 'running' | 'score'>('idle');
    const [score, setScore] = useState(0);

    const startCognitiveTest = () => {
        setGameState('running');
        setTimeout(() => {
            setScore(Math.floor(Math.random() * 20) + 80);
            setGameState('score');
        }, 2000);
    };

    return (
        <div className="dashboard-container animate-fade-in sm:py-10">
            <main className="mx-auto max-w-[480px] bg-white shadow-2xl sm:rounded-2xl overflow-hidden relative flex flex-col" style={{ minHeight: '880px' }}>
                <button className="platform-logout-btn z-50 text-slate-400 hover:text-slate-800" onClick={onLogout} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    <Icons.LogOut style={{ width: 16, height: 16 }} />
                    Logout
                </button>

                {/* Page Header */}
                <div className="p-8 pb-6 border-b border-solid border-slate-100 bg-slate-50 relative">
                    <button
                        onClick={onBack}
                        className="mb-8 mt-2 text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors bg-white rounded-full px-4 py-2 shadow-sm border border-solid border-slate-200"
                    >
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                            <Icons.UserPlus style={{ width: 28, height: 28 }} />
                        </div>
                        <div>
                            <div className="text-sky-600 tracking-widest text-[0.65rem] font-bold uppercase">
                                Module 03: Performance
                            </div>
                            <h1 className="font-serif text-2xl leading-tight text-slate-900">
                                Exams & Recognition
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Cognitive Testing Sandbox */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative border border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 mb-2">Cognitive Sandbox</h3>
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                Mental arithmetic and spatial awareness training for airline recruitment (PilotGap-V1.2).
                            </p>

                            {gameState === 'idle' && (
                                <button
                                    onClick={startCognitiveTest}
                                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 font-bold rounded-xl transition-all shadow-lg text-sm"
                                >
                                    Launch Performance Test
                                </button>
                            )}

                            {gameState === 'running' && (
                                <div className="py-8 flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
                                    <div className="text-xs font-mono text-sky-300">CALCULATING MENTAL VECTORS...</div>
                                </div>
                            )}

                            {gameState === 'score' && (
                                <div className="p-4 bg-sky-900/40 rounded-xl border border-sky-500/30 text-center animate-scale-in">
                                    <div className="text-[0.6rem] text-sky-300 uppercase font-bold mb-1">Your Industry Percentile</div>
                                    <div className="text-3xl font-black text-white">{score}%</div>
                                    <button
                                        onClick={() => setGameState('idle')}
                                        className="mt-4 text-xs font-bold text-sky-400 hover:text-sky-300"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Internal Examinations Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative">
                            <div className="absolute top-4 right-4 text-[0.6rem] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                                Verified Hub
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Icons.Award style={{ width: 22, height: 22, color: '#0ea5e9' }} />
                                Foundation Final
                            </h3>
                            <p className="text-[0.7rem] text-slate-500 leading-relaxed mb-6">
                                The ultimate validation of your "Pilot Gap" mastery. Covers everything from hierarchy protocols to type rating investment strategies.
                            </p>
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center text-xs">
                                    <span className="text-slate-600 font-medium italic">Interview Simulation 01</span>
                                    <Icons.Lock className="text-slate-300" style={{ width: 14, height: 14 }} />
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center text-xs">
                                    <span className="text-slate-600 font-medium italic">Data-Driven Recognition Exam</span>
                                    <Icons.Lock className="text-slate-300" style={{ width: 14, height: 14 }} />
                                </div>
                                <button className="w-full py-3 border-2 border-slate-200 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed">
                                    Locked Until Module 02 Completion
                                </button>
                            </div>
                        </div>

                        {/* Global Visibility Map (Updated) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 bg-sky-50 border-b border-sky-100 flex justify-between items-center">
                                <span className="text-[0.65rem] font-bold text-sky-700 uppercase">Network Visibility Status</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-300"></div>
                                </div>
                            </div>
                            <div className="h-24 bg-slate-50 relative flex items-center justify-center">
                                <Icons.Globe className="text-slate-200 w-16 h-16" />
                                <div className="absolute text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">Awaiting Candidate Benchmarks</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100 text-center">
                    <p className="text-[0.6rem] text-slate-400 font-bold tracking-[0.2em] uppercase">Recruitment Recognition Office</p>
                </div>
            </main>
        </div>
    );
};

export default PeerAdvocacyModulePage;
