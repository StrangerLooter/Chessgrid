import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';

interface HeroTypographyProps {
  onEnter: () => void;
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({ onEnter }) => {
  const { settings, players } = useTournament();
  const containerRef = useRef<HTMLDivElement>(null);
  const chessGridRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (chessGridRef.current) gsap.set(chessGridRef.current, { opacity: 1, y: 0, letterSpacing: '0.2em' });
      if (taglineRef.current) gsap.set(taglineRef.current, { opacity: 1, y: 0 });
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1 });
      if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      if (scrollRef.current) gsap.set(scrollRef.current, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(
      chessGridRef.current,
      { opacity: 0, y: 60, letterSpacing: '0.5em' },
      { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 1.4, ease: 'power3.out' }
    )
    .fromTo(
      taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.2'
    )
    .fromTo(
      scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.1'
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <div
      ref={containerRef}
      id="cg-hero-typography"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        padding: '0 1.5rem',
        textAlign: 'center',
      }}
    >
      {/* Vertical decorative line */}
      <div
        style={{
          width: '1px',
          height: '50px',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))',
          marginBottom: '1.25rem',
        }}
      />

      {/* Kage-style Eyebrow with Ember Dot */}
      <div className="cg-eyebrow" style={{ marginBottom: '1.25rem' }}>
        <span className="dot dot-ember" aria-hidden="true" />
        <span>
          {settings.academicSession || '2026'} • {settings.name?.toUpperCase() || 'COLLEGIATE CHESS KNOCKOUT'} • {settings.venue || 'CAMPUS ARENA'}
        </span>
      </div>

      {/* CHESSGRID wordmark with mask line reveal */}
      <div className="cg-mask-line rv-in" style={{ margin: 0 }}>
        <h1
          ref={chessGridRef}
          style={{
            fontFamily: 'var(--font-cinematic)',
            fontSize: 'clamp(3.5rem, 11vw, 8.5rem)',
            fontWeight: 300,
            letterSpacing: '0.22em',
            color: 'var(--cg-ivory)',
            margin: 0,
            lineHeight: 0.95,
            opacity: 0,
            textShadow: '0 0 80px rgba(201,168,76,0.25)',
          }}
        >
          CHESSGRID
        </h1>
      </div>

      {/* Gold divider */}
      <div
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--cg-gold), transparent)',
          margin: '1.25rem auto',
        }}
      />

      {/* Tagline */}
      <p
        ref={taglineRef}
        style={{
          fontFamily: 'var(--font-cinematic)',
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          letterSpacing: '0.12em',
          color: 'var(--cg-ivory-dim)',
          margin: '0 0 0.5rem',
          opacity: 0,
        }}
      >
        Where strategy reveals the unseen.
      </p>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.62rem',
          letterSpacing: '0.3em',
          color: 'rgba(200,192,174,0.6)',
          margin: '0 0 2rem',
          textTransform: 'uppercase',
          opacity: 0,
        }}
      >
        Live 3D Knockout Arena & Arbitrated Tournament Platform
      </p>

      {/* CTA Buttons & ArrowLink */}
      <div
        ref={ctaRef}
        style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'all',
          opacity: 0,
          marginBottom: '2.5rem',
        }}
      >
        <button
          className="cg-btn cg-btn-primary"
          onClick={onEnter}
          id="cg-enter-tournament-btn"
          aria-label="Enter tournament management command center"
          style={{ minWidth: '190px' }}
        >
          ♟ &nbsp; Command Center
        </button>

        {/* Kage-style Circular Arrow Link */}
        <button
          className="cg-arrowlink"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          id="cg-scroll-discover-btn"
          aria-label="Explore the live 3D arena"
        >
          <span>Explore Arena</span>
          <div className="ar" aria-hidden="true">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
      </div>

      {/* Kage-inspired Bottom Chapter Waypoint Chips */}
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          pointerEvents: 'all',
          padding: '0 1rem',
        }}
      >
        <div className="cg-chapters">
          <button
            className="cg-chip"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="num">01</span>
            <div className="tx">
              <b>THE ARENA</b>
              <p>{players.length || settings.totalPlayers} Combatants, 1 Crown</p>
            </div>
          </button>
          <button
            className="cg-chip"
            onClick={() => window.scrollTo({ top: window.innerHeight * 2.5, behavior: 'smooth' })}
          >
            <span className="num">02</span>
            <div className="tx">
              <b>COMBATANTS</b>
              <p>Grandmaster Roster</p>
            </div>
          </button>
          <button
            className="cg-chip"
            onClick={() => window.scrollTo({ top: window.innerHeight * 4, behavior: 'smooth' })}
          >
            <span className="num">03</span>
            <div className="tx">
              <b>PAIRINGS</b>
              <p>Chamber of Fate</p>
            </div>
          </button>
          <button
            className="cg-chip"
            onClick={() => window.scrollTo({ top: window.innerHeight * 5.5, behavior: 'smooth' })}
          >
            <span className="num">04</span>
            <div className="tx">
              <b>BRACKET</b>
              <p>The Path to Glory</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};

export default HeroTypography;
