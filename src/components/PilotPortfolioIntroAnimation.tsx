import React, { useState, useEffect } from 'react';

interface PilotPortfolioIntroAnimationProps {
  onAnimationComplete: () => void;
}

export const PilotPortfolioIntroAnimation: React.FC<PilotPortfolioIntroAnimationProps> = ({
  onAnimationComplete
}) => {
  const [phase, setPhase] = useState<'programs' | 'recognition' | 'pathways' | 'shoot' | 'split' | 'logo' | 'complete'>('programs');
  const [pathwayLines, setPathwayLines] = useState<Array<{ id: number; angle: number; delay: number }>>([]);

  useEffect(() => {
    // Sequence: Programs (1s) -> Recognition (1s) -> Pathways (1s) -> Shoot (0.5s) -> Split (1s) -> Logo (1s) -> Complete
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    timers.push(setTimeout(() => setPhase('recognition'), 1000));
    timers.push(setTimeout(() => setPhase('pathways'), 2000));
    timers.push(setTimeout(() => setPhase('shoot'), 3000));
    timers.push(setTimeout(() => {
      setPhase('split');
      // Generate pathway lines radiating outward
      const lines = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i * 45) - 135, // Spread from -135 to 180 degrees
        delay: i * 0.1
      }));
      setPathwayLines(lines);
    }, 3500));
    timers.push(setTimeout(() => setPhase('logo'), 4500));
    timers.push(setTimeout(() => {
      setPhase('complete');
      onAnimationComplete();
    }, 5500));

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onAnimationComplete]);

  if (phase === 'complete') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #eef4fb 0%, #dbeafe 50%, #bfdbfe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Phase 1-3: Three P's sequential display */}
      {(phase === 'programs' || phase === 'recognition' || phase === 'pathways') && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            animation: phase === 'pathways' ? 'shootUp 0.5s ease-in-out 0.7s forwards' : undefined
          }}
        >
          {/* Programs */}
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: phase === 'programs' ? '#2563eb' : '#94a3b8',
              opacity: phase === 'programs' ? 1 : 0.4,
              transform: phase === 'programs' ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.1em'
            }}
          >
            Programs
          </div>
          
          {/* Arrow */}
          <div
            style={{
              fontSize: '1.5rem',
              color: '#cbd5e1',
              opacity: phase === 'recognition' || phase === 'pathways' ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            ↓
          </div>
          
          {/* Pilot Recognition */}
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 600,
              color: phase === 'recognition' ? '#2563eb' : '#94a3b8',
              opacity: phase === 'recognition' ? 1 : phase === 'pathways' ? 0.4 : 0.3,
              transform: phase === 'recognition' ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.05em'
            }}
          >
            Pilot Recognition
          </div>
          
          {/* Arrow */}
          <div
            style={{
              fontSize: '1.5rem',
              color: '#cbd5e1',
              opacity: phase === 'pathways' ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            ↓
          </div>
          
          {/* Pathways */}
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: phase === 'pathways' ? '#2563eb' : '#94a3b8',
              opacity: phase === 'pathways' ? 1 : 0.4,
              transform: phase === 'pathways' ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.1em',
              position: 'relative'
            }}
          >
            Pathways
            {/* Glow effect when active */}
            {phase === 'pathways' && (
              <div
                style={{
                  position: 'absolute',
                  inset: '-20px',
                  background: 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'pulse 1s ease-in-out infinite',
                  zIndex: -1
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Phase 4: Shoot up effect - Pathways flies upward */}
      {phase === 'shoot' && (
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#2563eb',
            letterSpacing: '0.1em',
            animation: 'shootUpFast 0.5s ease-out forwards'
          }}
        >
          Pathways
        </div>
      )}

      {/* Phase 5: Split into pathway lines */}
      {phase === 'split' && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {pathwayLines.map((line) => (
            <div
              key={line.id}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '4px',
                height: '0',
                background: `linear-gradient(to top, ${
                  line.id % 3 === 0 ? '#0ea5e9' : line.id % 3 === 1 ? '#10b981' : '#8b5cf6'
                }, transparent)`,
                transformOrigin: 'bottom center',
                transform: `translate(-50%, -100%) rotate(${line.angle}deg)`,
                animation: `extendLine 0.6s ease-out ${line.delay}s forwards`,
                borderRadius: '2px'
              }}
            />
          ))}
          
          {/* Center burst point */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '20px',
              height: '20px',
              background: '#2563eb',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'burst 0.3s ease-out forwards',
              boxShadow: '0 0 40px rgba(37,99,235,0.8)'
            }}
          />
        </div>
      )}

      {/* Phase 6: WingMentor Logo appears */}
      {phase === 'logo' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            animation: 'fadeInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        >
          <img
            src="/logo.png"
            alt="WingMentor"
            style={{
              height: '120px',
              width: 'auto',
              filter: 'drop-shadow(0 10px 30px rgba(15,23,42,0.2))'
            }}
          />
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0,
              animation: 'fadeInUp 0.5s ease-out 0.3s forwards'
            }}
          >
            Pilot Portfolio
          </div>
        </div>
      )}

      {/* Keyframe Animations */}
      <style>{`
        @keyframes shootUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        
        @keyframes shootUpFast {
          0% { transform: translateY(0) scale(1.2); opacity: 1; }
          100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
        }
        
        @keyframes extendLine {
          0% { height: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { height: 40vh; opacity: 1; }
        }
        
        @keyframes burst {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        
        @keyframes fadeInScale {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
