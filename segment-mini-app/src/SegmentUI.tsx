import React from 'react';

const SegmentUI: React.FC = () => {
    return (
        <div style={{
            padding: '2rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '12px',
            border: '2px dashed #0369a1',
            marginTop: '1.5rem',
            textAlign: 'center'
        }}>
            <h2 style={{ color: '#0369a1', marginBottom: '1rem' }}>DYNAMIC SEGMENT LOADED</h2>
            <p style={{ color: '#0c4a6e' }}>
                This module was fetched asynchronously from the internal server using Webpack/Vite Module Federation.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button style={{ padding: '0.5rem 1rem', background: '#0369a1', color: 'white', border: 'none', borderRadius: '6px' }}>
                    Execute Internal Action
                </button>
            </div>
        </div>
    );
};

export default SegmentUI;
