import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-auth';
import type { UserProfile } from '../types/user';

interface FlightLogEntry {
  id: string;
  date: string;
  aircraftType: string;
  aircraft?: string;
  registration?: string;
  route: string;
  category?: string;
  hours: number;
  remarks?: string;
  sessionDescription?: string;
}

interface DigitalLogbookPageProps {
  onBack: () => void;
  userProfile?: UserProfile | null;
}

export const DigitalLogbookPage: React.FC<DigitalLogbookPageProps> = ({ onBack, userProfile }) => {
  const [flightLogs, setFlightLogs] = useState<FlightLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    aircraftType: '',
    registration: '',
    route: '',
    category: '',
    hours: '',
    remarks: ''
  });

  useEffect(() => {
    fetchFlightLogs();
  }, [userProfile?.id]);

  const fetchFlightLogs = async () => {
    if (!userProfile?.id) {
      console.log('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pilot_flight_logs')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      const entries: FlightLogEntry[] = (data || []).map((log) => ({
        id: log.id,
        date: log.date,
        aircraftType: log.aircraft_type || log.aircraft || '',
        registration: log.registration || '',
        route: log.route || '',
        category: log.category || '',
        hours: Number(log.hours) || 0,
        remarks: log.remarks || ''
      }));

      setFlightLogs(entries);
    } catch (error) {
      console.error('Error fetching flight logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    console.log('=== Save Entry Debug Info ===');
    console.log('userProfile:', userProfile);
    console.log('userProfile type:', typeof userProfile);
    console.log('userProfile keys:', userProfile ? Object.keys(userProfile) : 'null');
    console.log('userProfile.id:', userProfile?.id);
    console.log('formData:', formData);
    console.log('============================');
    
    if (!userProfile?.id) {
      console.error('No user ID found - userProfile is:', userProfile);
      alert(`User not authenticated. Debug info: ${JSON.stringify({
        hasUserProfile: !!userProfile,
        userProfileType: typeof userProfile,
        userProfileKeys: userProfile ? Object.keys(userProfile) : null,
        hasId: !!userProfile?.id
      })}`);
      return;
    }
    
    if (!userProfile?.id) {
      console.error('No user ID found - userProfile is:', userProfile);
      alert('User not authenticated.');
      return;
    }

    try {
      const { error } = await supabase.from('pilot_flight_logs').insert({
        user_id: userProfile.id,
        date: formData.date,
        aircraft_type: formData.aircraftType,
        registration: formData.registration,
        route: formData.route,
        category: formData.category || 'flight',
        hours: parseFloat(formData.hours),
        remarks: formData.remarks,
        created_at: new Date().toISOString()
      });

      if (error) {
        throw error;
      }

      alert('Flight entry saved successfully!');
      setFormData({
        date: '',
        aircraftType: '',
        registration: '',
        route: '',
        category: '',
        hours: '',
        remarks: ''
      });
      setShowAddForm(false);
      fetchFlightLogs();
    } catch (error) {
      console.error('Error adding flight log:', error);
      alert(`Failed to add flight entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!userProfile?.id) return;
    if (!confirm('Are you sure you want to delete this flight entry?')) return;

    try {
      const { error } = await supabase
        .from('pilot_flight_logs')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userProfile.id);

      if (error) {
        throw error;
      }

      fetchFlightLogs();
    } catch (error) {
      console.error('Error deleting flight log:', error);
      alert('Failed to delete flight entry');
    }
  };

  const totalHours = flightLogs.reduce((sum, log) => sum + log.hours, 0);

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
                Digital Logbook
              </h2>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                VERIFIED FLIGHT RECORD REGISTRY
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '999px',
                border: 'none',
                background: '#0ea5e9',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {showAddForm ? 'CANCEL' : 'ADD FLIGHT ENTRY'}
            </button>
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
                New Flight Entry
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
                    Aircraft Type *
                  </label>
                  <input
                    type="text"
                    value={formData.aircraftType}
                    onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                    placeholder="e.g., C172"
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
                    Registration
                  </label>
                  <input
                    type="text"
                    value={formData.registration}
                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                    placeholder="e.g., rpc1885"
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
                    Route
                  </label>
                  <input
                    type="text"
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    placeholder="e.g., klax"
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
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., DUAL"
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
                    placeholder="e.g., 20.0"
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
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="e.g., flight"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
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
                  background: '#10b981',
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
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TYPE</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IDENT</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROUTE</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CATEGORY</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DESCRIPTION</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TIME</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      Loading flight logs...
                    </td>
                  </tr>
                ) : flightLogs.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      No flight entries yet. Click "Add Flight Entry" to get started.
                    </td>
                  </tr>
                ) : (
                  flightLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>
                        {log.date}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0ea5e9', fontWeight: 600 }}>
                        {log.aircraftType}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {log.registration || '-'}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a' }}>
                        {log.route || '-'}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>
                        {log.category || '-'}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {log.remarks || '-'}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a', textAlign: 'right' }}>
                        {log.hours.toFixed(1)}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0ea5e9', fontWeight: 700, textAlign: 'right' }}>
                        {log.hours.toFixed(1)}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteEntry(log.id)}
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

          {/* Total Hours Summary */}
          {flightLogs.length > 0 && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#f0f9ff',
              borderRadius: '12px',
              border: '1px solid #bae6fd',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>
                TOTAL FLIGHT HOURS:
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>
                {totalHours.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
