import React from 'react';
import { Icons } from '../icons';

interface IndustryAssessmentPageProps {
    onBack: () => void;
    onLogout: () => void;
}

export const IndustryAssessmentPage: React.FC<IndustryAssessmentPageProps> = ({ onBack, onLogout }) => {
    return (
        <div className="dashboard-container animate-fade-in sm:py-10">
            <main className="max-w-[430px] mx-auto min-h-[90vh] bg-slate-50 shadow-2xl sm:rounded-xl flex flex-col relative overflow-hidden">
                <button
                    className="platform-logout-btn z-50 text-slate-400 hover:text-slate-800"
                    onClick={onLogout}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}
                >
                    <Icons.LogOut style={{ width: 16, height: 16 }} />
                    Logout
                </button>

                {/* Page Header */}
                <div className="p-6 pb-4 border-b border-solid border-slate-100 bg-white relative">
                    <button
                        onClick={onBack}
                        className="mb-8 mt-2 text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors bg-slate-50 rounded-full px-4 py-2 shadow-sm border border-solid border-slate-200"
                    >
                        <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Core
                    </button>
                    <div className="text-blue-600 tracking-widest text-sm font-semibold uppercase mb-2">
                        PHASE 3: AIRLINE READINESS
                    </div>
                    <h1 className="font-serif text-[2.1rem] leading-tight text-slate-900 mb-2">
                        Final Assessment
                    </h1>
                    <p className="text-[0.9rem] text-slate-500 leading-relaxed max-w-sm mt-3">
                        Prior to reaching your 50-Hour Foundational Certificate, you must complete your live interview. Your AI-graded presentation and scorecard will be compiled and distributed directly to our airline and manufacturing industry partners.
                    </p>
                </div>

                <div className="flex-1 p-5 bg-slate-50 flex flex-col gap-4">
                    {/* Action Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-solid border-slate-100 p-6 flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-slate-900">Board Interview</h2>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200">
                            <Icons.Monitor style={{ width: 20, height: 20 }} />
                            Schedule Final Interview
                        </button>
                        <div className="bg-amber-50 text-amber-700 text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border border-solid border-amber-100 w-full mt-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                            Status: 50-Hour Milestone Pending
                        </div>
                    </div>

                    {/* AI Scorecard */}
                    <div className="bg-white rounded-xl shadow-sm border border-solid border-slate-100 p-6 relative overflow-hidden">
                        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Icons.Map style={{ width: 20, height: 20, color: '#2563eb' }} />
                            Industry Grading Metrics
                            <Icons.Lock style={{ width: 16, height: 16 }} className="text-slate-300 ml-2" />
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Metrics unlock upon assessment completion.</p>

                        <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center border-t border-solid border-slate-100/50" style={{ top: '6rem' }}>
                        </div>

                        <div className="space-y-5">
                            <MetricBar label="First Impression" score={0} />
                            <MetricBar label="Self-Presentation" score={0} />
                            <MetricBar label="Professional Speaking" score={0} />
                            <MetricBar label="Professional Attire" score={0} />
                            <MetricBar label="Attitude" score={0} />
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
