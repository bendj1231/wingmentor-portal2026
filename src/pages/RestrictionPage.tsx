import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types/user';
import { SupportEnquiryPage } from './SupportEnquiryPage';
import { EnquiryAlreadySentPage } from './EnquiryAlreadySentPage';
import { CloudBackground } from '../components/CloudBackground';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface RestrictionPageProps {
  onBack: () => void;
  userProfile: UserProfile;
  programName: string;
  restrictionReason?: string;
}

export const RestrictionPage: React.FC<RestrictionPageProps> = ({
  onBack,
  userProfile,
  programName,
  restrictionReason = 'Your access to this program has been restricted by an administrator.'
}) => {
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [showCooldownPage, setShowCooldownPage] = useState(false);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [hasActiveCooldown, setHasActiveCooldown] = useState(false);
  const [isCheckingCooldown, setIsCheckingCooldown] = useState(false);
  const [managerStatus, setManagerStatus] = useState<{
    userStatus?: string;
    programAccess?: string;
    lastChecked?: string;
    isGranted?: boolean;
    track?: string;
  } | null>(null);
  const [isCheckingManagerStatus, setIsCheckingManagerStatus] = useState(false);
  const [managerStatusError, setManagerStatusError] = useState<string | null>(null);

  const programToAppId: Record<string, string> = {
    'Foundational Program': 'foundational',
    'Transition Program': 'transition',
    'ATPL Pathway': 'atpl_pathway',
    'Air Taxi Pathway': 'airtaxi_pathway',
    'Private Sector Pathway': 'private_sector'
  };

  // Check cooldown on component mount only
  useEffect(() => {
    const checkInitialCooldown = async () => {
      if (isCheckingCooldown) return;
      
      setIsCheckingCooldown(true);
      const hasCooldown = await checkCooldown();
      setHasActiveCooldown(hasCooldown);
      setIsCheckingCooldown(false);
    };
    checkInitialCooldown();
    checkMentorManagementStatus();
  }, []); // Empty dependency - only run once on mount

  const checkMentorManagementStatus = async () => {
    if (isCheckingManagerStatus) return;
    try {
      setIsCheckingManagerStatus(true);
      setManagerStatusError(null);

      if (!db) {
        const storedStatus = localStorage.getItem(`user_status_${userProfile.id}`) as UserProfile['status'] | null;
        const storedAccessRaw = localStorage.getItem(`user_access_${userProfile.id}`);
        const appId = programToAppId[programName] || programName.toLowerCase().replace(/\s+/g, '_');
        const storedAccess = storedAccessRaw ? JSON.parse(storedAccessRaw) : [];
        const programAccess = storedAccess.find((a: any) => a.appId === appId);
        setManagerStatus({
          userStatus: storedStatus || userProfile.status,
          programAccess: programAccess ? (programAccess.granted && !programAccess.restricted ? 'Granted' : (programAccess.restricted ? 'Restricted' : 'Not Granted')) : 'Not Configured',
          lastChecked: new Date().toISOString(),
          isGranted: programAccess ? programAccess.granted && !programAccess.restricted : false
        });
        return;
      }

      const userRef = doc(db, 'users', userProfile.id);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        setManagerStatusError('Unable to locate your record in Mentor Management.');
        return;
      }

      const latestProfile = snapshot.data() as UserProfile;
      const appId = programToAppId[programName] || programName.toLowerCase().replace(/\s+/g, '_');
      const programAccess = latestProfile.appAccess?.find(access => access.appId === appId);
      const isGranted = !!programAccess?.granted && !programAccess?.restricted;

      setManagerStatus({
        userStatus: latestProfile.status,
        programAccess: programAccess ? (isGranted ? 'Granted' : programAccess.restricted ? 'Restricted' : 'Not Granted') : 'Not Configured',
        lastChecked: new Date().toISOString(),
        isGranted,
        track: (latestProfile as any).track
      });
    } catch (error) {
      console.error('Error checking Mentor Management status:', error);
      setManagerStatusError('Unable to reach Mentor Management. Please try again in a moment.');
    } finally {
      setIsCheckingManagerStatus(false);
    }
  };

  // Check if user has cooldown active
  const checkCooldown = async () => {
    try {
      // Query Firestore for existing enquiries from this user for this program
      const enquiriesRef = collection(db, 'supportEnquiries');
      const q = query(
        enquiriesRef,
        where('userId', '==', userProfile.id),
        where('program', '==', programName),
        where('type', '==', 'support_enquiry'),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const lastEnquiry = querySnapshot.docs[0].data();
        const submissionTime = lastEnquiry.timestamp?.toDate()?.getTime() || Date.now();
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - submissionTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // If submitted within last 24 hours, show cooldown page
        if (hoursDiff < 24) {
          setHoursRemaining(Math.ceil(24 - hoursDiff));
          return true;
        }
      }
    } catch (error) {
      // Fallback to localStorage if Firebase fails
      try {
        const existingNotifications = JSON.parse(localStorage.getItem('supportNotifications') || '[]');
        const userEnquiries = existingNotifications.filter((n: any) => 
          n.user?.id === userProfile.id && 
          n.program === programName && 
          n.type === 'support_enquiry'
        );
        
        if (userEnquiries.length > 0) {
          const lastEnquiry = userEnquiries[0];
          const submissionTime = new Date(lastEnquiry.timestamp).getTime();
          const currentTime = new Date().getTime();
          const timeDiff = currentTime - submissionTime;
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setHoursRemaining(Math.ceil(24 - hoursDiff));
            return true;
          }
        }
      } catch (localError) {
        // Silent error handling
      }
    }
    return false;
  };

  const handleContactSupport = async () => {
    const hasCooldown = await checkCooldown();
    setHasActiveCooldown(hasCooldown);
    if (hasCooldown) {
      setShowCooldownPage(true);
    } else {
      setShowSupportForm(true);
    }
  };

  if (showCooldownPage) {
    return (
      <EnquiryAlreadySentPage
        onBack={() => setShowCooldownPage(false)}
        userProfile={userProfile}
        programName={programName}
        hoursRemaining={hoursRemaining}
        supportPhone="+629670481890"
      />
    );
  }

  if (showSupportForm) {
    return (
      <SupportEnquiryPage
        onBack={() => setShowSupportForm(false)}
        userProfile={userProfile}
        programName={programName}
        restrictionReason={restrictionReason}
      />
    );
  }

  return (
    <div className="dashboard-container animate-fade-in" style={{ 
      alignItems: 'flex-start', 
      justifyContent: 'center', 
      padding: '3rem 1rem 2rem',
      background: 'transparent',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <CloudBackground />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', textAlign: 'left', width: '100%', maxWidth: '56rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '4rem 3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
          
          <div style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            ACCESS RESTRICTED
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
            Program Access Denied
          </h2>

          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            background: '#f8fafc',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.25em', color: '#94a3b8', fontWeight: 600 }}>WINGMENTOR MANAGEMENT STATUS</p>
                <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#0f172a' }}>
                  {managerStatus?.userStatus ? managerStatus.userStatus.toUpperCase() : userProfile.status?.toUpperCase()}
                </h3>
                <p style={{ margin: '0.25rem 0 0', color: '#475569', fontSize: '0.9rem' }}>
                  Program Access: {managerStatus?.programAccess || 'Checking...'}
                </p>
                {managerStatus?.track && (
                  <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Track: {managerStatus.track}</p>
                )}
                {managerStatus?.lastChecked && (
                  <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>
                    Last checked: {new Date(managerStatus.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
              <button
                onClick={checkMentorManagementStatus}
                disabled={isCheckingManagerStatus}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #2563eb',
                  background: isCheckingManagerStatus ? '#e0e7ff' : '#2563eb',
                  color: isCheckingManagerStatus ? '#1e3a8a' : 'white',
                  fontWeight: 600,
                  cursor: isCheckingManagerStatus ? 'not-allowed' : 'pointer',
                  minWidth: '200px'
                }}
              >
                {isCheckingManagerStatus ? 'Checking...' : 'Check with Mentor Management'}
              </button>
            </div>
            {managerStatusError && (
              <p style={{ marginTop: '0.75rem', color: '#dc2626', fontSize: '0.85rem' }}>{managerStatusError}</p>
            )}
            {managerStatus?.isGranted && (
              <div style={{
                marginTop: '1rem',
                padding: '0.9rem 1.1rem',
                borderRadius: '12px',
                background: '#ecfdf5',
                color: '#047857',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                ✅ Mentor Management has restored your access. Click "Back to Programs" to continue.
              </div>
            )}
          </div>
            
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
            <strong>Your access to {programName} has been restricted.</strong> This restriction has been implemented by an administrator for security or compliance reasons. Please follow the steps below to resolve this issue.
            <br /><br />
            We understand this may impact your training progress, and we're committed to helping you resolve this as quickly as possible.
          </p>

          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fca5a5', 
            borderRadius: '16px', 
            padding: '2rem',
            margin: '2.5rem 0',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem', color: '#dc2626', marginTop: '0.25rem' }}>🚫</div>
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  color: '#991b1b', 
                  marginBottom: '0.75rem',
                  fontFamily: 'Georgia, serif'
                }}>
                  Restriction Details
                </h3>
                <p style={{ 
                  color: '#991b1b', 
                  lineHeight: 1.6, 
                  margin: 0,
                  fontSize: '0.95rem'
                }}>
                  {restrictionReason}
                </p>
                
                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    onClick={handleContactSupport}
                    style={{
                      padding: '0.875rem 2.5rem',
                      border: 'none',
                      background: hasActiveCooldown ? '#9ca3af' : '#dc2626',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: hasActiveCooldown ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'Georgia, serif',
                      opacity: hasActiveCooldown ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!hasActiveCooldown) {
                        e.currentTarget.style.background = '#b91c1c';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!hasActiveCooldown) {
                        e.currentTarget.style.background = '#dc2626';
                      }
                    }}
                  >
                    {hasActiveCooldown ? '⏰ Appeal on Cooldown' : '📝 Appeal Enquiry'}
                  </button>
                  
                  {hasActiveCooldown && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      fontSize: '0.85rem', 
                      color: '#991b1b',
                      textAlign: 'center'
                    }}>
                      Appeal already submitted. Please wait {hoursRemaining} hours before submitting again.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '16px', 
            padding: '2rem',
            margin: '2.5rem 0',
            textAlign: 'left'
          }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              color: '#374151', 
              marginBottom: '1.5rem',
              fontFamily: 'Georgia, serif'
            }}>
              Appeal Process
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#dcfce7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: '#16a34a',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Submit Appeal</strong>
                  <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                    Click the "Appeal Enquiry" button below to submit your appeal
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#dcfce7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: '#16a34a',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Provide Details</strong>
                  <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                    Explain your situation and why you believe the restriction should be lifted
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#dcfce7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: '#16a34a',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Wait for Review</strong>
                  <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                    Our team will review your appeal and respond within 24-48 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fca5a5', 
            borderRadius: '12px', 
            padding: '1.5rem',
            margin: '2rem 0',
            fontSize: '0.85rem',
            color: '#991b1b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.2rem', color: '#dc2626' }}>ℹ️</div>
              <strong>Your Information:</strong>
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <div><strong>User:</strong> {userProfile.displayName || userProfile.email}</div>
              <div><strong>Program:</strong> {programName}</div>
              <div><strong>Role:</strong> {userProfile.role}</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button
              onClick={onBack}
              style={{
                padding: '0.875rem 2.5rem',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Georgia, serif'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              ← Back to Programs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
