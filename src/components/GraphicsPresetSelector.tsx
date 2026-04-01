import React, { useEffect, useState } from 'react';
import { Icons } from '../icons';

export type GraphicsPreset = 'low' | 'mid' | 'high';

export interface DetectionResult {
  recommendedPreset: GraphicsPreset;
  reason: string;
  deviceLabel: string;
}

interface GraphicsPresetSelectorProps {
  detection: DetectionResult;
  selectedPreset: GraphicsPreset;
  onSelect: (preset: GraphicsPreset) => void;
  onConfirm: () => void;
}

// Enhanced device detection function
function detectDeviceCapabilities(): DetectionResult {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  
  // Check for WebGL capabilities
  let webglPreset: GraphicsPreset = 'low';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as WEBGL_debug_renderer_info | null;
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string : null;
      
      // Check for integrated vs dedicated graphics
      const isIntegrated = renderer && (
        renderer.includes('Intel') || 
        renderer.includes('AMD') || 
        renderer.includes('Radeon') ||
        renderer.includes('Mali') ||
        renderer.includes('Adreno')
      );
      
      // Check screen resolution and pixel ratio
      const pixelRatio = window.devicePixelRatio || 1;
      const screenWidth = screen.width;
      const screenHeight = screen.height;
      const totalPixels = screenWidth * screenHeight * (pixelRatio ** 2);
      
      // Memory estimation (if available)
      const memory = (navigator as any).deviceMemory || 4;
      
      // Performance scoring
      let score = 0;
      
      // Memory scoring (deviceMemory in GB) - Enhanced for modern devices
      if (memory >= 16) score += 4; // High-end like M4 Air with 16GB
      else if (memory >= 8) score += 3;
      else if (memory >= 4) score += 2;
      else if (memory >= 2) score += 1;
      
      // Resolution scoring
      if (totalPixels > 4000000) score += 1; // High resolution
      else if (totalPixels > 2000000) score += 2; // Medium resolution
      else score += 3; // Low resolution
      
      // Platform scoring
      if (platform.includes('MacIntel') || platform.includes('Win')) {
        score += 2; // Desktop platforms generally more powerful
      } else if (maxTouchPoints > 0) {
        score += 1; // Mobile/tablet platforms
      }
      
      // Graphics scoring
      if (!isIntegrated && renderer && !renderer.includes('Software')) {
        score += 3; // Dedicated graphics
      } else if (isIntegrated) {
        score += 1; // Integrated graphics
      }
      
      if (score >= 8) webglPreset = 'high';
      else if (score >= 5) webglPreset = 'mid';
      else webglPreset = 'low';
    }
  } catch (e) {
    // Fallback to basic detection
  }

  // User Agent based detection for specific models
  let deviceLabel = 'Unknown Device';
  let reason = 'Based on browser capabilities and screen resolution';
  
  // Mac detection
  if (userAgent.includes('Mac')) {
    if (userAgent.includes('Intel')) {
      deviceLabel = 'Mac (Intel)';
      if (webglPreset === 'high') reason = 'Modern Intel Mac with dedicated graphics';
      else if (webglPreset === 'mid') reason = 'Intel Mac with integrated graphics';
      else reason = 'Older Intel Mac or low resolution';
    } else {
      // Apple Silicon
      const isM1 = userAgent.includes('M1') || userAgent.includes('M2') || userAgent.includes('M3') || userAgent.includes('M4');
      if (isM1) {
        deviceLabel = 'Mac (Apple Silicon)';
        if (webglPreset === 'high') reason = 'Latest Apple Silicon Mac with high resolution';
        else reason = 'Apple Silicon Mac with standard configuration';
      } else {
        deviceLabel = 'Mac (Apple Silicon)';
        reason = 'Apple Silicon Mac detected';
      }
    }
  }
  // Windows detection
  else if (userAgent.includes('Windows')) {
    deviceLabel = 'Windows PC';
    if (webglPreset === 'high') reason = 'High-end PC with dedicated graphics and high resolution';
    else if (webglPreset === 'mid') reason = 'Mid-range PC with integrated or lower-end dedicated graphics';
    else reason = 'Older PC or low resolution display';
  }
  // Linux detection
  else if (userAgent.includes('Linux')) {
    deviceLabel = 'Linux PC';
    if (webglPreset === 'high') reason = 'High-performance Linux system';
    else if (webglPreset === 'mid') reason = 'Standard Linux configuration';
    else reason = 'Lower-end Linux system';
  }
  // Mobile detection
  else if (maxTouchPoints > 0) {
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      deviceLabel = 'iOS Device';
      reason = 'iOS device with Metal graphics support';
    } else if (userAgent.includes('Android')) {
      deviceLabel = 'Android Device';
      reason = 'Android device with Vulkan/OpenGL ES support';
    } else {
      deviceLabel = 'Mobile Device';
      reason = 'Touch-enabled device detected';
    }
  }

  return {
    recommendedPreset: webglPreset,
    reason,
    deviceLabel
  };
}

