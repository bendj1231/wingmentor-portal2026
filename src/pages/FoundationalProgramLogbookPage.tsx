import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';
import type { UserProfile } from '../types/user';

interface FoundationalProgramLogbookPageProps {
  userProfile?: UserProfile | null;
  onBack: () => void;
}

interface MentorshipSession {
  id: string;
  date: string;
  mentorId: string;
  mentorEmail: string;
  menteeId: string;
  menteeEmail: string;
  description: string;
  hours: number;
  prescription: string;
  mentorLogged: boolean;
  menteeLogged: boolean;
  wingmentorVerified: boolean;
  status: 'pending' | 'verified';
}

const FoundationalProgramLogbookPage: React.FC<FoundationalProgramLogbookPageProps> = ({ 
  userProfile, 
  onBack 
}) => {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalMentorHours, setTotalMentorHours] = useState(0);
  const [verifiedHours, setVerifiedHours] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mentorEmail: '',
    menteeEmail: '',
    description: '',
    hours: '',
    prescription: ''
  });

  // 50hrs certification target
  const CERTIFICATION_TARGET = 50;

  useEffect(() => {
    fetchMentorshipSessions();
  }, [userProfile?.uid]);

  const fetchMentorshipSessions = async () => {
    if (!userProfile?.uid) {
      setLoading(false);
      return;
    }

    try {
      // Fetch from Supabase study_sessions table
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userProfile.uid)
        .eq('session_type', 'mentorship')
        .order('session_date', { ascending: false });

      if (error) {
        console.warn('Error fetching mentorship sessions:', error);
        // Use sample data if no data found
        const sampleSessions: MentorshipSession[] = [
          {
            id: '1',
            date: '2026-03-20',
            mentorId: 'mentor_001',
            mentorEmail: 'captain.sarah@wingmentor.com',
            menteeId: userProfile.uid || 'mentee_001',
            menteeEmail: userProfile.email || 'pilot@example.com',
            description: 'Initial mentorship session - Career pathway assessment and goal setting',
            hours: 2.5,
            prescription: 'Complete Module 1 and research cargo vs passenger pathway requirements',
            mentorLogged: true,
            menteeLogged: true,
            wingmentorVerified: true,
            status: 'verified',
          },
          {
            id: '2',
            date: '2026-03-18',
            mentorId: 'mentor_001',
            mentorEmail: 'captain.sarah@wingmentor.com',
            menteeId: userProfile.uid || 'mentee_001',
            menteeEmail: userProfile.email || 'pilot@example.com',
            description: 'Risk management techniques review and CRM principles discussion',
            hours: 1.5,
            prescription: 'Practice risk assessment scenarios and log 3 case studies',
            mentorLogged: true,
            menteeLogged: true,
            wingmentorVerified: false,
            status: 'verified',
          },
          {
            id: '3',
            date: '2026-03-15',
            mentorId: 'mentor_002',
            mentorEmail: 'mentor.james@wingmentor.com',
            menteeId: userProfile.uid || 'mentee_001',
            menteeEmail: userProfile.email || 'pilot@example.com',
            description: 'Aviation industry familiarization and mentorship framework overview',
            hours: 2.0,
            prescription: 'Read industry report on pilot shortage and prepare questions',
            mentorLogged: true,
            menteeLogged: false,
            wingmentorVerified: false,
            status: 'pending',
          },
        ];
        setSessions(sampleSessions);
        calculateHours(sampleSessions);
      } else if (data) {
        // Transform data to match MentorshipSession interface
        const transformedSessions: MentorshipSession[] = data.map((session: any) => ({
          id: session.id,
          date: session.session_date,
          mentorId: session.mentor_id || 'unknown',
          mentorEmail: session.mentor_email || 'mentor@wingmentor.com',
          menteeId: session.user_id,
          menteeEmail: userProfile.email || 'mentee@example.com',
          description: session.description || 'Mentorship session',
          hours: (session.duration || 0) / 60, // Convert minutes to hours
          prescription: session.prescription || 'Continue with assigned modules',
          mentorLogged: session.mentor_logged || false,
          menteeLogged: true, // Since we're fetching user's sessions
          wingmentorVerified: session.wingmentor_verified || false,
          status: (session.mentor_logged && session.mentee_logged) || session.wingmentor_verified ? 'verified' : 'pending',
        }));
        setSessions(transformedSessions);
        calculateHours(transformedSessions);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = (sessionList: MentorshipSession[]) => {
    const total = sessionList.reduce((acc, session) => acc + session.hours, 0);
    const verified = sessionList
      .filter(s => s.status === 'verified')
      .reduce((acc, session) => acc + session.hours, 0);
    setTotalMentorHours(total);
    setVerifiedHours(verified);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.mentorEmail || !formData.description || !formData.hours) {
      alert('Please fill in all required fields');
      return;
    }

    // Parse time string (e.g. "2 hours 30 minutes") to hours
    const timeString = formData.hours.toLowerCase();
    let totalHours = 0;
    const hourMatch = timeString.match(/(\d+(?:\.\d+)?)\s*hour/);
    const minuteMatch = timeString.match(/(\d+)\s*minute/);
    if (hourMatch) totalHours += parseFloat(hourMatch[1]);
    if (minuteMatch) totalHours += parseInt(minuteMatch[1]) / 60;
    if (totalHours === 0) {
      // Try simple number parsing as fallback
      totalHours = parseFloat(formData.hours) || 0;
    }

    const newSession: MentorshipSession = {
      id: Date.now().toString(),
      date: formData.date,
      mentorId: 'mentor_' + Date.now(),
      mentorEmail: formData.mentorEmail,
      menteeId: userProfile?.uid || 'mentee_001',
      menteeEmail: formData.menteeEmail || userProfile?.email || 'pilot@example.com',
      description: formData.description,
      hours: totalHours,
      prescription: formData.prescription || 'Continue with assigned modules',
      mentorLogged: false,
      menteeLogged: true,
      wingmentorVerified: false,
      status: 'pending'
    };

    // Try to save to Supabase FIRST (before resetting form)
    try {
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: userProfile?.uid,
          session_type: 'mentorship',
          session_date: formData.date,
          duration: Math.round(totalHours * 60),
          description: formData.description,
          prescription: formData.prescription || 'Continue with assigned modules',
          mentor_email: formData.mentorEmail,
          mentee_email: formData.menteeEmail || userProfile?.email,
          mentor_logged: false,
          mentee_logged: true,
          wingmentor_verified: false
        });
      
      if (error) {
        console.warn('Failed to save to Supabase:', error);
        alert('Failed to save session to database. Please try again.');
        return;
      }
    } catch (err) {
      console.error('Error saving session:', err);
      alert('Error saving session. Please try again.');
      return;
    }

    // Update local state only after successful Supabase save
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    calculateHours(updatedSessions);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mentorEmail: '',
      menteeEmail: '',
      description: '',
      hours: '',
      prescription: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    calculateHours(updatedSessions);
    setDeleteConfirmId(null);
  };

  const getVerificationStatus = (session: MentorshipSession) => {
    if (session.wingmentorVerified) {
      return { label: 'Verified by WingMentor', icon: '✓✓', color: '#22c55e', bgColor: '#dcfce7' };
    }
    if (session.mentorLogged && session.menteeLogged) {
      return { label: 'Double Verified', icon: '✓✓', color: '#22c55e', bgColor: '#dcfce7' };
    }
    if (session.mentorLogged || session.menteeLogged) {
      return { label: 'Pending Verification', icon: '⏳', color: '#f59e0b', bgColor: '#fef3c7' };
    }
    return { label: 'Pending', icon: '○', color: '#94a3b8', bgColor: '#f1f5f9' };
  };

  const progressPercentage = Math.min((verifiedHours / CERTIFICATION_TARGET) * 100, 100);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', paddingTop: '120px' }}>
      <div style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#1e40af',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Icons.ArrowLeft style={{ width: 18, height: 18 }} />
          Back to Program Platform
        </button>

        {/* Single White Card Container */}
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <img 
              src="/logo.png" 
              alt="WingMentor Logo" 
              style={{ maxWidth: '280px', height: 'auto', objectFit: 'contain', marginBottom: '1rem' }} 
            />
            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              FOUNDATION PROGRAM - MENTORSHIP LOG
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
              Foundational Program Logbook
            </h1>
            <p style={{ color: '#1d4ed8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Log and track your mentorship sessions, hours, and certification progress toward your 50-hour mentorship certification
            </p>
          </div>

        {/* 50hrs Certification Progress */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          border: '1px solid #e2e8f0',
          marginBottom: '2rem' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                Mentorship Certification Progress
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                Track your progress toward the 50-hour mentorship certification requirement
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>
                {verifiedHours.toFixed(1)} / {CERTIFICATION_TARGET} hrs
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {progressPercentage.toFixed(0)}% Complete
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${progressPercentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #2563eb, #1d4ed8)', 
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ color: '#64748b' }}>Verified: {verifiedHours.toFixed(1)} hrs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ color: '#64748b' }}>Pending: {(totalMentorHours - verifiedHours).toFixed(1)} hrs</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
              {totalMentorHours.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Hours Logged</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
              {sessions.filter(s => s.status === 'verified').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Verified Sessions</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
              {sessions.length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Sessions</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
              {sessions.filter(s => s.status === 'pending').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pending Verification</div>
          </div>
        </div>

        {/* Mentorship Sessions Table */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ 
            padding: '1rem 1.5rem', 
            borderBottom: '1px solid #e2e8f0', 
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              Mentorship Sessions Log
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Icons.Plus style={{ width: 16, height: 16 }} />
              Log Session
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mentor</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mentee</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prescription</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      Loading sessions...
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      <Icons.ClipboardList style={{ width: 48, height: 48, marginBottom: '1rem', opacity: 0.5 }} />
                      <p>No mentorship sessions logged yet.</p>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Click "Log Session" to add your first entry.</p>
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => {
                    const status = getVerificationStatus(session);
                    return (
                      <tr key={session.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#0f172a' }}>
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#0f172a' }}>
                          <div style={{ fontWeight: 500 }}>{session.mentorEmail}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {session.mentorId.slice(0, 8)}...</div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#0f172a' }}>
                          <div style={{ fontWeight: 500 }}>{session.menteeEmail}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {session.menteeId.slice(0, 8)}...</div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#0f172a', maxWidth: '200px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {session.description}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#0f172a', textAlign: 'center', fontWeight: 600 }}>
                          {session.hours.toFixed(1)}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', maxWidth: '150px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {session.prescription}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {deleteConfirmId === session.id ? (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleDeleteSession(session.id)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: '#dc2626',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: '#e2e8f0',
                                  color: '#64748b',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.25rem',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                background: status.bgColor,
                                color: status.color,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}>
                                <span>{status.icon}</span>
                                <span style={{ textTransform: 'capitalize' }}>{session.status}</span>
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                {status.label}
                              </div>
                              <button
                                onClick={() => setDeleteConfirmId(session.id)}
                                style={{
                                  padding: '0.2rem 0.5rem',
                                  background: 'transparent',
                                  color: '#94a3b8',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  cursor: 'pointer',
                                  marginTop: '0.25rem'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#dc2626';
                                  e.currentTarget.style.borderColor = '#dc2626';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = '#94a3b8';
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Session Form Modal */}
        {showAddForm && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '2.5rem',
              maxWidth: '650px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)'
            }}>
              {/* Header with Logo and Subtitle */}
              <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    position: 'absolute',
                    top: '-0.5rem',
                    right: '-0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '0.25rem',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
                <img 
                  src="/logo.png" 
                  alt="WingMentor Logo" 
                  style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain', marginBottom: '1rem' }} 
                />
                <div style={{ color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  FOUNDATION PROGRAM
                </div>
                <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  Log New Session
                </h3>
              </div>

              <form onSubmit={handleAddSession}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Mentee Name *
                    </label>
                    <input
                      type="text"
                      value={formData.mentorEmail}
                      onChange={(e) => setFormData({ ...formData, mentorEmail: e.target.value })}
                      placeholder="Enter mentee name"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Mentee Email *
                    </label>
                    <input
                      type="email"
                      value={formData.menteeEmail || ''}
                      onChange={(e) => setFormData({ ...formData, menteeEmail: e.target.value })}
                      placeholder="mentee@example.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Description of Works *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the mentorship session..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Time of Session *
                    </label>
                    <input
                      type="text"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      placeholder="e.g. 2 hours 30 minutes"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                      Problem Solving Prescription
                    </label>
                    <input
                      type="text"
                      value={formData.prescription}
                      onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                      placeholder="Assigned tasks or recommendations..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#f1f5f9',
                      color: '#64748b',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Add Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Verification Legend */}
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem 1.5rem', 
          background: '#f8fafc', 
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.75rem 0' }}>
            Verification Status Guide
          </h4>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '9999px', 
                background: '#dcfce7', 
                color: '#22c55e',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>✓✓ Verified</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Both mentor & mentee logged or WingMentor verified</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '9999px', 
                background: '#eff6ff', 
                color: '#2563eb',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>✓ Pending</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Waiting for both parties to confirm</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FoundationalProgramLogbookPage;
