import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface FlightLog {
  id: string;
  date: string;
  route: string;
  aircraft: string;
  hours: number;
  remarks?: string;
}

interface LogbookPageProps {
  onBack: () => void;
  userProfile?: {
    uid?: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

const LogbookPage: React.FC<LogbookPageProps> = ({ onBack, userProfile }) => {
  const [flightLogs, setFlightLogs] = useState<FlightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const loadFlightLogs = async () => {
      if (!userProfile?.uid || !db) {
        setLoading(false);
        return;
      }

      try {
        const flightLogsQuery = query(
          collection(db, 'flightLogs'),
          where('userId', '==', userProfile.uid)
        );
        const snapshot = await getDocs(flightLogsQuery);
        const logs: FlightLog[] = [];
        let hours = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          logs.push({
            id: doc.id,
            date: data.date,
            route: data.route,
            aircraft: data.aircraft,
            hours: data.hours || 0,
            remarks: data.remarks
          });
          hours += data.hours || 0;
        });

        setFlightLogs(logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setTotalHours(hours);
      } catch (error) {
        console.error('Failed to load flight logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFlightLogs();
  }, [userProfile?.uid]);

  return (
    <div className="dashboard-container animate-fade-in">
      <main className="dashboard-card" style={{ position: 'relative' }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#475569',
            fontWeight: 500
          }}
        >
          ← Back to Profile
        </button>

        <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
          <div className="dashboard-logo" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
          </div>
          <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em' }}>
            FLIGHT RECORDS
          </div>
          <h1 className="dashboard-title">Digital Logbook</h1>
          <p style={{ maxWidth: '40rem', margin: '0 auto', color: '#475569' }}>
            Complete flight history with verified hours, routes, and aircraft details. All entries are synced with WingMentor's central registry.
          </p>
        </div>

        {/* Summary Stats */}
        <section className="dashboard-section" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226,232,240,0.8)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            {[{
              label: 'Total Flights',
              value: flightLogs.length.toString()
            }, {
              label: 'Total Hours',
              value: totalHours.toFixed(1)
            }, {
              label: 'Last Entry',
              value: flightLogs[0]?.date ? new Date(flightLogs[0].date).toLocaleDateString() : '—'
            }].map(card => (
              <div key={card.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  {card.label}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Flight Entries */}
        <section className="dashboard-section">
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 15px 40px rgba(15,23,42,0.08)',
            border: '1px solid rgba(226,232,240,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Logbook Entries</p>
                <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.25rem', color: '#0f172a' }}>Flight History</h2>
              </div>
              <button
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#0ea5e9',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
                onClick={() => alert('Add flight entry feature coming soon')}
              >
                + Add Entry
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0' }}>
                Loading flight records...
              </div>
            ) : flightLogs.length === 0 ? (
              <div style={{
                padding: '2rem',
                borderRadius: '18px',
                border: '2px dashed rgba(148, 163, 184, 0.4)',
                textAlign: 'center',
                color: '#94a3b8'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✈️</div>
                <p style={{ margin: 0, fontSize: '1rem' }}>No flight entries yet</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>Your logged flights will appear here</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {flightLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      borderRadius: '16px',
                      border: '1px solid rgba(226,232,240,0.8)',
                      padding: '1rem 1.25rem',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto',
                      gap: '1rem',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginTop: '0.15rem' }}>
                        {log.route}
                      </div>
                      {log.remarks && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{log.remarks}</div>
                      )}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Aircraft</div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>{log.aircraft || '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Hours</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0ea5e9' }}>{log.hours.toFixed(1)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LogbookPage;
