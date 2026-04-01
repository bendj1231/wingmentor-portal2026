import React, { useEffect, useState } from 'react';
import { type GraphicsPreset, GraphicsPresetSelector } from './GraphicsPresetSelector';

// Enhanced device detection function
function detectDeviceCapabilities(): {
  recommendedPreset: GraphicsPreset;
  reason: string;
  deviceLabel: string;
} {
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

interface AutoDetectGraphicsPresetSelectorProps {
  selectedPreset: GraphicsPreset;
  onSelect: (preset: GraphicsPreset) => void;
  onConfirm: () => void;
}

export const AutoDetectGraphicsPresetSelector: React.FC<AutoDetectGraphicsPresetSelectorProps> = ({
  selectedPreset,
  onSelect,
  onConfirm
}) => {
  const [detection, setDetection] = useState<{
    recommendedPreset: GraphicsPreset;
    reason: string;
    deviceLabel: string;
  } | null>(null);

  useEffect(() => {
    // Run detection when component mounts
    const detected = detectDeviceCapabilities();
    setDetection(detected);
  }, []);

  // Show loading state while detecting
  if (!detection) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: '#fff',
          borderRadius: '28px',
          boxShadow: '0 40px 120px rgba(15,23,42,0.18)',
          border: '1px solid rgba(255,255,255,0.7)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 500, color: '#0f172a', marginBottom: '0.5rem' }}>
            Detecting your device...
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Analyzing your system capabilities to optimize graphics settings
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <GraphicsPresetSelector
      detection={detection}
      selectedPreset={selectedPreset}
      onSelect={onSelect}
      onConfirm={onConfirm}
    />
  );
};