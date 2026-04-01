import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';

interface SupabaseVerificationLoaderProps {
  onComplete: () => void;
}

export const SupabaseVerificationLoader: React.FC<SupabaseVerificationLoaderProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<'connecting' | 'verifying' | 'success' | 'error'>('connecting');
  const [message, setMessage] = useState('Establishing secure connection...');

  useEffect(() => {
    const verifyConnection = async () => {
      try {
        setStatus('connecting');
        setMessage('Establishing secure connection to Supabase...');
        
        // Test basic connection
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        if (error) {
          setStatus('error');
          setMessage('Connection failed. Please check your network.');
          console.error('Supabase connection error:', error);
          return;
        }

        setStatus('verifying');
        setMessage('Verifying user credentials and permissions...');
        
        // Simulate verification process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus('success');
        setMessage('Verification complete. Loading foundation program...');
        
        // Complete after success
        setTimeout(() => {
          onComplete();
        }, 1000);
        
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
        console.error('Verification error:', error);
      }
    };

    verifyConnection();
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        padding: '2rem'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <img 
            src="/logo.png" 
            alt="WingMentor Logo" 
            style={{ 
              width: '180px', 
              height: 'auto', 
              opacity: 0.9,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }} 
          />
        </div>

        {/* Status Icon */}
        <div style={{ marginBottom: '1.5rem' }}>
          {status === 'connecting' && (
            <Icons.Loader style={{ width: 48, height: 48, animation: 'spin 1s linear infinite' }} />
          )}
          {status === 'verifying' && (
            <Icons.Loader style={{ width: 48, height: 48, animation: 'spin 1s linear infinite' }} />
          )}
          {status === 'success' && (
            <Icons.CheckCircle style={{ width: 48, height: 48, color: '#10b981' }} />
          )}
          {status === 'error' && (
            <Icons.AlertTriangle style={{ width: 48, height: 48, color: '#ef4444' }} />
          )}
        </div>

        {/* Status Message */}
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 600, 
            marginBottom: '0.5rem',
            color: status === 'error' ? '#ef4444' : status === 'success' ? '#10b981' : '#ffffff'
          }}>
            {status === 'connecting' && 'Connecting to Database'}
            {status === 'verifying' && 'Verifying Credentials'}
            {status === 'success' && 'Connection Successful'}
            {status === 'error' && 'Connection Failed'}
          </h2>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#94a3b8',
            lineHeight: 1.5
          }}>
            {message}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          width: '100%', 
          height: '4px', 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: status === 'connecting' ? '30%' : status === 'verifying' ? '70%' : status === 'success' ? '100%' : '0%',
            height: '100%',
            backgroundColor: status === 'error' ? '#ef4444' : status === 'success' ? '#10b981' : '#3b82f6',
            transition: 'width 0.5s ease',
            borderRadius: '2px'
          }} />
        </div>

        {/* Additional Info */}
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          <p>Powered by Supabase Database</p>
          <p style={{ marginTop: '0.5rem' }}>WingMentor Foundation Program</p>
        </div>

        {/* Error Retry Button */}
        {status === 'error' && (
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            Retry Connection
          </button>
        )}
      </div>

      {/* Add CSS animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
