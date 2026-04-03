import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../icons';

interface StrategyAdvantage {
  text: string;
  highlight?: string;
}

interface PathwayStrategyCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  advantages: StrategyAdvantage[];
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
  autoPlay = true
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
    
    const bulletsCount = cards[index]?.advantages?.length || 0;
    for (let i = 0; i < bulletsCount; i++) {
      setTimeout(() => {
        setVisibleBullets(prev => [...prev, i]);
      }, 50 + i * 80); // Faster animation
    }
    
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, cards]);

  const nextSlide = useCallback(() => {
    const next = (activeIndex + 1) % cards.length;
    goToSlide(next);
  }, [activeIndex, cards.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (activeIndex - 1 + cards.length) % cards.length;
    goToSlide(prev);
  }, [activeIndex, cards.length, goToSlide]);

  // Auto-play - reduced frequency for performance
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(nextSlide, 10000); // Increased to 10 seconds
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, nextSlide]);

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
        height: '360px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15)',
        background: '#ffffff'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Content Container */}
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%'
        }}
      >
          {/* Left Side - Content (65%) */}
        <div
          style={{
            width: '65%',
            minWidth: '65%',
            maxWidth: '65%',
            padding: '1.75rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: '#ffffff',
            zIndex: 10,
            overflow: 'hidden'
          }}
        >
          {/* Slide Indicators */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: index === activeIndex ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: index === activeIndex ? '#3b82f6' : '#e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Subtitle Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.3rem 0.6rem',
              borderRadius: '999px',
              background: '#f1f5f9',
              fontSize: '0.6rem',
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              width: 'fit-content',
              maxWidth: '100%',
              lineHeight: 1.3,
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {activeCard.subtitle}
          </div>

          {/* Main Title */}
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 0.5rem',
              lineHeight: 1.25
            }}
          >
            {activeCard.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: '0.9rem',
              color: '#64748b',
              margin: '0 0 1.25rem',
              lineHeight: 1.5,
              maxWidth: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {activeCard.description}
          </p>

          {/* Strategic Advantages as Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(activeCard.advantages || []).slice(0, 3).map((advantage, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '999px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  opacity: visibleBullets.includes(index) ? 1 : 0,
                  transform: visibleBullets.includes(index) ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 400ms ease ${index * 100}ms, transform 400ms ease ${index * 100}ms`
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    flexShrink: 0
                  }}
                />
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#475569',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%'
                  }}
                >
                  {advantage.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Image (35%) */}
        <div
          style={{
            width: '35%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Image - Static for performance */}
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
          
          {/* Left Fade Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #ffffff 0%, transparent 25%)'
            }}
          />

          {/* Navigation Arrow on Image */}
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.9)',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <Icons.ChevronRight style={{ width: 20, height: 20 }} />
          </button>

        </div>
      </div>

      {/* Previous Arrow - Left Side */}
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
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          color: '#64748b',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#0f172a';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#64748b';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        <Icons.ChevronLeft style={{ width: 20, height: 20 }} />
      </button>
    </div>
  );
};
