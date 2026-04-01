import React from 'react';
import { Icons } from '../icons';

interface EnrolledFoundationalCardProps {
  userProfile?: any;
  onOpenPortfolio?: () => void;
  onReviewDetails?: () => void;
}

export const EnrolledFoundationalCard: React.FC<EnrolledFoundationalCardProps> = ({ 
  userProfile, 
  onOpenPortfolio,
  onReviewDetails
}) => {
  const modules = [
    { id: 1, title: 'Module 01: Core Fundamentals', icon: 'BookOpen', status: 'completed' },
    { id: 2, title: 'Module 02: Instrument Procedures', icon: 'Compass', status: 'completed' },
    { id: 3, title: 'Module 03: Advanced CRM', icon: 'Users', status: 'in-progress' },
    { id: 4, title: 'Module 04: Simulator Training', icon: 'Monitor', status: 'locked' },
    { id: 5, title: 'Module 05: Decision Making', icon: 'Brain', status: 'locked' },
    { id: 6, title: 'Module 06: Team Communication', icon: 'MessageSquare', status: 'locked' },
    { id: 7, title: 'Module 07: Final Assessment', icon: 'Award', status: 'locked' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'locked': return '#94a3b8';
      default: return '#94a3b8';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'locked': return 'Locked';
      default: return 'Locked';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(241,245,249,0.95) 100%)',
      borderRadius: '28px',
      padding: '2.75rem',
      marginBottom: '2.5rem',
      boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)',
      border: '1px solid rgba(148, 163, 184, 0.25)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{
            color: '#2563eb',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            ENROLLED PROGRAM
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Foundational Program Dashboard
          </h2>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '100px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981'
          }} />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#047857'
          }}>
            Active Enrollment
          </span>
        </div>
      </div>

      {/* Progress Overview */}
      <div style={{
        background: 'rgba(248, 250, 252, 0.8)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(226, 232, 240, 0.4)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#0f172a'
          }}>
            Overall Progress
          </span>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#2563eb'
          }}>
            2 of 7 Modules Complete
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: '29%',
            height: '100%',
            background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <span>29% Complete</span>
          <span>Est. 5 weeks remaining</span>
        </div>
      </div>

      {/* Modules Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {modules.map((module) => {
          const IconComponent = Icons[module.icon as keyof typeof Icons];
          return (
            <div
              key={module.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                cursor: module.status !== 'locked' ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                opacity: module.status === 'locked' ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (module.status !== 'locked') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (module.status !== 'locked') {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: module.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 
                           module.status === 'in-progress' ? 'rgba(245, 158, 11, 0.1)' : 
                           'rgba(148, 163, 184, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {IconComponent && (
                    <IconComponent 
                      style={{ 
                        width: 20, 
                        height: 20, 
                        color: getStatusColor(module.status) 
                      }} 
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    margin: 0,
                    lineHeight: 1.3
                  }}>
                    {module.title}
                  </h4>
                  <span style={{
                    fontSize: '0.75rem',
                    color: getStatusColor(module.status),
                    fontWeight: 500
                  }}>
                    {getStatusText(module.status)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={onReviewDetails}
          style={{
            flex: '1',
            minWidth: '180px',
            padding: '0.85rem 1.5rem',
            background: 'rgba(37, 99, 235, 0.1)',
            color: '#1d4ed8',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            borderRadius: '14px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#1d4ed8';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)';
            e.currentTarget.style.color = '#1d4ed8';
          }}
        >
          <Icons.Info style={{ width: 16, height: 16 }} />
          Review Program Details
        </button>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#64748b',
            border: '1px solid rgba(226, 232, 240, 0.6)',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.6)';
          }}
        >
          <Icons.Settings style={{ width: 16, height: 16 }} />
          Program Settings
        </button>
        <button
          onClick={onOpenPortfolio}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Icons.Briefcase style={{ width: 16, height: 16 }} />
          View Portfolio
        </button>
      </div>
    </div>
  );
};