const presetDetails: Record<GraphicsPreset, { title: string; subtitle: string; badge: string }> = {
  low: {
    title: 'Low-End PC',
    subtitle: 'Best for older PCs and Macs, including older MacBook Air models and devices from before 2020.',
    badge: 'Maximum stability'
  },
  mid: {
    title: 'Mid-Range PC',
    subtitle: 'Balanced visuals for mainstream laptops and desktops, especially around 2020-era hardware.',
    badge: 'Recommended balance'
  },
  high: {
    title: 'High-End PC',
    subtitle: 'Full visual quality for the latest high-end systems, including newer performance Macs and flagship PCs.',
    badge: 'Best visuals'
  }
};

const presetOrder: GraphicsPreset[] = ['low', 'mid', 'high'];

export const GraphicsPresetSelector: React.FC<GraphicsPresetSelectorProps> = ({
  detection,
  selectedPreset,
  onSelect,
  onConfirm
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 10,
        background: 'transparent',
        transform: 'scale(0.92)',
        transformOrigin: 'center center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          borderRadius: '28px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 40px 120px rgba(15,23,42,0.25)',
          border: '1px solid rgba(226,232,240,0.8)'
        }}
      >
        {/* Logo Header - Solid Dark */}
        <div
          style={{
            background: 'linear-gradient(145deg, #020817 0%, #0f172a 55%, #0b3b67 100%)',
            color: '#fff',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <img src="/logo.png" alt="WingMentor Logo" style={{ width: '200px', maxWidth: '100%', marginBottom: '1rem' }} />
          <div style={{ letterSpacing: '0.28em', fontSize: '0.78rem', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            SYSTEM DETECTION
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', lineHeight: 1.2, fontWeight: 600 }}>
            Choose your graphics profile
          </h1>
          <p style={{ margin: '0 auto', color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.9rem', maxWidth: '600px' }}>
            Select a graphics mode to optimize WingMentor for your device before login
          </p>
        </div>

        {/* Performance Presets Grid */}
        <div style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.16em', color: '#94a3b8', fontWeight: 700, marginBottom: '0.5rem' }}>
              PERFORMANCE PRESET
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 500, color: '#0f172a', lineHeight: 1.2 }}>
              Optimize graphics before login
            </h2>
          </div>

          {/* Three Presets in Horizontal Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {presetOrder.map((preset) => {
              const isSelected = preset === selectedPreset;
              const isRecommended = preset === detection.recommendedPreset;
              const details = presetDetails[preset];

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSelect(preset)}
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    borderRadius: '20px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #dbe4f0',
                    background: isSelected ? 'rgba(37,99,235,0.08)' : '#fff',
                    padding: '1.5rem 1rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 15px 35px rgba(37,99,235,0.15)' : '0 8px 20px rgba(15,23,42,0.06)',
                    transition: 'all 0.25s ease',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Top Section */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '999px',
                        border: isSelected ? '4px solid #2563eb' : '2px solid #94a3b8',
                        boxSizing: 'border-box',
                        display: 'inline-block'
                      }}
                    />
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{details.title}</span>
                  </div>

                  {/* Middle Section */}
                  <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>
                    {details.subtitle}
                  </div>

                  {/* Bottom Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    {isRecommended && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1d4ed8', background: 'rgba(37,99,235,0.12)', padding: '0.3rem 0.6rem', borderRadius: '999px', wordBreak: 'break-word' }}>
                        Recommended
                      </span>
                    )}
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', background: '#f8fafc', padding: '0.3rem 0.6rem', borderRadius: '999px', wordBreak: 'break-word' }}>
                      {details.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Auto-detected Recommendation - Solid Dark */}
          <div
            style={{
              borderRadius: '18px',
              background: 'linear-gradient(145deg, #020817 0%, #0f172a 55%, #0b3b67 100%)',
              color: '#fff',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#93c5fd', marginBottom: '0.5rem', textAlign: 'center' }}>
              Auto-detected recommendation
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', textAlign: 'center' }}>
              {presetDetails[detection.recommendedPreset].title}
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '0.5rem', textAlign: 'center' }}>
              {detection.deviceLabel}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'center' }}>
              {detection.reason}
            </div>
          </div>

          {/* Info Section - Solid */}
          <div
            style={{
              borderRadius: '18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '1.2rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Icons.Info style={{ width: 18, height: 18, color: '#2563eb', marginTop: '0.15rem', flexShrink: 0 }} />
              <div style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.65 }}>
                Your choice is saved on this device and used automatically next time. You can still override the recommendation manually before continuing.
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={onConfirm}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '1rem 2rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(120deg, #0f172a 0%, #1d4ed8 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 20px 45px rgba(15,23,42,0.2)',
                minWidth: '220px'
              }}
            >
              Confirm & Optimize
              <Icons.ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
