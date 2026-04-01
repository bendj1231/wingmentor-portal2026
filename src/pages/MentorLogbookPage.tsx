import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { supabase } from '../lib/supabase-auth';

interface MentorLogEntry {
  id: string;
  date: string;
  mentorName: string;
  sessionType: string;
  hours: number;
  observations: number;
  cases: number;
  notes?: string;
}

interface MentorLogbookPageProps {
  onBack: () => void;
  userProfile?: {
    uid?: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

export const MentorLogbookPage: React.FC<MentorLogbookPageProps> = ({ onBack, userProfile }) => {
  const [logEntries, setLogEntries] = useState<MentorLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    mentorName: '',
    sessionType: '',
    hours: '',
    observations: '',
    cases: '',
    notes: ''
  });

  useEffect(() => {
    fetchMentorLogs();
  }, [userProfile?.uid]);

  const fetchMentorLogs = async () => {
    if (!userProfile?.uid || !db) {
      console.log('No user UID or Firebase not initialized');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: logsData, error: logsError } = await supabase
        .from('mentor_logs')
        .select('*')
        .eq('user_id', userProfile.uid)
        .order('session_date', { ascending: false });

      if (logsError) {
        throw logsError;
      }

      const entries: MentorLogEntry[] = (logsData || []).map((log) => ({
        id: log.id,
        date: log.session_date,
        mentorName: log.mentor_name,
        sessionType: log.session_type || 'General',
        hours: log.duration || 0,
        observations: log.observations || 0,
        cases: log.cases || 0,
        notes: log.notes || ''
      }));

      setLogEntries(entries);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mentor logs:', error);
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!userProfile?.uid || !db) return;
    if (!formData.date || !formData.hours) {
      alert('Please fill in Date and Hours');
      return;
    }

    try {
      await addDoc(collection(db, 'mentorLogs'), {
        userId: userProfile.uid,
        date: formData.date,
        mentorName: formData.mentorName || 'Mentor Session',
        sessionType: formData.sessionType || 'General',
        hours: parseFloat(formData.hours),
        observations: parseInt(formData.observations) || 0,
        cases: parseInt(formData.cases) || 0,
        notes: formData.notes,
        createdAt: new Date().toISOString()
      });
      
      setFormData({
        date: '',
        mentorName: '',
        sessionType: '',
        hours: '',
        observations: '',
        cases: '',
        notes: ''
      });
      setShowAddForm(false);
      fetchMentorLogs();
    } catch (error) {
      console.error('Error adding mentor log:', error);
      alert('Failed to add entry');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!db) return;
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await deleteDoc(doc(db, 'mentorLogs', entryId));
      fetchMentorLogs();
    } catch (error) {
      console.error('Error deleting mentor log:', error);
      alert('Failed to delete entry');
    }
  };

  const totalHours = logEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalObservations = logEntries.reduce((sum, entry) => sum + entry.observations, 0);
  const totalCases = logEntries.reduce((sum, entry) => sum + entry.cases, 0);

  return (
    <div style={{ backgroundColor: '#eef4fb', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem clamp(1.5rem, 4vw, 3rem)'
      }}>
        {/* Header */}
        <header style={{
          padding: '3rem 4rem',
          background: 'linear-gradient(180deg, #fff 0%, #f0f4fb 100%)',
          borderRadius: '20px',
          position: 'relative',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#0ea5e9'
            }}
          >
            ← BACK TO PROFILE
          </button>

          <div style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#64748b',
            fontWeight: 500
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block'
            }} />
            VERIFIED IDENTITY
          </div>

          <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '72px', width: 'auto' }} />
          </div>
          <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            PILOT RECOGNITION PROFILE
          </p>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0', color: '#0f172a', fontWeight: 600 }}>
            Pilot Profile
          </h1>
        </header>

        {/* Main Content Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
          border: '1px solid rgba(226,232,240,0.9)'
        }}>
          {/* Title Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                Foundational Program Mentor Logbook
              </h2>
              <p style={{ margin: 0, color: '#047857', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                MENTORSHIP SESSION RECORDS
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '999px',
                border: 'none',
                background: '#047857',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {showAddForm ? 'CANCEL' : 'ADD SESSION ENTRY'}
            </button>
          </div>

          {/* Summary Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              { label: 'Total Mentor Hours', value: totalHours.toFixed(1), color: '#047857' },
              { label: 'Total Observations', value: totalObservations.toString(), color: '#0ea5e9' },
              { label: 'Total Cases', value: totalCases.toString(), color: '#f59e0b' }
            ].map((stat) => (
              <div key={stat.label} style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Add Entry Form */}
          {showAddForm && (
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
                New Mentor Session Entry
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Mentor Name
                  </label>
                  <input
                    type="text"
                    value={formData.mentorName}
                    onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                    placeholder="e.g., Captain Smith"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Session Type
                  </label>
                  <input
                    type="text"
                    value={formData.sessionType}
                    onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                    placeholder="e.g., Flight Training"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Hours *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="e.g., 2.0"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Observations
                  </label>
                  <input
                    type="number"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Cases
                  </label>
                  <input
                    type="number"
                    value={formData.cases}
                    onChange={(e) => setFormData({ ...formData, cases: e.target.value })}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Session notes..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleAddEntry}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#047857',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Save Entry
              </button>
            </div>
          )}

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATE</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MENTOR</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TYPE</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HOURS</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OBS</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CASES</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NOTES</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      Loading mentor logs...
                    </td>
                  </tr>
                ) : logEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      No mentor sessions logged yet. Click "Add Session Entry" to get started.
                    </td>
                  </tr>
                ) : (
                  logEntries.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>
                        {entry.date}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#047857', fontWeight: 600 }}>
                        {entry.mentorName}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {entry.sessionType}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a', textAlign: 'right', fontWeight: 600 }}>
                        {entry.hours.toFixed(1)}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0ea5e9', textAlign: 'right' }}>
                        {entry.observations}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#f59e0b', textAlign: 'right' }}>
                        {entry.cases}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {entry.notes || '-'}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #fca5a5',
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
