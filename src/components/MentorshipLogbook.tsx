import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { auth } from '../lib/firebase';
import { submitMentorshipLog, getUserLogs, type MentorshipLog } from '../lib/firestore';

export const MentorshipLogbook: React.FC = () => {
    const [mentorId, setMentorId] = useState('');
    const [menteeId] = useState(auth.currentUser?.uid || '');
    const [menteeEmail, setMenteeEmail] = useState(auth.currentUser?.email || '');
    const [hours, setHours] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [logs, setLogs] = useState<MentorshipLog[]>([]);

    const fetchLogs = async () => {
        if (!auth.currentUser) return;
        const userLogs = await getUserLogs(auth.currentUser.uid);
        // Sort by date descending
        setLogs(userLogs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mentorId || !hours || !description || !menteeEmail) {
            alert('Please fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            await submitMentorshipLog({
                mentorId,
                menteeId,
                menteeEmail,
                hoursLogged: hours,
                sessionDescription: description,
                program: 'Foundational'
            });

            // Reset form
            setMentorId('');
            setHours(0);
            setDescription('');

            // Refresh logs
            await fetchLogs();
            alert('Log submitted successfully. Verification pending.');
        } catch (error) {
            console.error("Submission error:", error);
            alert('Failed to submit log.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mentorship-logbook animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Submission Form Card */}
            <div className="logbook-card" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                        <Icons.Book style={{ width: 20, height: 20, color: '#2563eb' }} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Log New Session</h2>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Mentor ID</label>
                        <input
                            type="text"
                            value={mentorId}
                            onChange={(e) => setMentorId(e.target.value)}
                            placeholder="Enter Mentor's UID"
                            className="py-2.5"
                            style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Mentee Email</label>
                        <input
                            type="email"
                            value={menteeEmail}
                            onChange={(e) => setMenteeEmail(e.target.value)}
                            className="bg-slate-50 text-slate-500 cursor-not-allowed py-2.5"
                            style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                            readOnly
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Mentee ID</label>
                        <input
                            type="text"
                            value={menteeId}
                            readOnly
                            disabled
                            className="bg-slate-50 text-slate-500 cursor-not-allowed py-2.5"
                            style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Hours Logged</label>
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            className="py-2.5"
                            style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                            min="0"
                            step="0.5"
                        />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Session Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what was covered during the session..."
                            className="bg-white border border-slate-200 py-2.5"
                            style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: '8px', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: '8px',
                                fontWeight: 700,
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%'
                            }}
                        >
                            {submitting ? 'Submitting...' : 'Submit Log for Verification'}
                        </button>
                    </div>
                </form>
            </div>

            {/* History Table Card */}
            <div className="logbook-card" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                            <Icons.Map style={{ width: 20, height: 20, color: '#64748b' }} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Session History</h2>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Date</th>
                                <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Mentor ID</th>
                                <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Hours</th>
                                <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            <p className="text-slate-400">No logs found. Submit your first session above.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log: MentorshipLog) => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem', color: '#1e293b' }}>
                                            {log.createdAt ? new Date(log.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem', color: '#1e293b', fontFamily: 'monospace' }}>
                                            {log.mentorId.substring(0, 8)}...
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                                            {log.hoursLogged}h
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                backgroundColor: log.status === 'verified' ? '#dcfce7' : '#fef3c7',
                                                color: log.status === 'verified' ? '#166534' : '#92400e'
                                            }}>
                                                {log.status === 'verified' ? 'Verified' : 'Pending Verification'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
