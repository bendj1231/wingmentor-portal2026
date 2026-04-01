import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';
import type { UserProfile } from '../types/user';

interface PilotPortfolioPageProps {
  onBack: () => void;
  userProfile?: UserProfile | null;
  preloadedPortfolio?: any;
}

interface PilotPortfolio {
  id: string;
  user_id: string;
  foundation_program_status: 'not_started' | 'in_progress' | 'completed';
  program_start_date?: string;
  program_completion_date?: string;
  initial_examination_scores: any;
  airbus_interview_data: any;
  faa_examination_results: any;
  monthly_recency_records: any;
  performance_metrics: any;
  industry_knowledge_assessments: any;
  pilot_gap_module_completion: any;
  competency_development: any;
  career_progression: any;
  recognition_achievements: string[];
  created_at: string;
  updated_at: string;
}

export const PilotPortfolioPage: React.FC<PilotPortfolioPageProps> = ({ onBack, userProfile, preloadedPortfolio }) => {
  const [portfolio, setPortfolio] = useState<PilotPortfolio | null>(preloadedPortfolio || null);
  const [loading, setLoading] = useState(!preloadedPortfolio);
  const [selectedSection, setSelectedSection] = useState<'overview' | 'credentials' | 'examinations' | 'performance' | 'industry' | 'career'>('overview');

  useEffect(() => {
    if (preloadedPortfolio) {
      setPortfolio(preloadedPortfolio);
      setLoading(false);
    } else if (userProfile?.uid) {
      fetchPortfolioData();
    }
  }, [userProfile?.uid, preloadedPortfolio]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);

      const { data: portfolioData, error: portfolioError } = await supabase
        .from('pilot_portfolio')
        .select('*')
        .eq('user_id', userProfile?.uid)
        .single();

      if (portfolioError && portfolioError.code !== 'PGRST116') {
        throw portfolioError;
      }

      // Create portfolio if it doesn't exist
      if (!portfolioData) {
        const { data: newPortfolio, error: createError } = await supabase
          .from('pilot_portfolio')
          .insert({
            user_id: userProfile?.uid,
            foundation_program_status: 'not_started',
            initial_examination_scores: {},
            airbus_interview_data: {},
            faa_examination_results: {},
            monthly_recency_records: {},
            performance_metrics: {},
            industry_knowledge_assessments: {},
            pilot_gap_module_completion: {},
            competency_development: {},
            career_progression: {},
            recognition_achievements: []
          })
          .select()
          .single();

        if (createError) throw createError;
        setPortfolio(newPortfolio);
      } else {
        setPortfolio(portfolioData);
      }

    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgramStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'not_started': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getProgramStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'not_started': return 'Not Started';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading Pilot Portfolio...</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0, overflow: 'auto', zIndex: 10 }}>
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 70px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
          Back
        </button>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
          Pilot Portfolio
        </h1>
      </div>

      {portfolio && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Program Status Overview */}
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  Foundation Program Status
                </h2>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: getProgramStatusColor(portfolio.foundation_program_status),
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {getProgramStatusText(portfolio.foundation_program_status)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {portfolio.recognition_achievements?.length || 0}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Recognition Achievements</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {portfolio.program_start_date && (
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Program Start</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {new Date(portfolio.program_start_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              {portfolio.program_completion_date && (
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Program Completion</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {new Date(portfolio.program_completion_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Portfolio Last Updated</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {new Date(portfolio.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0' }}>
            {['overview', 'credentials', 'examinations', 'performance', 'industry', 'career'].map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section as any)}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  borderBottom: selectedSection === section ? '2px solid #3b82f6' : '2px solid transparent',
                  background: selectedSection === section ? '#f8fafc' : 'white',
                  color: selectedSection === section ? '#3b82f6' : '#6b7280',
                  cursor: 'pointer',
                  fontWeight: selectedSection === section ? '600' : '400',
                  textTransform: 'capitalize'
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {selectedSection === 'overview' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Recognition Achievements */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Recognition Achievements
                  </h3>
                  {portfolio.recognition_achievements && portfolio.recognition_achievements.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {portfolio.recognition_achievements.map((achievement, index) => (
                        <span key={index} style={{
                          padding: '0.5rem 1rem',
                          background: '#dcfce7',
                          color: '#166534',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          {achievement}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                      No recognition achievements yet. Complete the Foundation Program to earn your first recognition.
                    </div>
                  )}
                </div>

                {/* Competency Development Overview */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    EBT CBTA Competency Development
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your competency development is tracked across the 9 core EBT CBTA competencies as you progress through the WingMentor program. This includes:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Communication</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Communication Skills, Situational Awareness</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Leadership</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Leadership & Teamwork, Decision Making</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Problem Solving</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Problem Solving, Workload Management</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Technical</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Application of Knowledge</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Safety</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Safety Management, Automation Management</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'credentials' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Pilot Credentials Section Header */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Pilot Credentials
                  </h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    Access your flight records, experience logs, medical certificates, and licensure details all in one place.
                  </p>
                </div>

                {/* Credentials Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Flight Logbooks Card */}
                  <div style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icons.Book style={{ width: 24, height: 24, color: '#3b82f6' }} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
                        Flight Logbooks
                      </h4>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      Access your verified flight records, digital logbooks, and mentor engagement logs. Track your total flight hours and recent activity.
                    </p>
                    <button style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      width: '100%'
                    }}>
                      View Logbooks
                    </button>
                  </div>

                  {/* Pilot Experience Card */}
                  <div style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: '#f0fdf4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icons.Award style={{ width: 24, height: 24, color: '#22c55e' }} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
                        Pilot Experience
                      </h4>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      View your comprehensive pilot experience summary including total hours, aircraft types, and flight history across all logged sessions.
                    </p>
                    <button style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      width: '100%'
                    }}>
                      View Experience
                    </button>
                  </div>

                  {/* Medical Certificates Card */}
                  <div style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: '#fef3c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icons.Activity style={{ width: 24, height: 24, color: '#f59e0b' }} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
                        Medical Certificates
                      </h4>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      Manage your medical certificate status, validity periods, and renewal reminders. Ensure your medical documentation stays current.
                    </p>
                    <button style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      width: '100%'
                    }}>
                      View Certificates
                    </button>
                  </div>

                  {/* Pilot Licensure Card */}
                  <div style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: '#f3e8ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icons.CheckCircle style={{ width: 24, height: 24, color: '#8b5cf6' }} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
                        Pilot Licensure
                      </h4>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      Access your pilot license details, ratings, endorsements, and certification status. View license validity and renewal dates.
                    </p>
                    <button style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      width: '100%'
                    }}>
                      View Licensure
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'examinations' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Initial Examination Scores */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Initial Examination Results
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your initial examination scores are recorded and tracked throughout the program to measure your progress and development.
                  </div>
                  {portfolio.initial_examination_scores && Object.keys(portfolio.initial_examination_scores).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Examination Results:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.initial_examination_scores, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No examination scores recorded yet.
                    </div>
                  )}
                </div>

                {/* Airbus Interview Data */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Airbus Interview Assessment
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your Airbus interview assessment evaluates your technical knowledge, behavioral competencies, and alignment with industry standards.
                  </div>
                  {portfolio.airbus_interview_data && Object.keys(portfolio.airbus_interview_data).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Interview Results:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.airbus_interview_data, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No Airbus interview data recorded yet.
                    </div>
                  )}
                </div>

                {/* FAA Examination Results */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    FAA Examination Results
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your FAA examination results are tracked monthly to maintain currency and demonstrate ongoing proficiency.
                  </div>
                  {portfolio.faa_examination_results && Object.keys(portfolio.faa_examination_results).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        FAA Results:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.faa_examination_results, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No FAA examination results recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedSection === 'performance' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Monthly Recency Records */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Monthly Recency Records
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your monthly recency records track flight hours, landings, and instrument approaches to maintain currency and demonstrate proficiency.
                  </div>
                  {portfolio.monthly_recency_records && Object.keys(portfolio.monthly_recency_records).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Recent Activity:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.monthly_recency_records, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No recency records recorded yet.
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Performance Metrics
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your performance metrics are tracked across various dimensions including technical skills, behavioral competencies, and overall program progress.
                  </div>
                  {portfolio.performance_metrics && Object.keys(portfolio.performance_metrics).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Performance Data:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.performance_metrics, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No performance metrics recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedSection === 'industry' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Industry Knowledge Assessments */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Industry Knowledge Assessments
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your industry knowledge is assessed through the Pilot Gap module and other evaluations to ensure comprehensive understanding of the aviation industry.
                  </div>
                  {portfolio.industry_knowledge_assessments && Object.keys(portfolio.industry_knowledge_assessments).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Assessment Results:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.industry_knowledge_assessments, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No industry knowledge assessments recorded yet.
                    </div>
                  )}
                </div>

                {/* Pilot Gap Module Completion */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Pilot Gap Module Completion
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    The Pilot Gap module provides comprehensive industry familiarization and helps bridge knowledge gaps between training and real-world aviation operations.
                  </div>
                  {portfolio.pilot_gap_module_completion && Object.keys(portfolio.pilot_gap_module_completion).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Module Progress:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.pilot_gap_module_completion, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No Pilot Gap module data recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedSection === 'career' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Competency Development */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Competency Development Progress
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your competency development is tracked across the 9 EBT CBTA core competencies, providing a comprehensive view of your professional growth.
                  </div>
                  {portfolio.competency_development && Object.keys(portfolio.competency_development).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Development Progress:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.competency_development, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No competency development data recorded yet.
                    </div>
                  )}
                </div>

                {/* Career Progression */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    Career Progression Tracking
                  </h3>
                  <div style={{ color: '#475569', lineHeight: 1.6 }}>
                    Your career progression is tracked including job applications, interviews, recognition achievements, and advancement opportunities within the WingMentor network.
                  </div>
                  {portfolio.career_progression && Object.keys(portfolio.career_progression).length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Career Data:
                      </div>
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {JSON.stringify(portfolio.career_progression, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
                      No career progression data recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
  );
};
