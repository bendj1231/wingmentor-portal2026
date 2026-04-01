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
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVisibleBullets([]);
    setActiveIndex(index);
    
    // Stagger in bullets after slide change
    const bulletsCount = cards[index]?.advantages?.length || 0;
    for (let i = 0; i < bulletsCount; i++) {
      setTimeout(() => {
        setVisibleBullets(prev => [...prev, i]);
      }, 100 + i * 150);
    }
    
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, cards]);

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
    const bulletsCount = cards[activeIndex]?.advantages?.length || 0;
    setVisibleBullets([]);
    for (let i = 0; i < bulletsCount; i++) {
      setTimeout(() => {
        setVisibleBullets(prev => [...prev, i]);
      }, 100 + i * 150);
    }
  }, [activeIndex, cards]);

  const activeCard = cards[activeIndex];

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
      {/* Background Image with Ken Burns */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${activeCard.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.1)',
          animation: 'kenBurns 8s ease-out forwards',
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

      {/* Ken Burns Animation */}
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1.1) translate(0, 0); }
          100% { transform: scale(1.15) translate(-2%, -1%); }
        }
      `}</style>

      {/* Left Side - Content Area (65%) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '65%',
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
                width: index === activeIndex ? '2rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: '999px',
                border: 'none',
                background: index === activeIndex ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Blue Header Label */}
        <div
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: '#60a5fa',
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

        {/* Strategic Advantages - Bullet List with Title/Description stacking */}
        <div style={{ marginTop: '0.5rem' }}>
          {(activeCard.advantages || []).map((advantage, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                marginBottom: '1rem',
                opacity: visibleBullets.includes(index) ? 1 : 0,
                transform: visibleBullets.includes(index) ? 'translateX(0)' : 'translateX(-20px)',
                transition: `opacity 400ms ease ${index * 100}ms, transform 400ms ease ${index * 100}ms`
              }}
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

      {/* Right Side - Flush Smokey Glass Sidebar (35%) */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '35%',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2rem',
          boxSizing: 'border-box'
        }}
      >
        {/* Milestones Section Header */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'rgba(148, 163, 184, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}
          >
            Pathway Milestones
          </p>
          
          {/* Milestone Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Foundation Training', status: 'completed' },
              { label: 'CPL License', status: 'completed' },
              { label: 'ATPL Theory', status: 'in-progress' },
              { label: 'Type Rating', status: 'pending' }
            ].map((milestone, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: `1px solid ${
                    milestone.status === 'completed' ? 'rgba(34, 197, 94, 0.3)' :
                    milestone.status === 'in-progress' ? 'rgba(96, 165, 250, 0.3)' :
                    'rgba(148, 163, 184, 0.2)'
                  }`
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: milestone.status === 'completed' ? '#22c55e' :
                           milestone.status === 'in-progress' ? '#60a5fa' : '#94a3b8',
                    fontWeight: 500
                  }}
                >
                  {milestone.label}
                </span>
                <span style={{ fontSize: '0.7rem' }}>
                  {milestone.status === 'completed' ? '✓' :
                   milestone.status === 'in-progress' ? '◐' : '○'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Discover Pathway Button */}
        <button
          onClick={activeCard.onClick}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            marginTop: '1.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Discover Pathway
          <Icons.ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          right: 'calc(35% + 1rem)',
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
          style={{
            height: '100%',
            width: `${((activeIndex + 1) / cards.length) * 100}%`,
            background: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};
