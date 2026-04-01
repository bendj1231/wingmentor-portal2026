import React, { useState } from 'react';
import { Icons } from '../icons';
import { ExaminationTerminal } from '../components/ExaminationTerminal';

interface Resource {
    id: string;
    title: string;
    type: 'ppt' | 'article' | 'pdf' | 'video';
    category: 'PPL' | 'CPL' | 'IR' | 'ME';
    description: string;
}

const RESOURCES: Resource[] = [
    { id: '1', title: 'Aeronautical Decision Making', type: 'ppt', category: 'PPL', description: 'PowerPoint on core decision-making skills for student pilots.' },
    { id: '2', title: 'Advanced Aerodynamics', type: 'article', category: 'CPL', description: 'In-depth article on high-performance aircraft characteristics.' },
    { id: '3', title: 'Instrument Approach Plates 101', type: 'pdf', category: 'IR', description: 'Comprehensive guide to reading and interpreting IFR plates.' },
    { id: '4', title: 'Multi-Engine Handling Qualities', type: 'video', category: 'ME', description: 'Video session on asymmetric thrust and OEI procedures.' },
    { id: '5', title: 'Meteorology for Pilots', type: 'pdf', category: 'CPL', description: 'Advanced weather theory and report interpretation.' },
    { id: '6', title: 'Human Factors in Aviation', type: 'article', category: 'PPL', description: 'Psychological and physiological aspects of flight safety.' },
];

interface W1000ModulePageProps {
    onBack: () => void;
    onLogout: () => void;
}

export const W1000ModulePage: React.FC<W1000ModulePageProps> = ({ onBack, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'sim' | 'exam' | 'blackbox'>('sim');
    const [filter, setFilter] = useState<'All' | 'PPL' | 'CPL' | 'IR' | 'ME'>('All');

    const filteredResources = filter === 'All' ? RESOURCES : RESOURCES.filter(r => r.category === filter);

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
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Icons.Cpu style={{ width: 28, height: 28 }} />
                        </div>
                        <div>
                            <div className="text-blue-600 tracking-widest text-[0.65rem] font-bold uppercase">
                                High-Fidelity Training
                            </div>
                            <h1 className="font-serif text-2xl leading-tight text-slate-900">
                                W1000 Module
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-100 bg-white sticky top-0 z-20">
                    <button
                        onClick={() => setActiveTab('sim')}
                        className={`flex-1 py-4 text-[0.7rem] font-black uppercase tracking-wider transition-all ${activeTab === 'sim' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Simulation
                    </button>
                    <button
                        onClick={() => setActiveTab('exam')}
                        className={`flex-1 py-4 text-[0.7rem] font-black uppercase tracking-wider transition-all ${activeTab === 'exam' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Terminal
                    </button>
                    <button
                        onClick={() => setActiveTab('blackbox')}
                        className={`flex-1 py-4 text-[0.7rem] font-black uppercase tracking-wider transition-all ${activeTab === 'blackbox' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Blackbox
                    </button>
                </div>

                <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                    {activeTab === 'sim' ? (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
                                <Icons.Monitor style={{ width: 48, height: 48, color: '#2563eb' }} className="mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Simulation Engine</h3>
                                <p className="text-sm text-slate-500 mb-6">Initialize the G1000-inspired environment for the IFR/VFR modules.</p>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all">
                                    Initialize Flight Deck
                                </button>
                            </div>

                            <div className="space-y-3">
                                {['IFR Procedures', 'VFR Navigation', 'Engine Monitoring', 'PFD Essentials'].map((topic, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 cursor-pointer shadow-sm transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{topic}</span>
                                        <Icons.ArrowRight className="ml-auto text-slate-300" style={{ width: 16, height: 16 }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : activeTab === 'exam' ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
                            <ExaminationTerminal />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {['All', 'PPL', 'CPL', 'IR', 'ME'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat as any)}
                                        className={`px-4 py-2 rounded-lg text-[0.65rem] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${filter === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {filteredResources.map((res) => (
                                    <div key={res.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${res.type === 'ppt' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    <Icons.FileText style={{ width: 18, height: 18 }} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{res.title}</h4>
                                                    <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-tighter">{res.category} Module</span>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                                <Icons.Download style={{ width: 18, height: 18 }} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{res.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border-t border-slate-100 text-center">
                    <p className="text-[0.6rem] text-slate-400 font-bold tracking-[0.2em] uppercase">WingMentor Blackbox Integrated Systems</p>
                </div>
            </main>
        </div>
    );
};
