import React, { useEffect, useMemo, useState } from 'react';

const updateSlides = [
  {
    title: 'Emirates ATPL Applications Open',
    summary:
      'New cadet program cohort starting Q2 2024 with enhanced training curriculum tailored for airline-ready pilots.'
  },
  {
    title: 'Cargo Pathway Industry Partnerships',
    summary:
      'Major cargo carriers offering guaranteed interviews for pathway graduates along with operational experience placements.'
  },
  {
    title: 'Flight Instructor Scholarships',
    summary:
      'New funding opportunities for CFI candidates combined with structured industry mentorship.'
  }
];

export const PathwayCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = useMemo(() => updateSlides, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevious = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);

  return (
    <div
      style={{
        position: 'relative',
        padding: '1rem',
        borderRadius: '20px',
        background: '#f8fafc',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      <button
        onClick={handlePrevious}
        aria-label="Previous update"
        style={navButtonStyle}
      >
        ‹
      </button>
      <div
        style={{
          display: 'flex',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {slides.map((slide, index) => (
          <article
            key={slide.title}
            aria-hidden={index !== activeIndex}
            style={{
              flex: '0 0 100%',
              transform: `translateX(${(index - activeIndex) * 100}%)`,
              transition: 'transform 0.6s ease',
              opacity: index === activeIndex ? 1 : 0,
              padding: '1.25rem',
              borderRadius: '16px',
              background: '#ffffff',
              width: '100%'
            }}
          >
            <h4 style={{ fontSize: '1rem', marginBottom: '0.65rem', fontWeight: 700, color: '#0f172a' }}>{slide.title}</h4>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>{slide.summary}</p>
          </article>
        ))}
      </div>
      <button
        onClick={handleNext}
        aria-label="Next update"
        style={navButtonStyle}
      >
        ›
      </button>
    </div>
  );
};

const navButtonStyle: React.CSSProperties = {
  border: 'none',
  background: '#e2e8f0',
  color: '#0f172a',
  fontSize: '1.5rem',
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};
