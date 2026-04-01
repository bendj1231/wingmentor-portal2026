import React, { useState } from 'react';
import { Icons } from '../icons';

interface MentorshipProtocolsModulePageProps {
    onBack: () => void;
    onLogout: () => void;
}

const MentorshipProtocolsModulePage: React.FC<MentorshipProtocolsModulePageProps> = ({ onBack, onLogout }) => {
    const [examStep, setExamStep] = useState(0);

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
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Icons.Shield style={{ width: 28, height: 28 }} />
                        </div>
                        <div>
                            <div className="text-emerald-600 tracking-widest text-[0.65rem] font-bold uppercase">
                                Module 02: Observation Phase
                            </div>
                            <h1 className="font-serif text-2xl leading-tight text-slate-900">
                                Protocols & Memory
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Observation Log Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Observation Protocols</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                During your 20-hour observation phase, you must log non-handling pilot (PM) duties and cockpit coordination (MCC) events.
                            </p>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-dashed border-emerald-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <Icons.Clock className="text-emerald-600" style={{ width: 18, height: 18 }} />
                                    <span className="text-xs font-bold text-emerald-900">Next Observation Event</span>
                                </div>
                                <div className="text-[0.7rem] text-emerald-700 font-medium"> Cockpit Setup & PF/PM Briefing (Simulator Segment B)</div>
                                <button className="mt-4 w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all">
                                    Request Verification
                                </button>
                            </div>
                        </div>

                        {/* Retention Memory Exam */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
                            <h3 className="text-lg font-bold mb-4">Retention Exam: Procedural Memory</h3>
                            {examStep === 0 ? (
                                <>
                                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                        Test your recall of the "Pilot Gap" safety protocols using our spaced repetition algorithm.
                                    </p>
                                    <button
                                        onClick={() => setExamStep(1)}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                                    >
                                        Start Memory Test
                                    </button>
                                </>
                            ) : (
                                <div className="animate-fade-in">
                                    <div className="text-[0.6rem] text-emerald-400 font-bold mb-2 uppercase">Question 01/10</div>
                                    <p className="text-sm font-medium mb-6">"What is the required standard for cockpit intervention during a non-stabilized approach below 500ft?"</p>
                                    <div className="space-y-2">
                                        {['Mandatory Go-Around Call', 'Observation Only', 'Request Pilot Correction'].map((ans, i) => (
                                            <button key={i} className="w-full text-left p-3 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all">
                                                {ans}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        </div>

                        {/* Hierarchy Ethics (Condensed) */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Authority Levels</h3>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded border border-slate-200 flex items-center justify-center font-bold text-indigo-600 text-xs shadow-sm">PPL</div>
                                    <Icons.ChevronRight className="text-slate-300" style={{ width: 14, height: 14 }} />
                                    <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-xs shadow-md">CPL</div>
                                </div>
                                <span className="text-[0.65rem] font-bold text-slate-500">Cross-Verification Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100 text-center">
                    <p className="text-[0.6rem] text-slate-400 font-bold tracking-[0.2em] uppercase">Professional Standards Bureau</p>
                </div>
            </main>
        </div>
    );
};

export default MentorshipProtocolsModulePage;
