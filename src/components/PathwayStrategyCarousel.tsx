import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icons } from '../icons';

interface StrategyAdvantage {
  text: string;
  highlight?: string;
}

interface RequiredCredential {
  label: string;
  value: string;
  status: 'met' | 'pending' | 'required';
}

interface NextMilestone {
  title: string;
  description: string;
  progress: number;
}

interface PathwayStrategyCard {
  id: string;
  icon: string;
  iconBg: string;
  matchPercentage: number;
  matchLabel: string;
  title: string;
  subtitle: string;
  advantages: StrategyAdvantage[];
  credentials: RequiredCredential[];
  nextMilestone: NextMilestone;
  cta: string;
  onClick?: () => void;
}

interface PathwayStrategyCarouselProps {
  cards: PathwayStrategyCard[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const PathwayStrategyCarousel: React.FC<PathwayStrategyCarouselProps> = ({
  cards,
  autoPlay = true,
  autoPlayInterval = 7000
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setVisibleBullets([]);
    
    setTimeout(() => {
      setActiveIndex(index);
      // Stagger in bullets after slide change
      const bulletsCount = cards[index]?.advantages.length || 0;
      const newTimeouts: ReturnType<typeof setTimeout>[] = [];
      
      for (let i = 0; i < bulletsCount; i++) {
        const timeout = setTimeout(() => {
          setVisibleBullets(prev => [...prev, i]);
        }, 100 + i * 150);
        newTimeouts.push(timeout);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      
      return () => newTimeouts.forEach(t => clearTimeout(t));
    }, 400);
  }, [activeIndex, cards, isTransitioning]);

  const nextSlide = useCallback(() => {
    const next = (activeIndex + 1) % cards.length;
    goToSlide(next);
  }, [activeIndex, cards.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (activeIndex - 1 + cards.length) % cards.length;
    goToSlide(prev);
  }, [activeIndex, cards.length, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isPaused, nextSlide]);

  // Initial bullet animation
  useEffect(() => {
    setVisibleBullets([]);
    const bulletsCount = cards[activeIndex]?.advantages.length || 0;
    const newTimeouts: ReturnType<typeof setTimeout>[] = [];
    
    for (let i = 0; i < bulletsCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleBullets(prev => [...prev, i]);
      }, 300 + i * 150);
      newTimeouts.push(timeout);
    }
    
    return () => {
      newTimeouts.forEach(t => clearTimeout(t));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, cards]);

  const activeCard = cards[activeIndex];

  const getStatusColor = (status: RequiredCredential['status']) => {
    switch (status) {
      case 'met': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'required': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status: RequiredCredential['status']) => {
    switch (status) {
      case 'met': return '✓';
      case 'pending': return '⏳';
      case 'required': return '!';
      default: return '•';
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(15, 23, 42, 0.25)'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Solid Dark Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          zIndex: 0
        }}
      />

      {/* Main Content Container - overflow hidden to prevent text push-out */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          overflow: 'hidden',
          zIndex: 2
        }}
      >
        {/* Left Side - Main Strategy Content (max-width 60%, padding-left 5%) */}
        <div
          style={{
            width: '60%',
            maxWidth: '60%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '5%',
            paddingRight: '2rem',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            boxSizing: 'border-box'
          }}
        >
          {/* Header with Icon and Match Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.75rem'
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: activeCard.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                flexShrink: 0
              }}
            >
              {activeCard.icon}
            </div>

            {/* Match Badge */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#4ade80',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>★</span>
                {activeCard.matchPercentage}% Match
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                  marginLeft: '0.5rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {activeCard.matchLabel}
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 0.75rem',
                lineHeight: 1.2,
                textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)',
                transition: 'opacity 400ms ease, transform 400ms ease'
              }}
            >
              {activeCard.title}
            </h3>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'rgba(255,255,255,0.85)',
                margin: 0,
                fontWeight: 500,
                lineHeight: 1.5,
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)',
                transition: 'opacity 400ms ease 50ms, transform 400ms ease 50ms'
              }}
            >
              {activeCard.subtitle}
            </p>
          </div>

          {/* Strategic Advantages - FIXED: contained within safe area */}
          <div style={{ marginBottom: '1rem', width: '100%' }}>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                marginBottom: '1.5rem',
                marginLeft: '0.25rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              Strategic Advantages
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                width: '100%'
              }}
            >
              {activeCard.advantages.map((advantage, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    opacity: visibleBullets.includes(index) ? 1 : 0,
                    transform: visibleBullets.includes(index) 
                      ? 'translateX(0)' 
                      : 'translateX(-20px)',
                    transition: `opacity 400ms ease ${index * 100}ms, transform 400ms ease ${index * 100}ms`,
                    width: '100%',
                    flexShrink: 0
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#3b82f6',
                      marginTop: '0.6rem',
                      flexShrink: 0,
                      boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)'
                    }}
                  />
                  {/* FIXED: Strictly stacked flex-col layout with text containment */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.25rem',
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden'
                  }}>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.2,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {advantage.text}
                    </span>
                    {advantage.highlight && (
                      <span
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: 'rgba(147, 197, 253, 0.8)',
                          lineHeight: 1.3,
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {advantage.highlight}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Smokey Glass Sidebar (40%, Flush to edge) */}
        <div
          style={{
            width: '40%',
            maxWidth: '40%',
            flexShrink: 0,
            background: 'rgba(2, 6, 23, 0.4)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.05), -10px 0 40px rgba(0,0,0,0.3)',
            boxSizing: 'border-box'
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'rgba(148, 163, 184, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}
            >
              Required Credentials
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {activeCard.credentials.map((credential, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.875rem',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    border: `1px solid ${getStatusColor(credential.status)}40`,
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? 'translateX(20px)' : 'translateX(0)',
                    transition: `opacity 400ms ease ${300 + index * 100}ms, transform 400ms ease ${300 + index * 100}ms`
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 500
                    }}
                  >
                    {credential.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: getStatusColor(credential.status)
                      }}
                    >
                      {credential.value}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: getStatusColor(credential.status) }}>
                      {getStatusIcon(credential.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
            }}
          />

          {/* Next Milestone */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'rgba(148, 163, 184, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}
            >
              Next Milestone
            </p>
            <div
              style={{
                padding: '1.25rem',
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                transition: 'opacity 400ms ease 500ms, transform 400ms ease 500ms'
              }}
            >
              <p
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: '0 0 0.5rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {activeCard.nextMilestone.title}
              </p>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(148, 163, 184, 0.9)',
                  margin: '0 0 1rem',
                  lineHeight: 1.5
                }}
              >
                {activeCard.nextMilestone.description}
              </p>
              {/* Progress Bar */}
              <div
                style={{
                  height: '4px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${activeCard.nextMilestone.progress}%`,
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                    borderRadius: '999px',
                    transition: 'width 800ms ease 600ms',
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(148, 163, 184, 0.7)',
                  margin: '0.75rem 0 0',
                  textAlign: 'right'
                }}
              >
                {activeCard.nextMilestone.progress}% Complete
              </p>
            </div>
          </div>

          {/* Discover Pathway CTA Button */}
          <button
            onClick={activeCard.onClick}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(59, 130, 246, 0.8)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transitionDelay: '600ms'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.95)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)';
            }}
          >
            {activeCard.cta}
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 20
        }}
      >
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === activeIndex ? '2rem' : '0.5rem',
              height: '0.5rem',
              borderRadius: '999px',
              border: 'none',
              background: index === activeIndex 
                ? 'rgba(255,255,255,0.95)' 
                : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: 'rgba(255,255,255,0.9)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
        }}
      >
        <Icons.ChevronLeft style={{ width: 20, height: 20 }} />
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: 'calc(40% + 1rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: 'rgba(255,255,255,0.9)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
        }}
      >
        <Icons.ChevronRight style={{ width: 20, height: 20 }} />
      </button>
    </div>
  );
};
