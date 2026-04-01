import React from 'react';
import { Icons } from '../icons';

interface W1000SimulatorPageProps {
    onBack: () => void;
    onLogout: () => void;
}

export const W1000SimulatorPage: React.FC<W1000SimulatorPageProps> = ({ onBack, onLogout }) => {
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
                        PHASE 1: INITIAL APPLICATION
                    </div>
                    <h1 className="font-serif text-[2.1rem] leading-tight text-slate-900 mb-2">
                        W1000 Simulator
                    </h1>
                    <p className="text-[0.9rem] text-slate-500 leading-relaxed max-w-sm mt-3">
                        Your primary training environment. Launch the high-fidelity scenario engine to begin your foundational practice.
                    </p>
                </div>

                <div className="flex-1 p-5 bg-slate-50 flex flex-col gap-4">
                    {/* Connection Status Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-solid border-slate-100 p-6 flex flex-col gap-2">
                        <h2 className="text-sm font-semibold text-slate-900">Connection Status</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <span className="text-sm font-medium text-emerald-700">Engine Ready</span>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-slate-900 rounded-xl shadow-sm p-6 text-white text-center flex flex-col gap-4 items-center">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                            <Icons.Cpu style={{ width: 24, height: 24, color: '#60a5fa' }} />
                        </div>
                        <h2 className="text-xl font-semibold">Launch W1000 Environment</h2>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-900/50 mt-2">
                            <Icons.Monitor style={{ width: 20, height: 20 }} />
                            Initialize Simulator
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
