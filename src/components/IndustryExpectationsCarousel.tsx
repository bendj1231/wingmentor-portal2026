import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../icons';

interface ExpectationCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  expectations: string[];
}

interface IndustryExpectationsCarouselProps {
  cards: ExpectationCard[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const IndustryExpectationsCarousel: React.FC<IndustryExpectationsCarouselProps> = ({
  cards,
  autoPlay = true,
  autoPlayInterval = 10000
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
    
    const bulletsCount = cards[index]?.expectations?.length || 0;
    for (let i = 0; i < bulletsCount; i++) {
      setTimeout(() => {
        setVisibleBullets(prev => [...prev, i]);
      }, 50 + i * 80);
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

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, nextSlide, autoPlayInterval]);

  useEffect(() => {
    const bulletsCount = cards[activeIndex]?.expectations?.length || 0;
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
        height: '520px',
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
        {/* Left Side - Content (60%) */}
        <div
          style={{
            width: '60%',
            minWidth: '60%',
            maxWidth: '60%',
            padding: '2.5rem 2.5rem 2rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            background: '#ffffff',
            zIndex: 10,
            overflow: 'hidden',
            gap: '0.75rem'
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
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
              width: 'fit-content',
              maxWidth: '100%',
              lineHeight: 1.3,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
            }}
          >
            {activeCard.subtitle}
          </div>

          {/* Main Title */}
          <h3
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 1rem',
              lineHeight: 1.2,
              letterSpacing: '-0.02em'
            }}
          >
            {activeCard.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0 0 1.5rem',
              lineHeight: 1.6,
              maxWidth: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {activeCard.description}
          </p>

          {/* Strategic Expectations as Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {(activeCard.expectations || []).map((expectation, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
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
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    flexShrink: 0
                  }}
                />
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#475569',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%'
                  }}
                >
                  {expectation}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Image (40%) */}
        <div
          style={{
            width: '40%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Image */}
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
