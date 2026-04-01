import React, { useState } from 'react';
import { Icons } from '../icons';

interface AIScreeningPageProps {
    onBack: () => void;
    onLogout: () => void;
}

export const AIScreeningPage: React.FC<AIScreeningPageProps> = ({ onBack, onLogout }) => {
    const [status] = useState<'pending' | 'completed'>('pending');

    return (
        <div className="dashboard-container animate-fade-in sm:py-10">
            <main className="mx-auto max-w-[430px] bg-white shadow-2xl sm:rounded-2xl overflow-hidden relative" style={{ minHeight: '850px', display: 'flex', flexDirection: 'column' }}>
                <button className="platform-logout-btn z-50 text-slate-400 hover:text-slate-800" onClick={onLogout} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    <Icons.LogOut style={{ width: 16, height: 16 }} />
                    Logout
                </button>

                {/* Page Header */}
                <div className="p-6 pb-4 border-b border-solid border-slate-100 bg-slate-50 relative">
                    <button
                        onClick={onBack}
                        className="mb-8 mt-2 text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors bg-white rounded-full px-4 py-2 shadow-sm border border-solid border-slate-200"
                    >
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Dashboard
                    </button>
                    <h1 className="font-serif text-[2.1rem] leading-tight text-slate-900 mb-2">Examination<br />Board Interview</h1>
                    <p className="text-[0.9rem] text-slate-500 leading-relaxed max-w-sm mt-3">
                        Meet 1-on-1 with a WingMentor director. Your session will be analyzed by our AI evaluation engine to provide an objective, data-driven scorecard on your professional soft skills.
                    </p>
                </div>

                <div className="flex-1 p-5 bg-slate-50">
                    {/* The Action Card (Top) */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-solid border-slate-100">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2 shadow-md shadow-blue-200">
                            <Icons.Monitor style={{ width: 20, height: 20 }} />
                            Schedule Live Interview
                        </button>
                        <div className="bg-amber-50 text-amber-700 text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border border-solid border-amber-100">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                            Status: Awaiting Scheduling
                        </div>
                    </div>

                    {/* The Diagnostic Scorecard (Bottom) */}
                    <div className="bg-white rounded-xl shadow-sm border border-solid border-slate-100 p-6 relative overflow-hidden">
                        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Icons.Map style={{ width: 20, height: 20, color: '#2563eb' }} />
                            AI Assessment Metrics
                            {status === 'pending' && <Icons.Lock style={{ width: 16, height: 16 }} className="text-slate-300 ml-2" />}
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Scores will unlock after your interview is processed.</p>

                        {status === 'pending' && (
                            <div className="absolute inset-0 bg-white/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center border-t border-solid border-slate-100/50">
                                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-solid border-slate-200 shadow-sm">
                                    <Icons.Book style={{ width: 26, height: 26, color: '#94a3b8' }} />
                                </div>
                                <h3 className="text-slate-900 font-bold text-lg mb-1">Metrics Locked</h3>
                                <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">Metrics will unlock after interview completion</p>
                            </div>
                        )}

                        <div className="space-y-5">
                            <MetricBar label="First Impression" score={0} />
                            <MetricBar label="Self-Presentation" score={0} />
                            <MetricBar label="Professional Speaking" score={0} />
                            <MetricBar label="Professional Attire" score={0} />
                            <MetricBar label="Attitude & Demeanor" score={0} />
                            <MetricBar label="Active Listening" score={0} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const MetricBar = ({ label, score }: { label: string; score: number }) => (
    <div>
        <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <span className="text-xs font-bold text-slate-400">{score}/10</span>
        </div>
        <div className="bg-slate-100 h-2.5 rounded-full w-full overflow-hidden border border-solid border-slate-200/50">
            <div
                className={`h-full rounded-full transition-all duration-1000 ${score >= 8 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                style={{ width: `${score === 0 ? 0 : Math.max(5, score * 10)}%` }}
            ></div>
        </div>
    </div>
);
