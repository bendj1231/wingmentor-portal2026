import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../icons';
import { auth } from '../lib/firebase';
import { searchUsers, getOrCreateChat, sendMessage, subscribeToMessages, getUserProfile, type WingMentorUser, type ChatMessage } from '../lib/firestore';
import { JobMatchingCard } from '../components/JobMatchingCard';

interface WingMentorNetworkPageProps {
    onBack: () => void;
    onLogout: () => void;
    onViewChange?: (view: 'aviation-expectations') => void;
}

export const WingMentorNetworkPage: React.FC<WingMentorNetworkPageProps> = ({ onBack, onLogout, onViewChange }) => {
    // Current User Data (simplifying for now, ideally fetched deeply if needed)
    const currentUser = auth.currentUser;
    const [currentUserProfile, setCurrentUserProfile] = useState<WingMentorUser | null>(null);

    // Directory State
    const [searchQuery, setSearchQuery] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [schoolFilter, setSchoolFilter] = useState('');
    const [directoryUsers, setDirectoryUsers] = useState<WingMentorUser[]>([]);

    // Chat State
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [activeChatUser, setActiveChatUser] = useState<WingMentorUser | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Helper sub-component for the horizontal cards (matching program page design)
    const HorizontalCard = ({
        title,
        description,
        image,
        onClick,
        isLocked = false,
        tag
    }: {
        title: string;
        description: string;
        image: string;
        onClick?: () => void;
        isLocked?: boolean;
        tag?: string;
    }) => (
        <div
            className="horizontal-card"
            style={{
                cursor: isLocked ? 'default' : 'pointer',
                padding: 0,
                position: 'relative',
                minHeight: '180px',
                opacity: isLocked ? 0.75 : 1
            }}
            onClick={isLocked ? undefined : onClick}
        >
            <div className="horizontal-card-content-wrapper" style={{ padding: '2rem', height: '100%', width: '100%', position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '45%', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: isLocked ? 'rgba(241, 245, 249, 0.5)' : 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: isLocked ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(255, 255, 255, 0.6)',
                        flexShrink: 0,
                        boxShadow: isLocked ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}>
                        {isLocked ? (
                            <Icons.Lock style={{ width: 20, height: 20, color: '#94a3b8' }} />
                        ) : (
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#2563eb',
                                boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)'
                            }} />
                        )}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        {tag && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{tag}</div>}
                        <h3 className="horizontal-card-title" style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 600 }}>{title}</h3>
                        <p className="horizontal-card-desc" style={{ marginBottom: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '100%' }}>{description}</p>
                    </div>
                </div>
                {!isLocked && (
                    <div className="hub-card-arrow" style={{
                        position: 'absolute',
                        right: '2rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 20,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                    </div>
                )}
            </div>
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '55%',
                zIndex: 1,
                overflow: 'hidden',
                borderRadius: '0 12px 12px 0'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, white 0%, rgba(255, 255, 255, 0.8) 40%, transparent 100%)',
                    zIndex: 2
                }} />
                <img
                    src={image}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        </div>
    );

    // Initial Fetch & Search Trigger
    useEffect(() => {
        const fetchUsers = async () => {
            const users = await searchUsers(regionFilter, schoolFilter, searchQuery);
            // Filter out self
            const filtered = users.filter(u => u.id !== currentUser?.uid);
            setDirectoryUsers(filtered);

            // Fetch actual current user profile
            if (currentUser && !currentUserProfile) {
                const profile = await getUserProfile(currentUser.uid);
                if (profile) {
                    // Update with potentially more accurate data from Auth metadata if Firestore is sparse
                    if (profile.firstName === 'Unknown') {
                        if (currentUser.displayName) {
                            profile.firstName = currentUser.displayName.split(' ')[0];
                        } else if (currentUser.email) {
                            profile.firstName = currentUser.email.split('@')[0];
                        }
                    }
                    setCurrentUserProfile(profile);
                } else if (currentUser.displayName) {
                    // Fallback to Auth data if no Firestore doc exists yet
                    setCurrentUserProfile({
                        id: currentUser.uid,
                        firstName: currentUser.displayName.split(' ')[0],
                        role: "Mentee",
                        totalHours: 0
                    });
                } else {
                    // Final fallback
                    setCurrentUserProfile({
                        id: currentUser.uid,
                        firstName: currentUser.email?.split('@')[0] || "Pilot",
                        role: "Mentee",
                        totalHours: 0
                    });
                }
            }
        };

        fetchUsers();
    }, [regionFilter, schoolFilter, searchQuery, currentUser]);

    // Setup Chat Subscription
    useEffect(() => {
        let unsubscribe: () => void;

        if (activeChatId) {
            unsubscribe = subscribeToMessages(activeChatId, (newMessages) => {
                setMessages(newMessages);
                scrollToBottom();
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [activeChatId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleStartChat = async (user: WingMentorUser) => {
        if (!currentUser) return;

        try {
            const chatId = await getOrCreateChat(currentUser.uid, user.id);
            setActiveChatId(chatId);
            setActiveChatUser(user);
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChatId || !currentUser) return;

        try {
            await sendMessage(activeChatId, currentUser.uid, newMessage);
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="dashboard-container animate-fade-in sm:py-10" style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 10, padding: '0', alignItems: 'flex-start', minHeight: 'auto' }}>
            <main className="dashboard-card" style={{ position: 'relative', height: '100%', maxHeight: 'none', minHeight: 'auto', borderRadius: 0 }}>
                <button
                    className="platform-logout-btn z-50 text-slate-400 hover:text-slate-800"
                    onClick={onLogout}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}
                >
                    <Icons.LogOut style={{ width: 16, height: 16 }} />
                    Logout
                </button>

                {/* --- BOTH VIEWS RENDERED FOR ANIMATION --- */}
                {/* --- DIRECTORY VIEW (View 1) --- */}
                <div
                    className={`transition-transform duration-300 ease-in-out absolute inset-0 bg-slate-50 flex flex-col z-10 ${activeChatId ? '-translate-x-full' : 'translate-x-0'}`}
                >
                    {/* Page Header */}
                    <div className="p-6 pb-4 border-b border-solid border-slate-100 bg-white relative">
                        <button
                            onClick={onBack}
                            className="mb-6 mt-2 text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors bg-slate-50 rounded-full px-4 py-2 shadow-sm border border-solid border-slate-200"
                        >
                            <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Core
                        </button>
                        <div className="text-blue-600 tracking-widest text-[10px] font-bold uppercase mb-2">
                            PHASE 2: COLLABORATION
                        </div>
                        <h1 className="font-serif text-[2.1rem] leading-tight text-slate-900 mb-2">
                            WingMentor Network
                        </h1>
                        <p className="text-[0.9rem] text-slate-500 leading-relaxed max-w-sm mt-3">
                            Coordinate simulator sessions, request debriefs, and message your peers. Reach 20 logged hours to unlock Official Mentor status.
                        </p>
                        <img
                            src="/Networking.jpg"
                            alt="WingMentor Network"
                            style={{
                                width: '100%',
                                maxWidth: '280px',
                                height: 'auto',
                                borderRadius: '12px',
                                marginTop: '1.5rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>

                    <div className="bg-white px-6 py-4 border-b border-solid border-slate-100 shadow-sm relative z-10 w-full">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-solid border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 mb-3"
                        />
                        <div className="flex gap-2 w-full">
                            <select
                                value={regionFilter}
                                onChange={(e) => setRegionFilter(e.target.value)}
                                className="flex-1 border border-solid border-slate-200 rounded-lg px-3 py-2 text-xs bg-slate-50 text-slate-700 focus:outline-none"
                            >
                                <option value="">All Regions</option>
                                <option value="North America">North America</option>
                                <option value="Europe">Europe</option>
                                <option value="Asia">Asia</option>
                                <option value="Middle East">Middle East</option>
                            </select>
                            <select
                                value={schoolFilter}
                                onChange={(e) => setSchoolFilter(e.target.value)}
                                className="flex-1 border border-solid border-slate-200 rounded-lg px-3 py-2 text-xs bg-slate-50 text-slate-700 focus:outline-none"
                            >
                                <option value="">All Flight Schools</option>
                                <option value="CAE">CAE</option>
                                <option value="L3Harris">L3Harris</option>
                                <option value="FlightSafety">FlightSafety</option>
                                <option value="FTEJerez">FTEJerez</option>
                                <option value="Independent">Independent / Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Aviation Industry Directory Card */}
                    <div className="px-6 w-full mt-4">
                        <div className="cards-list" style={{ gap: '1.5rem' }}>
                            <HorizontalCard
                                title="Aviation Industry Expectations"
                                description="Explore airline hiring requirements, career paths & expectations. Navigate the complex landscape of aviation industry standards and requirements."
                                image="https://images.unsplash.com/photo-1436491865332-7a61fb94beff?q=80&w=800&auto=format&fit=crop&v=2"
                                onClick={() => onViewChange?.('aviation-expectations')}
                                tag="Industry Directory"
                            />
                        </div>
                    </div>

                    {/* Job Matching Card - Connected to Pilot Profile */}
                    <div className="px-6 w-full mt-4">
                        <JobMatchingCard userId={currentUser?.uid} />
                    </div>

                    {/* Current User Status Banner */}
                    <div className="px-6 w-full">
                        <div className="bg-slate-900 text-white p-4 rounded-xl mt-5 w-full flex items-center justify-between shadow-md shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-700 w-12 h-12 rounded-full overflow-hidden border-2 border-slate-600 flex-shrink-0 flex items-center justify-center text-slate-300 font-bold">
                                    {currentUserProfile?.firstName.charAt(0) || 'U'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-[15px]">{currentUserProfile?.firstName || 'Your Profile'}</span>
                                    <span className="text-slate-400 text-[11px] font-medium tracking-wide">
                                        {currentUserProfile?.role === 'Mentor' ? 'Verified Mentor' : `${currentUserProfile?.totalHours || 0} / 20 Hrs to Mentor Rank`}
                                    </span>
                                </div>
                            </div>
                            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold">
                                {currentUserProfile?.role || 'Mentee'} Status
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pb-6 px-6 w-full">
                        {/* Section A: Official Mentors */}
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 border-b border-solid border-slate-200 pb-2 w-full">
                            Official Mentors (20+ Hours)
                        </h2>
                        {directoryUsers.filter(u => u.role === 'Mentor').length === 0 ? (
                            <p className="text-sm text-slate-400 italic mb-4">No mentors found matching criteria.</p>
                        ) : (
                            directoryUsers.filter(u => u.role === 'Mentor').map(user => (
                                <div key={user.id} className="bg-white rounded-lg p-3 mb-2 shadow-sm flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">
                                            {user.firstName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col items-start bg-transparent border-0 p-0 m-0">
                                            <span className="text-slate-900 font-semibold text-[14px]">{user.firstName}</span>
                                            <span className="text-slate-500 bg-slate-100 text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 w-fit">
                                                Mentor
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStartChat(user)}
                                        className="text-blue-600 bg-blue-50 px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm"
                                    >
                                        Chat
                                    </button>
                                </div>
                            ))
                        )}

                        {/* Section B: Peer Mentees */}
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 border-b border-solid border-slate-200 pb-2 w-full">
                            Peer Mentees (&lt;20 Hours)
                        </h2>
                        {directoryUsers.filter(u => u.role === 'Mentee').length === 0 ? (
                            <p className="text-sm text-slate-400 italic mb-4">No mentees found matching criteria.</p>
                        ) : (
                            directoryUsers.filter(u => u.role === 'Mentee').map(user => (
                                <div key={user.id} className="bg-white rounded-lg p-3 mb-2 shadow-sm flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">
                                            {user.firstName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col items-start bg-transparent border-0 p-0 m-0">
                                            <span className="text-slate-900 font-semibold text-[14px]">{user.firstName}</span>
                                            <span className="text-slate-500 bg-slate-100 text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 w-fit">
                                                Mentee
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStartChat(user)}
                                        className="text-blue-600 bg-blue-50 px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm"
                                    >
                                        Chat
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- CHAT VIEW (View 2) --- */}
                <div
                    className={`transition-transform duration-300 ease-in-out absolute inset-0 bg-slate-50 flex flex-col z-20 shadow-[-10px_0_15px_rgba(0,0,0,0.05)] ${activeChatId ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    {activeChatUser ? (
                        <div className="max-w-[430px] w-full mx-auto h-[90vh] sm:h-full max-h-[850px] bg-slate-50 shadow-2xl sm:rounded-xl flex flex-col relative overflow-hidden">
                            {/* The Sticky Header (Top) */}
                            <div className="bg-white/80 backdrop-blur-md border-b border-solid border-slate-200 px-4 py-3 flex items-center justify-between z-10">
                                <button
                                    onClick={() => { setActiveChatId(null); setActiveChatUser(null); }}
                                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium bg-transparent border-0 cursor-pointer p-0"
                                >
                                    <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back
                                </button>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="font-bold text-slate-900">{activeChatUser.firstName}</span>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded mt-0.5 ${activeChatUser.role === 'Mentor' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {activeChatUser.role === 'Mentor' ? 'Official Mentor' : 'Mentee'}
                                    </span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    <span className="text-slate-500 font-bold text-xs">{activeChatUser.firstName.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>

                            {/* The Scrollable Message Area (Middle) */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Date Separator */}
                                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest text-center my-4">
                                    Today 10:42 AM
                                </div>

                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 pb-10">
                                        <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center mb-3">
                                            <Icons.ArrowRight style={{ width: 24, height: 24, transform: 'rotate(-45deg)', opacity: 0.5 }} />
                                        </div>
                                        <p className="text-sm font-medium">Say hello to {activeChatUser.firstName}!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isSelf = msg.senderId === currentUser?.uid;
                                        return (
                                            <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`px-4 py-2 text-sm shadow-sm ${isSelf ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm max-w-[80%]' : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm max-w-[80%]'}`}>
                                                    <p className="leading-relaxed break-words">{msg.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* The Sticky Input Area (Bottom) */}
                            <div className="bg-white border-t border-solid border-slate-200 p-3 flex items-center gap-2">
                                {/* Attachment Button */}
                                <button className="text-slate-400 p-2 hover:bg-slate-50 rounded-full cursor-pointer flex-shrink-0 border-0 bg-transparent flex items-center justify-center transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                    </svg>
                                </button>

                                <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                                    {/* Text Input */}
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Message..."
                                        className="flex-1 bg-slate-100 border border-transparent focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600 rounded-full px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                                    />
                                    {/* Send Button */}
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-700 hover:shadow-md transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed border-0"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-0.5">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 bg-white">
                            Select a peer or mentor to start messaging
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
