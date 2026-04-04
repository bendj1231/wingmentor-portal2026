import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../icons';

interface PathwayCard {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  onClick?: () => void;
  subtitle?: string;
  advantages?: { title: string; description: string }[];
}

interface PathwaysCarouselProps {
  cards: PathwayCard[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const PathwaysCarousel: React.FC<PathwaysCarouselProps> = ({
  cards,
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    const next = (activeIndex + 1) % cards.length;
    goToSlide(next);
  }, [activeIndex, cards.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (activeIndex - 1 + cards.length) % cards.length;
    goToSlide(prev);
  }, [activeIndex, cards.length, goToSlide]);

  // Auto-play - use refs to avoid re-renders
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % cards.length);
    }, autoPlayInterval || 5000);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, cards.length, autoPlayInterval]);

  const activeCard = cards[activeIndex];
  const progressPercent = ((activeIndex + 1) / cards.length) * 100;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(15, 23, 42, 0.25)'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* CSS for bullet animations */}
      <style>{`
        .pathway-bullet {
          opacity: 0;
          transform: translateX(-20px);
          animation: bulletIn 0.4s ease forwards;
          animation-delay: var(--delay, 0ms);
        }
        @keyframes bulletIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .content-fade {
          opacity: 1;
          transition: opacity 300ms ease;
        }
        .content-fade.transitioning {
          opacity: 0;
        }
      `}</style>
      
      {/* Background Image - Static, no animation for performance */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${activeCard.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />
      
      {/* Cinematic Vignette - Deep left-to-right for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to right, 
              rgba(0, 0, 0, 0.95) 0%, 
              rgba(0, 0, 0, 0.7) 25%,
              rgba(0, 0, 0, 0.4) 45%,
              rgba(0, 0, 0, 0.1) 60%,
              transparent 100%
            )
          `,
          zIndex: 1
        }}
      />


      {/* Content Area with Fade Transition */}
      <div
        className={`content-fade ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem 3rem',
          paddingRight: '15%'
        }}
      >
        {/* Slide Indicators */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}
        >
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: index === activeIndex ? '2.5rem' : '0.5rem',
                height: index === activeIndex ? '0.6rem' : '0.5rem',
                borderRadius: '999px',
                border: 'none',
                background: index === activeIndex 
                  ? 'linear-gradient(90deg, #60a5fa, #3b82f6)' 
                  : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: index === activeIndex 
                  ? '0 0 12px rgba(96, 165, 250, 0.8), 0 0 20px rgba(59, 130, 246, 0.4)' 
                  : 'none',
                transform: index === activeIndex ? 'scale(1.1)' : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Blue Header Label */}
        <div
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: '#ffffff',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            fontWeight: 700
          }}
        >
          {activeCard.subtitle || 'ATPL — Foundation Program Direct Entry'}
        </div>

        {/* Main Title - Large White Bold */}
        <h3
          style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 1rem',
            lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0,0,0,0.4)'
          }}
        >
          {activeCard.title}
        </h3>

        {/* Strategic Advantages - CSS-driven animation, no React state */}
        <div style={{ marginTop: '0.5rem' }}>
          {(activeCard.advantages || []).map((advantage, index) => (
            <div
              key={index}
              className="pathway-bullet"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                marginBottom: '1rem',
                '--delay': `${index * 100}ms`,
              } as React.CSSProperties}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#60a5fa',
                  marginTop: '0.6rem',
                  flexShrink: 0,
                  boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)'
                }}
              />
              {/* Stacked Title + Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.3
                  }}
                >
                  {advantage.title}
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: '#94a3b8',
                    lineHeight: 1.4
                  }}
                >
                  {advantage.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
        }}
      >
        <Icons.ChevronLeft style={{ width: 20, height: 20 }} />
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
        }}
      >
        <Icons.ChevronRight style={{ width: 20, height: 20 }} />
      </button>

      {/* Progress Bar */}
      <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 20
          }}
        >
          <div
            className="progress-bar-fill"
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
              willChange: 'width'
            }}
          />
      </div>
    </div>
  );
};
